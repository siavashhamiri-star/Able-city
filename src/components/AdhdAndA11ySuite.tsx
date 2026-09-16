import React, { useState, useEffect } from 'react';
import { TranslationDictionary } from '../lib/i18n';
import { ambientSound } from '../lib/ambientSound';
import { sounds } from '../lib/sound';
import {
  Eye,
  Sliders,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ListTodo,
  Wand2,
  Brain,
  ShieldCheck,
  SplitSquareVertical,
  MinusCircle,
  PlusCircle,
} from 'lucide-react';

export interface AccessibilitySettings {
  highContrast: boolean;
  textScale: 'normal' | 'large' | 'xlarge';
  reducedMotion: boolean;
  dyslexiaSpacing: boolean;
  focusRuler: boolean;
}

interface AdhdAndA11ySuiteProps {
  t: TranslationDictionary;
  language: string;
  userRole: string;
  a11y: AccessibilitySettings;
  onUpdateA11y: (settings: Partial<AccessibilitySettings>) => void;
  onToggleFocusMode: () => void;
  isFocusModeActive: boolean;
  onShowToast: (msg: string) => void;
}

export const AdhdAndA11ySuite: React.FC<AdhdAndA11ySuiteProps> = ({
  t,
  language,
  userRole,
  a11y,
  onUpdateA11y,
  onToggleFocusMode,
  isFocusModeActive,
  onShowToast,
}) => {
  // Ambient sound state
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);

  // Pomodoro Timer state
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // AI Task Decomposer state
  const [dauntingTask, setDauntingTask] = useState('');
  const [isDecomposing, setIsDecomposing] = useState(false);
  const [microSteps, setMicroSteps] = useState<{ id: number; text: string; done: boolean }[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      sounds.playLevelUp();
      onShowToast('🎉 ۲۵ دقیقه تمرکز با موفقیت به پایان رسید! ۵ دقیقه استراحت و تنفس عمیق داشته باش رفیق.');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, pomodoroSeconds, onShowToast]);

  const toggleAmbient = () => {
    const active = ambientSound.toggle();
    setIsAmbientPlaying(active);
    onShowToast(active ? 'صدای آرامش‌بخش فرکانس ذن (Brown Noise) فعال شد 🌿' : 'صدای پس‌زمینه خاموش شد');
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDecomposeTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dauntingTask.trim()) return;

    setIsDecomposing(true);
    try {
      const res = await fetch('/api/soul-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `کاربر دارای ADHD می‌خواهد این کار بزرگ و طاقت‌فرسا را انجام دهد: "${dauntingTask}".
لطفاً آن را دقیقاً به ۳ ریزقدم ۲ دقیقه‌ای و فوق‌العاده ساده و بدون استرس خرد کن که شروع کردنش کوچک‌ترین ترسی نداشته باشد. هر قدم در یک خط کوتاه با شماره.`,
          language,
          adhdMode: true,
          userRole,
        }),
      });

      const data = await res.json();
      const rawText: string = data.advice || '';

      // Parse output into micro steps
      const parsedSteps = rawText
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 2 && (line.startsWith('۱') || line.startsWith('۲') || line.startsWith('۳') || line.startsWith('1') || line.startsWith('2') || line.startsWith('3') || line.startsWith('-') || line.startsWith('*')))
        .map((stepText, idx) => ({
          id: idx + 1,
          text: stepText.replace(/^[-*•\d\.\s]+/, ''),
          done: false,
        }));

      if (parsedSteps.length > 0) {
        setMicroSteps(parsedSteps);
      } else {
        setMicroSteps([
          { id: 1, text: 'قدم اول: صفحه را باز کن و عنوان کار را روی یک کاغذ بنویس (۱ دقیقه)', done: false },
          { id: 2, text: 'قدم دوم: فقط ۳ کلمه یا یک خط آزمایشی تایپ کن و مکث کن (۲ دقیقه)', done: false },
          { id: 3, text: 'قدم سوم: یک جرعه آب بنوش و به خودت آفرین بگو که شروع کردی (۱ دقیقه)', done: false },
        ]);
      }

      sounds.playPublish();
      onShowToast('وظیفه شما به ۳ قدم ۲ دقیقه‌ای خرد شد! 🎉');
    } catch {
      onShowToast('خطا در ارتباط با مشاور هوشمند، قدم‌های نمونه جایگزین شدند.');
      setMicroSteps([
        { id: 1, text: 'قدم اول: محیط را تمیز کن و یک لیوان آب بنوش', done: false },
        { id: 2, text: 'قدم دوم: فقط ۲ دقیقه روی بخش اول متمرکز شو', done: false },
        { id: 3, text: 'قدم سوم: یک تیک بزن و جایزه دوپامین خودت رو بگیر', done: false },
      ]);
    } finally {
      setIsDecomposing(false);
    }
  };

  const toggleStepDone = (id: number) => {
    setMicroSteps((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const newDone = !s.done;
          if (newDone) {
            sounds.playHeart();
            onShowToast('⚡ عالی بود! یک ریزقدم تکمیل شد');
          }
          return { ...s, done: newDone };
        }
        return s;
      })
    );
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="rounded-xl border border-sky-500/30 bg-[#020409] p-4 shadow-[0_10px_30px_rgba(56,189,248,0.08)]">
        <div className="flex items-center gap-2 mb-1.5">
          <Brain className="w-5 h-5 text-[#38bdf8]" />
          <h3 className="font-bold text-sm md:text-base text-[#38bdf8]">
            {t.adhdTitle} & {t.a11yTitle}
          </h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          {t.adhdDesc}
        </p>
      </div>

      {/* Focus Mode & Cognitive Relief Card */}
      <div className="rounded-xl border border-slate-800 bg-[#0b101d] p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#c084fc]" />
            <h4 className="font-bold text-xs md:text-sm text-slate-200">
              {t.focusModeToggle}
            </h4>
          </div>

          <button
            onClick={onToggleFocusMode}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 ${
              isFocusModeActive
                ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            {isFocusModeActive ? 'حالت تمرکز فعال است (خروج)' : 'ورود به حالت تمرکز'}
          </button>
        </div>

        {/* Focus Reading Ruler & Zen Ambient Sound */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => {
              const newVal = !a11y.focusRuler;
              onUpdateA11y({ focusRuler: newVal });
              onShowToast(newVal ? 'خط‌کش متحرک مطالعه فعال شد' : 'خط‌کش مطالعه غیرفعال شد');
            }}
            className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between ${
              a11y.focusRuler
                ? 'bg-[#38bdf8]/15 border-[#38bdf8] text-[#38bdf8]'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="text-xs font-bold">{t.focusRulerToggle}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">خط راهنمای چشمی بدون پرش متن</div>
            </div>
            <Eye className="w-4 h-4 shrink-0" />
          </button>

          <button
            onClick={toggleAmbient}
            className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between ${
              isAmbientPlaying
                ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="text-xs font-bold">{t.calmSoundToggle}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">فرکانس آرام‌بخش ضد افکار مزاحم</div>
            </div>
            {isAmbientPlaying ? <Volume2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <VolumeX className="w-4 h-4 shrink-0" />}
          </button>
        </div>

        {/* Pomodoro Focus Timer */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-black font-mono tracking-widest text-[#f59e0b]">
              {formatTime(pomodoroSeconds)}
            </span>
            <span className="text-xs text-slate-400">بلوک تمرکز عمیق (Flow State)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#f59e0b] hover:bg-amber-500 text-slate-950 transition-colors flex items-center gap-1.5"
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isTimerRunning ? t.pomodoroPause : t.pomodoroStart}
            </button>
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setPomodoroSeconds(25 * 60);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
              title={t.pomodoroReset}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* AI Task Decomposer (ADHD Overwhelm Antidote) */}
      <div className="rounded-xl border border-slate-800 bg-[#0b101d] p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-[#c084fc]" />
          <h4 className="font-bold text-xs md:text-sm text-[#38bdf8]">
            {t.breakdownAiTitle}
          </h4>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          {t.breakdownAiDesc}
        </p>

        <form onSubmit={handleDecomposeTask} className="space-y-2">
          <input
            type="text"
            value={dauntingTask}
            onChange={(e) => setDauntingTask(e.target.value)}
            placeholder="مثلاً: شروع نوشتن پایان‌نامه، معماری کد دیتابیس، مرتب کردن کل اتاق..."
            className="w-full text-xs md:text-sm p-3 rounded-xl bg-[#060913] border border-slate-800 text-white focus:border-[#c084fc] outline-none placeholder:text-slate-500"
          />

          <button
            type="submit"
            disabled={isDecomposing}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#c084fc] text-slate-950 hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isDecomposing ? 'در حال خرد کردن هوشمند کار...' : t.breakdownAiBtn}</span>
          </button>
        </form>

        {/* Rendered Micro Steps */}
        {microSteps.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
            <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
              <ListTodo className="w-3.5 h-3.5" />
              <span>ریزقدم‌های ۲ دقیقه‌ای تو برای شروع آسان:</span>
            </div>

            <div className="space-y-1.5">
              {microSteps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => toggleStepDone(step.id)}
                  className={`w-full p-2.5 rounded-lg border text-right transition-all flex items-center justify-between text-xs ${
                    step.done
                      ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300 line-through'
                      : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="leading-relaxed">{step.text}</span>
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 mr-2 ${
                      step.done ? 'text-emerald-400 fill-emerald-400/20' : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Accessibility Preferences Card */}
      <div className="rounded-xl border border-slate-800 bg-[#0b101d] p-4 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#10b981]" />
          <h4 className="font-bold text-xs md:text-sm text-slate-200">
            {t.a11yTitle}
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {/* High Contrast */}
          <button
            onClick={() => onUpdateA11y({ highContrast: !a11y.highContrast })}
            className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between ${
              a11y.highContrast
                ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 ring-2 ring-amber-300/40'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span>{t.highContrast}</span>
            <span className="text-[10px] opacity-75">{a11y.highContrast ? 'فعال' : 'عادی'}</span>
          </button>

          {/* Reduced Motion */}
          <button
            onClick={() => onUpdateA11y({ reducedMotion: !a11y.reducedMotion })}
            className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between ${
              a11y.reducedMotion
                ? 'bg-[#38bdf8]/20 border-[#38bdf8] text-[#38bdf8] font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span>{t.reducedMotion}</span>
            <span className="text-[10px] opacity-75">{a11y.reducedMotion ? 'کاهش‌یافته' : 'پویا'}</span>
          </button>

          {/* Dyslexia / Clean Line Spacing */}
          <button
            onClick={() => onUpdateA11y({ dyslexiaSpacing: !a11y.dyslexiaSpacing })}
            className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between ${
              a11y.dyslexiaSpacing
                ? 'bg-[#c084fc]/20 border-[#c084fc] text-[#c084fc] font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span>{t.dyslexiaFont}</span>
            <span className="text-[10px] opacity-75">{a11y.dyslexiaSpacing ? 'فعال' : 'عادی'}</span>
          </button>

          {/* Text Size Controls */}
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-300">{t.textSize}:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onUpdateA11y({ textScale: 'normal' })}
                className={`p-1 rounded text-[11px] ${
                  a11y.textScale === 'normal' ? 'bg-[#38bdf8] text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                <MinusCircle className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onUpdateA11y({ textScale: 'large' })}
                className={`px-2 py-0.5 rounded text-[11px] ${
                  a11y.textScale === 'large' ? 'bg-[#38bdf8] text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                A
              </button>
              <button
                onClick={() => onUpdateA11y({ textScale: 'xlarge' })}
                className={`p-1 rounded text-[11px] ${
                  a11y.textScale === 'xlarge' ? 'bg-[#38bdf8] text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
