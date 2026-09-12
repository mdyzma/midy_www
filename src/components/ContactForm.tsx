import { useRef, useState, type SubmitEvent, type ReactNode } from 'react';

export default function ContactForm({ sendIcon }: { sendIcon?: ReactNode }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const pending = useRef(false);
  const attempt = useRef<{ body: string; key: string } | null>(null);

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const body = JSON.stringify(Object.fromEntries(['name', 'email', 'message', 'website'].map(key => [key, String(data.get(key) ?? '').trim()])));
    if (attempt.current?.body !== body) attempt.current = { body, key: crypto.randomUUID() };
    pending.current = true;
    setStatus('sending');
    setMessage('Sending your message…');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': attempt.current!.key },
        body,
        signal: AbortSignal.timeout(15000),
      });
      const result: { ok?: boolean; error?: string } = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'Your message could not be sent. Please try again or email me directly.');
      setStatus('success');
      setMessage('Thanks! Your message has been sent.');
      form.reset();
      attempt.current = null;
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error && error.name !== 'TimeoutError' && error.name !== 'SyntaxError' && error.name !== 'TypeError' ? error.message : 'Unable to send right now. Please try again or email me directly.');
    } finally {
      pending.current = false;
    }
  }

  return <form onSubmit={submit} className="contact-form glass-panel" aria-label="Contact Michal" aria-busy={status === 'sending'}>
    <div className="contact-fields">
      <label htmlFor="contact-name">Name<input id="contact-name" name="name" autoComplete="name" required minLength={2} maxLength={100} /></label>
      <label htmlFor="contact-email">Email<input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} /></label>
    </div>
    <label htmlFor="contact-message">Message<textarea id="contact-message" name="message" rows={5} required minLength={10} maxLength={5000} placeholder="Tell me what you would like to build." /></label>
    <div className="contact-honeypot" aria-hidden="true"><label htmlFor="contact-website">Leave this field empty<input id="contact-website" name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <button type="submit" className="contact-submit" disabled={status === 'sending'}>{sendIcon}{status === 'sending' ? 'Sending…' : 'Send message'}</button>
    <p className={`contact-status ${status === 'error' ? 'text-red-300' : 'text-slate-300'}`} role="status" aria-live="polite">{message}</p>
  </form>;
}
