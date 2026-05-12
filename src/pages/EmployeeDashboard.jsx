import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, Calendar, LogOut, Plus, List, Briefcase, X } from 'lucide-react';
import { DayOfWeek } from '../enum/DayOfWeek';
import api from '../api/axios';

export default function EmployeeDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') || 'POINTAGE';
  
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab') || 'POINTAGE';
    if (tab !== activeTab) setActiveTab(tab);
  }, [location.search]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`?tab=${tab}`);
  };
  
  const [availabilities, setAvailabilities] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWorking, setIsWorking] = useState(false);

  // Form states
  const [newAvail, setNewAvail] = useState({ dayOfWeek: DayOfWeek.MONDAY, isAllDay: false, startTime: '09:00', endTime: '17:00' });
  const [newLeave, setNewLeave] = useState({ startDate: '', endDate: '', reason: '' });

  const normalizeApiError = (error, fallbackMessage) => {
    const message = error?.response?.data?.message;
    if (Array.isArray(message)) return message.join(' ');
    return message || fallbackMessage;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Inconnue";
    try {
      const rawDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
      const parts = rawDate.split('-');
      if (parts.length !== 3) return dateStr;
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    } catch (e) {
      return "Format invalide";
    }
  };

  const adjustDateForBackend = (dateStr) => {
    if (!dateStr) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    d.setUTCDate(d.getUTCDate() + 2);
    return d.toISOString().split('T')[0];
  };

  const fetchData = async () => {
    setIsLoading(true);
    
    try {
      const availRes = await api.get('/employee/availability');
      setAvailabilities(availRes.data || []);
    } catch (error) {
      console.error("Erreur de récupération des disponibilités :", error);
    }

    try {
      const leaveRes = await api.get('/employee/leave-request');
      setLeaveRequests(leaveRes.data || []);
    } catch (error) {
      console.error("Erreur de récupération des congés :", error);
    }
    // Try to fetch the current check-in status so UI reflects whether employee is working
    try {
      // some backends expose different endpoints - try a sensible one and fallback
      let statusRes;
      try {
        statusRes = await api.get('/employee/working');
      } catch (e1) {
        try {
          statusRes = await api.get('/check-status');
        } catch (e2) {
          statusRes = await api.get('/employee/status');
        }
      }
      // normalize
      if (statusRes && typeof statusRes.data === 'object') {
        setIsWorking(Boolean(statusRes.data.isWorking ?? statusRes.data.working ?? statusRes.data));
      } else {
        setIsWorking(Boolean(statusRes?.data));
      }
    } catch (error) {
      // if none of the endpoints exist, keep default false
      console.info('Impossible de récupérer le statut de pointage (non critique)');
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddAvailability = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newAvail,
        isAvailable: true,
        startTime: newAvail.isAllDay ? undefined : newAvail.startTime,
        endTime: newAvail.isAllDay ? undefined : newAvail.endTime,
      };
      await api.post('/employee/availability', payload);
      setNewAvail({ dayOfWeek: DayOfWeek.MONDAY, isAllDay: false, startTime: '09:00', endTime: '17:00' });
      await fetchData();
    } catch (error) {
      alert(normalizeApiError(error, "Erreur lors de l'ajout de la disponibilité."));
    }
  };

  const handleRemoveAvailability = async (id) => {
    try {
      await api.delete(`/employee/availability/${id}`);
      await fetchData();
    } catch (error) {
      alert(normalizeApiError(error, "Erreur lors de la suppression."));
    }
  };

  const handleAddLeave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        startDate: adjustDateForBackend(newLeave.startDate),
        endDate: adjustDateForBackend(newLeave.endDate),
        reason: newLeave.reason,
      };
      await api.post('/employee/leave-request', payload);
      setNewLeave({ startDate: '', endDate: '', reason: '' });
      await fetchData();
    } catch (error) {
      alert(normalizeApiError(error, "Erreur lors de la demande de congé."));
    }
  };

  const handleCancelLeave = async (id) => {
    if (!confirm('Voulez-vous annuler cette demande de congé ?')) return;
    try {
      await api.delete(`/employee/leave-request/${id}`);
      await fetchData();
    } catch (error) {
      alert(normalizeApiError(error, 'Erreur lors de l\'annulation du congé.'));
    }
  };

const handleCheckInOut = async () => {
      try {
        if (isWorking) {
          try {
            await api.post('/employee/check-out');
          } catch (e) {
            if (e.response && e.response.status === 404) {
              await api.post('/check-out');
            } else {
              throw e;
            }
          }
          setIsWorking(false);
          await fetchData();
        } else {
          try {
            await api.post('/employee/check-in');
          } catch (e) {
            if (e.response && e.response.status === 404) {
              await api.post('/check-in');
            } else {
              throw e;
            }
          }
          setIsWorking(true);
          await fetchData();
        }
      } catch (err) {
        const errorMsg = err?.response?.data?.message || err?.response?.data || '';
        // Si le backend dit qu'il est déjà pointé, on synchronise l'affichage
        if (String(errorMsg).toLowerCase().includes('already checked in') || err?.response?.status === 409) {
          setIsWorking(true);
        } else {
          alert(normalizeApiError(err, "Erreur lors du pointage."));
        }
    }
  };

  return (
    <div className="w-full p-6 lg:p-10 space-y-8 text-white min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-slate-800 pb-6 gap-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter">Mon <span className="text-blue-500">Espace</span></h1>
          <p className="text-slate-400 font-medium mt-1">Gérez vos disponibilités, vos congés et votre pointage.</p>
        </div>
      </div>

      <div className="flex gap-4 pb-2 overflow-x-auto snap-x hide-scrollbar">
        <button 
          onClick={() => handleTabChange('POINTAGE')} 
          className={`flex-shrink-0 snap-center flex items-center gap-3 px-8 py-4 rounded-[2rem] font-black transition-all duration-300 ${activeTab === 'POINTAGE' ? 'bg-white text-[#020617] shadow-xl scale-100' : 'bg-slate-900/50 text-slate-500 hover:bg-slate-800 border border-white/5 scale-95'}`}
        >
          <Clock size={20} className={activeTab === 'POINTAGE' ? 'text-blue-600' : ''} /> 
          Pointage
        </button>
        <button 
          onClick={() => handleTabChange('DISPO')} 
          className={`flex-shrink-0 snap-center flex items-center gap-3 px-8 py-4 rounded-[2rem] font-black transition-all duration-300 ${activeTab === 'DISPO' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 scale-100' : 'bg-slate-900/50 text-slate-500 hover:bg-slate-800 border border-white/5 scale-95'}`}
        >
          <List size={20} className={activeTab === 'DISPO' ? 'text-blue-300' : ''} /> 
          Mes Disponibilités
        </button>
        <button 
          onClick={() => handleTabChange('CONGES')} 
          className={`flex-shrink-0 snap-center flex items-center gap-3 px-8 py-4 rounded-[2rem] font-black transition-all duration-300 ${activeTab === 'CONGES' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 scale-100' : 'bg-slate-900/50 text-slate-500 hover:bg-slate-800 border border-white/5 scale-95'}`}
        >
          <Calendar size={20} className={activeTab === 'CONGES' ? 'text-emerald-200' : ''} /> 
          Mes Congés
        </button>
      </div>

      <div className="min-h-[50vh]">
        {isLoading ? (
          <div className="text-center py-20 font-black text-slate-600 italic text-2xl uppercase tracking-widest animate-pulse">Chargement des données...</div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {activeTab === 'POINTAGE' && (
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
            )}

            {activeTab === 'DISPO' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 shadow-sm">
                    <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                      <Plus className="text-blue-500" /> Ajouter une dispo
                    </h2>
                    <form onSubmit={handleAddAvailability} className="space-y-5">
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Jour de la semaine</label>
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
                        Disponible toute la journée
                      </label>
                      <div className={`grid grid-cols-2 gap-4 ${newAvail.isAllDay ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div>
                          <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Début</label>
                          <input type="time" required value={newAvail.startTime} onChange={e => setNewAvail({...newAvail, startTime: e.target.value})} className="w-full mt-1 p-4 bg-slate-950/50 border border-slate-800 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all text-white [color-scheme:dark]" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Fin</label>
                          <input type="time" required value={newAvail.endTime} onChange={e => setNewAvail({...newAvail, endTime: e.target.value})} className="w-full mt-1 p-4 bg-slate-950/50 border border-slate-800 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all text-white [color-scheme:dark]" />
                        </div>
                      </div>
                      <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 uppercase tracking-widest text-xs active:scale-95">
                        Ajouter
                      </button>
                    </form>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <h3 className="font-black text-slate-500 tracking-[0.1em] uppercase text-xs ml-2">Mes horaires configurés</h3>
                  <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-6 shadow-sm min-h-[300px]">
                    {availabilities.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-slate-600 font-bold italic">Aucune disponibilité configurée.</div>
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
            )}

            {activeTab === 'CONGES' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 shadow-sm">
                    <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                      <Calendar className="text-emerald-500" /> Demande de congé
                    </h2>
                    <form onSubmit={handleAddLeave} className="space-y-5">
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Date de début</label>
                        <input type="date" required value={newLeave.startDate} onChange={e => setNewLeave({...newLeave, startDate: e.target.value})} className="w-full mt-1 p-4 bg-slate-950/50 border border-slate-800 rounded-2xl font-bold outline-none focus:border-emerald-500 transition-all text-white [color-scheme:dark]" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Date de fin</label>
                        <input type="date" required value={newLeave.endDate} onChange={e => setNewLeave({...newLeave, endDate: e.target.value})} className="w-full mt-1 p-4 bg-slate-950/50 border border-slate-800 rounded-2xl font-bold outline-none focus:border-emerald-500 transition-all text-white [color-scheme:dark]" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Motif</label>
                        <textarea value={newLeave.reason} onChange={e => setNewLeave({...newLeave, reason: e.target.value})} rows={3} className="w-full mt-1 p-4 bg-slate-950/50 border border-slate-800 rounded-2xl font-bold outline-none focus:border-emerald-500 transition-all resize-none text-white" placeholder="Vacances, rendez-vous, etc." />
                      </div>
                      <button type="submit" className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-widest text-xs active:scale-95">
                        Soumettre
                      </button>
                    </form>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <h3 className="font-black text-slate-500 tracking-[0.1em] uppercase text-xs ml-2">Historique de mes congés</h3>
                  <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-6 shadow-sm min-h-[300px]">
                    {leaveRequests.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-slate-600 font-bold italic">Aucun congé demandé.</div>
                    ) : (
                      <div className="space-y-3">
                        {leaveRequests.map(req => (
                          <div key={req.id} className="p-5 bg-slate-950/50 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:bg-slate-900/80 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black border border-emerald-500/20">
                                <Briefcase size={20} />
                              </div>
                              <div>
                                <span className="block font-black text-white text-sm">Du {formatDate(req.startDate)}</span>
                                <span className="block font-black text-white text-sm">Au {formatDate(req.endDate)}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                                  req.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                  req.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                }`}>
                                  {req.status || 'PENDING'}
                              </span>
                              {(!req.status || req.status === 'PENDING') && (
                                <button onClick={() => handleCancelLeave(req.id)} className="px-3 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs font-black hover:bg-red-500 hover:text-white transition-colors">Annuler</button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}