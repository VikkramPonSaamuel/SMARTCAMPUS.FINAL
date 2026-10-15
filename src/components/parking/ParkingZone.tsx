import React from 'react';
import { Car, Zap, ShieldCheck } from 'lucide-react';
import { ParkingZoneData } from '../../types/campus';
import { GlassCard } from '../ui/GlassCard';
import { useCampus } from '../../context/CampusContext';

interface ParkingZoneProps {
  zone: ParkingZoneData;
}

export const ParkingZone: React.FC<ParkingZoneProps> = ({ zone }) => {
  const { toggleParkingSlot } = useCampus();

  const barColor =
    zone.occupancyPercent >= 80
      ? 'from-amber-400 to-rose-500'
      : zone.occupancyPercent >= 60
      ? 'from-cyan-400 to-blue-500'
      : 'from-emerald-400 to-cyan-500';

  return (
    <GlassCard className="flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-bold text-white">
                {zone.name}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-400/30">
                {zone.totalSpaces} Bays
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{zone.subtitle}</p>
          </div>
          <div className="text-right">
            <span className="font-display text-2xl font-bold text-white">
              {zone.occupancyPercent}%
            </span>
            <span className="block text-[10px] font-mono text-slate-400">
              OCCUPANCY
            </span>
          </div>
        </div>

        {/* Occupancy Progress Bar */}
        <div className="mt-3 h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-500`}
            style={{ width: `${zone.occupancyPercent}%` }}
          />
        </div>

        {/* Breakdown Badges */}
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          <div className="p-2.5 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/25">
            <span className="text-[10px] font-mono uppercase text-emerald-300 block">
              Available
            </span>
            <span className="font-display text-lg font-bold text-emerald-400">
              {zone.availableSpaces}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">
              Occupied
            </span>
            <span className="font-display text-lg font-bold text-white">
              {zone.occupiedSpaces}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-violet-500/[0.08] border border-violet-500/25">
            <span className="text-[10px] font-mono uppercase text-violet-300 block">
              Reserved
            </span>
            <span className="font-display text-lg font-bold text-violet-300">
              {zone.reservedSpaces}
            </span>
          </div>
        </div>

        {/* Top-Down Interactive Bay Matrix */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2">
            <span>LIVE BAY TELEMETRY (CLICK BAY TO SIMULATE)</span>
            <span className="text-cyan-300 flex items-center gap-1">
              <Zap className="h-3 w-3" /> {zone.evChargersAvailable} EV Free
            </span>
          </div>

          <div className="grid grid-cols-6 gap-1.5 p-2.5 rounded-xl bg-[#050816]/80 border border-white/[0.06]">
            {zone.slots.map((slot) => {
              const slotStyle = {
                available:
                  'bg-emerald-500/15 border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/30',
                occupied:
                  'bg-slate-800/80 border-white/10 text-slate-400 hover:border-cyan-400/40',
                reserved:
                  'bg-violet-500/20 border-violet-400/40 text-violet-300',
                'ev-charging':
                  'bg-cyan-500/20 border-cyan-400/50 text-cyan-200',
              }[slot.status];

              return (
                <button
                  key={slot.id}
                  onClick={() => toggleParkingSlot(zone.id, slot.id)}
                  title={`${slot.number} • ${slot.status.toUpperCase()}`}
                  className={`h-9 rounded-lg border text-[9px] font-mono font-semibold flex flex-col items-center justify-center transition-all ${slotStyle}`}
                >
                  <span>{slot.number.split('-')[1]}</span>
                  {slot.status === 'ev-charging' ? (
                    <Zap className="h-2.5 w-2.5 text-cyan-300" />
                  ) : slot.status === 'reserved' ? (
                    <ShieldCheck className="h-2.5 w-2.5 text-violet-300" />
                  ) : (
                    <Car className="h-2.5 w-2.5 opacity-75" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
