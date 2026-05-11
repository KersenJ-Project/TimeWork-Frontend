import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, Globe, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, toggleLang } = useLanguage();

  const content = {
    FR: {
      login: 'Connexion',
      profile: 'Profil',
      signup: 'Inscription',
      mobileLang: 'English Version',
      freeSignup: 'Inscription gratuite'
    },
    EN: {
      login: 'Login',
      profile: 'Profile',
      signup: 'Sign Up',
      mobileLang: 'Version Française',
      freeSignup: 'Free Sign Up'
    }
  }[lang];

  const navLinks = [
    { to: '/', label: lang === 'FR' ? 'Accueil' : 'Home' },
  ];

  const NavItem = ({ to, label, mobile = false }) => {
    const isActive = location.pathname === to;
    const baseClass = mobile 
      ? "text-lg font-bold transition-colors" 
      : "px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300";
    
    const activeClass = isActive 
      ? "bg-blue-500/10 text-blue-400" 
      : "text-slate-400 hover:text-white hover:bg-white/5";

    return (
      <Link to={to} onClick={() => setMenuOpen(false)} className={`${baseClass} ${activeClass}`}>
        {label}
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* --- SECTION GAUCHE : LOGO & LIENS --- */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setMenuOpen(false)}>
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:rotate-12 transition-transform duration-300">
              <Zap className="text-white fill-current" size={20} />
            </div>
            <span className="text-xl font-black text-white tracking-tight">
              Time<span className="text-blue-400">Work</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavItem key={link.to} {...link} />
            ))}
          </div>
        </div>

        {/* --- SECTION DROITE : TOUT EST REGROUPÉ ICI POUR ÉVITER LES ESPACES VIDES --- */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* 1. Boutons Auth */}
          <div className="flex items-center gap-2">
            {localStorage.getItem("token") && !(
              <Link
                to="/signin"
                className="bg-white/5 hover:bg-blue-600 border border-white/10 hover:border-blue-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-blue-500/20 active:scale-95"
              >
                {content.login}
              </Link>
            )}
            
            {localStorage.getItem("token") && !(
              <Link
                to="/signup"
                className="bg-white/5 hover:bg-blue-600 border border-white/10 hover:border-blue-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-blue-500/20 active:scale-95"
              >
                {content.signup}
              </Link>
            )}
          </div>

          {/* 2. Le Séparateur (bien collé entre les deux groupes) */}
          <div className="w-px h-6 bg-white/10 mx-2" />

          {/* 3. Profil & Langue */}
          <div className="flex items-center gap-1">
            <button 
              onClick={toggleLang}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300 active:scale-90"
            >
              <Globe size={16} className="text-blue-400" />
              <span className="text-xs font-black uppercase tracking-tighter">{lang}</span>
            </button>

            <Link 
              to="/profil" 
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                location.pathname === '/profil' 
                ? 'text-blue-400 bg-blue-500/10' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <User size={16} />
              <span className="hidden lg:inline">{content.profile}</span>
            </Link>

            <Link 
              to="/profil" 
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                location.pathname === '/contact' 
                ? 'text-blue-400 bg-blue-500/10' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <User size={16} />
              <span className="hidden lg:inline">{content.profile}</span>
            </Link>

          </div>
        </div>

        {/* Bouton Menu Mobile */}
        <div className="md:hidden flex items-center">
          <button
            className="p-2.5 rounded-xl bg-white/5 text-slate-300"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* --- MENU MOBILE --- */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#020617] border-b border-white/10 px-6 py-8 flex flex-col gap-6 shadow-2xl animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <NavItem key={link.to} {...link} mobile />
            ))}
            <NavItem to="/profil" label={content.profile} mobile />
          </div>
          <hr className="border-white/5" />
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => { toggleLang(); setMenuOpen(false); }}
              className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 text-white font-bold transition-colors"
            >
              <Globe size={20} className="text-blue-400" /> 
              {content.mobileLang}
            </button>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/signin" onClick={() => setMenuOpen(false)} className="py-4 rounded-2xl text-center font-bold text-white border border-white/10">
                {content.login}
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="bg-blue-600 text-white py-4 rounded-2xl text-center font-bold shadow-xl shadow-blue-600/20">
                {content.signup}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}