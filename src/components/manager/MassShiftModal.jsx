import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../../api/axios';

export default function MassShiftModal({ onClose, employees, schedules, onRefresh, formatDate }) {
  const [isLoading, setIsLoading] = useState(false);
  const [massConfig, setMassConfig] = useState({
    userId: '',
    scheduleId: '',
    useCustomTimes: false, 
    customStartTime: '09:00',
    customEndTime: '17:00',
    skipWeekends: false
  });

  const handleMassGenerate = async (e) => {
    e.preventDefault();
    if (!massConfig.userId || !massConfig.scheduleId) return alert("Sélectionnez d'abord un employé et un planning.");

    const selectedSchedule = schedules.find(s => s.id === parseInt(massConfig.scheduleId));
    if (!selectedSchedule) return;

    const extractToParts = (dStr) => {
      if (!dStr) return null;
      const raw = dStr.split(/[T ]/)[0];
      const parts = raw.split(/[-/]/);
      if (parts.length === 3) {
        if (parts[0].length === 4) return { year: parts[0], month: parts[1], day: parts[2] };
        return { year: parts[2], month: parts[1], day: parts[0] };
      }
      return null;
    };

    const sStartParts = extractToParts(selectedSchedule.startDate);
    const sEndParts = extractToParts(selectedSchedule.endDate);
    if (!sStartParts || !sEndParts) return alert("Erreur format de date du planning.");

    setIsLoading(true);

    try {
      const availRes = await api.get(`/availability/users/${massConfig.userId}`);
      const availabilities = availRes.data;

      if (!availabilities || availabilities.length === 0) {
        alert("Cet employé n'a configuré aucune disponibilité pour le moment.");
        setIsLoading(false);
        return;
      }

      let dateCursor = new Date(Date.UTC(sStartParts.year, sStartParts.month - 1, sStartParts.day, 12));
      const endDateObj = new Date(Date.UTC(sEndParts.year, sEndParts.month - 1, sEndParts.day, 12));

      let createdCount = 0;
      let errorCount = 0;
      
      const dayMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

      while (dateCursor <= endDateObj) {
        const jsDay = dateCursor.getUTCDay();
        const dayOfWeek = dayMap[jsDay];
        
        const isWeekend = jsDay === 0 || jsDay === 6;
        if (massConfig.skipWeekends && isWeekend) {
          dateCursor.setUTCDate(dateCursor.getUTCDate() + 1);
          continue;
        }

        const avail = availabilities.find(a => a.dayOfWeek === dayOfWeek && a.isAvailable);

        if (avail) {
          const y = dateCursor.getUTCFullYear();
          const m = String(dateCursor.getUTCMonth() + 1).padStart(2, '0');
          const d = String(dateCursor.getUTCDate()).padStart(2, '0');
          const dateStr = `${y}-${m}-${d}`;

          let startTime = massConfig.useCustomTimes ? massConfig.customStartTime : (avail.startTime || '09:00');
          let endTime = massConfig.useCustomTimes ? massConfig.customEndTime : (avail.endTime || '17:00');

          try {
            await api.post(`/shift/users/${massConfig.userId}`, {
              scheduleId: parseInt(massConfig.scheduleId, 10),
              date: dateStr,
              startTime,
              endTime
            });
            createdCount++;
          } catch (e) {
            console.error("Erreur création mass shift:", e);
            errorCount++;
          }
        }
        dateCursor.setUTCDate(dateCursor.getUTCDate() + 1);
      }

      alert(`Génération terminée ! ${createdCount} shifts créés. ${errorCount > 0 ? `(${errorCount} conflits ignorés)` : ''}`);
      onClose();
      onRefresh();
    } catch (err) {
      console.error(err);
      alert("Erreur critique lors de la génération automatique.");
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-[#020617]/90 backdrop-blur-md flex items-center justify-center z-[9999] p-4 text-white overflow-y-auto pt-24 pb-10">
      <div className="bg-slate-900 border border-white/10 rounded-[3rem] p-10 max-w-lg w-full shadow-2xl relative mt-10 lg:mt-0">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-white transition"><X size={28} /></button>
        <h2 className="text-3xl font-black italic tracking-tighter mb-2 uppercase">Génération <span className="text-indigo-500">Automatique</span></h2>
        <p className="text-slate-400 font-medium mb-8">Crée des shifts sur tout un planning selon les disponibilités.</p>
        
        <form onSubmit={handleMassGenerate} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Employé</label>
            <select
              required
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 font-bold text-white outline-none focus:border-indigo-500"
              value={massConfig.userId}
              onChange={e => setMassConfig({...massConfig, userId: e.target.value})}
            >
              <option value="">Sélectionner un employé...</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.role})</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Planning lié</label>
            <select
              required
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 font-bold text-white outline-none focus:border-indigo-500"
              value={massConfig.scheduleId}
              onChange={e => setMassConfig({...massConfig, scheduleId: e.target.value})}
            >
              <option value="">Sélectionner un planning...</option>
              {schedules.map(sched => (
                <option key={sched.id} value={sched.id}>{sched.name} ({formatDate(sched.startDate)} - {formatDate(sched.endDate)})</option>
              ))}
            </select>
          </div>

          <div className="bg-slate-950/80 p-5 rounded-2xl border border-white/5 space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={massConfig.skipWeekends} onChange={e => setMassConfig({...massConfig, skipWeekends: e.target.checked})} className="w-5 h-5 accent-indigo-500 rounded bg-slate-900 border-slate-700" />
              <span className="font-bold text-sm">Ignorer les week-ends (Sam-Dim)</span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={massConfig.useCustomTimes} onChange={e => setMassConfig({...massConfig, useCustomTimes: e.target.checked})} className="w-5 h-5 accent-indigo-500 rounded bg-slate-900 border-slate-700" />
              <span className="font-bold text-sm">Forcer des horaires personnalisés</span>
            </label>

            {massConfig.useCustomTimes && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Début forcé</label>
                  <input type="time" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 font-bold text-white [color-scheme:dark]" value={massConfig.customStartTime} onChange={e => setMassConfig({...massConfig, customStartTime: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Fin forcée</label>
                  <input type="time" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 font-bold text-white [color-scheme:dark]" value={massConfig.customEndTime} onChange={e => setMassConfig({...massConfig, customEndTime: e.target.value})} />
                </div>
              </div>
            )}
            {!massConfig.useCustomTimes && (
              <p className="text-xs text-slate-500 italic mt-2">Les horaires définis dans les disponibilités de l'employé seront utilisés.</p>
            )}
          </div>

          <button disabled={isLoading} type="submit" className="w-full bg-indigo-600 text-white rounded-[1.5rem] py-5 font-black hover:bg-indigo-500 transition shadow-2xl shadow-indigo-500/20 uppercase tracking-widest text-sm mt-4 disabled:opacity-50">
            {isLoading ? "Génération en cours..." : "Lancer la génération"}
          </button>
        </form>
      </div>
    </div>
  );
}
