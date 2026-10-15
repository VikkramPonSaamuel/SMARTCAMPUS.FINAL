import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  ArrowDown,
  Activity,
  Zap,
  ShieldAlert,
  DoorOpen,
  Sparkles,
  Wifi,
  Sun,
  UtensilsCrossed,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Initial Page Load Timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        bgRef.current,
        { opacity: 0, scale: 1.06 },
        { opacity: 1, scale: 1, duration: 1.4 }
      )
        .fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.9'
        )
        .fromTo(
          [line1Ref.current, line2Ref.current],
          { opacity: 0, y: 80 },
          { opacity: 1, y: 0, duration: 1.0, stagger: 0.16 },
          '-=0.6'
        )
        .fromTo(
          [subRef.current, taglineRef.current],
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.85, stagger: 0.12 },
          '-=0.65'
        )
        .fromTo(
          btnsRef.current,
          { opacity: 0, scale: 0.95, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.75 },
          '-=0.55'
        )
        .fromTo(
          cardsRef.current.filter(Boolean),
          { opacity: 0, scale: 0.8, y: 35 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.12 },
          '-=0.5'
        );

      // Scroll-Driven Parallax & Zoom on Hero
      gsap.to(bgRef.current, {
        scale: 1.08,
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to(contentRef.current, {
        y: -90,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Different parallax speeds for the 4 floating cards
      const speeds = [-55, -85, -45, -75];
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.to(card, {
          y: speeds[i],
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x: nx, y: ny });
  };

  const scrollToCanteen = () => {
    const el = document.getElementById('sec-canteen');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToTwin = () => {
    const el = document.getElementById('sec-twin');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToProblem = () => {
    const el = document.getElementById('sec-problem');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="sec-hero"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[94vh] w-full rounded-[32px] overflow-hidden border border-teal-600/25 glass-panel shadow-[0_24px_70px_rgba(4,47,46,0.1)] flex flex-col justify-between p-6 sm:p-12 lg:p-16 select-none isolate"
    >
      {/* Animated Futuristic University Campus Architectural Background (Image 2 Seafoam & Pearl Palette) */}
      <div
        ref={bgRef}
        style={{
          transform: `translate3d(${mouseOffset.x * -14}px, ${mouseOffset.y * -14}px, 0)`,
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="absolute inset-0 -z-10 pointer-events-none overflow-hidden architectural-grid"
      >
        {/* Atmospheric Seafoam, Aqua & Lagoon Glows */}
        <div className="absolute -top-32 left-1/4 w-[680px] h-[480px] rounded-full bg-[#14B8A6]/22 blur-[140px]" />
        <div className="absolute top-1/3 -right-24 w-[620px] h-[520px] rounded-full bg-[#008F7A]/18 blur-[140px]" />
        <div className="absolute -bottom-32 left-10 w-[700px] h-[420px] rounded-full bg-[#5EEAD4]/35 blur-[130px]" />

        {/* Architectural Perspective Grid & Glowing Pathways */}
        <svg
          className="w-full h-full opacity-75"
          viewBox="0 0 1440 900"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="campusGlow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#008F7A" stopOpacity="0.65" />
              <stop offset="50%" stopColor="#14B8A6" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#0D9488" stopOpacity="0.65" />
            </linearGradient>
            <linearGradient id="bldgGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#CCFBF1" stopOpacity="0.68" />
            </linearGradient>
            <radialGradient id="fogGrad" cx="50%" cy="65%" r="65%">
              <stop offset="0%" stopColor="#E6F8F5" stopOpacity="0" />
              <stop offset="100%" stopColor="#D5F5EE" stopOpacity="0.55" />
            </radialGradient>
          </defs>

          {/* Subtle Perspective Horizon Grid */}
          <g stroke="rgba(0,143,122,0.1)" strokeWidth="1">
            {Array.from({ length: 18 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={420 + i * 28} x2="1440" y2={420 + i * 28} />
            ))}
            {Array.from({ length: 24 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * 64} y1="420" x2={(i - 11) * 140 + 720} y2="900" />
            ))}
          </g>

          {/* Futuristic Campus Architectural Silhouettes & Solar Roofs */}
          {/* Left Research Complex */}
          <g>
            <rect
              x="90"
              y="340"
              width="180"
              height="240"
              rx="8"
              fill="url(#bldgGrad)"
              stroke="rgba(0,143,122,0.35)"
            />
            <line
              x1="105"
              y1="355"
              x2="255"
              y2="355"
              stroke="#008F7A"
              strokeWidth="2"
              strokeOpacity="0.6"
            />
            <rect x="115" y="328" width="130" height="8" rx="2" fill="#008F7A" fillOpacity="0.45" />
          </g>

          {/* Center-Left Smart Tower */}
          <g>
            <rect
              x="310"
              y="260"
              width="210"
              height="320"
              rx="10"
              fill="url(#bldgGrad)"
              stroke="rgba(13,148,136,0.35)"
            />
            {Array.from({ length: 6 }).map((_, r) => (
              <line
                key={r}
                x1="330"
                y1={295 + r * 42}
                x2="500"
                y2={295 + r * 42}
                stroke="rgba(0,143,122,0.18)"
                strokeWidth="6"
              />
            ))}
          </g>

          {/* Right Innovation Hub & Library Dome */}
          <g>
            <path
              d="M960 330 Q1065 250 1170 330 Z"
              fill="rgba(20,184,166,0.18)"
              stroke="rgba(0,143,122,0.4)"
            />
            <rect
              x="930"
              y="330"
              width="270"
              height="250"
              rx="10"
              fill="url(#bldgGrad)"
              stroke="rgba(0,143,122,0.32)"
            />
            <rect
              x="1230"
              y="370"
              width="140"
              height="210"
              rx="8"
              fill="url(#bldgGrad)"
              stroke="rgba(16,185,129,0.3)"
            />
          </g>

          {/* Glowing Campus Pathways & Autonomous EV / IoT Conduits */}
          <path
            d="M 120 690 C 420 620, 680 650, 1340 610"
            stroke="url(#campusGlow)"
            strokeWidth="3"
            strokeDasharray="8 6"
          />
          <path
            d="M 280 780 C 610 670, 880 640, 1220 730"
            stroke="rgba(0,143,122,0.4)"
            strokeWidth="2"
          />

          {/* Subtle IoT Signal Rings & Smart Streetlight Nodes */}
          {[
            { cx: 180, cy: 320, color: '#008F7A' },
            { cx: 415, cy: 245, color: '#0D9488' },
            { cx: 1065, cy: 275, color: '#008F7A' },
            { cx: 1295, cy: 355, color: '#10B981' },
            { cx: 640, cy: 645, color: '#14B8A6' },
          ].map((node, idx) => (
            <g key={idx}>
              <circle cx={node.cx} cy={node.cy} r="4.5" fill={node.color} />
              <circle
                cx={node.cx}
                cy={node.cy}
                r="16"
                stroke={node.color}
                strokeOpacity="0.45"
                strokeDasharray="3 3"
              />
              <circle cx={node.cx} cy={node.cy} r="28" stroke={node.color} strokeOpacity="0.2" />
            </g>
          ))}

          <rect width="1440" height="900" fill="url(#fogGrad)" />
        </svg>
      </div>

      {/* Top Spacer for Floating Navbar */}
      <div className="h-14" />

      {/* Center Hero Editorial Content + Floating Telemetry Cards */}
      <div className="relative z-10 my-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center py-8">
        {/* Left/Center 8 Columns: Editorial Typography */}
        <div ref={contentRef} className="lg:col-span-8 space-y-6">
          {/* Small Eyebrow */}
          <div
            ref={eyebrowRef}
            className="inline-flex items-center gap-2.5 rounded-full bg-white/85 border border-teal-600/25 backdrop-blur-xl px-4 py-1.5 shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#008F7A]" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.22em] text-[#007F6E]">
              THE INTELLIGENT CAMPUS OPERATING SYSTEM
            </span>
          </div>

          {/* Extremely Large Desktop Editorial Heading */}
          <h1 className="font-display text-5xl sm:text-7xl xl:text-[88px] font-extrabold tracking-tight leading-[0.96] text-[#042f2e]">
            <span ref={line1Ref} className="block">
              Your campus,
            </span>
            <span
              ref={line2Ref}
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(95deg, #042f2e 0%, #008F7A 48%, #14B8A6 100%)',
              }}
            >
              thinks ahead.
            </span>
          </h1>

          {/* Supporting Text */}
          <p
            ref={subRef}
            className="max-w-2xl text-base sm:text-xl text-[#1f5754] font-normal leading-relaxed"
          >
            CampusOS connects people, infrastructure, classrooms, and smart canteens
            into one real-time campus ecosystem.
          </p>

          {/* Small Line */}
          <p
            ref={taglineRef}
            className="text-xs sm:text-sm font-mono font-bold uppercase tracking-[0.24em] text-[#008F7A]"
          >
            Monitor. Predict. Automate. Improve.
          </p>

          {/* Primary & Secondary CTA Buttons */}
          <div ref={btnsRef} className="pt-2 flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-ocean-primary group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#008F7A] to-[#14B8A6] px-7 py-4 text-sm font-bold !text-white shadow-[0_12px_30px_rgba(0,143,122,0.32)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <span>Explore CampusOS</span>
              <ArrowRight className="h-4 w-4 !text-white transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <button
              onClick={scrollToCanteen}
              className="inline-flex items-center gap-2 rounded-full bg-white/90 hover:bg-white border border-teal-600/30 backdrop-blur-xl px-6 py-4 text-sm font-bold text-[#007F6E] shadow-sm transition-all duration-300 cursor-pointer"
            >
              <UtensilsCrossed className="h-4 w-4 text-[#008F7A]" />
              <span>Order from Classroom (Canteen QR)</span>
            </button>

            <button
              onClick={scrollToTwin}
              className="inline-flex items-center gap-2.5 rounded-full bg-white/75 hover:bg-white border border-teal-600/25 backdrop-blur-xl px-6 py-4 text-sm font-semibold text-[#042f2e] transition-all duration-300 cursor-pointer"
            >
              <span>View Digital Twin</span>
            </button>
          </div>
        </div>

        {/* Right 4 Columns: 4 Floating Real-Time Data Cards */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-4">
          {/* CARD 1: CAMPUS HEALTH */}
          <div
            ref={(el) => {
              cardsRef.current[0] = el;
            }}
            style={{
              transform: `translate3d(${mouseOffset.x * 6}px, ${mouseOffset.y * 6}px, 0)`,
            }}
            className="rounded-[26px] bg-white/90 backdrop-blur-2xl border border-teal-600/20 p-5 shadow-[0_16px_40px_rgba(4,47,46,0.08)] hover:border-[#008F7A] transition-colors"
          >
            <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-[#467874]">
              <span>CAMPUS HEALTH</span>
              <Activity className="h-3.5 w-3.5 text-[#008F7A]" />
            </div>
            <p className="font-display text-3xl font-extrabold text-[#042f2e] mt-2">
              98.4%
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-600/25 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Excellent
            </div>
          </div>

          {/* CARD 2: ENERGY SAVED */}
          <div
            ref={(el) => {
              cardsRef.current[1] = el;
            }}
            style={{
              transform: `translate3d(${mouseOffset.x * -7}px, ${mouseOffset.y * 5}px, 0)`,
            }}
            className="rounded-[26px] bg-white/90 backdrop-blur-2xl border border-teal-600/20 p-5 shadow-[0_16px_40px_rgba(4,47,46,0.08)] hover:border-[#008F7A] transition-colors mt-0 sm:mt-5"
          >
            <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-[#467874]">
              <span>ENERGY SAVED</span>
              <Zap className="h-3.5 w-3.5 text-[#008F7A]" />
            </div>
            <p className="font-display text-3xl font-extrabold text-[#008F7A] mt-2">
              18.7%
            </p>
            <div className="mt-2 flex items-center gap-1 text-[10px] font-mono text-[#467874]">
              <Sun className="h-3 w-3 text-amber-500" />
              <span>Solar + AI HVAC</span>
            </div>
          </div>

          {/* CARD 3: ACTIVE ALERTS */}
          <div
            ref={(el) => {
              cardsRef.current[2] = el;
            }}
            style={{
              transform: `translate3d(${mouseOffset.x * 5}px, ${mouseOffset.y * -6}px, 0)`,
            }}
            className="rounded-[26px] bg-white/90 backdrop-blur-2xl border border-teal-600/20 p-5 shadow-[0_16px_40px_rgba(4,47,46,0.08)] hover:border-amber-500/50 transition-colors"
          >
            <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-[#467874]">
              <span>ACTIVE ALERTS</span>
              <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
            </div>
            <p className="font-display text-3xl font-extrabold text-[#042f2e] mt-2">
              03
            </p>
            <p className="mt-2 text-[10px] font-mono font-semibold text-amber-700">
              AI Triage Active
            </p>
          </div>

          {/* CARD 4: ROOMS AVAILABLE */}
          <div
            ref={(el) => {
              cardsRef.current[3] = el;
            }}
            style={{
              transform: `translate3d(${mouseOffset.x * -6}px, ${mouseOffset.y * -7}px, 0)`,
            }}
            className="rounded-[26px] bg-white/90 backdrop-blur-2xl border border-teal-600/20 p-5 shadow-[0_16px_40px_rgba(4,47,46,0.08)] hover:border-[#008F7A] transition-colors mt-0 sm:mt-5"
          >
            <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-[#467874]">
              <span>ROOMS AVAILABLE</span>
              <DoorOpen className="h-3.5 w-3.5 text-[#008F7A]" />
            </div>
            <p className="font-display text-3xl font-extrabold text-[#042f2e] mt-2">
              42
            </p>
            <div className="mt-2 flex items-center gap-1 text-[10px] font-mono font-semibold text-[#007F6E]">
              <Wifi className="h-3 w-3" />
              <span>IoT Occupancy Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Prompt */}
      <div className="relative z-10 pt-4 flex items-center justify-between border-t border-teal-600/15">
        <button
          onClick={scrollToProblem}
          className="inline-flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-[0.22em] text-[#007F6E] hover:text-[#042f2e] transition-colors cursor-pointer"
        >
          <span>SCROLL TO EXPLORE</span>
          <ArrowDown className="h-4 w-4 text-[#008F7A] animate-bounce" />
        </button>

        <div className="hidden sm:flex items-center gap-6 text-[11px] font-mono font-semibold text-[#467874]">
          <span>30 CAMPUS BLOCKS</span>
          <span>•</span>
          <span>SMART CANTEEN QR</span>
          <span>•</span>
          <span>REAL-TIME 3D DIGITAL TWIN</span>
        </div>
      </div>
    </section>
  );
};
