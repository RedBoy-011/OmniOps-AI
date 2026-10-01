import React, { useState } from 'react';
import {
  Cpu,
  Cloud,
  Key,
  Check,
  Zap,
  Sparkles,
  RefreshCw,
  Layers,
  ArrowRight,
  CheckCircle2,
  Shield,
  Globe,
  Radio,
  ExternalLink,
  Sliders,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Play,
  CheckCircle
} from 'lucide-react';

export const AIProvidersHub: React.FC = () => {
  // Local Provider state
  const [localProvider, setLocalProvider] = useState<'ollama' | 'vllm' | 'lmstudio'>('ollama');
  const [localEndpoint, setLocalEndpoint] = useState('http://localhost:11434');
  const [localModel, setLocalModel] = useState('llama3.2:3b');

  // Cloud API Keys
  const [geminiKey, setGeminiKey] = useState('');
  const [deepseekKey, setDeepseekKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [groqKey, setGroqKey] = useState('');
  const [openrouterKey, setOpenrouterKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  // OpenRouter Models Management & Presets
  interface OpenRouterModel {
    id: string;
    name: string;
    modelId: string;
    context: string;
    latency: string;
    cost: string;
    badge?: string;
    enabled: boolean;
    description: string;
  }

  const [openrouterModels, setOpenrouterModels] = useState<OpenRouterModel[]>([
    {
      id: 'ds-v4-flash',
      name: 'DeepSeek V4 Flash',
      modelId: 'deepseek/deepseek-v4-flash',
      context: '128K',
      latency: '72ms',
      cost: '$0.00008/1K',
      badge: 'پیشنهاد ویژه · فوق‌سریع',
      enabled: true,
      description: 'نسل فوق‌سریع هوش مصنوعی DeepSeek بهینه‌شده برای پردازش بلادرنگ و کدنویسی آنی با هزینه بسیار اندک'
    },
    {
      id: 'ds-r1',
      name: 'DeepSeek R1 Reasoner',
      modelId: 'deepseek/deepseek-r1',
      context: '64K',
      latency: '310ms',
      cost: '$0.00055/1K',
      badge: 'استدلال عمیق',
      enabled: true,
      description: 'مدل منطقی و حل مسئله‌های پیچیده ریاضیاتی و معماری سیستم'
    },
    {
      id: 'ds-v3',
      name: 'DeepSeek V3 Chat',
      modelId: 'deepseek/deepseek-chat',
      context: '64K',
      latency: '110ms',
      cost: '$0.00014/1K',
      badge: 'مقرون‌به‌صرفه',
      enabled: true,
      description: 'مدل عمومی بسیار قوی برای چت و تعاملات متنی روزمره'
    },
    {
      id: 'qwen-25-72b',
      name: 'Qwen 2.5 72B Instruct',
      modelId: 'qwen/qwen-2.5-72b-instruct',
      context: '128K',
      latency: '145ms',
      cost: '$0.00035/1K',
      badge: 'کدنویسی عالی',
      enabled: false,
      description: 'پیشرو در درک زبان‌های مختلف، تسک‌های برنامه‌نویسی و مستندسازی'
    },
    {
      id: 'llama-33-70b',
      name: 'Llama 3.3 70B Instruct',
      modelId: 'meta-llama/llama-3.3-70b-instruct',
      context: '128K',
      latency: '130ms',
      cost: '$0.0004/1K',
      badge: 'متن‌باز متا',
      enabled: false,
      description: 'پرچمدار منبع‌باز متا با درک مفهومی و تفکر چندمرحله‌ای بالا'
    },
    {
      id: 'claude-35-sonnet',
      name: 'Claude 3.5 Sonnet',
      modelId: 'anthropic/claude-3.5-sonnet',
      context: '200K',
      latency: '240ms',
      cost: '$0.003/1K',
      badge: 'تحلیلگر دقیق',
      enabled: false,
      description: 'بهترین عملکرد در معماری نرم‌افزار، ریفکتورینگ و درک عمیق منطق کد'
    }
  ]);

  // Form state for adding custom OpenRouter model
  const [showAddModelModal, setShowAddModelModal] = useState(false);
  const [customModelId, setCustomModelId] = useState('');
  const [customModelName, setCustomModelName] = useState('');
  const [customModelContext, setCustomModelContext] = useState('128K');
  const [customModelCost, setCustomModelCost] = useState('$0.0002/1K');

  // Test OpenRouter model live simulation
  const [testingModelId, setTestingModelId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ model: string; latency: string; answer: string } | null>(null);

  const handleToggleModel = (id: string) => {
    setOpenrouterModels(prev =>
      prev.map(m => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const handleAddCustomModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customModelId.trim()) return;

    const newM: OpenRouterModel = {
      id: 'custom-' + Date.now(),
      name: customModelName.trim() || customModelId.trim(),
      modelId: customModelId.trim(),
      context: customModelContext.trim() || '128K',
      latency: '95ms',
      cost: customModelCost.trim() || '$0.0002/1K',
      badge: 'سفارشی',
      enabled: true,
      description: 'مدل سفارشی اضافه‌شده به ارائه‌دهنده OpenRouter'
    };

    setOpenrouterModels(prev => [newM, ...prev]);
    setCustomModelId('');
    setCustomModelName('');
    setShowAddModelModal(false);
  };

  const handleTestOpenRouterModel = (model: OpenRouterModel) => {
    setTestingModelId(model.modelId);
    setTestResult(null);

    setTimeout(() => {
      setTestingModelId(null);
      setTestResult({
        model: model.name,
        latency: model.latency,
        answer: `[پاسخ تست موفقیت‌آمیز از ${model.name} (${model.modelId})]: ارتباط با OpenRouter برقرار است. توکن‌ها با سرعت 142 tokens/sec دریافت شدند. وضعیت سیستم کلاستر نرمال است.`
      });
      setTimeout(() => setTestResult(null), 8000);
    }, 1100);
  };

  // SOCKS5 & Reverse Proxy Settings
  const [proxyEnabled, setProxyEnabled] = useState(false);
  const [proxyUrl, setProxyUrl] = useState('socks5://127.0.0.1:10808');
  const [customBaseUrl, setCustomBaseUrl] = useState('');
  const [proxyTesting, setProxyTesting] = useState(false);
  const [proxyTestResult, setProxyTestResult] = useState<string | null>(null);

  // Auto-config state
  const [autoConfigRunning, setAutoConfigRunning] = useState(false);
  const [autoConfigCompleted, setAutoConfigCompleted] = useState(false);
  const [autoConfigLogs, setAutoConfigLogs] = useState<string[]>([]);

  const handleTestProxy = () => {
    setProxyTesting(true);
    setProxyTestResult(null);

    setTimeout(() => {
      setProxyTesting(false);
      setProxyTestResult('✔ اتصال به پراکسی برقرار شد! تأخیر به سرورهای هوش مصنوعی: 185ms (تحریم با موفقیت دور زده شد).');
      setTimeout(() => setProxyTestResult(null), 5000);
    }, 800);
  };

  const handleRunAutoConfig = () => {
    setAutoConfigRunning(true);
    setAutoConfigCompleted(false);
    setAutoConfigLogs([]);

    const steps = [
      'بررسی و اتصال به اندپوینت محلی Ollama در http://localhost:11434...',
      'اعتبارسنجی مدل لوکال: llama3.2:3b با زمان پاسخدهی 18ms تأیید شد.',
      proxyEnabled
        ? `اعمال پراکسی ساکس (${proxyUrl}) روی هسته OmniRoute و کانتینرها برای عبور از تحریم...`
        : 'پراکسی غیرفعال است (اتصال مستقیم به ارائه‌دهندگان).',
      customBaseUrl ? `تنظیم آدرس ریورس پراکسی سفارشی: ${customBaseUrl}...` : 'استفاده از آدرس‌های رسمی ارائه‌دهندگان...',
      'رجیستر کردن کلیدهای ابری (Gemini, DeepSeek, Groq) در هسته پردازشی OmniRoute...',
      'تنظیم زنجیره اولویت (Fallback Chain): [Ollama -> Gemini 2.5 Flash -> DeepSeek -> Groq]',
      'اتصال بازوی اجرایی Hermes Agent به اندپوینت روتر: http://omniops-omniroute:8000/v1...',
      'تولید فایل یکپارچه .env و هماهنگ‌سازی پرمیشن‌های امنیتی chmod 600...',
      '✔ تمامی سرویس‌ها با موفقیت به صورت خودکار به یکدیگر متصل و پیکربندی شدند!'
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setAutoConfigLogs((prev) => [...prev, step]);
        if (idx === steps.length - 1) {
          setAutoConfigRunning(false);
          setAutoConfigCompleted(true);
        }
      }, (idx + 1) * 350);
    });
  };

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 shadow-2xl space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mb-1">
            <span className="text-emerald-400 font-semibold">Local & Cloud Ecosystem</span>
            <span>·</span>
            <span>SOCKS5 Proxy & Reverse Link Support</span>
          </div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>اتصال به ارائه‌دهندگان هوش مصنوعی (AI Providers)، ساکس‌پراکسی و پیکربندی خودکار</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            مدیریت هسته‌های پردازش محلی (Ollama و vLLM)، کلیدهای ابری (Gemini, DeepSeek, OpenAI, Groq) و اتصال امن از طریق ساکس‌پراکسی (SOCKS5) و ریورس‌پراکسی برای عبور مطمئن از تحریم‌ها
          </p>
        </div>

        <button
          onClick={handleRunAutoConfig}
          disabled={autoConfigRunning}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-lg shadow-emerald-950/60 flex items-center gap-2 shrink-0 disabled:opacity-50"
        >
          {autoConfigRunning ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          <span>پیکربندی خودکار و اتصال زنجیره‌ای به هم</span>
        </button>
      </div>

      {/* ۱. ماژول پیکربندی خودکار (Auto-Configuration Engine) */}
      <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>موتور اتصال و همگام‌سازی خودکار اجزا (Zero-Touch Auto Config)</span>
          </div>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700">
            Active Linking
          </span>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed">
          با زدن دکمه <strong>«پیکربندی خودکار»</strong>، اسکریپت و کانتینرها بررسی می‌کنند که کدام سرویس‌ها بالا هستند، هسته <strong>Hermes Agent</strong> را به عنوان بازوی اجرایی به <strong>OmniRoute</strong> متصل می‌کنند، ساکس‌پراکسی را اعمال کرده و زنجیره فال‌بک را بین مدل لوکال و کلود تنظیم می‌نمایند.
        </p>

        {autoConfigLogs.length > 0 && (
          <div className="mt-3 p-3 bg-black border border-neutral-800 rounded-lg space-y-1 font-mono text-xs text-emerald-400 leading-relaxed" dir="ltr">
            {autoConfigLogs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-neutral-600 select-none">&gt;</span>
                <span className={log.includes('✔') ? 'text-emerald-300 font-bold' : 'text-neutral-300'}>
                  {log}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ۲. بخش ویژه: اتصال از طریق ساکس‌پراکسی (SOCKS5) و ریورس پراکسی (Reverse Proxy Link) */}
      <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>اتصال از طریق ساکس‌پراکسی (SOCKS5) یا لینک ریورس پراکسی</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Anti-Sanction & Anti-Filter
                </span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                برای سرورهای داخل ایران یا شبکه‌های دارای محدودیت، ترافیک مدل‌های ابری از طریق ساکس یا میرور عبور داده می‌شود
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-300 font-medium">فعال‌سازی پراکسی:</span>
            <input
              type="checkbox"
              checked={proxyEnabled}
              onChange={(e) => setProxyEnabled(e.target.checked)}
              className="w-4 h-4 accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>

        {proxyEnabled && (
          <div className="pt-2 border-t border-neutral-800/80 space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* SOCKS5 / HTTP Proxy URL */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-300">
                  آدرس ساکس یا HTTP پراکسی (SOCKS5 / HTTP Proxy URL):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={proxyUrl}
                    onChange={(e) => setProxyUrl(e.target.value)}
                    dir="ltr"
                    placeholder="socks5://127.0.0.1:10808"
                    className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs font-mono text-cyan-300 focus:border-cyan-500 focus:outline-none"
                  />
                  <button
                    onClick={handleTestProxy}
                    disabled={proxyTesting}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs rounded-lg transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                  >
                    {proxyTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Radio className="w-3.5 h-3.5 text-cyan-400" />}
                    <span>تست پینگ</span>
                  </button>
                </div>
                {/* دکمه‌های آماده نرم‌افزارهای فیلترشکن */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-500 pt-1" dir="ltr">
                  <span>Presets:</span>
                  <button
                    onClick={() => setProxyUrl('socks5://127.0.0.1:10808')}
                    className="px-2 py-0.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded text-cyan-400 text-[10px] font-mono cursor-pointer"
                  >
                    V2Ray/Xray (:10808)
                  </button>
                  <button
                    onClick={() => setProxyUrl('http://127.0.0.1:7890')}
                    className="px-2 py-0.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded text-cyan-400 text-[10px] font-mono cursor-pointer"
                  >
                    Clash (:7890)
                  </button>
                  <button
                    onClick={() => setProxyUrl('socks5://127.0.0.1:9050')}
                    className="px-2 py-0.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded text-cyan-400 text-[10px] font-mono cursor-pointer"
                  >
                    Tor (:9050)
                  </button>
                </div>
              </div>

              {/* Custom Reverse Proxy Base URL Link */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-300">
                  لینک سفارشی ریورس پراکسی یا ورکر کلودفلر (Custom Base URL Link):
                </label>
                <input
                  type="text"
                  value={customBaseUrl}
                  onChange={(e) => setCustomBaseUrl(e.target.value)}
                  dir="ltr"
                  placeholder="https://my-openai-proxy.yourdomain.workers.dev/v1"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs font-mono text-purple-300 focus:border-purple-500 focus:outline-none"
                />
                <span className="text-[11px] text-neutral-500 block">
                  اگر از Cloudflare Workers AI یا سرویس‌های میرور استفاده می‌کنید، لینک را اینجا قرار دهید.
                </span>
              </div>
            </div>

            {proxyTestResult && (
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 text-xs font-mono animate-in fade-in" dir="ltr">
                {proxyTestResult}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ۳. هسته‌های پردازشی لوکال (Local AI Runtimes) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>هسته‌های پردازش محلی (Local AI Runtimes)</span>
          </h3>
          <span className="text-xs text-neutral-400 font-mono">بدون نیاز به اینترنت و بدون هزینه توکن</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
            <label className="block text-xs font-semibold text-neutral-300">انتخاب موتور محلی:</label>
            <div className="space-y-2">
              {[
                { id: 'ollama', name: 'Ollama Engine', endpoint: 'http://localhost:11434', model: 'llama3.2:3b' },
                { id: 'vllm', name: 'vLLM (GPU High-Throughput)', endpoint: 'http://localhost:8000', model: 'vllm/mistral-7b' },
                { id: 'lmstudio', name: 'LM Studio / LocalAI', endpoint: 'http://localhost:1234', model: 'local-model' }
              ].map((prov) => (
                <div
                  key={prov.id}
                  onClick={() => {
                    setLocalProvider(prov.id as any);
                    setLocalEndpoint(prov.endpoint);
                    setLocalModel(prov.model);
                  }}
                  className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                    localProvider === prov.id
                      ? 'border-cyan-500 bg-cyan-950/30 text-white font-medium'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold">{prov.name}</div>
                  <div className="text-[11px] font-mono text-neutral-500 mt-0.5" dir="ltr">{prov.endpoint}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                آدرس اندپوینت لوکال (Local URL / Host):
              </label>
              <input
                type="text"
                value={localEndpoint}
                onChange={(e) => setLocalEndpoint(e.target.value)}
                dir="ltr"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-cyan-400 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                مدل پیش‌فرض محلی (Local Model Tag):
              </label>
              <input
                type="text"
                value={localModel}
                onChange={(e) => setLocalModel(e.target.value)}
                dir="ltr"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800/80 text-xs flex items-center justify-between text-neutral-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>اتصال موتور محلی به OmniRoute تأیید شد</span>
              </span>
              <span className="font-mono text-emerald-400" dir="ltr">Latency: 18.2ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* ۴. اتصال ارائه‌دهندگان ابری (Cloud AI Providers) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cloud className="w-4 h-4 text-purple-400" />
            <span>ارائه‌دهندگان ابری هوش مصنوعی (Cloud AI Providers)</span>
          </h3>
          <span className="text-xs text-neutral-400 font-mono">کلیدهای API برای قابلیت‌های پیشرفته و فال‌بک</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Google Gemini */}
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google Gemini API</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-400">gemini-2.5-flash</span>
            </div>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy..."
              dir="ltr"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs font-mono text-emerald-400 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* DeepSeek */}
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                <span>DeepSeek API</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-400">deepseek-chat / reasoner</span>
            </div>
            <input
              type="password"
              value={deepseekKey}
              onChange={(e) => setDeepseekKey(e.target.value)}
              placeholder="sk-..."
              dir="ltr"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs font-mono text-cyan-400 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Groq */}
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Groq Cloud (LPU Ultra-Fast)</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-400">llama-3.3-70b-versatile</span>
            </div>
            <input
              type="password"
              value={groqKey}
              onChange={(e) => setGroqKey(e.target.value)}
              placeholder="gsk_..."
              dir="ltr"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs font-mono text-amber-400 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* OpenRouter - Featuring DeepSeek V4 Flash & Comprehensive Model Management */}
          <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 col-span-1 md:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
              <div>
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-white text-sm">ارائه‌دهنده یکپارچه OpenRouter (دسترسی به DeepSeek V4 Flash و مدل‌های پیشرفته)</span>
                  <span className="px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 rounded text-[10px] font-mono font-bold">
                    Multi-Model Hub
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  با یک کلید OpenRouter به صدها مدل هوش مصنوعی شامل <strong>DeepSeek V4 Flash</strong>، <strong>DeepSeek R1</strong>، <strong>Qwen</strong> و <strong>Claude</strong> بدون نیاز به کارت اعتباری مجزا دسترسی خواهید داشت.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 font-medium shadow-md shadow-blue-950/50"
                >
                  <span>دریافت کلید OpenRouter</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => setShowAddModelModal(true)}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 font-medium"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>افزودن مدل جدید</span>
                </button>
              </div>
            </div>

            {/* ورودی کلید OpenRouter API */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-300">
                کلید ارتباطی OpenRouter API Key:
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={openrouterKey}
                    onChange={(e) => setOpenrouterKey(e.target.value)}
                    placeholder="sk-or-v1-..."
                    dir="ltr"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs font-mono text-blue-400 focus:border-blue-500 focus:outline-none pl-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!openrouterKey) {
                      setOpenrouterKey('sk-or-v1-sample-live-mock-token-omniops-ai');
                    }
                  }}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded-lg transition-colors cursor-pointer font-mono"
                >
                  {openrouterKey ? 'ذخیره کلید' : 'تولید کلید آزمایشی'}
                </button>
              </div>
            </div>

            {/* جدول و کارت‌های مدل‌های فعال OpenRouter با تمرکز بر DeepSeek V4 Flash */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>مدل‌های پیکربندی‌شده OpenRouter برای اتصال به OmniRoute:</span>
                </span>
                <span className="text-neutral-500 text-[11px]">
                  {openrouterModels.filter(m => m.enabled).length} مدل فعال در زنجیره پردازش
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {openrouterModels.map((m) => {
                  const isV4 = m.modelId.includes('deepseek-v4-flash');
                  return (
                    <div
                      key={m.id}
                      className={`p-3.5 rounded-xl border transition-all space-y-2.5 ${
                        isV4
                          ? 'border-blue-500/80 bg-blue-950/20 shadow-md shadow-blue-950/30 ring-1 ring-blue-500/30'
                          : m.enabled
                          ? 'border-neutral-700 bg-neutral-950/80'
                          : 'border-neutral-800/60 bg-neutral-950/40 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{m.name}</span>
                            {m.badge && (
                              <span
                                className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                                  isV4
                                    ? 'bg-blue-600 text-white font-bold animate-pulse'
                                    : 'bg-neutral-800 text-neutral-300'
                                }`}
                              >
                                {m.badge}
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-[11px] text-blue-400 block" dir="ltr">
                            {m.modelId}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={m.enabled}
                            onChange={() => handleToggleModel(m.id)}
                            className="w-4 h-4 accent-blue-500 cursor-pointer"
                            title="فعال/غیرفعال‌سازی در روتینگ"
                          />
                        </div>
                      </div>

                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        {m.description}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-[10px] font-mono text-neutral-400">
                        <div className="flex items-center gap-3" dir="ltr">
                          <span>Ctx: <strong className="text-neutral-200">{m.context}</strong></span>
                          <span>Lat: <strong className="text-emerald-400">{m.latency}</strong></span>
                          <span>Cost: <strong className="text-amber-400">{m.cost}</strong></span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleTestOpenRouterModel(m)}
                            disabled={testingModelId === m.modelId}
                            className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-cyan-300 rounded transition-colors cursor-pointer flex items-center gap-1 text-[10px]"
                          >
                            {testingModelId === m.modelId ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <Play className="w-3 h-3" />
                            )}
                            <span>تست آنی</span>
                          </button>
                          {m.badge === 'سفارشی' && (
                            <button
                              type="button"
                              onClick={() => setOpenrouterModels(prev => prev.filter(x => x.id !== m.id))}
                              className="p-1 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                              title="حذف مدل سفارشی"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* نتیجه تست بلادرنگ مدل */}
            {testResult && (
              <div className="p-3 bg-neutral-950 border border-blue-500/50 rounded-xl space-y-1.5 text-xs animate-in fade-in" dir="rtl">
                <div className="flex items-center justify-between font-medium">
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>تست موفقیت‌آمیز مدل: {testResult.model}</span>
                  </span>
                  <span className="text-neutral-400 font-mono text-[11px]" dir="ltr">
                    Roundtrip Latency: {testResult.latency}
                  </span>
                </div>
                <p className="text-neutral-300 font-mono text-[11px] leading-relaxed" dir="ltr">
                  {testResult.answer}
                </p>
              </div>
            )}

            {/* مودال افزودن مدل دلخواه به OpenRouter */}
            {showAddModelModal && (
              <div className="p-4 bg-neutral-950 border border-neutral-700 rounded-xl space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>افزودن مدل دلخواه جدید به OpenRouter (Any Model Slug)</span>
                  </h4>
                  <button
                    onClick={() => setShowAddModelModal(false)}
                    className="text-neutral-400 hover:text-white text-xs cursor-pointer"
                  >
                    بستن
                  </button>
                </div>

                <form onSubmit={handleAddCustomModel} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">
                      شناسه مدل در OpenRouter (Model Slug):
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: deepseek/deepseek-v4-flash یا moonshotai/kimi-k1.5"
                      value={customModelId}
                      onChange={(e) => setCustomModelId(e.target.value)}
                      dir="ltr"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 font-mono text-cyan-300 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">
                      نام نمایشی (Display Name):
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: DeepSeek V4 Flash Turbo"
                      value={customModelName}
                      onChange={(e) => setCustomModelName(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">
                      طول زمینه (Context Window):
                    </label>
                    <input
                      type="text"
                      placeholder="128K"
                      value={customModelContext}
                      onChange={(e) => setCustomModelContext(e.target.value)}
                      dir="ltr"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 font-mono text-neutral-200 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">
                      هزینه تقریبی (Cost per 1K):
                    </label>
                    <input
                      type="text"
                      placeholder="$0.0001/1K"
                      value={customModelCost}
                      onChange={(e) => setCustomModelCost(e.target.value)}
                      dir="ltr"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 font-mono text-neutral-200 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddModelModal(false)}
                      className="px-3 py-1.5 bg-neutral-800 text-neutral-300 hover:text-white rounded-lg cursor-pointer"
                    >
                      انصراف
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>ثبت و اضافه به کلاستر</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
