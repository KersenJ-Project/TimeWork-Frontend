import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Calendar as CalendarIcon, ArrowRight, Edit2, Edit3, Save } from 'lucide-react';
import api from '../api/axios';
import { useLanguage } from '../context/LanguageContext';
import { managerTranslations } from '../translations/manager';

export default function ScheduleCalendar() {
  const { lang } = useLanguage();
  const currentLang = lang ? lang.toLowerCase() : 'fr';
  const t = managerTranslations[currentLang] || managerTranslations['fr'];

  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingShiftsSchedule, setViewingShiftsSchedule] = useState(null);
  const [scheduleShifts, setScheduleShifts] = useState([]);
  const [isShiftsLoading, setIsShiftsLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', startDate: '', endDate: '' });
  const [newSchedule, setNewSchedule] = useState({ name: '', startDate: '', endDate: '' });

  // Extract date to YYYY-MM-DD regardless of backend format
  const extractDate = (dateStr) => {
    if (!dateStr) return "";
    const raw = dateStr.split(/[T ]/)[0];
    const parts = raw.split(/[-/]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) return `${parts[0]}-${parts[1]}-${parts[2]}`;
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return raw;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Inconnue";
    try {
      const rawDate = dateStr.split(/[T ]/)[0];
      const parts = rawDate.split(/[-/]/);
      if (parts.length !== 3) return dateStr;
      if (parts[0].length === 4) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      } else {
        return `${parts[0]}/${parts[1]}/${parts[2]}`;
      }
    } catch (e) {
      return "Format invalide";
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/schedules');
      setSchedules(res.data);
    } catch (err) {
      console.error("Erreur API :", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const adjustDateForBackend = (dateStr) => {
    if (!dateStr) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[0]}-${parts[1]}-${parts[2]}T12:00:00.000Z`;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const start = new Date(newSchedule.startDate);
    const end = new Date(newSchedule.endDate);
    
    if (end < start) {
      alert("La date de fin ne peut pas être avant la date de début.");
      return;
    }
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      alert("Un planning doit durer au minimum une semaine (7 jours).");
      return;
    }
    const startStr = newSchedule.startDate;
    const endStr = newSchedule.endDate;

    const hasOverlap = schedules.some(sched => {
      if (editingId && sched.id === editingId) return false;
      const sStart = extractDate(sched.startDate);
      const sEnd = extractDate(sched.endDate);
      return (startStr <= sEnd && endStr >= sStart);
    });
    if (hasOverlap) {
      alert("Ce planning chevauche un planning existant.");
      return;
    }

    try {
      const payload = {
        ...newSchedule,
        startDate: adjustDateForBackend(newSchedule.startDate),
        endDate: adjustDateForBackend(newSchedule.endDate),
      };
      await api.post('/schedules', payload);
      setIsCreateModalOpen(false);
      setNewSchedule({ name: '', startDate: '', endDate: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la création");
    }
  };

  const startEditing = (sched) => {
    setEditingId(sched.id);
    
    setEditFormData({
      name: sched.name,
      startDate: extractDate(sched.startDate),
      endDate: extractDate(sched.endDate)
    });
  };

  const viewShifts = async (sched) => {
    setViewingShiftsSchedule(sched);
    setIsShiftsLoading(true);
    try {
      const res = await api.get('/shift');
      const shiftsForSched = res.data.filter(s => s.schedule && s.schedule.id === sched.id);
      setScheduleShifts(shiftsForSched);
    } catch (err) {
      alert("Erreur lors du chargement des shifts");
    }
    setIsShiftsLoading(false);
  };

  const handleUpdate = async (id) => {
    const start = new Date(editFormData.startDate);
    const end = new Date(editFormData.endDate);
    
    if (end < start) {
      alert("La date de fin ne peut pas être avant la date de début.");
      return;
    }
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      alert("Un planning doit durer au minimum une semaine (7 jours).");
      return;
    }
    const hasOverlap = schedules.some(sched => {
      if (sched.id === id) return false;
      const sStart = new Date(sched.startDate);
      const sEnd = new Date(sched.endDate);
      return (start <= sEnd && end >= sStart);
    });
    if (hasOverlap) {
      alert("Ce planning chevauche un planning existant.");
      return;
    }

    try {
      const payload = {
        ...editFormData,
        startDate: adjustDateForBackend(editFormData.startDate),
        endDate: adjustDateForBackend(editFormData.endDate),
      };
      await api.patch(`/schedules/${id}`, payload);
      setEditingId(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la modification");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous supprimer ce planning ?")) {
      try {
        await api.delete(`/schedules/${id}`);
        fetchData();
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  return (
    <div className="w-full p-6 lg:p-10 space-y-8 text-white bg-[#020617] min-h-screen">
      <div className="flex justify-between items-center border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">
            {t.scheduleTitle || "Planning"}
          </h1>
          <p className="text-slate-400 font-medium mt-1 italic tracking-tight">Cycles de travail et gestion des trimestres.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-blue-700 transition shadow-xl shadow-blue-500/20 active:scale-95"
        >
          <Plus size={24} />
          <span>CRÉER UN PLANNING</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          <div className="col-span-full text-center py-20 font-black text-slate-400 italic text-2xl uppercase tracking-widest">Mise à jour...</div>
        ) : schedules.length === 0 ? (
          <div className="col-span-full text-center py-20 font-bold text-slate-400 italic bg-slate-900/50 rounded-[2.5rem] border-2 border-dashed border-white/5">Aucun planning configuré.</div>
        ) : (
          schedules.map(sched => (
            <div key={sched.id} className="bg-slate-900/50 border border-white/5 p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all relative group overflow-hidden">
              {editingId === sched.id ? (
                <div className="space-y-4">
                  <input className="w-full border-2 border-blue-100 rounded-xl p-4 font-bold outline-none focus:border-blue-500" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="date" className="border rounded-xl p-3 text-xs font-bold bg-slate-950/50 text-white" value={editFormData.startDate} onChange={e => setEditFormData({...editFormData, startDate: e.target.value})} />
                    <input type="date" className="border rounded-xl p-3 text-xs font-bold bg-slate-950/50 text-white" value={editFormData.endDate} onChange={e => setEditFormData({...editFormData, endDate: e.target.value})} />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <button onClick={() => handleUpdate(sched.id)} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg">Sauvegarder</button>
                    <button onClick={() => setEditingId(null)} className="flex-1 bg-slate-800 text-slate-400 py-4 rounded-2xl text-xs font-black uppercase tracking-widest">Annuler</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xl">
                      {sched.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => startEditing(sched)} className="p-3 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 rounded-xl transition">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => handleDelete(sched.id)} className="p-3 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-xl transition">
                      <Trash2 size={18} />
                    </button>
                    <button onClick={() => viewShifts(sched)} className="p-3 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-xl transition ml-2 font-bold text-xs uppercase flex items-center gap-2">
                      Voir Shifts
                    </button>
                    </div>
                  </div>
                  <h3 className="font-black text-2xl text-white uppercase tracking-tighter mb-2">{sched.name}</h3>
                  <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-widest">
                    <CalendarIcon size={16} className="text-blue-500/50" />
                    <span className="bg-slate-950/50 text-white px-2 py-1 rounded-lg">{formatDate(sched.startDate)}</span>
                    <ArrowRight size={14} />
                    <span className="bg-slate-950/50 text-white px-2 py-1 rounded-lg">{formatDate(sched.endDate)}</span>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-[#020617]/90 backdrop-blur-md flex items-center justify-center z-[9999] p-4 text-white overflow-y-auto pt-24 pb-10">
          <div className="bg-slate-900/50 rounded-[3rem] p-12 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300 relative text-white">
            <button onClick={() => setIsCreateModalOpen(false)} className="absolute top-10 right-10 text-slate-400 hover:text-white transition"><X size={28} /></button>
            <h2 className="text-3xl font-black italic tracking-tighter mb-8">Nouveau <span className="text-blue-600 underline decoration-blue-200">Cycle</span></h2>
            <form onSubmit={handleCreate} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Titre du Planning</label>
                <input required type="text" placeholder="ex: Hiver 2026" value={newSchedule.name} onChange={e => setNewSchedule({...newSchedule, name: e.target.value})} className="w-full bg-slate-950/50 text-white border border-slate-800 rounded-2xl p-5 text-white font-black placeholder-gray-300 focus:border-blue-500 outline-none transition" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Début</label>
                  <input required type="date" value={newSchedule.startDate} onChange={e => setNewSchedule({...newSchedule, startDate: e.target.value})} className="w-full bg-slate-950/50 text-white border border-slate-800 rounded-2xl p-5 text-sm font-black text-white outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Fin</label>
                  <input required type="date" value={newSchedule.endDate} onChange={e => setNewSchedule({...newSchedule, endDate: e.target.value})} className="w-full bg-slate-950/50 text-white border border-slate-800 rounded-2xl p-5 text-sm font-black text-white outline-none focus:border-blue-500" />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white rounded-[1.5rem] py-5 font-black hover:bg-blue-500 transition shadow-2xl shadow-blue-500/20 uppercase tracking-widest text-sm mt-4">
                Créer le Cycle
              </button>
            </form>
          </div>
        </div>
      )}

      {viewingShiftsSchedule && (
        <div className="fixed inset-0 bg-[#020617]/90 backdrop-blur-md flex items-center justify-center z-[9999] p-4 text-white overflow-y-auto pt-24 pb-10">
          <div className="bg-slate-900 border border-white/10 rounded-[3rem] p-10 max-w-2xl w-full shadow-2xl relative mt-10 lg:mt-0">
            <button onClick={() => setViewingShiftsSchedule(null)} className="absolute top-8 right-8 text-slate-400 hover:text-white transition"><X size={28} /></button>
            <h2 className="text-2xl font-black italic tracking-tighter mb-2 uppercase">Shifts du <span className="text-indigo-500">Planning</span></h2>
            <p className="text-slate-400 font-bold mb-8">{viewingShiftsSchedule.name} ({formatDate(viewingShiftsSchedule.startDate)} - {formatDate(viewingShiftsSchedule.endDate)})</p>
            
            {isShiftsLoading ? (
              <div className="p-10 text-center font-bold text-slate-500 italic animate-pulse">Chargement...</div>
            ) : scheduleShifts.length === 0 ? (
              <div className="p-10 text-center font-bold text-slate-500 italic bg-slate-950/50 rounded-3xl border border-white/5">Aucun shift assigné dans ce planning.</div>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {scheduleShifts.map(shift => (
                  <div key={shift.id} className="bg-slate-950/80 p-4 rounded-2xl flex justify-between items-center border border-white/5">
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{shift.user?.firstName} {shift.user?.lastName}</span>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{formatDate(shift.date || shift.startTime)}</span>
                    </div>
                    <div className="flex gap-4 text-sm font-black bg-slate-900 px-4 py-2 rounded-xl text-blue-400">
                      <span>{shift.startTime?.substring(0,5)}</span>
                      <span className="text-slate-600">-</span>
                      <span>{shift.endTime?.substring(0,5)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
