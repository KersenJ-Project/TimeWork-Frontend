import React from 'react';

import {
    Building2,
    Mail,
    Edit,
    Trash2,
} from 'lucide-react';

import ActionButton from './ActionButton';

const CompanyRow = ({
    company,
    onEdit,
    onDelete,
}) => {
    return (
        <tr
            className="
        border-b
        border-gray-50
        hover:bg-gray-50/80
        transition-all
      "
        >

            <td className="px-8 py-6">

                <div className="flex items-center gap-4">

                    <div
                        className="
              w-14 h-14
              rounded-2xl
              bg-indigo-50
              flex
              items-center
              justify-center
            "
                    >
                        <Building2
                            size={24}
                            className="text-indigo-600"
                        />
                    </div>

                    <div>

                        <p className="font-black text-gray-900 text-lg">
                            {company.name}
                        </p>

                        <p className="text-sm text-gray-400 mt-1">
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
            bg-indigo-50
            text-indigo-600
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
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-600'
                        }
          `}
                >

                    <span
                        className={`
              w-2 h-2 rounded-full
              ${company.isActive
                                ? 'bg-emerald-500'
                                : 'bg-gray-400'
                            }
            `}
                    />

                    {company.isActive
                        ? 'ACTIF'
                        : 'INACTIF'}

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