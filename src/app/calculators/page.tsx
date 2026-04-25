import Link from 'next/link';
import { PageHero } from '@/components/ui';
import { CALCULATOR_LIST, CALC_GROUP_LABELS } from '@/types';

const groupOrder = ['savings-debt', 'planning-tax', 'retirement-growth'] as const;

export const metadata = { title: 'All Calculators' };

export default function CalculatorsPage() {
  return (
    <div className="max-w-[1100px] mx-auto px-6 pb-16 animate-fade-up">
      <PageHero
        eyebrow="All Tools"
        title={<>15 free <span className="text-[var(--accent)]">calculators</span></>}
        subtitle="Every tool is free. Create an account to save results and track progress over time."
      />
      <div className="space-y-8">
        {groupOrder.map(group => (
          <div key={group}>
            <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-3 pb-2 border-b border-[var(--border)]">
              {CALC_GROUP_LABELS[group]}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {CALCULATOR_LIST.filter(c => c.group === group).map(c => (
                <Link
                  key={c.type}
                  href={c.href}
                  className="bg-white border-[1.5px] border-[var(--border)] rounded-[10px] p-4 flex items-start gap-3 hover:border-[var(--accent)] hover:shadow-[var(--sh-md)] transition-all group shadow-[var(--sh)]"
                >
                  <div className="w-8 h-8 rounded-[8px] bg-[var(--surface2)] border border-[var(--border)] flex items-center justify-center text-[12px] font-bold font-mono text-[var(--accent)] flex-shrink-0">
                    {c.abbr}
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors mb-0.5">{c.name}</div>
                    <div className="text-[11px] text-[var(--text2)] leading-[1.55]">{c.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
