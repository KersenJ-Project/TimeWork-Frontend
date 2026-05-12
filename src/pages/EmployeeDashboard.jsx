import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, Calendar, LogOut, Plus, List, Briefcase } from 'lucide-react';
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
  const [newAvail, setNewAvail] = useState({ dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '17:00' });
  const [newLeave, setNewLeave] = useState({ startDate: '', endDate: '' });

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
    
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddAvailability = async (e) => {
    e.preventDefault();
    try {
      await api.post('/employee/availability', {
        availabilities: [newAvail]
      });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Erreur lors de l'ajout de la disponibilité.");
    }
  };

  const handleRemoveAvailability = async (id) => {
    try {
      await api.delete(`/employee/availability/${id}`);
      fetchData();
    } catch (error) {
      alert("Erreur lors de la suppression.");
    }
  };

  const handleAddLeave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        startDate: adjustDateForBackend(newLeave.startDate),
        endDate: adjustDateForBackend(newLeave.endDate),
      };
      await api.post('/employee/leave-request', payload);
      setNewLeave({ startDate: '', endDate: '' });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Erreur lors de la demande de congé.");
    }
  };

  const handleCheckInOut = async () => {
    try {
      if (isWorking) {
        await api.post('/check-out');
        setIsWorking(false);
      } else {
        await api.post('/check-in');
        setIsWorking(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors du pointage.");
    }
  };

  return (
    <div className="w-full p-6 lg:p-10 space-y-8 text-[#0B1023] bg-[#F4F6FB] min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-gray-200 pb-6 gap-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter">Mon <span className="text-blue-600">Espace</span></h1>
          <p className="text-gray-500 font-medium mt-1">Gérez vos disponibilités, vos congés et votre pointage.</p>
        </div>
      </div>

      <div className="flex gap-4 pb-2 overflow-x-auto snap-x hide-scrollbar">
        <button 
          onClick={() => handleTabChange('POINTAGE')} 
          className={`flex-shrink-0 snap-center flex items-center gap-3 px-8 py-4 rounded-[2rem] font-black transition-all duration-300 ${activeTab === 'POINTAGE' ? 'bg-[#0B1023] text-white shadow-xl scale-100' : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-200 scale-95'}`}
        >
          <Clock size={20} className={activeTab === 'POINTAGE' ? 'text-blue-400' : ''} /> 
          Pointage
        </button>
        <button 
          onClick={() => handleTabChange('DISPO')} 
          className={`flex-shrink-0 snap-center flex items-center gap-3 px-8 py-4 rounded-[2rem] font-black transition-all duration-300 ${activeTab === 'DISPO' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 scale-100' : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-200 scale-95'}`}
        >
          <List size={20} className={activeTab === 'DISPO' ? 'text-blue-200' : ''} /> 
          Mes Disponibilités
        </button>
        <button 
          onClick={() => handleTabChange('CONGES')} 
          className={`flex-shrink-0 snap-center flex items-center gap-3 px-8 py-4 rounded-[2rem] font-black transition-all duration-300 ${activeTab === 'CONGES' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 scale-100' : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-200 scale-95'}`}
        >
          <Calendar size={20} className={activeTab === 'CONGES' ? 'text-emerald-200' : ''} /> 
          Mes Congés
        </button>
      </div>

      <div className="min-h-[50vh]">
        {isLoading ? (
          <div className="text-center py-20 font-black text-gray-300 italic text-2xl uppercase tracking-widest animate-pulse">Chargement des données...</div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {activeTab === 'POINTAGE' && (
              <div className="max-w-2xl mx-auto mt-10">
                <div className="bg-white border border-gray-200 p-12 rounded-[3rem] shadow-sm text-center relative overflow-hidden group">
                  <div className={`absolute top-0 left-0 w-full h-2 ${isWorking ? 'bg-red-500' : 'bg-blue-500'} transition-colors duration-500`} />
                  <Clock className={`mb-6 mx-auto transition-colors duration-500 ${isWorking ? 'text-red-500' : 'text-blue-500'}`} size={64} />
                  <h2 className="text-3xl font-black mb-2 text-[#0B1023] uppercase tracking-tighter">
                    {isWorking ? "Shift en cours" : "Prêt à travailler ?"}
                  </h2>
                  <p className="text-gray-500 mb-10 font-bold text-sm">
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
                  <div className="bg-white border border-gray-200 rounded-[2.5rem] p-8 shadow-sm">
                    <h2 className="text-xl font-black text-[#0B1023] mb-6 flex items-center gap-3">
                      <Plus className="text-blue-500" /> Ajouter une dispo
                    </h2>
                    <form onSubmit={handleAddAvailability} className="space-y-5">
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Jour de la semaine</label>
                        <select value={newAvail.dayOfWeek} onChange={e => setNewAvail({...newAvail, dayOfWeek: e.target.value})} className="w-full mt-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all">
                          {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Début</label>
                          <input type="time" required value={newAvail.startTime} onChange={e => setNewAvail({...newAvail, startTime: e.target.value})} className="w-full mt-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Fin</label>
                          <input type="time" required value={newAvail.endTime} onChange={e => setNewAvail({...newAvail, endTime: e.target.value})} className="w-full mt-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all" />
                        </div>
                      </div>
                      <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 uppercase tracking-widest text-xs active:scale-95">
                        Ajouter
                      </button>
                    </form>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <h3 className="font-black text-gray-400 tracking-[0.1em] uppercase text-xs ml-2">Mes horaires configurés</h3>
                  <div className="bg-white border border-gray-200 rounded-[2.5rem] p-6 shadow-sm min-h-[300px]">
                    {availabilities.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-gray-400 font-bold italic">Aucune disponibilité configurée.</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availabilities.map(av => (
                          <div key={av.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center group hover:bg-blue-50 transition-colors">
                            <div>
                              <span className="block font-black text-[#0B1023] uppercase text-sm">{av.dayOfWeek}</span>
                              <span className="block font-bold text-gray-500 text-xs mt-1">{av.startTime} — {av.endTime}</span>
                            </div>
                            <button onClick={() => handleRemoveAvailability(av.id)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-red-400 hover:text-white hover:bg-red-500 shadow-sm transition-all">
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
                  <div className="bg-white border border-gray-200 rounded-[2.5rem] p-8 shadow-sm">
                    <h2 className="text-xl font-black text-[#0B1023] mb-6 flex items-center gap-3">
                      <Calendar className="text-emerald-500" /> Demande de congé
                    </h2>
                    <form onSubmit={handleAddLeave} className="space-y-5">
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Date de début</label>
                        <input type="date" required value={newLeave.startDate} onChange={e => setNewLeave({...newLeave, startDate: e.target.value})} className="w-full mt-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:border-emerald-500 transition-all" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Date de fin</label>
                        <input type="date" required value={newLeave.endDate} onChange={e => setNewLeave({...newLeave, endDate: e.target.value})} className="w-full mt-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:border-emerald-500 transition-all" />
                      </div>
                      <button type="submit" className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-widest text-xs active:scale-95">
                        Soumettre
                      </button>
                    </form>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <h3 className="font-black text-gray-400 tracking-[0.1em] uppercase text-xs ml-2">Historique de mes congés</h3>
                  <div className="bg-white border border-gray-200 rounded-[2.5rem] p-6 shadow-sm min-h-[300px]">
                    {leaveRequests.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-gray-400 font-bold italic">Aucun congé demandé.</div>
                    ) : (
                      <div className="space-y-3">
                        {leaveRequests.map(req => (
                          <div key={req.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:bg-white transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black">
                                <Briefcase size={20} />
                              </div>
                              <div>
                                <span className="block font-black text-[#0B1023] text-sm">Du {formatDate(req.startDate)}</span>
                                <span className="block font-black text-[#0B1023] text-sm">Au {formatDate(req.endDate)}</span>
                              </div>
                            </div>
                            <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                                req.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                req.status === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                              }`}>
                                {req.status || 'PENDING'}
                              </span>
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