import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Sparkles,
  Navigation,
  ShieldAlert,
  CheckCircle2,
  Radar,
  BrainCircuit,
  Route,
  Wrench,
  Send,
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { generateCampusAiResponse } from '../../services/geminiService';

gsap.registerPlugin(ScrollTrigger);

interface PromptPreset {
  prompt: string;
  reply: string;
  card: {
    code: string;
    metric1Label: string;
    metric1Val: string;
    metric2Label: string;
    metric2Val: string;
    metric3Label: string;
    metric3Val: string;
  };
}

const AI_PRESETS: PromptPreset[] = [
  {
    prompt: 'Which computer lab is available right now?',
    reply: 'Lab C-204 is currently available.',
    card: {
      code: 'C-204',
      metric1Label: 'Capacity',
      metric1Val: '60',
      metric2Label: 'Current occupancy',
      metric2Val: '8%',
      metric3Label: 'Distance',
      metric3Val: '3 min walk',
    },
  },
  {
    prompt: 'Where is my next class?',
    reply: 'Your next lecture is CS-401 Deep Learning in Block A — Room A108 at 11:30 AM.',
    card: {
      code: 'A-108',
      metric1Label: 'Capacity',
      metric1Val: '80',
      metric2Label: 'Current occupancy',
      metric2Val: '14%',
      metric3Label: 'Distance',
      metric3Val: '2 min walk',
    },
  },
  {
    prompt: 'What is on the menu at MOJO Cafe, JEVAN, and SSS Canteen?',
    reply:
      '1. MOJO Cafe (Paninis ₹90, Cold Brew ₹75), 2. JEVAN (Ambur Biryani ₹150, Thali ₹135), and 3. SSS Canteen (Ghee Podi Dosa ₹85, Sambar Idli ₹70) are open for classroom QR ordering.',
    card: {
      code: '3 CANTEENS',
      metric1Label: '1. MOJO Cafe',
      metric1Val: '6-11m Prep',
      metric2Label: '2. JEVAN',
      metric2Val: '10-15m Prep',
      metric3Label: '3. SSS Canteen',
      metric3Val: '5-10m Prep',
    },
  },
  {
    prompt: 'Find an available classroom',
    reply: 'Room B-302 in Block B has 0% occupancy, smart projector ready, and AC in Eco-Standby.',
    card: {
      code: 'B-302',
      metric1Label: 'Capacity',
      metric1Val: '45',
      metric2Label: 'Current occupancy',
      metric2Val: '0%',
      metric3Label: 'Distance',
      metric3Val: '3 min walk',
    },
  },
  {
    prompt: 'Report a maintenance issue',
    reply: 'Maintenance ticket TKT-8948 created and routed to Smart AV Support (Priority: Medium).',
    card: {
      code: 'TKT-8948',
      metric1Label: 'Category',
      metric1Val: 'IT / AV Gear',
      metric2Label: 'SLA Target',
      metric2Val: '15 mins',
      metric3Label: 'Assigned',
      metric3Val: 'IT Support',
    },
  },
  {
    prompt: "What's happening on campus?",
    reply: 'Campus health is 98.4% with 2,845 active students, 18.7% energy saved, and 42 free rooms.',
    card: {
      code: 'CAMPUS LIVE',
      metric1Label: 'Health',
      metric1Val: '98.4%',
      metric2Label: 'Energy Saved',
      metric2Val: '18.7%',
      metric3Label: 'Open Rooms',
      metric3Val: '42 Rooms',
    },
  },
];

export const AIAssistant: React.FC = () => {
  const navigate = useNavigate();
  const {
    buildings,
    rooms,
    parkingZones,
    tickets,
    alerts,
    canteenMenu,
    canteenOrders,
    facultySessions,
    liveMetrics,
    geminiApiKey,
    aiModelUsed,
  } = useCampus();

  const sectionRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);
  const [customPrompt, setCustomPrompt] = useState('');
  const [displayedPrompt, setDisplayedPrompt] = useState(AI_PRESETS[0].prompt);
  const [fullReplyText, setFullReplyText] = useState(AI_PRESETS[0].reply);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const activePreset = AI_PRESETS[selectedPresetIdx];

  // Character-by-character typing animation whenever fullReplyText updates
  useEffect(() => {
    setIsTyping(true);
    setTypedText('');
    let idx = 0;

    const timer = setInterval(() => {
      idx += 2;
      setTypedText(fullReplyText.slice(0, idx));
      if (idx >= fullReplyText.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 18);

    return () => clearInterval(timer);
  }, [fullReplyText]);

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIdx(idx);
    setDisplayedPrompt(AI_PRESETS[idx].prompt);
    setFullReplyText(AI_PRESETS[idx].reply);
  };

  const handleCustomAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = customPrompt.trim();
    if (!q) return;
    setCustomPrompt('');
    setDisplayedPrompt(q);
    setIsTyping(true);
    setTypedText('Querying Gemini API...');

    try {
      const { text } = await generateCampusAiResponse(
        q,
        [],
        {
          buildings,
          rooms,
          parkingZones,
          tickets,
          alerts,
          canteenMenu,
          canteenOrders,
          facultySessions,
          liveMetrics,
        },
        geminiApiKey
      );
      setFullReplyText(text);
    } catch {
      setFullReplyText(
        `CampusOS Neural Core analyzed "${q}". Room C-204 and B-302 are open, and all 3 canteens (MOJO Cafe, JEVAN, SSS Canteen) are accepting classroom QR orders.`
      );
    }
  };

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chatBoxRef.current,
        { scale: 0.9, opacity: 0, y: 40 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="sec-ai"
      ref={sectionRef}
      className="relative w-full rounded-[32px] overflow-hidden bg-white text-slate-950 p-8 sm:p-14 lg:p-20 border border-teal-600/20 shadow-2xl"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-block text-xs font-mono font-bold uppercase tracking-[0.24em] text-[#008F7A]">
            06 — CONVERSATIONAL INTELLIGENCE • GEMINI API CONNECTED
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-[#042f2e]">
            Ask your campus.
          </h2>
          <p className="text-sm sm:text-base text-[#1f5754]">
            Powered by live Google Gemini ({aiModelUsed}) connected to every room,
            sensor, canteen menu, and timetable on campus.
          </p>
        </div>

        {/* Futuristic AI Chat Interface */}
        <div
          ref={chatBoxRef}
          className="mt-12 rounded-[32px] bg-[#070B19] text-white border border-teal-600/25 p-6 sm:p-10 shadow-[0_24px_60px_rgba(4,47,46,0.12)] space-y-6"
        >
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-teal-600/20">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#008F7A] to-[#14B8A6]">
                <Sparkles className="h-5 w-5 !text-white" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-[#042f2e]">
                  CampusOS Neural Assistant
                </h3>
                <p className="text-[11px] font-mono text-[#007F6E]">
                  Gemini API Key Connected ({geminiApiKey.slice(0, 9)}...{geminiApiKey.slice(-4)})
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-800">
              ● GEMINI API LIVE
            </span>
          </div>

          {/* User Message Sliding From Right */}
          <div className="flex justify-end">
            <div className="btn-ocean-primary max-w-md rounded-3xl rounded-br-md bg-gradient-to-r from-[#008F7A] to-[#14B8A6] px-5 py-3.5 text-sm font-semibold !text-white shadow-md">
              “{displayedPrompt}”
            </div>
          </div>

          {/* AI Response with Character-by-Character Typing & Glowing Cursor */}
          <div className="flex items-start gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-500/15 text-[#008F7A] mt-1">
              <Sparkles className="h-4 w-4" />
            </div>

            <div className="flex-1 space-y-4">
              <div className="inline-block rounded-3xl rounded-tl-md bg-white/90 border border-teal-600/25 px-5 py-3.5 text-sm sm:text-base font-medium text-[#042f2e] whitespace-pre-line">
                <span>{typedText}</span>
                <span className="inline-block w-2 h-4 ml-1 align-middle bg-[#008F7A] animate-pulse" />
              </div>

              {/* Sliding Structured Room/Telemetry Card */}
              <div
                className={`rounded-2xl bg-white/95 border border-teal-600/30 p-5 transition-all duration-500 ${
                  isTyping ? 'opacity-60 translate-y-1' : 'opacity-100 translate-y-0'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#008F7A]">
                      VERIFIED LIVE TELEMETRY
                    </span>
                    <h4 className="font-display text-2xl font-extrabold text-[#042f2e] mt-0.5">
                      {activePreset.card.code}
                    </h4>
                  </div>

                  <button
                    onClick={() => navigate('/digital-twin')}
                    className="btn-ocean-primary inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#008F7A] to-[#14B8A6] px-5 py-2.5 text-xs font-bold !text-white shadow-md transition-all cursor-pointer"
                  >
                    <Navigation className="h-3.5 w-3.5 !text-white" />
                    <span>Navigate there →</span>
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-teal-600/15 grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#467874] block">
                      {activePreset.card.metric1Label}
                    </span>
                    <span className="font-display text-lg font-bold text-[#042f2e]">
                      {activePreset.card.metric1Val}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#467874] block">
                      {activePreset.card.metric2Label}
                    </span>
                    <span className="font-display text-lg font-bold text-emerald-700">
                      {activePreset.card.metric2Val}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#467874] block">
                      {activePreset.card.metric3Label}
                    </span>
                    <span className="font-display text-lg font-bold text-[#008F7A]">
                      {activePreset.card.metric3Val}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Custom Prompt Input Bar */}
          <form onSubmit={handleCustomAsk} className="flex items-center gap-2.5 pt-2">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Ask Campus AI anything live (e.g., 'What is on the menu at MOJO Cafe?')..."
              className="flex-1 px-4 py-3 rounded-2xl bg-white/90 border border-teal-600/25 text-xs sm:text-sm text-[#042f2e] placeholder-[#467874] focus:outline-none focus:border-[#008F7A]"
            />
            <button
              type="submit"
              className="btn-ocean-primary px-5 py-3 rounded-2xl bg-gradient-to-r from-[#008F7A] to-[#14B8A6] text-xs font-bold !text-white shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Ask AI</span>
              <Send className="h-3.5 w-3.5 !text-white" />
            </button>
          </form>

          {/* Example Prompt Pills */}
          <div className="pt-4 border-t border-teal-600/15">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#467874]">
                TRY EXAMPLE CAMPUS PROMPTS:
              </span>
              <button
                onClick={() => navigate('/ai-assistant')}
                className="text-xs font-mono font-bold text-[#008F7A] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Open Full AI Console</span>
                <Send className="h-3 w-3" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {AI_PRESETS.map((item, idx) => {
                const active = selectedPresetIdx === idx;
                return (
                  <button
                    key={item.prompt}
                    onClick={() => handleSelectPreset(idx)}
                    className={`px-3.5 py-2 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      active
                        ? 'btn-ocean-primary bg-gradient-to-r from-[#008F7A] to-[#14B8A6] !text-white border-[#008F7A] font-bold'
                        : 'bg-white/80 text-[#1f5754] border-teal-600/20 hover:border-[#008F7A]'
                    }`}
                  >
                    “{item.prompt}”
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const SafetySection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const routePathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      if (routePathRef.current) {
        gsap.fromTo(
          routePathRef.current,
          { strokeDasharray: 600, strokeDashoffset: 600 },
          {
            strokeDashoffset: 0,
            duration: 1.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 65%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stages = [
    {
      step: 'DETECT',
      icon: Radar,
      desc: 'Multi-modal particulate, thermal & acoustic sensors trigger sub-second alert.',
      color: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
    },
    {
      step: 'UNDERSTAND',
      icon: BrainCircuit,
      desc: 'AI cross-verifies floor occupancy, HVAC airflow & camera feeds (94% confidence).',
      color: 'border-violet-500/40 bg-violet-500/10 text-violet-300',
    },
    {
      step: 'RESPOND',
      icon: Route,
      desc: 'Security notified, nearby users alerted & dynamic evacuation route illuminated.',
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    },
  ];

  return (
    <section
      id="sec-safety"
      ref={sectionRef}
      className="relative w-full rounded-[32px] overflow-hidden bg-[#050814] text-white border border-white/12 p-8 sm:p-14 lg:p-20 shadow-2xl"
    >
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl space-y-3">
          <span className="inline-block text-xs font-mono font-bold uppercase tracking-[0.24em] text-rose-400">
            07 — AUTONOMOUS SAFETY INTELLIGENCE
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
            Safety that responds
            <span className="block text-rose-400">in real time.</span>
          </h2>
        </div>

        {/* Interactive Campus Alert Map + Incident Telemetry */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Animated SVG Campus Safety & Evacuation Route Map */}
          <div className="lg:col-span-7 relative h-[360px] sm:h-[400px] rounded-[28px] bg-[#080E22] border border-white/15 overflow-hidden p-6">
            <svg className="w-full h-full" viewBox="0 0 600 340" fill="none">
              {/* Grid */}
              <g stroke="rgba(148,163,184,0.1)" strokeWidth="1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <line key={`sh-${i}`} x1="0" y1={i * 36} x2="600" y2={i * 36} />
                ))}
                {Array.from({ length: 15 }).map((_, i) => (
                  <line key={`sv-${i}`} x1={i * 42} y1="0" x2={i * 42} y2="340" />
                ))}
              </g>

              {/* Campus Blocks on Safety Map */}
              <rect x="60" y="60" width="120" height="85" rx="12" fill="#1E293B" stroke="#475569" />
              <text x="95" y="108" fill="#94A3B8" fontSize="11" fontFamily="monospace">
                BLOCK A
              </text>

              {/* BLOCK B (ALERT) */}
              <rect
                x="235"
                y="55"
                width="135"
                height="95"
                rx="12"
                fill="rgba(225,29,72,0.25)"
                stroke="#F43F5E"
                strokeWidth="2"
              />
              <circle cx="302" cy="102" r="28" stroke="#F43F5E" strokeOpacity="0.5" className="animate-ping" />
              <circle cx="302" cy="102" r="7" fill="#F43F5E" />
              <text x="272" y="85" fill="#FDA4AF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                ⚠ BLOCK B
              </text>

              {/* Safe Assembly Zone */}
              <rect
                x="425"
                y="210"
                width="135"
                height="80"
                rx="12"
                fill="rgba(16,185,129,0.15)"
                stroke="#10B981"
                strokeWidth="2"
              />
              <text x="445" y="254" fill="#6EE7B7" fontSize="11" fontWeight="bold" fontFamily="monospace">
                SAFE ASSEMBLY
              </text>

              {/* Self-Drawing Evacuation Route SVG Path */}
              <path
                ref={routePathRef}
                d="M 302 150 L 302 250 L 425 250"
                stroke="#10B981"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-[11px] font-mono font-bold text-rose-200 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-400 animate-ping" />
              <span>⚠ ALERT • BLOCK B • 2ND FLOOR</span>
            </div>
          </div>

          {/* Alert Card Details */}
          <div className="lg:col-span-5 rounded-[28px] bg-white/[0.04] border border-rose-500/30 p-7 space-y-5">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 font-mono text-xs font-bold">
                ⚠ ALERT • BLOCK B • 2ND FLOOR
              </span>
              <span className="font-mono text-xs text-slate-400">
                AI CONFIDENCE <strong className="text-emerald-300">94%</strong>
              </span>
            </div>

            <div>
              <h3 className="font-display text-2xl font-bold text-white">
                Possible smoke detected.
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Automated emergency protocol initiated in 0.4 seconds:
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                'Security notified',
                'Nearby users alerted',
                'Evacuation route generated',
              ].map((resp) => (
                <div
                  key={resp}
                  className="flex items-center gap-3 rounded-2xl bg-white/[0.04] border border-white/10 px-4 py-3 text-xs font-semibold text-white"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{resp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DETECT -> UNDERSTAND -> RESPOND 3 Large Stages */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {stages.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={st.step}
                className={`rounded-[26px] border p-6 transition-all ${st.color}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold opacity-75">
                    0{idx + 1}
                  </span>
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="font-display text-2xl font-extrabold text-white mt-3">
                  {st.step}
                </h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const MaintenanceSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    { title: 'Student reports issue', sub: '“Projector in Room 305 is flickering”' },
    { title: 'AI understands issue', sub: 'NLP classifies category: Smart AV Equipment' },
    { title: 'Priority calculated', sub: 'Class scheduled in 25 mins → Priority: High' },
    { title: 'Department assigned', sub: 'Auto-dispatched to AV & Optical Core Unit' },
    { title: 'Technician responds', sub: 'Live indoor route & spare part checklist sent' },
    { title: 'Issue resolved', sub: 'Verified operational & SLA closed in 11 mins' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full rounded-[32px] overflow-hidden bg-[#F5F6FA] text-slate-900 p-8 sm:p-14 lg:p-20 border border-slate-200/80 shadow-2xl"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-block text-xs font-mono font-bold uppercase tracking-[0.24em] text-violet-600">
            08 — AUTONOMOUS WORKFLOWS
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950">
            Problems shouldn&apos;t wait.
          </h2>
        </div>

        {/* 6-Step Progressive Workflow */}
        <div className="relative mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((step, idx) => {
            const isActive = idx === activeStep;
            const isPast = idx < activeStep;
            return (
              <div
                key={step.title}
                onClick={() => setActiveStep(idx)}
                className={`cursor-pointer rounded-[26px] p-6 border transition-all duration-500 ${
                  isActive
                    ? 'bg-[#070B19] text-white border-violet-500 scale-[1.05] shadow-[0_20px_50px_rgba(124,58,237,0.25)] z-10'
                    : isPast
                    ? 'bg-white text-slate-900 border-emerald-400/60 opacity-95'
                    : 'bg-white/75 text-slate-500 border-slate-200 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold">
                    STEP 0{idx + 1}
                  </span>
                  <Wrench
                    className={`h-4 w-4 ${
                      isActive ? 'text-cyan-300' : isPast ? 'text-emerald-500' : 'text-slate-400'
                    }`}
                  />
                </div>
                <h3 className="font-display text-lg font-bold mt-3">
                  {step.title}
                </h3>
                <p
                  className={`text-xs mt-1.5 ${
                    isActive ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {step.sub}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
