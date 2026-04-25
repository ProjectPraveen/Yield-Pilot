import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProfileForm } from './ProfileForm';

export const metadata = { title: 'Profile' };

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8 pb-16 animate-fade-up">
      <h1 className="text-[17px] font-bold tracking-[-0.02em] mb-5">Account profile</h1>
      <ProfileForm
        initialName={profile?.full_name || ''}
        email={user.email || ''}
        emailVerified={!!user.email_confirmed_at}
      />
    </div>
  );
}
