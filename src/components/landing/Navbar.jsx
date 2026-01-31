import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['features', 'payments', 'verification', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
          setActiveSection(section);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  const NavItem = ({ section, label }) => (
    <a 
      href={`#${section}`}
      onClick={(e) => scrollToSection(e, section)}
      className={`relative text-sm font-medium transition-colors ${
        activeSection === section ? 'text-primary' : 'text-gray-600 hover:text-primary'
      }`}
    >
      {label}
      {activeSection === section && (
        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
      )}
    </a>
  );

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
            <span className="font-display font-bold text-2xl text-gray-900 block">
              Smart<span className="text-primary">Estate</span>
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <NavItem section="features" label="Estate Management" />
            <NavItem section="payments" label="Payments" />
            <NavItem section="verification" label="Verification" />
            <NavItem section="contact" label="Contact Sales" />
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-600 hover:text-primary hidden sm:block">Log in</Link>
            <Link to="/register" className="px-5 py-2.5 rounded-full bg-primary hover:bg-sky-600 text-white font-medium text-sm transition-all shadow-lg shadow-primary/20">
              <span className="hidden sm:inline">Create Account</span>
              <span className="sm:hidden">Join Now</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
