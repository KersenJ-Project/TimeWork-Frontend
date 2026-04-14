import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserCheck, UserX, Clock, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem("token")}`,
    'Content-Type': 'application/json'
  }
});

export default function PendingApprovals() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });

  const showStatus = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: '', message: '' }), 3000);
  };

  const fetchPending = async () => {
    setLoading(true);
    try {
      const response = await api.get('/managers/users/pending');
      setUsers(response.data);
    } catch {
      showStatus('error', 'Impossible de charger les demandes.');
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
    } catch {
      showStatus('error', 'Une erreur est survenue.');
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="h-1 w-full bg-blue-600" />

        <div className="p-6">

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-blue-50 rounded-lg">
                <Clock size={16} className="text-blue-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Demandes en attente
              </h2>
              {!loading && (
                <span className="text-xs font-semibold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                  {users.length}
                </span>
              )}
            </div>
            <button
              onClick={fetchPending}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={12} />
              Actualiser
            </button>
          </div>

          {status.message && (
            <div className={`flex items-center gap-2.5 p-3 mb-5 rounded-xl text-sm font-medium border ${
              status.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                : 'bg-red-50 text-red-700 border-red-100'
            }`}>
              {status.type === 'success' ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
              {status.message}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-14 gap-3">
              <svg className="animate-spin h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <p className="text-sm text-gray-400">Chargement des demandes...</p>
            </div>

          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 gap-3">
              <div className="p-3 bg-emerald-50 rounded-full">
                <CheckCircle2 size={24} className="text-emerald-500" />
              </div>
              <p className="text-sm font-medium text-gray-600">Aucune demande en attente</p>
              <p className="text-xs text-gray-400">Tous les employés ont été traités.</p>
            </div>

          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleAction(user.id, 'approve')}
                      disabled={!!actionLoading[user.id]}
                      title="Approuver"
                      className="flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100 transition-colors disabled:opacity-50"
                    >
                      {actionLoading[user.id] === 'approve'
                        ? <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                        : <UserCheck size={15} />
                      }
                    </button>
                    <button
                      onClick={() => handleAction(user.id, 'reject')}
                      disabled={!!actionLoading[user.id]}
                      title="Refuser"
                      className="flex items-center justify-center h-8 w-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 transition-colors disabled:opacity-50"
                    >
                      {actionLoading[user.id] === 'reject'
                        ? <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                        : <UserX size={15} />
                      }
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}