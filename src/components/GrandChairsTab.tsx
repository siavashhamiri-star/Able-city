import React, { useState } from 'react';
import { GrandChair, AbleUser } from '../types';
import { Crown, Vote, ShieldCheck, Clock, Award, CheckCircle, Info } from 'lucide-react';
import { sounds } from '../lib/sound';

interface GrandChairsTabProps {
  chairs: GrandChair[];
  user: AbleUser;
  onVoteChair: (id: number) => void;
  onNominateSelf: (chairId: number) => void;
  onShowToast: (msg: string) => void;
}

export const GrandChairsTab: React.FC<GrandChairsTabProps> = ({
  chairs,
  user,
  onVoteChair,
  onNominateSelf,
  onShowToast
}) => {
  const [showRules, setShowRules] = useState(false);

  const handleNominate = (chair: GrandChair) => {
    if (user.level < chair.requiredLevel || user.rep < chair.requiredRep) {
      onShowToast(
        `⚠️ برای نامزدی این صندلی نیاز به حداقل سطح ${chair.requiredLevel} و اعتبار ${chair.requiredRep} دارید. تلاش کنید!`
      );
      return;
    }

    onNominateSelf(chair.id);
    sounds.playLevelUp();
    onShowToast(`🎉 نامزدی شما برای «${chair.seat}» با موفقیت ثبت گردید!`);
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="rounded-xl border border-[#f59e0b]/40 bg-[#020409] p-4 shadow-[0_10px_30px_rgba(245,158,11,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-[#f59e0b]" />
            <h3 className="font-bold text-sm md:text-base text-[#f59e0b]">
              👑 تالار صندلی بزرگان (دموکراسی شایسته‌سالار)
            </h3>
          </div>
          <button
            onClick={() => setShowRules(!showRules)}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-[#f59e0b] transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            {showRules ? 'بستن آیین‌نامه' : 'مشاهده منشور و شروط'}
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          صندلی‌های ۳۰ روزه بر اساس ترکیب تخصص (XP)، شاخص اعتبار و امانتداری (Reputation) و رأی رفیقان همسنگر به دست می‌آیند و به طور منظم چرخشی هستند تا هیچ قدرتی جاودانه و راکد نماند.
        </p>

        {showRules && (
          <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-2 bg-slate-950/60 p-3 rounded-lg">
            <div className="font-bold text-[#f59e0b] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              ۳ اصل بنیادی شایسته‌سالاری در شهر توانا:
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
              <li>هیچ عنوانی مادام‌العمر نیست؛ هر دوره پس از ۳۰ روز به داوری جامعه رفیقان گذاشته می‌شود.</li>
              <li>رأی هر فرد با ضریب اعتبار (Reputation) وزن‌دهی می‌شود تا از بات‌ها و قبیله‌گرایی جلوگیری شود.</li>
              <li>دارندگان صندلی موظف به حمایت از آثار جوانان و گره‌گشایی از بحران‌های روحی و فنی یاران هستند.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Chairs List */}
      <div className="space-y-3">
        {chairs.map((chair) => (
          <div
            key={chair.id}
            className="rounded-xl border border-amber-500/30 bg-[#060913] p-4 transition-all duration-200 hover:border-amber-400/50 shadow-md space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#f59e0b] font-black shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#f59e0b]">{chair.seat}</h4>
                  <div className="text-xs text-slate-200 flex items-center gap-1.5 mt-0.5">
                    <span>نشیننده فعلی:</span>
                    <span className="font-black text-[#38bdf8]">{chair.holder}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-[#c084fc] bg-[#c084fc]/10 px-2.5 py-1 rounded-lg border border-[#c084fc]/20 shrink-0 self-start sm:self-auto">
                <Clock className="w-3 h-3" />
                <span>{chair.term}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {chair.desc}
            </p>

            {/* Criteria & Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs">
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span className="text-slate-300">
                  شرط احراز: <span className="text-[#f59e0b]">سطح {chair.requiredLevel}</span> و <span className="text-[#c084fc]">اعتبار {chair.requiredRep}</span>
                </span>
                <span className="text-slate-500">|</span>
                <span className="font-bold text-[#38bdf8]">
                  {chair.votes} رأی اعتماد
                </span>
              </div>

              <div className="flex items-center gap-2">
                {chair.isVacant ? (
                  <button
                    onClick={() => handleNominate(chair)}
                    className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#c084fc] hover:bg-[#a855f7] text-slate-950 transition-all active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    نامزدی برای این صندلی
                  </button>
                ) : (
                  <button
                    onClick={() => onVoteChair(chair.id)}
                    className={`w-full sm:w-auto px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
                      chair.votedByMe
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {chair.votedByMe ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        رأی شما ثبت شده
                      </>
                    ) : (
                      <>
                        <Vote className="w-3.5 h-3.5 text-[#38bdf8]" />
                        حمایت و رأی اعتماد
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
