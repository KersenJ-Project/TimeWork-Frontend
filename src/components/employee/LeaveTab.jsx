import React, { useState, useEffect } from 'react';
import { Calendar, Briefcase, X } from 'lucide-react';
import api from '../../api/axios';
import { useLanguage } from '../../context/LanguageContext';
import { employeeTranslations } from '../../translations/employee';

export default function LeaveTab() {
  const { lang } = useLanguage();
  const currentLang = lang ? lang.toLowerCase() : 'fr';
  const t = employeeTranslations[currentLang] || employeeTranslations['fr'];
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newLeave, setNewLeave] = useState({ startDate: '', endDate: '', reason: '' });
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

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
    const parts = dateStr.split(/[T ]/)[0].split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[0]}-${parts[1]}-${parts[2]}T12:00:00Z`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return t.leaveUnknownDate;
    try {
      const rawDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
      const parts = rawDate.split('-');
      if (parts.length !== 3) return dateStr;
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    } catch (e) {
      return t.leaveInvalidFormat;
    }
  };

  const handleAddLeave = async (e) => {
    e.preventDefault();
    try {
      setErrorMsg(null);
      const payload = {
        startDate: adjustDateForBackend(newLeave.startDate),
        endDate: adjustDateForBackend(newLeave.endDate),
        reason: newLeave.reason,
      };
      await api.post('/employee/leave-request', payload);
      setNewLeave({ startDate: '', endDate: '', reason: '' });
      setSuccessMsg(t.leaveSuccessSent);
      setTimeout(() => setSuccessMsg(null), 3000);
      await fetchData();
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || t.leaveErrSent);
    }
  };

  const [cancelConfirmId, setCancelConfirmId] = useState(null);

  const handleCancelLeave = async (id) => {
    setCancelConfirmId(id);
  };

  const confirmCancelLeave = async () => {
    const id = cancelConfirmId;
    setCancelConfirmId(null);
    try {
      setErrorMsg(null);
      await api.delete(`/employee/leave-request/${id}`);
      setSuccessMsg(t.leaveSuccessCancel);
      setTimeout(() => setSuccessMsg(null), 3000);
      await fetchData();
    } catch (error) {
      setErrorMsg(t.leaveErrCancel);
    }
  };

  if (isLoading) return <div className="text-center py-20 font-black text-slate-600 italic">{t.loading}</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 shadow-sm">
          <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
            <Calendar className="text-emerald-500" /> {t.leaveTitle}
          </h2>
          
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl font-bold flex justify-between items-center mb-4 text-xs">
              {errorMsg}
              <button onClick={() => setErrorMsg(null)}><X size={16} /></button>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl font-bold flex justify-between items-center mb-4 text-xs">
              {successMsg}
              <button onClick={() => setSuccessMsg(null)}><X size={16} /></button>
            </div>
          )}
          
          <form onSubmit={handleAddLeave} className="space-y-5">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">{t.leaveStartDate}</label>
              <input type="date" required value={newLeave.startDate} onChange={e => setNewLeave({...newLeave, startDate: e.target.value})} className="w-full mt-1 p-4 bg-slate-950/50 border border-slate-800 rounded-2xl font-bold outline-none focus:border-emerald-500 transition-all text-white [color-scheme:dark]" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">{t.leaveEndDate}</label>
              <input type="date" required value={newLeave.endDate} onChange={e => setNewLeave({...newLeave, endDate: e.target.value})} className="w-full mt-1 p-4 bg-slate-950/50 border border-slate-800 rounded-2xl font-bold outline-none focus:border-emerald-500 transition-all text-white [color-scheme:dark]" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">{t.leaveReason}</label>
              <textarea value={newLeave.reason} onChange={e => setNewLeave({...newLeave, reason: e.target.value})} rows={3} className="w-full mt-1 p-4 bg-slate-950/50 border border-slate-800 rounded-2xl font-bold outline-none focus:border-emerald-500 transition-all resize-none text-white" placeholder={t.leaveReasonPlaceholder} />
            </div>
            <button type="submit" className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-widest text-xs active:scale-95">
              {t.leaveSubmitBtn}
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <h3 className="font-black text-slate-500 tracking-[0.1em] uppercase text-xs ml-2">{t.leaveHistoryTitle}</h3>
        <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-6 shadow-sm min-h-[300px]">
          {leaveRequests.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-600 font-bold italic py-10">{t.leaveNoRequests}</div>
          ) : (
            <div className="space-y-3">
              {leaveRequests.map(req => (
                <div key={req.id} className="p-5 bg-slate-950/50 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:bg-slate-900/80 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black border border-emerald-500/20">
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <span className="block font-black text-white text-sm">{t.leaveFrom} {formatDate(req.startDate)}</span>
                      <span className="block font-black text-white text-sm">{t.leaveTo} {formatDate(req.endDate)}</span>
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
                      <button onClick={() => handleCancelLeave(req.id)} className="px-3 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs font-black hover:bg-red-500 hover:text-white transition-colors">{t.leaveCancelBtn}</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {cancelConfirmId && (
        <div className="fixed inset-0 bg-[#020617]/90 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 text-white">
          <div className="bg-slate-900 border border-orange-500/20 p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl relative text-center">
            <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="text-orange-500" size={32} />
            </div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2 text-orange-400">{t.leaveCancelConfirmTitle}</h2>
            <p className="text-slate-400 font-bold mb-8 text-sm">
              {t.leaveCancelConfirmDesc}
            </p>
            <div className="flex gap-4">
              <button onClick={() => setCancelConfirmId(null)} className="flex-1 bg-slate-800 text-white font-black py-4 rounded-xl hover:bg-slate-700 transition uppercase tracking-widest text-xs">{t.leaveCloseBtn}</button>
              <button onClick={confirmCancelLeave} className="flex-1 bg-orange-600 text-white font-black py-4 rounded-xl hover:bg-orange-500 transition shadow-lg shadow-orange-500/20 uppercase tracking-widest text-xs">{t.leaveConfirmCancelBtn}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
