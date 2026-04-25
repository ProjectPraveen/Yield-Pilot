'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setStatus('success');
        setMessage('Email verified! Redirecting to your dashboard...');
        setTimeout(() => router.push('/dashboard'), 2000);
      } else if (event === 'TOKEN_REFRESHED') {
        setStatus('success');
        setMessage('Email verified! Redirecting...');
        setTimeout(() => router.push('/dashboard'), 2000);
      }
    });

    // Also check if already signed in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setStatus('success');
        setMessage('Email verified! Redirecting to your dashboard...');
        setTimeout(() => router.push('/dashboard'), 2000);
      } else {
        // Check URL for error
        const hash = window.location.hash;
        if (hash.includes('error')) {
          setStatus('error');
          setMessage('This link has expired or is invalid. Please sign up again.');
        } else {
          // Wait for auth state change
          setTimeout(() => {
            if (status === 'loading') {
              setStatus('error');
              setMessage('Something went wrong. Please try signing in directly.');
            }
          }, 5000);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="max-w-[380px] mx-auto px-6 py-14">
      <div className="bg-white border border-[var(--border)] rounded-[14px] p-8 shadow-[var(--sh-md)] text-center">
        {status === 'loading' && (
          <>
            <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h1 className="text-[16px] font-bold mb-2">Verifying your email</h1>
            <p className="text-[12px] text-[var(--text2)]">Please wait a moment...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-10 h-10 bg-[var(--accent-dim)] border border-[var(--accent-line)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--accent)] text-lg font-bold">
              ✓
            </div>
            <h1 className="text-[16px] font-bold mb-2">Email verified!</h1>
            <p className="text-[12px] text-[var(--text2)]">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-10 h-10 bg-[var(--red-dim)] border border-[rgba(220,53,69,0.2)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--red)] text-lg font-bold">
              ✕
            </div>
            <h1 className="text-[16px] font-bold mb-2">Verification failed</h1>
            <p className="text-[12px] text-[var(--text2)] mb-4">{message}</p>
            <div className="flex gap-2 justify-center">
              <Link href="/sign-up" className="text-[12px] font-semibold text-white bg-[var(--accent)] px-4 py-2 rounded-[7px] hover:bg-[var(--accent-h)] transition-colors">
                Sign up again
              </Link>
              <Link href="/sign-in" className="text-[12px] font-semibold text-[var(--text2)] border border-[var(--border2)] px-4 py-2 rounded-[7px] hover:bg-[var(--surface2)] transition-colors">
                Sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
