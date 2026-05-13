import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profil from './pages/Profil';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard'; 
import Contact from './pages/Contact';
import DashboardLayout from './components/DashboardLayout';
import ScheduleCalendar from './pages/ScheduleCalendar';
import EmployeesPage from './pages/EmployeesPage';
import LeaveRequestPage from './pages/LeaveRequestPage';
import ShiftsPage from './pages/ShiftsPage'; 

const ProtectedRoute = ({ allowedRoles }) => {
    const role = localStorage.getItem('userRole');
    if (!role) return <Navigate to="/signin" />;

    const currentRole = normalizeRole(role);
    if (allowedRoles && !allowedRoles.includes(currentRole)) {
        return <Navigate to="/" />;
    }
    return <Outlet />; 
};

// Normalise les chaînes de rôles pour éviter les problèmes de casse ou de préfixes (ex: ROLE_MANAGER -> MANAGER)
const normalizeRole = (role) => {
    return String(role || '')
        .trim()
        .toUpperCase()
        .replace(/^ROLE_/, '');
};

export default function AppRoutes() {
    return (
        <Routes>
            {/* --- ROUTES PUBLIQUES (accessibles sans connexion) --- */}
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/contact" element={<Contact />} />

            {/* --- ROUTES PRIVÉES (nécessitent une connexion) --- */}
            <Route path="/profil" element={<Profil />} />

            {/* SECTION SUPER ADMIN : Gestion globale du système/entreprises */}
            <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/super-admin" element={<SuperAdminDashboard />} />
                    <Route path="/manage-companies" element={<div className="p-10 text-black">Manage Companies Page (TODO)</div>} />
                </Route>
            </Route>

            {/* SECTION GESTION : Réservée aux Managers et Assistants */}
            <Route element={<ProtectedRoute allowedRoles={['MANAGER', 'ASSISTANT_MANAGER']} />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/manager-dashboard" element={<ManagerDashboard />} />
                    <Route path="/schedule" element={<ScheduleCalendar />} />
                    <Route path="/employees" element={<EmployeesPage />} />
                    <Route path="/leave-requests" element={<LeaveRequestPage />} />
                    <Route path="/shifts" element={<ShiftsPage />} />
                </Route>
            </Route>
            
            {/* SECTION EMPLOYÉ : Espace personnel pour le pointage et les horaires */}
            <Route element={<ProtectedRoute allowedRoles={['EMPLOYEE', 'NEW_HIRE', 'TRAINEE']} />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
                </Route>
            </Route>            
            
            {/* Redirection 404 si la route n'existe pas */}
            <Route path="*" element={<div className="p-20 text-center text-black">404 - Page non trouvée</div>} />
        </Routes>
    );
}