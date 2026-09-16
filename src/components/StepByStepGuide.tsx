import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  X,
  Play,
  Pause,
  Compass,
  CheckCircle2,
  Shield,
  Rocket,
  Crown,
  Heart,
  Brain,
  Smartphone,
  HelpCircle
} from 'lucide-react';
import { narrator } from '../lib/narrator';
import { sounds } from '../lib/sound';

export interface GuideStep {
  id: string;
  tabKey?: string;
  title: string;
  subtitle: string;
  narration: string;
  icon: React.ReactNode;
  visualHighlight: string;
  actionHint: string;
}

interface StepByStepGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tabKey: string) => void;
  activeTab: string;
}

export const GUIDE_STEPS: GuideStep[] = [
  {
    id: 'intro',
    title: 'خوش‌آمدید به شهر توانا (ABLE City)',
    subtitle: 'مأوای ارزش‌آفرینان، التیام روح و احیای انگیزه',
    narration: 'سلام رفیق! به شهر توانا خوش آمدی. اینجا مکانی برای رهایی از خستگی، تبدیل رنج به ارزش پایدار و همراهی با برادران و همسنگران است. این راهنما شما را گام‌به‌گام با بخش‌های شهر آشنا می‌کند.',
    icon: <Sparkles className="w-5 h-5 text-amber-400" />,
    visualHighlight: 'داشبورد روحی و وضعیت پایداری در بالای صفحه',
    actionHint: 'با کلیک بر روی دکمه پخش صدا، توضیحات صوتی هر مرحله را بشنوید.'
  },
  {
    id: 'soul_hud',
    title: 'داشبورد روحی و سقف ضدفرسودگی',
    subtitle: 'پایش سطح، امتیاز و سقف مجاز روزانه برای محافظت از سلامت روان',
    narration: 'در این بخش امتیاز تلاش، شاخص اعتبار اخلاقی و سقف روزانه شما نمایش داده می‌شود. ما سقف روزانه قرار داده‌ایم تا دچار فرسودگی نشوید و اعتدال زندگی‌تان حفظ گردد.',
    icon: <Shield className="w-5 h-5 text-emerald-400" />,
    visualHighlight: 'نوار پایش پیشرفت و سقف سلامت روزانه در هدر',
    actionHint: 'با کلیک روی فلش بازشونده، جزئیات سقف استراحت و شعار روحی‌تان را ببینید.'
  },
  {
    id: 'able_echo',
    title: 'پژواک توانا (هوش مصنوعی الهام‌بخش)',
    subtitle: 'همدم روحی، خردکننده سنگر کارها و تزریق فوری دوپامین',
    narration: 'پژواک توانا رفیق همراه شماست. اگر کارهای سنگین شما را گیج کرده، حالت خردکننده کارها را فعال کنید تا کار را به سه لقمه دو دقیقه‌ای تبدیل کند و اضطراب را از بین ببرد.',
    icon: <Brain className="w-5 h-5 text-[#38bdf8]" />,
    visualHighlight: 'جعبه هوش زنده بالای زبانه‌ها با دکمه تزریق شور',
    actionHint: 'می‌توانید هر زمان خواستید این بخش را با فلش کوچک جمع کنید تا صفحه خلوت شود.'
  },
  {
    id: 'missions',
    tabKey: 'missions',
    title: 'مأموریت‌ها و اثبات کار (Proof of Value)',
    subtitle: 'انجام گام‌های عملی واقعی به جای کلیک‌های صوری',
    narration: 'در زبانه مأموریت‌ها، می‌توانید کارهای شخصی یا عمومی شهر را برگزینید. برای ثبت تکمیل، یک خط خلاصه از اقدام واقعی خود ثبت کنید تا ارزش حقیقی متولد شود.',
    icon: <CheckCircle2 className="w-5 h-5 text-amber-400" />,
    visualHighlight: 'زبانه مأموریت‌ها و دکمه‌های فیلتر سنگر شخصی',
    actionHint: 'زبانه مأموریت‌ها برای شما گشوده شد. روی «انجام دادم» یا تعریف مأموریت شخصی کلیک کنید.'
  },
  {
    id: 'trends',
    tabKey: 'trends',
    title: 'تالار آثار و بازبینی تخصصی همتایان',
    subtitle: 'رشد پروژه‌ها و اعتبار از طریق نقد کارشناسی رفقا',
    narration: 'در بخش آثار و پروژه‌ها، ساخته‌های رفقا را ببینید. به جای کلیک تصادفی، نظر کارشناسی و بازبینی تخصصی خود را ثبت کنید تا هم به سازنده کمک کنید و هم اعتبار اخلاقی شما بالا برود.',
    icon: <Rocket className="w-5 h-5 text-[#c084fc]" />,
    visualHighlight: 'چرخه چندمرحله‌ای: در حال رشد، ترند و تحت حمایت',
    actionHint: 'روی دکمه «بازبینی تخصصی» یک اثر کلیک کنید تا نقد خود را بنویسید.'
  },
  {
    id: 'sky',
    tabKey: 'sky',
    title: 'آسمان‌نمای ستاره‌ای ارزش (Living Constellation)',
    subtitle: 'تبدیل آثار، مأموریت‌ها و دل‌نوشته‌ها به صورت‌های فلکی رفاقت',
    narration: 'اینجا کهکشان زنده شهر تواناست! هر کار و تلاشی که ثبت می‌کنید، یک ستاره نورانی خلق می‌کند و خطوط نامرئی رفاقت شما را به هم پیوند می‌زند.',
    icon: <Sparkles className="w-5 h-5 text-amber-400" />,
    visualHighlight: 'نقشه کهکشان زنده با خطوط پیوند ستاره‌ها و پنجره کاوشگر نور',
    actionHint: 'روی هر ستاره ضربه بزنید تا جزئیات سازنده و میزان درخشش ارزش آن را ببینید.'
  },
  {
    id: 'chairs',
    tabKey: 'chairs',
    title: 'کرسی‌های کهن و شایسته‌سالاری',
    subtitle: 'مسئولیت‌های کلان شهری بر پایه رأی و خدمت به جامعه',
    narration: 'کرسی‌های کهن محل تصمیم‌گیری‌های خردمندانه شهر هستند. هر شهروند دارای اعتبار کافی می‌تواند خود را برای خدمت به دیگران کاندید کند و مورد سنجش هم‌شهریان قرار گیرد.',
    icon: <Crown className="w-5 h-5 text-amber-400" />,
    visualHighlight: 'چهار کرسی اصلی حکمت، زیرساخت، خلاقیت و پناهگاه',
    actionHint: 'با کلیک روی زبانه کرسی‌ها، به نامزدهای لایق رأی اعتماد دهید.'
  },
  {
    id: 'chat',
    tabKey: 'chat',
    title: 'پناهگاه امن و اتاق همدلی',
    subtitle: 'شنیدن صدای یکدیگر بدون نقاب و با کمال صداقت',
    narration: 'اینجا پناهگاه دل‌های خسته و در عین حال امیدوار است. اگر روز سختی داشتی یا ایده‌ای داری، بنویس تا گرمای وجود رفقا آرامش‌بخش مسیرت باشد.',
    icon: <Heart className="w-5 h-5 text-rose-400" />,
    visualHighlight: 'اتاق پیام‌های زنده با برچسب‌های همدلی و عهد رفاقت',
    actionHint: 'می‌توانید پیام یا دل‌نوشته‌ای برای سایر شهروندان بفرستید.'
  },
  {
    id: 'adhd',
    tabKey: 'adhd',
    title: 'سنگر تمرکز ADHD و دسترسی‌پذیری',
    subtitle: 'امواج صوتی تمرکز، خط‌کش فوکوس و ابزارهای شناختی',
    narration: 'این ابزارها اختصاصاً برای کسانی طراحی شده که دچار تشتت توجه یا حساسیت‌های بصری هستند. صدای نویز سفید، تایمر تمرکز و کنتراست بالا محیطی ایمن می‌سازند.',
    icon: <Compass className="w-5 h-5 text-sky-400" />,
    visualHighlight: 'تنظیمات اندازه فونت، خط‌کش تمرکز و نویز صوتی پیوسته',
    actionHint: 'می‌توانید صدای آرام‌بخش جنگل یا باران را روشن کنید.'
  },
  {
    id: 'android',
    tabKey: 'android',
    title: 'مرکز ساخت پکیج اندروید (APK / AAB)',
    subtitle: 'تبدیل پروژه در گیت‌هاب به خروجی موبایل بدون نیاز به تنظیمات پیچیده',
    narration: 'در تب اندروید، تمامی فایل‌های گرادل، مانیفست و ورک‌فلوی خودکار گیت‌هاب اکشنز آماده است تا بدون نیاز به سیستم سنگین، برنامه را به خروجی اندروید تبدیل کنید.',
    icon: <Smartphone className="w-5 h-5 text-emerald-400" />,
    visualHighlight: 'کدهای آماده گیت‌هاب اکشنز و تنظیمات بیلد اندروید',
    actionHint: 'کد اکشن را کپی کرده و در مخزن پروژه قرار دهید.'
  }
];

export const StepByStepGuide: React.FC<StepByStepGuideProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  activeTab
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [autoNarrate, setAutoNarrate] = useState(true);

  const step = GUIDE_STEPS[currentStepIndex];

  // Sync narration state
  useEffect(() => {
    narrator.setCallback((speaking) => {
      setIsVoiceActive(speaking);
    });
    return () => {
      narrator.stop();
    };
  }, []);

  // When step changes, automatically narrate if enabled
  useEffect(() => {
    if (!isOpen) {
      narrator.stop();
      return;
    }

    if (step.tabKey && step.tabKey !== activeTab) {
      onSelectTab(step.tabKey);
    }

    if (autoNarrate) {
      narrator.speak(step.narration);
    }
  }, [currentStepIndex, isOpen]);

  const toggleVoice = () => {
    if (isVoiceActive) {
      narrator.stop();
    } else {
      narrator.speak(step.narration);
      sounds.playHeart();
    }
  };

  const handleNext = () => {
    if (currentStepIndex < GUIDE_STEPS.length - 1) {
      sounds.playXpGain();
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      sounds.playLevelUp();
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      sounds.playHeart();
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#10172c] via-[#090e1d] to-[#04060c] border border-[#38bdf8]/40 shadow-[0_15px_50px_rgba(56,189,248,0.25)] p-4 sm:p-5 text-slate-100 space-y-3.5">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#38bdf8]/15 border border-[#38bdf8]/30">
              {step.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#38bdf8]">
                  راهنمای گام‌به‌گام بصری و صوتی
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  گام {currentStepIndex + 1} از {GUIDE_STEPS.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                همراه صوتی و نقشه‌خوانی بخش‌های شهر
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Audio Toggle Button */}
            <button
              onClick={toggleVoice}
              className={`p-2 rounded-xl border transition-all flex items-center gap-1 text-xs font-bold ${
                isVoiceActive
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title={isVoiceActive ? 'توقف صوت راهنما' : 'پخش صوت راهنما'}
            >
              {isVoiceActive ? (
                <>
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span className="text-[10px] hidden sm:inline">در حال گویندگی</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span className="text-[10px] hidden sm:inline">پخش صدا</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                narrator.stop();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              title="بستن راهنما"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Visual & Text Card */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-black text-white">
              {step.title}
            </h3>
          </div>
          <p className="text-xs text-[#93c5fd] font-medium leading-tight">
            {step.subtitle}
          </p>

          {/* Spoken Content bubble */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2 shadow-inner">
            <div className="flex items-start gap-2">
              <span className="text-[#38bdf8] font-bold text-sm leading-none">🎙️</span>
              <p className="italic">{step.narration}</p>
            </div>

            {/* Visual Focus Spotlight Indicator */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-amber-300">
              <span className="flex items-center gap-1 font-semibold">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                تمرکز بصری: {step.visualHighlight}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>راهنمای عمل: {step.actionHint}</span>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              id="autoNarrateCheck"
              checked={autoNarrate}
              onChange={(e) => setAutoNarrate(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-[#38bdf8]"
            />
            <label htmlFor="autoNarrateCheck" className="text-[11px] text-slate-400 cursor-pointer select-none">
              روایت صوتی خودکار در هر گام
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-30 flex items-center gap-1 transition-all"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>قبلی</span>
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-lg text-xs font-black bg-[#38bdf8] text-slate-950 hover:bg-[#0ea5e9] flex items-center gap-1 transition-all shadow-[0_0_12px_rgba(56,189,248,0.3)]"
            >
              <span>{currentStepIndex === GUIDE_STEPS.length - 1 ? 'پایان تور 🌟' : 'گام بعدی'}</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
