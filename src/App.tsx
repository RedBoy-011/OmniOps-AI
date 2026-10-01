import React, { useState } from 'react';
import {
  Server,
  Route,
  Wrench,
  Zap,
  Download,
  ExternalLink,
  LogOut,
  User,
  Github,
  BookOpen,
  Copy,
  Check
} from 'lucide-react';
import { AuthScreen } from './components/AuthScreen';
import { ClusterOverview } from './components/ClusterOverview';
import { OmniRouteHub } from './components/OmniRouteHub';
import { HermesAgentHub } from './components/HermesAgentHub';
import { AIProvidersHub } from './components/AIProvidersHub';
import { RAW_INSTALL_SCRIPT } from './data/installScript';

export default function App() {
  const [currentUser, setCurrentUser] = useState<{ email: string; role: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'omniroute' | 'hermes' | 'providers'>('overview');
  const [copiedCurl, setCopiedCurl] = useState(false);

  const officialCurlCommand = 'curl -sL https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/install.sh | bash';

  const copyCurl = () => {
    navigator.clipboard.writeText(officialCurlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const downloadScriptFile = () => {
    const blob = new Blob([RAW_INSTALL_SCRIPT], { type: 'text/x-sh' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'install.sh';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // اگر کاربر هنوز لاگین نکرده باشد، صفحه لاگین نمایش داده می‌شود
  if (!currentUser) {
    return <AuthScreen onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300" dir="rtl">
      {/* هدر بالای پنل مدیریت کلاستر - ۳ ناحیه استاندارد و بدون منوهای اضافه */}
      <header className="sticky top-0 z-50 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800/80 px-4 lg:px-8 py-3 flex items-center justify-between">
        {/* ۱. برند و وضعیت زنده */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono tracking-wider font-extrabold text-emerald-400 text-base" dir="ltr">OmniOps AI</span>
            <span className="text-neutral-500 font-normal text-xs hidden sm:inline">|</span>
            <span className="text-neutral-300 text-xs font-medium hidden sm:inline">Master Control-Plane Web Console</span>
          </div>
        </div>

        {/* ۲. منوی اصلی ۴گانه و کاملاً کاربردی (حذف تب‌های اضافه) */}
        <nav className="hidden md:flex items-center gap-1.5 bg-neutral-900/90 p-1 rounded-xl border border-neutral-800 text-xs font-medium text-neutral-400">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview' ? 'bg-neutral-800 text-white font-semibold shadow-sm' : 'hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span>داشبورد کلاستر</span>
          </button>

          <button
            onClick={() => setActiveTab('omniroute')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'omniroute' ? 'bg-neutral-800 text-white font-semibold shadow-sm' : 'hover:text-white'
            }`}
          >
            <Route className="w-3.5 h-3.5 text-cyan-400" />
            <span>OmniRoute (هسته پردازشی)</span>
          </button>

          <button
            onClick={() => setActiveTab('hermes')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'hermes' ? 'bg-neutral-800 text-white font-semibold shadow-sm' : 'hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            <span>Hermes Agent (بازوی اجرایی)</span>
          </button>

          <button
            onClick={() => setActiveTab('providers')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'providers' ? 'bg-neutral-800 text-white font-semibold shadow-sm' : 'hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>پرووایدرها و ساکس‌پراکسی</span>
          </button>
        </nav>

        {/* ۳. بخش اقدام‌ها، دانلود اسکریپت و پروفایل مدیر */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={copyCurl}
            className="hidden sm:flex px-2.5 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/80 rounded-lg transition-colors cursor-pointer items-center gap-1.5"
            title="کپی دستور curl برای نصب در سرور"
          >
            {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="font-mono">curl | bash</span>
          </button>

          <button
            onClick={downloadScriptFile}
            className="px-2.5 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">دانلود install.sh</span>
            <span className="sm:hidden">دانلود</span>
          </button>

          {/* اکانت کاربر */}
          <div className="hidden lg:flex items-center gap-2 pr-2 border-r border-neutral-800 text-xs">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="text-right">
              <span className="text-white font-medium block leading-none">{currentUser.email}</span>
            </div>
          </div>

          <button
            onClick={() => setCurrentUser(null)}
            className="p-1.5 text-neutral-400 hover:text-red-400 bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
            title="خروج از حساب کاربری"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* منوی تاشو برای موبایل و تبلت - فقط ۴ گزینه اصلی و کاربردی */}
      <div className="md:hidden flex items-center gap-1 px-4 py-2 bg-neutral-900 border-b border-neutral-800 overflow-x-auto text-xs text-neutral-400 scrollbar-none">
        {[
          { id: 'overview', label: 'داشبورد کلاستر', icon: Server },
          { id: 'omniroute', label: 'OmniRoute Core', icon: Route },
          { id: 'hermes', label: 'Hermes Agent', icon: Wrench },
          { id: 'providers', label: 'پرووایدرها و ساکس', icon: Zap }
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === t.id ? 'bg-neutral-800 text-white font-semibold shadow-sm' : 'hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* بدنه اصلی صفحات عملیاتی پنل */}
      <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
        {/* ۱. داشبورد اصلی کلاستر (شامل وضعیت سیستم، نودهای Edge و ایجنت‌های ویندوز) */}
        {activeTab === 'overview' && (
          <ClusterOverview onNavigateToTab={(tab) => setActiveTab(tab)} />
        )}

        {/* ۲. هسته پردازشی و روتر هوشمند OmniRoute */}
        {activeTab === 'omniroute' && (
          <OmniRouteHub />
        )}

        {/* ۳. بازوی اجرایی و سندباکس ابزارهای Hermes Agent */}
        {activeTab === 'hermes' && (
          <HermesAgentHub />
        )}

        {/* ۴. اتصال به پرووایدرها، تنظیمات ساکس‌پراکسی و پیکربندی خودکار */}
        {activeTab === 'providers' && (
          <AIProvidersHub />
        )}
      </main>

      {/* فوتر مینیمال و آرام */}
      <footer className="border-t border-neutral-800/80 px-4 lg:px-8 py-3.5 bg-neutral-950 text-xs text-neutral-500 flex flex-wrap items-center justify-between gap-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="font-mono text-neutral-400 font-semibold" dir="ltr">OmniOps AI</span>
          <span>·</span>
          <span>RedBoy-011/OmniOps-AI</span>
          <span>·</span>
          <span>v2.4.0-stable</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/RedBoy-011/OmniOps-AI"
            target="_blank"
            rel="noreferrer"
            className="hover:text-neutral-300 transition-colors flex items-center gap-1.5 text-neutral-400"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub Repository</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
}
