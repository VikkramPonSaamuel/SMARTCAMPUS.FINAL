import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Sparkles, CheckCircle2, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { SmartAlert } from '../../types/campus';
import { useCampus } from '../../context/CampusContext';

interface AlertCardProps {
  alert: SmartAlert;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert }) => {
  const [expanded, setExpanded] = useState(false);
  const { acknowledgeAlert, setSelectedBuildingId } = useCampus();

  const severityStyles = {
    critical: {
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/35',
      border: 'border-rose-500/30 hover:border-rose-400/50',
      icon: 'text-rose-400 bg-rose-500/15',
    },
    warning: {
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/35',
      border: 'border-amber-500/25 hover:border-amber-400/45',
      icon: 'text-amber-400 bg-amber-500/15',
    },
    normal: {
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/35',
      border: 'border-cyan-400/25 hover:border-cyan-400/45',
      icon: 'text-cyan-400 bg-cyan-500/15',
    },
  }[alert.severity];

  return (
    <motion.div
      layout
      className={`rounded-2xl bg-[#080D1C]/85 backdrop-blur-xl border p-4 transition-all ${
        alert.acknowledged ? 'border-white/[0.06] opacity-65' : severityStyles.border
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${severityStyles.icon}`}>
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-rose-400">
                SMART ALERT
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                • {alert.timestamp}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mt-0.5">
              {alert.title}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1">
              <MapPin className="h-3 w-3 text-cyan-400" />
              {alert.location}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">
            AI confidence
          </span>
          <span className="font-mono text-sm font-bold text-cyan-300 flex items-center justify-end gap-1">
            <Sparkles className="h-3 w-3" />
            {alert.aiConfidence}%
          </span>
        </div>
      </div>

      {/* Expandable Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-white/[0.08] text-xs space-y-2 overflow-hidden"
          >
            <p className="text-slate-300 leading-relaxed">{alert.description}</p>
            <div className="p-2.5 rounded-xl bg-cyan-500/[0.07] border border-cyan-400/25">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-semibold block">
                AI Recommended Mitigation
              </span>
              <p className="text-slate-200 mt-0.5">{alert.recommendation}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Action Bar */}
      <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between gap-2">
        <button
          onClick={() => {
            setExpanded(!expanded);
            setSelectedBuildingId(alert.buildingId);
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-cyan-200 transition-colors"
        >
          <span>{expanded ? 'Hide Details' : 'View Details'}</span>
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>

        {!alert.acknowledged ? (
          <button
            onClick={() => acknowledgeAlert(alert.id)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/10 text-[11px] font-medium transition-all"
          >
            <CheckCircle2 className="h-3 w-3" />
            Acknowledge
          </button>
        ) : (
          <span className="text-[11px] font-mono text-emerald-400">
            ● Acknowledged
          </span>
        )}
      </div>
    </motion.div>
  );
};
