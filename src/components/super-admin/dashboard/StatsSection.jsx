import React from 'react';

import {
    Building2,
    Users,
} from 'lucide-react';

import StatCard from './StatCard';

const StatsSection = ({
    companies,
}) => {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">

            <StatCard
                icon={
                    <Building2
                        size={28}
                        className="text-indigo-600"
                    />
                }
                label="ENTREPRISES"
                value={companies.length}
                bg="bg-indigo-50"
            />

            <StatCard
                icon={
                    <Users
                        size={28}
                        className="text-emerald-600"
                    />
                }
                label="ACTIVES"
                value={
                    companies.filter(
                        (c) => c.isActive
                    ).length
                }
                bg="bg-emerald-50"
            />

        </div>
    );
};

export default StatsSection;