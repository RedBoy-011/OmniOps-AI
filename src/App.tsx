import React, { useState } from 'react';
import {
  Server,
  Route,
  Wrench,
  Zap,
  LogOut,
  User,
  Cpu,
  Layers,
  Bot,
  Laptop,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Menu,
  X,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { AuthScreen } from './components/AuthScreen';
import { MasterControlDashboard } from './components/MasterControlDashboard';
import { OmniAgentInterface } from './components/OmniAgentInterface';
import { MCPMarketplace } from './components/MCPMarketplace';
import { OmniRouteHub } from './components/OmniRouteHub';
import { AIProvidersHub } from './components/AIProvidersHub';
import { WindowsAgentHub } from './components/WindowsAgentHub';
import { UserPortal } from './components/UserPortal';
import { GlobalHeaderSearch, SearchResultItem } from './components/GlobalHeaderSearch';

export default function App() {
  // Karbare vared-shode: Dar halate noskheye kham (Zero State) ebteda safheye Login namayesh dade mishavad
  const [currentUser, setCurrentUser] = useState<{ email: string; role: string } | null>(null);

  // Tab e fa'ale barname (Master Dashboard, Agent Chat, MCP, OmniRoute, Providers, Windows Agent)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'agent' | 'mcp' | 'omniroute' | 'providers' | 'windows'>('dashboard');

  // Eyjente Entekhab-shode baraye ertebat va ersale dastoor
  const [selectedAgentForChat, setSelectedAgentForChat] = useState<string>('agent-win-workstation');

  // Modal e Baz-shode az tarighe Search e Sarāsari (Global Search)
  const [activeModalFromSearch, setActiveModalFromSearch] = useState<'local_models' | 'server2' | 'domain_ssl' | null>(null);

  const handleNavigateToAgentChat = (agentId?: string) => {
    if (agentId) {
      setSelectedAgentForChat(agentId);
    }
    setActiveTab('agent');
  };

  const handleSearchResultSelect = (result: SearchResultItem) => {
    if (result.agentId) {
      setSelectedAgentForChat(result.agentId);
      setActiveTab('agent');
    } else if (result.actionModal) {
      setActiveModalFromSearch(result.actionModal);
      setActiveTab('dashboard');
    } else {
      setActiveTab(result.tab);
    }
  };

  // Sidebar e jam-shavande (Collapsible Glass Sidebar)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Agar karbar vared nashode bashad, safheye Login (AuthScreen) namayesh dade mishavad
  if (!currentUser) {
    return (
      <AuthScreen
        onLoginSuccess={(user) => setCurrentUser(user)}
      />
    );
  }

  // Agar Karbare Ma'mooli (Standard User) vared shod, faghat UserPortal namayesh dade mishavad!
  // Karbare ma'mooli be tanzimate klastar dastresi nadarad va faghat chathaye khodesh, modelha va eyjente vayndoziye khodesh ra mibinad
  if (currentUser.role === 'Standard User') {
    return (
      <UserPortal
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
        onSwitchToAdmin={() => setCurrentUser({ email: 'admin@omniops.ai', role: 'Master Cluster Administrator' })}
      />
    );
  }

  // Aytamhaye Menuye Asli e Sidebar
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'داشبورد مرکزی',
      englishLabel: 'Master Dashboard',
      icon: Server,
      badge: 'Online'
    },
    {
      id: 'agent',
      label: 'رابط ایجنت و چت',
      englishLabel: 'Omni Agent & Task',
      icon: Bot,
      badge: 'DeepSeek V4'
    },
    {
      id: 'mcp',
      label: 'بازارچه مهارت‌ها (MCP)',
      englishLabel: 'MCP Marketplace',
      icon: Layers,
      badge: '8 Servers'
    },
    {
      id: 'omniroute',
      label: 'هسته پردازشی OmniRoute',
      englishLabel: 'OmniRoute Core',
      icon: Route,
      badge: 'Port :8000'
    },
    {
      id: 'providers',
      label: 'پرووایدرها و SOCKS5',
      englishLabel: 'AI Providers & Proxy',
      icon: Zap,
      badge: 'Anti-Filter'
    },
    {
      id: 'windows',
      label: 'ایجنت دسکتاپ ویندوز',
      englishLabel: 'Windows Companion',
      icon: Laptop,
      badge: 'Win 11'
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-100 flex relative selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden" dir="rtl">
      
      {/* Pas-zamineye noorani ba Haloohaye Glassmorphism (Ambient Background Mesh) */}
      <div className="fixed top-[-15%] right-[-10%] w-[650px] h-[650px] rounded-full bg-cyan-600/10 blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-15%] left-[-10%] w-[700px] h-[700px] rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none" />
      <div className="fixed top-1/2 left-1/4 w-[450px] h-[450px] rounded-full bg-emerald-600/08 blur-[130px] pointer-events-none" />

      {/* Grid Pattern pas-zamine */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* 1. Sidebar e Shishei va Jam-Shavande (Collapsible Frosted Glass Sidebar) */}
      <aside
        className={`hidden md:flex flex-col justify-between sticky top-0 h-screen z-40 transition-all duration-300 glass-surface-elevated border-l border-white/10 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Top: Logo va Brand */}
        <div className="p-4 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 text-cyan-400 shrink-0 shadow-lg shadow-cyan-950/50">
                <Cpu className="w-5 h-5" />
              </div>
              {!sidebarCollapsed && (
                <div className="leading-tight truncate animate-in fade-in duration-200">
                  <span className="font-extrabold text-sm text-white font-mono block tracking-tight" dir="ltr">
                    OmniOps Enterprise
                  </span>
                  <span className="text-[10px] text-neutral-400 block font-mono">
                    AI Operating System
                  </span>
                </div>
              )}
            </div>

            {/* Dokmeye Jam/Baz kardane Sidebar */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title={sidebarCollapsed ? 'گسترش منو' : 'جمع کردن منو'}
            >
              {sidebarCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          {/* Menuye Asli */}
          <nav className="space-y-1.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all duration-200 cursor-pointer text-xs font-semibold relative group ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600/30 to-indigo-600/20 text-white border border-cyan-500/40 shadow-lg shadow-cyan-950/40 font-bold'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-neutral-400 group-hover:text-neutral-200'}`} />
                  
                  {!sidebarCollapsed && (
                    <div className="flex-1 flex items-center justify-between truncate animate-in fade-in duration-150">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-medium ${
                          isActive ? 'bg-cyan-500/30 text-cyan-300' : 'bg-neutral-800 text-neutral-400'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Khat e neshan-dahandeye fa'al boodan */}
                  {isActive && (
                    <span className="absolute right-0 top-2 bottom-2 w-1 bg-cyan-400 rounded-l-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: User Profile va Logout */}
        <div className="p-4 border-t border-white/5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0">
              <User className="w-4 h-4" />
            </div>
            {!sidebarCollapsed && (
              <div className="truncate text-right flex-1 animate-in fade-in duration-150">
                <span className="text-white text-xs font-bold block truncate">{currentUser.email}</span>
                <span className="text-[10px] text-emerald-400 font-mono block">SuperAdmin</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCurrentUser(null)}
            className="w-full py-2 px-3 rounded-xl bg-white/[0.03] hover:bg-red-950/40 hover:text-red-400 text-neutral-400 text-xs font-medium transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            title="خروج از حساب کاربری"
          >
            <LogOut className="w-4 h-4" />
            {!sidebarCollapsed && <span>خروج از پنل</span>}
          </button>
        </div>
      </aside>

      {/* 2. Mohtavaye Asli (Main Workspace Content) */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        
        {/* Topbar e Shishei (Glassmorphic Header Bar) */}
        <header className="sticky top-0 z-30 glass-surface border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between backdrop-blur-2xl gap-3">
          
          {/* Rast: Mobile Menu Toggle va Onvane Bakhsh */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                {navigationItems.find(n => n.id === activeTab)?.label}
              </span>
              <span className="text-neutral-600 hidden lg:inline">|</span>
              <span className="text-xs font-mono text-cyan-400 hidden lg:inline">
                OpenRouter DeepSeek V4 Flash Active
              </span>
            </div>
          </div>

          {/* Markaz: Jostejooye Sarāsari (Global Search across Nodes, Agents & Settings) */}
          <div className="flex-1 max-w-sm sm:max-w-md mx-auto flex justify-center">
            <GlobalHeaderSearch onSelectResult={handleSearchResultSelect} />
          </div>

          {/* Chap: Dokmehaye Akshan (User View, Logout) */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Dokmeye Taghir be Namaye Karbare Ma'mooli baraye Test */}
            <button
              onClick={() => setCurrentUser({ email: 'user@omniops.ai', role: 'Standard User' })}
              className="hidden sm:flex px-2.5 py-1.5 text-xs font-semibold text-purple-300 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/50 rounded-xl transition-all cursor-pointer items-center gap-1.5"
              title="مشاهده محیط کاربر معمولی (فقط چت، مدل‌ها و ایجنت ویندوز خود)"
            >
              <User className="w-3.5 h-3.5" />
              <span>نمای کاربر معمولی</span>
            </button>

            <button
              onClick={() => setCurrentUser(null)}
              className="p-1.5 px-2.5 rounded-xl bg-red-950/30 hover:bg-red-900/50 text-red-300 border border-red-800/40 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
              title="خروج از حساب"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer (Baraye Gooshi va Tablet) */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-surface-elevated border-b border-white/10 p-4 space-y-2 animate-in slide-in-from-top duration-200">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold ${
                    isActive ? 'bg-cyan-600 text-white font-bold' : 'text-neutral-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono opacity-80">{item.badge}</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Workspace Canvas (Mahalle Namayeshe Tab-ha) */}
        <main className="flex-1 p-4 sm:p-7 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          {activeTab === 'dashboard' && (
            <MasterControlDashboard
              onNavigateToTab={(tab, agentId) => {
                if (tab === 'agent') {
                  handleNavigateToAgentChat(agentId);
                } else {
                  setActiveTab(tab);
                }
              }}
              initialModalOpen={activeModalFromSearch}
              onClearInitialModal={() => setActiveModalFromSearch(null)}
            />
          )}

          {activeTab === 'agent' && (
            <OmniAgentInterface initialTargetAgentId={selectedAgentForChat} />
          )}

          {activeTab === 'mcp' && (
            <MCPMarketplace />
          )}

          {activeTab === 'omniroute' && (
            <OmniRouteHub />
          )}

          {activeTab === 'providers' && (
            <AIProvidersHub />
          )}

          {activeTab === 'windows' && (
            <WindowsAgentHub
              onNavigateToAgentChat={handleNavigateToAgentChat}
            />
          )}
        </main>
      </div>

    </div>
  );
}
