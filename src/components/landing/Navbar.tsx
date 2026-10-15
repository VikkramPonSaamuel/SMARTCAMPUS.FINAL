import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Menu, X, Network, UtensilsCrossed } from 'lucide-react';

export interface ScrollSectionItem {
  id: string;
  num: string;
  label: string;
}

export const LANDING_SECTIONS: ScrollSectionItem[] = [
  { id: 'sec-hero', num: '01', label: 'Overview' },
  { id: 'sec-problem', num: '02', label: 'Challenge' },
  { id: 'sec-solution', num: '03', label: 'Ecosystem' },
  { id: 'sec-features', num: '04', label: 'Platform' },
  { id: 'sec-canteen', num: '05', label: 'Smart Canteen' },
  { id: 'sec-twin', num: '06', label: 'Digital Twin' },
  { id: 'sec-command', num: '07', label: 'Command' },
  { id: 'sec-ai', num: '08', label: 'Intelligence' },
  { id: 'sec-safety', num: '09', label: 'Safety' },
  { id: 'sec-impact', num: '10', label: 'Impact' },
];

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 36);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navLinks = [
    { label: 'Platform', target: 'sec-features' },
    { label: 'Solutions', target: 'sec-solution' },
    { label: 'Smart Canteen', target: 'sec-canteen', highlight: true },
    { label: 'Intelligence', target: 'sec-ai' },
    { label: 'Digital Twin', target: 'sec-twin' },
    { label: 'Impact', target: 'sec-impact' },
  ];

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="fixed top-4 inset-x-0 z-50 px-4 sm:px-8 pointer-events-none"
    >
      <div
        className={`pointer-events-auto mx-auto max-w-7xl rounded-full px-5 sm:px-7 py-3 transition-all duration-500 flex items-center justify-between border ${
          scrolled
            ? 'bg-white/90 backdrop-blur-[24px] border-teal-600/30 shadow-[0_16px_40px_rgba(4,47,46,0.12)]'
            : 'bg-white/80 backdrop-blur-[20px] border-teal-600/20 shadow-[0_10px_30px_rgba(4,47,46,0.08)]'
        }`}
      >
        {/* Left: Circular intelligent-campus/network icon + CAMPUSOS */}
        <button
          onClick={() => scrollToSection('sec-hero')}
          className="flex items-center gap-3 group text-left focus:outline-none cursor-pointer"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#008F7A] to-[#14B8A6] border border-white/80 shadow-[0_4px_14px_rgba(0,143,122,0.3)]">
            <Network className="h-4 w-4 !text-white group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#99F6E4] ring-2 ring-white" />
          </div>
          <span className="font-display text-sm sm:text-base font-bold tracking-[0.16em] text-[#042f2e]">
            CAMPUS<span className="text-[#008F7A]">OS</span>
          </span>
        </button>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((item) => (
            <button
              key={item.label}
              onClick={() => scrollToSection(item.target)}
              className={`text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                item.highlight
                  ? 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-500/15 text-[#007F6E] border border-teal-600/25 hover:bg-teal-500/25'
                  : 'text-[#1f5754] hover:text-[#008F7A]'
              }`}
            >
              {item.highlight && <UtensilsCrossed className="h-3 w-3 text-[#008F7A]" />}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Right CTA: Canteen Portal + Launch Dashboard -> */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            onClick={() => navigate('/canteen')}
            className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/12 hover:bg-teal-500/20 border border-teal-600/25 px-4 py-2 text-xs font-bold text-[#007F6E] transition-all cursor-pointer"
          >
            <UtensilsCrossed className="h-3.5 w-3.5" />
            <span>Canteen QR App</span>
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-ocean-primary group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#008F7A] to-[#14B8A6] px-5 py-2.5 text-xs font-bold !text-white shadow-[0_8px_22px_rgba(0,143,122,0.3)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="h-3.5 w-3.5 !text-white transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-full bg-teal-500/15 text-[#042f2e] border border-teal-600/25"
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Animated Mobile Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto md:hidden mt-2 mx-auto max-w-md rounded-3xl bg-white/95 backdrop-blur-2xl border border-teal-600/25 p-5 shadow-2xl space-y-3"
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.target)}
                  className="text-left px-4 py-2.5 rounded-2xl text-sm font-semibold text-[#042f2e] hover:bg-teal-500/15 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="pt-2 border-t border-teal-600/15 space-y-2">
              <button
                onClick={() => navigate('/canteen')}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-teal-500/15 border border-teal-600/25 py-2.5 text-xs font-bold text-[#007F6E]"
              >
                <UtensilsCrossed className="h-3.5 w-3.5" />
                <span>Open Smart Canteen Module</span>
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-ocean-primary w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#008F7A] to-[#14B8A6] py-3 text-xs font-bold !text-white"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5 !text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export const ScrollProgress: React.FC<{
  activeIndex: number;
  overallProgress: number;
}> = ({ activeIndex, overallProgress }) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const activeSection = LANDING_SECTIONS[activeIndex] || LANDING_SECTIONS[0];

  return (
    <>
      {/* Desktop Vertical Right-Side Scroll Progress Indicator */}
      <div className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-1.5 select-none">
        <div className="mb-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-teal-600/25 text-[10px] font-mono font-bold uppercase tracking-widest text-[#008F7A] shadow-md">
          {activeSection.num} • {activeSection.label}
        </div>

        <div className="relative flex items-center gap-3 bg-white/85 backdrop-blur-xl border border-teal-600/20 rounded-full py-3.5 px-2.5 shadow-xl">
          {/* Growing Vertical Progress Line */}
          <div className="w-[2px] h-52 bg-teal-600/15 rounded-full overflow-hidden relative">
            <div
              className="w-full bg-gradient-to-b from-[#008F7A] via-[#14B8A6] to-[#2DD4BF] rounded-full transition-all duration-200"
              style={{ height: `${Math.max(8, overallProgress * 100)}%` }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            {LANDING_SECTIONS.map((sec, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollTo(sec.id)}
                  title={sec.label}
                  className={`text-[10px] font-mono leading-none transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'text-[#008F7A] font-bold scale-110'
                      : 'text-[#467874] hover:text-[#042f2e]'
                  }`}
                >
                  {sec.num}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Progress Bar at Top */}
      <div className="xl:hidden fixed top-0 inset-x-0 z-50 h-1 bg-teal-100">
        <div
          className="h-full bg-gradient-to-r from-[#008F7A] via-[#14B8A6] to-[#2DD4BF] transition-all duration-150"
          style={{ width: `${Math.max(5, overallProgress * 100)}%` }}
        />
      </div>
    </>
  );
};
