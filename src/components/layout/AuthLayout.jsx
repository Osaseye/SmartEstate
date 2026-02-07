import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthLayout({ children, title, subtitle, backLink = "/" }) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-white flex">
      {/* Left Side: Visual */}
      <div className="hidden lg:flex w-1/2 h-full bg-slate-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/estate(2).jpg" 
            alt="Estate Background" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-800/50"></div>
        </div>
        
        <div className="relative z-10 p-12 max-w-lg text-white">
          <Link to="/" className="inline-block mb-12">
             <div className="flex items-center gap-3">
                <img src="/icon.png" alt="Logo" className="h-10 w-auto" />
                <span className="font-display font-bold text-2xl">SmartEstate</span>
             </div>
          </Link>
          
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="font-display text-4xl font-bold mb-6 leading-tight">
              Manage your residential community with confidence.
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              Join thousands of estate managers and residents who enjoy seamless payments, verified security, and instant communication.
            </p>
            
            <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
               <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700"></div>
                  ))}
               </div>
               <span>Trusted by 500+ Estates</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div 
        className="w-full lg:w-1/2 h-full overflow-y-auto bg-slate-50 lg:bg-white relative no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="min-h-full flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-12 pt-24 lg:pt-12">
          {/* Mobile Header */}
          <div className="lg:hidden absolute top-8 left-6 z-20">
             <Link to="/" className="flex items-center gap-2">
                <img src="/icon.png" alt="Logo" className="h-8 w-auto" />
                <span className="font-display font-bold text-xl text-gray-900">SmartEstate</span>
             </Link>
          </div>

          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6 }}
             className="w-full max-w-md mx-auto"
          >
             <div className="mb-10">
                <Link to={backLink} className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 mb-6 transition-colors">
                  <span className="material-icons-round text-base">arrow_back</span>
                  Back
                </Link>
                <h1 className="font-display font-bold text-3xl text-gray-900 mb-2">{title}</h1>
                {subtitle && <p className="text-gray-500">{subtitle}</p>}
             </div>
             
             {children}
          </motion.div>
          
          <div className="mt-12 text-center text-sm text-gray-400">
             &copy; {new Date().getFullYear()} SmartEstate. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
