import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar, ScrollProgress, LANDING_SECTIONS } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { ProblemSection, SolutionSection } from '../components/landing/ProblemAndSolution';
import { FeatureScroller } from '../components/landing/FeatureScroller';
import { SmartCanteenModule } from '../components/canteen/SmartCanteenModule';
import { DigitalTwin, CommandCenter } from '../components/landing/DigitalTwinAndCommand';
import { AIAssistant, SafetySection, MaintenanceSection } from '../components/landing/AIAndOperations';
import {
  ImpactSection,
  HowItWorks,
  Technology,
  UseCases,
  FutureVision,
  FinalCTA,
  Footer,
} from '../components/landing/ImpactAndArchitecture';

export const LandingPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);

  // Minimal < 1.2s Loading Experience
  useEffect(() => {
    const start = performance.now();
    const duration = 900; // under 1.2s

    let rafId: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setLoadProgress(pct);
      if (elapsed < duration) {
        rafId = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setIsLoading(false), 100);
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Track active section and overall scroll progress for the 01-10 vertical indicator
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      setOverallProgress(progress);

      const viewportMid = scrollTop + window.innerHeight * 0.42;
      let currentIdx = 0;

      LANDING_SECTIONS.forEach((sec, index) => {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const elTop = rect.top + window.scrollY;
          if (viewportMid >= elTop) {
            currentIdx = index;
          }
        }
      });

      setActiveIndex(currentIdx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="dashboard-theme min-h-screen text-[#042f2e] selection:bg-teal-500/25 selection:text-[#042f2e] overflow-x-hidden">
      {/* INITIALIZING CAMPUS INTELLIGENCE LOADER (< 1.2s) IN IMAGE 2 SEAFOAM PALETTE */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="campusos-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
            className="fixed inset-0 z-[100] bg-[#E2F5F1] flex flex-col items-center justify-center px-6"
          >
            <div className="relative flex flex-col items-center max-w-md w-full">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#008F7A] to-[#14B8A6] border border-white/80 mb-6 shadow-[0_12px_32px_rgba(0,143,122,0.3)]">
                <span className="h-3 w-3 rounded-full bg-white animate-ping" />
              </div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.26em] text-[#007F6E] mb-3 text-center">
                INITIALIZING CAMPUS INTELLIGENCE...
              </p>
              <div className="w-64 h-1.5 rounded-full bg-teal-600/15 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#008F7A] via-[#14B8A6] to-[#2DD4BF]"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>
              <span className="mt-2.5 font-mono text-[10px] font-semibold text-[#467874] tracking-widest">
                {loadProgress}% • DIGITAL TWIN & SMART CANTEEN READY
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING GLASS NAVBAR & SCROLL PROGRESS INDICATOR */}
      <Navbar />
      <ScrollProgress activeIndex={activeIndex} overallProgress={overallProgress} />

      {/* FLOATING CONTAINER SYSTEM (16px-24px outer frame with 32px rounded stages) */}
      <main className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        {/* SECTION 01: CINEMATIC HERO */}
        <Hero />

        {/* SECTION 02: THE PROBLEM (EDITORIAL STORYTELLING) */}
        <div className="rounded-[28px] sm:rounded-[32px] overflow-hidden border border-teal-600/20 shadow-[0_20px_60px_rgba(4,47,46,0.08)]">
          <ProblemSection />
        </div>

        {/* SECTION 03: THE SOLUTION — MEET CAMPUSOS */}
        <div className="rounded-[28px] sm:rounded-[32px] overflow-hidden border border-teal-600/20 shadow-[0_20px_60px_rgba(4,47,46,0.08)]">
          <SolutionSection />
        </div>

        {/* SECTION 04: HORIZONTAL FEATURE SCROLLER (PINNED SCROLLTRIGGER) */}
        <div className="rounded-[28px] sm:rounded-[32px] overflow-hidden border border-teal-600/20 shadow-[0_20px_60px_rgba(4,47,46,0.08)]">
          <FeatureScroller />
        </div>

        {/* SECTION 05: SMART CANTEEN MODULE (STUDENT CLASSROOM ORDER -> OWNER QUOTE -> QR PAYMENT) */}
        <section
          id="sec-canteen"
          className="rounded-[28px] sm:rounded-[32px] overflow-hidden border border-teal-600/25 glass-panel p-5 sm:p-8 lg:p-10 shadow-[0_20px_60px_rgba(4,47,46,0.09)]"
        >
          <SmartCanteenModule embedded />
        </section>

        {/* SECTION 06: INTERACTIVE 3D DIGITAL TWIN */}
        <div className="rounded-[28px] sm:rounded-[32px] overflow-hidden border border-teal-600/20 shadow-[0_20px_60px_rgba(4,47,46,0.08)]">
          <DigitalTwin />
        </div>

        {/* SECTION 07: LIVE COMMAND CENTER PREVIEW */}
        <div className="rounded-[28px] sm:rounded-[32px] overflow-hidden border border-teal-600/20 shadow-[0_20px_60px_rgba(4,47,46,0.08)]">
          <CommandCenter />
        </div>

        {/* SECTION 08: AI ASSISTANT DEMO */}
        <div className="rounded-[28px] sm:rounded-[32px] overflow-hidden border border-teal-600/20 shadow-[0_20px_60px_rgba(4,47,46,0.08)]">
          <AIAssistant />
        </div>

        {/* SECTION 09: EMERGENCY & SAFETY SIMULATION */}
        <div className="rounded-[28px] sm:rounded-[32px] overflow-hidden border border-teal-600/20 shadow-[0_20px_60px_rgba(4,47,46,0.08)]">
          <SafetySection />
        </div>

        {/* SECTION 10: SMART MAINTENANCE WORKFLOW */}
        <div className="rounded-[28px] sm:rounded-[32px] overflow-hidden border border-teal-600/20 shadow-[0_20px_60px_rgba(4,47,46,0.08)]">
          <MaintenanceSection />
        </div>

        {/* SECTION 11: IMPACT NUMBERS (ANIMATED COUNTERS) */}
        <div className="rounded-[28px] sm:rounded-[32px] overflow-hidden border border-teal-600/20 shadow-[0_20px_60px_rgba(4,47,46,0.08)]">
          <ImpactSection />
        </div>

        {/* SECTION 12: HOW IT WORKS (3-STEP ARCHITECTURE) */}
        <div className="rounded-[28px] sm:rounded-[32px] overflow-hidden border border-teal-600/20 shadow-[0_20px_60px_rgba(4,47,46,0.08)]">
          <HowItWorks />
        </div>

        {/* SECTION 13: TECHNOLOGY STACK SHOWCASE */}
        <div className="rounded-[28px] sm:rounded-[32px] overflow-hidden border border-teal-600/20 shadow-[0_20px_60px_rgba(4,47,46,0.08)]">
          <Technology />
        </div>

        {/* SECTIONS 14 & 15: CAMPUS USE CASES & EXPERIENCE CARDS */}
        <div className="rounded-[28px] sm:rounded-[32px] overflow-hidden border border-teal-600/20 shadow-[0_20px_60px_rgba(4,47,46,0.08)]">
          <UseCases />
        </div>

        {/* SECTION 16: FUTURE VISION SECTION */}
        <div className="rounded-[28px] sm:rounded-[32px] overflow-hidden border border-teal-600/20 shadow-[0_20px_60px_rgba(4,47,46,0.08)]">
          <FutureVision />
        </div>

        {/* SECTION 17: FINAL CTA + FOOTER */}
        <div className="rounded-[28px] sm:rounded-[32px] overflow-hidden border border-teal-600/20 shadow-[0_20px_60px_rgba(4,47,46,0.08)]">
          <FinalCTA />
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
