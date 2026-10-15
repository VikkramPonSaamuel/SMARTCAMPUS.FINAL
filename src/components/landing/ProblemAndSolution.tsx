import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Layers,
  ZapOff,
  ClockAlert,
  BrainCircuit,
  GraduationCap,
  Users,
  Building2,
  Cpu,
  Server,
  ShieldCheck,
  Zap,
  Bus,
  Sparkles,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const ProblemSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const problems = [
    {
      num: '01',
      title: 'FRAGMENTED SYSTEMS',
      desc: 'Timetables, infrastructure, security and student services operate independently.',
      icon: Layers,
      accent: 'from-violet-500/20 to-indigo-500/5 border-violet-500/30 text-violet-600',
    },
    {
      num: '02',
      title: 'WASTED RESOURCES',
      desc: 'Empty classrooms can remain powered while energy continues to be consumed.',
      icon: ZapOff,
      accent: 'from-cyan-500/20 to-sky-500/5 border-cyan-500/30 text-cyan-600',
    },
    {
      num: '03',
      title: 'SLOW RESPONSE',
      desc: 'Maintenance and safety issues can take too long to reach the right team.',
      icon: ClockAlert,
      accent: 'from-amber-500/20 to-orange-500/5 border-amber-500/30 text-amber-600',
    },
    {
      num: '04',
      title: 'NO PREDICTIVE INTELLIGENCE',
      desc: 'Traditional systems report what happened instead of predicting what happens next.',
      icon: BrainCircuit,
      accent: 'from-rose-500/20 to-pink-500/5 border-rose-500/30 text-rose-600',
    },
  ];

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 60, filter: 'blur(8px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
          },
        }
      );

      // Alternating card entrance: Card 1 (-120px), Card 2 (+120px), Card 3 (-120px), Card 4 (+120px)
      cardsRef.current.forEach((card, idx) => {
        if (!card) return;
        const fromX = idx % 2 === 0 ? -120 : 120;
        gsap.fromTo(
          card,
          { opacity: 0, x: fromX, filter: 'blur(10px)' },
          {
            opacity: 1,
            x: 0,
            filter: 'blur(0px)',
            duration: 0.95,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="sec-problem"
      ref={sectionRef}
      className="relative w-full rounded-[32px] overflow-hidden bg-gradient-to-b from-[#070B19] via-[#131B36] to-[#F4F5FA] p-8 sm:p-14 lg:p-20 border border-white/10 shadow-2xl"
    >
      <div className="max-w-6xl mx-auto">
        <div ref={headingRef} className="max-w-3xl space-y-4">
          <span className="inline-block text-xs font-mono font-bold uppercase tracking-[0.24em] text-cyan-300">
            01 — THE CHALLENGE
          </span>
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.06]">
            Modern campuses generate enormous amounts of data.
            <span className="block mt-2 text-violet-200/85">
              Most of it remains disconnected.
            </span>
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {problems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.num}
                ref={(el) => {
                  cardsRef.current[idx] = el;
                }}
                className="group rounded-[28px] bg-white/95 backdrop-blur-2xl border border-slate-200/80 p-8 sm:p-10 shadow-[0_24px_60px_rgba(15,23,42,0.12)] hover:-translate-y-2 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold tracking-widest text-slate-400">
                    {item.num}
                  </span>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br border ${item.accent}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mt-6 tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const SolutionSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const centerNodeRef = useRef<HTMLDivElement>(null);
  const outerNodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const linesRef = useRef<(SVGLineElement | null)[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const ecosystemNodes = [
    { id: 'students', label: 'Students', icon: GraduationCap, x: 50, y: 12, desc: 'Live room discovery, timetables & wayfinding' },
    { id: 'faculty', label: 'Faculty', icon: Users, x: 80, y: 22, desc: 'Smart classroom automation & session control' },
    { id: 'admin', label: 'Administration', icon: Building2, x: 88, y: 50, desc: 'Unified executive KPIs & predictive planning' },
    { id: 'iot', label: 'IoT Sensors', icon: Cpu, x: 80, y: 78, desc: 'Sub-second environmental & occupancy telemetry' },
    { id: 'infra', label: 'Infrastructure', icon: Server, x: 50, y: 88, desc: 'Automated HVAC, lighting & water grid' },
    { id: 'security', label: 'Security', icon: ShieldCheck, x: 20, y: 78, desc: 'AI anomaly detection & instant evacuation routing' },
    { id: 'energy', label: 'Energy', icon: Zap, x: 12, y: 50, desc: 'Solar yield optimization & peak load shaving' },
    { id: 'transport', label: 'Transport', icon: Bus, x: 20, y: 22, desc: 'Smart parking bays & EV charging intelligence' },
  ];

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      // 1. Center node appears
      tl.fromTo(
        centerNodeRef.current,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, ease: 'power3.out' }
      )
        // 2. SVG connection lines draw themselves
        .fromTo(
          linesRef.current.filter(Boolean),
          { strokeDasharray: 400, strokeDashoffset: 400, opacity: 0 },
          {
            strokeDashoffset: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.08,
            ease: 'power3.out',
          },
          '-=0.3'
        )
        // 3. Outer nodes appear sequentially
        .fromTo(
          outerNodesRef.current.filter(Boolean),
          { scale: 0.7, opacity: 0, y: 15 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.07,
            ease: 'power3.out',
          },
          '-=0.65'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="sec-solution"
      ref={sectionRef}
      className="relative w-full rounded-[32px] overflow-hidden bg-[#F6F7FB] text-slate-900 p-8 sm:p-14 lg:p-20 border border-slate-200/80 shadow-2xl"
    >
      {/* Subtle Lavender & Cyan Ambient Glows */}
      <div className="pointer-events-none absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-violet-300/25 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-cyan-300/25 blur-[120px]" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-block text-xs font-mono font-bold uppercase tracking-[0.24em] text-violet-600">
            02 — THE SOLUTION
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.04]">
            One intelligent layer
            <span className="block bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              for the entire campus.
            </span>
          </h2>
        </div>

        {/* Interactive Ecosystem Diagram */}
        <div className="relative mt-12 h-[520px] sm:h-[600px] w-full max-w-4xl mx-auto rounded-[32px] bg-white border border-slate-200/90 shadow-[0_25px_70px_rgba(15,23,42,0.07)] overflow-hidden">
          {/* Animated SVG Connection Lines & Traveling Particles */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.65" />
              </linearGradient>
            </defs>

            {ecosystemNodes.map((node, idx) => {
              const isHighlighted = hoveredNode === node.id;
              return (
                <g key={node.id}>
                  <line
                    ref={(el) => {
                      linesRef.current[idx] = el;
                    }}
                    x1="50"
                    y1="50"
                    x2={node.x}
                    y2={node.y}
                    stroke={isHighlighted ? '#7C3AED' : 'url(#lineGrad)'}
                    strokeWidth={isHighlighted ? '0.65' : '0.35'}
                  />
                  {/* Animated Particle Traveling Along the Line */}
                  <circle r="0.7" fill="#06B6D4">
                    <animateMotion
                      dur={`${2.4 + (idx % 3) * 0.6}s`}
                      repeatCount="indefinite"
                      path={`M 50 50 L ${node.x} ${node.y}`}
                    />
                  </circle>
                </g>
              );
            })}
          </svg>

          {/* CENTER NODE: CAMPUSOS INTELLIGENCE ENGINE */}
          <div
            ref={centerNodeRef}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <div className="relative flex flex-col items-center justify-center w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-[#070B19] text-white border-4 border-violet-400/50 shadow-[0_0_60px_rgba(139,92,246,0.4)] text-center p-4">
              <span className="absolute inset-0 rounded-full border border-cyan-400/40 animate-ping opacity-25" />
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 mb-2 shadow-md">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-sm sm:text-base font-extrabold tracking-wider text-white">
                CAMPUSOS
              </span>
              <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-cyan-300 mt-1">
                INTELLIGENCE ENGINE
              </span>
            </div>
          </div>

          {/* 8 OUTER NODES */}
          {ecosystemNodes.map((node, idx) => {
            const Icon = node.icon;
            const isHovered = hoveredNode === node.id;
            return (
              <div
                key={node.id}
                ref={(el) => {
                  outerNodesRef.current[idx] = el;
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
              >
                <div
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all duration-300 shadow-md ${
                    isHovered
                      ? 'bg-[#070B19] text-white border-violet-500 scale-108 shadow-xl'
                      : 'bg-white/95 text-slate-900 border-slate-200 hover:border-violet-400'
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                      isHovered
                        ? 'bg-violet-500/25 text-cyan-300'
                        : 'bg-slate-100 text-violet-600'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold whitespace-nowrap">
                    {node.label}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Bottom Live Telemetry Caption */}
          <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none">
            <span className="inline-block px-4 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-mono text-slate-600">
              {hoveredNode
                ? ecosystemNodes.find((n) => n.id === hoveredNode)?.desc
                : 'Hover any node to inspect real-time CampusOS neural bus integration'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
