import React from 'react';
import { Html } from '@react-three/drei';

interface CampusMarkerProps {
  position: [number, number, number];
  title: string;
  subtitle?: string;
  badge?: string;
  variant?: 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose';
  onClick?: () => void;
}

export const CampusMarker: React.FC<CampusMarkerProps> = ({
  position,
  title,
  subtitle,
  badge,
  variant = 'cyan',
  onClick,
}) => {
  const variantClasses = {
    cyan: 'border-teal-500/50 text-[#007F6E] shadow-[0_6px_20px_rgba(13,148,136,0.22)]',
    violet: 'border-cyan-600/45 text-cyan-800 shadow-[0_6px_20px_rgba(14,116,144,0.2)]',
    emerald: 'border-emerald-500/50 text-emerald-800 shadow-[0_6px_20px_rgba(16,185,129,0.22)]',
    amber: 'border-amber-500/60 text-amber-900 shadow-[0_6px_20px_rgba(245,158,11,0.25)]',
    rose: 'border-rose-500/60 text-rose-900 shadow-[0_6px_20px_rgba(244,63,94,0.28)]',
  };

  const badgeBg = {
    cyan: 'bg-teal-500/15 text-[#007F6E]',
    violet: 'bg-cyan-500/15 text-cyan-800',
    emerald: 'bg-emerald-500/15 text-emerald-800',
    amber: 'bg-amber-500/20 text-amber-800',
    rose: 'bg-rose-500/20 text-rose-700',
  };

  return (
    <Html position={position} center distanceFactor={28} zIndexRange={[4, 0]}>
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        className={`cursor-pointer select-none whitespace-nowrap rounded-xl bg-white/92 backdrop-blur-md border px-2.5 py-1.5 transition-transform hover:scale-105 ${variantClasses[variant]}`}
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold tracking-wider text-[#042f2e]">
            {title}
          </span>
          {badge && (
            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${badgeBg[variant]}`}>
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-[9px] font-mono text-[#336663] mt-0.5">{subtitle}</p>
        )}
      </div>
    </Html>
  );
};
