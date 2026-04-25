'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) { setError(updateError.message); setLoading(false); return; }

    setSuccess(true);
    setTimeout(() => router.push('/sign-in'), 2000);
  }

  return (
    <div className="max-w-[380px] mx-auto px-6 py-14">
      <div className="bg-white border border-[var(--border)] rounded-[14px] p-8 shadow-[var(--sh-md)]">
        <h1 className="text-[20px] font-bold tracking-[-0.02em] mb-1">New password</h1>
        <p className="text-[12px] text-[var(--text2)] mb-5">Enter your new password below.</p>

        {success ? (
          <div className="bg-[var(--accent-dim)] border border-[var(--accent-line)] rounded-[7px] p-3 text-[12px] text-[var(--accent-h)] font-medium">
            Password updated. Redirecting to sign in...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && <div className="bg-[var(--red-dim)] border border-[rgba(220,53,69,0.18)] rounded-[7px] p-2.5 text-[11px] text-[var(--red)]">{error}</div>}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[var(--text2)]">New password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters"
                className="w-full bg-white border border-[var(--border)] rounded-[7px] text-[13px] font-medium px-3 py-2 outline-none focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[var(--accent-dim)]" />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[var(--text2)]">Confirm password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirm new password"
                className="w-full bg-white border border-[var(--border)] rounded-[7px] text-[13px] font-medium px-3 py-2 outline-none focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[var(--accent-dim)]" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[var(--accent)] text-white text-[13px] font-semibold py-2.5 rounded-[7px] hover:bg-[var(--accent-h)] transition-colors disabled:opacity-60">
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
