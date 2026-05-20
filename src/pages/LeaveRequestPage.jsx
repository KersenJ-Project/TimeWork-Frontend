import { useState, useEffect } from 'react';
import { ClipboardList, Check, X, Loader2, ChevronDown } from 'lucide-react';
import api from '../api/axios';
import { useLanguage } from '../context/LanguageContext';
import { managerTranslations } from '../translations/manager';

export default function LeaveRequestPage() {
  const { lang } = useLanguage();
  const currentLang = lang ? lang.toLowerCase() : 'fr';
  const t = managerTranslations[currentLang] || managerTranslations['fr'];
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [expandedUsers, setExpandedUsers] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return t.leaveUnknownDate;
    try {
      const rawDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
      const parts = rawDate.split('-');
      if (parts.length !== 3) return dateStr;
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    } catch (e) {
      return t.leaveFormatInvalid;
    }
  };

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/leave-request');
      setRequests(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (id, action) => {
    try {
      setProcessingId(id);
      await api.patch(`/leave-request/${id}/${action}`);
      
      setRequests(prev => prev.map(req => {
        const reqId = req.id || req._id;
        if (reqId === id) {
          return { ...req, status: action === 'approve' ? 'APPROVED' : 'REJECTED' };
        }
        return req;
      }));
      setSuccessMsg(action === 'approve' ? t.leaveApproveSuccess : t.leaveRejectSuccess);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (error) {
      setErrorMsg(t.leaveUpdateError);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="w-full p-6 lg:p-10 space-y-8 text-white bg-[#020617] min-h-screen">
      <div className="flex justify-between items-center border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter">
            {t.leaveTitle} <span className="text-blue-600">{t.leaveTitleSpan}</span>
          </h1>
          <p className="text-slate-400 font-medium mt-1">{t.leaveSubtitle}</p>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl font-bold flex justify-between items-center text-sm">
          {errorMsg}
          <button onClick={() => setErrorMsg(null)}><X size={20} /></button>
        </div>
      )}
      
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl font-bold flex justify-between items-center text-sm">
          {successMsg}
          <button onClick={() => setSuccessMsg(null)}><X size={20} /></button>
        </div>
      )}

      <div className="bg-slate-900/50 border border-white/5 rounded-[2rem] overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center justify-center text-slate-500">
             <Loader2 className="animate-spin mb-2 text-blue-600" size={32} />
             {t.leaveLoading}
          </div>
        ) : requests.length === 0 ? (
          <div className="p-16 text-center font-bold text-slate-400 italic text-xl uppercase bg-slate-900/50 border-2 border-dashed border-white/5 rounded-[2.5rem] m-6">
            {t.leaveNoRequests}
          </div>
        ) : (
          <div className="p-6 bg-slate-950/50 space-y-4">
            {Object.values(requests.reduce((acc, req) => {
              const user = req.user || req.userId || {};
              const uid = user.id || user._id || 'unknown';
              if (!acc[uid]) {
                acc[uid] = { user: { ...user, id: uid }, requests: [] };
              }
              acc[uid].requests.push(req);
              return acc;
            }, {})).map(({ user, requests }) => {
              const name = user.firstName ? `${user.firstName} ${user.lastName}` : user.name || user.email || t.leaveUnknownEmp;
              const pendingCount = requests.filter(r => (r.status || 'PENDING').toUpperCase() === 'PENDING').length;
              const hasPending = pendingCount > 0;

              return (
                <div key={user.id} className={`bg-slate-900/80 border ${hasPending ? 'border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'border-white/5'} rounded-[2rem] shadow-sm overflow-hidden mb-4 transition-all group`}>
                  <div 
                    className="p-6 flex flex-col md:flex-row justify-between items-center cursor-pointer hover:bg-slate-800/80 transition-all"
                    onClick={() => setExpandedUsers(prev => ({...prev, [user.id]: !prev[user.id]}))}
                  >
                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className={`h-16 w-16 ${hasPending ? 'bg-orange-600/20 text-orange-400 border-orange-500/20' : 'bg-emerald-600/20 text-emerald-400 border-emerald-500/20'} border rounded-2xl flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform`}>
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-black text-lg text-white uppercase tracking-tight">{name}</h3>
                        <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
                          <ClipboardList size={14} className={hasPending ? "text-orange-400" : "text-emerald-400"} />
                          <span>{requests.length} {requests.length > 1 ? t.leaveRequestsPlural : t.leaveRequest}</span>
                          {hasPending && (
                            <span className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-md text-[10px] animate-pulse">
                              {pendingCount} {t.leaveToProcess}
                            </span>
                          )}
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
                        {requests.map(req => {
                          const currentId = req.id || req._id;
                          const status = (req.status || 'PENDING').toUpperCase();

                          return (
                            <div key={currentId} className="p-6 rounded-[1.5rem] border border-white/5 bg-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-inner hover:border-white/10 transition-all">
                              <div className="flex items-center gap-4">
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center border ${
                                  status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                  status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                }`}>
                                  <ClipboardList size={20} />
                                </div>
                                <div>
                                  <p className="text-md font-black text-white uppercase tracking-wider">
                                    {t.leaveFrom} {formatDate(req.startDate)} {t.leaveTo} {formatDate(req.endDate)}
                                  </p>
                                  
                                  {req.reason && (
                                    <div className="mt-2 p-3 bg-slate-950/50 rounded-xl border border-slate-800 italic">
                                      <span className="font-bold block text-[10px] not-italic uppercase tracking-wider text-slate-500 mb-1">{t.leaveReason}</span>
                                      <p className="text-sm text-slate-300">{req.reason}</p>
                                    </div>
                                  )}
                                  
                                  <span className={`inline-block mt-3 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                                    status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                    status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                  }`}>
                                    {status}
                                  </span>
                                </div>
                              </div>

                              {status === 'PENDING' && (
                                <div className="flex gap-3 w-full md:w-auto">
                                  <button 
                                    disabled={processingId === currentId}
                                    onClick={(e) => { e.stopPropagation(); handleStatusUpdate(currentId, 'approve'); }} 
                                    className="flex-1 md:flex-none px-6 py-3 bg-emerald-500/10 text-emerald-400 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-white transition disabled:opacity-50 border border-emerald-500/20 shadow-sm"
                                  >
                                    {processingId === currentId ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} className="stroke-[3]" />}
                                    {t.leaveApprove}
                                  </button>
                                  
                                  <button 
                                    disabled={processingId === currentId}
                                    onClick={(e) => { e.stopPropagation(); handleStatusUpdate(currentId, 'reject'); }} 
                                    className="flex-1 md:flex-none px-6 py-3 bg-red-500/10 text-red-400 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition disabled:opacity-50 border border-red-500/20 shadow-sm"
                                  >
                                    {processingId === currentId ? <Loader2 className="animate-spin" size={18} /> : <X size={18} className="stroke-[3]" />}
                                    {t.leaveReject}
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}