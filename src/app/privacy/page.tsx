export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <div className="max-w-[760px] mx-auto px-6 py-12 pb-16 animate-fade-up">
      <h1 className="text-[24px] font-bold tracking-[-0.02em] mb-1">Privacy Policy</h1>
      <p className="text-[12px] text-[var(--text3)] mb-8">Last updated: April 2025</p>

      <div className="space-y-6 text-[13px] text-[var(--text2)] leading-[1.8]">
        <section>
          <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">1. Information We Collect</h2>
          <p>When you create an account, we collect your name and email address. When you save calculations, we store the inputs and results you choose to save. We do not collect payment information, social security numbers, or any sensitive financial data.</p>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">2. How We Use Your Information</h2>
          <p>We use your information solely to provide the Yield Pilot service — specifically to authenticate your account and store your saved calculations. We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">3. Data Storage</h2>
          <p>Your account data is stored securely using Supabase, which provides enterprise-grade security and encryption. Data is stored on servers in the United States. We retain your data for as long as your account is active. You may request deletion of your account and data at any time by contacting us.</p>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">4. Cookies</h2>
          <p>We use cookies solely for authentication purposes — to keep you signed in to your account. We do not use advertising cookies or tracking pixels. You can disable cookies in your browser settings, but this will prevent you from staying signed in.</p>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">5. Affiliate Links</h2>
          <p>When you click on affiliate links to financial institutions, those third parties may set their own cookies and collect data according to their own privacy policies. We encourage you to review the privacy policies of any third-party sites you visit.</p>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">6. Analytics</h2>
          <p>We may use anonymous, aggregated analytics to understand how the Site is used and to improve our tools. This data cannot be used to identify individual users.</p>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">7. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data at any time. To exercise these rights, contact us at <a href="mailto:contact@yieldpilot.us" className="text-[var(--accent)] hover:underline">contact@yieldpilot.us</a>.</p>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">8. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify registered users of significant changes by email. Continued use of the Site after changes are posted constitutes acceptance of the updated policy.</p>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-[var(--text)] mb-2">9. Contact</h2>
          <p>For privacy-related questions, contact us at <a href="mailto:contact@yieldpilot.us" className="text-[var(--accent)] hover:underline">contact@yieldpilot.us</a>.</p>
        </section>
      </div>
    </div>
  );
}
