import React from 'react';
import { FinancialSummary, Expense } from '../types';
import { StatCard } from '../components/ui/StatCard';
import { GaneshIcon } from '../components/devotional/GaneshIcon';
import { DevotionalBlessingCard } from '../components/devotional/DevotionalBlessingCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, Clock, Plus, Inbox } from 'lucide-react';

interface MandapamDashboardProps {
  summary: FinancialSummary;
  expenses: Expense[];
  isLoading?: boolean;
  onOpenOfferingModal: () => void;
  onOpenExpenseModal: () => void;
}

export const MandapamDashboard: React.FC<MandapamDashboardProps> = ({
  summary,
  expenses,
  isLoading = false,
  onOpenOfferingModal,
  onOpenExpenseModal,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4 text-center">
        <div className="p-4 bg-maroon-950/80 rounded-full border-2 border-gold-500/50 shadow-gold-glow animate-pulse">
          <GaneshIcon className="w-12 h-12 text-gold-400" />
        </div>
        <p className="font-cinzel text-lg font-bold text-gold-300">
          Preparing the Mandapam...
        </p>
        <p className="text-xs font-telugu-devotional text-amber-200/80">
          శ్రీ గణేశాయ నమః • గణపతి బప్పా మోరియా
        </p>
      </div>
    );
  }

  const isEmpty = summary.totalOfferingsReceived === 0 && summary.totalSevaExpensesPaid === 0;

  const categoryData = expenses.length > 0
    ? expenses.map((e, idx) => ({
        name: e.categoryName || 'General',
        value: e.paidAmount || 0,
        color: ['#F59E0B', '#D4AF37', '#E65100', '#10B981', '#EC4899', '#8B5CF6'][idx % 6],
      }))
    : [{ name: 'No Expenses Yet', value: 1, color: '#4A1D2B' }];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-950 border border-gold-500/40 p-6 sm:p-8 text-amber-50 shadow-mandapam">
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300 text-xs font-telugu-devotional font-bold tracking-wide">
              <span>శ్రీ గణేశాయ నమః • గణపతి బప్పా మోరియా</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-gold-300 to-saffron-300">
              Bala Ganapathi Seva Samithi
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/90 font-sans">
              Digital Mandapam • Devotion • Seva • Community • Transparency
            </p>
          </div>

          <div className="p-4 bg-maroon-950/80 rounded-2xl border-2 border-gold-500/50 shadow-gold-glow shrink-0">
            <GaneshIcon className="w-16 h-16 text-gold-400" />
          </div>
        </div>
      </div>

      {/* 2. Devotional Blessing Card */}
      <DevotionalBlessingCard />

      {/* Empty Database Prompt Banner */}
      {isEmpty && (
        <div className="p-8 rounded-2xl border-2 border-dashed border-gold-500/50 glass-mandapam text-center space-y-3 shadow-mandapam">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-saffron-500/10 text-saffron-500">
              <Inbox className="w-8 h-8" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-gold-300">
            🙏 No Offerings Recorded Yet
          </h3>
          <p className="text-xs text-slate-600 dark:text-amber-200 max-w-md mx-auto leading-relaxed">
            Be the first to record an offering for the festival. All figures sync live to the Mandapam financial registry.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={onOpenOfferingModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs shadow-saffron-glow transition"
            >
              <Plus className="w-4 h-4" />
              <span>Record First Offering</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Financial Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Offerings Received"
          subTitle="Total Devotee Contributions"
          amount={`₹${summary.totalOfferingsReceived.toLocaleString('en-IN')}`}
          icon="💰"
          badgeText="Offerings"
          accentColor="gold"
          tooltipText="Total offerings recorded in database"
        />

        <StatCard
          title="Seva Expenses"
          subTitle="Total Completed Expenses"
          amount={`₹${summary.totalSevaExpensesPaid.toLocaleString('en-IN')}`}
          icon="🪔"
          badgeText="Expenses"
          accentColor="saffron"
          tooltipText="Total completed expenses"
        />

        <StatCard
          title="Current Balance"
          subTitle="Cash In Hand / Bank"
          amount={`₹${summary.currentBalance.toLocaleString('en-IN')}`}
          icon="🏦"
          badgeText="Balance"
          accentColor="green"
          tooltipText="Offerings minus completed expenses"
        />

        <StatCard
          title="Pending Payments"
          subTitle="Vendor Obligations"
          amount={`₹${summary.totalPendingPayments.toLocaleString('en-IN')}`}
          icon="📜"
          badgeText="Pending"
          accentColor="amber"
          tooltipText="Pending vendor commitments"
        />

        <StatCard
          title="Available Balance"
          subTitle="Net Uncommitted Funds"
          amount={`₹${summary.availableBalance.toLocaleString('en-IN')}`}
          icon="🎯"
          badgeText="Available"
          accentColor="maroon"
          tooltipText="Current balance minus pending commitments"
        />

        <StatCard
          title="Devotees Contributed"
          subTitle="Unique Contributors"
          amount={`${summary.totalDevoteesCount}`}
          icon="🙏"
          badgeText="Devotees"
          accentColor="gold"
          tooltipText="Unique contributors from database"
        />
      </div>

      {/* 4. Daily Seva Breakdown & Expense Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gold-500/30 glass-mandapam p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-gold-500/20 pb-3">
            <TrendingUp className="w-5 h-5 text-saffron-500" />
            <h3 className="font-cinzel font-bold text-base text-slate-800 dark:text-gold-300">
              Seva Expense Distribution
            </h3>
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`₹${Number(val).toLocaleString('en-IN')}`, name]}
                  contentStyle={{
                    backgroundColor: '#1E080F',
                    borderColor: '#D4AF37',
                    borderWidth: '1.5px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.7)',
                    padding: '10px 14px',
                  }}
                  itemStyle={{
                    color: '#FFD700',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    paddingTop: '2px',
                  }}
                  labelStyle={{
                    color: '#FFF8DC',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    marginBottom: '2px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latest Seva Log */}
        <div className="rounded-2xl border border-gold-500/30 glass-mandapam p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-gold-500/20 pb-3">
            <Clock className="w-5 h-5 text-gold-500" />
            <h3 className="font-cinzel font-bold text-base text-slate-800 dark:text-gold-300">
              Latest Seva Expense Log
            </h3>
          </div>

          {expenses.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-amber-300/70 italic py-8 text-center">
              No expense records found in database.
            </p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {expenses.map((e) => (
                <div key={e.id} className="p-3 rounded-xl bg-slate-50 dark:bg-maroon-950/50 border border-gold-500/20 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-amber-100">{e.title}</span>
                    <span className="block text-[10px] text-slate-500 dark:text-amber-300/70">{e.categoryName}</span>
                  </div>
                  <span className="font-mono font-bold text-maroon-700 dark:text-gold-300">
                    -₹{e.paidAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
