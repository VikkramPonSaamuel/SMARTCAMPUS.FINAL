import React from 'react';
import { motion } from 'framer-motion';
import { useCampus } from '../../context/CampusContext';
import { AnalyticsCard } from './AnalyticsCard';

export const OccupancyChart: React.FC = () => {
  const { buildings, liveMetrics, setSelectedBuildingId } = useCampus();
  const percentage = liveMetrics.occupancyPercent;
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <AnalyticsCard
      title="Campus Occupancy"
      subtitle="Live spatial density across academic blocks"
      action={
        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-teal-500/15 text-[#007F6E] border border-teal-500/30">
          {liveMetrics.liveOccupancy.toLocaleString()} Active
        </span>
      }
    >
      <div className="flex flex-col sm:flex-row items-center gap-5 py-1">
        {/* Radial / Circular SVG Visualization */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-36 h-36 -rotate-90 transform" viewBox="0 0 140 140">
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="rgba(13, 148, 136, 0.14)"
              strokeWidth="12"
              fill="transparent"
            />
            <motion.circle
              cx="70"
              cy="70"
              r={radius}
              stroke="url(#occGrad)"
              strokeWidth="12"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              strokeLinecap="round"
              fill="transparent"
            />
            <defs>
              <linearGradient id="occGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#008F7A" />
                <stop offset="50%" stopColor="#14B8A6" />
                <stop offset="100%" stopColor="#5EEAD4" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-display text-2xl font-bold text-[#042f2e]">
              {percentage}%
            </span>
            <span className="text-[10px] font-medium text-[#467874] leading-tight max-w-[72px]">
              Average Occupancy
            </span>
          </div>
        </div>

        {/* Building Breakdown List */}
        <div className="flex-1 w-full space-y-2">
          {buildings.slice(0, 4).map((b) => (
            <div
              key={b.id}
              onClick={() => setSelectedBuildingId(b.id)}
              className="cursor-pointer group p-2 rounded-xl bg-white/75 hover:bg-white border border-teal-500/15 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#1f5754] group-hover:text-[#042f2e]">
                  {b.code} • {b.shortName}
                </span>
                <span className="font-mono font-bold text-[#007F6E]">
                  {b.occupancy}%
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-teal-500/15 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#008F7A] to-[#2DD4BF] transition-all duration-500"
                  style={{ width: `${b.occupancy}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnalyticsCard>
  );
};
