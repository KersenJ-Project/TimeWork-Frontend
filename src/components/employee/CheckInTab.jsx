import React, { useState, useEffect } from 'react';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import api from '../../api/axios';
import { getUserId } from '../../api/userId';

export default function CheckInTab() {
  const [isWorking, setIsWorking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [todayShift, setTodayShift] = useState(null);

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
      if (isWorking) await api.post('/employee/check-out');
      else await api.post('/employee/check-in');
      await fetchData();
    } catch (err) {
      alert(err?.response?.data?.message || 'Erreur lors du pointage.');
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';
    if (/^([01]\d|2[0-3]):([0-5]\d)/.test(timeStr)) return timeStr.substring(0, 5).replace(':', 'h');
    const d = new Date(timeStr);
    return isNaN(d.getTime()) ? timeStr : d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
  };

  if (isLoading) return <div className="text-center py-20 font-black text-slate-600 italic">Chargement...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-slate-900/50 border border-white/5 p-12 rounded-[3rem] shadow-sm text-center relative overflow-hidden group">
        <div className={`absolute top-0 left-0 w-full h-2 ${isWorking ? 'bg-red-500' : (todayShift ? 'bg-blue-500' : 'bg-slate-700')} transition-colors duration-500`} />
        
        <Clock className={`mb-6 mx-auto transition-colors duration-500 ${isWorking ? 'text-red-500' : (todayShift ? 'text-blue-500' : 'text-slate-600')}`} size={64} />
        
        {todayShift ? (
          <>
            <h2 className="text-3xl font-black mb-2 text-white uppercase tracking-tighter">
              {isWorking ? 'Shift en cours' : 'Prêt à travailler ?'}
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
              {isWorking ? "N'oubliez pas de terminer votre shift à la fin de votre quart de travail." : "Pointez votre arrivée pour commencer votre shift !"}
            </p>
            
            <button
              onClick={handleCheckInOut}
              className={`text-white font-black px-12 py-5 rounded-full transition-all duration-300 shadow-xl w-full max-w-sm mx-auto text-lg uppercase tracking-widest active:scale-95 ${isWorking ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/30'}`}
            >
              {isWorking ? 'Terminer le shift' : "Pointer l'arrivée"}
            </button>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-black mb-4 text-white uppercase tracking-tighter">Aucun shift prévu</h2>
            <p className="text-slate-400 mb-10 font-bold text-sm">
              Vous n'avez pas de shift assigné pour aujourd'hui. Profitez de votre journée !
            </p>
            <button disabled className="text-slate-500 font-black px-12 py-5 rounded-full bg-slate-800/50 w-full max-w-sm mx-auto text-lg uppercase tracking-widest cursor-not-allowed border border-slate-700/50">
              Pointage bloqué
            </button>
          </>
        )}
      </div>
    </div>
  );
}
