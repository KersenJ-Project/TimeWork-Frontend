import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart3, Calendar, Users, LogOut, 
  Settings, Bell, ClipboardList, Wallet, 
  MessageSquare, HelpCircle, FileText 
} from 'lucide-react';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/signin');
  };

  return (
    <div className="fixed inset-0 flex bg-[#020617] text-white overflow-hidden">
      <aside className="w-64 bg-slate-900/40 border-r border-white/5 flex flex-col justify-between h-full z-50">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <BarChart3 size={18} />
            </div>
            <span className="text-xl font-bold tracking-tighter italic">TimeWork</span>
          </div>
          
          <nav className="space-y-1">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-2">Principal</p>
            <SidebarLink to="/manager-dashboard" icon={<BarChart3 size={18} />} label="Vue d'ensemble" active={location.pathname === '/manager-dashboard'} />
            <SidebarLink to="/schedule-grid" icon={<Calendar size={18} />} label="Planning" active={location.pathname === '/schedule-grid'} />
            <SidebarLink to="/profil" icon={<Users size={18} />} label="Employés" active={location.pathname === '/profil'} />
            
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-2 mt-6">Gestion</p>
            <SidebarLink to="/requests" icon={<ClipboardList size={18} />} label="Congés" />
            <SidebarLink to="/payroll" icon={<Wallet size={18} />} label="Paie" />
            <SidebarLink to="/reports" icon={<FileText size={18} />} label="Rapports" />
            
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-2 mt-6">Système</p>
            <SidebarLink to="/settings" icon={<Settings size={18} />} label="Paramètres" />
            <SidebarLink to="/messages" icon={<MessageSquare size={18} />} label="Messages" />
          </nav>
        </div>

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 text-slate-400 hover:text-red-400 transition-all w-full font-bold text-sm"
          >
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 h-full overflow-y-auto bg-[#020617]">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-10 sticky top-0 bg-[#020617]/80 backdrop-blur-md z-10">
          <h2 className="font-bold text-sm text-slate-400 uppercase tracking-widest italic">Console Manager</h2>
          <div className="flex items-center gap-4">
            <Bell size={18} className="text-slate-500 cursor-pointer" />
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-xs uppercase">M</div>
          </div>
        </header>
        
        <div className="p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ to, icon, label, active }) {
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all ${
        active 
        ? 'bg-blue-600/10 text-blue-500 font-bold border border-blue-500/20' 
        : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}