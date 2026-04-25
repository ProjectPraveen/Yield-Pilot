import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: { default: 'Yield Pilot — Personal Finance Tools', template: '%s | Yield Pilot' },
  description: 'Free financial calculators for savings, debt payoff, retirement, taxes, and more. No account required.',
  keywords: ['financial calculator', 'HYSA calculator', 'retirement calculator', 'debt payoff', 'income tax'],
  openGraph: {
    title: 'Yield Pilot — Personal Finance Tools',
    description: 'Free tools that help people understand what their money is actually doing.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
