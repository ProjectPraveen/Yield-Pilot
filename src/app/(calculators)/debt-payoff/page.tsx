'use client';
import { useState } from 'react';
import { Card, Stat, PageHero, EduBox, EduCard, Disclaimer, SaveButton, Input, SegmentedControl } from '@/components/ui';
import { calcDebtPayoff, type Debt } from '@/lib/calculators';
import { fmt, fmtMonths } from '@/lib/utils';
import { useSaveCalculation } from '@/hooks/useSaveCalculation';

export default function DebtPayoffPage() {
  const [debts, setDebts] = useState<Debt[]>([
    { name: 'Credit Card A', balance: 5000, apr: 22.99, minPayment: 100 },
    { name: 'Credit Card B', balance: 3200, apr: 18.5, minPayment: 65 },
    { name: 'Personal Loan', balance: 8000, apr: 12.0, minPayment: 180 },
  ]);
  const [extra, setExtra] = useState(200);
  const [strategy, setStrategy] = useState<'avalanche' | 'snowball'>('avalanche');
  const { save, saved } = useSaveCalculation();

  const result = calcDebtPayoff(debts, extra, strategy);
  const resultAlt = calcDebtPayoff(debts, extra, strategy === 'avalanche' ? 'snowball' : 'avalanche');
  const totalDebt = debts.reduce((s, d) => s + d.balance, 0);

  function updateDebt(idx: number, field: keyof Debt, val: string) {
    const updated = [...debts];
    updated[idx] = { ...updated[idx], [field]: field === 'name' ? val : parseFloat(val) || 0 };
    setDebts(updated);
  }

  function addDebt() {
    setDebts([...debts, { name: 'New debt', balance: 1000, apr: 15, minPayment: 30 }]);
  }

  return (
    <div className="max-w-[1100px] mx-auto px-6 pb-16 animate-fade-up">
      <PageHero eyebrow="Debt" title={<>Debt Payoff <span className="text-[var(--accent)]">Calculator</span></>} subtitle="Compare avalanche vs snowball strategies to find the fastest and cheapest path to debt freedom." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        <Stat variant="large" label="Payoff timeline" value={fmtMonths(result.months)} sub={strategy === 'avalanche' ? 'Avalanche method' : 'Snowball method'} />
        <Stat label="Total interest paid" value={fmt(result.totalInt)} variant="red" />
        <Stat label={`vs ${strategy === 'avalanche' ? 'snowball' : 'avalanche'}`} value={fmt(Math.abs(result.totalInt - resultAlt.totalInt)) + ' ' + (result.totalInt < resultAlt.totalInt ? 'saved' : 'more')} variant={result.totalInt <= resultAlt.totalInt ? 'green' : 'red'} />
      </div>

      <Card className="mb-4">
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-bold">Your debts</h3>
            <button onClick={addDebt} className="text-[11px] font-medium text-[var(--accent)] border border-[var(--accent-line)] rounded-[5px] px-3 py-1 hover:bg-[var(--accent-dim)] transition-colors">+ Add debt</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {['Name', 'Balance', 'APR %', 'Min payment'].map(h => (
                    <th key={h} className="text-left py-2 px-2 text-[10px] font-bold uppercase tracking-[0.05em] text-[var(--text3)]">{h}</th>
                  ))}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {debts.map((d, i) => (
                  <tr key={i} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-2 px-2"><input value={d.name} onChange={e => updateDebt(i, 'name', e.target.value)} className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-[5px] px-2 py-1 text-[12px] outline-none focus:border-[var(--accent)]" /></td>
                    <td className="py-2 px-2"><div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-[var(--text3)]">$</span><input type="number" value={d.balance} onChange={e => updateDebt(i, 'balance', e.target.value)} className="w-24 bg-white border border-[var(--border)] rounded-[5px] pl-4 pr-2 py-1 text-[12px] font-mono outline-none focus:border-[var(--accent)]" /></div></td>
                    <td className="py-2 px-2"><input type="number" value={d.apr} onChange={e => updateDebt(i, 'apr', e.target.value)} className="w-20 bg-white border border-[var(--border)] rounded-[5px] px-2 py-1 text-[12px] font-mono outline-none focus:border-[var(--accent)]" /></td>
                    <td className="py-2 px-2"><div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-[var(--text3)]">$</span><input type="number" value={d.minPayment} onChange={e => updateDebt(i, 'minPayment', e.target.value)} className="w-24 bg-white border border-[var(--border)] rounded-[5px] pl-4 pr-2 py-1 text-[12px] font-mono outline-none focus:border-[var(--accent)]" /></div></td>
                    <td className="py-2 px-2"><button onClick={() => setDebts(debts.filter((_, j) => j !== i))} className="text-[var(--text3)] hover:text-[var(--red)] text-[16px]">×</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="px-5 pb-5 border-t border-[var(--border)] pt-4 space-y-3">
          <Input label="Extra monthly payment" type="number" prefix="$" value={extra} onChange={e => setExtra(Number(e.target.value))} min={0} step={25} />
          <SegmentedControl label="Strategy" options={[{ label: 'Avalanche (highest APR first)', value: 'avalanche' }, { label: 'Snowball (lowest balance first)', value: 'snowball' }]} value={strategy} onChange={v => setStrategy(v as 'avalanche' | 'snowball')} />
          <SaveButton onClick={async () => { await save({ type: 'debt', name: `Debt Payoff — ${strategy}`, summary: `Payoff: ${fmtMonths(result.months)} · Interest: ${fmt(result.totalInt)}`, resultValue: fmtMonths(result.months) }); }} saving={saved} />
        </div>
      </Card>

      <EduBox title="Debt payoff strategies">
        <EduCard title="Avalanche method">Pay minimums on all debts, then put extra money toward the highest-APR debt. Mathematically optimal — saves the most interest.</EduCard>
        <EduCard title="Snowball method">Pay minimums on all debts, then target the smallest balance first. Provides psychological wins that help maintain motivation.</EduCard>
        <EduCard title="Which is better?">Avalanche saves more money. Snowball provides quicker visible progress. The best strategy is the one you'll stick to.</EduCard>
        <EduCard title="Extra payments">Even a small extra payment each month dramatically reduces payoff time. Redirect money freed up when one debt is paid to the next target.</EduCard>
      </EduBox>
      <Disclaimer>For educational purposes only. Actual payoff may vary. Not financial advice.</Disclaimer>
    </div>
  );
}
