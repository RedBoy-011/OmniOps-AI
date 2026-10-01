# ==============================================================================
# OmniOps AI - Windows Desktop Companion Agent (Coucou Architecture)
# Official Desktop Agent Bridge for Windows 10/11
# Inspired by Louis-CFM/coucou desktop companion
# ==============================================================================
# In file baraye ertebate safe va do-tarafe beyne Desktop Windows va Master ast.
# Az tarighe WebSocket be Master vasl mishe va bedune niaze be Port Forwarding
# dastoorate AI ro rooye desktop ejra mikone va telemetry ro ersal mikone.
# ==============================================================================

import asyncio
import json
import os
import platform
import socket
import sys
import time
from typing import Dict, Any

# Pishniazhaye python: websockets, psutil
try:
    import websockets
    import psutil
except ImportError:
    print("[!] Missing dependencies. Run: pip install websockets psutil")
    sys.exit(1)

# Tanzeemate pishfarze Agent
CONFIG = {
    "agent_name": f"OmniOps-Coucou-{socket.gethostname()}",
    "master_ws_url": os.getenv("OMNIOPS_MASTER_WS", "ws://127.0.0.1:7070/ws/agent"),
    "bridge_token": os.getenv("OMNIOPS_BRIDGE_TOKEN", "omni-bridge-token-default"),
    "heartbeat_interval": 5, # Har 5 sanie yekbar telemetry befrest
    "reconnect_delay": 3     # Dar soorate ghat shodan har 3 sanie dobare talash kon
}

def get_system_telemetry() -> Dict[str, Any]:
    """Jam-avari etelaate sakht-afzari va amalkardi az system Windows."""
    try:
        cpu_usage = psutil.cpu_percent(interval=None)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('C:\\')
        
        return {
            "hostname": socket.gethostname(),
            "os": platform.system() + " " + platform.release(),
            "cpu_percent": cpu_usage,
            "ram_used_gb": round(memory.used / (1024**3), 2),
            "ram_total_gb": round(memory.total / (1024**3), 2),
            "ram_percent": memory.percent,
            "disk_free_gb": round(disk.free / (1024**3), 2),
            "status": "active_online",
            "timestamp": int(time.time())
        }
    except Exception as e:
        return {"error": str(e), "status": "degraded"}

async def handle_cloud_command(command_data: Dict[str, Any]) -> Dict[str, Any]:
    """Ejraye dastoorati ke az Control-Plane marboot be AI ersal mishe."""
    action = command_data.get("action")
    params = command_data.get("params", {})
    
    print(f"[*] Received Cloud Action: {action} with params: {params}")

    if action == "ping":
        return {"status": "pong", "time": time.time()}
    
    elif action == "system_notification":
        # Namayeshe notification dar Windows
        title = params.get("title", "OmniOps AI Alert")
        msg = params.get("message", "Task completed.")
        try:
            # Dastoore PowerShell baraye namayeshe Toast Notification
            ps_cmd = f'powershell -Command "[reflection.assembly]::loadwithpartialname(\'System.Windows.Forms\'); [System.Windows.Forms.MessageBox]::Show(\'{msg}\',\'{title}\')"'
            os.system(f"start /B {ps_cmd}")
            return {"status": "success", "executed": "notification_sent"}
        except Exception as e:
            return {"status": "failed", "error": str(e)}

    elif action == "exec_powershell":
        # Ejraye dastoore shell dar sandbox
        cmd = params.get("command", "")
        if not cmd:
            return {"status": "error", "message": "empty command"}
        try:
            import subprocess
            res = subprocess.run(["powershell", "-Command", cmd], capture_output=True, text=True, timeout=30)
            return {
                "status": "success",
                "stdout": res.stdout,
                "stderr": res.stderr,
                "exit_code": res.returncode
            }
        except Exception as e:
            return {"status": "error", "error": str(e)}

    return {"status": "unknown_action", "action": action}

async def run_desktop_agent():
    """Halgheye asliye ertebate WebSocket ba Master."""
    uri = CONFIG["master_ws_url"]
    print(f"""
  ==============================================================
   OmniOps AI - Windows Desktop Companion (Coucou Architecture)
  ==============================================================
   Agent Node:   {CONFIG['agent_name']}
   Master Gateway: {uri}
   Status:       Connecting reverse tunnel...
  ==============================================================
    """)

    while True:
        try:
            headers = {"Authorization": f"Bearer {CONFIG['bridge_token']}"}
            print(f"[*] Connecting to {uri} ...")
            
            async with websockets.connect(uri, extra_headers=headers) as ws:
                print("[+] Successfully connected to OmniOps Control-Plane! Tunnel is ACTIVE.")
                
                # Handshake e avalie
                handshake_payload = {
                    "type": "handshake",
                    "agent": CONFIG["agent_name"],
                    "platform": "windows_desktop",
                    "telemetry": get_system_telemetry()
                }
                await ws.send(json.dumps(handshake_payload))

                # Halgheye daryaft va ersale telemetry
                while True:
                    # 1. Ersale heartbeat va telemetry
                    telemetry = {
                        "type": "telemetry",
                        "agent": CONFIG["agent_name"],
                        "data": get_system_telemetry()
                    }
                    await ws.send(json.dumps(telemetry))

                    # 2. Check kardane dastoorat az samte khorooji (ba timeout)
                    try:
                        message = await asyncio.wait_for(ws.recv(), timeout=CONFIG["heartbeat_interval"])
                        data = json.loads(message)
                        result = await handle_cloud_command(data)
                        await ws.send(json.dumps({"type": "command_result", "id": data.get("id"), "result": result}))
                    except asyncio.TimeoutError:
                        # Timeout e tabiee baraye ersale heartbeat e baadi
                        pass

        except (websockets.ConnectionClosed, ConnectionRefusedError, OSError) as e:
            print(f"[-] Connection lost ({e}). Reconnecting in {CONFIG['reconnect_delay']}s...")
            await asyncio.sleep(CONFIG["reconnect_delay"])
        except Exception as e:
            print(f"[!] Unexpected error: {e}. Retrying in {CONFIG['reconnect_delay']}s...")
            await asyncio.sleep(CONFIG["reconnect_delay"])

if __name__ == "__main__":
    try:
        asyncio.run(run_desktop_agent())
    except KeyboardInterrupt:
        print("\n[*] OmniOps Windows Agent stopped by user.")
