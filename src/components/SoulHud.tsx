import React, { useState } from 'react';
import { AbleUser } from '../types';
import { TranslationDictionary } from '../lib/i18n';
import { Crown, Zap, Shield, Volume2, VolumeX, Sparkles, UserCheck, Edit3, ShieldAlert, CheckCircle, Flame, ChevronDown, ChevronUp, AlertCircle, Compass } from 'lucide-react';
import { sounds } from '../lib/sound';

interface SoulHudProps {
  user: AbleUser;
  t: TranslationDictionary;
  onUpdateUser: (updated: Partial<AbleUser>) => void;
  onOpenAuth: () => void;
  onShowToast: (msg: string) => void;
}

export const SoulHud: React.FC<SoulHudProps> = ({ user, t, onUpdateUser, onOpenAuth, onShowToast }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState(user.bio || '');
  const [isMuted, setIsMuted] = useState(sounds.getMuted());

  // Next level threshold calculation: level * 300
  const currentThreshold = user.level * 300;
  const prevThreshold = (user.level - 1) * 300;
  const levelProgressXp = Math.max(0, user.xp - prevThreshold);
  const levelNeededXp = currentThreshold - prevThreshold;
  const progressPercent = Math.min(100, Math.round((levelProgressXp / levelNeededXp) * 100));

  // Daily Caps calculation
  const dailyXp = user.dailyXpEarned ?? 180;
  const dailyXpCap = user.dailyXpCap ?? 600;
  const dailyXpPercent = Math.min(100, Math.round((dailyXp / dailyXpCap) * 100));
  const isXpCapped = dailyXp >= dailyXpCap;

  const dailyRep = user.dailyRepEarned ?? 5;
  const dailyRepCap = user.dailyRepCap ?? 20;

  const toggleMute = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    onShowToast(muted ? '🔇 صدای سیستم بی‌صدا شد' : '🔊 صدای افکت‌ها فعال شد');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    onUpdateUser({
      name: editName.trim(),
      bio: editBio.trim(),
    });
    setIsEditing(false);
    sounds.playPublish();
    onShowToast('✨ مشخصات روحی شما در ABLE City به‌روزرسانی شد');
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#101426] via-[#080d1a] to-[#03060e] border border-[#38bdf8]/25 p-3 md:p-3.5 mb-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md">
      {/* Ambient background glows */}
      <div className="absolute -top-12 -left-12 w-28 h-28 bg-[#38bdf8]/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-[#c084fc]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Main clean compact row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#38bdf8]/20 to-[#c084fc]/30 border border-[#38bdf8]/30 flex items-center justify-center text-sm font-black text-[#38bdf8] shadow-sm">
            {user.name.slice(0, 1) || 'س'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm md:text-base font-black text-white tracking-tight">
                {user.name}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">({user.role})</span>

              {user.isVerified ? (
                <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-semibold">
                  <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />
                  تأییدشده
                </span>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-colors font-bold"
                >
                  <ShieldAlert className="w-2.5 h-2.5 text-amber-400" />
                  ثبت‌نام رسمی
                </button>
              )}

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-slate-500 hover:text-[#38bdf8] transition-colors p-0.5"
                title={t.editProfile}
              >
                <Edit3 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats and Controls with Daily Cap Guard */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Daily Streak Fire */}
          <div
            className="flex items-center gap-1 text-[11px] font-black px-2 py-1 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/25 shadow-xs"
            title="روزهای پیاپی پایداری و حضور در شهر"
          >
            <Flame className="w-3 h-3 fill-amber-400" />
            <span>{user.streakDays || 4} روز</span>
          </div>

          {/* Level */}
          <div className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg bg-slate-850 bg-slate-900 border border-slate-800 text-slate-200">
            <span>سطح {user.level}</span>
          </div>

          {/* Total XP & Daily Cap Counter */}
          <div
            className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg border transition-all ${
              isXpCapped
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/40'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
            }`}
            title={`کل: ${user.xp} XP | سقف روزانه: ${dailyXp} از ${dailyXpCap} XP ${isXpCapped ? '(سقف امروز پر شد)' : ''}`}
          >
            <Zap className="w-3 h-3" />
            <span>{user.xp.toLocaleString()} XP</span>
            <span className="text-[9px] text-slate-400 font-normal mr-0.5">
              ({dailyXp}/{dailyXpCap} سقف امروز)
            </span>
          </div>

          {/* Rep */}
          <div
            className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg bg-[#c084fc]/10 text-[#c084fc] border border-[#c084fc]/25"
            title={`شاخص اعتبار کیفی: ${user.rep} | اعتبار امروز: ${dailyRep} از ${dailyRepCap}`}
          >
            <Shield className="w-3 h-3" />
            <span>اعتبار {user.rep}</span>
          </div>

          <button
            onClick={toggleMute}
            className="p-1 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white transition-colors"
            title={isMuted ? 'فعال‌سازی صدا' : 'قطع صدا'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#38bdf8]" />}
          </button>

          <button
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
            className="p-1 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-[#38bdf8] transition-colors"
            title="نمایش سقف روزانه و جزئیات"
          >
            {isDetailsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Thin Level Progress Bar */}
      <div className="mt-2">
        <div className="w-full h-1 rounded-full bg-slate-950 border border-slate-800/80 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#c084fc] transition-all duration-500 shadow-xs"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Expandable Anti-Burnout / Daily Cap Info & Bio */}
      {isDetailsOpen && (
        <div className="mt-2.5 pt-2 border-t border-slate-800/60 text-xs space-y-2">
          {/* Anti-Burnout & Daily Ceiling explanation */}
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
                <span className="flex items-center gap-1 font-semibold text-[#38bdf8]">
                  <Compass className="w-3 h-3" />
                  سقف سلامت و ضدفرسودگی امروز:
                </span>
                <span className="font-mono text-xs">{dailyXpPercent}٪</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mb-1">
                <div
                  className={`h-full rounded-full transition-all ${
                    isXpCapped ? 'bg-amber-400' : 'bg-[#38bdf8]'
                  }`}
                  style={{ width: `${dailyXpPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                {isXpCapped
                  ? '⚠️ سقف تجربه امروز شما تکمیل شد. برای حفظ سلامت روان، امتیاز جدید تا فردا منظور نمی‌شود تا استراحت کنید.'
                  : `تا سقف استراحت روزانه ${dailyXpCap - dailyXp} XP باقی مانده است.`}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
                <span className="flex items-center gap-1 font-semibold text-[#c084fc]">
                  <Shield className="w-3 h-3" />
                  سقف اعتبار اخلاقی (Rep):
                </span>
                <span className="font-mono text-xs">{dailyRep} / {dailyRepCap}</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                اعتبار صرفاً از طریق اثبات کار و بازبینی کارشناسی همتایان افزایش می‌یابد و با کلیک تصادفی رشد نمی‌کند.
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#38bdf8]" />
              پیشرفت تا سطح {user.level + 1}
            </span>
            <span className="font-mono text-slate-300">
              {levelProgressXp.toLocaleString()} / {levelNeededXp.toLocaleString()} XP
            </span>
          </div>

          <div className="text-slate-300 leading-relaxed flex items-start gap-1.5 italic bg-slate-950/40 p-2 rounded-xl border border-slate-900 text-[11px]">
            <span className="text-[#38bdf8] font-bold">“</span>
            <span>{user.bio || t.defaultBio}</span>
            <span className="text-[#38bdf8] font-bold">”</span>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="mt-2.5 pt-2 border-t border-slate-800/60 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">نام یا شناسه رفاقتی:</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-[#38bdf8] outline-none"
                placeholder="نام خود را وارد کنید..."
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">شعار روحی / مانیفست فردی:</label>
              <input
                type="text"
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-[#38bdf8] outline-none"
                placeholder="حرف دلت برای حضور در شهر..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="text-xs px-3 py-1 rounded-lg bg-[#38bdf8] text-slate-950 font-bold hover:opacity-90 flex items-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5" />
              {t.saveChanges}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
