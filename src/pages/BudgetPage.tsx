import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BudgetSankalp, FinancialSummary } from '../types';
import { apiService } from '../services/apiService';
import { Target, Edit2, Plus, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface BudgetPageProps {
  budgets: BudgetSankalp[];
  summary: FinancialSummary;
  onRefreshData?: () => void;
}

export const BudgetPage: React.FC<BudgetPageProps> = ({ budgets, summary, onRefreshData }) => {
  const [editingBudget, setEditingBudget] = useState<BudgetSankalp | null>(null);
  const [editTargetBudget, setEditTargetBudget] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newTargetBudget, setNewTargetBudget] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const collectionPercentage = Math.min(
    100,
    Math.round((summary.totalOfferingsReceived / summary.totalTargetBudget) * 100)
  );

  const utilizationPercentage = Math.min(
    100,
    Math.round((summary.totalSevaExpensesPaid / summary.totalTargetBudget) * 100)
  );

  const handleOpenEdit = (b: BudgetSankalp) => {
    setEditingBudget(b);
    setEditCategoryName(b.categoryName);
    setEditTargetBudget(String(b.targetBudget));
    setErrorMsg('');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBudget || !editTargetBudget) return;

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await apiService.updateBudget(
        editingBudget.id,
        parseFloat(editTargetBudget),
        editCategoryName
      );
      setSuccessMsg(`Updated target budget for "${editCategoryName}"`);
      setEditingBudget(null);
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update budget allocation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName || !newTargetBudget) return;

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await apiService.addBudget({
        categoryName: newCategoryName,
        targetBudget: parseFloat(newTargetBudget),
      });
      setSuccessMsg(`Added new budget allocation for "${newCategoryName}"`);
      setShowAddModal(false);
      setNewCategoryName('');
      setNewTargetBudget('');
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to add new budget allocation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-950 border border-gold-500/40 text-amber-50 shadow-mandapam space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-saffron-500/20 border border-saffron-400/40 rounded-xl text-saffron-400">
            <Target className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-gold-300">
              🎯 Festival Sankalp Budget
            </h2>
            <p className="text-xs text-amber-200/80 font-sans">
              2026 Utsav Target Budget Allocation vs Realized Collections & Disbursements
            </p>
          </div>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-2">
          <div className="p-3 rounded-xl bg-maroon-950/70 border border-gold-500/30">
            <span className="text-[11px] text-amber-300/70 block">Total Sankalp Target</span>
            <span className="text-lg font-bold font-mono text-gold-300">
              ₹{summary.totalTargetBudget.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-maroon-950/70 border border-gold-500/30">
            <span className="text-[11px] text-amber-300/70 block">Offerings Collected</span>
            <span className="text-lg font-bold font-mono text-saffron-400">
              ₹{summary.totalOfferingsReceived.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-maroon-950/70 border border-gold-500/30">
            <span className="text-[11px] text-amber-300/70 block">Actual Spent</span>
            <span className="text-lg font-bold font-mono text-amber-200">
              ₹{summary.totalSevaExpensesPaid.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-maroon-950/70 border border-gold-500/30">
            <span className="text-[11px] text-amber-300/70 block">Pending Commitments</span>
            <span className="text-lg font-bold font-mono text-amber-400">
              ₹{summary.totalPendingPayments.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Progress Bars Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Funds Collected Progress */}
        <div className="p-6 rounded-2xl border border-gold-500/30 glass-mandapam space-y-3">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span className="text-slate-800 dark:text-gold-300 font-cinzel">Funds Collected</span>
            <span className="text-saffron-600 dark:text-saffron-400 font-mono font-bold">
              {collectionPercentage}%
            </span>
          </div>
          <div className="w-full h-4 bg-slate-200 dark:bg-maroon-950 rounded-full overflow-hidden border border-gold-500/30">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${collectionPercentage}%` }}
              transition={{ duration: 1.2 }}
              className="h-full bg-gradient-to-r from-saffron-500 via-gold-500 to-gold-400 rounded-full"
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-amber-200/70">
            Collected ₹{summary.totalOfferingsReceived.toLocaleString('en-IN')} out of ₹{summary.totalTargetBudget.toLocaleString('en-IN')} target
          </p>
        </div>

        {/* Budget Utilized Progress */}
        <div className="p-6 rounded-2xl border border-gold-500/30 glass-mandapam space-y-3">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span className="text-slate-800 dark:text-gold-300 font-cinzel">Budget Utilized</span>
            <span className="text-gold-600 dark:text-amber-300 font-mono font-bold">
              {utilizationPercentage}%
            </span>
          </div>
          <div className="w-full h-4 bg-slate-200 dark:bg-maroon-950 rounded-full overflow-hidden border border-gold-500/30">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${utilizationPercentage}%` }}
              transition={{ duration: 1.2 }}
              className="h-full bg-gradient-to-r from-gold-600 to-maroon-700 rounded-full"
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-amber-200/70">
            Disbursed ₹{summary.totalSevaExpensesPaid.toLocaleString('en-IN')} out of ₹{summary.totalTargetBudget.toLocaleString('en-IN')} total target
          </p>
        </div>
      </div>

      {/* Category Sankalp Budget Allocation Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-bold font-cinzel text-slate-800 dark:text-gold-300">
            Category-wise Sankalp Allocation
          </h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs shadow-saffron-glow transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Allocation</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((b) => {
            const pct = Math.round(((b.actualSpent + b.committed) / (b.targetBudget || 1)) * 100);
            return (
              <div
                key={b.id}
                className="p-5 rounded-2xl border border-gold-500/30 glass-mandapam space-y-3 shadow-mandapam flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-cinzel font-bold text-sm text-slate-800 dark:text-amber-100">
                      {b.categoryName}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-gold-500/20 text-gold-700 dark:text-gold-300">
                        {pct}% Used
                      </span>
                      <button
                        onClick={() => handleOpenEdit(b)}
                        className="p-1 rounded bg-saffron-500/10 hover:bg-saffron-500/20 text-saffron-600 dark:text-gold-300 transition"
                        title="Modify Target Budget"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="w-full h-2.5 bg-slate-200 dark:bg-maroon-950 rounded-full overflow-hidden my-2">
                    <div
                      className="h-full bg-gradient-to-r from-saffron-500 to-gold-500 rounded-full"
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-2 border-t border-gold-500/20">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-amber-300/70 block">Target</span>
                    <span className="font-semibold text-slate-800 dark:text-amber-200">
                      ₹{b.targetBudget.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-amber-300/70 block">Spent</span>
                    <span className="font-semibold text-saffron-600 dark:text-saffron-400">
                      ₹{b.actualSpent.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-amber-300/70 block">Committed</span>
                    <span className="font-semibold text-amber-500">
                      ₹{b.committed.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Budget Modal */}
      {editingBudget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <form
            onSubmit={handleSaveEdit}
            className="w-full max-w-md bg-white dark:bg-maroon-950 border-2 border-gold-500 rounded-2xl p-6 text-slate-900 dark:text-amber-50 space-y-4 shadow-mandapam"
          >
            <div className="flex items-center justify-between border-b border-gold-500/30 pb-2">
              <h3 className="text-base font-bold font-cinzel text-saffron-600 dark:text-gold-300">
                ✏ Modify Category Budget Target
              </h3>
              <button
                type="button"
                onClick={() => setEditingBudget(null)}
                className="text-slate-400 hover:text-slate-600 dark:text-amber-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                  Target Budget Allocation (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={editTargetBudget}
                  onChange={(e) => setEditTargetBudget(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gold-500/20">
              <button
                type="button"
                onClick={() => setEditingBudget(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-maroon-900 text-slate-700 dark:text-amber-200 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold shadow-saffron-glow transition"
              >
                {isSubmitting ? 'Saving...' : 'Save Target Budget'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Budget Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <form
            onSubmit={handleCreateBudget}
            className="w-full max-w-md bg-white dark:bg-maroon-950 border-2 border-gold-500 rounded-2xl p-6 text-slate-900 dark:text-amber-50 space-y-4 shadow-mandapam"
          >
            <div className="flex items-center justify-between border-b border-gold-500/30 pb-2">
              <h3 className="text-base font-bold font-cinzel text-saffron-600 dark:text-gold-300">
                ➕ Add Category Sankalp Allocation
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:text-amber-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electrical & Lighting"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                  Target Budget Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="30000"
                  value={newTargetBudget}
                  onChange={(e) => setNewTargetBudget(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gold-500/20">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-maroon-900 text-slate-700 dark:text-amber-200 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold shadow-saffron-glow transition"
              >
                {isSubmitting ? 'Creating...' : 'Create Allocation'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
