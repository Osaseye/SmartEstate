import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/layout/AuthLayout';

export default function RegisterTenant() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    estateCode: '' // Placeholder for future feature
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const result = register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'tenant',
        verificationStatus: 'pending',
        estateCode: formData.estateCode
      });
      
      if (result.success) {
        if (result.user.estateId) {
          navigate('/tenant/dashboard');
        } else {
          navigate('/tenant/onboarding');
        }
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create Resident Account" 
      subtitle="Join your estate community."
      backLink="/register"
    >
      <div className="bg-green-50 text-secondary px-4 py-3 rounded-xl mb-6 flex items-start gap-3">
        <span className="material-icons-round mt-0.5">home</span>
        <div className="text-sm">
           <p className="font-bold">Resident Account</p>
           <p className="opacity-90">Pay rent, request maintenance, and get updates. Most features require estate verification.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
            <span className="material-icons-round text-lg">error_outline</span>
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
          <input 
            type="text" 
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all bg-gray-50 focus:bg-white"
            placeholder="Jane Doe"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
          <input 
            type="email" 
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all bg-gray-50 focus:bg-white"
            placeholder="jane@example.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
          <input 
            type="tel" 
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all bg-gray-50 focus:bg-white"
            placeholder="+234 800 000 0000"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>
        
        {/* Placeholder for Estate Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Estate Code (Optional)</label>
          <input 
            type="text" 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all bg-gray-50 focus:bg-white"
            placeholder="Enter code provided by manager"
            value={formData.estateCode}
            onChange={(e) => setFormData({...formData, estateCode: e.target.value})}
          />
          <p className="text-xs text-gray-500 mt-1">If you don't have one, your manager can add you manually later.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>
        </div>

        <div className="pt-2">
            <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-secondary hover:bg-green-600 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-secondary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
            {loading ? 'Creating Account...' : 'Create Resident Account'}
            </button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-4">
          Already have an account? 
          <Link to="/login" className="text-secondary font-bold hover:underline ml-1">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
