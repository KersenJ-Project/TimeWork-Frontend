import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: '/signin', label: 'Connexion' },
    { to: '/profil', label: 'Profil' },
  ];

  return (
    <nav className="bg-white border-b border-gray-100">

      <div className="px-6 py-4 flex justify-between items-center">

        <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <div className="h-7 w-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-black">TW</span>
          </div>
          <span className="text-base font-bold text-gray-900 tracking-tight">TimeWork</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === to
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {label}
            </Link>
          ))}

          <div className="w-px h-4 bg-gray-200 mx-2" />

          <Link
            to="/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors"
          >
            Inscription
          </Link>
        </div>

        <button
          className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 px-4 py-3 flex flex-col gap-1">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === to
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {label}
            </Link>
          ))}

          <div className="h-px bg-gray-100 my-1" />

          <Link
            to="/signup"
            onClick={() => setMenuOpen(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors text-center"
          >
            Inscription
          </Link>
        </div>
      )}

    </nav>
  );
}