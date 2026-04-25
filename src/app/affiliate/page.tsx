export const metadata = { title: 'Affiliate Disclosure' };

export default function AffiliatePage() {
  return (
    <div className="max-w-[760px] mx-auto px-6 py-12 pb-16 animate-fade-up">
      <h1 className="text-[24px] font-bold tracking-[-0.02em] mb-1">Affiliate Disclosure</h1>
      <p className="text-[12px] text-[var(--text3)] mb-8">Last updated: April 2025</p>

      <div className="space-y-6 text-[13px] text-[var(--text2)] leading-[1.8]">
        <section>
          <div className="bg-[var(--accent-dim)] border border-[var(--accent-line)] rounded-[10px] p-4 mb-6">
            <p className="text-[13px] text-[var(--text)] font-medium">
              Yield Pilot participates in affiliate programs with financial institutions. When you open an account or sign up for a product through a link on our site, we may earn a commission — at no additional cost to you.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">How Affiliate Relationships Work</h2>
          <p>Some links on Yield Pilot are affiliate links. This means that if you click on a link and subsequently open an account or purchase a product with that financial institution, we may receive a referral fee or commission from that institution. The cost to you is the same whether or not you use our affiliate link.</p>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">Our Commitment to Objectivity</h2>
          <p>Affiliate relationships never influence the results shown by our calculators, the educational content we provide, or our editorial opinions. The math in our calculators is the same regardless of which financial products we have affiliate relationships with. We do not adjust calculator outputs, rankings, or recommendations based on which companies pay us.</p>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">Why We Use Affiliate Links</h2>
          <p>Affiliate commissions are how Yield Pilot funds ongoing development and keeps all 15 calculators permanently free, with no subscription fees, paywalls, or data selling. Without this revenue model, we would not be able to maintain and improve the platform.</p>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">Which Products May Have Affiliate Links</h2>
          <p>Affiliate links may appear in connection with high yield savings accounts, investment accounts, credit cards, and other financial products featured on the Site. These are clearly identified where possible. We only feature products from established, reputable financial institutions.</p>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">Your Choice</h2>
          <p>You are never required to use an affiliate link. You can always navigate directly to any financial institution's website. Using our affiliate link costs you nothing extra and directly supports keeping Yield Pilot free.</p>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">Questions</h2>
          <p>If you have questions about our affiliate relationships or want to know whether a specific link is an affiliate link, contact us at <a href="mailto:contact@yieldpilot.us" className="text-[var(--accent)] hover:underline">contact@yieldpilot.us</a>.</p>
        </section>
      </div>
    </div>
  );
}
