import React from 'react';
import { Building2, Users } from 'lucide-react';
import StatCard from './StatCard';
import { useLanguage } from '../../../context/LanguageContext';
import { superadminTranslations } from '../../../translations/superadmin';

const StatsSection = ({ companies }) => {
    const { lang } = useLanguage();
    const currentLang = lang ? lang.toLowerCase() : 'fr';
    const t = superadminTranslations[currentLang] || superadminTranslations['fr'];

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
            <StatCard
                icon={<Building2 size={28} className="text-indigo-400" />}
                label={t.statCompanies}
                value={companies.length}
                bg="bg-indigo-500/10"
            />
            <StatCard
                icon={<Users size={28} className="text-emerald-400" />}
                label={t.statActive}
                value={companies.filter((c) => c.isActive).length}
                bg="bg-emerald-500/10"
            />
        </div>
    );
};

export default StatsSection;