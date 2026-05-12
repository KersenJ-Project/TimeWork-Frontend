import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import {
  UserCheck, UserX, Clock, CheckCircle2, XCircle,
  RefreshCw, Loader2, Users
} from 'lucide-react';

const api = axios.create({ baseURL: 'http://localhost:3000' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function PendingApprovals() {
  const [users,         setUsers]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [status,        setStatus]        = useState({ type: '', message: '' });

  const showStatus = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: '', message: '' }), 3000);
  };

  const fetchPending = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/managers/users/pending');
      setUsers(data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Impossible de charger les demandes.';
      showStatus('error', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const handleAction = async (id, action) => {
    setActionLoading((prev) => ({ ...prev, [id]: action }));
    try {
      await api.patch(`/managers/users/${id}/${action}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showStatus('success', action === 'approve' ? 'Employé approuvé.' : 'Employé refusé.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Une erreur est survenue.';
      showStatus('error', msg);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  };

  return (
    <div className="space-y-5">

      {/* ── EN-TÊTE ── */}
      <div className="relative p-6 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-xl overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/[0.02] rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Clock size={16} className="text-slate-300" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">Gestion</p>
              <h3 className="text-white font-black text-sm tracking-tight flex items-center gap-2">
                Demandes en attente
                {!loading && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-black text-[10px] font-black">
                    {users.length}
                  </span>
                )}
              </h3>
            </div>
          </div>

          <button
            onClick={fetchPending}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-slate-400 hover:text-white text-xs font-bold transition-all disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Actualiser
          </button>
        </div>
      </div>

      <AnimatePresence>
        {status.message && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center gap-2.5 px-5 py-3.5 rounded-2xl text-sm font-semibold border ${
              status.type === 'success'
                ? 'bg-white/5 text-white border-white/10'
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}
          >
            {status.type === 'success'
              ? <CheckCircle2 size={15} className="text-white" />
              : <XCircle      size={15} className="text-red-400" />
            }
            {status.message}
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-2 border-slate-700 rounded-full" />
            <div className="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-slate-500 text-sm animate-pulse">Chargement des demandes...</p>
        </div>

      ) : users.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 gap-4 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center">
            <Users size={24} className="text-slate-600" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Tout est traité</p>
            <p className="text-slate-600 text-xs mt-1">Aucune demande en attente pour le moment.</p>
          </div>
        </motion.div>

      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {users.map((user, i) => {
              const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8, height: 0, marginBottom: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                  className="group flex items-center justify-between gap-4 px-5 py-4 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 text-white flex items-center justify-center text-xs font-black flex-shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Approuver */}
                    <button
                      onClick={() => handleAction(user.id, 'approve')}
                      disabled={!!actionLoading[user.id]}
                      title="Approuver"
                      className="flex items-center justify-center h-9 w-9 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 transition-all disabled:opacity-40"
                    >
                      {actionLoading[user.id] === 'approve'
                        ? <Loader2 size={14} className="animate-spin" />
                        : <UserCheck size={15} />
                      }
                    </button>

                    {/* Refuser */}
                    <button
                      onClick={() => handleAction(user.id, 'reject')}
                      disabled={!!actionLoading[user.id]}
                      title="Refuser"
                      className="flex items-center justify-center h-9 w-9 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700/60 transition-all disabled:opacity-40"
                    >
                      {actionLoading[user.id] === 'reject'
                        ? <Loader2 size={14} className="animate-spin" />
                        : <UserX size={15} />
                      }
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}