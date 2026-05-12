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

const ProtectedRoute = ({ allowedRoles }) => {
    const role = localStorage.getItem('userRole');
    if (!role) return <Navigate to="/signin" />;
    
    // Normaliser avec Trim et UpperCase au cas où
    const currentRole = String(role).toUpperCase().trim();
    if (allowedRoles && !allowedRoles.includes(currentRole)) {
        return <Navigate to="/" />;
    }
    return <Outlet />;
};

export default function AppRoutes() {
    return (
        <Routes>
            {/* Routes Publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/contact" element={<Contact />} />

            {/* Routes Privées / Profil / Contact */}
            <Route path="/profil" element={<Profil />} />
            <Route path="/contact" element={<Contact />} />

            {/* SUPER_ADMIN */}
            <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/super-admin" element={<SuperAdminDashboard />} />
                    <Route path="/manage-companies" element={<div className="p-10 text-black">Manage Companies Page (TODO)</div>} />
                </Route>
            </Route>

            {/* MANAGER */}
            <Route element={<ProtectedRoute allowedRoles={['MANAGER']} />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/manager-dashboard" element={<ManagerDashboard />} />
                    <Route path="/schedule" element={<ScheduleCalendar />} />
                    <Route path="/employees" element={<EmployeesPage />} />
                    <Route path="/leave-requests" element={<LeaveRequestPage />} />
                </Route>
            </Route>
            
            {/* EMPLOYEE */}
            <Route element={<ProtectedRoute allowedRoles={['EMPLOYEE', 'NEW_HIRE', 'ASSISTANT_MANAGER', 'TRAINEE']} />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
                </Route>
            </Route>            
            <Route path="*" element={<div className="p-20 text-center text-black">404 - Page non trouvée</div>} />
        </Routes>
    );
}