import React, { useState } from 'react';
import { Donation, PaymentMethod, PaymentStatus } from '../types';
import { apiService } from '../services/apiService';
import { HeartHandshake, Plus, Printer, Search, CheckCircle2, Clock, XCircle, Inbox } from 'lucide-react';
import { PrintReceiptModal } from '../components/ui/PrintReceiptModal';

interface OfferingsPageProps {
  donations: Donation[];
  onRefreshData: () => void;
}

export const OfferingsPage: React.FC<OfferingsPageProps> = ({ donations, onRefreshData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  // Form State
  const [devoteeName, setDevoteeName] = useState('');
  const [mobile, setMobile] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [status, setStatus] = useState<PaymentStatus>('COMPLETED');
  const [upiRef, setUpiRef] = useState('');
  const [purpose, setPurpose] = useState('Ganesh Chaturthi Seva Offering');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!devoteeName || !amount || Number(amount) <= 0) return;

    setIsSubmitting(true);
    try {
      await apiService.addDonation({
        devoteeName,
        mobile,
        amount: Number(amount),
        paymentMethod,
        status,
        upiRef,
        purpose,
        notes,
      });
      onRefreshData();
      setShowAddModal(false);
      // Reset
      setDevoteeName('');
      setMobile('');
      setAmount('');
      setUpiRef('');
      setNotes('');
      setStatus('COMPLETED');
    } catch {
      // Error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (donationId: string, newStatus: PaymentStatus) => {
    try {
      await apiService.updateDonationStatus(donationId, newStatus);
      onRefreshData();
    } catch {
      // Error
    }
  };

  const getStatusBadge = (st?: PaymentStatus) => {
    if (st === 'COMPLETED' || !st) {
      return (
        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span>Completed</span>
        </span>
      );
    }
    if (st === 'CANCELLED') {
      return (
        <span className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-400/40 text-red-700 dark:text-red-400 font-bold text-[10px] flex items-center gap-1">
          <XCircle className="w-3 h-3 text-red-500" />
          <span>Cancelled</span>
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-800 dark:text-amber-300 font-bold text-[10px] flex items-center gap-1">
        <Clock className="w-3 h-3 text-amber-500" />
        <span>Pending</span>
      </span>
    );
  };

  const filteredDonations = donations.filter(
    (d) =>
      d.devoteeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.mobile.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-950 border border-gold-500/40 text-amber-50 shadow-mandapam flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-saffron-500/20 border border-saffron-400/40 rounded-xl text-saffron-400">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs font-telugu-devotional text-gold-300 font-bold mb-0.5">
              శ్రీ గణేశాయ నమః • గణపతి బప్పా మోరియా
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-gold-300">
              Devotee Seva Offerings
            </h2>
            <p className="text-xs text-amber-200/80">
              Only COMPLETED offerings are counted in the total mandapam balance
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs shadow-saffron-glow transition transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ Record New Offering</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-amber-300/70" />
          <input
            type="text"
            placeholder="Search by devotee name, receipt no, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gold-500/30 glass-mandapam text-xs text-slate-900 dark:text-amber-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>
      </div>

      {/* Offerings Table / Empty State */}
      {filteredDonations.length === 0 ? (
        <div className="p-12 rounded-2xl border-2 border-dashed border-gold-500/40 glass-mandapam text-center space-y-3 shadow-mandapam">
          <div className="flex justify-center text-slate-400 dark:text-amber-400/60">
            <Inbox className="w-12 h-12" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-gold-300">
            🙏 No Offerings Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-amber-200 max-w-sm mx-auto leading-relaxed">
            No offering records matching your criteria. Record the first sacred contribution to begin tracking.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-gold-500/30 glass-mandapam overflow-hidden shadow-mandapam">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-maroon-950 text-gold-300 border-b border-gold-500/30 font-cinzel font-bold">
                  <th className="p-3">Receipt No</th>
                  <th className="p-3">Devotee Name</th>
                  <th className="p-3">Mobile</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-500/10">
                {filteredDonations.map((d) => (
                  <tr key={d.id} className="hover:bg-saffron-500/5 transition">
                    <td className="p-3 font-mono font-bold text-saffron-600 dark:text-gold-300">{d.receiptNumber}</td>
                    <td className="p-3 font-semibold text-slate-800 dark:text-amber-100">{d.devoteeName}</td>
                    <td className="p-3 font-mono text-slate-600 dark:text-amber-200/80">{d.mobile}</td>
                    <td className="p-3">{getStatusBadge(d.status)}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-gold-500/10 border border-gold-400/30 text-gold-700 dark:text-gold-300 text-[10px] font-mono font-bold">
                        {d.paymentMethod}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-extrabold text-emerald-700 dark:text-emerald-400 text-sm">
                      ₹{d.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-right flex items-center justify-end gap-2">
                      {d.status === 'PENDING' && (
                        <button
                          onClick={() => handleUpdateStatus(d.id, 'COMPLETED')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition"
                        >
                          Mark Completed
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedDonation(d)}
                        className="px-2.5 py-1 rounded-lg bg-maroon-900 hover:bg-maroon-800 border border-gold-500/40 text-gold-300 font-bold text-[10px] inline-flex items-center gap-1 transition"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Offering Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white dark:bg-maroon-950 border-2 border-gold-500 rounded-2xl p-6 text-slate-900 dark:text-amber-50 space-y-4 shadow-mandapam"
          >
            <h3 className="text-lg font-bold font-cinzel text-saffron-600 dark:text-gold-300 border-b border-gold-500/30 pb-2">
              🙏 Record Devotee Offering
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                  Devotee Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bhavani Prasad"
                  value={devoteeName}
                  onChange={(e) => setDevoteeName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-gold-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="5001"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 font-mono font-bold text-slate-900 dark:text-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 rounded-lg border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100"
                  >
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="CASH">Cash</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CARD">Card</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                    Offering Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PaymentStatus)}
                    className="w-full px-3 py-2 rounded-lg border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100 font-semibold"
                  >
                    <option value="COMPLETED">🟢 Completed (Add to Total)</option>
                    <option value="PENDING">🟡 Pending (Do NOT Add to Total)</option>
                  </select>
                </div>
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
                {isSubmitting ? 'Recording...' : 'Submit Offering'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedDonation && (
        <PrintReceiptModal donation={selectedDonation} onClose={() => setSelectedDonation(null)} />
      )}
    </div>
  );
};
