'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError('Invalid email or password.');
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className="max-w-[380px] mx-auto px-6 py-14">
      <div className="bg-white border border-[var(--border)] rounded-[14px] p-8 shadow-[var(--sh-md)]">
        <h1 className="text-[20px] font-bold tracking-[-0.02em] mb-1">Welcome back</h1>
        <p className="text-[12px] text-[var(--text2)] mb-5">Sign in to access your saved calculations.</p>

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
          <div className="space-y-1">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-[var(--text2)]">Password</label>
              <Link href="/forgot-password" className="text-[11px] text-[var(--accent)] hover:underline">Forgot password?</Link>
            </div>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password"
              className="w-full bg-white border border-[var(--border)] rounded-[7px] text-[13px] font-medium px-3 py-2 outline-none focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[var(--accent-dim)]" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-[var(--accent)] text-white text-[13px] font-semibold py-2.5 rounded-[7px] hover:bg-[var(--accent-h)] transition-colors mt-1 disabled:opacity-60">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-[12px] text-[var(--text2)] mt-4">
          No account?{' '}
          <Link href="/sign-up" className="text-[var(--accent)] font-semibold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
