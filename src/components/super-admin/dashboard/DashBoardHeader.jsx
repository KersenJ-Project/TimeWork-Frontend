import React from 'react';
import { Plus } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { superadminTranslations } from '../../../translations/superadmin';

const DashboardHeader = ({
    onAddClient,
}) => {
    const { lang } = useLanguage();
    const currentLang = lang ? lang.toLowerCase() : 'fr';
    const t = superadminTranslations[currentLang] || superadminTranslations['fr'];

    return (
        <div
            className="
        mb-10
        rounded-[2rem]
        border border-white/5
        bg-slate-900/50
        backdrop-blur-xl
        px-8
        py-6
        shadow-sm
      "
        >
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">

                {/* LEFT */}
                <div>

                    <div className="flex items-center gap-3 mb-3">

                        <div className="w-2 h-2 rounded-full bg-indigo-600"></div>

                        <p className="text-xs font-black uppercase tracking-[0.25em] text-indigo-400">
                            {t.globalConsole}
                        </p>

                        <div className="h-px w-20 bg-indigo-500/30"></div>

                    </div>

                    <h1
                        className="
              text-5xl
              font-black
              tracking-tight
              text-white
            "
                    >
                        {t.clientManagement}
                    </h1>

                    <p className="text-slate-400 mt-3 text-lg">
                        {t.clientManagementDesc}
                    </p>

                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4">

                    <button
                        onClick={onAddClient}
                        className="
              h-14
              px-8
              rounded-2xl
              bg-gradient-to-r
              from-indigo-600
              to-blue-500
              text-white
              font-bold
              flex
              items-center
              gap-3
              shadow-2xl
              shadow-indigo-500/30
              hover:scale-[1.02]
              active:scale-[0.98]
              transition-all
            "
                    >
                        <Plus size={20} />

                        {t.addClientBtn}
                    </button>

                </div>

            </div>
        </div>
    );
};

export default DashboardHeader;