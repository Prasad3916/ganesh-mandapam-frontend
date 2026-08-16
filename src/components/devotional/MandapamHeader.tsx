import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { GaneshIcon } from './GaneshIcon';
import { soundService } from '../../services/soundService';
import { Moon, Sun, Sparkles, Volume2, VolumeX, Plus, FileText, LogOut, User as UserIcon } from 'lucide-react';

interface MandapamHeaderProps {
  onOpenOfferingModal: () => void;
  onOpenExpenseModal: () => void;
  onNavigateToReports: () => void;
}

export const MandapamHeader: React.FC<MandapamHeaderProps> = ({
  onOpenOfferingModal,
  onOpenExpenseModal,
  onNavigateToReports,
}) => {
  const { isDarkMode, toggleDarkMode, isFestivalMode, toggleFestivalMode } = useTheme();
  const { user, logout } = useAuth();
  const [isAudioOn, setIsAudioOn] = useState(false);

  // Live Countdown
  const [timeLeft, setTimeLeft] = useState({ days: 28, hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        return { ...prev, hours: (prev.hours - 1 + 24) % 24, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleAudio = () => {
    const nextState = !isAudioOn;
    setIsAudioOn(nextState);
    soundService.setMuted(!nextState);
  };

  return (
    <header className="relative z-30 bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-900 border-b border-gold-500/40 text-amber-50 shadow-mandapam py-4 px-4 sm:px-8">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-saffron-500 via-gold-400 to-saffron-500" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Title & Special Telugu Devotional Chant */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-maroon-700/80 rounded-full border border-gold-500/50 shadow-gold-sm">
            <GaneshIcon className="w-9 h-9 text-gold-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-telugu-devotional text-gold-300 font-bold tracking-wide">
              <span>శ్రీ గణేశాయ నమః</span>
              <span>•</span>
              <span>గణపతి బప్పా మోరియా</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-gold-300 to-saffron-300">
              Bala Ganapathi Seva Samithi
            </h1>
          </div>
        </div>

        {/* Live Countdown Widget */}
        <div className="flex items-center gap-2 bg-maroon-950/70 border border-gold-500/30 rounded-xl px-4 py-2 text-center text-xs">
          <span className="text-gold-400 font-semibold hidden sm:inline">Ganesh Utsav 2026:</span>
          <div className="flex items-center gap-2 font-mono">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-amber-200">{timeLeft.days}</span>
              <span className="text-[10px] text-amber-400/80">DAYS</span>
            </div>
            <span className="text-gold-500 font-bold">:</span>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-amber-200">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-[10px] text-amber-400/80">HRS</span>
            </div>
            <span className="text-gold-500 font-bold">:</span>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-amber-200">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-[10px] text-amber-400/80">MIN</span>
            </div>
            <span className="text-gold-500 font-bold">:</span>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-amber-200">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-[10px] text-amber-400/80">SEC</span>
            </div>
          </div>
        </div>

        {/* Control Toggles, User Profile & Logout Button */}
        <div className="flex items-center flex-wrap justify-center gap-2">
          {/* Active Logged-in User Badge */}
          {user && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-maroon-950/80 border border-gold-500/40 text-xs shadow-sm">
              <UserIcon className="w-4 h-4 text-gold-400" />
              <div className="text-left">
                <span className="font-bold text-amber-100 block max-w-[120px] sm:max-w-[160px] truncate leading-tight">
                  {user.name}
                </span>
                <span className="text-[9px] text-gold-300/80 font-mono block leading-none">
                  {user.role === 'ADMIN' ? 'Admin' : 'Committee Member'}
                </span>
              </div>
            </div>
          )}



          <button
            onClick={handleToggleAudio}
            className={`p-1.5 rounded-lg border transition ${
              isAudioOn
                ? 'bg-saffron-500/20 border-saffron-400 text-saffron-300'
                : 'bg-maroon-950/60 border-maroon-700 text-slate-400'
            }`}
            title="Temple Sound"
          >
            {isAudioOn ? <Volume2 className="w-4 h-4 text-saffron-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleDarkMode}
            className="p-1.5 bg-maroon-950/60 hover:bg-maroon-900 border border-gold-500/30 rounded-lg text-amber-300 transition"
            title={isDarkMode ? 'Light Mandapam' : 'Night Mandapam'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-gold-400" /> : <Moon className="w-4 h-4 text-amber-200" />}
          </button>

          {/* Prominent Logout Button */}
          {user && (
            <button
              onClick={logout}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-600/30 hover:bg-red-600 border border-red-500/40 text-red-200 text-xs font-bold rounded-lg transition"
              title="Sign Out of Mandapam"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
