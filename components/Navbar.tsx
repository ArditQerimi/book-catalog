
import React from 'react';
import { Link } from 'react-router-dom';
import { Library, Database, Settings, LogOut, UserCheck, Menu } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  isLoading: boolean;
  isAuthenticated: boolean;
  onLogout: () => void;
  onOpenMenu: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPath, isLoading, isAuthenticated, onLogout, onOpenMenu }) => {
  const activePage = currentPath.substring(1) || 'archive';

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-emerald-100 px-4 md:px-8 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3 md:gap-4 cursor-pointer group">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-800 rounded-[15px] md:rounded-[18px] flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-[15deg]">
          <Library className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-xl md:text-2xl font-bold italic text-emerald-900 leading-none uppercase tracking-tighter">NUR CATALOG</h1>
          <div className="flex items-center gap-1.5 mt-1">
             <Database className={`w-2.5 h-2.5 ${isLoading ? 'text-amber-500 animate-pulse' : 'text-emerald-400'}`} />
             <p className="text-[8px] md:text-[10px] uppercase tracking-tighter text-emerald-600 font-bold">
               {isLoading ? 'Syncing Ledger...' : 'Secure Archive Linked'}
             </p>
          </div>
        </div>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {['Archive', 'Scholars', 'History'].map(label => {
          const path = label.toLowerCase() === 'archive' ? '/' : `/${label.toLowerCase()}`;
          const isActive = activePage === label.toLowerCase() || (label.toLowerCase() === 'archive' && activePage === 'archive');
          return (
            <Link 
              key={label} 
              to={path}
              className={`text-xs font-bold uppercase tracking-[0.2em] transition-all relative py-2 ${isActive ? 'text-emerald-950' : 'text-emerald-900/40 hover:text-emerald-900'}`}
            >
              {label}
              {isActive && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-full" />}
            </Link>
          );
        })}
        <div className="h-6 w-[1px] bg-emerald-100" />
        
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Link 
              to="/admin"
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] transition-all py-2 ${activePage === 'admin' ? 'text-amber-600' : 'text-emerald-900/40 hover:text-emerald-900'}`}
            >
              <Settings className="w-4 h-4" />
              Management
            </Link>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-red-600 hover:text-red-700 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        ) : (
          <Link 
            to="/login"
            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] transition-all py-2 ${activePage === 'login' ? 'text-emerald-950 underline underline-offset-4' : 'text-emerald-900/40 hover:text-emerald-900'}`}
          >
            <UserCheck className="w-4 h-4" />
            Scribe Portal
          </Link>
        )}
      </div>

      <button onClick={onOpenMenu} className="md:hidden p-2.5 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-100">
        <Menu className="w-5 h-5" />
      </button>
    </nav>
  );
};

export default Navbar;
