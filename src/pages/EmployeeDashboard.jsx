import { Clock, Calendar, LogOut } from 'lucide-react';

export default function EmployeeDashboard() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/signin';
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black italic underline decoration-blue-500">Mon Espace</h1>
            <p className="text-slate-400">Bienvenue sur votre portail employé</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl transition-all border border-white/5 text-sm font-bold"
          >
            <LogOut size={18} /> Quitter
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 p-10 rounded-[2.5rem] mb-8">
          <Clock className="text-blue-500 mb-4" size={40} />
          <h2 className="text-2xl font-black mb-2">Prêt à travailler ?</h2>
          <p className="text-slate-400 mb-6 italic text-sm">Votre prochain shift commence demain à 09:00.</p>
          <button className="bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-3 rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-500/20">
            Pointer l'arrivée
          </button>
        </div>

        <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem]">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-white/5 rounded-xl"><Calendar size={20} className="text-slate-400"/></div>
             <div>
                <p className="text-xs font-black text-slate-500 uppercase">Calendrier</p>
                <p className="font-bold text-sm">Consulter mes horaires de la semaine</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}