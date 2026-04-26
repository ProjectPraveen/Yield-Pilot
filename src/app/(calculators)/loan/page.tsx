'use client';

import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Card, Stat, PageHero, EduBox, EduCard, Disclaimer, SaveButton, Input, SegmentedControl } from '@/components/ui';
import { amortizeLoan } from '@/lib/calculators';
import { fmt, fmtK } from '@/lib/utils';
import { useSaveCalculation } from '@/hooks/useSaveCalculation';

Chart.register(...registerables);

export default function LoanPage() {
  const [principal, setPrincipal] = useState(300000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);
  const [type, setType] = useState('mortgage');
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const { save, saved } = useSaveCalculation();

  const months = years * 12;
  const result = amortizeLoan(principal, rate, months);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();
    chartInstance.current = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: result.cumP.map((_, i) => `Yr ${Math.ceil((i + 1) / 12)}`).filter((_, i) => i % 12 === 0),
        datasets: [
          { label: 'Principal paid', data: result.cumP.filter((_, i) => i % 12 === 11), borderColor: '#15a362', borderWidth: 2, backgroundColor: 'rgba(21,163,98,0.08)', fill: true, tension: 0.4, pointRadius: 0 },
          { label: 'Interest paid', data: result.cumI.filter((_, i) => i % 12 === 11), borderColor: '#dc3545', borderWidth: 2, backgroundColor: 'transparent', fill: false, tension: 0.4, pointRadius: 0 },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#9ca3af', font: { size: 10 } }, grid: { color: 'rgba(0,0,0,0.04)' }, border: { display: false } }, y: { ticks: { color: '#9ca3af', font: { size: 10 }, callback: (v) => fmtK(Number(v)) }, grid: { color: 'rgba(0,0,0,0.04)' }, border: { display: false } } } },
    });
    return () => chartInstance.current?.destroy();
  }, [principal, rate, years]);

  return (
    <div className="max-w-[1100px] mx-auto px-6 pb-16 animate-fade-up">
      <PageHero eyebrow="Debt" title={<>Loan <span className="text-[var(--accent)]">Calculator</span></>} subtitle="Calculate monthly payments, total interest, and see your full amortization breakdown." />
      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr]">
          <div className="p-6 border-b lg:border-b-0 lg:border-r border-[var(--border)]">
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-3">Parameters</p>
            <div className="space-y-3">
              <SegmentedControl label="Loan type" options={[{ label: 'Mortgage', value: 'mortgage' }, { label: 'Auto', value: 'auto' }, { label: 'Personal', value: 'personal' }]} value={type} onChange={setType} />
              <Input label="Loan amount" type="number" prefix="$" value={principal} onChange={e => setPrincipal(Number(e.target.value))} min={0} step={1000} />
              <div className="grid grid-cols-2 gap-2.5">
                <Input label="Annual interest rate" type="number" suffix="%" value={rate} onChange={e => setRate(Number(e.target.value))} min={0} max={30} step={0.01} />
                <Input label="Loan term (years)" type="number" value={years} onChange={e => setYears(Number(e.target.value))} min={1} max={50} />
              </div>
              <SaveButton onClick={async () => { await save({ type: 'loan', name: `Loan — ${fmt(principal)} at ${rate}%`, summary: `Payment: ${fmt(result.payment)}/mo · Interest: ${fmt(result.totalInt)}`, resultValue: fmt(result.payment) }); }} saving={saved} />
            </div>
          </div>
          <div className="p-6 bg-[var(--surface2)] flex flex-col gap-2.5">
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-0.5">Results</p>
            <Stat variant="large" label="Monthly payment" value={fmt(result.payment)} sub={`Over ${years} years`} />
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Total interest" value={fmt(result.totalInt)} variant="red" />
              <Stat label="Total cost" value={fmt(principal + result.totalInt)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Loan amount" value={fmt(principal)} />
              <Stat label="Interest ratio" value={((result.totalInt / principal) * 100).toFixed(1) + '%'} variant="red" />
            </div>
          </div>
        </div>
        <div className="px-6 py-5 border-t border-[var(--border)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[12px] font-semibold">Cumulative principal vs interest</h3>
            <div className="flex gap-3">
              {[{ color: '#15a362', label: 'Principal' }, { color: '#dc3545', label: 'Interest' }].map(l => (
                <div key={l.label} className="flex items-center gap-1.5 text-[11px] text-[var(--text2)]">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: l.color }} />{l.label}
                </div>
              ))}
            </div>
          </div>
          <div className="h-[180px]"><canvas ref={chartRef} /></div>
        </div>
      </Card>
      <EduBox title="Understanding loan costs">
        <EduCard title="Amortization">Each payment covers both interest and principal. Early payments are mostly interest — principal paydown accelerates over time.</EduCard>
        <EduCard title="Rate impact">A 1% rate difference on a $300k mortgage changes your total interest by tens of thousands of dollars over 30 years.</EduCard>
        <EduCard title="Extra payments">Making even one extra payment per year can cut years off your loan term and save significant interest.</EduCard>
        <EduCard title="Refinancing">If rates drop significantly, refinancing can lower your payment and total cost — but factor in closing costs first.</EduCard>
      </EduBox>
      <Disclaimer>For educational purposes only. Does not include PMI, property taxes, insurance, or closing costs. Not financial advice.</Disclaimer>
    </div>
  );
}
