import { useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem("token")}`,
    'Content-Type': 'application/json'
  }
});

const DayOfWeek = {
  MONDAY: 'monday',
  TUESDAY: 'tuesday',
  WEDNESDAY: 'wednesday',
  THURSDAY: 'thursday',
  FRIDAY: 'friday',
  SATURDAY: 'saturday',
  SUNDAY: 'sunday',
};

const AvailabilityForm = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const EMPLOYEE_ID = 2

  const [formData, setFormData] = useState({
    dayOfWeek: DayOfWeek.MONDAY,
    isAllDay: false,
    startTime: '',
    endTime: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    const payload = {
      ...formData,
      startTime: formData.isAllDay ? undefined : formData.startTime,
      endTime: formData.isAllDay ? undefined : formData.endTime,
    };

    try {
      await api.post(`/employee/availability/${EMPLOYEE_ID}`, payload);
      setStatus({ type: 'success', message: 'Disponibilité enregistrée !' });
      setFormData({ dayOfWeek: DayOfWeek.MONDAY, isAllDay: false, startTime: '', endTime: '' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Erreur lors de l\'enregistrement.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center'>
      <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200 min-w-96">
        <h2 className="text-xl font-bold mb-4">Ajouter une disponibilité</h2>
        
        {status.message && (
          <div className={`p-3 mb-4 rounded ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Jour de la semaine</label>
            <select 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 capitalize"
              value={formData.dayOfWeek}
              onChange={(e) => setFormData({...formData, dayOfWeek: e.target.value})}
            >
              <option value={DayOfWeek.MONDAY}>Lundi</option>
              <option value={DayOfWeek.TUESDAY}>Mardi</option>
              <option value={DayOfWeek.WEDNESDAY}>Mercredi</option>
              <option value={DayOfWeek.THURSDAY}>Jeudi</option>
              <option value={DayOfWeek.FRIDAY}>Vendredi</option>
              <option value={DayOfWeek.SATURDAY}>Samedi</option>
              <option value={DayOfWeek.SUNDAY}>Dimanche</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAllDay"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              checked={formData.isAllDay}
              onChange={(e) => setFormData({...formData, isAllDay: e.target.checked})}
            />
            <label htmlFor="isAllDay" className="ml-2 block text-sm text-gray-900 cursor-pointer">
              Disponible toute la journée
            </label>
          </div>

          {!formData.isAllDay && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Début</label>
                <input
                  type="time"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fin</label>
                <input
                  type="time"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? 'Chargement...' : 'Enregistrer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AvailabilityForm;