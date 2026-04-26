'use client';
import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Card, Stat, PageHero, EduBox, EduCard, Disclaimer, SaveButton, Input } from '@/components/ui';
import { calcInflation } from '@/lib/calculators';
import { fmt } from '@/lib/utils';
import { useSaveCalculation } from '@/hooks/useSaveCalculation';

Chart.register(...registerables);

export default function InflationPage() {
  const [amount, setAmount] = useState(1000);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(3);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const { save, saved } = useSaveCalculation();

  const result = calcInflation(amount, years, rate);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();
    chartInstance.current = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: Array.from({ length: years }, (_, i) => `Yr ${i + 1}`),
        datasets: [{ label: 'Purchasing power', data: result.vals, borderColor: '#dc3545', borderWidth: 2, backgroundColor: 'rgba(220,53,69,0.08)', fill: true, tension: 0.4, pointRadius: 0 }],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#9ca3af', font: { size: 10 }, maxTicksLimit: 10 }, grid: { color: 'rgba(0,0,0,0.04)' }, border: { display: false } }, y: { ticks: { color: '#9ca3af', font: { size: 10 }, callback: (v) => fmt(Number(v)) }, grid: { color: 'rgba(0,0,0,0.04)' }, border: { display: false } } } },
    });
    return () => chartInstance.current?.destroy();
  }, [amount, years, rate]);

  return (
    <div className="max-w-[1100px] mx-auto px-6 pb-16 animate-fade-up">
      <PageHero eyebrow="Planning" title={<>Inflation <span className="text-[var(--accent)]">Calculator</span></>} subtitle="See how inflation erodes the purchasing power of your money over time." />
      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr]">
          <div className="p-6 border-b lg:border-b-0 lg:border-r border-[var(--border)]">
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-3">Parameters</p>
            <div className="space-y-3">
              <Input label="Current amount" type="number" prefix="$" value={amount} onChange={e => setAmount(Number(e.target.value))} min={0} step={100} />
              <div className="grid grid-cols-2 gap-2.5">
                <Input label="Years" type="number" value={years} onChange={e => setYears(Number(e.target.value))} min={1} max={50} />
                <Input label="Inflation rate" type="number" suffix="%" value={rate} onChange={e => setRate(Number(e.target.value))} min={0} max={20} step={0.1} />
              </div>
              <SaveButton onClick={async () => { await save({ type: 'inflation', name: `Inflation — ${fmt(amount)} over ${years} yr`, summary: `Future value needed: ${fmt(result.future)} · Purchasing power: ${fmt(result.power)}`, resultValue: fmt(result.power) }); }} saving={saved} />
            </div>
          </div>
          <div className="p-6 bg-[var(--surface2)] flex flex-col gap-2.5">
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-0.5">Results</p>
            <Stat variant="large" label={`Purchasing power in ${years} years`} value={fmt(result.power)} sub={`In today's dollars`} />
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Value lost to inflation" value={fmt(result.lost)} variant="red" />
              <Stat label="Future equivalent needed" value={fmt(result.future)} />
            </div>
          </div>
        </div>
        <div className="px-6 py-5 border-t border-[var(--border)]">
          <h3 className="text-[12px] font-semibold mb-3">Purchasing power over time</h3>
          <div className="h-[180px]"><canvas ref={chartRef} /></div>
        </div>
      </Card>
      <EduBox title="Understanding inflation">
        <EduCard title="What is inflation?">Inflation is the rate at which the general price level rises, reducing purchasing power. At 3% inflation, $100 today buys only $55 worth of goods in 20 years.</EduCard>
        <EduCard title="Historical US inflation">The US long-run average inflation rate is approximately 3%. The Fed targets 2% annual inflation as a healthy level.</EduCard>
        <EduCard title="Protecting your money">Keeping money in a savings account earning less than inflation means losing real value. Invest in assets that historically outpace inflation.</EduCard>
        <EduCard title="TIPS">Treasury Inflation-Protected Securities (TIPS) are government bonds that adjust their principal based on inflation, offering a hedge against it.</EduCard>
      </EduBox>
      <Disclaimer>For educational purposes only. Inflation rates are variable and unpredictable. Not financial advice.</Disclaimer>
    </div>
  );
}
