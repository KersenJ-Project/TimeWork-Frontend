import { useState } from 'react';
import axios from 'axios';
import { Building, User, Mail, ShieldCheck, CheckCircle2, ChevronRight, XCircle } from 'lucide-react';

export default function SuperAdminDashboard() {
  const [formData, setFormData] = useState({
    companyName: '',
    managerFirstName: '',
    managerLastName: '',
    managerEmail: ''
  });

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProvision = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessData(null);

    try {
      const response = await axios.post('http://localhost:5000/api/super-admin/provision', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        }
      });
      setSuccessData(response.data);
      setFormData({
        companyName: '',
        managerFirstName: '',
        managerLastName: '',
        managerEmail: ''
      });
    } catch (err) {
       console.error(err);
       setError(err.response?.data?.message || 'Erreur lors de la création de la compagnie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Déploiement Client (Provisioning)</h1>
        <p className="text-slate-400">Créer une nouvelle instance entreprise et générer les accès Manager initiaux.</p>
      </div>

      {successData && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 mb-8 flex items-start gap-4">
          <CheckCircle2 className="text-emerald-500 mt-1" size={24} />
          <div className="flex-1">
            <h3 className="text-emerald-500 font-bold text-lg mb-1">Déploiement Réussi !</h3>
            <p className="text-emerald-400/80 text-sm mb-4">La compagnie a été créée et le compte Manager est prêt.</p>
            
            <div className="bg-[#020617] rounded-lg p-4 font-mono text-sm border border-emerald-500/10">
              <div className="grid grid-cols-3 gap-y-2">
                <span className="text-slate-500">Compagnie :</span>
                <span className="col-span-2 text-white font-bold">{successData.companyName || successData.company?.name || 'Vérifier la réponse'}</span>
                
                <span className="text-slate-500">Manager Email :</span>
                <span className="col-span-2 text-blue-400">{successData.managerEmail || successData.manager?.email || 'N/A'}</span>
                
                <span className="text-slate-500">Mot de passe provisoire :</span>
                <span className="col-span-2 text-warning-400 text-yellow-500">{successData.temporaryPassword || successData.password || 'Vérifier email/réponse'}</span>
              </div>
            </div>
            
            <p className="text-xs text-emerald-500/60 mt-3 italic">
              * Veuillez copier ces informations sécurisées et les transmettre au client.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8 flex items-center gap-3 text-red-500">
          <XCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleProvision} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Colonne 1 : Entreprise */}
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <div className="h-10 w-10 bg-blue-600/20 text-blue-500 rounded-lg flex items-center justify-center">
              <Building size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Informations Entreprise</h2>
              <p className="text-xs text-slate-500">Détails de l'organisation locataire</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Nom de la Compagnie</label>
              <input 
                type="text" 
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                placeholder="Ex: RestoTech Inc."
              />
            </div>
          </div>
        </div>

        {/* Colonne 2 : Manager */}
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <div className="h-10 w-10 bg-purple-600/20 text-purple-500 rounded-lg flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Compte Manager Principal</h2>
              <p className="text-xs text-slate-500">Contact administratif et accès initial</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Prénom</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User size={16} />
                  </div>
                  <input 
                    type="text" 
                    name="managerFirstName"
                    value={formData.managerFirstName}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#020617] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium"
                    placeholder="Jean"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nom</label>
                <input 
                  type="text" 
                  name="managerLastName"
                  value={formData.managerLastName}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium"
                  placeholder="Dupont"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Adresse Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail size={16} />
                </div>
                <input 
                  type="email" 
                  name="managerEmail"
                  value={formData.managerEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#020617] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium"
                  placeholder="jean.dupont@entreprise.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bouton de Soumission */}
        <div className="md:col-span-2 mt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Déploiement en cours...
              </span>
            ) : (
              <>
                Lancer le Provisioning <ChevronRight size={20} />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
