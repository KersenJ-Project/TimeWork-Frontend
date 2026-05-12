import React from 'react';
import { Clock3 } from 'lucide-react';

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

const HoursSection = ({
  formData,
  updateHours,
}) => {
  return (
    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">

      <div className="flex items-center gap-2 mb-6">
        <Clock3
          size={20}
          className="text-indigo-600"
        />

        <h3 className="font-black text-gray-900">
          Horaires Hebdomadaires
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">

        {DAYS.map((day) => (
          <div
            key={day}
            className="bg-white rounded-2xl border border-gray-200 p-4"
          >
            <p className="text-xs font-black text-gray-500 uppercase mb-3 text-center">
              {DAY_LABELS[day]}
            </p>

            <div className="space-y-2">

              <input
                type="time"
                value={
                  formData
                    .operatingHours[day]
                    .open
                }
                onChange={(e) =>
                  updateHours(
                    day,
                    'open',
                    e.target.value
                  )
                }
                className="input text-sm"
              />

              <input
                type="time"
                value={
                  formData
                    .operatingHours[day]
                    .close
                }
                onChange={(e) =>
                  updateHours(
                    day,
                    'close',
                    e.target.value
                  )
                }
                className="input text-sm"
              />

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HoursSection;