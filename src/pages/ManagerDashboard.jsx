import { Users, BarChart3, LogOut } from 'lucide-react';

export default function ManagerDashboard() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/signin';
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black italic">Dashboard <span className="text-blue-500">Manager</span></h1>
            <p className="text-slate-400">Gestion de l'équipe et des horaires</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-xl transition-all border border-red-500/20 text-sm font-bold"
          >
            <LogOut size={18} /> Déconnexion
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2rem] backdrop-blur-xl">
            <Users className="text-blue-500 mb-4" size={32} />
            <h3 className="text-xl font-bold">Membres de l'équipe</h3>
            <p className="text-slate-400 text-sm mt-2">Vous avez 12 employés sous votre gestion.</p>
          </div>
          
          <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2rem] backdrop-blur-xl">
            <BarChart3 className="text-emerald-500 mb-4" size={32} />
            <h3 className="text-xl font-bold">Rapports Hebdomadaires</h3>
            <p className="text-slate-400 text-sm mt-2">Consulter les heures totales travaillées cette semaine.</p>
          </div>
        </div>
      </div>
    </div>
  );
}