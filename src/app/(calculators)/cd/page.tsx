'use client';
import { useState } from 'react';
import { Card, Stat, PageHero, EduBox, EduCard, Disclaimer, SaveButton, Input, Select } from '@/components/ui';
import { calcCD } from '@/lib/calculators';
import { fmt } from '@/lib/utils';
import { useSaveCalculation } from '@/hooks/useSaveCalculation';

export default function CDPage() {
  const [deposit, setDeposit] = useState(10000);
  const [apy, setApy] = useState(4.5);
  const [term, setTerm] = useState(12);
  const [freq, setFreq] = useState(12);
  const { save, saved } = useSaveCalculation();
  const result = calcCD(deposit, apy, term, freq);

  return (
    <div className="max-w-[1100px] mx-auto px-6 pb-16 animate-fade-up">
      <PageHero eyebrow="Savings" title={<>CD <span className="text-[var(--accent)]">Calculator</span></>} subtitle="Calculate your certificate of deposit earnings and effective yield." />
      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr]">
          <div className="p-6 border-b lg:border-b-0 lg:border-r border-[var(--border)]">
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-3">Parameters</p>
            <div className="space-y-3">
              <Input label="Deposit amount" type="number" prefix="$" value={deposit} onChange={e => setDeposit(Number(e.target.value))} min={0} step={500} />
              <div className="grid grid-cols-2 gap-2.5">
                <Input label="APY" type="number" suffix="%" value={apy} onChange={e => setApy(Number(e.target.value))} min={0} max={20} step={0.01} />
                <Input label="Term (months)" type="number" value={term} onChange={e => setTerm(Number(e.target.value))} min={1} max={120} />
              </div>
              <Select label="Compounding frequency" value={freq} onChange={e => setFreq(Number(e.target.value))}>
                <option value={365}>Daily</option>
                <option value={12}>Monthly</option>
                <option value={4}>Quarterly</option>
                <option value={2}>Semi-annually</option>
                <option value={1}>Annually</option>
              </Select>
              <SaveButton onClick={async () => { await save({ type: 'cd', name: `CD — ${apy}% APY, ${term} mo`, summary: `Final: ${fmt(result.final)} · Interest: ${fmt(result.interest)}`, resultValue: fmt(result.final) }); }} saving={saved} />
            </div>
          </div>
          <div className="p-6 bg-[var(--surface2)] flex flex-col gap-2.5">
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-0.5">Results</p>
            <Stat variant="large" label="Final balance at maturity" value={fmt(result.final)} sub={`After ${term} months`} />
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Interest earned" value={fmt(result.interest)} variant="green" />
              <Stat label="Effective APY" value={result.effApy.toFixed(3) + '%'} />
            </div>
          </div>
        </div>
      </Card>
      <EduBox title="How CDs work">
        <EduCard title="What is a CD?">A certificate of deposit locks your money for a fixed term in exchange for a guaranteed interest rate, usually higher than a regular savings account.</EduCard>
        <EduCard title="Early withdrawal">Withdrawing before maturity typically incurs a penalty, often several months of interest. Read the terms before opening.</EduCard>
        <EduCard title="CD laddering">Open multiple CDs with staggered maturity dates to maintain liquidity while earning higher rates than a savings account.</EduCard>
        <EduCard title="FDIC insured">CDs at FDIC-insured banks are protected up to $250,000 per depositor, making them one of the safest savings vehicles available.</EduCard>
      </EduBox>
      <Disclaimer>For educational purposes only. Rates are subject to change. Early withdrawal penalties may apply. Not financial advice.</Disclaimer>
    </div>
  );
}
