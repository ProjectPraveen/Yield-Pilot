'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface ProfileFormProps {
  initialName: string;
  email: string;
  emailVerified: boolean;
}

export function ProfileForm({ initialName, email, emailVerified }: ProfileFormProps) {
  const [name, setName] = useState(initialName);
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const [passErr, setPassErr] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const supabase = createClient();

  async function saveProfile() {
    setProfileErr(''); setProfileMsg('');
    const { error } = await supabase.auth.updateUser({ data: { full_name: name } });
    const user = (await supabase.auth.getUser()).data.user;
    if (user) await supabase.from('profiles').update({ full_name: name }).eq('id', user.id);
    if (error) { setProfileErr('Error saving profile.'); return; }
    setProfileMsg('Profile updated successfully.');
    setTimeout(() => setProfileMsg(''), 3000);
  }

  async function changePassword() {
    setPassErr(''); setPassMsg('');
    if (!newPass) { setPassErr('Please enter a new password.'); return; }
    if (newPass.length < 8) { setPassErr('Password must be at least 8 characters.'); return; }
    if (newPass !== confirmPass) { setPassErr('Passwords do not match.'); return; }
    setPassLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPass });
    setPassLoading(false);
    if (error) { setPassErr(error.message); return; }
    setPassMsg('Password updated. A confirmation email has been sent to ' + email + '.');
    setNewPass(''); setConfirmPass('');
    setTimeout(() => setPassMsg(''), 6000);
  }

  const inputClass = 'w-full bg-white border border-[var(--border)] rounded-[7px] text-[13px] font-medium px-3 py-2 outline-none focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[var(--accent-dim)] transition-all';

  return (
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4">
      {/* Sidebar */}
      <div className="bg-white border border-[var(--border)] rounded-[14px] p-5 shadow-[var(--sh)] h-fit">
        <div className="w-12 h-12 rounded-full bg-[var(--accent-dim)] border-2 border-[var(--accent-line)] flex items-center justify-center text-[20px] font-bold text-[var(--accent)] mx-auto mb-3">
          {(name || email).charAt(0).toUpperCase()}
        </div>
        <div className="text-[13px] font-bold text-center">{name || 'Your name'}</div>
        <div className="text-[11px] text-[var(--text2)] text-center mt-1 break-all">{email}</div>
        <div className="text-center mt-2">
          {emailVerified
            ? <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--accent)] bg-[var(--accent-dim)] border border-[var(--accent-line)] px-2 py-0.5 rounded-full">Verified</span>
            : <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#d97706] bg-[rgba(217,119,6,0.08)] border border-[rgba(217,119,6,0.18)] px-2 py-0.5 rounded-full">Not verified</span>
          }
        </div>
        <div className="mt-4 pt-3 border-t border-[var(--border)]">
          <Link href="/dashboard" className="block w-full text-center text-[12px] font-medium text-[var(--text2)] border border-[var(--border2)] rounded-[7px] py-2 hover:bg-[var(--surface2)] transition-colors">
            View dashboard
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        {/* Account details */}
        <div className="bg-white border border-[var(--border)] rounded-[10px] p-5 shadow-[var(--sh)]">
          <h3 className="text-[12px] font-bold text-[var(--text)] mb-3">Account details</h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[var(--text2)]">Full name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" type="text" className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[var(--text2)]">Email address</label>
              <input value={email} disabled type="email" className="w-full bg-[var(--surface2)] border border-[var(--border)] rounded-[7px] text-[13px] font-medium px-3 py-2 text-[var(--text2)] cursor-not-allowed" />
              <p className="text-[10px] text-[var(--text3)]">Email changes are managed through your account settings.</p>
            </div>
          </div>
          <button onClick={saveProfile} className="mt-3 bg-[var(--accent)] text-white text-[12px] font-semibold px-4 py-1.5 rounded-[7px] hover:bg-[var(--accent-h)] transition-colors">
            Save changes
          </button>
          {profileMsg && <p className="text-[11px] text-[var(--accent)] mt-2 font-medium">{profileMsg}</p>}
          {profileErr && <p className="text-[11px] text-[var(--red)] mt-2">{profileErr}</p>}
        </div>

        {/* Change password */}
        <div className="bg-white border border-[var(--border)] rounded-[10px] p-5 shadow-[var(--sh)]">
          <h3 className="text-[12px] font-bold text-[var(--text)] mb-1">Change password</h3>
          <p className="text-[11px] text-[var(--text3)] mb-3">A confirmation email will be sent to {email} after updating.</p>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[var(--text2)]">New password</label>
              <input value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Min. 8 characters" type="password" className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[var(--text2)]">Confirm new password</label>
              <input value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Re-enter new password" type="password" className={inputClass} />
            </div>
          </div>
          <button onClick={changePassword} disabled={passLoading} className="mt-3 bg-[var(--accent)] text-white text-[12px] font-semibold px-4 py-1.5 rounded-[7px] hover:bg-[var(--accent-h)] transition-colors disabled:opacity-60">
            {passLoading ? 'Updating...' : 'Update password'}
          </button>
          {passErr && <p className="text-[11px] text-[var(--red)] mt-2">{passErr}</p>}
          {passMsg && (
            <div className="mt-2 bg-[var(--accent-dim)] border border-[var(--accent-line)] rounded-[7px] p-2.5 text-[11px] text-[var(--accent-h)] font-medium">
              {passMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
