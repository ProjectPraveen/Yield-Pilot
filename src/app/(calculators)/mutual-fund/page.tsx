'use client';
import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Card, Stat, PageHero, EduBox, EduCard, Disclaimer, SaveButton, Input } from '@/components/ui';
import { calcMutualFund } from '@/lib/calculators';
import { fmt, fmtK } from '@/lib/utils';
import { useSaveCalculation } from '@/hooks/useSaveCalculation';

Chart.register(...registerables);

export default function MutualFundPage() {
  const [init, setInit] = useState(10000);
  const [contrib, setContrib] = useState(500);
  const [years, setYears] = useState(20);
  const [grossRet, setGrossRet] = useState(8);
  const [expense, setExpense] = useState(0.5);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const { save, saved } = useSaveCalculation();

  const result = calcMutualFund(init, contrib, years, grossRet, expense);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();
    chartInstance.current = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: result.labels,
        datasets: [
          { label: 'Net balance', data: result.netVals, borderColor: '#15a362', borderWidth: 2, backgroundColor: 'rgba(21,163,98,0.08)', fill: true, tension: 0.4, pointRadius: 0 },
          { label: 'Contributions', data: result.contribVals, borderColor: '#2563eb', borderWidth: 1.5, backgroundColor: 'transparent', fill: false, tension: 0.4, pointRadius: 0, borderDash: [5, 3] },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => '  ' + c.dataset.label + ': ' + fmtK(c.parsed.y ?? 0) } } }, scales: { x: { ticks: { color: '#9ca3af', font: { size: 10 }, maxTicksLimit: 10 }, grid: { color: 'rgba(0,0,0,0.04)' }, border: { display: false } }, y: { ticks: { color: '#9ca3af', font: { size: 10 }, callback: (v) => fmtK(Number(v)) }, grid: { color: 'rgba(0,0,0,0.04)' }, border: { display: false } } } },
    });
    return () => chartInstance.current?.destroy();
  }, [init, contrib, years, grossRet, expense]);

  return (
    <div className="max-w-[1100px] mx-auto px-6 pb-16 animate-fade-up">
      <PageHero eyebrow="Growth" title={<>Mutual Fund <span className="text-[var(--accent)]">Calculator</span></>} subtitle="Project fund growth and see the real drag that expense ratios have on long-term returns." />
      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr]">
          <div className="p-6 border-b lg:border-b-0 lg:border-r border-[var(--border)]">
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-3">Parameters</p>
            <div className="space-y-3">
              <Input label="Initial investment" type="number" prefix="$" value={init} onChange={e => setInit(Number(e.target.value))} min={0} step={500} />
              <div className="grid grid-cols-2 gap-2.5">
                <Input label="Monthly contribution" type="number" prefix="$" value={contrib} onChange={e => setContrib(Number(e.target.value))} min={0} step={50} />
                <Input label="Years" type="number" value={years} onChange={e => setYears(Number(e.target.value))} min={1} max={50} />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <Input label="Gross annual return" type="number" suffix="%" value={grossRet} onChange={e => setGrossRet(Number(e.target.value))} min={0} max={30} step={0.1} />
                <Input label="Expense ratio" type="number" suffix="%" value={expense} onChange={e => setExpense(Number(e.target.value))} min={0} max={3} step={0.01} />
              </div>
              <SaveButton onClick={async () => { await save({ type: 'mutual-fund', name: `Mutual Fund — ${grossRet}% return`, summary: `Final: ${fmtK(result.final)} · Expense drag: ${fmtK(result.drag)}`, resultValue: fmtK(result.final) }); }} saving={saved} />
            </div>
          </div>
          <div className="p-6 bg-[var(--surface2)] flex flex-col gap-2.5">
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-0.5">Results</p>
            <Stat variant="large" label="Final balance (after expenses)" value={fmtK(result.final)} sub={`Net return: ${(grossRet - expense).toFixed(2)}% annually`} />
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Total contributions" value={fmtK(result.totalContribs)} />
              <Stat label="Investment growth" value={fmtK(result.growth)} variant="green" />
            </div>
            <Stat label="Cost of expense ratio (drag)" value={fmtK(result.drag)} variant="red" />
          </div>
        </div>
        <div className="px-6 py-5 border-t border-[var(--border)]">
          <h3 className="text-[12px] font-semibold mb-3">Balance over time</h3>
          <div className="h-[180px]"><canvas ref={chartRef} /></div>
        </div>
      </Card>
      <EduBox title="Mutual fund basics">
        <EduCard title="Expense ratio">The annual fee charged by the fund, expressed as a percentage of assets. Even a small difference (0.5% vs 1%) compounds into tens of thousands over decades.</EduCard>
        <EduCard title="Index funds">Index funds typically have expense ratios under 0.1%, far lower than actively managed funds. Over long periods, most active funds underperform index funds after fees.</EduCard>
        <EduCard title="Dollar cost averaging">Investing a fixed amount monthly regardless of market conditions reduces the risk of investing a lump sum at the wrong time.</EduCard>
        <EduCard title="Diversification">Mutual funds spread risk across many holdings. A broad market index fund owns thousands of companies, reducing individual stock risk dramatically.</EduCard>
      </EduBox>
      <Disclaimer>Projections assume constant return rates. Actual returns vary significantly. Not financial advice.</Disclaimer>
    </div>
  );
}
