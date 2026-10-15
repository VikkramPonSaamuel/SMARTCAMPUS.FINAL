import React, { useState } from 'react';
import {
  Wrench,
  AlertOctagon,
  Clock,
  CheckCircle2,
  Sparkles,
  Camera,
  Send,
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { LIVE_CAMPUS_METRICS } from '../data/campusData';
import { MaintenanceTicketItem } from '../types/campus';
import { StatCard } from '../components/ui/StatCard';
import { GlassCard } from '../components/ui/GlassCard';
import { MaintenanceTicket } from '../components/maintenance/MaintenanceTicket';

export const MaintenancePage: React.FC = () => {
  const { tickets, addMaintenanceTicket, buildings } = useCampus();
  const summary = LIVE_CAMPUS_METRICS.maintenanceSummary;

  const [category, setCategory] =
    useState<MaintenanceTicketItem['category']>('Electrical');
  const [buildingId, setBuildingId] = useState('block-c');
  const [locationDetail, setLocationDetail] = useState('Block C — Floor 2');
  const [priority, setPriority] =
    useState<MaintenanceTicketItem['priority']>('High');
  const [description, setDescription] = useState('');
  const [photoAttached, setPhotoAttached] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [justCreatedId, setJustCreatedId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    const created = addMaintenanceTicket({
      category,
      location: locationDetail,
      buildingId,
      description,
      priority,
    });
    setDescription('');
    setPhotoAttached(false);
    setJustCreatedId(created.ticketId);
    setTimeout(() => setJustCreatedId(null), 4000);
  };

  const filteredTickets = tickets.filter((t) =>
    statusFilter === 'ALL' ? true : t.status === statusFilter
  );

  // Dynamic AI classification preview for the submission form
  const liveAiPreview: Record<
    MaintenanceTicketItem['category'],
    { label: string; conf: number }
  > = {
    Electrical: { label: 'Electrical Issue', conf: 96 },
    HVAC: { label: 'HVAC & Thermal Control', conf: 94 },
    Plumbing: { label: 'Hydraulic / Flow Anomaly', conf: 93 },
    Network: { label: 'Optical / Wi-Fi 7 Mesh', conf: 97 },
    Structural: { label: 'Civil Infrastructure', conf: 91 },
    'AV Equipment': { label: 'Smart Classroom AV', conf: 95 },
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Top 4 Maintenance Dashboard Metrics (Section 20: Open 24, In Progress 12, Resolved 48, Critical 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Open Tickets"
          value={summary.open}
          subtitle="Awaiting autonomous crew dispatch"
          icon={Wrench}
          accent="amber"
        />
        <StatCard
          title="In Progress"
          value={summary.inProgress}
          subtitle="Technicians actively on-site"
          icon={Clock}
          accent="cyan"
        />
        <StatCard
          title="Resolved"
          value={summary.resolved}
          subtitle="Completed within SLA window"
          trend="98.4% SLA"
          icon={CheckCircle2}
          accent="emerald"
        />
        <StatCard
          title="Critical"
          value={summary.critical}
          subtitle="Immediate facility intervention"
          trendPositive={false}
          trend="Priority 1"
          icon={AlertOctagon}
          accent="rose"
        />
      </div>

      {/* Main Content Grid: Submit New Ticket Form + Live Ticket List */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Submit Maintenance Ticket Form (Section 20) */}
        <GlassCard className="xl:col-span-4 space-y-4">
          <div className="pb-3 border-b border-white/[0.08]">
            <h3 className="font-display text-base font-bold text-white">
              Submit Maintenance Ticket
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              AI neural triage automatically classifies and assigns the appropriate engineering unit.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value as MaintenanceTicketItem['category']
                  )
                }
                className="w-full rounded-xl bg-[#050816]/90 border border-white/10 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="Electrical">Electrical</option>
                <option value="HVAC">HVAC & Climate</option>
                <option value="Plumbing">Plumbing & Hydro</option>
                <option value="Network">Network & Optical</option>
                <option value="AV Equipment">AV Equipment</option>
                <option value="Structural">Structural</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Campus Block
                </label>
                <select
                  value={buildingId}
                  onChange={(e) => {
                    setBuildingId(e.target.value);
                    const b = buildings.find((item) => item.id === e.target.value);
                    if (b) setLocationDetail(`${b.code} — Floor 1`);
                  }}
                  className="w-full rounded-xl bg-[#050816]/90 border border-white/10 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                >
                  {buildings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.code}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(
                      e.target.value as MaintenanceTicketItem['priority']
                    )
                  }
                  className="w-full rounded-xl bg-[#050816]/90 border border-white/10 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Exact Location
              </label>
              <input
                type="text"
                value={locationDetail}
                onChange={(e) => setLocationDetail(e.target.value)}
                placeholder="e.g., Block C — Floor 2 Room C201"
                className="w-full rounded-xl bg-[#050816]/90 border border-white/10 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Issue Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe voltage fluctuation, HVAC noise, or sensor anomaly..."
                className="w-full rounded-xl bg-[#050816]/90 border border-white/10 p-3 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Photo Upload Toggle */}
            <div>
              <button
                type="button"
                onClick={() => setPhotoAttached(!photoAttached)}
                className={`w-full py-2 px-3 rounded-xl border border-dashed text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  photoAttached
                    ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-300'
                    : 'bg-[#050816]/60 border-white/15 text-slate-400 hover:text-white'
                }`}
              >
                <Camera className="h-4 w-4" />
                <span>
                  {photoAttached
                    ? 'Thermal_Inspection_Capture.jpg Attached ✓'
                    : 'Attach Diagnostic Photo / Thermal Scan'}
                </span>
              </button>
            </div>

            {/* Live AI Classification Preview Box */}
            <div className="p-3 rounded-xl bg-cyan-500/[0.08] border border-cyan-400/30">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Classification: {liveAiPreview[category].label}
                </span>
                <span className="font-mono text-emerald-300 font-bold">
                  {liveAiPreview[category].conf}%
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                Auto-routes to specialized campus engineering unit upon submission.
              </p>
            </div>

            <button
              type="submit"
              className="btn-ocean-primary w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#008F7A] to-[#14B8A6] hover:from-[#007F6E] hover:to-[#0D9488] font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Send className="h-3.5 w-3.5 text-white" />
              <span>Submit & Auto-Dispatch Ticket</span>
            </button>

            {justCreatedId && (
              <p className="text-xs font-mono text-emerald-400 text-center">
                ✓ Ticket {justCreatedId} created & classified by AI!
              </p>
            )}
          </form>
        </GlassCard>

        {/* Active Maintenance Tickets List */}
        <div className="xl:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <h3 className="font-display text-base font-bold text-white">
              Active Maintenance Queue ({filteredTickets.length})
            </h3>
            <div className="flex items-center gap-1.5">
              {['ALL', 'Open', 'In Progress', 'Resolved'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    statusFilter === st
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40'
                      : 'bg-white/[0.03] text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTickets.map((ticket) => (
              <MaintenanceTicket key={ticket.id} ticket={ticket} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
