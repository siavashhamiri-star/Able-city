import React, { useState } from 'react';
import { Sparkles, Flame, Send, Brain, Zap, Heart, Compass, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { AbleUser, Mission } from '../types';
import { sounds } from '../lib/sound';

interface AbleEchoProps {
  user: AbleUser;
  language: string;
  onAddMission: (mission: Omit<Mission, 'id' | 'completed'>) => void;
  onShowToast: (msg: string) => void;
}

type EchoMode = 'comfort' | 'decompose' | 'ignite' | 'strategist';

export const AbleEcho: React.FC<AbleEchoProps> = ({
  user,
  language,
  onAddMission,
  onShowToast,
}) => {
  const [selectedMode, setSelectedMode] = useState<EchoMode>('ignite');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState<string | null>(
    `سلام سیاوش جان! من «پژواک توانا» هستم. بگو چه کاری پیش رو داری تا مشت اول رو با هم بزنیم یا بار سنگین ذهن رو سبک کنیم.`
  );
  const [suggestedMission, setSuggestedMission] = useState<{
    title: string;
    reward: number;
    repReward: number;
    scope: 'personal';
    category: 'personal';
  } | null>({
    title: 'تعریف گام اول ۲ دقیقه‌ای روی پروژه امروز',
    reward: 120,
    repReward: 4,
    scope: 'personal',
    category: 'personal',
  });

  const modes: { id: EchoMode; title: string; desc: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'ignite',
      title: 'شعله انگیزه و شور',
      desc: 'آتش زدن به تنبلی و زنده کردن اراده',
      icon: <Flame className="w-3.5 h-3.5 text-amber-400" />,
      color: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    },
    {
      id: 'decompose',
      title: 'خردکننده سنگر (ADHD)',
      desc: 'خرد کردن کوه کار به ۳ لقمه ۲ دقیقه‌ای',
      icon: <Brain className="w-3.5 h-3.5 text-[#38bdf8]" />,
      color: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
    },
    {
      id: 'comfort',
      title: 'مرهم روحی',
      desc: 'تسکین رنج، شکست و رفع اضطراب',
      icon: <Heart className="w-3.5 h-3.5 text-rose-400" />,
      color: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
    },
    {
      id: 'strategist',
      title: 'استراتژیست شهر',
      desc: 'هدایت معمارانه به سمت ارزش پایدار',
      icon: <Compass className="w-3.5 h-3.5 text-emerald-400" />,
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    },
  ];

  const handleAsk = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inputPrompt;
    if (!promptToSend.trim() && !customPrompt) return;

    setLoading(true);
    setSuggestedMission(null);

    try {
      const res = await fetch('/api/soul-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend || 'یک الهام کوتاه، برادرانه و آتشین برای شور و ادامه ساخت شهر به من بده.',
          language,
          userName: user.name,
          userRole: user.role,
          mode: selectedMode,
          adhdMode: selectedMode === 'decompose',
        }),
      });

      const data = await res.json();
      if (data.advice) {
        setResponseMsg(data.advice);
        sounds.playLevelUp();
        if (data.suggestedMission) {
          setSuggestedMission(data.suggestedMission);
        }
      } else {
        setResponseMsg('🕊️ رفیق، پیوند جان‌های ما ناگسستنی است. گامی بردار و نگران پایان نباش.');
      }
    } catch {
      setResponseMsg('🕊️ حتی در سکوت و آفلاین بودن، نبض تلاش تو شهر را گرم نگه می‌دارد.');
    } finally {
      setLoading(false);
      setInputPrompt('');
    }
  };

  const handleConvertMission = () => {
    if (!suggestedMission) return;
    onAddMission({
      title: suggestedMission.title,
      description: 'پیشنهاد هوشمند پژواک توانا بر اساس نیاز فعلی شما',
      reward: suggestedMission.reward,
      repReward: suggestedMission.repReward,
      category: 'personal',
      scope: 'personal',
    });
    setSuggestedMission(null);
    sounds.playPublish();
    onShowToast(`🎯 مأموریت شخصی جدید به سنگر شما اضافه شد (+${suggestedMission.reward} XP)`);
  };

  return (
    <div className="rounded-2xl border border-[#38bdf8]/30 bg-gradient-to-b from-[#0f172a] via-[#050914] to-[#020409] p-3 md:p-4 shadow-[0_8px_30px_rgba(0,0,0,0.3)] relative overflow-hidden mb-3.5">
      {/* Background flare */}
      <div className="absolute top-0 right-1/4 w-44 h-44 bg-[#38bdf8]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-400 to-[#38bdf8] p-[1px] flex items-center justify-center">
            <div className="w-full h-full bg-[#0b101d] rounded-[7px] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs md:text-sm font-black text-white">پژواک توانا (ABLE Echo)</h3>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/25">
              هوش زنده
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Quick Ignite */}
          <button
            onClick={() => {
              if (isCollapsed) setIsCollapsed(false);
              setSelectedMode('ignite');
              handleAsk('یک تلنگر آتشین و شورانگیز بده، خستگی ذهنی رو بشور و ببر!');
            }}
            className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 hover:opacity-95 flex items-center gap-1 transition-transform active:scale-95 shadow-xs"
          >
            <Flame className="w-3 h-3 fill-slate-950" />
            <span>تزریق شور ⚡</span>
          </button>

          {/* Collapse Toggle to save vertical screen real-estate */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg border border-slate-800 text-slate-400 hover:text-white bg-slate-900/60 transition-colors"
            title={isCollapsed ? 'باز کردن پژواک' : 'جمع‌کردن و خلوت‌سازی'}
          >
            {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <div className="mt-2.5 space-y-2.5">
          {/* 4 Mood Modes in Compact Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMode(m.id)}
                className={`p-1.5 rounded-xl text-right transition-all border flex items-center justify-between ${
                  selectedMode === m.id
                    ? `${m.color} ring-1 ring-white/20 shadow-xs font-bold`
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200 text-xs'
                }`}
              >
                <span className="text-[11px]">{m.title}</span>
                {m.icon}
              </button>
            ))}
          </div>

          {/* Speech Bubble */}
          <div className="relative p-3 rounded-xl bg-[#080e1e] border border-slate-800/80 text-xs text-slate-200 leading-relaxed shadow-inner">
            {loading ? (
              <div className="flex items-center gap-2 text-slate-400 py-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#38bdf8] animate-spin" />
                <span>پژواک در حال گوش دادن و آماده‌سازی الهام...</span>
              </div>
            ) : (
              <div className="space-y-2 whitespace-pre-line">
                <div className="text-slate-200">{responseMsg}</div>

                {suggestedMission && (
                  <div className="mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/25 flex flex-wrap items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 text-amber-300 text-[11px] font-semibold">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>مأموریت پیشنهادی: {suggestedMission.title}</span>
                    </div>
                    <button
                      onClick={handleConvertMission}
                      className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-950 hover:bg-amber-300 flex items-center gap-1 transition-colors"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>ثبت در سنگر (+{suggestedMission.reward} XP)</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk();
            }}
            className="flex items-center gap-1.5"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={
                selectedMode === 'decompose'
                  ? 'چه کاری سنگین شده؟ (مثلاً: نوشتن تست یا کامپوننت)...'
                  : 'یک دغدغه یا سوال روحی بنویس...'
              }
              className="flex-1 text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:border-[#38bdf8] outline-none"
            />
            <button
              type="submit"
              disabled={loading || !inputPrompt.trim()}
              className="px-3.5 py-2 rounded-xl bg-[#38bdf8] text-slate-950 text-xs font-bold hover:opacity-90 disabled:opacity-40 transition-all flex items-center gap-1"
            >
              <span>ارسال</span>
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
