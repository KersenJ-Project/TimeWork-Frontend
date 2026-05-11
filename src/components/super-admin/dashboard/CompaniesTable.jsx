import React from 'react';

import {
    Loader2,
    Building2,
} from 'lucide-react';

import SearchBar from './SearchBar';
import CompanyRow from './CompanyRow';

const CompaniesTable = ({
    companies,
    loading,
    searchTerm,
    setSearchTerm,
    onEdit,
    onDelete,
}) => {
    return (
        <div
            className="
        bg-white/80
        backdrop-blur-xl
        border border-white
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
                        className="animate-spin text-indigo-600"
                    />

                </div>
            ) : companies.length === 0 ? (
                <div className="py-24 flex flex-col items-center justify-center text-center">

                    <div
                        className="
              w-24 h-24
              rounded-[2rem]
              bg-indigo-50
              flex
              items-center
              justify-center
              mb-6
            "
                    >
                        <Building2
                            size={40}
                            className="text-indigo-600"
                        />
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 mb-2">
                        Aucune entreprise trouvée
                    </h3>

                    <p className="text-gray-500">
                        Commencez par créer votre premier client.
                    </p>

                </div>
            ) : (
                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="border-b border-gray-100">

                            <tr
                                className="
                  text-left
                  text-[11px]
                  uppercase
                  tracking-[0.25em]
                  text-gray-400
                "
                            >

                                <th className="px-8 py-6">
                                    Entreprise
                                </th>

                                <th className="px-8 py-6">
                                    Code
                                </th>

                                <th className="px-8 py-6">
                                    Status
                                </th>

                                <th className="px-8 py-6 text-right">
                                    Actions
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