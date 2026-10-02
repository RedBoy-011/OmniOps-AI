import React, { useState } from 'react';
import {
  Terminal,
  Laptop,
  Check,
  Copy,
  Download,
  X,
  ExternalLink,
  Shield,
  Layers,
  Cpu,
  Server,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  FileCode,
  Radio,
  Sparkles,
  Info,
  HelpCircle,
  Code2
} from 'lucide-react';
import { INITIAL_USER_PROFILE } from '../data/agentStore';
import { RAW_INSTALL_SCRIPT } from '../data/installScript';

interface OneLinerInstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'linux' | 'windows' | 'docker' | 'worker' | 'python' | 'socks';
  customToken?: string;
  customEmail?: string;
}

export const OneLinerInstallGuideModal: React.FC<OneLinerInstallGuideModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'linux',
  customToken = INITIAL_USER_PROFILE.pairingToken,
  customEmail = INITIAL_USER_PROFILE.email
}) => {
  const [activeTab, setActiveTab] = useState<'linux' | 'windows' | 'docker' | 'worker' | 'python' | 'socks'>(initialTab);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [serverDomain, setServerDomain] = useState('hub.omniops.ai');

  if (!isOpen) return null;

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Commands definition
  const linuxOneLiner = 'curl -sL https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/install.sh | bash';
  const linuxSilentOneLiner = 'curl -sL https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/install.sh | bash -s -- --non-interactive --role full';
  const windowsPowerShellOneLiner = `irm https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/windows-agent/install-agent.ps1 | iex -Token "${customToken}" -User "${customEmail}" -Hub "wss://${serverDomain}:7070"`;
  const dockerComposeOneLiner = 'curl -sSL https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/docker-compose.yml -o docker-compose.yml && docker compose up -d';
  const workerNodeOneLiner = `curl -sL https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/install.sh | bash -s -- --role worker --master https://${serverDomain}:9090 --token "${customToken}"`;
  const pythonPipOneLiner = `pip install omniops-agent && omniops-agent connect --token "${customToken}" --hub "wss://${serverDomain}:7070"`;
  const socksOneLiner = 'export HTTPS_PROXY="socks5://127.0.0.1:10808" && export HTTP_PROXY="socks5://127.0.0.1:10808"';

  const tabsConfig = [
    { id: 'linux', label: 'سرور لینوکس (Master)', icon: Terminal, badge: 'Bash' },
    { id: 'windows', label: 'ایجنت ویندوز (PowerShell)', icon: Laptop, badge: 'Win 10/11' },
    { id: 'docker', label: 'داکر کمپوز (Docker Stack)', icon: Layers, badge: 'Containers' },
    { id: 'worker', label: 'نود ورکر لبه (GPU Node)', icon: Cpu, badge: 'Worker' },
    { id: 'python', label: 'پایتون کلاینت (Pip CLI)', icon: Code2, badge: 'Python' },
    { id: 'socks', label: 'دورزدن تحریم (SOCKS5)', icon: Zap, badge: 'Proxy' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200" dir="rtl">
      
      {/* Container e Asli e Modal */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl glass-surface-elevated border border-white/15 shadow-2xl overflow-hidden text-neutral-100">
        
        {/* Header e Modal */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between gap-4 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>مرکز دستورات نصب تک‌خطی و راهنمای استقرار کلاستر</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                  Quickstart Guide
                </span>
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                دستورات یک‌خطی خودکار برای راه‌اندازی سریع سرورها، اتصال همیار ویندوز، کانتینرهای داکر و نودهای پردازشی
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl glass-surface hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="بستن پنجره"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center gap-1.5 p-2.5 sm:px-6 border-b border-white/10 overflow-x-auto bg-black/40 scrollbar-none">
          {tabsConfig.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600/40 to-indigo-600/40 text-white border border-cyan-500/50 shadow-md shadow-cyan-950/50'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-neutral-500'}`} />
                <span>{tab.label}</span>
                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-md ${
                  isActive ? 'bg-cyan-500/30 text-cyan-200' : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Modal Body / Tab Contents */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: Linux Server Master */}
          {activeTab === 'linux' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Box 1: Dastoore Asli */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span>دستور استاندارد نصب در سرور لینوکس (تعاملی با منو)</span>
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">Bash Interactive</span>
                </div>

                <div className="p-3.5 bg-black/80 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-emerald-400">
                  <div className="truncate select-all" dir="ltr">
                    {linuxOneLiner}
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => copyText(linuxOneLiner, 'linux-main')}
                      className="px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-sans cursor-pointer flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      {copiedKey === 'linux-main' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'linux-main' ? 'کپی شد' : 'کپی دستور'}</span>
                    </button>
                    <button
                      onClick={() => downloadFile(RAW_INSTALL_SCRIPT, 'install.sh', 'text/x-sh')}
                      className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-sans cursor-pointer flex items-center gap-1.5 transition-all"
                      title="دانلود مستقیم فایل install.sh"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>دانلود فایل</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Box 2: Dastoore Bi-seda (Silent / Automation) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>دستور نصب بی‌صدا برای اسکریپت‌های اتوماسیون (CI/CD & Cloud-Init)</span>
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">Non-Interactive</span>
                </div>

                <div className="p-3 bg-black/60 border border-white/10 rounded-xl flex items-center justify-between gap-2 text-xs font-mono text-cyan-300" dir="ltr">
                  <span className="truncate select-all">{linuxSilentOneLiner}</span>
                  <button
                    onClick={() => copyText(linuxSilentOneLiner, 'linux-silent')}
                    className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-[11px] font-sans cursor-pointer shrink-0 flex items-center gap-1 transition-colors"
                  >
                    {copiedKey === 'linux-silent' ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
                    <span>کپی</span>
                  </button>
                </div>
              </div>

              {/* Box 3: Rahnamaye Tafsili va Marhale-be-Marhale */}
              <div className="p-5 rounded-2xl glass-surface border border-white/10 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Info className="w-4 h-4 text-cyan-400" />
                  <span>راهنمای جامع مراحل اجرا و نیازمندی‌های سرور لینوکس</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="font-bold text-cyan-300 block">۱. حداقل نیازمندی‌های سخت‌افزاری</span>
                    <ul className="space-y-1 text-neutral-300 list-disc list-inside">
                      <li>پردازنده: حداقل ۲ هسته vCPU (پیشنهادی ۴ هسته)</li>
                      <li>حافظه RAM: حداقل ۴ گیگابایت (پیشنهادی ۸ گیگابایت)</li>
                      <li>فضای ذخیره‌سازی: حداقل ۲۰ گیگابایت SSD/NVMe</li>
                      <li>سیستم‌عامل: Ubuntu 22.04 LTS / Debian 12 / Rocky Linux 9</li>
                    </ul>
                  </div>

                  <div className="space-y-2 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="font-bold text-emerald-300 block">۲. عملیات خودکار اسکریپت در سرور</span>
                    <ul className="space-y-1 text-neutral-300 list-disc list-inside">
                      <li>بررسی و نصب Docker Engine و Docker Compose v2</li>
                      <li>تولید کلیدهای امنیتی و فایل پیکربندی <code className="text-cyan-400 font-mono">/opt/omniops-ai/.env</code></li>
                      <li>راه‌اندازی استک کلاستر روی پورت‌های ۸۰۸۰ و ۸۰۰۰ و ۷۰۷۰</li>
                      <li>ثبت سرویس پس‌زمینه لینوکسی <code className="text-emerald-400 font-mono">omniops-master.service</code></li>
                    </ul>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-neutral-300 space-y-1">
                  <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>آدرس دسترسی به کنسول پس از نصب:</span>
                  </div>
                  <p className="font-mono text-cyan-200" dir="ltr">http://&lt;SERVER_IP&gt;:8080</p>
                  <p className="text-[11px] text-neutral-400">
                    ایمیل پیش‌فرض مدیر ارشد: <strong className="text-white font-mono">admin@omniops.ai</strong>
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Windows Agent PowerShell */}
          {activeTab === 'windows' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-purple-400" />
                    <span>دستور تک‌خطی اتصال ایجنت دسکتاپ ویندوز در PowerShell</span>
                  </span>
                  <span className="text-[10px] text-purple-300 font-mono">PowerShell 5.1 / 7+</span>
                </div>

                <div className="p-3.5 bg-black/80 border border-purple-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-purple-300">
                  <div className="truncate select-all" dir="ltr">
                    {windowsPowerShellOneLiner}
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => copyText(windowsPowerShellOneLiner, 'win-ps')}
                      className="px-3 py-1.5 bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border border-purple-500/40 rounded-xl text-xs font-sans cursor-pointer flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      {copiedKey === 'win-ps' ? <Check className="w-3.5 h-3.5 text-purple-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'win-ps' ? 'کپی شد' : 'کپی دستور کامل'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tanzeeme Token va Domain */}
              <div className="p-4 rounded-2xl glass-surface border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1">توکن جفت‌سازی اختصاصی شما (Pairing Token):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={customToken}
                      className="w-full px-3 py-1.5 bg-black/50 border border-white/10 rounded-xl font-mono text-neutral-200 text-xs"
                      dir="ltr"
                    />
                    <button
                      onClick={() => copyText(customToken, 'token-only')}
                      className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-neutral-300"
                      title="کپی فقط توکن"
                    >
                      {copiedKey === 'token-only' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">آدرس سرور یا دامنه کلاستر (Hub Endpoint):</label>
                  <input
                    type="text"
                    value={serverDomain}
                    onChange={(e) => setServerDomain(e.target.value)}
                    className="w-full px-3 py-1.5 bg-black/50 border border-white/10 rounded-xl font-mono text-neutral-200 text-xs"
                    dir="ltr"
                    placeholder="hub.omniops.ai یا IP سرور"
                  />
                </div>
              </div>

              {/* Rahnamaye Windows */}
              <div className="p-5 rounded-2xl glass-surface border border-white/10 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span>راهنمای عملکرد و ویژگی‌های ایجنت همیار ویندوز</span>
                </h4>

                <div className="space-y-3 text-xs text-neutral-300 leading-relaxed">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 font-bold text-[10px]">۱</span>
                    <div>
                      <strong className="text-white">بدون نیاز به Port Forwarding یا IP استاتیک:</strong>
                      <p className="text-neutral-400 mt-0.5">ایجنت اتصال وب‌سوکت معکوس خروجی (Outbound WebSocket) به پورت <code className="text-purple-300 font-mono">7070</code> سرور برقرار می‌سازد، لذا پشت هر روتر خانگی یا اینترنت اداری بدون تغییر تنظیمات مودم کار می‌کند.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 font-bold text-[10px]">۲</span>
                    <div>
                      <strong className="text-white">استقرار در System Tray و پنجره شناور:</strong>
                      <p className="text-neutral-400 mt-0.5">ایجنت یک میانبر در دسکتاپ ایجاد کرده و در کنار ساعت ویندوز قرار می‌گیرد. با یک کلیک پنجره شناور برای چت با مدل‌های AI و دریافت وضعیت سخت‌افزار باز می‌شود.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 font-bold text-[10px]">۳</span>
                    <div>
                      <strong className="text-white">رفع خطای ExecutionPolicy در ویندوز:</strong>
                      <p className="text-neutral-400 mt-0.5">اگر در اجرای اسکریپت با پیام خطای Security Script مواجه شدید، ابتدا این دستور را در پاورشل اجرا کنید:</p>
                      <div className="p-2 bg-black/60 rounded-lg font-mono text-purple-300 mt-1 flex items-center justify-between" dir="ltr">
                        <span>Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force</span>
                        <button
                          onClick={() => copyText('Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force', 'exec-policy')}
                          className="text-[11px] text-neutral-400 hover:text-white px-2 py-0.5 bg-neutral-800 rounded cursor-pointer"
                        >
                          {copiedKey === 'exec-policy' ? 'کپی شد' : 'کپی'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Docker Compose */}
          {activeTab === 'docker' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400" />
                    <span>دستور اجرای یکپارچه داکر کمپوز (Docker Compose One-Liner)</span>
                  </span>
                  <span className="text-[10px] text-blue-300 font-mono">Production Stack</span>
                </div>

                <div className="p-3.5 bg-black/80 border border-blue-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-blue-300">
                  <div className="truncate select-all" dir="ltr">
                    {dockerComposeOneLiner}
                  </div>
                  <button
                    onClick={() => copyText(dockerComposeOneLiner, 'docker-cmd')}
                    className="px-3 py-1.5 bg-blue-950/60 hover:bg-blue-900/80 text-blue-200 border border-blue-500/40 rounded-xl text-xs font-sans cursor-pointer flex items-center gap-1.5 transition-all shrink-0 self-end sm:self-auto"
                  >
                    {copiedKey === 'docker-cmd' ? <Check className="w-3.5 h-3.5 text-blue-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'docker-cmd' ? 'کپی شد' : 'کپی دستور داکر'}</span>
                  </button>
                </div>
              </div>

              {/* Service Matrix Table */}
              <div className="p-5 rounded-2xl glass-surface border border-white/10 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Server className="w-4 h-4 text-blue-400" />
                  <span>کانتینرها و سرویس‌های راه‌اندازی‌شده در استک داکر</span>
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-neutral-400">
                        <th className="py-2 px-3 font-medium">سرویس</th>
                        <th className="py-2 px-3 font-medium">پورت کانتینر</th>
                        <th className="py-2 px-3 font-medium">نقش در سیستم</th>
                        <th className="py-2 px-3 font-medium">وضعیت</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-neutral-200">
                      <tr>
                        <td className="py-2.5 px-3 font-mono font-bold text-white">omniops-master-ui</td>
                        <td className="py-2.5 px-3 font-mono text-cyan-400" dir="ltr">8080:80</td>
                        <td className="py-2.5 px-3">داشبورد مرکزی و کنسول مدیریت</td>
                        <td className="py-2.5 px-3 text-emerald-400">Ready</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-mono font-bold text-white">omniops-omniroute</td>
                        <td className="py-2.5 px-3 font-mono text-cyan-400" dir="ltr">8000:8000</td>
                        <td className="py-2.5 px-3">روتر مدل‌های AI و فال‌بک آبشاری</td>
                        <td className="py-2.5 px-3 text-emerald-400">Ready</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-mono font-bold text-white">omniops-hermes-agent</td>
                        <td className="py-2.5 px-3 font-mono text-cyan-400" dir="ltr">8081:8081</td>
                        <td className="py-2.5 px-3">بازوی اجرایی سندباکس ابزارها</td>
                        <td className="py-2.5 px-3 text-emerald-400">Ready</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-mono font-bold text-white">omniops-ws-tunnel</td>
                        <td className="py-2.5 px-3 font-mono text-cyan-400" dir="ltr">7070:7070</td>
                        <td className="py-2.5 px-3">گیت‌وی تانل معکوس برای ایجنت‌های ویندوز</td>
                        <td className="py-2.5 px-3 text-emerald-400">Ready</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-mono font-bold text-white">omniops-redis</td>
                        <td className="py-2.5 px-3 font-mono text-neutral-400" dir="ltr">6379:6379</td>
                        <td className="py-2.5 px-3">صف پیام‌های فوری و کشینگ کلیدها</td>
                        <td className="py-2.5 px-3 text-neutral-400">Internal</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-mono font-bold text-white">omniops-postgres</td>
                        <td className="py-2.5 px-3 font-mono text-neutral-400" dir="ltr">5432:5432</td>
                        <td className="py-2.5 px-3">دیتابیس نگهداری لاگ‌ها، ایجنت‌ها و کاربران</td>
                        <td className="py-2.5 px-3 text-neutral-400">Internal</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: GPU Worker Node */}
          {activeTab === 'worker' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-emerald-400" />
                    <span>دستور اتصال نود ورکر پردازشی / کارت‌های گرافیک انویدیا به کلاستر</span>
                  </span>
                  <span className="text-[10px] text-emerald-300 font-mono">Edge Cluster Join</span>
                </div>

                <div className="p-3.5 bg-black/80 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-emerald-300">
                  <div className="truncate select-all" dir="ltr">
                    {workerNodeOneLiner}
                  </div>
                  <button
                    onClick={() => copyText(workerNodeOneLiner, 'worker-cmd')}
                    className="px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-200 border border-emerald-500/40 rounded-xl text-xs font-sans cursor-pointer flex items-center gap-1.5 transition-all shrink-0 self-end sm:self-auto"
                  >
                    {copiedKey === 'worker-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'worker-cmd' ? 'کپی شد' : 'کپی دستور ورکر'}</span>
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-2xl glass-surface border border-white/10 space-y-3 text-xs text-neutral-300">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>قابلیت‌های نود پردازشی لبه (Edge GPU Worker)</span>
                </h4>
                <p className="leading-relaxed">
                  با اجرای این دستور روی هر سرور دیگر که مجهز به کارت گرافیک (مانند Nvidia RTX 3090/4090 یا A100) است یا مدل‌های محلی Ollama را میزبانی می‌کند، این سرور به عنوان یک پردازشگر به روتر مرکزی متصل شده و ترافیک چت‌ها و کوئری‌ها بر حسب بار محاسباتی بین آن‌ها توزیع می‌گردد.
                </p>
                <div className="p-3 bg-white/[0.03] rounded-xl border border-white/5 space-y-1">
                  <span className="font-bold text-white block">پورت ارتباطی امن:</span>
                  <p className="text-neutral-400">اتصال با گواهی خودکار mTLS روی پورت <code className="text-emerald-400 font-mono">9090</code> با کلاستر مرکزی انجام می‌شود.</p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: Python Pip */}
          {activeTab === 'python' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-amber-400" />
                    <span>دستور نصب پکیج پایتون و اتصال خط فرمان (CLI)</span>
                  </span>
                  <span className="text-[10px] text-amber-300 font-mono">PyPI Package</span>
                </div>

                <div className="p-3.5 bg-black/80 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-amber-300">
                  <div className="truncate select-all" dir="ltr">
                    {pythonPipOneLiner}
                  </div>
                  <button
                    onClick={() => copyText(pythonPipOneLiner, 'pip-cmd')}
                    className="px-3 py-1.5 bg-amber-950/60 hover:bg-amber-900/80 text-amber-200 border border-amber-500/40 rounded-xl text-xs font-sans cursor-pointer flex items-center gap-1.5 transition-all shrink-0 self-end sm:self-auto"
                  >
                    {copiedKey === 'pip-cmd' ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'pip-cmd' ? 'کپی شد' : 'کپی'}</span>
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-2xl glass-surface border border-white/10 space-y-3 text-xs text-neutral-300">
                <h4 className="text-sm font-bold text-white">تبدیل به فایل اجرایی تکی (.exe) برای توزیع آسان</h4>
                <p className="text-neutral-400 leading-relaxed">
                  اگر می‌خواهید ایجنت را بدون نیاز به نصب پایتون روی سایر کامپیوترها اجرا کنید، می‌توانید با ابزار PyInstaller آن را به یک فایل منفرد <code className="text-amber-300 font-mono">OmniOps-Companion.exe</code> تبدیل فرمایید:
                </p>
                <div className="p-2.5 bg-black/70 rounded-xl font-mono text-amber-200 flex items-center justify-between" dir="ltr">
                  <span>pyinstaller --onefile --noconsole --name "OmniOps-Companion" omniops_agent.py</span>
                  <button
                    onClick={() => copyText('pyinstaller --onefile --noconsole --name "OmniOps-Companion" omniops_agent.py', 'pyinstaller-cmd')}
                    className="text-[11px] text-neutral-300 hover:text-white px-2 py-0.5 bg-neutral-800 rounded cursor-pointer"
                  >
                    {copiedKey === 'pyinstaller-cmd' ? 'کپی شد' : 'کپی'}
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: SOCKS5 Proxy */}
          {activeTab === 'socks' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span>دستور تنظیم سراسری پراکسی دورزدن تحریم در شل سرور</span>
                  </span>
                  <span className="text-[10px] text-emerald-300 font-mono">V2Ray / Xray / Clash</span>
                </div>

                <div className="p-3.5 bg-black/80 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-emerald-300">
                  <div className="truncate select-all" dir="ltr">
                    {socksOneLiner}
                  </div>
                  <button
                    onClick={() => copyText(socksOneLiner, 'socks-cmd')}
                    className="px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-200 border border-emerald-500/40 rounded-xl text-xs font-sans cursor-pointer flex items-center gap-1.5 transition-all shrink-0 self-end sm:self-auto"
                  >
                    {copiedKey === 'socks-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'socks-cmd' ? 'کپی شد' : 'کپی دستور پراکسی'}</span>
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-2xl glass-surface border border-white/10 space-y-4 text-xs">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>حل دائمی خطای تحریم (403 Forbidden) مدل‌های هوش مصنوعی</span>
                </h4>

                <div className="space-y-2 text-neutral-300 leading-relaxed">
                  <p>
                    هنگامی که سرور شما در دیتاسنترهای داخل کشور یا با آی‌پی‌های مشمول تحریم قرار دارد، اتصال مستقیم به Google Gemini یا OpenAI با خطای ۴۰۳ مسدود می‌گردد. هسته **OmniRoute** به صورت داخلی از اتصال مستقیم SOCKS5 پشتیبانی می‌کند:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                      <span className="font-bold text-white block">پورت‌های رایج نرم‌افزار V2Ray / Xray:</span>
                      <code className="text-emerald-400 font-mono block" dir="ltr">socks5://127.0.0.1:10808</code>
                    </div>
                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                      <span className="font-bold text-white block">پورت‌های رایج نرم‌افزار Clash:</span>
                      <code className="text-cyan-400 font-mono block" dir="ltr">http://127.0.0.1:7890</code>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-6 border-t border-white/10 bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-neutral-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>تمامی اسکریپت‌ها تست‌شده و منطبق بر مخزن رسمی گیت‌هاب می‌باشند.</span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all cursor-pointer"
          >
            متوجه شدم و بستن
          </button>
        </div>

      </div>

    </div>
  );
};
