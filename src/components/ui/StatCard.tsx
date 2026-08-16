import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  subTitle?: string;
  amount: string;
  icon: string;
  badgeText?: string;
  accentColor?: 'saffron' | 'gold' | 'maroon' | 'green' | 'amber';
  tooltipText?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  subTitle,
  amount,
  icon,
  badgeText,
  accentColor = 'gold',
  tooltipText,
}) => {
  const accentBorders = {
    saffron: 'border-saffron-500/40 bg-gradient-to-br from-saffron-500/10 to-transparent',
    gold: 'border-gold-500/40 bg-gradient-to-br from-gold-500/10 to-transparent',
    maroon: 'border-maroon-700/50 bg-gradient-to-br from-maroon-700/10 to-transparent',
    green: 'border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-transparent',
    amber: 'border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-transparent',
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-2xl p-5 border shadow-mandapam glass-mandapam ${accentBorders[accentColor]}`}
    >
      {/* Corner Devotional Ornament */}
      <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden pointer-events-none opacity-20">
        <div className="w-8 h-8 bg-gold-400 transform rotate-45 translate-x-4 -translate-y-4" />
      </div>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <h3 className="font-cinzel text-xs sm:text-sm font-semibold tracking-wide text-slate-700 dark:text-amber-200">
              {title}
            </h3>
          </div>
          {subTitle && <p className="text-[11px] text-slate-500 dark:text-amber-300/70 mt-0.5">{subTitle}</p>}
        </div>

        {badgeText && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold-500/20 text-gold-600 dark:text-gold-300 border border-gold-400/30">
            {badgeText}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <p className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-gold-300 drop-shadow-sm">
          {amount}
        </p>

        {tooltipText && (
          <span
            className="text-[10px] text-slate-400 dark:text-amber-400/60 hover:underline cursor-help"
            title={tooltipText}
          >
            Info ⓘ
          </span>
        )}
      </div>
    </motion.div>
  );
};
