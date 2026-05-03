'use client';
import { useState } from 'react';
import { Card, Stat, PageHero, EduBox, EduCard, Disclaimer, SaveButton, SegmentedControl } from '@/components/ui';
import { calcSalary } from '@/lib/calculators';
import { fmt } from '@/lib/utils';
import { useSaveCalculation } from '@/hooks/useSaveCalculation';

function ClearInput({ label, value, onChange, prefix, suffix, min, step }: {
  label: string; value: number; onChange: (v: number) => void;
  prefix?: string; suffix?: string; min?: number; step?: number;
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
          min={min ?? 0}
          step={step ?? 1}
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

export default function SalaryPage() {
  const [hourly, setHourly] = useState(25);
  const [regHrs, setRegHrs] = useState(40);
  const [otHrs, setOtHrs] = useState(0);
  const [otMult, setOtMult] = useState('1.5');
  const [inputType, setInputType] = useState('hourly');
  const [annual, setAnnual] = useState(52000);
  const { save, saved } = useSaveCalculation();

  const rate = inputType === 'hourly' ? hourly : annual / (regHrs * 52);
  const result = calcSalary(rate, regHrs, otHrs, parseFloat(otMult));
  const derivedHourly = inputType === 'annual' ? annual / (regHrs * 52) : hourly;

  return (
    <div className="max-w-[1100px] mx-auto px-6 pb-16 animate-fade-up">
      <PageHero eyebrow="Planning" title={<>Salary <span className="text-[var(--accent)]">Calculator</span></>} subtitle="Convert hourly to annual salary and factor in overtime for a complete income picture." />
      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr]">
          <div className="p-6 border-b lg:border-b-0 lg:border-r border-[var(--border)]">
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-3">Parameters</p>
            <div className="space-y-3">
              <SegmentedControl label="Input type" options={[{ label: 'Hourly rate', value: 'hourly' }, { label: 'Annual salary', value: 'annual' }]} value={inputType} onChange={setInputType} />
              {inputType === 'hourly'
                ? <ClearInput label="Hourly rate" value={hourly} onChange={setHourly} prefix="$" step={0.5} />
                : <ClearInput label="Annual salary" value={annual} onChange={setAnnual} prefix="$" step={1000} />
              }
              <div className="grid grid-cols-2 gap-2.5">
                <ClearInput label="Regular hrs/week" value={regHrs} onChange={setRegHrs} min={1} />
                <ClearInput label="Overtime hrs/week" value={otHrs} onChange={setOtHrs} />
              </div>
              <SegmentedControl label="Overtime multiplier" options={[{ label: '1.5× time & half', value: '1.5' }, { label: '2× double', value: '2' }, { label: '1× straight', value: '1' }]} value={otMult} onChange={setOtMult} />
              <SaveButton onClick={async () => { await save({ type: 'salary', name: 'Salary Calculation', summary: `Annual: ${fmt(result.total)} · Monthly: ${fmt(result.monthly)}`, resultValue: fmt(result.total) }); }} saving={saved} />
            </div>
          </div>
          <div className="p-6 bg-[var(--surface2)] flex flex-col gap-2.5">
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-0.5">Results</p>
            <Stat variant="large" label="Total annual income" value={fmt(result.total)} sub={otHrs > 0 ? `Reg: ${fmt(result.regAnnual)} + OT: ${fmt(result.otAnnual)}` : `${regHrs} hrs/week`} />
            <div className="grid grid-cols-2 gap-2">
              <Stat label={inputType === 'annual' ? 'Equivalent hourly rate' : 'Equivalent annual salary'} value={inputType === 'annual' ? `$${derivedHourly.toFixed(2)}/hr` : fmt(result.regAnnual)} variant="green" />
              <Stat label="Monthly" value={fmt(result.monthly)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Biweekly" value={fmt(result.biweekly)} />
              <Stat label="Weekly" value={fmt(result.weekly)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Daily" value={fmt(result.daily)} />
              <Stat label="Hourly rate" value={`$${derivedHourly.toFixed(2)}/hr`} />
            </div>
          </div>
        </div>
      </Card>
      <EduBox title="Understanding your compensation">
        <EduCard title="Hourly to annual">Multiply your hourly rate by hours per week, then by 52. At $25/hr and 40 hrs/week that is $52,000/year before taxes.</EduCard>
        <EduCard title="Overtime pay">Federal law (FLSA) requires 1.5x pay for hours over 40/week for eligible employees. Some employers offer double time for holidays or extended shifts.</EduCard>
        <EduCard title="Gross vs net">These figures are gross income before taxes, insurance, retirement contributions, and other deductions. Your take-home will be lower.</EduCard>
        <EduCard title="Benefits value">Total compensation includes health insurance, retirement match, PTO, and other benefits — often worth 20-30% on top of your base salary.</EduCard>
      </EduBox>
      <Disclaimer>Gross income only. Does not include taxes, benefits deductions, or other withholdings. Not financial advice.</Disclaimer>
    </div>
  );
}
