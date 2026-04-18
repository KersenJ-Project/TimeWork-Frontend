import { useState } from 'react';
import axios from 'axios';
import { Mail, ArrowRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Remplace par ton instance axios 'api' si nécessaire
            const response = await axios.post('http://localhost:3000/auth/forgot-password', { email });
            setMessage(response.data.message);
        } catch (err) {
            setMessage("Une erreur est survenue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center px-6">
            <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
                {!message ? (
                    <>
                        <h2 className="text-3xl font-black mb-2 italic text-blue-500">Oubli ?</h2>
                        <p className="text-slate-400 mb-8 text-sm">Entrez votre email pour recevoir un lien de réinitialisation.</p>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-1">Email professionnel</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                    <input 
                                        type="email" 
                                        required 
                                        className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl outline-none focus:border-blue-500/50 transition-all text-sm"
                                        placeholder="votre@email.com"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button disabled={loading} type="submit" className="w-full bg-blue-600 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50">
                                {loading ? "Envoi..." : "Envoyer le lien"} <ArrowRight size={18} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-4 animate-in fade-in zoom-in duration-300">
                        <CheckCircle2 className="mx-auto text-emerald-500 mb-4" size={60} />
                        <h2 className="text-2xl font-black mb-2">Email envoyé</h2>
                        <p className="text-slate-400 text-sm leading-relaxed">{message}</p>
                    </div>
                )}
                <Link to="/signin" className="mt-8 flex items-center gap-2 text-slate-500 text-xs font-black hover:text-white transition-all justify-center uppercase tracking-widest">
                    <ChevronLeft size={14} /> Retour
                </Link>
            </div>
        </div>
    );
}