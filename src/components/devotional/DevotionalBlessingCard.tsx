import React, { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BLESSINGS = [
  {
    id: 'b-1',
    chantTelugu: 'శ్రీ గణేశాయ నమః • గణపతి బప్పా మోరియా',
    meaning: 'May Lord Vinayaka remove all obstacles and bless our community celebration with peace and success.',
    source: 'Devotional Prayer',
  },
  {
    id: 'b-2',
    chantTelugu: 'శ్రీ గణేశాయ నమః • విఘ్నాలు తొలగించు గాక',
    meaning: 'Together in Devotion, Together in Seva, Together in Financial Transparency.',
    source: 'Bala Ganapathi Seva Samithi',
  },
  {
    id: 'b-3',
    chantTelugu: 'గణపతి బప్పా మోరియా • శుభం కలుగుగాక',
    meaning: 'May Lord Ganesha bestow good health, harmony, and prosperity upon every devotee.',
    source: 'Temple Blessing',
  },
];

export const DevotionalBlessingCard: React.FC = () => {
  const [index, setIndex] = useState(0);

  const current = BLESSINGS[index];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % BLESSINGS.length);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-900 border border-gold-500/40 p-5 text-amber-50 shadow-mandapam">
      <div className="absolute top-2 right-2 opacity-15 pointer-events-none">
        <Sparkles className="w-20 h-20 text-gold-400" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300 text-xs font-semibold">
              🙏 Devotional Blessing
            </span>
            <span className="text-xs text-amber-300/70 font-medium">{current.source}</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="space-y-1"
            >
              <p className="text-lg md:text-xl font-telugu-devotional text-amber-100 tracking-wide">
                "{current.chantTelugu}"
              </p>
              <p className="text-xs text-amber-200/90 font-sans italic">
                {current.meaning}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={handleNext}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-maroon-950/70 hover:bg-maroon-950 border border-gold-500/30 text-xs text-gold-300 transition shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Next Blessing</span>
        </button>
      </div>
    </div>
  );
};
