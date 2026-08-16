import React, { useState } from 'react';
import { Donation } from '../types';
import { Users, Search, Award } from 'lucide-react';

interface DevoteesPageProps {
  donations: Donation[];
}

export const DevoteesPage: React.FC<DevoteesPageProps> = ({ donations }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Aggregate contributions by devotee phone or name
  const devoteeMap = new Map<string, { name: string; mobile: string; total: number; count: number }>();

  donations.forEach((d) => {
    const key = d.mobile || d.devoteeName;
    const existing = devoteeMap.get(key);
    if (existing) {
      existing.total += d.amount;
      existing.count += 1;
    } else {
      devoteeMap.set(key, {
        name: d.devoteeName,
        mobile: d.mobile || 'N/A',
        total: d.amount,
        count: 1,
      });
    }
  });

  const devoteesList = Array.from(devoteeMap.values()).sort((a, b) => b.total - a.total);

  const filtered = devoteesList.filter(
    (dev) =>
      dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dev.mobile.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-950 border border-gold-500/40 text-amber-50 shadow-mandapam flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-saffron-500/20 border border-saffron-400/40 rounded-xl text-saffron-400">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs font-telugu-devotional text-gold-300 font-bold mb-0.5">
              శ్రీ గణేశాయ నమః • గణపతి బప్పా మోరియా
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-gold-300">
              Devotee Community Roll
            </h2>
            <p className="text-xs text-amber-200/80">
              Celebrating generous contributors who make the Bala Ganapathi Seva Samithi festival possible
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-amber-300/70" />
        <input
          type="text"
          placeholder="Search by devotee name or mobile..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-gold-500/30 glass-mandapam text-xs text-slate-900 dark:text-amber-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
      </div>

      {/* Devotees Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-2xl border-2 border-dashed border-gold-500/40 glass-mandapam text-center space-y-3 shadow-mandapam">
          <div className="flex justify-center text-slate-400 dark:text-amber-400/60">
            <Users className="w-12 h-12" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-gold-300">
            🙏 No Devotee Records Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-amber-200 max-w-sm mx-auto leading-relaxed">
            Record offerings to view devotee community contributions here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((dev, idx) => (
            <div
              key={dev.mobile + dev.name}
              className="p-4 rounded-2xl border border-gold-500/30 glass-mandapam flex items-center gap-4 shadow-mandapam"
            >
              <div className="w-10 h-10 rounded-full bg-saffron-500/20 border border-saffron-400/40 flex items-center justify-center text-saffron-500 font-bold font-mono text-sm shrink-0">
                {idx === 0 ? <Award className="w-5 h-5 text-gold-500" /> : `#${idx + 1}`}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-amber-100 truncate">
                  {dev.name}
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-amber-300/70 font-mono">
                  {dev.mobile} • {dev.count} Seva Offering(s)
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-sm font-bold font-mono text-saffron-600 dark:text-gold-300">
                  ₹{dev.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
