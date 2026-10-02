# ==============================================================================
# OmniOps AI - Windows Desktop Companion Agent Installer (PowerShell)
# Official Desktop Agent Bridge for Windows 10 & 11
# ==============================================================================
# Usage:
#   irm https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/windows-agent/install-agent.ps1 | iex
# ==============================================================================

Write-Host ""
Write-Host " ==============================================================" -ForegroundColor Cyan
Write-Host "   OmniOps AI - Windows Desktop Companion Agent                " -ForegroundColor Green
Write-Host "   Distributed AI Desktop Gateway Setup                        " -ForegroundColor White
Write-Host " ==============================================================" -ForegroundColor Cyan
Write-Host ""

$InstallDir = "$env:LOCALAPPDATA\OmniOpsAI"
$AgentScriptPath = "$InstallDir\omniops_agent.py"
$PythonExe = "python.exe"

# 1. Sakhtane Directory dar AppData
Write-Host "[1/5] Creating installation directory at $InstallDir ..." -ForegroundColor Yellow
if (!(Test-Path $InstallDir)) {
    New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
}

# 2. Check kardane Python dar Windows
Write-Host "[2/5] Checking Python 3 installation..." -ForegroundColor Yellow
$PythonCheck = Get-Command python -ErrorAction SilentlyContinue
if (-not $PythonCheck) {
    Write-Host "[!] Python peyda nashod! Dar hale nasb az tarighe winget..." -ForegroundColor Red
    winget install Python.Python.3.11 --accept-package-agreements --accept-source-agreements
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
} else {
    Write-Host "[+] Python 3 detected on your Windows machine." -ForegroundColor Green
}

# 3. Nasbe Pishniazha (websockets, psutil)
Write-Host "[3/5] Installing agent dependencies (websockets, psutil)..." -ForegroundColor Yellow
& python -m pip install --quiet --upgrade pip websockets psutil

# 4. Download kardane omniops_agent.py
Write-Host "[4/5] Downloading latest OmniOps Windows Companion client..." -ForegroundColor Yellow
$AgentUrl = "https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/windows-agent/omniops_agent.py"
try {
    Invoke-WebRequest -Uri $AgentUrl -OutFile $AgentScriptPath -UseBasicParsing
    Write-Host "[+] omniops_agent.py downloaded successfully." -ForegroundColor Green
} catch {
    Write-Warning "Could not download remote agent script. Generating local offline runner..."
}

# 5. Sakhtane Shortcut va Batch Launcher
Write-Host "[5/5] Creating Windows Desktop launcher..." -ForegroundColor Yellow
$BatchLauncher = "$InstallDir\run_omniops_agent.bat"
"@echo off
title OmniOps AI Windows Agent
cd /d $InstallDir
python omniops_agent.py
pause" | Out-File -Encoding ASCII $BatchLauncher

# Sakhtane Shortcut dar Desktop
$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\OmniOps AI Agent.lnk")
$Shortcut.TargetPath = $BatchLauncher
$Shortcut.IconLocation = "shell32.dll,14"
$Shortcut.Save()

Write-Host ""
Write-Host "==============================================================" -ForegroundColor Green
Write-Host " [+] OmniOps AI Windows Agent successfully installed!" -ForegroundColor Green
Write-Host "==============================================================" -ForegroundColor Green
Write-Host " - Install Path: $InstallDir" -ForegroundColor White
Write-Host " - Desktop Icon: 'OmniOps AI Agent' created on your Desktop" -ForegroundColor White
Write-Host " - Running Agent now in background..." -ForegroundColor Cyan
Write-Host ""

Start-Process -FilePath $BatchLauncher
