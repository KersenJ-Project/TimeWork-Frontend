import React from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { superadminTranslations } from '../../../translations/superadmin';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
    const { lang } = useLanguage();
    const currentLang = lang ? lang.toLowerCase() : 'fr';
    const t = superadminTranslations[currentLang] || superadminTranslations['fr'];

    return (
        <div className="p-7 border-b border-slate-800">
            <div className="relative max-w-md">
                <Search
                    size={20}
                    className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-slate-400
          "
                />
                <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="
            w-full
            h-14
            pl-12
            pr-5
            rounded-2xl
            border
            border-slate-800
            bg-slate-950/50
            text-white
            font-bold
            placeholder:text-slate-500
            outline-none
            focus:border-indigo-500
            transition-all
          "
                />

            </div>

        </div>
    );
};

export default SearchBar;