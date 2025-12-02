
import React, { useState, createContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Camera, 
  ArrowLeftRight, 
  Database, 
  Shield, 
  Settings, 
  Moon, 
  Sun,
  Bell,
  Search,
  Film,
  Menu
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// 1. Create Context for child pages to control sidebar
export const LayoutContext = createContext({
  isCollapsed: false,
  setCollapsed: (v: boolean) => {},
});

// Custom Logo Component
const Logo = ({ collapsed }: { collapsed: boolean }) => (
  <div className={`flex items-center ${collapsed ? 'justify-center w-full' : 'gap-3'}`}>
    <div className="relative w-10 h-10 flex-shrink-0 transition-all duration-300">
       <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M20 4L36 32H4L20 4Z" fill="#FACC15" className="drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]" />
         <path d="M20 18C20 18 14 26 8 26C11 26 15 22 20 14C25 22 29 26 32 26C26 26 20 18 20 18Z" fill="#020617"/>
       </svg>
    </div>
    <div className={`flex flex-col overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
      <span className="text-lg font-bold text-slate-100 tracking-wide leading-none whitespace-nowrap">群鸟资管</span>
      <span className="text-[0.6rem] font-bold text-brand-400 tracking-[0.2em] mt-1 whitespace-nowrap">FOBAMS</span>
    </div>
  </div>
);

export const Layout: React.FC<LayoutProps> = ({ children, darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const [isCollapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: '工作台', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: '硬件资产', path: '/hardware', icon: <Camera size={20} /> },
    { name: '借还管理', path: '/check-in-out', icon: <ArrowLeftRight size={20} /> },
    { name: '媒资索引', path: '/media', icon: <Database size={20} /> },
    { name: '成片管理', path: '/master-works', icon: <Film size={20} /> }, 
    { name: '账号保险箱', path: '/accounts', icon: <Shield size={20} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <LayoutContext.Provider value={{ isCollapsed, setCollapsed }}>
      <div className={`flex h-screen overflow-hidden bg-dark-bg text-slate-300`}>
        {/* Sidebar - Glassy & Dark with Transition */}
        <aside 
          className={`${isCollapsed ? 'w-20' : 'w-64'} flex-shrink-0 flex flex-col border-r border-white/5 bg-dark-bg/50 backdrop-blur-sm z-20 transition-all duration-300 ease-in-out`}
        >
          <div className="h-20 flex items-center px-0 justify-center relative">
            <div className={`${isCollapsed ? 'px-0' : 'px-6'} w-full transition-all`}>
               <Logo collapsed={isCollapsed} />
            </div>
            {/* Collapse Toggle Button (Optional, for manual control) */}
            <button 
                onClick={() => setCollapsed(!isCollapsed)}
                className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white z-50 opacity-0 hover:opacity-100 transition-opacity"
            >
                <Menu size={12} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-6 overflow-x-hidden">
            <ul className="space-y-2 px-3">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`relative group flex items-center rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden ${
                      isCollapsed ? 'justify-center px-0 py-3' : 'px-4 py-3'
                    } ${
                      isActive(item.path)
                        ? 'text-brand-400 bg-white/5 shadow-[0_0_20px_rgba(250,204,21,0.05)]'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                    }`}
                    title={isCollapsed ? item.name : ''}
                  >
                    {isActive(item.path) && (
                      <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-400 rounded-r-full shadow-[0_0_10px_rgba(250,204,21,0.5)] transition-all ${isCollapsed ? 'h-5' : 'h-8'}`}></div>
                    )}
                    
                    <span className={`transition-transform duration-300 ${
                        isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'
                    } ${!isCollapsed ? 'mr-3' : ''}`}>
                      {item.icon}
                    </span>
                    
                    <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                        {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className={`mt-8 px-8 text-xs font-bold text-slate-600 uppercase tracking-widest mb-4 transition-all ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
              System
            </div>
            <ul className="space-y-1 px-3">
               <li>
                  <a href="#" className={`flex items-center rounded-xl text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-colors ${
                      isCollapsed ? 'justify-center px-0 py-3' : 'px-4 py-3'
                  }`}>
                    <span className={`${!isCollapsed ? 'mr-3' : ''}`}><Settings size={20}/></span>
                    <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                        系统设置
                    </span>
                  </a>
               </li>
            </ul>
          </nav>

          <div className={`p-4 mx-2 mb-4 rounded-2xl border transition-all duration-300 ${
              isCollapsed 
              ? 'bg-transparent border-transparent flex justify-center' 
              : 'bg-gradient-to-br from-white/5 to-transparent border-white/5 mx-4'
          }`}>
            <div className="flex items-center">
              <div className="relative flex-shrink-0">
                  <img src="https://picsum.photos/40/40?random=user" alt="User" className="w-10 h-10 rounded-full border border-white/10" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-dark-bg"></div>
              </div>
              <div className={`ml-3 overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 ml-0' : 'w-auto opacity-100'}`}>
                <p className="text-sm font-bold text-slate-200 truncate">Admin User</p>
                <p className="text-xs text-brand-400/80 truncate">设备部主管</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-gradient-to-br from-dark-bg to-[#050b1d]">
          {/* Background Ambient Glows */}
          <div className="absolute top-0 left-0 w-full h-96 bg-brand-500/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>

          {/* Header */}
          <header className="h-20 flex items-center justify-between px-8 flex-shrink-0 z-10">
            {/* Search Removed per user request */}
            <div className="flex items-center">
               {/* Left side spacer or breadcrumbs could go here */}
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2.5 text-slate-400 hover:text-slate-100 hover:bg-white/5 rounded-full relative transition-colors">
                <Bell size={20} />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-brand-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.6)]"></span>
              </button>
              <button 
                onClick={toggleDarkMode}
                className="p-2.5 text-slate-400 hover:text-brand-400 hover:bg-white/5 rounded-full transition-colors"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-8 relative z-10 scroll-smooth">
            {children}
          </main>
        </div>
      </div>
    </LayoutContext.Provider>
  );
};
