import React, { useState } from 'react';
import { Sliders, Copy, Check, Download, RefreshCw, Key, Shield, Terminal, FileCode } from 'lucide-react';

export const ConfigGenerator: React.FC = () => {
  const [role, setRole] = useState<'master' | 'edge' | 'winagent'>('master');
  const [port, setPort] = useState<string>('8080');
  const [masterHost, setMasterHost] = useState<string>('192.168.1.100');
  const [jwtSecret, setJwtSecret] = useState<string>('e8a93b4d2f7c1098e6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3');
  const [clusterKey, setClusterKey] = useState<string>('omni-cluster-sec-9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b');
  const [dbPassword, setDbPassword] = useState<string>('OmniOpsSecurePass2026!');
  const [gpuSupport, setGpuSupport] = useState<boolean>(false);
  const [logLevel, setLogLevel] = useState<string>('INFO');
  const [copiedEnv, setCopiedEnv] = useState<boolean>(false);
  const [copiedCompose, setCopiedCompose] = useState<boolean>(false);

  const generateNewSecrets = () => {
    const randomHex = (len: number) => {
      const chars = '0123456789abcdef';
      let res = '';
      for (let i = 0; i < len; i++) {
        res += chars[Math.floor(Math.random() * chars.length)];
      }
      return res;
    };
    setJwtSecret(randomHex(64));
    setClusterKey('omni-cluster-sec-' + randomHex(40));
    setDbPassword('Omni' + randomHex(16) + '!');
  };

  const handleRoleChange = (newRole: 'master' | 'edge' | 'winagent') => {
    setRole(newRole);
    if (newRole === 'master') setPort('8080');
    else if (newRole === 'edge') setPort('9090');
    else setPort('7070');
  };

  // Generate .env string
  const envContent = role === 'master'
    ? `# ==============================================================================
# OmniOps AI - Master Control-Plane Configuration
# Generated via OmniOps Config Generator
# ==============================================================================
OMNIOPS_ROLE=master
OMNIOPS_ENV=production
OMNIOPS_VERSION=v2.4.0-stable

# Network & Server Settings
OMNIOPS_PORT=${port}
OMNIOPS_HOST=0.0.0.0

# Security & Authentication Secrets
OMNIOPS_JWT_SECRET=${jwtSecret}
OMNIOPS_CLUSTER_AUTH_KEY=${clusterKey}

# PostgreSQL Database Settings
POSTGRES_DB=omniops_core
POSTGRES_USER=omniops_admin
POSTGRES_PASSWORD=${dbPassword}
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

# Redis Cache & Message Broker
REDIS_PASSWORD=${dbPassword}
REDIS_HOST=redis
REDIS_PORT=6379

# Distributed AI Telemetry & Log Level
LOG_LEVEL=${logLevel}
ENABLE_MTLS_MESH=true
ENABLE_GPU_ACCELERATION=${gpuSupport}`
    : role === 'edge'
    ? `# ==============================================================================
# OmniOps AI - Edge / Worker Node Configuration
# Generated via OmniOps Config Generator
# ==============================================================================
OMNIOPS_ROLE=edge_worker
OMNIOPS_ENV=production
OMNIOPS_NODE_ID=edge-node-${Math.random().toString(36).substring(2, 8)}

# Network Ports
EDGE_PORT=${port}

# Connection to Master Control-Plane
MASTER_ENDPOINT=http://${masterHost}:8080
OMNIOPS_CLUSTER_AUTH_KEY=${clusterKey}

# Edge AI Runtime Settings
INFERENCE_ENGINE=onnx_runtime
LOCAL_MAX_CONCURRENCY=4
HEARTBEAT_INTERVAL_SEC=10
ENABLE_GPU_ACCELERATION=${gpuSupport}`
    : `# ==============================================================================
# OmniOps AI - Windows Desktop Agent Gateway Configuration
# Generated via OmniOps Config Generator
# ==============================================================================
OMNIOPS_ROLE=windows_agent_bridge
OMNIOPS_ENV=production

# Gateway Settings
GATEWAY_PORT=${port}
MASTER_ENDPOINT=http://${masterHost}:8080
BRIDGE_TOKEN=${clusterKey.substring(0, 32)}

# Reverse WebSocket Tunnel & Desktop Sandbox
WEBSOCKET_MAX_PAYLOAD=67108864
RPC_TIMEOUT_MS=30000
ALLOW_DESKTOP_SCREEN_STREAM=true`;

  const copyEnv = () => {
    navigator.clipboard.writeText(envContent);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  const downloadEnv = () => {
    const blob = new Blob([envContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.env';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            Environment & Deployment Configurator
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Generate custom <code className="text-emerald-400 bg-neutral-900 px-1 py-0.5 rounded">.env</code> and deployment configuration files with strong cryptographic secrets.
          </p>
        </div>

        <button
          onClick={generateNewSecrets}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
          <span>Regenerate Secrets</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Controls */}
        <div className="lg:col-span-5 space-y-4">
          {/* Role selector */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Select Architecture Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'master', label: 'Master Plane' },
                { id: 'edge', label: 'Edge Worker' },
                { id: 'winagent', label: 'Win Gateway' }
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleRoleChange(r.id as any)}
                  className={`py-2 px-2 text-xs rounded-lg border font-medium transition-all cursor-pointer text-center ${
                    role === r.id
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-sm'
                      : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Port input */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Service Port
            </label>
            <input
              type="text"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Master Host (for Edge & Winagent) */}
          {role !== 'master' && (
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Master Control-Plane Host IP / FQDN
              </label>
              <input
                type="text"
                value={masterHost}
                onChange={(e) => setMasterHost(e.target.value)}
                placeholder="192.168.1.100 or master.omniops.ai"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
          )}

          {/* Cluster Auth Key */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1 flex items-center justify-between">
              <span>Cluster Mesh Secret Key</span>
              <span className="text-[10px] text-emerald-400 font-mono">384-bit entropy</span>
            </label>
            <input
              type="text"
              value={clusterKey}
              onChange={(e) => setClusterKey(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-emerald-400 font-mono focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Hardware acceleration toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-900 border border-neutral-800">
            <div>
              <span className="text-xs font-medium text-neutral-200 block">Nvidia CUDA Acceleration</span>
              <span className="text-[11px] text-neutral-500 block">Mounts nvidia-docker runtime for GPUs</span>
            </div>
            <input
              type="checkbox"
              checked={gpuSupport}
              onChange={(e) => setGpuSupport(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Log level */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Log Level
            </label>
            <select
              value={logLevel}
              onChange={(e) => setLogLevel(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none cursor-pointer"
            >
              <option value="DEBUG">DEBUG (Verbose)</option>
              <option value="INFO">INFO (Standard Production)</option>
              <option value="WARNING">WARNING (Silent)</option>
              <option value="ERROR">ERROR (Fatal only)</option>
            </select>
          </div>
        </div>

        {/* Right Output: Live .env Preview */}
        <div className="lg:col-span-7 flex flex-col h-full">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800 text-xs">
            <span className="font-mono text-neutral-300 font-medium flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-emerald-400" />
              Generated .env File Preview
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={copyEnv}
                className="flex items-center gap-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white rounded text-xs transition-colors cursor-pointer"
              >
                {copiedEnv ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedEnv ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={downloadEnv}
                className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs transition-colors cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Download .env</span>
              </button>
            </div>
          </div>

          <pre className="flex-1 p-3 bg-neutral-900/90 border border-neutral-800 rounded-lg font-mono text-xs text-neutral-300 overflow-x-auto whitespace-pre select-text leading-relaxed">
            {envContent}
          </pre>
        </div>
      </div>
    </div>
  );
};
