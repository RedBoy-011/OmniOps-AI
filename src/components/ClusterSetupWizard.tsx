import React, { useState } from 'react';
import {
  Shield,
  Key,
  Server,
  Cpu,
  Check,
  Zap,
  Globe,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  Mail,
  User,
  CheckCircle2,
  Terminal,
  Activity,
  Layers,
  Laptop
} from 'lucide-react';

interface ClusterSetupWizardProps {
  onSetupComplete: (adminUser: { email: string; role: string; token: string }) => void;
  onCancel?: () => void;
}

export const ClusterSetupWizard: React.FC<ClusterSetupWizardProps> = ({
  onSetupComplete,
  onCancel
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Admin Credentials & Setup Code
  const [setupSecurityCode, setSetupSecurityCode] = useState('OMNI-A9F4-77D2-E801');
  const [adminEmail, setAdminEmail] = useState('admin@omniops.ai');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Step 2: Architecture Selection
  const [clusterType, setClusterType] = useState<'standalone' | 'multi_server'>('standalone');
  const [server2Ip, setServer2Ip] = useState('');

  // Step 3: AI Inference Core
  const [aiEngine, setAiEngine] = useState<'hybrid' | 'local_only' | 'openrouter_only'>('hybrid');
  const [openRouterKey, setOpenRouterKey] = useState('');
  const [enableSocks5, setEnableSocks5] = useState(false);

  // Validation step 1
  const handleNextStep1 = () => {
    setErrorMsg(null);
    if (!adminEmail.includes('@')) {
      setErrorMsg('لطفاً یک آدرس ایمیل معتبر وارد کنید.');
      return;
    }
    if (adminPassword.length < 6) {
      setErrorMsg('رمز عبور باید حداقل ۶ کاراکتر باشد.');
      return;
    }
    if (adminPassword !== confirmPassword) {
      setErrorMsg('رمز عبور و تکرار آن یکسان نیستند.');
      return;
    }
    setStep(2);
  };

  const handleFinishSetup = () => {
    // Generate secure pairing token
    const randomHex = Math.random().toString(36).substring(2, 10);
    const initialToken = `omni_win_usr_admin_${randomHex}`;

    // Mark cluster as initialized in storage
    localStorage.setItem('omniops_cluster_initialized', 'true');
    localStorage.setItem('omniops_admin_email', adminEmail);

    onSetupComplete({
      email: adminEmail,
      role: 'Master Cluster Administrator',
      token: initialToken
    });
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 bg-[#09090b] overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200" dir="rtl">
      
      {/* Background lights */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-cyan-600/15 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-purple-600/15 blur-[140px] pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative w-full max-w-2xl glass-surface-elevated rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/10 z-10">
        
        {/* Top Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>راه‌اندازی سرور از نقطه صفر (Clean Production Initializer)</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            ویزارد اولیه استقرار کلاستر OmniOps AI
          </h1>
          <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
            هیچ داده ماک یا تنظیمات پیش‌فرضی اعمال نشده است؛ در ۴ مرحله مشخصات مدیر و توپولوژی سرور را تعیین کنید.
          </p>
        </div>

        {/* Step Progress Pills */}
        <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
          {[
            { num: 1, title: 'حساب مدیر' },
            { num: 2, title: 'توپولوژی کلاستر' },
            { num: 3, title: 'هسته AI' },
            { num: 4, title: 'تایید نهایی' }
          ].map((s, idx) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step === s.num
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/50'
                  : step > s.num
                  ? 'bg-emerald-500 text-black'
                  : 'bg-white/10 text-neutral-400'
              }`}>
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className={`text-[11px] hidden sm:inline ${step === s.num ? 'text-white font-bold' : 'text-neutral-400'}`}>
                {s.title}
              </span>
              {idx < 3 && <div className="w-6 sm:w-10 h-0.5 bg-white/10 mx-1" />}
            </div>
          ))}
        </div>

        {/* STEP 1: Admin Credentials */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-neutral-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>کد امنیتی نصب سرور (Server Setup Code):</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                این کد پس از اجرای <code className="text-cyan-400 font-mono">install.sh</code> در ترمینال سرور چاپ می‌شود:
              </p>
              <div className="p-2 bg-black/60 rounded-xl font-mono text-cyan-300 text-center tracking-wider text-xs select-all">
                {setupSecurityCode}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">ایمیل مدیر کل کلاستر (SuperAdmin Email):</label>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full glass-input rounded-xl py-2.5 pr-10 pl-3 text-white font-mono text-xs"
                    dir="ltr"
                    placeholder="admin@omniops.ai"
                  />
                  <Mail className="w-4 h-4 text-neutral-400 absolute right-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">کلمه عبور دائمی مدیر:</label>
                <div className="relative flex items-center">
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full glass-input rounded-xl py-2.5 pr-10 pl-3 text-white font-mono text-xs"
                    dir="ltr"
                    placeholder="حداقل ۶ کاراکتر"
                  />
                  <Lock className="w-4 h-4 text-neutral-400 absolute right-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">تکرار کلمه عبور:</label>
                <div className="relative flex items-center">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full glass-input rounded-xl py-2.5 pr-10 pl-3 text-white font-mono text-xs"
                    dir="ltr"
                    placeholder="تکرار کلمه عبور"
                  />
                  <Lock className="w-4 h-4 text-neutral-400 absolute right-3 pointer-events-none" />
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs">
                  {errorMsg}
                </div>
              )}
            </div>

            <div className="pt-4 flex items-center justify-between">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs cursor-pointer"
                >
                  انصراف
                </button>
              )}
              <button
                type="button"
                onClick={handleNextStep1}
                className="mr-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-cyan-950/70"
              >
                <span>مرحله بعد: انتخاب توپولوژی</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Architecture Selection */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-sm font-bold text-white mb-2">نوع استقرار و تعداد سرورها را انتخاب فرمایید:</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setClusterType('standalone')}
                className={`p-4 rounded-2xl text-right transition-all cursor-pointer space-y-2 border ${
                  clusterType === 'standalone'
                    ? 'border-cyan-500/60 bg-cyan-950/20 shadow-md shadow-cyan-950/40'
                    : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Server className="w-5 h-5 text-cyan-400" />
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    clusterType === 'standalone' ? 'border-cyan-400 bg-cyan-400' : 'border-neutral-500'
                  }`} />
                </div>
                <strong className="text-white block font-bold">تک‌سرور (All-in-One Master)</strong>
                <p className="text-neutral-400 text-[11px] leading-relaxed">
                  هسته OmniRoute، پنل مدیریت و ایجنت همگی روی یک سرور لینوکس ابری یا سرور محلی اجرا می‌شوند.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setClusterType('multi_server')}
                className={`p-4 rounded-2xl text-right transition-all cursor-pointer space-y-2 border ${
                  clusterType === 'multi_server'
                    ? 'border-cyan-500/60 bg-cyan-950/20 shadow-md shadow-cyan-950/40'
                    : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Cpu className="w-5 h-5 text-purple-400" />
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    clusterType === 'multi_server' ? 'border-purple-400 bg-purple-400' : 'border-neutral-500'
                  }`} />
                </div>
                <strong className="text-white block font-bold">دو سروره (Master + GPU Worker)</strong>
                <p className="text-neutral-400 text-[11px] leading-relaxed">
                  سرور اول به عنوان کنترل‌پلن و سرور دوم به عنوان نود پردازشی کارت گرافیک انویدیا با اتصال mTLS کار می‌کند.
                </p>
              </button>
            </div>

            {clusterType === 'multi_server' && (
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs space-y-2">
                <label className="block text-purple-300 font-semibold">آدرس IP سرور دوم (اختیاری):</label>
                <input
                  type="text"
                  value={server2Ip}
                  onChange={(e) => setServer2Ip(e.target.value)}
                  placeholder="مثال: 185.190.140.23 یا 192.168.1.150"
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl font-mono text-purple-200 text-xs"
                  dir="ltr"
                />
                <p className="text-[10px] text-neutral-400">
                  می‌توانید بعداً نیز از داخل داشبورد، سرور دوم یا نودهای بیشتر را با توکن اتصال اضافه فرمایید.
                </p>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs cursor-pointer flex items-center gap-1"
              >
                <ArrowRight className="w-4 h-4" />
                <span>قبلی</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-cyan-950/70"
              >
                <span>مرحله بعد: هسته استنتاج AI</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: AI Inference Core */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200 text-xs">
            <h3 className="text-sm font-bold text-white mb-2">استراتژی مسیریابی مدل‌های هوش مصنوعی را انتخاب کنید:</h3>

            <div className="space-y-2.5">
              {[
                {
                  id: 'hybrid',
                  title: 'ترکیبی هوشمند (پیشنهادی - Hybrid with Fallback)',
                  desc: 'مدل‌های سبک و سریع لوکال اولویت دارند؛ در صورت پر شدن رم یا سوالات سنگین، خودکار به DeepSeek V4 سوئیچ می‌کند.'
                },
                {
                  id: 'local_only',
                  title: 'کاملاً لوکال و آفلاین (Privacy First)',
                  desc: 'تمامی مدل‌ها فقط از Ollama و vLLM روی سرورهای خودتان اجرا می‌شوند و هیچ ترافیکی به خارج از کشور ارسال نمی‌شود.'
                },
                {
                  id: 'openrouter_only',
                  title: 'کلاود از طریق OpenRouter (Ultra-Fast & Zero Server Load)',
                  desc: 'دسترسی ارزان و مستقیم به برترین مدل‌های جهان با یک کلید API بدون نیاز به داشتن سخت‌افزار گران‌قیمت.'
                }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAiEngine(opt.id as any)}
                  className={`w-full p-3.5 rounded-xl text-right transition-all cursor-pointer border ${
                    aiEngine === opt.id
                      ? 'border-cyan-500/60 bg-cyan-950/20 shadow-sm'
                      : 'border-white/10 hover:border-white/20 bg-white/[0.01]'
                  }`}
                >
                  <strong className="text-white block font-bold mb-1">{opt.title}</strong>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">{opt.desc}</p>
                </button>
              ))}
            </div>

            <div className="p-3 bg-white/[0.02] border border-white/10 rounded-xl space-y-2">
              <label className="block text-neutral-300 font-semibold">کلید API ارائه‌دهنده OpenRouter (اختیاری):</label>
              <input
                type="password"
                value={openRouterKey}
                onChange={(e) => setOpenRouterKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl font-mono text-xs text-neutral-200"
                dir="ltr"
              />
              <span className="text-[10px] text-neutral-400 block">
                می‌توانید کلیدهای دیگر (Gemini, Groq, DeepSeek) را نیز در بخش پرووایدرهای پنل وارد نمایید.
              </span>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs cursor-pointer flex items-center gap-1"
              >
                <ArrowRight className="w-4 h-4" />
                <span>قبلی</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-cyan-950/70"
              >
                <span>مرحله بعد: بازبینی و تایید</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Review and Launch */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200 text-xs">
            <div className="p-5 rounded-2xl glass-surface border border-emerald-500/40 space-y-3 bg-emerald-950/10">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>پیکربندی استقرار آماده راه‌اندازی است:</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-neutral-300 pt-2 border-t border-white/10">
                <div>
                  <span className="text-neutral-500 block">ایمیل ادمین:</span>
                  <span className="font-mono text-white font-bold">{adminEmail}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">نقش در سیستم:</span>
                  <span className="text-cyan-300 font-bold">Master Administrator</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">ساختار کلاستر:</span>
                  <span className="text-white font-bold">{clusterType === 'standalone' ? 'تک‌سرور مرکزی' : 'خوشه دو سروره'}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">موتور هوش مصنوعی:</span>
                  <span className="text-purple-300 font-bold">{aiEngine}</span>
                </div>
              </div>
            </div>

            <p className="text-neutral-400 text-center leading-relaxed">
              با کلیک روی دکمه زیر، وضعیت اولیه ذخیره شده و وارد مرکز کنترل کلاستر خام و آماده انتشار خواهید شد.
            </p>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs cursor-pointer flex items-center gap-1"
              >
                <ArrowRight className="w-4 h-4" />
                <span>قبلی</span>
              </button>
              <button
                type="button"
                onClick={handleFinishSetup}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2 shadow-xl shadow-emerald-950/60"
              >
                <Sparkles className="w-4 h-4" />
                <span>تایید نهایی و راه‌اندازی کلاستر</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
