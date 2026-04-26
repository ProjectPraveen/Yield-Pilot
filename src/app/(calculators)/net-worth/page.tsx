'use client';
import { useState } from 'react';
import { Card, Stat, PageHero, EduBox, EduCard, Disclaimer, SaveButton, Input } from '@/components/ui';
import { fmt } from '@/lib/utils';
import { useSaveCalculation } from '@/hooks/useSaveCalculation';

interface Item { label: string; value: number; }

export default function NetWorthPage() {
  const [assets, setAssets] = useState<Item[]>([
    { label: 'Checking & savings', value: 15000 },
    { label: 'Retirement accounts', value: 45000 },
    { label: 'Home value', value: 300000 },
    { label: 'Vehicle(s)', value: 20000 },
  ]);
  const [liabilities, setLiabilities] = useState<Item[]>([
    { label: 'Mortgage balance', value: 240000 },
    { label: 'Auto loan', value: 12000 },
    { label: 'Credit card debt', value: 3000 },
    { label: 'Student loans', value: 18000 },
  ]);
  const { save, saved } = useSaveCalculation();

  const totalAssets = assets.reduce((s, a) => s + (a.value || 0), 0);
  const totalLiabilities = liabilities.reduce((s, l) => s + (l.value || 0), 0);
  const netWorth = totalAssets - totalLiabilities;

  function updateItem(list: Item[], setList: (i: Item[]) => void, idx: number, field: 'label' | 'value', val: string) {
    const updated = [...list];
    updated[idx] = { ...updated[idx], [field]: field === 'value' ? parseFloat(val) || 0 : val };
    setList(updated);
  }

  function addItem(list: Item[], setList: (i: Item[]) => void) {
    setList([...list, { label: 'New item', value: 0 }]);
  }

  function removeItem(list: Item[], setList: (i: Item[]) => void, idx: number) {
    setList(list.filter((_, i) => i !== idx));
  }

  return (
    <div className="max-w-[1100px] mx-auto px-6 pb-16 animate-fade-up">
      <PageHero eyebrow="Planning" title={<>Net Worth <span className="text-[var(--accent)]">Tracker</span></>} subtitle="Add your assets and liabilities to see your complete financial picture." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        <Stat variant="large" label="Net Worth" value={fmt(netWorth)} sub={netWorth >= 0 ? 'Positive net worth' : 'Negative net worth'} />
        <Stat label="Total assets" value={fmt(totalAssets)} variant="green" />
        <Stat label="Total liabilities" value={fmt(totalLiabilities)} variant="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-bold text-[var(--accent)]">Assets</h3>
              <span className="font-mono text-[13px] font-medium text-[var(--accent)]">{fmt(totalAssets)}</span>
            </div>
            <div className="space-y-2">
              {assets.map((a, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input value={a.label} onChange={e => updateItem(assets, setAssets, i, 'label', e.target.value)} className="flex-1 text-[12px] bg-[var(--surface2)] border border-[var(--border)] rounded-[6px] px-2.5 py-1.5 outline-none focus:border-[var(--accent)]" />
                  <div className="relative w-32">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-[var(--text3)]">$</span>
                    <input type="number" value={a.value} onChange={e => updateItem(assets, setAssets, i, 'value', e.target.value)} className="w-full text-[12px] font-mono bg-white border border-[var(--border)] rounded-[6px] pl-5 pr-2 py-1.5 outline-none focus:border-[var(--accent)]" />
                  </div>
                  <button onClick={() => removeItem(assets, setAssets, i)} className="text-[var(--text3)] hover:text-[var(--red)] text-[16px] leading-none">×</button>
                </div>
              ))}
            </div>
            <button onClick={() => addItem(assets, setAssets)} className="mt-3 text-[11px] font-medium text-[var(--accent)] border border-[var(--accent-line)] rounded-[5px] px-3 py-1.5 hover:bg-[var(--accent-dim)] transition-colors">+ Add asset</button>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-bold text-[var(--red)]">Liabilities</h3>
              <span className="font-mono text-[13px] font-medium text-[var(--red)]">{fmt(totalLiabilities)}</span>
            </div>
            <div className="space-y-2">
              {liabilities.map((l, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input value={l.label} onChange={e => updateItem(liabilities, setLiabilities, i, 'label', e.target.value)} className="flex-1 text-[12px] bg-[var(--surface2)] border border-[var(--border)] rounded-[6px] px-2.5 py-1.5 outline-none focus:border-[var(--accent)]" />
                  <div className="relative w-32">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-[var(--text3)]">$</span>
                    <input type="number" value={l.value} onChange={e => updateItem(liabilities, setLiabilities, i, 'value', e.target.value)} className="w-full text-[12px] font-mono bg-white border border-[var(--border)] rounded-[6px] pl-5 pr-2 py-1.5 outline-none focus:border-[var(--accent)]" />
                  </div>
                  <button onClick={() => removeItem(liabilities, setLiabilities, i)} className="text-[var(--text3)] hover:text-[var(--red)] text-[16px] leading-none">×</button>
                </div>
              ))}
            </div>
            <button onClick={() => addItem(liabilities, setLiabilities)} className="mt-3 text-[11px] font-medium text-[var(--red)] border border-[rgba(220,53,69,0.2)] rounded-[5px] px-3 py-1.5 hover:bg-[var(--red-dim)] transition-colors">+ Add liability</button>
          </div>
        </Card>
      </div>

      <div className="mt-3">
        <SaveButton onClick={async () => { await save({ type: 'networth', name: 'Net Worth Snapshot', summary: `Assets: ${fmt(totalAssets)} · Liabilities: ${fmt(totalLiabilities)}`, resultValue: fmt(netWorth) }); }} saving={saved} />
      </div>

      <EduBox title="Building net worth">
        <EduCard title="What is net worth?">Net worth = total assets minus total liabilities. It's the most comprehensive snapshot of your financial health at a single point in time.</EduCard>
        <EduCard title="Track over time">Net worth grows by increasing assets (saving, investing) and decreasing liabilities (paying down debt). Track it quarterly to see your progress.</EduCard>
        <EduCard title="Positive vs negative">Negative net worth is common, especially for young people with student loans. Focus on the trend — consistent improvement matters more than the current number.</EduCard>
        <EduCard title="Home equity">Include your home's market value as an asset and your mortgage balance as a liability. The difference is your home equity.</EduCard>
      </EduBox>
      <Disclaimer>For self-assessment purposes only. Asset values are estimates. Not financial advice.</Disclaimer>
    </div>
  );
}
