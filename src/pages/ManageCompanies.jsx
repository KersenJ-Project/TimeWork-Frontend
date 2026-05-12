import { useState, useEffect } from 'react';
import axios from 'axios';
import { Building, MoreVertical, PlusCircle, Search } from 'lucide-react';

export default function ManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/super-admin/companies', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCompanies(response.data || []);
    } catch (err) {
      console.error('Erreur récupération compagnies', err);
      setCompanies([
        { id: 1, name: 'RestoTech Inc.', status: 'ACTIVE', usersCount: 15, createdAt: '2026-05-01' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Building className="text-blue-500" size={28} />
            Gestion des Entreprises
          </h1>
          <p className="text-slate-400">Consultez et administrez toutes les instances locataires.</p>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="p-4 border-b border-white/5 flex flex-col md:flex-row items-center gap-4 justify-between bg-white/[0.02]">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search size={16} />
            </div>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher une entreprise..."
              className="w-full bg-[#020617] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
            />
          </div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            {filteredCompanies.length} Locataire(s)
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-slate-800/30 text-xs uppercase tracking-wider text-slate-400 font-black">
                <th className="p-4">Entreprise</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Employés</th>
                <th className="p-4">Création</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                       <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
                       Chargement...
                    </div>
                  </td>
                </tr>
              ) : filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500 italic">Aucune entreprise trouvée.</td>
                </tr>
              ) : (
                filteredCompanies.map(company => (
                  <tr key={company.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-black">
                        {company.name?.charAt(0).toUpperCase()}
                      </div>
                      {company.name}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold leading-none capitalize ${
                        company.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}>
                        {company.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 font-medium">
                      {company.usersCount || 0}
                    </td>
                    <td className="p-4 text-slate-400 text-xs">
                      {new Date(company.createdAt).toLocaleDateString('fr-CA')}
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
