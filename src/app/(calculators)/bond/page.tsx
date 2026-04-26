'use client';
import { useState } from 'react';
import { Card, Stat, PageHero, EduBox, EduCard, Disclaimer, SaveButton, Input, Select } from '@/components/ui';
import { calcBond } from '@/lib/calculators';
import { fmt } from '@/lib/utils';
import { useSaveCalculation } from '@/hooks/useSaveCalculation';

export default function BondPage() {
  const [face, setFace] = useState(1000);
  const [yield_, setYield] = useState(5);
  const [term, setTerm] = useState(10);
  const [freq, setFreq] = useState(2);
  const { save, saved } = useSaveCalculation();
  const result = calcBond(face, yield_, term, freq);

  return (
    <div className="max-w-[1100px] mx-auto px-6 pb-16 animate-fade-up">
      <PageHero eyebrow="Growth" title={<>Bond <span className="text-[var(--accent)]">Calculator</span></>} subtitle="Estimate bond coupon income and total value at maturity." />
      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr]">
          <div className="p-6 border-b lg:border-b-0 lg:border-r border-[var(--border)]">
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-3">Parameters</p>
            <div className="space-y-3">
              <Input label="Face value" type="number" prefix="$" value={face} onChange={e => setFace(Number(e.target.value))} min={0} step={100} />
              <div className="grid grid-cols-2 gap-2.5">
                <Input label="Coupon rate" type="number" suffix="%" value={yield_} onChange={e => setYield(Number(e.target.value))} min={0} max={30} step={0.1} />
                <Input label="Term (years)" type="number" value={term} onChange={e => setTerm(Number(e.target.value))} min={1} max={50} />
              </div>
              <Select label="Coupon frequency" value={freq} onChange={e => setFreq(Number(e.target.value))}>
                <option value={1}>Annual</option>
                <option value={2}>Semi-annual</option>
                <option value={4}>Quarterly</option>
                <option value={12}>Monthly</option>
              </Select>
              <SaveButton onClick={async () => { await save({ type: 'bond', name: `Bond — ${yield_}% coupon, ${term} yr`, summary: `Total: ${fmt(result.total)} · Interest: ${fmt(result.interest)}`, resultValue: fmt(result.total) }); }} saving={saved} />
            </div>
          </div>
          <div className="p-6 bg-[var(--surface2)] flex flex-col gap-2.5">
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-0.5">Results</p>
            <Stat variant="large" label="Total value at maturity" value={fmt(result.total)} sub={`Face value + all coupons`} />
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Total coupon income" value={fmt(result.interest)} variant="green" />
              <Stat label={`Per payment (${freq === 1 ? 'annual' : freq === 2 ? 'semi-annual' : freq === 4 ? 'quarterly' : 'monthly'})`} value={fmt(result.perPeriod)} />
            </div>
          </div>
        </div>
      </Card>
      <EduBox title="Understanding bonds">
        <EduCard title="How bonds work">A bond is a loan you make to an issuer (government or corporation). They pay you regular coupon payments and return the face value at maturity.</EduCard>
        <EduCard title="Price vs yield">Bond prices and yields move in opposite directions. When interest rates rise, existing bond prices fall, and vice versa.</EduCard>
        <EduCard title="Credit risk">Government bonds (Treasuries) carry minimal credit risk. Corporate bonds offer higher yields but with higher risk of default.</EduCard>
        <EduCard title="Duration">Longer-term bonds are more sensitive to interest rate changes. Short-term bonds provide more stability but typically lower yields.</EduCard>
      </EduBox>
      <Disclaimer>For educational purposes only. Does not account for bond price fluctuations or yield to maturity calculations. Not financial advice.</Disclaimer>
    </div>
  );
}
