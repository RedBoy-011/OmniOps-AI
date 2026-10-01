import React, { useState, useMemo } from 'react';
import { RAW_INSTALL_SCRIPT, FINGLISH_COMMENTS_EXPLANATIONS } from '../data/installScript';
import { Copy, Check, Download, Search, Sparkles, Code2, BookOpen, Layers, ExternalLink } from 'lucide-react';

interface ScriptInspectorProps {
  initialSearch?: string;
}

export const ScriptInspector: React.FC<ScriptInspectorProps> = ({ initialSearch = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [highlightFinglish, setHighlightFinglish] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showFinglishGuide, setShowFinglishGuide] = useState(false);

  const lines = useMemo(() => RAW_INSTALL_SCRIPT.split('\n'), []);

  const filteredLines = useMemo(() => {
    if (!searchQuery.trim()) {
      return lines.map((line, index) => ({ line, originalIndex: index + 1 }));
    }
    const query = searchQuery.toLowerCase();
    return lines
      .map((line, index) => ({ line, originalIndex: index + 1 }))
      .filter(({ line }) => line.toLowerCase().includes(query));
  }, [lines, searchQuery]);

  const copyScript = () => {
    navigator.clipboard.writeText(RAW_INSTALL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadScript = () => {
    const blob = new Blob([RAW_INSTALL_SCRIPT], { type: 'text/x-sh' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'install.sh';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Check if a line is a Finglish comment
  const isFinglishComment = (lineText: string) => {
    const trimmed = lineText.trim();
    if (!trimmed.startsWith('#')) return false;
    // Common Finglish tokens
    const finglishTokens = [
      'baraye', 'kardane', 'inke', 'soorate', 'vaghti', 'karbar', 'nasb', 'dastoor',
      'peyda', 'nashod', 'moshkel', 'tabe', 'hameye', 'sakhtane', 'check', 'bakhsh',
      'ertebat', 'shoma', 'khata', 'amaliat', 'nemikone', 'rooye', 'khorooji'
    ];
    const lower = trimmed.toLowerCase();
    return finglishTokens.some(token => lower.includes(token));
  };

  return (
    <div className="flex flex-col h-full bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Top Toolbar */}
      <div className="p-4 bg-neutral-900 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-white text-sm">install.sh Source Code</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
              Bash 4+ Modular
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search functions, comments..."
              className="pl-8 pr-3 py-1 bg-neutral-950 border border-neutral-700 rounded-md text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 w-48 sm:w-64"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Finglish highlighter toggle */}
          <button
            onClick={() => setHighlightFinglish(!highlightFinglish)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
              highlightFinglish
                ? 'bg-amber-950/40 border-amber-600/60 text-amber-300'
                : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white'
            }`}
            title="Toggle highlighting of Finglish developer comments"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Finglish Comments</span>
          </button>

          <button
            onClick={() => setShowFinglishGuide(!showFinglishGuide)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">DevOps Notes</span>
          </button>

          <button
            onClick={copyScript}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Script'}</span>
          </button>

          <button
            onClick={downloadScript}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Finglish Architecture Guide Panel */}
      {showFinglishGuide && (
        <div className="bg-neutral-900 border-b border-neutral-800 p-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              DevOps Architecture & Finglish Comment Analysis
            </h4>
            <button
              onClick={() => setShowFinglishGuide(false)}
              className="text-neutral-400 hover:text-white text-xs"
            >
              Close ✕
            </button>
          </div>
          <p className="text-xs text-neutral-400 mb-3">
            تمامی کامنت‌ها و راهنماهای توسعه‌دهنده در این اسکریپت با رعایت استاندارد دقیق فینگلیش نوشته شده‌اند. در جدول زیر نکات کلیدی و چرایی فنی هر تصمیم معماری را مشاهده می‌کنید:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {FINGLISH_COMMENTS_EXPLANATIONS.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded bg-neutral-950 border border-neutral-800/80">
                <code className="text-amber-400 font-mono text-[11px] block truncate mb-1">
                  {item.line}
                </code>
                <p className="text-neutral-300 text-[11px]">{item.devopsReason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Jump Bar */}
      <div className="px-4 py-2 bg-neutral-900/60 border-b border-neutral-800/80 flex items-center gap-2 overflow-x-auto text-[11px] font-mono text-neutral-400 scrollbar-none">
        <span className="text-neutral-500 shrink-0 flex items-center gap-1">
          <Layers className="w-3 h-3" /> Jump:
        </span>
        {[
          { label: 'Stdin & /dev/tty', query: 'dev/tty' },
          { label: 'ASCII Logo', query: 'show_banner' },
          { label: 'OS Detect', query: 'detect_os' },
          { label: 'Pre-flight Checks', query: 'run_preflight_checks' },
          { label: 'Whiptail Menu', query: 'show_architecture_menu' },
          { label: 'Dynamic .env', query: 'generate_env_file' },
          { label: 'Docker Compose', query: 'generate_docker_compose' },
          { label: 'Systemd Service', query: 'setup_systemd_service' },
          { label: 'Master Deploy', query: 'install_master' },
          { label: 'Edge Deploy', query: 'install_edge' },
          { label: 'Windows Agent', query: 'install_windows_agent_backend' }
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => setSearchQuery(item.query)}
            className="px-2 py-0.5 rounded bg-neutral-800/70 hover:bg-neutral-700 hover:text-white transition-colors shrink-0 cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Code Listing */}
      <div className="flex-1 overflow-y-auto font-mono text-xs p-4 bg-neutral-950 text-neutral-300 select-text leading-5">
        <div className="space-y-0.5">
          {filteredLines.map(({ line, originalIndex }) => {
            const isFinglish = isFinglishComment(line);
            const isFunctionDef = /^[a-zA-Z0-9_-]+\(\)\s*\{/.test(line.trim());
            const isHeaderComment = line.startsWith('# ---') || line.startsWith('# ===');
            const isNormalComment = line.trim().startsWith('#') && !isHeaderComment && !isFinglish;

            return (
              <div
                key={originalIndex}
                className={`flex items-start hover:bg-neutral-900/60 py-0.5 rounded px-1 transition-colors ${
                  highlightFinglish && isFinglish
                    ? 'bg-amber-950/20 text-amber-200 border-l-2 border-amber-500 pl-2'
                    : isFunctionDef
                    ? 'bg-emerald-950/20 border-l-2 border-emerald-500 pl-2'
                    : ''
                }`}
              >
                {/* Line number */}
                <span className="w-10 shrink-0 text-neutral-600 select-none text-right pr-3 font-mono text-[11px]">
                  {originalIndex}
                </span>

                {/* Code content */}
                <span
                  className={`flex-1 whitespace-pre-wrap break-all ${
                    isFinglish && highlightFinglish
                      ? 'text-amber-300 font-medium'
                      : isHeaderComment
                      ? 'text-cyan-500 font-bold'
                      : isNormalComment
                      ? 'text-neutral-500'
                      : isFunctionDef
                      ? 'text-emerald-400 font-bold'
                      : 'text-neutral-200'
                  }`}
                >
                  {line}
                </span>

                {/* Finglish badge indicator */}
                {isFinglish && highlightFinglish && (
                  <span className="hidden sm:inline-block shrink-0 text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-amber-900/60 text-amber-300 ml-2 select-none border border-amber-700/50">
                    Finglish
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Script Metadata Footer */}
      <div className="px-4 py-2 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
        <div className="flex items-center gap-3">
          <span>Lines: <strong className="text-white">{lines.length}</strong></span>
          <span>•</span>
          <span>Size: <strong className="text-white">~32.5 KB</strong></span>
          <span>•</span>
          <span>Format: <strong className="text-white">UNIX LF (UTF-8)</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-neutral-500">Ready for GitHub release</span>
        </div>
      </div>
    </div>
  );
};
