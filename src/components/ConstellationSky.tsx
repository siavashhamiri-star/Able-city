import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Star, Heart, Compass, ShieldCheck, Rocket, MessageSquare, Info, Zap, Share2 } from 'lucide-react';
import { WorkItem, Mission, ChatMessage, AbleUser } from '../types';
import { sounds } from '../lib/sound';

interface StarNode {
  id: string;
  type: 'work' | 'mission' | 'chat';
  title: string;
  author: string;
  score: number;
  x: number; // percentage 5% to 95%
  y: number; // percentage 10% to 90%
  color: string;
  glow: string;
  size: number;
  details: string;
  connections: string[]; // ids of connected stars
}

interface ConstellationSkyProps {
  works: WorkItem[];
  missions: Mission[];
  chatMessages: ChatMessage[];
  currentUser: AbleUser;
  onShowToast: (msg: string) => void;
}

export const ConstellationSky: React.FC<ConstellationSkyProps> = ({
  works,
  missions,
  chatMessages,
  currentUser,
  onShowToast,
}) => {
  const [stars, setStars] = useState<StarNode[]>([]);
  const [selectedStar, setSelectedStar] = useState<StarNode | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'work' | 'mission' | 'chat'>('all');
  const [isSparkling, setIsSparkling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate constellation nodes based on user's living data
  useEffect(() => {
    const generated: StarNode[] = [];

    // Works as big bright stars
    works.forEach((w, idx) => {
      // Deterministic layout coordinates
      const angle = (idx / Math.max(1, works.length)) * Math.PI * 2;
      const radius = 28 + (idx % 3) * 8;
      const x = 50 + radius * Math.cos(angle);
      const y = 48 + radius * 0.75 * Math.sin(angle);

      const color =
        w.statusClass === 'status-supported'
          ? '#c084fc'
          : w.statusClass === 'status-trending'
          ? '#f59e0b'
          : '#38bdf8';

      generated.push({
        id: `work-${w.id}`,
        type: 'work',
        title: w.title,
        author: w.author,
        score: w.likesCount * 10 + (w.peerReviewsCount || 0) * 20,
        x: Math.max(8, Math.min(92, x)),
        y: Math.max(12, Math.min(88, y)),
        color,
        glow: `rgba(${color === '#c084fc' ? '192, 132, 252' : color === '#f59e0b' ? '245, 158, 11' : '56, 189, 248'}, 0.7)`,
        size: Math.min(18, 10 + (w.likesCount || 1) * 1.5),
        details: w.description || `اثر ارزشمند در رده «${w.category || 'پروژه'}» با ${w.likesCount} حامی`,
        connections: [],
      });
    });

    // Completed missions as golden stars
    const completedMissions = missions.filter((m) => m.completed);
    completedMissions.forEach((m, idx) => {
      const angle = (idx / Math.max(1, completedMissions.length)) * Math.PI * 2 + 0.4;
      const radius = 18 + (idx % 2) * 10;
      const x = 50 + radius * Math.cos(angle);
      const y = 50 + radius * 0.7 * Math.sin(angle);

      generated.push({
        id: `mission-${m.id}`,
        type: 'mission',
        title: m.title,
        author: 'سنگر سازندگان',
        score: m.reward,
        x: Math.max(12, Math.min(88, x)),
        y: Math.max(16, Math.min(84, y)),
        color: '#10b981',
        glow: 'rgba(16, 185, 129, 0.7)',
        size: 11,
        details: m.proofNote
          ? `اثبات کار ثبت‌شده: ${m.proofNote}`
          : `مأموریت تکمیل‌شده با پاداش +${m.reward} XP`,
        connections: [],
      });
    });

    // Warm empathy chat messages as soft nebula stars
    chatMessages.slice(0, 8).forEach((c, idx) => {
      const angle = (idx / 8) * Math.PI * 2 + 1.2;
      const radius = 38;
      const x = 50 + radius * Math.cos(angle);
      const y = 52 + radius * 0.8 * Math.sin(angle);

      generated.push({
        id: `chat-${c.id}`,
        type: 'chat',
        title: `دل‌نوشته: ${c.text.slice(0, 24)}...`,
        author: c.author,
        score: c.likes * 5,
        x: Math.max(6, Math.min(94, x)),
        y: Math.max(10, Math.min(90, y)),
        color: '#f43f5e',
        glow: 'rgba(244, 63, 94, 0.65)',
        size: 8 + (c.likes || 1),
        details: c.text,
        connections: [],
      });
    });

    // Build constellation lines connecting nearby stars of solidarity
    for (let i = 0; i < generated.length; i++) {
      for (let j = i + 1; j < generated.length; j++) {
        const dx = generated[i].x - generated[j].x;
        const dy = generated[i].y - generated[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        // Connect if close enough (creates organic constellation web)
        if (dist < 26) {
          generated[i].connections.push(generated[j].id);
        }
      }
    }

    setStars(generated);
  }, [works, missions, chatMessages]);

  const handleSelectStar = (star: StarNode) => {
    setSelectedStar(star);
    sounds.playHeart();
    setIsSparkling(true);
    setTimeout(() => setIsSparkling(false), 600);
  };

  const filteredStars = stars.filter((s) => {
    if (filterType === 'all') return true;
    return s.type === filterType;
  });

  return (
    <div className="space-y-3.5">
      {/* Narrative Header */}
      <div className="rounded-2xl border border-[#38bdf8]/30 bg-gradient-to-br from-[#0c1226] via-[#050814] to-[#020308] p-3.5 shadow-sm space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#38bdf8]/30 to-[#c084fc]/30 border border-[#38bdf8]/40 flex items-center justify-center text-[#38bdf8]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm text-white flex items-center gap-1.5">
                <span>آسمان‌نمای ستاره‌ای ارزش (Living Constellation)</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-300 font-bold border border-amber-500/25">
                  کهکشان زنده
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                هر دستاورد، مأموریتِ اثبات‌شده و دل‌نوشته رفاقتی ستاره‌ای در کهکشان شهر متولد می‌کند.
              </p>
            </div>
          </div>

          {/* Type filters */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                filterType === 'all'
                  ? 'bg-[#38bdf8] text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              کل کهکشان ({stars.length})
            </button>
            <button
              onClick={() => setFilterType('work')}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                filterType === 'work'
                  ? 'bg-[#c084fc] text-slate-950'
                  : 'text-slate-400 hover:text-purple-300'
              }`}
            >
              آثار 🚀
            </button>
            <button
              onClick={() => setFilterType('mission')}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                filterType === 'mission'
                  ? 'bg-emerald-400 text-slate-950'
                  : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              مأموریت‌ها 🛡️
            </button>
            <button
              onClick={() => setFilterType('chat')}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                filterType === 'chat'
                  ? 'bg-rose-400 text-slate-950'
                  : 'text-slate-400 hover:text-rose-300'
              }`}
            >
              پناهگاه ❤️
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Cosmos Canvas Viewport */}
      <div
        ref={containerRef}
        className="relative w-full h-[360px] sm:h-[420px] rounded-2xl bg-gradient-to-b from-[#02040b] via-[#050816] to-[#010206] border border-[#1e293b] overflow-hidden select-none shadow-[inset_0_0_80px_rgba(0,0,0,0.9)] cursor-crosshair"
      >
        {/* Ambient Nebula Clouds */}
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-[#38bdf8]/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#c084fc]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Ambient tiny dust stars */}
        <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* SVG Constellation lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {stars.map((star) =>
            star.connections.map((targetId) => {
              const target = stars.find((s) => s.id === targetId);
              if (!target) return null;
              // Avoid drawing lines twice
              if (star.id > target.id) return null;

              const isConnectedToSelected =
                selectedStar &&
                (selectedStar.id === star.id || selectedStar.id === target.id);

              return (
                <line
                  key={`${star.id}-${target.id}`}
                  x1={`${star.x}%`}
                  y1={`${star.y}%`}
                  x2={`${target.x}%`}
                  y2={`${target.y}%`}
                  stroke={
                    isConnectedToSelected
                      ? 'rgba(56, 189, 248, 0.7)'
                      : 'rgba(255, 255, 255, 0.12)'
                  }
                  strokeWidth={isConnectedToSelected ? '1.8' : '0.8'}
                  strokeDasharray={isConnectedToSelected ? 'none' : '3 3'}
                  className="transition-all duration-300"
                />
              );
            })
          )}
        </svg>

        {/* Interactive Star Nodes */}
        {filteredStars.map((star) => {
          const isSelected = selectedStar?.id === star.id;

          return (
            <button
              key={star.id}
              onClick={() => handleSelectStar(star)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 focus:outline-none group transition-transform duration-200 hover:scale-130 active:scale-95"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                zIndex: isSelected ? 30 : 10,
              }}
              title={`${star.title} (${star.author})`}
            >
              {/* Outer pulsing ring for selected or high-score stars */}
              {isSelected && (
                <div
                  className="absolute inset-0 rounded-full animate-ping opacity-75 pointer-events-none"
                  style={{
                    backgroundColor: star.color,
                    width: `${star.size + 14}px`,
                    height: `${star.size + 14}px`,
                    marginLeft: '-7px',
                    marginTop: '-7px',
                  }}
                />
              )}

              {/* Star Core Dot */}
              <div
                className={`rounded-full transition-all duration-300 ${
                  isSelected ? 'ring-2 ring-white scale-125' : ''
                }`}
                style={{
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  backgroundColor: star.color,
                  boxShadow: `0 0 ${isSelected ? '18px' : '10px'} ${star.glow}`,
                }}
              />

              {/* Micro author/title label on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-slate-950/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded border border-slate-700 pointer-events-none">
                {star.author}: {star.title.slice(0, 16)}
              </div>
            </button>
          );
        })}

        {/* Center Cosmos Core Hint if nothing selected */}
        {!selectedStar && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-center text-[10px] text-slate-400 bg-slate-950/80 px-3 py-1 rounded-full border border-slate-800 backdrop-blur-xs flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#38bdf8] animate-spin" />
            <span>روی هر ستاره کلیک کنید تا نور سازندگی و مشخصات رفیق سازنده آشکار شود</span>
          </div>
        )}

        {/* Selected Star Interactive Glass Card (Float Inspector) */}
        {selectedStar && (
          <div className="absolute top-3 left-3 right-3 sm:right-auto sm:w-80 rounded-xl bg-slate-950/95 border border-[#38bdf8]/40 p-3 text-xs shadow-2xl backdrop-blur-md animate-fade-in z-40 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span
                  className="text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider"
                  style={{
                    backgroundColor: `${selectedStar.color}20`,
                    color: selectedStar.color,
                    borderColor: `${selectedStar.color}40`,
                  }}
                >
                  {selectedStar.type === 'work'
                    ? 'اثر ارزشمند شهری'
                    : selectedStar.type === 'mission'
                    ? 'مأموریت اثبات‌شده'
                    : 'پیام پناهگاه همدلی'}
                </span>
                <h4 className="font-bold text-white text-xs mt-1 leading-tight">
                  {selectedStar.title}
                </h4>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  خلق‌شده توسط: <strong className="text-amber-400">{selectedStar.author}</strong>
                </div>
              </div>

              <button
                onClick={() => setSelectedStar(null)}
                className="text-slate-400 hover:text-white text-sm p-0.5"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              {selectedStar.details}
            </p>

            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px]">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-400" />
                درخشش ارزش: {selectedStar.score} پوینت
              </span>
              <button
                onClick={() => {
                  sounds.playHeart();
                  onShowToast(`✨ نور ستاره «${selectedStar.title}» در کهکشان تکثیر شد`);
                }}
                className="px-2 py-0.5 rounded bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30 hover:bg-[#38bdf8]/25 font-bold transition-colors flex items-center gap-1"
              >
                <Heart className="w-2.5 h-2.5" />
                تزریق نور رفاقتی
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
