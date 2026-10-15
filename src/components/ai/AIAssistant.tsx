import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, Send, Sparkles, ArrowUpRight, Volume2 } from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { AI_SUGGESTED_PROMPTS } from '../../data/campusData';
import { AIOrb } from './AIOrb';
import { GlassCard } from '../ui/GlassCard';

interface AIAssistantProps {
  compact?: boolean;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ compact = true }) => {
  const { aiMessages, sendAiMessage, isAiTyping, geminiApiKey, aiModelUsed } = useCampus();
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Only scroll to bottom when new messages arrive beyond the initial 2
  useEffect(() => {
    if (scrollRef.current && aiMessages.length > 2) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [aiMessages.length, isAiTyping]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    sendAiMessage(input);
    setInput('');
  };

  const handleVoiceSimulate = () => {
    if (listening) {
      setListening(false);
      return;
    }
    setListening(true);
    setTimeout(() => {
      setListening(false);
      sendAiMessage('Find an available classroom near Block B.');
    }, 1500);
  };

  const maskedKey = geminiApiKey
    ? `${geminiApiKey.slice(0, 9)}...${geminiApiKey.slice(-6)}`
    : 'Not Set';

  return (
    <GlassCard
      glow="cyan"
      className="flex flex-col justify-between h-full relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-teal-600/15">
        <div className="flex items-center gap-3">
          <AIOrb size="sm" active={isAiTyping || listening} />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-base font-bold text-[#042f2e]">
                Campus AI
              </h3>
              <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 border border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                GEMINI API LIVE ({aiModelUsed})
              </span>
            </div>
            <p className="text-[11px] font-mono text-[#467874]">
              Key: {maskedKey} • Connected to 30 Blocks & 3 Canteens
            </p>
          </div>
        </div>
        {compact && (
          <button
            onClick={() => navigate('/ai-assistant')}
            className="p-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-[#007F6E] transition-colors"
            title="Open Full AI Workspace"
          >
            <ArrowUpRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Conversation Feed */}
      <div
        ref={scrollRef}
        className={`my-3 space-y-3 overflow-y-auto pr-1 ${
          compact ? 'max-h-[280px]' : 'max-h-[430px]'
        }`}
      >
        {aiMessages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1 px-1">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#467874]">
                {msg.sender === 'user' ? 'USER' : 'AI'}
              </span>
              <span className="text-[9px] font-mono text-[#467874]">
                {msg.timestamp}
              </span>
            </div>

            <div
              className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                msg.sender === 'user'
                  ? 'btn-ocean-primary bg-gradient-to-r from-[#008F7A] to-[#14B8A6] !text-white shadow-sm rounded-br-xs'
                  : 'bg-white/90 text-[#042f2e] border border-teal-500/25 shadow-xs rounded-bl-xs'
              }`}
            >
              {msg.text}

              {msg.structuredCard && (
                <div className="mt-2.5 pt-2.5 border-t border-teal-500/15 rounded-xl bg-[#EBF9F6] p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#007F6E]">
                      {msg.structuredCard.title}
                    </span>
                    <Sparkles className="h-3 w-3 text-[#008F7A] shrink-0" />
                  </div>
                  <p className="text-[10px] text-[#467874] mt-0.5">
                    {msg.structuredCard.subtitle}
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 mt-2">
                    {msg.structuredCard.metrics.map((m, idx) => (
                      <div
                        key={idx}
                        className="px-2 py-1 rounded-lg bg-white/90 border border-teal-500/15 text-[10px] font-mono"
                      >
                        <span className="text-[#467874] block">{m.label}</span>
                        <span className="text-[#042f2e] font-bold">{m.value}</span>
                      </div>
                    ))}
                  </div>
                  {msg.structuredCard.actionRoute && (
                    <button
                      onClick={() => navigate(msg.structuredCard!.actionRoute!)}
                      className="btn-ocean-primary mt-2 w-full py-1.5 rounded-lg bg-gradient-to-r from-[#008F7A] to-[#14B8A6] !text-white text-[10px] font-semibold flex items-center justify-center gap-1 transition-all shadow-xs"
                    >
                      <span>{msg.structuredCard.actionLabel}</span>
                      <ArrowUpRight className="h-3 w-3 text-white" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* Typing Indicator */}
        {isAiTyping && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 border border-teal-500/25 w-fit">
            <span className="text-[10px] font-mono font-semibold text-[#008F7A]">
              Campus AI synthesizing
            </span>
            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#008F7A] animate-bounce" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#14B8A6] animate-bounce [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#2DD4BF] animate-bounce [animation-delay:300ms]" />
            </span>
          </div>
        )}
      </div>

      {/* Bottom Controls: Suggested Prompts + Input */}
      <div className="pt-2 border-t border-teal-600/15 space-y-2.5">
        {/* Suggested Prompts */}
        <div className="flex flex-wrap gap-1.5">
          {AI_SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => sendAiMessage(prompt)}
              className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-white/80 hover:bg-teal-500/15 text-[#1f5754] hover:text-[#007F6E] border border-teal-500/20 hover:border-teal-500/40 transition-all"
            >
              "{prompt}"
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <div className="relative flex-1 flex items-center rounded-xl bg-white/90 border border-teal-500/25 focus-within:border-[#008F7A] px-3 py-2 shadow-inner">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                listening
                  ? 'Listening to voice command...'
                  : 'Ask Campus AI anything...'
              }
              className="w-full bg-transparent text-xs text-[#042f2e] placeholder-[#467874] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleVoiceSimulate}
              title="Voice Input"
              className={`ml-1.5 p-1 rounded-lg transition-colors ${
                listening
                  ? 'bg-rose-500/15 text-rose-600 animate-pulse'
                  : 'text-[#008F7A] hover:text-[#042f2e]'
              }`}
            >
              {listening ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </button>
          </div>

          <motion.button
            whileTap={{ scale: 0.94 }}
            type="submit"
            className="btn-ocean-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#008F7A] to-[#14B8A6] text-white shadow-md transition-all"
            aria-label="Send message"
          >
            <Send className="h-4 w-4 text-white" />
          </motion.button>
        </form>
      </div>
    </GlassCard>
  );
};
