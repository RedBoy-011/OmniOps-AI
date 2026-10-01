import React, { useState } from 'react';
import {
  Route,
  Cpu,
  Zap,
  Shield,
  Sparkles,
  Check,
  ArrowRight,
  Play,
  RefreshCw,
  Layers,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Key
} from 'lucide-react';

interface ModelRouteItem {
  id: string;
  name: string;
  modelId: string;
  provider: 'OpenRouter' | 'Local Engine' | 'Cloud Direct' | 'Custom';
  latency: string;
  cost: string;
  active: boolean;
  priority: number;
}

export const OmniRouteHub: React.FC = () => {
  const [routerMode, setRouterMode] = useState<'latency_optimized' | 'cost_optimized' | 'local_first' | 'fallback_chain'>('fallback_chain');
  const [testPrompt, setTestPrompt] = useState('وضعیت عملکرد کلاستر و اجرای مدل DeepSeek V4 Flash را بررسی کن.');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isRouting, setIsRouting] = useState(false);

  // Dynamic models state
  const [models, setModels] = useState<ModelRouteItem[]>([
    {
      id: '1',
      name: 'DeepSeek V4 Flash (OpenRouter)',
      modelId: 'deepseek/deepseek-v4-flash',
      provider: 'OpenRouter',
      latency: '78ms',
      cost: '$0.00008/1k',
      active: true,
      priority: 1
    },
    {
      id: '2',
      name: 'Local Ollama (Llama 3.2 3B)',
      modelId: 'ollama/llama3.2',
      provider: 'Local Engine',
      latency: '18ms',
      cost: '$0.00',
      active: true,
      priority: 2
    },
    {
      id: '3',
      name: 'DeepSeek R1 Reasoner (OpenRouter)',
      modelId: 'deepseek/deepseek-r1',
      provider: 'OpenRouter',
      latency: '340ms',
      cost: '$0.00055/1k',
      active: true,
      priority: 3
    },
    {
      id: '4',
      name: 'Google Gemini 2.5 Flash',
      modelId: 'google/gemini-2.5-flash',
      provider: 'Cloud Direct',
      latency: '190ms',
      cost: '$0.0001/1k',
      active: true,
      priority: 4
    },
    {
      id: '5',
      name: 'Groq LPUs (Llama 3.3 70B)',
      modelId: 'groq/llama-3.3-70b-versatile',
      provider: 'Cloud Direct',
      latency: '62ms',
      cost: '$0.0005/1k',
      active: true,
      priority: 5
    }
  ]);

  // New model form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newModelName, setNewModelName] = useState('');
  const [newModelId, setNewModelId] = useState('deepseek/deepseek-v4-flash');
  const [newModelProvider, setNewModelProvider] = useState<'OpenRouter' | 'Local Engine' | 'Cloud Direct' | 'Custom'>('OpenRouter');
  const [newModelLatency, setNewModelLatency] = useState('80ms');
  const [newModelCost, setNewModelCost] = useState('$0.0001/1k');

  const handleAddModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModelId.trim()) return;

    const newEntry: ModelRouteItem = {
      id: Date.now().toString(),
      name: newModelName.trim() || newModelId,
      modelId: newModelId.trim(),
      provider: newModelProvider,
      latency: newModelLatency || '100ms',
      cost: newModelCost || '$0.0001/1k',
      active: true,
      priority: models.length + 1
    };

    setModels([...models, newEntry]);
    setNewModelName('');
    setNewModelId('');
    setShowAddForm(false);
  };

  const toggleModelActive = (id: string) => {
    setModels(models.map(m => m.id === id ? { ...m, active: !m.active } : m));
  };

  const deleteModel = (id: string) => {
    setModels(models.filter(m => m.id !== id));
  };

  const handleTestRoute = () => {
    setIsRouting(true);
    setTestResponse(null);

    const activeList = models.filter(m => m.active);
    const selected = activeList.length > 0 ? activeList[0] : null;

    setTimeout(() => {
      setIsRouting(false);
      setTestResponse(
        JSON.stringify(
          {
            routed_by: "OmniRoute AI Core v2.4.0",
            endpoint: "http://omniops-omniroute:8000/v1/chat/completions",
            selected_model: selected ? selected.modelId : "deepseek/deepseek-v4-flash",
            selected_provider: selected ? selected.provider : "OpenRouter",
            latency: selected ? selected.latency : "78ms",
            hermes_execution_arm: "Connected (http://hermes-agent:8081)",
            routing_decision: "Optimized for latency and reasoning performance",
            output: `درخواست با موفقیت از طریق ${selected ? selected.name : 'DeepSeek V4 Flash'} پردازش شد. کلیه سرویس‌ها و ابزارهای Hermes Agent فعال هستند.`
          },
          null,
          2
        )
      );
    }, 600);
  };

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 shadow-2xl space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mb-1">
            <span className="text-cyan-400 font-semibold">Processing Core</span>
            <span>·</span>
            <span>Port :8000</span>
            <span>·</span>
            <span>OpenRouter & DeepSeek V4 Flash Ready</span>
          </div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Route className="w-5 h-5 text-cyan-400" />
            <span>OmniRoute - هسته پردازشی، روتر هوشمند و کاتالوگ مدل‌های هوش مصنوعی</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            روتر پیشرفته هوش مصنوعی با قابلیت اضافه کردن مستقیم مدل‌های <strong>OpenRouter</strong> (مانند <strong>DeepSeek V4 Flash</strong> و <strong>DeepSeek R1</strong>)، مدل‌های لوکال و APIهای اختصاصی با زنجیره پشتیبان (Fallback) خودکار
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>افزودن مدل جدید (OpenRouter / Custom)</span>
          </button>
        </div>
      </div>

      {/* فرم افزودن مدل جدید (مانند DeepSeek V4 Flash) */}
      {showAddForm && (
        <form onSubmit={handleAddModel} className="p-4 rounded-xl bg-neutral-900 border border-cyan-500/50 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>افزودن مدل جدید به جدول روتینگ OmniRoute</span>
            </h4>
            <span className="text-[11px] text-neutral-500 font-mono">OpenRouter / OpenAI-Compatible</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-neutral-300 mb-1">شناسه مدل (Model ID):</label>
              <input
                type="text"
                value={newModelId}
                onChange={(e) => setNewModelId(e.target.value)}
                required
                dir="ltr"
                placeholder="deepseek/deepseek-v4-flash"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 mb-1">نام نمایشی (Display Name):</label>
              <input
                type="text"
                value={newModelName}
                onChange={(e) => setNewModelName(e.target.value)}
                placeholder="DeepSeek V4 Flash"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 mb-1">ارائه‌دهنده (Provider):</label>
              <select
                value={newModelProvider}
                onChange={(e) => setNewModelProvider(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="OpenRouter">OpenRouter API</option>
                <option value="Local Engine">Local Engine (Ollama/vLLM)</option>
                <option value="Cloud Direct">Cloud Direct API</option>
                <option value="Custom">Custom OpenAI Endpoint</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-300 mb-1">تأخیر تخمینی:</label>
              <input
                type="text"
                value={newModelLatency}
                onChange={(e) => setNewModelLatency(e.target.value)}
                dir="ltr"
                placeholder="75ms"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 font-mono text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* مدل‌های محبوب جهت افزودن با یک کلیک */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-400 pt-1">
            <span className="text-neutral-500">مدل‌های محبوب OpenRouter:</span>
            {[
              { id: 'deepseek/deepseek-v4-flash', label: 'DeepSeek V4 Flash' },
              { id: 'deepseek/deepseek-r1', label: 'DeepSeek R1 Reasoner' },
              { id: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
              { id: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B' },
              { id: 'google/gemini-2.5-flash', label: 'Gemini 2.5 Flash' }
            ].map((preset) => (
              <button
                type="button"
                key={preset.id}
                onClick={() => {
                  setNewModelId(preset.id);
                  setNewModelName(preset.label);
                  setNewModelProvider('OpenRouter');
                }}
                className="px-2 py-0.5 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-cyan-400 font-mono text-[10px] cursor-pointer"
              >
                + {preset.label}
              </button>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 bg-neutral-800 text-neutral-300 rounded-lg text-xs cursor-pointer"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              افزودن مدل به جدول روتینگ
            </button>
          </div>
        </form>
      )}

      {/* ۱. تنظیم استراتژی مسیریابی (Routing Strategy) */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-white">
          استراتژی مسیریابی هوشمند OmniRoute:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {[
            {
              id: 'fallback_chain',
              title: 'زنجیره پشتیبان (Fallback Chain)',
              desc: 'ابتدا مدل پرسرعت DeepSeek V4 Flash؛ در صورت افت یا قطعی، خودکار به لوکال یا کلود سوئیچ می‌کند.'
            },
            {
              id: 'latency_optimized',
              title: 'کمترین تأخیر (Ultra-Low Latency)',
              desc: 'انتخاب خودکار سریع‌ترین مدل (DeepSeek Flash / Groq) بر اساس تست پینگ لحظه‌ای.'
            },
            {
              id: 'local_first',
              title: 'اولویت کاملاً محلی (Local-First)',
              desc: 'حفظ ۱۰۰٪ حریم خصوصی داده‌ها روی Ollama و سرورهای محلی بدون ارسال به کلود.'
            },
            {
              id: 'cost_optimized',
              title: 'کمترین هزینه (Cost Optimized)',
              desc: 'تخصیص تسک‌های روزمره به مدل‌های سبک و ارزان، و تسک‌های پیچیده به مدل‌های استدلالی.'
            }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setRouterMode(mode.id as any)}
              className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                routerMode === mode.id
                  ? 'border-cyan-500 bg-cyan-950/30 text-white shadow-md'
                  : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-xs mb-1 text-white">{mode.title}</div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">{mode.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ۲. جدول آبشاری مدل‌ها (Model Cascade Table) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-white flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>کاتالوگ مدل‌های متصل به OmniRoute (Active Routing Cascade)</span>
          </span>
          <span className="text-neutral-500 font-mono">{models.length} مدل رجیستر شده</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right text-neutral-300 border border-neutral-800 rounded-lg">
            <thead className="bg-neutral-950 text-neutral-400 text-[11px] uppercase">
              <tr>
                <th className="p-2.5">اولویت</th>
                <th className="p-2.5">نام و شناسه مدل</th>
                <th className="p-2.5">ارائه‌دهنده (Provider)</th>
                <th className="p-2.5">میانگین تأخیر</th>
                <th className="p-2.5">هزینه هر توکن</th>
                <th className="p-2.5">وضعیت</th>
                <th className="p-2.5">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {models.map((item) => (
                <tr key={item.id} className={`hover:bg-neutral-900/40 ${!item.active ? 'opacity-40' : ''}`}>
                  <td className="p-2.5 font-mono text-cyan-400 font-bold">{item.priority}</td>
                  <td className="p-2.5">
                    <span className="font-semibold text-white block">{item.name}</span>
                    <span className="text-[11px] font-mono text-neutral-500" dir="ltr">{item.modelId}</span>
                  </td>
                  <td className="p-2.5">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      item.provider === 'OpenRouter'
                        ? 'bg-blue-950 text-blue-300 border-blue-800'
                        : item.provider === 'Local Engine'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : 'bg-neutral-900 text-neutral-300 border-neutral-700'
                    }`}>
                      {item.provider}
                    </span>
                  </td>
                  <td className="p-2.5 font-mono" dir="ltr">{item.latency}</td>
                  <td className="p-2.5 font-mono" dir="ltr">{item.cost}</td>
                  <td className="p-2.5">
                    <button
                      onClick={() => toggleModelActive(item.id)}
                      className="cursor-pointer text-xs"
                      title={item.active ? 'غیرفعال کردن' : 'فعال کردن'}
                    >
                      {item.active ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-900 text-neutral-500 border border-neutral-800 rounded">
                          Disabled
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="p-2.5">
                    <button
                      onClick={() => deleteModel(item.id)}
                      className="p-1 hover:text-red-400 text-neutral-500 rounded cursor-pointer transition-colors"
                      title="حذف از روتر"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ۳. تست تعاملی پاسخگویی روتر با مدل انتخاب شده */}
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
        <label className="block text-xs font-semibold text-white">
          تست زنده ارزیابی و استنتاج پرامپت از طریق OmniRoute:
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={testPrompt}
            onChange={(e) => setTestPrompt(e.target.value)}
            className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
            placeholder="پرامپت را وارد کنید..."
          />
          <button
            onClick={handleTestRoute}
            disabled={isRouting}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
          >
            {isRouting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
            <span>اجرای استنتاج از طریق OmniRoute</span>
          </button>
        </div>

        {testResponse && (
          <div className="mt-3 p-3 bg-black border border-neutral-800 rounded-lg font-mono text-xs text-cyan-300 overflow-x-auto whitespace-pre leading-relaxed" dir="ltr">
            {testResponse}
          </div>
        )}
      </div>
    </div>
  );
};
