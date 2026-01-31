import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex items-center">
      <div className="absolute inset-0 z-0">
        <img 
          alt="Modern Architectural Estate" 
          className="w-full h-full object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkjG2a5eCMFST4LT7R-XmtKf9awY8xQ2M0BkXm0v4O4vQtxyZA3TybVbO1ZfEqmjgqGvzkffd0RDOSOtG1Op4Un2up5WxR-VRiRs0pPKIo4NXqE106xLlmeE90EY0YkTk5wWtuS_5o8-zKSId-BUtL-cahx14HQxEruFdBRNuIUehSNRt5BSJ4ydjFui5GCuSbn9Eo8UWvQOwSqnrP8qTKh03kTiJIEMYU0P_b6jzAJ8OI1RZ9QOZWACwXcU3RBm16UvcazqZIySI" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-900/50"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <h1 className="font-display font-bold text-5xl sm:text-7xl lg:text-8xl text-white leading-tight mb-8">
            Smart Management & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Estate Intelligence.</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-2xl font-light">
            SmartEstate revolutionizes residential management. Verify tenants, track rent, and streamline maintenance requests in one secure platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register" className="px-8 py-5 rounded-xl bg-primary hover:bg-sky-600 text-white font-semibold text-xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
              Get Started
              <span className="material-icons-round text-2xl">person_add</span>
            </Link>
            <Link to="/login" className="px-8 py-5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-xl transition-all flex items-center justify-center gap-2">
              <span className="material-icons-round text-2xl">login</span>
              Login
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Visual Element: Glass Panel */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 z-10 w-[45%] max-w-[600px] transform translate-x-12"
      >
        <div className="glass-panel p-8 rounded-l-3xl shadow-2xl border-r-0 backdrop-blur-xl h-full min-h-[500px] flex flex-col justify-center">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-gray-900 font-semibold flex items-center gap-2 text-xl">
              <span className="material-icons-round text-secondary text-2xl">verified_user</span> 
              Verified Tenants
            </h3>
            <span className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span> ACTIVE
            </span>
          </div>

          <div className="relative bg-white/90 rounded-2xl p-6 mb-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                  <span className="material-icons-round text-2xl">person</span>
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900">New Tenant Request</p>
                  <p className="text-sm text-gray-500">Block C, Room 12</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono text-gray-500">STATUS</p>
                <p className="text-xs text-orange-500 font-bold">PENDING</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-gray-500 text-xs"><span className="material-icons-round text-lg">person</span></div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-300 flex items-center justify-center text-gray-500 text-xs"><span className="material-icons-round text-lg">person</span></div>
              </div>
              <button className="bg-primary text-white text-sm px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-sky-600 transition-colors">
                Review Application
              </button>
            </div>
          </div>

          <div className="relative bg-white/90 rounded-2xl p-6 mb-6 border border-gray-100 shadow-sm opacity-80 scale-[0.98]">
             <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <span className="material-icons-round">payments</span>
                   </div>
                   <div>
                       <p className="font-bold text-gray-900">Rent Payment</p>
                       <p className="text-xs text-gray-500">₦2,500,000 / Year</p>
                   </div>
                </div>
                <span className="text-green-600 font-bold text-sm">+ RECEIVED</span>
             </div>
          </div>

          <div className="mt-auto flex gap-6">
            <div className="flex-1 bg-white/60 p-4 rounded-xl">
              <p className="text-sm text-gray-500">Total Residents</p>
              <p className="text-2xl font-bold text-gray-900">1,240</p>
            </div>
            <div className="flex-1 bg-white/60 p-4 rounded-xl">
              <p className="text-sm text-gray-500">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
