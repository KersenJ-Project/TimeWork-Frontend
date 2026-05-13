import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import api from '../../api/axios';

export default function CheckInTab() {
  const [isWorking, setIsWorking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/employee/check-status');
      setIsWorking(Boolean(res.data?.isWorking));
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  useEffect(() => { fetchStatus(); }, []);

  const handleCheckInOut = async () => {
    try {
      if (isWorking) await api.post('/employee/check-out');
      else await api.post('/employee/check-in');
      await fetchStatus();
    } catch (err) {
      alert(err?.response?.data?.message || 'Erreur lors du pointage.');
    }
  };

  if (isLoading) return <div className="text-center py-20 font-black text-slate-600 italic">Chargement...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-slate-900/50 border border-white/5 p-12 rounded-[3rem] shadow-sm text-center relative overflow-hidden group">
        <div className={`absolute top-0 left-0 w-full h-2 ${isWorking ? 'bg-red-500' : 'bg-blue-500'} transition-colors duration-500`} />
        <Clock className={`mb-6 mx-auto transition-colors duration-500 ${isWorking ? 'text-red-500' : 'text-blue-500'}`} size={64} />
        <h2 className="text-3xl font-black mb-2 text-white uppercase tracking-tighter">
          {isWorking ? "Shift en cours" : "Prêt à travailler ?"}
        </h2>
        <p className="text-slate-400 mb-10 font-bold text-sm">
          {isWorking ? "N'oubliez pas de terminer votre shift à la fin de votre quart de travail." : "Votre prochain shift commence bientôt. Pointez pour démarrer !"}
        </p>
        <button 
          onClick={handleCheckInOut}
          className={`text-white font-black px-12 py-5 rounded-full transition-all duration-300 shadow-xl w-full max-w-sm mx-auto text-lg uppercase tracking-widest active:scale-95 ${isWorking ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/30'}`}
        >
          {isWorking ? "Terminer le shift" : "Pointer l'arrivée"}
        </button>
      </div>
    </div>
  );
}
