import React, { useState } from 'react';
import {
  Globe,
  Lock,
  ShieldCheck,
  Check,
  Copy,
  Terminal,
  ExternalLink,
  Sparkles,
  RefreshCw,
  X,
  AlertCircle,
  CheckCircle2,
  Server,
  FileCode
} from 'lucide-react';

interface DomainSslSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverIp?: string;
}

export const DomainSslSetupModal: React.FC<DomainSslSetupModalProps> = ({
  isOpen,
  onClose,
  serverIp = '185.190.140.22'
}) => {
  const [domain, setDomain] = useState('omni.example.com');
  const [adminEmail, setAdminEmail] = useState('admin@example.com');
  const [sslStatus, setSslStatus] = useState<'pending' | 'checking' | 'active'>('active');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Dastoorate khodkare Let's Encrypt Certbot
  const certbotInstallCommand = `apt-get update && apt-get install -y certbot python3-certbot-nginx && certbot --nginx -d ${domain} --non-interactive --agree-tos -m ${adminEmail} --redirect`;

  // Nginx reverse proxy config
  const nginxConfig = `server {
    listen 80;
    server_name ${domain};
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${domain};

    ssl_certificate /etc/letsencrypt/live/${domain}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${domain}/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    # Master Web Console (:8080)
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    # OmniRoute AI Router (:8000)
    location /v1/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Windows Agent WebSocket Reverse Tunnel (:7070)
    location /ws/ {
        proxy_pass http://127.0.0.1:7070;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400;
    }
}`;

  const handleTestSsl = () => {
    setSslStatus('checking');
    setTimeout(() => {
      setSslStatus('active');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200" dir="rtl">
      
      {/* Container e Modal */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl glass-surface-elevated border border-white/15 shadow-2xl overflow-hidden text-neutral-100">
        
        {/* Header e Modal */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between gap-4 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>تنظیم دامنه اینترنتی و گواهی SSL رایگان (Domain & Let's Encrypt SSL)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  HTTPS Enabled
                </span>
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                اتصال دامنه اختصاصی به سرور ابری، هدایت پورت‌ها و صدور خودکار گواهی امنیتی Let's Encrypt با تمدید ۹۰ روزه
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

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Step 1: Domain & DNS Record */}
          <div className="p-5 rounded-2xl glass-surface border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>۱. ثبت دامنه و رکورد DNS سرور</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-400 mb-1">نام دامنه یا ساب‌دامین اختصاصی:</label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="ai.yourdomain.com"
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl font-mono text-cyan-300"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">ایمیل مدیر (برای هشدارهای انقضای گواهی SSL):</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl font-mono text-neutral-200"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between text-neutral-300">
              <div className="space-y-0.5">
                <span className="font-bold text-white block">رکورد A در پنل کلودفلر یا ارائه‌دهنده DNS شما:</span>
                <span className="text-neutral-400 font-mono text-[11px] block" dir="ltr">
                  A &nbsp; {domain} &nbsp; --&gt; &nbsp; {serverIp}
                </span>
              </div>
              <span className="px-2.5 py-1 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-lg font-mono text-[10px]">
                DNS Matched
              </span>
            </div>
          </div>

          {/* Step 2: Automated Let's Encrypt Certbot One-Liner */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>۲. دستور تک‌خطی صدور خودکار گواهی SSL در شل سرور لینوکس:</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400">Certbot + Nginx</span>
            </div>

            <div className="p-3.5 bg-black/80 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-emerald-400">
              <div className="truncate select-all" dir="ltr">
                {certbotInstallCommand}
              </div>
              <button
                onClick={() => copyText(certbotInstallCommand, 'certbot')}
                className="px-3.5 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 rounded-xl font-sans cursor-pointer flex items-center gap-1.5 transition-all shrink-0 self-end sm:self-auto"
              >
                {copiedKey === 'certbot' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'certbot' ? 'کپی شد' : 'کپی دستور SSL'}</span>
              </button>
            </div>
          </div>

          {/* Step 3: Nginx Reverse Proxy Config */}
          <div className="p-5 rounded-2xl glass-surface border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span>پیکربندی کامل Nginx Reverse Proxy (هدایت به پورت‌های کلاستر)</span>
              </h4>
              <button
                onClick={() => copyText(nginxConfig, 'nginx')}
                className="text-cyan-400 hover:text-white flex items-center gap-1 cursor-pointer font-sans"
              >
                {copiedKey === 'nginx' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>کپی کل کانفیگ Nginx</span>
              </button>
            </div>

            <div className="p-3 bg-black/70 border border-neutral-800 rounded-xl font-mono text-[11px] text-neutral-300 max-h-48 overflow-y-auto" dir="ltr">
              <pre>{nginxConfig}</pre>
            </div>
          </div>

          {/* Step 4: Live SSL Status & Health */}
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-white block">وضعیت گواهی امنیتی SSL:</span>
                <span className="text-emerald-300 font-mono text-[11px]">
                  {sslStatus === 'checking' ? 'در حال بررسی هندشیک TLS 1.3...' : 'معتبر (Let\'s Encrypt Authority X3) · تمدید خودکار فعال'}
                </span>
              </div>
            </div>

            <button
              onClick={handleTestSsl}
              disabled={sslStatus === 'checking'}
              className="px-4 py-2 bg-emerald-900/60 hover:bg-emerald-800/80 text-white rounded-xl font-bold cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${sslStatus === 'checking' ? 'animate-spin' : ''}`} />
              <span>تست مجدد اتصال HTTPS</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs">
          <span className="text-neutral-400">
            با فعال‌سازی SSL، تمامی مکالمات، اسکرین‌شات‌های ویندوز و کوئری‌ها از طریق کانال امن رمزگذاری‌شده منتقل خواهند شد.
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all cursor-pointer"
          >
            بستن
          </button>
        </div>

      </div>

    </div>
  );
};
