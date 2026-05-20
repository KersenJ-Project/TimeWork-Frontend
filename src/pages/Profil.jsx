import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Calendar, ShieldCheck, Menu, X,
  ChevronRight, Bell, UserCheck, Check, Loader2,
  Zap, LogOut
} from 'lucide-react';

import AvailabilityForm       from '../components/AvailabilityForm';
import UpdateEmployeeRoleForm from '../components/UpdateEmployeeRoleForm';
import PendingApprovals       from '../components/PendingApprovals';
import PersonalInformation    from '../components/PersonalInformation';
import { useLanguage } from '../context/LanguageContext';
import { profilTranslations } from '../translations/profil';


const MANAGER_ROLES  = ['manager', 'assistant_manager'];
const EMPLOYEE_ROLES = ['employee', 'new_hire', 'trainee'];

const isManager  = (role) => MANAGER_ROLES.includes(role?.toLowerCase());
const isEmployee = (role) => EMPLOYEE_ROLES.includes(role?.toLowerCase());


function EditMode({ userData, onClose, onSaved }) {
  const [form, setForm]       = useState({ firstName: userData?.firstName ?? '', lastName: userData?.lastName ?? '' });
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr]         = useState(null);
  const overlayRef            = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSubmit = async () => {
    setErr(null);
    setSaving(true);
    try {
      const userId  = localStorage.getItem('userId');
      const token   = localStorage.getItem('token');
      const payload = {};
      if (form.firstName.trim()) payload.firstName = form.firstName.trim();
      if (form.lastName.trim())  payload.lastName  = form.lastName.trim();

      const { data } = await axios.patch(
        `http://localhost:3000/users/${userId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setTimeout(() => { onSaved(data); onClose(); }, 900);
    } catch (e) {
      setErr(e.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-md bg-[#0a1628] border border-slate-700/50 rounded-3xl shadow-[0_0_80px_rgba(37,99,235,0.15)] overflow-hidden"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

          <div className="flex items-center justify-between px-7 pt-7 pb-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-blue-400 mb-1">Profil</p>
              <h3 className="text-xl font-black text-white tracking-tight">Modifier mes informations</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800/60 transition-all"
            >
              <X size={18} />
            </button>
          </div>

          <div className="h-px bg-slate-800/60 mx-7" />

          <div className="px-7 py-6 space-y-5">
            {[
              { key: 'firstName', label: 'Prénom',         placeholder: userData?.firstName || 'Votre prénom' },
              { key: 'lastName',  label: 'Nom de famille', placeholder: userData?.lastName  || 'Votre nom'    },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  {label}
                </label>
                <input
                  type="text"
                  maxLength={100}
                  value={form[key]}
                  onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-slate-900/60 border border-slate-700/60 text-white placeholder-slate-600 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/15 transition-all"
                />
              </div>
            ))}
            <p className="text-[11px] text-slate-600 leading-relaxed">
              D'autres champs modifiables seront ajoutés prochainement.
            </p>
            {err && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl px-4 py-3">
                {err}
              </div>
            )}
          </div>

          <div className="px-7 pb-7 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl border border-slate-700/60 text-slate-400 text-sm font-semibold hover:bg-slate-800/50 hover:text-white transition-all"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving || success}
              className={`flex-1 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all
                ${success
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                  : 'bg-blue-600 text-white hover:scale-[1.02] shadow-[0_0_30px_rgba(37,99,235,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100'
                }`}
            >
              {saving  && <Loader2 size={15} className="animate-spin" />}
              {success && <Check   size={15} />}
              {success ? 'Sauvegardé !' : saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function NavItem({ item, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`group w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 text-left border ${
        isActive
          ? 'bg-blue-600/15 text-blue-400 border-blue-500/20'
          : 'text-slate-500 border-transparent hover:bg-slate-800/40 hover:text-slate-200'
      }`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
        isActive ? 'bg-blue-600/20' : 'bg-slate-800/60 group-hover:bg-slate-700/60'
      }`}>
        <item.icon size={16} className={isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'} />
      </div>
      <span className="font-semibold text-sm flex-1 truncate">{item.label}</span>
      {isActive && <ChevronRight size={14} className="text-blue-400 flex-shrink-0" />}
    </button>
  );
}

function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-4">
        <ShieldCheck size={24} className="text-slate-600" />
      </div>
      <p className="text-slate-400 font-bold">Accès refusé</p>
      <p className="text-slate-600 text-sm mt-1">
        Vous n'avez pas les droits nécessaires pour accéder à cette section.
      </p>
    </div>
  );
}


export default function Profil() {
  const { lang } = useLanguage();
  const currentLang = lang ? lang.toLowerCase() : 'fr';
  const t = profilTranslations[currentLang] || profilTranslations['fr'];
  const [activeTab,        setActiveTab]     = useState('info');
  const [isMobileMenuOpen, setMobileMenu]    = useState(false);
  const [userData,         setUserData]      = useState(null);
  const [loading,          setLoading]       = useState(true);
  const [error,            setError]         = useState(null);
  const [showEditMode,    setShowEditMode] = useState(false);

  /* Fetch user */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        const token  = localStorage.getItem('token');
        if (!userId || !token) throw new Error('Session expirée. Veuillez vous reconnecter.');
        const { data } = await axios.get(`http://localhost:3000/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors du chargement du profil.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/signin';
  };

  const userRole   = (userData?.role ?? localStorage.getItem('userRole') ?? '').toLowerCase();
  const userIsManager  = isManager(userRole);
  const userIsEmployee = isEmployee(userRole);

  /* Menu items selon le rôle */
  const menuItems = [
    {
      id: 'info',
      label: t.infoLabel,
      icon: User,
      description: t.infoDesc,
    },
    // Disponibilités, employés seulement
    ...(userIsEmployee ? [{
      id: 'dispo',
      label: t.dispoLabel,
      icon: Calendar,
      description: t.dispoDesc,
    }] : []),
    // Rôles & Approbations, managers seulement
    ...(userIsManager ? [
      {
        id: 'roles',
        label: t.rolesLabel,
        icon: ShieldCheck,
        description: t.rolesDesc,
      },
      {
        id: 'approvals',
        label: t.approvalsLabel,
        icon: UserCheck,
        description: t.approvalsDesc,
      },
    ] : []),
  ];

  const contentMap = {
    info: <PersonalInformation userData={userData} onEditClick={() => setShowEditMode(true)} />,

    ...(userIsEmployee ? {
      dispo: <AvailabilityForm userId={userData?.id} />,
    } : {}),

    ...(userIsManager ? {
      roles:     <UpdateEmployeeRoleForm userId={userData?.id} />,
      approvals: <PendingApprovals />,
    } : {}),
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-full bg-[#020617]">
      <div className="flex flex-col items-center gap-5">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 border-2 border-blue-500/30 rounded-full" />
          <div className="absolute inset-0 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-2 bg-blue-500/10 rounded-full flex items-center justify-center">
            <Zap size={16} className="text-blue-400" />
          </div>
        </div>
        <p className="text-slate-500 text-sm font-medium tracking-wide animate-pulse">
          Chargement de votre espace...
        </p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-full bg-[#020617] p-4">
      <div className="p-10 rounded-3xl bg-slate-900/40 border border-slate-800 text-center max-w-md backdrop-blur-xl">
        <div className="w-14 h-14 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <X size={28} />
        </div>
        <h2 className="text-xl font-black text-white mb-2 tracking-tight">Oups !</h2>
        <p className="text-slate-400 text-sm mb-8">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-blue-600 text-white py-3.5 rounded-2xl font-bold hover:scale-105 transition-all shadow-[0_0_40px_rgba(37,99,235,0.3)]"
        >
          Réessayer
        </button>
      </div>
    </div>
  );

  const activeItem = menuItems.find(i => i.id === activeTab);

  return (
    <>
      <div className="flex flex-col md:flex-row w-full min-h-full bg-[#020617] text-white">

        <div className="md:hidden px-5 py-4 bg-[#020617]/95 border-b border-slate-800/60 flex justify-between items-center sticky top-0 z-20 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <User size={16} className="text-white" />
            </div>
            <span className="font-black text-white tracking-tight text-sm">{t.myProfile}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const r = userRole;
                if (r === 'super_admin') window.location.href = '/super-admin';
                else if (isManager(r)) window.location.href = '/manager-dashboard';
                else window.location.href = '/employee-dashboard';
              }}
              className="flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white px-3 py-2 rounded-xl transition-all border border-blue-500/20 text-xs font-bold"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl transition-all border border-white/5 text-xs font-bold"
            >
              <LogOut size={15} /> {t.logout}
            </button>
            <button
              onClick={() => setMobileMenu(!isMobileMenuOpen)}
              className="p-2 hover:bg-slate-800/60 rounded-xl transition-colors text-slate-400"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <aside className={`
          ${isMobileMenuOpen ? 'fixed inset-0 top-[61px] z-30 bg-[#020617]' : 'hidden'}
          md:flex md:flex-col w-full md:w-72 border-r border-slate-800/60
        `}>

          {/* Brand desktop */}
          <div className="hidden md:flex items-center gap-3 px-6 py-7 border-b border-slate-800/60">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.35)]">
              <User size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-black text-sm tracking-tight leading-none">{t.myProfile}</p>
              <p className="text-slate-600 text-[11px] mt-0.5 font-medium">{t.personalSpace}</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-4 py-2 mb-1">
              Navigation
            </p>
            {menuItems.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={activeTab === item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenu(false);
                }}
              />
            ))}
          </nav>

          {/* Footer sidebar */}
          <div className="p-5 border-t border-slate-800/60 space-y-3">
            <button
              onClick={() => {
                const r = userRole;
                if (r === 'super_admin') window.location.href = '/super-admin';
                else if (isManager(r)) window.location.href = '/manager-dashboard';
                else window.location.href = '/employee-dashboard';
              }}
              className="w-full flex items-center gap-2 justify-center bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] text-sm font-bold"
            >
              {t.backToDashboard}
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-3 rounded-xl transition-all border border-white/5 text-sm font-bold mt-2"
            >
              <LogOut size={18} /> {t.logout}
            </button>
            <p className="text-[10px] text-slate-700 tracking-widest font-bold uppercase text-center">
              TimeWork, v2.0.0
            </p>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-10 md:px-12 md:py-14">

            {/* En-tête de section */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400">
                    Compte Utilisateur
                  </span>
                  <span className="h-px w-10 bg-gradient-to-r from-blue-500/50 to-transparent" />
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">
                  {activeItem?.label}
                </h2>
                <p className="text-slate-500 mt-3 text-sm leading-relaxed max-w-sm">
                  {activeItem?.description}
                </p>
              </div>

              <button className="flex-shrink-0 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm font-semibold hover:border-slate-700 hover:text-white transition-all backdrop-blur-xl">
                <Bell size={15} />
                Notifications
              </button>
            </div>

            {/* Contenu de l'onglet actif */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {contentMap[activeTab] ?? <AccessDenied />}
              </motion.div>
            </AnimatePresence>

          </div>
        </main>
      </div>

      {showEditMode && (
        <EditMode
          userData={userData}
          onClose={() => setShowEditMode(false)}
          onSaved={(updated) => setUserData(prev => ({ ...prev, ...updated }))}
        />
      )}
    </>
  );
}