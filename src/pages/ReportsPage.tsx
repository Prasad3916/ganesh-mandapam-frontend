import React, { useState } from 'react';
import { FinancialSummary, Donation, Expense } from '../types';
import { GaneshIcon } from '../components/devotional/GaneshIcon';
import { Printer, Download, FileText } from 'lucide-react';

interface ReportsPageProps {
  summary: FinancialSummary;
  donations: Donation[];
  expenses: Expense[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ summary, donations, expenses }) => {
  const [reportType, setReportType] = useState<'SUMMARY' | 'DONATIONS' | 'EXPENSES'>('SUMMARY');

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (reportType === 'DONATIONS') {
      csvContent += 'Receipt No,Devotee Name,Date,Method,Purpose,Amount\n';
      donations.forEach((d) => {
        csvContent += `"${d.receiptNumber}","${d.devoteeName}","${d.date}","${d.paymentMethod}","${d.purpose}",${d.amount}\n`;
      });
    } else if (reportType === 'EXPENSES') {
      csvContent += 'Category,Title,Vendor,Date,Method,Amount Paid\n';
      expenses.forEach((e) => {
        csvContent += `"${e.categoryName}","${e.title}","${e.vendorName || ''}","${e.date}","${e.paymentMethod}",${e.paidAmount}\n`;
      });
    } else {
      csvContent += 'Financial Metric,Amount\n';
      csvContent += `Total Offerings Received,${summary.totalOfferingsReceived}\n`;
      csvContent += `Total Seva Expenses Paid,${summary.totalSevaExpensesPaid}\n`;
      csvContent += `Current Balance,${summary.currentBalance}\n`;
      csvContent += `Pending Seva Payments,${summary.totalPendingPayments}\n`;
      csvContent += `Available Balance,${summary.availableBalance}\n`;
      csvContent += `Devotees Contributed,${summary.totalDevoteesCount}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bala_Ganapathi_Seva_Samithi_${reportType}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-950 border border-gold-500/40 text-amber-50 shadow-mandapam flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-saffron-500/20 border border-saffron-400/40 rounded-xl text-saffron-400">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs font-telugu-devotional text-gold-300 font-bold mb-0.5">
              శ్రీ గణేశాయ నమః • గణపతి బప్పా మోరియా
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-gold-300">
              Financial Audit Reports
            </h2>
            <p className="text-xs text-amber-200/80">
              Print transparent financial summaries, offerings log, and audit statements
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-maroon-950 hover:bg-maroon-900 border border-gold-500/40 text-gold-300 text-xs font-bold transition"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white text-xs font-bold shadow-saffron-glow transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Selector */}
      <div className="flex items-center gap-2 border-b border-gold-500/20 pb-2">
        <button
          onClick={() => setReportType('SUMMARY')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            reportType === 'SUMMARY'
              ? 'bg-saffron-500 text-white shadow-saffron-glow'
              : 'bg-maroon-950/60 text-amber-200/70 hover:text-amber-100'
          }`}
        >
          Financial Summary
        </button>
        <button
          onClick={() => setReportType('DONATIONS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            reportType === 'DONATIONS'
              ? 'bg-saffron-500 text-white shadow-saffron-glow'
              : 'bg-maroon-950/60 text-amber-200/70 hover:text-amber-100'
          }`}
        >
          Offerings Log
        </button>
        <button
          onClick={() => setReportType('EXPENSES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            reportType === 'EXPENSES'
              ? 'bg-saffron-500 text-white shadow-saffron-glow'
              : 'bg-maroon-950/60 text-amber-200/70 hover:text-amber-100'
          }`}
        >
          Expenses Log
        </button>
      </div>

      {/* Printable Report Paper */}
      <div
        id="printable-receipt"
        className="p-8 rounded-2xl bg-white text-slate-900 border-2 border-gold-500/60 space-y-6 shadow-mandapam max-w-4xl mx-auto"
      >
        <div className="text-center border-b-2 border-amber-900/30 pb-4 space-y-1">
          <div className="flex justify-center mb-2">
            <GaneshIcon className="w-12 h-12 text-saffron-600" />
          </div>
          <p className="font-telugu-devotional text-base font-bold text-saffron-700">
            శ్రీ గణేశాయ నమః • గణపతి బప్పా మోరియా
          </p>
          <h1 className="font-cinzel text-2xl font-extrabold text-maroon-900">
            Bala Ganapathi Seva Samithi
          </h1>
          <p className="text-xs font-bold text-gold-700 tracking-widest uppercase">
            Official Devotional Financial Report 2026
          </p>
          <div className="flex items-center justify-center gap-6 text-[11px] text-slate-600 pt-1 font-mono">
            <span>Date: {new Date().toLocaleDateString('en-IN')}</span>
            <span>•</span>
            <span>Verified Devotional Financial Report</span>
          </div>
        </div>

        {reportType === 'SUMMARY' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-amber-900/20">
                <span className="text-slate-500 block text-[10px]">Total Offerings Received</span>
                <span className="text-lg font-mono font-bold text-saffron-700">
                  ₹{summary.totalOfferingsReceived.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-amber-900/20">
                <span className="text-slate-500 block text-[10px]">Total Expenses Paid</span>
                <span className="text-lg font-mono font-bold text-maroon-900">
                  ₹{summary.totalSevaExpensesPaid.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-amber-900/20">
                <span className="text-slate-500 block text-[10px]">Current Balance</span>
                <span className="text-lg font-mono font-bold text-emerald-700">
                  ₹{summary.currentBalance.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        )}

        {reportType === 'DONATIONS' && (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-amber-900/30 text-maroon-900 font-cinzel font-bold">
                <th className="py-2">Receipt No</th>
                <th className="py-2">Devotee Name</th>
                <th className="py-2">Method</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-900/10">
              {donations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-500 italic">
                    No offerings recorded in database yet.
                  </td>
                </tr>
              ) : (
                donations.map((d) => (
                  <tr key={d.id}>
                    <td className="py-2 font-mono font-bold text-slate-800">{d.receiptNumber}</td>
                    <td className="py-2 font-semibold text-maroon-900">{d.devoteeName}</td>
                    <td className="py-2">{d.paymentMethod}</td>
                    <td className="py-2 text-right font-mono font-extrabold text-saffron-700">
                      ₹{d.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {reportType === 'EXPENSES' && (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-amber-900/30 text-maroon-900 font-cinzel font-bold">
                <th className="py-2">Category</th>
                <th className="py-2">Title</th>
                <th className="py-2 text-right">Amount Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-900/10">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-slate-500 italic">
                    No expenses recorded in database yet.
                  </td>
                </tr>
              ) : (
                expenses.map((e) => (
                  <tr key={e.id}>
                    <td className="py-2 font-bold text-saffron-800">{e.categoryName}</td>
                    <td className="py-2">{e.title}</td>
                    <td className="py-2 text-right font-mono font-extrabold text-maroon-900">
                      ₹{e.paidAmount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        <div className="pt-8 border-t border-amber-900/20 grid grid-cols-2 gap-4 text-center text-xs">
          <div>
            <div className="w-36 h-0.5 bg-slate-400 mx-auto mb-1" />
            <p className="font-bold text-slate-800">Treasurer Signature</p>
          </div>
          <div>
            <div className="w-36 h-0.5 bg-slate-400 mx-auto mb-1" />
            <p className="font-bold text-slate-800">President Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
};
