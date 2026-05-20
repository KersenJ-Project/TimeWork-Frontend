import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../../api/axios';
import { useLanguage } from '../../context/LanguageContext';
import { managerTranslations } from '../../translations/manager';

export default function CreateShiftModal({ onClose, employees, schedules, onRefresh, formatDate }) {
  const { lang } = useLanguage();
  const currentLang = lang ? lang.toLowerCase() : 'fr';
  const t = managerTranslations[currentLang] || managerTranslations['fr'];
  const [newShift, setNewShift] = useState({
    userId: '',
    scheduleId: '',
    date: '',
    startTime: '09:00',
    endTime: '17:00'
  });
  const [errorMsg, setErrorMsg] = useState(null);

  const handleCreateShift = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!newShift.userId) return setErrorMsg(t.createShiftSelectEmpErr);
    if (!newShift.scheduleId) return setErrorMsg(t.createShiftSelectPlanErr);

    const normalizeDateToYYYYMMDD = (dStr) => {
      if (!dStr) return "";
      const raw = dStr.split(/[T ]/)[0];
      const parts = raw.split(/[-/]/);
      if (parts.length === 3) {
        if (parts[0].length === 2 && parts[2].length === 4) {
          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        if (parts[0].length === 4 && parts[2].length === 2) {
          return `${parts[0]}-${parts[1]}-${parts[2]}`;
        }
      }
      return raw;
    };

    const selectedSchedule = schedules.find(s => s.id === parseInt(newShift.scheduleId));
    if (selectedSchedule) {
      const sStartStr = normalizeDateToYYYYMMDD(selectedSchedule.startDate);
      const sEndStr = normalizeDateToYYYYMMDD(selectedSchedule.endDate);
      const shiftDateStr = newShift.date;
      if (shiftDateStr < sStartStr || shiftDateStr > sEndStr) {
        return setErrorMsg(`${t.createShiftDateErrPart1}${shiftDateStr}${t.createShiftDateErrPart2}${sStartStr}${t.createShiftDateErrPart3}${sEndStr}${t.createShiftDateErrPart4}`);
      }
    }

    try {
      await api.post(`/shift/users/${newShift.userId}`, {
        scheduleId: parseInt(newShift.scheduleId, 10),
        date: newShift.date.split(/[T ]/)[0], 
        startTime: newShift.startTime,
        endTime: newShift.endTime
      });

      onClose();
      onRefresh();
    } catch (error) {
      console.error("Shift api error:", error.response?.data);
      setErrorMsg(error.response?.data?.message || t.createShiftErrCreate);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#020617]/90 backdrop-blur-md flex items-center justify-center z-[9999] p-4 text-white overflow-y-auto pt-24 pb-10">
      <div className="bg-slate-900 border border-white/10 rounded-[3rem] p-10 max-w-lg w-full shadow-2xl relative mt-10 lg:mt-0">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-white transition"><X size={28} /></button>
        <h2 className="text-3xl font-black italic tracking-tighter mb-8 uppercase">{t.createShiftTitle} <span className="text-blue-500">{t.createShiftTitleSpan}</span></h2>
        
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl font-bold flex justify-between items-center mb-6 text-sm">
            {errorMsg}
            <button onClick={() => setErrorMsg(null)}><X size={20} /></button>
          </div>
        )}

        <form onSubmit={handleCreateShift} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t.massEmployeeLabel}</label>
            <select
              required
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 font-bold text-white outline-none focus:border-blue-500"
              value={newShift.userId}
              onChange={e => setNewShift({...newShift, userId: e.target.value})}
            >
              <option value="">{t.massSelectEmployee}</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.role})</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t.massPlanningLabel}</label>
            <select
              required
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 font-bold text-white outline-none focus:border-blue-500"
              value={newShift.scheduleId}
              onChange={e => setNewShift({...newShift, scheduleId: e.target.value})}
            >
              <option value="">{t.massSelectPlanning}</option>
              {schedules.map(sched => (
                <option key={sched.id} value={sched.id}>{sched.name} ({formatDate(sched.startDate)} - {formatDate(sched.endDate)})</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t.createShiftDateLabel}</label>
            <input
              required
              type="date"
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 font-bold text-white [color-scheme:dark]"
              value={newShift.date}
              onChange={e => setNewShift({...newShift, date: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t.createShiftStartLabel}</label>
              <input
                required
                type="time"
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 font-bold text-white [color-scheme:dark]"
                value={newShift.startTime}
                onChange={e => setNewShift({...newShift, startTime: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t.createShiftEndLabel}</label>
              <input
                required
                type="time"
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 font-bold text-white [color-scheme:dark]"
                value={newShift.endTime}
                onChange={e => setNewShift({...newShift, endTime: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white rounded-[1.5rem] py-5 font-black hover:bg-blue-500 transition shadow-2xl shadow-blue-500/20 uppercase tracking-widest text-sm mt-4">
            {t.createShiftConfirmBtn}
          </button>
        </form>
      </div>
    </div>
  );
}
