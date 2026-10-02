# 🚀 OmniOps AI - Distributed Artificial Intelligence Operating System
> سیستم‌عامل توزیع‌شده هوش مصنوعی، روتر هوشمند مدل‌ها و بازوی مستقل دسکتاپ و سرور
> 
> **OmniOps Enterprise Cluster & Windows Desktop Companion**

[![Release](https://img.shields.io/badge/Release-v2.5.0--stable-00E599?style=for-the-badge&logo=rocket&logoColor=black)](https://github.com/RedBoy-011/OmniOps-AI/releases)
[![Platform](https://img.shields.io/badge/Platform-Ubuntu%2022.04+%20%7C%20Debian%2012+%20%7C%20Windows%2010%2F11-3B82F6?style=for-the-badge&logo=linux&logoColor=white)](https://github.com/RedBoy-011/OmniOps-AI)
[![Docker Ready](https://img.shields.io/badge/Docker-Production%20Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![OpenRouter](https://img.shields.io/badge/AI%20Core-OpenRouter%20%7C%20DeepSeek%20V4%20Flash-9333EA?style=for-the-badge&logo=openai&logoColor=white)](https://openrouter.ai)
[![License](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](LICENSE)

```text
 ██████╗ ███╗   ███╗███╗   ██╗██╗ ██████╗ ██████╗ ███████╗   █████╗ ██╗
██╔═══██╗████╗ ████║████╗  ██║██║██╔═══██╗██╔══██╗██╔════╝  ██╔══██╗██║
██║   ██║██╔████╔██║██╔██╗ ██║██║██║   ██║██████╔╝███████╗  ███████║██║
██║   ██║██║╚██╔╝██║██║╚██╗██║██║██║   ██║██╔═══╝ ╚════██║  ██╔══██║██║
╚██████╔╝██║ ╚═╝ ██║██║ ╚████║██║╚██████╔╝██║     ███████║  ██║  ██║██║
 ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝ ╚═════╝ ╚═╝     ╚══════╝  ╚═╝  ╚═╝╚═╝
```

---

## 📑 فهرست مطالب (Table of Contents)
- [⚡ دستورات راه‌اندازی سریع با یک خط (Quickstart One-Liners)](#-دستورات-راه‌اندازی-سریع-با-یک-خط-quickstart-one-liners)
  - [۱. نصب سرور لینوکس (Linux Server / All-in-One Master)](#۱-نصب-سرور-لینوکس-linux-server--all-in-one-master)
  - [۲. اتصال ایجنت دسکتاپ ویندوز با PowerShell](#۲-اتصال-ایجنت-دسکتاپ-ویندوز-با-powershell)
  - [۳. راه‌اندازی سریع با داکر کمپوز (Docker Compose)](#۳-راه‌اندازی-سریع-با-داکر-کمپوز-docker-compose)
  - [۴. اتصال نود پردازشی لبه / کارت‌های گرافیک (GPU Worker)](#۴-اتصال-نود-پردازشی-لبه--کارت‌های-گرافیک-gpu-worker)
  - [۵. پکیج پایتون کلاینت (Python Pip)](#۵-پکیج-پایتون-کلاینت-python-pip)
- [🏛️ معماری کلان سیستم (Architecture Overview)](#️-معماری-کلان-سیستم-architecture-overview)
- [👥 تفکیک سطوح دسترسی (Multi-Role Experience)](#-تفکیک-سطوح-دسترسی-multi-role-experience)
- [🎨 استانداردهای طراحی و تایپوگرافی سری B ایرانی](#-استانداردهای-طراحی-و-تایپوگرافی-سری-b-ایرانی)
- [🛡️ دورزدن تحریم و اتصال به SOCKS5](#️-دورزدن-تحریم-و-اتصال-به-socks5)
- [🔒 ماتریس پورت‌ها و فایروال (Firewall Matrix)](#-ماتریس-پورت‌ها-و-فایروال-firewall-matrix)
- [🛠️ راهنمای گام‌به‌گام استقرار دستی](#️-راهنمای-گام‌به‌گام-استقرار-دستی)
- [🩺 دستورات پایش سلامت و عیب‌یابی (Troubleshooting)](#-دستورات-پایش-سلامت-و-عیب‌یابی-troubleshooting)
- [📜 مجوز و لایسنس (License)](#-مجوز-و-لایسنس-license)

---

## ⚡ دستورات راه‌اندازی سریع با یک خط (Quickstart One-Liners)

کلیه بخش‌های کلاستر با **تک‌خطی‌های استاندارد و خودکار** قابل راه‌اندازی هستند:

### ۱. نصب سرور لینوکس (Linux Server / All-in-One Master)
این تک‌خطی جادویی، پکیج‌های پیش‌نیاز را بررسی کرده، داکر، دیمن کلاستر، روتر **OmniRoute** و بازوی اتوماسیون را مستقر نموده و پنل وب را آماده تحویل می‌کند:

```bash
curl -sL https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/install.sh | bash
```

> **نکته:** برای اجرای کاملاً بی‌صدا (Non-Interactive) روی سرورهای ابری خودکار:
> ```bash
> curl -sL https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/install.sh | bash -s -- --non-interactive --role full
> ```

---

### ۲. اتصال ایجنت دسکتاپ ویندوز با PowerShell
بدون نیاز به نصب دستی پایتون یا تنظیم پورت فورواردینگ (Port Forwarding)، تنها با اجرای این دستور در **PowerShell** ویندوز ۱۰ یا ۱۱، همیار هوشمند در کنار ساعت ویندوز مستقر می‌شود:

```powershell
irm https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/windows-agent/install-agent.ps1 | iex
```

> **اتصال با توکن اختصاصی کاربر (User-Scoped Pairing):**
> اگر می‌خواهید کامپیوتر مستقیماً به حساب کاربری شما متصل شود:
> ```powershell
> irm https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/windows-agent/install-agent.ps1 | iex -Token "omni_win_usr_taheri_9a4f" -User "user@omniops.ai" -Hub "wss://cluster.omniops.ai:7070"
> ```

---

### ۳. راه‌اندازی سریع با داکر کمپوز (Docker Compose)
برای محیط‌هایی که مایل به دانلود اسکریپت شل نیستند و می‌خواهند مستقیماً استک داکر را بالا بیاورند:

```bash
curl -sSL https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/docker-compose.yml -o docker-compose.yml && docker compose up -d
```

این دستور مخازن و سرویس‌های زیر را همزمان در شبکه داخلی فعال می‌نماید:
- `omniops-master-ui` (Port `8080`)
- `omniops-omniroute` (Port `8000`)
- `omniops-hermes-agent` (Port `8081`)
- `omniops-ws-tunnel` (Port `7070`)
- `omniops-redis` (Port `6379`)
- `omniops-postgres` (Port `5432`)

---

### ۴. اتصال نود پردازشی لبه / کارت‌های گرافیک (GPU Worker)
برای متصل کردن یک سرور دیگر (دارای کارت‌های گرافیک انویدیا یا مدل‌های لوکال Ollama/vLLM) به کلاستر مرکزی:

```bash
curl -sL https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/install.sh | bash -s -- --role worker --master https://<MASTER_SERVER_IP>:9090 --token <CLUSTER_JOIN_TOKEN>
```

---

### ۵. پکیج پایتون کلاینت (Python Pip)
اجرای همیار در قالب پکیج پایتون در پس‌زمینه لینوکس یا ویندوز:

```bash
pip install omniops-agent && omniops-agent connect --token "<YOUR_PAIRING_TOKEN>" --hub "wss://<MASTER_IP>:7070"
```

---

## 🏛️ معماری کلان سیستم (Architecture Overview)

```
                            ┌──────────────────────────────────────────────┐
                            │           Master Web Console (:8080)         │
                            │  داشبورد مرکزی، مدیریت کاربران و نظارت زنده   │
                            └──────────────┬───────────────────────────────┘
                                           │
                            ┌──────────────┴───────────────────────────────┐
                            │            OmniRoute (Port :8000)            │
                            │   هسته پردازشی و روتر هوشمند مدل‌های AI      │
                            └──────────────┬───────────────────────────────┘
                                           │
                  ┌────────────────────────┴────────────────────────┐
                  ▼                                                 ▼
    ┌───────────────────────────┐                     ┌───────────────────────────┐
    │    Local AI Runtimes      │                     │     Cloud AI Providers    │
    │  - Ollama (:11434)        │                     │  - OpenRouter (DeepSeek V4│
    │  - vLLM (GPU Worker Nodes)│                     │    Flash & DeepSeek R1)   │
    │  - LM Studio              │                     │  - Google Gemini 2.5 Flash│
    │                           │                     │  - Groq LPUs & OpenAI     │
    └─────────────┬─────────────┘                     └─────────────┬─────────────┘
                  │                                                 │
                  └────────────────────────┬────────────────────────┘
                                           │ (SOCKS5 / Direct Tunnel)
                                           ▼
                            ┌──────────────────────────────┐
                            │    Hermes Agent (:8081)      │
                            │ بازوی اجرایی و سندباکس ابزارها│
                            └──────────────┬───────────────┘
                                           │
                                           │ (Reverse WebSocket Tunnel :7070)
                                           ▼
                            ┌──────────────────────────────┐
                            │ Windows Agent Companion Hub  │
                            │    (همیار شناور دسکتاپ)      │
                            │ - تله‌متری زنده (CPU/RAM/باتری)│
                            │ - اسکرین‌شات از دسکتاپ        │
                            │ - اجرای محلی دستورات PowerShell│
                            └──────────────────────────────┘
```

### اجزای اصلی:
1. **OmniRoute Core (:8000):** دروازه هوشمند هوش مصنوعی منطبق بر استاندارد OpenAI با قابلیت سوئیچ آبشاری بین مدل‌ها (Fallback Cascade)، تخمین هزینه، تنظیم تاخیر و بهینه‌سازی بار پردازشی.
2. **OpenRouter Integration:** اتصال پیش‌فرض به قوی‌ترین و ارزان‌ترین مدل‌های روز جهان شامل `deepseek/deepseek-v4-flash` و `deepseek/deepseek-r1`.
3. **Hermes Sandbox (:8081):** کانتینر ایزوله ابزارها (Tools Calling)، اجرای اسکریپت‌های پایتون، کوئری‌های SQL و وب‌اسکرپینگ تحت نظارت گیت امنیتی (Approval Gate).
4. **Reverse WebSocket Tunnel (:7070):** مکانیزم اختصاصی برای ایجاد تانل امن دوطرفه بین سیستم کلاینت و سرور لینوکس ابری بدون نیاز به داشتن آی‌پی استاتیک یا پورت فوروارد.

---

## 👥 تفکیک سطوح دسترسی (Multi-Role Experience)

سیستم به صورت بومی دارای دو سطح کاربری مجزا است:

| قابلیت | مدیر ارشد کلاستر (Admin) | کاربر معمولی (Standard User) |
| :--- | :---: | :---: |
| **ایمیل پیش‌فرض** | `admin@omniops.ai` | `user@omniops.ai` |
| **داشبورد مرکزی و مانیتورینگ نودها** | ✅ دسترسی کامل | ❌ مسدود (ایزوله کامل) |
| **تنظیمات OmniRoute و پورت ۸۰۰۰** | ✅ دسترسی کامل | ❌ مسدود |
| **تنظیمات کلیدهای API و پراکسی SOCKS5** | ✅ دسترسی کامل | ❌ مسدود |
| **بازارچه مهارت‌ها (MCP Marketplace)** | ✅ دسترسی کامل | ❌ مسدود |
| **چت مستقیم با مدل‌های AI (DeepSeek / Gemini)** | ✅ دارد | ✅ دارد (محیط مدرن چت) |
| **همیار ویندوز شخصی** | ✅ نظارت بر تمام ایجنت‌ها | ✅ دسترسی به سیستم شخصی خود |
| **تاریخچه مکالمات و چت‌ها** | ✅ کلیه لاگ‌ها | ✅ فقط تاریخچه شخصی کاربر |
| **ثبت اسکرین‌شات و دستور PowerShell** | ✅ در سطح کلاستر | ✅ با تأیید امنیتی کاربر |

---

## 🎨 استانداردهای طراحی و تایپوگرافی سری B ایرانی

رابط کاربری این پروژه توسط اصول ارشد گرافیک وب (Senior Web Graphic Designer) بازطراحی شده است:
- **تیترهای اصلی و صفحات ورود:** فونت اصیل **B Titr (بی‌تیتر)** با وزن بولد و حاشیه‌نگاری منسجم.
- **زیرتیترها، دکمه‌ها، منوها و برچسب‌ها:** فونت شفاف و شیک **B Yekan (بی‌یکان)** برای خوانایی بهینه در نمایشگرهای مدرن.
- **بدنه متون، مقالات و توضیحات بلند:** ترکیبی از **B Yekan** و **B Nazanin (بی‌نازنین)** با ارتفاع خط (Line-Height) کاملاً استاندارد برای جلوگیری از خستگی چشم.
- **دستورات ترمینال، کدها و متغیرها:** فونت انگلیسی تخصصی **JetBrains Mono**.

---

## 🛡️ دورزدن تحریم و اتصال به SOCKS5

با توجه به محدودیت‌های آی‌پی‌های ایران در دسترسی به Google Gemini یا OpenAI، ماژول ضدفیلتر و دورزدن تحریم در سیستم پیش‌بینی شده است:

```bash
# تنظیم متغیر سراسری سرور برای V2Ray / Xray
export HTTPS_PROXY="socks5://127.0.0.1:10808"
export HTTP_PROXY="socks5://127.0.0.1:10808"

# یا برای نرم‌افزار Clash
export HTTPS_PROXY="http://127.0.0.1:7890"
```

همچنین در پنل وب در تب **پرووایدرها و SOCKS5** می‌توانید مستقیماً آدرس آی‌پی و پورت پراکسی محلی یا لینک ورکر کلودفلر خود را وارد نمایید.

---

## 🔒 ماتریس پورت‌ها و فایروال (Firewall Matrix)

| پورت | پروتکل | سرویس مربوطه | دسترسی شبکه | دستور تنظیم فایروال (UFW) |
| :--- | :--- | :--- | :--- | :--- |
| **`8080/tcp`** | HTTP | وب‌کنسول Master Web UI | اینترنت / عمومی | `ufw allow 8080/tcp` |
| **`8000/tcp`** | HTTP | روتر OmniRoute (OpenAI API) | کلاستر / اینترانت | `ufw allow 8000/tcp` |
| **`8081/tcp`** | HTTP | بازوی اجرایی Hermes Agent | کلاستر / داخلی | `ufw allow 8081/tcp` |
| **`7070/tcp`** | WebSocket | گیت‌وی همیار ویندوز (Reverse Tunnel) | کلاینت‌های دسکتاپ | `ufw allow 7070/tcp` |
| **`9090/tcp`** | mTLS | اتصال نودهای ورکر لبه (Edge Nodes) | شبکه امن سرورها | `ufw allow 9090/tcp` |
| **`5432/tcp`** | TCP | پایگاه داده PostgreSQL | کاملاً داخلی | ❌ پورت را باز نکنید |
| **`6379/tcp`** | TCP | بروکر پیام Redis | کاملاً داخلی | ❌ پورت را باز نکنید |

---

## 🛠️ راهنمای گام‌به‌گام استقرار دستی

اگر مایل هستید بدون اسکریپت خودکار و گام‌به‌گام کلاستر را برپا کنید:

### ۱. کلون ریپازیتوری
```bash
git clone https://github.com/RedBoy-011/OmniOps-AI.git
cd OmniOps-AI
```

### ۲. اعطای مجوز اجرایی به اسکریپت
```bash
chmod +x install.sh
```

### ۳. کپی فایل متغیرهای محیطی
```bash
cp .env.example .env
nano .env
```

### ۴. اجرای اسکریپت تعاملی
```bash
./install.sh
```

از منوی تعاملی، گزینه **Full Suite (پیشنهادی)** را انتخاب کنید تا تمامی کانتینرها، سرویس `systemd` و تنظیمات پایگاه‌داده به طور خودکار انجام شوند.

---

## 🩺 دستورات پایش سلامت و عیب‌یابی (Troubleshooting)

### بررسی وضعیت دیمن سرویس در سرور لینوکس:
```bash
systemctl status omniops-master.service
```

### مشاهده زنده لاگ‌های سرویس‌ها:
```bash
cd /opt/omniops-ai/master && docker compose logs -f --tail=100
```

### ریستارت کامل استک کلاستر:
```bash
systemctl restart omniops-master.service
```

### رفع خطای ExecutionPolicy در ویندوز:
اگر در هنگام اجرای تک‌خطی PowerShell با خطای اجرای اسکریپت مواجه شدید:
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```

### رفع خطای تایم‌اوت وب‌سوکت در ویندوز:
اطمینان حاصل کنید که پورت `7070` سرور توسط فایروال مسدود نشده باشد:
```powershell
Test-NetConnection -ComputerName <SERVER_IP> -Port 7070
```

---

## 🤝 مشارکت و توسعه‌دهندگان
تمام کدهای اسکریپت نصب و هسته پایتون با کامنت‌های مفهومی و دقیق به زبان **فینگلیش** پیاده‌سازی شده‌اند تا خوانایی و شخصی‌سازی آن برای توسعه‌دهندگان عزیز فارسی‌زبان در نهایت سادگی باشد. پول‌ریکوئست‌ها با احترام بررسی و ادغام خواهند شد.

## 📜 مجوز و لایسنس (License)
پروژه تحت پروانه بین‌المللی **MIT License** منتشر گردیده است. استفاده تجاری، سازمانی و شخصی کاملاً آزاد و رایگان می‌باشد.
