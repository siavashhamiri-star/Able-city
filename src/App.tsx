/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AppState, WorkStatusType, Mission } from './types';
import {
  loadAppState,
  saveAppState,
  INITIAL_USER,
  INITIAL_MISSIONS,
  INITIAL_WORKS,
  INITIAL_GRAND_CHAIRS,
  INITIAL_LEAGUE,
  INITIAL_CHAT,
} from './lib/storage';
import { SupportedLanguage, LANGUAGES, translations } from './lib/i18n';
import { SoulHud } from './components/SoulHud';
import { AbleEcho } from './components/AbleEcho';
import { MissionsTab } from './components/MissionsTab';
import { WorksTab } from './components/WorksTab';
import { GrandChairsTab } from './components/GrandChairsTab';
import { LeagueTab } from './components/LeagueTab';
import { EmpathyChatTab } from './components/EmpathyChatTab';
import { AdhdAndA11ySuite, AccessibilitySettings } from './components/AdhdAndA11ySuite';
import { AndroidBuildHub } from './components/AndroidBuildHub';
import { AuthModal } from './components/AuthModal';
import { FocusRuler } from './components/FocusRuler';
import { RewardToast } from './components/RewardToast';
import { StepByStepGuide } from './components/StepByStepGuide';
import { ConstellationSky } from './components/ConstellationSky';
import { MenchGame } from './components/MenchGame';
import { sounds } from './lib/sound';
import {
  RotateCcw,
  Sparkles,
  Globe,
  Brain,
  Smartphone,
  CheckCircle,
  SplitSquareVertical,
  Zap,
  HelpCircle,
  Volume2,
  Dice5,
} from 'lucide-react';

type TabType = 'missions' | 'trends' | 'sky' | 'chairs' | 'league' | 'chat' | 'adhd' | 'android' | 'mench';

export default function App() {
  const [appState, setAppState] = useState<AppState>(() => loadAppState());
  const [activeTab, setActiveTab] = useState<TabType>('missions');
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('fa');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLevelUpToast, setIsLevelUpToast] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Check if first-time user to offer guide
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('able_city_seen_guide_v1');
    if (!hasSeenGuide) {
      // Auto open guide for new explorers after a brief moment
      const timer = setTimeout(() => {
        setIsGuideOpen(true);
        localStorage.setItem('able_city_seen_guide_v1', 'true');
      }, 900);
      return () => clearTimeout(timer);
    }
  }, []);

  // Accessibility settings state
  const [a11y, setA11y] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem('able_city_a11y_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      highContrast: false,
      textScale: 'normal',
      reducedMotion: false,
      dyslexiaSpacing: false,
      focusRuler: false,
    };
  });

  // Save a11y preferences
  useEffect(() => {
    try {
      localStorage.setItem('able_city_a11y_v1', JSON.stringify(a11y));
    } catch {
      // ignore
    }
  }, [a11y]);

  // Sync HTML lang and dir when language changes
  useEffect(() => {
    const langObj = LANGUAGES.find((l) => l.code === currentLang);
    const dir = langObj ? langObj.dir : 'rtl';
    document.documentElement.dir = dir;
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  // Sync appState to localStorage
  useEffect(() => {
    saveAppState(appState);
  }, [appState]);

  const t = translations[currentLang] || translations.fa;

  const showToast = (msg: string, isLevelUp = false) => {
    setToastMessage(msg);
    setIsLevelUpToast(isLevelUp);
    setTimeout(() => {
      setToastMessage(null);
      setIsLevelUpToast(false);
    }, 2800);
  };

  // Helper to add XP and Rep with Daily Cap enforcement
  const addXpAndRep = (xpAmt: number, repAmt: number) => {
    setAppState((prev) => {
      const dailyXp = prev.user.dailyXpEarned ?? 180;
      const dailyXpCap = prev.user.dailyXpCap ?? 600;
      const dailyRep = prev.user.dailyRepEarned ?? 5;
      const dailyRepCap = prev.user.dailyRepCap ?? 20;

      // Calculate allowed additions respecting the ceiling
      const allowedXp = Math.max(0, Math.min(xpAmt, dailyXpCap - dailyXp));
      const allowedRep = Math.max(0, Math.min(repAmt, dailyRepCap - dailyRep));

      const newDailyXp = dailyXp + allowedXp;
      const newDailyRep = dailyRep + allowedRep;

      if (allowedXp === 0 && xpAmt > 0) {
        showToast('⚠️ سقف سلامت و ضدفرسودگی امروز تکمیل است. امتیاز جدید تا فردا منظور نمی‌شود.');
      }

      const newXp = prev.user.xp + allowedXp;
      const newRep = prev.user.rep + allowedRep;
      let newLevel = prev.user.level;

      // Threshold: Level up when XP >= level * 300
      let leveledUp = false;
      while (newXp >= newLevel * 300) {
        newLevel += 1;
        leveledUp = true;
      }

      if (leveledUp) {
        sounds.playLevelUp();
        showToast(`🎉 تبریک رفیق! صعود به سطح Level ${newLevel}`, true);
      } else if (allowedXp > 0) {
        sounds.playXpGain();
      }

      // Also update user's XP & Rep in the League table
      const updatedLeague = prev.league.map((member) => {
        if (member.name === prev.user.name || member.isCurrent) {
          return {
            ...member,
            xp: newXp,
            rep: newRep,
          };
        }
        return member;
      });

      return {
        ...prev,
        user: {
          ...prev.user,
          xp: newXp,
          rep: newRep,
          level: newLevel,
          dailyXpEarned: newDailyXp,
          dailyXpCap,
          dailyRepEarned: newDailyRep,
          dailyRepCap,
        },
        league: updatedLeague,
      };
    });
  };

  // Mission handlers with optional Proof of Value note
  const handleCompleteMission = (id: number, proofNote?: string) => {
    const mission = appState.missions.find((m) => m.id === id);
    if (!mission || mission.completed) return;

    setAppState((prev) => ({
      ...prev,
      missions: prev.missions.map((m) =>
        m.id === id
          ? {
              ...m,
              completed: true,
              proofNote: proofNote || m.proofNote,
              completedAt: new Date().toLocaleTimeString('fa-IR'),
            }
          : m
      ),
    }));

    addXpAndRep(mission.reward, mission.repReward);
    showToast(`مأموریت با موفقیت تکمیل و ثبت شد! +${mission.reward} XP`);
  };

  const handleAddMission = (newMission: Omit<Mission, 'id' | 'completed'>) => {
    const mission: Mission = {
      ...newMission,
      id: Date.now(),
      completed: false,
    };

    setAppState((prev) => ({
      ...prev,
      missions: [mission, ...prev.missions],
    }));

    showToast('✨ مأموریت جدید برای سازندگان شهر تعریف شد');
  };

  // Peer review handler to avoid purely clicker mechanics
  const handlePeerReview = (workId: number, comment: string) => {
    setAppState((prev) => {
      const updatedWorks = prev.works.map((w) => {
        if (w.id === workId) {
          const notes = w.peerReviewNotes || [];
          return {
            ...w,
            peerReviewsCount: (w.peerReviewsCount || notes.length) + 1,
            reviewedByMe: true,
            peerReviewNotes: [
              ...notes,
              { reviewer: prev.user.name, comment, date: 'هم‌اکنون' },
            ],
          };
        }
        return w;
      });

      return {
        ...prev,
        works: updatedWorks,
      };
    });

    addXpAndRep(30, 3);
    sounds.playLevelUp();
    showToast('✨ بازبینی تخصصی شما ثبت شد و ۳ واحد اعتبار (Rep) به شما افزوده گردید');

    // Also sync to server
    try {
      fetch(`/api/works/${workId}/peer-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewer: appState.user.name, comment }),
      }).catch(() => {});
    } catch {}
  };

  // Work handlers
  const handleSubmitWork = (title: string, category?: string, description?: string) => {
    const newWork = {
      id: Date.now(),
      title,
      author: appState.user.name,
      status: '🌱 در حال رشد (وارد چرخه بررسی شد)',
      statusClass: 'status-rising' as WorkStatusType,
      views: '۱ بازدید',
      viewsCount: 1,
      likesCount: 1,
      likedByMe: true,
      category: category || 'پروژه مستقل',
      description: description || 'اثر تازه ثبت شده در شهر توانا',
      date: 'هم‌اکنون',
    };

    setAppState((prev) => ({
      ...prev,
      works: [newWork, ...prev.works],
    }));

    addXpAndRep(40, 3);
    showToast('اثر شما ثبت شد و وارد چرخه شهر توانا گردید! 🌟');
  };

  const handleSupportWork = (id: number) => {
    setAppState((prev) => {
      let toggled = false;
      const updatedWorks = prev.works.map((w) => {
        if (w.id === id) {
          toggled = !w.likedByMe;
          return {
            ...w,
            likedByMe: toggled,
            likesCount: toggled ? w.likesCount + 1 : Math.max(0, w.likesCount - 1),
          };
        }
        return w;
      });

      if (toggled) {
        sounds.playHeart();
        showToast('❤️ حمایت رفاقتی شما از این اثر ثبت شد');
      }

      return {
        ...prev,
        works: updatedWorks,
      };
    });
  };

  // Grand Chair handlers
  const handleVoteChair = (id: number) => {
    setAppState((prev) => {
      let isVoted = false;
      const updatedChairs = prev.grandChairs.map((c) => {
        if (c.id === id) {
          isVoted = !c.votedByMe;
          return {
            ...c,
            votedByMe: isVoted,
            votes: isVoted ? c.votes + 1 : Math.max(0, c.votes - 1),
          };
        }
        return c;
      });

      if (isVoted) {
        sounds.playHeart();
        showToast('رأی اعتماد شما در تالار شایسته‌سالاری ثبت گردید');
      }

      return {
        ...prev,
        grandChairs: updatedChairs,
      };
    });
  };

  const handleNominateSelf = (chairId: number) => {
    setAppState((prev) => ({
      ...prev,
      grandChairs: prev.grandChairs.map((c) => {
        if (c.id === chairId) {
          return {
            ...c,
            holder: prev.user.name,
            term: 'دوره فعال جدید (۳۰ روز)',
            isVacant: false,
            votedByMe: true,
            votes: c.votes + 1,
          };
        }
        return c;
      }),
    }));
  };

  // Empathy Chat handlers
  const handleSubmitChatMessage = (text: string, tag?: string) => {
    const newMsg = {
      id: Date.now(),
      author: appState.user.name,
      role: appState.user.role,
      text,
      likes: 1,
      likedByMe: true,
      timestamp: 'هم‌اکنون',
      tag: tag || 'همدلی',
    };

    setAppState((prev) => ({
      ...prev,
      chatMessages: [newMsg, ...prev.chatMessages],
    }));

    addXpAndRep(25, 2);
    showToast('پیام شما در اتاق همدلی ABLE City منتشر شد ❤️');
  };

  const handleLikeChatMessage = (id: number) => {
    setAppState((prev) => {
      let liked = false;
      const updated = prev.chatMessages.map((m) => {
        if (m.id === id) {
          liked = !m.likedByMe;
          return {
            ...m,
            likedByMe: liked,
            likes: liked ? m.likes + 1 : Math.max(0, m.likes - 1),
          };
        }
        return m;
      });

      if (liked) {
        sounds.playHeart();
        showToast('❤️ حمایت رفاقتی شما ثبت شد');
      }

      return {
        ...prev,
        chatMessages: updated,
      };
    });
  };

  // Profile update handler
  const handleUpdateUser = (updated: Partial<AppState['user']>) => {
    setAppState((prev) => {
      const newUser = { ...prev.user, ...updated };
      const updatedLeague = prev.league.map((m) => {
        if (m.name === prev.user.name || m.isCurrent) {
          return { ...m, name: newUser.name };
        }
        return m;
      });

      return {
        ...prev,
        user: newUser,
        league: updatedLeague,
      };
    });
  };

  // Auth Registration Success
  const handleRegisterSuccess = (profile: {
    name: string;
    email: string;
    phone?: string;
    country: string;
  }) => {
    setAppState((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        country: profile.country,
        isVerified: true,
      },
    }));

    // Reward for becoming a verified citizen
    addXpAndRep(100, 15);
    showToast(`🎉 تبریک! عضویت رسمی شما در شهر توانا تأیید شد (+۱۰۰ XP و +۱۵ اعتبار)`);
  };

  // Reset to default seed
  const handleResetData = () => {
    if (window.confirm('آیا مایلید تمام داده‌ها به حالت اولیه شهر توانا بازگردند؟')) {
      const initial: AppState = {
        user: INITIAL_USER,
        missions: INITIAL_MISSIONS,
        works: INITIAL_WORKS,
        grandChairs: INITIAL_GRAND_CHAIRS,
        league: INITIAL_LEAGUE,
        chatMessages: INITIAL_CHAT,
      };
      setAppState(initial);
      saveAppState(initial);
      showToast('داده‌های شهر توانا به حالت پیش‌فرض بازگردانی شد');
    }
  };

  // Active mission for ADHD single-focus mode
  const singleActiveMission = appState.missions.find((m) => !m.completed) || appState.missions[0];

  // Font scale class
  const getTextScaleClass = () => {
    if (a11y.textScale === 'large') return 'text-[17px]';
    if (a11y.textScale === 'xlarge') return 'text-[19px]';
    return 'text-sm';
  };

  return (
    <div
      className={`min-h-screen p-3 md:p-6 flex flex-col items-center transition-colors duration-200 ${
        a11y.highContrast
          ? 'bg-black text-white'
          : 'bg-[#05070f] text-[#f3f4f6]'
      } ${a11y.dyslexiaSpacing ? 'leading-loose tracking-wide' : ''} ${
        a11y.reducedMotion ? 'motion-reduce' : ''
      }`}
    >
      {/* Dynamic Eye-Tracking Reading Ruler for ADHD */}
      <FocusRuler enabled={a11y.focusRuler} />

      {/* Floating Reward Toast */}
      <RewardToast message={toastMessage} isLevelUp={isLevelUpToast} />

      {/* Auth Modal for Iran (Gmail + Mobile) & Global (Gmail) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        t={t}
        onRegisterSuccess={handleRegisterSuccess}
        onShowToast={showToast}
      />

      {/* Step-by-Step Audio & Visual Interactive Guide Modal */}
      <StepByStepGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onSelectTab={(tabKey) => setActiveTab(tabKey as TabType)}
        activeTab={activeTab}
      />

      {/* Main Container */}
      <main
        className={`w-full max-w-[680px] rounded-[24px] p-4 md:p-6 transition-all ${
          a11y.highContrast
            ? 'bg-black border-2 border-white shadow-none'
            : 'bg-[#0b101d] border border-[#1e293b] shadow-[0_20px_50px_rgba(0,0,0,0.85)]'
        } ${getTextScaleClass()}`}
      >
        {/* Top Control Bar: Languages, ADHD Mode indicator, and Reset */}
        <header className="mb-4 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              <Globe className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setCurrentLang(lang.code)}
                  className={`px-2 py-0.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                    currentLang === lang.code
                      ? 'bg-[#38bdf8] text-slate-950 font-black shadow-sm'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                  title={lang.name}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                </button>
              ))}
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-1.5">
              {/* Step-by-Step Audio & Visual Guide Trigger */}
              <button
                onClick={() => {
                  setIsGuideOpen(true);
                  sounds.playHeart();
                }}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/35 hover:bg-[#38bdf8]/25 shadow-xs"
                title="راهنمای گام‌به‌گام بصری و صوتی برنامه"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span className="text-[11px]">راهنمای صوتی و بصری</span>
              </button>

              <button
                onClick={() => setIsFocusModeActive(!isFocusModeActive)}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  isFocusModeActive
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-300'
                }`}
                title="تغییر وضعیت حالت تمرکز ADHD"
              >
                <Brain className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">حالت تمرکز</span>
              </button>

              <button
                onClick={handleResetData}
                className="text-slate-500 hover:text-slate-300 p-1.5 rounded-lg bg-slate-900 border border-slate-800 transition-colors"
                title="بازنشانی اطلاعات به حالت اولیه"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="text-center space-y-1">
            <span className="inline-flex items-center gap-1 bg-[#38bdf8]/10 text-[#38bdf8] px-3.5 py-1 rounded-full text-[11px] border border-[#38bdf8]/25 font-semibold">
              <Sparkles className="w-3 h-3" />
              {t.appBadge}
            </span>

            <h1 className="text-xl md:text-2xl font-black text-[#38bdf8] tracking-tight">
              {t.appTitle}
            </h1>
          </div>
        </header>

        {/* Soul HUD / Profile Header */}
        <SoulHud
          user={appState.user}
          t={t}
          onUpdateUser={handleUpdateUser}
          onOpenAuth={() => setIsAuthOpen(true)}
          onShowToast={showToast}
        />

        {/* ABLE Echo AI Companion & Dopamine Igniter */}
        {!isFocusModeActive && (
          <AbleEcho
            user={appState.user}
            language={currentLang}
            onAddMission={handleAddMission}
            onShowToast={showToast}
          />
        )}

        {/* PURE ADHD FOCUS MODE VIEW (If toggled) */}
        {isFocusModeActive ? (
          <div className="my-4 p-5 rounded-2xl bg-[#030612] border-2 border-amber-400/50 shadow-[0_0_30px_rgba(245,158,11,0.15)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Brain className="w-5 h-5" />
                <span>حالت تمرکز محض (یک کار در یک زمان بدون حواس‌پرتی)</span>
              </div>
              <button
                onClick={() => setIsFocusModeActive(false)}
                className="text-xs px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center gap-1"
              >
                <SplitSquareVertical className="w-3.5 h-3.5" />
                خروج از حالت تمرکز
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="text-xs text-[#38bdf8] font-bold">🎯 مأموریت هدف لحظه حاضر:</div>
              <div className="text-base md:text-lg font-black text-white">
                {singleActiveMission.title}
              </div>
              {singleActiveMission.description && (
                <div className="text-xs text-slate-300 leading-relaxed">
                  {singleActiveMission.description}
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-amber-400 font-semibold">
                  پاداش: +{singleActiveMission.reward} XP | +{singleActiveMission.repReward} Rep
                </span>

                <button
                  onClick={() => handleCompleteMission(singleActiveMission.id)}
                  disabled={singleActiveMission.completed}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    singleActiveMission.completed
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-gradient-to-r from-[#10b981] to-[#38bdf8] text-slate-950 hover:opacity-90 shadow-lg'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{singleActiveMission.completed ? 'تکمیل شد' : 'انجام دادم! دریافت پاداش ⚡'}</span>
                </button>
              </div>
            </div>

            <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <span>🌿 آرام باش، نیازی نیست همه کارها را با هم انجام دهی. همین یک گام کافیست.</span>
            </div>
          </div>
        ) : (
          <>
            {/* Navigation Tabs (Mobile-friendly horizontal swipe with 42px touch targets) */}
            <div className="relative mb-5">
              <nav className="flex gap-1.5 bg-[#020409] p-1.5 rounded-2xl border border-[#1e293b] overflow-x-auto scrollbar-none touch-pan-x scroll-smooth">
                <button
                  onClick={() => setActiveTab('missions')}
                  className={`flex-1 min-w-[76px] min-h-[42px] py-2 px-2 text-[11px] md:text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center justify-center ${
                    activeTab === 'missions'
                      ? 'bg-[#38bdf8] text-[#05070f] shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.tabMissions}
                </button>
                <button
                  onClick={() => setActiveTab('trends')}
                  className={`flex-1 min-w-[76px] min-h-[42px] py-2 px-2 text-[11px] md:text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center justify-center ${
                    activeTab === 'trends'
                      ? 'bg-[#38bdf8] text-[#05070f] shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.tabTrends}
                </button>
                <button
                  onClick={() => {
                    setActiveTab('sky');
                    sounds.playHeart();
                  }}
                  className={`flex-1 min-w-[76px] min-h-[42px] py-2 px-2 text-[11px] md:text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center justify-center ${
                    activeTab === 'sky'
                      ? 'bg-gradient-to-r from-[#c084fc] to-[#38bdf8] text-slate-950 shadow-[0_0_15px_rgba(192,132,252,0.45)]'
                      : 'text-purple-400/90 hover:text-purple-300'
                  }`}
                >
                  {t.tabSky}
                </button>
                <button
                  onClick={() => setActiveTab('chairs')}
                  className={`flex-1 min-w-[76px] min-h-[42px] py-2 px-2 text-[11px] md:text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center justify-center ${
                    activeTab === 'chairs'
                      ? 'bg-[#38bdf8] text-[#05070f] shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.tabChairs}
                </button>
                <button
                  onClick={() => setActiveTab('league')}
                  className={`flex-1 min-w-[76px] min-h-[42px] py-2 px-2 text-[11px] md:text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center justify-center ${
                    activeTab === 'league'
                      ? 'bg-[#38bdf8] text-[#05070f] shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.tabLeague}
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 min-w-[76px] min-h-[42px] py-2 px-2 text-[11px] md:text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center justify-center ${
                    activeTab === 'chat'
                      ? 'bg-[#38bdf8] text-[#05070f] shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.tabChat}
                </button>
                <button
                  onClick={() => setActiveTab('adhd')}
                  className={`flex-1 min-w-[76px] min-h-[42px] py-2 px-2 text-[11px] md:text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center justify-center ${
                    activeTab === 'adhd'
                      ? 'bg-gradient-to-r from-[#f59e0b] to-[#c084fc] text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : 'text-amber-400/80 hover:text-amber-300'
                  }`}
                >
                  {t.tabAdhd}
                </button>
                <button
                  onClick={() => setActiveTab('android')}
                  className={`flex-1 min-w-[76px] min-h-[42px] py-2 px-2 text-[11px] md:text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center justify-center ${
                    activeTab === 'android'
                      ? 'bg-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                      : 'text-emerald-400/80 hover:text-emerald-300'
                  }`}
                >
                  {t.tabAndroid}
                </button>
                <button
                  onClick={() => {
                    setActiveTab('mench');
                    sounds.playDiceRoll();
                  }}
                  className={`flex-1 min-w-[76px] min-h-[42px] py-2 px-2 text-[11px] md:text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center justify-center ${
                    activeTab === 'mench'
                      ? 'bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.5)] font-black'
                      : 'text-amber-400 hover:text-amber-200'
                  }`}
                >
                  {t.tabMench}
                </button>
              </nav>
            </div>

            {/* Tab Content Panes */}
            <section>
              {activeTab === 'mench' && (
                <MenchGame
                  userName={appState.user.name}
                  onAddXp={(amount, rep) => addXpAndRep(amount, rep ?? 10)}
                  onShowToast={showToast}
                />
              )}
              {activeTab === 'missions' && (
                <MissionsTab
                  missions={appState.missions}
                  dailyXpEarned={appState.user.dailyXpEarned ?? 180}
                  dailyXpCap={appState.user.dailyXpCap ?? 600}
                  onCompleteMission={handleCompleteMission}
                  onAddMission={handleAddMission}
                />
              )}

              {activeTab === 'trends' && (
                <WorksTab
                  works={appState.works}
                  userName={appState.user.name}
                  onSubmitWork={handleSubmitWork}
                  onSupportWork={handleSupportWork}
                  onPeerReview={handlePeerReview}
                />
              )}

              {activeTab === 'sky' && (
                <ConstellationSky
                  works={appState.works}
                  missions={appState.missions}
                  chatMessages={appState.chatMessages}
                  currentUser={appState.user}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'chairs' && (
                <GrandChairsTab
                  chairs={appState.grandChairs}
                  user={appState.user}
                  onVoteChair={handleVoteChair}
                  onNominateSelf={handleNominateSelf}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'league' && (
                <LeagueTab
                  members={appState.league}
                  currentUserName={appState.user.name}
                />
              )}

              {activeTab === 'chat' && (
                <EmpathyChatTab
                  messages={appState.chatMessages}
                  currentUser={appState.user}
                  onSubmitMessage={handleSubmitChatMessage}
                  onLikeMessage={handleLikeChatMessage}
                />
              )}

              {activeTab === 'adhd' && (
                <AdhdAndA11ySuite
                  t={t}
                  language={currentLang}
                  userRole={appState.user.role}
                  userName={appState.user.name}
                  a11y={a11y}
                  onUpdateA11y={(patch) => setA11y((prev) => ({ ...prev, ...patch }))}
                  onToggleFocusMode={() => setIsFocusModeActive(!isFocusModeActive)}
                  isFocusModeActive={isFocusModeActive}
                  onShowToast={showToast}
                  onAddXp={(amount) => addXpAndRep(amount, 5)}
                />
              )}

              {activeTab === 'android' && (
                <AndroidBuildHub t={t} onShowToast={showToast} />
              )}
            </section>
          </>
        )}

        {/* Footer info */}
        <footer className="mt-6 pt-4 border-t border-slate-800/60 text-center text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
          <span>{t.appSubtitle}</span>
          <span className="font-mono text-[10px] text-slate-600">v1.2.0 • PWA & Android Ready</span>
        </footer>
      </main>
    </div>
  );
}
