import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Clock, Calendar, ChevronDown, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import CreateShiftModal from '../components/manager/CreateShiftModal';
import MassShiftModal from '../components/manager/MassShiftModal';

export default function ShiftsPage() {
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMassModalOpen, setIsMassModalOpen] = useState(false);
  const [expandedUsers, setExpandedUsers] = useState({});

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const empRes = await api.get('/managers/users');
      const onlyEmployees = empRes.data.filter(u => {
        const role = (u.role || '').toUpperCase();
        const status = (u.status || '').toUpperCase();
        const isNotBoss = role !== 'MANAGER' && role !== 'SUPER_ADMIN';
        const isApproved = status === 'APPROVED';
        return isNotBoss && isApproved;
      });
      setEmployees(onlyEmployees);
    } catch (err) {
      console.error("Erreur employés:", err);
    }

    try {
      const shiftRes = await api.get('/shift');
      setShifts(shiftRes.data);
    } catch (err) {
      console.error("Erreur shifts:", err);
    }

    try {
      const schedRes = await api.get('/schedules');
      setSchedules(schedRes.data);
    } catch (err) {
      console.error("Erreur schedules:", err);
    }

    setIsLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDeleteShift = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce shift ?")) return;
    try {
      await api.delete(`/shift/${id}`);
      fetchData(); 
    } catch (error) {
      alert("Erreur lors de la suppression.");
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "--:--";
    if (/^([01]\d|2[0-3]):([0-5]\d)/.test(timeStr)) {
      return timeStr.substring(0, 5).replace(':', 'h');
    }
    const d = new Date(timeStr);
    return isNaN(d.getTime()) ? timeStr : d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const rawDate = dateStr.split(/[T ]/)[0];
    const parts = rawDate.split(/[-/]/);
    if (parts.length === 3) {
      let year, month, day;
      if (parts[0].length === 4) {
        year = parts[0]; month = parts[1]; day = parts[2];
      } else {
        day = parts[0]; month = parts[1]; year = parts[2];
      }
      const dateObj = new Date(Date.UTC(year, month - 1, day));
      return dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
    }
    return rawDate;
  };

  const toggleUserExpanded = (userId) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const shiftsByUser = shifts.reduce((acc, shift) => {
    const uid = shift.user?.id;
    if (!uid) return acc;
    if (!acc[uid]) {
      acc[uid] = {
        user: shift.user,
        shifts: []
      };
    }
    acc[uid].shifts.push(shift);
    return acc;
  }, {});

  return (
    <div className="w-full p-6 lg:p-10 space-y-8 bg-[#020617] min-h-screen text-white">
      <div className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">Gestion des <span className="text-blue-500">Shifts</span></h1>
          <p className="text-slate-400 font-medium mt-1 italic">Assignez des heures de travail à vos employés.</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMassModalOpen(true)} className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 px-6 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-indigo-600 hover:text-white shadow-lg transition-all active:scale-95 uppercase text-sm">
            Générer Shifts
          </button>
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-blue-500 shadow-xl transition-all active:scale-95">
            <Plus size={24} /> <span>NOUVEAU SHIFT</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="p-20 text-center font-black text-slate-400 italic animate-pulse">Chargement des shifts...</div>
        ) : shifts.length === 0 ? (
          <div className="p-16 text-center font-bold text-slate-400 italic text-xl uppercase bg-slate-900/50 border-2 border-dashed border-white/5 rounded-[2.5rem]">Aucun shift assigné pour le moment.</div>
        ) : (
          Object.values(shiftsByUser).map(({ user, shifts }) => (
            <div key={user.id} className="bg-slate-900/50 border border-white/5 rounded-[2rem] shadow-sm overflow-hidden mb-4 transition-all group">
              <div 
                className="p-6 flex flex-col md:flex-row justify-between items-center cursor-pointer hover:bg-slate-800/80 transition-all"
                onClick={() => toggleUserExpanded(user.id)}
              >
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="h-16 w-16 bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-2xl flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform">
                    {(user.firstName || "U").charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-white uppercase tracking-tight">{user.firstName} {user.lastName}</h3>
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
                      <Calendar size={14} className="text-blue-400" />
                      <span>{shifts.length} shift{shifts.length > 1 ? 's' : ''} assigné{shifts.length > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/50 rounded-xl text-slate-400 mt-4 md:mt-0 border border-slate-800">
                  <ChevronDown size={24} className={`transition-transform duration-300 ${expandedUsers[user.id] ? 'rotate-180 text-blue-400' : ''}`} />
                </div>
              </div>

              {expandedUsers[user.id] && (
                <div className="p-6 pt-0 border-t border-white/5 bg-slate-950/30">
                  <div className="space-y-4 mt-6">
                    {shifts.map(shift => (
                      <div key={shift.id} className="bg-slate-900/80 border border-white/5 p-5 rounded-[1.5rem] flex flex-col md:flex-row justify-between items-center hover:border-white/10 transition-all group/shift shadow-inner">
                        <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
                          <div className="h-12 w-12 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-xl flex items-center justify-center">
                            <Calendar size={18} />
                          </div>
                          <div>
                            <div className="font-black text-white text-md uppercase tracking-wider">{formatDate(shift.date)}</div>
                            <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">
                              {shift.schedule?.name ? `Cycle: ${shift.schedule.name}` : "Planning Inconnu"}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-6 bg-slate-950/80 px-6 py-3 rounded-2xl border border-slate-800">
                            <div className="text-center">
                              <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Début</p>
                              <p className="font-black text-md text-white">{formatTime(shift.startTime)}</p>
                            </div>
                            <ArrowRight className="text-slate-600" size={16} />
                            <div className="text-center">
                              <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Fin</p>
                              <p className="font-black text-md text-white">{formatTime(shift.endTime)}</p>
                            </div>
                          </div>
                          
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteShift(shift.id); }} className="p-3 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-xl transition opacity-0 group-hover/shift:opacity-100">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <CreateShiftModal 
          onClose={() => setIsModalOpen(false)} 
          employees={employees} 
          schedules={schedules} 
          onRefresh={fetchData} 
          formatDate={formatDate} 
        />
      )}

      {isMassModalOpen && (
        <MassShiftModal 
          onClose={() => setIsMassModalOpen(false)} 
          employees={employees} 
          schedules={schedules} 
          onRefresh={fetchData} 
          formatDate={formatDate} 
        />
      )}
    </div>
  );
}