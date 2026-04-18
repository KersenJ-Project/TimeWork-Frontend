import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, Globe } from 'lucide-react';
// Importation du hook personnalisé qu'on a créé
import { useLanguage } from '../context/LanguageContext'; 

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // On récupère l'état global au lieu d'un état local
  const { lang, toggleLang } = useLanguage();

  const navLinks = [
    { to: '/signin', label: lang === 'FR' ? 'Connexion' : 'Login' },
    { to: '/profil', label: lang === 'FR' ? 'Profil' : 'Profile' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-[#020617]/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setMenuOpen(false)}>
          <div className="h-9 w-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform">
            <Zap className="text-white fill-current" size={18} />
          </div>
          <span className="text-xl font-black text-white tracking-tighter">
            Time<span className="text-blue-400">Work</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                location.pathname === to
                  ? 'bg-blue-500/10 text-blue-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
            </Link>
          ))}

          <div className="w-px h-5 bg-white/10 mx-3" />

          {/* Language Switcher Button - Utilise toggleLang */}
          <button 
            onClick={toggleLang}
            className="flex items-center gap-2 px-3 py-2 mr-2 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-all text-xs font-black tracking-widest active:scale-90"
          >
            <Globe size={14} className="text-blue-400" />
            {lang}
          </button>

          <Link
            to="/signup"
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            {lang === 'FR' ? 'Inscription' : 'Sign Up'}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-xl text-slate-400 hover:bg-white/5 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#020617] px-6 py-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)} className="text-lg font-bold text-slate-400">
              {label}
            </Link>
          ))}
          
          <button 
            onClick={() => { toggleLang(); setMenuOpen(false); }}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl border border-white/10 text-white font-bold bg-white/5"
          >
            <Globe size={18} className="text-blue-400" /> 
            {lang === 'FR' ? 'English Version' : 'Version Française'}
          </button>

          <Link
            to="/signup"
            onClick={() => setMenuOpen(false)}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl text-center font-bold shadow-lg shadow-blue-500/20"
          >
            {lang === 'FR' ? 'Inscription gratuite' : 'Free Sign Up'}
          </Link>
        </div>
      )}
    </nav>
  );
}