# OmniOps AI - Windows Desktop Companion Agent
> همیار شناور دسکتاپ و ابزار نظارت و اتوماسیون ویندوز ۱۰ و ۱۱

این ایجنت یک نرم‌افزار کم‌حجم (Desktop Daemon) برای سیستم‌عامل ویندوز ۱۰ و ۱۱ است که در کنار ساعت سیستم (System Tray) به صورت شناور مستقر شده و به عنوان دستیار هوشمند به کلاستر مرکزی **OmniOps AI** متصل می‌شود.

---

### ۱. دستور نصب خودکار با یک خط در PowerShell ویندوز

تنها کافیست در ویندوز برنامه **PowerShell** (یا Terminal) را باز کرده و دستور زیر را اجرا کنید:

```powershell
irm https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/windows-agent/install-agent.ps1 | iex
```

#### این دستور چه می‌کند؟
1. پایتون ۳ و پیش‌نیازهای شبکه (`websockets`, `psutil`) را بررسی و در صورت نیاز به طور خودکار نصب می‌کند.
2. اسکریپت اصلی `omniops_agent.py` را در مسیر `%LOCALAPPDATA%\OmniOpsAI` ذخیره می‌کند.
3. یک میانبر (Shortcut) روی دسکتاپ ویندوز شما تحت نام **OmniOps AI Agent** قرار می‌دهد.
4. ایجنت را در کنار ساعت ویندوز (System Tray) اجرا کرده و تانل وب‌سوکت معکوس به سرور Master را برقرار می‌سازد.

---

### ۲. معماری همیار دسکتاپ و مدل شناور (System Tray & Floating Companion)

- **آیکون کنار ساعت و مدل شناور:** ایجنت در System Tray یا کنار ساعت ویندوز قرار می‌گیرد و با کلیک روی آن، پنجره شیشه‌ای شناور (Floating Companion) برای چت و اجرای فرامین دسکتاپ باز می‌شود.
- **بدون نیاز به Port Forwarding:** ایجنت اتصال خروجی (Outbound WebSocket) به پورت `7070` سرور می‌زند؛ بنابراین پشت فایروال و اینترنت خانگی بدون نیاز به IP ولید کار می‌کند.
- **تله‌متری زنده و اتوماسیون:** مصرف رم، پردازنده، باتری و وضعیت پنجره‌ها را مانیتور کرده و اسکریپت‌های سیستمی را با سرعت بالا اجرا می‌کند.

---

### ۳. تبدیل به فایل اجرایی تکی (Standalone .exe)

اگر می‌خواهید بدون نیاز به پایتون یک فایل `.exe` تک‌فایلی داشته باشید:

```cmd
pip install pyinstaller
pyinstaller --onefile --noconsole --name "OmniOps-Companion" omniops_agent.py
```
فایل خروجی در پوشه `dist/OmniOps-Companion.exe` تولید می‌شود.
