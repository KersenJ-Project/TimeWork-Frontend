import React from 'react';
import { Building2, Mail, Edit, Trash2 } from 'lucide-react';
import ActionButton from './ActionButton';
import { useLanguage } from '../../../context/LanguageContext';
import { superadminTranslations } from '../../../translations/superadmin';

const CompanyRow = ({
    company,
    onEdit,
    onDelete,
}) => {
    const { lang } = useLanguage();
    const currentLang = lang ? lang.toLowerCase() : 'fr';
    const t = superadminTranslations[currentLang] || superadminTranslations['fr'];

    return (
        <tr
            className="
        border-b
        border-white/5
        hover:bg-slate-800/50
        transition-all
      "
        >

            <td className="px-8 py-6">

                <div className="flex items-center gap-4">

                    <div
                        className="
              w-14 h-14
              rounded-2xl
              bg-indigo-500/10
              flex
              items-center
              justify-center
            "
                    >
                        <Building2
                            size={24}
                            className="text-indigo-400"
                        />
                    </div>

                    <div>

                        <p className="font-black text-white text-lg">
                            {company.name}
                        </p>

                        <p className="text-sm text-slate-400 mt-1">
                            Client ID #{company.id}
                        </p>

                    </div>

                </div>

            </td>

            <td className="px-8 py-6">

                <span
                    className="
            px-4 py-2
            rounded-full
            bg-indigo-500/10
            text-indigo-400
            text-xs
            font-black
          "
                >
                    {company.companyCode}
                </span>

            </td>

            <td className="px-8 py-6">

                <span
                    className={`
            inline-flex
            items-center
            gap-2
            px-4
            py-2
            rounded-full
            text-xs
            font-black
            ${company.isActive
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-slate-800 text-slate-400'
                        }
          `}
                >

                    <span
                        className={`
              w-2 h-2 rounded-full
              ${company.isActive
                                ? 'bg-emerald-400'
                                : 'bg-slate-500'
                            }
            `}
                    />

                    {company.isActive
                        ? t.statusActive
                        : t.statusInactive}

                </span>

            </td>

            <td className="px-8 py-6">

                <div className="flex justify-end gap-3">

                    <ActionButton
                        color="indigo"
                        onClick={() =>
                            (window.location.href = `mailto:${company.managerEmail}`)
                        }
                    >
                        <Mail size={18} />
                    </ActionButton>

                    <ActionButton
                        color="gray"
                        onClick={() => onEdit(company)}
                    >
                        <Edit size={18} />
                    </ActionButton>

                    <ActionButton
                        color="red"
                        onClick={() =>
                            onDelete(company.id)
                        }
                    >
                        <Trash2 size={18} />
                    </ActionButton>

                </div>

            </td>

        </tr>
    );
};

export default CompanyRow;