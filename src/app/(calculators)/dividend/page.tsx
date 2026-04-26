'use client';
import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Card, Stat, PageHero, EduBox, EduCard, Disclaimer, SaveButton, Input } from '@/components/ui';
import { calcDividend } from '@/lib/calculators';
import { fmt, fmtK } from '@/lib/utils';
import { useSaveCalculation } from '@/hooks/useSaveCalculation';
import { cn } from '@/lib/utils';

Chart.register(...registerables);

export default function DividendPage() {
  const [amount, setAmount] = useState(25000);
  const [yield_, setYield] = useState(3.5);
  const [years, setYears] = useState(20);
  const [divGrowth, setDivGrowth] = useState(5);
  const [priceGrowth, setPriceGrowth] = useState(6);
  const [infl, setInfl] = useState(3);
  const [view, setView] = useState<'nominal' | 'real'>('nominal');
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const { save, saved } = useSaveCalculation();

  const result = calcDividend(amount, yield_, years, divGrowth, priceGrowth, infl);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();
    const data = view === 'nominal' ? result.nominal : result.real;
    chartInstance.current = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: result.labels,
        datasets: [
          { label: 'Nominal income', data: result.nominal, borderColor: '#15a362', borderWidth: 2, backgroundColor: 'rgba(21,163,98,0.09)', fill: view === 'nominal', tension: 0.4, pointRadius: 0 },
          { label: 'Real income', data: result.real, borderColor: '#7c3aed', borderWidth: 1.5, backgroundColor: 'transparent', fill: false, tension: 0.4, pointRadius: 0, borderDash: [4, 3], hidden: view === 'nominal' },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => '  ' + c.dataset.label + ': ' + fmt(c.parsed.y ?? 0) } } }, scales: { x: { ticks: { color: '#9ca3af', font: { size: 10 }, maxTicksLimit: 10 }, grid: { color: 'rgba(0,0,0,0.04)' }, border: { display: false } }, y: { ticks: { color: '#9ca3af', font: { size: 10 }, callback: (v) => fmt(Number(v)) }, grid: { color: 'rgba(0,0,0,0.04)' }, border: { display: false } } } },
    });
    return () => chartInstance.current?.destroy();
  }, [amount, yield_, years, divGrowth, priceGrowth, infl, view]);

  return (
    <div className="max-w-[1100px] mx-auto px-6 pb-16 animate-fade-up">
      <PageHero eyebrow="Growth" title={<>Dividend <span className="text-[var(--accent)]">Calculator</span></>} subtitle="Estimate annual dividend income with inflation-adjusted projections over time." />
      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr]">
          <div className="p-6 border-b lg:border-b-0 lg:border-r border-[var(--border)]">
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-3">Parameters</p>
            <div className="space-y-3">
              <Input label="Investment amount" type="number" prefix="$" value={amount} onChange={e => setAmount(Number(e.target.value))} min={0} step={500} />
              <div className="grid grid-cols-2 gap-2.5">
                <Input label="Dividend yield" type="number" suffix="%" value={yield_} onChange={e => setYield(Number(e.target.value))} min={0} max={30} step={0.1} />
                <Input label="Years" type="number" value={years} onChange={e => setYears(Number(e.target.value))} min={1} max={50} />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <Input label="Annual div. growth" type="number" suffix="%" value={divGrowth} onChange={e => setDivGrowth(Number(e.target.value))} min={0} max={30} step={0.1} />
                <Input label="Stock price growth" type="number" suffix="%" value={priceGrowth} onChange={e => setPriceGrowth(Number(e.target.value))} min={0} max={30} step={0.1} />
              </div>
              <Input label="Inflation rate (for real value)" type="number" suffix="%" value={infl} onChange={e => setInfl(Number(e.target.value))} min={0} max={15} step={0.1} />
              <SaveButton onClick={async () => { await save({ type: 'dividend', name: `Dividend — ${yield_}% yield`, summary: `Yr1: ${fmt(result.yr1Annual)} · Final: ${fmt(result.finalNominal)}`, resultValue: fmt(result.yr1Annual) }); }} saving={saved} />
            </div>
          </div>
          <div className="p-6 bg-[var(--surface2)] flex flex-col gap-2.5">
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-0.5">Results</p>
            <Stat variant="large" label="Year 1 annual income" value={fmt(result.yr1Annual)} sub={`${fmt(result.yr1Monthly)}/month`} />
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Final year (nominal)" value={fmt(result.finalNominal)} variant="green" />
              <Stat label="Final year (real)" value={fmt(result.finalReal)} variant="purple" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Total dividends earned" value={fmtK(result.totalDivs)} />
              <Stat label="Portfolio value at end" value={fmtK(result.portVal)} variant="blue" />
            </div>
          </div>
        </div>
        <div className="px-6 py-5 border-t border-[var(--border)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[12px] font-semibold">Annual dividend income</h3>
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
      <EduBox title="Dividend investing basics">
        <EduCard title="Dividend yield">Annual dividend per share divided by share price. A 3.5% yield on $25,000 generates $875/year in income.</EduCard>
        <EduCard title="Dividend growth">Companies that consistently grow dividends over time (Dividend Aristocrats) can significantly boost income over long periods.</EduCard>
        <EduCard title="Reinvesting dividends">Reinvesting dividends (DRIP) compounds growth dramatically. The calculator shows income as cash — reinvesting would produce even higher portfolio values.</EduCard>
        <EduCard title="Real vs nominal">Inflation reduces the purchasing power of dividend income over time. The inflation-adjusted view shows what your income is truly worth in today's dollars.</EduCard>
      </EduBox>
      <Disclaimer>Projections assume constant growth rates. Dividends are not guaranteed. Not financial advice.</Disclaimer>
    </div>
  );
}
