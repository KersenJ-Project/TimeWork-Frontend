import { useState, useEffect } from 'react';
import { Users, ShieldCheck, Check, Edit, X, Search } from 'lucide-react';
import api from '../api/axios';
import { useLanguage } from '../context/LanguageContext';
import { managerTranslations } from '../translations/manager';

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

  return (
    <div className="w-full p-6 lg:p-10 space-y-8 text-[#0B1023] bg-[#F4F6FB] min-h-screen">
      <div className="flex justify-between items-center border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter">Gestion des <span className="text-blue-600">{t.employeesTitle || 'Employés'}</span></h1>
          <p className="text-gray-500 font-medium mt-1">{t.employeesSubtitle || 'Gérez votre équipe.'}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher un employé..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm font-bold"
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500 font-medium italic">Chargement...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  <th className="p-6">Employé</th>
                  <th className="p-6">Email</th>
                  <th className="p-6">Statut</th>
                  <th className="p-6">Rôle</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-black">
                {users.filter(u => {
                  const searchStr = searchTerm.toLowerCase();
                  return (u.firstName?.toLowerCase().includes(searchStr) || u.lastName?.toLowerCase().includes(searchStr) || u.email?.toLowerCase().includes(searchStr));
                }).map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="p-6 flex items-center gap-3 font-bold">
                      <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black">
                        {user.firstName?.charAt(0)}
                      </div>
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="p-6 text-sm text-gray-500">{user.email}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${user.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                        {user.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="p-6 text-sm font-bold uppercase">{user.role}</td>
                    <td className="p-6 text-right flex justify-end gap-2">
                      {user.status !== 'APPROVED' && (
                        <button onClick={() => handleApprove(user.id)} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-500 hover:text-white transition shadow-sm border border-emerald-100">
                          <Check size={16} />
                        </button>
                      )}
                      <button onClick={() => openEditModal(user)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition shadow-sm border border-blue-100">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1023]/60 backdrop-blur-sm p-4 text-black">
          <div className="bg-white p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-black transition"><X size={24} /></button>
            <h2 className="text-2xl font-black italic mb-8 uppercase tracking-tighter">Paramétrage <span className="text-blue-600">Profil</span></h2>
            <form onSubmit={handleSaveRole} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Attribution du Rôle</label>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 font-bold outline-none focus:border-blue-500 transition">
                  <option value="EMPLOYEE">Employé</option>
                  <option value="ASSISTANT_MANAGER">Assistant Manager</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Salaire Horaire ($)</label>
                <input type="number" step="0.01" required value={formData.hourlyRate} onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 font-bold outline-none focus:border-blue-500" placeholder="0.00" />
              </div>
              <button type="submit" className="w-full bg-[#0B1023] text-white font-black py-5 rounded-2xl transition shadow-xl shadow-blue-500/10 active:scale-95 uppercase tracking-widest">Appliquer les Changements</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}