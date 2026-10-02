import React, { useState } from 'react';
import {
  Layers,
  Search,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Sparkles,
  Cpu,
  Chrome,
  Github,
  Globe,
  Database,
  Terminal,
  Shield,
  Activity,
  Zap,
  Play,
  RotateCcw,
  Wand2,
  Plus,
  X,
  Code2,
  FileCode,
  Copy,
  Check,
  RefreshCw,
  Bot,
  Sliders,
  Radio,
  ArrowRight
} from 'lucide-react';

export interface MCPExtension {
  id: string;
  name: string;
  identifier: string;
  category: 'automation' | 'devtools' | 'database' | 'network' | 'ai';
  description: string;
  icon: any;
  enabled: boolean;
  version: string;
  downloads: string;
  author: string;
  protocol: 'STDIO' | 'SSE' | 'WebSocket';
  toolsProvided: string[];
  isAiGenerated?: boolean;
}

export const MCPMarketplace: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testNotification, setTestNotification] = useState<string | null>(null);

  // Statehaye marboot be Modal e Sakhte Maharat ba Hoosh e Masnooee (AI Skill Creator)
  const [showAiModal, setShowAiModal] = useState(false);
  const [modalMode, setModalMode] = useState<'ai' | 'manual'>('ai');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSteps, setGenerationSteps] = useState<string[]>([]);
  const [generatedSkill, setGeneratedSkill] = useState<{
    name: string;
    identifier: string;
    category: 'automation' | 'devtools' | 'database' | 'network' | 'ai';
    description: string;
    protocol: 'STDIO' | 'SSE' | 'WebSocket';
    toolsProvided: string[];
    pythonCode: string;
    jsonConfig: string;
  } | null>(null);

  const [activeCodeTab, setActiveCodeTab] = useState<'python' | 'json'>('python');
  const [copiedCode, setCopiedCode] = useState(false);

  // Statehaye Form e Dasti (Manual Entry)
  const [manualName, setManualName] = useState('');
  const [manualIdentifier, setManualIdentifier] = useState('');
  const [manualCategory, setManualCategory] = useState<'automation' | 'devtools' | 'database' | 'network' | 'ai'>('devtools');
  const [manualDescription, setManualDescription] = useState('');
  const [manualTools, setManualTools] = useState('');
  const [manualProtocol, setManualProtocol] = useState<'STDIO' | 'SSE' | 'WebSocket'>('STDIO');

  // List e kamele afzoonehaye MCP ba status e fa'al/gheire-fa'al
  const [extensions, setExtensions] = useState<MCPExtension[]>([
    {
      id: 'chrome-devtools',
      name: 'Chrome DevTools MCP',
      identifier: '@modelcontextprotocol/server-chrome-devtools',
      category: 'automation',
      description: 'اتصال مستقیم به مرورگر کروم، ضبط اسکرین‌شات، استخراج داده‌های DOM و تحلیل لاگ‌های کنسول وب.',
      icon: Chrome,
      enabled: true,
      version: 'v1.4.2',
      downloads: '18.4K',
      author: 'Official Google / Chrome Team',
      protocol: 'WebSocket',
      toolsProvided: ['capture_screenshot', 'inspect_dom', 'evaluate_js', 'network_monitor']
    },
    {
      id: 'github-mcp',
      name: 'GitHub Enterprise MCP',
      identifier: '@modelcontextprotocol/server-github',
      category: 'devtools',
      description: 'مدیریت مخازن گیت، ایجاد Issue، ادغام Pull Request و خودکارسازی پایپ‌لاین‌های CI/CD گیت‌هاب.',
      icon: Github,
      enabled: true,
      version: 'v2.1.0',
      downloads: '32.1K',
      author: 'GitHub Inc.',
      protocol: 'STDIO',
      toolsProvided: ['create_issue', 'merge_pull_request', 'read_repository_file', 'dispatch_workflow']
    },
    {
      id: 'playwright-mcp',
      name: 'Playwright Browser Automation',
      identifier: '@automata/mcp-playwright-headless',
      category: 'automation',
      description: 'تست تعاملی وب و کنترل کامل ربات‌های مرورگر با پشتیبانی از چند تب، کلیک، تایپ و فرم‌ها.',
      icon: Globe,
      enabled: true,
      version: 'v1.1.8',
      downloads: '14.9K',
      author: 'Microsoft Automation Community',
      protocol: 'WebSocket',
      toolsProvided: ['navigate_page', 'click_element', 'fill_input', 'wait_for_selector']
    },
    {
      id: 'postgres-mcp',
      name: 'PostgreSQL & Drizzle Inspector',
      identifier: '@omniops/mcp-postgres-driver',
      category: 'database',
      description: 'اتصال به دیتابیس رابطه‌ای، اجرای کوئری‌های بهینه DQL، آنالیز ایندکس‌ها و مایگریشن خودکار.',
      icon: Database,
      enabled: true,
      version: 'v3.0.1',
      downloads: '21.5K',
      author: 'OmniOps Database Team',
      protocol: 'STDIO',
      toolsProvided: ['execute_sql', 'get_table_schema', 'explain_query_plan', 'run_migration']
    },
    {
      id: 'socks5-mcp',
      name: 'SOCKS5 Anti-Sanction Tunnel',
      identifier: '@omniops/mcp-socks-proxy',
      category: 'network',
      description: 'تونل هوشمند ساکس‌پراکسی و ریورس‌پراکسی برای عبور مطمئن از تحریم‌های ارائه‌دهندگان هوش مصنوعی.',
      icon: Shield,
      enabled: true,
      version: 'v2.3.0',
      downloads: '45.2K',
      author: 'OmniOps Infra Core',
      protocol: 'SSE',
      toolsProvided: ['set_proxy_route', 'ping_upstream', 'bypass_domain_filter', 'rotate_ip']
    },
    {
      id: 'docker-mcp',
      name: 'Docker & Podman Engine MCP',
      identifier: '@omniops/server-docker-engine',
      category: 'devtools',
      description: 'مدیریت و پایش کانتینرهای فعال، استخراج لاگ‌ها، چرخه حیات ایمیج‌ها و کلاستر Docker Swarm.',
      icon: Terminal,
      enabled: true,
      version: 'v2.0.4',
      downloads: '28.9K',
      author: 'Cloud Native Foundation',
      protocol: 'STDIO',
      toolsProvided: ['list_containers', 'restart_service', 'fetch_logs', 'deploy_compose']
    },
    {
      id: 'brave-search-mcp',
      name: 'Brave Live Web Search',
      identifier: '@modelcontextprotocol/server-brave-search',
      category: 'ai',
      description: 'جستجوی زنده وب، اخبار تکنولوژی و مقالات علمی بدون ردگیری، برای آگاهی زنده ایجنت از تغییرات جهان.',
      icon: Zap,
      enabled: false,
      version: 'v1.0.5',
      downloads: '16.7K',
      author: 'Brave Software',
      protocol: 'STDIO',
      toolsProvided: ['web_search', 'local_news_search', 'fetch_url_content']
    },
    {
      id: 'filesystem-mcp',
      name: 'Secure Filesystem Sandbox',
      identifier: '@modelcontextprotocol/server-filesystem',
      category: 'devtools',
      description: 'دسترسی امن و ساندباکس‌شده به دایرکتوری‌های پروژه برای خواندن و ویرایش کدهای منبع.',
      icon: Cpu,
      enabled: true,
      version: 'v1.3.0',
      downloads: '39.8K',
      author: 'Anthropic MPC Spec',
      protocol: 'STDIO',
      toolsProvided: ['read_file', 'edit_file', 'list_directory', 'move_file']
    }
  ]);

  // Algoohaye Pishfarz e Hooshmand baraye Sakhte Maharat (AI Prompt Presets)
  const aiPresets = [
    {
      title: '📈 مانیتورینگ قیمت کریپتو و تتر',
      prompt: 'یک مهارت برای استخراج لحظه‌ای نرخ ارزهای دیجیتال، تتر و شاخص‌های مالی با ابزارهای get_crypto_price و calculate_pnl'
    },
    {
      title: '🛡️ نگهبان فایروال و امنیت سرور',
      prompt: 'مهارت نظارت امنیتی بر لاگین‌های SSH لینوکس، تحلیل ترافیک با fail2ban و دستورات مسدودسازی آی‌پی با ufw'
    },
    {
      title: '💬 ربات ارسال نوتیفیکیشن تلگرام',
      prompt: 'یک مهارت برای ارسال هشدارهای فوری کلاستر، اعلان‌های اتمام تسک به کانال یا گروه تلگرام از طریق وبهوک'
    },
    {
      title: '☁️ پشتیبان‌گیری خودکار دیتابیس در S3',
      prompt: 'مهارت اتوماسیون بک‌آپ دوره‌ای پستگرس و ردیس، فشرده‌سازی با zstd و ارسال رمزگذاری‌شده به باکت ابری S3 / MinIO'
    },
    {
      title: '🧠 کد ریویر و تحلیل ریپو با DeepSeek',
      prompt: 'مهارت تحلیل خودکار کدهای گیت‌هاب، جستجوی باگ‌های امنیتی و پیشنهاد بازنویسی کدهای پایتون و تایپ‌اسکریپت'
    }
  ];

  // Tabe Tolide Maharat ba Hoosh e Masnooee (AI Generation Simulation)
  const handleGenerateSkillWithAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setGenerationSteps([]);
    setGeneratedSkill(null);

    const steps = [
      'تحلیل پرامپت ورودی توسط مدل DeepSeek V4 Flash در OpenRouter...',
      'طراحی ساختار ابزارهای اجرایی و تعریف متدهای JSON Schema...',
      'تولید کدهای سازگار با استاندارد رسمی Model Context Protocol (v2024-11)...',
      'ایمن‌سازی ساندباکس اجرای ابزار در بستر Hermes Agent...',
      '✔ مهارت با موفقیت تولید شد و آماده استقرار در کلاستر است.'
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setGenerationSteps(prev => [...prev, step]);

        if (idx === steps.length - 1) {
          setIsGenerating(false);

          // Tashkhise dast-bandi va nam bar asase matn
          const isCrypto = aiPrompt.includes('کریپتو') || aiPrompt.includes('قیمت') || aiPrompt.includes('price');
          const isSecurity = aiPrompt.includes('امنیت') || aiPrompt.includes('فایروال') || aiPrompt.includes('ssh');
          const isNotify = aiPrompt.includes('تلگرام') || aiPrompt.includes('پیام') || aiPrompt.includes('telegram');

          let name = 'ابزار هوشمند توسعه‌یافته با AI';
          let identifier = '@omniops/skill-custom-engine';
          let category: 'automation' | 'devtools' | 'database' | 'network' | 'ai' = 'ai';
          let tools = ['execute_custom_logic', 'fetch_data', 'notify_status'];

          if (isCrypto) {
            name = 'دیده‌بان بازارهای مالی و کریپتو (Crypto Ticker)';
            identifier = '@omniops/skill-crypto-live-ticker';
            category = 'automation';
            tools = ['get_token_price', 'fetch_market_depth', 'calculate_pnl', 'stream_ticker'];
          } else if (isSecurity) {
            name = 'محافظ امنیتی کلاستر (SSH & UFW Sentinel)';
            identifier = '@omniops/skill-security-sentinel';
            category = 'network';
            tools = ['inspect_auth_logs', 'block_attacker_ip', 'check_firewall_rules', 'trigger_alert'];
          } else if (isNotify) {
            name = 'ارسال‌کننده اعلان تلگرام (Telegram Dispatcher)';
            identifier = '@omniops/skill-telegram-notifier';
            category = 'devtools';
            tools = ['send_telegram_message', 'send_cluster_alert', 'upload_log_document'];
          }

          const pyCode = `# ==============================================================================
# OmniOps AI - Auto-Generated MCP Server
# Protocol: Model Context Protocol (MCP) Python SDK
# Generated for: ${name}
# ==============================================================================
import asyncio
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("${name}")

@mcp.tool()
async def ${tools[0]}(target: str = "default") -> str:
    """اجرای عملیات اصلی مربوط به ${name}"""
    # In tabe be soorate khodkar dar sandboxy Hermes ejra mishavad
    return f"عملیات با موفقیت روی {target} توسط مدل DeepSeek V4 Flash اجرا شد."

@mcp.tool()
async def ${tools[1]}(query: str = "") -> dict:
    """استخراج اطلاعات و تحلیل داده‌ها"""
    return {"status": "success", "result": f"داده‌های پردازش‌شده برای: {query}"}

if __name__ == "__main__":
    mcp.run(transport="stdio")
`;

          const jsonCfg = JSON.stringify(
            {
              mcpServers: {
                [identifier]: {
                  command: "python3",
                  args: ["-m", identifier.replace("@", "").replace("/", ".")],
                  env: {
                    OMNIOPS_CLUSTER_NODE: "master-01",
                    AI_ROUTER_FALLBACK: "deepseek/deepseek-v4-flash"
                  }
                }
              }
            },
            null,
            2
          );

          setGeneratedSkill({
            name,
            identifier,
            category,
            description: aiPrompt.slice(0, 140) + '...',
            protocol: 'STDIO',
            toolsProvided: tools,
            pythonCode: pyCode,
            jsonConfig: jsonCfg
          });
        }
      }, (idx + 1) * 350);
    });
  };

  // Tabe Sabt va Nasbe Maharat e Tolidi dar Klastar
  const handleInstallGeneratedSkill = () => {
    if (!generatedSkill) return;

    const newExt: MCPExtension = {
      id: 'ai-skill-' + Date.now(),
      name: generatedSkill.name,
      identifier: generatedSkill.identifier,
      category: generatedSkill.category,
      description: generatedSkill.description,
      icon: Bot,
      enabled: true,
      version: 'v1.0.0 (AI)',
      downloads: '1 (Local)',
      author: 'OmniOps AI Smart Generator',
      protocol: generatedSkill.protocol,
      toolsProvided: generatedSkill.toolsProvided,
      isAiGenerated: true
    };

    setExtensions(prev => [newExt, ...prev]);
    setShowAiModal(false);
    setGeneratedSkill(null);
    setAiPrompt('');
    setTestNotification(`مهارت جدید "${newExt.name}" با موفقیت نصب و به کلاستر Hermes متصل شد!`);
    setTimeout(() => setTestNotification(null), 4500);
  };

  // Sabte Maharat e Dasti
  const handleSaveManualSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualIdentifier.trim()) return;

    const toolsList = manualTools.trim()
      ? manualTools.split(',').map(t => t.trim()).filter(Boolean)
      : ['custom_action', 'get_status'];

    const newExt: MCPExtension = {
      id: 'manual-' + Date.now(),
      name: manualName.trim(),
      identifier: manualIdentifier.trim(),
      category: manualCategory,
      description: manualDescription.trim() || 'مهارت سفارشی اضافه شده توسط مدیر کلاستر',
      icon: Terminal,
      enabled: true,
      version: 'v1.0.0',
      downloads: '0 (Custom)',
      author: 'Cluster Administrator',
      protocol: manualProtocol,
      toolsProvided: toolsList
    };

    setExtensions(prev => [newExt, ...prev]);
    setShowAiModal(false);
    setManualName('');
    setManualIdentifier('');
    setManualDescription('');
    setManualTools('');
    setTestNotification(`سرور دست‌نویس MCP "${newExt.name}" به کلاستر متصل شد.`);
    setTimeout(() => setTestNotification(null), 4000);
  };

  // Toggle kardane status e nasb/fa'al-saazi
  const handleToggleExtension = (id: string) => {
    setExtensions(prev =>
      prev.map(ext => {
        if (ext.id === id) {
          const nextState = !ext.enabled;
          setTestNotification(`افزونه ${ext.name} ${nextState ? 'فعال و به کلاستر متصل شد.' : 'غیرفعال گردید.'}`);
          setTimeout(() => setTestNotification(null), 3500);
          return { ...ext, enabled: nextState };
        }
        return ext;
      })
    );
  };

  // Test e sari e abzar
  const handleTestExtension = (ext: MCPExtension) => {
    setTestingId(ext.id);
    setTestNotification(null);

    setTimeout(() => {
      setTestingId(null);
      setTestNotification(`تست ابزار ${ext.name} موفقیت‌آمیز بود! زمان پاسخگویی RPC پروتکل ${ext.protocol}: 14.8ms`);
      setTimeout(() => setTestNotification(null), 4000);
    }, 600);
  };

  // Kopi kardane khorooji
  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Filter kardane list
  const filteredExtensions = extensions.filter(ext => {
    const matchesSearch = ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ext.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ext.identifier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ext.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* 1. Header e Shishei ba Dokmehaye Afzoodane Maharat ba AI */}
      <div className="p-6 sm:p-7 rounded-3xl glass-surface-elevated border border-white/10 space-y-4 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Model Context Protocol (MCP) Ecosystem</span>
              <span>·</span>
              <span>Hermes Tool Integration</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>بازارچه مهارت‌ها و افزونه‌های کلاستر (MCP Marketplace)</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
              ابزارها و قابلیت‌های ایجنت خودمختار را با فعال‌سازی افزونه‌های پروتکل MCP گسترش دهید یا با هوش مصنوعی هر مهارت دلخواهی را در لحظه بسازید و مستقر کنید.
            </p>
          </div>

          {/* Dokmehaye Afzoodan ba AI va Dasti */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                setShowAiModal(true);
                setModalMode('ai');
              }}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-cyan-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-cyan-950/70"
            >
              <Wand2 className="w-4 h-4" />
              <span>افزودن مهارت با هوش مصنوعی (AI Creator)</span>
            </button>

            <button
              onClick={() => {
                setShowAiModal(true);
                setModalMode('manual');
              }}
              className="px-3.5 py-2.5 rounded-2xl glass-surface hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 border border-white/10"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>افزودن دستی (Custom)</span>
            </button>
          </div>
        </div>

        {/* Search Box va Filter Category */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/5">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-neutral-500 text-[11px]">دسته‌بندی:</span>
            {[
              { id: 'all', label: 'همه افزونه‌ها' },
              { id: 'automation', label: 'اتوماسیون وب و مرورگر' },
              { id: 'devtools', label: 'توسعه و DevOps' },
              { id: 'database', label: 'دیتابیس و داده' },
              { id: 'network', label: 'شبکه و SOCKS5' },
              { id: 'ai', label: 'هوش مصنوعی و ابزارها' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer text-[11px] font-medium ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950 font-bold'
                    : 'bg-black/30 text-neutral-400 hover:text-white border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در مهارت‌ها و پکیج‌ها..."
              className="w-full glass-input rounded-2xl py-2 pr-9 pl-4 text-xs text-white placeholder-neutral-500"
            />
            <Search className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Toast Notification baraye test ya toggle */}
        {testNotification && (
          <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center justify-between animate-in fade-in" dir="rtl">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{testNotification}</span>
            </span>
            <span className="text-[10px] text-neutral-400 font-mono" dir="ltr">RPC OK</span>
          </div>
        )}
      </div>

      {/* 2. Grid e Kart-haye Shishei (Glass Cards Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExtensions.map((ext) => {
          const Icon = ext.icon;
          return (
            <div
              key={ext.id}
              className={`rounded-3xl p-5 transition-all duration-300 flex flex-col justify-between space-y-4 border ${
                ext.enabled
                  ? 'glass-surface-elevated border-cyan-500/30 shadow-xl shadow-cyan-950/20'
                  : 'glass-surface border-white/5 opacity-70 hover:opacity-100'
              }`}
            >
              {/* Header e Kart: Icon, Name, and Toggle */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl border ${
                      ext.enabled
                        ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400 shadow-md shadow-cyan-950/50'
                        : 'bg-neutral-800/40 border-neutral-700/50 text-neutral-400'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-sm tracking-tight">
                          {ext.name}
                        </h3>
                        {ext.isAiGenerated && (
                          <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-mono font-bold animate-pulse">
                            AI Built
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[10px] text-cyan-400 block truncate max-w-[190px]" dir="ltr">
                        {ext.identifier}
                      </span>
                    </div>
                  </div>

                  {/* Toggle Button Shishei */}
                  <button
                    onClick={() => handleToggleExtension(ext.id)}
                    className="cursor-pointer transition-transform hover:scale-105"
                    title={ext.enabled ? 'غیرفعال‌سازی افزونه' : 'فعال‌سازی و نصب در کلاستر'}
                  >
                    {ext.enabled ? (
                      <ToggleRight className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-neutral-600" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed min-h-[48px]">
                  {ext.description}
                </p>

                {/* Chips e Abzarhaye Farakhani (Tools Provided) */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-neutral-400 block font-medium">ابزارهای در دسترس ایجنت:</span>
                  <div className="flex flex-wrap gap-1 font-mono text-[10px]" dir="ltr">
                    {ext.toolsProvided.map((tool, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-black/40 border border-white/5 text-neutral-300 hover:text-white"
                      >
                        {tool}()
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer e Kart: Protocol, Stats, and Test Action */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400">
                <div className="flex items-center gap-2 font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-white/5 text-neutral-400 text-[10px]">
                    {ext.protocol}
                  </span>
                  <span>{ext.downloads} DL</span>
                </div>

                <button
                  onClick={() => handleTestExtension(ext)}
                  disabled={!ext.enabled || testingId === ext.id}
                  className="px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-cyan-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {testingId === ext.id ? (
                    <span className="inline-block w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Play className="w-3 h-3" />
                  )}
                  <span>تست RPC</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* 3. Modal e Shishei: Afzoodane Maharat ba Hoosh e Masnooee (AI Smart Skill Creator Modal) */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-3xl glass-surface-elevated rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto scrollbar-thin" dir="rtl">
            
            {/* Header e Modal */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 shadow-md">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <span>سازنده هوشمند مهارت‌های کلاستر با هوش مصنوعی</span>
                  </h3>
                  <p className="text-xs text-neutral-400">
                    نیاز خود را به زبان ساده بیان کنید؛ سیستم به‌صورت خودکار اسکیماهای MCP، توابع و فایل اجرایی را می‌سازد.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAiModal(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Switch beine Halate AI va Halate Dasti */}
            <div className="flex items-center p-1 rounded-2xl bg-black/40 border border-white/10 text-xs font-semibold max-w-sm">
              <button
                type="button"
                onClick={() => setModalMode('ai')}
                className={`flex-1 py-1.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  modalMode === 'ai' ? 'bg-cyan-600 text-white font-bold shadow-md' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>طراحی هوشمند با AI</span>
              </button>
              <button
                type="button"
                onClick={() => setModalMode('manual')}
                className={`flex-1 py-1.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  modalMode === 'manual' ? 'bg-cyan-600 text-white font-bold shadow-md' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>ثبت دستی سرور MCP</span>
              </button>
            </div>

            {/* Modal Mode 1: AI Prompt Generator */}
            {modalMode === 'ai' ? (
              <div className="space-y-5">
                {/* Form e Daryafte Prompt */}
                <form onSubmit={handleGenerateSkillWithAI} className="space-y-3">
                  <label className="block text-xs font-semibold text-neutral-300">
                    شرح مهارت یا وظیفه مورد نیاز برای ایجنت:
                  </label>
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="مثلاً: یک مهارت بنویس که قیمت لحظه‌ای بیت‌کوین و اتریوم را از بایننس بگیرد و در صورت نوسان بیش از ۵٪ به کانال تلگرام هشدار بفرستد..."
                      className="w-full glass-input rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-neutral-500 resize-none leading-relaxed"
                    />
                  </div>

                  {/* Preset Pills */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-neutral-400 block">یا یکی از الگوهای آماده زیر را انتخاب کنید:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {aiPresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAiPrompt(preset.prompt)}
                          className="px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 text-[11px] text-neutral-300 hover:text-white cursor-pointer transition-colors"
                        >
                          {preset.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] text-neutral-500 font-mono" dir="ltr">
                      Powered by DeepSeek V4 Flash · OpenRouter Engine
                    </span>

                    <button
                      type="submit"
                      disabled={!aiPrompt.trim() || isGenerating}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-cyan-950/70 disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Wand2 className="w-4 h-4" />
                      )}
                      <span>{isGenerating ? 'در حال تولید مهارت با هوش مصنوعی...' : 'تولید مهارت با DeepSeek V4'}</span>
                    </button>
                  </div>
                </form>

                {/* Loghaye Marhale be Marhaleye Tolide AI */}
                {generationSteps.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-black/60 border border-neutral-800 space-y-1 font-mono text-xs text-neutral-300 leading-relaxed" dir="rtl">
                    {generationSteps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className={step.includes('✔') ? 'text-emerald-300 font-bold' : 'text-neutral-300'}>{step}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pish-namayeshe Maharat e Tolidi */}
                {generatedSkill && (
                  <div className="p-5 rounded-2xl glass-surface-elevated border border-cyan-500/40 space-y-4 animate-in fade-in">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                          <h4 className="font-bold text-white text-sm">{generatedSkill.name}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 text-[10px] font-mono border border-cyan-800">
                            {generatedSkill.category}
                          </span>
                        </div>
                        <span className="font-mono text-xs text-cyan-400 block mt-1" dir="ltr">
                          {generatedSkill.identifier}
                        </span>
                      </div>

                      <button
                        onClick={handleInstallGeneratedSkill}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-950/60"
                      >
                        <Check className="w-4 h-4" />
                        <span>نصب و فعال‌سازی در کلاستر</span>
                      </button>
                    </div>

                    {/* Tools Provided */}
                    <div>
                      <span className="text-[11px] text-neutral-400 block mb-1">توابع MCP ثبت‌شده:</span>
                      <div className="flex flex-wrap gap-1 font-mono text-xs" dir="ltr">
                        {generatedSkill.toolsProvided.map((tool, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-black/60 border border-white/5 text-emerald-300">
                            {tool}()
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Code Inspector Tabs (Python vs JSON) */}
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 text-[11px]">
                          <button
                            type="button"
                            onClick={() => setActiveCodeTab('python')}
                            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                              activeCodeTab === 'python' ? 'bg-cyan-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
                            }`}
                          >
                            سورس پایتون FastMCP
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveCodeTab('json')}
                            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                              activeCodeTab === 'json' ? 'bg-cyan-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
                            }`}
                          >
                            پیکربندی mcpServers.json
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyCode(activeCodeTab === 'python' ? generatedSkill.pythonCode : generatedSkill.jsonConfig)}
                          className="hover:text-white text-neutral-400 text-[11px] cursor-pointer flex items-center gap-1"
                        >
                          {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCode ? 'کپی شد' : 'کپی کد'}</span>
                        </button>
                      </div>

                      <div className="p-3 bg-black/80 rounded-xl border border-neutral-800 text-[11px] font-mono text-cyan-300 max-h-48 overflow-y-auto scrollbar-thin" dir="ltr">
                        <pre className="whitespace-pre-wrap">
                          {activeCodeTab === 'python' ? generatedSkill.pythonCode : generatedSkill.jsonConfig}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Modal Mode 2: Manual Registration Form */
              <form onSubmit={handleSaveManualSkill} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">نام مهارت (Display Name):</label>
                    <input
                      type="text"
                      required
                      placeholder="مثلاً: ربات مانیتورینگ Redis"
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      className="w-full glass-input rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">شناسه پکیج (Package ID):</label>
                    <input
                      type="text"
                      required
                      placeholder="@org/mcp-server-custom"
                      value={manualIdentifier}
                      onChange={(e) => setManualIdentifier(e.target.value)}
                      dir="ltr"
                      className="w-full glass-input rounded-xl px-3 py-2 font-mono text-cyan-300"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">دسته‌بندی:</label>
                    <select
                      value={manualCategory}
                      onChange={(e) => setManualCategory(e.target.value as any)}
                      className="w-full glass-input rounded-xl px-3 py-2 text-white cursor-pointer"
                    >
                      <option value="devtools">توسعه و DevOps</option>
                      <option value="automation">اتوماسیون وب</option>
                      <option value="database">دیتابیس</option>
                      <option value="network">شبکه</option>
                      <option value="ai">هوش مصنوعی</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">پروتکل ارتباطی:</label>
                    <select
                      value={manualProtocol}
                      onChange={(e) => setManualProtocol(e.target.value as any)}
                      className="w-full glass-input rounded-xl px-3 py-2 text-white cursor-pointer"
                    >
                      <option value="STDIO">STDIO (Local Pipe)</option>
                      <option value="SSE">Server-Sent Events (SSE)</option>
                      <option value="WebSocket">WebSocket (Remote Bridge)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-neutral-300 font-semibold mb-1">ابزارهای ارائه‌شده (با ویرگول جدا کنید):</label>
                    <input
                      type="text"
                      placeholder="inspect_keys, ping_redis, flush_db"
                      value={manualTools}
                      onChange={(e) => setManualTools(e.target.value)}
                      dir="ltr"
                      className="w-full glass-input rounded-xl px-3 py-2 font-mono text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-neutral-300 font-semibold mb-1">توضیحات عملکرد:</label>
                    <textarea
                      rows={2}
                      placeholder="شرح عملکرد این مهارت و سطح دسترسی‌های مورد نیاز در سرور..."
                      value={manualDescription}
                      onChange={(e) => setManualDescription(e.target.value)}
                      className="w-full glass-input rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowAiModal(false)}
                    className="px-4 py-2 rounded-xl glass-surface text-neutral-300 hover:text-white cursor-pointer"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>افزودن و ثبت سرور MCP</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
