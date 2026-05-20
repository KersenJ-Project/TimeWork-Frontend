import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { DayOfWeek } from '../../enum/DayOfWeek';
import api from '../../api/axios';
import { useLanguage } from '../../context/LanguageContext';
import { employeeTranslations } from '../../translations/employee';

export default function AvailabilityTab() {
  const { lang } = useLanguage();
  const currentLang = lang ? lang.toLowerCase() : 'fr';
  const t = employeeTranslations[currentLang] || employeeTranslations['fr'];
  const [availabilities, setAvailabilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newAvail, setNewAvail] = useState({ dayOfWeek: DayOfWeek.MONDAY, isAllDay: false, startTime: '09:00', endTime: '17:00' });
  const [errorMsg, setErrorMsg] = useState(null);
  const [companyHours, setCompanyHours] = useState(null);

  useEffect(() => {
    const fetchCompanyHours = async () => {
      try {
        const meRes = await api.get('/auth/whoami');
        if (meRes.data?.companyId) {
          const compRes = await api.get(`/company/${meRes.data.companyId}`);
          setCompanyHours(compRes.data?.operatingHours);
        }
      } catch (err) {
        console.error("Could not fetch company hours", err);
      }
    };
    fetchCompanyHours();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const availRes = await api.get('/employee/availability');
      setAvailabilities(availRes.data || []);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddAvailability = async (e) => {
    e.preventDefault();
    try {
      setErrorMsg(null);
      
      let start = newAvail.startTime;
      let end = newAvail.endTime;
      
      if (newAvail.isAllDay) {
        const dayStr = newAvail.dayOfWeek.toLowerCase();
        const cHours = companyHours?.[dayStr];
        if (cHours && cHours.isOpen) {
          start = cHours.open;
          end = cHours.close;
        } else {
          start = '00:00';
          end = '23:59';
        }
      }
      
      const payload = {
        ...newAvail,
        isAvailable: true,
        startTime: start,
        endTime: end,
      };
      await api.post('/employee/availability', payload);
      setNewAvail({ dayOfWeek: DayOfWeek.MONDAY, isAllDay: false, startTime: '09:00', endTime: '17:00' });
      await fetchData();
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || t.availErrAdd);
    }
  };

  const handleRemoveAvailability = async (id) => {
    try {
      await api.delete(`/employee/availability/${id}`);
      await fetchData();
    } catch (error) {
      setErrorMsg(t.availErrRemove);
    }
  };

  if (isLoading) return <div className="text-center py-20 font-black text-slate-600 italic">{t.loading}</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 shadow-sm">
          <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
            <Plus className="text-blue-500" /> {t.availAddTitle}
          </h2>
          
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl font-bold flex justify-between items-center mb-4 text-xs">
              {errorMsg}
              <button onClick={() => setErrorMsg(null)}><X size={16} /></button>
            </div>
          )}
          
          <form onSubmit={handleAddAvailability} className="space-y-5">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">{t.availDayLabel}</label>
              <select value={newAvail.dayOfWeek} onChange={e => setNewAvail({...newAvail, dayOfWeek: e.target.value})} className="w-full mt-1 p-4 bg-slate-950/50 border border-slate-800 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all text-white">
                {[DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-3 text-sm font-bold text-slate-400 bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-3 cursor-pointer hover:bg-slate-900/80 transition-colors">
              <input
                type="checkbox"
                checked={newAvail.isAllDay}
                onChange={e => setNewAvail({...newAvail, isAllDay: e.target.checked})}
                className="h-4 w-4"
              />
              {t.availAllDay}
            </label>
            <div className={`grid grid-cols-2 gap-4 ${newAvail.isAllDay ? 'opacity-50 pointer-events-none' : ''}`}>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">{t.availStart}</label>
                <input type="time" required value={newAvail.startTime} onChange={e => setNewAvail({...newAvail, startTime: e.target.value})} className="w-full mt-1 p-4 bg-slate-950/50 border border-slate-800 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all text-white [color-scheme:dark]" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">{t.availEnd}</label>
                <input type="time" required value={newAvail.endTime} onChange={e => setNewAvail({...newAvail, endTime: e.target.value})} className="w-full mt-1 p-4 bg-slate-950/50 border border-slate-800 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all text-white [color-scheme:dark]" />
              </div>
            </div>
            <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 uppercase tracking-widest text-xs active:scale-95">
              {t.availAddBtn}
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <h3 className="font-black text-slate-500 tracking-[0.1em] uppercase text-xs ml-2">{t.availMyHoursTitle}</h3>
        <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-6 shadow-sm min-h-[300px]">
          {availabilities.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-600 font-bold italic py-10">{t.availNoHours}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availabilities.map(av => (
                <div key={av.id} className="p-5 bg-slate-950/50 rounded-2xl border border-slate-800 flex justify-between items-center group hover:bg-slate-800/80 transition-colors">
                  <div>
                    <span className="block font-black text-white uppercase text-sm">{av.dayOfWeek}</span>
                    <span className="block font-bold text-slate-400 text-xs mt-1">{av.startTime} — {av.endTime}</span>
                  </div>
                  <button onClick={() => handleRemoveAvailability(av.id)} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-red-400 hover:text-white hover:bg-red-500 shadow-sm transition-all border border-white/5">
                    <X size={14} className="stroke-[3]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
