import { ArrowRight, Clock, DollarSign, UserCog, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { homeTranslations } from '../translations/home';


export default function Home() {
  const { lang } = useLanguage();
  const t = homeTranslations[lang];

  return (
    <div className="w-full min-h-screen bg-[#020617] text-white">
      <main className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-tight">
            {t.title} <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              {t.highlight}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            {t.desc}
          </p>
          <Link to="/signup">
            <button className="group relative px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-[0_0_40px_rgba(37,99,235,0.3)]">
              {t.cta} <ArrowRight className="inline-flex ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </main>

      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard icon={<Clock className="text-blue-400" />} title={t.feat1.t} desc={t.feat1.d} />
          <FeatureCard icon={<DollarSign className="text-emerald-400" />} title={t.feat2.t} desc={t.feat2.d} />
          <FeatureCard icon={<UserCog className="text-purple-400" />} title={t.feat3.t} desc={t.feat3.d} />
          <FeatureCard icon={<Users className="text-orange-400" />} title={t.feat4.t} desc={t.feat4.d} />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-blue-500/50 transition-all backdrop-blur-xl">
      <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-6">{icon}</div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm font-medium leading-relaxed">{desc}</p>
    </div>
  );
}