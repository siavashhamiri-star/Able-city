import React, { useState } from 'react';
import { Mission } from '../types';
import { CheckCircle2, Code, PlusCircle, Sparkles, Shield, Flame, Compass, FileCheck, AlertTriangle } from 'lucide-react';
import { sounds } from '../lib/sound';

interface MissionsTabProps {
  missions: Mission[];
  dailyXpEarned: number;
  dailyXpCap: number;
  onCompleteMission: (id: number, proofNote?: string) => void;
  onAddMission: (newMission: Omit<Mission, 'id' | 'completed'>) => void;
}

type FilterScope = 'all' | 'city' | 'personal';

export const MissionsTab: React.FC<MissionsTabProps> = ({
  missions,
  dailyXpEarned,
  dailyXpCap,
  onCompleteMission,
  onAddMission
}) => {
  const [filterScope, setFilterScope] = useState<FilterScope>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeProofMissionId, setActiveProofMissionId] = useState<number | null>(null);
  const [proofText, setProofText] = useState('');

  // Add form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState('150');
  const [repReward, setRepReward] = useState('5');
  const [category, setCategory] = useState<Mission['category']>('personal');
  const [scope, setScope] = useState<'city' | 'personal'>('personal');
  const [proofRequired, setProofRequired] = useState(true);

  const isDailyCapped = dailyXpEarned >= dailyXpCap;

  const filteredMissions = missions.filter((m) => {
    if (filterScope === 'all') return true;
    const missionScope = m.scope || (m.category === 'personal' || m.category === 'bounty' ? 'personal' : 'city');
    return missionScope === filterScope;
  });

  const completedCount = filteredMissions.filter((m) => m.completed).length;
  const totalCount = filteredMissions.length;

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddMission({
      title: title.trim(),
      description: description.trim() || undefined,
      reward: parseInt(reward) || 100,
      repReward: parseInt(repReward) || 3,
      category,
      scope,
      proofRequired,
    });

    setTitle('');
    setDescription('');
    setShowAddModal(false);
    sounds.playPublish();
  };

  const handleConfirmProof = (missionId: number) => {
    onCompleteMission(missionId, proofText.trim() || undefined);
    setActiveProofMissionId(null);
    setProofText('');
  };

  const getCategoryLabel = (cat: Mission['category']) => {
    switch (cat) {
      case 'personal': return 'سنگر فردی 🛡️';
      case 'bounty': return 'پاداش رفاقتی 🤝';
      case 'core': return 'هسته اصلی شهر';
      case 'trend': return 'موتور ترند';
      case 'community': return 'جامعه و روح';
      case 'infra': return 'معماری و امنیت';
      default: return 'توسعه';
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Overview Card with Daily Cap Indicator */}
      <div className="rounded-xl border border-slate-800 bg-[#020409] p-3.5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-[#38bdf8]" />
            <h3 className="font-bold text-sm text-[#38bdf8]">
              میدان مأموریت‌ها و اثبات کار (Proof of Value)
            </h3>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30 hover:bg-[#38bdf8]/20 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            تعریف مأموریت جدید
          </button>
        </div>

        {/* Daily Cap Banner */}
        {isDailyCapped ? (
          <div className="mb-2.5 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>سقف درآمد امروز تکمیل شد ({dailyXpEarned}/{dailyXpCap} XP):</strong> برای جلوگیری از فرسودگی، تکمیل مأموریت‌ها صرفاً برای ثبت دستاورد و افتخار ثبت می‌شود و امتیاز جدید تا فردا تعلق نمی‌گیرد.
            </span>
          </div>
        ) : (
          <div className="mb-2.5 flex items-center justify-between text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-900">
            <span>🛡️ سقف روزانه ضدفرسودگی: <strong>{dailyXpEarned} / {dailyXpCap} XP</strong></span>
            <span className="text-emerald-400 font-semibold">{dailyXpCap - dailyXpEarned} XP تا سقف امروز</span>
          </div>
        )}

        {/* Scope Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
          <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setFilterScope('all')}
              className={`px-2 py-0.5 rounded text-xs font-semibold transition-all ${
                filterScope === 'all'
                  ? 'bg-[#38bdf8] text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              همه ({missions.length})
            </button>
            <button
              onClick={() => setFilterScope('personal')}
              className={`px-2 py-0.5 rounded text-xs font-semibold transition-all flex items-center gap-1 ${
                filterScope === 'personal'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-amber-400/80 hover:text-amber-300'
              }`}
            >
              <Flame className="w-3 h-3" />
              <span>سنگر من</span>
            </button>
            <button
              onClick={() => setFilterScope('city')}
              className={`px-2 py-0.5 rounded text-xs font-semibold transition-all flex items-center gap-1 ${
                filterScope === 'city'
                  ? 'bg-[#c084fc] text-slate-950 font-bold'
                  : 'text-purple-400/80 hover:text-purple-300'
              }`}
            >
              <Compass className="w-3 h-3" />
              <span>مأموریت‌های شهر</span>
            </button>
          </div>

          <div className="text-[11px] font-semibold text-emerald-400">
            {completedCount} از {totalCount} تکمیل شده ({Math.round((completedCount / (totalCount || 1)) * 100)}٪)
          </div>
        </div>
      </div>

      {/* Missions List */}
      <div className="space-y-2">
        {filteredMissions.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-[#0b101d] border border-slate-800 text-slate-400 text-xs">
            هنوز مأموریتی در این بخش ثبت نشده است. از دکمه بالا برای اضافه کردن مأموریت شخصی استفاده کنید.
          </div>
        ) : (
          filteredMissions.map((m) => (
            <div
              key={m.id}
              className={`rounded-xl p-3 border transition-all duration-200 flex flex-col gap-2 ${
                m.completed
                  ? 'bg-[#0b101d]/60 border-emerald-950/70 text-slate-300'
                  : m.scope === 'personal' || m.category === 'personal'
                  ? 'bg-[#0f1527] border-amber-500/20 hover:border-amber-400/40'
                  : 'bg-[#0b101d] border-slate-800 hover:border-[#38bdf8]/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-100">
                      {m.title}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${
                      m.scope === 'personal' || m.category === 'personal'
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700/60'
                    }`}>
                      {getCategoryLabel(m.category)}
                    </span>
                    {m.proofRequired && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/25 flex items-center gap-0.5">
                        <FileCheck className="w-2.5 h-2.5" />
                        نیاز به ثبت خلاصه انجام
                      </span>
                    )}
                  </div>
                  {m.description && (
                    <p className="text-[11px] text-slate-400 leading-relaxed max-w-xl">
                      {m.description}
                    </p>
                  )}
                  {m.proofNote && (
                    <div className="text-[10px] text-emerald-300/90 italic bg-emerald-950/30 px-2 py-1 rounded border border-emerald-900/40">
                      خلاصه اثبات کار: {m.proofNote}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[10px] pt-0.5">
                    <span className="text-[#10b981] font-semibold flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" />
                      +{m.reward} XP
                    </span>
                    <span className="text-[#c084fc] font-semibold">
                      +{m.repReward} Rep اعتبار
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center justify-end">
                  {m.completed ? (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-[#10b981] bg-[#10b981]/10 px-2.5 py-1 rounded-lg border border-[#10b981]/25">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      تکمیل و ثبت شد
                    </div>
                  ) : activeProofMissionId === m.id ? (
                    <button
                      onClick={() => setActiveProofMissionId(null)}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300"
                    >
                      بستن فرم
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (m.proofRequired) {
                          setActiveProofMissionId(m.id);
                        } else {
                          onCompleteMission(m.id);
                        }
                      }}
                      className="w-full sm:w-auto text-xs font-bold px-3 py-1.5 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 transition-all active:scale-95 flex items-center justify-center gap-1 shadow-xs"
                    >
                      <span>{m.proofRequired ? 'ثبت اثبات کار و تکمیل' : 'انجام دادم'}</span>
                      <Sparkles className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* In-place Proof of Value box */}
              {activeProofMissionId === m.id && (
                <div className="mt-2 p-2.5 rounded-xl bg-slate-950 border border-amber-500/40 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>گام اثبات ارزش و رفاقت (Proof of Work):</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    برای جلوگیری از کلیک‌های کور، یک خط بنویس چه تغییری دادی یا چه گامی در عمل برداشتی:
                  </p>
                  <textarea
                    rows={2}
                    value={proofText}
                    onChange={(e) => setProofText(e.target.value)}
                    placeholder="مثال: ۲ تا تست نوشتم و کامپوننت دکمه رو بدون ارور پاس کردم..."
                    className="w-full text-xs p-2 rounded-lg bg-[#05070f] border border-slate-700 text-white focus:border-[#38bdf8] outline-none"
                  />
                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setActiveProofMissionId(null)}
                      className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300"
                    >
                      انصراف
                    </button>
                    <button
                      type="button"
                      disabled={!proofText.trim()}
                      onClick={() => handleConfirmProof(m.id)}
                      className="text-xs px-3 py-1 rounded bg-[#38bdf8] text-slate-950 font-bold disabled:opacity-40"
                    >
                      تأیید و دریافت پاداش
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal to add custom mission */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-[#0b101d] border border-slate-700 p-4 shadow-2xl space-y-3">
            <h4 className="text-sm font-black text-[#38bdf8] flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              تعریف مأموریت جدید در شهر توانا
            </h4>
            <form onSubmit={handleSubmitNew} className="space-y-2.5">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">دامنه مأموریت:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setScope('personal');
                      setCategory('personal');
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                      scope === 'personal'
                        ? 'bg-amber-400 text-slate-950 border-amber-400'
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}
                  >
                    🛡️ سنگر شخصی من
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setScope('city');
                      setCategory('core');
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                      scope === 'city'
                        ? 'bg-[#38bdf8] text-slate-950 border-[#38bdf8]'
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}
                  >
                    🏛️ مأموریت عمومی شهر
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">عنوان مأموریت:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: ۲ دقیقه خرد کردن منطق دیتابیس..."
                  className="w-full text-xs p-2 rounded-lg bg-[#05070f] border border-slate-700 text-white focus:border-[#38bdf8] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">توضیحات کوتاه (اختیاری):</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="دلیل انجام این کار و پاداش ذهنی آن..."
                  className="w-full text-xs p-2 rounded-lg bg-[#05070f] border border-slate-700 text-white focus:border-[#38bdf8] outline-none"
                />
              </div>

              <div className="flex items-center gap-2 p-2 bg-slate-950 rounded-lg border border-slate-800">
                <input
                  type="checkbox"
                  id="proofReq"
                  checked={proofRequired}
                  onChange={(e) => setProofRequired(e.target.checked)}
                  className="w-3.5 h-3.5 text-[#38bdf8] rounded"
                />
                <label htmlFor="proofReq" className="text-[11px] text-slate-300 cursor-pointer">
                  نیاز به ثبت خلاصه اثبات کار (جلوگیری از کلیک صوری)
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-300 block mb-1">پاداش XP:</label>
                  <input
                    type="number"
                    min="30"
                    max="400"
                    value={reward}
                    onChange={(e) => setReward(e.target.value)}
                    className="w-full text-xs p-1.5 rounded bg-[#05070f] border border-slate-700 text-white focus:border-[#38bdf8] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-300 block mb-1">اعتبار (Rep):</label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={repReward}
                    onChange={(e) => setRepReward(e.target.value)}
                    className="w-full text-xs p-1.5 rounded bg-[#05070f] border border-slate-700 text-white focus:border-[#38bdf8] outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="text-xs px-4 py-1.5 rounded-lg bg-[#38bdf8] text-slate-950 font-bold hover:opacity-90"
                >
                  افزودن مأموریت
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
