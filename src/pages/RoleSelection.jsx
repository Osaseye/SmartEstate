import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function RoleSelection() {
  const navigate = useNavigate();
  const [hoveredRole, setHoveredRole] = useState(null);

  const handleRoleSelect = (role) => {
    // Navigate to the onboarding/registration flow with the selected role
    // For now, we'll assume there are specific routes or we pass state
    console.log(`Selected role: ${role}`);
    // In a real app, this might go to /register/manager or /register/tenant
    // or /register?role=manager
    navigate(`/register/${role}`); 
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl w-full">
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
            <span className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-icons-round text-xl">arrow_back</span>
            </span>
            <span className="font-medium text-gray-500 group-hover:text-primary transition-colors">Back to Home</span>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <img src="/icon.png" alt="SmartEstate Logo" className="h-16 w-auto" />
            </div>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-gray-900 mb-4">
              How will you use <span className="text-primary">SmartEstate</span>?
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose your role to get started with the tailored experience for your needs.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-10 max-w-4xl mx-auto">
          {/* Manager Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`
              relative group cursor-pointer bg-white rounded-3xl p-8 border-2 transition-all duration-300
              ${hoveredRole === 'manager' ? 'border-primary shadow-2xl shadow-primary/10 scale-[1.02]' : 'border-transparent shadow-xl hover:border-gray-200'}
            `}
            onMouseEnter={() => setHoveredRole('manager')}
            onMouseLeave={() => setHoveredRole(null)}
            onClick={() => handleRoleSelect('manager')}
          >
            <div className={`
              w-16 h-16 rounded-2xl mb-6 flex items-center justify-center text-3xl transition-colors duration-300
              ${hoveredRole === 'manager' ? 'bg-primary text-white' : 'bg-blue-50 text-primary'}
            `}>
              <span className="material-icons-round">admin_panel_settings</span>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Estate Manager</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              I manage residential properties. I need features to track payments, verify tenants, and handle maintenance requests.
            </p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="material-icons-round text-green-500 text-lg">check_circle</span>
                Tenant Verification System
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="material-icons-round text-green-500 text-lg">check_circle</span>
                Rent Collection & Tracking
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="material-icons-round text-green-500 text-lg">check_circle</span>
                Maintenance Oversight
              </li>
            </ul>

            <div className={`
              w-full py-3 rounded-xl font-semibold text-center transition-all duration-300
              ${hoveredRole === 'manager' ? 'bg-primary text-white' : 'bg-gray-50 text-gray-900 group-hover:bg-gray-100'}
            `}>
              Continue as Manager
            </div>
          </motion.div>

          {/* Tenant Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`
              relative group cursor-pointer bg-white rounded-3xl p-8 border-2 transition-all duration-300
              ${hoveredRole === 'tenant' ? 'border-secondary shadow-2xl shadow-secondary/10 scale-[1.02]' : 'border-transparent shadow-xl hover:border-gray-200'}
            `}
            onMouseEnter={() => setHoveredRole('tenant')}
            onMouseLeave={() => setHoveredRole(null)}
            onClick={() => handleRoleSelect('tenant')}
          >
             <div className={`
              w-16 h-16 rounded-2xl mb-6 flex items-center justify-center text-3xl transition-colors duration-300
              ${hoveredRole === 'tenant' ? 'bg-secondary text-white' : 'bg-green-50 text-secondary'}
            `}>
              <span className="material-icons-round">home</span>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Resident / Tenant</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              I live in an estate. I want to pay my rent securely, report issues, and receive updates from management.
            </p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="material-icons-round text-green-500 text-lg">check_circle</span>
                Easy Rent Payments
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="material-icons-round text-green-500 text-lg">check_circle</span>
                Submit Maintenance Requests
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="material-icons-round text-green-500 text-lg">check_circle</span>
                Community Updates
              </li>
            </ul>

            <div className={`
              w-full py-3 rounded-xl font-semibold text-center transition-all duration-300
              ${hoveredRole === 'tenant' ? 'bg-secondary text-white' : 'bg-gray-50 text-gray-900 group-hover:bg-gray-100'}
            `}>
              Continue as Resident
            </div>
          </motion.div>
        </div>
        
        <p className="text-center mt-12 text-gray-500">
          Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Log in here</Link>
        </p>
      </div>
    </div>
  );
}
