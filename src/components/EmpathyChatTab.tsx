import React, { useState } from 'react';
import { ChatMessage, AbleUser } from '../types';
import { MessageSquareHeart, Heart, Send, Sparkles, ShieldAlert, Wifi } from 'lucide-react';
import { sounds } from '../lib/sound';

interface EmpathyChatTabProps {
  messages: ChatMessage[];
  currentUser: AbleUser;
  onSubmitMessage: (text: string, tag?: string) => void;
  onLikeMessage: (id: number) => void;
}

export const EmpathyChatTab: React.FC<EmpathyChatTabProps> = ({
  messages,
  currentUser: _currentUser,
  onSubmitMessage,
  onLikeMessage
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedTag, setSelectedTag] = useState('همدلی و امید');

  const tags = [
    { label: 'همدلی و امید', icon: '🕊️' },
    { label: 'عهد رفاقت', icon: '🤝' },
    { label: 'شوق ساختن', icon: '⚡' },
    { label: 'دل‌نوشته و رنج', icon: '🕯️' },
    { label: 'ایده ارزش‌آفرینی', icon: '💡' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSubmitMessage(inputText.trim(), selectedTag);
    setInputText('');
    sounds.playPublish();
  };

  return (
    <div className="space-y-3.5">
      {/* Safety & Solidarity Banner */}
      <div className="rounded-xl border border-[#38bdf8]/30 bg-[#38bdf8]/5 p-3 text-xs text-[#93c5fd] leading-relaxed flex items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#38bdf8] shrink-0" />
          <span className="font-semibold text-slate-200">
            پناهگاه امن گفتگو و التیام روح همسنگران (همگام‌سازی زنده با سرور ابری)
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
          <Wifi className="w-3 h-3" />
          سرور فعال
        </span>
      </div>

      {/* Message Composer Card */}
      <div className="rounded-xl border border-slate-800 bg-[#020409] p-3.5 shadow-sm space-y-2.5">
        <div className="flex items-center gap-2">
          <MessageSquareHeart className="w-4 h-4 text-[#c084fc]" />
          <h3 className="font-bold text-sm text-[#38bdf8]">
            ارسال دل‌نوشته، دغدغه یا پیام به رفقا
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          <textarea
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="حرف دلت رو بنویس؛ از خستگی‌ها، امیدها یا جرقه‌ای که امروز در دلت روشن شد..."
            className="w-full text-xs p-2.5 rounded-lg bg-[#0b101d] border border-slate-700 text-white placeholder-slate-500 focus:border-[#38bdf8] outline-none"
          />

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] text-slate-400">برچسب پیام:</span>
            {tags.map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => setSelectedTag(tag.label)}
                className={`text-[11px] px-2 py-0.5 rounded-lg border transition-colors flex items-center gap-1 ${
                  selectedTag === tag.label
                    ? 'bg-[#38bdf8]/15 border-[#38bdf8] text-[#38bdf8] font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>{tag.icon}</span>
                <span>{tag.label}</span>
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-full sm:w-auto text-xs font-bold px-4 py-2 rounded-lg bg-[#38bdf8] hover:bg-[#0ea5e9] text-slate-950 transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>ارسال به پناهگاه</span>
            <Send className="w-3.5 h-3.5" />
            <span className="text-[10px] bg-slate-950/20 px-1.5 py-0.2 rounded font-normal">
              (+۲۵ XP)
            </span>
          </button>
        </form>
      </div>

      {/* Messages Feed */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold px-1">
          <Sparkles className="w-3 h-3 text-[#38bdf8]" />
          <span>پیام‌های هم‌مسیران در شهر توانا</span>
        </div>

        <div className="space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="rounded-xl border border-slate-800 bg-[#0b101d] p-3 transition-all hover:border-slate-700 space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-[#38bdf8] flex items-center gap-1">
                    <span>🕊️</span>
                    <span>{msg.author}</span>
                  </span>
                  {msg.role && (
                    <span className="text-[9px] text-[#c084fc] bg-[#c084fc]/10 px-1.5 py-0.2 rounded border border-[#c084fc]/20">
                      {msg.role}
                    </span>
                  )}
                  {msg.tag && (
                    <span className="text-[9px] text-slate-400 bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
                      {msg.tag}
                    </span>
                  )}
                </div>

                <span className="text-[10px] text-slate-500">
                  {msg.timestamp}
                </span>
              </div>

              <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                {msg.text}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs">
                <span className="text-[10px] text-slate-500">
                  پیام در پناهگاه پایدار ثبت شد
                </span>

                <button
                  type="button"
                  onClick={() => onLikeMessage(msg.id)}
                  className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg transition-all active:scale-95 ${
                    msg.likedByMe
                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <Heart className={`w-3 h-3 ${msg.likedByMe ? 'fill-rose-400' : ''}`} />
                  <span>{msg.likes} حامی</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
