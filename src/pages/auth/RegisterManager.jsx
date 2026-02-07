import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/layout/AuthLayout';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterManager() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Manager Email Validation
    const managerEmailRegex = /^[a-zA-Z0-9]+-smartestate@gmail\.com$/;
    if (!managerEmailRegex.test(formData.email)) {
      setError('Manager email must follow the format: [estate]-smartestate@gmail.com');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'manager'
      });
      
      if (result.success) {
        if (result.user.estateId) {
          navigate('/manager/dashboard');
        } else {
          navigate('/manager/onboarding');
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
      title="Create Manager Account" 
      subtitle="Start managing your estate smarter today."
      backLink="/register"
    >
      <div className="bg-blue-50 text-primary px-4 py-3 rounded-xl mb-6 flex items-start gap-3">
        <span className="material-icons-round mt-0.5">admin_panel_settings</span>
        <div className="text-sm">
           <p className="font-bold">Manager Account</p>
           <p className="opacity-90">You will have access to estate setup, tenant verification, and payment tracking.</p>
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
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
          <input 
            type="email" 
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white"
            placeholder="[estate]-smartestate@gmail.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <p className="text-xs text-slate-500 mt-1">Must end with -smartestate@gmail.com</p>
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
           <input 
             type="tel" 
             required
             className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white"
             placeholder="+234..."
             value={formData.phone}
             onChange={(e) => setFormData({...formData, phone: e.target.value})}
           />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
           <div className="relative">
             <input 
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white pr-12"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
             />
             <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
             >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
             </button>
           </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
           <div className="relative">
             <input 
                type={showConfirm ? "text" : "password"}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white pr-12"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
             />
             <button 
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
             >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
             </button>
           </div>
        </div>

        <div className="pt-2">
            <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-sky-600 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
            {loading ? 'Creating Account...' : 'Create Manager Account'}
            </button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-4">
          Already have an account? 
          <Link to="/login" className="text-primary font-bold hover:underline ml-1">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
