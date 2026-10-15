import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Thermometer,
  Monitor,
  Wind,
  Calendar,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { SmartRoom } from '../../types/campus';
import { GlassCard } from '../ui/GlassCard';
import { useCampus } from '../../context/CampusContext';

interface RoomCardProps {
  room: SmartRoom;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const [showSchedule, setShowSchedule] = useState(false);
  const { toggleRoomAc, reserveRoom } = useCampus();

  const statusStyles = {
    AVAILABLE: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/35',
    OCCUPIED: 'bg-cyan-500/15 text-cyan-300 border-cyan-400/35',
    RESERVED: 'bg-violet-500/15 text-violet-300 border-violet-400/35',
    MAINTENANCE: 'bg-rose-500/15 text-rose-300 border-rose-400/35',
  }[room.status];

  const occPercent = Math.round((room.currentOccupancy / room.capacity) * 100);

  return (
    <GlassCard interactive className="flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 pb-3 border-b border-white/[0.07]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-base font-bold tracking-wide text-white">
                {room.code}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-slate-400">
                Floor {room.floor}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{room.name}</p>
          </div>
          <span
            className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border ${statusStyles}`}
          >
            {room.status}
          </span>
        </div>

        {/* Core Telemetry Grid matching Spec */}
        <div className="grid grid-cols-2 gap-2.5 mt-3.5">
          <div className="p-2.5 rounded-xl bg-[#050816]/60 border border-white/[0.05]">
            <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
              <Users className="h-3 w-3 text-cyan-400" />
              Capacity / Occ
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-display text-lg font-bold text-white">
                {room.currentOccupancy}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                / {room.capacity}
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#050816]/60 border border-white/[0.05]">
            <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
              <Thermometer className="h-3 w-3 text-violet-400" />
              Temperature
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-display text-lg font-bold text-white">
                {room.temperature}°C
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {room.co2Ppm} ppm
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#050816]/60 border border-white/[0.05]">
            <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
              <Monitor className="h-3 w-3 text-emerald-400" />
              Projector
            </span>
            <p className="text-xs font-semibold text-emerald-400 mt-1">
              ● {room.projector}
            </p>
          </div>

          <div
            onClick={() => toggleRoomAc(room.id)}
            title="Click to cycle AC mode"
            className="cursor-pointer p-2.5 rounded-xl bg-[#050816]/60 hover:bg-cyan-500/10 border border-white/[0.05] hover:border-cyan-400/30 transition-colors"
          >
            <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
              <Wind className="h-3 w-3 text-cyan-400" />
              AC Control
            </span>
            <p
              className={`text-xs font-semibold mt-1 ${
                room.ac === 'ON'
                  ? 'text-cyan-300'
                  : room.ac === 'ECO'
                  ? 'text-emerald-300'
                  : 'text-slate-400'
              }`}
            >
              ● {room.ac}
            </p>
          </div>
        </div>

        {/* Occupancy Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span>{room.buildingName}</span>
            <span>{occPercent}% Full</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-500"
              style={{ width: `${occPercent}%` }}
            />
          </div>
        </div>

        {/* Expandable Timetable */}
        <AnimatePresence>
          {showSchedule && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-white/[0.07] space-y-1.5 overflow-hidden"
            >
              <p className="text-[10px] font-mono uppercase tracking-wider text-cyan-300">
                Today's Room Timetable
              </p>
              {room.timetable.map((slot, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-[#050816]/70 border border-white/[0.05]"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-white truncate">
                      {slot.course}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {slot.time} • {slot.instructor}
                    </p>
                  </div>
                  <span
                    className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded shrink-0 ${
                      slot.status === 'free'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : slot.status === 'ongoing'
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {slot.status}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div className="mt-4 pt-3 border-t border-white/[0.07] flex items-center justify-between gap-2">
        <button
          onClick={() => setShowSchedule(!showSchedule)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-cyan-300 transition-colors"
        >
          <Calendar className="h-3.5 w-3.5 text-cyan-400" />
          <span>Timetable</span>
          {showSchedule ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>

        <button
          onClick={() => reserveRoom(room.id)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            room.status === 'AVAILABLE'
              ? 'bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border-cyan-400/35'
              : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border-white/10'
          }`}
        >
          <Sparkles className="h-3 w-3" />
          {room.status === 'AVAILABLE' ? 'Quick Reserve' : 'Release Slot'}
        </button>
      </div>
    </GlassCard>
  );
};
