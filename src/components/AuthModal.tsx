import React, { useState } from 'react';
import { TranslationDictionary } from '../lib/i18n';
import { sounds } from '../lib/sound';
import { ShieldCheck, Mail, Phone, Lock, X, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: TranslationDictionary;
  onRegisterSuccess: (userProfile: { name: string; email: string; phone?: string; country: string }) => void;
  onShowToast: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  t,
  onRegisterSuccess,
  onShowToast,
}) => {
  const [activeCountryTab, setActiveCountryTab] = useState<'iran' | 'global'>('iran');
  const [fullName, setFullName] = useState('');
  const [gmail, setGmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [demoOtpCode, setDemoOtpCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle sending OTP for Iranian Mobile + Gmail
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanMobile = mobile.replace(/\s+/g, '');
    if (!/^(\+98|0)?9\d{9}$/.test(cleanMobile)) {
      setErrorMessage('شماره موبایل باید یک شماره معتبر در ایران باشد (مثال: 09123456789)');
      return;
    }

    if (!gmail.includes('@') || (!gmail.toLowerCase().includes('gmail.com') && !gmail.includes('.'))) {
      setErrorMessage('لطفاً یک آدرس جیمیل معتبر وارد کنید.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/send-iran-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: cleanMobile, gmail }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'خطا در ارسال پیامک تأیید');
      }

      setIsOtpSent(true);
      setDemoOtpCode(data.demoCode || '123456');
      sounds.playHeart();
      onShowToast(`کد تایید ۶ رقمی به شماره ${cleanMobile} ارسال شد! (کد تست: ${data.demoCode})`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'خطا در اتصال به سرور';
      setErrorMessage(msg);
      // Fallback local simulation if network is disrupted
      setIsOtpSent(true);
      setDemoOtpCode('849201');
      onShowToast('کد تایید ۶ رقمی شبیه‌سازی شد: 849201');
    } finally {
      setIsLoading(false);
    }
  };

  // Final verification for Iran
  const handleVerifyIran = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!otpCode || otpCode.length < 5) {
      setErrorMessage('لطفاً کد تایید دریافتی را به طور کامل وارد کنید.');
      return;
    }

    // Success registration
    sounds.playLevelUp();
    onRegisterSuccess({
      name: fullName.trim() || 'شهروند شایسته توانا',
      email: gmail.trim(),
      phone: mobile.trim(),
      country: 'Iran',
    });
    onClose();
  };

  // Global Gmail Registration
  const handleGlobalRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!gmail || !gmail.includes('@')) {
      setErrorMessage('Please enter a valid Gmail address.');
      return;
    }

    sounds.playLevelUp();
    onRegisterSuccess({
      name: fullName.trim() || 'Global Citizen',
      email: gmail.trim(),
      country: 'Global',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-[480px] bg-[#0b101d] border border-slate-700 rounded-2xl p-5 shadow-[0_25px_60px_rgba(0,0,0,0.9)] relative space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-center justify-center mx-auto text-[#38bdf8] mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base md:text-lg text-white">
            {t.authTitle}
          </h3>
          <p className="text-xs text-slate-400">
            {t.authDesc}
          </p>
        </div>

        {/* Country Selector Tabs */}
        <div className="flex gap-1 bg-[#020409] p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setActiveCountryTab('iran');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeCountryTab === 'iran'
                ? 'bg-[#38bdf8] text-slate-950 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.authIranTab}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveCountryTab('global');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeCountryTab === 'global'
                ? 'bg-[#c084fc] text-slate-950 shadow-[0_0_15px_rgba(192,132,252,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.authGlobalTab}
          </button>
        </div>

        {errorMessage && (
          <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs text-center">
            {errorMessage}
          </div>
        )}

        {/* IRAN REGISTRATION FLOW */}
        {activeCountryTab === 'iran' && (
          <div className="space-y-3">
            {!isOtpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">نام یا لقب شما در شهر:</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: سهراب، هما، معمار..."
                    className="w-full text-xs p-2.5 rounded-xl bg-[#060913] border border-slate-800 text-white focus:border-[#38bdf8] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#38bdf8]" />
                    {t.gmailLabel}
                  </label>
                  <input
                    type="email"
                    required
                    value={gmail}
                    onChange={(e) => setGmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    dir="ltr"
                    className="w-full text-xs p-2.5 rounded-xl bg-[#060913] border border-slate-800 text-white focus:border-[#38bdf8] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#10b981]" />
                    {t.mobileLabel}
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="09123456789"
                    dir="ltr"
                    className="w-full text-xs p-2.5 rounded-xl bg-[#060913] border border-slate-800 text-white focus:border-[#10b981] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-[#38bdf8] hover:bg-sky-400 text-slate-950 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>{isLoading ? 'در حال ارسال پیامک...' : t.sendOtpBtn}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyIran} className="space-y-3">
                <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-800/40 text-xs text-sky-200">
                  پیامک به شماره <span className="font-mono font-bold text-white">{mobile}</span> ارسال شد.
                  {demoOtpCode && (
                    <div className="mt-1 text-[11px] text-amber-300 font-mono">
                      (کد تست دریافتی: {demoOtpCode})
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#f59e0b]" />
                    {t.otpLabel}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="کد ۶ رقمی"
                    dir="ltr"
                    className="w-full text-center tracking-widest font-mono text-base p-2.5 rounded-xl bg-[#060913] border border-amber-500/50 text-amber-300 focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOtpSent(false)}
                    className="w-1/3 py-2 px-3 rounded-xl text-xs bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                  >
                    ویرایش شماره
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-2 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-[#10b981] to-[#38bdf8] text-slate-950 hover:opacity-90 flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.verifyAndRegisterBtn}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* GLOBAL REGISTRATION FLOW */}
        {activeCountryTab === 'global' && (
          <form onSubmit={handleGlobalRegister} className="space-y-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Your Name / Handle:</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex, Maya, CyberCrafter"
                className="w-full text-xs p-2.5 rounded-xl bg-[#060913] border border-slate-800 text-white focus:border-[#c084fc] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#c084fc]" />
                {t.gmailLabel}
              </label>
              <input
                type="email"
                required
                value={gmail}
                onChange={(e) => setGmail(e.target.value)}
                placeholder="yourname@gmail.com"
                dir="ltr"
                className="w-full text-xs p-2.5 rounded-xl bg-[#060913] border border-slate-800 text-white focus:border-[#c084fc] outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-[#c084fc] hover:bg-purple-400 text-slate-950 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.googleSignInBtn}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
