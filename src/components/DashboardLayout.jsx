import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  BarChart3, Calendar, Users, LogOut, 
  Bell, ClipboardList, ShieldCheck, Building,
  Clock
} from 'lucide-react';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = normalizeRole(localStorage.getItem('userRole'));
  const isEmployee = ['EMPLOYEE', 'NEW_HIRE', 'ASSISTANT_MANAGER', 'TRAINEE'].includes(userRole);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/signin');
  };

  return (
    <div className={`fixed inset-0 flex overflow-hidden ${isEmployee ? 'bg-[#020617] text-white' : 'bg-[#F4F6FB] text-[#0B1023]'}`}>
      <aside className={`w-64 border-r flex flex-col justify-between h-full z-50 shadow-sm ${isEmployee ? 'bg-[#020617] border-slate-800' : 'bg-white border-gray-200'}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20 text-white">
              <BarChart3 size={18} />
            </div>
            <span className={`text-xl font-black tracking-tighter italic ${isEmployee ? 'text-white' : 'text-[#0B1023]'}`}>TimeWork</span>
          </div>

          <nav className="space-y-1">
            {userRole === 'SUPER_ADMIN' && (
              <>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 mb-2">Super Admin</p>
                <SidebarLink to="/super-admin" icon={<ShieldCheck size={18} />} label="Vue Globale" active={location.pathname === '/super-admin'} isEmployee={false} />
                <SidebarLink to="/manage-companies" icon={<Building size={18} />} label="Entreprises" active={location.pathname === '/manage-companies'} isEmployee={false} />
              </>
            )}

            {userRole === 'MANAGER' && (
              <>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 mb-2">Gestion</p>
                <SidebarLink to="/manager-dashboard" icon={<BarChart3 size={18} />} label="Vue d'ensemble" active={location.pathname === '/manager-dashboard'} isEmployee={false} />
                <SidebarLink to="/schedule" icon={<Calendar size={18} />} label="Planning" active={location.pathname === '/schedule'} isEmployee={false} />
                <SidebarLink to="/employees" icon={<Users size={18} />} label="Employés" active={location.pathname === '/employees'} isEmployee={false} />
                <SidebarLink to="/leave-requests" icon={<ClipboardList size={18} />} label="Congés" active={location.pathname === '/leave-requests'} isEmployee={false} />
              </>
            )}

            {isEmployee && (
              <>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-2">Mon Espace</p>
                <SidebarLink to="/employee-dashboard" icon={<Clock size={18} />} label="Pointage (Live)" active={location.pathname === '/employee-dashboard' && (location.search === '?tab=POINTAGE' || location.search === '')} isEmployee={true} />
                <SidebarLink to="/employee-dashboard?tab=DISPO" icon={<ClipboardList size={18} />} label="Mes Disponibilités" active={location.pathname === '/employee-dashboard' && location.search === '?tab=DISPO'} isEmployee={true} />
                <SidebarLink to="/employee-dashboard?tab=CONGES" icon={<Calendar size={18} />} label="Mes Congés" active={location.pathname === '/employee-dashboard' && location.search === '?tab=CONGES'} isEmployee={true} />
              </>
            )}
          </nav>
        </div>

        <div className={`p-6 border-t ${isEmployee ? 'border-slate-800' : 'border-gray-100'}`}>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all w-full font-bold text-sm ${isEmployee ? 'text-slate-400 hover:bg-red-500/10 hover:text-red-500' : 'text-gray-500 hover:text-red-500 hover:bg-red-50'}`}
          >
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </aside>

      <main className={`flex-1 h-full overflow-y-auto ${isEmployee ? 'bg-[#020617]' : 'bg-[#F4F6FB]'}`}>
        <header className={`h-16 border-b flex items-center justify-between px-10 sticky top-0 backdrop-blur-md z-10 ${isEmployee ? 'bg-[#020617]/80 border-slate-800' : 'bg-[#F4F6FB]/80 border-gray-200'}`}>
          <h2 className={`font-bold text-sm uppercase tracking-widest italic ${isEmployee ? 'text-slate-400' : 'text-gray-400'}`}>
            Console {userRole.replace('_', ' ')}
          </h2>
          <div className="flex items-center gap-4">
            <Bell size={18} className={`cursor-pointer transition-colors ${isEmployee ? 'text-slate-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`} />
            <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-sm">
              {userRole.charAt(0)}
            </div>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}

function normalizeRole(role) {
  return String(role || '')
    .trim()
    .toUpperCase()
    .replace(/^ROLE_/, '');
}

function SidebarLink({ to, icon, label, active, isEmployee }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all ${
        active
        ? (isEmployee ? 'bg-blue-600/10 text-blue-500 font-bold border-l-4 border-blue-500' : 'bg-blue-50 text-blue-600 font-bold border-l-4 border-blue-600')
        : (isEmployee ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-gray-500 hover:text-[#0B1023] hover:bg-gray-50')
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}