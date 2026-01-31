import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center gap-2">
            <img 
              alt="SmartEstate Logo" 
              className="h-12 w-auto" 
              src="/icon.png" 
            />
            {/* Fallback text if logo doesn't have text, but design shows text next to logo */}
            <span className="font-display font-bold text-2xl text-gray-900 hidden sm:block">
              Smart<span className="text-primary">Estate</span>
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a className="text-sm font-medium text-gray-600 hover:text-primary transition-colors" href="#">Estate Management</a>
            <a className="text-sm font-medium text-gray-600 hover:text-primary transition-colors" href="#">Payments</a>
            <a className="text-sm font-medium text-gray-600 hover:text-primary transition-colors" href="#">Verification</a>
            <a className="text-sm font-medium text-gray-600 hover:text-primary transition-colors" href="#">Contact Sales</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-600 hover:text-primary hidden sm:block">Log in</Link>
            <Link to="/register" className="px-5 py-2.5 rounded-full bg-primary hover:bg-sky-600 text-white font-medium text-sm transition-all shadow-lg shadow-primary/20">Create Account</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
