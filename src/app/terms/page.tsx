export const metadata = { title: 'Terms of Use' };

export default function TermsPage() {
  return (
    <div className="max-w-[760px] mx-auto px-6 py-12 pb-16 animate-fade-up">
      <h1 className="text-[24px] font-bold tracking-[-0.02em] mb-1">Terms of Use</h1>
      <p className="text-[12px] text-[var(--text3)] mb-8">Last updated: April 2025</p>

      <div className="prose space-y-6 text-[13px] text-[var(--text2)] leading-[1.8]">
        <section>
          <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">1. Acceptance of Terms</h2>
          <p>By accessing or using Yield Pilot ("the Site"), you agree to be bound by these Terms of Use. If you do not agree, please do not use the Site.</p>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">2. Use of the Site</h2>
          <p>Yield Pilot provides free financial calculators and educational tools for informational purposes only. You may use the Site for personal, non-commercial purposes. You may not reproduce, distribute, or create derivative works from any content on the Site without express written permission.</p>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">3. Not Financial Advice</h2>
          <p>Nothing on this Site constitutes financial, investment, tax, or legal advice. All content is provided for general informational and educational purposes only. Always consult a qualified professional before making any financial decisions. Results from our calculators are estimates only and may not reflect your actual financial outcomes.</p>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">4. User Accounts</h2>
          <p>If you create an account on Yield Pilot, you are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. You agree to notify us immediately of any unauthorized use of your account.</p>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">5. Accuracy of Information</h2>
          <p>We strive to keep calculator formulas and financial data accurate and up to date. However, we make no warranties or representations regarding the accuracy, completeness, or timeliness of any information on the Site. Interest rates, tax brackets, and other financial figures change frequently and may not reflect current conditions.</p>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">6. Limitation of Liability</h2>
          <p>To the fullest extent permitted by law, Yield Pilot and its operators shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of the Site or reliance on any information provided herein.</p>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">7. Third-Party Links</h2>
          <p>The Site may contain links to third-party websites, including financial institutions. These links are provided for convenience only. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites.</p>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">8. Changes to Terms</h2>
          <p>We reserve the right to update these Terms at any time. Continued use of the Site after changes are posted constitutes acceptance of the updated Terms.</p>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">9. Contact</h2>
          <p>If you have questions about these Terms, please contact us at <a href="mailto:contact@yieldpilot.us" className="text-[var(--accent)] hover:underline">contact@yieldpilot.us</a>.</p>
        </section>
      </div>
    </div>
  );
}
