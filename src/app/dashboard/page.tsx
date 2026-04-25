import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { CALCULATOR_LIST, CALC_GROUP_LABELS } from '@/types';
import type { SavedCalculation } from '@/types';

export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/sign-in');

  const { data: calculations } = await supabase
    .from('saved_calculations')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  const grouped = (calculations || []).reduce((acc, calc) => {
    if (!acc[calc.type]) acc[calc.type] = [];
    acc[calc.type].push(calc);
    return acc;
  }, {} as Record<string, SavedCalculation[]>);

  const calcMeta = Object.fromEntries(CALCULATOR_LIST.map(c => [c.type, c]));

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8 pb-16 animate-fade-up">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="text-[18px] font-bold tracking-[-0.02em]">Dashboard</h1>
          <p className="text-[12px] text-[var(--text2)] mt-0.5">
            Welcome back, <strong>{profile?.full_name || user.email}</strong>. Manage your saved calculations below.
          </p>
        </div>
        <Link href="/profile" className="text-[13px] font-medium text-[var(--text2)] border border-[var(--border2)] px-3 py-1.5 rounded-[7px] hover:bg-[var(--surface2)] transition-colors">
          Profile settings
        </Link>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[14px] text-[var(--text2)] mb-1">No saved calculations yet.</p>
          <p className="text-[12px] text-[var(--text3)] mb-5">Use any calculator and click "Save calculation" to see it here.</p>
          <Link href="/calculators" className="bg-[var(--accent)] text-white text-[13px] font-semibold px-5 py-2.5 rounded-[7px] hover:bg-[var(--accent-h)] transition-colors">
            Explore calculators
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {Object.entries(grouped).map(([type, items]) => {
            const meta = calcMeta[type];
            return (
              <div key={type} className="bg-white border border-[var(--border)] rounded-[10px] p-4 shadow-[var(--sh)]">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--border)]">
                  <h3 className="text-[12px] font-bold text-[var(--text)]">{meta?.name || type}</h3>
                  <span className="font-mono text-[10px] text-[var(--text3)] bg-[var(--surface2)] px-2 py-0.5 rounded-full border border-[var(--border)]">
                    {items.length} saved
                  </span>
                </div>
                <div className="space-y-0">
                  {items.map((item, i) => (
                    <div key={item.id} className={`py-2 ${i < items.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-[12px] font-semibold text-[var(--text)] truncate">{item.name}</div>
                          <div className="text-[10px] text-[var(--text3)] mt-0.5 leading-relaxed">
                            {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            {item.summary && <> · {item.summary}</>}
                          </div>
                        </div>
                        <div className="font-mono text-[12px] text-[var(--accent)] font-medium whitespace-nowrap flex-shrink-0">
                          {item.result_value}
                        </div>
                      </div>
                      {meta && (
                        <div className="mt-1.5 flex gap-1.5">
                          <Link href={meta.href} className="text-[10px] font-medium text-[var(--accent)] border border-[var(--accent-line)] px-2 py-0.5 rounded-[4px] hover:bg-[var(--accent-dim)] transition-colors">
                            Open calculator
                          </Link>
                          <DeleteButton id={item.id} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DeleteButton({ id }: { id: string }) {
  return (
    <form action={async () => {
      'use server';
      const supabase = createClient();
      await supabase.from('saved_calculations').delete().eq('id', id);
    }}>
      <button type="submit" className="text-[10px] font-medium text-[var(--text3)] border border-[var(--border)] px-2 py-0.5 rounded-[4px] hover:text-[var(--red)] hover:border-[rgba(220,53,69,0.25)] transition-colors">
        Delete
      </button>
    </form>
  );
}
