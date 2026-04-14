import React, { useState } from 'react';
import { User, Calendar, ShieldCheck, Menu, X, ChevronRight, Bell, UserCheck } from 'lucide-react';
import AvailabilityForm from '../components/AvailabilityForm';
import UpdateEmployeeRoleForm from '../components/UpdateEmployeeRoleForm';
import PersonalInformation from '../components/PersonalInformation';
import PendingApprovals from '../components/PendingApprovals';

export default function Profil() {
  const [activeTab, setActiveTab] = useState('info');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'info', label: 'Informations personnelles', icon: User, description: 'Gérez vos données.' },
    { id: 'dispo', label: 'Disponibilités', icon: Calendar, description: 'Mettez à jour vos horaires de travail.' },
    { id: 'roles', label: 'Rôles & Rémunérations', icon: ShieldCheck, description: 'Changement des roles.' },
    { id: 'approvals', label: 'Approbations', icon: UserCheck, description: 'Approuvez les nouvelles inscriptions.' },
  ];

    const contentMap = {
        info: <PersonalInformation />,
        dispo: <AvailabilityForm />,
        roles: <UpdateEmployeeRoleForm />,
        approvals: <PendingApprovals />,
    };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-[calc(100vh-73px)] bg-[#F8FAFC]">
      
      <div className="md:hidden p-4 bg-white border-b flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <User size={18} className="text-white" />
          </div>
          <span className="font-bold text-gray-900">Espace Profil</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <aside className={`
        ${isMobileMenuOpen ? 'fixed inset-0 top-[65px] z-30 bg-white' : 'hidden'} 
        md:block w-full md:w-80 bg-white border-r border-gray-200 transition-all duration-300
      `}>
        <div className="p-6 h-full flex flex-col">
          <div className="hidden md:block mb-8">
            <h1 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Paramètres</h1>
          </div>
          
          <nav className="space-y-1 flex-1">
            {menuItems.map((item) => {
              const isActive = (activeTab === item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-100'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon size={20} className={`${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-sm">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={16} className="ml-auto" />}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 tracking-tight font-medium uppercase">Version 2.0.0 — TimeWork</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 md:p-12">
          
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest">Tableau de bord</span>
                <span className="h-px w-8 bg-blue-200"></span>
              </div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                {menuItems.find(i => i.id === activeTab)?.label}
              </h2>
              <p className="text-gray-500 mt-1">
                {menuItems.find(i => i.id === activeTab)?.description}
              </p>
            </div>
            
            <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
              <Bell size={16} />
              <span>Notifications</span>
            </button>
          </div>

          <div className="relative">
            {contentMap[activeTab]}
          </div>

        </div>
      </main>
    </div>
  );
}