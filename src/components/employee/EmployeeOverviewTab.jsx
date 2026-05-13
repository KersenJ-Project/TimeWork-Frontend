import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import api from '../../api/axios';
import { getUserId } from '../../api/userId';
import { MiniStat } from '../manager/DashboardWidgets';

export default function EmployeeOverviewTab() {
  const [shifts, setShifts] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [isWorking, setIsWorking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      setIsLoading(true);
      const userId = getUserId();
      try {
        const statusRes = await api.get('/employee/check-status');
        setIsWorking(Boolean(statusRes.data?.isWorking));

        if (userId) {
          const shiftRes = await api.get(`/shift/users/${userId}`);
          const sorted = (shiftRes.data || []).sort((a, b) => new Date(a.date) - new Date(b.date));
          setShifts(sorted);

          const leaveRes = await api.get('/employee/leave-request');
          setLeaves(leaveRes.data || []);
        }
      } catch (err) {
        console.error('Overview error:', err);
      }
      setIsLoading(false);
    };
    fetchOverview();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingShifts = shifts.filter(s => s.date && s.date.split(/[T ]/)[0] >= todayStr);
  const nextShift = upcomingShifts[0];

  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';
    if (/^([01]\d|2[0-3]):([0-5]\d)/.test(timeStr)) return timeStr.substring(0, 5).replace(':', 'h');
    return timeStr;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const raw = dateStr.split(/[T ]/)[0];
    const [y, m, d] = raw.split('-');
    if (!y || !m || !d) return raw;
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC'
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {isLoading ? (
        <div className="text-center py-20 font-black text-slate-600 italic">Chargement...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MiniStat label="Prochains Shifts" value={upcomingShifts.length} bg="bg-indigo-500/10" iconColor="text-indigo-400" />
            <MiniStat label="Statut" value={isWorking ? 'EN LIGNE' : 'HORS LIGNE'} bg={isWorking ? 'bg-emerald-500/10' : 'bg-slate-800'} iconColor={isWorking ? 'text-emerald-400' : 'text-slate-400'} />
            <MiniStat label="Congés" value={leaves.length} bg="bg-blue-500/10" iconColor="text-blue-400" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="text-indigo-500" size={24} />
                <h3 className="font-black text-white text-xl italic uppercase tracking-tighter">Votre Prochain Shift</h3>
              </div>
              {nextShift ? (
                <div className="bg-indigo-950/30 border border-indigo-500/20 p-6 rounded-[2rem] flex flex-col gap-4">
                  <p className="text-lg font-black text-white capitalize">{formatDate(nextShift.date)}</p>
                  <div className="flex gap-2 items-center bg-indigo-900/40 px-5 py-4 rounded-2xl border border-indigo-500/20 w-fit">
                    <Clock size={16} className="text-indigo-400" />
                    <span className="text-base font-black text-indigo-200">{formatTime(nextShift.startTime)}</span>
                    <ArrowRight size={14} className="text-slate-500" />
                    <span className="text-base font-black text-indigo-200">{formatTime(nextShift.endTime)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 italic font-bold">Aucun shift à venir.</p>
              )}
            </div>

            <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="text-emerald-500" size={24} />
                <h3 className="font-black text-white text-xl italic uppercase tracking-tighter">Votre Statut Actuel</h3>
              </div>
              <div className="flex items-center gap-6 p-6 bg-slate-950/50 rounded-[2rem] border border-white/5">
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center border ${isWorking ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                  <Clock size={32} />
                </div>
                <div>
                  <p className={`font-black text-2xl uppercase tracking-tighter ${isWorking ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {isWorking ? 'En Poste' : 'Hors Ligne'}
                  </p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                    {isWorking ? 'Vous êtes actuellement pointé.' : "Vous n'êtes pas au travail."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
