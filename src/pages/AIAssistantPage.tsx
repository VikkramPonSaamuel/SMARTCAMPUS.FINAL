import React, { useState } from 'react';
import {
  Sparkles,
  School,
  Navigation,
  Zap,
  Wrench,
  Car,
  KeyRound,
  CheckCircle2,
  UtensilsCrossed,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { AIAssistant } from '../components/ai/AIAssistant';
import { AIOrb } from '../components/ai/AIOrb';
import { GlassCard } from '../components/ui/GlassCard';

export const AIAssistantPage: React.FC = () => {
  const {
    sendAiMessage,
    isAiTyping,
    geminiApiKey,
    setGeminiApiKey,
    aiModelUsed,
  } = useCampus();

  const [showKey, setShowKey] = useState(false);

  const commandCards = [
    {
      title: 'Smart Canteen Menus & QR',
      prompt: 'What are the popular dishes and prices at 1. MOJO Cafe, 2. JEVAN, and 3. SSS Canteen?',
      desc: 'Queries live menus across MOJO Cafe, JEVAN, and SSS Canteen.',
      icon: UtensilsCrossed,
    },
    {
      title: 'Smart Classroom Finder',
      prompt: 'Find an available classroom near Block B with AC and projector.',
      desc: 'Locates nearest open lecture suite with AC & 4K laser projection.',
      icon: School,
    },
    {
      title: 'Energy Anomaly Analysis',
      prompt: 'Analyze campus energy consumption and solar offset right now.',
      desc: 'Queries smart breaker telemetry and recommends HVAC damper tuning.',
      icon: Zap,
    },
    {
      title: 'Smart Parking Guidance',
      prompt: 'Find the nearest parking zone with open bays and EV supercharging.',
      desc: 'Checks live bay sensors across Zones A, B, and C.',
      icon: Car,
    },
    {
      title: 'Automated Maintenance Triage',
      prompt: 'Summarize active maintenance tickets and critical priorities.',
      desc: 'Classifies facility faults with 96% AI confidence.',
      icon: Wrench,
    },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pb-8 items-stretch">
      {/* Left Column: AI Neural Core Identity, Connected API Key & Command Macros */}
      <div className="xl:col-span-5 flex flex-col gap-5">
        <GlassCard glow="cyan" className="p-6 text-center flex flex-col items-center">
          <AIOrb size="lg" active={isAiTyping} />
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-800">
            <Sparkles className="h-3 w-3 text-[#008F7A]" />
            GEMINI API CONNECTED • {aiModelUsed.toUpperCase()}
          </div>
          <h2 className="font-display text-2xl font-bold text-[#042f2e] mt-2">
            Campus AI Assistant
          </h2>
          <p className="text-xs text-[#467874] max-w-sm mt-1 leading-relaxed">
            Connected to Google Gemini API + 30 VISTAS Campus Blocks, 3 Smart Canteens (MOJO Cafe, JEVAN, SSS Canteen), and the 3D Digital Twin.
          </p>

          {/* Connected API Key Box */}
          <div className="w-full mt-4 p-3.5 rounded-2xl bg-white/85 border border-teal-600/25 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#008F7A]">
                <KeyRound className="h-3.5 w-3.5" />
                CONNECTED API KEY
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700">
                <CheckCircle2 className="h-3 w-3" /> Active
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type={showKey ? 'text' : 'password'}
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-teal-50/70 border border-teal-600/20 font-mono text-xs font-semibold text-[#042f2e] focus:outline-none focus:border-[#008F7A]"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="p-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-[#007F6E] border border-teal-600/20"
                title={showKey ? 'Hide API Key' : 'Show API Key'}
              >
                {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 w-full mt-4 pt-4 border-t border-teal-600/15 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-white/80 border border-teal-600/15">
              <span className="text-[#467874] block text-[10px]">ENGINE</span>
              <span className="text-[#007F6E] font-bold">Gemini Live</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/80 border border-teal-600/15">
              <span className="text-[#467874] block text-[10px]">BLOCKS</span>
              <span className="text-emerald-700 font-bold">30 Online</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/80 border border-teal-600/15">
              <span className="text-[#467874] block text-[10px]">CANTEENS</span>
              <span className="text-[#008F7A] font-bold">03 Active</span>
            </div>
          </div>
        </GlassCard>

        {/* Quick Neural Macros */}
        <GlassCard className="space-y-3">
          <h3 className="font-display text-sm font-bold text-[#042f2e] flex items-center gap-2">
            <Navigation className="h-4 w-4 text-[#008F7A]" />
            Instant Campus Intelligence Workflows
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {commandCards.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.title}
                  onClick={() => sendAiMessage(cmd.prompt)}
                  className="text-left p-3.5 rounded-xl bg-white/80 hover:bg-teal-500/12 border border-teal-600/15 hover:border-[#008F7A] transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-[#008F7A]">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="text-xs font-bold text-[#042f2e] group-hover:text-[#007F6E]">
                      {cmd.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#467874] mt-1.5 leading-relaxed">
                    {cmd.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Right Column: Full Conversational Workspace */}
      <div className="xl:col-span-7 min-h-[580px]">
        <AIAssistant compact={false} />
      </div>
    </div>
  );
};
