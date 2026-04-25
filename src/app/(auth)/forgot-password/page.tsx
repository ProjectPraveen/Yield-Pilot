'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <div className="max-w-[380px] mx-auto px-6 py-14">
      <div className="bg-white border border-[var(--border)] rounded-[14px] p-8 shadow-[var(--sh-md)]">
        <h1 className="text-[20px] font-bold tracking-[-0.02em] mb-1">Reset password</h1>
        <p className="text-[12px] text-[var(--text2)] mb-5">Enter your email and we will send a reset link.</p>

        {sent ? (
          <div className="bg-[var(--accent-dim)] border border-[var(--accent-line)] rounded-[7px] p-3 text-[12px] text-[var(--accent-h)] font-medium">
            Reset link sent. Check your inbox and follow the link to set a new password.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="bg-[var(--red-dim)] border border-[rgba(220,53,69,0.18)] rounded-[7px] p-2.5 text-[11px] text-[var(--red)]">
                {error}
              </div>
            )}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[var(--text2)]">Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full bg-white border border-[var(--border)] rounded-[7px] text-[13px] font-medium px-3 py-2 outline-none focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[var(--accent-dim)]" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[var(--accent)] text-white text-[13px] font-semibold py-2.5 rounded-[7px] hover:bg-[var(--accent-h)] transition-colors disabled:opacity-60">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <p className="text-center text-[12px] text-[var(--text2)] mt-4">
          <Link href="/sign-in" className="text-[var(--accent)] font-semibold hover:underline">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
