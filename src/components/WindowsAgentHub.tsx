import React, { useState } from 'react';
import {
  Laptop,
  Download,
  Copy,
  Check,
  Terminal,
  ShieldCheck,
  Activity,
  Cpu,
  Sparkles,
  RefreshCw,
  Send,
  Pin,
  Minus,
  X,
  Camera,
  Trash2,
  HardDrive,
  Battery,
  Wifi,
  Volume2,
  Clock,
  Key,
  User,
  Radio,
  QrCode,
  Bell,
  ArrowRight,
  MessageSquare,
  Lock,
  CheckCircle2,
  Sliders,
  ExternalLink,
  Plus
} from 'lucide-react';
import { INITIAL_USER_PROFILE, INITIAL_CONNECTED_AGENTS, ConnectedAgent } from '../data/agentStore';

interface WindowsAgentHubProps {
  onNavigateToAgentChat?: (agentId: string) => void;
}

export const WindowsAgentHub: React.FC<WindowsAgentHubProps> = ({ onNavigateToAgentChat }) => {
  // Etelaate Karbare fa'al va Token e ekhtesasiye in Karbar
  const [userProfile, setUserProfile] = useState(INITIAL_USER_PROFILE);
  const [connectedAgents, setConnectedAgents] = useState<ConnectedAgent[]>(INITIAL_CONNECTED_AGENTS.filter(a => a.type === 'windows'));
  
  // Statehaye Kopi va Modals
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedPs, setCopiedPs] = useState(false);
  const [copiedExeCmd, setCopiedExeCmd] = useState(false);
  const [showPairModal, setShowPairModal] = useState(false);
  const [tokenRegeneratedToast, setTokenRegeneratedToast] = useState(false);
  const [pingTestingId, setPingTestingId] = useState<string | null>(null);

  // Statehaye marboot be Panjereye Shenavar (Floating Windows Companion Widget)
  const [isCompanionOpen, setIsCompanionOpen] = useState(true);
  const [isPinned, setIsPinned] = useState(true);
  const [companionInput, setCompanionInput] = useState('');
  const [companionMessages, setCompanionMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string; screenshot?: boolean }>>([
    {
      sender: 'bot',
      text: `درود! من همیار شناور دسکتاپ ویندوز برای کاربر ${userProfile.email} هستم. به واسطه توکن اختصاصی امن به کلاستر مرکزی متصل شده‌ام و آماده اجرای دستورات محلی یا دریافت فرامین از پنل مرکزی هستم.`,
      time: '14:26'
    }
  ]);
  const [isCompanionProcessing, setIsCompanionProcessing] = useState(false);

  // Sakhtane dastoore PowerShell ekhtesasi baraye in Karbar ba Token va UserId
  const userSpecificPsCommand = `irm https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/windows-agent/install-agent.ps1 | iex -Token "${userProfile.pairingToken}" -User "${userProfile.email}" -Hub "${userProfile.tunnelEndpoint}"`;

  const copyUserPsCommand = () => {
    navigator.clipboard.writeText(userSpecificPsCommand);
    setCopiedPs(true);
    setTimeout(() => setCopiedPs(false), 2000);
  };

  const copyToken = () => {
    navigator.clipboard.writeText(userProfile.pairingToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleRegenerateToken = () => {
    const randomHex = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6);
    const newToken = `omni_win_usr_${userProfile.userId.replace('usr_', '')}_${randomHex}`;
    setUserProfile(prev => ({ ...prev, pairingToken: newToken }));
    setTokenRegeneratedToast(true);
    setTimeout(() => setTokenRegeneratedToast(false), 3000);
  };

  const handlePingTest = (agentId: string) => {
    setPingTestingId(agentId);
    setTimeout(() => {
      setPingTestingId(null);
      setConnectedAgents(prev =>
        prev.map(a =>
          a.id === agentId
            ? { ...a, latency: `${Math.floor(10 + Math.random() * 8)}ms`, lastHeartbeat: 'هم‌اکنون' }
            : a
        )
      );
    }, 600);
  };

  const copyExeCommand = () => {
    navigator.clipboard.writeText('pip install pyinstaller && pyinstaller --onefile --noconsole --name "OmniOps-Companion" omniops_agent.py');
    setCopiedExeCmd(true);
    setTimeout(() => setCopiedExeCmd(false), 2000);
  };

  // Ersale dastoor dar panjereye shenavar
  const handleSendCompanionMessage = (textToSend?: string) => {
    const text = textToSend || companionInput.trim();
    if (!text || isCompanionProcessing) return;

    const time = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    setCompanionMessages(prev => [...prev, { sender: 'user', text, time }]);
    setCompanionInput('');
    setIsCompanionProcessing(true);

    setTimeout(() => {
      setIsCompanionProcessing(false);
      let reply = 'دستور با موفقیت توسط هسته ویندوز پردازش و اجرا شد.';
      let hasScreenshot = false;

      if (text.includes('اسکرین‌شات') || text.includes('عکس')) {
        reply = '📸 اسکرین‌شات دسکتاپ ویندوز ثبت شد و به پنل مرکزی ارسال گردید (ابعاد: 2560x1440).';
        hasScreenshot = true;
      } else if (text.includes('کش') || text.includes('پاکسازی')) {
        reply = '🧹 فایل‌های موقت Temp و کش DNS ویندوز پاکسازی شدند. ۱.۸ گیگابایت فضای دیسک آزاد شد.';
      } else if (text.includes('رم') || text.includes('بهینه‌سازی')) {
        reply = '⚡ فرآیندهای پس‌زمینه غیرضروری فشرده‌سازی شدند. مصرف رم به ۱۴٪ کاهش یافت.';
      } else if (text.includes('پاورشل') || text.includes('ترمینال')) {
        reply = '💻 ترمینال PowerShell ادمین در محیط دسکتاپ اجرا گردید و لاگ آن به کلاستر برگردانده شد.';
      } else if (text.includes('نوتیفیکیشن') || text.includes('پیام')) {
        reply = '🔔 نوتیفیکیشن Toast در گوشه سمت راست ویندوز به کاربر نمایش داده شد.';
      }

      setCompanionMessages(prev => [...prev, { sender: 'bot', text: reply, time, screenshot: hasScreenshot }]);
    }, 700);
  };

  return (
    <div className="glass-surface-elevated border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8" dir="rtl">
      
      {/* 1. Header e Asli e Safhe */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mb-1">
            <span className="text-purple-400 font-semibold">Windows 10/11 Desktop Companion</span>
            <span>·</span>
            <span>User-Specific Pairing Box & Reverse WebSocket</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Laptop className="w-6 h-6 text-purple-400" />
            <span>ایجنت و همیار شناور دسکتاپ ویندوز (OmniOps Windows Companion)</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-3xl leading-relaxed">
            کلاینت سبک دسکتاپ ویندوز که در کنار ساعت سیستم (System Tray) به صورت شناور مستقر می‌شود. دارای چت‌بات همراه، مانیتورینگ سخت‌افزار و ارتباط دوطرفه با پنل مرکزی از طریق کد و توکن اختصاصی هر کاربر.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPairModal(true)}
            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-purple-950/60"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>جفت‌سازی دستگاه جدید</span>
          </button>
        </div>
      </div>

      {/* 2. BAX-E ETESAL VA JOFTSAZIYE EKHTESASIYE KARBAR (User-Specific Agent Box & Pairing Hub) */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/30 via-neutral-900/60 to-indigo-950/30 border border-purple-500/30 space-y-5 shadow-xl relative overflow-hidden">
        
        {/* Glow Pas-zamine */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Key className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-white">
                باکس اتصال و جفت‌سازی اختصاصی ایجنت برای این کاربر
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                Active Tenant
              </span>
            </div>
            <p className="text-xs text-neutral-300">
              ارتباط ایجنت ویندوز با کد اختصاصی ساخته‌شده در این پنل برای اکانت شما برقرار می‌شود. هر فرمانی که از پنل مرکزی ارسال کنید، به این ایجنت دیسپچ خواهد شد.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRegenerateToken}
              className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              title="تولید مجدد کلید و ابطال کلید قبلی"
            >
              <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
              <span>تولید مجدد توکن</span>
            </button>
            <button
              onClick={() => onNavigateToAgentChat && onNavigateToAgentChat(connectedAgents[0]?.id || 'agent-win-workstation')}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-cyan-950/60"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>مکالمه و ارسال دستور در پنل مرکزی</span>
            </button>
          </div>
        </div>

        {tokenRegeneratedToast && (
          <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>توکن جدید اتصال ایجنت ویندوز با موفقیت تولید شد. دستورات نصب به‌روز شدند.</span>
          </div>
        )}

        {/* Karbar, Token va Moshakhasate Amniati */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10 text-xs">
          
          {/* Karbare Fa'al */}
          <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-1">
            <div className="flex items-center gap-2 text-neutral-400 text-[11px]">
              <User className="w-3.5 h-3.5 text-purple-400" />
              <span>کاربر اختصاصی ایجنت (User ID):</span>
            </div>
            <div className="font-mono text-white font-bold truncate" dir="ltr">
              {userProfile.email}
            </div>
            <div className="text-[10px] text-neutral-500 font-mono">
              Tenant: {userProfile.tenantId}
            </div>
          </div>

          {/* Token e Ekhtesasi */}
          <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-1 md:col-span-2">
            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                <span>توکن محرمانه جفت‌سازی (Agent Secret Token):</span>
              </span>
              <button
                onClick={copyToken}
                className="text-purple-300 hover:text-white flex items-center gap-1 cursor-pointer font-mono"
              >
                {copiedToken ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedToken ? 'کپی شد' : 'کپی توکن'}</span>
              </button>
            </div>
            <div className="p-2 bg-neutral-950 border border-neutral-800 rounded-xl text-purple-300 font-mono text-[11px] flex items-center justify-between select-all" dir="ltr">
              <span className="truncate">{userProfile.pairingToken}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 shrink-0">
                AES-256
              </span>
            </div>
          </div>

        </div>

        {/* Dastoore Tak-khattiye Nasb va Joft-sazi dar PowerShell ba Token e Karbar */}
        <div className="space-y-2 relative z-10">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span>دستور نصب و اتصال خودکار اختصاصی در PowerShell سیستم کاربر:</span>
            </span>
            <span className="text-[10px] font-mono text-neutral-400">
              Auto-Pairing Enabled
            </span>
          </div>

          <div className="p-3.5 bg-neutral-950 border border-purple-900/50 rounded-2xl flex items-center justify-between gap-3 text-xs font-mono text-purple-200" dir="ltr">
            <code className="truncate select-all text-purple-200 font-medium">
              {userSpecificPsCommand}
            </code>
            <button
              onClick={copyUserPsCommand}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 flex items-center gap-1.5 transition-colors shadow-md shadow-purple-950/60"
            >
              {copiedPs ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copiedPs ? 'کپی شد!' : 'کپی دستور کاربر'}</span>
            </button>
          </div>
          <div className="pt-1">
            <p className="text-[11px] text-neutral-400">
              💡 این دستور دارای پارامترهای <code className="text-purple-300 font-mono">-Token</code> و <code className="text-purple-300 font-mono">-User</code> مختص شماست؛ با اجرای آن، ایجنت فوراً به این پنل متصل شده و آماده ارسال و دریافت دستور می‌شود.
            </p>
          </div>
        </div>

      </div>

      {/* 3. FEHRESTE DASTGAHHAYE VINDOWSIYE JOFT-SHODEYE KARBAR (Paired Windows Agents List) */}
      <div className="p-6 rounded-3xl glass-surface border border-white/10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Laptop className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white">
              دستگاه‌های ویندوزی جفت‌شده این کاربر ({connectedAgents.length} سیستم فعال)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-0.5 rounded-full">
            ● Reverse WebSocket Tunnel Active
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {connectedAgents.map((agent) => (
            <div
              key={agent.id}
              className="p-4 rounded-2xl bg-neutral-900/70 border border-white/10 hover:border-purple-500/40 transition-all space-y-3 shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{agent.name}</h4>
                    <span className="text-[10px] text-neutral-400 font-mono">{agent.os}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {agent.latency}
                  </span>
                  <button
                    onClick={() => handlePingTest(agent.id)}
                    disabled={pingTestingId === agent.id}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white cursor-pointer transition-colors"
                    title="تست پینگ زنده"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${pingTestingId === agent.id ? 'animate-spin text-purple-400' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Telemetry Grid */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono">
                <div>
                  <span className="text-neutral-500 block text-[9px]">CPU Usage:</span>
                  <span className="text-cyan-300 font-bold">{agent.cpu}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[9px]">Memory:</span>
                  <span className="text-purple-300 font-bold">{agent.ram}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[9px]">Battery:</span>
                  <span className="text-emerald-300 font-bold">{agent.battery || 'AC Power'}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 text-[10px] text-neutral-400">
                {agent.capabilities.map((cap, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/5">
                    {cap}
                  </span>
                ))}
              </div>

              {/* Dokmehaye amaliat va ersale dastoor */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-[10px] text-neutral-500 font-mono">
                  جفت‌شده: {agent.pairedAt}
                </span>

                <button
                  onClick={() => onNavigateToAgentChat && onNavigateToAgentChat(agent.id)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-md shadow-purple-950/60 transition-all"
                >
                  <Send className="w-3.5 h-3.5 rotate-180" />
                  <span>ارسال دستور و مکالمه در پنل</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Shabihsaze Zende va Basiye Desktop e Windows 11 ba Aicone Kenare Sa'at va Panjereye Shenavar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>پیش‌نمایش تعاملی: ابعاد آیکون کنار ساعت و پنجره شناور چت‌بات در ویندوز ۱۱</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              برای باز یا بسته کردن پنجره شناور، روی آیکون درخشان همیار در نوار وظیفه کنار ساعت کلیک کنید.
            </p>
          </div>

          <button
            onClick={() => setIsCompanionOpen(!isCompanionOpen)}
            className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-purple-300 hover:text-white cursor-pointer transition-colors"
          >
            {isCompanionOpen ? 'بستن پنجره شناور' : 'نمایش پنجره شناور'}
          </button>
        </div>

        {/* Windows 11 Simulated Desktop Environment */}
        <div className="relative w-full h-[540px] rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#0c0d14] via-[#121320] to-[#0a0a0f] shadow-2xl flex flex-col justify-between" dir="ltr">
          
          {/* Desktop Wallpaper Ambient Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(147,51,234,0.12),transparent_50%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(6,182,212,0.08),transparent_50%)] pointer-events-none" />

          {/* Desktop Area with Windows 11 Floating Companion Window */}
          <div className="relative flex-1 p-6 flex justify-end items-end overflow-hidden">
            
            {/* Panjereye Shenavar e Chatbot (Windows 11 Mica / Frosted Acrylic Style) */}
            {isCompanionOpen && (
              <div className="w-full max-w-[370px] h-[460px] rounded-2xl glass-surface-elevated border border-white/20 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-bottom-5 duration-200 z-20 backdrop-blur-3xl bg-neutral-900/85">
                
                {/* Window Header Bar */}
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-white/[0.04] border-b border-white/10 select-none">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                    <span className="font-bold text-xs text-white tracking-wide">OmniOps Companion</span>
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-800">
                      Win11
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-neutral-400">
                    <button
                      onClick={() => setIsPinned(!isPinned)}
                      className={`p-1 rounded hover:bg-white/10 transition-colors cursor-pointer ${isPinned ? 'text-purple-400' : 'text-neutral-500'}`}
                      title="سنجاق کردن روی سایر برنامه‌ها (Always on Top)"
                    >
                      <Pin className="w-3.5 h-3.5 rotate-45" />
                    </button>
                    <button
                      onClick={() => setIsCompanionOpen(false)}
                      className="p-1 rounded hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                      title="کمینه‌سازی"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setIsCompanionOpen(false)}
                      className="p-1 rounded hover:bg-red-500/80 hover:text-white transition-colors cursor-pointer"
                      title="بستن"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Telemetry Bar: CPU, RAM, Battery */}
                <div className="px-3.5 py-2 bg-black/40 border-b border-white/5 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                  <div className="flex items-center gap-1 text-cyan-300">
                    <Cpu className="w-3 h-3" />
                    <span>CPU: 16%</span>
                  </div>
                  <div className="flex items-center gap-1 text-purple-300">
                    <Activity className="w-3 h-3" />
                    <span>RAM: 5.4/16GB</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-300">
                    <Battery className="w-3 h-3" />
                    <span>98%</span>
                  </div>
                </div>

                {/* Chat Messages Area */}
                <div className="flex-1 p-3 space-y-2.5 overflow-y-auto text-xs scrollbar-thin">
                  {companionMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`p-2.5 rounded-xl max-w-[85%] text-xs leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-purple-600 text-white rounded-br-none shadow-md'
                            : 'bg-white/10 text-neutral-200 border border-white/10 rounded-bl-none shadow-sm'
                        }`}
                      >
                        {msg.text}

                        {/* Screenshot Card agar vojood dashte bashe */}
                        {msg.screenshot && (
                          <div className="mt-2 p-2 rounded-lg bg-black/60 border border-white/10 space-y-1.5">
                            <div className="w-full h-24 bg-gradient-to-tr from-purple-900/40 via-cyan-950/40 to-neutral-900 rounded border border-white/10 flex items-center justify-center text-neutral-400 text-[10px]">
                              <Camera className="w-5 h-5 text-purple-400 mr-1.5" />
                              <span>Desktop Screen: 2560x1440 (Captured)</span>
                            </div>
                            <span className="text-[9px] text-emerald-400 font-mono block text-right">
                              ✔ بافر تصویر در کلاستر ذخیره شد
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] text-neutral-500 font-mono mt-0.5 px-1">{msg.time}</span>
                    </div>
                  ))}

                  {isCompanionProcessing && (
                    <div className="flex items-center gap-1.5 p-2 bg-white/5 rounded-lg text-[11px] text-purple-300 animate-pulse">
                      <Sparkles className="w-3 h-3 animate-spin" />
                      <span>در حال پردازش فرمان محلی و ارسال به کلاستر...</span>
                    </div>
                  )}
                </div>

                {/* Quick Action Command Chips */}
                <div className="px-3 py-1.5 bg-black/30 border-t border-white/5 flex flex-wrap gap-1 text-[10px]">
                  {[
                    { label: '📸 اسکرین‌شات', cmd: 'اسکرین‌شات از صفحه بگیر' },
                    { label: '🧹 پاکسازی کش', cmd: 'کش سیستم رو تمیز کن' },
                    { label: '⚡ بهینه‌سازی رم', cmd: 'مصرف رم رو بهینه‌سازی کن' },
                    { label: '💻 ترمینال', cmd: 'پاورشل رو باز کن' },
                    { label: '🔔 نوتیفیکیشن', cmd: 'یک نوتیفیکیشن نمایش بده' }
                  ].map((chip, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendCompanionMessage(chip.cmd)}
                      className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-purple-600/30 border border-white/5 text-neutral-300 hover:text-white cursor-pointer transition-colors"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                {/* Companion Input Field */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendCompanionMessage();
                  }}
                  className="p-2.5 bg-black/50 border-t border-white/10 flex items-center gap-1.5"
                >
                  <input
                    type="text"
                    value={companionInput}
                    onChange={(e) => setCompanionInput(e.target.value)}
                    placeholder="فرمان دسکتاپ را بنویسید..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    disabled={!companionInput.trim() || isCompanionProcessing}
                    className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer disabled:opacity-40"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

              </div>
            )}
          </div>

          {/* Windows 11 Taskbar with System Tray beside Clock */}
          <div className="w-full h-12 glass-surface-elevated border-t border-white/10 flex items-center justify-between px-4 z-30 select-none backdrop-blur-2xl bg-neutral-950/90">
            
            {/* Left: Windows Widgets icon placeholder */}
            <div className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-cyan-400 cursor-pointer">
              <span className="text-xs font-bold">18°C</span>
            </div>

            {/* Center: Windows 11 Centered App Icons */}
            <div className="flex items-center gap-1.5">
              {/* Windows 11 Start Logo */}
              <button className="w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer">
                <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                  <div className="bg-cyan-400 rounded-sm" />
                  <div className="bg-cyan-400 rounded-sm" />
                  <div className="bg-cyan-400 rounded-sm" />
                  <div className="bg-cyan-400 rounded-sm" />
                </div>
              </button>

              {/* Task View */}
              <button className="w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center text-neutral-400 cursor-pointer">
                <div className="w-4 h-3.5 border border-neutral-400 rounded-sm flex items-center justify-center">
                  <div className="w-2 h-2 bg-neutral-400 rounded-xs" />
                </div>
              </button>

              {/* File Explorer */}
              <button className="w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center text-amber-400 cursor-pointer">
                <HardDrive className="w-4 h-4" />
              </button>

              {/* Windows Terminal */}
              <button className="w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center text-emerald-400 cursor-pointer">
                <Terminal className="w-4 h-4" />
              </button>
            </div>

            {/* Right: Windows System Tray with OmniOps Companion Icon beside Clock */}
            <div className="flex items-center gap-2">
              
              {/* OmniOps Windows Companion Tray Icon (آیکون درخشان کنار ساعت) */}
              <button
                onClick={() => setIsCompanionOpen(!isCompanionOpen)}
                className={`relative px-2 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  isCompanionOpen
                    ? 'bg-purple-600/30 border border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                    : 'hover:bg-white/10 border border-transparent'
                }`}
                title="OmniOps Windows Companion: آنلاین و فعال (کلیک برای باز کردن همیار شناور)"
              >
                <div className="relative">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                </div>
                <span className="text-[10px] font-mono text-purple-300 font-bold hidden sm:inline">
                  OmniOps
                </span>
              </button>

              {/* Standard Windows Tray Icons (Wifi, Volume, Battery) */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/10 text-neutral-400 cursor-pointer">
                <Wifi className="w-3.5 h-3.5" />
                <Volume2 className="w-3.5 h-3.5" />
                <Battery className="w-3.5 h-3.5" />
              </div>

              {/* Windows Clock & Date */}
              <div className="text-right text-[11px] font-mono text-neutral-300 leading-tight px-1 cursor-pointer">
                <div>14:28 PM</div>
                <div className="text-[9px] text-neutral-500">2026/10/02</div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 5. Sakhtane File Exe ba PyInstaller */}
      <div className="p-5 rounded-2xl glass-surface border border-white/10 space-y-3">
        <h4 className="text-xs font-bold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>کامپایل به فایل اجرایی مستقل (.exe) برای توزیع آسان</span>
        </h4>
        <p className="text-xs text-neutral-300 leading-relaxed">
          برای تبدیل کلاینت به یک فایل مستقل <code className="text-emerald-300 font-mono">OmniOps-Companion.exe</code> که بدون نیاز به نصب پایتون در استارتاپ ویندوز اجرا شود:
        </p>

        <div className="p-3 bg-black/70 border border-neutral-800 rounded-xl text-xs font-mono text-emerald-400 flex items-center justify-between gap-2" dir="ltr">
          <code className="truncate">pip install pyinstaller && pyinstaller --onefile --noconsole --name "OmniOps-Companion" omniops_agent.py</code>
          <button
            onClick={copyExeCommand}
            className="text-neutral-300 hover:text-white px-2.5 py-1 text-[11px] bg-neutral-800 rounded-lg cursor-pointer shrink-0"
          >
            {copiedExeCmd ? 'کپی شد!' : 'کپی دستور'}
          </button>
        </div>
      </div>

      {/* Modal e Joft-saziye Dastgahe Jadid */}
      {showPairModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in" dir="rtl">
          <div className="relative w-full max-w-lg rounded-3xl glass-surface-elevated border border-purple-500/40 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Laptop className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white">اتصال و جفت‌سازی کامپیوتر یا لپ‌تاپ ویندوزی جدید</h3>
              </div>
              <button
                onClick={() => setShowPairModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-neutral-300 leading-relaxed">
              <p>
                برای متصل کردن سیستم جدید به حساب <span className="text-purple-300 font-mono">{userProfile.email}</span>، مراحل زیر را طی کنید:
              </p>

              <ol className="list-decimal list-inside space-y-2 font-sans">
                <li>در ویندوز مقصد، PowerShell را به صورت <span className="text-amber-400 font-bold">Run as Administrator</span> باز کنید.</li>
                <li>دستور زیر را کپی کرده و در ترمینال اجرا کنید:</li>
              </ol>

              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-[11px] font-mono text-purple-300 flex items-center justify-between gap-2" dir="ltr">
                <span className="truncate">{userSpecificPsCommand}</span>
                <button
                  onClick={copyUserPsCommand}
                  className="px-2.5 py-1 rounded bg-purple-600 text-white text-[10px] shrink-0 cursor-pointer"
                >
                  {copiedPs ? 'کپی شد' : 'کپی'}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/60 text-[11px] space-y-1">
                <span className="text-purple-300 font-bold block">اتصال خودکار بدون پورت فورواردینگ (Reverse Tunnel):</span>
                <span className="text-neutral-400">ایجنت مستقیماً از طریق وب‌سوکت معکوس به پنل متصل شده و آیکون آن کنار ساعت ظاهر می‌شود.</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-white/10">
              <button
                onClick={() => setShowPairModal(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold cursor-pointer"
              >
                بستن راهنما
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
