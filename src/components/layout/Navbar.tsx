'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { YPLogo } from '@/components/ui/YPLogo';
import { CALCULATOR_LIST, CALC_GROUP_LABELS } from '@/types';
import { cn } from '@/lib/utils';
import type { User } from '@supabase/supabase-js';

const groupOrder = ['savings-debt', 'planning-tax', 'retirement-growth'] as const;

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCalcsOpen, setMobileCalcsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[var(--border)] shadow-[0_1px_0_var(--border)]">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="flex items-center h-[58px] gap-1">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 font-bold text-[15px] tracking-tight text-[var(--text)] mr-6 flex-shrink-0 hover:opacity-80 transition-opacity">
            <YPLogo size={30} />
            Yield Pilot
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5 flex-1">
            <Link href="/" className={cn('nav-link', pathname === '/' && 'active')}>Home</Link>

            {/* Calculators dropdown */}
            <div className="relative group">
              <Link
                href="/calculators"
                className={cn('nav-link flex items-center gap-1', pathname.startsWith('/calculators') && 'active')}
              >
                Calculators
                <ChevronDown size={12} className="text-[var(--text3)] group-hover:rotate-180 transition-transform duration-150" />
              </Link>
              {/* Invisible bridge */}
              <div className="absolute left-0 right-0 h-2 bottom-0 translate-y-full" />
              <div className="absolute top-[calc(100%+6px)] left-0 bg-white border border-[var(--border)] rounded-[10px] shadow-[var(--sh-md)] p-2 z-50 w-[220px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                {groupOrder.map(group => {
                  const calcs = CALCULATOR_LIST.filter(c => c.group === group);
                  return (
                    <div key={group}>
                      <div className="text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--text3)] px-2.5 py-1.5 mt-1 first:mt-0">
                        {CALC_GROUP_LABELS[group]}
                      </div>
                      {calcs.map(c => (
                        <Link
                          key={c.type}
                          href={c.href}
                          className="block text-[12px] font-medium text-[var(--text2)] px-2.5 py-1.5 rounded-md hover:bg-[var(--accent-dim)] hover:text-[var(--accent)] transition-colors"
                        >
                          {c.name}
                        </Link>
                      ))}
                      {group !== 'retirement-growth' && <div className="h-px bg-[var(--border)] my-1.5 mx-1" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="w-px h-4 bg-[var(--border)] mx-1.5" />
            <Link href="/about" className={cn('nav-link', pathname === '/about' && 'active')}>About</Link>
            <Link href="/faq" className={cn('nav-link', pathname === '/faq' && 'active')}>FAQ</Link>
            <Link href="/contact" className={cn('nav-link', pathname === '/contact' && 'active')}>Contact</Link>
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-1.5 ml-auto">
            {user ? (
              <>
                <Link href="/dashboard" className="btn-ghost text-[13px]">Dashboard</Link>
                <Link href="/profile" className="btn-ghost text-[13px]">Profile</Link>
                <button onClick={signOut} className="btn-ghost text-[13px]">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/sign-in" className="btn-ghost text-[13px]">Sign In</Link>
                <Link href="/sign-up" className="btn-accent text-[13px]">Get Started</Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden ml-auto p-1.5 text-[var(--text2)] hover:text-[var(--text)] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-white px-5 py-3 space-y-0.5 max-h-[80vh] overflow-y-auto">
          <MobileLink href="/" onClick={() => setMobileOpen(false)}>Home</MobileLink>
          <button
            className="w-full text-left nav-link flex items-center justify-between"
            onClick={() => setMobileCalcsOpen(!mobileCalcsOpen)}
          >
            All Calculators
            <ChevronDown size={12} className={cn('transition-transform', mobileCalcsOpen && 'rotate-180')} />
          </button>
          {mobileCalcsOpen && (
            <div className="pl-3 space-y-0.5 border-l-2 border-[var(--accent-line)] ml-2">
              {groupOrder.map(group => (
                <div key={group}>
                  <div className="text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--text3)] px-2 py-1.5">
                    {CALC_GROUP_LABELS[group]}
                  </div>
                  {CALCULATOR_LIST.filter(c => c.group === group).map(c => (
                    <MobileLink key={c.type} href={c.href} onClick={() => setMobileOpen(false)}>
                      {c.name}
                    </MobileLink>
                  ))}
                </div>
              ))}
            </div>
          )}
          <div className="h-px bg-[var(--border)] my-2" />
          <MobileLink href="/about" onClick={() => setMobileOpen(false)}>About</MobileLink>
          <MobileLink href="/faq" onClick={() => setMobileOpen(false)}>FAQ</MobileLink>
          <MobileLink href="/contact" onClick={() => setMobileOpen(false)}>Contact</MobileLink>
          <div className="h-px bg-[var(--border)] my-2" />
          {user ? (
            <>
              <MobileLink href="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</MobileLink>
              <MobileLink href="/profile" onClick={() => setMobileOpen(false)}>Profile</MobileLink>
              <button className="nav-link w-full text-left" onClick={() => { signOut(); setMobileOpen(false); }}>Sign Out</button>
            </>
          ) : (
            <>
              <MobileLink href="/sign-in" onClick={() => setMobileOpen(false)}>Sign In</MobileLink>
              <MobileLink href="/sign-up" onClick={() => setMobileOpen(false)}>Get Started</MobileLink>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        .nav-link {
          font-size: 13px;
          color: var(--text2);
          padding: 5px 10px;
          border-radius: 6px;
          transition: all 0.13s;
          font-weight: 500;
          white-space: nowrap;
          display: inline-block;
        }
        .nav-link:hover { color: var(--text); background: var(--surface2); }
        .nav-link.active { color: var(--accent); background: var(--accent-dim); }
        .btn-ghost {
          color: var(--text2);
          border: 1px solid var(--border2);
          background: none;
          padding: 5px 13px;
          border-radius: 7px;
          cursor: pointer;
          transition: all 0.13s;
          font-weight: 500;
          font-family: inherit;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }
        .btn-ghost:hover { color: var(--text); background: var(--surface2); }
        .btn-accent {
          color: #fff;
          background: var(--accent);
          border: none;
          padding: 6px 14px;
          border-radius: 7px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.13s;
          box-shadow: 0 1px 3px rgba(21,163,98,0.3);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }
        .btn-accent:hover { background: var(--accent-h); }
      `}</style>
    </nav>
  );
}

function MobileLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block text-[13px] font-medium text-[var(--text2)] px-2.5 py-2 rounded-md hover:bg-[var(--surface2)] hover:text-[var(--text)] transition-colors"
    >
      {children}
    </Link>
  );
}
