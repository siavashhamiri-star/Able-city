import React, { useState, useEffect } from 'react';
import { Users2, Flame, Play, Pause, RotateCcw, Sparkles, CheckCircle2, Heart, Volume2 } from 'lucide-react';
import { sounds } from '../lib/sound';
import { ambientSound } from '../lib/ambientSound';

interface CoFocusBuddyProps {
  userName: string;
  onSessionComplete: () => void;
  onShowToast: (msg: string) => void;
}

interface Buddy {
  id: string;
  name: string;
  role: string;
  goal: string;
  avatar: string;
  status: 'focusing' | 'completed';
}

const STORAGE_KEY = 'able_cofocus_session_v1';

export const CoFocusBuddy: React.FC<CoFocusBuddyProps> = ({
  userName,
  onSessionComplete,
  onShowToast,
}) => {
  const sessionMinutes = 25;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(sessionMinutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [myTask, setMyTask] = useState<string>('');
  const [activeBuddy, setActiveBuddy] = useState<Buddy>({
    id: 'b1',
    name: 'آرشام',
    role: 'برنامه‌نویس هسته',
    goal: 'حل باگ اتصال دیتابیس بدون استرس',
    avatar: '👨‍💻',
    status: 'focusing',
  });

  const availableBuddies: Buddy[] = [
    {
      id: 'b1',
      name: 'آرشام',
      role: 'برنامه‌نویس هسته',
      goal: 'حل باگ اتصال دیتابیس بدون استرس',
      avatar: '👨‍💻',
      status: 'focusing',
    },
    {
      id: 'b2',
      name: 'پروانه',
      role: 'طراح رابط کاربری',
      goal: 'طراحی آیکون‌های مینیمال برای شهر',
      avatar: '🎨',
      status: 'focusing',
    },
    {
      id: 'b3',
      name: 'امید',
      role: 'پژوهشگر هوش مصنوعی',
      goal: 'نوشتن پرامپت‌های التیام روحی و تست',
      avatar: '🧠',
      status: 'focusing',
    },
  ];

  // Restore saved session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.myTask) setMyTask(parsed.myTask);
        if (parsed.buddyId) {
          const found = availableBuddies.find((b) => b.id === parsed.buddyId);
          if (found) setActiveBuddy(found);
        }

        if (parsed.isRunning && parsed.targetEndTime) {
          const now = Date.now();
          const diffSec = Math.floor((parsed.targetEndTime - now) / 1000);
          if (diffSec > 0) {
            setSecondsRemaining(diffSec);
            setIsRunning(true);
            ambientSound.start();
          } else {
            // Already completed in background
            setSecondsRemaining(0);
            setIsRunning(false);
            localStorage.removeItem(STORAGE_KEY);
          }
        } else if (parsed.secondsRemaining) {
          setSecondsRemaining(parsed.secondsRemaining);
        }
      }
    } catch (e) {
      console.warn('Could not restore CoFocus session:', e);
    }
  }, []);

  // Sync timer tick with wall-clock time
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            ambientSound.stop();
            sounds.playLevelUp();
            onSessionComplete();
            onShowToast('🎉 عهد تمرکز مشترک به پایان رسید! خسته نباشی رفیق (+۵۰ XP)');
            localStorage.removeItem(STORAGE_KEY);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsRemaining]);

  const handleStart = () => {
    if (!myTask.trim()) {
      onShowToast('لطفاً هدف کوتاه تمرکز خود را بنویسید');
      return;
    }
    const targetEndTime = Date.now() + secondsRemaining * 1000;
    setIsRunning(true);
    sounds.playHeart();
    ambientSound.start();

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          isRunning: true,
          targetEndTime,
          secondsRemaining,
          myTask,
          buddyId: activeBuddy.id,
        })
      );
    } catch {
      // ignore
    }

    onShowToast(`🔥 سنگر تمرکز دونفره با ${activeBuddy.name} آغاز شد`);
  };

  const handlePause = () => {
    setIsRunning(false);
    ambientSound.stop();
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          isRunning: false,
          secondsRemaining,
          myTask,
          buddyId: activeBuddy.id,
        })
      );
    } catch {
      // ignore
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsRemaining(sessionMinutes * 60);
    ambientSound.stop();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = Math.round(
    ((sessionMinutes * 60 - secondsRemaining) / (sessionMinutes * 60)) * 100
  );

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-[#131221] via-[#090b16] to-[#030409] p-3.5 shadow-sm space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400/30 to-rose-500/30 border border-amber-400/40 flex items-center justify-center text-amber-400">
            <Users2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-black text-xs sm:text-sm text-white flex items-center gap-1.5">
              <span>سنگر تمرکز دونفره (Co-Focus Body Doubling)</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-300 font-bold border border-amber-500/25">
                ضدتنهایی ADHD
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              برای فرار از تعویق و تنهایی، در سکوت همگام با یک رفیق روی کارتان تمرکز کنید.
            </p>
          </div>
        </div>

        {/* Companion Selector */}
        <div className="flex items-center gap-1 text-[11px] text-slate-300">
          <span className="text-slate-500 text-[10px]">همسنگر:</span>
          <select
            value={activeBuddy.id}
            onChange={(e) => {
              const found = availableBuddies.find((b) => b.id === e.target.value);
              if (found) setActiveBuddy(found);
            }}
            disabled={isRunning}
            className="bg-slate-900 border border-slate-700 text-xs text-amber-300 rounded-lg p-1 outline-none font-bold"
          >
            {availableBuddies.map((b) => (
              <option key={b.id} value={b.id}>
                {b.avatar} {b.name} ({b.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Buddy Connection Showcase Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* User Card */}
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#38bdf8] flex items-center gap-1">
              <span>👤</span>
              <span>سنگر شما ({userName})</span>
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#38bdf8]/15 text-[#38bdf8] font-bold">
              {isRunning ? 'در حال تمرکز 🔥' : 'آماده شروع'}
            </span>
          </div>
          <input
            type="text"
            value={myTask}
            onChange={(e) => setMyTask(e.target.value)}
            disabled={isRunning}
            placeholder="دقیقاً در این ۲۵ دقیقه چه کار کوچکی می‌کنی؟"
            className="w-full text-xs p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-[#38bdf8]"
          />
        </div>

        {/* Buddy Card */}
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-amber-300 flex items-center gap-1">
              <span>{activeBuddy.avatar}</span>
              <span>همسنگر: {activeBuddy.name}</span>
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              آنلاین و همراه
            </span>
          </div>
          <p className="text-[11px] text-slate-300 italic bg-slate-900/70 p-1.5 rounded-lg border border-slate-800">
            «هدف من: {activeBuddy.goal}»
          </p>
        </div>
      </div>

      {/* Timer & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="font-mono text-2xl sm:text-3xl font-black text-amber-400 tracking-wider">
            {timeFormatted}
          </div>
          <div className="text-[10px] text-slate-400 leading-tight">
            <span>عهد تمرکز دونفره ۲۵ دقیقه‌ای</span>
            <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-rose-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="px-4 py-2 min-h-[44px] rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 text-xs font-black hover:opacity-90 flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>شروع عهد مشترک</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-3 py-2 min-h-[44px] rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>توقف موقت</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
            title="شروع مجدد تایمر"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
