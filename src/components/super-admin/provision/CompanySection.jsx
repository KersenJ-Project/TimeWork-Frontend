import React from 'react';
import { Building2 } from 'lucide-react';

const CompanySection = ({
  formData,
  updateField,
}) => {
  return (
    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">

      <div className="flex items-center gap-2 mb-6">
        <Building2
          size={20}
          className="text-indigo-600"
        />

        <h3 className="font-black text-gray-900">
          Entreprise
        </h3>
      </div>

      <div className="space-y-5">

        <div className="space-y-2">
          <label className="label">
            Nom de l'entreprise
          </label>

          <input
            required
            value={formData.companyName}
            placeholder="Ex: Restaurant Milano"
            className="input"
            onChange={(e) =>
              updateField(
                'companyName',
                e.target.value
              )
            }
          />
        </div>

        <div className="space-y-2">
          <label className="label">
            Adresse
          </label>

          <input
            required
            value={formData.companyAddress}
            placeholder="123 Rue Sherbrooke"
            className="input"
            onChange={(e) =>
              updateField(
                'companyAddress',
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
            value={formData.companyPhone}
            placeholder="(514) 555-1234"
            className="input"
            onChange={(e) =>
              updateField(
                'companyPhone',
                e.target.value
              )
            }
          />
        </div>

      </div>
    </div>
  );
};

export default CompanySection;