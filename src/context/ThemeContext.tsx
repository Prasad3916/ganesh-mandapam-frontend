import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../api/apiClient';

export type MandapamThemePreset = 'SAFFRON' | 'MAROON' | 'IVORY' | 'NIGHT';

interface ThemeContextType {
  themePreset: MandapamThemePreset;
  setThemePreset: (preset: MandapamThemePreset) => void;
  customBgUrl: string | null;
  setCustomBgUrl: (url: string | null) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isFestivalMode: boolean;
  toggleFestivalMode: () => void;
  reduceAnimations: boolean;
  toggleReduceAnimations: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themePreset, setThemePresetState] = useState<MandapamThemePreset>(() => {
    const saved = localStorage.getItem('mandapam_theme_preset');
    return (saved as MandapamThemePreset) || 'MAROON';
  });

  const [customBgUrl, setCustomBgUrlState] = useState<string | null>(() => {
    return localStorage.getItem('mandapam_custom_bg');
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return themePreset !== 'IVORY';
  });

  const [isFestivalMode, setIsFestivalMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('festival_mode');
    return saved !== null ? saved === 'true' : true;
  });

  const [reduceAnimations, setReduceAnimations] = useState<boolean>(() => {
    return localStorage.getItem('reduce_animations') === 'true';
  });

  const applyThemeToDOM = (preset: MandapamThemePreset, bgUrl: string | null) => {
    const root = document.documentElement;
    root.classList.remove('theme-saffron', 'theme-maroon', 'theme-ivory', 'theme-night', 'dark');

    if (preset === 'IVORY') {
      root.classList.add('theme-ivory');
      setIsDarkMode(false);
    } else if (preset === 'SAFFRON') {
      root.classList.add('theme-saffron', 'dark');
      setIsDarkMode(true);
    } else if (preset === 'NIGHT') {
      root.classList.add('theme-night', 'dark');
      setIsDarkMode(true);
    } else {
      root.classList.add('theme-maroon', 'dark');
      setIsDarkMode(true);
    }

    if (bgUrl) {
      document.body.style.setProperty('background-image', `linear-gradient(rgba(15, 5, 9, 0.75), rgba(15, 5, 9, 0.85)), url("${bgUrl}")`, 'important');
      document.body.style.setProperty('background-size', 'cover', 'important');
      document.body.style.setProperty('background-attachment', 'fixed', 'important');
      document.body.style.setProperty('background-position', 'center', 'important');
    } else {
      document.body.style.removeProperty('background-image');
      document.body.style.removeProperty('background-size');
      document.body.style.removeProperty('background-attachment');
      document.body.style.removeProperty('background-position');
    }
  };

  useEffect(() => {
    // Fetch stored settings on launch
    apiFetch<any>('/settings/appearance')
      .then((data) => {
        if (data.themePreset) {
          setThemePresetState(data.themePreset as MandapamThemePreset);
          localStorage.setItem('mandapam_theme_preset', data.themePreset);
        }
        if (data.customBackgroundUrl) {
          setCustomBgUrlState(data.customBackgroundUrl);
          localStorage.setItem('mandapam_custom_bg', data.customBackgroundUrl);
        }
        applyThemeToDOM(
          (data.themePreset as MandapamThemePreset) || themePreset,
          data.customBackgroundUrl || customBgUrl
        );
      })
      .catch(() => {
        applyThemeToDOM(themePreset, customBgUrl);
      });
  }, []);

  const setThemePreset = (preset: MandapamThemePreset) => {
    setThemePresetState(preset);
    localStorage.setItem('mandapam_theme_preset', preset);
    applyThemeToDOM(preset, customBgUrl);
  };

  const setCustomBgUrl = (url: string | null) => {
    setCustomBgUrlState(url);
    if (url) {
      localStorage.setItem('mandapam_custom_bg', url);
    } else {
      localStorage.removeItem('mandapam_custom_bg');
    }
    applyThemeToDOM(themePreset, url);
  };

  const toggleDarkMode = () => {
    const nextPreset = isDarkMode ? 'IVORY' : 'MAROON';
    setThemePreset(nextPreset);
  };

  const toggleFestivalMode = () => {
    setIsFestivalMode((prev) => {
      const next = !prev;
      localStorage.setItem('festival_mode', String(next));
      return next;
    });
  };

  const toggleReduceAnimations = () => {
    setReduceAnimations((prev) => {
      const next = !prev;
      localStorage.setItem('reduce_animations', String(next));
      return next;
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        themePreset,
        setThemePreset,
        customBgUrl,
        setCustomBgUrl,
        isDarkMode,
        toggleDarkMode,
        isFestivalMode,
        toggleFestivalMode,
        reduceAnimations,
        toggleReduceAnimations,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      themePreset: 'MAROON' as MandapamThemePreset,
      setThemePreset: () => {},
      customBgUrl: null,
      setCustomBgUrl: () => {},
      isDarkMode: true,
      toggleDarkMode: () => {},
      isFestivalMode: true,
      toggleFestivalMode: () => {},
      reduceAnimations: false,
      toggleReduceAnimations: () => {},
    };
  }
  return context;
};
