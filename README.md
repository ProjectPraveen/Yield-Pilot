# Yield Pilot

Free personal finance calculators built with Next.js 14, Supabase, and Tailwind CSS.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Auth & Database | Supabase |
| Hosting | Vercel |
| Domain | Porkbun → Vercel |

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/yield-pilot.git
cd yield-pilot
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In your project, go to **SQL Editor** and run the contents of `supabase-schema.sql`
3. Go to **Settings → API** and copy your Project URL and anon key

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Configure Supabase Auth

In your Supabase dashboard:
1. Go to **Authentication → URL Configuration**
2. Set **Site URL** to your domain (e.g. `https://yieldpilot.com`)
3. Add redirect URLs:
   - `http://localhost:3000/**`
   - `https://yieldpilot.com/**`

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploying to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/yield-pilot.git
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New → Project**
3. Import your GitHub repository
4. Add environment variables (same as `.env.local` but with your production values):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` = `https://yourdomain.com`
5. Click **Deploy**

### 3. Connect your Porkbun domain

After deploying:

1. In Vercel: Go to your project **Settings → Domains** → Add your domain (e.g. `yieldpilot.com`)
2. Vercel will show you the DNS records to add
3. In Porkbun: Go to your domain → **DNS** → Add these records:

| Type | Host | Value |
|---|---|---|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

4. Wait 5–15 minutes for DNS to propagate
5. Vercel will automatically provision an SSL certificate

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Sign in, sign up, forgot/reset password
│   ├── (calculators)/   # All 15 calculator pages
│   ├── calculators/     # Calculator hub listing page
│   ├── dashboard/       # Saved calculations (requires auth)
│   ├── profile/         # User profile (requires auth)
│   ├── about/           # About page
│   ├── faq/             # FAQ page
│   ├── contact/         # Contact form
│   ├── layout.tsx       # Root layout with Navbar + Footer
│   └── page.tsx         # Home page
├── components/
│   ├── layout/          # Navbar, Footer
│   ├── ui/              # Reusable UI components
│   └── charts/          # Chart wrappers
├── lib/
│   ├── supabase/        # Client + Server Supabase clients
│   ├── calculators.ts   # All calculator math functions
│   └── utils.ts         # Helpers (fmt, cn, etc.)
├── hooks/
│   └── useSaveCalculation.ts
├── types/
│   └── index.ts         # TypeScript types + calculator metadata
└── middleware.ts        # Supabase session refresh
```

## Adding the Remaining Calculators

The HYSA calculator at `src/app/(calculators)/hysa/page.tsx` is the full reference implementation. Each of the other 14 calculators follows the same pattern:

1. Import the math function from `src/lib/calculators.ts`
2. Use the shared UI components (`Card`, `Stat`, `Input`, etc.)
3. Call `useSaveCalculation()` for the save button
4. Wire up a Chart.js canvas for the chart

All math functions are already implemented in `src/lib/calculators.ts`.

## Calculators

| Calculator | Route | Math function |
|---|---|---|
| HYSA | `/hysa` | `calcHYSAGrowth` |
| Credit Card | `/credit-card` | `ccAmortize` |
| Debt Payoff | `/debt-payoff` | `calcDebtPayoff` |
| Loan | `/loan` | `amortizeLoan` |
| Net Worth | `/net-worth` | (client-side only) |
| Income Tax | `/income-tax` | `calcIncomeTax` |
| 401(k) | `/calculator-401k` | `calc401k` |
| Inflation | `/inflation` | `calcInflation` |
| Retirement | `/retirement` | `calcRetirement` |
| Salary | `/salary` | `calcSalary` |
| CD | `/cd` | `calcCD` |
| Bond | `/bond` | `calcBond` |
| Mutual Fund | `/mutual-fund` | `calcMutualFund` |
| Dividend | `/dividend` | `calcDividend` |
| Sales Tax | `/sales-tax` | `calcSalesTax` |
