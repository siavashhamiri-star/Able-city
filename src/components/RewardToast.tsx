import React from 'react';
import { Sparkles } from 'lucide-react';

interface RewardToastProps {
  message: string | null;
  isLevelUp?: boolean;
}

export const RewardToast: React.FC<RewardToastProps> = ({ message, isLevelUp }) => {
  if (!message) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full text-xs md:text-sm font-bold shadow-2xl flex items-center gap-2 pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
        isLevelUp
          ? 'bg-gradient-to-r from-[#f59e0b] via-[#c084fc] to-[#38bdf8] text-slate-950 shadow-[0_10px_35px_rgba(245,158,11,0.5)] border border-amber-300 ring-2 ring-amber-300/40'
          : 'bg-[#10b981] text-[#05221a] shadow-[0_10px_25px_rgba(16,185,129,0.35)] border border-emerald-300/40'
      }`}
    >
      <Sparkles className="w-4 h-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
};
