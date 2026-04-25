import { PageHero } from '@/components/ui';

export const metadata = { title: 'About Us' };

const VALUES = [
  { title: 'Accessible to Everyone', body: 'Financial understanding shouldn\'t be locked behind paywalls. Our core tools are free and built for anyone, regardless of experience.' },
  { title: 'Accuracy Matters', body: 'Our calculators are built on real formulas and reliable data to provide meaningful insights.' },
  { title: 'Practicality Over Perfection', body: 'We focus on tools people will actually use in real life. Useful beats complicated every time.' },
  { title: 'Continuous Improvement', body: 'We constantly refine and expand our tools to stay relevant, useful, and aligned with how people actually manage money.' },
];

export default function AboutPage() {
  return (
    <div className="max-w-[1100px] mx-auto px-6 pb-16 animate-fade-up">
      <div className="py-11 pb-8 text-center">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--accent)] bg-[var(--accent-dim)] border border-[var(--accent-line)] px-2.5 py-1 rounded-full mb-3">
          About Yield Pilot
        </div>
        <h1 className="text-[clamp(22px,3.5vw,34px)] font-extrabold tracking-[-0.03em] mb-3">
          Built for financial <span className="text-[var(--accent)]">clarity</span>
        </h1>
        <p className="text-[14px] text-[var(--text2)] max-w-[480px] mx-auto leading-relaxed">
          Free tools that help people understand what their money is actually doing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="space-y-5">
          <div>
            <h2 className="text-[17px] font-bold tracking-[-0.02em] mb-3">Our mission</h2>
            <p className="text-[13px] text-[var(--text2)] leading-[1.8]">
              Yield Pilot builds free tools that gives everyone the power to understand and control their finances.
            </p>
            <p className="text-[13px] text-[var(--text2)] leading-[1.8] mt-3">
              Financial clarity leads to better decisions. Better decisions compound over time. That's the philosophy behind every tool we build.
            </p>
          </div>
          <div>
            <h2 className="text-[17px] font-bold tracking-[-0.02em] mb-3">How the tools stay free</h2>
            <p className="text-[13px] text-[var(--text2)] leading-[1.8]">
              Yield Pilot is supported by affiliate partnerships with financial institutions. When a user opens an account through a link on our site, we may earn a referral fee at no cost to them. This model funds ongoing development and keeps every calculator free, with no subscription or paywall required.
            </p>
            <p className="text-[13px] text-[var(--text2)] leading-[1.8] mt-3">
              Affiliate relationships never influence how our calculators work or what results they show. The math is the math.
            </p>
          </div>
          <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-[10px] p-4">
            <p className="text-[12px] text-[var(--text2)] leading-relaxed">
              <strong className="text-[var(--text)]">What we are:</strong> A financial education platform. Our tools provide estimates and help you understand how financial concepts apply to your situation. We are not a licensed financial advisor, broker, or bank. All content is for informational purposes only.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-[17px] font-bold tracking-[-0.02em] mb-4">Our values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {VALUES.map(v => (
              <div key={v.title} className="bg-white border border-[var(--border)] rounded-[10px] p-4 shadow-[var(--sh)]">
                <h4 className="text-[12px] font-bold text-[var(--text)] mb-2">{v.title}</h4>
                <p className="text-[11px] text-[var(--text2)] leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
