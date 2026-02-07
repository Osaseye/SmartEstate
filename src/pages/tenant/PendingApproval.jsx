import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Lock, LogOut } from 'lucide-react';

export default function PendingApproval() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl p-8 border border-slate-100 shadow-xl text-center space-y-6">
        
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto text-orange-500 border-4 border-orange-100">
           <Lock className="w-10 h-10" />
        </div>

        <div className="space-y-2">
            <h1 className="text-2xl font-bold font-display text-slate-900">Access Restricted</h1>
            <p className="text-slate-500">
                Hi <span className="font-semibold text-slate-900">{user?.name}</span>, your account is currently under review by the estate manager.
            </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-600">
           <p>You cannot access the dashboard, payments, or maintenance features until your residency is verified.</p>
        </div>

        <div className="pt-4 flex flex-col gap-3">
            <button 
                onClick={logout}
                className="w-full py-3 px-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
                <LogOut className="w-4 h-4" /> Sign Out
            </button>
            <Link to="/" className="text-slate-400 hover:text-slate-600 text-sm font-medium">
                Back to Home
            </Link>
        </div>

      </div>
    </div>
  );
}