import React, { useState } from 'react';
import {
  Box,
  Users,
  Zap,
  ShieldAlert,
  Car,
  Wind,
  Sparkles,
  Search,
  Compass,
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { CampusScene } from '../components/twin/CampusScene';
import { GlassCard } from '../components/ui/GlassCard';
import { StatusIndicator } from '../components/ui/StatusIndicator';
import { TwinLayerMode } from '../types/campus';

const LAYER_DESCRIPTIONS: Record<
  TwinLayerMode,
  { title: string; subtitle: string; metricLabel: string; metricValue: string }
> = {
  buildings: {
    title: 'VISTAS 3D Campus Plan (Blocks 1–30)',
    subtitle: 'Complete 3D architectural digital twin of VELS Institute of Science, Technology & Advanced Studies (Pallavaram).',
    metricLabel: 'Active Structures',
    metricValue: '30 Numbered Blocks • 4 Gates',
  },
  occupancy: {
    title: 'Spatial Occupancy Heatmap Mode',
    subtitle: 'All 30 campus blocks shift luminous intensity based on real-time student & hostel density.',
    metricLabel: 'Campus Density',
    metricValue: '72% Avg (2,847 Students)',
  },
  energy: {
    title: 'Smart Grid & Energy Flow Mode',
    subtitle: 'Animated particle streams show power distribution across Dr. MGR Block, Steve Jobs Block, and Abdul Kalam Block.',
    metricLabel: 'Net Grid Draw',
    metricValue: '4.82 MW (-18.6% Saved)',
  },
  security: {
    title: 'Autonomous Security & Perimeter Mode',
    subtitle: 'Highlights security perimeter rings, Gates 1–4 access nodes, and active incident locations.',
    metricLabel: 'Active Alerts',
    metricValue: '02 Incidents • 94/96 Cameras',
  },
  parking: {
    title: 'Smart Mobility & Gate Parking Mode',
    subtitle: 'Visualizes Gate 3 / MGR Block (Zone A), Gate 2 (Zone B), and Gate 1 / Kalam Block (Zone C) occupancy.',
    metricLabel: 'Available Bays',
    metricValue: '37 Immediate Slots',
  },
  environment: {
    title: 'Micro-Climate & AQI Telemetry Mode',
    subtitle: 'Monitors central sports ground, upper courtyard, air quality index, and thermal comfort.',
    metricLabel: 'Campus Climate',
    metricValue: '22.4°C • AQI 18 Excellent',
  },
};

export const DigitalTwinPage: React.FC = () => {
  const {
    buildings,
    selectedBuildingId,
    setSelectedBuildingId,
    activeLayer,
    setActiveLayer,
  } = useCampus();

  const [blockFilter, setBlockFilter] = useState('');
  const layerInfo = LAYER_DESCRIPTIONS[activeLayer];

  const layerButtons: {
    id: TwinLayerMode;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'buildings', label: 'Buildings (1–30)', icon: Box },
    { id: 'energy', label: 'Energy', icon: Zap },
    { id: 'occupancy', label: 'Occupancy', icon: Users },
    { id: 'security', label: 'Security', icon: ShieldAlert },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'environment', label: 'Environment', icon: Wind },
  ];

  const filteredBlocks = buildings.filter(
    (b) =>
      b.name.toLowerCase().includes(blockFilter.toLowerCase()) ||
      b.code.toLowerCase().includes(blockFilter.toLowerCase()) ||
      b.shortName.toLowerCase().includes(blockFilter.toLowerCase())
  );

  return (
    <div className="space-y-5 pb-8">
      {/* Top Control & Layer Status Bar */}
      <GlassCard className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/15 border border-teal-500/35 text-[#008F7A]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display text-base sm:text-lg font-bold text-[#042f2e]">
                {layerInfo.title}
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-500/15 text-[#007F6E] border border-teal-500/30">
                {layerInfo.metricValue}
              </span>
            </div>
            <p className="text-xs text-[#467874] mt-0.5">{layerInfo.subtitle}</p>
          </div>
        </div>

        {/* Dedicated Layer Mode Switcher */}
        <div className="flex flex-wrap items-center gap-1.5">
          {layerButtons.map((btn) => {
            const Icon = btn.icon;
            const active = activeLayer === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => setActiveLayer(btn.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  active
                    ? 'btn-ocean-primary bg-gradient-to-r from-[#008F7A] to-[#14B8A6] border-white/60 shadow-sm text-white'
                    : 'bg-white/75 hover:bg-white text-[#1f5754] border-teal-500/20'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${active ? 'text-white' : 'text-[#008F7A]'}`} />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Main Immersive 3D Viewport */}
      <CampusScene
        heightClass="h-[600px] sm:h-[660px]"
        showFloatingCards={true}
      />

      {/* Official VISTAS Campus Plan Legend (Blocks 1 to 30) */}
      <GlassCard className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-teal-500/15">
          <div className="flex items-center gap-2.5">
            <Compass className="h-5 w-5 text-[#008F7A]" />
            <div>
              <h3 className="font-display text-base font-bold text-[#042f2e]">
                VISTAS Campus Plan Directory — All 30 Blocks
              </h3>
              <p className="text-xs text-[#467874]">
                Click any numbered block (1–30) to fly the 3D camera directly to its structure and inspect live telemetry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/85 border border-teal-500/25 w-full sm:w-64">
            <Search className="h-3.5 w-3.5 text-[#008F7A] shrink-0" />
            <input
              type="text"
              value={blockFilter}
              onChange={(e) => setBlockFilter(e.target.value)}
              placeholder="Filter 1. Dr. MGR, 12. Steve Jobs..."
              className="w-full bg-transparent text-xs text-[#042f2e] placeholder-[#467874] focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
          {filteredBlocks.map((b) => {
            const isSelected = selectedBuildingId === b.id;
            const num = b.id.replace('block-', '');
            return (
              <button
                key={b.id}
                onClick={() => setSelectedBuildingId(isSelected ? null : b.id)}
                className={`text-left p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'btn-ocean-primary bg-gradient-to-r from-[#008F7A] to-[#14B8A6] border-white shadow-md text-white'
                    : 'bg-white/80 hover:bg-white border-teal-500/20 hover:border-[#008F7A]'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`inline-flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-mono font-bold ${
                      isSelected
                        ? 'bg-white text-[#007F6E]'
                        : 'bg-[#008F7A] !text-white'
                    }`}
                  >
                    {num}
                  </span>
                  <StatusIndicator status={b.status} size="sm" />
                </div>
                <p
                  className={`text-xs font-bold truncate mt-1.5 ${
                    isSelected ? '!text-white' : 'text-[#042f2e]'
                  }`}
                  title={b.name}
                >
                  {b.name}
                </p>
                <div
                  className={`mt-1 flex items-center justify-between text-[10px] font-mono ${
                    isSelected ? '!text-white/90' : 'text-[#467874]'
                  }`}
                >
                  <span>{b.occupancy}% Occ</span>
                  <span>{b.energyKw} kW</span>
                </div>
              </button>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
};
