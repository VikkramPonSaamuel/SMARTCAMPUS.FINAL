import React, { useState, useMemo } from 'react';
import {
  Search,
  School,
  Users,
  Thermometer,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { StatCard } from '../components/ui/StatCard';
import { GlassCard } from '../components/ui/GlassCard';
import { RoomCard } from '../components/classrooms/RoomCard';

export const ClassroomsPage: React.FC = () => {
  const { rooms, buildings } = useCampus();

  const [search, setSearch] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('ALL');
  const [floorFilter, setFloorFilter] = useState('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL');

  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      const matchesSearch =
        r.code.toLowerCase().includes(search.toLowerCase()) ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.buildingName.toLowerCase().includes(search.toLowerCase());
      const matchesBuilding =
        buildingFilter === 'ALL' || r.buildingId === buildingFilter;
      const matchesFloor =
        floorFilter === 'ALL' || String(r.floor) === floorFilter;
      const matchesStatus =
        availabilityFilter === 'ALL' || r.status === availabilityFilter;

      return (
        matchesSearch && matchesBuilding && matchesFloor && matchesStatus
      );
    });
  }, [rooms, search, buildingFilter, floorFilter, availabilityFilter]);

  const availableCount = rooms.filter((r) => r.status === 'AVAILABLE').length;
  const totalOccupancy = rooms.reduce((acc, r) => acc + r.currentOccupancy, 0);
  const avgTemp = (
    rooms.reduce((acc, r) => acc + r.temperature, 0) / rooms.length
  ).toFixed(1);

  return (
    <div className="space-y-6 pb-8">
      {/* Top KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Available Classrooms"
          value={availableCount}
          subtitle="Ready for immediate smart booking"
          trend="+4 vs last hr"
          icon={CheckCircle2}
          accent="emerald"
        />
        <StatCard
          title="Active Smart Rooms"
          value={rooms.length}
          subtitle="Equipped with 4K Laser & HVAC AI"
          icon={School}
          accent="cyan"
        />
        <StatCard
          title="Students in Classrooms"
          value={totalOccupancy}
          subtitle="Live optical occupancy count"
          trend="74% utilization"
          icon={Users}
          accent="violet"
        />
        <StatCard
          title="Mean Classroom Temp"
          value={`${avgTemp}°C`}
          subtitle="CO₂ avg 465 ppm (Optimal)"
          icon={Thermometer}
          accent="cyan"
        />
      </div>

      {/* Filters & Search Bar (Section 16) */}
      <GlassCard className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
          {/* Room Search */}
          <div className="lg:col-span-2 flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#050816]/80 border border-white/10 focus-within:border-cyan-400/50">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Room B204, Amphitheater, Robotics..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Building Filter */}
          <div>
            <select
              value={buildingFilter}
              onChange={(e) => setBuildingFilter(e.target.value)}
              className="w-full rounded-xl bg-[#050816]/80 border border-white/10 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="ALL">All Buildings</option>
              {buildings
                .filter((b) => b.category !== 'parking')
                .map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.code} — {b.shortName}
                  </option>
                ))}
            </select>
          </div>

          {/* Floor Filter */}
          <div>
            <select
              value={floorFilter}
              onChange={(e) => setFloorFilter(e.target.value)}
              className="w-full rounded-xl bg-[#050816]/80 border border-white/10 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="ALL">All Floors</option>
              <option value="1">Floor 1 (Ground)</option>
              <option value="2">Floor 2</option>
              <option value="3">Floor 3</option>
            </select>
          </div>

          {/* Availability Filter */}
          <div>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="w-full rounded-xl bg-[#050816]/80 border border-white/10 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="AVAILABLE">Available Only</option>
              <option value="OCCUPIED">Occupied</option>
              <option value="RESERVED">Reserved</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Room Cards Grid */}
      {filteredRooms.length === 0 ? (
        <GlassCard className="p-10 text-center">
          <Filter className="h-8 w-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-white">
            No classrooms match the active filters
          </p>
          <button
            onClick={() => {
              setSearch('');
              setBuildingFilter('ALL');
              setFloorFilter('ALL');
              setAvailabilityFilter('ALL');
            }}
            className="mt-3 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-semibold"
          >
            Reset Filters
          </button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
};
