import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, Calendar, List, BarChart3 } from 'lucide-react';
import EmployeeOverviewTab from '../components/employee/EmployeeOverviewTab';
import CheckInTab from '../components/employee/CheckInTab';
import MyShiftsTab from '../components/employee/MyShiftsTab';
import AvailabilityTab from '../components/employee/AvailabilityTab';
import LeaveTab from '../components/employee/LeaveTab';

export default function EmployeeDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') || 'OVERVIEW';
  
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab') || 'OVERVIEW';
    if (tab !== activeTab) setActiveTab(tab);
  }, [location.search]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`?tab=${tab}`);
  };

  return (
    <div className="w-full p-6 lg:p-10 space-y-8 text-white min-h-[calc(100vh-4rem)]">
      {/* En-tête de la page */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-slate-800 pb-6 gap-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter">Mon <span className="text-blue-500">Espace</span></h1>
          <p className="text-slate-400 font-medium mt-1">Gérez vos disponibilités, vos congés et votre pointage.</p>
        </div>
      </div>

      {/* Conteneur dynamique qui affiche le composant correspondant à l'onglet actif */}
      <div className="min-h-[50vh]">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'OVERVIEW' && <EmployeeOverviewTab />}
          {activeTab === 'POINTAGE' && <CheckInTab />}
          {activeTab === 'SHIFTS' && <MyShiftsTab />}
          {activeTab === 'DISPO' && <AvailabilityTab />}
          {activeTab === 'CONGES' && <LeaveTab />}
        </div>
      </div>
    </div>
  );
}