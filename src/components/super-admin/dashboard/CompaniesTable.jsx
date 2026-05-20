import React from 'react';
import { Loader2, Building2 } from 'lucide-react';
import SearchBar from './SearchBar';
import CompanyRow from './CompanyRow';
import { useLanguage } from '../../../context/LanguageContext';
import { superadminTranslations } from '../../../translations/superadmin';

const CompaniesTable = ({
    companies,
    loading,
    searchTerm,
    setSearchTerm,
    onEdit,
    onDelete,
}) => {
    const { lang } = useLanguage();
    const currentLang = lang ? lang.toLowerCase() : 'fr';
    const t = superadminTranslations[currentLang] || superadminTranslations['fr'];

    return (
        <div
            className="
        bg-slate-900/50
        backdrop-blur-xl
        border border-white/5
        rounded-[2.5rem]
        overflow-hidden
        shadow-sm
      "
        >

            <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            {loading ? (
                <div className="py-24 flex justify-center">

                    <Loader2
                        size={40}
                        className="animate-spin text-indigo-400"
                    />

                </div>
            ) : companies.length === 0 ? (
                <div className="py-24 flex flex-col items-center justify-center text-center">

                    <div
                        className="
              w-24 h-24
              rounded-[2rem]
              bg-indigo-500/10
              flex
              items-center
              justify-center
              mb-6
            "
                    >
                        <Building2
                            size={40}
                            className="text-indigo-400"
                        />
                    </div>

<h3 className="text-2xl font-black text-white mb-2">
                        {t.noClientTitle}
                    </h3>

                    <p className="text-slate-400">
                        {t.noClientDesc}
                    </p>

                </div>
            ) : (
                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="border-b border-white/5">

                            <tr
                                className="
                  text-left
                  text-[11px]
                  uppercase
                  tracking-[0.25em]
                  text-slate-500
                "
                            >

                                <th className="px-8 py-6">
                                    {t.colCompany}
                                </th>

                                <th className="px-8 py-6">
                                    {t.colCode}
                                </th>

                                <th className="px-8 py-6">
                                    {t.colStatus}
                                </th>

                                <th className="px-8 py-6 text-right">
                                    {t.colActions}
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {companies.map((company) => (
                                <CompanyRow
                                    key={company.id}
                                    company={company}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            ))}

                        </tbody>

                    </table>

                </div>
            )}

        </div>
    );
};

export default CompaniesTable;