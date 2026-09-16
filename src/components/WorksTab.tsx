import React, { useState } from 'react';
import { WorkItem, WorkStatusType } from '../types';
import { Rocket, Eye, Heart, Sparkles, Check, MessageSquare, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { sounds } from '../lib/sound';

interface WorksTabProps {
  works: WorkItem[];
  userName: string;
  onSubmitWork: (title: string, category?: string, description?: string) => void;
  onSupportWork: (id: number) => void;
  onPeerReview: (id: number, comment: string) => void;
}

export const WorksTab: React.FC<WorksTabProps> = ({
  works,
  userName,
  onSubmitWork,
  onSupportWork,
  onPeerReview
}) => {
  const [workTitle, setWorkTitle] = useState('');
  const [category, setCategory] = useState('گیم و بازی');
  const [description, setDescription] = useState('');
  const [filter, setFilter] = useState<'all' | WorkStatusType>('all');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Review states
  const [activeReviewWorkId, setActiveReviewWorkId] = useState<number | null>(null);
  const [reviewComment, setReviewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workTitle.trim()) return;

    onSubmitWork(workTitle.trim(), category, description.trim() || undefined);
    setWorkTitle('');
    setDescription('');
    setShowAdvanced(false);
    sounds.playPublish();
  };

  const handleSendReview = (workId: number) => {
    if (!reviewComment.trim() || reviewComment.trim().length < 5) return;
    onPeerReview(workId, reviewComment.trim());
    setActiveReviewWorkId(null);
    setReviewComment('');
  };

  const filteredWorks = works.filter((w) => {
    if (filter === 'all') return true;
    return w.statusClass === filter;
  });

  const getStatusBadge = (statusClass: WorkStatusType, statusText: string) => {
    switch (statusClass) {
      case 'status-supported':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#c084fc]/15 text-[#c084fc] border border-[#c084fc]/30">
            <Sparkles className="w-2.5 h-2.5 text-[#c084fc]" />
            {statusText}
          </span>
        );
      case 'status-trending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30">
            🔥 {statusText}
          </span>
        );
      case 'status-rising':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30">
            🌱 {statusText}
          </span>
        );
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Submission Form Card */}
      <div className="rounded-xl border border-slate-800 bg-[#020409] p-3.5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-[#38bdf8]" />
            <h3 className="font-bold text-sm text-[#38bdf8]">
              ثبت اثر، محصول یا ایده در چرخه ترند شهری
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-[11px] text-slate-400 hover:text-[#38bdf8] transition-colors underline"
          >
            {showAdvanced ? 'ساده‌سازی' : 'افزودن توضیحات'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              required
              value={workTitle}
              onChange={(e) => setWorkTitle(e.target.value)}
              placeholder="عنوان اثر (مثلاً: ابزار تست خودکار، بازی رفاقتی توانا)..."
              className="flex-1 text-xs p-2 rounded-lg bg-[#0b101d] border border-slate-700 text-white focus:border-[#38bdf8] outline-none"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-xs p-2 rounded-lg bg-[#0b101d] border border-slate-700 text-slate-200 focus:border-[#38bdf8] outline-none"
            >
              <option value="گیم و سرگرمی">🎮 گیم و سرگرمی</option>
              <option value="هوش مصنوعی">🧠 هوش مصنوعی</option>
              <option value="ابزار کارایی">⚡ ابزار کارایی</option>
              <option value="جامعه و آموزش">🌱 جامعه و آموزش</option>
              <option value="هنر و داستان">🎨 هنر و ادبیات</option>
            </select>
            <button
              type="submit"
              className="text-xs font-bold px-4 py-2 rounded-lg bg-[#38bdf8] hover:bg-[#0ea5e9] text-slate-950 transition-colors shrink-0"
            >
              ثبت اثر
            </button>
          </div>

          {showAdvanced && (
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیح دهید این پروژه چه مشکلی از رفقا حل می‌کند و چرا شایسته بررسی همتایان است..."
              className="w-full text-xs p-2 rounded-lg bg-[#0b101d] border border-slate-700 text-white focus:border-[#38bdf8] outline-none"
            />
          )}
        </form>
      </div>

      {/* Stage Filters */}
      <div className="flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <span>فیلتر مرحله:</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-2 py-0.5 rounded text-xs transition-colors ${
              filter === 'all'
                ? 'bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/40 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            همه ({works.length})
          </button>
          <button
            onClick={() => setFilter('status-supported')}
            className={`px-2 py-0.5 rounded text-xs transition-colors ${
              filter === 'status-supported'
                ? 'bg-[#c084fc]/20 text-[#c084fc] border border-[#c084fc]/40 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            🌟 تحت حمایت
          </button>
          <button
            onClick={() => setFilter('status-trending')}
            className={`px-2 py-0.5 rounded text-xs transition-colors ${
              filter === 'status-trending'
                ? 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            🔥 ترند
          </button>
          <button
            onClick={() => setFilter('status-rising')}
            className={`px-2 py-0.5 rounded text-xs transition-colors ${
              filter === 'status-rising'
                ? 'bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/40 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            🌱 رشد
          </button>
        </div>
      </div>

      {/* Works List */}
      <div className="space-y-2.5">
        {filteredWorks.map((w) => (
          <div
            key={w.id}
            className="rounded-xl border border-slate-800 bg-[#0b101d] p-3 hover:border-[#38bdf8]/30 transition-all shadow-sm flex flex-col gap-2"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-xs md:text-sm text-slate-100">{w.title}</h4>
                  <span className="text-[10px] text-[#c084fc] font-medium">
                    (سازنده: {w.author})
                  </span>
                  {w.category && (
                    <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.2 rounded">
                      {w.category}
                    </span>
                  )}
                </div>
                {w.description && (
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                    {w.description}
                  </p>
                )}
              </div>

              {/* Status Badge */}
              <div className="shrink-0">
                {getStatusBadge(w.statusClass, w.status)}
              </div>
            </div>

            {/* Peer review notes list */}
            {w.peerReviewNotes && w.peerReviewNotes.length > 0 && (
              <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/80 space-y-1">
                <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>تأییدیه و بازبینی تخصصی همتایان ({w.peerReviewNotes.length} نظر کارشناسی):</span>
                </div>
                {w.peerReviewNotes.map((pr, idx) => (
                  <div key={idx} className="text-[10px] text-slate-300 flex items-start gap-1">
                    <span className="text-amber-400 font-semibold">{pr.reviewer}:</span>
                    <span>{pr.comment}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom actions: Reviews, Likes, Support */}
            <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/60 text-xs text-slate-400 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[10px]">
                  <Eye className="w-3 h-3 text-slate-500" />
                  {w.views}
                </span>
                <span className="flex items-center gap-1 text-[10px]">
                  <Heart className={`w-3 h-3 ${w.likedByMe ? 'text-rose-400 fill-rose-400' : 'text-slate-500'}`} />
                  {w.likesCount} حامی
                </span>
                <span className="flex items-center gap-1 text-[10px] text-sky-400">
                  <ShieldCheck className="w-3 h-3" />
                  {w.peerReviewsCount || (w.peerReviewNotes ? w.peerReviewNotes.length : 0)} بازبینی تخصصی
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Peer review button to avoid pure clicker spam */}
                <button
                  onClick={() => setActiveReviewWorkId(activeReviewWorkId === w.id ? null : w.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium bg-sky-500/10 text-sky-300 border border-sky-500/25 hover:bg-sky-500/20"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>بازبینی تخصصی</span>
                </button>

                {/* Support button */}
                <button
                  onClick={() => onSupportWork(w.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition-all active:scale-95 ${
                    w.likedByMe
                      ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                      : 'bg-slate-900 border border-slate-700 text-slate-200 hover:border-[#38bdf8] hover:text-[#38bdf8]'
                  }`}
                >
                  {w.likedByMe ? (
                    <>
                      <Check className="w-3 h-3 text-rose-400" />
                      حمایت شده
                    </>
                  ) : (
                    <>
                      <Heart className="w-3 h-3 text-rose-400" />
                      حمایت (+1 XP)
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* In-place Review submission */}
            {activeReviewWorkId === w.id && (
              <div className="mt-1.5 p-2 rounded-lg bg-slate-950 border border-sky-500/30 space-y-1.5">
                <div className="text-[11px] text-sky-300 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span>ثبت بازبینی کارشناسی برای {w.title}</span>
                </div>
                <textarea
                  rows={2}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder={`نقد یا تایید فنی/کاربردی خود به عنوان ${userName} را بنویسید (حداقل ۵ حرف)...`}
                  className="w-full text-xs p-1.5 rounded bg-slate-900 border border-slate-700 text-white outline-none focus:border-sky-400"
                />
                <div className="flex justify-end gap-1.5">
                  <button
                    onClick={() => setActiveReviewWorkId(null)}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300"
                  >
                    انصراف
                  </button>
                  <button
                    disabled={!reviewComment.trim() || reviewComment.trim().length < 5}
                    onClick={() => handleSendReview(w.id)}
                    className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-[#38bdf8] text-slate-950 disabled:opacity-40"
                  >
                    تأیید اعتبار اثر (+۳ Rep)
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
