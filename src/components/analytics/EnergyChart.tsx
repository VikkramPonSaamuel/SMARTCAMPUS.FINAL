import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { ENERGY_CHART_DATA } from '../../data/campusData';
import { AnalyticsCard } from './AnalyticsCard';

export const EnergyChart: React.FC<{ height?: number }> = ({ height = 230 }) => {
  const [range, setRange] = useState<'Today' | 'Week' | 'Month'>('Today');
  const data = ENERGY_CHART_DATA[range];

  return (
    <AnalyticsCard
      title="Energy Consumption"
      subtitle="Real-time grid load vs solar generation (MW)"
      action={
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/80 border border-teal-500/20">
          {(['Today', 'Week', 'Month'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setRange(tab)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                range === tab
                  ? 'btn-ocean-primary bg-gradient-to-r from-[#008F7A] to-[#14B8A6] shadow-xs'
                  : 'text-[#467874] hover:text-[#042f2e]'
              }`}
            >
              <span>{tab}</span>
            </button>
          ))}
        </div>
      }
    >
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id="energyCyan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#008F7A" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="solarEmerald" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.38} />
                <stop offset="95%" stopColor="#99F6E4" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(13,148,136,0.12)" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#467874"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#467874"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                borderColor: 'rgba(0, 143, 122, 0.35)',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#042f2e',
                boxShadow: '0 10px 25px rgba(0, 143, 122, 0.12)',
              }}
            />
            <Area
              type="monotone"
              dataKey="consumption"
              name="Grid Load (MW)"
              stroke="#008F7A"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#energyCyan)"
            />
            <Area
              type="monotone"
              dataKey="solar"
              name="Solar Yield (MW)"
              stroke="#14B8A6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#solarEmerald)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-teal-500/15 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[#1f5754]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#008F7A]" />
            Grid Load: <strong className="text-[#042f2e] font-mono">4.82 MW</strong>
          </span>
          <span className="flex items-center gap-1.5 text-[#1f5754]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#14B8A6]" />
            Solar Offset: <strong className="text-emerald-700 font-mono">18.6%</strong>
          </span>
        </div>
        <span className="text-[11px] font-mono font-bold text-[#007F6E]">AI Optimized</span>
      </div>
    </AnalyticsCard>
  );
};
