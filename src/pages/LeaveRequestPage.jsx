import { useState, useEffect } from 'react';
import { ClipboardList, Check, X } from 'lucide-react';
import api from '../api/axios';

export default function LeaveRequestPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      console.error("Erreur API :", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.patch(`/leave-request/${id}/approve`);
      fetchRequests();
    } catch (error) {
      alert("Erreur lors de l'approbation.");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`/leave-request/${id}/reject`);
      fetchRequests();
    } catch (error) {
      alert("Erreur lors du refus.");
    }
  };

  return (
    <div className="w-full p-6 lg:p-10 space-y-8 text-[#0B1023] bg-[#F4F6FB] min-h-screen">
      <div className="flex justify-between items-center border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter">Gestion des <span className="text-blue-600">Congés</span></h1>
          <p className="text-gray-500 font-medium mt-1">Approuvez ou refusez les demandes de vacances de l'équipe.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-[2rem] overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 font-medium">Chargement des données...</div>
        ) : requests.length === 0 ? (
          <div className="p-8 text-center text-gray-400 font-bold">Aucune demande de congé.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-8 bg-gray-50/50">
            {requests.map(req => (
              <div key={req.id} className="p-6 rounded-[2rem] border border-gray-100 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                    <ClipboardList size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-[#0B1023]">{req.userId?.name || 'Employé'}</h3>
                    <p className="text-sm font-bold text-gray-400 mt-1">Du {formatDate(req.startDate)} au {formatDate(req.endDate)}</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' : 
                      req.status === 'REJECTED' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {req.status || 'PENDING'}
                    </span>
                  </div>
                </div>
                
                {req.status === 'PENDING' && (
                  <div className="flex gap-3">
                    <button onClick={() => handleApprove(req.id)} className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-500 hover:text-white transition shadow-sm border border-emerald-100">
                      <Check size={18} className="stroke-[3]" /> Approuver
                    </button>
                    <button onClick={() => handleReject(req.id)} className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold flex items-center gap-2 hover:bg-red-500 hover:text-white transition shadow-sm border border-red-100">
                      <X size={18} className="stroke-[3]" /> Refuser
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}