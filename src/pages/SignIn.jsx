import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, LogIn, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../enum/UserRole';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

const translations = {
  FR: {
    title: "Bon retour !",
    subtitle: "Heureux de vous revoir sur TimeWork. Connectez-vous pour gérer vos équipes.",
    labelEmail: "Email professionnel",
    labelPass: "Mot de passe",
    forgot: "Oublié ?",
    btnSubmit: "Se connecter",
    loading: "Connexion...",
    noAccount: "Nouveau ici ?",
    createAccount: "Créer un compte",
    badge: "Accès Sécurisé"
  },
  EN: {
    title: "Welcome Back!",
    subtitle: "Happy to see you again. Log in to manage your teams effortlessly.",
    labelEmail: "Work Email",
    labelPass: "Password",
    forgot: "Forgot?",
    btnSubmit: "Sign In",
    loading: "Connecting...",
    noAccount: "New here?",
    createAccount: "Create account",
    badge: "Secure Access"
  }
};

export default function SignIn() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/signin', formData);

      const { accessToken, role, userId} = response.data;

        if (accessToken) {
          localStorage.setItem('token', accessToken);
          localStorage.setItem('userRole', role);
          localStorage.setItem('userId', userId);

          if(role === UserRole.MANAGER) {
            navigate('/manager-dashboard');
          } else {
            navigate('/employee-dashboard');
          }
        }
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg : [msg || "Erreur de connexion"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center px-6 pt-24 pb-12 relative overflow-hidden">
      
      {/* Background Decor - Plus subtil */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Conteneur Dual-Column */}
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Côté Gauche - Branding & Intro */}
        <div className="hidden lg:flex flex-col space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 w-fit animate-fade-in">
            <ShieldCheck size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">{t.badge}</span>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-7xl font-black tracking-tighter leading-none">
              Time<span className="text-blue-500">Work</span>.
            </h1>
            <h2 className="text-4xl font-bold text-slate-200 tracking-tight">
              {t.title}
            </h2>
            <p className="text-lg text-slate-400 max-w-md leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-8 pt-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-10 rounded-full border-2 border-[#020617] bg-slate-800 flex items-center justify-center text-[10px] font-bold overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Rejoignez <span className="text-slate-300 font-bold">+2,000</span> gérants aujourd'hui.
            </p>
          </div>
        </div>

        {/* Côté Droit - Le Formulaire */}
        <div className="w-full max-w-md mx-auto lg:ml-auto">
          <div className="bg-slate-900/40 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
            
            {/* Effet de brillance discret au survol */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="relative z-10">
              <div className="lg:hidden text-center mb-8">
                <h2 className="text-3xl font-black italic">{t.title}</h2>
              </div>

              {error.length > 0 && (
                <div className="mb-6 p-4 bg-red-500/10 text-red-400 text-xs font-bold rounded-2xl border border-red-500/20 animate-in slide-in-from-top-2">
                  {error.map((errMsg, index) => (
                    <div key={index} className="mb-2 flex gap-2">
                      <span>•</span>
                      <span>{errMsg}</span>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">{t.labelEmail}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input 
                      type="email" 
                      required
                      placeholder="alex@company.com"
                      className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl focus:border-blue-500/50 focus:ring-0 outline-none transition-all text-sm"
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500">{t.labelPass}</label>
                    <Link to="/forgot-password" size={18} className="text-[10px] text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider">
                      {t.forgot}
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl focus:border-blue-500/50 focus:ring-0 outline-none transition-all text-sm"
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] mt-4"
                >
                  {loading ? t.loading : t.btnSubmit}
                  {!loading && <ArrowRight size={20} />}
                </button>
              </form>

              <div className="mt-10 pt-8 border-t border-white/5 text-center">
                <p className="text-slate-500 text-xs font-medium">
                  {t.noAccount}{' '}
                  <Link to="/signup" className="text-white hover:text-blue-400 font-bold transition-colors ml-1">
                    {t.createAccount}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}