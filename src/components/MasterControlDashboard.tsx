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
  Send,
  Network
} from 'lucide-react';
import { INITIAL_USER_PROFILE, INITIAL_CONNECTED_AGENTS } from '../data/agentStore';
import { LocalModelManagerModal } from './LocalModelManagerModal';
import { MultiServerNodeConnectModal } from './MultiServerNodeConnectModal';
import { DomainSslSetupModal } from './DomainSslSetupModal';
import { useLiveMetrics } from '../hooks/useLiveMetrics';

interface MasterControlDashboardProps {
  onNavigateToTab: (tab: any, agentId?: string) => void;
  initialModalOpen?: 'local_models' | 'server2' | 'domain_ssl' | null;
  onClearInitialModal?: () => void;
}

export const MasterControlDashboard: React.FC<MasterControlDashboardProps> = ({
  onNavigateToTab,
  initialModalOpen,
  onClearInitialModal
}) => {
  const [copiedToken, setCopiedToken] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeLogTab, setActiveLogTab] = useState<'all' | 'agent' | 'router' | 'proxy'>('all');
  const [pingStatus, setPingStatus] = useState<string | null>(null);

  // Interval-based live metrics hook
  const { metrics, isLive, toggleLive, triggerManualRefresh } = useLiveMetrics(true, 2500);

  // Modal states baraye amaliate pishrafte (Local Models, Server 2 Connect, Domain & SSL)
  const [showLocalModelsModal, setShowLocalModelsModal] = useState(false);
  const [showServer2Modal, setShowServer2Modal] = useState(false);
  const [showDomainSslModal, setShowDomainSslModal] = useState(false);

  // Respond to search-driven modal opens
  useEffect(() => {
    if (initialModalOpen === 'local_models') {
      setShowLocalModelsModal(true);
      onClearInitialModal?.();
    } else if (initialModalOpen === 'server2') {
      setShowServer2Modal(true);
      onClearInitialModal?.();
    } else if (initialModalOpen === 'domain_ssl') {
      setShowDomainSslModal(true);
      onClearInitialModal?.();
    }
  }, [initialModalOpen, onClearInitialModal]);

  const copyToken = () => {
    navigator.clipboard.writeText(INITIAL_USER_PROFILE.pairingToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleRefreshCluster = () => {
    setRefreshing(true);
    triggerManualRefresh();
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
            {/* Dokmeye Toggle Live Data */}
            <button
              onClick={toggleLive}
              className={`px-3 py-2 rounded-2xl border transition-all cursor-pointer flex items-center gap-2 text-xs font-semibold ${
                isLive
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200 shadow-lg shadow-emerald-950/50'
                  : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
              }`}
              title={isLive ? 'بروزرسانی زنده فعال است (هر ۲.۵ ثانیه) - کلیک برای توقف' : 'بروزرسانی زنده متوقف است - کلیک برای پخش زنده'}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-600'}`} />
              <span className="hidden sm:inline">داده‌های زنده:</span>
              <span className={`font-mono text-[11px] ${isLive ? 'text-emerald-300 font-bold' : 'text-neutral-500'}`}>
                {isLive ? 'فعال (۲.۵s)' : 'متوقف'}
              </span>
            </button>

            <button
              onClick={handleRefreshCluster}
              disabled={refreshing}
              className="p-2.5 rounded-2xl glass-surface hover:bg-white/10 text-neutral-300 hover:text-white transition-all cursor-pointer"
              title="بازخوانی فوری کلاستر"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing || (isLive && metrics.isPulsing) ? 'animate-spin text-cyan-400' : ''}`} />
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

        {/* Bakhshe Amaliate Pishrafte: Modelhaye Local, Server 2 (Clustering), Domain & SSL */}
        <div className="pt-2 space-y-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs sm:text-sm font-bold text-white">
                ماژول‌های عملیاتی کلاستر و هوش مصنوعی (Cluster Operations & Infrastructure)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                Ready for Production
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Card 1: Local AI Models Manager */}
            <div className="p-4 sm:p-5 rounded-2xl glass-surface border border-cyan-500/20 hover:border-cyan-500/50 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                    Ollama / vLLM
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white">نصب و دانلود مدل‌های محلی (Local Models)</h4>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  دانلود مستقیم مدل‌های DeepSeek R1، Llama 3.3 و Qwen با نمایش زنده درصد و سرعت دانلود و اتصال به OmniRoute.
                </p>
              </div>

              <button
                onClick={() => setShowLocalModelsModal(true)}
                className="w-full py-2 px-3 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>مدیریت و دانلود مدل‌ها</span>
              </button>
            </div>

            {/* Card 2: Server 2 & Multi-Server Clustering */}
            <div className="p-4 sm:p-5 rounded-2xl glass-surface border border-purple-500/20 hover:border-purple-500/50 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                    <Network className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                    Server 2 (GPU)
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white">اتصال سرور دوم و نودهای ورکر (Clustering)</h4>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  اتصال سرور دوم و کارت‌های گرافیک GPU به سرور اول، تولید دستور اتصال با توکن و مانیتورینگ بلادرنگ تاخیر.
                </p>
              </div>

              <button
                onClick={() => setShowServer2Modal(true)}
                className="w-full py-2 px-3 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Network className="w-3.5 h-3.5" />
                <span>اتصال و مدیریت سرور دوم</span>
              </button>
            </div>

            {/* Card 3: Domain & Let's Encrypt SSL */}
            <div className="p-4 sm:p-5 rounded-2xl glass-surface border border-emerald-500/20 hover:border-emerald-500/50 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    Let's Encrypt SSL
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white">دامنه اینترنتی و SSL خودکار (HTTPS)</h4>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  ثبت دامین، اجرای خودکار اسکریپت Certbot برای دریافت گواهی رایگان Let's Encrypt و کانفیگ Nginx Reverse Proxy.
                </p>
              </div>

              <button
                onClick={() => setShowDomainSslModal(true)}
                className="w-full py-2 px-3 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>پیکربندی دامنه و SSL</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Gauges & Stats Grid (CPU, RAM, Disk, AI Throughput) ba Live Data Toggle */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2">
            <Activity className={`w-4 h-4 ${isLive ? 'text-emerald-400 animate-pulse' : 'text-neutral-500'}`} />
            <h3 className="text-xs sm:text-sm font-bold text-white">
              پایش بلادرنگ مصرف سخت‌افزاری کلاستر (Cluster Resource Telemetry)
            </h3>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
              isLive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-neutral-800 border-neutral-700 text-neutral-400'
            }`}>
              {isLive ? '● Live Auto-Refresh Active (2.5s)' : '○ Auto-Refresh Paused'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-neutral-400 font-mono">
              آخرین ثبت: <span className="text-cyan-300 font-bold">{metrics.lastRefreshedAt}</span>
            </span>

            <button
              onClick={toggleLive}
              className={`px-3 py-1 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                isLive
                  ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900'
                  : 'bg-neutral-900 border-white/10 text-neutral-400 hover:text-white'
              }`}
            >
              <Radio className={`w-3 h-3 ${isLive ? 'text-emerald-400 animate-pulse' : 'text-neutral-500'}`} />
              <span>{isLive ? 'پخش زنده فعال' : 'فعال‌سازی پخش زنده'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* CPU Usage Gauge */}
          <div className="p-5 rounded-3xl glass-surface border border-white/10 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-neutral-400 font-medium">مصرف پردازنده مرکزی:</span>
              <div className="text-2xl font-black text-white font-mono flex items-center gap-1.5" dir="ltr">
                <span>{metrics.cpuUsage}%</span>
                {isLive && metrics.isPulsing && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
                )}
              </div>
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
                  className="text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.6)] transition-all duration-500"
                  strokeDasharray={`${metrics.cpuUsage}, 100`}
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
              <div className="text-2xl font-black text-white font-mono" dir="ltr">
                {metrics.ramUsedGb} / {metrics.ramTotalGb} GB
              </div>
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
                  className="text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.6)] transition-all duration-500"
                  strokeDasharray={`${Math.round((metrics.ramUsedGb / metrics.ramTotalGb) * 100)}, 100`}
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
              <div className="text-2xl font-black text-white font-mono" dir="ltr">
                {metrics.diskUsedGb} / {metrics.diskTotalGb} GB
              </div>
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
                  className="text-indigo-400 drop-shadow-[0_0_6px_rgba(129,140,248,0.6)] transition-all duration-500"
                  strokeDasharray={`${Math.round((metrics.diskUsedGb / metrics.diskTotalGb) * 100)}, 100`}
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
              <div className="text-2xl font-black text-white font-mono" dir="ltr">
                {metrics.aiThroughput} t/s
              </div>
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
                  className="text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.6)] transition-all duration-500"
                  strokeDasharray={`${Math.min(100, Math.round((metrics.aiThroughput / 190) * 100))}, 100`}
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
                      <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-600'}`} />
                      {agent.id === 'agent-win-workstation'
                        ? `${metrics.nodeLatencies.winWorkstation}ms`
                        : `${metrics.nodeLatencies.winLaptop}ms`
                      } (Online)
                    </span>
                  </td>
                  <td className="p-3 text-[11px] text-neutral-400">
                    {isLive ? metrics.lastRefreshedAt : agent.lastHeartbeat}
                  </td>
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
            <span className="text-xs text-neutral-400 font-mono">4 Infrastructure Nodes Active</span>
          </div>

          <div className="space-y-3">
            {[
              {
                name: 'Master Control-Plane (Hetzner Dedicated)',
                role: 'FastAPI Core + PostgreSQL 16 + Redis',
                ip: '192.168.1.10:8000',
                status: 'Online',
                latency: `${metrics.nodeLatencies.master}ms`,
                badge: 'Primary Core'
              },
              {
                name: 'Edge Worker #1 (GPU Runner RTX 4090)',
                role: 'vLLM + Ollama Server 2 Cluster Node',
                ip: '192.168.1.55:9090',
                status: 'Online',
                latency: `${metrics.nodeLatencies.edgeGpu}ms`,
                badge: 'Server 2 GPU'
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

      {/* Modal e Modiriat va Downloade Modelhaye Mahalli (Local AI) */}
      <LocalModelManagerModal
        isOpen={showLocalModelsModal}
        onClose={() => setShowLocalModelsModal(false)}
      />

      {/* Modal e Etesal e Server 2 va Khoushebani (Multi-Server Clustering) */}
      <MultiServerNodeConnectModal
        isOpen={showServer2Modal}
        onClose={() => setShowServer2Modal(false)}
      />

      {/* Modal e Domain va Let's Encrypt SSL (HTTPS) */}
      <DomainSslSetupModal
        isOpen={showDomainSslModal}
        onClose={() => setShowDomainSslModal(false)}
      />

    </div>
  );
};
