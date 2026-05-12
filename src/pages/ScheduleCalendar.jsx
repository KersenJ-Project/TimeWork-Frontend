import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Calendar as CalendarIcon, ArrowRight, Edit2, Save } from 'lucide-react';
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
  const [editFormData, setEditFormData] = useState({ name: '', startDate: '', endDate: '' });
  const [newSchedule, setNewSchedule] = useState({ name: '', startDate: '', endDate: '' });

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
    const d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    d.setUTCDate(d.getUTCDate() + 2);
    return d.toISOString().split('T')[0];
  };

  const handleCreate = async (e) => {
    e.preventDefault();
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
      startDate: sched.startDate.split('T')[0],
      endDate: sched.endDate.split('T')[0]
    });
  };

  const handleUpdate = async (id) => {
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
    <div className="w-full p-6 lg:p-10 space-y-8 text-[#0B1023] bg-[#F4F6FB] min-h-screen">
      <div className="flex justify-between items-center border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">
            {t.scheduleTitle || "Planning"}
          </h1>
          <p className="text-gray-500 font-medium mt-1 italic tracking-tight">Cycles de travail et gestion des trimestres.</p>
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
          <div className="col-span-full text-center py-20 font-black text-gray-300 italic text-2xl uppercase tracking-widest">Mise à jour...</div>
        ) : schedules.length === 0 ? (
          <div className="col-span-full text-center py-20 font-bold text-gray-400 italic bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">Aucun planning configuré.</div>
        ) : (
          schedules.map(sched => (
            <div key={sched.id} className="bg-white border border-gray-100 p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all relative group overflow-hidden">
              {editingId === sched.id ? (
                <div className="space-y-4">
                  <input className="w-full border-2 border-blue-100 rounded-xl p-4 font-bold outline-none focus:border-blue-500" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="date" className="border rounded-xl p-3 text-xs font-bold bg-gray-50" value={editFormData.startDate} onChange={e => setEditFormData({...editFormData, startDate: e.target.value})} />
                    <input type="date" className="border rounded-xl p-3 text-xs font-bold bg-gray-50" value={editFormData.endDate} onChange={e => setEditFormData({...editFormData, endDate: e.target.value})} />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <button onClick={() => handleUpdate(sched.id)} className="flex-1 bg-[#0B1023] text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg">Sauvegarder</button>
                    <button onClick={() => setEditingId(null)} className="flex-1 bg-gray-100 text-gray-400 py-4 rounded-2xl text-xs font-black uppercase tracking-widest">Annuler</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xl">
                      {sched.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => startEditing(sched)} className="p-3 text-blue-500 hover:bg-blue-50 rounded-xl transition"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(sched.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition"><Trash2 size={18} /></button>
                    </div>
                  </div>
                  <h3 className="font-black text-2xl text-[#0B1023] uppercase tracking-tighter mb-2">{sched.name}</h3>
                  <div className="flex items-center gap-3 text-gray-400 font-bold text-xs uppercase tracking-widest">
                    <CalendarIcon size={16} className="text-blue-500/50" />
                    <span className="bg-gray-50 px-2 py-1 rounded-lg">{formatDate(sched.startDate)}</span>
                    <ArrowRight size={14} />
                    <span className="bg-gray-50 px-2 py-1 rounded-lg">{formatDate(sched.endDate)}</span>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-[#0B1023]/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300 relative text-black">
            <button onClick={() => setIsCreateModalOpen(false)} className="absolute top-10 right-10 text-gray-400 hover:text-black transition"><X size={28} /></button>
            <h2 className="text-3xl font-black italic tracking-tighter mb-8">Nouveau <span className="text-blue-600 underline decoration-blue-200">Cycle</span></h2>
            <form onSubmit={handleCreate} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Titre du Planning</label>
                <input required type="text" placeholder="ex: Hiver 2026" value={newSchedule.name} onChange={e => setNewSchedule({...newSchedule, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-5 text-black font-black placeholder-gray-300 focus:border-blue-500 outline-none transition" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Début</label>
                  <input required type="date" value={newSchedule.startDate} onChange={e => setNewSchedule({...newSchedule, startDate: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-5 text-sm font-black text-black outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Fin</label>
                  <input required type="date" value={newSchedule.endDate} onChange={e => setNewSchedule({...newSchedule, endDate: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-5 text-sm font-black text-black outline-none focus:border-blue-500" />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#0B1023] text-white rounded-[1.5rem] py-6 font-black hover:bg-blue-600 transition active:scale-95 shadow-2xl shadow-blue-500/20 uppercase tracking-widest text-sm">
                Valider la période
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}