import React, { useState, useEffect } from 'react';
import { Clock, Calendar, ArrowRight, X } from 'lucide-react';
import api from '../../api/axios';
import { getUserId } from '../../api/userId';
import { useLanguage } from '../../context/LanguageContext';
import { employeeTranslations } from '../../translations/employee';

export default function CheckInTab() {
  const { lang } = useLanguage();
  const currentLang = lang ? lang.toLowerCase() : 'fr';
  const t = employeeTranslations[currentLang] || employeeTranslations['fr'];
  const [isWorking, setIsWorking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [todayShift, setTodayShift] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const statusRes = await api.get('/employee/check-status');
      setIsWorking(Boolean(statusRes.data?.isWorking));

      const userId = getUserId();
      if (userId) {
        const todayStr = new Date().toISOString().split('T')[0];
        const shiftRes = await api.get(`/shift/users/${userId}`);
        const todayShiftFound = shiftRes.data.find(s => s.date && s.date.split(/[T ]/)[0] === todayStr);
        setTodayShift(todayShiftFound || null);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCheckInOut = async () => {
    try {
      setErrorMsg(null);
      if (isWorking) {
         await api.post('/employee/check-out');
         setSuccessMsg(t.punchOut);
      } else {
         await api.post('/employee/check-in');
         setSuccessMsg(t.punchIn);
      }
      setTimeout(() => setSuccessMsg(null), 3000);
      await fetchData();
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || 'Erreur lors du pointage.');
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';
    if (/^([01]\d|2[0-3]):([0-5]\d)/.test(timeStr)) return timeStr.substring(0, 5).replace(':', 'h');
    const d = new Date(timeStr);
    return isNaN(d.getTime()) ? timeStr : d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
  };

  if (isLoading) return <div className="text-center py-20 font-black text-slate-600 italic">{t.loading}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-slate-900/50 border border-white/5 p-12 rounded-[3rem] shadow-sm text-center relative overflow-hidden group">
        <div className={`absolute top-0 left-0 w-full h-2 ${isWorking ? 'bg-red-500' : (todayShift ? 'bg-blue-500' : 'bg-slate-700')} transition-colors duration-500`} />
        
        <Clock className={`mb-6 mx-auto transition-colors duration-500 ${isWorking ? 'text-red-500' : (todayShift ? 'text-blue-500' : 'text-slate-600')}`} size={64} />
        
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl font-bold flex justify-between items-center mb-6 text-xs text-left mx-auto max-w-sm">
            {errorMsg}
            <button onClick={() => setErrorMsg(null)}><X size={16} /></button>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl font-bold flex justify-between items-center mb-6 text-xs text-left mx-auto max-w-sm">
            {successMsg}
            <button onClick={() => setSuccessMsg(null)}><X size={16} /></button>
          </div>
        )}

        {todayShift ? (
          <>
            <h2 className="text-3xl font-black mb-2 text-white uppercase tracking-tighter">
              {isWorking ? t.shiftInProgress : t.readyToWork}
            </h2>

            <div className="flex items-center justify-center gap-4 bg-slate-950/50 p-4 rounded-2xl border border-slate-800 w-fit mx-auto mb-8">
              <Calendar size={18} className="text-blue-400" />
              <div className="flex items-center gap-3 font-black text-white">
                <span>{formatTime(todayShift.startTime)}</span>
                <ArrowRight size={14} className="text-slate-600" />
                <span>{formatTime(todayShift.endTime)}</span>
              </div>
            </div>

            <p className="text-slate-400 mb-10 font-bold text-sm">
              {isWorking ? t.endShiftMessage : t.startShiftMessage}
            </p>
            
            <button
              onClick={handleCheckInOut}
              className={`text-white font-black px-12 py-5 rounded-full transition-all duration-300 shadow-xl w-full max-w-sm mx-auto text-lg uppercase tracking-widest active:scale-95 ${isWorking ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/30'}`}
            >
              {isWorking ? t.punchOut : t.punchIn}
            </button>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-black mb-4 text-white uppercase tracking-tighter">{t.noShiftToday}</h2>
            <p className="text-slate-400 mb-10 font-bold text-sm">
              {t.noShiftMessage}
            </p>
            <button disabled className="text-slate-500 font-black px-12 py-5 rounded-full bg-slate-800/50 w-full max-w-sm mx-auto text-lg uppercase tracking-widest cursor-not-allowed border border-slate-700/50">
              {t.punchBlocked}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
