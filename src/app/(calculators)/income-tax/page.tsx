'use client';
import { useState } from 'react';
import { Card, Stat, PageHero, EduBox, EduCard, Disclaimer, SaveButton, Select, SegmentedControl } from '@/components/ui';
import { calcIncomeTax, STD_DEDUCTION, type FilingStatus } from '@/lib/calculators';
import { fmt } from '@/lib/utils';
import { useSaveCalculation } from '@/hooks/useSaveCalculation';

const STATUS_LABELS: Record<FilingStatus, string> = {
  single: 'Single',
  married: 'Married filing jointly',
  marriedSep: 'Married filing separately',
  hoh: 'Head of household'
};

function ClearInput({ label, value, onChange, prefix, suffix }: {
  label: string; value: number; onChange: (v: number) => void; prefix?: string; suffix?: string;
}) {
  const [display, setDisplay] = useState(String(value));
  return (
    <div className="space-y-1">
      <label className="block text-[11px] font-semibold text-[var(--text2)] tracking-[0.01em]">{label}</label>
      <div className="relative flex items-center">
        {prefix && <span className="absolute left-2.5 text-[12px] font-mono text-[var(--text3)] pointer-events-none z-10">{prefix}</span>}
        <input
          type="number"
          value={display}
          onFocus={e => { if (parseFloat(e.target.value) === 0) setDisplay(''); e.target.select(); }}
          onBlur={e => { if (e.target.value === '') { setDisplay('0'); onChange(0); } }}
          onChange={e => { setDisplay(e.target.value); const n = parseFloat(e.target.value); if (!isNaN(n)) onChange(n); }}
          className={`w-full bg-white border border-[var(--border)] rounded-[7px] text-[13px] font-medium text-[var(--text)] outline-none transition-all focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[var(--accent-dim)] ${prefix ? 'pl-[22px] pr-3 py-2' : suffix ? 'pl-3 pr-7 py-2' : 'px-3 py-2'}`}
        />
        {suffix && <span className="absolute right-2.5 text-[11px] font-mono text-[var(--text3)] pointer-events-none">{suffix}</span>}
      </div>
    </div>
  );
}

export default function IncomeTaxPage() {
  const [income, setIncome] = useState(75000);
  const [status, setStatus] = useState<FilingStatus>('single');
  const [dedType, setDedType] = useState('standard');
  const [itemized, setItemized] = useState(0);
  const [preTax, setPreTax] = useState(0);
  const { save, saved } = useSaveCalculation();

  const ded = dedType === 'standard' ? STD_DEDUCTION[status] : itemized;
  const result = calcIncomeTax(income, status, ded, preTax);

  return (
    <div className="max-w-[1100px] mx-auto px-6 pb-16 animate-fade-up">
      <PageHero eyebrow="Tax" title={<>Income Tax <span className="text-[var(--accent)]">Calculator</span></>} subtitle="Estimate your federal tax, effective rate, and take-home pay with a full bracket breakdown." />
      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr]">
          <div className="p-6 border-b lg:border-b-0 lg:border-r border-[var(--border)]">
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-3">Parameters</p>
            <div className="space-y-3">
              <ClearInput label="Annual income" value={income} onChange={setIncome} prefix="$" />
              <Select label="Filing status" value={status} onChange={e => setStatus(e.target.value as FilingStatus)}>
                <option value="single">Single</option>
                <option value="married">Married filing jointly</option>
                <option value="marriedSep">Married filing separately</option>
                <option value="hoh">Head of household</option>
              </Select>
              <SegmentedControl label="Deduction type" options={[{ label: 'Standard', value: 'standard' }, { label: 'Itemized', value: 'itemized' }]} value={dedType} onChange={setDedType} />
              {dedType === 'standard'
                ? <p className="text-[11px] text-[var(--text3)]">Standard deduction: {fmt(STD_DEDUCTION[status])} for {STATUS_LABELS[status]}</p>
                : <ClearInput label="Itemized deduction amount" value={itemized} onChange={setItemized} prefix="$" />
              }
              <ClearInput label="Pre-tax contributions (401k, HSA)" value={preTax} onChange={setPreTax} prefix="$" />
              <SaveButton onClick={async () => { await save({ type: 'income-tax', name: `Income Tax — ${fmt(income)}`, summary: `Federal tax: ${fmt(result.tax)} · Effective: ${(result.effectiveRate * 100).toFixed(1)}%`, resultValue: fmt(result.takehome) }); }} saving={saved} />
            </div>
          </div>
          <div className="p-6 bg-[var(--surface2)] flex flex-col gap-2.5">
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-0.5">Results</p>
            <Stat variant="large" label="Annual take-home pay" value={fmt(result.takehome)} sub={`Taxable income: ${fmt(result.taxable)}`} />
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Federal tax owed" value={fmt(result.tax)} variant="red" />
              <Stat label="Effective tax rate" value={(result.effectiveRate * 100).toFixed(2) + '%'} variant="red" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Marginal tax rate" value={(result.marginalRate * 100) + '%'} />
              <Stat label="Monthly take-home" value={fmt(result.takehome / 12)} variant="green" />
            </div>
          </div>
        </div>
        <div className="px-6 py-5 border-t border-[var(--border)]">
          <h3 className="text-[12px] font-semibold mb-3">2024 Federal tax brackets — {STATUS_LABELS[status]}</h3>
          {status === 'marriedSep' && (
            <div className="mb-3 bg-[rgba(217,119,6,0.08)] border border-[rgba(217,119,6,0.18)] rounded-[7px] p-2.5 text-[11px] text-[#92400e]">
              Married filing separately often results in a higher tax bill than filing jointly. Consider comparing both options.
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-2 px-3 text-[10px] font-bold uppercase tracking-[0.05em] text-[var(--text3)]">Rate</th>
                  <th className="text-left py-2 px-3 text-[10px] font-bold uppercase tracking-[0.05em] text-[var(--text3)]">Income range</th>
                  <th className="text-left py-2 px-3 text-[10px] font-bold uppercase tracking-[0.05em] text-[var(--text3)]">Your income in bracket</th>
                  <th className="text-left py-2 px-3 text-[10px] font-bold uppercase tracking-[0.05em] text-[var(--text3)]">Tax in bracket</th>
                </tr>
              </thead>
              <tbody>
                {result.bracketRows.map((row, i) => (
                  <tr key={i} className={row.active ? 'bg-[var(--accent-dim)]' : ''}>
                    <td className={`py-2 px-3 font-mono font-medium ${row.active ? 'text-[var(--accent)]' : 'text-[var(--text2)]'}`}>{(row.rate * 100)}%</td>
                    <td className="py-2 px-3 font-mono text-[var(--text2)]">{fmt(row.low)} – {row.high === Infinity ? '∞' : fmt(row.high)}</td>
                    <td className="py-2 px-3 font-mono text-[var(--text2)]">{row.inBracket > 0 ? fmt(row.inBracket) : '—'}</td>
                    <td className="py-2 px-3 font-mono text-[var(--text2)]">{row.taxHere > 0 ? fmt(row.taxHere) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-[var(--text3)] mt-2">Highlighted row = your top bracket. Only income within each bracket is taxed at that rate.</p>
        </div>
      </Card>
      <EduBox title="How federal income tax works">
        <EduCard title="Progressive brackets">The US uses a marginal tax system. Only income within each bracket is taxed at that rate — not your total income.</EduCard>
        <EduCard title="Filing status matters">Married filing jointly typically results in lower taxes than separately. Filing separately can make sense in specific situations — consult a tax professional.</EduCard>
        <EduCard title="Standard deduction">For 2024: $14,600 single or married separately, $29,200 married jointly, $21,900 head of household.</EduCard>
        <EduCard title="Pre-tax contributions">401(k) and HSA contributions reduce taxable income, lowering both your tax bill and effective rate significantly.</EduCard>
      </EduBox>
      <Disclaimer>Federal estimates only. State and local taxes not included. Not tax advice. Consult a qualified tax professional.</Disclaimer>
    </div>
  );
}
