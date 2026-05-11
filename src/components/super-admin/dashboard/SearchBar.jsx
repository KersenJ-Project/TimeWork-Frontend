import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({
    searchTerm,
    setSearchTerm,
}) => {
    return (
        <div className="p-7 border-b border-gray-100">

            <div className="relative max-w-md">

                <Search
                    size={20}
                    className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-400
          "
                />

                <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                    className="
            w-full
            h-14
            pl-12
            pr-5
            rounded-2xl
            border
            border-gray-200
            bg-[#F9FAFB]
            text-gray-900
            placeholder:text-gray-400
            outline-none
            focus:ring-4
            focus:ring-indigo-100
            focus:border-indigo-400
            transition-all
          "
                />

            </div>

        </div>
    );
};

export default SearchBar;