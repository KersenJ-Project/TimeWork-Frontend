import { useState } from 'react';
import axios from 'axios';
import { UserRole } from '../enum/UserRole';
import { UserCog, Hash, Briefcase, DollarSign, CheckCircle2, XCircle } from 'lucide-react';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem("token")}`,
    'Content-Type': 'application/json'
  }
});

export default function UpdateEmployeeRoleForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const [formData, setFormData] = useState({
    id: 1,
    role: UserRole.EMPLOYEE,
    hourlyRate: 15,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await api.patch(`/managers/users/${formData.id}/role-salary`, {
        role: formData.role,
        hourlyRate: Number(formData.hourlyRate)
      });
      setStatus({ type: 'success', message: 'Rôle et salaire mis à jour avec succès.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Erreur lors de la mise à jour.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="h-1 w-full bg-blue-600" />

        <div className="p-6">

          <div className="flex items-center gap-2.5 mb-6">
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <UserCog size={16} className="text-blue-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Modifier le profil employé
            </h2>
          </div>

          {status.message && (
            <div className={`flex items-center gap-2.5 p-3 mb-5 rounded-xl text-sm font-medium border ${
              status.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                : 'bg-red-50 text-red-700 border-red-100'
            }`}>
              {status.type === 'success'
                ? <CheckCircle2 size={15} />
                : <XCircle size={15} />
              }
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Hash size={13} className="text-gray-400" />
                  ID de l'employé
                </span>
              </label>
              <input
                type="number"
                min={1}
                required
                className="block w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Briefcase size={13} className="text-gray-400" />
                  Rôle au sein de l'entreprise
                </span>
              </label>
              <select
                className="block w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value={UserRole.MANAGER}>Manager</option>
                <option value={UserRole.ASSISTANT_MANAGER}>Assistant Manager</option>
                <option value={UserRole.EMPLOYEE}>Employé</option>
                <option value={UserRole.NEW_HIRE}>Nouvelle recrue</option>
                <option value={UserRole.TRAINEE}>Stagiaire</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <DollarSign size={13} className="text-gray-400" />
                  Taux horaire ($)
                </span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  required
                  placeholder="Ex: 25.00"
                  className="block w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium pointer-events-none">
                  $ / h
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Mise à jour...
                </span>
              ) : 'Enregistrer les modifications'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}