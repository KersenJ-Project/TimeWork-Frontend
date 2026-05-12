import { useState, useEffect } from 'react';
import { ClipboardList, Check, X, Loader2 } from 'lucide-react';
import api from '../api/axios';

export default function LeaveRequestPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

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
    } catch (error) {
      alert("Erreur lors de la mise à jour");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="w-full p-6 lg:p-10 space-y-8 text-[#0B1023] bg-[#F4F6FB] min-h-screen">
      <div className="flex justify-between items-center border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter">
            Gestion des <span className="text-blue-600">Congés</span>
          </h1>
          <p className="text-gray-500 font-medium mt-1">Approuvez ou refusez les demandes de vacances de l'équipe.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-[2rem] overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center justify-center text-gray-500">
             <Loader2 className="animate-spin mb-2 text-blue-600" size={32} />
             Chargement...
          </div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center text-gray-400 font-bold italic">
            Aucune demande de congé.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-8 bg-gray-50/50">
            {requests.map(req => {
              const currentId = req.id || req._id;
              const status = (req.status || 'PENDING').toUpperCase();

              return (
                <div key={currentId} className="p-6 rounded-[2rem] border border-gray-100 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${
                      status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 
                      status === 'REJECTED' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      <ClipboardList size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-[#0B1023]">
                        {req.userId?.name || req.user?.name || req.user?.email || 'Employé inconnu'}
                      </h3>
                      <p className="text-sm font-bold text-gray-400 mt-1">
                        Du {formatDate(req.startDate)} au {formatDate(req.endDate)}
                      </p>
                      
                      {req.reason && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-100 italic">
                          <span className="font-bold block text-[10px] not-italic uppercase tracking-wider text-gray-400 mb-1">Raison :</span>
                          <p className="text-sm text-gray-600">{req.reason}</p>
                        </div>
                      )}
                      
                      <span className={`inline-block mt-3 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' : 
                        status === 'REJECTED' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {status}
                      </span>
                    </div>
                  </div>

                  {status === 'PENDING' && (
                    <div className="flex gap-3 w-full md:w-auto">
                      <button 
                        disabled={processingId === currentId}
                        onClick={() => handleStatusUpdate(currentId, 'approve')} 
                        className="flex-1 md:flex-none px-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-white transition disabled:opacity-50 border border-emerald-100"
                      >
                        {processingId === currentId ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} className="stroke-[3]" />}
                        Approuver
                      </button>
                      
                      <button 
                        disabled={processingId === currentId}
                        onClick={() => handleStatusUpdate(currentId, 'reject')} 
                        className="flex-1 md:flex-none px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition disabled:opacity-50 border border-red-100"
                      >
                        {processingId === currentId ? <Loader2 className="animate-spin" size={18} /> : <X size={18} className="stroke-[3]" />}
                        Refuser
                      </button>
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