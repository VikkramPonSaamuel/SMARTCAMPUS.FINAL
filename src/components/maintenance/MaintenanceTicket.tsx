import React from 'react';
import {
  Wrench,
  Sparkles,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  PlayCircle,
} from 'lucide-react';
import { MaintenanceTicketItem } from '../../types/campus';
import { GlassCard } from '../ui/GlassCard';
import { useCampus } from '../../context/CampusContext';

interface MaintenanceTicketProps {
  ticket: MaintenanceTicketItem;
}

export const MaintenanceTicket: React.FC<MaintenanceTicketProps> = ({
  ticket,
}) => {
  const { updateTicketStatus } = useCampus();

  const priorityColors = {
    Critical: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    High: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    Medium: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
    Low: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
  }[ticket.priority];

  const statusColors = {
    Open: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    'In Progress': 'bg-cyan-500/15 text-cyan-300 border-cyan-400/30',
    Resolved: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  }[ticket.status];

  return (
    <GlassCard interactive className="flex flex-col justify-between">
      <div>
        {/* Top Row: Ticket ID, Priority, Status */}
        <div className="flex items-start justify-between gap-2 pb-3 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-cyan-300">
                {ticket.ticketId}
              </span>
              <span
                className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border ${priorityColors}`}
              >
                {ticket.priority}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-slate-300">
                {ticket.category}
              </span>
            </div>
            <h4 className="font-display text-sm sm:text-base font-bold text-white mt-1.5">
              {ticket.issue}
            </h4>
          </div>

          <span
            className={`text-[10px] font-mono font-semibold px-2.5 py-1 rounded-lg border shrink-0 ${statusColors}`}
          >
            ● {ticket.status}
          </span>
        </div>

        <p className="text-xs text-slate-300 mt-3 leading-relaxed">
          {ticket.description}
        </p>

        {/* AI Classification Indicator (Section 20) */}
        <div className="mt-3.5 p-3 rounded-xl bg-gradient-to-r from-cyan-500/[0.09] via-violet-500/[0.06] to-transparent border border-cyan-400/30">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold">
                AI Classification: {ticket.aiClassification.label}
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-300">
              Confidence: {ticket.aiClassification.confidence}%
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1">
            {ticket.aiClassification.recommendedAction}
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-3 gap-2 mt-3.5 text-[11px]">
          <div className="p-2 rounded-lg bg-[#050816]/60 border border-white/[0.05]">
            <span className="text-[9px] font-mono uppercase text-slate-400 flex items-center gap-1">
              <MapPin className="h-2.5 w-2.5 text-cyan-400" /> Location
            </span>
            <p className="font-medium text-white truncate mt-0.5">
              {ticket.location}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-[#050816]/60 border border-white/[0.05]">
            <span className="text-[9px] font-mono uppercase text-slate-400 flex items-center gap-1">
              <Users className="h-2.5 w-2.5 text-violet-400" /> Assigned Team
            </span>
            <p className="font-medium text-white truncate mt-0.5">
              {ticket.assignedTeam}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-[#050816]/60 border border-white/[0.05]">
            <span className="text-[9px] font-mono uppercase text-slate-400 flex items-center gap-1">
              <Clock className="h-2.5 w-2.5 text-emerald-400" /> Logged
            </span>
            <p className="font-mono text-white truncate mt-0.5">{ticket.time}</p>
          </div>
        </div>
      </div>

      {/* Status Action Footer */}
      <div className="mt-4 pt-3 border-t border-white/[0.07] flex items-center justify-end gap-2">
        {ticket.status === 'Open' && (
          <button
            onClick={() => updateTicketStatus(ticket.id, 'In Progress')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-400/35 text-xs font-semibold transition-all"
          >
            <PlayCircle className="h-3.5 w-3.5" />
            Dispatch Team
          </button>
        )}
        {ticket.status !== 'Resolved' && (
          <button
            onClick={() => updateTicketStatus(ticket.id, 'Resolved')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-400/35 text-xs font-semibold transition-all"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Resolve Ticket
          </button>
        )}
      </div>
    </GlassCard>
  );
};
