import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

import ModalHeader from './ModalHeader';
import ModalFooter from './ModalFooter';
import CompanySection from './CompanySection';
import ManagerSection from './ManagerSection';
import HoursSection from './HoursSection';
import RolesSection from './RolesSection';
import { useLanguage } from '../../../context/LanguageContext';
import { superadminTranslations } from '../../../translations/superadmin';

import './style.css';

const DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const defaultHours = DAYS.reduce(
  (acc, day) => ({
    ...acc,
    [day]: {
      open: '09:00',
      close: '17:00',
      isOpen: true,
    },
  }),
  {}
);

const defaultRole = {
  title: '',
  baseHourlyRate: 15,
  staffingNeeds: {},
};

const ProvisionModal = ({
  isOpen,
  onClose,
  onSuccess,
  editingCompany,
}) => {
  const { lang } = useLanguage();
  const currentLang = lang ? lang.toLowerCase() : 'fr';
  const t = superadminTranslations[currentLang] || superadminTranslations['fr'];

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const [formData, setFormData] = useState({
    companyName: '',
    companyAddress: '',
    companyPhone: '',

    managerFirstName: '',
    managerLastName: '',
    managerEmail: '',
    managerPhone: '',

    operatingHours: defaultHours,

    roles: [defaultRole],
  });

  useEffect(() => {
    setErrorMsg(null);
    setSuccessData(null);
    
    if (!editingCompany) {
      setFormData({
        companyName: '',
        companyAddress: '',
        companyPhone: '',

        managerFirstName: '',
        managerLastName: '',
        managerEmail: '',
        managerPhone: '',

        operatingHours: defaultHours,

        roles: [defaultRole],
      });
      return;
    }

    const manager = editingCompany.users?.find(
      (u) => u.role?.toLowerCase() === 'manager'
    );

    setFormData({
      companyName: editingCompany.name || '',
      companyAddress: editingCompany.address || '',
      companyPhone: editingCompany.phoneNumber || '',

      managerFirstName: manager?.firstName || '',
      managerLastName: manager?.lastName || '',
      managerEmail: manager?.email || '',
      managerPhone: manager?.phoneNumber || '',

      operatingHours: editingCompany.operatingHours || defaultHours,

      roles:
        editingCompany.jobRoles?.length > 0
          ? editingCompany.jobRoles.map((role) => ({
              title: role.title,
              baseHourlyRate: role.baseHourlyRate,
              staffingNeeds: role.staffingNeedsPerDay || {},
            }))
          : [defaultRole],
    });
  }, [editingCompany, isOpen]);

  if (!isOpen) return null;

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addRole = () => {
    setFormData((prev) => ({
      ...prev,
      roles: [
        ...prev.roles,
        {
          title: '',
          baseHourlyRate: 15,
          staffingNeeds: {},
        },
      ],
    }));
  };

  const removeRole = (index) => {
    if (formData.roles.length === 1) return;

    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.filter((_, i) => i !== index),
    }));
  };

  const updateRole = (index, field, value) => {
    const updatedRoles = [...formData.roles];
    updatedRoles[index][field] = value;

    setFormData((prev) => ({
      ...prev,
      roles: updatedRoles,
    }));
  };

  const updateStaffing = (roleIndex, day, value) => {
    const updatedRoles = [...formData.roles];
    updatedRoles[roleIndex].staffingNeeds[day] = parseInt(value) || 0;

    setFormData((prev) => ({
      ...prev,
      roles: updatedRoles,
    }));
  };

  const updateHours = (day, field, value) => {
    setFormData((prev) => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [field]: value,
        },
      },
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMsg(null);

  try {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    const formattedHours = {};
    Object.entries(formData.operatingHours).forEach(([day, hours]) => {
      formattedHours[day] = {
        ...hours,
        isOpen: hours.isOpen,
      };
    });

    const payload = {
      ...formData,
      operatingHours: formattedHours,
    };

    if (editingCompany) {
        await axios.patch(
          `http://localhost:3000/super-admin/company/${editingCompany.id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        onSuccess();
        onClose();
      } else {
        const res = await axios.post(
          'http://localhost:3000/super-admin/provision',
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setSuccessData({
          code: res.data.companyCode,
          pwd: res.data.tempPassword
        });
        onSuccess();
      }

    } catch (err) {
      console.error(err);
      setErrorMsg(
        err?.response?.data?.message || 'Erreur lors du provisioning'
      );
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <div className="relative w-full max-w-md bg-slate-900 rounded-[3rem] p-10 shadow-2xl border border-white/10 text-center animate-in fade-in slide-in-from-bottom-4">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-black text-white italic tracking-tighter mb-4">{t.deploySuccessTitle} <span className="text-emerald-500">{t.deploySuccessHighlight}</span></h2>
          <p className="text-slate-400 font-medium mb-8">{t.deploySuccessDesc}</p>
          
          <div className="space-y-4 mb-8">
            <div className="bg-slate-950 p-4 rounded-2xl border border-white/5">
              <span className="block text-[10px] font-black uppercase text-slate-500 mb-1 tracking-widest">{t.companyCode}</span>
              <span className="block font-mono text-xl font-bold text-emerald-400">{successData.code}</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-white/5">
              <span className="block text-[10px] font-black uppercase text-slate-500 mb-1 tracking-widest">{t.tempPassword}</span>
              <span className="block font-mono text-xl font-bold text-white">{successData.pwd}</span>
            </div>
          </div>

          <button onClick={() => { setSuccessData(null); onClose(); }} className="w-full bg-slate-800 text-white font-bold py-4 rounded-2xl hover:bg-slate-700 transition">{t.closeBtn}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
      />

      <div className="relative flex items-start justify-center min-h-screen p-4 pt-20 pb-10">
        <div className="w-full max-w-6xl bg-slate-900 rounded-[3rem] shadow-2xl border border-white/10 overflow-hidden flex flex-col my-auto text-white">
          <ModalHeader editingCompany={editingCompany} onClose={onClose} t={t} />

          {errorMsg && (
            <div className="m-8 mb-0 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 font-bold text-sm">
              <AlertCircle size={20} />
              {typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="p-8 space-y-10">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <CompanySection
                  formData={formData}
                  updateField={updateField}
                  t={t}
                />
                <ManagerSection
                  formData={formData}
                  updateField={updateField}
                  t={t}
                />
              </div>

              <HoursSection
                formData={formData}
                updateHours={updateHours}
                t={t}
              />

              <RolesSection
                roles={formData.roles}
                addRole={addRole}
                removeRole={removeRole}
                updateRole={updateRole}
                updateStaffing={updateStaffing}
                t={t}
              />
            </div>

            <ModalFooter
              loading={loading}
              editingCompany={editingCompany}
              onClose={onClose}
              t={t}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProvisionModal;