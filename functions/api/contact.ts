export interface Env {
  RESEND_API_KEY: string;
  CONTACT_FROM: string;
  CONTACT_TO: string;
}

const maxBytes = 24_000;
const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const reply = (status: number, body: { ok?: boolean; error?: string }) => Response.json(body, {
  status,
  headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
});

export async function onRequest({ request, env }: { request: Request; env: Env }): Promise<Response> {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
  if (request.headers.get('Origin') !== new URL(request.url).origin) return reply(403, { error: 'This form must be submitted from this website.' });
  if (request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return reply(415, { error: 'Expected a JSON submission.' });
  if (Number(request.headers.get('Content-Length')) > maxBytes) return reply(413, { error: 'Your message is too large.' });

  let input: unknown;
  try {
    // Bound the streamed body as well: Content-Length is optional and untrusted.
    const reader = request.body?.getReader();
    if (!reader) return reply(400, { error: 'Please complete the contact form.' });
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) { await reader.cancel(); return reply(413, { error: 'Your message is too large.' }); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    input = JSON.parse(new TextDecoder().decode(bytes));
  } catch { return reply(400, { error: 'Invalid form submission.' }); }

  if (!input || typeof input !== 'object' || Array.isArray(input)) return reply(400, { error: 'Invalid form submission.' });
  const fields = input as Record<string, unknown>;
  if (typeof fields.website === 'string' && fields.website.trim()) return reply(200, { ok: true });
  if (['name', 'email', 'message'].some(key => typeof fields[key] !== 'string')) return reply(400, { error: 'Please enter your name, email, and message.' });
  const name = (fields.name as string).trim();
  const email = (fields.email as string).trim();
  const message = (fields.message as string).trim();
  if (name.length < 2 || name.length > 100 || /[\r\n\x00-\x1f]/.test(name) || email.length > 254 || !emailPattern.test(email) || message.length < 10 || message.length > 5000) {
    return reply(400, { error: 'Use a valid email, a name of 2–100 characters, and a message of 10–5000 characters.' });
  }
  const idempotencyKey = request.headers.get('Idempotency-Key');
  if (!idempotencyKey || !/^[a-f0-9-]{36}$/i.test(idempotencyKey)) return reply(400, { error: 'Invalid submission ID. Please reload and try again.' });
  if (!env.RESEND_API_KEY || !env.CONTACT_FROM || !env.CONTACT_TO) return reply(503, { error: 'Email delivery is unavailable. Please email me directly.' });

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `contact/${idempotencyKey}` },
      body: JSON.stringify({
        from: env.CONTACT_FROM,
        to: [env.CONTACT_TO],
        reply_to: email,
        subject: `Website contact from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return reply(502, { error: 'Email delivery failed. Please retry or email me directly.' });
    return reply(200, { ok: true });
  } catch { return reply(502, { error: 'Email delivery timed out or is unavailable. Please retry or email me directly.' }); }
}
