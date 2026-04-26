'use client';

import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Card, Stat, PageHero, EduBox, EduCard, Disclaimer, SaveButton, Input, SegmentedControl } from '@/components/ui';
import { ccAmortize } from '@/lib/calculators';
import { fmt, fmtMonths } from '@/lib/utils';
import { useSaveCalculation } from '@/hooks/useSaveCalculation';

Chart.register(...registerables);

export default function CreditCardPage() {
  const [balance, setBalance] = useState(5000);
  const [apr, setApr] = useState(22.99);
  const [payment, setPayment] = useState(200);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const { save, saved } = useSaveCalculation();

  const result = ccAmortize(balance, apr, payment);
  const minPayment = (balance * (apr / 100 / 12)) + 25;

  useEffect(() => {
    if (!chartRef.current || !result.rows.length) return;
    if (chartInstance.current) chartInstance.current.destroy();
    chartInstance.current = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: result.rows.map(r => `Mo ${r.month}`),
        datasets: [
          { label: 'Balance', data: result.rows.map(r => +r.balance.toFixed(2)), borderColor: '#dc3545', borderWidth: 2, backgroundColor: 'rgba(220,53,69,0.08)', fill: true, tension: 0.4, pointRadius: 0 },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#9ca3af', font: { size: 10 }, maxTicksLimit: 8 }, grid: { color: 'rgba(0,0,0,0.04)' }, border: { display: false } }, y: { ticks: { color: '#9ca3af', font: { size: 10 }, callback: (v) => fmt(Number(v)) }, grid: { color: 'rgba(0,0,0,0.04)' }, border: { display: false } } } },
    });
    return () => chartInstance.current?.destroy();
  }, [balance, apr, payment]);

  return (
    <div className="max-w-[1100px] mx-auto px-6 pb-16 animate-fade-up">
      <PageHero eyebrow="Debt" title={<>Credit Card <span className="text-[var(--accent)]">Payoff Calculator</span></>} subtitle="See exactly how long it takes to pay off your balance and how much interest you'll pay." />
      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr]">
          <div className="p-6 border-b lg:border-b-0 lg:border-r border-[var(--border)]">
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-3">Parameters</p>
            <div className="space-y-3">
              <Input label="Current balance" type="number" prefix="$" value={balance} onChange={e => setBalance(Number(e.target.value))} min={0} step={100} />
              <Input label="APR" type="number" suffix="%" value={apr} onChange={e => setApr(Number(e.target.value))} min={0} max={50} step={0.01} />
              <Input label="Monthly payment" type="number" prefix="$" value={payment} onChange={e => setPayment(Number(e.target.value))} min={0} step={10} />
              {payment < minPayment && <p className="text-[11px] text-[var(--red)]">Payment must exceed minimum interest (~{fmt(minPayment)}) to pay off balance.</p>}
              <SaveButton onClick={async () => { await save({ type: 'credit', name: `Credit Card — ${apr}% APR`, summary: `Payoff: ${fmtMonths(result.months)} · Interest: ${fmt(result.totalInt)}`, resultValue: fmtMonths(result.months) }); }} saving={saved} />
            </div>
          </div>
          <div className="p-6 bg-[var(--surface2)] flex flex-col gap-2.5">
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-0.5">Results</p>
            <Stat variant="large" label="Payoff timeline" value={fmtMonths(result.months)} sub={`At $${payment}/mo`} />
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Total interest paid" value={fmt(result.totalInt)} variant="red" />
              <Stat label="Total amount paid" value={fmt(result.totalInt + balance)} />
            </div>
          </div>
        </div>
        <div className="px-6 py-5 border-t border-[var(--border)]">
          <h3 className="text-[12px] font-semibold mb-3">Balance over time</h3>
          <div className="h-[180px]"><canvas ref={chartRef} /></div>
        </div>
      </Card>
      <EduBox title="Understanding credit card interest">
        <EduCard title="How APR works">APR is your annual rate divided into a monthly rate applied to your balance each month. On a $5,000 balance at 22%, that's about $92 in interest the first month alone.</EduCard>
        <EduCard title="Minimum payments">Paying only the minimum keeps you in debt for years and costs you thousands extra. Even a small increase in your monthly payment dramatically cuts your payoff time.</EduCard>
        <EduCard title="Avalanche strategy">If you have multiple cards, pay minimums on all and put every extra dollar toward the highest-APR card first. This minimizes total interest paid.</EduCard>
        <EduCard title="Balance transfers">A 0% intro APR balance transfer can save significant interest if you can pay off the balance before the promotional period ends.</EduCard>
      </EduBox>
      <Disclaimer>For educational purposes only. Not financial advice. Actual payoff times may vary based on fees, minimum payment changes, and other factors.</Disclaimer>
    </div>
  );
}
