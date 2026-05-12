import { useState, useEffect } from 'react';
import { Users, Clock, ShieldCheck, Check, X, Calendar, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import { useLanguage } from '../context/LanguageContext';
import { managerTranslations } from '../translations/manager';

export default function ManagerDashboard() {
  const { lang } = useLanguage();
  const currentLang = lang ? lang.toLowerCase() : 'fr';
  const t = managerTranslations[currentLang] || managerTranslations['fr'];

  const [pendingUsers, setPendingUsers] = useState([]);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [approvedUsersList, setApprovedUsersList] = useState([]);
  const [shifts, setShifts] = useState([]); // Nouveau : pour les shifts
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [pendingRes, approvedRes, shiftsRes] = await Promise.all([
        api.get('/managers/users/pending'),
        api.get('/managers/users/approved'),
        api.get('/shift').catch(() => ({ data: [] })) // On récupère les shifts
      ]);

      const onlyEmployees = approvedRes.data.filter(u => {
        const r = String(u.role).toLowerCase().trim();
        return r !== 'super_admin' && r !== 'manager' && r !== 'admin';
      });

      setPendingUsers(pendingRes.data);
      setEmployeeCount(onlyEmployees.length);
      setApprovedUsersList(onlyEmployees);
      setShifts(shiftsRes.data || []);
    } catch (error) {
      console.error("Erreur API :", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.patch(`/managers/users/${id}/approve`);
      fetchData();
    } catch (error) {
      alert("Erreur lors de l'approbation.");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`/managers/users/${id}/reject`);
      fetchData();
    } catch (error) {
      alert("Erreur lors du refus.");
    }
  };

  // Calcul pour savoir combien de shifts sont prévus aujourd'hui
  const today = new Date().toISOString().split('T')[0];
  const shiftsToday = shifts.filter(s => s.startTime.startsWith(today));

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 font-black italic uppercase animate-pulse">Synchronisation du dashboard...</div>;
  }

  return (
    <div className="w-full bg-[#F4F6FB] rounded-[2rem] p-6 lg:p-10 text-[#0B1023] space-y-8 min-h-screen">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">Manager <span className="text-blue-600">Dashboard</span></h1>
          <p className="text-gray-500 font-medium mt-1 italic">{t?.dashboardSubtitle || "Vue d'ensemble de votre équipe."}</p>
        </div>
        <div className="hidden md:block text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date du jour</p>
            <p className="font-black text-lg">{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</p>
        </div>
      </div>

      {/* STATISTIQUES MISES À JOUR */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MiniStat label="EFFECTIF" value={employeeCount.toString()} bg="bg-blue-50" iconColor="text-blue-600" />
        <MiniStat label="HEURES" value="--" bg="bg-emerald-50" iconColor="text-emerald-600" />
        <MiniStat label="ALERTES" value={pendingUsers.length.toString()} bg="bg-red-50" iconColor="text-red-600" />
        {/* Ici on affiche le nombre de shifts totaux ou du jour */}
        <MiniStat label="SHIFTS" value={shifts.length.toString()} bg="bg-purple-50" iconColor="text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-6">
          
          {/* SECTION : APPROBATIONS */}
          <div className="space-y-4">
            <h3 className="font-black text-gray-400 tracking-[0.1em] uppercase text-xs ml-2">Demandes en attente</h3>
            <div className="bg-white border border-gray-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                {pendingUsers.length > 0 ? (
                pendingUsers.map(user => (
                    <ApprovalItem 
                    key={user.id} 
                    user={user} 
                    onApprove={() => handleApprove(user.id)}
                    onReject={() => handleReject(user.id)}
                    t={t}
                    />
                ))
                ) : (
                <div className="p-12 text-center font-bold text-gray-300 italic uppercase">Aucune demande.</div>
                )}
            </div>
          </div>

          {/* NOUVELLE SECTION : APERÇU DES SHIFTS */}
          <div className="space-y-4">
            <h3 className="font-black text-gray-400 tracking-[0.1em] uppercase text-xs ml-2">Prochains Shifts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shifts.slice(0, 4).map(shift => (
                    <div key={shift.id} className="bg-white p-5 rounded-3xl border border-gray-100 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-black">
                                {shift.user?.firstName?.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-sm">{shift.user?.firstName} {shift.user?.lastName}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase">{new Date(shift.startTime).toLocaleDateString('fr-FR')}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Heures</p>
                            <p className="font-black text-xs">{new Date(shift.startTime).getUTCHours()}h - {new Date(shift.endTime).getUTCHours()}h</p>
                        </div>
                    </div>
                ))}
            </div>
          </div>

        </section>

        {/* SECTION : ACTIVITÉ RÉCENTE */}
        <section className="space-y-4">
          <h3 className="font-black text-gray-400 tracking-[0.1em] uppercase text-xs ml-2">Employés Actifs</h3>
          <div className="bg-white border border-gray-200 rounded-[2.5rem] p-8 shadow-sm space-y-6">
            {approvedUsersList.slice(0, 6).map(user => (
              <LiveUser key={user.id} name={`${user.firstName || ''} ${user.lastName || ''}`} time="Connecté" />
            ))}
            {approvedUsersList.length === 0 && (
              <div className="text-gray-300 font-bold text-sm italic">Aucun employé à afficher.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function MiniStat({ label, value, bg, iconColor }) {
  return (
    <div className="bg-white rounded-[2rem] border border-gray-200 p-8 flex flex-col items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bg}`}>
        <Clock className={`${iconColor}`} size={20} />
      </div>
      <div>
        <p className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase mb-1">{label}</p>
        <p className="text-4xl font-black text-[#0B1023] tracking-tighter">{value}</p>
      </div>
    </div>
  );
}

function ApprovalItem({ user, onApprove, onReject, t }) {
  const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Utilisateur';
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-all">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center text-lg font-black text-blue-600">
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-base font-bold text-[#0B1023]">{name}</p>
          <p className="text-xs font-bold text-gray-400">{user.email}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onApprove} className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm border border-emerald-100">
          <Check size={20} className="stroke-[3]" />
        </button>
        <button onClick={onReject} className="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100">
          <X size={20} className="stroke-[3]" />
        </button>
      </div>
    </div>
  );
}

function LiveUser({ name, time }) {
  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4 border border-gray-100">
      <div className="flex items-center gap-3">
        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-sm font-bold text-[#0B1023]">{name}</span>
      </div>
      <span className="text-[10px] font-black tracking-widest uppercase text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg">{time}</span>
    </div>
  );
}