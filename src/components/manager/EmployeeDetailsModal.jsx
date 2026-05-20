import React from 'react';
import { X, Briefcase, Clock, Calendar, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { managerTranslations } from '../../translations/manager';

export default function EmployeeDetailsModal({ detailsUser, setDetailsUser, isDetailsLoading, userShifts, userAvails, formatDate, formatTime }) {
  const { lang } = useLanguage();
  const currentLang = lang ? lang.toLowerCase() : 'fr';
  const t = managerTranslations[currentLang] || managerTranslations['fr'];
  if (!detailsUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/90 backdrop-blur-md p-4 text-white overflow-y-auto py-20">
      <div className="bg-slate-900 border border-white/10 rounded-[3rem] w-full max-w-4xl shadow-2xl relative">
        <button onClick={() => setDetailsUser(null)} className="absolute top-8 right-8 text-slate-400 hover:text-white transition bg-slate-800 p-3 rounded-full hover:bg-slate-700">
          <X size={24} />
        </button>
        
        <div className="p-10 border-b border-white/5 flex gap-8 items-center bg-slate-950/30 rounded-t-[3rem]">
          <div className="h-24 w-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-4xl font-black text-white shadow-lg shadow-blue-500/20">
            {detailsUser.firstName?.charAt(0)}
          </div>
          <div>
            <h2 className="text-4xl font-black italic tracking-tighter uppercase">{detailsUser.firstName} {detailsUser.lastName}</h2>
            <div className="flex gap-4 mt-3">
              <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest">{detailsUser.role}</span>
              <span className="bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest">{detailsUser.email}</span>
              <span className="bg-slate-800 text-emerald-400 border border-slate-700 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest">{detailsUser.hourlyRate ? `${detailsUser.hourlyRate}$/h` : t.empDetSalaryNC}</span>
            </div>
          </div>
        </div>

        <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* SHIFTS */}
          <div>
            <h3 className="font-black text-slate-400 uppercase tracking-widest text-sm flex items-center gap-3 mb-6">
              <Briefcase size={18} className="text-blue-500" /> {t.empDetShiftsAssigned} ({userShifts.length})
            </h3>
            {isDetailsLoading ? (
              <p className="text-slate-500 italic font-bold">{t.empDetLoading}</p>
            ) : userShifts.length === 0 ? (
              <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5 text-center text-slate-500 font-bold italic text-sm">
                {t.empDetNoShifts}
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {userShifts.sort((a, b) => new Date(a.date || a.startTime) - new Date(b.date || b.startTime)).map(shift => (
                  <div key={shift.id} className="bg-slate-950/80 p-4 rounded-2xl border border-white/5 flex justify-between items-center hover:bg-slate-800 transition">
                    <div>
                      <p className="font-black text-white uppercase text-sm">{formatDate(shift.date)}</p>
                      <p className="text-[9px] font-black text-slate-500 tracking-widest uppercase mt-1">{shift.schedule?.name || t.empDetUnknownCycle}</p>
                    </div>
                    <div className="flex gap-2 items-center bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
                      <Clock size={12} className="text-indigo-400" />
                      <span className="text-xs font-black text-indigo-300">{formatTime(shift.startTime)}</span>
                      <ArrowRight size={10} className="text-slate-600" />
                      <span className="text-xs font-black text-indigo-300">{formatTime(shift.endTime)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DISPOS */}
          <div>
            <h3 className="font-black text-slate-400 uppercase tracking-widest text-sm flex items-center gap-3 mb-6">
              <Calendar size={18} className="text-emerald-500" /> {t.empDetAvailWeek}
            </h3>
            {isDetailsLoading ? (
              <p className="text-slate-500 italic font-bold">{t.empDetLoading}</p>
            ) : userAvails.length === 0 ? (
              <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5 text-center text-slate-500 font-bold italic text-sm">
                {t.empDetNoAvail}
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {userAvails.map(avail => (
                  <div key={avail.id} className={`p-4 rounded-2xl border flex justify-between items-center transition ${avail.isAvailable ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                    <div>
                      <p className={`font-black uppercase text-sm ${avail.isAvailable ? 'text-emerald-400' : 'text-red-400'}`}>
                        {avail.dayOfWeek}
                      </p>
                      <p className="text-[9px] font-black text-slate-500 tracking-widest uppercase mt-1">
                        {avail.isAvailable ? t.empDetAvail : t.empDetUnavail}
                      </p>
                    </div>
                    {avail.isAvailable && (
                      <div className="flex gap-2 items-center bg-slate-950/50 px-3 py-2 rounded-xl border border-white/5">
                        <Clock size={12} className="text-emerald-500" />
                        <span className="text-xs font-black text-emerald-300">{formatTime(avail.startTime)}</span>
                        <ArrowRight size={10} className="text-slate-600" />
                        <span className="text-xs font-black text-emerald-300">{formatTime(avail.endTime)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
