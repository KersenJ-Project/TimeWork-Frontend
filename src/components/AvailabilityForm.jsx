import { useState } from 'react';
import axios from 'axios';
import { DayOfWeek } from '../enum/DayOfWeek';
import { CalendarDays, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function AvailabilityForm({ userId }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

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
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:3000/employee/availability/${userId}`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
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
      <div className="bg-slate-900/40 rounded-3xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-xl hover:border-blue-500/30 transition-all duration-300">
        <div className="h-1 w-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500" />

        <div className="p-8">

          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700/50 shadow-inner">
              <CalendarDays size={18} className="text-blue-400" />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-[0.15em]">
              Ajouter une disponibilité
            </h2>
          </div>

          {status.message && (
            <div className={`flex items-center gap-3 p-4 mb-6 rounded-2xl text-sm font-bold border backdrop-blur-sm ${
              status.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
              {status.type === 'success'
                ? <CheckCircle2 size={18} />
                : <XCircle size={18} />
              }
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Jour de la semaine
              </label>
              <select
                className="block w-full px-4 py-3 rounded-xl border border-slate-700 bg-[#020617]/50 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all cursor-pointer appearance-none"
                value={formData.dayOfWeek}
                onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
              >
                <option value={DayOfWeek.MONDAY} className="bg-slate-900">Lundi</option>
                <option value={DayOfWeek.TUESDAY} className="bg-slate-900">Mardi</option>
                <option value={DayOfWeek.WEDNESDAY} className="bg-slate-900">Mercredi</option>
                <option value={DayOfWeek.THURSDAY} className="bg-slate-900">Jeudi</option>
                <option value={DayOfWeek.FRIDAY} className="bg-slate-900">Vendredi</option>
                <option value={DayOfWeek.SATURDAY} className="bg-slate-900">Samedi</option>
                <option value={DayOfWeek.SUNDAY} className="bg-slate-900">Dimanche</option>
              </select>
            </div>

            <div 
              className="flex items-center gap-4 px-5 py-4 rounded-xl bg-slate-800/30 border border-slate-700/50 cursor-pointer hover:bg-slate-800/50 transition-colors"
              onClick={() => setFormData({ ...formData, isAllDay: !formData.isAllDay })}
            >
              <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                formData.isAllDay
                  ? 'bg-blue-600 border-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]'
                  : 'border-slate-500 bg-transparent'
              }`}>
                {formData.isAllDay && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <label className="text-sm text-slate-300 font-bold cursor-pointer select-none">
                Disponible toute la journée
              </label>
            </div>

            {!formData.isAllDay && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-2">
                      <Clock size={14} className="text-indigo-400" />
                      Début
                    </span>
                  </label>
                  <input
                    type="time"
                    required
                    className="block w-full px-4 py-3 rounded-xl border border-slate-700 bg-[#020617]/50 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all custom-time-input"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-2">
                      <Clock size={14} className="text-purple-400" />
                      Fin
                    </span>
                  </label>
                  <input
                    type="time"
                    required
                    className="block w-full px-4 py-3 rounded-xl border border-slate-700 bg-[#020617]/50 text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all custom-time-input"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 group relative px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-500 disabled:opacity-50 disabled:hover:scale-100 hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(37,99,235,0.2)]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Enregistrement...
                </span>
              ) : 'Enregistrer la disponibilité'}
            </button>

          </form>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-time-input::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.7;
          cursor: pointer;
        }
      `}} />
    </div>
  );
}