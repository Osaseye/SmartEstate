import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import RoleSelection from './pages/RoleSelection';
import Login from './pages/auth/Login';
import RegisterManager from './pages/auth/RegisterManager';
import RegisterTenant from './pages/auth/RegisterTenant';
import ManagerOnboarding from './pages/manager/Onboarding';
import TenantOnboarding from './pages/tenant/Onboarding';

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
      <Route path="/manager/*" element={
        <ProtectedRoute allowedRole="manager">
           <Routes>
              <Route path="/" element={<Navigate to="dashboard" />} />
              <Route path="onboarding" element={<ManagerOnboarding />} />
              <Route path="dashboard" element={<div>Manager Dashboard</div>} />
              {/* Add more manager sub-routes here: /tenants, /payments */}
           </Routes>
        </ProtectedRoute>
      } />

      {/* Tenant Routes */}
      <Route path="/tenant/*" element={
        <ProtectedRoute allowedRole="tenant">
           <Routes>
              <Route path="/" element={<Navigate to="dashboard" />} />
              <Route path="onboarding" element={<TenantOnboarding />} />
              <Route path="dashboard" element={<div>Tenant Dashboard (Pending or Active)</div>} />
              {/* Add more tenant sub-routes here */}
           </Routes>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
