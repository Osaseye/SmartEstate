import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MockService } from '../../services/mockService';
import { 
  Users, 
  Building2, 
  CreditCard, 
  ArrowUpRight, 
  Plus, 
  Search,
  MoreHorizontal,
  Wallet
} from 'lucide-react';
import { cn } from '../../lib/utils';

const StatCard = ({ title, value, subtext, icon: Icon, colorClass, trend }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-xl transition-colors", colorClass)}>
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
          <ArrowUpRight className="w-3 h-3" /> {trend}
        </span>
      )}
    </div>
    
    <div>
      <h3 className="text-3xl font-bold text-slate-900 font-display mb-1">{value}</h3>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      {subtext && <p className="text-xs text-slate-400 mt-2">{subtext}</p>}
    </div>
  </div>
);

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [estate, setEstate] = useState(null);
  const [stats, setStats] = useState({
    totalTenants: 0,
    pendingRequests: 0,
    occupancyRate: '0%',
    revenue: '₦0.00'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      try {
        const data = MockService.getAll();
        const myEstate = data.estates.find(e => e.managerId === user.id);
        
        if (myEstate) {
          const estateTenants = data.users.filter(u => u.role === 'tenant' && u.estateId === myEstate.id);
          const verifiedTenants = estateTenants.filter(u => u.verificationStatus === 'verified');
          const pendingTenants = estateTenants.filter(u => u.verificationStatus === 'pending');
          
          setEstate(myEstate);
          setStats({
            totalTenants: verifiedTenants.length,
            pendingRequests: pendingTenants.length,
            occupancyRate: '78%', 
            revenue: '₦4,250,000'
          });
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  // Empty State
  if (!estate) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center max-w-lg mx-auto bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary animate-pulse">
            <Building2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 font-display mb-3">Welcome, Manager!</h2>
          <p className="text-slate-500 mb-8 leading-relaxed max-w-md mx-auto">
            You haven't been assigned to an estate yet. Create your first estate profile to start managing tenants and payments effectively.
          </p>
          <Link 
            to="/manager/onboarding" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white text-lg font-bold rounded-xl hover:bg-sky-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            Create New Estate
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Dashboard Overview</h1>
          <p className="text-slate-500">Managing <span className="font-semibold text-slate-700">{estate.name}</span></p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
          <Link to="/manager/tenants" className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors">
            <Plus className="w-4 h-4" />
            Add Tenant
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Revenue" 
          value={stats.revenue} 
          icon={Wallet} 
          colorClass="bg-green-100 text-green-600"
          trend="+12.5%"
        />
        <StatCard 
          title="Active Tenants" 
          value={stats.totalTenants} 
          icon={Users} 
          colorClass="bg-blue-100 text-blue-600"
          subtext={`${stats.totalTenants} units occupied`}
        />
        <StatCard 
          title="Pending Requests" 
          value={stats.pendingRequests} 
          icon={Users} 
          colorClass="bg-orange-100 text-orange-600"
          subtext="Requires attention"
        />
        <StatCard 
          title="Occupancy Rate" 
          value={stats.occupancyRate} 
          icon={Building2} 
          colorClass="bg-purple-100 text-purple-600"
          trend="+2.4%"
        />
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Activity / Tenants List */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-slate-900 font-display">Recent Payments</h3>
              <Link to="/manager/payments" className="text-sm font-bold text-primary hover:text-sky-700">View All</Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 pl-2">Tenant</th>
                    <th className="pb-3">Unit</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 pr-2 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {[1, 2, 3].map((_, i) => (
                     <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                       <td className="py-4 pl-2">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">JD</div>
                           <span className="font-semibold text-slate-900 text-sm">John Doe</span>
                         </div>
                       </td>
                       <td className="py-4 text-sm text-slate-500">Unit 4B</td>
                       <td className="py-4 font-mono font-medium text-slate-700">₦250,000</td>
                       <td className="py-4">
                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                           Paid
                         </span>
                       </td>
                       <td className="py-4 pr-2 text-right text-sm text-slate-400">2 mins ago</td>
                     </tr>
                   ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Side Widgets */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Estate Profile Widget */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
             
             <div className="relative z-10">
               <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 border border-white/10">
                 <Building2 className="w-6 h-6 text-white" />
               </div>
               <h3 className="text-xl font-bold font-display mb-1">{estate.name}</h3>
               <p className="text-slate-400 text-sm mb-6">{estate.address}</p>
               
               <div className="space-y-3">
                 <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                   <span className="text-slate-400">Total Units</span>
                   <span className="font-bold">24</span>
                 </div>
                 <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                   <span className="text-slate-400">Occupied</span>
                   <span className="font-bold">18</span>
                 </div>
                 <div className="flex justify-between items-center text-sm pb-1">
                   <span className="text-slate-400">Maintenance</span>
                   <span className="font-bold text-orange-400">3 Pending</span>
                 </div>
               </div>
               
               <button className="w-full mt-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors">
                 Manage Estate
               </button>
             </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}