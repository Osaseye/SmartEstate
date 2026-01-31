import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden min-h-screen flex items-center">
      <div className="absolute inset-0 z-0">
        <img 
          alt="Modern Architectural Estate" 
          className="w-full h-full object-cover" 
          src="/images/estate(2).jpg" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-900/50"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl text-white leading-tight mb-6">
            Smart Management & <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Estate Intelligence.</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            SmartEstate revolutionizes residential management. Verify tenants, track rent, and streamline maintenance requests in one secure platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="px-8 py-5 rounded-xl bg-primary hover:bg-sky-600 text-white font-semibold text-xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 transform hover:-translate-y-1">
              Get Started
              <span className="material-icons-round text-2xl">rocket_launch</span>
            </Link>
            <Link to="/login" className="px-8 py-5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-xl transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1">
              <span className="material-icons-round text-2xl">login</span>
              Login
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
