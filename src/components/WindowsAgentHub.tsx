import React, { useState } from 'react';
import { Laptop, Download, Copy, Check, Terminal, ExternalLink, ShieldCheck, Activity, Cpu, Sparkles, RefreshCw } from 'lucide-react';

export const WindowsAgentHub: React.FC = () => {
  const [copiedPs, setCopiedPs] = useState(false);
  const [copiedPy, setCopiedPy] = useState(false);

  const psOneLiner = 'irm https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/windows-agent/install-agent.ps1 | iex';

  const copyPsCommand = () => {
    navigator.clipboard.writeText(psOneLiner);
    setCopiedPs(true);
    setTimeout(() => setCopiedPs(false), 2000);
  };

  const downloadPsScript = () => {
    window.open('https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/windows-agent/install-agent.ps1', '_blank');
  };

  const downloadPythonScript = () => {
    window.open('https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/windows-agent/coucou_agent.py', '_blank');
  };

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 shadow-2xl space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mb-1">
            <span className="text-purple-400 font-semibold">Windows Desktop Companion</span>
            <span>·</span>
            <span>الهام‌گرفته از معماری <a href="https://github.com/Louis-CFM/coucou" target="_blank" rel="noreferrer" className="text-white hover:underline">Louis-CFM/coucou</a></span>
          </div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Laptop className="w-5 h-5 text-purple-400" />
            <span>ایجنت دسکتاپ ویندوز (OmniOps Coucou Agent)</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            کلاینت سبک دسکتاپ ویندوز برای پایش سخت‌افزار، استریم وضعیت و اجرای وظایف خودکار هوش مصنوعی از طریق تانل معکوس وب‌سوکت بدون نیاز به IP ولید یا Port Forwarding
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/Louis-CFM/coucou"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <span>بررسی پروژه مرجع coucou</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* ۱. دستور تک‌خطی نصب در PowerShell ویندوز */}
      <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-800/50 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
            <Terminal className="w-4 h-4 text-purple-400" />
            <span>نصب خودکار با یک دستور در PowerShell ویندوز (Windows 10 / 11)</span>
          </div>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-900/60 text-purple-200 border border-purple-700">
            One-Liner Install
          </span>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed">
          در کامپیوتر یا لپ‌تاپ ویندوزی خود، کلیدهای <kbd className="px-1.5 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-neutral-200 font-mono text-[11px]">Win + X</kbd> را فشرده و **Terminal** یا **PowerShell** را باز کنید، سپس این دستور تک‌خطی را Paste نمایید:
        </p>

        <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between gap-3 text-xs font-mono text-purple-300" dir="ltr">
          <code className="truncate select-all text-purple-300 font-medium">
            {psOneLiner}
          </code>
          <button
            onClick={copyPsCommand}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-medium cursor-pointer shrink-0 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {copiedPs ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedPs ? 'کپی شد!' : 'کپی دستور'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>بررسی خودکار پایتون ۳ و کتابخانه‌ها</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>ساخت آیکون میانبر روی دسکتاپ ویندوز</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>اتصال خودکار به گیت‌وی کلاود OmniOps</span>
          </div>
        </div>
      </div>

      {/* ۲. ایده و معماری الهام گرفته از coucou */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
          <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">معماری همیار دسکتاپ (Coucou Companion)</h3>
          <p className="text-xs text-neutral-300 leading-relaxed">
            مانند پروژه <strong>Louis-CFM/coucou</strong>، این ایجنت در System Tray یا کنار ساعت ویندوز مستقر می‌شود. کاربر در هر لحظه وضعیت اتصال و اجرای وظایف هوش مصنوعی را در محیط ویندوز مشاهده می‌کند.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">دور زدن فایروال و NAT خانگی</h3>
          <p className="text-xs text-neutral-300 leading-relaxed">
            اکثر کاربران خانگی دارای IP ثابت یا مودم با پورت باز نیستند. این ایجنت یک اتصال خروجی پایدار وب‌سوکت معکوس (Reverse WebSocket) به سرور می‌زند و دستورات کلاود بدون نیاز به فوروارد پورت مستقیماً دریافت می‌شوند.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">اتوماسیون و تله‌متری هوش مصنوعی</h3>
          <p className="text-xs text-neutral-300 leading-relaxed">
            امکان ارسال نوتیفیکیشن‌های Toast در ویندوز، اجرای اسکریپت‌های سیستمی مجاز، بررسی سلامت پردازنده/کارت گرافیک و ارسال بازخورد وظایف به هسته مرکزی کلاستر.
          </p>
        </div>
      </div>

      {/* ۳. فایل‌های موجود در ریپازیتوری برای ویندوز */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span>فایل‌های آماده ایجنت در ریپازیتوری</span>
          <code className="text-xs font-mono text-emerald-400">RedBoy-011/OmniOps-AI/windows-agent/</code>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* فایل 1: coucou_agent.py */}
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-white font-mono font-semibold text-xs" dir="ltr">
                <span className="text-emerald-400">coucou_agent.py</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">Python 3.10+</span>
              </div>
              <p className="text-xs text-neutral-400">
                هسته ایجنت کلاینت پایتون؛ شامل اتصال WebSocket، جمع‌آوری تله‌متری psutil و اجرای دستورات کلاود.
              </p>
            </div>
            <a
              href="https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/windows-agent/coucou_agent.py"
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white rounded-lg transition-colors cursor-pointer shrink-0"
              title="مشاهده مستقیم در گیت‌هاب"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* فایل 2: install-agent.ps1 */}
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-white font-mono font-semibold text-xs" dir="ltr">
                <span className="text-purple-400">install-agent.ps1</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">PowerShell</span>
              </div>
              <p className="text-xs text-neutral-400">
                اسکریپت ستاپ و بوت‌استرپ ویندوز؛ نصب پایتون در صورت نبود، ایجاد پوشه در AppData و ساخت شورتکات دسکتاپ.
              </p>
            </div>
            <a
              href="https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/windows-agent/install-agent.ps1"
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white rounded-lg transition-colors cursor-pointer shrink-0"
              title="مشاهده مستقیم در گیت‌هاب"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* ۴. کامپایل به فایل مستقل exe */}
      <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
        <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
          <span>نحوه ساخت خروجی فایل اجرایی مستقل (.exe) برای توزیع آسان</span>
        </h4>
        <p className="text-xs text-neutral-300 leading-relaxed">
          اگر می‌خواهید کاربر نهایی بدون نیاز به نصب پایتون تنها با دابل کلیک روی یک فایل <code className="text-emerald-300 font-mono">.exe</code> ایجنت را اجرا کند، می‌توانید با دستور زیر با ابزار PyInstaller آن را کامپایل کنید:
        </p>
        <div className="p-3 bg-black border border-neutral-800 rounded-lg text-xs font-mono text-emerald-400 flex items-center justify-between" dir="ltr">
          <code>pip install pyinstaller && pyinstaller --onefile --noconsole --name "OmniOps-Coucou-Agent" coucou_agent.py</code>
          <button
            onClick={() => {
              navigator.clipboard.writeText('pip install pyinstaller && pyinstaller --onefile --noconsole --name "OmniOps-Coucou-Agent" coucou_agent.py');
            }}
            className="text-neutral-400 hover:text-white px-2 py-0.5 text-[11px] bg-neutral-900 rounded"
          >
            کپی
          </button>
        </div>
        <p className="text-[11px] text-neutral-500">
          فایل نهایی در مسیر <code className="text-neutral-400">dist/OmniOps-Coucou-Agent.exe</code> آماده قرار دادن در بخش Releases گیت‌هاب خواهد بود.
        </p>
      </div>
    </div>
  );
};
