'use client';
import { useState } from 'react';
import { Card, Stat, PageHero, EduBox, EduCard, Disclaimer, SaveButton, Input, SegmentedControl } from '@/components/ui';
import { calcSalary } from '@/lib/calculators';
import { fmt } from '@/lib/utils';
import { useSaveCalculation } from '@/hooks/useSaveCalculation';

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

  return (
    <div className="max-w-[1100px] mx-auto px-6 pb-16 animate-fade-up">
      <PageHero eyebrow="Planning" title={<>Salary <span className="text-[var(--accent)]">Calculator</span></>} subtitle="Convert hourly to annual salary and factor in overtime for a complete income picture." />
      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr]">
          <div className="p-6 border-b lg:border-b-0 lg:border-r border-[var(--border)]">
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-3">Parameters</p>
            <div className="space-y-3">
              <SegmentedControl label="Input type" options={[{ label: 'Hourly rate', value: 'hourly' }, { label: 'Annual salary', value: 'annual' }]} value={inputType} onChange={setInputType} />
              {inputType === 'hourly' ? <Input label="Hourly rate" type="number" prefix="$" value={hourly} onChange={e => setHourly(Number(e.target.value))} min={0} step={0.5} /> : <Input label="Annual salary" type="number" prefix="$" value={annual} onChange={e => setAnnual(Number(e.target.value))} min={0} step={1000} />}
              <div className="grid grid-cols-2 gap-2.5">
                <Input label="Regular hrs/week" type="number" value={regHrs} onChange={e => setRegHrs(Number(e.target.value))} min={1} max={168} />
                <Input label="Overtime hrs/week" type="number" value={otHrs} onChange={e => setOtHrs(Number(e.target.value))} min={0} max={80} />
              </div>
              <SegmentedControl label="Overtime multiplier" options={[{ label: '1.5× time & half', value: '1.5' }, { label: '2× double', value: '2' }, { label: '1× straight', value: '1' }]} value={otMult} onChange={setOtMult} />
              <SaveButton onClick={async () => { await save({ type: 'salary', name: 'Salary Calculation', summary: `Annual: ${fmt(result.total)} · Monthly: ${fmt(result.monthly)}`, resultValue: fmt(result.total) }); }} saving={saved} />
            </div>
          </div>
          <div className="p-6 bg-[var(--surface2)] flex flex-col gap-2.5">
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-0.5">Results</p>
            <Stat variant="large" label="Total annual income" value={fmt(result.total)} sub={otHrs > 0 ? `Reg: ${fmt(result.regAnnual)} + OT: ${fmt(result.otAnnual)}` : `${regHrs} hrs/week`} />
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Monthly" value={fmt(result.monthly)} variant="green" />
              <Stat label="Biweekly" value={fmt(result.biweekly)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Weekly" value={fmt(result.weekly)} />
              <Stat label="Daily" value={fmt(result.daily)} />
            </div>
          </div>
        </div>
      </Card>
      <Disclaimer>Gross income only. Does not include taxes, benefits deductions, or other withholdings. Not financial advice.</Disclaimer>
    </div>
  );
}
