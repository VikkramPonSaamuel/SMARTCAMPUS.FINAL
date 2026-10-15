import React, { useState, useEffect } from 'react';
import {
  Car,
  CheckCircle2,
  ShieldCheck,
  Zap,
  RefreshCw,
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { StatCard } from '../components/ui/StatCard';
import { GlassCard } from '../components/ui/GlassCard';
import { ParkingZone } from '../components/parking/ParkingZone';

export const ParkingPage: React.FC = () => {
  const { parkingZones, toggleParkingSlot } = useCampus();
  const [liveSimActive, setLiveSimActive] = useState(true);

  // Simulated live updates for parking slots (Section 19)
  useEffect(() => {
    if (!liveSimActive) return;
    const timer = setInterval(() => {
      const randomZone =
        parkingZones[Math.floor(Math.random() * parkingZones.length)];
      if (!randomZone) return;
      const randomSlot =
        randomZone.slots[Math.floor(Math.random() * randomZone.slots.length)];
      if (
        randomSlot &&
        (randomSlot.status === 'available' || randomSlot.status === 'occupied')
      ) {
        toggleParkingSlot(randomZone.id, randomSlot.id);
      }
    }, 5500);
    return () => clearInterval(timer);
  }, [liveSimActive, parkingZones, toggleParkingSlot]);

  const totalAvailable = parkingZones.reduce(
    (sum, z) => sum + z.availableSpaces,
    0
  );
  const totalOccupied = parkingZones.reduce(
    (sum, z) => sum + z.occupiedSpaces,
    0
  );
  const totalReserved = parkingZones.reduce(
    (sum, z) => sum + z.reservedSpaces,
    0
  );
  const totalEv = parkingZones.reduce(
    (sum, z) => sum + z.evChargersAvailable,
    0
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Top KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Available Spaces"
          value={totalAvailable}
          subtitle="Across Zones A, B, and C"
          trend="Live Sensor Mesh"
          icon={CheckCircle2}
          accent="emerald"
        />
        <StatCard
          title="Occupied Spaces"
          value={totalOccupied}
          subtitle="62% total campus capacity"
          icon={Car}
          accent="cyan"
        />
        <StatCard
          title="Reserved Spaces"
          value={totalReserved}
          subtitle="Faculty, Executive & Accessible"
          icon={ShieldCheck}
          accent="violet"
        />
        <StatCard
          title="EV Superchargers Free"
          value={totalEv}
          subtitle="Bidirectional V2G solar canopy"
          icon={Zap}
          accent="cyan"
        />
      </div>

      {/* Live Simulation Banner */}
      <GlassCard className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-base font-bold text-white">
            3D / Top-Down Autonomous Parking Matrix
          </h3>
          <p className="text-xs text-slate-400">
            Zone A (83%), Zone B (61%), Zone C (42%) — Click any bay to toggle vehicle occupancy or watch live telemetry updates.
          </p>
        </div>

        <button
          onClick={() => setLiveSimActive(!liveSimActive)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all shrink-0 ${
            liveSimActive
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-cyan-sm'
              : 'bg-white/[0.04] text-slate-400 border-white/10'
          }`}
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${liveSimActive ? 'animate-spin' : ''}`}
          />
          <span>
            {liveSimActive ? 'Live Telemetry Stream: ON' : 'Live Stream: PAUSED'}
          </span>
        </button>
      </GlassCard>

      {/* Parking Zones Grid (Zone A 83%, Zone B 61%, Zone C 42%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {parkingZones.map((zone) => (
          <ParkingZone key={zone.id} zone={zone} />
        ))}
      </div>
    </div>
  );
};
