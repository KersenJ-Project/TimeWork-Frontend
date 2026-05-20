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
  t
}) => {
  return (
    <div className="bg-slate-900/50 rounded-3xl p-6 border border-white/5">     

      <div className="flex items-center gap-2 mb-6">
        <Clock3
          size={20}
          className="text-indigo-400"
        />

        <h3 className="font-black text-white">
          {t.hoursSubTitle}
        </h3>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-7 gap-4">

        {DAYS.map((day) => {
          const hours = formData.operatingHours[day];
          const isClosed = !hours.isOpen;

          return (
            <div
              key={day}
              className={`rounded-2xl border p-4 transition-colors ${
                isClosed ? 'bg-slate-800/30 border-slate-700/50' : 'bg-slate-950 border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <p className={`text-xs font-black uppercase ${isClosed ? 'text-slate-500' : 'text-indigo-400'}`}>
                  {t.days[day]}
                </p>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={isClosed}
                    onChange={(e) => updateHours(day, 'isOpen', !e.target.checked)}
                  />
                  <div className={`text-[10px] px-2 py-1 rounded-lg font-bold transition-all ${
                    isClosed ? 'bg-red-500/10 text-red-400' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}>
                    {t.closed}
                  </div>
                </label>
              </div>

              <div className={`space-y-2 transition-opacity ${isClosed ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                <input
                  type="time"
                  value={hours.open}
                  onChange={(e) => updateHours(day, 'open', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 font-bold text-white outline-none focus:border-indigo-500 text-sm [color-scheme:dark]"
                />

                <input
                  type="time"
                  value={hours.close}
                  onChange={(e) => updateHours(day, 'close', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 font-bold text-white outline-none focus:border-indigo-500 text-sm [color-scheme:dark]"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HoursSection;