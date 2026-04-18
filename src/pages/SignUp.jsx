import { useState } from 'react';
import axios from 'axios';
import { User, Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

const translations = {
  FR: {
    title: "Créez votre compte",
    subtitle: "Rejoignez la plateforme de gestion de temps la plus intuitive.",
    labelFirstName: "Prénom",
    labelLastName: "Nom",
    labelEmail: "Email professionnel",
    labelPass: "Mot de passe",
    btnSubmit: "Créer mon compte",
    loading: "Création en cours...",
    hasAccount: "Déjà inscrit ?",
    login: "Se connecter",
    badge: "Inscription gratuite",
    feature1: "Suivi des heures en temps réel",
    feature2: "Gestion d'équipe simplifiée",
    feature3: "Rapports automatisés"
  },
  EN: {
    title: "Create your account",
    subtitle: "Join the most intuitive time management platform.",
    labelFirstName: "First Name",
    labelLastName: "Last Name",
    labelEmail: "Work Email",
    labelPass: "Password",
    btnSubmit: "Create account",
    loading: "Creating...",
    hasAccount: "Already have an account?",
    login: "Sign In",
    badge: "Free Registration",
    feature1: "Real-time time tracking",
    feature2: "Simplified team management",
    feature3: "Automated reporting"
  }
};

export default function SignUp() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/signup', formData);
      const user = response.data.user;
      if (response.status === 201 || response.status === 200) {
        navigate('/signin');
      }
    } catch (err) {
      const msg = err.response?.data?.message;

      if (Array.isArray(msg)) {
        setError(msg);
      } else {
        setError(msg || "Une erreur est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center px-6 pt-24 pb-12 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Côté Gauche - Intro & Avantages */}
        <div className="hidden lg:flex flex-col space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 w-fit">
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
          </div>

          <div className="space-y-4">
            {[t.feature1, t.feature2, t.feature3].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-slate-400">
                <CheckCircle2 size={20} className="text-blue-500" />
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-white/5 max-w-sm">
            <p className="text-sm text-slate-500 italic">
              "La meilleure décision pour la productivité de notre entreprise cette année."
              <br />
              <span className="text-slate-300 font-bold not-italic">— Marc A., CEO de TechFlow</span>
            </p>
          </div>
        </div>

        {/* Côté Droit - Formulaire de SignUp */}
        <div className="w-full max-w-xl mx-auto lg:ml-auto">
          <div className="bg-slate-900/40 backdrop-blur-3xl p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative">
            
            <div className="lg:hidden text-center mb-8">
              <h2 className="text-3xl font-black italic">{t.title}</h2>
            </div>

            {error.length > 0 && (
              <div className="mb-6 p-4 bg-red-500/10 text-red-400 text-xs font-bold rounded-2xl border border-red-500/20 animate-in slide-in-from-top-2">
                {error.map((errMsg, index) => (
                  <div key={index} className="mb-2 last:mb-0">
                    <span>•</span>
                    <span>{errMsg}</span>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Prénom */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">{t.labelFirstName}</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input 
                      type="text" 
                      required
                      placeholder="Jean"
                      className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl focus:border-blue-500/50 focus:ring-0 outline-none transition-all text-sm"
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    />
                  </div>
                </div>
                {/* Nom */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">{t.labelLastName}</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Dupont"
                    className="w-full px-4 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl focus:border-blue-500/50 focus:ring-0 outline-none transition-all text-sm"
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">{t.labelEmail}</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input 
                    type="email" 
                    required
                    placeholder="jean.dupont@entreprise.com"
                    className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl focus:border-blue-500/50 focus:ring-0 outline-none transition-all text-sm"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">
                  {t.labelPass}
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl focus:border-blue-500/50 focus:ring-0 outline-none transition-all text-sm text-white"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-1"
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
                {t.hasAccount}{' '}
                <Link to="/signin" className="text-white hover:text-blue-400 font-bold transition-colors ml-1">
                  {t.login}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}