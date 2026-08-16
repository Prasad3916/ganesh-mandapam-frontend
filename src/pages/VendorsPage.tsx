import React, { useState } from 'react';
import { Payment } from '../types';
import { useAuth } from '../context/AuthContext';
import { Store, Clock, CheckCircle2, XCircle, Plus, UserCheck } from 'lucide-react';
import { apiService } from '../services/apiService';
import { apiFetch } from '../api/apiClient';

interface VendorsPageProps {
  vendors: Payment[];
  onRefreshData: () => void;
}

export const VendorsPage: React.FC<VendorsPageProps> = ({ vendors, onRefreshData }) => {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [description, setDescription] = useState('');
  const [serviceCategory, setServiceCategory] = useState('Decoration');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');
  const [vendorName, setVendorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || Number(amount) <= 0) return;

    setIsSubmitting(true);
    try {
      const currentUserName = user?.name || 'Mandapam Admin';
      await apiFetch('/payments', {
        method: 'POST',
        body: JSON.stringify({
          description,
          serviceCategory,
          amount: Number(amount),
          paymentMethod,
          vendorName,
          status: 'PENDING',
          processedBy: currentUserName,
        }),
      });
      onRefreshData();
      setShowAddModal(false);
      setDescription('');
      setAmount('');
      setVendorName('');
    } catch {
      // Error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (paymentId: string | number, newStatus: 'COMPLETED' | 'CANCELLED') => {
    try {
      const currentUserName = user?.name || 'Mandapam Admin';
      await apiService.updatePaymentStatus(paymentId, newStatus, currentUserName);
      onRefreshData();
    } catch {
      // Error
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'COMPLETED') {
      return (
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-700 dark:text-emerald-400 font-bold text-[11px] flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>🟢 Completed</span>
        </span>
      );
    }
    if (status === 'CANCELLED') {
      return (
        <span className="px-2.5 py-1 rounded-full bg-red-500/20 border border-red-400/40 text-red-700 dark:text-red-400 font-bold text-[11px] flex items-center gap-1">
          <XCircle className="w-3.5 h-3.5 text-red-500" />
          <span>🔴 Cancelled</span>
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-800 dark:text-amber-300 font-bold text-[11px] flex items-center gap-1">
        <Clock className="w-3.5 h-3.5 text-amber-500" />
        <span>🟡 Pending</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-950 border border-gold-500/40 text-amber-50 shadow-mandapam flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-saffron-500/20 border border-saffron-400/40 rounded-xl text-saffron-400">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs font-telugu-devotional text-gold-300 font-bold mb-0.5">
              శ్రీ గణేశాయ నమః • గణపతి బప్పా మోరియా
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-gold-300">
              Payments & Vendor Obligations
            </h2>
            <p className="text-xs text-amber-200/80">
              Track vendor commitments with user author tracking: 🟡 Pending, 🟢 Completed, 🔴 Cancelled
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs shadow-saffron-glow transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Vendor Payment</span>
        </button>
      </div>

      {/* Vendor Commitments Grid */}
      {vendors.length === 0 ? (
        <div className="p-12 rounded-2xl border-2 border-dashed border-gold-500/40 glass-mandapam text-center space-y-3 shadow-mandapam">
          <div className="flex justify-center text-slate-400 dark:text-amber-400/60">
            <Clock className="w-12 h-12" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-gold-300">
            🙏 No Payment Obligations Recorded
          </h3>
          <p className="text-xs text-slate-500 dark:text-amber-200 max-w-sm mx-auto leading-relaxed">
            Record sound system, tent, or decoration vendor payment commitments here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((v) => (
            <div
              key={v.id}
              className="p-5 rounded-2xl border border-gold-500/30 glass-mandapam space-y-4 shadow-mandapam flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-cinzel font-bold text-base text-slate-900 dark:text-gold-300">
                      {v.vendorName || v.description}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-amber-200/70">{v.serviceCategory}</p>
                  </div>
                  {getStatusBadge(v.status)}
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-maroon-950/60 border border-gold-500/20 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 dark:text-amber-200">
                    Total Amount:
                  </span>
                  <span className="text-lg font-bold font-mono text-saffron-600 dark:text-gold-300">
                    ₹{v.amount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="pt-2 border-t border-gold-500/10 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-amber-300/70 font-medium">Processed By:</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-saffron-500/10 border border-saffron-400/30 text-saffron-600 dark:text-gold-300 font-bold text-xs">
                    <UserCheck className="w-3.5 h-3.5 text-saffron-500" />
                    <span>{v.processedBy || 'Mandapam Admin'}</span>
                  </span>
                </div>
              </div>

              {/* State Machine Transition Actions */}
              {v.status === 'PENDING' && (
                <div className="pt-2 border-t border-gold-500/20 flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(v.id, 'COMPLETED')}
                    className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
                  >
                    🟢 Mark Completed
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(v.id, 'CANCELLED')}
                    className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-700 dark:text-red-300 font-bold text-xs transition"
                  >
                    🔴 Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Payment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <form
            onSubmit={handleCreatePayment}
            className="w-full max-w-md bg-white dark:bg-maroon-950 border-2 border-gold-500 rounded-2xl p-6 text-slate-900 dark:text-amber-50 space-y-4 shadow-mandapam"
          >
            <h3 className="text-lg font-bold font-cinzel text-saffron-600 dark:text-gold-300 border-b border-gold-500/30 pb-2">
              🙏 New Vendor Payment Record
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-xl bg-saffron-500/10 border border-gold-500/30 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-amber-200">Processing User:</span>
                <span className="font-bold text-saffron-600 dark:text-gold-300">
                  👤 {user?.name || 'Mandapam Admin'} ({user?.role})
                </span>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                  Vendor Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bhavani Prasad"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                  Service Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mandapam Flower Decoration"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                  Agreed Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="15000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 font-mono font-bold text-slate-900 dark:text-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gold-500/20">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-maroon-900 text-slate-700 dark:text-amber-200 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs shadow-saffron-glow transition"
              >
                {isSubmitting ? 'Recording...' : 'Submit Payment'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
