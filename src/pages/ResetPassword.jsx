import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Récupération des infos envoyées dans le lien Mailtrap
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');

    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:3000/auth/reset-password', { 
                userId: Number(userId), 
                token, 
                newPassword 
            });
            setStatus({ type: 'success', msg: 'Mot de passe réinitialisé ! Redirection...' });
            setTimeout(() => navigate('/signin'), 3000);
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Lien invalide ou expiré.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center px-6">
            <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
                <div className="mb-8 text-center">
                   <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="text-blue-500" />
                   </div>
                   <h2 className="text-2xl font-black italic">Sécurisez votre compte</h2>
                </div>

                {status.msg && (
                    <div className={`mb-6 p-4 rounded-2xl text-xs font-bold border ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                        {status.msg}
                    </div>
                )}

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-1">Nouveau mot de passe</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                            <input 
                                type={showPassword ? "text" : "password"}
                                required 
                                className="w-full pl-12 pr-12 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl outline-none focus:border-blue-500/50 transition-all text-sm text-white"
                                placeholder="••••••••"
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <button disabled={loading} type="submit" className="w-full bg-blue-600 py-4 rounded-2xl font-black hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50">
                        {loading ? "Mise à jour..." : "Réinitialiser le mot de passe"}
                    </button>
                </form>
            </div>
        </div>
    );
}