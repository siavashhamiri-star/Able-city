import React, { useState } from 'react';
import { LeagueMember } from '../types';
import { Trophy, Medal, Zap, Shield, ArrowUpRight, Award } from 'lucide-react';

interface LeagueTabProps {
  members: LeagueMember[];
  currentUserName: string;
}

export const LeagueTab: React.FC<LeagueTabProps> = ({ members, currentUserName }) => {
  const [sortBy, setSortBy] = useState<'xp' | 'rep'>('xp');

  const sortedMembers = [...members].sort((a, b) => {
    if (sortBy === 'xp') {
      return b.xp - a.xp;
    }
    return b.rep - a.rep;
  });

  const getRankBadge = (index: number) => {
    const rank = index + 1;
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 font-black shadow-[0_0_15px_rgba(251,191,36,0.3)]">
          <Medal className="w-4 h-4 text-amber-400" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-xl bg-slate-300/20 border border-slate-300/50 flex items-center justify-center text-slate-200 font-black">
          <Medal className="w-4 h-4 text-slate-300" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-xl bg-amber-700/20 border border-amber-700/50 flex items-center justify-center text-amber-600 font-black">
          <Medal className="w-4 h-4 text-amber-600" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 font-black text-xs">
        #{rank}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Overview Card */}
      <div className="rounded-xl border border-slate-800 bg-[#020409] p-4 shadow-[0_10px_30px_rgba(56,189,248,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#f59e0b]" />
            <h3 className="font-bold text-sm md:text-base text-[#38bdf8]">
              🏆 لیگ برتر ارزش‌آفرینان شهر
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-xs bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setSortBy('xp')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                sortBy === 'xp'
                  ? 'bg-[#38bdf8] text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              بر اساس تجربه (XP)
            </button>
            <button
              onClick={() => setSortBy('rep')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                sortBy === 'rep'
                  ? 'bg-[#c084fc] text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              بر اساس اعتبار (Rep)
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          جایگاه رفیقان بر پایه ثبات در مأموریت‌ها، کیفیت آثار منتشرشده و همدلی با دیگران سنجیده می‌شود. در این جدول هیچ تلاشی پنهان نمی‌ماند.
        </p>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2">
        {sortedMembers.map((member, index) => {
          const isMe = member.name === currentUserName || member.isCurrent;
          const displayRank = index + 1;

          return (
            <div
              key={member.name}
              className={`rounded-xl p-3.5 border transition-all duration-200 flex items-center justify-between gap-3 ${
                isMe
                  ? 'bg-[#1e1b4b]/50 border-[#38bdf8]/60 shadow-[0_0_20px_rgba(56,189,248,0.15)] ring-1 ring-[#38bdf8]/40'
                  : 'bg-[#0b101d] border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                {getRankBadge(index)}

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100">
                      {member.name}
                    </span>
                    {isMe && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/40 font-bold">
                        شما
                      </span>
                    )}
                    <span className="text-[11px] text-[#c084fc] flex items-center gap-1">
                      <Award className="w-3 h-3 text-[#c084fc]" />
                      {member.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1 text-[#10b981] font-semibold">
                      <Zap className="w-3 h-3" />
                      {member.xp.toLocaleString('fa-IR')} XP
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="flex items-center gap-1 text-[#c084fc] font-semibold">
                      <Shield className="w-3 h-3" />
                      {member.rep} Rep
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 text-left">
                <span className="text-[11px] text-emerald-400/90 font-medium flex items-center gap-0.5 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  <ArrowUpRight className="w-3 h-3" />
                  رتبه #{displayRank}
                </span>
                {member.growth && (
                  <div className="text-[10px] text-slate-500 mt-1">
                    {member.growth}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
