import { Phone, Mail, Clock, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { contactTranslations } from '../translations/contact';
import Form from '../components/Form';

export default function Contact() {
  const { lang } = useLanguage();
  const t = contactTranslations[lang];

  return (
    <div className="w-full min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      {/* Effet de lumière en arrière-plan */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] pointer-events-none" />
      
      <main className="relative pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Calendar size={14} /> {t.infoTitle}
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-tight">
            {t.title} <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              {t.highlight}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            {t.desc}
          </p>
        </div>
      </main>

      <section className="pb-24 px-6 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Colonne Gauche : Infos - 5 colonnes */}
          <div className="lg:col-span-5 space-y-8">
            <div className="grid gap-4">
              <ContactDetail 
                icon={<Phone className="text-blue-400" />} 
                label={t.phoneLabel} 
                value="+16416674023" 
                href="tel:16416674023" 
              />
              <ContactDetail 
                icon={<Mail className="text-emerald-400" />} 
                label={t.emailLabel} 
                value="contact@timework.fr" 
                href="mailto:contact@timework.fr" 
              />
              <ContactDetail 
                icon={<Clock className="text-orange-400" />} 
                label={t.hoursLabel} 
                value={t.hoursValue} 
              />
            </div>

            {/* Petite carte d'engagement */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600/20 to-transparent border border-blue-500/20">
              <h3 className="font-bold text-white mb-2">Support 24/7</h3>
              <p className="text-sm text-slate-400">Notre système de gestion d'horaires garantit une réponse rapide pour optimiser votre productivité.</p>
            </div>
          </div>

          {/* Colonne Droite : Formulaire - 7 colonnes */}
          <div className="lg:col-span-7 p-1px bg-gradient-to-b from-slate-700 to-slate-800 rounded-3xl">
            <div className="p-8 md:p-10 rounded-[23px] bg-[#0f172a]/90 backdrop-blur-2xl">
              <h2 className="text-3xl font-bold mb-2">{t.formTitle}</h2>
              <p className="text-slate-400 mb-8 text-sm">Nous vous répondrons dans les plus brefs délais.</p>
              <Form />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

function ContactDetail({ icon, label, value, href }) {
  return (
    <div className="group flex items-center p-5 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-blue-500/50 transition-all duration-300">
      <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mr-5 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">{label}</p>
        {href ? (
          <a href={href} className="text-white font-bold text-lg hover:text-blue-400 transition-colors tracking-tight">{value}</a>
        ) : (
          <p className="text-white font-bold text-lg tracking-tight">{value}</p>
        )}
      </div>
    </div>
  );
}