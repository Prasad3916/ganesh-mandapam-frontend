import React from 'react';
import { motion } from 'framer-motion';

interface DiyaFlameProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const DiyaFlame: React.FC<DiyaFlameProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-6',
    md: 'w-6 h-9',
    lg: 'w-10 h-14',
  };

  return (
    <div className={`relative inline-flex flex-col items-center justify-end ${className}`}>
      {/* Outer Diya Flame Soft Glowing Aura */}
      <motion.div
        animate={{
          scale: [1, 1.15, 0.95, 1.1, 1],
          opacity: [0.6, 0.9, 0.5, 0.85, 0.6],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-3 w-8 h-8 rounded-full bg-amber-400/40 blur-md pointer-events-none"
      />

      {/* Flame SVG */}
      <motion.svg
        animate={{
          rotate: [-1, 2, -2, 1, -1],
          scaleY: [1, 1.08, 0.96, 1.04, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`${sizeClasses[size]} drop-shadow-[0_0_8px_rgba(255,180,0,0.8)]`}
        viewBox="0 0 40 60"
      >
        <defs>
          <radialGradient id="flameOuterGrad" cx="50%" cy="80%" r="60%">
            <stop offset="0%" stopColor="#FFFDD0" />
            <stop offset="35%" stopColor="#FFBF00" />
            <stop offset="70%" stopColor="#FF5500" />
            <stop offset="100%" stopColor="#800B22" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="flameCoreGrad" cx="50%" cy="85%" r="40%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#FFF9C2" />
            <stop offset="100%" stopColor="#FFBF00" />
          </radialGradient>
        </defs>
        {/* Outer Flame shape */}
        <path
          d="M20 0 C28 20 38 30 38 45 C38 53.2843 30.0523 60 20 60 C9.94772 60 2 53.2843 2 45 C2 30 12 20 20 0 Z"
          fill="url(#flameOuterGrad)"
        />
        {/* Inner Flame Core */}
        <path
          d="M20 15 C24 28 30 35 30 46 C30 52 25.5228 56 20 56 C14.4772 56 10 52 10 46 C10 35 16 28 20 15 Z"
          fill="url(#flameCoreGrad)"
        />
      </motion.svg>

      {/* Traditional Brass Diya Base */}
      <svg className="w-8 h-4 -mt-1 text-gold-600 drop-shadow-sm" viewBox="0 0 60 30" fill="currentColor">
        <path d="M5 5 C 15 25, 45 25, 55 5 C 45 12, 15 12, 5 5 Z" />
        <ellipse cx="30" cy="24" rx="12" ry="4" fill="#AA851C" />
      </svg>
    </div>
  );
};
