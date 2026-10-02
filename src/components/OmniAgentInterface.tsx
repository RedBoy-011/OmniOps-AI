import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Terminal,
  Cpu,
  Shield,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  Sliders,
  FolderGit2,
  Wrench,
  ChevronDown,
  Copy,
  Check,
  Zap,
  Code2,
  Layers,
  Database,
  ArrowRight,
  Laptop,
  Radio,
  Camera,
  Trash2,
  Bell,
  RefreshCw,
  HardDrive,
  ExternalLink
} from 'lucide-react';
import { INITIAL_USER_PROFILE, INITIAL_CONNECTED_AGENTS, ConnectedAgent } from '../data/agentStore';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  timestamp: string;
  content: string;
  mode: 'chat' | 'task';
  targetAgentId?: string;
  targetAgentName?: string;
  modelUsed?: string;
  reasoningSteps?: string[];
  terminalLogs?: string[];
  executedCommand?: string;
  hasScreenshot?: boolean;
  screenshotDetails?: {
    resolution: string;
    capturedAt: string;
    windowTitle: string;
  };
  telemetrySnapshot?: {
    cpu: string;
    ram: string;
    battery?: string;
    latency: string;
  };
  approvalRequired?: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
}

interface OmniAgentInterfaceProps {
  initialTargetAgentId?: string;
}

export const OmniAgentInterface: React.FC<OmniAgentInterfaceProps> = ({ initialTargetAgentId }) => {
  // In state baraye switch kardane beine do halate Chat va Task ast
  const [activeState, setActiveState] = useState<'chat' | 'task'>('task');
  
  // Entekhabe Eyjente Maghsad (Target Agent Selector)
  const [targetAgentId, setTargetAgentId] = useState<string>(initialTargetAgentId || 'agent-win-workstation');
  
  // Statehaye marboot be Omni-Command Bar
  const [selectedProject, setSelectedProject] = useState('OmniOps Master Cluster');
  const [approvalGateEnabled, setApprovalGateEnabled] = useState(true);
  const [activeTool, setActiveTool] = useState<'openrouter' | 'powershell' | 'bash' | 'db'>('powershell');
  const [inputPrompt, setInputPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fehrest e Eyjentha
  const availableAgents = [
    { id: 'all', name: '📢 همه ایجنت‌ها (ارسال همگانی / Broadcast)', type: 'broadcast', latency: '14ms' },
    ...INITIAL_CONNECTED_AGENTS
  ];

  const currentTargetAgent = availableAgents.find(a => a.id === targetAgentId) || availableAgents[1];

  // Messagehaye ebtedaee ba nemoonehaye zende az ertebat ba Eyjente Vayndoz va Server
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'user',
      timestamp: '14:20:05',
      content: 'وضعیت سخت‌افزاری دسکتاپ ویندوز را بررسی کن و یک اسکرین‌شات از صفحه ثبت کن.',
      mode: 'task',
      targetAgentId: 'agent-win-workstation',
      targetAgentName: 'همیار دسکتاپ ویندوز (Workstation)'
    },
    {
      id: 'msg-2',
      sender: 'agent',
      timestamp: '14:20:08',
      content: 'دستور با موفقیت از پنل مرکزی از طریق تونل وب‌سوکت معکوس دریافت شد. اسکرین‌شات دسکتاپ ثبت گردید و وضعیت حافظه و پردازنده به پنل گزارش شد.',
      mode: 'task',
      targetAgentId: 'agent-win-workstation',
      targetAgentName: 'همیار دسکتاپ ویندوز (Workstation)',
      modelUsed: 'Windows Agent RPC · DeepSeek V4 Engine',
      telemetrySnapshot: {
        cpu: '16%',
        ram: '5.4 / 16 GB',
        battery: '98%',
        latency: '14ms'
      },
      reasoningSteps: [
        'گام ۱: تایید هویت پکت با توکن کاربر (omni_win_usr_taheri_8f49a2e1d7c3)',
        'گام ۲: فراخوانی کتابخانه GDI32 برای ضبط اسکرین‌شات دسکتاپ با وضوح ۲۵۶۰ در ۱۴۴۰ پیکسل',
        'گام ۳: دریافت وضعیت رم و سی‌پی‌یو از WMI و فشرده‌سازی در بافر امن'
      ],
      executedCommand: 'powershell.exe -NoProfile -Command "Import-Module OmniOps; Take-ScreenCapture -Compress; Get-CimInstance Win32_OperatingSystem | Select FreePhysicalMemory"',
      terminalLogs: [
        '[WIN-AGENT] Received WebSocket RPC command: capture_screen_and_telemetry',
        '[WIN-AGENT] Validated token for user: taheri.ledari.monir@gmail.com',
        '[WIN-GDI] Captured primary display: 2560x1440, 32-bit color depth (Size: 184KB compressed)',
        '[SUCCESS] Command executed with exit code 0. Telemetry dispatched to Master Control.'
      ],
      hasScreenshot: true,
      screenshotDetails: {
        resolution: '2560x1440 (QHD)',
        capturedAt: '14:20:07',
        windowTitle: 'OmniOps Enterprise Manager - Windows 11 Desktop'
      },
      approvalRequired: false,
      approvalStatus: 'approved'
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Ersale payame jadid be Eyjente Entekhab-shode
  const handleSendMessage = (textToSend?: string) => {
    const userMsgText = textToSend || inputPrompt.trim();
    if (!userMsgText || isProcessing) return;

    if (!textToSend) setInputPrompt('');

    const targeted = availableAgents.find(a => a.id === targetAgentId) || availableAgents[1];

    const newMsg: Message = {
      id: 'user-' + Date.now(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      content: userMsgText,
      mode: activeState,
      targetAgentId: targeted.id,
      targetAgentName: targeted.name
    };

    setMessages(prev => [...prev, newMsg]);
    setIsProcessing(true);

    // Pardazeshe Hooshmand va Dastoore Ekhtesasi bar asas e Eyjente Maghsad
    setTimeout(() => {
      setIsProcessing(false);

      const isWindowsTarget = targeted.id.includes('win') || targeted.id === 'all';
      const isScreenshot = userMsgText.includes('اسکرین‌شات') || userMsgText.includes('عکس') || userMsgText.includes('تصویر');
      const isCleanup = userMsgText.includes('کش') || userMsgText.includes('پاکسازی') || userMsgText.includes('temp');
      const isRamOpt = userMsgText.includes('رم') || userMsgText.includes('بهینه‌سازی') || userMsgText.includes('memory');
      const isNotification = userMsgText.includes('نوتیفیکیشن') || userMsgText.includes('پیام') || userMsgText.includes('toast');
      const isLock = userMsgText.includes('قفل') || userMsgText.includes('lock');

      const requiresApproval = approvalGateEnabled && (isCleanup || userMsgText.includes('حذف') || userMsgText.includes('kill') || userMsgText.includes('ری‌استارت'));

      let responseContent = '';
      let executedCmd = '';
      let logs: string[] = [];

      if (isWindowsTarget) {
        if (isScreenshot) {
          responseContent = `اسکرین‌شات با وضوح بالا از دسکتاپ ویندوز توسط همیار دسکتاپ ${targeted.name} با موفقیت ثبت و به پنل بازگردانده شد.`;
          executedCmd = `powershell.exe -Command "[OmniOps.Companion]::CaptureDisplay('Primary') | Compress-Archive"`;
          logs = [
            `[WIN-AGENT] Dispatching to ${targeted.name} (Reverse Tunnel)`,
            `[WIN-TOKEN] Verified: ${INITIAL_USER_PROFILE.pairingToken.substring(0, 18)}...`,
            `[SCREEN-CAPTURE] Primary monitor 2560x1440 captured in 42ms`,
            `[PAYLOAD] Image payload transfer complete: 198KB`
          ];
        } else if (isCleanup) {
          responseContent = `فایل‌های موقت پوشه Temp ویندوز و کش DNS سیستم با موفقیت پاکسازی شدند. ۱.۹ گیگابایت فضای حافظه آزاد شد.`;
          executedCmd = `powershell.exe -Command "Clear-Content -Path $env:TEMP\\* -Force -Recurse -ErrorAction SilentlyContinue; Clear-DnsClientCache"`;
          logs = [
            `[WIN-AGENT] Executing maintenance task on ${targeted.name}`,
            `[CLEANUP] Deleted 1,420 temporary files from %TEMP%`,
            `[DNS] DNS client cache flushed successfully`,
            `[STATUS] Disk space freed: 1.94 GB`
          ];
        } else if (isRamOpt) {
          responseContent = `فرآیندهای با مصرف بالای رم شناسایی شدند و بافر حافظه ویندوز فشرده‌سازی گردید. مصرف رم به ۱۴٪ کاهش یافت.`;
          executedCmd = `powershell.exe -Command "Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 5 Name, @{N='RAM(MB)';E={[math]::Round($_.WorkingSet/1MB)}}"`;
          logs = [
            `[PROCESS] Analyzed 148 running system processes`,
            `[MEMORY] Trimmed idle working sets across background services`,
            `[RESULT] Total RAM reduced from 34% to 14%`
          ];
        } else if (isNotification) {
          responseContent = `نوتیفیکیشن بومی ویندوز (Windows Toast Notification) با پیام شما در دسکتاپ کاربر نمایش داده شد.`;
          executedCmd = `powershell.exe -Command "[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null; Show-OmniToast -Title 'OmniOps Master' -Body '${userMsgText}'"`;
          logs = [
            `[WIN-AGENT] Toast notification packet dispatched`,
            `[UI-EVENT] Toast delivered to Windows Action Center at 14:28`,
            `[AUDIO] Played Windows system alert chime`
          ];
        } else if (isLock) {
          responseContent = `فرمان قفل سیستم صادر شد و دسکتاپ ویندوز با موفقیت به صفحه Lock Screen منتقل گردید.`;
          executedCmd = `rundll32.exe user32.dll,LockWorkStation`;
          logs = [
            `[SECURITY] Invoked user32.dll LockWorkStation API`,
            `[CONFIRMATION] Desktop session locked for security`
          ];
        } else {
          responseContent = activeState === 'task'
            ? `دستور با موفقیت توسط همیار دسکتاپ ${targeted.name} پردازش شد و خروجی در ساندباکس ویندوز ذخیره گردید.`
            : `پاسخ ایجنت ویندوز با تکیه بر مدل DeepSeek V4 Flash: تمام ماژول‌های دسکتاپ آنلاین هستند و دستورات خط فرمان با تاخیر 14ms پاسخ داده می‌شوند.`;
          executedCmd = `powershell.exe -NoProfile -Command "${userMsgText.replace(/"/g, '')}"`;
          logs = [
            `[WIN-RPC] Connection verified via WebSocket`,
            `[EXEC] Process spawned with Administrator privileges`,
            `[OUTPUT] Exit code: 0 (Execution Successful)`
          ];
        }
      } else {
        // Cloud Node Target
        responseContent = `تسک خودمختار در سرور ابری مرکزی (Hermes Cloud Node) پردازش شد. ارتباط با کانتینرهای داکر و هسته OmniRoute تایید گردید.`;
        executedCmd = `omniops-cli run --task "${userMsgText.slice(0, 30)}" --socks5 socks5://127.0.0.1:10808`;
        logs = [
          `[CLOUD-HERMES] Routed via OmniRoute Core (:8000)`,
          `[DOCKER] Container health checks verified: all services UP`,
          `[LATENCY] Cluster roundtrip: 18ms`
        ];
      }

      const agentResponse: Message = {
        id: 'agent-' + Date.now(),
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        content: responseContent,
        mode: activeState,
        targetAgentId: targeted.id,
        targetAgentName: targeted.name,
        modelUsed: isWindowsTarget ? 'Windows Agent RPC · DeepSeek V4' : 'Hermes Cloud Core · DeepSeek V4 Flash',
        telemetrySnapshot: isWindowsTarget ? {
          cpu: '16%',
          ram: '5.4 / 16 GB',
          battery: '98%',
          latency: '14ms'
        } : {
          cpu: '12%',
          ram: '1.4 / 16 GB',
          latency: '18ms'
        },
        reasoningSteps: activeState === 'task' ? [
          `تحلیل پروتکل ارتباطی با ${targeted.name}`,
          `احراز هویت توکن کاربر (${INITIAL_USER_PROFILE.pairingToken.substring(0, 15)}...)`,
          `اجرای دستور از طریق وب‌سوکت معکوس در سیستم مقصد`
        ] : undefined,
        executedCommand: activeState === 'task' ? executedCmd : undefined,
        terminalLogs: logs,
        hasScreenshot: isScreenshot && isWindowsTarget,
        screenshotDetails: isScreenshot && isWindowsTarget ? {
          resolution: '2560x1440 (QHD Display)',
          capturedAt: new Date().toLocaleTimeString('fa-IR'),
          windowTitle: 'Windows 11 Active Desktop Session'
        } : undefined,
        approvalRequired: requiresApproval,
        approvalStatus: requiresApproval ? 'pending' : 'approved'
      };

      setMessages(prev => [...prev, agentResponse]);
    }, 800);
  };

  const handleApproveAction = (msgId: string, approved: boolean) => {
    setMessages(prev =>
      prev.map(m =>
        m.id === msgId
          ? { ...m, approvalStatus: approved ? 'approved' : 'rejected' }
          : m
      )
    );
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div className="relative flex flex-col h-[calc(100vh-130px)] max-h-[920px] rounded-3xl glass-surface-elevated border border-white/10 overflow-hidden shadow-2xl" dir="rtl">
      
      {/* 1. Header e Boland va Shishei ba Target Agent Selector va State Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-white/10 glass-surface z-20">
        
        {/* Rast: Entekhabe Eyjente Maghsad (Target Agent) */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-400 shadow-md shadow-cyan-950/50">
            {targetAgentId.includes('win') ? <Laptop className="w-5 h-5 text-purple-400" /> : <Bot className="w-5 h-5 text-cyan-400" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-400">ارسال به ایجنت:</span>
              
              {/* Dropdown e Entekhabe Eyjent */}
              <div className="relative inline-flex items-center">
                <select
                  value={targetAgentId}
                  onChange={(e) => setTargetAgentId(e.target.value)}
                  className="appearance-none pl-8 pr-3 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-white/10 text-white text-xs font-bold cursor-pointer focus:outline-none focus:border-purple-500 transition-colors"
                >
                  {availableAgents.map((ag) => (
                    <option key={ag.id} value={ag.id} className="bg-neutral-950 text-white">
                      {ag.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 pointer-events-none" />
              </div>

              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-950/80 text-purple-300 border border-purple-800">
                {targetAgentId.includes('win') ? 'Windows 11 Companion' : 'Master Cloud Core'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
              <span className="inline-flex items-center gap-1 text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                آنلاین (تاخیر: 14ms)
              </span>
              <span>·</span>
              <span className="font-mono text-neutral-400">توکن کاربر: {INITIAL_USER_PROFILE.pairingToken.substring(0, 16)}...</span>
            </div>
          </div>
        </div>

        {/* Chap: State Switcher (Dual Mode Toggle): Chat vs Autonomous Task */}
        <div className="flex items-center p-1 rounded-2xl bg-neutral-900/90 border border-white/10 text-xs font-semibold shadow-inner">
          <button
            onClick={() => setActiveState('chat')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all duration-300 cursor-pointer ${
              activeState === 'chat'
                ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-md shadow-cyan-950 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>گفتگوی متنی (Chat)</span>
          </button>

          <button
            onClick={() => setActiveState('task')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all duration-300 cursor-pointer ${
              activeState === 'task'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-950 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>وظیفه و فرمان اجرایی (Task)</span>
          </button>
        </div>
      </div>

      {/* 2. Mohavateye Namayeshe Payamha va Logha (Chat & Execution Display Area) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-4xl mx-auto`}
          >
            {/* Sender Name & Timestamp */}
            <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-neutral-400 font-mono">
              <span>{msg.sender === 'user' ? 'شما (مدیر سیستم)' : msg.targetAgentName || 'Omni Agent'}</span>
              <span>·</span>
              <span>{msg.timestamp}</span>
              {msg.targetAgentName && (
                <span className="text-purple-300 bg-purple-950/40 px-1.5 py-0.5 rounded text-[10px] border border-purple-800/60">
                  {msg.sender === 'user' ? `مقصد: ${msg.targetAgentName}` : msg.targetAgentName}
                </span>
              )}
              {msg.modelUsed && (
                <span className="text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded text-[10px] border border-cyan-800/60 hidden sm:inline">
                  {msg.modelUsed}
                </span>
              )}
            </div>

            {/* Bubble e Payam */}
            {msg.sender === 'user' ? (
              <div className="glass-surface-elevated bg-gradient-to-l from-purple-950/40 to-neutral-900 border border-purple-500/30 rounded-2xl rounded-tr-none px-4 py-3 text-xs sm:text-sm text-neutral-100 max-w-2xl leading-relaxed shadow-lg">
                {msg.content}
              </div>
            ) : (
              <div className="w-full glass-surface rounded-2xl rounded-tl-none p-4 sm:p-5 border border-white/10 space-y-4 shadow-xl">
                
                {/* Header e Eyjent ba Telemetry */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-white font-mono">
                      {msg.targetAgentName || 'Agent Execution'}
                    </span>
                  </div>

                  {msg.telemetrySnapshot && (
                    <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-400">
                      <span className="text-cyan-300">CPU: {msg.telemetrySnapshot.cpu}</span>
                      <span className="text-purple-300">RAM: {msg.telemetrySnapshot.ram}</span>
                      {msg.telemetrySnapshot.battery && (
                        <span className="text-emerald-300">باتری: {msg.telemetrySnapshot.battery}</span>
                      )}
                      <span className="text-neutral-500">پینگ: {msg.telemetrySnapshot.latency}</span>
                    </div>
                  )}
                </div>

                {/* Matne asli */}
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                  {msg.content}
                </p>

                {/* Simulated Desktop Screenshot Preview Card */}
                {msg.hasScreenshot && (
                  <div className="p-3 rounded-2xl bg-black/60 border border-purple-500/30 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-purple-300 font-bold flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-purple-400" />
                        <span>تصویر دریافتی از دسکتاپ ویندوز (Desktop Screenshot):</span>
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {msg.screenshotDetails?.resolution || '2560x1440'} · {msg.screenshotDetails?.capturedAt}
                      </span>
                    </div>

                    {/* Screenshot Mockup Display */}
                    <div className="relative w-full h-44 rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#0c0d18] via-[#16172a] to-[#0d0e14] flex flex-col justify-between p-3 select-none">
                      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                          <span className="text-white ml-2">{msg.screenshotDetails?.windowTitle || 'Windows Desktop'}</span>
                        </div>
                        <span className="text-purple-400">Live Buffer</span>
                      </div>

                      <div className="flex items-center justify-center text-center space-y-1">
                        <div>
                          <Laptop className="w-8 h-8 text-purple-400 mx-auto opacity-70 mb-1" />
                          <span className="text-xs font-semibold text-neutral-300 block">
                            تصویر دسکتاپ ویندوز کاربر در بافر امن بارگذاری شد
                          </span>
                          <span className="text-[10px] text-neutral-500 font-mono">
                            SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[9px] font-mono text-neutral-400 border-t border-white/5 pt-1">
                        <span>ابعاد: {msg.screenshotDetails?.resolution}</span>
                        <span className="text-emerald-400">✔ رمزنگاری سرتاسری (E2EE)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reasoning Steps (Tafakkor e Zanjirei) */}
                {msg.reasoningSteps && msg.reasoningSteps.length > 0 && (
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>مراحل استدلال و اجرای ایجنت:</span>
                    </div>
                    <div className="space-y-1 text-[11px] text-neutral-300">
                      {msg.reasoningSteps.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-2 font-mono">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dastoore Ejraee (Executed Command) */}
                {msg.executedCommand && (
                  <div className="rounded-xl overflow-hidden border border-neutral-800 bg-black/70 font-mono text-xs">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-900/90 border-b border-neutral-800 text-[11px] text-neutral-400">
                      <span className="flex items-center gap-1.5 text-purple-400">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Command Execution:</span>
                      </span>
                      <button
                        onClick={() => copyToClipboard(msg.executedCommand!, msg.id)}
                        className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                      >
                        {copiedCodeId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>کپی</span>
                      </button>
                    </div>
                    <div className="p-3 text-purple-300 overflow-x-auto text-[11px]" dir="ltr">
                      $ {msg.executedCommand}
                    </div>
                  </div>
                )}

                {/* Loghaye Terminal */}
                {msg.terminalLogs && msg.terminalLogs.length > 0 && (
                  <div className="p-3 rounded-xl bg-black/60 border border-neutral-800/80 font-mono text-[11px] text-neutral-400 space-y-1" dir="ltr">
                    {msg.terminalLogs.map((log, idx) => (
                      <div key={idx} className="leading-relaxed">
                        <span className="text-neutral-600 mr-2">&gt;</span>
                        <span className={log.includes('SUCCESS') ? 'text-emerald-400 font-bold' : log.includes('WIN-AGENT') ? 'text-purple-300' : 'text-neutral-300'}>
                          {log}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Approval Gate Protocol Banner */}
                {msg.approvalRequired && msg.approvalStatus === 'pending' && (
                  <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-pulse">
                    <div className="flex items-center gap-2.5 text-amber-300">
                      <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
                      <div>
                        <span className="font-bold block">پروتکل امنیتی: تأییدیه کاربر الزامی است (Approval Gate)</span>
                        <span className="text-[11px] text-neutral-400">این دستور در سطح سیستمی ایجنت اجرا می‌شود. آیا تایید می‌کنید؟</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleApproveAction(msg.id, false)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 cursor-pointer"
                      >
                        رد کردن
                      </button>
                      <button
                        onClick={() => handleApproveAction(msg.id, true)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>تأیید و اجرای دستور</span>
                      </button>
                    </div>
                  </div>
                )}

                {msg.approvalStatus === 'approved' && msg.approvalRequired && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                    <ShieldCheck className="w-4 h-4" />
                    <span>تأییدیه امنیتی صادر شد. دستور با موفقیت اعمال گردید.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center gap-2 p-4 glass-surface rounded-2xl max-w-md mx-auto text-xs text-purple-300 animate-pulse">
            <Sparkles className="w-4 h-4 animate-spin text-purple-400" />
            <span>ایجنت در حال استدلال، ارسال دستور به سیستم و دریافت تله‌متری...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Omni-Command Bar: Shenavar dar Markaz-Paeen ba Pill Buttons va Quick Actions */}
      <div className="p-4 sm:p-5 glass-surface border-t border-white/10 z-20 space-y-3">
        
        {/* Quick Action Command Chips tailored baraye Eyjente Entekhab-shode */}
        <div className="max-w-4xl mx-auto flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] text-neutral-400 font-medium ml-1 flex items-center gap-1">
            <Zap className="w-3 h-3 text-purple-400" />
            <span>فرامین سریع ایجنت:</span>
          </span>

          {[
            { label: '📸 اسکرین‌شات دسکتاپ', cmd: 'اسکرین‌شات از دسکتاپ بگیر' },
            { label: '🧹 پاکسازی کش Temp', cmd: 'کش سیستم و فایل‌های Temp ویندوز را پاکسازی کن' },
            { label: '⚡ بهینه‌سازی رم', cmd: 'مصرف رم و پردازش‌های پس‌زمینه را بهینه‌سازی کن' },
            { label: '💻 ترمینال PowerShell', cmd: 'وضعیت پروسس‌های با مصرف بالای سیستم را استخراج کن' },
            { label: '🔔 ارسال Toast Alert', cmd: 'یک نوتیفیکیشن هشدار با عنوان کلاستر در دسکتاپ نمایش بده' },
            { label: '🔒 قفل کردن دسکتاپ', cmd: 'سیستم را قفل کن (Lock Workstation)' }
          ].map((chip, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(chip.cmd)}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-purple-600/30 border border-white/10 text-neutral-300 hover:text-white cursor-pointer transition-all text-[11px]"
            >
              {chip.label}
            </button>
          ))}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="max-w-4xl mx-auto space-y-3">
          
          {/* Pill Buttons: Entekhabe Eyjent, Approval Gate, va Abzarha */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Approval Gate Protocol Toggle Pill */}
              <button
                type="button"
                onClick={() => setApprovalGateEnabled(!approvalGateEnabled)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer border ${
                  approvalGateEnabled
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    : 'bg-neutral-900 border-white/10 text-neutral-400'
                }`}
                title="کنترل اجرای دستورات با تاییدیه کاربر"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>پروتکل تأییدیه (Approval Gate): {approvalGateEnabled ? 'فعال' : 'غیرفعال'}</span>
              </button>

              {/* Active Extension Tool Pill */}
              <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-full border border-white/10 text-[10px]">
                <button
                  type="button"
                  onClick={() => setActiveTool('powershell')}
                  className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                    activeTool === 'powershell' ? 'bg-purple-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  PowerShell RPC
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTool('openrouter')}
                  className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                    activeTool === 'openrouter' ? 'bg-cyan-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  DeepSeek V4
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTool('bash')}
                  className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                    activeTool === 'bash' ? 'bg-cyan-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Bash CLI
                </button>
              </div>
            </div>

            <span className="text-[10px] text-neutral-500 font-mono hidden sm:inline" dir="ltr">
              Target: {currentTargetAgent?.name} · Tunnel Active
            </span>
          </div>

          {/* Input Box e Bozorg e Shishei ba Dokmeye Ersal */}
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={
                activeState === 'task'
                  ? `دستور یا فرمان خود را برای ${currentTargetAgent?.name} بنویسید (مثلاً: "اسکرین‌شات از صفحه بگیر" یا "کش را پاک کن")...`
                  : `پیام خود را برای گفتگوی زنده با ${currentTargetAgent?.name} بنویسید...`
              }
              className="w-full glass-input rounded-2xl py-3.5 pr-4 pl-24 text-xs sm:text-sm text-white placeholder-neutral-500 shadow-xl"
            />

            <button
              type="submit"
              disabled={!inputPrompt.trim() || isProcessing}
              className="absolute left-2 py-2 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-md shadow-purple-950/70 disabled:opacity-40"
            >
              <span>ارسال</span>
              <Send className="w-3.5 h-3.5 rotate-180" />
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
