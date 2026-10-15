import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Zap,
  BatteryCharging,
  Leaf,
  TrendingDown,
  Sparkles,
  AlertTriangle,
  Sun,
} from 'lucide-react';
import {
  BUILDING_ENERGY_COMPARISON,
  ENERGY_CHART_DATA,
  LIVE_CAMPUS_METRICS,
} from '../data/campusData';
import { StatCard } from '../components/ui/StatCard';
import { GlassCard } from '../components/ui/GlassCard';
import { EnergyChart } from '../components/analytics/EnergyChart';
import { AnalyticsCard } from '../components/analytics/AnalyticsCard';

export const EnergyPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-8">
      {/* Top 4 Energy Intelligence Metrics (Section 17) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Consumption"
          value={`${LIVE_CAMPUS_METRICS.currentPowerMw} MW`}
          subtitle="Real-time campus microgrid draw"
          trend="-0.4 MW vs peak"
          icon={Zap}
          accent="cyan"
        />
        <StatCard
          title="Today's Usage"
          value={`${LIVE_CAMPUS_METRICS.todayUsageMwh} MWh`}
          subtitle="Cumulative 24h demand"
          trend="On target"
          icon={BatteryCharging}
          accent="violet"
        />
        <StatCard
          title="Energy Saved"
          value={`${LIVE_CAMPUS_METRICS.energySavedPercent}%`}
          subtitle="Predictive HVAC + Solar offset"
          trend="+3.2% vs last wk"
          icon={TrendingDown}
          accent="emerald"
        />
        <StatCard
          title="CO₂ Reduction"
          value={`${LIVE_CAMPUS_METRICS.co2ReductionTons} tons`}
          subtitle="Net carbon avoided today"
          trend="100% ESG compliant"
          icon={Leaf}
          accent="emerald"
        />
      </div>

      {/* Prominent AI Energy Insight Banner (Section 17) */}
      <GlassCard
        glow="amber"
        className="p-4 bg-gradient-to-r from-amber-500/10 via-teal-500/10 to-white/80"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/35 text-amber-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-800">
                  AI ENERGY INSIGHT • ANOMALY DETECTION
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-900">
                  94% Confidence
                </span>
              </div>
              <h3 className="font-display text-base sm:text-lg font-bold text-[#042f2e] mt-0.5">
                "Block C is consuming 23% more energy than its weekly average."
              </h3>
              <p className="text-xs text-[#1f5754] mt-0.5">
                Floor 2 Chiller Loop #2 is operating at 100% duty cycle despite 68% occupancy. Switching to Eco-Modulation will save 180 kW immediately.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 text-amber-900 border border-amber-500/35 text-xs font-semibold">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-700" />
              Block C — Floor 2
            </span>
          </div>
        </div>
      </GlassCard>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Consumption Graph */}
        <div className="lg:col-span-7">
          <EnergyChart height={280} />
        </div>

        {/* Predicted Consumption vs Baseline */}
        <div className="lg:col-span-5">
          <AnalyticsCard
            title="AI Predicted Consumption vs Baseline"
            subtitle="24-hour neural load forecast (MW)"
          >
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <LineChart
                  data={ENERGY_CHART_DATA.Today}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(13,148,136,0.12)"
                    vertical={false}
                  />
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
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line
                    type="monotone"
                    dataKey="baseline"
                    name="Unoptimized Baseline"
                    stroke="#94A3B8"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    name="AI Predicted Load"
                    stroke="#14B8A6"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="consumption"
                    name="Actual Load"
                    stroke="#007F6E"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </AnalyticsCard>
        </div>

        {/* Building Comparison Chart */}
        <div className="lg:col-span-12">
          <AnalyticsCard
            title="Building Energy Comparison & Solar Generation"
            subtitle="Current load (kW) vs Weekly Average (kW) and Rooftop Solar Yield"
            action={
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800 bg-emerald-500/15 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                <Sun className="h-3.5 w-3.5 text-emerald-700" />
                2,310 kW Peak Solar Capacity
              </span>
            }
          >
            <div style={{ width: '100%', height: 270 }}>
              <ResponsiveContainer>
                <BarChart
                  data={BUILDING_ENERGY_COMPARISON}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(13,148,136,0.12)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="building"
                    stroke="#1f5754"
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
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar
                    dataKey="current"
                    name="Current Load (kW)"
                    fill="#008F7A"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="average"
                    name="Weekly Avg (kW)"
                    fill="#2DD4BF"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="solar"
                    name="Solar Output (kW)"
                    fill="#059669"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </AnalyticsCard>
        </div>
      </div>
    </div>
  );
};
