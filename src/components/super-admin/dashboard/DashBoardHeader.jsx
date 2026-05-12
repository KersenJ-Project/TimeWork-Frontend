import React from 'react';
import { Plus } from 'lucide-react';

const DashboardHeader = ({
    onAddClient,
}) => {
    return (
        <div
            className="
        mb-10
        rounded-[2rem]
        border border-white/40
        bg-white/70
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

                        <p className="text-xs font-black uppercase tracking-[0.25em] text-indigo-600">
                            Console Globale
                        </p>

                        <div className="h-px w-20 bg-indigo-200"></div>

                    </div>

                    <h1
                        className="
              text-5xl
              font-black
              tracking-tight
              text-[#0B1023]
            "
                    >
                        Gestion des Clients
                    </h1>

                    <p className="text-gray-500 mt-3 text-lg">
                        Supervisez les entreprises et leurs accès.
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

                        Nouveau Client
                    </button>

                </div>

            </div>
        </div>
    );
};

export default DashboardHeader;