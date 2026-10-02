import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  Key,
  Lock,
  ArrowRight,
  Server,
  Check,
  AlertCircle,
  Sparkles,
  User,
  Mail,
  Cpu,
  Layers,
  Fingerprint,
  Laptop,
  MessageSquare,
  Bot
} from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: (user: { email: string; role: string }) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  // In state baraye switch kardane beine Login va Register ast (Sliding panel)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Entekhabe Role: Admin ya Karbare Ma'mooli
  const [selectedRole, setSelectedRole] = useState<'admin' | 'user'>('user');

  // Statehaye form
  const [email, setEmail] = useState('user@omniops.ai');
  const [password, setPassword] = useState('UserPass2026!');
  const [fullName, setFullName] = useState('کاربر معمولی هوش مصنوعی');
  
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Tabe submit e form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsLoading(false);
      if (email.trim() && password.length >= 6) {
        onLoginSuccess({
          email: email.trim(),
          role: selectedRole === 'admin' ? 'Master Cluster Administrator' : 'Standard User'
        });
      } else {
        setErrorMsg('لطفاً ایمیل معتبر و رمز عبور حداقل ۶ کاراکتر را وارد کنید.');
      }
    }, 500);
  };

  // Login sari baraye Karbare Ma'mooli
  const handleQuickUserLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        email: 'user@omniops.ai',
        role: 'Standard User'
      });
    }, 300);
  };

  // Login sari baraye Admine Kol
  const handleQuickAdminLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        email: 'admin@omniops.ai',
        role: 'Master Cluster Administrator'
      });
    }, 300);
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 bg-[#09090b] overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200" dir="rtl">
      
      {/* Pas-zamineye motaharrek ba haloohaye nooranie glassmorphism */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-cyan-600/15 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-purple-600/15 blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-emerald-600/10 blur-[130px] pointer-events-none" />

      {/* Grid Pattern pas-zamine */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Panle markazi shishei (Ultra-Modern Glassmorphic Card) */}
      <div className="relative w-full max-w-lg glass-surface-elevated rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/10 z-10 transition-all duration-300">
        
        {/* Header e Panle ba Logo va Status */}
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 shadow-lg shadow-cyan-950/50">
            <Cpu className="w-8 h-8 text-cyan-400" />
          </div>

          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono" dir="ltr">
                OmniOps Enterprise
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 font-medium">
              سامانه هوش مصنوعی، مرکز فرماندهی و همیار دسکتاپ ویندوز
            </p>
          </div>

          {/* Tab Slider baraye switch beine Vorood va Sabtenam */}
          <div className="flex items-center p-1 rounded-2xl bg-black/40 border border-white/5 text-xs font-semibold max-w-xs mx-auto mt-4">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setErrorMsg(null); }}
              className={`flex-1 py-2 px-3 rounded-xl transition-all duration-300 cursor-pointer ${
                authMode === 'login'
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-950/60 font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              ورود به سیستم
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setErrorMsg(null); }}
              className={`flex-1 py-2 px-3 rounded-xl transition-all duration-300 cursor-pointer ${
                authMode === 'register'
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-950/60 font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              ثبت کاربر جدید
            </button>
          </div>
        </div>

        {/* Payame Khata dar soorate voojood */}
        {errorMsg && (
          <div className="mb-6 p-3 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form e Shishei */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Entekhabe Role (Karbare Ma'mooli vs Admine Kol) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-300">
              سطح دسترسی و نقش کاربری:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('user');
                  setEmail('user@omniops.ai');
                }}
                className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                  selectedRole === 'user'
                    ? 'bg-purple-950/60 border-purple-500/50 text-white shadow-md'
                    : 'bg-black/30 border-white/10 text-neutral-400 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <User className="w-4 h-4 text-purple-400" />
                  <span>کاربر معمولی</span>
                </div>
                <p className="text-[10px] text-neutral-400 leading-tight">
                  فقط چت با مدل‌ها، همیار ویندوز شخصی و تاریخچه چت‌های خودتان
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('admin');
                  setEmail('admin@omniops.ai');
                }}
                className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-cyan-950/60 border-cyan-500/50 text-white shadow-md'
                    : 'bg-black/30 border-white/10 text-neutral-400 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>مدیر کل (Admin)</span>
                </div>
                <p className="text-[10px] text-neutral-400 leading-tight">
                  دسترسی به همه تنظیمات کلاستر، OmniRoute و پرووایدرها
                </p>
              </button>
            </div>
          </div>

          {authMode === 'register' && (
            <div className="space-y-1.5 animate-in fade-in">
              <label className="block text-xs font-medium text-neutral-300">
                نام و نام خانوادگی:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="نام کاربر"
                  className="w-full glass-input rounded-2xl px-4 py-3 text-xs text-white placeholder-neutral-500 pr-10"
                />
                <User className="w-4 h-4 text-neutral-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-neutral-300">
              آدرس ایمیل / نام کاربری:
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@omniops.ai"
                dir="ltr"
                className="w-full glass-input rounded-2xl px-4 py-3 text-xs font-mono text-cyan-300 placeholder-neutral-600 pr-10"
              />
              <Mail className="w-4 h-4 text-neutral-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="text-neutral-300 font-medium">رمز عبور حساب:</label>
              <span className="text-[11px] text-cyan-400 hover:underline cursor-pointer">
                فراموشی رمز؟
              </span>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                dir="ltr"
                className="w-full glass-input rounded-2xl px-4 py-3 text-xs font-mono text-white placeholder-neutral-600 pr-10"
              />
              <Lock className="w-4 h-4 text-neutral-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Gozinehaye ezafe: Remember me */}
          <div className="flex items-center justify-between pt-1 text-xs text-neutral-400">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded-lg bg-neutral-900 border-neutral-700 accent-cyan-500 cursor-pointer"
              />
              <span>نشست امن برای ۳۰ روز ذخیره شود</span>
            </label>

            <span className="text-[11px] text-neutral-500 font-mono" dir="ltr">
              E2EE Secure Session
            </span>
          </div>

          {/* Dokmeye Asli e Vorood */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs tracking-wide shadow-xl shadow-cyan-950/80 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{selectedRole === 'user' ? 'ورود به پورتال چت و ایجنت ویندوز' : 'ورود به پنل مدیریت سراسری کلاستر'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Vorood e sari ba yek click baraye do halate Admin va User */}
        <div className="mt-5 pt-4 border-t border-white/5 space-y-2">
          <div className="text-[11px] text-neutral-400 font-bold mb-1">
            ورود سریع آزمایشی با یک کلیک (Single-Click Access):
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickUserLogin}
              disabled={isLoading}
              className="py-2.5 px-3 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/50 text-purple-200 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-purple-400" />
              <span>ورود کاربر معمولی (User)</span>
            </button>

            <button
              type="button"
              onClick={handleQuickAdminLogin}
              disabled={isLoading}
              className="py-2.5 px-3 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/50 text-cyan-200 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>ورود مدیر کل (Admin)</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-5 text-center text-[10px] font-mono text-neutral-500" dir="ltr">
          OmniOps Enterprise v2.4.0 · Iranian B Series Fonts (B Yekan, B Nazanin) Active
        </div>
      </div>
    </div>
  );
};
