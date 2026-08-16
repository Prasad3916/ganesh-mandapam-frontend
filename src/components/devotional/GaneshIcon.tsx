import React from 'react';

interface GaneshIconProps {
  className?: string;
  size?: number;
}

export const GaneshIcon: React.FC<GaneshIconProps> = ({ className = 'w-8 h-8 text-gold-500', size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Devotional Stylized Ganesha Vector */}
      <path d="M50 5 C28 5 15 20 15 38 C15 48 20 56 28 62 C26 68 22 75 16 80 C24 80 32 76 38 70 C42 73 46 75 50 75 C54 75 58 73 62 70 C68 76 76 80 84 80 C78 75 74 68 72 62 C80 56 85 48 85 38 C85 20 72 5 50 5 Z M50 15 C60 15 70 24 70 38 C70 45 66 52 60 56 C56 50 53 40 50 32 C47 40 44 50 40 56 C34 52 30 45 30 38 C30 24 40 15 50 15 Z" />
      {/* Crown / Mukut */}
      <polygon points="50,2 44,14 56,14" fill="#FF7722" />
      {/* Tilak */}
      <path d="M47 20 H53 V30 H47 Z" fill="#E34234" />
      <circle cx="50" cy="34" r="2.5" fill="#FFD700" />
      {/* Trunk Sweep */}
      <path d="M50 42 Q42 55 46 66 Q50 72 56 68 Q58 64 53 60 Q48 56 50 48 Z" fill="#D4AF37" />
      {/* Modak on Trunk Tip */}
      <circle cx="57" cy="67" r="3.5" fill="#FF9900" />
    </svg>
  );
};
