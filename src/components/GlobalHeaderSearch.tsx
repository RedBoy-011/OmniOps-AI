import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Server,
  Laptop,
  Bot,
  Route,
  Zap,
  Layers,
  Globe,
  Cpu,
  ShieldCheck,
  Sparkles,
  X,
  ArrowRight,
  Command,
  Activity,
  Network
} from 'lucide-react';

export interface SearchResultItem {
  id: string;
  category: 'node' | 'agent' | 'setting' | 'tool';
  title: string;
  subtitle: string;
  badge: string;
  badgeColor?: string;
  keywords: string[];
  tab: 'dashboard' | 'agent' | 'mcp' | 'omniroute' | 'providers' | 'windows';
  agentId?: string;
  actionModal?: 'local_models' | 'server2' | 'domain_ssl';
}

const SEARCH_DATABASE: SearchResultItem[] = [
  // 1. Nodes (نودهای سرور و کلاستر)
  {
    id: 'node-master',
    category: 'node',
    title: 'سرور اصلی کلاستر (Master Control-Plane)',
    subtitle: 'IP: 192.168.1.10 · Hetzner Dedicated · هسته FastAPI + PostgreSQL + Redis',
    badge: 'Node 1 Master',
    badgeColor: 'cyan',
    keywords: ['master', 'سرور اول', 'hetzner', '192.168.1.10', 'کلاستر', 'اصلی', 'node 1', 'core'],
    tab: 'dashboard'
  },
  {
    id: 'node-server2',
    category: 'node',
    title: 'سرور دوم ورکر گرافیک (Edge Worker #1 GPU Runner)',
    subtitle: 'IP: 192.168.1.55:9090 · RTX 4090 24GB VRAM · vLLM + Ollama Engine',
    badge: 'Server 2 GPU',
    badgeColor: 'purple',
    keywords: ['server 2', 'سرور دوم', 'gpu', 'گرافیک', 'worker', 'ورکر', 'rtx', '4090', 'ollama', 'vllm'],
    tab: 'dashboard',
    actionModal: 'server2'
  },
  {
    id: 'node-win-workstation',
    category: 'node',
    title: 'نود دسکتاپ ویندوز ورک‌استیشن (Workstation Node)',
    subtitle: 'IP: 192.168.1.105 · Windows 11 Pro · تونل Reverse WebSocket معکوس',
    badge: 'Win Node',
    badgeColor: 'emerald',
    keywords: ['نود ویندوز', 'workstation', 'ورک استیشن', '192.168.1.105', 'windows node'],
    tab: 'windows'
  },
  {
    id: 'node-win-laptop',
    category: 'node',
    title: 'نود لپ‌تاپ توسعه لنوو (ThinkPad Laptop Node)',
    subtitle: 'IP: 192.168.1.142 · Windows 11 Enterprise · پایش بلادرنگ',
    badge: 'Laptop Node',
    badgeColor: 'emerald',
    keywords: ['لپتاپ', 'laptop', 'thinkpad', 'توسعه', '192.168.1.142'],
    tab: 'windows'
  },

  // 2. Agents (ایجنت‌ها و همیارها)
  {
    id: 'agent-workstation-chat',
    category: 'agent',
    title: 'همیار دسکتاپ ویندوز (Workstation Agent)',
    subtitle: 'قابلیت اسکرین‌شات دسکتاپ، ترمینال PowerShell ادمین، قفل سیستم و پاکسازی رم',
    badge: 'Agent Chat',
    badgeColor: 'purple',
    keywords: ['ایجنت', 'همیار ویندوز', 'workstation', 'powershell', 'چت', 'اسکرین شات', 'کامپیوتر'],
    tab: 'agent',
    agentId: 'agent-win-workstation'
  },
  {
    id: 'agent-devlaptop-chat',
    category: 'agent',
    title: 'همیار لپ‌تاپ شخصی (ThinkPad Agent)',
    subtitle: 'پایش سخت‌افزار، مدیریت فایل‌های لوکال، نوتیفیکیشن دسکتاپ',
    badge: 'Agent Chat',
    badgeColor: 'purple',
    keywords: ['لپتاپ', 'agent thinkpad', 'ویندوز لپتاپ', 'همیار لپتاپ'],
    tab: 'agent',
    agentId: 'agent-win-devlaptop'
  },
  {
    id: 'agent-cloud-hermes',
    category: 'agent',
    title: 'ایجنت سرور ابری مرکزی (Hermes Master Cloud)',
    subtitle: 'مدیریت کانتینرهای داکر، ساندباکس پایتون، روتینگ هسته',
    badge: 'Cloud Agent',
    badgeColor: 'cyan',
    keywords: ['hermes', 'هرمس', 'ایجنت ابری', 'cloud agent', 'docker'],
    tab: 'agent',
    agentId: 'agent-cloud-hermes'
  },

  // 3. Configuration Settings & Operations (تنظیمات و ماژول‌ها)
  {
    id: 'setting-local-models',
    category: 'setting',
    title: 'مدیریت و دانلود مدل‌های محلی (Local AI Models)',
    subtitle: 'دانلود مستقیم DeepSeek R1، Llama 3.3 و Qwen با نمایش درصد دانلود و سرعت MB/s',
    badge: 'AI Models',
    badgeColor: 'cyan',
    keywords: ['مدل محلی', 'local models', 'deepseek', 'llama', 'qwen', 'دانلود مدل', 'ollama', 'دانلود'],
    tab: 'dashboard',
    actionModal: 'local_models'
  },
  {
    id: 'setting-server2-connect',
    category: 'setting',
    title: 'اتصال سرور دوم و کلاسترینگ (Server 2 Multi-Node)',
    subtitle: 'تولید دستور اتصال سرور دوم، مدیریت توکن کلاستر و مانیتورینگ GPU',
    badge: 'Cluster Config',
    badgeColor: 'purple',
    keywords: ['سرور دوم', 'اتصال سرور', 'server 2', 'cluster', 'ورکر', 'کلاسترینگ', 'pairing'],
    tab: 'dashboard',
    actionModal: 'server2'
  },
  {
    id: 'setting-domain-ssl',
    category: 'setting',
    title: 'پیکربندی دامنه اینترنتی و SSL خودکار (HTTPS)',
    subtitle: 'ثبت دامین اختصاصی، گواهی امنیتی Let\'s Encrypt و کانفیگ پروکسی معکوس Nginx',
    badge: 'SSL & Domain',
    badgeColor: 'emerald',
    keywords: ['دامنه', 'domain', 'ssl', 'https', 'certbot', 'گواهی', 'امنیت', 'دامین'],
    tab: 'dashboard',
    actionModal: 'domain_ssl'
  },
  {
    id: 'setting-omniroute',
    category: 'setting',
    title: 'هسته مسیریابی هوشمند OmniRoute (Port :8000)',
    subtitle: 'مدیریت Fallback هوشمند مدل‌ها، لود بالانسر، تاخیر پرووایدرها و کش توکن',
    badge: 'Router Core',
    badgeColor: 'cyan',
    keywords: ['omniroute', 'روتر', 'مسیریابی', 'هسته', 'route', '8000', 'fallback', 'کش'],
    tab: 'omniroute'
  },
  {
    id: 'setting-providers',
    category: 'setting',
    title: 'پرووایدرهای هوش مصنوعی و تونل SOCKS5 (Anti-Filter)',
    subtitle: 'کلیدهای OpenRouter، DeepSeek، OpenAI، Gemini و کانفیگ پراکسی رفع تحریم',
    badge: 'Providers & Proxy',
    badgeColor: 'amber',
    keywords: ['پرووایدر', 'openrouter', 'socks5', 'پراکسی', 'فیلتر', 'تحریم', 'api key', 'کلید'],
    tab: 'providers'
  },
  {
    id: 'setting-mcp',
    category: 'setting',
    title: 'بازارچه ابزارهای پروتکل MCP (Model Context Protocol)',
    subtitle: 'سرویس‌های PostgreSQL، Git، Filesystem، وب اسکرپینگ و ترمینال امن',
    badge: '8 MCP Tools',
    badgeColor: 'indigo',
    keywords: ['mcp', 'ابزار', 'پروتکل', 'بازارچه', 'مهارت', 'tools', 'context'],
    tab: 'mcp'
  },
  {
    id: 'setting-windows-hub',
    category: 'setting',
    title: 'هاب ایجنت ویندوز و کلیدهای جفت‌سازی (Windows Agent Hub)',
    subtitle: 'تولید توکن جفت‌سازی کاربر، دستور اتصال PowerShell و پایش وضعیت',
    badge: 'Windows Hub',
    badgeColor: 'purple',
    keywords: ['ویندوز', 'توکن', 'جفت سازی', 'pairing', 'powershell', 'hub', 'windows'],
    tab: 'windows'
  },
  {
    id: 'setting-dashboard-metrics',
    category: 'setting',
    title: 'پایش بلادرنگ منابع سخت‌افزاری (CPU, RAM, Telemetry)',
    subtitle: 'داشبورد سلامت، مصرف رم، دمای سرور و پهنای باند ترافیک AI',
    badge: 'Live Telemetry',
    badgeColor: 'emerald',
    keywords: ['cpu', 'ram', 'منابع', 'مانیتورینگ', 'سخت افزار', 'سلامت', 'لاگ'],
    tab: 'dashboard'
  }
];

interface GlobalHeaderSearchProps {
  onSelectResult: (result: SearchResultItem) => void;
}

export const GlobalHeaderSearch: React.FC<GlobalHeaderSearchProps> = ({ onSelectResult }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'node' | 'agent' | 'setting'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);

  // Global Keyboard Shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Filter items based on query & category
  const filteredResults = SEARCH_DATABASE.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!query.trim()) return true;

    const q = query.toLowerCase().trim();
    const matchesTitle = item.title.toLowerCase().includes(q);
    const matchesSubtitle = item.subtitle.toLowerCase().includes(q);
    const matchesBadge = item.badge.toLowerCase().includes(q);
    const matchesKeywords = item.keywords.some(k => k.toLowerCase().includes(q));

    return matchesTitle || matchesSubtitle || matchesBadge || matchesKeywords;
  });

  // Handle arrow keys inside search results
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelectItem(filteredResults[selectedIndex]);
      }
    }
  };

  const handleSelectItem = (item: SearchResultItem) => {
    onSelectResult(item);
    setIsOpen(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'node':
        return <Server className="w-4 h-4 text-cyan-400" />;
      case 'agent':
        return <Laptop className="w-4 h-4 text-purple-400" />;
      case 'setting':
        return <Zap className="w-4 h-4 text-amber-400" />;
      default:
        return <Activity className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <>
      {/* 1. Header Search Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group relative flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/40 text-neutral-400 hover:text-white transition-all cursor-pointer text-xs w-48 sm:w-64 md:w-72 justify-between shadow-inner"
        title="جستجو در سراسر کلاستر، ایجنت‌ها و تنظیمات (Ctrl + K)"
      >
        <div className="flex items-center gap-2 truncate">
          <Search className="w-3.5 h-3.5 text-neutral-400 group-hover:text-cyan-400 transition-colors shrink-0" />
          <span className="truncate text-[11px] sm:text-xs">
            جستجو در کلاستر، ایجنت‌ها...
          </span>
        </div>

        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/50 border border-white/10 text-[10px] font-mono text-neutral-400 group-hover:text-cyan-300 group-hover:border-cyan-500/30 transition-colors" dir="ltr">
          <Command className="w-2.5 h-2.5" />
          <span>K</span>
        </kbd>
      </button>

      {/* 2. Floating Command Palette Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150" dir="rtl">
          
          {/* Backdrop close area */}
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />

          {/* Modal Container */}
          <div
            ref={paletteRef}
            className="relative w-full max-w-2xl glass-surface-elevated rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/10 bg-black/40">
              <Search className="w-5 h-5 text-cyan-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder="نام نود، ایجنت، مدل، دامنه یا تنظیمات را تایپ کنید..."
                className="w-full bg-transparent text-sm text-white placeholder-neutral-400 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 cursor-pointer"
                  title="پاک کردن"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs cursor-pointer border border-white/5"
                title="بستن (Esc)"
              >
                <span className="font-mono text-[10px]">ESC</span>
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 px-5 py-2.5 bg-black/20 border-b border-white/5 text-xs overflow-x-auto scrollbar-none">
              <span className="text-[11px] text-neutral-500 font-medium ml-1">فیلتر:</span>
              <button
                onClick={() => { setSelectedCategory('all'); setSelectedIndex(0); }}
                className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer text-[11px] font-semibold ${
                  selectedCategory === 'all'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                همه ({SEARCH_DATABASE.length})
              </button>
              <button
                onClick={() => { setSelectedCategory('node'); setSelectedIndex(0); }}
                className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer text-[11px] font-semibold flex items-center gap-1 ${
                  selectedCategory === 'node'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Server className="w-3 h-3 text-cyan-400" />
                <span>نودها</span>
              </button>
              <button
                onClick={() => { setSelectedCategory('agent'); setSelectedIndex(0); }}
                className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer text-[11px] font-semibold flex items-center gap-1 ${
                  selectedCategory === 'agent'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Laptop className="w-3 h-3 text-purple-400" />
                <span>ایجنت‌ها</span>
              </button>
              <button
                onClick={() => { setSelectedCategory('setting'); setSelectedIndex(0); }}
                className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer text-[11px] font-semibold flex items-center gap-1 ${
                  selectedCategory === 'setting'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Zap className="w-3 h-3 text-amber-400" />
                <span>تنظیمات و ماژول‌ها</span>
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-[380px] overflow-y-auto p-2.5 space-y-1.5 scrollbar-thin">
              {filteredResults.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <div className="inline-flex p-3 rounded-2xl bg-white/5 text-neutral-500">
                    <Search className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-neutral-400">
                    موردی مطابق با «{query}» یافت نشد.
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    واژه‌هایی مانند «gpu»، «ویندوز»، «مدل»، «ssl»، «نود» یا «روتر» را امتحان کنید.
                  </p>
                </div>
              ) : (
                filteredResults.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`group p-3 rounded-2xl transition-all cursor-pointer border flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-500/50 shadow-md shadow-cyan-950/40 text-white'
                          : 'bg-black/20 border-white/5 hover:bg-white/[0.04] text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                          isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-neutral-900 text-neutral-400 group-hover:text-white'
                        }`}>
                          {getCategoryIcon(item.category)}
                        </div>

                        <div className="space-y-0.5 truncate">
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-xs sm:text-sm font-bold truncate">
                              {item.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 truncate">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                          item.category === 'node'
                            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                            : item.category === 'agent'
                            ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        }`}>
                          {item.badge}
                        </span>

                        <ArrowRight className={`w-4 h-4 transition-transform ${
                          isSelected ? 'text-cyan-400 translate-x-[-2px]' : 'text-neutral-600'
                        }`} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Navigation Hints */}
            <div className="px-5 py-2.5 border-t border-white/10 bg-black/40 flex items-center justify-between text-[11px] text-neutral-500 font-mono" dir="ltr">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-300">↑↓</kbd>
                  <span>Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-300">↵</kbd>
                  <span>Select</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-300">ESC</kbd>
                  <span>Close</span>
                </span>
              </div>

              <span className="text-[10px] text-cyan-400">
                OmniOps Global Cluster Search
              </span>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
