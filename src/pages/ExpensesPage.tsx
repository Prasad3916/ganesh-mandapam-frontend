import React, { useState } from 'react';
import { Expense, PaymentMethod } from '../types';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { Flame, Plus, Inbox, UserCheck } from 'lucide-react';

interface ExpensesPageProps {
  expenses: Expense[];
  onRefreshData: () => void;
}

export const ExpensesPage: React.FC<ExpensesPageProps> = ({ expenses, onRefreshData }) => {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [categoryName, setCategoryName] = useState('Decoration');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BANK_TRANSFER');
  const [vendorName, setVendorName] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || Number(amount) <= 0) return;

    setIsSubmitting(true);
    try {
      await apiService.addExpense({
        title,
        categoryName,
        amount: Number(amount),
        paymentMethod,
        vendorName,
        notes,
        recordedBy: user?.name || 'Mandapam Admin',
      });
      onRefreshData();
      setShowAddModal(false);
      setTitle('');
      setAmount('');
      setVendorName('');
      setNotes('');
    } catch {
      // Error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-950 border border-gold-500/40 text-amber-50 shadow-mandapam flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-saffron-500/20 border border-saffron-400/40 rounded-xl text-saffron-400">
            <Flame className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs font-telugu-devotional text-gold-300 font-bold mb-0.5">
              శ్రీ గణేశాయ నమః • గణపతి బప్పా మోరియా
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-gold-300">
              Seva Expense Tracker
            </h2>
            <p className="text-xs text-amber-200/80">
              Record and audit operational expenses with author tracking
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs shadow-saffron-glow transition transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ Record Expense</span>
        </button>
      </div>

      {/* Expenses List / Empty State */}
      {expenses.length === 0 ? (
        <div className="p-12 rounded-2xl border-2 border-dashed border-gold-500/40 glass-mandapam text-center space-y-3 shadow-mandapam">
          <div className="flex justify-center text-slate-400 dark:text-amber-400/60">
            <Inbox className="w-12 h-12" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-gold-300">
            🙏 No Expenses Recorded Yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-amber-200 max-w-sm mx-auto leading-relaxed">
            Record mandapam decoration, pooja items, sound system, and prasadam expenses to maintain transparency.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-gold-500/30 glass-mandapam overflow-hidden shadow-mandapam">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-maroon-950 text-gold-300 border-b border-gold-500/30 font-cinzel font-bold">
                  <th className="p-3">Category</th>
                  <th className="p-3">Expense Title</th>
                  <th className="p-3">Vendor</th>
                  <th className="p-3">Payment Method</th>
                  <th className="p-3">Recorded By User</th>
                  <th className="p-3 text-right">Amount Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-500/10">
                {expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-saffron-500/5 transition">
                    <td className="p-3 font-bold text-saffron-600 dark:text-gold-300">{e.categoryName}</td>
                    <td className="p-3 font-semibold text-slate-800 dark:text-amber-100">{e.title}</td>
                    <td className="p-3 text-slate-600 dark:text-amber-200/80">{e.vendorName || '-'}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-gold-500/10 border border-gold-400/30 text-gold-700 dark:text-gold-300 text-[10px] font-mono font-bold">
                        {e.paymentMethod}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700 dark:text-amber-200">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-saffron-500/10 border border-saffron-400/40 text-saffron-600 dark:text-gold-300 font-bold text-xs">
                        <UserCheck className="w-3.5 h-3.5 text-saffron-500" />
                        <span>{e.recordedBy || 'Mandapam Admin'}</span>
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono font-extrabold text-maroon-700 dark:text-gold-300 text-sm">
                      -₹{e.paidAmount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white dark:bg-maroon-950 border-2 border-gold-500 rounded-2xl p-6 text-slate-900 dark:text-amber-50 space-y-4 shadow-mandapam"
          >
            <h3 className="text-lg font-bold font-cinzel text-saffron-600 dark:text-gold-300 border-b border-gold-500/30 pb-2">
              🙏 Record Seva Expense
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-xl bg-saffron-500/10 border border-gold-500/30 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-amber-200">Recording User:</span>
                <span className="font-bold text-saffron-600 dark:text-gold-300">
                  👤 {user?.name || 'Mandapam Admin'} ({user?.role})
                </span>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                  Expense Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flower Decoration & Lighting"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                  Category
                </label>
                <select
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100"
                >
                  <option value="Ganesh Idol">Ganesh Idol</option>
                  <option value="Decoration">Decoration & Mandapam</option>
                  <option value="Flowers">Flowers & Garlands</option>
                  <option value="Lighting">Lighting & Electricals</option>
                  <option value="Sound System">Sound System</option>
                  <option value="Pooja Items">Pooja Items & Samagri</option>
                  <option value="Prasadam & Food">Prasadam & Annadanam</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                    Vendor / Provider Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bhavani Prasad"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                    Amount Paid (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="12000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 font-mono font-bold text-slate-900 dark:text-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 rounded-lg border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100"
                >
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="UPI">UPI / GPay / PhonePe</option>
                  <option value="CASH">Cash</option>
                  <option value="CARD">Card</option>
                </select>
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
                {isSubmitting ? 'Recording...' : 'Submit Expense'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
