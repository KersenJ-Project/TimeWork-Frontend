import { useState, useEffect } from 'react';
import { Users, Check, Edit, X, Search } from 'lucide-react';
import api from '../api/axios';
import EmployeeDetailsModal from '../components/manager/EmployeeDetailsModal';

const formatDate = (dateStr) => {
  if (!dateStr) return 'Inconnue';
  const raw = dateStr.split(/[T ]/)[0];
  const [y, m, d] = raw.split('-');
  if (!y || !m || !d) return raw;
  return `${d}/${m}/${y}`;
};

const formatTime = (timeStr) => {
  if (!timeStr) return '--h--';
  if (/^([01]\d|2[0-3]):([0-5]\d)/.test(timeStr)) return timeStr.substring(0, 5).replace(':', 'h');
  return timeStr;
};

import { useLanguage } from '../context/LanguageContext';
import { managerTranslations } from '../translations/manager';

export default function EmployeesPage() {
  const { lang } = useLanguage();
  const currentLang = lang ? lang.toLowerCase() : 'fr';
  const t = managerTranslations[currentLang] || managerTranslations['fr'];
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ role: '', hourlyRate: '' });

  const [detailsUser, setDetailsUser] = useState(null);
  const [userShifts, setUserShifts] = useState([]);
  const [userAvails, setUserAvails] = useState([]);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      
      const approvedRes = await api.get('/managers/users').catch(() => ({ data: [] }));
      const pendingRes = await api.get('/managers/users/pending').catch(() => ({ data: [] }));
      
      const filteredApproved = (approvedRes.data || []).filter(u => {
        const role = String(u.role).toLowerCase().trim();
        return role !== 'super_admin' && role !== 'manager' && role !== 'admin';
      });
      
      const pendingData = (pendingRes.data || []).map(u => ({ ...u, status: 'PENDING' }));
      
      setUsers([...filteredApproved, ...pendingData]);
    } catch (error) {
      console.error('Erreur API :', error);
      setErrorMsg(t.empLoadError);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const [rejectConfirm, setRejectConfirm] = useState(null);

  const handleApprove = async (id) => {
    try {
      setErrorMsg(null);
      await api.patch(`/managers/users/${id}/approve`);
      setSuccessMsg(t.empApproveSuccess);
      setTimeout(() => setSuccessMsg(null), 3000);
      fetchUsers();
    } catch {
      setErrorMsg(t.empApproveError);
    }
  };

  const handleReject = async (id) => {
    setRejectConfirm(id);
  };

  const confirmReject = async () => {
    const id = rejectConfirm;
    setRejectConfirm(null);
    try {
      setErrorMsg(null);
      await api.patch(`/managers/users/${id}/reject`);
      setSuccessMsg(t.empRejectSuccess);
      setTimeout(() => setSuccessMsg(null), 3000);
      fetchUsers();
    } catch {
      setErrorMsg(t.empRejectError);
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
      setErrorMsg(null);
      await api.patch(`/managers/users/${selectedUser.id}/role-salary`, {
        role: formData.role,
        hourlyRate: parseFloat(formData.hourlyRate),
      });
      setIsModalOpen(false);
      setSuccessMsg(t.empRoleSuccess);
      setTimeout(() => setSuccessMsg(null), 3000);
      fetchUsers();
    } catch {
      setErrorMsg(t.empSaveError);
    }
  };

  const openDetails = async (user) => {
    setDetailsUser(user);
    setIsDetailsLoading(true);
    try {
      const [shiftsRes, availsRes] = await Promise.all([
        api.get(`/shift/users/${user.id}`).catch(() => ({ data: [] })),
        api.get(`/availability/users/${user.id}`).catch(() => ({ data: [] })),
      ]);
      setUserShifts(shiftsRes.data || []);
      setUserAvails(availsRes.data || []);
    } catch (e) {
      console.error(e);
    }
    setIsDetailsLoading(false);
  };

  const filteredUsers = users.filter(u => {
    const s = searchTerm.toLowerCase();
    return u.firstName?.toLowerCase().includes(s) || u.lastName?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s);
  });

  const pendingUsers = filteredUsers.filter(u => u.status === 'PENDING');
  const workingUsers = filteredUsers.filter(u => u.isWorking);

  return (
    <div className="w-full p-6 lg:p-10 space-y-8 text-white bg-[#020617] min-h-screen">
      <div className="flex justify-between items-center border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter">{t.empTitle} <span className="text-blue-600">{t.empTitleSpan}</span></h1>
          <p className="text-slate-400 font-medium mt-1">{t.empSubtitle}</p>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl font-bold flex justify-between items-center">
          {errorMsg}
          <button onClick={() => setErrorMsg(null)}><X size={20} /></button>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl font-bold flex justify-between items-center">
          {successMsg}
          <button onClick={() => setSuccessMsg(null)}><X size={20} /></button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* En attente */}
        <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 shadow-sm h-80 overflow-y-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
            <h3 className="font-black text-slate-500 uppercase tracking-widest text-xs">{t.empPending} ({pendingUsers.length})</h3>
          </div>
          <div className="space-y-4">
            {pendingUsers.length === 0 ? (
              <p className="text-center text-slate-600 font-bold italic text-sm py-10 uppercase">{t.empNoPending}</p>
            ) : pendingUsers.map(user => (
              <div key={user.id} className="bg-slate-950/80 p-4 rounded-2xl border border-white/5 flex justify-between items-center hover:bg-slate-800 transition cursor-pointer" onClick={() => openDetails(user)}>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-orange-500/10 text-orange-400 rounded-xl flex items-center justify-center font-black">{user.firstName?.charAt(0)}</div>
                  <div>
                    <p className="font-bold text-white text-sm uppercase">{user.firstName} {user.lastName}</p>
                    <p className="text-[10px] font-black text-slate-500 tracking-widest">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); handleApprove(user.id); }} className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-white transition border border-emerald-500/20" title="Approuver">
                    <Check size={16} className="stroke-[3]" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleReject(user.id); }} className="p-2 bg-orange-500/10 text-orange-400 rounded-lg hover:bg-orange-500 hover:text-white transition border border-orange-500/20" title="Refuser">
                    <X size={16} className="stroke-[3]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Au travail */}
        <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 shadow-sm h-80 overflow-y-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            <h3 className="font-black text-slate-500 uppercase tracking-widest text-xs">{t.empWorking} ({workingUsers.length})</h3>
          </div>
          <div className="space-y-4">
            {workingUsers.length === 0 ? (
              <p className="text-center text-slate-600 font-bold italic text-sm py-10 uppercase">{t.empNoWorking}</p>
            ) : workingUsers.map(user => (
              <div key={user.id} className="bg-slate-950/80 p-4 rounded-2xl border border-white/5 flex justify-between items-center hover:bg-slate-800 transition cursor-pointer" onClick={() => openDetails(user)}>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center font-black">{user.firstName?.charAt(0)}</div>
                  <div>
                    <p className="font-bold text-white text-sm uppercase">{user.firstName} {user.lastName}</p>
                    <p className="text-[10px] font-black text-slate-500 tracking-widest">{user.role}</p>
                  </div>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">{t.empConnected}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Annuaire complet */}
      <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex flex-col sm:flex-row justify-between gap-4">
          <h2 className="text-xl font-black text-white italic tracking-tighter uppercase flex items-center gap-2">
            <Users className="text-blue-500" /> {t.empDirectory}
          </h2>
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder={t.empSearch}
              className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm font-bold text-white placeholder-slate-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500 font-black italic uppercase animate-pulse">{t.empLoadingDir}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                  <th className="p-6">{t.empTableEmp}</th>
                  <th className="p-6">{t.empTableEmail}</th>
                  <th className="p-6">{t.empTableStatus}</th>
                  <th className="p-6">{t.empTableRole}</th>
                  <th className="p-6 text-right">{t.empTableActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-white">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-800/50 transition cursor-pointer" onClick={() => openDetails(user)}>
                    <td className="p-6 flex items-center gap-3 font-bold">
                      <div className="h-10 w-10 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl flex items-center justify-center font-black">{user.firstName?.charAt(0)}</div>
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
                      <button onClick={(e) => { e.stopPropagation(); openEditModal(user); }} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition border border-blue-500/20">
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

      {/* Modal édition rôle/salaire */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/80 backdrop-blur-sm p-4 text-white">
          <div className="bg-slate-900 border border-white/10 p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-white transition"><X size={24} /></button>
            <h2 className="text-2xl font-black italic mb-8 uppercase tracking-tighter">{t.empProfileSettings} <span className="text-blue-600">{t.empProfileSpan}</span></h2>
            <form onSubmit={handleSaveRole} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">{t.empRoleAssign}</label>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-2xl px-4 py-4 font-bold outline-none focus:border-blue-500 transition">
                  <option value="EMPLOYEE">{t.empRoleEmployee}</option>
                  <option value="ASSISTANT_MANAGER">{t.empRoleManager}</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">{t.empSalary}</label>
                <input type="number" step="0.01" required value={formData.hourlyRate} onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })} className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-2xl px-4 py-4 font-bold outline-none focus:border-blue-500" placeholder="0.00" />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl transition shadow-xl hover:bg-blue-500 active:scale-95 uppercase tracking-widest">{t.empApplyChanges}</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal détails employé */}
      <EmployeeDetailsModal
        detailsUser={detailsUser}
        setDetailsUser={setDetailsUser}
        isDetailsLoading={isDetailsLoading}
        userShifts={userShifts}
        userAvails={userAvails}
        formatDate={formatDate}
        formatTime={formatTime}
      />

      {rejectConfirm && (
        <div className="fixed inset-0 bg-[#020617]/90 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 text-white">
          <div className="bg-slate-900 border border-orange-500/20 p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl relative text-center">
            <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="text-orange-500" size={32} />
            </div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2 text-orange-400">{t.empRejectTitle}</h2>
            <p className="text-slate-400 font-bold mb-8 text-sm">
              {t.empRejectDesc}
            </p>
            <div className="flex gap-4">
              <button onClick={() => setRejectConfirm(null)} className="flex-1 bg-slate-800 text-white font-black py-4 rounded-xl hover:bg-slate-700 transition uppercase tracking-widest text-xs">{t.empCancel}</button>
              <button onClick={confirmReject} className="flex-1 bg-orange-600 text-white font-black py-4 rounded-xl hover:bg-orange-500 transition shadow-lg shadow-orange-500/20 uppercase tracking-widest text-xs">{t.empRejectBtn}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}