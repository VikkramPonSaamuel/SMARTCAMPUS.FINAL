import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Sparkles,
  Navigation,
  Activity,
  Droplets,
  Wrench,
  ArrowUpRight,
  Cpu,
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { CAMPUS_SYSTEM_STATUS, WATER_USAGE_DATA } from '../data/campusData';
import { CampusScene } from '../components/twin/CampusScene';
import { GlassCard } from '../components/ui/GlassCard';
import { StatusIndicator } from '../components/ui/StatusIndicator';
import { AIAssistant } from '../components/ai/AIAssistant';
import { EnergyChart } from '../components/analytics/EnergyChart';
import { OccupancyChart } from '../components/analytics/OccupancyChart';
import { AnalyticsCard } from '../components/analytics/AnalyticsCard';
import { AlertCard } from '../components/alerts/AlertCard';

export const DashboardPage: React.FC = () => {
  const {
    alerts,
    setIsNavModalOpen,
    liveMetrics,
    buildings,
    selectedBuildingId,
    setSelectedBuildingId,
  } = useCampus();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-8">
      {/* Hero Heading Row (Section 7) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-teal-500/30 text-[11px] font-mono font-semibold text-[#007F6E] mb-2 shadow-xs">
            <Cpu className="h-3.5 w-3.5 text-[#008F7A]" />
            <span>AUTONOMOUS DIGITAL TWIN • REAL-TIME TELEMETRY</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#042f2e]">
            Good morning, <span className="text-[#008F7A]">Admin</span>
          </h2>
          <p className="text-sm text-[#336663] mt-1">
            Here's what's happening across your campus.
          </p>
        </div>

        {/* Quick Action Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsNavModalOpen(true)}
            className="btn-ocean-primary flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#008F7A] to-[#14B8A6] hover:from-[#007F6E] hover:to-[#0D9488] font-bold text-xs shadow-[0_8px_20px_-4px_rgba(0,143,122,0.4)] border border-white/60 transition-all text-white"
          >
            <Navigation className="h-3.5 w-3.5 text-white" />
            <span>Navigate Campus</span>
          </button>
          <button
            onClick={() => navigate('/digital-twin')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/80 hover:bg-white text-[#042f2e] border border-teal-500/25 text-xs font-semibold shadow-xs transition-all"
          >
            <span>Full 3D Command View</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-[#008F7A]" />
          </button>
        </div>
      </div>

      {/* Primary First Viewport: 3D DIGITAL TWIN (60% width on xl) + CAMPUS STATUS & AI ASSISTANT (40% width) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        {/* 3D Digital Campus Hero (~58-60% of first viewport) */}
        <div className="xl:col-span-7 2xl:col-span-8 flex flex-col gap-3">
          <CampusScene heightClass="h-[520px] sm:h-[560px] xl:h-full min-h-[520px]" showFloatingCards={true} />
        </div>

        {/* Right Column: Campus Status (Section 11) + AI Campus Assistant (Section 12) */}
        <div className="xl:col-span-5 2xl:col-span-4 flex flex-col gap-5">
          {/* Compact CAMPUS STATUS Panel (Section 11) */}
          <GlassCard className="p-4">
            <div className="flex items-center justify-between pb-3 border-b border-teal-500/15">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#008F7A]" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#042f2e]">
                  CAMPUS STATUS
                </h3>
              </div>
              <span className="text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                99.98% Uptime
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 xl:grid-cols-5 gap-2 mt-3">
              {CAMPUS_SYSTEM_STATUS.map((sys) => (
                <div
                  key={sys.id}
                  className="p-2.5 rounded-xl bg-white/80 border border-teal-500/15 flex flex-col justify-between shadow-2xs"
                >
                  <span className="text-[11px] font-semibold text-[#1f5754]">
                    {sys.name}
                  </span>
                  <div className="mt-1.5">
                    <StatusIndicator
                      status={sys.status}
                      label={sys.label}
                      size="sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* AI CAMPUS ASSISTANT Panel (Section 12) */}
          <div className="flex-1">
            <AIAssistant compact={true} />
          </div>
        </div>
      </div>

      {/* VISTAS Campus Plan Quick Block Jump Bar (Blocks 1 to 30 from Image 1 & Image 3) */}
      <GlassCard className="p-3.5">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#007F6E]">
            VISTAS Campus Plan — 30 Blocks Quick Selector (Click to Focus 3D Twin)
          </span>
          <button
            onClick={() => navigate('/digital-twin')}
            className="text-xs font-semibold text-[#008F7A] hover:underline"
          >
            View Full 30-Block Directory →
          </button>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5">
          {buildings.map((b) => {
            const num = b.id.replace('block-', '');
            const isSel = selectedBuildingId === b.id;
            return (
              <button
                key={b.id}
                onClick={() => setSelectedBuildingId(isSel ? null : b.id)}
                className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  isSel
                    ? 'btn-ocean-primary bg-gradient-to-r from-[#008F7A] to-[#14B8A6] border-white shadow-sm'
                    : 'bg-white/80 hover:bg-white text-[#042f2e] border-teal-500/20 hover:border-[#008F7A]'
                }`}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-mono font-bold ${
                    isSel
                      ? 'bg-white text-[#007F6E]'
                      : 'bg-[#008F7A] !text-white'
                  }`}
                >
                  {num}
                </span>
                <span className={isSel ? '!text-white' : 'text-[#042f2e]'}>
                  {b.name}
                </span>
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* SMART ALERTS Section (Section 14) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#008F7A]" />
            <h3 className="font-display text-base sm:text-lg font-bold text-[#042f2e]">
              Smart Alerts & Predictive Anomalies
            </h3>
          </div>
          <span className="text-xs font-mono font-semibold text-[#007F6E]">
            {alerts.filter((a) => !a.acknowledged).length} Active Signals
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </div>

      {/* ANALYTICS Section Below Hero (Section 13) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Energy Consumption Chart */}
        <div className="lg:col-span-6">
          <EnergyChart height={220} />
        </div>

        {/* Campus Occupancy Radial Chart */}
        <div className="lg:col-span-6">
          <OccupancyChart />
        </div>

        {/* Water Usage Clean Area Chart */}
        <div className="lg:col-span-7">
          <AnalyticsCard
            title="Water Usage & Greywater Recycling"
            subtitle="Flow telemetry across campus hydro-conduits (Liters / min)"
            action={
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#007F6E] bg-teal-500/15 px-2.5 py-1 rounded-lg border border-teal-500/30">
                <Droplets className="h-3.5 w-3.5" />
                {liveMetrics.waterUsageLitersPerMin} L/min
              </span>
            }
          >
            <div style={{ width: '100%', height: 210 }}>
              <ResponsiveContainer>
                <AreaChart
                  data={WATER_USAGE_DATA}
                  margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="waterBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#008F7A" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#5EEAD4" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="waterRecycled" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#99F6E4" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(13,148,136,0.12)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="time"
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
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="usage"
                    name="Total Flow (L/m)"
                    stroke="#008F7A"
                    strokeWidth={2.5}
                    fill="url(#waterBlue)"
                  />
                  <Area
                    type="monotone"
                    dataKey="recycled"
                    name="Recycled Greywater (L/m)"
                    stroke="#14B8A6"
                    strokeWidth={2}
                    fill="url(#waterRecycled)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </AnalyticsCard>
        </div>

        {/* Maintenance Visual Hierarchy Card */}
        <div className="lg:col-span-5">
          <AnalyticsCard
            title="Maintenance Operations"
            subtitle="Autonomous facility dispatch & ticket pipeline"
            action={
              <button
                onClick={() => navigate('/maintenance')}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#008F7A] hover:text-[#042f2e]"
              >
                <span>Open Hub</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            }
          >
            <div className="grid grid-cols-3 gap-3 my-2">
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex flex-col justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-700">
                  Critical
                </span>
                <span className="font-display text-3xl font-bold text-rose-600 mt-2">
                  03
                </span>
                <span className="text-[10px] text-[#467874] mt-1">
                  Immediate SLA
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800">
                  Pending
                </span>
                <span className="font-display text-3xl font-bold text-amber-700 mt-2">
                  12
                </span>
                <span className="text-[10px] text-[#467874] mt-1">
                  Crew Assigned
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/12 border border-emerald-500/30 flex flex-col justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800">
                  Resolved
                </span>
                <span className="font-display text-3xl font-bold text-emerald-700 mt-2">
                  48
                </span>
                <span className="text-[10px] text-[#467874] mt-1">
                  Last 24 Hours
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-white/80 border border-teal-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-teal-500/15 text-[#007F6E]">
                  <Wrench className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#042f2e]">
                    AI Predictive Triage Active
                  </p>
                  <p className="text-[11px] text-[#467874]">
                    96% classification accuracy on incoming sensor faults
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/maintenance')}
                className="btn-ocean-primary px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#008F7A] to-[#14B8A6] text-xs font-semibold shadow-xs transition-all shrink-0"
              >
                <span>+ Ticket</span>
              </button>
            </div>
          </AnalyticsCard>
        </div>
      </div>
    </div>
  );
};
