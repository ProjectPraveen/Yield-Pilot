import Link from 'next/link';
import { CALCULATOR_LIST, CALC_GROUP_LABELS } from '@/types';

const groupOrder = ['savings-debt', 'planning-tax', 'retirement-growth'] as const;

const STATS = [
  { val: '15', label: 'Free Calculators' },
  { val: '0.47%', label: 'National Avg APY' },
  { val: '5%+', label: 'Top HYSA Rates' },
  { val: '$0', label: 'Cost to You' },
];

const FEATURED_ACCOUNTS = [
  { name: 'SoFi Bank', rate: '4.60% APY', desc: 'No minimum balance. No monthly fees. FDIC insured.' },
  { name: 'Ally Bank', rate: '4.35% APY', desc: 'Award-winning online bank with zero monthly fees.' },
  { name: 'Marcus', rate: '4.40% APY', desc: 'No fees. No minimums. Backed by Goldman Sachs.' },
  { name: 'Discover Bank', rate: '4.25% APY', desc: 'High yield with no minimum balance required.' },
];

export default function HomePage() {
  return (
    <div className="animate-fade-up">
      {/* Hero */}
      <div className="max-w-[1100px] mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="text-[clamp(28px,5vw,48px)] font-extrabold leading-[1.06] tracking-[-0.03em] mb-3">
          Your money,<br /><span className="text-[var(--accent)]">working smarter</span>
        </h1>
        <p className="text-[15px] text-[var(--text2)] max-w-[360px] mx-auto mb-6 leading-relaxed">
          15 free financial calculators. Save more, pay off debt faster, and build a clearer picture of your financial life.
        </p>
        <div className="flex items-center justify-center gap-2.5 flex-wrap">
          <Link href="/hysa" className="inline-flex items-center bg-[var(--accent)] text-white text-[13px] font-semibold px-5 py-2.5 rounded-[7px] hover:bg-[var(--accent-h)] transition-colors shadow-[0_2px_8px_rgba(21,163,98,0.25)]">
            Try HYSA Calculator
          </Link>
          <Link href="/sign-up" className="inline-flex items-center text-[13px] font-medium text-[var(--text2)] border border-[var(--border2)] px-5 py-2.5 rounded-[7px] hover:text-[var(--text)] hover:border-[var(--text2)] transition-colors">
            Create Free Account
          </Link>
        </div>
      </div>

      {/* Stats bar */}
      <div className="max-w-[1100px] mx-auto px-6 mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border)] border border-[var(--border)] rounded-[14px] overflow-hidden shadow-[var(--sh)]">
          {STATS.map(s => (
            <div key={s.label} className="bg-white px-4 py-4 text-center">
              <div className="text-[18px] font-bold text-[var(--accent)] font-mono">{s.val}</div>
              <div className="text-[10px] text-[var(--text3)] font-medium mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Calculators by group */}
      <div className="max-w-[1100px] mx-auto px-6 mb-12">
        <h2 className="text-[17px] font-bold tracking-[-0.02em] mb-1">All calculators</h2>
        <p className="text-[13px] text-[var(--text2)] mb-5">No account needed to get started. Sign up to save your results.</p>
        <div className="space-y-8">
          {groupOrder.map(group => (
            <div key={group}>
              <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-3 pb-2 border-b border-[var(--border)]">
                {CALC_GROUP_LABELS[group]}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                {CALCULATOR_LIST.filter(c => c.group === group).map(c => (
                  <Link
                    key={c.type}
                    href={c.href}
                    className="bg-white border border-[var(--border)] rounded-[14px] p-4 hover:border-[var(--accent)] hover:shadow-[var(--sh-md)] transition-all group"
                  >
                    <div className="w-7 h-7 rounded-[7px] bg-[var(--accent-dim)] border border-[var(--accent-line)] flex items-center justify-center text-[11px] font-bold font-mono text-[var(--accent)] mb-2 flex-shrink-0">
                      {c.abbr}
                    </div>
                    <div className="text-[12px] font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors mb-1">{c.name}</div>
                    <div className="text-[11px] text-[var(--text2)] leading-[1.55]">{c.description}</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Affiliate */}
      <div className="max-w-[1100px] mx-auto px-6 mb-12">
        <div className="bg-white border border-[var(--border)] rounded-[14px] p-5 shadow-[var(--sh)]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold tracking-[0.06em] uppercase text-[#0d9488] bg-[rgba(13,148,136,0.07)] border border-[rgba(13,148,136,0.18)] px-2 py-0.5 rounded-full">Sponsored</span>
            <h3 className="text-[13px] font-bold text-[var(--text)]">Top high yield savings accounts</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {FEATURED_ACCOUNTS.map(a => (
              <div key={a.name} className="bg-[var(--surface2)] border border-[var(--border)] rounded-[7px] p-3">
                <div className="text-[12px] font-bold text-[var(--text)] mb-1">{a.name}</div>
                <div className="font-mono text-[15px] font-medium text-[var(--accent)] mb-1">{a.rate}</div>
                <div className="text-[11px] text-[var(--text2)] leading-relaxed mb-2">{a.desc}</div>
                <a href="#" className="block text-center text-[11px] font-medium text-[var(--text2)] border border-[var(--border2)] rounded-[7px] py-1.5 hover:bg-[var(--accent-dim)] hover:text-[var(--accent)] hover:border-[var(--accent-line)] transition-colors">Open account</a>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-[var(--text3)] mt-3 leading-relaxed">
            Affiliate disclosure: Yield Pilot may earn a commission if you open an account through these links, at no cost to you. Rates are estimates subject to change.
          </p>
        </div>
      </div>
    </div>
  );
}
