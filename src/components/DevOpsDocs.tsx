import React, { useState } from 'react';
import { BookOpen, Github, Terminal, Shield, CheckCircle, Copy, Check, Server, AlertTriangle } from 'lucide-react';

export const DevOpsDocs: React.FC = () => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 shadow-2xl space-y-8">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          DevOps Deployment Manual & GitHub Publishing Guide
        </h3>
        <p className="text-xs text-neutral-400 mt-1">
          راهنمای جامع بارگذاری روی گیت‌هاب، نکات امنیتی، دستورات نگهداری و سازوکار مهندسی اسکریپت
        </p>
      </div>

      {/* Step 1: Upload to GitHub */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <Github className="w-4 h-4 text-emerald-400" />
          <span>1. بارگذاری فایل install.sh در گیت‌هاب (GitHub Repository Setup)</span>
        </div>
        <p className="text-xs text-neutral-300 leading-relaxed">
          برای اینکه دستور <code className="text-emerald-400 font-mono">curl -sL https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/install.sh | bash</code> بدون مشکل اجرا شود، مراحل زیر را در ریپازیتوری خود در آدرس <a href="https://github.com/RedBoy-011/OmniOps-AI" target="_blank" rel="noreferrer" className="text-emerald-400 underline">github.com/RedBoy-011/OmniOps-AI</a> انجام دهید:
        </p>

        <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg space-y-2 text-xs font-mono text-neutral-300">
          <div className="flex items-center justify-between text-neutral-400 text-[11px] pb-1 border-b border-neutral-800 font-sans">
            <span>Terminal Commands</span>
            <button
              onClick={() => copyToClipboard('git add install.sh && git commit -m "feat: unified installer wizard" && git push origin main', 'git')}
              className="flex items-center gap-1 hover:text-white"
            >
              {copiedCmd === 'git' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCmd === 'git' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="text-emerald-400"># ۱. دادن دسترسی اجرایی به فایل در گیت</div>
          <div>git update-index --chmod=+x install.sh</div>
          <div className="text-emerald-400"># ۲. اضافه کردن فایل‌های ویندوز ایجنت</div>
          <div>git add install.sh windows-agent/</div>
          <div>git commit -m "feat: add OmniOps AI Linux installer and Windows Coucou companion"</div>
          <div>git branch -M main</div>
          <div>git remote add origin https://github.com/RedBoy-011/OmniOps-AI.git</div>
          <div>git push -u origin main</div>
        </div>
      </div>

      {/* Step 2: The curl | bash secret */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>2. چرایی و نحوه حل مشکل ورودی کیبورد در curl | bash (Stdin Redirection)</span>
        </div>
        <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-lg text-xs text-neutral-300 space-y-2 leading-relaxed">
          <p>
            یکی از بزرگترین چالش‌های مهندسی اسکریپت‌های نصبی این است که وقتی کاربر دستور زیر را اجرا می‌کند:
          </p>
          <div className="p-2 bg-neutral-950 border border-neutral-800 rounded font-mono text-emerald-400 text-xs">
            curl -sL https://raw.githubusercontent.com/.../install.sh | bash
          </div>
          <p>
            ورودی استاندارد (<code className="text-amber-300 font-mono">stdin</code>) به پایپ دستور <code className="font-mono">curl</code> متصل است. در حالت عادی دستورات تعاملی مانند <code className="font-mono">read</code> بلافاصله با EOF بسته می‌شوند و منو یا ورودی کاربر کار نخواهد کرد!
          </p>
          <p className="text-neutral-400">
            برای حل حرفه‌ای این مسئله، در بخش ابتدایی <code className="text-cyan-300 font-mono">install.sh</code> تکنیک مهندسی لینوکس زیر اعمال شده است:
          </p>
          <pre className="p-2 bg-neutral-950 border border-neutral-800 rounded font-mono text-[11px] text-amber-300">
{`if [ ! -t 0 ]; then
    if [ -e /dev/tty ]; then
        exec < /dev/tty
    fi
fi`}
          </pre>
          <p className="text-neutral-400 text-[11px]">
            این کد در صورت وجود پایپ، مجدداً ورودی را به ترمینال واقعی کاربر (<code className="text-white">/dev/tty</code>) وصل می‌کند تا منوی جهتنما (Arrow Keys) و سوالات دریافت پورت کاملاً تعاملی و بدون نقص کار کنند.
          </p>
        </div>
      </div>

      {/* Step 3: Firewall & Ports */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>3. جدول پورت‌ها و فایروال (Firewall Matrix)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-neutral-300 font-mono border border-neutral-800 rounded-lg">
            <thead className="bg-neutral-900 text-neutral-400 text-[11px] uppercase">
              <tr>
                <th className="p-2.5">Port</th>
                <th className="p-2.5">Protocol</th>
                <th className="p-2.5">Component</th>
                <th className="p-2.5">Access Scope</th>
                <th className="p-2.5">UFW / Firewall Rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              <tr className="hover:bg-neutral-900/40">
                <td className="p-2.5 text-emerald-400 font-bold">8080/tcp</td>
                <td className="p-2.5">HTTP / REST</td>
                <td className="p-2.5">Master Control-Plane</td>
                <td className="p-2.5">Public / VPN</td>
                <td className="p-2.5 text-neutral-400">ufw allow 8080/tcp</td>
              </tr>
              <tr className="hover:bg-neutral-900/40">
                <td className="p-2.5 text-cyan-400 font-bold">9090/tcp</td>
                <td className="p-2.5">mTLS / gRPC</td>
                <td className="p-2.5">Edge Worker Node</td>
                <td className="p-2.5">Local / Mesh</td>
                <td className="p-2.5 text-neutral-400">ufw allow 9090/tcp</td>
              </tr>
              <tr className="hover:bg-neutral-900/40">
                <td className="p-2.5 text-purple-400 font-bold">7070/tcp</td>
                <td className="p-2.5">WebSocket</td>
                <td className="p-2.5">Windows Agent Gateway</td>
                <td className="p-2.5">Agent Clients</td>
                <td className="p-2.5 text-neutral-400">ufw allow 7070/tcp</td>
              </tr>
              <tr className="hover:bg-neutral-900/40">
                <td className="p-2.5 text-neutral-500">5432/tcp</td>
                <td className="p-2.5">TCP</td>
                <td className="p-2.5">PostgreSQL 16</td>
                <td className="p-2.5 text-amber-400">Internal Only</td>
                <td className="p-2.5 text-neutral-500">Do NOT expose externally</td>
              </tr>
              <tr className="hover:bg-neutral-900/40">
                <td className="p-2.5 text-neutral-500">6379/tcp</td>
                <td className="p-2.5">TCP</td>
                <td className="p-2.5">Redis 7</td>
                <td className="p-2.5 text-amber-400">Internal Only</td>
                <td className="p-2.5 text-neutral-500">Do NOT expose externally</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Step 4: Maintenance Commands */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <Server className="w-4 h-4 text-emerald-400" />
          <span>4. دستورات مانیتورینگ و لاگ‌های دائم (Systemd & Docker Logs)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg space-y-1">
            <span className="text-neutral-400 block font-medium">بررسی وضعیت سرویس پس‌زمینه Master:</span>
            <code className="text-emerald-400 font-mono block bg-black/60 p-1.5 rounded text-[11px]">
              systemctl status omniops-master.service
            </code>
          </div>

          <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg space-y-1">
            <span className="text-neutral-400 block font-medium">مشاهده زنده لاگ‌های داکر:</span>
            <code className="text-emerald-400 font-mono block bg-black/60 p-1.5 rounded text-[11px]">
              cd /opt/omniops-ai/master && docker compose logs -f
            </code>
          </div>

          <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg space-y-1">
            <span className="text-neutral-400 block font-medium">ریستارت کردن کانتینرها:</span>
            <code className="text-emerald-400 font-mono block bg-black/60 p-1.5 rounded text-[11px]">
              systemctl restart omniops-master.service
            </code>
          </div>

          <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg space-y-1">
            <span className="text-neutral-400 block font-medium">تغییر متغیرهای محیطی:</span>
            <code className="text-emerald-400 font-mono block bg-black/60 p-1.5 rounded text-[11px]">
              nano /opt/omniops-ai/master/.env && docker compose up -d
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};
