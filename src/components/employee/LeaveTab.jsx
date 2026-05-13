import React, { useState, useEffect } from 'react';
import { Calendar, Briefcase } from 'lucide-react';
import api from '../../api/axios';

export default function LeaveTab() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newLeave, setNewLeave] = useState({ startDate: '', endDate: '', reason: '' });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/employee/leave-request');
      setLeaveRequests(res.data || []);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
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
      alert(error?.response?.data?.message || "Erreur lors de la demande.");
    }
  };

  const handleCancelLeave = async (id) => {
    if (!confirm('Voulez-vous annuler cette demande de congé ?')) return;
    try {
      await api.delete(`/employee/leave-request/${id}`);
      await fetchData();
    } catch (error) {
      alert('Erreur lors de l\'annulation.');
    }
  };

  if (isLoading) return <div className="text-center py-20 font-black text-slate-600 italic">Chargement...</div>;

  return (
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
            <div className="h-full flex items-center justify-center text-slate-600 font-bold italic py-10">Aucun congé demandé.</div>
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
  );
}
