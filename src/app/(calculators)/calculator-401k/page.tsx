'use client';

import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Card, Stat, PageHero, EduBox, EduCard, Disclaimer, SaveButton, Input } from '@/components/ui';
import { calc401k } from '@/lib/calculators';
import { fmt, fmtK } from '@/lib/utils';
import { useSaveCalculation } from '@/hooks/useSaveCalculation';
import { cn } from '@/lib/utils';

Chart.register(...registerables);

export default function Calc401kPage() {
  const [age, setAge] = useState(30);
  const [retireAge, setRetireAge] = useState(65);
  const [balance, setBalance] = useState(10000);
  const [contrib, setContrib] = useState(500);
  const [match, setMatch] = useState(50);
  const [ret, setRet] = useState(7);
  const [infl, setInfl] = useState(3);
  const [view, setView] = useState<'nominal' | 'real'>('nominal');
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const { save, saved } = useSaveCalculation();

  const result = calc401k(age, retireAge, balance, contrib, match, ret, infl);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();
    const data = view === 'nominal' ? result.nominal : result.real;
    chartInstance.current = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: result.labels,
        datasets: [
          { label: view === 'nominal' ? 'Balance' : 'Real value', data, borderColor: view === 'nominal' ? '#15a362' : '#7c3aed', borderWidth: 2, backgroundColor: view === 'nominal' ? 'rgba(21,163,98,0.08)' : 'rgba(124,58,237,0.08)', fill: true, tension: 0.4, pointRadius: 0 },
          { label: 'Contributions', data: result.contrib, borderColor: '#2563eb', borderWidth: 1.5, backgroundColor: 'transparent', fill: false, tension: 0.4, pointRadius: 0, borderDash: [5, 3] },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => '  ' + c.dataset.label + ': ' + fmtK(c.parsed.y ?? 0) } } }, scales: { x: { ticks: { color: '#9ca3af', font: { size: 10 }, maxTicksLimit: 10 }, grid: { color: 'rgba(0,0,0,0.04)' }, border: { display: false } }, y: { ticks: { color: '#9ca3af', font: { size: 10 }, callback: (v) => fmtK(Number(v)) }, grid: { color: 'rgba(0,0,0,0.04)' }, border: { display: false } } } },
    });
    return () => chartInstance.current?.destroy();
  }, [age, retireAge, balance, contrib, match, ret, infl, view]);

  return (
    <div className="max-w-[1100px] mx-auto px-6 pb-16 animate-fade-up">
      <PageHero eyebrow="Retirement" title={<>401(k) <span className="text-[var(--accent)]">Calculator</span></>} subtitle="Project your retirement balance with employer match and see the real inflation-adjusted value." />
      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr]">
          <div className="p-6 border-b lg:border-b-0 lg:border-r border-[var(--border)]">
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-3">Parameters</p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <Input label="Current age" type="number" value={age} onChange={e => setAge(Number(e.target.value))} min={18} max={80} />
                <Input label="Retirement age" type="number" value={retireAge} onChange={e => setRetireAge(Number(e.target.value))} min={40} max={90} />
              </div>
              <Input label="Current balance" type="number" prefix="$" value={balance} onChange={e => setBalance(Number(e.target.value))} min={0} step={1000} />
              <Input label="Monthly contribution" type="number" prefix="$" value={contrib} onChange={e => setContrib(Number(e.target.value))} min={0} step={50} />
              <Input label="Employer match" type="number" suffix="%" value={match} onChange={e => setMatch(Number(e.target.value))} min={0} max={200} step={10} />
              <div className="grid grid-cols-2 gap-2.5">
                <Input label="Annual return" type="number" suffix="%" value={ret} onChange={e => setRet(Number(e.target.value))} min={0} max={20} step={0.1} />
                <Input label="Inflation rate" type="number" suffix="%" value={infl} onChange={e => setInfl(Number(e.target.value))} min={0} max={15} step={0.1} />
              </div>
              <SaveButton onClick={async () => { await save({ type: '401k', name: `401(k) — Age ${age} to ${retireAge}`, summary: `Projected: ${fmtK(result.nominalFinal)} · Real: ${fmtK(result.realFinal)}`, resultValue: fmtK(result.nominalFinal) }); }} saving={saved} />
            </div>
          </div>
          <div className="p-6 bg-[var(--surface2)] flex flex-col gap-2.5">
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-0.5">Results</p>
            <Stat variant="large" label="Projected balance (nominal)" value={fmtK(result.nominalFinal)} sub={`Over ${retireAge - age} yr at ${ret}% return`} />
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Inflation-adjusted value" value={fmtK(result.realFinal)} variant="purple" />
              <Stat label="Employer contributions" value={fmtK(result.empContribs)} variant="blue" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Your contributions" value={fmtK(result.myContribs)} />
              <Stat label="Investment growth" value={fmtK(result.growth)} variant="green" />
            </div>
          </div>
        </div>
        <div className="px-6 py-5 border-t border-[var(--border)]">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h3 className="text-[12px] font-semibold">Balance over time</h3>
            <div className="flex gap-1.5">
              {(['nominal', 'real'] as const).map(v => (
                <button key={v} onClick={() => setView(v)} className={cn('text-[10px] font-medium px-2.5 py-1 rounded-[5px] border transition-colors', view === v ? 'bg-[var(--accent-dim)] text-[var(--accent)] border-[var(--accent-line)] font-bold' : 'bg-[var(--surface2)] text-[var(--text2)] border-[var(--border)]')}>
                  {v === 'nominal' ? 'Nominal' : 'Inflation-adjusted'}
                </button>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-[var(--text3)] mb-3">Real value shows what your balance will actually be worth in today's dollars after inflation.</p>
          <div className="h-[180px]"><canvas ref={chartRef} /></div>
        </div>
      </Card>
      <EduBox title="Maximizing your 401(k)">
        <EduCard title="Employer match">Always contribute at least enough to get the full employer match — it's an instant 50-100% return on that portion of your contribution.</EduCard>
        <EduCard title="2024 contribution limits">You can contribute up to $23,000/year to a 401(k) in 2024. If you're 50+, the catch-up limit adds $7,500 more.</EduCard>
        <EduCard title="Tax advantages">Traditional 401(k) contributions reduce your taxable income today. Roth 401(k) contributions grow tax-free for retirement.</EduCard>
        <EduCard title="Inflation adjustment">A nominal balance of $1M in 30 years buys far less than $1M today. The real value toggle shows purchasing power in today's dollars.</EduCard>
      </EduBox>
      <Disclaimer>Projections assume constant return rate. Actual returns vary. Not financial advice. Consult a financial advisor for personalized retirement planning.</Disclaimer>
    </div>
  );
}
