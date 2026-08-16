import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api/apiClient';
import { UserCheck, UserPlus, Search, ShieldCheck, ShieldAlert, KeyRound, Edit, Trash2, X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CommitteeMember {
  id: string | number;
  name?: string;
  fullName?: string;
  username: string;
  email: string;
  mobile?: string;
  designation?: string;
  status: 'ACTIVE' | 'DISABLED';
  notes?: string;
  createdAt?: string;
  lastLogin?: string;
}

export const CommitteePage: React.FC = () => {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<CommitteeMember | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('temp1234');
  const [designation, setDesignation] = useState('Committee Member');
  const [status, setStatus] = useState<'ACTIVE' | 'DISABLED'>('ACTIVE');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchMembers = async () => {
    try {
      const data = await apiFetch<CommitteeMember[]>('/users/committee');
      setMembers(data);
    } catch {
      setMembers([]);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleOpenAddModal = () => {
    setSelectedMember(null);
    setFullName('');
    setEmail('');
    setMobile('');
    setUsername('');
    setPassword('temp1234');
    setDesignation('Committee Member');
    setStatus('ACTIVE');
    setNotes('');
    setFormError('');
    setShowAddModal(true);
  };

  const handleOpenEditModal = (member: CommitteeMember) => {
    setSelectedMember(member);
    setFullName(member.fullName || member.name || '');
    setEmail(member.email || '');
    setMobile(member.mobile || '');
    setUsername(member.username || '');
    setDesignation('Committee Member');
    setStatus(member.status || 'ACTIVE');
    setNotes(member.notes || '');
    setFormError('');
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    setIsSubmitting(true);
    setFormError('');
    setSuccessMsg('');

    try {
      if (selectedMember) {
        // Edit existing member
        await apiFetch(`/users/committee/${selectedMember.id}`, {
          method: 'PUT',
          body: JSON.stringify({ fullName, mobile, designation: 'Committee Member', notes, status }),
        });
        setSuccessMsg(`Updated member details for ${fullName}`);
      } else {
        // Add new member
        await apiFetch('/users/committee', {
          method: 'POST',
          body: JSON.stringify({ fullName, email, mobile, username, password, designation: 'Committee Member', status, notes }),
        });
        setSuccessMsg(`Added new committee member ${fullName}`);
      }
      setShowAddModal(false);
      fetchMembers();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (member: CommitteeMember) => {
    const newStatus = member.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    try {
      await apiFetch(`/users/committee/${member.id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      fetchMembers();
    } catch {
      // Error
    }
  };

  const handleResetPassword = async (member: CommitteeMember) => {
    const tempPass = 'reset' + Math.floor(1000 + Math.random() * 9000);
    try {
      await apiFetch(`/users/committee/${member.id}/reset-password`, {
        method: 'POST',
        body: JSON.stringify({ newPassword: tempPass }),
      });
      alert(`Password reset successfully for ${member.fullName || member.username}.\nTemporary Password: ${tempPass}`);
    } catch {
      // Error
    }
  };

  const handleDeleteMember = async (id: string | number) => {
    if (!confirm('Are you sure you want to remove this committee member?')) return;
    try {
      await apiFetch(`/users/committee/${id}`, { method: 'DELETE' });
      fetchMembers();
    } catch {
      // Error
    }
  };

  const filteredMembers = members.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      (m.fullName && m.fullName.toLowerCase().includes(q)) ||
      (m.email && m.email.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-950 border border-gold-500/40 text-amber-50 shadow-mandapam flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-saffron-500/20 border border-saffron-400/40 rounded-xl text-saffron-400">
            <UserCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs font-telugu-devotional text-gold-300 font-bold mb-0.5">
              శ్రీ గణేశాయ నమః • గణపతి బప్పా మోరియా
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-gold-300">
              Committee Member Management
            </h2>
            <p className="text-xs text-amber-200/80">
              Admin control center for managing committee roles, access credentials, and status
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs shadow-saffron-glow transition transform hover:-translate-y-0.5"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add Committee Member</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Roster Controls */}
      <div className="p-4 rounded-2xl border border-gold-500/30 glass-mandapam flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-amber-300/60" />
          <input
            type="text"
            placeholder="Search by name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100"
          />
        </div>
        <span className="text-xs text-slate-500 dark:text-amber-200/70 font-mono">
          Total Members: {filteredMembers.length}
        </span>
      </div>

      {/* Roster Table */}
      <div className="overflow-x-auto rounded-2xl border border-gold-500/30 shadow-mandapam">
        <table className="w-full text-xs text-left text-slate-700 dark:text-amber-100">
          <thead className="bg-maroon-900 text-gold-300 font-cinzel text-xs uppercase border-b border-gold-500/30">
            <tr>
              <th className="p-3">Member Name</th>
              <th className="p-3">Email & Mobile</th>
              <th className="p-3">Designation</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-500/10 bg-white dark:bg-maroon-950">
            {filteredMembers.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-maroon-900/40 transition">
                <td className="p-3">
                  <span className="font-bold text-slate-900 dark:text-amber-50 block">
                    {m.fullName || m.name || m.username}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-amber-300/60 font-mono">
                    @{m.username}
                  </span>
                </td>
                <td className="p-3">
                  <span className="block font-mono text-slate-800 dark:text-amber-200">{m.email}</span>
                  <span className="text-[10px] text-slate-500 dark:text-amber-300/60 font-mono">{m.mobile || 'N/A'}</span>
                </td>
                <td className="p-3">
                  <span className="px-2.5 py-1 rounded-full bg-saffron-500/10 border border-saffron-400/30 text-saffron-600 dark:text-gold-300 font-semibold">
                    Committee Member
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                      m.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                        : 'bg-red-500/10 border-red-500/40 text-red-600 dark:text-red-400'
                    }`}
                  >
                    {m.status === 'ACTIVE' ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                    <span>{m.status}</span>
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(m)}
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 dark:text-amber-200 dark:hover:bg-maroon-800 transition"
                      title="Edit Member"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(m)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition ${
                        m.status === 'ACTIVE'
                          ? 'border-amber-500/40 text-amber-600 dark:text-amber-300 hover:bg-amber-500/10'
                          : 'border-emerald-500/40 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/10'
                      }`}
                      title={m.status === 'ACTIVE' ? 'Disable Account' : 'Enable Account'}
                    >
                      {m.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => handleResetPassword(m)}
                      className="p-1.5 rounded-lg text-gold-500 hover:bg-gold-500/10 transition"
                      title="Reset Password"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMember(m.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition"
                      title="Remove Member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg bg-white dark:bg-maroon-950 border-2 border-gold-500 rounded-2xl p-6 text-slate-900 dark:text-amber-50 space-y-4 shadow-mandapam"
          >
            <div className="flex items-center justify-between border-b border-gold-500/30 pb-2">
              <h3 className="text-lg font-bold font-cinzel text-saffron-600 dark:text-gold-300">
                {selectedMember ? 'Edit Committee Member' : '➕ Add New Committee Member'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:text-amber-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
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
                  disabled={!!selectedMember}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                  Mobile Number
                </label>
                <input
                  type="text"
                  placeholder="+91 9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                  Designation
                </label>
                <input
                  type="text"
                  readOnly
                  value="Committee Member"
                  className="w-full px-3 py-2 rounded-xl border border-gold-500/40 bg-slate-100 dark:bg-maroon-900/60 text-slate-700 dark:text-amber-200 font-semibold cursor-not-allowed"
                />
              </div>

              {!selectedMember && (
                <>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                      Username
                    </label>
                    <input
                      type="text"
                      placeholder="bhavaniprasad"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                      Temporary Password
                    </label>
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100 font-mono"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                  Account Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="DISABLED">DISABLED</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gold-500/20">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-maroon-900 text-slate-700 dark:text-amber-200 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs shadow-saffron-glow transition"
              >
                {isSubmitting ? 'Saving...' : selectedMember ? 'Update Member' : 'Create Committee Member'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
