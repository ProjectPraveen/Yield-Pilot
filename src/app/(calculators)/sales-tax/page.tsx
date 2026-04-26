'use client';
import { useState } from 'react';
import { Card, Stat, PageHero, EduBox, EduCard, Disclaimer, SaveButton, Input, SegmentedControl } from '@/components/ui';
import { calcSalesTax, calcSalesTaxReverse } from '@/lib/calculators';
import { fmt } from '@/lib/utils';
import { useSaveCalculation } from '@/hooks/useSaveCalculation';

export default function SalesTaxPage() {
  const [mode, setMode] = useState('add');
  const [price, setPrice] = useState(100);
  const [total, setTotal] = useState(108.5);
  const [rate, setRate] = useState(8.5);
  const [qty, setQty] = useState(1);
  const { save, saved } = useSaveCalculation();

  const result = mode === 'add'
    ? calcSalesTax(price, rate, qty)
    : calcSalesTaxReverse(total, rate, qty);

  return (
    <div className="max-w-[1100px] mx-auto px-6 pb-16 animate-fade-up">
      <PageHero eyebrow="Tax" title={<>Sales Tax <span className="text-[var(--accent)]">Calculator</span></>} subtitle="Calculate the total cost of a purchase including tax, or reverse-calculate from a tax-inclusive price." />
      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr]">
          <div className="p-6 border-b lg:border-b-0 lg:border-r border-[var(--border)]">
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-3">Parameters</p>
            <div className="space-y-3">
              <SegmentedControl label="Mode" options={[{ label: 'Add tax to price', value: 'add' }, { label: 'Remove tax from total', value: 'remove' }]} value={mode} onChange={setMode} />
              {mode === 'add'
                ? <Input label="Pre-tax price (per item)" type="number" prefix="$" value={price} onChange={e => setPrice(Number(e.target.value))} min={0} step={0.01} />
                : <Input label="Total price including tax" type="number" prefix="$" value={total} onChange={e => setTotal(Number(e.target.value))} min={0} step={0.01} />
              }
              <div className="grid grid-cols-2 gap-2.5">
                <Input label="Sales tax rate" type="number" suffix="%" value={rate} onChange={e => setRate(Number(e.target.value))} min={0} max={25} step={0.01} />
                <Input label="Quantity" type="number" value={qty} onChange={e => setQty(Math.max(1, Number(e.target.value)))} min={1} step={1} />
              </div>
              <SaveButton onClick={async () => { await save({ type: 'sales-tax', name: `Sales Tax — ${rate}%`, summary: `Total: ${fmt(result.total)} · Tax: ${fmt(result.taxAmt)}`, resultValue: fmt(result.total) }); }} saving={saved} />
            </div>
          </div>
          <div className="p-6 bg-[var(--surface2)] flex flex-col gap-2.5">
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-0.5">Results</p>
            <Stat variant="large" label="Total cost (with tax)" value={fmt(result.total)} sub={`${rate}% tax on ${qty} item${qty > 1 ? 's' : ''}`} />
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Pre-tax subtotal" value={fmt(result.subtotal)} />
              <Stat label="Tax amount" value={fmt(result.taxAmt)} variant="red" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Per unit (pre-tax)" value={fmt(result.unitPre)} />
              <Stat label="Per unit (with tax)" value={fmt(result.unitTotal)} variant="green" />
            </div>
          </div>
        </div>
      </Card>
      <EduBox title="Sales tax in the US">
        <EduCard title="State and local rates">Sales tax is set by state and sometimes county or city. Rates range from 0% (Oregon, Montana) to over 10% in some cities.</EduCard>
        <EduCard title="Tax-exempt items">Groceries, prescription drugs, and some clothing may be exempt or taxed at a reduced rate depending on your state.</EduCard>
        <EduCard title="Online purchases">Since the 2018 South Dakota v. Wayfair ruling, most online retailers collect sales tax based on the buyer's location.</EduCard>
        <EduCard title="Reverse calculation">If you know the total but need the pre-tax amount, use "Remove tax from total" mode — useful for expense reporting.</EduCard>
      </EduBox>
      <Disclaimer>For estimation only. Actual tax may vary based on jurisdiction and product type. Not tax advice.</Disclaimer>
    </div>
  );
}
