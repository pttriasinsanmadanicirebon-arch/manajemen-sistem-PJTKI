import React from 'react';
import { auth, logout } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Button } from './ui/button';
import { ThemeToggle } from './ThemeToggle';
import { 
  LogOut, 
  User, 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Truck, 
  FileText, 
  BarChart3, 
  Settings,
  Menu,
  X,
  Briefcase
} from 'lucide-react';
import { Login } from './Login';

import { SystemSettings } from '../types';

export type TabType = 'dashboard' | 'cpmi' | 'tracking' | 'finance' | 'sponsors' | 'reports' | 'settings';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  systemSettings: SystemSettings | null;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, systemSettings }) => {
  const [user] = useAuthState(auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  if (!user) {
    return <Login />;
  }

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'cpmi', label: 'Database CPMI', icon: <Users size={20} /> },
    { id: 'tracking', label: 'Tracking Proses', icon: <Truck size={20} /> },
    { id: 'finance', label: 'Keuangan', icon: <CreditCard size={20} /> },
    { id: 'sponsors', label: 'Sponsors', icon: <Briefcase size={20} /> },
    { id: 'reports', label: 'Laporan', icon: <FileText size={20} /> },
    { id: 'settings', label: 'Pengaturan', icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-slate-900 dark:bg-black/40 dark:backdrop-blur-xl flex flex-col hidden lg:flex text-slate-300 shrink-0 border-r dark:border-slate-800 no-print">
        <div className="p-8 mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-xl shadow-blue-900/40">
             {systemSettings?.companyName?.charAt(0) || 'P'}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-white uppercase leading-tight">
               {systemSettings?.companyName || 'P3MI System'}
            </span>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Enterprise ERP</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <NavItem 
              key={item.id}
              icon={item.icon} 
              label={item.label} 
              active={activeTab === item.id} 
              onClick={() => setActiveTab(item.id)} 
            />
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="rounded-2xl bg-slate-800/50 dark:bg-white/5 p-4 text-[10px] border border-white/5 shadow-inner">
            <div className="mb-2 font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              Sistem Online
            </div>
            <p className="text-slate-300 leading-relaxed font-medium">Data tersinkronisasi secara realtime ke database pusat.</p>
          </div>
          
          <div className="mt-8 flex items-center space-x-3 p-2 bg-black/20 dark:bg-white/5 rounded-2xl border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700">
              {user.photoURL ? <img src={user.photoURL} alt="" /> : <User size={20} className="text-slate-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user.displayName}</p>
              <p className="text-[10px] text-slate-500 truncate font-semibold uppercase tracking-wider">Super Admin</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start space-x-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 px-2 mt-2 transition-colors rounded-xl font-bold" onClick={() => logout()}>
            <LogOut size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 lg:px-10 flex items-center justify-between shrink-0 shadow-sm transition-colors no-print">
           <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden dark:text-slate-200" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
              <div className="flex flex-col">
                 <h1 className="text-xl font-black text-slate-900 dark:text-white capitalize font-display">
                   {navItems.find(i => i.id === activeTab)?.label}
                 </h1>
                 <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden sm:block">
                   TIM Management Pro &bull; {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                 </p>
              </div>
           </div>

           <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="hidden sm:flex flex-col text-right mr-2">
                <p className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-tight">Administrasi</p>
                <div className="flex items-center justify-end gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Cabang Cirebon</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer lg:hidden">
                <User size={20} />
              </div>
           </div>
        </header>
        
        <div className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950 p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="w-64 h-full bg-slate-900 dark:bg-slate-950 p-6 flex flex-col pt-20"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex-1 space-y-1">
              {navItems.map((item) => (
                <NavItem 
                  key={item.id}
                  icon={item.icon} 
                  label={item.label} 
                  active={activeTab === item.id} 
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }} 
                />
              ))}
            </nav>
            <Button 
              variant="ghost" 
              className="w-full justify-start space-x-2 text-slate-400 mt-auto rounded-xl font-bold" 
              onClick={() => logout()}
            >
              <LogOut size={18} />
              <span className="text-sm">Logout</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-4 rounded-2xl transition-all duration-300 group relative ${
      active 
        ? 'bg-blue-600 text-white font-bold shadow-2xl shadow-blue-900/40 translate-x-1' 
        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
    }`}
  >
    {active && (
      <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full"></div>
    )}
    <span className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-blue-400 group-hover:scale-110 transition-transform'}`}>{icon}</span>
    <span className="text-[13px] font-bold tracking-tight uppercase tracking-widest">{label}</span>
  </button>
);
