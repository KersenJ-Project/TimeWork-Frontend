import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

import axios from 'axios';

import DashboardHeader from '../components/super-admin/dashboard/DashboardHeader';

import StatsSection from '../components/super-admin/dashboard/StatsSection';

import CompaniesTable from '../components/super-admin/dashboard/CompaniesTable';

import ProvisionModal from '../components/super-admin/provision/ProvisionModal';

const API_URL = 'http://localhost:3000';

const SuperAdminDashboard = () => {
  const [companies, setCompanies] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [searchTerm, setSearchTerm] =
    useState('');

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingCompany, setEditingCompany] =
    useState(null);

  const token =
    localStorage.getItem('token');

  const api = useMemo(() => {
    return axios.create({
      baseURL: API_URL,

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }, [token]);

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get(
        '/super-admin/companies'
      );

      setCompanies(res.data);
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          'Erreur lors du chargement'
      );
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const deleteCompany = async (id) => {
    const confirmDelete = window.confirm(
      'Supprimer cette entreprise ?'
    );

    if (!confirmDelete) return;

    try {
      await api.delete(
        `/super-admin/company/${id}`
      );

      setCompanies((prev) =>
        prev.filter((c) => c.id !== id)
      );
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          'Erreur lors de la suppression'
      );
    }
  };

  const handleEditCompany = async (
    company
  ) => {
    try {
      const res = await api.get(
        `/super-admin/company/${company.id}`
      );

      setEditingCompany(res.data);

      setIsModalOpen(true);
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          'Erreur lors du chargement de l’entreprise'
      );
    }
  };

  const handleCloseModal = () => {
    setEditingCompany(null);

    setIsModalOpen(false);
  };

  const filteredCompanies =
    companies.filter((company) =>
      company.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  return (
    <div className="w-full min-h-screen bg-[#F4F6FB] pt-24 flex justify-center">

      <div className="w-full px-4 lg:px-10">

        <main className="w-full">

          <div className="py-6 lg:py-10">

            <DashboardHeader
              onAddClient={() => {
                setEditingCompany(null);

                setIsModalOpen(true);
              }}
            />

            <StatsSection
              companies={companies}
            />

            <CompaniesTable
              companies={filteredCompanies}
              loading={loading}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onEdit={handleEditCompany}
              onDelete={deleteCompany}
            />

          </div>

        </main>

        <ProvisionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={fetchCompanies}
          editingCompany={editingCompany}
        />

      </div>

    </div>
  );
};

export default SuperAdminDashboard;