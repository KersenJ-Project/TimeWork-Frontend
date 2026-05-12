import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Mail, Wallet, Clock, TrendingUp, Info, Pencil,
  ShieldCheck, CalendarDays, ArrowUpRight, Sparkles, User
} from 'lucide-react';

export default function PersonalInformation({ userData, onEditClick }) {
  if (!userData) return null;

  const { firstName, lastName, email, role, hourlyRate, hoursWorked, createdAt } = userData;

  const initials     = [firstName?.[0], lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?';
  const estimatedPay = hourlyRate && hoursWorked ? (hourlyRate * hoursWorked).toFixed(2) : null;
  const memberSince  = createdAt
    ? new Date(createdAt).toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  const roleColors = {
    MANAGER:     { bg: 'bg-violet-500/15', border: 'border-violet-500/30', text: 'text-violet-300' },
    SUPER_ADMIN: { bg: 'bg-amber-500/15',  border: 'border-amber-500/30',  text: 'text-amber-300'  },
    EMPLOYEE:    { bg: 'bg-blue-500/15',   border: 'border-blue-500/30',   text: 'text-blue-300'   },
  };
  const rc = roleColors[role?.toUpperCase()] ?? roleColors.EMPLOYEE;

  return (
    <div className="space-y-6">

      {/* HERO CARD */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative rounded-3xl overflow-hidden border border-slate-800/80"
        style={{ background: 'linear-gradient(135deg, #0d1f3c 0%, #060f1e 60%, #0a0d1a 100%)' }}
      >
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />

        {/* Top accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

        <div className="relative p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center gap-7">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className="relative w-24 h-24 rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(37,99,235,0.25) 0%, rgba(99,102,241,0.25) 100%)',
                  border: '1px solid rgba(99,102,241,0.3)'
                }}
              >
                <span className="absolute inset-0 flex items-center justify-center text-3xl font-black text-blue-300 tracking-tight select-none">
                  {initials}
                </span>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              </div>
              {/* Online dot */}
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#060f1e] flex items-center justify-center">
                <span className="w-2 h-2 bg-emerald-300 rounded-full animate-ping absolute" />
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h3 className="text-3xl font-black text-white tracking-tight">
                  {firstName} <span className="text-slate-300">{lastName}</span>
                </h3>
                {role && (
                  <motion.span
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-widest ${rc.bg} ${rc.border} ${rc.text}`}
                  >
                    <ShieldCheck size={10} />
                    {role}
                  </motion.span>
                )}
              </div>

              <div className="flex flex-col gap-1.5 mt-3">
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="w-5 h-5 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <Mail size={11} className="text-blue-400" />
                  </div>
                  <span className="text-sm truncate">{email}</span>
                </div>
                {memberSince && (
                  <div className="flex items-center gap-2 text-slate-500">
                    <div className="w-5 h-5 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <CalendarDays size={11} className="text-slate-500" />
                    </div>
                    <span className="text-xs">Membre depuis {memberSince}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Edit button */}
            <button
              onClick={onEditClick}
              className="flex-shrink-0 group flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                boxShadow: '0 0 30px rgba(37,99,235,0.35)'
              }}
            >
              <Pencil size={14} className="group-hover:rotate-12 transition-transform duration-300" />
              Modifier
            </button>
          </div>

          {/* Stats row */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Statut',         value: 'Actif',                                          accent: 'text-emerald-400', sub: '● En ligne'        },
              { label: 'Taux horaire',   value: hourlyRate   ? `${Number(hourlyRate).toFixed(2)} $` : '—', accent: 'text-blue-400',    sub: 'par heure'        },
              { label: 'Heures',         value: hoursWorked  ? `${hoursWorked} h`                  : '—', accent: 'text-indigo-400',  sub: 'cette période'    },
              { label: 'Prochaine paie', value: estimatedPay ? `${estimatedPay} $`                 : '—', accent: 'text-amber-400',   sub: 'estimation brute' },
            ].map(({ label, value, accent, sub }) => (
              <div
                key={label}
                className="relative p-4 rounded-2xl border border-slate-700/40 overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">{label}</p>
                <p className={`text-lg font-black tracking-tight ${accent}`}>{value}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Coordonnées */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-xl"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <User size={14} className="text-blue-400" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Coordonnées</span>
          </div>

          <div className="space-y-2.5">
            {[
              { label: 'Prénom', value: firstName },
              { label: 'Nom',    value: lastName  },
              { label: 'Email',  value: email     },
              { label: 'Rôle',   value: role      },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between px-4 py-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/30 hover:border-slate-600/50 transition-colors"
              >
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
                <span className="text-sm text-white font-bold truncate max-w-[55%] text-right">
                  {value || <span className="text-slate-600 font-normal italic text-xs">Non renseigné</span>}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Rémunération */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.4 }}
          className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Wallet size={14} className="text-emerald-400" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Rémunération</span>
            </div>
            <span className="text-[10px] font-bold bg-slate-800/80 text-slate-500 px-2.5 py-1 rounded-lg uppercase tracking-wide border border-slate-700/60">
              Période active
            </span>
          </div>

          <div className="space-y-2.5">
            {hourlyRate != null && (
              <div className="flex items-center justify-between px-4 py-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/30">
                <div className="flex items-center gap-2">
                  <Clock size={13} className="text-slate-500" />
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Taux horaire</span>
                </div>
                <span className="text-sm font-black text-blue-400">{Number(hourlyRate).toFixed(2)} $ / h</span>
              </div>
            )}

            {hoursWorked != null && (
              <div className="flex items-center justify-between px-4 py-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/30">
                <div className="flex items-center gap-2">
                  <Clock size={13} className="text-slate-500" />
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Heures travaillées</span>
                </div>
                <span className="text-sm font-black text-white">{hoursWorked} h</span>
              </div>
            )}

            {estimatedPay && (
              <div
                className="relative mt-2 px-5 py-5 rounded-2xl overflow-hidden border border-emerald-500/20"
                style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(5,150,105,0.05) 100%)' }}
              >
                <TrendingUp size={80} className="absolute right-2 top-1 text-emerald-500/5 pointer-events-none" />
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                      <Sparkles size={10} /> Prochaine paie (est.)
                    </p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-white tracking-tight">{estimatedPay} $</span>
                      <span className="text-xs text-slate-500 font-medium">brut</span>
                    </div>
                  </div>
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <ArrowUpRight size={16} className="text-emerald-400" />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-emerald-500/10 flex items-center justify-between">
                  <span className="text-[11px] text-slate-600">Basé sur {hoursWorked}h travaillées</span>
                  <Info size={13} className="text-slate-600 hover:text-slate-400 transition-colors cursor-help" />
                </div>
              </div>
            )}

            {!hourlyRate && !hoursWorked && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-3">
                  <Wallet size={20} className="text-slate-600" />
                </div>
                <p className="text-sm text-slate-600 font-medium">Aucune donnée de rémunération</p>
                <p className="text-xs text-slate-700 mt-1">Contactez votre manager</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* FOOTER */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between pt-4 border-t border-slate-800/60"
      >
        <p className="text-[11px] text-slate-600 uppercase tracking-wide">
          {memberSince ? `Membre depuis ${memberSince}` : 'Données à jour'}
        </p>
        <Link
          to="/contact"
          className="text-[11px] font-bold text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-wide flex items-center gap-1"
        >
          Signaler une erreur <ArrowUpRight size={10} />
        </Link>
      </motion.div>

    </div>
  );
}