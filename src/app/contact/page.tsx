'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production: POST to an API route that uses Resend/SendGrid
    console.log('[Yield Pilot Contact]', { name, email, subject, message });
    setSent(true);
  }

  const inputClass = 'w-full bg-white border border-[var(--border)] rounded-[7px] text-[13px] font-medium px-3 py-2 outline-none focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[var(--accent-dim)] transition-all';

  return (
    <div className="max-w-[1100px] mx-auto px-6 pb-16 animate-fade-up">
      <div className="py-10 pb-7 text-center">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--accent)] bg-[var(--accent-dim)] border border-[var(--accent-line)] px-2.5 py-1 rounded-full mb-3">Get in Touch</div>
        <h1 className="text-[clamp(20px,3vw,28px)] font-bold tracking-[-0.025em] mb-2">
          We read every <span className="text-[var(--accent)]">message</span>
        </h1>
        <p className="text-[13px] text-[var(--text2)]">Questions, bug reports, or feature ideas are all welcome.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-7 max-w-[820px] mx-auto">
        {/* Info */}
        <div>
          <h3 className="text-[15px] font-bold mb-3">How can we help?</h3>
          <p className="text-[13px] text-[var(--text2)] leading-[1.75] mb-4">
            Whether you've noticed a calculator issue, have an idea for a new tool, or just want to give feedback. Your input directly shapes what we build next.
          </p>
          {[
            { icon: '✉', text: 'contact@yieldpilot.com' },
            { icon: '⏱', text: 'Response: 1–2 business days' },
            { icon: '✦', text: 'Feature requests welcomed' },
          ].map(d => (
            <div key={d.text} className="flex items-center gap-3 bg-white border border-[var(--border)] rounded-[7px] px-3 py-2.5 mb-2 text-[12px] text-[var(--text2)]">
              <span className="text-[13px] flex-shrink-0">{d.icon}</span>
              {d.text}
            </div>
          ))}
          <p className="text-[11px] text-[var(--text3)] mt-3 leading-relaxed">
            For calculator issues, include the calculator name and a description of the unexpected result.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white border border-[var(--border)] rounded-[14px] p-6 shadow-[var(--sh-md)]">
          <h3 className="text-[14px] font-bold mb-1">Send a message</h3>
          <p className="text-[12px] text-[var(--text2)] mb-4">All fields required except subject.</p>

          {sent ? (
            <div className="bg-[var(--accent-dim)] border border-[var(--accent-line)] rounded-[7px] p-3 text-[12px] text-[var(--accent-h)] font-medium">
              Message received — we'll be in touch within 1–2 business days.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-[var(--text2)]">Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-[var(--text2)]">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className={inputClass} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[var(--text2)]">Subject (optional)</label>
                <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="What's this about?" className={inputClass} />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[var(--text2)]">Message</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Your message..." rows={4} required className={inputClass + ' resize-none'} />
              </div>
              <button type="submit" className="bg-[var(--accent)] text-white text-[13px] font-semibold px-5 py-2.5 rounded-[7px] hover:bg-[var(--accent-h)] transition-colors">
                Send message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
