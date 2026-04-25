export const metadata = { title: 'Disclaimer' };

export default function DisclaimerPage() {
  return (
    <div className="max-w-[760px] mx-auto px-6 py-12 pb-16 animate-fade-up">
      <h1 className="text-[24px] font-bold tracking-[-0.02em] mb-1">Disclaimer</h1>
      <p className="text-[12px] text-[var(--text3)] mb-8">Last updated: April 2025</p>

      <div className="space-y-6 text-[13px] text-[var(--text2)] leading-[1.8]">
        <section>
          <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">No Financial Advice</h2>
          <p>Yield Pilot is a financial education platform. All content, calculators, tools, and information provided on this Site are for general informational and educational purposes only. Nothing on this Site constitutes personalized financial, investment, tax, insurance, or legal advice.</p>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">Calculator Results Are Estimates</h2>
          <p>All calculator results are estimates based on the inputs you provide and standard financial formulas. They assume constant rates, idealized conditions, and simplified tax scenarios. Actual results will vary based on market conditions, fees, taxes, inflation, and individual circumstances. Do not rely on calculator outputs as a substitute for professional financial guidance.</p>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">No Guarantee of Accuracy</h2>
          <p>While we make every effort to ensure that our calculators use accurate formulas and up-to-date data, we make no warranties or representations regarding the accuracy, completeness, or reliability of any information on this Site. Interest rates, tax brackets, contribution limits, and other financial figures change frequently and may not reflect current conditions at the time you use our tools.</p>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">Consult a Professional</h2>
          <p>Before making any significant financial decisions — including opening new accounts, investing, taking on debt, changing your tax withholding, or planning for retirement — we strongly recommend consulting with a qualified and licensed financial advisor, tax professional, or attorney who can assess your specific situation.</p>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">Past Performance</h2>
          <p>Any references to historical returns, interest rates, or market performance are for illustrative purposes only and do not guarantee future results. Investment and savings returns are not guaranteed.</p>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">Limitation of Liability</h2>
          <p>Yield Pilot and its operators expressly disclaim all liability for any loss, damage, or adverse outcome resulting from reliance on the information or tools provided on this Site. Use of this Site is entirely at your own risk.</p>
        </section>
      </div>
    </div>
  );
}
