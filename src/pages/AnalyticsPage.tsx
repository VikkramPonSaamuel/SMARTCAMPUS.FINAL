import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  BarChart3,
  Droplets,
  Leaf,
  Users,
  Sparkles,
} from 'lucide-react';
import { WATER_USAGE_DATA, BUILDING_ENERGY_COMPARISON } from '../data/campusData';
import { StatCard } from '../components/ui/StatCard';
import { EnergyChart } from '../components/analytics/EnergyChart';
import { OccupancyChart } from '../components/analytics/OccupancyChart';
import { AnalyticsCard } from '../components/analytics/AnalyticsCard';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-8">
      {/* Top KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Campus Efficiency Index"
          value="94.2%"
          subtitle="Composite AI operational score"
          trend="+2.4% MoM"
          icon={BarChart3}
          accent="cyan"
        />
        <StatCard
          title="Average Occupancy"
          value="72%"
          subtitle="2,847 active students & faculty"
          trend="Optimal Flow"
          icon={Users}
          accent="violet"
        />
        <StatCard
          title="Water Conservation"
          value="47.3%"
          subtitle="Greywater closed-loop recovery"
          trend="184.5 kL/day"
          icon={Droplets}
          accent="emerald"
        />
        <StatCard
          title="Net Carbon Offset"
          value="84.6 t"
          subtitle="Monthly cumulative CO₂ avoided"
          trend="Net-Zero Track"
          icon={Leaf}
          accent="emerald"
        />
      </div>

      {/* Primary Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6">
          <EnergyChart height={250} />
        </div>
        <div className="lg:col-span-6">
          <OccupancyChart />
        </div>

        {/* Water Usage Area Chart */}
        <div className="lg:col-span-6">
          <AnalyticsCard
            title="Hydro-Telemetry & Greywater Recovery"
            subtitle="Hourly water demand vs closed-loop filtration (L/min)"
          >
            <div style={{ width: '100%', height: 240 }}>
              <ResponsiveContainer>
                <AreaChart
                  data={WATER_USAGE_DATA}
                  margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                >
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
                    name="Gross Flow (L/m)"
                    stroke="#008F7A"
                    fill="rgba(0, 143, 122, 0.25)"
                    strokeWidth={2.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="recycled"
                    name="Recycled Loop (L/m)"
                    stroke="#14B8A6"
                    fill="rgba(45, 212, 191, 0.3)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </AnalyticsCard>
        </div>

        {/* Building Efficiency Score Comparison */}
        <div className="lg:col-span-6">
          <AnalyticsCard
            title="Building ESG & HVAC Efficiency Score (%)"
            subtitle="Cross-block operational benchmark"
            action={
              <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#008F7A]">
                <Sparkles className="h-3.5 w-3.5" /> AI Benchmarked
              </span>
            }
          >
            <div style={{ width: '100%', height: 240 }}>
              <ResponsiveContainer>
                <BarChart
                  data={BUILDING_ENERGY_COMPARISON}
                  margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(13,148,136,0.12)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="code"
                    stroke="#1f5754"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
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
                  <Bar
                    dataKey="efficiency"
                    name="Efficiency Score (%)"
                    fill="#14B8A6"
                    radius={[8, 8, 0, 0]}
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
