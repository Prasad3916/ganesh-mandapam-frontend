import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Settings, UserPlus, Palette, Sun, Moon, Sparkles, Trash2, CheckCircle2, Lock, AlertCircle, KeyRound } from 'lucide-react';
import { apiFetch } from '../api/apiClient';

interface CommitteeUser {
  id: number | string;
  fullName?: string;
  username: string;
  email: string;
}

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode, isFestivalMode, toggleFestivalMode } = useTheme();

  const isAdmin = user?.role === 'ADMIN';

  // Committee Members State
  const [committeeList, setCommitteeList] = useState<CommitteeUser[]>([]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passSubmitting, setPassSubmitting] = useState(false);
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');

  const fetchCommittee = async () => {
    try {
      const data = await apiFetch<CommitteeUser[]>('/users/committee');
      setCommitteeList(data);
    } catch {
      setCommitteeList([]);
    }
  };

  useEffect(() => {
    fetchCommittee();
  }, []);

  const handleAddCommitteeMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    setIsSubmitting(true);
    setSuccessMsg('');
    try {
      await apiFetch('/users/committee', {
        method: 'POST',
        body: JSON.stringify({ fullName, email, role: 'COMMITTEE_MEMBER' }),
      });
      setSuccessMsg(`Successfully added ${fullName} as Committee Member!`);
      setFullName('');
      setEmail('');
      fetchCommittee();
    } catch {
      // Error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMember = async (id: number | string) => {
    try {
      await apiFetch(`/users/committee/${id}`, { method: 'DELETE' });
      fetchCommittee();
    } catch {
      // Error
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (!newPassword || newPassword.length < 4) {
      setPassError('New password must be at least 4 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match. Please re-type.');
      return;
    }

    setPassSubmitting(true);
    try {
      const response = await apiFetch<any>('/users/change-password', {
        method: 'POST',
        body: JSON.stringify({
          userId: user?.id || '1',
          currentPassword,
          newPassword,
        }),
      });

      setPassSuccess(response.message || 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPassError(err.message || 'Failed to change password. Check current password.');
    } finally {
      setPassSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-950 border border-gold-500/40 text-amber-50 shadow-mandapam flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-saffron-500/20 border border-saffron-400/40 rounded-xl text-saffron-400">
            <Settings className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs font-telugu-devotional text-gold-300 font-bold mb-0.5">
              శ్రీ గణేశాయ నమః • గణపతి బప్పా మోరియా
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-gold-300">
              Mandapam Settings & Profile Security
            </h2>
            <p className="text-xs text-amber-200/80">
              Logged in as: <strong className="text-gold-300 font-mono">{user?.name} ({user?.role})</strong>
            </p>
          </div>
        </div>
      </div>

      {/* 1. CHANGE PASSWORD SECTION (AVAILABLE TO ALL LOGGED IN USERS) */}
      <div className="p-6 rounded-2xl border-2 border-gold-500/40 glass-mandapam space-y-4 shadow-mandapam">
        <div className="flex items-center gap-2 border-b border-gold-500/20 pb-3">
          <KeyRound className="w-5 h-5 text-gold-400" />
          <div>
            <h3 className="font-cinzel font-bold text-base text-slate-900 dark:text-gold-300">
              Change Account Password
            </h3>
            <p className="text-xs text-slate-500 dark:text-amber-200/70">
              Update password for <strong className="text-saffron-600 dark:text-gold-300">{user?.name}</strong>
            </p>
          </div>
        </div>

        {passSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{passSuccess}</span>
          </div>
        )}

        {passError && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{passError}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs max-w-lg">
          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-amber-300/60" />
              <input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                New Password *
              </label>
              <input
                type="password"
                required
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                placeholder="Re-type new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={passSubmitting}
            className="px-6 py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs shadow-saffron-glow transition flex items-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>{passSubmitting ? 'Updating Password...' : 'Update Password'}</span>
          </button>
        </form>
      </div>

      {/* 2. ADMIN ONLY SECTION: Committee Member Management */}
      {isAdmin && (
        <div className="p-6 rounded-2xl border-2 border-saffron-500/40 glass-mandapam space-y-6 shadow-mandapam">
          <div className="flex items-center gap-2 border-b border-gold-500/20 pb-3">
            <UserPlus className="w-5 h-5 text-saffron-500" />
            <h3 className="font-cinzel font-bold text-base text-slate-900 dark:text-gold-300">
              Admin Control: Manage Committee Members
            </h3>
          </div>

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Add Committee Member Form */}
          <form onSubmit={handleAddCommitteeMember} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Bhavani Prasad"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="bhavaniprasad@ganeshutsav.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs shadow-saffron-glow transition flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isSubmitting ? 'Adding...' : 'Add Committee Member'}</span>
              </button>
            </div>
          </form>

          {/* Existing Committee Members List */}
          <div className="space-y-3 pt-2">
            <h4 className="font-semibold text-xs text-slate-700 dark:text-amber-200 uppercase tracking-wider">
              Active Committee Roster
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {committeeList.map((m) => (
                <div key={m.id} className="p-3 rounded-xl bg-slate-50 dark:bg-maroon-950/60 border border-gold-500/20 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-amber-100">{m.fullName || m.username}</span>
                    <span className="block text-[10px] text-slate-500 dark:text-amber-300/70 font-mono">{m.email}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteMember(m.id)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition"
                    title="Remove Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. COMMITTEE MEMBER & ADMIN SECTION: Mandapam Background & Appearance Customization */}
      <div className="p-6 rounded-2xl border border-gold-500/30 glass-mandapam space-y-6 shadow-mandapam">
        <div className="flex items-center gap-2 border-b border-gold-500/20 pb-3">
          <Palette className="w-5 h-5 text-gold-500" />
          <h3 className="font-cinzel font-bold text-base text-slate-900 dark:text-gold-300">
            Mandapam Background & Visual Customization
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Light / Night Mandapam Theme */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-maroon-950/60 border border-gold-500/20 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-800 dark:text-amber-100">Mandapam Atmosphere Mode</h4>
              <p className="text-[10px] text-slate-500 dark:text-amber-300/70">Switch between Ivory Daylight and Deep Night Temple</p>
            </div>
            <button
              onClick={toggleDarkMode}
              className="px-4 py-2 rounded-xl bg-maroon-900 hover:bg-maroon-800 border border-gold-500/40 text-gold-300 font-bold flex items-center gap-1.5 transition"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-gold-400" /> : <Moon className="w-4 h-4 text-amber-200" />}
              <span>{isDarkMode ? 'Daylight' : 'Night'}</span>
            </button>
          </div>

          {/* Devotional Particle Aura Mode */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-maroon-950/60 border border-gold-500/20 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-800 dark:text-amber-100">Devotional Petals & Aura</h4>
              <p className="text-[10px] text-slate-500 dark:text-amber-300/70">Toggle floating marigold flower animation</p>
            </div>
            <button
              onClick={toggleFestivalMode}
              className={`px-4 py-2 rounded-xl border font-bold flex items-center gap-1.5 transition ${
                isFestivalMode ? 'bg-saffron-500 text-white border-saffron-400' : 'bg-slate-200 dark:bg-maroon-900 text-slate-700 dark:text-amber-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isFestivalMode ? 'Active' : 'Off'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
