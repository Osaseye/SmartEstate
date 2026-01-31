import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing'; // Existing file

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
      <Route path="/login" element={<div>Login Page (Coming Soon)</div>} />
      <Route path="/register" element={<div>Register Page (Coming Soon)</div>} />

      {/* Manager Routes */}
      <Route path="/manager/*" element={
        <ProtectedRoute allowedRole="manager">
           <Routes>
              <Route path="/" element={<Navigate to="dashboard" />} />
              <Route path="onboarding" element={<div>Manager Onboarding (Estate Setup)</div>} />
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
              <Route path="onboarding" element={<div>Tenant Onboarding (Find Estate)</div>} />
              <Route path="dashboard" element={<div>Tenant Dashboard (My House)</div>} />
              {/* Add more tenant sub-routes here: /payments, /maintenance */}
           </Routes>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
