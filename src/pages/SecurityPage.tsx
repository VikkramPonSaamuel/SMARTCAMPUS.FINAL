import React, { useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Radio,
  Video,
  Eye,
  Lock,
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { SECURITY_CAMERAS, LIVE_CAMPUS_METRICS } from '../data/campusData';
import { StatCard } from '../components/ui/StatCard';
import { GlassCard } from '../components/ui/GlassCard';
import { IncidentCard } from '../components/security/IncidentCard';
import { CampusScene } from '../components/twin/CampusScene';
import { StatusIndicator } from '../components/ui/StatusIndicator';

export const SecurityPage: React.FC = () => {
  const { incidents, setActiveLayer, setSelectedBuildingId } = useCampus();
  const sec = LIVE_CAMPUS_METRICS.securitySummary;

  // Automatically switch 3D scene to Security Layer when visiting Security Page
  useEffect(() => {
    setActiveLayer('security');
  }, [setActiveLayer]);

  const activeIncidentCount = incidents.filter(
    (i) => i.status !== 'Resolved'
  ).length;

  return (
    <div className="space-y-6 pb-8">
      {/* Top 4 Security Metrics (Section 18) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Incidents"
          value={`0${activeIncidentCount}`}
          subtitle="Priority response dispatched"
          trend="1 Critical"
          trendPositive={false}
          icon={ShieldAlert}
          accent="rose"
        />
        <StatCard
          title="Security Personnel"
          value={sec.securityPersonnel}
          subtitle="On-duty officers & drone units"
          trend="100% Deployed"
          icon={Users}
          accent="cyan"
        />
        <StatCard
          title="Emergency Stations"
          value={sec.emergencyStations}
          subtitle="SOS beacons & defibrillator pods"
          trend="All Online"
          icon={Radio}
          accent="emerald"
        />
        <StatCard
          title="Cameras Online"
          value={`${sec.camerasOnline}/${sec.camerasTotal}`}
          subtitle="AI computer-vision nodes"
          trend="97.9% Uptime"
          icon={Video}
          accent="violet"
        />
      </div>

      {/* Main Grid: 3D Security Map + Active Incidents */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Simplified 3D Security Map */}
        <div className="xl:col-span-7 flex flex-col gap-4">
          <CampusScene heightClass="h-[480px] sm:h-[520px]" showFloatingCards={false} />
        </div>

        {/* Incident Cards Column (Section 18) */}
        <div className="xl:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-400" />
              Live Security Incident Feed
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Click [View Location] to lock 3D target
            </span>
          </div>

          <div className="space-y-3.5">
            {incidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                onLocate={(inc) => {
                  setSelectedBuildingId(inc.buildingId);
                  setActiveLayer('security');
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Optical Vision Camera Matrix */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
              <Eye className="h-4 w-4 text-cyan-400" />
              Autonomous Optical Telemetry Nodes
            </h3>
            <p className="text-xs text-slate-400">
              Privacy-preserving spatial crowd & thermal anomaly feeds
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/25">
            <Lock className="h-3.5 w-3.5" /> End-to-End Encrypted
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECURITY_CAMERAS.map((cam) => (
            <div
              key={cam.id}
              onClick={() => setSelectedBuildingId(cam.buildingId)}
              className="cursor-pointer group relative rounded-xl bg-[#050816]/90 border border-white/10 hover:border-cyan-400/50 p-3.5 overflow-hidden transition-all"
            >
              {/* Simulated HUD Scanline Background */}
              <div className="h-28 rounded-lg bg-gradient-to-br from-slate-900 via-[#0B1224] to-slate-950 border border-white/[0.06] p-2.5 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 architectural-grid opacity-40" />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/60 text-cyan-300 border border-cyan-400/30">
                    {cam.id} • REC
                  </span>
                  <StatusIndicator status="online" label={cam.status} size="sm" />
                </div>

                <div className="relative z-10 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-300 bg-black/60 px-2 py-0.5 rounded">
                    Persons: <strong className="text-white">{cam.peopleDetected}</strong>
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded ${
                      cam.anomalyScore > 50
                        ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    Risk: {cam.anomalyScore}%
                  </span>
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white group-hover:text-cyan-300">
                    {cam.name}
                  </p>
                  <p className="text-[11px] text-slate-400">{cam.location}</p>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">
                  Focus 3D →
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
