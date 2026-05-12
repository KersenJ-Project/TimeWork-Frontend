import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../enum/UserRole';
import {
  UserCog, Hash, Briefcase, DollarSign,
  CheckCircle2, XCircle, Users, RefreshCw, ChevronRight
} from 'lucide-react';

const BASE = 'http://localhost:3000';

const get   = (url)       => axios.get(`${BASE}${url}`,        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
const patch = (url, body) => axios.patch(`${BASE}${url}`, body, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' } });

const roleBadge = (role) => {
  const map = {
    manager:           'bg-amber-500/15 border-amber-500/30 text-amber-300',
    assistant_manager: 'bg-violet-500/15 border-violet-500/30 text-violet-300',
    employee:          'bg-blue-500/15 border-blue-500/30 text-blue-300',
    new_hire:          'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
    trainee:           'bg-slate-500/15 border-slate-500/30 text-slate-300',
  };
  return map[role?.toLowerCase()] ?? map.employee;
};

export default function UpdateEmployeeRoleForm() {

  const [employees,   setEmployees]   = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError,   setListError]   = useState(null);

  const [loading,  setLoading]  = useState(false);
  const [status,   setStatus]   = useState({ type: '', message: '' });
  const [formData, setFormData] = useState({
    id:         '',
    role:       UserRole.EMPLOYEE,
    hourlyRate: '',
  });

  const showStatus = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: '', message: '' }), 3500);
  };

  /* Chargement de la liste */
  const fetchEmployees = async () => {
    setLoadingList(true);
    setListError(null);
    try {
      const { data } = await get('/managers/users');
      setEmployees(data);
    } catch (err) {
      setListError(err.response?.data?.message || 'Impossible de charger les employés.');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  /* Sélection d'un employé → pré-remplir */
  const handleSelect = (emp) => {
    setFormData({
      id:         emp.id,
      role:       emp.role?.toLowerCase() ?? UserRole.EMPLOYEE,
      hourlyRate: emp.hourlyRate ?? '',
    });
    setStatus({ type: '', message: '' });
  };

  /* Soumission */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      await patch(`/managers/users/${formData.id}/role-salary`, {
        role:       formData.role,
        hourlyRate: Number(formData.hourlyRate),
      });
      showStatus('success', 'Rôle et salaire mis à jour avec succès.');
      setEmployees((prev) =>
        prev.map((e) =>
          e.id === formData.id
            ? { ...e, role: formData.role, hourlyRate: Number(formData.hourlyRate) }
            : e
        )
      );
    } catch (error) {
      showStatus('error', error.response?.data?.message || 'Erreur lors de la mise à jour.');
    } finally {
      setLoading(false);
    }
  };

  const selectedEmployee = employees.find((e) => e.id === formData.id);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-5">
      <div className="bg-slate-900/40 rounded-3xl border border-slate-800 overflow-hidden backdrop-blur-xl">

        <div className="h-px w-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500" />

        {/* Header liste */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-xl border border-slate-700/50">
              <Users size={16} className="text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Annuaire</p>
              <h3 className="text-white font-black text-sm tracking-tight flex items-center gap-2">
                Employés
                {!loadingList && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-700 text-slate-300 text-[10px] font-black">
                    {employees.length}
                  </span>
                )}
              </h3>
            </div>
          </div>
          <button
            onClick={fetchEmployees}
            disabled={loadingList}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-slate-400 hover:text-white text-xs font-bold transition-all disabled:opacity-50"
          >
            <RefreshCw size={12} className={loadingList ? 'animate-spin' : ''} />
            Actualiser
          </button>
        </div>

        {/* Contenu liste */}
        {loadingList ? (
          <div className="flex items-center justify-center gap-3 py-12">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 border-2 border-slate-700 rounded-full" />
              <div className="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-slate-500 text-sm animate-pulse">Chargement...</p>
          </div>

        ) : listError ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-center px-6">
            <XCircle size={24} className="text-red-500/50" />
            <p className="text-slate-400 text-sm">{listError}</p>
            <button
              onClick={fetchEmployees}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Réessayer
            </button>
          </div>

        ) : employees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Users size={24} className="text-slate-700" />
            <p className="text-slate-500 text-sm">Aucun employé trouvé.</p>
          </div>

        ) : (
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
            {employees.map((emp) => {
              const initials   = `${emp.firstName?.[0] ?? ''}${emp.lastName?.[0] ?? ''}`.toUpperCase();
              const badge      = roleBadge(emp.role);
              const isSelected = emp.id === formData.id;

              return (
                <button
                  key={emp.id}
                  onClick={() => handleSelect(emp)}
                  className={`w-full flex items-center gap-4 px-6 py-4 text-left transition-all group border-l-2 ${
                    isSelected
                      ? 'bg-indigo-600/10 border-indigo-500'
                      : 'border-transparent hover:bg-slate-800/40'
                  }`}
                >
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-black text-white flex-shrink-0">
                    {initials}
                  </div>

                  {/* Nom + rôle */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-white truncate">
                        {emp.firstName} {emp.lastName}
                      </p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-widest ${badge}`}>
                        {emp.role ?? '—'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{emp.email}</p>
                  </div>

                  {/* ID + salaire */}
                  <div className="flex-shrink-0 text-right space-y-0.5">
                    <p className="text-[10px] text-slate-600 font-mono">#{emp.id}</p>
                    <p className="text-xs font-black text-slate-300">
                      {emp.hourlyRate != null
                        ? `${Number(emp.hourlyRate).toFixed(2)} $ / h`
                        : <span className="text-slate-600 font-normal italic">Non défini</span>
                      }
                    </p>
                  </div>

                  <ChevronRight
                    size={14}
                    className={`flex-shrink-0 transition-colors ${
                      isSelected ? 'text-indigo-400' : 'text-slate-700 group-hover:text-slate-500'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>


      <div className="bg-slate-900/40 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl hover:border-blue-500/30 transition-all duration-500">
        <div className="h-px w-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500" />

        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700/50 shadow-inner">
              <UserCog size={20} className="text-purple-400" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                Gestion des Rôles & Salaire
              </h2>
              {selectedEmployee && (
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedEmployee.firstName} {selectedEmployee.lastName} · #{selectedEmployee.id}
                </p>
              )}
            </div>
          </div>

          {/* Toast */}
          <AnimatePresence>
            {status.message && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center gap-3 p-4 mb-8 rounded-2xl text-sm font-bold border backdrop-blur-md ${
                  status.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                    : 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
                }`}
              >
                {status.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                {status.message}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* ID */}
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 px-1">
                <span className="flex items-center gap-2">
                  <Hash size={14} className="text-slate-400" />
                  ID Employé
                </span>
              </label>
              <input
                type="number"
                min={1}
                required
                placeholder="Ex: 42  (ou cliquez sur un employé ci-dessus)"
                className="block w-full px-4 py-3.5 rounded-2xl border border-slate-800 bg-[#020617]/60 text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-600 font-bold font-mono"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: Number(e.target.value) })}
              />
            </div>

            {/* Rôle */}
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 px-1">
                <span className="flex items-center gap-2">
                  <Briefcase size={14} className="text-slate-400" />
                  Niveau d'accès (Rôle)
                </span>
              </label>
              <select
                required
                className="block w-full px-4 py-3.5 rounded-2xl border border-slate-800 bg-[#020617]/60 text-white focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/50 outline-none transition-all cursor-pointer appearance-none font-bold"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value={UserRole.MANAGER}           className="bg-slate-900">Manager</option>
                <option value={UserRole.ASSISTANT_MANAGER} className="bg-slate-900">Assistant Manager</option>
                <option value={UserRole.EMPLOYEE}          className="bg-slate-900">Employé</option>
                <option value={UserRole.NEW_HIRE}          className="bg-slate-900">Nouvelle recrue</option>
                <option value={UserRole.TRAINEE}           className="bg-slate-900">Stagiaire</option>
              </select>
            </div>

            {/* Taux horaire */}
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 px-1">
                <span className="flex items-center gap-2">
                  <DollarSign size={14} className="text-slate-400" />
                  Rémunération horaire
                </span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  required
                  placeholder="0.00"
                  className="block w-full px-4 py-3.5 pr-20 rounded-2xl border border-slate-800 bg-[#020617]/60 text-white focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 outline-none transition-all font-bold"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-500 tracking-tighter pointer-events-none">
                  CAD / HR
                </span>
              </div>

              {/* Comparaison ancien → nouveau salaire */}
              {selectedEmployee?.hourlyRate != null &&
               formData.hourlyRate !== '' &&
               Number(formData.hourlyRate) !== Number(selectedEmployee.hourlyRate) && (
                <p className="text-xs text-slate-500 mt-2 px-1">
                  Actuellement :&nbsp;
                  <span className="text-slate-400 font-bold line-through">
                    {Number(selectedEmployee.hourlyRate).toFixed(2)} $ / h
                  </span>
                  &nbsp;→&nbsp;
                  <span className="text-white font-bold">
                    {Number(formData.hourlyRate).toFixed(2)} $ / h
                  </span>
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 group relative px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(79,70,229,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Mise à jour en cours...
                  </>
                ) : (
                  <>
                    Appliquer les changements
                    <CheckCircle2 size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}