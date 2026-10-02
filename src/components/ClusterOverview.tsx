import React, { useState } from 'react';
import {
  Server,
  Database,
  Cpu,
  Laptop,
  ShieldCheck,
  Activity,
  Check,
  Copy,
  Terminal,
  ExternalLink,
  Plus,
  RefreshCw,
  Power,
  HardDrive,
  Radio,
  ArrowUpRight
} from 'lucide-react';

interface ClusterOverviewProps {
  onNavigateToTab: (tab: any) => void;
}

export const ClusterOverview: React.FC<ClusterOverviewProps> = ({ onNavigateToTab }) => {
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedPs, setCopiedPs] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [simulatedTaskStatus, setSimulatedTaskStatus] = useState<string | null>(null);

  const curlCommand = 'curl -sL https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/install.sh | bash';
  const psCommand = 'irm https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/windows-agent/install-agent.ps1 | iex';

  const copyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const copyPs = () => {
    navigator.clipboard.writeText(psCommand);
    setCopiedPs(true);
    setTimeout(() => setCopiedPs(false), 2000);
  };

  const handleRefreshCluster = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleDispatchPing = () => {
    setSimulatedTaskStatus('Sending broadcast ping to 3 active cluster nodes...');
    setTimeout(() => {
      setSimulatedTaskStatus('✔ All nodes acknowledged ping! Average cluster latency: 14.2ms');
      setTimeout(() => setSimulatedTaskStatus(null), 4000);
    }, 800);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* بنر اصلی و دستورات تک‌خطی نصب فوری */}
      <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-semibold">Cluster Status: Healthy & Online</span>
              <span>·</span>
              <span>مخزن رسمی: <a href="https://github.com/RedBoy-011/OmniOps-AI" target="_blank" rel="noreferrer" className="text-white hover:underline font-mono">RedBoy-011/OmniOps-AI</a></span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              کنترل‌پنل مرکزی سیستم‌عامل توزیع‌شده هوش مصنوعی (Master Control-Plane)
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              پایش لحظه‌ای نودهای سرور مرکزی، ورکر‌های پردازش هوش مصنوعی (Edge) و همیارهای دسکتاپ ویندوز (Windows Desktop Agents)
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRefreshCluster}
              disabled={refreshing}
              className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="بازخوانی وضعیت کلاستر"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
            <button
              onClick={handleDispatchPing}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>ارسال پینگ کلاستر</span>
            </button>
          </div>
        </div>

        {simulatedTaskStatus && (
          <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 text-xs font-mono animate-in fade-in" dir="ltr">
            {simulatedTaskStatus}
          </div>
        )}

        {/* جعبه‌های دستورات تک‌خطی (لینوکس و ویندوز) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
          {/* دستور ۱: لینوکس (install.sh) */}
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>دستور نصب در سرورهای لینوکس (Master / Edge)</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-400">Bash One-Liner</span>
            </div>
            <div className="p-2 bg-black border border-neutral-800 rounded-lg flex items-center justify-between gap-2 text-xs font-mono text-emerald-400" dir="ltr">
              <span className="truncate select-all">{curlCommand}</span>
              <button
                onClick={copyCurl}
                className="px-2 py-0.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-[11px] cursor-pointer shrink-0 flex items-center gap-1"
              >
                {copiedCurl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCurl ? 'کپی شد' : 'کپی'}</span>
              </button>
            </div>
          </div>

          {/* دستور ۲: ویندوز (PowerShell) */}
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5 text-purple-400" />
                <span>دستور نصب ایجنت ویندوز (PowerShell)</span>
              </span>
              <span className="text-[10px] font-mono text-purple-400">Windows Companion</span>
            </div>
            <div className="p-2 bg-black border border-neutral-800 rounded-lg flex items-center justify-between gap-2 text-xs font-mono text-purple-300" dir="ltr">
              <span className="truncate select-all">{psCommand}</span>
              <button
                onClick={copyPs}
                className="px-2 py-0.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-[11px] cursor-pointer shrink-0 flex items-center gap-1"
              >
                {copiedPs ? <Check className="w-3 h-3 text-purple-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPs ? 'کپی شد' : 'کپی'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* متریک‌های پایه سیستم مرکزی (Master Stats) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>وضعیت Master Core</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="text-lg font-bold text-white font-mono" dir="ltr">ONLINE :8080</div>
          <span className="text-[11px] text-neutral-500 block">FastAPI / Uvicorn</span>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>پایگاه‌داده دائم</span>
            <Database className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-white font-mono" dir="ltr">PostgreSQL 16</div>
          <span className="text-[11px] text-neutral-500 block">DB: omniops_core (Healthy)</span>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>بروکر و کش سریع</span>
            <Activity className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-white font-mono" dir="ltr">Redis 7 Alpine</div>
          <span className="text-[11px] text-neutral-500 block">Port :6379 (Active)</span>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>رمزنگاری شبکه</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-white font-mono" dir="ltr">mTLS Mesh Hub</div>
          <span className="text-[11px] text-neutral-500 block">384-bit Cluster Key</span>
        </div>
      </div>

      {/* جدول ۱: نودهای فعال سرور و ورکر (Edge Nodes) */}
      <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">نودهای پردازشی هوش مصنوعی فعال (Edge Workers)</h3>
          </div>
          <span className="text-xs text-neutral-400 font-mono">۲ نود متصل</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right text-neutral-300 border border-neutral-800 rounded-lg">
            <thead className="bg-neutral-950 text-neutral-400 text-[11px] uppercase">
              <tr>
                <th className="p-3">شناسه نود</th>
                <th className="p-3">سخت‌افزار پردازشی</th>
                <th className="p-3">مدل / موتور AI</th>
                <th className="p-3">تأخیر (Latency)</th>
                <th className="p-3">وظایف جاری</th>
                <th className="p-3">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              <tr className="hover:bg-neutral-900/40">
                <td className="p-3 font-mono text-emerald-400 font-bold" dir="ltr">edge-tehran-gpu01</td>
                <td className="p-3">NVIDIA RTX 4090 (24GB VRAM)</td>
                <td className="p-3 font-mono text-neutral-300" dir="ltr">vLLM / Llama-3-8B-Instruct</td>
                <td className="p-3 font-mono" dir="ltr">12.4 ms</td>
                <td className="p-3">Inference batch processing</td>
                <td className="p-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
                    Active
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-neutral-900/40">
                <td className="p-3 font-mono text-emerald-400 font-bold" dir="ltr">edge-worker-cpu02</td>
                <td className="p-3">AMD EPYC 7763 (32 vCPU / 64GB)</td>
                <td className="p-3 font-mono text-neutral-300" dir="ltr">ONNX Runtime / Embeddings</td>
                <td className="p-3 font-mono" dir="ltr">18.1 ms</td>
                <td className="p-3">Vector generation queue</td>
                <td className="p-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
                    Active
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* جدول ۲: ایجنت‌های دسکتاپ ویندوز متصل (Windows Desktop Agents) */}
      <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Laptop className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">ایجنت‌های دسکتاپ ویندوز متصل (Windows Desktop Companion)</h3>
          </div>
          <button
            onClick={() => onNavigateToTab('winagent')}
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium cursor-pointer"
          >
            <span>دانلود و راهنمای ایجنت ویندوز</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right text-neutral-300 border border-neutral-800 rounded-lg">
            <thead className="bg-neutral-950 text-neutral-400 text-[11px] uppercase">
              <tr>
                <th className="p-3">نام دستگاه ویندوزی</th>
                <th className="p-3">سیستم‌عامل</th>
                <th className="p-3">پروتکل ارتباط</th>
                <th className="p-3">مصرف رم و CPU</th>
                <th className="p-3">تله‌متری دسکتاپ</th>
                <th className="p-3">وضعیت تانل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              <tr className="hover:bg-neutral-900/40">
                <td className="p-3 font-mono text-purple-300 font-bold" dir="ltr">OmniOps-Windows-Workstation</td>
                <td className="p-3">Windows 11 Pro (Build 22631)</td>
                <td className="p-3 font-mono text-neutral-400" dir="ltr">Reverse WebSocket :7070</td>
                <td className="p-3 font-mono" dir="ltr">CPU: 18% | RAM: 14.2 / 32 GB</td>
                <td className="p-3 text-neutral-400">System Tray Agent Active</td>
                <td className="p-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-purple-950 text-purple-200 border border-purple-800 rounded">
                    Tunnel Live
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
