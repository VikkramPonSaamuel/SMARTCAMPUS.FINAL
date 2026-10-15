import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Users,
  Zap,
  DoorOpen,
  Thermometer,
  Wind,
  Navigation,
  MapPin,
  ArrowUpRight,
  Layers,
  Sun,
} from 'lucide-react';
import { BuildingData } from '../../types/campus';
import { StatusIndicator } from '../ui/StatusIndicator';
import { useCampus } from '../../context/CampusContext';

interface BuildingInfoPanelProps {
  building: BuildingData | null;
  onClose: () => void;
}

export const BuildingInfoPanel: React.FC<BuildingInfoPanelProps> = ({
  building,
  onClose,
}) => {
  const navigate = useNavigate();
  const { setNavFrom, setNavTo, setIsNavigating } = useCampus();

  const handleSetAsOrigin = () => {
    if (!building) return;
    setNavFrom(building.id);
    setIsNavigating(true);
    onClose();
  };

  const handleNavigateToBuilding = () => {
    if (!building) return;
    setNavTo(building.id);
    setIsNavigating(true);
    onClose();
  };

  return (
    <AnimatePresence>
      {building && (
        <motion.div
          initial={{ opacity: 0, x: 24, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 24, scale: 0.96 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-4 top-16 bottom-4 w-80 sm:w-88 rounded-2xl bg-white/96 backdrop-blur-2xl border border-teal-500/35 shadow-[0_20px_50px_-10px_rgba(0,143,122,0.28)] p-5 z-30 flex flex-col justify-between overflow-y-auto"
        >
          <div>
            {/* Top Header */}
            <div className="flex items-start justify-between gap-2 pb-3.5 border-b border-teal-500/15">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold tracking-[0.16em] text-[#008F7A]">
                    {building.code}
                  </span>
                  <StatusIndicator
                    status={building.status}
                    label={building.status === 'normal' ? 'Normal' : 'Anomaly'}
                    size="sm"
                  />
                </div>
                <h3 className="font-display text-base font-bold text-[#042f2e] mt-1">
                  {building.name}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-[#007F6E] transition-colors"
                aria-label="Close Building Info"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-[#1f5754] mt-3 leading-relaxed">
              {building.description}
            </p>

            {/* Primary 4 Metrics */}
            <div className="grid grid-cols-2 gap-2.5 mt-4">
              <div className="p-3 rounded-xl bg-[#F2FBF9] border border-teal-500/20">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#467874]">
                  <Users className="h-3.5 w-3.5 text-[#008F7A]" />
                  Occupancy
                </div>
                <p className="font-display text-xl font-bold text-[#042f2e] mt-1">
                  {building.occupancy}%
                </p>
                <p className="text-[10px] text-[#467874] font-mono">
                  {building.currentPeople} / {building.capacity}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F2FBF9] border border-teal-500/20">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#467874]">
                  <Zap className="h-3.5 w-3.5 text-amber-600" />
                  Energy
                </div>
                <p className="font-display text-xl font-bold text-[#042f2e] mt-1">
                  {building.energyKw} kW
                </p>
                <p className="text-[10px] text-emerald-700 font-mono flex items-center gap-1">
                  <Sun className="h-2.5 w-2.5" /> +{building.solarOutputKw} kW Solar
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F2FBF9] border border-teal-500/20">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#467874]">
                  <DoorOpen className="h-3.5 w-3.5 text-emerald-600" />
                  Rooms Available
                </div>
                <p className="font-display text-xl font-bold text-emerald-700 mt-1">
                  {building.roomsAvailable}
                </p>
                <p className="text-[10px] text-[#467874] font-mono">
                  of {building.totalRooms} smart rooms
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F2FBF9] border border-teal-500/20">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#467874]">
                  <Thermometer className="h-3.5 w-3.5 text-[#008F7A]" />
                  Climate & AQI
                </div>
                <p className="font-display text-xl font-bold text-[#042f2e] mt-1">
                  {building.temperature}°C
                </p>
                <p className="text-[10px] text-[#007F6E] font-mono flex items-center gap-1">
                  <Wind className="h-2.5 w-2.5" /> AQI {building.aqi} • {building.humidity}% RH
                </p>
              </div>
            </div>

            {/* Floor Breakdown */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#467874] mb-2">
                <span className="flex items-center gap-1.5">
                  <Layers className="h-3 w-3 text-[#008F7A]" /> Floor Telemetry
                </span>
                <span>Occupancy</span>
              </div>
              <div className="space-y-2">
                {building.floors.map((fl) => (
                  <div
                    key={fl.level}
                    className="p-2.5 rounded-xl bg-[#EBF9F6] border border-teal-500/20"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#042f2e]">
                        L{fl.level} • {fl.name}
                      </span>
                      <span className="font-mono text-[#007F6E] font-bold">
                        {fl.occupancy}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-teal-500/15 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#008F7A] to-[#14B8A6]"
                        style={{ width: `${fl.occupancy}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Google Maps Navigation & Room Actions */}
          <div className="mt-4 pt-3 border-t border-teal-500/15 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleSetAsOrigin}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1A73E8] border border-[#1A73E8]/40 text-xs font-bold transition-all"
              >
                <MapPin className="h-3.5 w-3.5" />
                Route From Here
              </button>
              <button
                onClick={handleNavigateToBuilding}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#1A73E8] hover:bg-[#1557B0] !text-white text-xs font-bold shadow-sm transition-all"
              >
                <Navigation className="h-3.5 w-3.5 !text-white" />
                Route To Here
              </button>
            </div>
            <button
              onClick={() => navigate('/classrooms')}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#EBF9F6] hover:bg-teal-500/15 text-[#042f2e] border border-teal-500/25 text-xs font-semibold transition-all"
            >
              <span>Inspect Smart Classrooms</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-[#008F7A]" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
