'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      setLoading(false);
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/verify-email`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <div className="max-w-[380px] mx-auto px-6 py-14">
      <div className="bg-white border border-[var(--border)] rounded-[14px] p-8 shadow-[var(--sh-md)]">
        <h1 className="text-[20px] font-bold tracking-[-0.02em] mb-1">Create account</h1>
        <p className="text-[12px] text-[var(--text2)] mb-5">Save calculations and track your progress over time.</p>

        {success ? (
          <div className="bg-[var(--accent-dim)] border border-[var(--accent-line)] rounded-[7px] p-3 text-[12px] text-[var(--accent-h)] font-medium">
            Account created! Check your email to verify your address, then{' '}
            <Link href="/sign-in" className="underline font-semibold">sign in</Link>.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="bg-[var(--red-dim)] border border-[rgba(220,53,69,0.18)] rounded-[7px] p-2.5 text-[11px] text-[var(--red)]">
                {error}
              </div>
            )}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[var(--text2)]">Full name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                className="w-full bg-white border border-[var(--border)] rounded-[7px] text-[13px] font-medium px-3 py-2 outline-none focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[var(--accent-dim)]" />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[var(--text2)]">Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full bg-white border border-[var(--border)] rounded-[7px] text-[13px] font-medium px-3 py-2 outline-none focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[var(--accent-dim)]" />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[var(--text2)]">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters"
                className="w-full bg-white border border-[var(--border)] rounded-[7px] text-[13px] font-medium px-3 py-2 outline-none focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[var(--accent-dim)]" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[var(--accent)] text-white text-[13px] font-semibold py-2.5 rounded-[7px] hover:bg-[var(--accent-h)] transition-colors mt-1 disabled:opacity-60">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}

        {!success && (
          <p className="text-center text-[12px] text-[var(--text2)] mt-4">
            Have an account?{' '}
            <Link href="/sign-in" className="text-[var(--accent)] font-semibold hover:underline">Sign in</Link>
          </p>
        )}
      </div>
    </div>
  );
}
