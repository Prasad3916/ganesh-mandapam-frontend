import React, { useState, useEffect } from 'react';
import { Vendor } from '../types';
import { apiService } from '../services/apiService';
import { Building2, Plus, Search, Phone, Calendar, CheckCircle2, Clock, X, AlertCircle } from 'lucide-react';

export const VendorsDirectoryPage: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [serviceCategory, setServiceCategory] = useState('Decoration');
  const [mobile, setMobile] = useState('');
  const [totalAgreedAmount, setTotalAgreedAmount] = useState('');
  const [dueDate, setDueDate] = useState('2026-08-30');

  const fetchVendors = async () => {
    try {
      const data = await apiService.getVendors();
      setVendors(data);
    } catch {
      setVendors([]);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !totalAgreedAmount) return;

    setIsSubmitting(true);
    setFormError('');
    try {
      await apiService.addVendor({
        name,
        serviceCategory,
        mobile,
        totalAgreedAmount: parseFloat(totalAgreedAmount),
        dueDate,
      });
      setShowModal(false);
      setName('');
      setMobile('');
      setTotalAgreedAmount('');
      fetchVendors();
    } catch (err: any) {
      setFormError(err.message || 'Failed to add vendor partner.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.serviceCategory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-950 border border-gold-500/40 text-amber-50 shadow-mandapam flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-saffron-500/20 border border-saffron-400/40 rounded-xl text-saffron-400">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs font-telugu-devotional text-gold-300 font-bold mb-0.5">
              శ్రీ గణేశాయ నమః • గణపతి బప్పా మోరియా
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-gold-300">
              Vendor Partners Directory
            </h2>
            <p className="text-xs text-amber-200/80">
              Registry of verified service providers, tent decorators, sound operators, and flower suppliers
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs shadow-saffron-glow transition transform hover:-translate-y-0.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Register Vendor</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl border border-gold-500/30 glass-mandapam flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-amber-300/60" />
          <input
            type="text"
            placeholder="Search vendor name or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100"
          />
        </div>
        <span className="text-xs text-slate-500 dark:text-amber-200/70 font-mono">
          Registered Vendors: {filtered.length}
        </span>
      </div>

      {/* Vendors Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-2xl border-2 border-dashed border-gold-500/40 glass-mandapam text-center space-y-3 shadow-mandapam">
          <Building2 className="w-12 h-12 text-slate-400 dark:text-amber-400/60 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-gold-300">
            No Vendors Registered Yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-amber-200 max-w-sm mx-auto">
            Add service partners to track contract agreements and payment schedules.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((vendor) => (
            <div
              key={vendor.id}
              className="p-5 rounded-2xl border border-gold-500/30 glass-mandapam space-y-3 shadow-mandapam flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-saffron-500/10 border border-saffron-400/30 text-saffron-600 dark:text-gold-300 font-bold text-[10px]">
                    {vendor.serviceCategory}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                      vendor.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-300'
                    }`}
                  >
                    {vendor.status === 'COMPLETED' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    <span>{vendor.status}</span>
                  </span>
                </div>

                <h3 className="font-cinzel font-bold text-base text-slate-900 dark:text-gold-300">
                  {vendor.name}
                </h3>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-amber-200/80 text-xs mt-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span className="font-mono">{vendor.mobile || 'N/A'}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gold-500/20 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-amber-300/70 block">Agreed Contract</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-amber-100">
                    ₹{vendor.totalAgreedAmount ? vendor.totalAgreedAmount.toLocaleString('en-IN') : 0}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-amber-300/70 block">Amount Paid</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{vendor.totalPaidAmount ? vendor.totalPaidAmount.toLocaleString('en-IN') : 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Vendor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white dark:bg-maroon-950 border-2 border-gold-500 rounded-2xl p-6 text-slate-900 dark:text-amber-50 space-y-4 shadow-mandapam"
          >
            <div className="flex items-center justify-between border-b border-gold-500/30 pb-2">
              <h3 className="text-lg font-bold font-cinzel text-saffron-600 dark:text-gold-300">
                ➕ Register New Vendor Partner
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
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

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                  Vendor / Business Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Balaji Sound System"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                  Service Category
                </label>
                <select
                  value={serviceCategory}
                  onChange={(e) => setServiceCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100"
                >
                  <option value="Decoration">Decoration & Mandapam</option>
                  <option value="Sound System">Sound System & Audio</option>
                  <option value="Flowers">Flowers & Garland Supply</option>
                  <option value="Lighting">Lighting & Electrician</option>
                  <option value="Catering">Catering & Prasadam</option>
                  <option value="General Service">General Service</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                  Mobile Contact
                </label>
                <input
                  type="text"
                  placeholder="+91 9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-amber-200">
                  Total Agreed Contract Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="35000"
                  value={totalAgreedAmount}
                  onChange={(e) => setTotalAgreedAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gold-500/40 bg-slate-50 dark:bg-maroon-900 text-slate-900 dark:text-amber-100 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gold-500/20">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-maroon-900 text-slate-700 dark:text-amber-200 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold shadow-saffron-glow transition"
              >
                {isSubmitting ? 'Registering...' : 'Register Vendor'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
