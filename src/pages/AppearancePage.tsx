import React, { useState } from 'react';
import { useTheme, MandapamThemePreset } from '../context/ThemeContext';
import { apiFetch } from '../api/apiClient';
import { Palette, CheckCircle2, AlertCircle } from 'lucide-react';

export const AppearancePage: React.FC = () => {
  const { themePreset, setThemePreset } = useTheme();
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleUpdatePreset = async (preset: MandapamThemePreset) => {
    setErrorMsg('');
    setSuccessMsg('');
    setThemePreset(preset);

    try {
      await apiFetch('/settings/appearance', {
        method: 'PUT',
        body: JSON.stringify({
          themePreset: preset,
          backgroundType: 'DEFAULT',
          overlayOpacity: 0.5,
          festivalModeEnabled: true,
        }),
      });

      setSuccessMsg(`Applied ${preset} Mandapam Theme Preset!`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sync theme preset with server.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-950 border border-gold-500/40 text-amber-50 shadow-mandapam flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-saffron-500/20 border border-saffron-400/40 rounded-xl text-saffron-400">
            <Palette className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs font-telugu-devotional text-gold-300 font-bold mb-0.5">
              శ్రీ గణేశాయ నమః • గణపతి బప్పా మోరియా
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-gold-300">
              Admin Mandapam Appearance Controls
            </h2>
            <p className="text-xs text-amber-200/80">
              Customize mandapam themes and color palettes across the platform
            </p>
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

      {/* Controlled Theme Presets */}
      <div className="p-6 rounded-2xl border border-gold-500/30 glass-mandapam space-y-4 shadow-mandapam">
        <div>
          <h3 className="font-cinzel font-bold text-base text-slate-900 dark:text-gold-300">
            Controlled Mandapam Theme Presets
          </h3>
          <p className="text-xs text-slate-500 dark:text-amber-200/80">
            Click any theme preset to instantly switch visual palette and contrast settings across the entire platform.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { id: 'SAFFRON', name: 'Saffron Mandapam', color: 'from-saffron-600 to-amber-700 text-amber-50' },
            { id: 'MAROON', name: 'Maroon Mandapam', color: 'from-maroon-900 to-maroon-950 text-amber-50' },
            { id: 'IVORY', name: 'Ivory Mandapam', color: 'from-amber-100 to-amber-200 text-slate-900' },
            { id: 'NIGHT', name: 'Night Mandapam', color: 'from-slate-950 to-maroon-950 text-amber-50' },
          ].map((theme) => {
            const isActive = themePreset === theme.id;
            return (
              <button
                type="button"
                key={theme.id}
                onClick={() => handleUpdatePreset(theme.id as MandapamThemePreset)}
                className={`p-5 rounded-2xl border bg-gradient-to-br ${theme.color} transition transform hover:-translate-y-1 shadow-md flex flex-col items-center justify-center gap-2 ${
                  isActive ? 'ring-4 ring-gold-400 border-gold-400 font-bold scale-105' : 'border-gold-500/30'
                }`}
              >
                <Palette className="w-6 h-6 text-gold-400" />
                <span className="block text-xs font-bold">{theme.name}</span>
                {isActive && (
                  <span className="px-2.5 py-0.5 rounded-full bg-gold-500 text-maroon-950 text-[9px] font-extrabold uppercase tracking-wider">
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
