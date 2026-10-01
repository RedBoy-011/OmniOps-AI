import React, { useState } from 'react';
import { Terminal, Shield, Wrench, Play, Check, AlertCircle, RefreshCw, Laptop, Database, Globe, FileText, CheckCircle2 } from 'lucide-react';

export const HermesAgentHub: React.FC = () => {
  const [taskInput, setTaskInput] = useState('بررسی فضای آزاد هارد، تهیه پشتیبان از دیتابیس پستگرس و ارسال نوتیفیکیشن موفقیت به دسکتاپ ویندوز');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [sandboxEnabled, setSandboxEnabled] = useState(true);
  const [autoHeal, setAutoHeal] = useState(true);

  const tools = [
    { id: 'bash_sandbox', name: 'Bash Sandbox', desc: 'اجرای دستورات خط فرمان لینوکس در کانتینر ایزوله امن', icon: Terminal, active: true },
    { id: 'python_runner', name: 'Python Runner', desc: 'اجرای اسکریپت‌های پایتون برای محاسبات و تحلیل داده', icon: FileText, active: true },
    { id: 'desktop_rpc', name: 'Windows Desktop RPC', desc: 'ارسال دستور و نوتیفیکیشن به ایجنت دسکتاپ Coucou', icon: Laptop, active: true },
    { id: 'database_query', name: 'DB Query Tool', desc: 'کوئری‌های مجاز و ایندکس‌گذاری دیتابیس Postgres', icon: Database, active: true },
    { id: 'web_fetch', name: 'Web Fetch & API', desc: 'دریافت مستندات و ریکوئست به اندپوینت‌های خارجی', icon: Globe, active: true },
  ];

  const handleRunTask = () => {
    setIsExecuting(true);
    setExecutionLogs([]);

    const steps = [
      '[Hermes Agent] Task received. Querying reasoning core via OmniRoute (http://omniroute:8000/v1)...',
      '[Reasoning] OmniRoute dispatched request to Llama 3.2 (Local Engine, Latency: 18ms). Plan formulated.',
      '[Tool Step 1/3] Calling bash_sandbox: df -h /var/lib/postgresql/data (Disk free: 48.2 GB)',
      '[Tool Step 2/3] Calling database_query: pg_dump --format=custom omniops_core (Backup completed: 24.6 MB)',
      '[Tool Step 3/3] Calling desktop_rpc: Dispatching toast notification to OmniOps-Coucou-Workstation...',
      '[Hermes Agent] ✔ Autonomous Execution Completed with Zero Faults. Output reported to Master Control-Plane.'
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setExecutionLogs((prev) => [...prev, step]);
        if (idx === steps.length - 1) {
          setIsExecuting(false);
        }
      }, (idx + 1) * 450);
    });
  };

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 shadow-2xl space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mb-1">
            <span className="text-amber-400 font-semibold">Execution Arm</span>
            <span>·</span>
            <span>Port :8081</span>
            <span>·</span>
            <span>Autonomous Tool-Calling Agent</span>
          </div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-400" />
            <span>Hermes Agent - بازوی اجرایی، فراخوانی ابزارها و اتوماسیون وظایف</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            ایجنت مستقل و اجرایی OmniOps AI که تفکر و تصمیم‌گیری را از <strong>OmniRoute</strong> دریافت کرده و ابزارهای واقعی مانند شل لینوکس، اجرای پایتون و هدایت ایجنت ویندوز را در یک سندباکس کنترل‌شده اجرا می‌کند.
          </p>
        </div>

        <div className="flex items-center gap-2" dir="ltr">
          <span className="text-[11px] font-mono px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-amber-400">
            LLM Core: http://omniops-omniroute:8000/v1
          </span>
        </div>
      </div>

      {/* ۱. ابزارهای فعال در دسترس Hermes Agent */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-white">ابزارهای تحت کنترل بازوی اجرایی (Hermes Active Tool Suite):</span>
          <span className="text-neutral-500 font-mono">۵ ابزار متصل</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div key={tool.id} className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs text-white">
                    <Icon className="w-4 h-4 text-amber-400" />
                    <span>{tool.name}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">{tool.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ۲. تنظیمات ایمنی و اتصال زنجیره‌ای */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-white block">محیط سندباکس ایزوله داکر (Docker Sandbox)</span>
            <span className="text-[11px] text-neutral-400 block mt-0.5">دستورات شل و کدها خارج از سرور اصلی اجرا می‌شوند</span>
          </div>
          <input
            type="checkbox"
            checked={sandboxEnabled}
            onChange={(e) => setSandboxEnabled(e.target.checked)}
            className="w-4 h-4 accent-amber-500 cursor-pointer"
          />
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-white block">خودترمیمی خودکار در صورت خطا (Self-Healing)</span>
            <span className="text-[11px] text-neutral-400 block mt-0.5">در صورت ارور، مجدداً پرامپت اصلاح‌شده به OmniRoute فرستاده می‌شود</span>
          </div>
          <input
            type="checkbox"
            checked={autoHeal}
            onChange={(e) => setAutoHeal(e.target.checked)}
            className="w-4 h-4 accent-amber-500 cursor-pointer"
          />
        </div>
      </div>

      {/* ۳. تست اجرای زنده وظایف توسط Hermes Agent */}
      <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
        <label className="block text-xs font-semibold text-white">
          اجرای یک وظیفه توسط Hermes Agent (Dispatch Task Simulation):
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
            placeholder="شرح وظیفه را بنویسید..."
          />
          <button
            onClick={handleRunTask}
            disabled={isExecuting}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
          >
            {isExecuting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            <span>اجرای وظیفه خودکار</span>
          </button>
        </div>

        {/* لاگ‌های اجرای مرحله‌به‌مرحله */}
        {executionLogs.length > 0 && (
          <div className="mt-3 p-3 bg-black border border-neutral-800 rounded-lg space-y-1 font-mono text-xs text-amber-300 select-text leading-relaxed" dir="ltr">
            {executionLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-neutral-600 select-none">&gt;</span>
                <span className={log.includes('✔') ? 'text-emerald-400 font-bold' : log.includes('Tool') ? 'text-cyan-300' : 'text-amber-200'}>
                  {log}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
