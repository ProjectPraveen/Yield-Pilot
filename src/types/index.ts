export type CalculatorType =
  | 'hysa'
  | 'credit'
  | 'debt'
  | 'loan'
  | 'networth'
  | 'income-tax'
  | '401k'
  | 'inflation'
  | 'retirement'
  | 'salary'
  | 'cd'
  | 'bond'
  | 'mutual-fund'
  | 'dividend'
  | 'sales-tax';

export interface SavedCalculation {
  id: string;
  user_id: string;
  type: CalculatorType;
  name: string;
  summary: string | null;
  result_value: string | null;
  inputs: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  updated_at: string;
}

export interface CalculatorMeta {
  type: CalculatorType;
  name: string;
  description: string;
  href: string;
  group: 'savings-debt' | 'planning-tax' | 'retirement-growth';
  abbr: string;
}

export const CALCULATOR_LIST: CalculatorMeta[] = [
  { type: 'hysa', name: 'HYSA Calculator', description: 'Compare high yield savings rates vs the national average', href: '/hysa', group: 'savings-debt', abbr: 'H' },
  { type: 'credit', name: 'Credit Card Payoff', description: 'Find your exact payoff timeline and interest cost', href: '/credit-card', group: 'savings-debt', abbr: 'CC' },
  { type: 'debt', name: 'Debt Payoff', description: 'Compare avalanche vs snowball across all your debts', href: '/debt-payoff', group: 'savings-debt', abbr: 'DP' },
  { type: 'loan', name: 'Loan Calculator', description: 'Mortgage and auto loan payment breakdowns', href: '/loan', group: 'savings-debt', abbr: 'LN' },
  { type: 'cd', name: 'CD Calculator', description: 'Certificate of deposit earnings and effective yield', href: '/cd', group: 'savings-debt', abbr: 'CD' },
  { type: 'networth', name: 'Net Worth Tracker', description: 'Assets minus liabilities — your real financial picture', href: '/net-worth', group: 'planning-tax', abbr: 'NW' },
  { type: 'income-tax', name: 'Income Tax', description: 'Federal tax estimate with full bracket breakdown', href: '/income-tax', group: 'planning-tax', abbr: 'TX' },
  { type: 'salary', name: 'Salary Calculator', description: 'Hourly to annual conversion with overtime support', href: '/salary', group: 'planning-tax', abbr: 'SL' },
  { type: 'sales-tax', name: 'Sales Tax', description: 'Total purchase cost with any tax rate', href: '/sales-tax', group: 'planning-tax', abbr: 'ST' },
  { type: 'inflation', name: 'Inflation Calculator', description: 'See how inflation erodes buying power over time', href: '/inflation', group: 'planning-tax', abbr: 'IN' },
  { type: '401k', name: '401(k) Calculator', description: 'Retirement balance with employer match and real value', href: '/calculator-401k', group: 'retirement-growth', abbr: '4k' },
  { type: 'retirement', name: 'Retirement Calculator', description: 'Plan savings and estimate monthly retirement income', href: '/retirement', group: 'retirement-growth', abbr: 'RT' },
  { type: 'mutual-fund', name: 'Mutual Fund', description: 'Fund growth with expense ratio drag over time', href: '/mutual-fund', group: 'retirement-growth', abbr: 'MF' },
  { type: 'dividend', name: 'Dividend Calculator', description: 'Annual income with inflation-adjusted projections', href: '/dividend', group: 'retirement-growth', abbr: 'DV' },
  { type: 'bond', name: 'Bond Calculator', description: 'Bond value at maturity and total coupon income', href: '/bond', group: 'retirement-growth', abbr: 'BD' },
];

export const CALC_GROUP_LABELS = {
  'savings-debt': 'Savings & Debt',
  'planning-tax': 'Planning & Tax',
  'retirement-growth': 'Retirement & Growth',
};
