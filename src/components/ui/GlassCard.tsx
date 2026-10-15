import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  glow?: 'none' | 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose';
  noPadding?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  interactive = false,
  glow = 'none',
  noPadding = false,
  ...rest
}) => {
  const glowStyles: Record<NonNullable<GlassCardProps['glow']>, string> = {
    none: '',
    cyan: 'border-cyan-400/25 shadow-[0_0_25px_-6px_rgba(0,240,255,0.22)]',
    violet: 'border-violet-400/25 shadow-[0_0_25px_-6px_rgba(139,92,246,0.22)]',
    emerald: 'border-emerald-400/25 shadow-[0_0_25px_-6px_rgba(16,185,129,0.22)]',
    amber: 'border-amber-400/25 shadow-[0_0_25px_-6px_rgba(245,158,11,0.22)]',
    rose: 'border-rose-500/30 shadow-[0_0_25px_-6px_rgba(244,63,94,0.25)]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      whileHover={interactive ? { y: -2 } : undefined}
      className={`rounded-2xl ${
        interactive ? 'glass-panel-interactive' : 'glass-panel'
      } ${glowStyles[glow]} ${noPadding ? '' : 'p-5'} ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
