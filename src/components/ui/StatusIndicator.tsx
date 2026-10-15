import React from 'react';
import { SystemStatusLevel } from '../../types/campus';

interface StatusIndicatorProps {
  status: SystemStatusLevel | 'online' | 'available';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  size = 'md',
  pulse = true,
}) => {
  const colorMap = {
    normal: {
      dot: 'bg-emerald-400',
      ring: 'bg-emerald-400/40',
      text: 'text-emerald-400',
    },
    online: {
      dot: 'bg-emerald-400',
      ring: 'bg-emerald-400/40',
      text: 'text-emerald-400',
    },
    available: {
      dot: 'bg-cyan-400',
      ring: 'bg-cyan-400/40',
      text: 'text-cyan-300',
    },
    warning: {
      dot: 'bg-amber-400',
      ring: 'bg-amber-400/40',
      text: 'text-amber-400',
    },
    critical: {
      dot: 'bg-rose-500',
      ring: 'bg-rose-500/40',
      text: 'text-rose-400',
    },
  };

  const sizeMap = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  const cfg = colorMap[status] || colorMap.normal;

  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative flex items-center justify-center">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${cfg.ring}`}
          />
        )}
        <span className={`relative inline-flex rounded-full ${sizeMap[size]} ${cfg.dot}`} />
      </span>
      {label && (
        <span className={`text-xs font-medium tracking-wide ${cfg.text}`}>
          {label}
        </span>
      )}
    </span>
  );
};
