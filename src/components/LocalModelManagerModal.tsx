import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Download,
  Check,
  Play,
  RotateCcw,
  Sparkles,
  Server,
  Zap,
  HardDrive,
  Activity,
  X,
  Copy,
  ExternalLink,
  Shield,
  Layers,
  ArrowRight,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';

export interface LocalModelItem {
  id: string;
  name: string;
  tag: string;
  size: string;
  sizeBytes: number;
  parameters: string;
  minRam: string;
  description: string;
  category: 'reasoning' | 'general' | 'coding' | 'edge';
  status: 'available' | 'downloading' | 'installed';
  progress?: number;
  downloadSpeed?: string;
  downloadedBytes?: string;
  connectedToOmniRoute?: boolean;
  smartFallbackToCloud?: boolean;
}

interface LocalModelManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onModelConnectedChange?: (modelId: string, connected: boolean) => void;
}

export const LocalModelManagerModal: React.FC<LocalModelManagerModalProps> = ({
  isOpen,
  onClose,
  onModelConnectedChange
}) => {
  const [models, setModels] = useState<LocalModelItem[]>([
    {
      id: 'deepseek-r1-8b',
      name: 'DeepSeek-R1 Distill Llama 8B',
      tag: 'deepseek-r1:8b',
      size: '4.9 GB',
      sizeBytes: 4.9 * 1024 * 1024 * 1024,
      parameters: '8.0 Billion',
      minRam: '8 GB RAM (or 6 GB VRAM)',
      description: 'مدل تخصصی استدلال عمیق، حل معادلات ریاضی و برنامه‌نویسی با معماری تقطیرشده DeepSeek R1.',
      category: 'reasoning',
      status: 'installed',
      connectedToOmniRoute: true,
      smartFallbackToCloud: true
    },
    {
      id: 'deepseek-r1-14b',
      name: 'DeepSeek-R1 Distill Qwen 14B',
      tag: 'deepseek-r1:14b',
      size: '9.0 GB',
      sizeBytes: 9.0 * 1024 * 1024 * 1024,
      parameters: '14.7 Billion',
      minRam: '16 GB RAM (or 10 GB VRAM)',
      description: 'نسخه قدرتمندتر استدلال عمیق با توانایی بالا در حل تسک‌های چندمرحله‌ای و نگارش کدهای بدون نقص.',
      category: 'reasoning',
      status: 'available',
      connectedToOmniRoute: false,
      smartFallbackToCloud: true
    },
    {
      id: 'llama-3-3-70b',
      name: 'Llama 3.3 70B Instruct',
      tag: 'llama3.3:70b',
      size: '39.0 GB',
      sizeBytes: 39.0 * 1024 * 1024 * 1024,
      parameters: '70.6 Billion',
      minRam: '64 GB RAM (or 24 GB VRAM RTX 3090/4090)',
      description: 'پرچمدار بزرگ متن‌باز متا، عملکرد در سطح GPT-4o برای پاسخ به سوالات جامع سازمانی.',
      category: 'general',
      status: 'available',
      connectedToOmniRoute: false,
      smartFallbackToCloud: true
    },
    {
      id: 'llama-3-2-3b',
      name: 'Llama 3.2 3B Instruct',
      tag: 'llama3.2:3b',
      size: '2.0 GB',
      sizeBytes: 2.0 * 1024 * 1024 * 1024,
      parameters: '3.2 Billion',
      minRam: '4 GB RAM (Ultra-lightweight)',
      description: 'مدل فوق‌سریع و سبک برای پاسخگویی آنی، مناسب سرورهای بدون کارت گرافیک و دستگاه‌های لبه.',
      category: 'edge',
      status: 'installed',
      connectedToOmniRoute: true,
      smartFallbackToCloud: false
    },
    {
      id: 'qwen-2-5-coder-7b',
      name: 'Qwen 2.5 Coder 7B',
      tag: 'qwen2.5-coder:7b',
      size: '4.7 GB',
      sizeBytes: 4.7 * 1024 * 1024 * 1024,
      parameters: '7.6 Billion',
      minRam: '8 GB RAM',
      description: 'بهترین مدل متن‌باز تخصصی نگارش اسکریپت‌های پایتون، پاورشل، باش و رفع باگ‌های سیستمی.',
      category: 'coding',
      status: 'available',
      connectedToOmniRoute: false,
      smartFallbackToCloud: true
    },
    {
      id: 'mistral-nemo-12b',
      name: 'Mistral NeMo 12B',
      tag: 'mistral-nemo:12b',
      size: '7.1 GB',
      sizeBytes: 7.1 * 1024 * 1024 * 1024,
      parameters: '12.2 Billion',
      minRam: '12 GB RAM',
      description: 'پشتیبانی بی‌نظیر از زبان فارسی و متون تخصصی با پنجره زمینه بزرگ ۱۲۸ هزار توکن.',
      category: 'general',
      status: 'available',
      connectedToOmniRoute: false,
      smartFallbackToCloud: true
    }
  ]);

  const [activeCategory, setActiveCategory] = useState<'all' | 'reasoning' | 'general' | 'coding' | 'edge'>('all');
  const [downloadingModelId, setDownloadingModelId] = useState<string | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Simulating live progressive download
  useEffect(() => {
    if (!downloadingModelId) return;

    const interval = setInterval(() => {
      setModels((prev) =>
        prev.map((model) => {
          if (model.id === downloadingModelId) {
            const currentProg = model.progress || 0;
            if (currentProg >= 100) {
              clearInterval(interval);
              setDownloadingModelId(null);
              return {
                ...model,
                status: 'installed',
                progress: 100,
                connectedToOmniRoute: true,
                downloadSpeed: undefined,
                downloadedBytes: undefined
              };
            }

            const step = Math.floor(Math.random() * 8) + 6;
            const nextProg = Math.min(100, currentProg + step);
            const speed = `${(38 + Math.random() * 14).toFixed(1)} MB/s`;
            const downloaded = `${((nextProg / 100) * parseFloat(model.size)).toFixed(1)} GB / ${model.size}`;

            return {
              ...model,
              progress: nextProg,
              downloadSpeed: speed,
              downloadedBytes: downloaded
            };
          }
          return model;
        })
      );
    }, 600);

    return () => clearInterval(interval);
  }, [downloadingModelId]);

  if (!isOpen) return null;

  const handleStartDownload = (modelId: string) => {
    setModels((prev) =>
      prev.map((m) =>
        m.id === modelId
          ? {
              ...m,
              status: 'downloading',
              progress: 4,
              downloadSpeed: '35.4 MB/s',
              downloadedBytes: `0.2 GB / ${m.size}`
            }
          : m
      )
    );
    setDownloadingModelId(modelId);
  };

  const handleToggleOmniRouteConnect = (modelId: string) => {
    setModels((prev) =>
      prev.map((m) => {
        if (m.id === modelId) {
          const nextState = !m.connectedToOmniRoute;
          onModelConnectedChange?.(modelId, nextState);
          return { ...m, connectedToOmniRoute: nextState };
        }
        return m;
      })
    );
  };

  const handleToggleSmartFallback = (modelId: string) => {
    setModels((prev) =>
      prev.map((m) => (m.id === modelId ? { ...m, smartFallbackToCloud: !m.smartFallbackToCloud } : m))
    );
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const filteredModels = models.filter((m) => activeCategory === 'all' || m.category === activeCategory);

  const installedCount = models.filter((m) => m.status === 'installed').length;
  const connectedCount = models.filter((m) => m.connectedToOmniRoute).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200" dir="rtl">
      
      {/* Container e Modal */}
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl glass-surface-elevated border border-white/15 shadow-2xl overflow-hidden text-neutral-100">
        
        {/* Header e Modal */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between gap-4 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>مرکز دانلود و مدیریت مدل‌های هوش مصنوعی محلی (Local AI Runtimes)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  {installedCount} مدل نصب‌شده
                </span>
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                دانلود مستقیم مدل‌های آفلاین روی سرور، اتصال به هسته پردازشی OmniRoute و فال‌بک خودکار به OpenRouter
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl glass-surface hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="بستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="px-6 py-3 bg-black/40 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-neutral-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>موتور محلی: <strong className="text-white font-mono">Ollama Runtime (:11434)</strong></span>
            <span className="text-neutral-600">|</span>
            <span>مدل‌های فعال در روتر: <strong className="text-cyan-400 font-mono">{connectedCount} مدل</strong></span>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl">
            {[
              { id: 'all', label: 'همه مدل‌ها' },
              { id: 'reasoning', label: 'استدلال (R1)' },
              { id: 'general', label: 'عمومی (Llama/Mistral)' },
              { id: 'coding', label: 'کدنویسی (Qwen)' },
              { id: 'edge', label: 'سبک و لبه' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Model Cards Grid */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredModels.map((model) => {
              const isDownloading = model.status === 'downloading';
              const isInstalled = model.status === 'installed';

              return (
                <div
                  key={model.id}
                  className={`p-5 rounded-2xl glass-surface border transition-all space-y-4 ${
                    isInstalled
                      ? 'border-emerald-500/30 bg-emerald-950/[0.07]'
                      : isDownloading
                      ? 'border-cyan-500/40 bg-cyan-950/[0.12]'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Top: Name & Tag */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white tracking-tight">{model.name}</h3>
                        {isInstalled && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-400" />
                            نصب‌شده
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-mono text-cyan-300" dir="ltr">{model.tag}</span>
                        <span className="text-neutral-600">·</span>
                        <span className="text-xs font-mono text-neutral-400">{model.size}</span>
                        <span className="text-neutral-600">·</span>
                        <span className="text-xs font-mono text-purple-300">{model.parameters}</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-white/5 text-neutral-300 shrink-0">
                      <Cpu className="w-5 h-5 text-cyan-400" />
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-neutral-300 leading-relaxed min-h-[38px]">
                    {model.description}
                  </p>

                  {/* Hardware requirement badge */}
                  <div className="flex items-center justify-between text-[11px] p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-neutral-400 flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5 text-neutral-400" />
                      <span>سخت‌افزار مورد نیاز:</span>
                    </span>
                    <span className="text-white font-mono font-medium">{model.minRam}</span>
                  </div>

                  {/* Downloading Progress Bar */}
                  {isDownloading && (
                    <div className="space-y-2 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-cyan-300 flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                          <span>در حال دریافت بسته‌های وزن‌ها...</span>
                        </span>
                        <span className="text-white font-bold">{model.progress}%</span>
                      </div>

                      <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300 rounded-full"
                          style={{ width: `${model.progress}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                        <span>سرعت: <strong className="text-emerald-300">{model.downloadSpeed}</strong></span>
                        <span>حجم دریافتی: <strong className="text-cyan-300">{model.downloadedBytes}</strong></span>
                      </div>
                    </div>
                  )}

                  {/* Controls / Actions */}
                  <div className="pt-2 border-t border-white/5 space-y-2.5">
                    {/* If Installed: Routing toggles */}
                    {isInstalled ? (
                      <div className="space-y-2">
                        {/* Connect to OmniRoute */}
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs">
                          <div className="flex items-center gap-2">
                            <Zap className={`w-4 h-4 ${model.connectedToOmniRoute ? 'text-cyan-400' : 'text-neutral-500'}`} />
                            <span className="font-semibold text-white">اتصال مستقیم به روتر OmniRoute (:8000)</span>
                          </div>
                          <button
                            onClick={() => handleToggleOmniRouteConnect(model.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              model.connectedToOmniRoute
                                ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-950'
                                : 'bg-neutral-800 text-neutral-400 hover:text-white'
                            }`}
                          >
                            {model.connectedToOmniRoute ? 'متصل شد' : 'غیرفعال'}
                          </button>
                        </div>

                        {/* Fallback to OpenRouter */}
                        <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.01] text-[11px] text-neutral-400">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                            <span>فال‌بک هوشمند به OpenRouter (در صورت اشغال GPU):</span>
                          </span>
                          <button
                            onClick={() => handleToggleSmartFallback(model.id)}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                              model.smartFallbackToCloud ? 'bg-purple-600' : 'bg-neutral-800'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                model.smartFallbackToCloud ? '-translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* If Not Installed: Download button and CLI command */
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <button
                          onClick={() => handleStartDownload(model.id)}
                          disabled={isDownloading}
                          className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-cyan-950/60 disabled:opacity-50"
                        >
                          <Download className="w-4 h-4" />
                          <span>{isDownloading ? 'در حال دریافت...' : 'دانلود و نصب مستقیم در سرور'}</span>
                        </button>

                        <button
                          onClick={() => copyToClipboard(`ollama pull ${model.tag}`, model.id)}
                          className="w-full sm:w-auto px-3 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-neutral-300 hover:text-white text-xs font-mono cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                          title="کپی دستور ترمینال ollama"
                        >
                          {copiedCmd === model.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>CLI</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 border-t border-white/10 bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-neutral-400 flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>تمامی مدل‌های محلی با فرمت بهینه‌شده GGUF روی دیسک ذخیره می‌شوند و بدون نیاز به اینترنت قابل اجرا هستند.</span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all cursor-pointer"
          >
            تکمیل و بازگشت
          </button>
        </div>

      </div>

    </div>
  );
};
