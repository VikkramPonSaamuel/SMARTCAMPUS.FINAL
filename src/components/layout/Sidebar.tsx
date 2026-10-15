import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Box,
  School,
  Zap,
  ShieldAlert,
  Car,
  Wrench,
  BarChart3,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  Cpu,
  UtensilsCrossed,
} from 'lucide-react';

export interface NavItemConfig {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const MAIN_NAV_ITEMS: NavItemConfig[] = [
  { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Digital Twin', path: '/digital-twin', icon: Box, badge: '3D' },
  { label: 'Smart Classrooms', path: '/classrooms', icon: School },
  { label: 'Smart Canteen', path: '/canteen', icon: UtensilsCrossed, badge: 'QR' },
  { label: 'Energy', path: '/energy', icon: Zap },
  { label: 'Security', path: '/security', icon: ShieldAlert, badge: '02' },
  { label: 'Parking', path: '/parking', icon: Car },
  { label: 'Maintenance', path: '/maintenance', icon: Wrench },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'AI Assistant', path: '/ai-assistant', icon: Sparkles },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 84 : 264 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="hidden lg:flex flex-col shrink-0 h-[calc(100vh-24px)] sticky top-3 ml-3 my-3 rounded-2xl glass-panel z-40 select-none overflow-hidden"
    >
      {/* Top Brand Header */}
      <div className="relative flex items-center justify-between px-4 pt-5 pb-4 border-b border-teal-600/15">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#008F7A] to-[#14B8A6] text-white shadow-[0_6px_18px_rgba(0,143,122,0.3)] border border-white/70">
            <Cpu className="h-5 w-5 text-white" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#99F6E4] ring-2 ring-white animate-pulse" />
          </div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-base font-bold tracking-[0.12em] text-[#042f2e]">
                    CAMPUS<span className="text-[#008F7A]">OS</span>
                  </span>
                  <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-teal-500/15 text-[#007F6E] border border-teal-500/30">
                    v4.2
                  </span>
                </div>
                <p className="text-[10px] font-semibold tracking-[0.2em] text-[#467874] uppercase mt-0.5">
                  SMART CAMPUS OS
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-[#007F6E] border border-teal-500/20 transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Main Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {MAIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            (item.path === '/dashboard' && location.pathname === '/');

          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className="relative group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#008F7A] to-[#14B8A6] shadow-[0_8px_20px_-4px_rgba(0,143,122,0.38)] border border-white/50"
                />
              )}

              <div
                className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center transition-colors ${
                  isActive
                    ? '!text-white'
                    : 'text-[#336663] group-hover:text-[#007F6E]'
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
              </div>

              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.18 }}
                    className="relative z-10 flex flex-1 items-center justify-between whitespace-nowrap"
                  >
                    <span
                      className={
                        isActive
                          ? '!text-white font-semibold'
                          : 'text-[#1f5754] group-hover:text-[#042f2e]'
                      }
                    >
                      {item.label}
                    </span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-md ${
                          isActive
                            ? 'bg-white/25 !text-white border border-white/40'
                            : item.badge === '02'
                            ? 'bg-rose-500/15 text-rose-700 border border-rose-500/30'
                            : 'bg-teal-500/15 text-[#007F6E] border border-teal-500/30'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Settings & Admin Profile */}
      <div className="p-3 border-t border-teal-600/15 space-y-2">
        <NavLink
          to="/settings"
          title={collapsed ? 'Settings' : undefined}
          className={({ isActive }) =>
            `relative group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-gradient-to-r from-[#008F7A] to-[#14B8A6] !text-white shadow-md'
                : 'text-[#1f5754] hover:text-[#042f2e] hover:bg-teal-500/10'
            }`
          }
        >
          <Settings className="h-[18px] w-[18px] shrink-0 transition-colors" />
          {!collapsed && <span>Settings</span>}
        </NavLink>

        {/* Admin Profile Card */}
        <div
          className={`flex items-center gap-3 p-2.5 rounded-xl bg-white/70 border border-teal-600/15 shadow-xs ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <div className="relative h-9 w-9 shrink-0 rounded-xl bg-gradient-to-tr from-[#008F7A] to-[#2DD4BF] p-[1.5px]">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white font-display text-xs font-bold text-[#007F6E]">
              AD
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#042f2e] truncate">
                Admin Console
              </p>
              <p className="text-[11px] text-[#467874] truncate">
                Chief Campus Officer
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};
