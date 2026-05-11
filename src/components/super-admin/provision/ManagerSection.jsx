import React from 'react';
import { User } from 'lucide-react';

const ManagerSection = ({
  formData,
  updateField,
}) => {
  return (
    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">

      <div className="flex items-center gap-2 mb-6">
        <User
          size={20}
          className="text-indigo-600"
        />

        <h3 className="font-black text-gray-900">
          Manager (Gérant)
        </h3>
      </div>

      <div className="space-y-5">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="space-y-2">
            <label className="label">
              Prénom
            </label>

            <input
              required
              value={formData.managerFirstName}
              placeholder="Jean"
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
              Nom
            </label>

            <input
              required
              value={formData.managerLastName}
              placeholder="Tremblay"
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
            Email professionnel
          </label>

          <input
            required
            type="email"
            value={formData.managerEmail}
            placeholder="manager@entreprise.com"
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
            Téléphone
          </label>

          <input
            required
            value={formData.managerPhone}
            placeholder="(514) 555-1234"
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