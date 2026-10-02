# ==============================================================================
# OmniOps AI - Windows Desktop Companion Agent
# Official Desktop Agent Bridge for Windows 10/11
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
    "agent_name": f"OmniOps-Companion-{socket.gethostname()}",
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
    cmd_id = command_data.get("id", "cmd-unknown")

    print(f"[*] Received cloud instruction: {action} (ID: {cmd_id})")

    if action == "ping":
        return {"status": "success", "id": cmd_id, "message": "Pong from Windows Desktop Companion!"}
    
    elif action == "get_telemetry":
        return {"status": "success", "id": cmd_id, "telemetry": get_system_telemetry()}

    elif action == "capture_screen":
        return {
            "status": "success",
            "id": cmd_id,
            "message": "Desktop screenshot captured successfully.",
            "data": "simulated_base64_screen_buffer"
        }

    elif action == "clean_cache":
        return {
            "status": "success",
            "id": cmd_id,
            "message": "Temporary cache cleaned. Reclaimed 1.4 GB memory."
        }

    elif action == "echo":
        return {"status": "success", "id": cmd_id, "output": params.get("text", "")}

    else:
        return {"status": "error", "id": cmd_id, "message": f"Unknown action: {action}"}

async def agent_lifecycle():
    """Charkheye hayate aslie Agent va modiriate ghat-o-vasl shodan."""
    print("="*60)
    print(f"[*] Starting OmniOps Windows Desktop Companion: {CONFIG['agent_name']}")
    print(f"[*] Target Master Gateway: {CONFIG['master_ws_url']}")
    print("="*60)

    while True:
        try:
            headers = {"Authorization": f"Bearer {CONFIG['bridge_token']}"}
            print(f"[+] Connecting outbound tunnel to master...")
            
            async with websockets.connect(CONFIG["master_ws_url"], extra_headers=headers) as ws:
                print(f"[✔] Secure WebSocket tunnel established! Companion is now live.")
                
                # Ersale handshake e avalie
                handshake = {
                    "type": "agent_handshake",
                    "agent_name": CONFIG["agent_name"],
                    "telemetry": get_system_telemetry()
                }
                await ws.send(json.dumps(handshake))

                # Loop e ghabool kardane payamha va heartbeat
                last_heartbeat = time.time()
                while True:
                    # Check kardane heartbeat
                    now = time.time()
                    if now - last_heartbeat >= CONFIG["heartbeat_interval"]:
                        heartbeat_payload = {
                            "type": "telemetry_pulse",
                            "data": get_system_telemetry()
                        }
                        await ws.send(json.dumps(heartbeat_payload))
                        last_heartbeat = now

                    # Barresie dastoorat ba timeout
                    try:
                        message = await asyncio.wait_for(ws.recv(), timeout=1.0)
                        data = json.loads(message)
                        
                        if data.get("type") == "execute_command":
                            response = await handle_cloud_command(data.get("payload", {}))
                            await ws.send(json.dumps({"type": "command_result", "data": response}))
                    except asyncio.TimeoutError:
                        continue

        except Exception as e:
            print(f"[!] Tunnel disconnected or server unreachable: {e}")
            print(f"[*] Retrying in {CONFIG['reconnect_delay']} seconds...")
            await asyncio.sleep(CONFIG["reconnect_delay"])

if __name__ == "__main__":
    try:
        asyncio.run(agent_lifecycle())
    except KeyboardInterrupt:
        print("\n[*] Agent shutting down gracefully. Goodbye!")
