# OmniOps AI - Distributed Artificial Intelligence Operating System
> سیستم‌عامل توزیع‌شده هوش مصنوعی، روتر هوشمند مدل‌ها و بازوی اجرایی مستقل ابری-لبه

[![Release](https://img.shields.io/badge/Release-v2.4.0--stable-emerald?style=flat-square)](https://github.com/RedBoy-011/OmniOps-AI/releases)
[![Platform](https://img.shields.io/badge/Platform-Linux%20%7C%20Windows%2010%2F11-blue?style=flat-square)](https://github.com/RedBoy-011/OmniOps-AI)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![License](https://img.shields.io/badge/License-MIT-amber?style=flat-square)](LICENSE)

```text
 ██████╗ ███╗   ███╗███╗   ██╗██╗ ██████╗ ██████╗ ███████╗   █████╗ ██╗
██╔═══██╗████╗ ████║████╗  ██║██║██╔═══██╗██╔══██╗██╔════╝  ██╔══██╗██║
██║   ██║██╔████╔██║██╔██╗ ██║██║██║   ██║██████╔╝███████╗  ███████║██║
██║   ██║██║╚██╔╝██║██║╚██╗██║██║██║   ██║██╔═══╝ ╚════██║  ██╔══██║██║
╚██████╔╝██║ ╚═╝ ██║██║ ╚████║██║╚██████╔╝██║     ███████║  ██║  ██║██║
 ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝ ╚═════╝ ╚═╝     ╚══════╝  ╚═╝  ╚═╝╚═╝
```

---

## ⚡ ۱. دستورات راه‌اندازی سریع با یک خط (Quickstart One-Liners)

### 🐧 الف) راه‌اندازی روی سرور لینوکس (Linux Server / VPS)
این دستور اسکریپت جادویی `install.sh` را به صورت کاملاً تعاملی اجرا کرده، داکر و پایتون را بررسی نموده و هسته کلاستر، OmniRoute و Hermes Agent را کانفیگ می‌کند:

```bash
curl -sL https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/install.sh | bash
```

### 🪟 ب) راه‌اندازی ایجنت دسکتاپ ویندوز (Windows Desktop Coucou Agent)
روی کامپیوتر یا لپ‌تاپ ویندوز ۱۰ یا ۱۱ خود، برنامه **PowerShell** را باز کرده و دستور زیر را اجرا کنید تا ایجنت همیار در System Tray کنار ساعت ویندوز مستقر شود:

```powershell
irm https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/windows-agent/install-agent.ps1 | iex
```

---

## 🏛️ ۲. معماری اجزای کلیدی سیستم (System Architecture)

پروژه **OmniOps AI** بر اساس ۴ رکن اساسی و هماهنگ طراحی شده است:

```
                           ┌──────────────────────────────────────────────┐
                           │            OmniRoute (Port :8000)            │
                           │   هسته پردازشی و روتر هوشمند مدل‌های AI      │
                           └──────────────┬───────────────────────────────┘
                                          │
                 ┌────────────────────────┴────────────────────────┐
                 ▼                                                 ▼
   ┌───────────────────────────┐                     ┌───────────────────────────┐
   │    Local AI Runtimes      │                     │     Cloud AI Providers    │
   │  - Ollama (:11434)        │                     │  - OpenRouter (DeepSeek V4│
   │  - vLLM (GPU Acceleration)│                     │    Flash & DeepSeek R1)   │
   │  - LM Studio              │                     │  - Google Gemini 2.5 Flash│
   │                           │                     │  - Groq LPUs & OpenAI     │
   └─────────────┬─────────────┘                     └─────────────┬─────────────┘
                 │                                                 │
                 └────────────────────────┬────────────────────────┘
                                          │
                                          ▼ (SOCKS5 / Direct)
                           ┌──────────────────────────────┐
                           │    Hermes Agent (:8081)      │
                           │ بازوی اجرایی و سندباکس ابزارها│
                           └──────────────┬───────────────┘
                                          │ (Reverse WebSocket Tunnel)
                                          ▼
                           ┌──────────────────────────────┐
                           │ Windows Coucou Desktop Agent │
                           │   (اتصال بدون نیاز به پورت)  │
                           └──────────────────────────────┘
```

### ۱. هسته پردازشی OmniRoute (Processing Core & AI Router)
- مستقر روی پورت `8000` با سازگاری کامل با فرمت OpenAI API (`/v1/chat/completions`).
- **پشتیبانی مستقیم از OpenRouter:** دسترسی به مدل‌های روز نظیر `deepseek/deepseek-v4-flash`، `deepseek/deepseek-r1` و سایر مدل‌های قدرتمند تنها با یک کلید API.
- **مسیریابی آبشاری (Fallback Cascade):** در صورتی که اینترنت قطع شود یا پردازنده پر باشد، به صورت خودکار بین مدل‌های لوکال (Ollama) و کلاود (DeepSeek V4 Flash, Gemini, Groq) سوئیچ می‌کند.
- مجهز به حالت‌های مسیریابی: `latency_optimized` (کمترین تأخیر)، `cost_optimized` (کمترین هزینه) و `local_first` (حریم خصوصی کامل).

### ۲. بازوی اجرایی Hermes Agent (Execution Arm)
- مستقر روی پورت `8081` به عنوان ایجنت مستقل اجرای ابزارها (Tool-Calling Agent).
- متصل به OmniRoute به عنوان مغز تفکر (`HERMES_LLM_BACKEND=http://omniops-omniroute:8000/v1`).
- دارای سندباکس ایزوله داکر برای اجرای شل لینوکس (`bash_sandbox`)، اسکریپت پایتون (`python_runner`)، کوئری دیتابیس و ارتباط با دسکتاپ ویندوز.
- مجهز به مکانیزم خودترمیمی (Self-Healing).

### ۳. ایجنت دسکتاپ ویندوز (OmniOps Coucou Companion)
- الهام‌گرفته از معماری پروژه موفق [Louis-CFM/coucou](https://github.com/Louis-CFM/coucou).
- ایجاد تانل دوطرفه وب‌سوکت معکوس (`ws://...:7070`) به سرور کلاود **بدون نیاز به Port Forwarding یا IP استاتیک**.
- ارسال تله‌متری زنده (CPU, RAM, GPU, دیسک) و دریافت دستورات اتوماسیون.

### ۴. پشتیبانی ویژه از ساکس‌پراکسی (SOCKS5 Proxy & Reverse Proxy Link)
برای سرورها یا سیستم‌های داخل ایران که با خطای تحریم (403 Forbidden) از سمت Google Gemini یا OpenAI مواجه می‌شوند، پشتیبانی مستقیم از ساکس‌پراکسی تعبیه شده است:
- پشتیبانی از نرم‌افزارهای V2Ray/Xray روی `socks5://127.0.0.1:10808`
- پشتیبانی از Clash روی `http://127.0.0.1:7890`
- پشتیبانی از لینک‌های سفارشی ریورس پراکسی یا ورکر کلودفلر (Custom Base URL).

---

## 🛠️ ۳. نحوه راه‌اندازی و استفاده گام‌به‌گام (Step-by-Step Guide)

### مرحله اول: کلون کردن ریپازیتوری
```bash
git clone https://github.com/RedBoy-011/OmniOps-AI.git
cd OmniOps-AI
```

### مرحله دوم: اجرای اسکریپت نصب
```bash
chmod +x install.sh
./install.sh
```

### مرحله سوم: انتخاب نقش مورد نظر در منو
اسکریپت به شما منوی زیر را نمایش می‌دهد:
1. **Full Suite (پیشنهادی):** نصب یکپارچه Master + OmniRoute + Hermes Agent با پیکربندی خودکار.
2. **OmniRoute Core:** نصب اختصاصی هسته روتر مدل‌ها روی پورت ۸۰۰۰.
3. **Hermes Agent:** نصب بازوی اجرایی اتوماسیون روی پورت ۸۰۸۱.
4. **Edge/Worker Node:** اتصال سرور پردازشی و کارت‌های گرافیک GPU به کلاستر.
5. **Windows Agent Backend:** راه‌اندازی گیت‌وی وب‌سوکت برای کلاینت‌های ویندوز.

### مرحله چهارم: ورود به پنل مدیریت وب (Web Console)
پس از اتمام نصب، مرورگر خود را باز کرده و به آدرس زیر بروید:
```text
http://<SERVER_IP>:8080
```
- **نام کاربری پیش‌فرض:** `admin@omniops.ai`
- **کلمه عبور:** تولیدشده در فایل `/opt/omniops-ai/master/.env` (یا دکمه ورود سریع ادمین در محیط پیش‌نمایش).

---

## 🔒 ۴. جدول پورت‌ها و تنظیمات فایروال (Firewall Matrix)

| پورت | پروتکل | کامپوننت | وضعیت دسترسی | دستور فایروال (UFW) |
| :--- | :--- | :--- | :--- | :--- |
| `8080/tcp` | HTTP | Master Web Console & API | عمومی / VPN | `ufw allow 8080/tcp` |
| `8000/tcp` | HTTP | OmniRoute AI Model Router | داخلی / کلاستر | `ufw allow 8000/tcp` |
| `8081/tcp` | HTTP | Hermes Execution Arm | داخلی کلاستر | `ufw allow 8081/tcp` |
| `7070/tcp` | WebSocket | Windows Agent Coucou Gateway | کلاینت‌های دسکتاپ | `ufw allow 7070/tcp` |
| `9090/tcp` | mTLS | Edge Worker Node Listener | شبکه مش داخلی | `ufw allow 9090/tcp` |
| `5432/tcp` | TCP | PostgreSQL 16 DB | کاملاً داخلی | ❌ پورت عمومی باز نشود |
| `6379/tcp` | TCP | Redis 7 Broker | کاملاً داخلی | ❌ پورت عمومی باز نشود |

---

## 💻 ۵. دستورات نگهداری و بررسی سلامت دیمن (Systemd & Logs)

سیستم به صورت خودکار سرویس پس‌زمینه `systemd` را رجیستر می‌کند تا پس از هر ریبوت سرور بدون افت کارایی بالا بیاید:

```bash
# بررسی وضعیت سرویس مستر
systemctl status omniops-master.service

# مشاهده زنده لاگ‌های کانتینرهای داکر
cd /opt/omniops-ai/master && docker compose logs -f

# ریستارت کردن کل کلاستر
systemctl restart omniops-master.service
```

---

## 🤝 ۶. مشارکت و توسعه (Contributing)
تمامی کامنت‌های داخل سورس‌کد به زبان **فینگلیش** نوشته شده‌اند تا برای توسعه‌دهندگان ایرانی به راحتی قابل فهم و شخصی‌سازی باشند. پول‌ریکوئست‌ها و ایشیوها در گیت‌هاب با آغوش باز پذیرفته می‌شوند!

```bash
git checkout -b feature/amazing-feature
git commit -m "feat: add amazing feature"
git push origin feature/amazing-feature
```

---

## 📜 لایسنس
پروژه تحت مجوز **MIT License** منتشر شده است. استفاده و توسعه تجاری یا شخصی آن آزاد است.
