import Link from 'next/link';
import { YPLogo } from '@/components/ui/YPLogo';
import { CALCULATOR_LIST } from '@/types';

const toolLinks = CALCULATOR_LIST.slice(0, 6);
const moreLinks = CALCULATOR_LIST.slice(6, 12);

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-white mt-16 pt-10 pb-6">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-[14px] tracking-tight text-[var(--text)] mb-2 hover:opacity-80 transition-opacity">
              <YPLogo size={26} />
              Yield Pilot
            </Link>
            <p className="text-[11px] text-[var(--text3)] leading-relaxed max-w-[180px]">
              Free financial calculators built for clarity and growth.
            </p>
          </div>

          <div>
            <h5 className="text-[10px] font-bold tracking-[0.06em] uppercase text-[var(--text2)] mb-3">Tools</h5>
            <ul className="space-y-1.5">
              {toolLinks.map(c => (
                <li key={c.type}>
                  <Link href={c.href} className="text-[12px] text-[var(--text3)] hover:text-[var(--text2)] transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-[10px] font-bold tracking-[0.06em] uppercase text-[var(--text2)] mb-3">More Tools</h5>
            <ul className="space-y-1.5">
              {moreLinks.map(c => (
                <li key={c.type}>
                  <Link href={c.href} className="text-[12px] text-[var(--text3)] hover:text-[var(--text2)] transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-[10px] font-bold tracking-[0.06em] uppercase text-[var(--text2)] mb-3">Company</h5>
            <ul className="space-y-1.5">
              {[['About', '/about'], ['FAQ', '/faq'], ['Contact', '/contact'], ['Dashboard', '/dashboard']].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-[12px] text-[var(--text3)] hover:text-[var(--text2)] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-[10px] font-bold tracking-[0.06em] uppercase text-[var(--text2)] mb-3">Legal</h5>
            <ul className="space-y-1.5">
              {[['Terms of Use', '/terms'], ['Privacy Policy', '/privacy'], ['Disclaimer', '/disclaimer'], ['Affiliate Disclosure', '/affiliate']].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-[12px] text-[var(--text3)] hover:text-[var(--text2)] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[10px] text-[var(--text3)]">
            © 2025 Yield Pilot. For informational purposes only. Not financial advice.
          </p>
          <p className="text-[10px] text-[var(--text3)]">
            National avg savings rate: 0.47% APY — FDIC data, 2024
          </p>
        </div>
      </div>
    </footer>
  );
}
