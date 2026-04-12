import { useState } from 'react';
import axios from 'axios';
import { UserRole } from '../enum/UserRole';

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

      setStatus({ 
        type: 'success', 
        message: 'Rôle et salaire mis à jour avec succès !' 
      });
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
    <div className='flex items-center justify-center p-4'>
      <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200 min-w-96">
        <h2 className="text-xl font-bold mb-4">Modifier le profil employé</h2>
        
        {status.message && (
          <div className={`p-3 mb-4 rounded ${
            status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ID de l'employé</label>
            <input
              type="number"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.id}
              onChange={(e) => setFormData({...formData, id: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rôle au sein de l'entreprise</label>
            <select 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value={UserRole.MANAGER}>Manager</option>
              <option value={UserRole.ASSISTANT_MANAGER}>Assistant Manager</option>
              <option value={UserRole.EMPLOYEE}>Employé</option>
              <option value={UserRole.NEW_HIRE}>Nouvelle recrue</option>
              <option value={UserRole.TRAINEE}>Stagiaire</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Taux horaire ($)</label>
            <input
              type="number"
              step="0.05"
              min="0"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Ex: 25"
              value={formData.hourlyRate}
              onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors font-semibold"
          >
            {loading ? 'Mise à jour...' : 'Enregistrer les modifications'}
          </button>
        </form>
      </div>
    </div>
  );
}