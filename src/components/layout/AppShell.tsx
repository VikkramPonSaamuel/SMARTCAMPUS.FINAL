import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Box,
  School,
  Zap,
  ShieldAlert,
  Sparkles,
  Menu,
  X,
  Settings,
} from 'lucide-react';
import { Sidebar, MAIN_NAV_ITEMS } from './Sidebar';
import { Topbar } from './Topbar';
import { NavigationModal } from './NavigationModal';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const bottomNavItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: '3D Twin', path: '/digital-twin', icon: Box },
    { label: 'Rooms', path: '/classrooms', icon: School },
    { label: 'Energy', path: '/energy', icon: Zap },
    { label: 'Security', path: '/security', icon: ShieldAlert },
  ];

  return (
    <div className="dashboard-theme min-h-screen text-[#042f2e] flex flex-col lg:flex-row relative architectural-grid">
      {/* Ambient Coastal Aqua, Seafoam & Pearl Wave Blooms (Inspired by Image 2) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-48 -left-20 w-[720px] h-[520px] rounded-full bg-[#009688]/25 blur-[135px]" />
        <div className="absolute -top-24 right-0 w-[640px] h-[480px] rounded-full bg-[#14B8A6]/22 blur-[130px]" />
        <div className="absolute top-1/3 left-1/4 w-[680px] h-[520px] rounded-full bg-[#99F6E4]/45 blur-[140px]" />
        <div className="absolute bottom-0 inset-x-0 h-[380px] bg-gradient-to-t from-[#FFFFFF]/90 via-[#F2FBF9]/60 to-transparent" />
      </div>

      {/* Desktop Left Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 pb-24 lg:pb-6">
        <Topbar />
        <main className="flex-1 px-3 sm:px-4 lg:px-5 pt-4">{children}</main>
      </div>

      {/* Mobile Floating AI Orb Button */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => navigate('/ai-assistant')}
        className="btn-ocean-primary lg:hidden fixed right-4 bottom-20 z-40 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#008F7A] to-[#14B8A6] shadow-[0_8px_24px_rgba(0,143,122,0.4)] border border-white/60"
        aria-label="Open Campus AI"
      >
        <Sparkles className="h-5 w-5 text-white" />
      </motion.button>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 mx-2 mb-2 rounded-2xl glass-panel px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-semibold transition-all ${
                isActive
                  ? 'text-[#007F6E] bg-teal-500/15 border border-teal-500/30'
                  : 'text-[#467874] hover:text-[#042f2e]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-semibold text-[#467874] hover:text-[#042f2e]"
        >
          <Menu className="h-4 w-4" />
          <span>More</span>
        </button>
      </nav>

      {/* Mobile Full Navigation Drawer */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-teal-950/30 backdrop-blur-md flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.25 }}
              className="w-72 h-full bg-[#F2FBF9] border-l border-teal-500/20 p-5 flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-teal-500/15">
                  <div>
                    <span className="font-display text-base font-bold tracking-wider text-[#042f2e]">
                      CAMPUS<span className="text-[#008F7A]">OS</span>
                    </span>
                    <p className="text-[10px] font-mono text-[#467874]">
                      SMART CAMPUS OS
                    </p>
                  </div>
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1.5 rounded-lg bg-teal-500/10 text-[#007F6E]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 space-y-1">
                  {MAIN_NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                            isActive
                              ? 'bg-teal-500/15 text-[#007F6E] border border-teal-500/30'
                              : 'text-[#1f5754] hover:bg-teal-500/10'
                          }`
                        }
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>

              <NavLink
                to="/settings"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#1f5754] hover:bg-teal-500/10 border border-teal-500/20"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </NavLink>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global 3D Campus Navigation Modal */}
      <NavigationModal />
    </div>
  );
};
