import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  BarChart3, Calendar, Users, LogOut, 
  Bell, ClipboardList, ShieldCheck, Building,
  Clock
} from 'lucide-react';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = String(localStorage.getItem('userRole') || '').toUpperCase().trim();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/signin');
  };

  return (
    <div className="fixed inset-0 flex bg-[#F4F6FB] text-[#0B1023] overflow-hidden">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between h-full z-50 shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20 text-white">
              <BarChart3 size={18} />
            </div>
            <span className="text-xl font-black tracking-tighter italic text-[#0B1023]">TimeWork</span>
          </div>
          
          <nav className="space-y-1">
            {userRole === 'SUPER_ADMIN' && (
              <>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 mb-2">Super Admin</p>
                <SidebarLink to="/super-admin" icon={<ShieldCheck size={18} />} label="Vue Globale" active={location.pathname === '/super-admin'} />
                <SidebarLink to="/manage-companies" icon={<Building size={18} />} label="Entreprises" active={location.pathname === '/manage-companies'} />
              </>
            )}

            {userRole === 'MANAGER' && (
              <>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 mb-2">Gestion</p>
                <SidebarLink to="/manager-dashboard" icon={<BarChart3 size={18} />} label="Vue d'ensemble" active={location.pathname === '/manager-dashboard'} />
                <SidebarLink to="/schedule" icon={<Calendar size={18} />} label="Planning" active={location.pathname === '/schedule'} />
                <SidebarLink to="/employees" icon={<Users size={18} />} label="Employés" active={location.pathname === '/employees'} />
                <SidebarLink to="/leave-requests" icon={<ClipboardList size={18} />} label="Congés" active={location.pathname === '/leave-requests'} />
              </>
            )}

            {userRole === 'EMPLOYEE' && (
              <>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 mb-2">Mon Espace</p>
                <SidebarLink to="/employee-dashboard?tab=POINTAGE" icon={<Clock size={18} />} label="Pointage (Live)" active={location.pathname === '/employee-dashboard' && (location.search === '?tab=POINTAGE' || location.search === '')} />
                <SidebarLink to="/employee-dashboard?tab=DISPO" icon={<ClipboardList size={18} />} label="Mes Disponibilités" active={location.pathname === '/employee-dashboard' && location.search === '?tab=DISPO'} />
                <SidebarLink to="/employee-dashboard?tab=CONGES" icon={<Calendar size={18} />} label="Mes Congés" active={location.pathname === '/employee-dashboard' && location.search === '?tab=CONGES'} />
              </>
            )}
          </nav>
        </div>

        <div className="p-6 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all w-full font-bold text-sm"
          >
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 h-full overflow-y-auto bg-[#F4F6FB]">
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-10 sticky top-0 bg-[#F4F6FB]/80 backdrop-blur-md z-10">
          <h2 className="font-bold text-sm text-gray-400 uppercase tracking-widest italic">
            Console {userRole.replace('_', ' ')}
          </h2>
          <div className="flex items-center gap-4">
            <Bell size={18} className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" />
            <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs uppercase border border-blue-200">
              {userRole.charAt(0)}
            </div>
          </div>
        </header>
        
        <Outlet />
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
        ? 'bg-blue-50 text-blue-600 font-bold border-l-4 border-blue-600' 
        : 'text-gray-500 hover:text-[#0B1023] hover:bg-gray-50'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}