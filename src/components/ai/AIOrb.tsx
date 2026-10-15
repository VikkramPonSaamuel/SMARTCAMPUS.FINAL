import React from 'react';
import { motion } from 'framer-motion';

interface AIOrbProps {
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}

export const AIOrb: React.FC<AIOrbProps> = ({ size = 'md', active = false }) => {
  const dimensions = {
    sm: 'h-9 w-9',
    md: 'h-12 w-12',
    lg: 'h-20 w-20',
  }[size];

  return (
    <div className={`relative flex items-center justify-center ${dimensions} shrink-0`}>
      {/* Outer Ambient Seafoam-Turquoise Halo */}
      <motion.div
        animate={{
          scale: active ? [1, 1.28, 1] : [1, 1.14, 1],
          opacity: active ? [0.5, 0.85, 0.5] : [0.3, 0.55, 0.3],
        }}
        transition={{ duration: active ? 1.6 : 3.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#008F7A] via-[#14B8A6] to-[#99F6E4] blur-md"
      />

      {/* Rotating Orbital Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0.5 rounded-full border border-[#008F7A]/60 border-t-transparent border-l-[#2DD4BF]"
      />

      {/* Counter-rotating Inner Ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-1.5 rounded-full border border-[#14B8A6]/50 border-b-transparent"
      />

      {/* Core Glowing Ocean Turquoise Sphere */}
      <motion.div
        animate={{ scale: active ? [0.92, 1.08, 0.92] : [0.96, 1.03, 0.96] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="relative h-3/5 w-3/5 rounded-full bg-gradient-to-br from-[#99F6E4] via-[#14B8A6] to-[#007F6E] shadow-[0_0_20px_rgba(0,143,122,0.55)]"
      >
        <div className="absolute top-1 left-1 h-1.5 w-1.5 rounded-full bg-white blur-[0.5px]" />
      </motion.div>
    </div>
  );
};
