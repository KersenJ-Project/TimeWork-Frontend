import React, { useState, useEffect } from 'react';
import axios from 'axios';

import ModalHeader from './ModalHeader';
import ModalFooter from './ModalFooter';
import CompanySection from './CompanySection';
import ManagerSection from './ManagerSection';
import HoursSection from './HoursSection';
import RolesSection from './RolesSection';

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
  const [loading, setLoading] = useState(false);

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
  }, [editingCompany]);

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

  try {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    const formattedHours = {};
    Object.entries(formData.operatingHours).forEach(([day, hours]) => {
      const isClosed = hours.open === hours.close;
      formattedHours[day] = {
        ...hours,
        isOpen: !isClosed,
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
        alert('Entreprise modifiée avec succès');
      } else {
        const res = await axios.post(
          'http://localhost:3000/super-admin/provision',
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        alert(`
          Déploiement réussi !

          Code entreprise:
          ${res.data.companyCode}

          Mot de passe temporaire:
          ${res.data.tempPassword}
        `);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message || 'Erreur lors du provisioning'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl bg-white rounded-[2rem] shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]">
          <ModalHeader editingCompany={editingCompany} onClose={onClose} />

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="p-8 space-y-10">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <CompanySection
                  formData={formData}
                  updateField={updateField}
                />
                <ManagerSection
                  formData={formData}
                  updateField={updateField}
                />
              </div>

              <HoursSection
                formData={formData}
                updateHours={updateHours}
              />

              <RolesSection
                roles={formData.roles}
                addRole={addRole}
                removeRole={removeRole}
                updateRole={updateRole}
                updateStaffing={updateStaffing}
              />
            </div>

            <ModalFooter
              loading={loading}
              editingCompany={editingCompany}
              onClose={onClose}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProvisionModal;