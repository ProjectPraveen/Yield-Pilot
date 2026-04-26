'use client';

import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Card, Stat, PageHero, EduBox, EduCard, Disclaimer, SaveButton, Input } from '@/components/ui';
import { calcRetirement } from '@/lib/calculators';
import { fmt, fmtK } from '@/lib/utils';
import { useSaveCalculation } from '@/hooks/useSaveCalculation';
import { cn } from '@/lib/utils';

Chart.register(...registerables);

export default function RetirementPage() {
  const [age, setAge] = useState(30);
  const [retireAge, setRetireAge] = useState(65);
  const [savings, setSavings] = useState(25000);
  const [contrib, setContrib] = useState(1000);
  const [ret, setRet] = useState(7);
  const [infl, setInfl] = useState(3);
  const [view, setView] = useState<'nominal' | 'real'>('nominal');
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const { save, saved } = useSaveCalculation();

  const result = calcRetirement(age, retireAge, savings, contrib, ret, infl);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();
    const data = view === 'nominal' ? result.nominal : result.real;
    chartInstance.current = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: result.labels,
        datasets: [{ label: view === 'nominal' ? 'Balance' : 'Real value', data, borderColor: view === 'nominal' ? '#15a362' : '#7c3aed', borderWidth: 2, backgroundColor: view === 'nominal' ? 'rgba(21,163,98,0.08)' : 'rgba(124,58,237,0.08)', fill: true, tension: 0.4, pointRadius: 0 }],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => '  ' + fmtK(c.parsed.y ?? 0) } } }, scales: { x: { ticks: { color: '#9ca3af', font: { size: 10 }, maxTicksLimit: 10 }, grid: { color: 'rgba(0,0,0,0.04)' }, border: { display: false } }, y: { ticks: { color: '#9ca3af', font: { size: 10 }, callback: (v) => fmtK(Number(v)) }, grid: { color: 'rgba(0,0,0,0.04)' }, border: { display: false } } } },
    });
    return () => chartInstance.current?.destroy();
  }, [age, retireAge, savings, contrib, ret, infl, view]);

  return (
    <div className="max-w-[1100px] mx-auto px-6 pb-16 animate-fade-up">
      <PageHero eyebrow="Retirement" title={<>Retirement <span className="text-[var(--accent)]">Calculator</span></>} subtitle="Project your retirement savings and estimate monthly income using the 4% rule." />
      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr]">
          <div className="p-6 border-b lg:border-b-0 lg:border-r border-[var(--border)]">
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-3">Parameters</p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <Input label="Current age" type="number" value={age} onChange={e => setAge(Number(e.target.value))} min={18} max={80} />
                <Input label="Retirement age" type="number" value={retireAge} onChange={e => setRetireAge(Number(e.target.value))} min={40} max={90} />
              </div>
              <Input label="Current savings" type="number" prefix="$" value={savings} onChange={e => setSavings(Number(e.target.value))} min={0} step={1000} />
              <Input label="Monthly contribution" type="number" prefix="$" value={contrib} onChange={e => setContrib(Number(e.target.value))} min={0} step={100} />
              <div className="grid grid-cols-2 gap-2.5">
                <Input label="Annual return" type="number" suffix="%" value={ret} onChange={e => setRet(Number(e.target.value))} min={0} max={20} step={0.1} />
                <Input label="Inflation rate" type="number" suffix="%" value={infl} onChange={e => setInfl(Number(e.target.value))} min={0} max={15} step={0.1} />
              </div>
              <SaveButton onClick={async () => { await save({ type: 'retirement', name: `Retirement — Age ${age} to ${retireAge}`, summary: `Projected: ${fmtK(result.nominalFinal)} · Monthly income: ${fmt(result.monthlyIncome4pct)}`, resultValue: fmtK(result.nominalFinal) }); }} saving={saved} />
            </div>
          </div>
          <div className="p-6 bg-[var(--surface2)] flex flex-col gap-2.5">
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-0.5">Results</p>
            <Stat variant="large" label="Projected balance at retirement" value={fmtK(result.nominalFinal)} sub={`Over ${retireAge - age} years`} />
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Real value (inflation-adj.)" value={fmtK(result.realFinal)} variant="purple" />
              <Stat label="Est. monthly income (4%)" value={fmt(result.monthlyIncome4pct)} variant="green" />
            </div>
          </div>
        </div>
        <div className="px-6 py-5 border-t border-[var(--border)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[12px] font-semibold">Savings growth</h3>
            <div className="flex gap-1.5">
              {(['nominal', 'real'] as const).map(v => (
                <button key={v} onClick={() => setView(v)} className={cn('text-[10px] font-medium px-2.5 py-1 rounded-[5px] border transition-colors', view === v ? 'bg-[var(--accent-dim)] text-[var(--accent)] border-[var(--accent-line)] font-bold' : 'bg-[var(--surface2)] text-[var(--text2)] border-[var(--border)]')}>
                  {v === 'nominal' ? 'Nominal' : 'Inflation-adjusted'}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[180px]"><canvas ref={chartRef} /></div>
        </div>
      </Card>
      <EduBox title="Retirement planning basics">
        <EduCard title="The 4% rule">A widely used guideline suggesting you can withdraw 4% of your portfolio annually in retirement. Divide your target annual income by 0.04 to find your savings goal.</EduCard>
        <EduCard title="Start early">Time is the most powerful variable. Starting at 25 vs 35 can double your retirement balance due to compound growth.</EduCard>
        <EduCard title="Diversify accounts">Use a mix of tax-deferred (401k, IRA) and tax-free (Roth) accounts to give yourself flexibility in retirement.</EduCard>
        <EduCard title="Adjust for inflation">In 30 years, $1M buys significantly less than today. Use the inflation-adjusted view to understand real purchasing power.</EduCard>
      </EduBox>
      <Disclaimer>Estimates only. The 4% rule is a guideline, not a guarantee. Actual returns vary. Not financial advice.</Disclaimer>
    </div>
  );
}
