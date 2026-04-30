import { Users, BarChart3, LogOut, Clock, ShieldCheck, Calendar, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ManagerDashboard() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/signin';
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex">
      
      <aside className="w-64 bg-slate-900/40 border-r border-white/5 p-8 hidden md:flex flex-col justify-between backdrop-blur-xl h-screen sticky top-0">
        <div>
          <div className="mb-10">
            <h2 className="text-xl font-black tracking-wider text-blue-500">TimeWork</h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Espace Manager</p>
          </div>
          
          <nav className="space-y-3">
            <Link to="/manager-dashboard" className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 text-sm font-bold text-white transition-all">
              <BarChart3 size={16} /> Dashboard
            </Link>
            <Link to="/schedule-grid" className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-2xl text-sm font-bold text-slate-400 hover:text-white transition-all">
              <Calendar size={16} /> Planning Global
            </Link>
            <Link to="/profil" className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-2xl text-sm font-bold text-slate-400 hover:text-white transition-all">
              <Users size={16} /> Employés
            </Link>
          </nav>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all border border-transparent hover:border-red-500/20 text-sm font-bold w-full justify-center"
        >
          <LogOut size={16} /> Quitter
        </button>
      </aside>

      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black italic underline decoration-blue-500">
                Dashboard <span className="text-blue-500">Manager</span>
            </h1>
            <p className="text-slate-400">Gestion de l'équipe et planification des périodes</p>
          </div>
          <button 
            onClick={handleLogout}
            className="md:hidden flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl border border-white/5 text-xs font-bold"
          >
            <LogOut size={16} /> Quitter
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            icon={<Users className="text-blue-500" />} 
            label="Membres" 
            value="12" 
          />
          <StatCard 
            icon={<Clock className="text-emerald-500" />} 
            label="Heures Semaine" 
            value="156h" 
          />
          <StatCard 
            icon={<ShieldCheck className="text-purple-500" />} 
            label="En attente" 
            value="3" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2rem] backdrop-blur-xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <UserCheck className="text-emerald-500" size={24} />
              Présences en direct
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm font-bold">Samuel L.</span>
                </div>
                <span className="text-xs text-slate-500">08:54</span>
              </div>
              
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm font-bold">Anas B.</span>
                </div>
                <span className="text-xs text-slate-500">09:02</span>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/5 rounded-xl">{icon}</div>
        <div>
          <p className="text-xs font-black text-slate-500 uppercase">{label}</p>
          <p className="text-2xl font-black">{value}</p>
        </div>
      </div>
    </div>
  );
}