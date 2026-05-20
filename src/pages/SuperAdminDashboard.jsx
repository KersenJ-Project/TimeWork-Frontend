import React, {
    useState,
    useEffect,
    useCallback,
    useMemo,
} from 'react';
import { X } from 'lucide-react';

import axios from 'axios';
import DashboardHeader from '../components/super-admin/dashboard/DashboardHeader';
import StatsSection from '../components/super-admin/dashboard/StatsSection';
import CompaniesTable from '../components/super-admin/dashboard/CompaniesTable';
import ProvisionModal from '../components/super-admin/provision/provisionModal';

const API_URL = 'http://localhost:3000';
import { useLanguage } from '../context/LanguageContext';
import { superadminTranslations } from '../translations/superadmin';

const SuperAdminDashboard = () => {
    const { lang } = useLanguage();
    const currentLang = lang ? lang.toLowerCase() : 'fr';
    const t = superadminTranslations[currentLang] || superadminTranslations['fr'];
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

    const [errorMsg, setErrorMsg] = useState(null);

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
            setErrorMsg(
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

    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    const deleteCompany = async (id) => {
        setDeleteConfirmId(id);
    };

    const confirmDelete = async () => {
        const id = deleteConfirmId;
        setDeleteConfirmId(null);
        try {
            await api.delete(
                `/super-admin/company/${id}`
            );

            setCompanies((prev) =>
                prev.filter((c) => c.id !== id)
            );
        } catch (err) {
            console.error(err);
            setErrorMsg(
                err?.response?.data?.message ||
                t.deleteError
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
            setErrorMsg(
                err?.response?.data?.message ||
                t.loadError
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
        <div className="w-full min-h-screen bg-[#020617] text-white pt-24 flex justify-center">

            <div className="w-full px-4 lg:px-10">

                <main className="w-full">

                    <div className="py-6 lg:py-10">

                        {errorMsg && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl font-bold flex justify-between items-center mb-6 text-sm">
                                {errorMsg}
                                <button onClick={() => setErrorMsg(null)}><X size={20} /></button>
                            </div>
                        )}

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

                {deleteConfirmId && (
                    <div className="fixed inset-0 bg-[#020617]/90 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 text-white">
                        <div className="bg-slate-900 border border-red-500/20 p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl relative text-center">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <X className="text-red-500" size={32} />
                            </div>
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2 text-red-400">{t.deleteTitle}</h2>
                            <p className="text-slate-400 font-bold mb-8 text-sm">
                                {t.deleteDesc}
                            </p>
                            <div className="flex gap-4">
                                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 bg-slate-800 text-white font-black py-4 rounded-xl hover:bg-slate-700 transition uppercase tracking-widest text-xs">{t.cancel}</button>
                                <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white font-black py-4 rounded-xl hover:bg-red-500 transition shadow-lg shadow-red-500/20 uppercase tracking-widest text-xs">{t.delete}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
