import React, { useState } from 'react';
import { Server, Cpu, Laptop, ShieldCheck, Database, Key, Network, ArrowRight, ArrowLeftRight, CheckCircle2 } from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'master' | 'edge' | 'winagent' | 'full'>('full');

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 shadow-2xl space-y-6" dir="rtl">
      {/* Title & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <span>توپولوژی معماری توزیع‌شده OmniOps AI و نحوه تفکیک نقش‌ها</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            بررسی دقیق ساختار ۳ گانه اسکریپت نصب و نحوه تعامل اجزا در شبکه کلاود و لبه (Edge)
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center p-1 bg-neutral-900 rounded-lg border border-neutral-800 text-xs">
          {[
            { id: 'full', label: 'کل معماری (Full View)' },
            { id: 'master', label: '۱. هسته مرکزی (Master)' },
            { id: 'edge', label: '۲. نودهای پردازش (Edge)' },
            { id: 'winagent', label: '۳. گیت‌وی ویندوز (Windows)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-neutral-800 text-white shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Diagram Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Node 1: Master Control-Plane */}
        <div
          className={`rounded-xl border p-5 transition-all space-y-4 ${
            activeTab === 'master' || activeTab === 'full'
              ? 'border-emerald-500/50 bg-emerald-950/10'
              : 'border-neutral-800 bg-neutral-900/30 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400">گزینه ۱ منو</span>
                <h4 className="text-sm font-bold text-white">Master Control-Plane</h4>
              </div>
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800" dir="ltr">
              Port :8080
            </span>
          </div>

          <div className="text-xs text-neutral-300 leading-relaxed">
            <p className="font-semibold text-emerald-400 mb-1">کجا باید نصب شود؟</p>
            <p className="text-neutral-400">
              روی سرور مرکزی (VPS / Cloud). این نود مغز متفکر کلاستر است؛ تمام هماهنگی‌ها، دیتابیس داده‌ها، ثبت کاربران و زمان‌بندی مدل‌های هوش مصنوعی را مدیریت می‌کند.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
              <span className="text-neutral-300 font-medium">هسته پایتون (FastAPI & Celery)</span>
              <span className="text-neutral-500 font-mono text-[11px]" dir="ltr">API Core</span>
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-neutral-300 font-medium">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>پایگاه‌داده PostgreSQL 16</span>
              </div>
              <span className="text-neutral-500 font-mono text-[11px]" dir="ltr">Port 5432</span>
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
              <span className="text-neutral-300 font-medium">حافظه ردیس (Redis 7 Broker)</span>
              <span className="text-neutral-500 font-mono text-[11px]" dir="ltr">Port 6379</span>
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-neutral-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>شبکه امنیتی مش (mTLS Mesh Hub)</span>
              </div>
              <span className="text-emerald-400 font-mono text-[11px]">رمزگذاری ۳۸۴ بیتی</span>
            </div>
          </div>
        </div>

        {/* Node 2: Edge / Worker Node */}
        <div
          className={`rounded-xl border p-5 transition-all space-y-4 ${
            activeTab === 'edge' || activeTab === 'full'
              ? 'border-cyan-500/50 bg-cyan-950/10'
              : 'border-neutral-800 bg-neutral-900/30 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400">گزینه ۲ منو</span>
                <h4 className="text-sm font-bold text-white">Edge / Worker Node</h4>
              </div>
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800" dir="ltr">
              Port :9090
            </span>
          </div>

          <div className="text-xs text-neutral-300 leading-relaxed">
            <p className="font-semibold text-cyan-400 mb-1">کجا باید نصب شود؟</p>
            <p className="text-neutral-400">
              روی ماشین‌های پردازشی، سرورهای دارای کارت گرافیک (GPU) یا دستگاه‌های محلی. وظیفه اجرای استنتاج مدل‌های زبانی (LLM) و پردازش‌های سنگین با تأخیر کم را دارد.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
              <span className="text-neutral-300 font-medium">موتور اجرای AI محلی</span>
              <span className="text-cyan-400 font-mono text-[11px]" dir="ltr">ONNX / vLLM</span>
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-neutral-300 font-medium">
                <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-400" />
                <span>هارت‌بیت و وضعیت نود</span>
              </div>
              <span className="text-neutral-500 font-mono text-[11px]">ارسال هر ۱۰ ثانیه</span>
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
              <span className="text-neutral-300 font-medium">اتصال تونل امن به مستر</span>
              <span className="text-emerald-400 font-mono text-[11px]">بدون نیاز به IP ولید</span>
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
              <span className="text-neutral-300 font-medium">توزیع همزمان وظایف</span>
              <span className="text-neutral-500 font-mono text-[11px]">Concurrency: 4+</span>
            </div>
          </div>
        </div>

        {/* Node 3: Windows Agent Backend */}
        <div
          className={`rounded-xl border p-5 transition-all space-y-4 ${
            activeTab === 'winagent' || activeTab === 'full'
              ? 'border-purple-500/50 bg-purple-950/10'
              : 'border-neutral-800 bg-neutral-900/30 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-purple-400">گزینه ۳ منو</span>
                <h4 className="text-sm font-bold text-white">Windows Agent Gateway</h4>
              </div>
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800" dir="ltr">
              Port :7070
            </span>
          </div>

          <div className="text-xs text-neutral-300 leading-relaxed">
            <p className="font-semibold text-purple-400 mb-1">کجا باید نصب شود؟</p>
            <p className="text-neutral-400">
              روی سرور گیت‌وی کلاود یا در کنار مستر. به کلاینت‌های دسکتاپ ویندوز اجازه می‌دهد از طریق وب‌سوکت معکوس وصل شده و اتوماسیون دسکتاپ و ریموت را اجرا کنند.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
              <span className="text-neutral-300 font-medium">تانل دوطرفه وب‌سوکت (WS)</span>
              <span className="text-purple-400 font-mono text-[11px]" dir="ltr">ws://host:7070/ws</span>
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
              <span className="text-neutral-300 font-medium">سندباکس اجرای RPC دسکتاپ</span>
              <span className="text-neutral-500 font-mono text-[11px]" dir="ltr">64MB Payload</span>
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
              <span className="text-neutral-300 font-medium">استریم تصویر و کنترل ایجنت</span>
              <span className="text-neutral-500 font-mono text-[11px]">تأخیر فوق‌العاده کم</span>
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-neutral-300 font-medium">
                <Key className="w-3.5 h-3.5 text-purple-400" />
                <span>توکن احراز هویت پل ایجنت</span>
              </div>
              <span className="text-purple-300 font-mono text-[11px]">Bridge Token</span>
            </div>
          </div>
        </div>
      </div>

      {/* نحوه اتصال اجزا به زبان مهندسی لینوکس */}
      <div className="p-5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-3">
        <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>جریان ترافیک و نحوه برقراری ارتباط بین نودها (Network Traffic Flow)</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-neutral-400">
          <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800/80 space-y-1">
            <div className="text-emerald-400 font-semibold mb-1 flex items-center gap-1">
              <span>ارتباط Edge با Master</span>
              <ArrowRight className="w-3 h-3 rotate-180" />
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              نودهای Edge اتصال خروجی (Outbound) به سمت پورت ۸۰۸۰ سرور Master برقرار می‌کنند. بنابراین نیازی به باز کردن پورت ورودی یا داشتن IP استاتیک روی نودهای ورکر نیست.
            </p>
          </div>

          <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800/80 space-y-1">
            <div className="text-purple-400 font-semibold mb-1 flex items-center gap-1">
              <span>ارتباط کلاینت ویندوز با Gateway</span>
              <ArrowRight className="w-3 h-3 rotate-180" />
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              برنامه دسکتاپ ویندوز یک کانال دائم WebSocket به پورت ۷۰۷۰ می‌زند. دستورات صادره از سرور کلاود در کسری از ثانیه روی دسکتاپ مقصد اجرا و نتیجه به کلاستر برمی‌گردد.
            </p>
          </div>

          <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800/80 space-y-1">
            <div className="text-cyan-400 font-semibold mb-1 flex items-center gap-1">
              <span>ماندگاری با دیمن Systemd</span>
              <ArrowRight className="w-3 h-3 rotate-180" />
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              پس از اجرای اسکریپت، یک سرویس سیستمی لینوکس (<code className="text-cyan-300">omniops.service</code>) ثبت می‌شود تا با هر بار ریبوت یا کرش سرور، کانتینرها فوراً بالا بیایند.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
