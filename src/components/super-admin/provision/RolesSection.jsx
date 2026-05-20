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
  t,
}) => {
  return (
    <div className="bg-slate-900/50 rounded-3xl p-6 border border-white/5">

      <div className="flex items-center justify-between mb-8">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
            <Briefcase
              size={20}
              className="text-indigo-400"
            />
          </div>

          <div>
            <h3 className="font-black text-white text-lg">
              {t.rolesSubTitle}
            </h3>

            <p className="text-sm text-slate-400">
              {t.rolesSubDesc}
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={addRole}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all"
        >
          <Plus size={18} />
          {t.addRoleBtn}
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
            t={t}
          />
        ))}

      </div>

    </div>
  );
};

export default RolesSection;