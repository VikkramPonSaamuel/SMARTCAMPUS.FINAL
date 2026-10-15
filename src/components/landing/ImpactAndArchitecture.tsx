import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  Cpu,
  BrainCircuit,
  Zap,
  Sparkles,
  Network,
  Quote,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const ImpactSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [counts, setCounts] = useState({
    energy: 0,
    rooms: 0,
    sla: 0,
    health: 0,
  });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasTriggered) {
          setHasTriggered(true);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasTriggered]);

  useEffect(() => {
    if (!hasTriggered) return;
    const duration = 1500;
    const start = performance.now();

    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const ease = 1 - Math.pow(1 - p, 3);
      setCounts({
        energy: Number((18.7 * ease).toFixed(1)),
        rooms: Math.round(42 * ease),
        sla: Math.round(92 * ease),
        health: Number((98.4 * ease).toFixed(1)),
      });
      if (p < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [hasTriggered]);

  return (
    <section
      id="sec-impact"
      ref={sectionRef}
      className="relative w-full rounded-[32px] overflow-hidden bg-gradient-to-b from-[#050814] via-[#0B1228] to-[#050814] text-white border border-white/12 p-8 sm:p-14 lg:p-20 shadow-2xl"
    >
      <div className="max-w-6xl mx-auto">
        <span className="inline-block text-xs font-mono font-bold uppercase tracking-[0.24em] text-cyan-300">
          09 — MEASURABLE CAMPUS IMPACT
        </span>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="rounded-[28px] bg-white/[0.04] border border-white/12 p-7">
            <p className="font-display text-4xl sm:text-5xl font-extrabold text-cyan-300">
              {counts.energy}%
            </p>
            <p className="text-xs text-slate-300 mt-2 font-medium">
              Potential energy savings
            </p>
          </div>

          <div className="rounded-[28px] bg-white/[0.04] border border-white/12 p-7">
            <p className="font-display text-4xl sm:text-5xl font-extrabold text-white">
              {counts.rooms}
            </p>
            <p className="text-xs text-slate-300 mt-2 font-medium">Smart rooms</p>
          </div>

          <div className="rounded-[28px] bg-white/[0.04] border border-white/12 p-7">
            <p className="font-display text-4xl sm:text-5xl font-extrabold text-violet-300">
              {counts.sla}%
            </p>
            <p className="text-xs text-slate-300 mt-2 font-medium">
              Maintenance SLA
            </p>
          </div>

          <div className="rounded-[28px] bg-white/[0.04] border border-white/12 p-7">
            <p className="font-display text-4xl sm:text-5xl font-extrabold text-emerald-300">
              {counts.health}%
            </p>
            <p className="text-xs text-slate-300 mt-2 font-medium">
              Campus health
            </p>
          </div>

          <div className="rounded-[28px] bg-white/[0.04] border border-white/12 p-7">
            <p className="font-display text-4xl sm:text-5xl font-extrabold text-amber-300">
              24/7
            </p>
            <p className="text-xs text-slate-300 mt-2 font-medium">
              Intelligent monitoring
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export const HowItWorks: React.FC = () => {
  const [activeStage, setActiveStage] = useState(0);

  const panels = [
    {
      num: '01',
      title: 'SENSE',
      icon: Cpu,
      items: [
        'IoT sensors',
        'Campus systems',
        'User reports',
        'Cameras',
        'Infrastructure data',
      ],
      accent: 'from-cyan-500/20 to-blue-600/5 border-cyan-400/50 text-cyan-300',
    },
    {
      num: '02',
      title: 'UNDERSTAND',
      icon: BrainCircuit,
      items: ['AI', 'Machine Learning', 'RAG', 'Analytics', 'Prediction'],
      accent: 'from-violet-500/20 to-indigo-600/5 border-violet-400/50 text-violet-300',
    },
    {
      num: '03',
      title: 'ACT',
      icon: Zap,
      items: [
        'Alerts',
        'Automation',
        'Recommendations',
        'Routing',
        'Decision support',
      ],
      accent: 'from-emerald-500/20 to-teal-600/5 border-emerald-400/50 text-emerald-300',
    },
  ];

  return (
    <section className="relative w-full rounded-[32px] overflow-hidden bg-[#070B19] text-white border border-white/12 p-8 sm:p-14 lg:p-20 shadow-2xl">
      <div className="max-w-6xl mx-auto">
        <span className="inline-block text-xs font-mono font-bold uppercase tracking-[0.24em] text-violet-300">
          10 — AUTONOMOUS INTELLIGENCE LOOP
        </span>
        <h2 className="font-display text-5xl sm:text-7xl font-extrabold tracking-tight text-white mt-3 leading-none">
          <span
            onClick={() => setActiveStage(0)}
            className={`cursor-pointer transition-opacity mr-4 ${
              activeStage === 0 ? 'text-cyan-300 opacity-100' : 'opacity-45 hover:opacity-80'
            }`}
          >
            Sense.
          </span>
          <span
            onClick={() => setActiveStage(1)}
            className={`cursor-pointer transition-opacity mr-4 ${
              activeStage === 1 ? 'text-violet-300 opacity-100' : 'opacity-45 hover:opacity-80'
            }`}
          >
            Understand.
          </span>
          <span
            onClick={() => setActiveStage(2)}
            className={`cursor-pointer transition-opacity ${
              activeStage === 2 ? 'text-emerald-300 opacity-100' : 'opacity-45 hover:opacity-80'
            }`}
          >
            Act.
          </span>
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {panels.map((p, idx) => {
            const Icon = p.icon;
            const active = activeStage === idx;
            return (
              <div
                key={p.num}
                onMouseEnter={() => setActiveStage(idx)}
                onClick={() => setActiveStage(idx)}
                className={`cursor-pointer rounded-[30px] p-8 border transition-all duration-500 bg-gradient-to-b ${
                  active
                    ? `${p.accent} scale-[1.03] shadow-2xl`
                    : 'from-white/[0.03] to-transparent border-white/10 opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-slate-400">
                    {p.num}
                  </span>
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="font-display text-3xl font-extrabold text-white mt-4">
                  {p.title}
                </h3>

                <ul className="mt-6 space-y-2.5">
                  {p.items.map((it) => (
                    <li
                      key={it}
                      className="flex items-center gap-2.5 text-sm text-slate-200 font-medium"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const Technology: React.FC = () => {
  const techStack = [
    { name: 'AI / ML', tag: 'Predictive Core' },
    { name: 'RAG', tag: 'Contextual Knowledge' },
    { name: 'Computer Vision', tag: 'Spatial Sensing' },
    { name: 'IoT', tag: 'MQTT / Edge Telemetry' },
    { name: 'WebSockets', tag: 'Sub-Second Streams' },
    { name: 'Cloud', tag: 'Distributed Mesh' },
    { name: 'PostgreSQL', tag: 'Time-Series Store' },
    { name: 'FastAPI', tag: 'Async Python Kernel' },
    { name: 'React', tag: 'Spatial UI Engine' },
    { name: 'Three.js', tag: 'WebGL Digital Twin' },
  ];

  return (
    <section className="relative w-full rounded-[32px] overflow-hidden bg-[#F6F7FB] text-slate-900 p-8 sm:p-14 lg:p-20 border border-slate-200/80 shadow-2xl">
      <div className="max-w-6xl mx-auto text-center">
        <span className="inline-block text-xs font-mono font-bold uppercase tracking-[0.24em] text-violet-600">
          11 — ARCHITECTURE & STACK
        </span>
        <h2 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 mt-2">
          Built for the intelligent campus.
        </h2>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {techStack.map((t, idx) => (
            <div
              key={t.name}
              style={{
                transform: `translateY(${(idx % 2) * 8}px)`,
              }}
              className="rounded-[24px] bg-white border border-slate-200/90 p-6 shadow-[0_14px_35px_rgba(15,23,42,0.06)] hover:-translate-y-2 hover:border-violet-400 transition-all duration-300 text-left"
            >
              <span className="text-[10px] font-mono uppercase tracking-wider text-violet-600 block">
                {t.tag}
              </span>
              <h3 className="font-display text-xl font-extrabold text-slate-950 mt-2">
                {t.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const UseCases: React.FC = () => {
  const cases = [
    { role: 'STUDENTS', desc: 'Find classes, rooms, events and campus services.' },
    { role: 'FACULTY', desc: 'Manage rooms, schedules and teaching infrastructure.' },
    { role: 'ADMINISTRATION', desc: 'Understand campus performance in real time.' },
    { role: 'SECURITY', desc: 'Detect incidents and coordinate response.' },
    { role: 'FACILITIES', desc: 'Predict maintenance before failures.' },
    { role: 'IT', desc: 'Monitor infrastructure and network health.' },
    { role: 'ENERGY', desc: 'Track and optimize resource consumption.' },
  ];

  const testimonials = [
    {
      role: 'Student',
      quote: 'Finding available labs and navigating campus is much easier.',
    },
    {
      role: 'Faculty',
      quote: 'The classroom and energy insights help us manage resources.',
    },
    {
      role: 'Administrator',
      quote:
        "CampusOS gives us one place to understand what's happening across campus.",
    },
  ];

  return (
    <section className="relative w-full rounded-[32px] overflow-hidden bg-[#060A17] text-white border border-white/12 p-8 sm:p-14 lg:p-20 shadow-2xl space-y-20">
      {/* Horizontal Use Cases Carousel */}
      <div className="max-w-6xl mx-auto">
        <span className="inline-block text-xs font-mono font-bold uppercase tracking-[0.24em] text-cyan-300">
          12 — ROLE-BASED EXPERIENCES
        </span>
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-2">
          Tailored for every campus stakeholder.
        </h2>

        <div className="mt-8 flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4">
          {cases.map((c, idx) => (
            <div
              key={c.role}
              className="snap-start shrink-0 w-72 sm:w-80 rounded-[28px] bg-white/[0.05] border border-white/12 p-7 hover:border-cyan-400/50 transition-all"
            >
              <span className="font-mono text-xs text-cyan-300">0{idx + 1}</span>
              <h3 className="font-display text-2xl font-bold text-white mt-3">
                {c.role}
              </h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                “{c.desc}”
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 14: Campus Feedback */}
      <div className="max-w-6xl mx-auto pt-8 border-t border-white/10">
        <span className="inline-block text-xs font-mono font-bold uppercase tracking-[0.24em] text-violet-300">
          13 — CAMPUS FEEDBACK
        </span>
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-2">
          Designed around the people
          <span className="block text-slate-300">who make a campus work.</span>
        </h2>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.role}
              className="rounded-[28px] bg-white/[0.04] border border-white/12 p-8 flex flex-col justify-between"
            >
              <Quote className="h-7 w-7 text-violet-400/60" />
              <p className="text-base sm:text-lg font-medium text-white mt-4 leading-relaxed">
                “{t.quote}”
              </p>
              <div className="mt-6 pt-4 border-t border-white/10">
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold">
                  {t.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const FutureVision: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const centerHubRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const offsets = [
        { x: -160, y: -90 },
        { x: 160, y: -90 },
        { x: -160, y: 90 },
        { x: 160, y: 90 },
      ];

      pillRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { x: offsets[i].x, y: offsets[i].y, opacity: 0.5 },
          {
            x: offsets[i].x * 0.38,
            y: offsets[i].y * 0.38,
            opacity: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              end: 'center center',
              scrub: 1,
            },
          }
        );
      });

      gsap.fromTo(
        centerHubRef.current,
        { scale: 0.8, opacity: 0.4 },
        {
          scale: 1.08,
          opacity: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'center center',
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const pillars = ['AI', 'IoT', 'DIGITAL TWIN', 'AUTOMATION'];

  return (
    <section
      id="sec-vision"
      ref={sectionRef}
      className="relative min-h-[80vh] w-full rounded-[32px] overflow-hidden bg-[#030611] text-white border border-white/12 p-8 sm:p-16 flex flex-col items-center justify-center text-center shadow-2xl"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.22)_0%,transparent_65%)]" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-5">
        <span className="inline-block text-xs font-mono font-bold uppercase tracking-[0.24em] text-cyan-300">
          14 — FUTURE VISION
        </span>
        <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.04]">
          The campus of tomorrow
          <span className="block bg-gradient-to-r from-violet-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
            starts with intelligence today.
          </span>
        </h2>
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          CampusOS transforms a campus from a collection of buildings into an
          intelligent, connected ecosystem.
        </p>
      </div>

      {/* 4 Floating Elements Converging into CAMPUSOS */}
      <div className="relative z-10 mt-14 h-64 w-full max-w-xl flex items-center justify-center">
        {pillars.map((label, idx) => (
          <div
            key={label}
            ref={(el) => {
              pillRefs.current[idx] = el;
            }}
            className="absolute px-5 py-2.5 rounded-full bg-white/[0.07] backdrop-blur-xl border border-white/20 text-xs font-mono font-bold tracking-widest text-cyan-200 shadow-lg"
          >
            {label}
          </div>
        ))}

        <div
          ref={centerHubRef}
          className="relative z-20 px-8 py-5 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-display text-xl sm:text-2xl font-extrabold tracking-[0.2em] shadow-[0_0_60px_rgba(34,211,238,0.5)] border-2 border-white/40 flex items-center gap-3"
        >
          <Sparkles className="h-5 w-5 text-white" />
          <span>CAMPUSOS</span>
        </div>
      </div>
    </section>
  );
};

export const FinalCTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full rounded-[36px] overflow-hidden bg-gradient-to-br from-[#0A1026] via-[#12183B] to-[#050814] text-white border border-white/15 p-10 sm:p-16 lg:p-24 text-center shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
      <div className="pointer-events-none absolute -top-24 left-1/3 w-96 h-96 rounded-full bg-cyan-500/20 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-24 right-1/3 w-96 h-96 rounded-full bg-violet-500/20 blur-[130px]" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-mono uppercase tracking-[0.22em] text-cyan-300">
          READY FOR DEPLOYMENT
        </span>

        <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.03]">
          Ready to make
          <span className="block bg-gradient-to-r from-white via-violet-200 to-cyan-300 bg-clip-text text-transparent">
            your campus smarter?
          </span>
        </h2>

        <p className="text-base sm:text-xl text-slate-300 font-medium">
          Connect your campus. Understand it. Improve it.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-bold text-[#050814] shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <span>Launch CampusOS</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => navigate('/digital-twin')}
            className="inline-flex items-center gap-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/25 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 cursor-pointer"
          >
            <span>Explore Digital Twin</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer className="w-full rounded-[32px] bg-[#040711] border border-white/10 px-8 sm:px-14 py-12 text-slate-400">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-white/10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20 border border-cyan-400/40">
              <Network className="h-4 w-4 text-cyan-300" />
            </div>
            <span className="font-display text-base font-bold tracking-[0.18em] text-white">
              CAMPUS<span className="text-cyan-300">OS</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xs leading-relaxed">
            One intelligent campus. Connected. Predictive. Sustainable.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 text-xs font-medium text-slate-300">
          <button onClick={() => scrollTo('sec-features')} className="hover:text-white cursor-pointer">
            Platform
          </button>
          <button onClick={() => scrollTo('sec-solution')} className="hover:text-white cursor-pointer">
            Solutions
          </button>
          <button onClick={() => scrollTo('sec-twin')} className="hover:text-white cursor-pointer">
            Digital Twin
          </button>
          <button onClick={() => scrollTo('sec-ai')} className="hover:text-white cursor-pointer">
            Intelligence
          </button>
          <button onClick={() => scrollTo('sec-impact')} className="hover:text-white cursor-pointer">
            Impact
          </button>
          <button onClick={() => navigate('/dashboard')} className="hover:text-white cursor-pointer">
            About
          </button>
          <button onClick={() => navigate('/settings')} className="hover:text-white cursor-pointer">
            Faculty & Settings
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <span>© 2026 CampusOS</span>
        <span className="font-mono text-[11px] text-slate-500">
          SMART CAMPUS OPERATING SYSTEM • DIGITAL TWIN v4.2
        </span>
      </div>
    </footer>
  );
};
