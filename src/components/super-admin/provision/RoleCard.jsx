import React from 'react';
import { Trash2 } from 'lucide-react';

const DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const DAY_LABELS = {
  monday: 'Lun',
  tuesday: 'Mar',
  wednesday: 'Mer',
  thursday: 'Jeu',
  friday: 'Ven',
  saturday: 'Sam',
  sunday: 'Dim',
};

const RoleCard = ({
  role,
  idx,
  removeRole,
  updateRole,
  updateStaffing,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-[2rem] p-6 relative">

      <button
        type="button"
        onClick={() => removeRole(idx)}
        className="absolute top-5 right-5 w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all"
      >
        <Trash2 size={18} />
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">

        <div className="space-y-2">
          <label className="label">
            Titre du métier
          </label>

          <input
            required
            placeholder="Cuisinier"
            value={role.title}
            onChange={(e) =>
              updateRole(
                idx,
                'title',
                e.target.value
              )
            }
            className="input"
          />
        </div>

        <div className="space-y-2">
          <label className="label">
            Salaire horaire
          </label>

          <input
            required
            type="number"
            value={role.baseHourlyRate}
            onChange={(e) =>
              updateRole(
                idx,
                'baseHourlyRate',
                parseFloat(e.target.value)
              )
            }
            className="input"
          />
        </div>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">

        {DAYS.map((day) => (
          <div
            key={day}
            className="bg-gray-50 border border-gray-100 rounded-2xl p-4"
          >

            <p className="text-[11px] font-black uppercase tracking-widest text-gray-500 text-center mb-3">
              {DAY_LABELS[day]}
            </p>

            <input
              type="number"
              placeholder="0"
              value={
                role.staffingNeeds?.[day] || 0
              }
              className="input text-center text-sm"
              onChange={(e) =>
                updateStaffing(
                  idx,
                  day,
                  e.target.value
                )
              }
            />

          </div>
        ))}

      </div>
    </div>
  );
};

export default RoleCard;