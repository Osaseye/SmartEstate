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
  Wallet,
  MapPin,
  Settings,
  Bell,
  Wrench,
  UserPlus,
  FileText
} from 'lucide-react';
import { cn } from '../../lib/utils';
// import { FaMoneyBillWave } from 'react-icons/fa'; // Unused

const StatCard = ({ title, value, subtext, icon: Icon, colorClass, trend }) => (
  <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-2 md:p-3 rounded-xl transition-colors", colorClass)}>
        <Icon className="w-5 h-5 md:w-6 md:h-6" />
      </div>
      {trend && (
        <span className="text-[10px] md:text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
          <ArrowUpRight className="w-3 h-3" /> {trend}
        </span>
      )}
    </div>
    
    <div>
      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 font-display mb-1">{value}</h3>
      <p className="text-xs md:text-sm font-medium text-slate-500">{title}</p>
      {subtext && <p className="text-[10px] md:text-xs text-slate-400 mt-2">{subtext}</p>}
    </div>
  </div>
);

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [estate, setEstate] = useState(null);
  const [stats, setStats] = useState({
    totalTenants: 0,
    pendingRequests: 0,
    activeMaintenance: 0,
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
          const activeMaintenance = (data.maintenance || []).filter(m => m.status !== 'resolved').length;
          
          setEstate(myEstate);
          setStats({
            totalTenants: verifiedTenants.length,
            pendingRequests: pendingTenants.length,
            activeMaintenance: activeMaintenance,
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

  // Empty State - No Estate Created
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
      
      {/* 1. Hero Banner (Estate Profile) */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[280px] shadow-sm flex flex-col justify-end p-8 group">
         
         {/* Background Image & Overlay */}
         <div className="absolute inset-0 z-0">
             {estate.image ? (
                 <img src={estate.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Estate" />
             ) : (
                 <div className="w-full h-full bg-slate-800" />
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/20" />
         </div>

         {/* Banner Content */}
         <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2">
                     <Building2 className="w-3 h-3" /> Managed Estate
                 </div>
                 <h1 className="text-4xl md:text-5xl font-bold font-display">{estate.name}</h1>
                 <p className="text-slate-300 text-lg font-light flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-400" /> {estate.address}
                 </p>
            </div>

            {/* Banner Quick Stats */}
            <div className="flex items-center gap-8 bg-black/20 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/5">
                 <div className="text-right">
                    <div className="text-3xl font-bold text-white">{stats.totalTenants}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Tenants</div>
                 </div>
                 <div className="w-px h-10 bg-white/10" />
                 <div className="text-right">
                    <div className="text-3xl font-bold text-white">{stats.occupancyRate}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Occupancy</div>
                 </div>
            </div>
         </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Units" 
          value="24" 
          icon={Building2} 
          colorClass="bg-emerald-100 text-emerald-600"
          subtext="Managed Properties"
        />
        <StatCard 
          title="Maintenance Pending" 
          value={stats.activeMaintenance} 
          icon={Wrench} 
          colorClass="bg-orange-100 text-orange-600"
          subtext="3 High Priority"
        />
        <StatCard 
          title="Verification Requests" 
          value={stats.pendingRequests} 
          icon={UserPlus} 
          colorClass="bg-blue-100 text-blue-600"
          subtext="New signups awaiting approval"
        />
        <StatCard 
          title="Occupied Units" 
          value={stats.totalTenants} 
          icon={Building2} 
          colorClass="bg-purple-100 text-purple-600"
          subtext="Out of 24 Total Units"
        />
      </div>

      {/* 3. Main Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Primary Info) */}
        <div className="lg:col-span-2 space-y-8">
           
           {/* Recent Payments Table */}
           <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
             <div className="flex items-center justify-between mb-6">
               <h3 className="font-bold text-lg text-slate-900 font-display">Recent Payments</h3>
               <Link to="/manager/payments" className="text-sm font-bold text-primary hover:text-sky-700 hover:underline">View All Records</Link>
             </div>
             
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                     <th className="pb-3 pl-2">Tenant</th>
                     <th className="pb-3">Unit</th>
                     <th className="pb-3">Payment</th>
                     <th className="pb-3">Status</th>
                     <th className="pb-3 pr-2 text-right">Date</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {[1, 2, 3].map((_, i) => (
                      <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 pl-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs shadow-inner">JD</div>
                            <span className="font-semibold text-slate-900 text-sm">John Doe</span>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-slate-500">Unit 4B</td>
                        <td className="py-4">
                           <div className="font-mono font-medium text-slate-700">₦250,000</div>
                           <div className="text-xs text-slate-400">Rent Payment</div>
                        </td>
                        <td className="py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                            Verified
                          </span>
                        </td>
                        <td className="py-4 pr-2 text-right text-sm text-slate-400">2h ago</td>
                      </tr>
                    ))}
                 </tbody>
               </table>
             </div>
           </div>

        </div>

        {/* Right Column (Actions & Widgets) */}
        <div className="lg:col-span-1 space-y-6">
           
           {/* Quick Actions Panel */}
           <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 font-display mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                 <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-md transition-all group">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                       <UserPlus className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">Add Tenant</span>
                 </button>
                 <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-md transition-all group">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                       <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">Invoices</span>
                 </button>
                 <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-md transition-all group">
                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                       <Bell className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">Notice</span>
                 </button>
                 <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-md transition-all group">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                       <Settings className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">Settings</span>
                 </button>
              </div>
           </div>

           {/* Pending Tasks Mini-List */}
           <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-lg font-display">Attention Needed</h3>
                 <div className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">3</div>
              </div>
              
              <div className="space-y-3">
                 <div className="bg-white/10 p-3 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="flex-1">
                       <div className="text-sm font-bold">Verification Request</div>
                       <div className="text-xs text-slate-400">Sarah Connor • Unit 12B</div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                 </div>
                 <div className="bg-white/10 p-3 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-orange-400" />
                    <div className="flex-1">
                       <div className="text-sm font-bold">Leaking Pipe</div>
                       <div className="text-xs text-slate-400">Block C • High Priority</div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                 </div>
              </div>

           </div>

        </div>

      </div>
    </div>
  );
}