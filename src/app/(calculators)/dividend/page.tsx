'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Chart, registerables } from 'chart.js';
import { Card, Stat, PageHero, EduBox, EduCard, Disclaimer, SaveButton, Select } from '@/components/ui';
import { fmt, fmtK } from '@/lib/utils';
import { useSaveCalculation } from '@/hooks/useSaveCalculation';
import { cn } from '@/lib/utils';

Chart.register(...registerables);

// ─── Types ────────────────────────────────────────────────────
type Tab = 'portfolio' | 'stock';
type ChartView = 'nominal' | 'real';
type FreqKey = 'weekly' | 'monthly' | 'quarterly' | 'semiannual' | 'annual';

const FREQ_OPTIONS: { label: string; value: FreqKey; perYear: number }[] = [
  { label: 'Weekly',       value: 'weekly',     perYear: 52  },
  { label: 'Monthly',      value: 'monthly',    perYear: 12  },
  { label: 'Quarterly',    value: 'quarterly',  perYear: 4   },
  { label: 'Semi-annual',  value: 'semiannual', perYear: 2   },
  { label: 'Annual',       value: 'annual',     perYear: 1   },
];

// ─── ClearInput ───────────────────────────────────────────────
function CI({ label, value, onChange, prefix, suffix, step, note }: {
  label: string; value: number; onChange: (v: number) => void;
  prefix?: string; suffix?: string; step?: number; note?: string;
}) {
  const [disp, setDisp] = useState(String(value));
  useEffect(() => { setDisp(String(value)); }, [value]);
  return (
    <div className="space-y-1">
      <label className="block text-[11px] font-semibold text-[var(--text2)]">{label}</label>
      <div className="relative flex items-center">
        {prefix && <span className="absolute left-2.5 text-[12px] font-mono text-[var(--text3)] pointer-events-none z-10">{prefix}</span>}
        <input type="number" value={disp} step={step ?? 1}
          onFocus={e => { if (parseFloat(e.target.value) === 0) setDisp(''); e.target.select(); }}
          onBlur={e => { if (!e.target.value) { setDisp('0'); onChange(0); } }}
          onChange={e => { setDisp(e.target.value); const n = parseFloat(e.target.value); if (!isNaN(n)) onChange(n); }}
          className={cn('w-full bg-white border border-[var(--border)] rounded-[7px] text-[13px] font-medium outline-none transition-all focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[var(--accent-dim)]',
            prefix ? 'pl-[22px] pr-3 py-2' : suffix ? 'pl-3 pr-7 py-2' : 'px-3 py-2')} />
        {suffix && <span className="absolute right-2.5 text-[11px] font-mono text-[var(--text3)] pointer-events-none">{suffix}</span>}
      </div>
      {note && <p className="text-[10px] text-[var(--text3)]">{note}</p>}
    </div>
  );
}

// ─── Toggle ───────────────────────────────────────────────────
function Toggle({ label, value, onChange, description }: { label: string; value: boolean; onChange: (v: boolean) => void; description?: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-[var(--surface2)] border border-[var(--border)] rounded-[7px]">
      <div>
        <div className="text-[12px] font-semibold text-[var(--text)]">{label}</div>
        {description && <div className="text-[10px] text-[var(--text3)] mt-0.5">{description}</div>}
      </div>
      <button onClick={() => onChange(!value)} className={cn('relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0', value ? 'bg-[var(--accent)]' : 'bg-[var(--border2)]')}>
        <span className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200', value ? 'translate-x-5' : 'translate-x-0.5')} />
      </button>
    </div>
  );
}

// ─── Calculator logic ─────────────────────────────────────────
interface CalcResult {
  yr1Annual: number;
  yr1PerPeriod: number;
  finalNominal: number;
  finalReal: number;
  totalDivs: number;
  portVal: number;
  nominal: number[];
  real: number[];
  labels: string[];
  totalContributions: number;
  totalDripShares?: number;
}

function calcDividend(params: {
  investmentAmount: number;
  dividendYield: number;
  years: number;
  divGrowth: number;
  priceGrowth: number;
  inflation: number;
  freqPerYear: number;
  drip: boolean;
  periodicContrib: number;
  contribFreqPerYear: number;
}): CalcResult {
  const { investmentAmount, dividendYield, years, divGrowth, priceGrowth, inflation, freqPerYear, drip, periodicContrib, contribFreqPerYear } = params;

  let portVal = investmentAmount;
  let annualDiv = portVal * (dividendYield / 100);
  let totalDivs = 0;
  let totalContribs = investmentAmount;
  let dripSharesAccumulated = 0;
  const nominal: number[] = [];
  const real: number[] = [];

  for (let y = 1; y <= years; y++) {
    // Periodic contributions this year
    const contribsThisYear = periodicContrib * contribFreqPerYear;
    portVal += contribsThisYear;
    totalContribs += contribsThisYear;

    // Recalculate annual dividend based on current portfolio
    annualDiv = portVal * (dividendYield / 100);

    // Apply dividend growth
    if (y > 1) annualDiv *= Math.pow(1 + divGrowth / 100, 1);

    const divThisYear = annualDiv;
    totalDivs += divThisYear;

    if (drip) {
      // DRIP: reinvest dividends back into portfolio
      const sharePrice = investmentAmount / 100; // normalized share price
      const newShares = divThisYear / sharePrice;
      dripSharesAccumulated += newShares;
      portVal += divThisYear;
    }

    // Portfolio price growth
    portVal *= (1 + priceGrowth / 100);

    nominal.push(+divThisYear.toFixed(2));
    real.push(+(divThisYear / Math.pow(1 + inflation / 100, y)).toFixed(2));
  }

  return {
    yr1Annual: investmentAmount * (dividendYield / 100),
    yr1PerPeriod: (investmentAmount * (dividendYield / 100)) / freqPerYear,
    finalNominal: nominal[nominal.length - 1] ?? 0,
    finalReal: real[real.length - 1] ?? 0,
    totalDivs,
    portVal,
    nominal,
    real,
    labels: Array.from({ length: years }, (_, i) => `Yr ${i + 1}`),
    totalContributions: totalContribs,
    totalDripShares: dripSharesAccumulated,
  };
}

function calcFromStock(params: {
  shares: number;
  sharePrice: number;
  dividendPerShare: number;
  freqPerYear: number;
  years: number;
  divGrowth: number;
  priceGrowth: number;
  inflation: number;
  drip: boolean;
  periodicContrib: number;
  contribFreqPerYear: number;
}): CalcResult & { totalValue: number; capitalGains: number } {
  const { shares, sharePrice, dividendPerShare, freqPerYear, years, divGrowth, priceGrowth, inflation, drip, periodicContrib, contribFreqPerYear } = params;
  const investmentAmount = shares * sharePrice;
  const dividendYield = (dividendPerShare * freqPerYear / sharePrice) * 100;

  const base = calcDividend({ investmentAmount, dividendYield, years, divGrowth, priceGrowth, inflation, freqPerYear, drip, periodicContrib, contribFreqPerYear });

  let currentShares = shares;
  let currentPrice = sharePrice;
  let totalValue = 0;

  for (let y = 1; y <= years; y++) {
    currentPrice *= (1 + priceGrowth / 100);
    if (drip) {
      const annualDivPerShare = dividendPerShare * Math.pow(1 + divGrowth / 100, y);
      const newShares = (currentShares * annualDivPerShare) / currentPrice;
      currentShares += newShares;
    }
  }
  totalValue = currentShares * currentPrice;

  return {
    ...base,
    yr1PerPeriod: dividendPerShare * shares,
    yr1Annual: dividendPerShare * freqPerYear * shares,
    totalValue,
    capitalGains: totalValue - investmentAmount,
  };
}

// ─── Main Component ───────────────────────────────────────────
export default function DividendPage() {
  const [tab, setTab] = useState<Tab>('portfolio');
  const [chartView, setChartView] = useState<ChartView>('nominal');
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const { save, saved } = useSaveCalculation();

  // Shared
  const [years, setYears] = useState(20);
  const [divGrowth, setDivGrowth] = useState(5);
  const [priceGrowth, setPriceGrowth] = useState(6);
  const [inflation, setInflation] = useState(3);
  const [divFreq, setDivFreq] = useState<FreqKey>('quarterly');
  const [drip, setDrip] = useState(false);
  const [periodicContrib, setPeriodicContrib] = useState(0);
  const [contribFreq, setContribFreq] = useState<FreqKey>('monthly');

  // Portfolio tab
  const [amount, setAmount] = useState(25000);
  const [divYield, setDivYield] = useState(3.5);

  // Stock tab
  const [shares, setShares] = useState(100);
  const [sharePrice, setSharePrice] = useState(50);
  const [divPerShare, setDivPerShare] = useState(0.50);
  const [ticker, setTicker] = useState('');

  const freqPerYear = FREQ_OPTIONS.find(f => f.value === divFreq)?.perYear ?? 4;
  const contribFreqPerYear = FREQ_OPTIONS.find(f => f.value === contribFreq)?.perYear ?? 12;

  const portfolioResult = calcDividend({ investmentAmount: amount, dividendYield: divYield, years, divGrowth, priceGrowth, inflation, freqPerYear, drip, periodicContrib, contribFreqPerYear });

  const stockResult = calcFromStock({ shares, sharePrice, dividendPerShare: divPerShare, freqPerYear, years, divGrowth, priceGrowth, inflation, drip, periodicContrib, contribFreqPerYear });

  const result = tab === 'portfolio' ? portfolioResult : stockResult;

  const drawChart = useCallback(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();
    const data = chartView === 'nominal' ? result.nominal : result.real;
    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: result.labels,
        datasets: [
          {
            label: chartView === 'nominal' ? 'Annual dividend income' : 'Real income (inflation-adj.)',
            data,
            backgroundColor: chartView === 'nominal' ? 'rgba(21,163,98,0.7)' : 'rgba(124,58,237,0.7)',
            borderColor: chartView === 'nominal' ? '#15a362' : '#7c3aed',
            borderWidth: 1,
            borderRadius: 3,
          },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: c => '  ' + fmt(c.parsed.y ?? 0) } }
        },
        scales: {
          x: { ticks: { color: '#9ca3af', font: { size: 10 }, maxTicksLimit: 10 }, grid: { display: false }, border: { display: false } },
          y: { ticks: { color: '#9ca3af', font: { size: 10 }, callback: v => fmtK(Number(v)) }, grid: { color: 'rgba(0,0,0,0.04)' }, border: { display: false } },
        },
      },
    });
  }, [result, chartView]);

  useEffect(() => { drawChart(); return () => chartInstance.current?.destroy(); }, [drawChart]);

  const impliedYield = tab === 'stock' ? ((divPerShare * freqPerYear) / sharePrice * 100) : divYield;
  const investedAmount = tab === 'stock' ? shares * sharePrice : amount;

  const SharedParams = () => (
    <>
      <div className="grid grid-cols-2 gap-2.5">
        <CI label="Years" value={years} onChange={setYears} />
        <CI label="Inflation rate" value={inflation} onChange={setInflation} suffix="%" step={0.1} />
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <CI label="Annual dividend growth" value={divGrowth} onChange={setDivGrowth} suffix="%" step={0.1} />
        <CI label="Annual price growth" value={priceGrowth} onChange={setPriceGrowth} suffix="%" step={0.1} />
      </div>
      <div className="space-y-1">
        <label className="block text-[11px] font-semibold text-[var(--text2)]">Distribution frequency</label>
        <select value={divFreq} onChange={e => setDivFreq(e.target.value as FreqKey)}
          className="w-full bg-white border border-[var(--border)] rounded-[7px] text-[13px] font-medium px-3 py-2 outline-none focus:border-[var(--accent)] appearance-none cursor-pointer">
          {FREQ_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
      </div>
      <Toggle label="DRIP — Dividend Reinvestment" value={drip} onChange={setDrip} description="Automatically reinvests dividends to purchase more shares, compounding growth" />
      <div className="h-px bg-[var(--border)]" />
      <div className="space-y-1">
        <label className="block text-[11px] font-semibold text-[var(--text2)]">Additional contributions</label>
        <div className="grid grid-cols-2 gap-2">
          <CI label="Amount per period" value={periodicContrib} onChange={setPeriodicContrib} prefix="$" step={50} />
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-[var(--text2)]">Contribution frequency</label>
            <select value={contribFreq} onChange={e => setContribFreq(e.target.value as FreqKey)}
              className="w-full bg-white border border-[var(--border)] rounded-[7px] text-[13px] font-medium px-3 py-2 outline-none focus:border-[var(--accent)] appearance-none cursor-pointer">
              {FREQ_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="max-w-[1100px] mx-auto px-6 pb-16 animate-fade-up">
      <PageHero
        eyebrow="Growth"
        title={<>Dividend <span className="text-[var(--accent)]">Calculator</span></>}
        subtitle="Project dividend income with DRIP reinvestment, contribution schedules, and inflation-adjusted returns."
      />

      {/* Tab switcher */}
      <div className="flex gap-1 mb-4 bg-[var(--surface2)] border border-[var(--border)] rounded-[10px] p-1 w-fit">
        {([['portfolio', 'Portfolio'], ['stock', 'Individual Stock']] as [Tab, string][]).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-4 py-1.5 rounded-[7px] text-[12px] font-semibold transition-all',
              tab === t ? 'bg-white text-[var(--text)] shadow-[var(--sh)]' : 'text-[var(--text2)] hover:text-[var(--text)]')}>
            {label}
          </button>
        ))}
      </div>

      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr]">
          {/* Inputs */}
          <div className="p-6 border-b lg:border-b-0 lg:border-r border-[var(--border)]">
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-3">Parameters</p>
            <div className="space-y-3">

              {tab === 'portfolio' ? (
                <>
                  <CI label="Portfolio value" value={amount} onChange={setAmount} prefix="$" step={500} />
                  <CI label="Dividend yield" value={divYield} onChange={setDivYield} suffix="%" step={0.1} note={`Annual income: ${fmt(amount * divYield / 100)}`} />
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-[var(--text2)]">Ticker symbol (optional)</label>
                    <input value={ticker} onChange={e => setTicker(e.target.value.toUpperCase())} placeholder="e.g. AAPL, VYM, SCHD"
                      className="w-full bg-white border border-[var(--border)] rounded-[7px] text-[13px] font-medium px-3 py-2 outline-none focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[var(--accent-dim)] uppercase" />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <CI label="Number of shares" value={shares} onChange={setShares} step={1} />
                    <CI label="Share price" value={sharePrice} onChange={setSharePrice} prefix="$" step={0.01} />
                  </div>
                  <CI label="Dividend per share (per period)" value={divPerShare} onChange={setDivPerShare} prefix="$" step={0.01}
                    note={`Implied annual yield: ${impliedYield.toFixed(2)}% · Annual income: ${fmt(divPerShare * freqPerYear * shares)}`} />
                  <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-[7px] px-3 py-2">
                    <div className="text-[10px] font-bold text-[var(--text3)] mb-1">Position summary</div>
                    <div className="grid grid-cols-2 gap-1 text-[11px]">
                      <span className="text-[var(--text2)]">Total invested:</span><span className="font-mono font-medium">{fmt(shares * sharePrice)}</span>
                      <span className="text-[var(--text2)]">Cost per share:</span><span className="font-mono font-medium">{fmt(sharePrice)}</span>
                      <span className="text-[var(--text2)]">Annual yield:</span><span className="font-mono font-medium text-[var(--accent)]">{impliedYield.toFixed(2)}%</span>
                    </div>
                  </div>
                </>
              )}

              <SharedParams />

              <SaveButton onClick={async () => {
                await save({
                  type: 'dividend',
                  name: tab === 'stock' ? `Dividend — ${ticker || shares + ' shares'} @ ${fmt(sharePrice)}` : `Dividend Portfolio — ${fmt(amount)}`,
                  summary: `Yr1: ${fmt(result.yr1Annual)} · ${years}yr total: ${fmtK(result.totalDivs)}`,
                  resultValue: fmt(result.yr1Annual),
                });
              }} saving={saved} />
            </div>
          </div>

          {/* Results */}
          <div className="p-6 bg-[var(--surface2)] flex flex-col gap-2.5">
            <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--text3)] mb-0.5">Results</p>

            <Stat variant="large"
              label={`Income per ${FREQ_OPTIONS.find(f => f.value === divFreq)?.label.toLowerCase() ?? 'period'}`}
              value={fmt(result.yr1PerPeriod)}
              sub={`Year 1 annual: ${fmt(result.yr1Annual)}`}
            />

            <div className="grid grid-cols-2 gap-2">
              <Stat label={`Year ${years} income (nominal)`} value={fmt(result.finalNominal)} variant="green" />
              <Stat label={`Year ${years} income (real)`} value={fmt(result.finalReal)} variant="purple" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Stat label={`Total dividends (${years} yr)`} value={fmtK(result.totalDivs)} />
              <Stat label="Portfolio value at end" value={fmtK(result.portVal)} variant="blue" />
            </div>

            {tab === 'stock' && (
              <div className="grid grid-cols-2 gap-2">
                <Stat label="Total position value" value={fmtK((result as ReturnType<typeof calcFromStock>).totalValue)} variant="green" />
                <Stat label="Capital gains" value={fmtK((result as ReturnType<typeof calcFromStock>).capitalGains)} variant="green" />
              </div>
            )}

            {drip && (
              <div className="bg-[var(--accent-dim)] border border-[var(--accent-line)] rounded-[7px] p-2.5 text-[11px] text-[#065f46]">
                <strong>DRIP active:</strong> Dividends are reinvested automatically each period, compounding your share count and accelerating long-term growth.
              </div>
            )}

            {periodicContrib > 0 && (
              <Stat label={`Total contributions (${FREQ_OPTIONS.find(f => f.value === contribFreq)?.label} $${periodicContrib})`}
                value={fmtK(result.totalContributions)} />
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="px-6 py-5 border-t border-[var(--border)]">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h3 className="text-[12px] font-semibold">Annual dividend income over time</h3>
            <div className="flex gap-1.5">
              {(['nominal', 'real'] as ChartView[]).map(v => (
                <button key={v} onClick={() => setChartView(v)}
                  className={cn('text-[10px] font-medium px-2.5 py-1 rounded-[5px] border transition-colors',
                    chartView === v ? 'bg-[var(--accent-dim)] text-[var(--accent)] border-[var(--accent-line)] font-bold' : 'bg-white text-[var(--text2)] border-[var(--border)]')}>
                  {v === 'nominal' ? 'Nominal' : 'Inflation-adjusted'}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[200px]"><canvas ref={chartRef} /></div>
        </div>
      </Card>

      <EduBox title="Dividend investing concepts">
        <EduCard title="DRIP — Dividend Reinvestment">Instead of receiving cash, dividends automatically purchase more shares. Over decades this compounding dramatically increases both share count and dividend income.</EduCard>
        <EduCard title="Dividend yield">Annual dividends divided by share price. A $50 stock paying $1.00/quarter has a 8% yield. High yield isn't always better — sustainable payout ratios matter more.</EduCard>
        <EduCard title="Payment frequency">Most US stocks pay quarterly. Some REITs and ETFs pay monthly. Bonds typically pay semi-annually. More frequent payments give you cash sooner to reinvest.</EduCard>
        <EduCard title="Dividend growth">Companies that consistently grow dividends (Dividend Aristocrats — 25+ consecutive years of increases) are often more reliable than high-yield stocks with stagnant or cut dividends.</EduCard>
        <EduCard title="Payout ratio">Dividends paid / earnings per share. A ratio under 60% is generally sustainable. Above 90% may signal a dividend cut risk. REITs and MLPs operate differently.</EduCard>
        <EduCard title="Ex-dividend date">You must own shares before the ex-dividend date to receive the next payment. Buying on or after the ex-date means waiting until the following payment cycle.</EduCard>
      </EduBox>

      <Disclaimer>Projections assume constant growth rates. Dividends are not guaranteed and can be cut. Not financial advice. Past dividend history does not guarantee future payments.</Disclaimer>
    </div>
  );
}
