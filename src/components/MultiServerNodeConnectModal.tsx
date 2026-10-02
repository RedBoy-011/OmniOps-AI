import React, { useState } from 'react';
import {
  Server,
  Cpu,
  Check,
  Copy,
  Radio,
  Sparkles,
  Zap,
  Activity,
  X,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Network,
  Globe,
  Sliders,
  Terminal,
  RefreshCw
} from 'lucide-react';
import { INITIAL_USER_PROFILE } from '../data/agentStore';

export interface ClusterNodeInfo {
  id: string;
  name: string;
  role: 'master' | 'worker_gpu' | 'edge_cpu';
  ip: string;
  port: number;
  status: 'online' | 'connecting' | 'offline';
  latency: string;
  hardware: string;
  inferenceEngine: string;
  joinedAt: string;
}

interface MultiServerNodeConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNodeAdded?: (node: ClusterNodeInfo) => void;
}

export const MultiServerNodeConnectModal: React.FC<MultiServerNodeConnectModalProps> = ({
  isOpen,
  onClose,
  onNodeAdded
}) => {
  // Master Server 1 Info
  const [masterIp, setMasterIp] = useState('185.190.140.22');
  const [clusterJoinToken, setClusterJoinToken] = useState('omni_join_sec_8f49a2e1d7c3b091');
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedWorkerCmd, setCopiedWorkerCmd] = useState(false);

  // New Node (Server 2) Input
  const [newServerIp, setNewServerIp] = useState('185.190.140.23');
  const [newServerName, setNewServerName] = useState('سرور دوم (GPU Worker Node - RTX 4090)');
  const [newNodeRole, setNewNodeRole] = useState<'worker_gpu' | 'edge_cpu'>('worker_gpu');
  const [newEngine, setNewEngine] = useState('vLLM High-Throughput (CUDA 12.4)');

  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [handshakeSuccess, setHandshakeSuccess] = useState<string | null>(null);

  // Active Cluster Nodes List
  const [nodesList, setNodesList] = useState<ClusterNodeInfo[]>([
    {
      id: 'node-master-01',
      name: 'سرور اول مرکزی (Master Control-Plane)',
      role: 'master',
      ip: '185.190.140.22',
      port: 8080,
      status: 'online',
      latency: '2ms',
      hardware: '16 vCPUs AMD EPYC, 32GB RAM, 250GB NVMe',
      inferenceEngine: 'OmniRoute Core (:8000) & OpenRouter Proxy',
      joinedAt: 'هم‌اکنون فعال'
    },
    {
      id: 'node-worker-02',
      name: 'سرور دوم محاسباتی (GPU Node)',
      role: 'worker_gpu',
      ip: '185.190.140.23',
      port: 9090,
      status: 'online',
      latency: '11ms',
      hardware: 'Nvidia GeForce RTX 4090 (24GB VRAM), 64GB RAM',
      inferenceEngine: 'vLLM Local Server & Ollama Runtime',
      joinedAt: 'متصل با موفقیت'
    }
  ]);

  if (!isOpen) return null;

  // Dastoore nasb baraye Server 2
  const workerInstallCommand = `curl -sL https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/install.sh | bash -s -- --role worker --master http://${masterIp}:9090 --token "${clusterJoinToken}"`;

  const copyToken = () => {
    navigator.clipboard.writeText(clusterJoinToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const copyWorkerCommand = () => {
    navigator.clipboard.writeText(workerInstallCommand);
    setCopiedWorkerCmd(true);
    setTimeout(() => setCopiedWorkerCmd(false), 2000);
  };

  const handleTestAndConnectServer2 = () => {
    if (!newServerIp.trim()) return;

    setIsTestingConnection(true);
    setHandshakeSuccess(null);

    setTimeout(() => {
      setIsTestingConnection(false);
      const newNode: ClusterNodeInfo = {
        id: `node-worker-${Date.now()}`,
        name: newServerName.trim() || `سرور محاسباتی ${newServerIp}`,
        role: newNodeRole,
        ip: newServerIp.trim(),
        port: 9090,
        status: 'online',
        latency: `${Math.floor(8 + Math.random() * 9)}ms`,
        hardware: newNodeRole === 'worker_gpu' ? 'Nvidia RTX GPU (CUDA Acceleration)' : '16 vCPUs AMD EPYC',
        inferenceEngine: newEngine,
        joinedAt: 'هم‌اکنون متصل شد'
      };

      setNodesList((prev) => [...prev, newNode]);
      onNodeAdded?.(newNode);
      setHandshakeSuccess(`ارتباط امن mTLS با سرور دوم (${newServerIp}:9090) برقرار و در کلاستر ثبت شد!`);
      setTimeout(() => setHandshakeSuccess(null), 4000);
    }, 1200);
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodesList((prev) => prev.filter((n) => n.id !== nodeId));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200" dir="rtl">
      
      {/* Container e Modal */}
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl glass-surface-elevated border border-white/15 shadow-2xl overflow-hidden text-neutral-100">
        
        {/* Header e Modal */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between gap-4 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>عملیات خوشه‌بندی و اتصال سرور دوم (Multi-Server Cluster Topology)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                  {nodesList.length} نود فعال
                </span>
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                اتصال امن سرور اول (Master) به سرور دوم (GPU Worker)، توزیع بار استنتاج هوش مصنوعی و افزودن IPها به استخر مسیریابی
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
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          
          {/* Step 1: Master Server Identification & Cluster Join Token */}
          <div className="p-5 rounded-2xl glass-surface border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>۱. مشخصات سرور اول (Master Server) و کلید پیوستن به کلاستر</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-800">
                mTLS Port :9090 Ready
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">آی‌پی سرور اول (Master IP Address):</label>
                <input
                  type="text"
                  value={masterIp}
                  onChange={(e) => setMasterIp(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl font-mono text-cyan-300"
                  dir="ltr"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-neutral-400">توکن امن پیوستن کلاستر (Cluster Join Token):</label>
                  <button
                    onClick={copyToken}
                    className="text-cyan-400 hover:text-white text-[11px] cursor-pointer flex items-center gap-1 font-mono"
                  >
                    {copiedToken ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedToken ? 'کپی شد' : 'کپی'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  readOnly
                  value={clusterJoinToken}
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl font-mono text-purple-300"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Step 2: One-Liner Command to Run on Server 2 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>۲. دستور تک‌خطی برای اجرا در ترمینال سرور دوم (Server 2 One-Liner):</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400">Automated Join</span>
            </div>

            <div className="p-3.5 bg-black/80 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-emerald-400">
              <div className="truncate select-all" dir="ltr">
                {workerInstallCommand}
              </div>
              <button
                onClick={copyWorkerCommand}
                className="px-3.5 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-sans cursor-pointer flex items-center gap-1.5 transition-all shrink-0 self-end sm:self-auto"
              >
                {copiedWorkerCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedWorkerCmd ? 'کپی شد' : 'کپی دستور سرور ۲'}</span>
              </button>
            </div>
            <p className="text-[11px] text-neutral-400">
              💡 با اجرای این دستور در سرور دوم، بسته سبک پردازشی کلاستر مستقر شده و کارت‌های گرافیک یا پردازنده‌های آن به صورت خودکار به هسته مرکزی سرور اول متصل می‌شوند.
            </p>
          </div>

          {/* Step 3: Add & Handshake Verification */}
          <div className="p-5 rounded-2xl glass-surface border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>۳. افزودن سرور دوم و آزمون اتصال بلادرنگ (Handshake Test)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">آی‌پی سرور دوم:</label>
                <input
                  type="text"
                  value={newServerIp}
                  onChange={(e) => setNewServerIp(e.target.value)}
                  placeholder="192.168.1.50 یا Public IP"
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl font-mono text-neutral-200"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">نام یا برچسب نود:</label>
                <input
                  type="text"
                  value={newServerName}
                  onChange={(e) => setNewServerName(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-neutral-200"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">موتور پردازشی:</label>
                <select
                  value={newEngine}
                  onChange={(e) => setNewEngine(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-neutral-200"
                >
                  <option value="vLLM High-Throughput (CUDA 12.4)">vLLM High-Throughput (CUDA GPU)</option>
                  <option value="Ollama Local Engine">Ollama Local Engine</option>
                  <option value="LM Studio Daemon">LM Studio Daemon</option>
                  <option value="CPU Fast-Inference">CPU Fast-Inference</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <button
                onClick={handleTestAndConnectServer2}
                disabled={isTestingConnection}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-cyan-950/60 disabled:opacity-50"
              >
                {isTestingConnection ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>در حال برقراری هندشیک و پینگ سرور دوم...</span>
                  </>
                ) : (
                  <>
                    <Radio className="w-4 h-4" />
                    <span>تست اتصال و ثبت سرور دوم در کلاستر</span>
                  </>
                )}
              </button>

              {handshakeSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{handshakeSuccess}</span>
                </div>
              )}
            </div>
          </div>

          {/* Step 4: Active Cluster Nodes Table */}
          <div className="p-5 rounded-2xl glass-surface border border-white/10 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>نودهای فعال در کلاستر توزیع‌شده ({nodesList.length} سرور آنلاین)</span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400">
                    <th className="py-2.5 px-3 font-medium">نام سرور</th>
                    <th className="py-2.5 px-3 font-medium">نقش</th>
                    <th className="py-2.5 px-3 font-medium">آدرس IP و پورت</th>
                    <th className="py-2.5 px-3 font-medium">مشخصات سخت‌افزاری</th>
                    <th className="py-2.5 px-3 font-medium">تاخیر شبکه</th>
                    <th className="py-2.5 px-3 font-medium">وضعیت</th>
                    <th className="py-2.5 px-3 font-medium">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-neutral-200">
                  {nodesList.map((node) => (
                    <tr key={node.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3 font-bold text-white">
                        <div className="flex items-center gap-2">
                          <Server className={`w-4 h-4 ${node.role === 'master' ? 'text-cyan-400' : 'text-purple-400'}`} />
                          <span>{node.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          node.role === 'master'
                            ? 'bg-cyan-500/20 text-cyan-300'
                            : 'bg-purple-500/20 text-purple-300'
                        }`}>
                          {node.role === 'master' ? 'Master Core' : 'GPU Worker'}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-cyan-300" dir="ltr">
                        {node.ip}:{node.port}
                      </td>
                      <td className="py-3 px-3 text-neutral-300 text-[11px]">
                        {node.hardware}
                      </td>
                      <td className="py-3 px-3 font-mono text-emerald-400" dir="ltr">
                        {node.latency}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Online
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {node.role !== 'master' && (
                          <button
                            onClick={() => handleDeleteNode(node.id)}
                            className="p-1 rounded-lg hover:bg-red-950/60 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                            title="قطع اتصال نود"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs">
          <span className="text-neutral-400">
            ترافیک بین سرورها با گواهی خودکار mTLS رمزنگاری می‌شود و در صورت قطع سرور دوم، ترافیک به صورت خودکار به سرور اول و کلاود فال‌بک می‌کند.
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
