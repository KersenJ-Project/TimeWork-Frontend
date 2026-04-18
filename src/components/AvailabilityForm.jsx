import { useState } from 'react';
import axios from 'axios';
import { DayOfWeek } from '../enum/DayOfWeek';
import { CalendarDays, Clock, CheckCircle2, XCircle } from 'lucide-react';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem("token")}`,
    'Content-Type': 'application/json'
  }
});

export default function AvailabilityForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const EMPLOYEE_ID = 2;

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
      setStatus({ type: 'success', message: 'Disponibilité enregistrée avec succès.' });
      setFormData({ dayOfWeek: DayOfWeek.MONDAY, isAllDay: false, startTime: '', endTime: '' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Erreur lors de l\'enregistrement.' });
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
              <CalendarDays size={16} className="text-blue-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Ajouter une disponibilité
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
                Jour de la semaine
              </label>
              <select
                className="block w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={formData.dayOfWeek}
                onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
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

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer"
              onClick={() => setFormData({ ...formData, isAllDay: !formData.isAllDay })}
            >
              <div className={`h-4 w-4 rounded border-2 flex items-center justify-center transition-colors ${
                formData.isAllDay
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-gray-300 bg-white'
              }`}>
                {formData.isAllDay && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <label className="text-sm text-gray-700 font-medium cursor-pointer select-none">
                Disponible toute la journée
              </label>
            </div>

            {!formData.isAllDay && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-gray-400" />
                      Début
                    </span>
                  </label>
                  <input
                    type="time"
                    required
                    className="block w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-gray-400" />
                      Fin
                    </span>
                  </label>
                  <input
                    type="time"
                    required
                    className="block w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>
            )}

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
                  Enregistrement...
                </span>
              ) : 'Enregistrer'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}