# OmniOps AI - Windows Desktop Companion Agent (Coucou Architecture)
> الهام‌گرفته از معماری پروژه [Louis-CFM/coucou](https://github.com/Louis-CFM/coucou)

این ایجنت یک نرم‌افزار کم‌حجم (Desktop Daemon) برای سیستم‌عامل ویندوز ۱۰ و ۱۱ است که به عنوان دستیار دسکتاپ به کلاستر ابری **OmniOps AI** متصل می‌شود.

---

### ۱. دستور نصب خودکار با یک خط در PowerShell ویندوز

تنها کافیست در ویندوز برنامه **PowerShell** (یا Terminal) را باز کرده و دستور زیر را اجرا کنید:

```powershell
irm https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/windows-agent/install-agent.ps1 | iex
```

#### این دستور چه می‌کند؟
1. پایتون ۳ و پیش‌نیازهای شبکه (`websockets`, `psutil`) را بررسی و در صورت نیاز نصب می‌کند.
2. اسکریپت اصلی `coucou_agent.py` را در مسیر `%LOCALAPPDATA%\OmniOpsAI` ذخیره می‌کند.
3. یک میانبر (Shortcut) روی دسکتاپ ویندوز شما تحت نام **OmniOps AI Agent** قرار می‌دهد.
4. ایجنت را اجرا کرده و تانل وب‌سوکت معکوس به سرور Master را برقرار می‌سازد.

---

### ۲. چرا معماری مشابه `coucou`؟

پروژه `Louis-CFM/coucou` به عنوان یک همراه دسکتاپ سبک در بالای صفحه یا System Tray سیستم‌عامل قرار می‌گیرد. در OmniOps AI:
- **بدون نیاز به Port Forwarding:** ایجنت اتصال خروجی (Outbound WebSocket) به پورت `7070` سرور می‌زند؛ بنابراین پشت فایروال و NAT خانگی به راحتی کار می‌کند.
- **تله‌متری زنده:** مصرف رم، پردازنده، وضعیت پنجره فعال و دیسک را به داشبورد مرکزی ارسال می‌کند.
- **اجرای اتوماسیون هوش مصنوعی:** سرور ابری می‌تواند کارهای سیستمی و نوتیفیکیشن‌ها را مستقیماً روی ویندوز کاربر هدایت کند.

---

### ۳. تبدیل به فایل اجرایی تکی (Standalone .exe)

اگر می‌خواهید بدون نیاز به پایتون یک فایل `.exe` تک‌فایلی داشته باشید:

```cmd
pip install pyinstaller
pyinstaller --onefile --noconsole --name "OmniOps-Coucou-Agent" coucou_agent.py
```
فایل خروجی در پوشه `dist/OmniOps-Coucou-Agent.exe` تولید می‌شود.
