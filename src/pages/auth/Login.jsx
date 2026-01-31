import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/layout/AuthLayout';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const result = login(formData.email, formData.password);
      
      if (result.success) {
        // Redirect based on role and onboarding status
        if (result.user.role === 'manager') {
          if (result.user.estateId) {
            navigate('/manager/dashboard');
          } else {
            navigate('/manager/onboarding');
          }
        } else {
          // Tenant: If assigned to estate, dashboard. If not, onboarding.
          if (result.user.estateId) {
            navigate('/tenant/dashboard');
          } else {
            navigate('/tenant/onboarding');
          }
        }
      } else {
        setError(result.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Enter your details to access your account."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
            <span className="material-icons-round text-lg">error_outline</span>
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-icons-round text-xl">mail_outline</span>
            <input 
              type="email" 
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
             <label className="block text-sm font-medium text-gray-700">Password</label>
             <a href="#" className="text-sm text-primary hover:underline font-medium">Forgot password?</a>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-icons-round text-xl">lock_outline</span>
            <input 
              type="password" 
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-primary hover:bg-sky-600 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account? 
          <Link to="/register" className="text-primary font-bold hover:underline ml-1">Create account</Link>
        </p>

        {/* Demo Credentials Helper */}
        <div className="mt-8 pt-6 border-t border-gray-100">
           <p className="text-xs text-center text-gray-400 uppercase font-bold tracking-wider mb-3">Demo Credentials</p>
           <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => setFormData({email: 'manager@test.com', password: 'password'})}
                className="text-xs bg-gray-50 hover:bg-gray-100 p-2 rounded text-gray-600 border border-gray-200 transition-colors"
              >
                Manager: manager@test.com
              </button>
              <button 
                type="button"
                onClick={() => setFormData({email: 'tenant@test.com', password: 'password'})}
                className="text-xs bg-gray-50 hover:bg-gray-100 p-2 rounded text-gray-600 border border-gray-200 transition-colors"
              >
                Tenant: tenant@test.com
              </button>
           </div>
        </div>
      </form>
    </AuthLayout>
  );
}
