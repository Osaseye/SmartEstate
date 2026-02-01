import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import RoleSelection from './pages/RoleSelection';
import Login from './pages/auth/Login';
import RegisterManager from './pages/auth/RegisterManager';
import RegisterTenant from './pages/auth/RegisterTenant';
import ManagerOnboarding from './pages/manager/Onboarding';
import AddUnit from './pages/manager/AddUnit';
import PropertyDetails from './pages/manager/PropertyDetails';
import TenantOnboarding from './pages/tenant/Onboarding';
import ManagerDashboard from './pages/manager/Dashboard';
import ManagerProperties from './pages/manager/Properties';
import ManagerTenants from './pages/manager/Tenants';
import ManagerMaintenance from './pages/manager/Maintenance';
import ManagerFinance from './pages/manager/Payments';
import ManagerCommunity from './pages/manager/Community';
import ManagerSettings from './pages/manager/Settings';
import TenantDashboard from './pages/tenant/Dashboard';
import Payments from './pages/tenant/Payments';
import MakePayment from './pages/tenant/MakePayment';
import TransactionDetails from './pages/tenant/TransactionDetails';
import Maintenance from './pages/tenant/Maintenance';
import NewMaintenance from './pages/tenant/NewMaintenance';
import MaintenanceDetails from './pages/tenant/MaintenanceDetails';
import Settings from './pages/tenant/Settings';
import Community from './pages/tenant/Community';
import DashboardLayout from './components/layout/DashboardLayout';

// ----------------------------------------------------------------------
// Protected Route Wrappers (Structural Placeholders)
// ----------------------------------------------------------------------

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>; // Simple loading state
  
  if (!user) return <Navigate to="/login" replace />;
  
  if (allowedRole && user.role !== allowedRole) {
    // Redirect to their correct dashboard if they are the wrong role
    return <Navigate to={user.role === 'manager' ? '/manager' : '/tenant'} replace />;
  }

  return children;
};

// ----------------------------------------------------------------------
// App Structure
// ----------------------------------------------------------------------

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      
      {/* Registration Flow */}
      <Route path="/register" element={<RoleSelection />} />
      <Route path="/register/manager" element={<RegisterManager />} />
      <Route path="/register/tenant" element={<RegisterTenant />} />

      {/* Manager Routes */}
      <Route path="/manager/onboarding" element={
        <ProtectedRoute allowedRole="manager">
           <ManagerOnboarding />
        </ProtectedRoute>
      } />
      
      <Route path="/manager" element={
        <ProtectedRoute allowedRole="manager">
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<ManagerDashboard />} />
        <Route path="dashboard" element={<Navigate to="/manager" replace />} />
        <Route path="properties" element={<ManagerProperties />} />
        <Route path="properties/new" element={<AddUnit />} />
        <Route path="properties/:id" element={<PropertyDetails />} />
        <Route path="tenants" element={<ManagerTenants />} />
        <Route path="maintenance" element={<ManagerMaintenance />} />
        <Route path="payments" element={<ManagerFinance />} />
        <Route path="community" element={<ManagerCommunity />} />
        <Route path="settings" element={<ManagerSettings />} />
        {/* Add more manager sub-routes here: /tenants, /payments */}
      </Route>

      {/* Tenant Routes */}
      <Route path="/tenant/onboarding" element={
        <ProtectedRoute allowedRole="tenant">
           <TenantOnboarding />
        </ProtectedRoute>
      } />

      <Route path="/tenant" element={
        <ProtectedRoute allowedRole="tenant">
          <DashboardLayout />
        </ProtectedRoute>
      }>
         <Route index element={<TenantDashboard />} />
         <Route path="payments" element={<Payments />} />
         <Route path="payments/new" element={<MakePayment />} />
         <Route path="payments/:id" element={<TransactionDetails />} />
         
         {/* Maintenance Routes */}
         <Route path="maintenance" element={<Maintenance />} />
         <Route path="maintenance/new" element={<NewMaintenance />} />
         <Route path="maintenance/:id" element={<MaintenanceDetails />} />

         <Route path="announcements" element={<Community />} />
         <Route path="settings" element={<Settings />} />

         <Route path="dashboard" element={<Navigate to="/tenant" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
