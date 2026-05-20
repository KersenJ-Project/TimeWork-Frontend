import { useState, useEffect } from 'react';
import { Building, Edit, Search, X } from 'lucide-react';
import api from '../api/axios';
import ProvisionModal from '../components/super-admin/provision/provisionModal';
import { useLanguage } from '../context/LanguageContext';
import { superadminTranslations } from '../translations/superadmin';

export default function ManageCompanies() {
  const { lang } = useLanguage();
  const currentLang = lang ? lang.toLowerCase() : 'fr';
  const t = superadminTranslations[currentLang] || superadminTranslations['fr'];

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await api.get('/super-admin/companies');
      setCompanies(response.data || []);
    } catch (err) {
      console.error('Erreur récupération compagnies', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleEdit = async (company) => {
    try {
      setErrorMsg(null);
      const res = await api.get(`/super-admin/company/${company.id}`);
      setEditingCompany(res.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      setErrorMsg(t.loadError);
    }
  };

  const handleCloseModal = () => {
    setEditingCompany(null);
    setIsModalOpen(false);
  };

  const filteredCompanies = companies.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full p-6 lg:p-10 space-y-8 text-white min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter flex items-center gap-3">
            <Building className="text-blue-500" size={32} />
            {t.manageCompaniesTitle} <span className="text-blue-500">{t.manageCompaniesEntities}</span>
          </h1>
          <p className="text-slate-400 font-medium mt-1">{t.manageCompaniesDesc}</p>
        </div>
      </div>


      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl font-bold flex justify-between items-center text-sm">
          {errorMsg}
          <button onClick={() => setErrorMsg(null)}><X size={20} /></button>
        </div>
      )}

      <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex flex-col md:flex-row items-center gap-4 justify-between">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-[#020617] border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-white font-bold placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-800/50 px-4 py-2 rounded-xl">
            {filteredCompanies.length} {t.tenantCount}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-[10px] uppercase tracking-widest text-slate-500 font-black">
                <th className="p-6">{t.colCompany}</th>
                <th className="p-6">{t.colCode}</th>
                <th className="p-6">{t.colStatus}</th>
                <th className="p-6">{t.colCreated}</th>
                <th className="p-6 text-right">{t.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-500 font-black italic uppercase animate-pulse">
                    {t.loadingCompanies}
                  </td>
                </tr>
              ) : filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-500 font-bold italic uppercase text-sm">
                    {t.noCompanyFound}
                  </td>
                </tr>
              ) : (
                filteredCompanies.map(company => (
                  <tr key={company.id} className="hover:bg-slate-800/50 transition-colors cursor-pointer group" onClick={() => handleEdit(company)}>
                    <td className="p-6 font-bold text-white flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-black text-xl">
                        {company.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="block text-sm uppercase tracking-tight">{company.name}</span>
                        <span className="block text-[10px] text-slate-500 tracking-widest mt-1">ID #{company.id}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1.5 rounded-lg text-xs font-black tracking-widest">
                        {company.companyCode}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        company.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {company.isActive ? t.statusActive : t.statusInactive}
                      </span>
                    </td>
                    <td className="p-6 text-slate-400 text-xs font-bold">
                      {new Date(company.createdAt).toLocaleDateString('fr-CA')}
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleEdit(company); }}
                        className="p-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"
                      >
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProvisionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchCompanies}
        editingCompany={editingCompany}
      />
    </div>
  );
}
