import { useState, useEffect } from 'react';
import { Users, ShieldCheck, Check, Edit, X, Search, Calendar, Clock, ArrowRight, Eye, Briefcase } from 'lucide-react';
import api from '../api/axios';
import { useLanguage } from '../context/LanguageContext';
import { managerTranslations } from '../translations/manager';
import EmployeeDetailsModal from '../components/manager/EmployeeDetailsModal';

export default function EmployeesPage() {
  const { lang } = useLanguage();
  const currentLang = lang ? lang.toLowerCase() : 'fr';
  const t = managerTranslations[currentLang] || managerTranslations['fr'];

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ role: '', hourlyRate: '' });
  const [searchTerm, setSearchTerm] = useState("");

  const [detailsUser, setDetailsUser] = useState(null);
  const [userShifts, setUserShifts] = useState([]);
  const [userAvails, setUserAvails] = useState([]);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/managers/users');
      
      // FILTRE SÉCURISÉ : On retire les managers et admins de la liste
      const filtered = response.data.filter(u => {
        const role = String(u.role).toLowerCase().trim();
        return role !== 'super_admin' && role !== 'manager' && role !== 'admin';
      });
      
      setUsers(filtered);
    } catch (error) {
      console.error("Erreur API :", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleApprove = async (id) => {
    try {
      await api.patch(`/managers/users/${id}/approve`);
      fetchUsers();
    } catch (error) {
      alert("Erreur lors de l'approbation.");
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({ role: user.role || 'EMPLOYEE', hourlyRate: user.hourlyRate || '' });
    setIsModalOpen(true);
  };

  const handleSaveRole = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/managers/users/${selectedUser.id}/role-salary`, {
        role: formData.role,
        hourlyRate: parseFloat(formData.hourlyRate)
      });
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      alert("Erreur lors de la sauvegarde.");
    }
  };

  const openDetails = async (user) => {
    setDetailsUser(user);
    setIsDetailsLoading(true);
    try {
      const [shiftsRes, availsRes] = await Promise.all([
        api.get(`/shift/users/${user.id}`).catch(() => ({ data: [] })),
        api.get(`/availability/users/${user.id}`).catch(() => ({ data: [] }))
      ]);
      setUserShifts(shiftsRes.data || []);
      setUserAvails(availsRes.data || []);
    } catch (e) {
      console.error(e);
    }
    setIsDetailsLoading(false);
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "--h--";
    if (/^([01]\d|2[0-3]):([0-5]\d)/.test(timeStr)) {
      return timeStr.substring(0, 5).replace(':', 'h');
    }
    return timeStr;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Inconnue";
    const rawDate = dateStr.split(/[T ]/)[0];
    const parts = rawDate.split(/[-/]/);
    if (parts.length === 3) {
      const year = parts[0].length === 4 ? parts[0] : parts[2];
      const month = parts[0].length === 4 ? parts[1] : parts[1];
      const day = parts[0].length === 4 ? parts[2] : parts[0];
      return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', timeZone: 'UTC' });
    }
    return rawDate;
  };

  const filteredUsers = users.filter(u => {
    const searchStr = searchTerm.toLowerCase();
    return (u.firstName?.toLowerCase().includes(searchStr) || u.lastName?.toLowerCase().includes(searchStr) || u.email?.toLowerCase().includes(searchStr));
  });

  const pendingUsers = filteredUsers.filter(u => u.status === 'PENDING');
  const workingUsers = filteredUsers.filter(u => u.isWorking);
  const approvedUsers = filteredUsers.filter(u => u.status === 'APPROVED');

  return (
    <div className="w-full p-6 lg:p-10 space-y-8 text-white bg-[#020617] min-h-screen">
      <div className="flex justify-between items-center border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter">Gestion des <span className="text-blue-600">{t.employeesTitle || 'Employés'}</span></h1>
          <p className="text-slate-400 font-medium mt-1">{t.employeesSubtitle || 'Gérez votre équipe.'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 shadow-sm h-80 overflow-y-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
            <h3 className="font-black text-slate-500 uppercase tracking-widest text-xs">En attente d'approbation ({pendingUsers.length})</h3>
          </div>
          <div className="space-y-4">
            {pendingUsers.length === 0 ? (
              <p className="text-center text-slate-600 font-bold italic text-sm py-10 uppercase">Aucune demande.</p>
            ) : (
              pendingUsers.map(user => (
                <div key={user.id} className="bg-slate-950/80 p-4 rounded-2xl border border-white/5 flex justify-between items-center hover:bg-slate-800 transition cursor-pointer" onClick={() => openDetails(user)}>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-orange-500/10 text-orange-400 rounded-xl flex items-center justify-center font-black">
                      {user.firstName?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm uppercase">{user.firstName} {user.lastName}</p>
                      <p className="text-[10px] font-black text-slate-500 tracking-widest">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); handleApprove(user.id); }} className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-white transition shadow-sm border border-emerald-500/20">
                      <Check size={16} className="stroke-[3]" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 shadow-sm h-80 overflow-y-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <h3 className="font-black text-slate-500 uppercase tracking-widest text-xs">Employés au travail ({workingUsers.length})</h3>
          </div>
          <div className="space-y-4">
            {workingUsers.length === 0 ? (
              <p className="text-center text-slate-600 font-bold italic text-sm py-10 uppercase">Aucun employé actuellement pointé.</p>
            ) : (
              workingUsers.map(user => (
                <div key={user.id} className="bg-slate-950/80 p-4 rounded-2xl border border-white/5 flex justify-between items-center hover:bg-slate-800 transition cursor-pointer" onClick={() => openDetails(user)}>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center font-black">
                      {user.firstName?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm uppercase">{user.firstName} {user.lastName}</p>
                      <p className="text-[10px] font-black text-slate-500 tracking-widest">{user.role}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">Connecté</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex flex-col sm:flex-row justify-between gap-4">
          <h2 className="text-xl font-black text-white italic tracking-tighter uppercase flex items-center gap-2">
            <Users className="text-blue-500" /> Annuaire Complet
          </h2>
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher un employé..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm font-bold text-white placeholder-slate-500"
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500 font-black italic uppercase animate-pulse">Chargement de l'annuaire...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                  <th className="p-6">Employé</th>
                  <th className="p-6">Email</th>
                  <th className="p-6">Statut</th>
                  <th className="p-6">Rôle</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-white">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-800/50 transition cursor-pointer" onClick={() => openDetails(user)}>
                    <td className="p-6 flex items-center gap-3 font-bold">
                      <div className="h-10 w-10 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl flex items-center justify-center font-black">
                        {user.firstName?.charAt(0)}
                      </div>
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="p-6 text-sm text-slate-400">{user.email}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${user.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                        {user.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="p-6 text-sm font-bold uppercase tracking-tight">{user.role}</td>
                    <td className="p-6 text-right flex justify-end gap-2">
                      <button onClick={(e) => { e.stopPropagation(); openEditModal(user); }} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition shadow-sm border border-blue-500/20">
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/80 backdrop-blur-sm p-4 text-white">
          <div className="bg-slate-900 border border-white/10 p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-white transition"><X size={24} /></button>
            <h2 className="text-2xl font-black italic mb-8 uppercase tracking-tighter">Paramétrage <span className="text-blue-600">Profil</span></h2>
            <form onSubmit={handleSaveRole} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Attribution du Rôle</label>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-2xl px-4 py-4 font-bold outline-none focus:border-blue-500 transition">
                  <option value="EMPLOYEE">Employé</option>
                  <option value="ASSISTANT_MANAGER">Assistant Manager</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Salaire Horaire ($)</label>
                <input type="number" step="0.01" required value={formData.hourlyRate} onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-2xl px-4 py-4 font-bold outline-none focus:border-blue-500" placeholder="0.00" />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl transition shadow-xl shadow-blue-500/10 hover:bg-blue-500 active:scale-95 uppercase tracking-widest">Appliquer les Changements</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETAILS EMPLOYÉ */}
      <EmployeeDetailsModal 
        detailsUser={detailsUser}
        setDetailsUser={setDetailsUser}
        isDetailsLoading={isDetailsLoading}
        userShifts={userShifts}
        userAvails={userAvails}
        formatDate={formatDate}
        formatTime={formatTime}
      />
    </div>
  );
}