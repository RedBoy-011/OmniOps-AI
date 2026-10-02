import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Plus,
  Trash2,
  MessageSquare,
  Search,
  Laptop,
  Camera,
  Cpu,
  Activity,
  Battery,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Copy,
  Check,
  RefreshCw,
  LogOut,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Zap,
  Sliders,
  Bell,
  Lock,
  ExternalLink,
  Shield,
  Key,
  X
} from 'lucide-react';
import { INITIAL_USER_PROFILE, INITIAL_CONNECTED_AGENTS, ConnectedAgent } from '../data/agentStore';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  timestamp: string;
  content: string;
  modelUsed?: string;
  isWindowsCommand?: boolean;
  executedCommand?: string;
  terminalLogs?: string[];
  hasScreenshot?: boolean;
  screenshotDetails?: {
    resolution: string;
    capturedAt: string;
  };
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  lastUpdated: string;
  modelId: string;
  modelName: string;
  messages: ChatMessage[];
  connectedToWindowsAgent?: boolean;
}

interface UserPortalProps {
  currentUser: { email: string; role: string };
  onLogout: () => void;
  onSwitchToAdmin?: () => void;
}

export const UserPortal: React.FC<UserPortalProps> = ({
  currentUser,
  onLogout,
  onSwitchToAdmin
}) => {
  // Modelhaye ghabel entekhab baraye karbare ma'mooli
  const availableModels = [
    { id: 'deepseek-v4-flash', name: 'DeepSeek V4 Flash', badge: 'پرچمدار و پرسرعت', provider: 'OpenRouter', latency: '72ms', icon: Sparkles },
    { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', badge: 'استدلال پیشرفته', provider: 'Anthropic', latency: '110ms', icon: Bot },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', badge: 'هوشمند و اقتصادی', provider: 'OpenAI', latency: '95ms', icon: Zap },
    { id: 'llama-3-3-70b', name: 'Llama 3.3 70B', badge: 'متن‌باز و دقیق', provider: 'Meta', latency: '84ms', icon: Cpu },
    { id: 'gemini-2-5-flash', name: 'Gemini 2.5 Flash', badge: 'چندوجهی گوگل', provider: 'Google', latency: '80ms', icon: Activity },
    { id: 'ollama-local', name: 'Local Ollama 3.2', badge: 'پردازش محلی آفلاین', provider: 'Local Node', latency: '15ms', icon: Laptop }
  ];

  // State e Model e Fa'al
  const [selectedModel, setSelectedModel] = useState(availableModels[0]);
  
  // State e Etesal be Eyjente Vayndoziye Karbar
  const [connectToWindowsCompanion, setConnectToWindowsCompanion] = useState(true);
  const [showWindowsDrawer, setShowWindowsDrawer] = useState(false);
  const [userWindowsAgent, setUserWindowsAgent] = useState<ConnectedAgent>(INITIAL_CONNECTED_AGENTS[0]);
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedPsCmd, setCopiedPsCmd] = useState(false);

  // Kalameye jostejooye chat-haye khode karbar
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Storage key ekhtesasi baraye in karbar (Isolation baraye inke faghat chat-haye khodesho bebine)
  const userStorageKey = `omniops_chats_${currentUser.email.replace(/[@.]/g, '_')}`;

  // State e Chat Sessions
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(userStorageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }

    // Clean initial state (Zero-State for GitHub production)
    return [
      {
        id: 'session-initial',
        title: 'گفتگوی نخست',
        createdAt: 'هم‌اکنون',
        lastUpdated: 'هم‌اکنون',
        modelId: 'deepseek-v4-flash',
        modelName: 'DeepSeek V4 Flash',
        connectedToWindowsAgent: true,
        messages: [
          {
            id: 'm-welcome',
            sender: 'agent',
            timestamp: 'هم‌اکنون',
            content: 'درود! به کلاستر هوش مصنوعی OmniOps خوش آمدید. من آماده پاسخ به پرسش‌های شما، تحلیل کد، نگارش اسکریپت یا ارسال فرامین به همیار ویندوز شما هستم. پیام یا دستور خود را بنویسید.'
          }
        ]
      }
    ];
  });

  // Session e fa'al
  const [activeSessionId, setActiveSessionId] = useState<string>(sessions[0]?.id || '');
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  // Input e matne payam
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedCmdId, setCopiedCmdId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Zakhireye chathaye in karbar dar localStorage be soorate khodkar
  useEffect(() => {
    try {
      localStorage.setItem(userStorageKey, JSON.stringify(sessions));
    } catch (e) {
      console.error(e);
    }
  }, [sessions, userStorageKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isTyping]);

  // Sakhtane chate jadid
  const handleCreateNewChat = () => {
    const newSession: ChatSession = {
      id: 'session-' + Date.now(),
      title: 'گفتگوی تازه ' + (sessions.length + 1),
      createdAt: 'هم‌اکنون',
      lastUpdated: 'هم‌اکنون',
      modelId: selectedModel.id,
      modelName: selectedModel.name,
      connectedToWindowsAgent: connectToWindowsCompanion,
      messages: [
        {
          id: 'welcome-' + Date.now(),
          sender: 'agent',
          timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
          content: `درود! من دستیار هوشمند شما با مدل ${selectedModel.name} هستم. آماده‌ام به سوالات شما پاسخ دهم یا دستورات شما را به همیار ویندوز شخصی‌تان ارسال کنم.`,
          modelUsed: selectedModel.name
        }
      ]
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  // Hazfe yek chat
  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      alert('حداقل یک گفتگوی فعال باید در لیست چت‌های شما باقی بماند.');
      return;
    }
    const updated = sessions.filter(s => s.id !== sessionId);
    setSessions(updated);
    if (activeSessionId === sessionId) {
      setActiveSessionId(updated[0].id);
    }
  };

  // Ersale payame jadid
  const handleSendMessage = (textOverride?: string) => {
    const text = textOverride || inputText.trim();
    if (!text || isTyping || !activeSession) return;

    if (!textOverride) setInputText('');

    const timeNow = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      timestamp: timeNow,
      content: text
    };

    // Update session ba payame karbar
    setSessions(prev =>
      prev.map(s => {
        if (s.id === activeSession.id) {
          // Agar chate jadid ast, onvan ra bar asas e payam taghir bede
          const newTitle = s.messages.length <= 1 ? (text.length > 28 ? text.slice(0, 28) + '...' : text) : s.title;
          return {
            ...s,
            title: newTitle,
            lastUpdated: 'هم‌اکنون',
            messages: [...s.messages, userMsg]
          };
        }
        return s;
      })
    );

    setIsTyping(true);

    // Pasokh az model e entekhab-shode ya Eyjente Vayndoz
    setTimeout(() => {
      setIsTyping(false);

      const isScreenshot = text.includes('اسکرین‌شات') || text.includes('عکس');
      const isCleanup = text.includes('کش') || text.includes('پاکسازی') || text.includes('temp');
      const isRamOpt = text.includes('رم') || text.includes('بهینه‌سازی');
      const isNotification = text.includes('نوتیفیکیشن') || text.includes('پیام');
      const isLock = text.includes('قفل');

      let replyContent = '';
      let executedCmd = '';
      let logs: string[] = [];

      if (connectToWindowsCompanion && (isScreenshot || isCleanup || isRamOpt || isNotification || isLock || text.includes('ویندوز') || text.includes('دستور'))) {
        if (isScreenshot) {
          replyContent = '📸 اسکرین‌شات با موفقیت توسط همیار دسکتاپ ویندوز شخصی شما ثبت شد و در بافر گفتگو نمایش داده می‌شود:';
          executedCmd = 'powershell.exe -Command "[OmniOps.WindowsCompanion]::CaptureScreen()"';
          logs = [
            `[WIN-AGENT] Connected device: ${userWindowsAgent.name}`,
            `[AUTHENTICATED] Token: ${INITIAL_USER_PROFILE.pairingToken.substring(0, 15)}...`,
            `[CAPTURE] Desktop primary display (2560x1440) captured in 38ms`,
            `[STATUS] Image payload received successfully`
          ];
        } else if (isCleanup) {
          replyContent = '🧹 فایل‌های موقت Temp ویندوز و کش سیستم شما پاکسازی شدند. ۱.۴ گیگابایت حافظه آزاد شد.';
          executedCmd = 'powershell.exe -Command "Clear-Content -Path $env:TEMP\\* -Force -Recurse"';
          logs = [
            '[WIN-AGENT] Cleaned 850 temp files from %TEMP%',
            '[WIN-AGENT] DNS cache cleared successfully',
            '[STATUS] Exit code: 0'
          ];
        } else if (isRamOpt) {
          replyContent = '⚡ پردازش‌های سنگین سیستم تحلیل شدند و حافظه پس‌زمینه بهینه‌سازی شد. مصرف رم به ۱۵٪ کاهش یافت.';
          executedCmd = 'powershell.exe -Command "Get-Process | Sort-Object WS -Descending | Select-Object -First 5"';
          logs = [
            '[PROCESS] Process list updated',
            '[MEMORY] Working set trimmed',
            '[RESULT] Free memory increased by 1.8 GB'
          ];
        } else if (isNotification) {
          replyContent = '🔔 نوتیفیکیشن با عنوان پیامی از پنل در گوشه صفحه دسکتاپ ویندوز شما نمایش داده شد.';
          executedCmd = 'powershell.exe -Command "Show-ToastNotification -Title \'OmniOps Alert\' -Message \'' + text + '\'"';
          logs = ['[TOAST] Windows notification delivered to Action Center'];
        } else {
          replyContent = `دستور با موفقیت توسط مدل ${selectedModel.name} تحلیل شد و به همیار ویندوز شما ارسال گردید. تمام سرویس‌های دسکتاپ آنلاین هستند.`;
          executedCmd = `powershell.exe -Command "${text.replace(/"/g, '')}"`;
          logs = ['[WIN-AGENT] Executed with user privileges', '[STATUS] Done'];
        }
      } else {
        // Pasokhe mamooli az Model e hoosh e masnooee
        replyContent = `این پاسخ توسط مدل ${selectedModel.name} تولید شده است: درخواست شما با دقت بررسی گردید. شما به عنوان کاربر معمولی می‌توانید سوالات علمی، کدنویسی، تحلیل داده و وظایف اداری خود را به راحتی از مدل‌های پیشرفته کلاستر بخواهید.`;
      }

      const agentMsg: ChatMessage = {
        id: 'agent-' + Date.now(),
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        content: replyContent,
        modelUsed: selectedModel.name,
        isWindowsCommand: connectToWindowsCompanion,
        executedCommand: executedCmd || undefined,
        terminalLogs: logs.length > 0 ? logs : undefined,
        hasScreenshot: isScreenshot && connectToWindowsCompanion,
        screenshotDetails: isScreenshot ? {
          resolution: '2560x1440',
          capturedAt: new Date().toLocaleTimeString('fa-IR')
        } : undefined
      };

      setSessions(prev =>
        prev.map(s => {
          if (s.id === activeSession.id) {
            return {
              ...s,
              messages: [...s.messages, agentMsg]
            };
          }
          return s;
        })
      );
    }, 700);
  };

  const copyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmdId(id);
    setTimeout(() => setCopiedCmdId(null), 2000);
  };

  const copyUserToken = () => {
    navigator.clipboard.writeText(INITIAL_USER_PROFILE.pairingToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const userPsOneLiner = `irm https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/windows-agent/install-agent.ps1 | iex -Token "${INITIAL_USER_PROFILE.pairingToken}" -User "${currentUser.email}"`;

  const copyPsCommand = () => {
    navigator.clipboard.writeText(userPsOneLiner);
    setCopiedPsCmd(true);
    setTimeout(() => setCopiedPsCmd(false), 2000);
  };

  // Filter kardane chat-haye khode in karbar bar asas e jostejooye search
  const filteredSessions = sessions.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-100 flex flex-col relative overflow-hidden" dir="rtl">
      
      {/* Pas-zamineye noorani ba Haloohaye Glassmorphism */}
      <div className="fixed top-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-600/10 blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none" />

      {/* 1. Header e Boland e Karbare Ma'mooli (User Portal Header) */}
      <header className="sticky top-0 z-30 glass-surface border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between backdrop-blur-2xl">
        
        {/* Rast: Logo, Onvane Portal e Karbar va Neshan e Role */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-400 shadow-md shadow-cyan-950/40">
            <Bot className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">درگاه کاربر هوش مصنوعی (User AI Portal)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800">
                حالت کاربر استاندارد
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              کاربر: <span className="text-neutral-200 font-mono">{currentUser.email}</span> · فقط دسترسی به چت، مدل‌ها و ایجنت ویندوز خودتان
            </p>
          </div>
        </div>

        {/* Chap: Etesal be Vayndoz, va Dokmeye Khorooj */}
        <div className="flex items-center gap-2.5">

          {/* Toggle e Panle Eyjente Vayndoz */}
          <button
            onClick={() => setShowWindowsDrawer(!showWindowsDrawer)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
              showWindowsDrawer
                ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-950/60'
                : 'bg-purple-950/40 border-purple-800/60 text-purple-300 hover:bg-purple-900/50'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">همیار ویندوز شخصی</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          {/* Switch be Mode e Admin baraye Test / Demo */}
          {onSwitchToAdmin && (
            <button
              onClick={onSwitchToAdmin}
              className="px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-neutral-300 hover:text-white text-xs cursor-pointer transition-colors"
              title="سوییچ به حالت ادمین با دسترسی کامل به تنظیمات کلاستر"
            >
              <span>سوییچ به پنل ادمین</span>
            </button>
          )}

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-red-300 hover:text-red-200 border border-red-800/50 transition-colors cursor-pointer"
            title="خروج از حساب"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </header>

      {/* 2. Badaneye Asli: Sidebar e Chat-haye Khode Karbar + Panle Chat va Entekhabe Model */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Sidebar e Chat-haye Khosousiye Khode Karbar (Private Chat History Drawer) */}
        <aside
          className={`glass-surface-elevated border-l border-white/10 flex flex-col justify-between transition-all duration-300 z-20 ${
            sidebarOpen ? 'w-72 sm:w-80' : 'w-0 overflow-hidden border-none'
          }`}
        >
          <div className="p-3.5 space-y-3 flex-1 overflow-hidden flex flex-col">
            
            {/* Header e Sidebar ba Dokmeye Chate Jadid */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>گفتگوهای شخصی شما</span>
              </span>

              <button
                onClick={handleCreateNewChat}
                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-md shadow-cyan-950/50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>چت جدید</span>
              </button>
            </div>

            {/* Jostejooye Chat-ha */}
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در گفتگوهای شما..."
                className="w-full bg-black/50 border border-white/10 rounded-xl py-1.5 pr-8 pl-3 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 pointer-events-none" />
            </div>

            {/* Fehrest e Chat-haye Karbar */}
            <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin pr-0.5">
              {filteredSessions.length === 0 ? (
                <div className="text-center py-8 text-neutral-500 text-xs">
                  گفتگویی با این عنوان یافت نشد.
                </div>
              ) : (
                filteredSessions.map((session) => {
                  const isActive = session.id === activeSession?.id;
                  return (
                    <div
                      key={session.id}
                      onClick={() => setActiveSessionId(session.id)}
                      className={`group p-2.5 rounded-xl transition-all cursor-pointer border flex items-center justify-between gap-2 ${
                        isActive
                          ? 'bg-cyan-950/50 border-cyan-500/40 text-white shadow-sm'
                          : 'bg-black/20 border-transparent hover:bg-white/5 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      <div className="space-y-0.5 truncate flex-1">
                        <div className="flex items-center gap-1.5 text-xs font-medium truncate">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-cyan-400' : 'bg-neutral-600'}`} />
                          <span className="truncate">{session.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-mono">
                          <span>{session.createdAt}</span>
                          <span>·</span>
                          <span className="text-neutral-400 truncate">{session.modelName}</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleDeleteSession(session.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-all text-neutral-500 cursor-pointer"
                        title="حذف این گفتگو"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* Footer e Sidebar: Etebaryabiye Etehadiye Karbar */}
          <div className="p-3 bg-black/40 border-t border-white/5 text-[11px] text-neutral-400 space-y-1">
            <div className="flex items-center justify-between">
              <span>تاریخچه محرمانه:</span>
              <span className="text-emerald-400 font-mono">ایزوله در فضای شما</span>
            </div>
            <div className="text-[10px] text-neutral-500 truncate font-mono">
              Token: {INITIAL_USER_PROFILE.pairingToken.substring(0, 18)}...
            </div>
          </div>
        </aside>

        {/* 3. Mohavateye Chate Asli (Main Chat Conversation Workspace) */}
        <main className="flex-1 flex flex-col justify-between overflow-hidden relative">
          
          {/* Header e Chat: Entekhabe Model va Toggle Sidebar */}
          <div className="p-3 sm:p-4 glass-surface border-b border-white/10 flex flex-wrap items-center justify-between gap-3 z-10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 rounded-xl bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white cursor-pointer"
                title={sidebarOpen ? 'بستن منوی چت‌ها' : 'نمایش چت‌های شما'}
              >
                {sidebarOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>

              {/* Selector e Model e Hoosh e Masnooee */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 font-medium hidden sm:inline">انتخاب مدل:</span>
                <div className="relative inline-flex items-center">
                  <select
                    value={selectedModel.id}
                    onChange={(e) => {
                      const found = availableModels.find(m => m.id === e.target.value);
                      if (found) setSelectedModel(found);
                    }}
                    className="appearance-none pl-8 pr-3 py-1.5 rounded-xl bg-neutral-900 border border-white/10 text-xs font-bold text-cyan-300 cursor-pointer focus:outline-none focus:border-cyan-500"
                  >
                    {availableModels.map((model) => (
                      <option key={model.id} value={model.id} className="bg-neutral-950 text-white">
                        {model.name} ({model.badge})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 pointer-events-none" />
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-800 hidden sm:inline">
                  {selectedModel.latency} latency
                </span>
              </div>
            </div>

            {/* Toggle e Etesal be Eyjente Vayndoz dar in Chat */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setConnectToWindowsCompanion(!connectToWindowsCompanion)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer border ${
                  connectToWindowsCompanion
                    ? 'bg-purple-950/60 border-purple-500/50 text-purple-300'
                    : 'bg-neutral-900 border-white/10 text-neutral-400'
                }`}
                title="اتصال این گفتگو به همیار ویندوز سیستم شما"
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>اتصال همیار ویندوز: {connectToWindowsCompanion ? 'فعال' : 'غیرفعال'}</span>
              </button>
            </div>
          </div>

          {/* Message Stream Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin">
            {activeSession?.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-3xl mx-auto`}
              >
                <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-neutral-400 font-mono">
                  <span>{msg.sender === 'user' ? 'شما' : `${msg.modelUsed || selectedModel.name}`}</span>
                  <span>·</span>
                  <span>{msg.timestamp}</span>
                </div>

                {msg.sender === 'user' ? (
                  <div className="glass-surface-elevated bg-gradient-to-l from-cyan-950/50 to-neutral-900 border border-cyan-500/30 rounded-2xl rounded-tr-none px-4 py-3 text-xs sm:text-sm text-neutral-100 max-w-xl leading-relaxed shadow-lg">
                    {msg.content}
                  </div>
                ) : (
                  <div className="w-full glass-surface rounded-2xl rounded-tl-none p-4 sm:p-5 border border-white/10 space-y-3 shadow-xl">
                    <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                      {msg.content}
                    </p>

                    {/* Screenshot Card agar vojood dashte bashe */}
                    {msg.hasScreenshot && (
                      <div className="p-3 rounded-2xl bg-black/60 border border-purple-500/30 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-purple-300 font-bold flex items-center gap-1.5">
                            <Camera className="w-4 h-4 text-purple-400" />
                            <span>تصویر زنده از صفحه دسکتاپ ویندوز شما:</span>
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400">
                            {msg.screenshotDetails?.resolution} · {msg.screenshotDetails?.capturedAt}
                          </span>
                        </div>

                        <div className="h-36 w-full rounded-xl bg-gradient-to-tr from-purple-950/50 via-neutral-900 to-black border border-white/10 flex items-center justify-center text-center p-3 select-none">
                          <div>
                            <Laptop className="w-6 h-6 text-purple-400 mx-auto mb-1 opacity-80" />
                            <span className="text-xs text-neutral-300 font-semibold block">
                              اسکرین‌شات دسکتاپ ویندوز شما با موفقیت در این چت دریافت شد
                            </span>
                            <span className="text-[10px] text-emerald-400 font-mono">
                              ✔ رمزنگاری سرتاسری اختصاصی حساب کاربری شما
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Dastoore Ejraee dar terminal */}
                    {msg.executedCommand && (
                      <div className="rounded-xl overflow-hidden border border-neutral-800 bg-black/70 font-mono text-xs">
                        <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-900 border-b border-neutral-800 text-[11px] text-neutral-400">
                          <span className="text-purple-400 flex items-center gap-1.5">
                            <Terminal className="w-3.5 h-3.5" />
                            <span>PowerShell Execution:</span>
                          </span>
                          <button
                            onClick={() => copyCode(msg.executedCommand!, msg.id)}
                            className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                          >
                            {copiedCmdId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>کپی دستور</span>
                          </button>
                        </div>
                        <div className="p-3 text-purple-300 overflow-x-auto text-[11px]" dir="ltr">
                          $ {msg.executedCommand}
                        </div>
                      </div>
                    )}

                    {/* Terminal Logs */}
                    {msg.terminalLogs && msg.terminalLogs.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-black/60 border border-neutral-800 font-mono text-[11px] text-neutral-400 space-y-1" dir="ltr">
                        {msg.terminalLogs.map((log, i) => (
                          <div key={i} className="leading-relaxed">
                            <span className="text-cyan-400 mr-2">&gt;</span>
                            <span>{log}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 p-3 glass-surface rounded-2xl max-w-sm mx-auto text-xs text-cyan-300 animate-pulse">
                <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
                <span>مدل {selectedModel.name} در حال تولید پاسخ و پردازش...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips baraye karbar */}
          <div className="p-3 glass-surface border-t border-white/10 z-10 space-y-3">
            <div className="max-w-3xl mx-auto flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] text-neutral-400 font-medium ml-1">پیشنهادات سریع:</span>
              {[
                { label: '📸 اسکرین‌شات دسکتاپ', cmd: 'اسکرین‌شات از دسکتاپ من بگیر' },
                { label: '🧹 پاکسازی کش Temp', cmd: 'کش سیستم و فایل‌های Temp ویندوز را پاکسازی کن' },
                { label: '⚡ وضعیت حافظه رم', cmd: 'چقدر رم خالی در سیستم ویندوزی من وجود دارد؟' },
                { label: '🔔 ارسال تست نوتیفیکیشن', cmd: 'یک نوتیفیکیشن تست در دسکتاپ من نمایش بده' },
                { label: '💻 اسکریپت پاورشل', cmd: 'یک اسکریپت پاورشل برای دریافت آی‌پی سیستم بنویس' }
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip.cmd)}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-cyan-600/30 border border-white/10 text-neutral-300 hover:text-white cursor-pointer transition-all text-[11px]"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="max-w-3xl mx-auto relative flex items-center"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`پیام یا دستور خود را بنویسید (مدل فعال: ${selectedModel.name})...`}
                className="w-full glass-input rounded-2xl py-3 pr-4 pl-24 text-xs sm:text-sm text-white placeholder-neutral-500 shadow-xl"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="absolute left-2 py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-cyan-950/70 disabled:opacity-40"
              >
                <span>ارسال</span>
                <Send className="w-3.5 h-3.5 rotate-180" />
              </button>
            </form>
          </div>

        </main>

        {/* 4. Drawer e Ekhtesasiye Eyjente Vayndoz e Karbar (User's Windows Companion Drawer) */}
        {showWindowsDrawer && (
          <div className="w-80 sm:w-96 glass-surface-elevated border-r border-white/10 p-5 space-y-5 overflow-y-auto z-30 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Laptop className="w-5 h-5 text-purple-400" />
                <h3 className="text-xs font-bold text-white">همیار دسکتاپ ویندوز شخصی شما</h3>
              </div>
              <button
                onClick={() => setShowWindowsDrawer(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status e Dastgah */}
            <div className="p-4 rounded-2xl bg-black/50 border border-purple-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">{userWindowsAgent.name}</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center font-mono text-[11px]">
                <div className="p-2 rounded-xl bg-white/5">
                  <span className="text-[9px] text-neutral-500 block">CPU:</span>
                  <span className="text-cyan-300 font-bold">{userWindowsAgent.cpu}</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5">
                  <span className="text-[9px] text-neutral-500 block">RAM:</span>
                  <span className="text-purple-300 font-bold">{userWindowsAgent.ram}</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5">
                  <span className="text-[9px] text-neutral-500 block">باتری:</span>
                  <span className="text-emerald-300 font-bold">{userWindowsAgent.battery || '100%'}</span>
                </div>
              </div>
            </div>

            {/* Token e Ekhtesasiye in Karbar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-purple-400" />
                  <span>توکن جفت‌سازی شما:</span>
                </span>
                <button
                  onClick={copyUserToken}
                  className="text-purple-300 hover:text-white text-[11px] cursor-pointer"
                >
                  {copiedToken ? 'کپی شد' : 'کپی توکن'}
                </button>
              </div>
              <div className="p-2 bg-neutral-950 border border-neutral-800 rounded-xl text-purple-300 font-mono text-[11px] truncate select-all" dir="ltr">
                {INITIAL_USER_PROFILE.pairingToken}
              </div>
            </div>

            {/* Dastoore PowerShell Nasb dar System e Karbar */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-white block">دستور نصب تک‌خطی در کامپیوتر شخصی:</span>
              <div className="p-3 bg-neutral-950 border border-purple-900/40 rounded-xl text-[11px] font-mono text-purple-200 select-all leading-relaxed" dir="ltr">
                {userPsOneLiner}
              </div>
              <button
                onClick={copyPsCommand}
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-purple-950/60"
              >
                {copiedPsCmd ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPsCmd ? 'کپی شد!' : 'کپی دستور اتصال PowerShell'}</span>
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-800/40 text-[11px] text-neutral-300 leading-relaxed">
              💡 با اجرای این دستور در کامپیوتر ویندوزی خود، آیکون همیار در کنار ساعت سیستم شما ظاهر می‌شود و دستوراتی که در چت می‌نویسید مستقیماً روی کامپیوتر شما اجرا می‌گردد.
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
