'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

// ─── Button ───────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md';
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-all duration-[130ms] disabled:opacity-50 disabled:cursor-not-allowed',
        size === 'sm' ? 'text-[11px] px-3 py-1.5 rounded-[6px]' : 'text-[13px] px-4 py-2 rounded-[7px]',
        variant === 'primary' && 'bg-[var(--accent)] text-white hover:bg-[var(--accent-h)] shadow-[0_1px_3px_rgba(21,163,98,0.3)]',
        variant === 'ghost' && 'text-[var(--text2)] border border-[var(--border2)] hover:bg-[var(--surface2)] hover:text-[var(--text)]',
        variant === 'outline' && 'text-[var(--accent)] border border-[var(--accent-line)] hover:bg-[var(--accent-dim)]',
        variant === 'danger' && 'text-[var(--red)] border border-[rgba(220,53,69,0.2)] hover:bg-[var(--red-dim)]',
        className
      )}
      {...props}
    />
  )
);
Button.displayName = 'Button';

// ─── Input ────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefix?: string;
  suffix?: string;
  label?: string;
  error?: string;
}
export function Input({ prefix, suffix, label, error, className, id, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && <label htmlFor={id} className="block text-[11px] font-semibold text-[var(--text2)] tracking-[0.01em]">{label}</label>}
      <div className="relative flex items-center">
        {prefix && <span className="absolute left-2.5 text-[12px] font-mono text-[var(--text3)] pointer-events-none z-10">{prefix}</span>}
        <input
          id={id}
          className={cn(
            'w-full bg-white border border-[var(--border)] rounded-[7px] text-[13px] font-medium text-[var(--text)] outline-none transition-all duration-[130ms]',
            'focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[var(--accent-dim)]',
            prefix ? 'pl-[22px] pr-3 py-2' : suffix ? 'pl-3 pr-7 py-2' : 'px-3 py-2',
            error && 'border-[var(--red)]',
            className
          )}
          {...props}
        />
        {suffix && <span className="absolute right-2.5 text-[11px] font-mono text-[var(--text3)] pointer-events-none">{suffix}</span>}
      </div>
      {error && <p className="text-[11px] text-[var(--red)]">{error}</p>}
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}
export function Select({ label, id, className, children, ...props }: SelectProps) {
  return (
    <div className="space-y-1">
      {label && <label htmlFor={id} className="block text-[11px] font-semibold text-[var(--text2)] tracking-[0.01em]">{label}</label>}
      <select
        id={id}
        className={cn(
          'w-full bg-white border border-[var(--border)] rounded-[7px] text-[13px] font-medium text-[var(--text)] outline-none transition-all duration-[130ms] px-3 py-2 cursor-pointer',
          'focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[var(--accent-dim)]',
          'appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\' viewBox=\'0 0 10 6\'%3E%3Cpath d=\'M1 1l4 4 4-4\' stroke=\'%236b7280\' stroke-width=\'1.5\' fill=\'none\' stroke-linecap=\'round\'/%3E%3C/svg%3E")] bg-no-repeat bg-[position:right_10px_center] pr-7',
          className
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

// ─── SegmentedControl ─────────────────────────────────────────
interface SegmentOption { label: string; value: string; }
interface SegmentedControlProps {
  options: SegmentOption[];
  value: string;
  onChange: (v: string) => void;
  label?: string;
}
export function SegmentedControl({ options, value, onChange, label }: SegmentedControlProps) {
  return (
    <div className="space-y-1">
      {label && <div className="text-[11px] font-semibold text-[var(--text2)] tracking-[0.01em]">{label}</div>}
      <div className="flex border border-[var(--border)] rounded-[7px] overflow-hidden bg-[var(--surface2)]">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex-1 py-1.5 px-2 text-[11px] font-medium transition-all border-r border-[var(--border)] last:border-0',
              value === opt.value
                ? 'bg-white text-[var(--accent)] font-bold shadow-[var(--sh)]'
                : 'text-[var(--text2)] hover:text-[var(--text)]'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────
export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-white border border-[var(--border)] rounded-[14px] shadow-[var(--sh-md)] overflow-hidden', className)}>
      {children}
    </div>
  );
}

// ─── Stat ─────────────────────────────────────────────────────
interface StatProps {
  label: string;
  value: string;
  variant?: 'default' | 'green' | 'red' | 'blue' | 'purple' | 'large';
  sub?: string;
}
export function Stat({ label, value, variant = 'default', sub }: StatProps) {
  if (variant === 'large') {
    return (
      <div className="bg-white border border-[var(--border)] rounded-[10px] p-[14px_16px] shadow-[var(--sh)]">
        <div className="text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--text3)] mb-1">{label}</div>
        <div className="font-mono text-[24px] font-medium text-[var(--accent)] tracking-[-0.02em]">{value}</div>
        {sub && <div className="text-[10px] text-[var(--text3)] mt-0.5">{sub}</div>}
      </div>
    );
  }
  const colorMap = { default: 'text-[var(--text)]', green: 'text-[var(--accent)]', red: 'text-[var(--red)]', blue: 'text-[var(--blue)]', purple: 'text-[var(--purple)]' };
  return (
    <div className="bg-white border border-[var(--border)] rounded-[7px] p-[10px_12px]">
      <div className="text-[10px] font-bold tracking-[0.06em] uppercase text-[var(--text3)] mb-0.5">{label}</div>
      <div className={cn('font-mono text-[14px] font-medium', colorMap[variant as keyof typeof colorMap] || colorMap.default)}>{value}</div>
    </div>
  );
}

// ─── InfoStrip ────────────────────────────────────────────────
export function InfoStrip({ children, variant = 'green' }: { children: React.ReactNode; variant?: 'green' | 'red' }) {
  return (
    <div className={cn(
      'flex items-start gap-2 rounded-[7px] p-[8px_10px] border text-[11px] leading-[1.5]',
      variant === 'green' ? 'bg-[var(--accent-dim)] border-[var(--accent-line)] text-[#065f46]' : 'bg-[var(--red-dim)] border-[rgba(220,53,69,0.14)] text-[#9b1c1c]'
    )}>
      <div className={cn('w-1 h-1 rounded-full flex-shrink-0 mt-1', variant === 'green' ? 'bg-[var(--accent)]' : 'bg-[var(--red)]')} />
      <p>{children}</p>
    </div>
  );
}

// ─── PageHero ─────────────────────────────────────────────────
export function PageHero({ eyebrow, title, subtitle }: { eyebrow: string; title: React.ReactNode; subtitle: string }) {
  return (
    <div className="py-10 pb-7 text-center animate-fade-up">
      <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--accent)] bg-[var(--accent-dim)] border border-[var(--accent-line)] px-2.5 py-1 rounded-full mb-3">
        {eyebrow}
      </div>
      <h1 className="text-[clamp(20px,3vw,28px)] font-bold leading-[1.15] tracking-[-0.025em] mb-2">{title}</h1>
      <p className="text-[13px] text-[var(--text2)] max-w-[400px] mx-auto">{subtitle}</p>
    </div>
  );
}

// ─── EduBox ───────────────────────────────────────────────────
export function EduBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-[14px] p-5 shadow-[var(--sh)] mt-4">
      <h3 className="text-[13px] font-bold text-[var(--text)] mb-3">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {children}
      </div>
    </div>
  );
}

export function EduCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-[7px] p-3">
      <h4 className="text-[12px] font-bold text-[var(--text)] mb-1">{title}</h4>
      <p className="text-[11px] text-[var(--text2)] leading-relaxed">{children}</p>
    </div>
  );
}

// ─── Disclaimer ───────────────────────────────────────────────
export function Disclaimer({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-[10px] p-3.5 mt-5">
      <p className="text-[11px] text-[var(--text3)] leading-relaxed">{children}</p>
    </div>
  );
}

// ─── SaveButton ───────────────────────────────────────────────
export function SaveButton({ onClick, saving }: { onClick: () => void; saving?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="text-[11px] font-semibold text-[var(--accent)] border border-[var(--accent-line)] rounded-[5px] px-3 py-1.5 mt-2 hover:bg-[var(--accent-dim)] transition-colors"
    >
      {saving ? 'Saved!' : 'Save calculation'}
    </button>
  );
}
