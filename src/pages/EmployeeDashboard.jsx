import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, Calendar, List } from 'lucide-react';
import CheckInTab from '../components/employee/CheckInTab';
import AvailabilityTab from '../components/employee/AvailabilityTab';
import LeaveTab from '../components/employee/LeaveTab';

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
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'POINTAGE' && <CheckInTab />}
          {activeTab === 'DISPO' && <AvailabilityTab />}
          {activeTab === 'CONGES' && <LeaveTab />}
        </div>
      </div>
    </div>
  );
}