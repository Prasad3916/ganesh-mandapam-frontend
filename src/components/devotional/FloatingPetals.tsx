import React, { useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const FloatingPetals: React.FC = () => {
  const { isFestivalMode, reduceAnimations } = useTheme();

  // Generate deterministic petal positions & parameters
  const petals = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: `${(i * 5.8 + 2) % 96}%`,
      delay: `${(i * 0.7) % 9}s`,
      duration: `${10 + (i % 6) * 2}s`,
      size: 10 + (i % 4) * 4,
      color: i % 2 === 0 ? '#FF7722' : '#FFD700', // Saffron or Gold
      rotation: (i * 45) % 360,
    }));
  }, []);

  if (!isFestivalMode || reduceAnimations) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute opacity-75 animate-petal-fall"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            top: '-20px',
          }}
        >
          {/* Petal SVG */}
          <svg
            width={p.size}
            height={p.size * 1.4}
            viewBox="0 0 30 42"
            style={{ transform: `rotate(${p.rotation}deg)` }}
          >
            <path
              d="M15 0 C25 10 30 25 15 42 C0 25 5 10 15 0 Z"
              fill={p.color}
              opacity="0.85"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};
