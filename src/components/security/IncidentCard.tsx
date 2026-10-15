import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  MapPin,
  Clock,
  CheckCircle2,
  Crosshair,
  Sparkles,
} from 'lucide-react';
import { SecurityIncident } from '../../types/campus';
import { GlassCard } from '../ui/GlassCard';
import { useCampus } from '../../context/CampusContext';

interface IncidentCardProps {
  incident: SecurityIncident;
  onLocate?: (incident: SecurityIncident) => void;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({
  incident,
  onLocate,
}) => {
  const { resolveIncident, setSelectedBuildingId, setActiveLayer } = useCampus();
  const navigate = useNavigate();

  const severityStyles = {
    Critical: {
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      glow: 'rose' as const,
    },
    Warning: {
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      glow: 'amber' as const,
    },
    Info: {
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
      glow: 'none' as const,
    },
  }[incident.severity];

  const handleViewLocation = () => {
    setSelectedBuildingId(incident.buildingId);
    setActiveLayer('security');
    if (onLocate) {
      onLocate(incident);
    } else {
      navigate('/digital-twin');
    }
  };

  return (
    <GlassCard
      glow={incident.status === 'Resolved' ? 'none' : severityStyles.glow}
      className={incident.status === 'Resolved' ? 'opacity-70' : ''}
    >
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold tracking-wider text-cyan-300">
              {incident.code}
            </span>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${severityStyles.badge}`}
            >
              {incident.severity}
            </span>
          </div>
          <h4 className="font-display text-base font-bold text-white mt-1">
            {incident.type}
          </h4>
        </div>

        <span
          className={`text-[10px] font-mono px-2 py-1 rounded-lg border ${
            incident.status === 'Active'
              ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 animate-pulse'
              : incident.status === 'Investigating'
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
          }`}
        >
          ● {incident.status}
        </span>
      </div>

      {/* Structured Details */}
      <div className="grid grid-cols-2 gap-2.5 mt-3 text-xs">
        <div className="p-2.5 rounded-xl bg-[#050816]/60 border border-white/[0.05]">
          <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
            <MapPin className="h-3 w-3 text-cyan-400" />
            Location
          </span>
          <p className="font-semibold text-white mt-0.5">{incident.location}</p>
        </div>

        <div className="p-2.5 rounded-xl bg-[#050816]/60 border border-white/[0.05]">
          <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
            <Clock className="h-3 w-3 text-violet-400" />
            Time Logged
          </span>
          <p className="font-semibold text-white mt-0.5 font-mono">
            {incident.time}
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-300 mt-3 leading-relaxed">
        {incident.description}
      </p>

      <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-white/[0.02] px-3 py-1.5 rounded-lg border border-white/[0.05]">
        <span>Unit: {incident.assignedUnit}</span>
        <span className="text-cyan-300 flex items-center gap-1">
          <Sparkles className="h-3 w-3" /> {incident.aiConfidence}% AI Verified
        </span>
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.07] flex items-center justify-between gap-2">
        <button
          onClick={handleViewLocation}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-400/35 text-xs font-semibold transition-all"
        >
          <Crosshair className="h-3.5 w-3.5" />
          View Location
        </button>

        {incident.status !== 'Resolved' && (
          <button
            onClick={() => resolveIncident(incident.id)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/10 text-xs font-medium transition-all"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Mark Resolved
          </button>
        )}
      </div>
    </GlassCard>
  );
};
