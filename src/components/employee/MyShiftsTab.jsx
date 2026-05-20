import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import api from '../../api/axios';
import { getUserId } from '../../api/userId';
import { useLanguage } from '../../context/LanguageContext';
import { employeeTranslations } from '../../translations/employee';

export default function MyShiftsTab() {
  const { lang } = useLanguage();
  const currentLang = lang ? lang.toLowerCase() : 'fr';
  const t = employeeTranslations[currentLang] || employeeTranslations['fr'];
  const [shifts, setShifts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyShifts = async () => {
      setIsLoading(true);
      try {
        const userId = getUserId();
        if (userId) {
          const res = await api.get(`/shift/users/${userId}`);
          const sorted = (res.data || []).sort((a, b) => new Date(a.date) - new Date(b.date));
          setShifts(sorted);
        }
      } catch (err) {
        console.error('Erreur shifts:', err);
      }
      setIsLoading(false);
    };
    fetchMyShifts();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const raw = dateStr.split(/[T ]/)[0];
    const [y, m, d] = raw.split('-');
    if (!y || !m || !d) return raw;
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';
    if (/^([01]\d|2[0-3]):([0-5]\d)/.test(timeStr)) return timeStr.substring(0, 5).replace(':', 'h');
    const d = new Date(timeStr);
    return isNaN(d.getTime()) ? timeStr : d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-12 w-12 bg-indigo-600/20 text-indigo-400 rounded-2xl flex items-center justify-center border border-indigo-500/20">
          <Calendar size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white">{t.myShiftsTitle.split(' ')[0]} <span className="text-indigo-500">{t.myShiftsTitle.split(' ').slice(1).join(' ')}</span></h2>
          <p className="text-slate-400 font-medium text-sm">{t.myShiftsSubtitle}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 font-black text-slate-600 italic">{t.loading}</div>
      ) : shifts.length === 0 ? (
        <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-16 text-center shadow-sm">
          <p className="text-slate-500 font-bold italic uppercase">{t.noShifts}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {shifts.map(shift => {
            const sDate = shift.date?.split(/[T ]/)[0];
            const isToday = sDate === todayStr;
            const isPast = sDate < todayStr;

            return (
              <div key={shift.id} className={`p-6 rounded-[2rem] border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm transition-all hover:border-white/10 ${isToday ? 'bg-indigo-900/40 border-indigo-500/30' : isPast ? 'bg-slate-950/30 border-white/5 opacity-60' : 'bg-slate-900/80 border-white/5'}`}>
                <div className="flex items-center gap-4">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border ${isToday ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-white capitalize">{formatDate(shift.date)}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${isToday ? 'bg-indigo-500/20 text-indigo-400' : isPast ? 'bg-slate-800 text-slate-500' : 'bg-blue-500/10 text-blue-400'}`}>
                        {isToday ? t.today : isPast ? t.past : t.upcoming}
                      </span>
                      {shift.schedule?.name && (
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.cycle} {shift.schedule.name}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 items-center bg-slate-950/50 px-5 py-3 rounded-2xl border border-slate-800">
                  <Clock size={16} className={isToday ? 'text-indigo-400' : 'text-slate-500'} />
                  <span className={`text-sm font-black ${isToday ? 'text-indigo-300' : 'text-slate-300'}`}>{formatTime(shift.startTime)}</span>
                  <ArrowRight size={14} className="text-slate-600" />
                  <span className={`text-sm font-black ${isToday ? 'text-indigo-300' : 'text-slate-300'}`}>{formatTime(shift.endTime)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
