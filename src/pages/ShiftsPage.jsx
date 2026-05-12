import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Clock, User, Calendar, X, ChevronRight } from 'lucide-react';
import api from '../api/axios';

export default function ShiftsPage() {
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newShift, setNewShift] = useState({
    userId: '',
    date: '',
    startTime: '09:00',
    endTime: '17:00',
    note: ''
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [shiftsRes, employeesRes] = await Promise.all([
        api.get('/shift'),
        api.get('/managers/users')
      ]);

      setShifts(shiftsRes.data);
      setEmployees(employeesRes.data.filter(u => u.status === 'APPROVED'));
    } catch (error) {
      console.error("Erreur chargement shifts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateShift = async (e) => {
    e.preventDefault();
    if (!newShift.userId) return alert("Sélectionnez un employé");

    try {
      await api.post(`/shift/users/${newShift.userId}`, {
        startTime: `${newShift.date}T${newShift.startTime}:00Z`,
        endTime: `${newShift.date}T${newShift.endTime}:00Z`,
        note: newShift.note
      });
      
      setIsModalOpen(false);
      setNewShift({ userId: '', date: '', startTime: '09:00', endTime: '17:00', note: '' });
      fetchData();
    } catch (error) {
      alert("Erreur lors de la création du shift");
    }
  };

  const handleDeleteShift = async (id) => {
    if (window.confirm("Supprimer ce shift ?")) {
      try {
        await api.delete(`/shift/${id}`);
        fetchData();
      } catch (error) {
        alert("Erreur suppression");
      }
    }
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  };

  return (
    <div className="w-full p-6 lg:p-10 space-y-8 bg-[#F4F6FB] min-h-screen text-[#0B1023]">
      <div className="flex justify-between items-center border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">Gestion des <span className="text-blue-600">Shifts</span></h1>
          <p className="text-gray-500 font-medium mt-1 italic">Assignez des heures de travail à vos employés.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-blue-700 shadow-xl transition-all active:scale-95"
        >
          <Plus size={24} /> <span>NOUVEAU SHIFT</span>
        </button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="p-20 text-center font-black text-gray-300 italic animate-pulse">Chargement des shifts...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {shifts.map(shift => (
              <div key={shift.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center group hover:shadow-md transition-all">
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xl">
                    {shift.user?.firstName?.charAt(0) || <User size={24} />}
                  </div>
                  <div>
                    <h3 className="font-black text-lg uppercase tracking-tight">{shift.user?.firstName} {shift.user?.lastName}</h3>
                    <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
                      <Calendar size={14} className="text-blue-400" />
                      <span>{formatDate(shift.startTime)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 my-4 md:my-0 bg-gray-50 px-8 py-3 rounded-2xl border border-gray-100">
                  <div className="text-center">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Début</p>
                    <p className="font-black text-lg">{formatTime(shift.startTime)}</p>
                  </div>
                  <ChevronRight className="text-gray-300" />
                  <div className="text-center">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Fin</p>
                    <p className="font-black text-lg">{formatTime(shift.endTime)}</p>
                  </div>
                </div>

                <button 
                  onClick={() => handleDeleteShift(shift.id)}
                  className="p-4 text-red-400 hover:bg-red-50 rounded-2xl transition opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE CRÉATION */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#0B1023]/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[3rem] p-10 max-w-lg w-full shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-black transition"><X size={28} /></button>
            <h2 className="text-3xl font-black italic tracking-tighter mb-8 uppercase text-black">Assigner un <span className="text-blue-600">Shift</span></h2>
            
            <form onSubmit={handleCreateShift} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Employé</label>
                <select 
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 font-bold text-black outline-none focus:border-blue-500"
                  value={newShift.userId}
                  onChange={e => setNewShift({...newShift, userId: e.target.value})}
                >
                  <option value="">Sélectionner un employé...</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Date du shift</label>
                <input 
                  required
                  type="date" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 font-bold text-black"
                  value={newShift.date}
                  onChange={e => setNewShift({...newShift, date: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Heure Début</label>
                  <input 
                    required
                    type="time" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 font-bold text-black"
                    value={newShift.startTime}
                    onChange={e => setNewShift({...newShift, startTime: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Heure Fin</label>
                  <input 
                    required
                    type="time" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 font-bold text-black"
                    value={newShift.endTime}
                    onChange={e => setNewShift({...newShift, endTime: e.target.value})}
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-[#0B1023] text-white rounded-[1.5rem] py-5 font-black hover:bg-blue-600 transition shadow-2xl uppercase tracking-widest text-sm mt-4">
                Confirmer l'assignation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}