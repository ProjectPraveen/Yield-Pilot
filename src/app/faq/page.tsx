'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const FAQS = [
  {
    q: 'What is Yield Pilot?',
    a: 'Yield Pilot is a free financial calculator platform. We offer 15 tools covering savings, debt payoff, loan analysis, tax estimation, retirement planning, and more presented in plain language without any obligation to purchase a product or speak with a salesperson.',
  },
  {
    q: 'Are these tools free?',
    a: 'Yes, completely. All 15 calculators are free with no account required. Creating an account is optional and only needed if you want to save and revisit your calculations.',
  },
  {
    q: 'Is this financial advice?',
    a: 'No. Yield Pilot provides financial education tools and general information only. Nothing on this site constitutes personalized financial, investment, tax, or legal advice. Always consult a qualified professional before making significant financial decisions.',
  },
  {
    q: 'How accurate are the calculators?',
    a: 'Our calculators use standard financial formulas and produce accurate, directional estimates. They assume constant rates and simplified conditions. Actual results will always vary due to market changes, taxes, fees, and life circumstances. Use them as a planning tool, not a precise forecast.',
  },
  {
    q: 'Can I save my calculations?',
    a: 'Yes. Create a free account and every calculator includes a "Save calculation" button. Saved results appear on your dashboard with a full summary, date stamp, and a direct link back to the relevant calculator. You can rename or delete entries at any time.',
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="max-w-[1100px] mx-auto px-6 pb-16 animate-fade-up">
      <div className="py-10 pb-7 text-center">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--accent)] bg-[var(--accent-dim)] border border-[var(--accent-line)] px-2.5 py-1 rounded-full mb-3">FAQ</div>
        <h1 className="text-[clamp(20px,3vw,28px)] font-bold tracking-[-0.025em] mb-2">
          Frequently asked <span className="text-[var(--accent)]">questions</span>
        </h1>
        <p className="text-[13px] text-[var(--text2)]">Quick answers to the most common questions about Yield Pilot.</p>
      </div>

      <div className="max-w-[720px] mx-auto space-y-2 mb-8">
        {FAQS.map((faq, i) => (
          <div key={i} className="bg-white border border-[var(--border)] rounded-[10px] overflow-hidden shadow-[var(--sh)]">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3.5 text-[13px] font-semibold text-[var(--text)] text-left hover:bg-[var(--surface2)] transition-colors gap-3"
            >
              {faq.q}
              <ChevronDown size={14} className={cn('text-[var(--text3)] flex-shrink-0 transition-transform duration-150', open === i && 'rotate-180')} />
            </button>
            {open === i && (
              <div className="px-4 pb-4 text-[13px] text-[var(--text2)] leading-[1.75]">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-[13px] text-[var(--text2)]">
          Have a question not listed here?{' '}
          <Link href="/contact" className="text-[var(--accent)] font-semibold hover:underline">Contact us →</Link>
        </p>
      </div>
    </div>
  );
}
