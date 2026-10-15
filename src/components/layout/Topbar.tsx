import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  Navigation,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { StatusIndicator } from '../ui/StatusIndicator';

const PAGE_METADATA: Record<string, { title: string; breadcrumb: string }> = {
  '/dashboard': { title: 'Campus Command Overview', breadcrumb: 'CAMPUSOS / OVERVIEW' },
  '/digital-twin': { title: '3D Digital Twin Matrix', breadcrumb: 'CAMPUSOS / DIGITAL TWIN' },
  '/classrooms': { title: 'Smart Classrooms & Spaces', breadcrumb: 'CAMPUSOS / SMART CLASSROOMS' },
  '/canteen': { title: 'Smart Canteen • Classroom-to-Kitchen QR Ordering', breadcrumb: 'CAMPUSOS / SMART CANTEEN' },
  '/energy': { title: 'Energy Intelligence & Grid', breadcrumb: 'CAMPUSOS / ENERGY' },
  '/security': { title: 'Autonomous Security & Safety', breadcrumb: 'CAMPUSOS / SECURITY' },
  '/parking': { title: 'Smart Mobility & Parking', breadcrumb: 'CAMPUSOS / PARKING' },
  '/maintenance': { title: 'Predictive Maintenance Hub', breadcrumb: 'CAMPUSOS / MAINTENANCE' },
  '/analytics': { title: 'Deep Telemetry Analytics', breadcrumb: 'CAMPUSOS / ANALYTICS' },
  '/ai-assistant': { title: 'Campus AI Neural Assistant', breadcrumb: 'CAMPUSOS / AI ASSISTANT' },
  '/settings': { title: 'OS & Digital Twin Configuration', breadcrumb: 'CAMPUSOS / SETTINGS' },
};

export const Topbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    alerts,
    acknowledgeAlert,
    buildings,
    rooms,
    setSelectedBuildingId,
    setIsNavModalOpen,
    isNavigating,
    globalSearch,
    setGlobalSearch,
  } = useCampus();

  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const meta = PAGE_METADATA[location.pathname] || PAGE_METADATA['/dashboard'];
  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged);

  const searchResults = React.useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return [];
    const matchedBuildings = buildings
      .filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.code.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q)
      )
      .map((b) => ({
        id: b.id,
        title: `${b.code} — ${b.name}`,
        subtitle: `Occupancy ${b.occupancy}% • ${b.energyKw} kW • ${b.roomsAvailable} Rooms Free`,
        type: 'Building',
        onSelect: () => {
          setSelectedBuildingId(b.id);
          navigate('/digital-twin');
          setGlobalSearch('');
          setSearchFocused(false);
        },
      }));

    const matchedRooms = rooms
      .filter(
        (r) =>
          r.code.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.buildingName.toLowerCase().includes(q)
      )
      .map((r) => ({
        id: r.id,
        title: `${r.code} — ${r.name}`,
        subtitle: `${r.status} • Cap ${r.capacity} • ${r.temperature}°C`,
        type: 'Classroom',
        onSelect: () => {
          navigate('/classrooms');
          setGlobalSearch('');
          setSearchFocused(false);
        },
      }));

    return [...matchedBuildings, ...matchedRooms].slice(0, 6);
  }, [globalSearch, buildings, rooms, navigate, setSelectedBuildingId, setGlobalSearch]);

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <header className="sticky top-3 z-30 mx-3 lg:mx-4 mt-3 rounded-2xl glass-panel px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      {/* Left: Page Title & Small Breadcrumb */}
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-[#008F7A]">
          <span>{meta.breadcrumb}</span>
        </div>
        <h1 className="font-display text-base sm:text-lg font-bold text-[#042f2e] truncate mt-0.5">
          {meta.title}
        </h1>
      </div>

      {/* Center / Right: Global Search & Navigate Campus Button */}
      <div className="flex items-center gap-2.5 sm:gap-3 flex-1 max-w-xl justify-end">
        {/* Global Search */}
        <div className="relative hidden md:block flex-1 max-w-xs lg:max-w-sm">
          <div
            className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/80 border transition-all ${
              searchFocused
                ? 'border-[#008F7A] shadow-[0_0_16px_rgba(0,143,122,0.2)]'
                : 'border-teal-600/20 hover:border-teal-600/35'
            }`}
          >
            <Search className="h-4 w-4 text-[#008F7A] shrink-0" />
            <input
              type="text"
              value={globalSearch}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search blocks, Room B204, sensors..."
              className="w-full bg-transparent text-xs text-[#042f2e] placeholder-[#467874] focus:outline-none"
            />
            {globalSearch ? (
              <button
                onClick={() => setGlobalSearch('')}
                className="text-[#467874] hover:text-[#042f2e]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <kbd className="hidden xl:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-500/10 text-[#007F6E] border border-teal-500/20">
                ⌘K
              </kbd>
            )}
          </div>

          {/* Search Dropdown */}
          <AnimatePresence>
            {searchFocused && globalSearch.trim().length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute left-0 right-0 mt-2 rounded-2xl bg-white/95 backdrop-blur-2xl border border-teal-500/30 shadow-2xl p-2 z-50"
              >
                {searchResults.length === 0 ? (
                  <p className="text-xs text-[#467874] px-3 py-3 text-center">
                    No matching campus entities for "{globalSearch}"
                  </p>
                ) : (
                  <div className="space-y-1">
                    {searchResults.map((res) => (
                      <button
                        key={res.id}
                        onMouseDown={res.onSelect}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-teal-500/12 text-left transition-colors group"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#042f2e] group-hover:text-[#007F6E] truncate">
                            {res.title}
                          </p>
                          <p className="text-[11px] text-[#467874] truncate">
                            {res.subtitle}
                          </p>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/15 text-[#007F6E] shrink-0 ml-2">
                          {res.type}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Return to Landing Page */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/75 hover:bg-teal-500/15 text-[#042f2e] border border-teal-600/20 hover:border-teal-600/40 transition-all"
          title="View Cinematic Landing Page"
        >
          <span>Landing Page</span>
        </motion.button>

        {/* Navigate Campus Quick Action */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsNavModalOpen(true)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
            isNavigating
              ? 'btn-ocean-primary bg-gradient-to-r from-[#008F7A] to-[#14B8A6] border-white/50 shadow-md'
              : 'bg-white/75 hover:bg-teal-500/15 text-[#042f2e] border-teal-600/20 hover:border-teal-600/40'
          }`}
        >
          <Navigation className={`h-3.5 w-3.5 ${isNavigating ? 'text-white' : 'text-[#008F7A]'}`} />
          <span className="hidden sm:inline">Navigate Campus</span>
        </motion.button>

        {/* Campus Status Indicator */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/12 border border-emerald-600/25">
          <StatusIndicator status="normal" size="sm" />
          <span className="text-[11px] font-mono font-semibold tracking-wider text-emerald-800">
            ALL SYSTEMS OPERATIONAL
          </span>
        </div>

        {/* Current Date / Time */}
        <div className="hidden 2xl:flex flex-col items-end px-2 text-right">
          <span className="text-xs font-mono font-bold text-[#042f2e]">
            {formattedTime}
          </span>
          <span className="text-[10px] font-mono text-[#467874]">
            {formattedDate}
          </span>
        </div>

        {/* Notification Button & Popover */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/75 hover:bg-white border border-teal-600/20 text-[#042f2e] transition-colors shadow-xs"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4 text-[#008F7A]" />
            {unacknowledgedAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold !text-white shadow">
                {unacknowledgedAlerts.length}
              </span>
            )}
          </motion.button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.97 }}
                className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white/95 backdrop-blur-2xl border border-teal-500/25 shadow-2xl p-4 z-50"
              >
                <div className="flex items-center justify-between pb-3 border-b border-teal-500/15">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#042f2e]">
                      Smart Telemetry Alerts
                    </h4>
                    <p className="text-[11px] text-[#467874]">
                      Real-time AI anomaly stream
                    </p>
                  </div>
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="text-[#467874] hover:text-[#042f2e]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 max-h-80 overflow-y-auto space-y-2.5 pr-1">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-xl border transition-all ${
                        alert.acknowledged
                          ? 'bg-teal-50/40 border-teal-500/10 opacity-60'
                          : alert.severity === 'critical'
                          ? 'bg-rose-50/80 border-rose-300'
                          : 'bg-amber-50/80 border-amber-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <AlertTriangle
                            className={`h-3.5 w-3.5 shrink-0 ${
                              alert.severity === 'critical'
                                ? 'text-rose-600'
                                : 'text-amber-600'
                            }`}
                          />
                          <span className="text-xs font-semibold text-[#042f2e]">
                            {alert.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-[#008F7A] shrink-0">
                          {alert.aiConfidence}% AI
                        </span>
                      </div>
                      <p className="text-[11px] text-[#1f5754] mt-1">
                        {alert.location} — {alert.metric}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] text-[#467874]">
                          {alert.timestamp}
                        </span>
                        {!alert.acknowledged ? (
                          <button
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#008F7A] hover:text-[#042f2e]"
                          >
                            <CheckCircle2 className="h-3 w-3" /> Acknowledge
                          </button>
                        ) : (
                          <span className="text-[10px] font-semibold text-emerald-700">
                            Acknowledged
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick AI Assistant Button */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => navigate('/ai-assistant')}
          title="Campus AI Assistant"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#008F7A]/15 to-[#2DD4BF]/25 border border-teal-500/30 text-[#007F6E] hover:border-teal-600/50 transition-all"
        >
          <Sparkles className="h-4 w-4" />
        </motion.button>

        {/* Profile Avatar */}
        <button
          onClick={() => navigate('/settings')}
          className="btn-ocean-primary relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#008F7A] to-[#14B8A6] border border-white/70 font-display text-xs font-bold shadow-sm hover:opacity-95 transition-all"
          title="Admin Profile & OS Settings"
        >
          <span>AD</span>
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
};
