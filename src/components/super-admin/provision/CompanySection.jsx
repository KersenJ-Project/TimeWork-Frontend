import React from 'react';
import { Building2 } from 'lucide-react';

const CompanySection = ({
  formData,
  updateField,
  t
}) => {
  return (
    <div className="bg-slate-900/50 rounded-3xl p-6 border border-white/5">

      <div className="flex items-center gap-2 mb-6">
        <Building2
          size={20}
          className="text-indigo-400"
        />

        <h3 className="font-black text-white">
          {t.companySectionTitle}
        </h3>
      </div>

      <div className="space-y-5">

        <div className="space-y-2">
          <label className="label">
            {t.companyName}
          </label>

          <input
            required
            value={formData.companyName}
            placeholder={t.companyNamePH}
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
            {t.address}
          </label>

          <input
            required
            value={formData.companyAddress}
            placeholder={t.addressPH}
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
            {t.phone}
          </label>

          <input
            required
            value={formData.companyPhone}
            placeholder={t.phonePH}
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