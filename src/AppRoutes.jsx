import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profil from './pages/Profil';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import ManageCompanies from './pages/ManageCompanies';
import DashboardLayout from './components/DashboardLayout';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            <Route element={<DashboardLayout />}>
                <Route path="/manager-dashboard" element={<ManagerDashboard />} />
                <Route path="/profil" element={<Profil />} />
                <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />
                <Route path="/manage-companies" element={<ManageCompanies />} />
            </Route>
            
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        </Routes>
    );
}