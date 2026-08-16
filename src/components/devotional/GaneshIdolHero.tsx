import React from 'react';
import { motion } from 'framer-motion';
import { DiyaFlame } from './DiyaFlame';
import { useTheme } from '../../context/ThemeContext';

interface GaneshIdolHeroProps {
  size?: 'sm' | 'md' | 'lg';
}

export const GaneshIdolHero: React.FC<GaneshIdolHeroProps> = ({ size = 'lg' }) => {
  const { reduceAnimations } = useTheme();

  const containerSizes = {
    sm: 'w-48 h-48',
    md: 'w-64 h-64',
    lg: 'w-80 h-80 md:w-96 md:h-96',
  };

  return (
    <div className={`relative flex items-center justify-center ${containerSizes[size]} mx-auto`}>
      {/* 1. Soft Breathing Glowing Aura */}
      <motion.div
        animate={
          reduceAnimations
            ? {}
            : {
                scale: [1, 1.08, 1],
                opacity: [0.55, 0.85, 0.55],
              }
        }
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-saffron-500/30 via-gold-500/40 to-maroon-700/20 blur-3xl pointer-events-none"
      />

      {/* 2. Slow Rotating Mandala Background Motif */}
      <motion.div
        animate={reduceAnimations ? {} : { rotate: 360 }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-2 border border-gold-500/30 rounded-full flex items-center justify-center pointer-events-none"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full text-gold-500/20">
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1" />
          {/* 8 Lotus Petal Lines */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1="100"
              y1="10"
              x2="100"
              y2="30"
              stroke="currentColor"
              strokeWidth="2"
              transform={`rotate(${deg} 100 100)`}
            />
          ))}
        </svg>
      </motion.div>

      {/* 3. Devotional Lord Ganesha Artwork (SVG vector) */}
      <div className="relative z-10 w-4/5 h-4/5 flex items-center justify-center filter drop-shadow-[0_10px_20px_rgba(80,11,23,0.4)]">
        <svg viewBox="0 0 300 350" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF9C2" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#836114" />
            </linearGradient>
            <linearGradient id="saffronGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF8833" />
              <stop offset="100%" stopColor="#CC3300" />
            </linearGradient>
            <linearGradient id="maroonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#800B22" />
              <stop offset="100%" stopColor="#3D020D" />
            </linearGradient>
          </defs>

          {/* Halo / Prabhavali behind Head */}
          <circle cx="150" cy="120" r="85" fill="url(#goldGradient)" opacity="0.25" />
          <circle cx="150" cy="120" r="75" fill="none" stroke="url(#goldGradient)" strokeWidth="3" strokeDasharray="6 4" />

          {/* Crown / Golden Mukut */}
          <path d="M120 70 L150 10 L180 70 Z" fill="url(#goldGradient)" />
          <path d="M130 60 L150 25 L170 60 Z" fill="url(#saffronGradient)" />
          <circle cx="150" cy="40" r="6" fill="#E34234" />

          {/* Ears */}
          <path d="M100 110 C60 90 60 160 110 160 Z" fill="url(#goldGradient)" opacity="0.9" />
          <path d="M200 110 C240 90 240 160 190 160 Z" fill="url(#goldGradient)" opacity="0.9" />

          {/* Face & Head */}
          <ellipse cx="150" cy="125" rx="45" ry="50" fill="url(#goldGradient)" />

          {/* Red Vermilion Tilak & Trident */}
          <path d="M142 95 H158 V120 H142 Z" fill="#E34234" />
          <line x1="135" y1="102" x2="165" y2="102" stroke="#FFD700" strokeWidth="3" />
          <line x1="138" y1="110" x2="162" y2="110" stroke="#FFD700" strokeWidth="3" />
          <circle cx="150" cy="115" r="3.5" fill="#FFD700" />

          {/* Curved Trunk */}
          <path
            d="M150 145 C150 190 115 195 125 220 C132 235 160 230 160 210 C160 195 145 185 145 165 Z"
            fill="url(#saffronGradient)"
          />

          {/* Modak on Trunk Tip */}
          <path d="M158 202 C168 198 174 212 162 216 Z" fill="url(#goldGradient)" />

          {/* Left Tusk (Single Tusk / Ekadanta) */}
          <polygon points="128,155 115,160 128,165" fill="#FFFDD0" />

          {/* Seated Body / Dhoti / Pitambara */}
          <path d="M80 230 C80 180 220 180 220 230 C220 280 80 280 80 230 Z" fill="url(#maroonGradient)" />
          <path d="M95 240 C110 270 190 270 205 240 Z" fill="url(#goldGradient)" opacity="0.8" />

          {/* Blessing Abhaya Hasta (Right Hand) */}
          <ellipse cx="90" cy="200" rx="14" ry="18" fill="url(#goldGradient)" />
          <circle cx="90" cy="200" r="5" fill="#E34234" />

          {/* Modak Bowl (Left Hand) */}
          <ellipse cx="210" cy="200" rx="16" ry="12" fill="url(#goldGradient)" />
          <circle cx="210" cy="194" r="4" fill="#FF7722" />
          <circle cx="205" cy="198" r="3" fill="#FF7722" />
          <circle cx="215" cy="198" r="3" fill="#FF7722" />

          {/* Marigold Garland (Har) */}
          <path
            d="M105 145 Q150 210 195 145"
            fill="none"
            stroke="#FF7722"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="4 2"
          />
        </svg>
      </div>

      {/* 4. Left & Right Flanking Diyas */}
      <div className="absolute bottom-2 left-0 z-20">
        <DiyaFlame size="md" />
      </div>
      <div className="absolute bottom-2 right-0 z-20">
        <DiyaFlame size="md" />
      </div>
    </div>
  );
};
