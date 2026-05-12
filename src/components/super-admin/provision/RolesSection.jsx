import React from 'react';
import {
  Briefcase,
  Plus,
} from 'lucide-react';

import RoleCard from './RoleCard';

const RolesSection = ({
  roles,
  addRole,
  removeRole,
  updateRole,
  updateStaffing,
}) => {
  return (
    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">

      <div className="flex items-center justify-between mb-8">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <Briefcase
              size={20}
              className="text-indigo-600"
            />
          </div>

          <div>
            <h3 className="font-black text-gray-900 text-lg">
              Métiers & Staffing
            </h3>

            <p className="text-sm text-gray-500">
              Configure les rôles et besoins journaliers.
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={addRole}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all"
        >
          <Plus size={18} />
          Ajouter
        </button>
      </div>

      <div className="space-y-6">

        {roles.map((role, idx) => (
          <RoleCard
            key={idx}
            role={role}
            idx={idx}
            removeRole={removeRole}
            updateRole={updateRole}
            updateStaffing={updateStaffing}
          />
        ))}

      </div>
    </div>
  );
};

export default RolesSection;