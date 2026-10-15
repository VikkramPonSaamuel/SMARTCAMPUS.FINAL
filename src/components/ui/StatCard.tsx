import React from 'react';
import { LucideIcon } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendPositive?: boolean;
  icon: LucideIcon;
  accent?: 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendPositive = true,
  icon: Icon,
  accent = 'cyan',
  onClick,
}) => {
  const accentMap = {
    cyan: {
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-400/20',
      text: 'text-cyan-400',
    },
    violet: {
      iconBg: 'bg-violet-500/10 text-violet-400 border-violet-400/20',
      text: 'text-violet-400',
    },
    emerald: {
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20',
      text: 'text-emerald-400',
    },
    amber: {
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-400/20',
      text: 'text-amber-400',
    },
    rose: {
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-400/20',
      text: 'text-rose-400',
    },
  };

  const cfg = accentMap[accent];

  return (
    <GlassCard
      interactive
      onClick={onClick}
      className={`relative overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2.5">
            <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {value}
            </h3>
            {trend && (
              <span
                className={`text-xs font-mono font-medium px-1.5 py-0.5 rounded-md ${
                  trendPositive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {trend}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
          )}
        </div>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${cfg.iconBg}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </GlassCard>
  );
};
