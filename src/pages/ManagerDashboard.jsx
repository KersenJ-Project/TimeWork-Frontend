import { useState, useEffect } from 'react';
import { Users, ShieldCheck, Clock, Calendar, ChevronRight } from 'lucide-react';
import api from '../api/axios';
import { useLanguage } from '../context/LanguageContext';
import { managerTranslations } from '../translations/manager';
import { MiniStat, ApprovalItem, ShiftItem, LiveUser } from '../components/manager/DashboardWidgets';

export default function ManagerDashboard() {
  const { lang } = useLanguage();
  const currentLang = lang ? lang.toLowerCase() : 'fr';
  const t = managerTranslations[currentLang] || managerTranslations['fr'];

  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const pendingRes = await api.get('/managers/users/pending');
      setPendingUsers(pendingRes.data);
    } catch (e) {
      console.error(e);
    }

    try {
      const approvedRes = await api.get('/managers/users/approved');
      const filteredApproved = approvedRes.data.filter(u => {
        const role = String(u.role).toLowerCase().trim();
        return role !== 'super_admin' && role !== 'manager' && role !== 'admin';
      });
      setApprovedUsers(filteredApproved);
    } catch (e) {
      console.error(e);
    }

    try {
      const shiftsRes = await api.get('/shift');
      setShifts(shiftsRes.data);
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.patch(`/managers/users/${id}/approve`);
      fetchData();
    } catch (e) {
      alert("Erreur lors de l'approbation.");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.delete(`/managers/users/${id}`);
      fetchData();
    } catch (e) {
      alert("Erreur lors du rejet.");
    }
  };

  const activeEmployeesCount = approvedUsers.filter(u => Boolean(u.isWorking)).length;

  const getIsoDate = (dStr) => {
    if (!dStr) return null;
    const rawDate = dStr.split(/[T ]/)[0];
    const parts = rawDate.split(/[-/]/);
    if (parts.length === 3) {
      const year = parts[0].length === 4 ? parts[0] : parts[2];
      const month = parts[0].length === 4 ? parts[1] : parts[1];
      const day = parts[0].length === 4 ? parts[2] : parts[0];
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return rawDate;
  };

  const todayIso = new Date().toISOString().split('T')[0];
  const upcomingShifts = shifts.filter(s => {
    const shiftDate = getIsoDate(s.date);
    return shiftDate && shiftDate >= todayIso;
  }).sort((a, b) => {
    const dateA = getIsoDate(a.date);
    const dateB = getIsoDate(b.date);
    return dateA.localeCompare(dateB);
  }).slice(0, 4);

  return (
    <div className="w-full p-6 lg:p-10 space-y-8 min-h-[calc(100vh-4rem)] text-white">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-slate-800 pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter">Tableau de <span className="text-blue-500">Bord</span></h1>
          <p className="text-slate-400 font-medium mt-1">{t.welcomeMessage || 'Bienvenue dans votre espace de gestion.'}</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-20 text-slate-500 font-black italic animate-pulse">Chargement des données du dashboard...</div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MiniStat label="Employés Totaux" value={approvedUsers.length} bg="bg-blue-500/10" iconColor="text-blue-400" />
            <MiniStat label="En Attente" value={pendingUsers.length} bg="bg-orange-500/10" iconColor="text-orange-400" />
            <MiniStat label="Shifts Actifs" value={upcomingShifts.length} bg="bg-purple-500/10" iconColor="text-purple-400" />
            <MiniStat label="En Ligne" value={activeEmployeesCount} bg="bg-emerald-500/10" iconColor="text-emerald-400" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
                  <h2 className="text-xl font-black text-white italic tracking-tighter flex items-center gap-2">
                    <ShieldCheck className="text-orange-500" /> Nouvelles <span className="text-orange-500">Inscriptions</span>
                  </h2>
                  <span className="bg-orange-500/10 text-orange-400 text-xs font-black px-3 py-1 rounded-lg border border-orange-500/20">{pendingUsers.length}</span>
                </div>
                {pendingUsers.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 font-bold italic uppercase text-sm">Aucune demande en attente.</div>
                ) : (
                  <div className="divide-y divide-slate-800">
                    {pendingUsers.slice(0, 5).map(user => (
                      <ApprovalItem key={user.id} user={user} onApprove={() => handleApprove(user.id)} onReject={() => handleReject(user.id)} t={t} />
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
                  <h2 className="text-xl font-black text-white italic tracking-tighter flex items-center gap-2">
                    <Calendar className="text-purple-500" /> Prochains <span className="text-purple-500">Shifts</span>
                  </h2>
                </div>
                {upcomingShifts.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 font-bold italic uppercase text-sm">Aucun shift prévu.</div>
                ) : (
                  <div className="divide-y divide-slate-800">
                    {upcomingShifts.map(shift => (
                      <ShiftItem key={shift.id} shift={shift} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 shadow-sm">
                <h3 className="text-sm font-black uppercase tracking-widest text-emerald-500 mb-6 flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  Employés Actifs
                </h3>
                {activeEmployeesCount === 0 ? (
                  <p className="text-slate-500 italic font-bold text-center py-6 text-sm">Personne n'est pointé actuellement.</p>
                ) : (
                  <div className="space-y-3">
                    {approvedUsers.filter(u => Boolean(u.isWorking)).map(user => (
                      <LiveUser key={user.id} name={`${user.firstName} ${user.lastName}`} time="EN LIGNE" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
