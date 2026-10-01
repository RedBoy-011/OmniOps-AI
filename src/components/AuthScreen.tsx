import React, { useState } from 'react';
import { Shield, Key, Lock, ArrowRight, Server, Check, AlertCircle, Sparkles } from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: (user: { email: string; role: string }) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'credentials' | 'cluster_key'>('credentials');
  const [email, setEmail] = useState('admin@omniops.ai');
  const [password, setPassword] = useState('OmniOpsRoot2026!');
  const [clusterKey, setClusterKey] = useState('omni-cluster-sec-9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      if (authMode === 'credentials') {
        if (!email.trim() || !password.trim()) {
          setError('لطفاً ایمیل و رمزعبور را وارد کنید.');
          setLoading(false);
          return;
        }
        onLoginSuccess({ email, role: 'Root Cluster Administrator' });
      } else {
        if (!clusterKey.trim() || clusterKey.length < 16) {
          setError('کلید مش کلاستر نامعتبر است (حداقل ۱۶ کاراکتر).');
          setLoading(false);
          return;
        }
        onLoginSuccess({ email: 'cluster-mesh-admin', role: 'mTLS Cluster Key Operator' });
      }
      setLoading(false);
    }, 600);
  };

  const handleQuickDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      onLoginSuccess({ email: 'admin@omniops.ai', role: 'Root Cluster Administrator' });
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-1">
            <Server className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            <span className="font-mono text-emerald-400" dir="ltr">OmniOps AI</span>
            <span>ورود به داشبورد وب</span>
          </h1>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
            ورود به پنل مدیریت سرور مرکزی (Master Control-Plane) و پایش نودهای توزیع‌شده هوش مصنوعی
          </p>
        </div>

        {/* Tab Switcher: Credentials vs Cluster Key */}
        <div className="flex p-1 bg-neutral-950 rounded-lg border border-neutral-800 text-xs">
          <button
            type="button"
            onClick={() => setAuthMode('credentials')}
            className={`flex-1 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
              authMode === 'credentials'
                ? 'bg-neutral-800 text-white shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            حساب کاربری مدیریت
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('cluster_key')}
            className={`flex-1 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
              authMode === 'cluster_key'
                ? 'bg-neutral-800 text-white shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            کلید امنیتی کلاستر (Mesh Key)
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/80 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'credentials' ? (
            <>
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  پست الکترونیکی مدیر (Admin Email)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    dir="ltr"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                    placeholder="admin@omniops.ai"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  کلمه عبور روت (Master Password)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    dir="ltr"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5 flex items-center justify-between">
                <span>کلید اتصال ۳۸۴ بیتی کلاستر (Cluster Key)</span>
                <span className="text-[10px] text-emerald-400 font-mono" dir="ltr">mTLS Secret</span>
              </label>
              <textarea
                value={clusterKey}
                onChange={(e) => setClusterKey(e.target.value)}
                required
                rows={3}
                dir="ltr"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-emerald-400 font-mono focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 resize-none leading-relaxed"
                placeholder="omni-cluster-sec-..."
              />
              <p className="text-[11px] text-neutral-500 mt-1">
                این کلید در زمان اجرای اسکریپت <code className="text-neutral-400 font-mono">install.sh</code> داخل فایل <code className="text-neutral-400 font-mono">.env</code> تولید شده است.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>ورود امن به کنترل‌پنل</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Access */}
        <div className="pt-2 border-t border-neutral-800/80 text-center space-y-2">
          <p className="text-[11px] text-neutral-500">
            برای تست بدون نیاز به تنظیمات اختصاصی:
          </p>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2 bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>ورود سریع با دسترسی روت کلاستر (Quick Admin Access)</span>
          </button>
        </div>

        {/* Git Repository Info in Footer of Login */}
        <div className="text-center pt-2 text-[11px] text-neutral-500 font-mono" dir="ltr">
          Repository: <a href="https://github.com/RedBoy-011/OmniOps-AI" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">RedBoy-011/OmniOps-AI</a>
        </div>
      </div>
    </div>
  );
};
