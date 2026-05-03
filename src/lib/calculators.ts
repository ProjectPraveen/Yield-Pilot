// ─── HYSA ────────────────────────────────────────────────────
export function calcHYSAGrowth(
  principal: number,
  apy: number,
  contrib: number,
  freq: 'daily' | 'weekly' | 'monthly',
  years: number
) {
  const dr = apy / 100 / 365;
  const pp = freq === 'daily' ? 365 : freq === 'weekly' ? 52 : 12;
  const dpd = 365 / pp;
  let bal = principal, contr = principal;
  const out: { year: number; balance: number; contr: number; interest: number }[] = [];
  for (let d = 1; d <= years * 365; d++) {
    if (d > 1 && Math.round((d - 1) % dpd) === 0) { bal += contrib; contr += contrib; }
    bal *= (1 + dr);
    if (d % 365 === 0) out.push({ year: d / 365, balance: bal, contr, interest: bal - contr });
  }
  return out;
}

// ─── CREDIT CARD ─────────────────────────────────────────────
export function ccAmortize(balance: number, apr: number, payment: number) {
  const mr = apr / 100 / 12;
  const rows: { month: number; payment: number; interest: number; balance: number }[] = [];
  let b = balance, ti = 0;
  for (let m = 1; m <= 600; m++) {
    if (b <= 0) break;
    const ic = b * mr;
    const pay = Math.min(payment, b + ic);
    b = b + ic - pay;
    ti += ic;
    rows.push({ month: m, payment: pay, interest: ic, balance: Math.max(b, 0) });
    if (b <= 0.005) break;
  }
  return { rows, totalInt: ti, months: rows.length };
}

// ─── DEBT PAYOFF ──────────────────────────────────────────────
export interface Debt {
  name: string;
  balance: number;
  apr: number;
  minPayment: number;
}
export function calcDebtPayoff(debts: Debt[], extra: number, strategy: 'avalanche' | 'snowball') {
  const sorted = [...debts].sort((a, b) =>
    strategy === 'avalanche' ? b.apr - a.apr : a.balance - b.balance
  );
  const ds = sorted.map(d => ({ ...d, rem: d.balance }));
  let months = 0, ti = 0;
  const bals: number[] = [];
  while (ds.some(d => d.rem > 0.01) && months < 600) {
    months++;
    let xl = extra;
    ds.forEach(d => {
      if (d.rem <= 0) return;
      const ic = d.rem * d.apr / 100 / 12;
      d.rem += ic; ti += ic;
      d.rem = Math.max(0, d.rem - d.minPayment);
    });
    for (const d of ds) {
      if (d.rem <= 0) continue;
      const ap = Math.min(xl, d.rem);
      d.rem -= ap; xl -= ap;
      if (xl <= 0) break;
    }
    bals.push(ds.reduce((s, d) => s + d.rem, 0));
  }
  return { months, totalInt: ti, bals };
}

// ─── LOAN ─────────────────────────────────────────────────────
export function amortizeLoan(principal: number, annualRate: number, months: number) {
  const r = annualRate / 100 / 12;
  if (r === 0) return { payment: principal / months, totalInt: 0, cumP: [] as number[], cumI: [] as number[] };
  const payment = principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
  const totalInt = payment * months - principal;
  const cumP: number[] = [], cumI: number[] = [];
  let ip = 0, ii = 0, rem = principal;
  for (let m = 0; m < months; m++) {
    const ic = rem * r, pp = payment - ic;
    rem -= pp; ip += pp; ii += ic;
    cumP.push(+ip.toFixed(2)); cumI.push(+ii.toFixed(2));
  }
  return { payment, totalInt, cumP, cumI };
}

// ─── INCOME TAX ───────────────────────────────────────────────
const TX2024 = {
  single:    [{ limit: 11600,   rate: 0.10 }, { limit: 47150,  rate: 0.12 }, { limit: 100525, rate: 0.22 }, { limit: 191950, rate: 0.24 }, { limit: 243725, rate: 0.32 }, { limit: 609350, rate: 0.35 }, { limit: Infinity, rate: 0.37 }],
  married:   [{ limit: 23200,   rate: 0.10 }, { limit: 94300,  rate: 0.12 }, { limit: 201050, rate: 0.22 }, { limit: 383900, rate: 0.24 }, { limit: 487450, rate: 0.32 }, { limit: 731200, rate: 0.35 }, { limit: Infinity, rate: 0.37 }],
  marriedSep:[{ limit: 11600,   rate: 0.10 }, { limit: 47150,  rate: 0.12 }, { limit: 100525, rate: 0.22 }, { limit: 191950, rate: 0.24 }, { limit: 243725, rate: 0.32 }, { limit: 365600, rate: 0.35 }, { limit: Infinity, rate: 0.37 }],
  hoh:       [{ limit: 16550,   rate: 0.10 }, { limit: 63100,  rate: 0.12 }, { limit: 100500, rate: 0.22 }, { limit: 191950, rate: 0.24 }, { limit: 243700, rate: 0.32 }, { limit: 609350, rate: 0.35 }, { limit: Infinity, rate: 0.37 }],
};
export const STD_DEDUCTION = { single: 14600, married: 29200, marriedSep: 14600, hoh: 21900 };
export type FilingStatus = 'single' | 'married' | 'marriedSep' | 'hoh';

export function calcIncomeTax(income: number, status: FilingStatus, deduction: number, preTax: number) {
  const taxable = Math.max(0, income - preTax - deduction);
  const brackets = TX2024[status];
  let tax = 0, prev = 0;
  const bracketRows: { rate: number; low: number; high: number; inBracket: number; taxHere: number; active: boolean }[] = [];
  for (const b of brackets) {
    const inBracket = Math.max(0, Math.min(taxable, b.limit) - prev);
    const taxHere = inBracket * b.rate;
    bracketRows.push({ rate: b.rate, low: prev, high: b.limit, inBracket, taxHere, active: inBracket > 0 });
    if (inBracket > 0) tax += taxHere;
    prev = b.limit;
    if (taxable <= b.limit) break;
  }
  const margRate = brackets.find(b => taxable <= b.limit)?.rate ?? 0.37;
  return { tax, taxable, takehome: income - tax, effectiveRate: income > 0 ? tax / income : 0, marginalRate: margRate, bracketRows };
}

// ─── 401K ─────────────────────────────────────────────────────
export function calc401k(
  startAge: number, retireAge: number, balance: number,
  monthlyContrib: number, matchPct: number, annualReturn: number, inflation: number
) {
  const years = Math.max(1, retireAge - startAge);
  const mr = annualReturn / 100 / 12;
  const empMatch = monthlyContrib * (matchPct / 100);
  let b = balance;
  const nominal: number[] = [], real: number[] = [], contrib: number[] = [];
  let myC = 0, empC = 0;
  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) { b += monthlyContrib + empMatch; b *= (1 + mr); myC += monthlyContrib; empC += empMatch; }
    nominal.push(+b.toFixed(2));
    real.push(+(b / Math.pow(1 + inflation / 100, y)).toFixed(2));
    contrib.push(+(balance + myC + empC).toFixed(2));
  }
  return { nominalFinal: b, realFinal: real[real.length - 1], myContribs: myC, empContribs: empC, growth: b - balance - myC - empC, nominal, real, contrib, labels: Array.from({ length: years }, (_, i) => `Age ${startAge + i + 1}`) };
}

// ─── INFLATION ────────────────────────────────────────────────
export function calcInflation(amount: number, years: number, rate: number) {
  const future = amount * Math.pow(1 + rate / 100, years);
  const power = amount / Math.pow(1 + rate / 100, years);
  const vals = Array.from({ length: years }, (_, i) => +(amount / Math.pow(1 + rate / 100, i + 1)).toFixed(2));
  return { future, power, lost: amount - power, vals };
}

// ─── RETIREMENT ───────────────────────────────────────────────
export function calcRetirement(
  age: number, retireAge: number, savings: number,
  monthlyContrib: number, annualReturn: number, inflation: number
) {
  const years = Math.max(1, retireAge - age);
  const mr = annualReturn / 100 / 12;
  let b = savings;
  const nominal: number[] = [], real: number[] = [];
  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) { b += monthlyContrib; b *= (1 + mr); }
    nominal.push(+b.toFixed(2));
    real.push(+(b / Math.pow(1 + inflation / 100, y)).toFixed(2));
  }
  return { nominalFinal: b, realFinal: real[real.length - 1], monthlyIncome4pct: b * 0.04 / 12, nominal, real, labels: Array.from({ length: years }, (_, i) => `Age ${age + i + 1}`) };
}

// ─── SALARY ───────────────────────────────────────────────────
export function calcSalary(hourlyRate: number, regularHrs: number, otHrs: number, otMultiplier: number) {
  const regAnnual = hourlyRate * regularHrs * 52;
  const otAnnual = hourlyRate * otMultiplier * otHrs * 52;
  const total = regAnnual + otAnnual;
  return { total, regAnnual, otAnnual, monthly: total / 12, biweekly: total / 26, weekly: total / 52, daily: total / 260 };
}

// ─── CD ───────────────────────────────────────────────────────
export function calcCD(deposit: number, apy: number, termMonths: number, compFreq: number) {
  const years = termMonths / 12;
  const r = apy / 100;
  const final = deposit * Math.pow(1 + r / compFreq, compFreq * years);
  const effApy = (Math.pow(1 + r / compFreq, compFreq) - 1) * 100;
  return { final, interest: final - deposit, effApy };
}

// ─── BOND ─────────────────────────────────────────────────────
export function calcBond(faceValue: number, yield_: number, termYears: number, couponFreq: number) {
  const couponPerPeriod = faceValue * (yield_ / 100) / couponFreq;
  const totalPeriods = termYears * couponFreq;
  const totalCoupons = couponPerPeriod * totalPeriods;
  return { total: faceValue + totalCoupons, interest: totalCoupons, perPeriod: couponPerPeriod };
}

// ─── MUTUAL FUND ──────────────────────────────────────────────
export function calcMutualFund(init: number, monthlyContrib: number, years: number, grossReturn: number, expenseRatio: number) {
  const netRet = (grossReturn - expenseRatio) / 100 / 12;
  const grossRet = grossReturn / 100 / 12;
  let bNet = init, bGross = init;
  const netVals: number[] = [], contribVals: number[] = [];
  let totalC = init;
  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) { bNet += monthlyContrib; bNet *= (1 + netRet); bGross += monthlyContrib; bGross *= (1 + grossRet); totalC += monthlyContrib; }
    netVals.push(+bNet.toFixed(2)); contribVals.push(+totalC.toFixed(2));
  }
  return { final: bNet, totalContribs: totalC, growth: bNet - totalC, drag: bGross - bNet, netVals, contribVals, labels: Array.from({ length: years }, (_, i) => `Yr ${i + 1}`) };
}

// ─── DIVIDEND ─────────────────────────────────────────────────
export function calcDividend(
  amount: number, dividendYield: number, years: number,
  divGrowth: number, priceGrowth: number, inflation: number
) {
  let portVal = amount, annualDiv = amount * (dividendYield / 100), totalDivs = 0;
  const nominal: number[] = [], real: number[] = [];
  for (let y = 1; y <= years; y++) {
    totalDivs += annualDiv;
    nominal.push(+annualDiv.toFixed(2));
    real.push(+(annualDiv / Math.pow(1 + inflation / 100, y)).toFixed(2));
    portVal *= (1 + priceGrowth / 100);
    annualDiv *= (1 + divGrowth / 100);
  }
  return { yr1Annual: amount * (dividendYield / 100), yr1Monthly: amount * (dividendYield / 100) / 12, finalNominal: nominal[nominal.length - 1], finalReal: real[real.length - 1], totalDivs, portVal, nominal, real, labels: Array.from({ length: years }, (_, i) => `Yr ${i + 1}`) };
}

// ─── SALES TAX ────────────────────────────────────────────────
export function calcSalesTax(preTax: number, rate: number, qty: number) {
  const subtotal = preTax * qty;
  const taxAmt = subtotal * (rate / 100);
  const total = subtotal + taxAmt;
  return { total, subtotal, taxAmt, unitPre: preTax, unitTotal: preTax * (1 + rate / 100) };
}
export function calcSalesTaxReverse(totalIncTax: number, rate: number, qty: number) {
  const total = totalIncTax * qty;
  const pretax = total / (1 + rate / 100);
  const taxAmt = total - pretax;
  return { total, subtotal: pretax, taxAmt, unitPre: pretax / qty, unitTotal: totalIncTax };
}
