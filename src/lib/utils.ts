import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fmt(n: number): string {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function fmtK(n: number): string {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return '$' + (n / 1_000).toFixed(1) + 'k';
  return fmt(n);
}

export function fmtMonths(m: number): string {
  const y = Math.floor(m / 12);
  const mo = m % 12;
  return ((y > 0 ? y + ' yr ' : '') + (mo > 0 ? mo + ' mo' : '')).trim() || '< 1 mo';
}

export function ppy(f: 'daily' | 'weekly' | 'monthly'): number {
  return f === 'daily' ? 365 : f === 'weekly' ? 52 : 12;
}
