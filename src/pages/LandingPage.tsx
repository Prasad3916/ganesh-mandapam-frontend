import React from 'react';
import { motion } from 'framer-motion';
import { GaneshIcon } from '../components/devotional/GaneshIcon';
import { Sparkles, HeartHandshake, ShieldCheck, Flame, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onEnterMandapam: () => void;
  onViewFinances: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterMandapam,
}) => {
  return (
    <div className="min-h-screen bg-temple-dark text-amber-50 relative overflow-hidden flex flex-col justify-between">
      {/* Decorative Backdrop Grid */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🪔</span>
          <span className="font-cinzel font-bold text-lg text-gold-300 tracking-wider">
            Bala Ganapathi Seva Samithi
          </span>
        </div>
        <div>
          <button
            onClick={onEnterMandapam}
            className="px-5 py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs shadow-saffron-glow transition transform hover:-translate-y-0.5"
          >
            Enter Digital Mandapam
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 text-center space-y-8 my-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <div className="relative p-6 bg-maroon-950/80 rounded-full border-4 border-gold-500/60 shadow-gold-glow">
            <GaneshIcon className="w-28 h-28 text-gold-400" />
            <div className="absolute -top-2 -right-2 p-2 bg-saffron-500 rounded-full text-white">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
          </div>
        </motion.div>

        {/* Special Telugu Devotional Chant with Special Font */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-gold-500/20 border border-gold-400/40">
            <h1 className="text-xl sm:text-2xl font-telugu-devotional font-bold text-gold-300 tracking-wide">
              శ్రీ గణేశాయ నమః • గణపతి బప్పా మోరియా
            </h1>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-gold-300 to-saffron-300">
            Bala Ganapathi Seva Samithi
          </h2>
          <p className="text-sm sm:text-base text-amber-200/90 max-w-2xl mx-auto font-sans leading-relaxed">
            The Digital Mandapam Platform combining Ganesh Chaturthi devotional celebrations with transparent financial management.
          </p>
        </motion.div>

        {/* Value Proposition Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left"
        >
          <div className="p-4 rounded-2xl bg-maroon-950/70 border border-gold-500/30 space-y-1">
            <HeartHandshake className="w-6 h-6 text-saffron-400 mb-2" />
            <h3 className="font-cinzel font-bold text-sm text-gold-300">Devotee Offerings</h3>
            <p className="text-xs text-amber-200/70">Record sacred contributions and generate instant receipts.</p>
          </div>

          <div className="p-4 rounded-2xl bg-maroon-950/70 border border-gold-500/30 space-y-1">
            <Flame className="w-6 h-6 text-gold-400 mb-2" />
            <h3 className="font-cinzel font-bold text-sm text-gold-300">Seva Expenses</h3>
            <p className="text-xs text-amber-200/70">Track mandapam decoration, pooja items, and vendor costs.</p>
          </div>

          <div className="p-4 rounded-2xl bg-maroon-950/70 border border-gold-500/30 space-y-1">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mb-2" />
            <h3 className="font-cinzel font-bold text-sm text-gold-300">Transparent Audit Log</h3>
            <p className="text-xs text-amber-200/70">Complete financial transparency & real-time committee records.</p>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="pt-4"
        >
          <button
            onClick={onEnterMandapam}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-saffron-500 to-saffron-600 hover:from-saffron-600 hover:to-saffron-700 text-white font-extrabold text-sm shadow-saffron-glow transition transform hover:-translate-y-1"
          >
            <span>Enter Digital Mandapam</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto px-6 py-4 text-center text-xs text-amber-300/60 border-t border-gold-500/20">
        <p>Bala Ganapathi Seva Samithi • Devotion • Seva • Transparency • Community</p>
      </footer>
    </div>
  );
};
