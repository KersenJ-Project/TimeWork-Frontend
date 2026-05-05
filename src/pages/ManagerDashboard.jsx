import { Users, Clock, ShieldCheck, UserCheck, Check, X } from 'lucide-react';

export default function ManagerDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black italic tracking-tighter">Tableau de <span className="text-blue-500">Bord</span></h1>
        <p className="text-slate-500 text-sm">Résumé de l'activité pour la semaine en cours.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MiniStat label="Effectif" value="12" color="blue" />
        <MiniStat label="Heures" value="156h" color="emerald" />
        <MiniStat label="Alertes" value="3" color="red" />
        <MiniStat label="Sessions" value="Hiver 26" color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="font-bold text-slate-300 italic">Approbations en attente</h3>
            <button className="text-[10px] font-black uppercase text-blue-500 hover:underline">Voir tout</button>
          </div>
          
          <div className="bg-slate-900/20 border border-white/5 rounded-3xl overflow-hidden">
            <ApprovalItem name="Mehdi Kaouache" email="test@gmail.com" />
            <ApprovalItem name="Anas Ben" email="anas.b@work.com" />
            <ApprovalItem name="Sarah Connor" email="s.connor@future.com" />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-bold text-slate-300 italic px-2">Présences (Live)</h3>
          <div className="bg-slate-900/20 border border-white/5 rounded-3xl p-6 space-y-6">
            <LiveUser name="Samuel L." time="08:54" />
            <LiveUser name="Kevin G." time="09:12" />
            <LiveUser name="Julie M." time="09:30" />
          </div>
        </section>
      </div>
    </div>
  );
}

function MiniStat({ label, value, color }) {
  const colors = {
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    red: 'text-red-500 bg-red-500/10 border-red-500/20',
    purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20'
  };

  return (
    <div className={`p-5 rounded-2xl border ${colors[color]} flex flex-col`}>
      <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{label}</span>
      <span className="text-2xl font-black tracking-tighter mt-1">{value}</span>
    </div>
  );
}

function ApprovalItem({ name, email }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-all">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 bg-slate-800 rounded-full flex items-center justify-center text-xs font-bold text-slate-400">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-bold">{name}</p>
          <p className="text-[10px] text-slate-500">{email}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 transition-all hover:text-white">
          <Check size={16} />
        </button>
        <button className="h-8 w-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 transition-all hover:text-white">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

function LiveUser({ name, time }) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        <span className="text-sm font-medium text-slate-200">{name}</span>
      </div>
      <span className="text-[10px] font-bold text-slate-500">{time}</span>
    </div>
  );
}