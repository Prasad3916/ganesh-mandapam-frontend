import React from 'react';
import { Donation } from '../../types';
import { GaneshIcon } from '../devotional/GaneshIcon';
import { Printer, X } from 'lucide-react';

interface PrintReceiptModalProps {
  donation: Donation;
  onClose: () => void;
}

export const PrintReceiptModal: React.FC<PrintReceiptModalProps> = ({ donation, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border-2 border-gold-500 shadow-mandapam overflow-hidden">
        {/* Modal Top Actions */}
        <div className="p-4 bg-maroon-950 text-amber-50 flex items-center justify-between border-b border-gold-500/40">
          <span className="font-cinzel font-bold text-xs text-gold-300">Official Seva Offering Receipt</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
            <button onClick={onClose} className="p-1 text-amber-200 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div id="printable-receipt" className="p-8 text-slate-900 space-y-6">
          <div className="text-center space-y-1 border-b-2 border-amber-900/20 pb-4">
            <div className="flex justify-center mb-1">
              <GaneshIcon className="w-10 h-10 text-saffron-600" />
            </div>
            <p className="font-telugu-devotional text-sm font-bold text-saffron-700">
              శ్రీ గణేశాయ నమః • గణపతి బప్పా మోరియా
            </p>
            <h3 className="font-cinzel text-base font-extrabold text-maroon-900">
              Bala Ganapathi Seva Samithi
            </h3>
            <p className="text-[10px] text-slate-600">Official Seva Offering Receipt • Utsav 2026</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-700 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] block">Receipt Number</span>
              <span className="font-mono font-bold text-maroon-900">{donation.receiptNumber}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-[10px] block">Date</span>
              <span className="font-mono">{donation.date || new Date().toLocaleDateString('en-IN')}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-amber-900/20 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Devotee Name:</span>
              <span className="font-bold text-maroon-900">{donation.devoteeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Mobile Phone:</span>
              <span className="font-mono">{donation.mobile || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Seva Purpose:</span>
              <span className="font-medium">{donation.purpose}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Mode:</span>
              <span className="font-mono font-bold text-saffron-700">{donation.paymentMethod}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-saffron-500/10 border-2 border-saffron-500/30 flex items-center justify-between text-slate-900">
            <span className="font-bold text-xs uppercase">Sacred Amount Received:</span>
            <span className="font-mono text-2xl font-extrabold text-saffron-700">
              ₹{donation.amount.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="pt-6 border-t border-amber-900/20 flex items-center justify-between text-[10px] text-slate-500">
            <p>Thank you for your sacred contribution!</p>
            <p className="font-semibold text-slate-800">Authorized Samithi Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
};
