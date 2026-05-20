import React from 'react';
import { User } from 'lucide-react';

const ManagerSection = ({
  formData,
  updateField,
  t
}) => {
  return (
    <div className="bg-slate-900/50 rounded-3xl p-6 border border-white/5">

      <div className="flex items-center gap-2 mb-6">
        <User
          size={20}
          className="text-indigo-400"
        />

        <h3 className="font-black text-white">
          {t.managerSectionTitle}
        </h3>
      </div>

      <div className="space-y-5">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="space-y-2">
            <label className="label">
              {t.firstName}
            </label>

            <input
              required
              value={formData.managerFirstName}
              placeholder={t.firstNamePH}
              className="input"
              onChange={(e) =>
                updateField(
                  'managerFirstName',
                  e.target.value
                )
              }
            />
          </div>

          <div className="space-y-2">
            <label className="label">
              {t.lastName}
            </label>

            <input
              required
              value={formData.managerLastName}
              placeholder={t.lastNamePH}
              className="input"
              onChange={(e) =>
                updateField(
                  'managerLastName',
                  e.target.value
                )
              }
            />
          </div>

        </div>

        <div className="space-y-2">
          <label className="label">
            {t.email}
          </label>

          <input
            required
            type="email"
            value={formData.managerEmail}
            placeholder={t.emailPH}
            className="input"
            onChange={(e) =>
              updateField(
                'managerEmail',
                e.target.value
              )
            }
          />
        </div>

        <div className="space-y-2">
          <label className="label">
            {t.phone}
          </label>

          <input
            required
            value={formData.managerPhone}
            placeholder={t.phonePH}
            className="input"
            onChange={(e) =>
              updateField(
                'managerPhone',
                e.target.value
              )
            }
          />
        </div>

      </div>
    </div>
  );
};

export default ManagerSection;