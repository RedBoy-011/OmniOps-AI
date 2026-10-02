export interface UserAgentProfile {
  email: string;
  userId: string;
  tenantId: string;
  pairingToken: string;
  tunnelEndpoint: string;
  createdAt: string;
}

export interface ConnectedAgent {
  id: string;
  name: string;
  type: 'windows' | 'cloud' | 'edge';
  os: string;
  ip: string;
  status: 'online' | 'busy' | 'offline';
  latency: string;
  cpu: string;
  ram: string;
  battery?: string;
  pairedAt: string;
  lastHeartbeat: string;
  tokenUsed: string;
  capabilities: string[];
}

export const INITIAL_USER_PROFILE: UserAgentProfile = {
  email: 'taheri.ledari.monir@gmail.com',
  userId: 'usr_taheri_011',
  tenantId: 'tenant_omniops_enterprise',
  pairingToken: 'omni_win_usr_taheri_8f49a2e1d7c3',
  tunnelEndpoint: 'wss://hub.omniops.ai/agent/tunnel/v1',
  createdAt: '2026-10-01T18:00:00Z'
};

export const INITIAL_CONNECTED_AGENTS: ConnectedAgent[] = [
  {
    id: 'agent-win-workstation',
    name: 'همیار دسکتاپ ویندوز (Workstation)',
    type: 'windows',
    os: 'Windows 11 Pro 64-bit (Build 22631)',
    ip: '192.168.1.105 (Reverse WebSocket)',
    status: 'online',
    latency: '14ms',
    cpu: '16%',
    ram: '5.4 / 16 GB',
    battery: '98%',
    pairedAt: '2026-10-02 09:30',
    lastHeartbeat: 'لحظاتی پیش',
    tokenUsed: 'omni_win_usr_taheri_8f49a2e1d7c3',
    capabilities: ['اسکرین‌شات دسکتاپ', 'ترمینال PowerShell ادمین', 'پاکسازی کش و رم', 'نوتیفیکیشن ویندوز', 'قفل سیستم']
  },
  {
    id: 'agent-win-devlaptop',
    name: 'همیار دسکتاپ ویندوز (ThinkPad Laptop)',
    type: 'windows',
    os: 'Windows 11 Enterprise (Build 22635)',
    ip: '192.168.1.142 (Reverse WebSocket)',
    status: 'online',
    latency: '22ms',
    cpu: '8%',
    ram: '8.2 / 32 GB',
    battery: '82%',
    pairedAt: '2026-10-02 11:15',
    lastHeartbeat: '۲ ثانیه پیش',
    tokenUsed: 'omni_win_usr_taheri_8f49a2e1d7c3',
    capabilities: ['اسکرین‌شات دسکتاپ', 'ترمینال PowerShell', 'پایش سخت‌افزار', 'نوتیفیکیشن']
  },
  {
    id: 'agent-cloud-hermes',
    name: 'سرور مرکزی کلاستر (Hermes Master Node)',
    type: 'cloud',
    os: 'Ubuntu 24.04 LTS (Hetzner Dedicated)',
    ip: '185.190.22.41:8000',
    status: 'online',
    latency: '18ms',
    cpu: '12%',
    ram: '1.4 / 16 GB',
    pairedAt: '2026-10-01 12:00',
    lastHeartbeat: '۱ ثانیه پیش',
    tokenUsed: 'omni_cloud_cluster_master',
    capabilities: ['مدیریت کانتینرهای داکر', 'ساندباکس پایتون', 'روتینگ هوش مصنوعی OmniRoute', 'تونل SOCKS5']
  }
];
