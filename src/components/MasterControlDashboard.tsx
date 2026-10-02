import React, { useState, useEffect } from 'react';
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
  ArrowUpRight,
  Sparkles,
  Zap,
  Globe,
  Sliders,
  Filter,
  MessageSquare,
  Key,
  Lock,
  Send
} from 'lucide-react';
import { INITIAL_USER_PROFILE, INITIAL_CONNECTED_AGENTS } from '../data/agentStore';

interface MasterControlDashboardProps {
  onNavigateToTab: (tab: any, agentId?: string) => void;
  onOpenInstallGuide?: (tab?: 'linux' | 'windows' | 'docker' | 'worker' | 'python' | 'socks') => void;
}

export const MasterControlDashboard: React.FC<MasterControlDashboardProps> = ({ onNavigateToTab, onOpenInstallGuide }) => {
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedPs, setCopiedPs] = useState(false);
  const [copiedDocker, setCopiedDocker] = useState(false);
  const [copiedWorker, setCopiedWorker] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeLogTab, setActiveLogTab] = useState<'all' | 'agent' | 'router' | 'proxy'>('all');
  const [pingStatus, setPingStatus] = useState<string | null>(null);

  // Dastoorate rasmiye nasb
  const curlCommand = 'curl -sL https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/install.sh | bash';
  const psCommand = `irm https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/windows-agent/install-agent.ps1 | iex -Token "${INITIAL_USER_PROFILE.pairingToken}" -User "${INITIAL_USER_PROFILE.email}"`;
  const dockerCommand = 'curl -sSL https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/docker-compose.yml -o docker-compose.yml && docker compose up -d';
  const workerCommand = `curl -sL https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/install.sh | bash -s -- --role worker --master https://hub.omniops.ai:9090 --token "${INITIAL_USER_PROFILE.pairingToken}"`;

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

  const copyDocker = () => {
    navigator.clipboard.writeText(dockerCommand);
    setCopiedDocker(true);
    setTimeout(() => setCopiedDocker(false), 2000);
  };

  const copyWorker = () => {
    navigator.clipboard.writeText(workerCommand);
    setCopiedWorker(true);
    setTimeout(() => setCopiedWorker(false), 2000);
  };

  const copyToken = () => {
    navigator.clipboard.writeText(INITIAL_USER_PROFILE.pairingToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleRefreshCluster = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleBroadcastPing = () => {
    setPingStatus('ارسال پینگ به ۴ نود کلاستر و ارائه‌دهنده OpenRouter...');
    setTimeout(() => {
      setPingStatus('✔ تمامی نودها و ایجنت‌های ویندوز متصل پاسخ دادند. تاخیر ویندوز دسکتاپ: 14ms | تاخیر OpenRouter DeepSeek V4: 72ms');
      setTimeout(() => setPingStatus(null), 4500);
    }, 600);
  };

  // Loghaye zende ba filter
  const logsData = [
    { time: '14:21:02', category: 'router', text: 'OmniRoute: Request routed to deepseek/deepseek-v4-flash via SOCKS5 proxy.' },
    { time: '14:20:58', category: 'agent', text: 'Windows Agent (Workstation): Processed remote desktop screenshot RPC.' },
    { time: '14:20:45', category: 'proxy', text: 'SOCKS5 Tunnel: upstream connection to openrouter.ai verified (18ms latency).' },
    { time: '14:20:30', category: 'agent', text: 'Approval Gate: Tool "powershell_sandbox" invocation verified by cluster admin.' },
    { time: '14:20:12', category: 'router', text: 'Fallback chain validated: [DeepSeek V4 -> Ollama 3.2 -> Gemini 2.5 Flash].' },
    { time: '14:19:50', category: 'agent', text: 'Agent Token omni_win_usr_taheri... authenticated via WebSocket tunnel.' }
  ];

  const filteredLogs = logsData.filter(log => activeLogTab === 'all' || log.category === activeLogTab);

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* 1. Header Banner e Shishei ba Dastoorate Tak-khattiye Nasb */}
      <div className="p-6 sm:p-7 rounded-3xl glass-surface-elevated border border-white/10 space-y-4 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-bold">Cluster Health: 100% Operational</span>
              <span>·</span>
              <span>کاربر فعال: <span className="text-white font-mono">{INITIAL_USER_PROFILE.email}</span></span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              مرکز فرماندهی و مانیتورینگ سراسری (Master Control Dashboard)
            </h1>
            <p className="text-xs text-neutral-400 mt-1 max-w-3xl leading-relaxed">
              پایش بلادرنگ پردازش‌های هوش مصنوعی، وضعیت نودهای سرور لینوکس، ورکر‌های لبه (Edge) و همیارهای دسکتاپ ویندوز با قابلیت مکالمه و ارسال دستور مستقیم به هر ایجنت.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleRefreshCluster}
              disabled={refreshing}
              className="p-2.5 rounded-2xl glass-surface hover:bg-white/10 text-neutral-300 hover:text-white transition-all cursor-pointer"
              title="بازخوانی کلاستر"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
            <button
              onClick={handleBroadcastPing}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-cyan-950/60"
            >
              <Radio className="w-4 h-4" />
              <span>ارسال پینگ سراسری</span>
            </button>
          </div>
        </div>

        {pingStatus && (
          <div className="p-3 rounded-2xl bg-cyan-950/50 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-2 animate-in fade-in" dir="rtl">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{pingStatus}</span>
          </div>
        )}

        {/* Dastoorate Tak-khattiye Nasb (Quickstart One-Liners Hub) */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-xs sm:text-sm font-bold text-white">
                دستورات استقرار سریع با یک خط (Production One-Liners)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                4 Runtimes Ready
              </span>
            </div>

            <button
              onClick={() => onOpenInstallGuide?.('linux')}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>مشاهده راهنمای تفصیلی، پیش‌نیازها و عیب‌یابی تک‌خطی‌ها</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            {/* 1. Linux One-Liner */}
            <div className="p-4 rounded-2xl glass-surface border border-white/5 space-y-2 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>سرور لینوکس (Master All-in-One Installer)</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400">Bash One-Liner</span>
              </div>
              <div className="p-2.5 bg-black/60 border border-neutral-800 rounded-xl flex items-center justify-between gap-2 text-xs font-mono text-emerald-400" dir="ltr">
                <span className="truncate select-all">{curlCommand}</span>
                <button
                  onClick={copyCurl}
                  className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-[11px] cursor-pointer shrink-0 flex items-center gap-1 transition-colors font-sans"
                >
                  {copiedCurl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCurl ? 'کپی شد' : 'کپی'}</span>
                </button>
              </div>
            </div>

            {/* 2. Windows PowerShell One-Liner with User Token */}
            <div className="p-4 rounded-2xl glass-surface border border-purple-900/30 space-y-2 hover:border-purple-500/40 transition-all">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Laptop className="w-4 h-4 text-purple-400" />
                  <span>ایجنت همیار ویندوز با توکن امن کاربر</span>
                </span>
                <span className="text-[10px] font-mono text-purple-400">PowerShell</span>
              </div>
              <div className="p-2.5 bg-black/60 border border-neutral-800 rounded-xl flex items-center justify-between gap-2 text-xs font-mono text-purple-300" dir="ltr">
                <span className="truncate select-all">{psCommand}</span>
                <button
                  onClick={copyPs}
                  className="px-2.5 py-1 bg-purple-900/60 hover:bg-purple-800 text-white rounded-lg text-[11px] cursor-pointer shrink-0 flex items-center gap-1 transition-colors font-sans"
                >
                  {copiedPs ? <Check className="w-3 h-3 text-purple-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPs ? 'کپی شد' : 'کپی'}</span>
                </button>
              </div>
            </div>

            {/* 3. Docker Compose One-Liner */}
            <div className="p-4 rounded-2xl glass-surface border border-blue-900/30 space-y-2 hover:border-blue-500/40 transition-all">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-blue-400" />
                  <span>استک داکر کمپوز پروداکشن (Docker Compose Stack)</span>
                </span>
                <span className="text-[10px] font-mono text-blue-400">Containers</span>
              </div>
              <div className="p-2.5 bg-black/60 border border-neutral-800 rounded-xl flex items-center justify-between gap-2 text-xs font-mono text-blue-300" dir="ltr">
                <span className="truncate select-all">{dockerCommand}</span>
                <button
                  onClick={copyDocker}
                  className="px-2.5 py-1 bg-blue-900/60 hover:bg-blue-800 text-white rounded-lg text-[11px] cursor-pointer shrink-0 flex items-center gap-1 transition-colors font-sans"
                >
                  {copiedDocker ? <Check className="w-3 h-3 text-blue-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedDocker ? 'کپی شد' : 'کپی'}</span>
                </button>
              </div>
            </div>

            {/* 4. GPU Edge Worker Node One-Liner */}
            <div className="p-4 rounded-2xl glass-surface border border-emerald-900/30 space-y-2 hover:border-emerald-500/40 transition-all">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span>اتصال نود ورکر لبه / سرورهای GPU به کلاستر</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400">Edge Worker</span>
              </div>
              <div className="p-2.5 bg-black/60 border border-neutral-800 rounded-xl flex items-center justify-between gap-2 text-xs font-mono text-emerald-300" dir="ltr">
                <span className="truncate select-all">{workerCommand}</span>
                <button
                  onClick={copyWorker}
                  className="px-2.5 py-1 bg-emerald-900/60 hover:bg-emerald-800 text-white rounded-lg text-[11px] cursor-pointer shrink-0 flex items-center gap-1 transition-colors font-sans"
                >
                  {copiedWorker ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedWorker ? 'کپی شد' : 'کپی'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Gauges & Stats Grid (CPU, RAM, Disk, AI Throughput) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU Usage Gauge */}
        <div className="p-5 rounded-3xl glass-surface border border-white/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-neutral-400 font-medium">مصرف پردازنده مرکزی:</span>
            <div className="text-2xl font-black text-white font-mono" dir="ltr">12%</div>
            <span className="text-[10px] text-emerald-400 font-mono">16 vCPUs AMD EPYC</span>
          </div>

          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-neutral-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]"
                strokeDasharray="12, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <Cpu className="w-5 h-5 text-cyan-400 absolute" />
          </div>
        </div>

        {/* RAM Usage Gauge */}
        <div className="p-5 rounded-3xl glass-surface border border-white/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-neutral-400 font-medium">مصرف حافظه RAM سرور:</span>
            <div className="text-2xl font-black text-white font-mono" dir="ltr">1.4 / 16 GB</div>
            <span className="text-[10px] text-cyan-400 font-mono">Fast DDR5 ECC</span>
          </div>

          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-neutral-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.6)]"
                strokeDasharray="9, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <Activity className="w-5 h-5 text-emerald-400 absolute" />
          </div>
        </div>

        {/* Disk Space Gauge */}
        <div className="p-5 rounded-3xl glass-surface border border-white/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-neutral-400 font-medium">فضای دیسک NVMe:</span>
            <div className="text-2xl font-black text-white font-mono" dir="ltr">48 / 250 GB</div>
            <span className="text-[10px] text-indigo-400 font-mono">Fast NVMe SSD</span>
          </div>

          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-neutral-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-400 drop-shadow-[0_0_6px_rgba(129,140,248,0.6)]"
                strokeDasharray="19, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <HardDrive className="w-5 h-5 text-indigo-400 absolute" />
          </div>
        </div>

        {/* AI Routing Throughput */}
        <div className="p-5 rounded-3xl glass-surface border border-white/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-neutral-400 font-medium">ترافیک روتینگ هوش مصنوعی:</span>
            <div className="text-2xl font-black text-white font-mono" dir="ltr">142 t/s</div>
            <span className="text-[10px] text-cyan-400 font-mono">DeepSeek V4 Active</span>
          </div>

          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-neutral-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]"
                strokeDasharray="85, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <Zap className="w-5 h-5 text-cyan-400 absolute" />
          </div>
        </div>
      </div>

      {/* 3. FEHRESTE EYJENTHAYE VINDOWSIYE JOFT-SHODEYE IN KARBAR BA DOKMEYE CHAT & DISPATCH */}
      <div className="p-6 rounded-3xl bg-neutral-900/60 border border-purple-900/40 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Laptop className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                ایجنت‌های دسکتاپ ویندوز متصل این کاربر (Windows Desktop Companions)
              </h3>
              <p className="text-[11px] text-neutral-400">
                ارتباط ایجنت‌ها با توکن <code className="text-purple-300 font-mono">{INITIAL_USER_PROFILE.pairingToken.substring(0, 15)}...</code> متصل شده و قابلیت ارسال مستقیم دستور را دارند.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateToTab('windows')}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>باکس جفت‌سازی و مدیریت ایجنت‌ها</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right text-neutral-300 border border-white/5 rounded-2xl overflow-hidden">
            <thead className="bg-black/50 text-neutral-400 text-[11px]">
              <tr>
                <th className="p-3">دستگاه ویندوزی</th>
                <th className="p-3">سیستم‌عامل</th>
                <th className="p-3">مصرف منابع (CPU / RAM)</th>
                <th className="p-3">تاخیر و وضعیت تانل</th>
                <th className="p-3">آخرین پالس</th>
                <th className="p-3 text-center">مکالمه و ارسال دستور</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {INITIAL_CONNECTED_AGENTS.filter(a => a.type === 'windows').map((agent) => (
                <tr key={agent.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                        <Laptop className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-bold text-white block">{agent.name}</span>
                        <span className="text-[10px] text-neutral-500 font-mono" dir="ltr">{agent.ip}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-neutral-300 font-mono text-[11px]">{agent.os}</td>
                  <td className="p-3 font-mono text-neutral-300">
                    <span className="text-cyan-300">{agent.cpu} CPU</span> · <span className="text-purple-300">{agent.ram} RAM</span>
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {agent.latency} (Online)
                    </span>
                  </td>
                  <td className="p-3 text-[11px] text-neutral-400">{agent.lastHeartbeat}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onNavigateToTab('agent', agent.id)}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer inline-flex items-center gap-1.5 shadow-md shadow-purple-950/50 transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>مکالمه و ارسال دستور</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Vazeiat e Nodehaye Klastar va Loghaye Zende */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Nodehaye Fa'ale Klastar (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>نودهای سرور و زیرساخت کلاستر (Active Cluster Topology)</span>
            </h3>
            <span className="text-xs text-neutral-400 font-mono">3 Infrastructure Nodes Active</span>
          </div>

          <div className="space-y-3">
            {[
              {
                name: 'Master Control-Plane (Hetzner Dedicated)',
                role: 'FastAPI Core + PostgreSQL 16 + Redis',
                ip: '192.168.1.10',
                status: 'Online',
                latency: '12ms',
                badge: 'Primary Core'
              },
              {
                name: 'OmniRoute AI Router Core',
                role: 'Smart Fallback Router + DeepSeek V4 Hub',
                ip: '127.0.0.1:8000',
                status: 'Online',
                latency: '4ms',
                badge: 'Port :8000'
              },
              {
                name: 'Hermes Execution Arm Daemon',
                role: 'Sandbox Runner + Tool Invoker (MCP)',
                ip: '127.0.0.1:8081',
                status: 'Online',
                latency: '6ms',
                badge: 'Port :8081'
              }
            ].map((node, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl glass-surface border border-white/5 hover:border-cyan-500/30 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-bold text-white text-xs sm:text-sm">{node.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                      {node.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400">{node.role}</p>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="text-neutral-400" dir="ltr">{node.ip}</span>
                  <span className="text-emerald-400 font-bold" dir="ltr">{node.latency}</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 text-[10px] font-bold border border-emerald-800">
                    {node.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loghaye Zende ba Tab Filter (1 Col) */}
        <div className="p-5 rounded-3xl glass-surface-elevated border border-white/10 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>لاگ‌های زنده سیستم (System Event Stream)</span>
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            {/* Filter Pills for Logs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/5 text-[10px] font-mono">
              {[
                { id: 'all', label: 'All' },
                { id: 'agent', label: 'Agent' },
                { id: 'router', label: 'Router' },
                { id: 'proxy', label: 'Proxy' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveLogTab(tab.id as any)}
                  className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer ${
                    activeLogTab === tab.id ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Log Stream Area */}
            <div className="space-y-2 p-3 rounded-2xl bg-black/70 border border-neutral-800/80 font-mono text-[11px] max-h-[300px] overflow-y-auto scrollbar-thin" dir="ltr">
              {filteredLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed border-b border-white/[0.03] pb-1.5 last:border-none">
                  <span className="text-neutral-500 mr-1.5">[{log.time}]</span>
                  <span className="text-cyan-400 mr-1.5 font-bold">[{log.category.toUpperCase()}]</span>
                  <span className="text-neutral-300">{log.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 text-[11px] text-neutral-400 flex items-center justify-between">
            <span>ارتباط زنده WebSocket:</span>
            <span className="text-emerald-400 font-mono font-bold">Connected (wsproto)</span>
          </div>
        </div>

      </div>

    </div>
  );
};
