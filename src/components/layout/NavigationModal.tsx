import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Navigation,
  MapPin,
  Footprints,
  Ruler,
  Users,
  Accessibility,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { NAVIGATION_NODES } from '../../data/campusData';

export const NavigationModal: React.FC = () => {
  const {
    isNavModalOpen,
    setIsNavModalOpen,
    isNavigating,
    setIsNavigating,
    navFrom,
    setNavFrom,
    navTo,
    setNavTo,
    activeRoute,
  } = useCampus();

  const navigate = useNavigate();
  const location = useLocation();

  const handleStartNavigation = () => {
    setIsNavigating(true);
    setIsNavModalOpen(false);
    if (location.pathname !== '/dashboard' && location.pathname !== '/digital-twin') {
      navigate('/digital-twin');
    }
  };

  return (
    <AnimatePresence>
      {isNavModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-950/35 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg rounded-2xl bg-white/95 backdrop-blur-2xl border border-teal-500/35 shadow-[0_24px_60px_-10px_rgba(0,143,122,0.28)] p-6 overflow-hidden relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-teal-500/15">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/15 border border-teal-500/30 text-[#008F7A]">
                  <Navigation className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-[#042f2e]">
                    3D Campus Wayfinding
                  </h3>
                  <p className="text-xs text-[#467874]">
                    Autonomous pedestrian & accessible pathfinder
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNavModalOpen(false)}
                className="p-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-[#007F6E]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Route Selectors */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#467874] mb-1.5">
                  FROM ORIGIN
                </label>
                <div className="relative">
                  <select
                    value={navFrom}
                    onChange={(e) => setNavFrom(e.target.value)}
                    className="w-full rounded-xl bg-[#EBF9F6] border border-teal-500/25 px-3.5 py-2.5 text-xs font-semibold text-[#042f2e] focus:border-[#008F7A] focus:outline-none"
                  >
                    {NAVIGATION_NODES.map((node) => (
                      <option key={node.id} value={node.id}>
                        {node.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#008F7A] mb-1.5">
                  TO DESTINATION
                </label>
                <div className="relative">
                  <select
                    value={navTo}
                    onChange={(e) => setNavTo(e.target.value)}
                    className="w-full rounded-xl bg-[#EBF9F6] border border-teal-500/40 px-3.5 py-2.5 text-xs font-semibold text-[#042f2e] focus:border-[#008F7A] focus:outline-none"
                  >
                    {NAVIGATION_NODES.map((node) => (
                      <option key={node.id} value={node.id}>
                        {node.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Computed Route Metrics Preview */}
            <div className="mt-5 rounded-xl bg-[#F2FBF9] border border-teal-500/20 p-4">
              <div className="flex items-center justify-between text-xs font-bold text-[#042f2e] pb-3 border-b border-teal-500/15">
                <span className="flex items-center gap-1.5 text-[#1f5754]">
                  <MapPin className="h-3.5 w-3.5 text-[#008F7A]" />
                  {activeRoute.fromName}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-[#008F7A] mx-2 shrink-0" />
                <span className="flex items-center gap-1.5 text-[#007F6E]">
                  <Sparkles className="h-3.5 w-3.5" />
                  {activeRoute.toName}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                <div className="p-2.5 rounded-lg bg-white border border-teal-500/15">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#467874]">
                    <Footprints className="h-3 w-3 text-[#008F7A]" />
                    Walking
                  </div>
                  <p className="font-display text-base font-bold text-[#042f2e] mt-1">
                    {activeRoute.walkingMinutes} min
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-teal-500/15">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#467874]">
                    <Ruler className="h-3 w-3 text-[#008F7A]" />
                    Distance
                  </div>
                  <p className="font-display text-base font-bold text-[#042f2e] mt-1">
                    {activeRoute.distanceMeters} m
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-teal-500/15">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#467874]">
                    <Users className="h-3 w-3 text-emerald-600" />
                    Crowd level
                  </div>
                  <p className="font-display text-base font-bold text-emerald-700 mt-1">
                    {activeRoute.crowdLevel}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-teal-500/15">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#467874]">
                    <Accessibility className="h-3 w-3 text-[#008F7A]" />
                    Accessibility
                  </div>
                  <p className="font-display text-sm font-bold text-[#007F6E] mt-1">
                    {activeRoute.accessibility}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex items-center justify-end gap-3">
              {isNavigating && (
                <button
                  onClick={() => {
                    setIsNavigating(false);
                    setIsNavModalOpen(false);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-500/12 hover:bg-rose-500/20 text-rose-700 border border-rose-500/30 text-xs font-semibold transition-all"
                >
                  Clear Active Route
                </button>
              )}
              <button
                onClick={handleStartNavigation}
                className="btn-ocean-primary flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#008F7A] to-[#14B8A6] hover:from-[#007F6E] hover:to-[#0D9488] font-bold text-xs shadow-lg transition-all"
              >
                <Navigation className="h-3.5 w-3.5 text-white" />
                <span>Illuminate 3D Route</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
