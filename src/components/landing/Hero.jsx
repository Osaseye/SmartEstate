import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          alt="Modern Architectural Estate" 
          className="w-full h-full object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkjG2a5eCMFST4LT7R-XmtKf9awY8xQ2M0BkXm0v4O4vQtxyZA3TybVbO1ZfEqmjgqGvzkffd0RDOSOtG1Op4Un2up5WxR-VRiRs0pPKIo4NXqE106xLlmeE90EY0YkTk5wWtuS_5o8-zKSId-BUtL-cahx14HQxEruFdBRNuIUehSNRt5BSJ4ydjFui5GCuSbn9Eo8UWvQOwSqnrP8qTKh03kTiJIEMYU0P_b6jzAJ8OI1RZ9QOZWACwXcU3RBm16UvcazqZIySI" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-900/50"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-white leading-tight mb-6">
            Smart Management & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Estate Intelligence.</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl font-light">
            SmartEstate revolutionizes residential management. Verify tenants, track rent, and streamline maintenance requests in one secure platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register" className="px-8 py-4 rounded-xl bg-primary hover:bg-sky-600 text-white font-semibold text-lg transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
              Get Started
              <span className="material-icons-round text-xl">person_add</span>
            </Link>
            <Link to="/login" className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-lg transition-all flex items-center justify-center gap-2">
              <span className="material-icons-round text-xl">login</span>
              Login
            </Link>
          </div>
        </div>
      </div>
      
      {/* Visual Element: Glass Panel */}
      <div className="hidden lg:block absolute right-0 bottom-10 z-10 w-1/3 transform translate-x-12 scale-90">
        <div className="glass-panel p-6 rounded-l-3xl shadow-2xl border-r-0 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900 font-semibold flex items-center gap-2">
              <span className="material-icons-round text-secondary">verified_user</span> 
              Verified Tenants
            </h3>
            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> ACTIVE
            </span>
          </div>
          <div className="relative bg-white/90 rounded-xl p-4 mb-4 border border-gray-100">
            <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                  <span className="material-icons-round">person</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">New Tenant Request</p>
                  <p className="text-xs text-gray-500">Block C, Room 12</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono text-gray-500">STATUS</p>
                <p className="text-[10px] text-orange-500 font-bold">PENDING</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex -space-x-2">
                 {/* Visual avatars */}
                <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-gray-500 text-[10px]"><span className="material-icons-round text-sm">person</span></div>
              </div>
              <button className="bg-primary text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1">
                Review Application
              </button>
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <div className="flex-1 bg-white/60 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Total Residents</p>
              <p className="text-lg font-bold text-gray-900">1,240</p>
            </div>
            <div className="flex-1 bg-white/60 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Pending Requests</p>
              <p className="text-lg font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
