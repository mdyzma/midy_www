import { test, expect } from '@playwright/test';
import { onRequest, type Env } from '../functions/api/contact';

const env: Env = { RESEND_API_KEY: 'test-key', CONTACT_FROM: 'Website <hello@example.com>', CONTACT_TO: 'owner@example.com' };
const valid = { name: 'Ada Lovelace', email: 'ada@example.com', message: 'Hello, I would like to discuss a data pipeline.', website: '' };
const key = '12345678-1234-4234-8234-123456789abc';
const request = (body: unknown = valid, headers: Record<string, string> = {}) => new Request('https://example.com/api/contact', {
  method: 'POST', headers: { Origin: 'https://example.com', 'Content-Type': 'application/json', 'Idempotency-Key': key, ...headers }, body: JSON.stringify(body),
});
const originalFetch = globalThis.fetch;
test.afterEach(() => { globalThis.fetch = originalFetch; });

test('sends a text email to the configured recipient with reply-to and retry key', async () => {
  let sent: Record<string, unknown> = {};
  globalThis.fetch = async (url, init) => {
    expect(url).toBe('https://api.resend.com/emails');
    expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer test-key');
    expect(new Headers(init?.headers).get('Idempotency-Key')).toBe(`contact/${key}`);
    sent = JSON.parse(String(init?.body));
    return Response.json({ id: 'mock-email-id' });
  };
  const result = await onRequest({ request: request(), env });
  expect(result.status).toBe(200);
  expect(sent).toMatchObject({ to: ['owner@example.com'], from: env.CONTACT_FROM, reply_to: valid.email });
  expect(sent.text).toContain(valid.message);
  expect(sent).not.toHaveProperty('html');
});

test('rejects invalid, cross-origin, oversized and malformed submissions without email', async () => {
  globalThis.fetch = async () => { throw new Error('Should not send email'); };
  expect((await onRequest({ request: request({ ...valid, email: 'bad-address' }), env })).status).toBe(400);
  expect((await onRequest({ request: request({ ...valid, name: '  ' }), env })).status).toBe(400);
  expect((await onRequest({ request: request({ ...valid, message: 'short' }), env })).status).toBe(400);
  expect((await onRequest({ request: request(valid, { Origin: 'https://evil.example' }), env })).status).toBe(403);
  expect((await onRequest({ request: request(valid, { 'Content-Type': 'text/plain' }), env })).status).toBe(415);
  expect((await onRequest({ request: request({ ...valid, message: 'x'.repeat(25000) }), env })).status).toBe(413);
  expect((await onRequest({ request: request(valid, { 'Idempotency-Key': 'invalid' }), env })).status).toBe(400);
  const malformed = new Request(request(), { body: '{broken' });
  expect((await onRequest({ request: malformed, env })).status).toBe(400);
  expect((await onRequest({ request: new Request('https://example.com/api/contact'), env })).status).toBe(405);
});

test('honeypot avoids delivery and missing credentials returns a useful error', async () => {
  let calls = 0;
  globalThis.fetch = async () => { calls++; return Response.json({}); };
  expect((await onRequest({ request: request({ ...valid, website: 'spam' }), env })).status).toBe(200);
  expect((await onRequest({ request: request(), env: { ...env, RESEND_API_KEY: '' } })).status).toBe(503);
  expect(calls).toBe(0);
});

test('provider failures and timeouts never report success or leak provider details', async () => {
  globalThis.fetch = async () => new Response('sensitive provider detail', { status: 429 });
  const failed = await onRequest({ request: request(), env });
  expect(failed.status).toBe(502);
  expect(await failed.text()).not.toContain('sensitive provider detail');
  globalThis.fetch = async () => { throw new DOMException('Timeout', 'TimeoutError'); };
  expect((await onRequest({ request: request(), env })).status).toBe(502);
});
