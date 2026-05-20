import React from 'react';
import { Clock, Check, X, Calendar, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { managerTranslations } from '../../translations/manager';

export function MiniStat({ label, value, bg, iconColor }) {
  return (
    <div className="bg-slate-900/50 rounded-[2rem] border border-white/5 p-8 flex flex-col items-start gap-4 shadow-sm hover:bg-slate-800/80 transition-colors">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ` + bg}>
        <Clock className={iconColor} size={20} />
      </div>
      <div>
        <p className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase mb-1">{label}</p>
        <p className="text-4xl font-black text-white tracking-tighter">{value}</p>
      </div>
    </div>
  );
}

export function ApprovalItem({ user, onApprove, onReject }) {
  const { lang } = useLanguage();
  const currentLang = lang ? lang.toLowerCase() : 'fr';
  const t = managerTranslations[currentLang] || managerTranslations['fr'];
  const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || t.widgetUnknownUser;

  return (
    <div className="flex items-center justify-between p-6 border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition-all">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-lg font-black text-blue-400 border border-blue-500/20">
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-base font-bold text-white">{name}</p>
          <p className="text-xs font-bold text-slate-400">{user.email}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onApprove} className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm border border-emerald-500/20">
          <Check size={20} className="stroke-[3]" />
        </button>
        <button onClick={onReject} className="h-10 w-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-500/20">
          <X size={20} className="stroke-[3]" />
        </button>
      </div>
    </div>
  );
}

export function ShiftItem({ shift }) {
  const { lang } = useLanguage();
  const currentLang = lang ? lang.toLowerCase() : 'fr';
  const t = managerTranslations[currentLang] || managerTranslations['fr'];
  const name = `${shift.user?.firstName || ''} ${shift.user?.lastName || ''}`.trim() || t.widgetUnknownUser;
  
  const formatDate = (dateStr) => {
    if (!dateStr) return t.widgetUnknownDate;
    const rawDate = dateStr.split(/[T ]/)[0];
    const parts = rawDate.split(/[-/]/);
    if (parts.length === 3) {
      const year = parts[0].length === 4 ? parts[0] : parts[2];
      const month = parts[0].length === 4 ? parts[1] : parts[1];
      const day = parts[0].length === 4 ? parts[2] : parts[0];
      return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', timeZone: 'UTC' });
    }
    return rawDate;
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "--h--";
    if (/^([01]\d|2[0-3]):([0-5]\d)/.test(timeStr)) {
      return timeStr.substring(0, 5).replace(':', 'h');
    }
    return timeStr;
  };

  const dateStr = formatDate(shift.date);
  const startStr = formatTime(shift.startTime);
  const endStr = formatTime(shift.endTime);

  return (
    <div className="flex items-center justify-between p-6 border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition-all">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-lg font-black text-purple-400 border border-purple-500/20">
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-base font-bold text-white">{name}</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1">
            <Calendar size={12} className="text-purple-400" />
            {dateStr}
          </p>
        </div>
      </div>
      <div className="bg-slate-950/50 px-4 py-2 rounded-xl border border-slate-800 text-center">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.widgetHours}</p>
          <div className="font-black text-xs text-purple-300 flex items-center gap-2">
            <span>{startStr}</span>
            <ArrowRight size={10} className="text-slate-600" />
            <span>{endStr}</span>
          </div>
      </div>
    </div>
  );
}

export function LiveUser({ name, time }) {
  return (
    <div className="flex items-center justify-between bg-slate-950/50 rounded-2xl p-4 border border-slate-800">
      <div className="flex items-center gap-3">
        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-sm font-bold text-white">{name}</span>
      </div>
      <span className="text-[10px] font-black tracking-widest uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">{time}</span>
    </div>
  );
}
