import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <>
      <section className="py-20 bg-gradient-to-br from-primary to-sky-600 dark:from-sky-900 dark:to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute inset-0 z-0">
          <img alt="Modern Nigerian Estate" className="w-full h-full object-cover opacity-20 mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkjG2a5eCMFST4LT7R-XmtKf9awY8xQ2M0BkXm0v4O4vQtxyZA3TybVbO1ZfEqmjgqGvzkffd0RDOSOtG1Op4Un2up5WxR-VRiRs0pPKIo4NXqE106xLlmeE90EY0YkTk5wWtuS_5o8-zKSId-BUtL-cahx14HQxEruFdBRNuIUehSNRt5BSJ4ydjFui5GCuSbn9Eo8UWvQOwSqnrP8qTKh03kTiJIEMYU0P_b6jzAJ8OI1RZ9QOZWACwXcU3RBm16UvcazqZIySI" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="font-display text-4xl font-bold mb-6">Ready to secure your estate?</h2>
          <p className="text-blue-100 text-lg mb-10">Join over 10,000 property managers in Nigeria using SmartEstate to improve security and collections.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="bg-white text-primary px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-lg">Create Account</Link>
            <Link to="/login" className="bg-transparent border border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition">Login</Link>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img alt="Logo" className="h-8 w-auto" src="/icon.png" />
                <span className="font-display font-bold text-xl text-gray-900">Smart<span className="text-primary">Estate</span></span>
              </div>
              <p className="text-gray-500 text-sm mb-6 max-w-xs">
                Empowering estate communities with secure access control and automated management.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a className="hover:text-primary" href="#">Estate Management</a></li>
                <li><a className="hover:text-primary" href="#">Payment Receipts</a></li>
                <li><a className="hover:text-primary" href="#">Resident App</a></li>
                <li><a className="hover:text-primary" href="#">Manager Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a className="hover:text-primary" href="#">About Us</a></li>
                <li><a className="hover:text-primary" href="#">Careers</a></li>
                <li><a className="hover:text-primary" href="#">Blog</a></li>
                <li><a className="hover:text-primary" href="#">Contact Sales</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a className="hover:text-primary" href="#">Help Center</a></li>
                <li><a className="hover:text-primary" href="#">Privacy Policy</a></li>
                <li><a className="hover:text-primary" href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">© 2026 SmartEstate Inc. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-xs text-gray-500">All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
