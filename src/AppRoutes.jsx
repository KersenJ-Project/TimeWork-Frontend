import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profil from './pages/Profil';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
// Importe ton nouveau dashboard ici
import SuperAdminDashboard from './pages/SuperAdminDashboard'; 
import Contact from './pages/Contact';

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

            {/* Routes Privées / Profil */}
            <Route path="/profil" element={<Profil />} />

            {/* Dashboards Spécifiques par Rôle */}
            <Route path="/super-admin" element={<SuperAdminDashboard />} />
            <Route path="/manager-dashboard" element={<ManagerDashboard />} />
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
            
            {/* Optionnel: Page 404 ou redirection si la route n'existe pas */}
            <Route path="*" element={<div className="p-20 text-center">404 - Page non trouvée</div>} />
        </Routes>
    );
}