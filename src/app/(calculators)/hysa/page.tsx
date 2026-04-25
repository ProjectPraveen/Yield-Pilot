'use client';

import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Input, Select, SegmentedControl, Card, Stat, InfoStrip, PageHero, EduBox, EduCard, Disclaimer, SaveButton } from '@/components/ui';
import { calcHYSAGrowth, ppy } from '@/lib/calculators';
import { fmt, fmtK } from '@/lib/utils';
import { useSaveCalculation } from '@/hooks/useSaveCalculation';

Chart.register(...registerables);

const NATL = 0.47;

const BANK_RATES = [
  { name: 'SoFi', rate: '4.60', tag: 'No minimum' },
  { name: 'Ally Bank', rate: '4.35', tag: 'No fees' },
  { name: 'Capital One', rate: '4.25', tag: '360 Performance' },
  { name: 'Amex', rate: '4.35', tag: 'No fees' },
];

export default function HYSAPage() {
  const [initial, setInitial] = useState(10000);
  const [apy, setApy] = useState(5.0);
  const [years, setYears] = useState(10);
  const [contrib, setContrib] = useState(200);
  const [freq, setFreq] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [results, setResults] = useState<ReturnType<typeof calcHYSAGrowth>>([]);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const { save, saved } = useSaveCalculation();

  useEffect(() => {
    const data = calcHYSAGrowth(initial, apy, contrib, freq, years);
    const natlData = calcHYSAGrowth(initial, NATL, contrib, freq, years);
    setResults(data);

    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const ctx = chartRef.current.getContext('2d')!;
    const grad = ctx.createLinearGradient(0, 0, 0, 220);
    grad.addColorStop(0, 'rgba(21,163,98,0.12)');
    grad.addColorStop(1, 'rgba(21,163,98,0)');

    chartInstance.current = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: data.map(d => `Yr ${d.year}`),
        datasets: [
          { label: 'Your HYSA', data: data.map(d => +d.balance.toFixed(2)), borderColor: '#15a362', borderWidth: 2, backgroundColor: grad, fill: true, tension: 0.4, pointRadius: 0, pointHoverRadius: 4 },
          { label: 'National avg', data: natlData.map(d => +d.balance.toFixed(2)), borderColor: '#dc3545', borderWidth: 2, backgroundColor: 'transparent', fill: false, tension: 0.4, pointRadius: 0, borderDash: [5, 3] },
          { label: 'Principal', data: data.map(d => +d.contr.toFixed(2)), borderColor: '#d1d5db', borderWidth: 1.5, backgroundColor: 'transparent', fill: false, tension: 0.4, pointRadius: 0, borderDash: [3, 3] },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1f2937', titleColor: '#9ca3af', bodyColor: '#f3f4f6', padding: 9, callbacks: { label: c => '  ' + c.dataset.label + ': ' + fmtK(c.parsed.y) } } },
        scales: {
          x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#9ca3af', font: { family: 'DM Mono', size: 10 }, maxTicksLimit: 10 }, border: { display: false } },
          y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#9ca3af', font: { family: 'DM Mono', size: 10 }, callback: (v) => fmtK(Number(v)) }, border: { display: false } },
        },
        interaction: { mode: 'index', intersect: false },
      },
    });
    return () => chartInstance.current?.destroy();
  }, [initial, apy, years, contrib, freq]);

  const fin = results[results.length - 1];
  const natlFin = calcHYSAGrowth(initial, NATL, contrib, freq, years).at(-1);
  const diff = fin && natlFin ? fin.balance - natlFin.balance : 0;
  const pct = natlFin && natlFin.balance > 0 ? ((diff / natlFin.balance) * 100).toFixed(1) : '0';

  async function handleSave() {
    if (!fin) return;
    await save({
      type: 'hysa',
      name: `HYSA — ${apy}% APY, ${years} yr`,
      summary: `Final: ${fmt(fin.balance)} · Interest: ${fmt(fin.interest)}`,
      resultValue: fmt(fin.balance),
      inputs: { initial, apy, years, contrib, freq },
    });
  }

  return (
    <div className="max-w-[1100px] mx-auto px-6 pb-16 animate-fade-up">
      <PageHero eyebrow="Savings" title={<>High Yield Savings <span className="text-[var(--accent)]">Calculator</span></>} subtitle="See how much more your money earns in a HYSA versus a traditional savings account." />

      <Card>
        {/* Inputs + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr]">
          <div className="p-6 border-b lg:border-b-0 lg:border-r border-[var(--border)]">
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-3">Parameters</p>
            <div className="space-y-3">
              <Input label="Initial deposit" type="number" prefix="$" value={initial} onChange={e => setInitial(Number(e.target.value))} min={0} step={100} />
              <div className="grid grid-cols-2 gap-2.5">
                <Input label="APY" type="number" suffix="%" value={apy} onChange={e => setApy(Number(e.target.value))} min={0} max={30} step={0.01} />
                <Input label="Years" type="number" value={years} onChange={e => setYears(Number(e.target.value))} min={1} max={50} />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <Input label="Recurring deposit" type="number" prefix="$" value={contrib} onChange={e => setContrib(Number(e.target.value))} min={0} step={50} />
                <SegmentedControl label="Frequency" options={[{ label: 'Daily', value: 'daily' }, { label: 'Monthly', value: 'monthly' }, { label: 'Weekly', value: 'weekly' }]} value={freq} onChange={v => setFreq(v as 'daily' | 'weekly' | 'monthly')} />
              </div>
              <SaveButton onClick={handleSave} saving={saved} />
            </div>
          </div>
          <div className="p-6 bg-[var(--surface2)] flex flex-col gap-2.5">
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-0.5">Results</p>
            <Stat variant="large" label="Final Balance" value={fin ? fmt(fin.balance) : '—'} sub={`Over ${years} yr at ${apy}% APY`} />
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Contributions" value={fin ? fmt(fin.contr) : '—'} />
              <Stat label="Interest earned" value={fin ? fmt(fin.interest) : '—'} variant="green" />
            </div>
            <InfoStrip variant="red">
              {fin && natlFin
                ? <>National avg ({NATL}%) = <strong>{fmt(natlFin.balance)}</strong>. Your HYSA earns <strong>{fmt(diff)}</strong> more — {pct}% higher.</>
                : 'Enter values to compare against the national average.'}
            </InfoStrip>
          </div>
        </div>

        {/* Chart */}
        <div className="px-6 py-5 border-t border-[var(--border)]">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h3 className="text-[12px] font-semibold text-[var(--text)]">Growth projection</h3>
            <div className="flex gap-3">
              {[{ color: '#15a362', label: 'Your HYSA' }, { color: '#dc3545', label: 'National avg' }, { color: '#d1d5db', label: 'Principal' }].map(l => (
                <div key={l.label} className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--text2)]">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: l.color }} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
          <div className="h-[200px] relative">
            <canvas ref={chartRef} />
          </div>
        </div>
      </Card>

      {/* Current rates */}
      <div className="mt-6">
        <h2 className="text-[16px] font-bold tracking-[-0.02em] mb-1">Current HYSA rates</h2>
        <p className="text-[13px] text-[var(--text2)] mb-3">Click a rate to apply it to the calculator.</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {BANK_RATES.map(b => (
            <div key={b.name} className="bg-white border border-[var(--border)] rounded-[10px] p-4 hover:border-[var(--accent-line)] hover:shadow-[var(--sh-md)] transition-all shadow-[var(--sh)]">
              <div className="text-[12px] font-bold text-[var(--text)] mb-1">{b.name}</div>
              <div className="flex items-baseline gap-1 my-1.5">
                <span className="font-mono text-[22px] font-medium text-[var(--accent)]">{b.rate}</span>
                <span className="font-mono text-[11px] text-[var(--text3)]">% APY</span>
              </div>
              <div className="text-[10px] text-[var(--text3)] mb-2.5 border border-[var(--border)] bg-[var(--surface2)] rounded-[4px] px-1.5 py-0.5 inline-block">{b.tag}</div>
              <button
                onClick={() => setApy(parseFloat(b.rate))}
                className="block w-full text-center text-[11px] font-medium text-[var(--text2)] border border-[var(--border2)] rounded-[7px] py-1.5 hover:bg-[var(--accent-dim)] hover:text-[var(--accent)] hover:border-[var(--accent-line)] transition-colors"
              >
                Use this rate
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <EduBox title="Glossary — key HYSA terms">
        <EduCard title="HYSA">A savings account at an online bank that pays significantly more than a traditional account. FDIC insured up to $250,000.</EduCard>
        <EduCard title="APY">Annual Percentage Yield — the real return including compounding. Higher APY means faster growth.</EduCard>
        <EduCard title="APR">The base rate before compounding. APY is always equal to or greater than APR for the same account.</EduCard>
        <EduCard title="Compounding">Earning interest on your principal and on interest already earned. Time is the most powerful variable in any savings plan.</EduCard>
        <EduCard title="Initial deposit">The lump sum you deposit when opening. Everything else compounds on top of this.</EduCard>
        <EduCard title="Recurring contributions">Regular deposits after opening. Each one starts earning immediately, significantly accelerating total growth.</EduCard>
      </EduBox>

      <Disclaimer>
        For educational purposes only. APY rates fluctuate and are not guaranteed. FDIC insurance applies per depositor per institution up to $250,000. Always verify rates with your financial institution. Not financial advice.
      </Disclaimer>
    </div>
  );
}
