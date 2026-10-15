import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Sparkles,
  DoorOpen,
  Zap,
  ShieldAlert,
  Wrench,
  Car,
  Navigation,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FeatureScroller: React.FC = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [acEcoApplied, setAcEcoApplied] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.innerWidth >= 1024;
    if (prefersReduced || !isDesktop) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;

      const getScrollAmount = () => {
        return -(track.scrollWidth - section.clientWidth + 96);
      };

      gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.max(1200, track.scrollWidth - section.clientWidth)}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="sec-features"
      ref={sectionRef}
      className="relative w-full min-h-screen rounded-[32px] overflow-hidden bg-[#060A17] text-white border border-white/12 py-14 sm:py-20 px-6 sm:px-12 lg:px-16 flex flex-col justify-between shadow-2xl"
    >
      {/* Background Blur Orbs */}
      <div className="pointer-events-none absolute top-10 left-1/4 w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-10 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[140px]" />

      {/* Sticky Top Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8">
        <div>
          <span className="inline-block text-xs font-mono font-bold uppercase tracking-[0.24em] text-cyan-300">
            03 — PLATFORM CAPABILITIES
          </span>
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mt-3 leading-[1.05]">
            Everything your campus needs.
            <span className="block text-violet-300">
              In one intelligent platform.
            </span>
          </h2>
        </div>
        <p className="text-xs font-mono uppercase tracking-widest text-slate-400">
          SCROLL TO GLIDE THROUGH 07 INTELLIGENT MODULES →
        </p>
      </div>

      {/* Horizontal Track (Pinned GSAP on Desktop, Touch Swipe on Mobile) */}
      <div className="relative z-10 overflow-x-auto lg:overflow-visible pb-4 -mx-2 px-2">
        <div
          ref={trackRef}
          className="flex items-stretch gap-6 lg:gap-8 w-max"
        >
          {/* CARD 01: AI CAMPUS ASSISTANT */}
          <div className="w-[340px] sm:w-[410px] shrink-0 rounded-[30px] bg-white/[0.05] backdrop-blur-2xl border border-white/15 p-7 flex flex-col justify-between hover:-translate-y-2 hover:border-violet-400/50 transition-all duration-300 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-400">01</span>
                <span className="px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/35 text-[10px] font-mono font-bold text-violet-200">
                  AI + RAG
                </span>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-300">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    AI CAMPUS ASSISTANT
                  </h3>
                  <p className="text-xs text-slate-400">Ask your campus anything.</p>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                {[
                  '"When is my next lab?"',
                  '"Where is the library?"',
                  '"Which classrooms are available?"',
                  '"What events are happening today?"',
                ].map((q) => (
                  <div
                    key={q}
                    onClick={() => navigate('/ai-assistant')}
                    className="cursor-pointer rounded-2xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 px-4 py-2.5 text-xs text-slate-200 flex items-center justify-between transition-colors"
                  >
                    <span>{q}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-violet-300" />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate('/ai-assistant')}
              className="mt-6 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              Open AI Assistant →
            </button>
          </div>

          {/* CARD 02: SMART CLASSROOMS */}
          <div className="w-[340px] sm:w-[410px] shrink-0 rounded-[30px] bg-white/[0.05] backdrop-blur-2xl border border-white/15 p-7 flex flex-col justify-between hover:-translate-y-2 hover:border-cyan-400/50 transition-all duration-300 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-400">02</span>
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/35 text-[10px] font-mono font-bold text-cyan-200">
                  IoT + AI
                </span>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300">
                  <DoorOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    SMART CLASSROOMS
                  </h3>
                  <p className="text-xs text-slate-400">
                    Know what is happening in every room.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-[#0B1124] border border-white/10 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-300">
                    ROOM C-204
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Occupancy: <strong className="text-white">0%</strong>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="rounded-xl bg-white/[0.04] p-2.5 border border-white/10">
                    <span className="text-slate-400 block text-[10px]">AC</span>
                    <span className={acEcoApplied ? 'text-emerald-400 font-bold' : 'text-amber-300 font-bold'}>
                      {acEcoApplied ? 'OFF (SAVING)' : 'ON'}
                    </span>
                  </div>
                  <div className="rounded-xl bg-white/[0.04] p-2.5 border border-white/10">
                    <span className="text-slate-400 block text-[10px]">Lights</span>
                    <span className={acEcoApplied ? 'text-emerald-400 font-bold' : 'text-amber-300 font-bold'}>
                      {acEcoApplied ? 'OFF' : 'ON'}
                    </span>
                  </div>
                </div>
                <div className="rounded-xl bg-amber-500/10 border border-amber-400/25 p-3 text-[11px] text-amber-200 leading-relaxed">
                  <strong className="block text-amber-300 font-mono text-[10px] uppercase mb-0.5">
                    AI Recommendation
                  </strong>
                  “No occupancy detected for 20 minutes. Switch off AC and lighting.”
                </div>
              </div>
            </div>

            <button
              onClick={() => setAcEcoApplied(!acEcoApplied)}
              className="mt-6 w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 text-xs font-bold text-cyan-200 transition-colors cursor-pointer"
            >
              {acEcoApplied ? '✓ Eco Automation Applied' : 'Apply AI Recommendation'}
            </button>
          </div>

          {/* CARD 03: SMART ENERGY */}
          <div className="w-[340px] sm:w-[410px] shrink-0 rounded-[30px] bg-white/[0.05] backdrop-blur-2xl border border-white/15 p-7 flex flex-col justify-between hover:-translate-y-2 hover:border-emerald-400/50 transition-all duration-300 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-400">03</span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/35 text-[10px] font-mono font-bold text-emerald-200">
                  Predictive Analytics
                </span>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    SMART ENERGY
                  </h3>
                  <p className="text-xs text-slate-400">
                    Reduce waste before it happens.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-[#0B1124] border border-white/10 p-4 space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400">Today&apos;s consumption</span>
                  <span className="font-display text-lg font-bold text-white">
                    18,420 kWh
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400">Predicted</span>
                  <span className="font-display text-lg font-bold text-cyan-300">
                    16,980 kWh
                  </span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                  <span className="text-xs text-slate-400">Potential saving</span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                    7.8%
                  </span>
                </div>
                {/* Mini Animated Bar Visual */}
                <div className="pt-2 flex items-end gap-2 h-14">
                  {[55, 72, 64, 88, 70, 52, 46].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className="flex-1 rounded-t-md bg-gradient-to-t from-emerald-500/40 to-cyan-400/80"
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/energy')}
              className="mt-6 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              Inspect Energy Grid →
            </button>
          </div>

          {/* CARD 04: SAFETY INTELLIGENCE */}
          <div className="w-[340px] sm:w-[410px] shrink-0 rounded-[30px] bg-white/[0.05] backdrop-blur-2xl border border-white/15 p-7 flex flex-col justify-between hover:-translate-y-2 hover:border-rose-400/50 transition-all duration-300 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-400">04</span>
                <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/35 text-[10px] font-mono font-bold text-rose-200">
                  94% Confidence
                </span>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-300">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    SAFETY INTELLIGENCE
                  </h3>
                  <p className="text-xs text-slate-400">
                    Respond before situations escalate.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-rose-950/35 border border-rose-500/30 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-rose-300">
                    INCIDENT #1042
                  </span>
                  <span className="text-[10px] font-mono text-rose-200">
                    Block B — Floor 2
                  </span>
                </div>
                <p className="text-sm font-bold text-white">
                  Possible fire detected
                </p>
                <div className="pt-2 space-y-1.5 text-xs text-slate-200">
                  {[
                    'Alert security',
                    'Notify nearby users',
                    'Activate evacuation route',
                  ].map((act) => (
                    <div key={act} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/security')}
              className="mt-6 w-full py-2.5 rounded-xl bg-rose-500/25 hover:bg-rose-500/35 border border-rose-400/30 text-xs font-bold text-rose-200 transition-colors cursor-pointer"
            >
              Open Security Command →
            </button>
          </div>

          {/* CARD 05: SMART MAINTENANCE */}
          <div className="w-[340px] sm:w-[410px] shrink-0 rounded-[30px] bg-white/[0.05] backdrop-blur-2xl border border-white/15 p-7 flex flex-col justify-between hover:-translate-y-2 hover:border-amber-400/50 transition-all duration-300 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-400">05</span>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/35 text-[10px] font-mono font-bold text-amber-200">
                  NLP Triage
                </span>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-300">
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    SMART MAINTENANCE
                  </h3>
                  <p className="text-xs text-slate-400">
                    Turn complaints into intelligent workflows.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-3.5 text-xs text-slate-200">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    User Report
                  </span>
                  “The projector in Room 305 isn&apos;t working.”
                </div>

                <div className="rounded-2xl bg-[#0B1124] border border-cyan-400/25 p-3.5 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">
                      Category
                    </span>
                    <span className="font-bold text-cyan-300">IT Equipment</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">
                      Priority
                    </span>
                    <span className="font-bold text-amber-300">Medium</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">
                      Assigned
                    </span>
                    <span className="font-bold text-emerald-300">IT Support</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/maintenance')}
              className="mt-6 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              Launch Maintenance Hub →
            </button>
          </div>

          {/* CARD 06: SMART PARKING */}
          <div className="w-[340px] sm:w-[410px] shrink-0 rounded-[30px] bg-white/[0.05] backdrop-blur-2xl border border-white/15 p-7 flex flex-col justify-between hover:-translate-y-2 hover:border-cyan-400/50 transition-all duration-300 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-400">06</span>
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/35 text-[10px] font-mono font-bold text-cyan-200">
                  Live Vision Sensors
                </span>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300">
                  <Car className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    SMART PARKING
                  </h3>
                  <p className="text-xs text-slate-400">
                    Know where space is available.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="rounded-2xl bg-[#0B1124] border border-white/10 p-4">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-white">PARKING A</span>
                    <span className="text-amber-300 font-mono">80% occupied</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-[80%] rounded-full bg-amber-400" />
                  </div>
                  <p className="text-[11px] font-mono text-slate-400 mt-1.5">
                    23 spaces available
                  </p>
                </div>

                <div className="rounded-2xl bg-[#0B1124] border border-white/10 p-4">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-white">PARKING B</span>
                    <span className="text-emerald-300 font-mono">60% occupied</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-[60%] rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-[11px] font-mono text-slate-400 mt-1.5">
                    47 spaces available
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/parking')}
              className="mt-6 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              View Parking Matrix →
            </button>
          </div>

          {/* CARD 07: SMART NAVIGATION */}
          <div className="w-[340px] sm:w-[410px] shrink-0 rounded-[30px] bg-white/[0.05] backdrop-blur-2xl border border-white/15 p-7 flex flex-col justify-between hover:-translate-y-2 hover:border-violet-400/50 transition-all duration-300 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-400">07</span>
                <span className="px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/35 text-[10px] font-mono font-bold text-violet-200">
                  3D Wayfinding
                </span>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-300">
                  <Navigation className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    SMART NAVIGATION
                  </h3>
                  <p className="text-xs text-slate-400">
                    Find your destination intelligently.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-2">
                {[
                  'Building navigation',
                  'Room navigation',
                  'Accessible routes',
                  'Crowd-aware routing',
                  'Emergency routes',
                ].map((feat) => (
                  <div
                    key={feat}
                    className="flex items-center gap-2.5 rounded-xl bg-[#0B1124] border border-white/10 px-3.5 py-2 text-xs text-slate-200"
                  >
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate('/digital-twin')}
              className="mt-6 w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-xs font-bold text-white transition-all cursor-pointer"
            >
              Launch 3D Wayfinding →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
