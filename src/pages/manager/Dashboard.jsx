import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'; 
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
    pendingMaintenance: 0, // Added
    pendingPayments: 0, // Added
    totalProperties: 0, // Added
    activeMaintenance: 0,
    occupancyRate: '0%',
    revenue: '₦0.00'
  });
  const [recentPayments, setRecentPayments] = useState([]); // Added state
  const [attentionItems, setAttentionItems] = useState([]); // Added state for attention items
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;
        
        // 1. Determine Estate ID
        // Prefer user.estateId from profile if available (matches Tenants page logic)
        // Otherwise fallback to querying by managerId
        let targetEstateId = user.estateId;
        let myEstate = null;

        if (targetEstateId) {
            const estateDoc = await getDoc(doc(db, "estates", targetEstateId));
            if (estateDoc.exists()) {
                myEstate = { id: estateDoc.id, ...estateDoc.data() };
            }
        }

        if (!myEstate) {
             const qEstate = query(collection(db, "estates"), where("managerId", "==", user.uid));
             const estateSnap = await getDocs(qEstate);
             if (!estateSnap.empty) {
                const estateDoc = estateSnap.docs[0];
                myEstate = { id: estateDoc.id, ...estateDoc.data() };
             }
        }
        
        if (myEstate) {
           setEstate(myEstate);

           // 2. Fetch Estate Users (Tenants)
           const qUsers = query(collection(db, "users"), where("estateId", "==", myEstate.id));
           const usersSnapshot = await getDocs(qUsers);
           const estateUsers = usersSnapshot.docs.map(d => d.data());

           // Normalize role check and ensure role default
           const verifiedTenants = estateUsers.filter(u => (u.role === 'tenant' || u.role === 'Tenant') && u.verificationStatus === 'verified');
           const pendingTenants = estateUsers.filter(u => (u.role === 'tenant' || u.role === 'Tenant') && u.verificationStatus === 'pending');

           // 3. Fetch Maintenance Counts
           const qMaint = query(collection(db, "maintenance"), where("estateId", "==", myEstate.id), where("status", "==", "pending"));
           const maintSnap = await getDocs(qMaint); 
           const pendingMaintenanceItems = maintSnap.docs.map(d => ({id: d.id, ...d.data(), type: 'maintenance'}));
           
           // 4. Fetch Payment Counts
           const qPays = query(collection(db, "payments"), where("estateId", "==", myEstate.id), where("status", "==", "pending"));
           const paySnap = await getDocs(qPays);
           
           // 5. Fetch Recent Payments
           const qRecentPays = query(
              collection(db, "payments"), 
              where("estateId", "==", myEstate.id), 
              orderBy("createdAt", "desc"), 
              limit(5)
           );
           const recentPaysSnap = await getDocs(qRecentPays);
           const recentPays = recentPaysSnap.docs.map(d => ({id: d.id, ...d.data()}));
           setRecentPayments(recentPays);

           // 6. Fetch Total Properties (REAL COUNT)
           const qProps = query(collection(db, "properties"), where("estateId", "==", myEstate.id));
           const propsSnap = await getDocs(qProps);
           const totalPropertiesCount = propsSnap.size;

           // 7. Build Attention Items
           const allAttention = [
               ...pendingTenants.map(t => ({
                   id: t.uid || t.id, 
                   type: 'verification', 
                   title: 'Verification Request', 
                   subtitle: `${t.name} • ${t.unit || 'No Unit'}`,
                   date: t.createdAt, 
                   color: 'bg-blue-400'
               })),
               ...pendingMaintenanceItems.map(m => ({
                   id: m.id,
                   type: 'maintenance',
                   title: m.title || 'Maintenance Request',
                   subtitle: `${m.location || 'Unit'} • ${m.priority || 'Normal'}`,
                   date: m.createdAt,
                   color: m.priority === 'High' ? 'bg-red-400' : 'bg-orange-400'
               }))
           ];

           // Sort by date (newest first)
           allAttention.sort((a, b) => {
                const dateA = a.date?.toDate ? a.date.toDate() : new Date(0);
                const dateB = b.date?.toDate ? b.date.toDate() : new Date(0);
                return dateB - dateA; 
           });
           setAttentionItems(allAttention.slice(0, 5));

           setStats({
                totalTenants: verifiedTenants.length,
                pendingRequests: pendingTenants.length, 
                pendingMaintenance: maintSnap.size,
                activeMaintenance: maintSnap.size, 
                pendingPayments: paySnap.size, 
                totalProperties: totalPropertiesCount, // Use real count
                occupancyRate: totalPropertiesCount > 0 ? `${Math.round((verifiedTenants.length / totalPropertiesCount) * 100)}%` : '0%', 
                revenue: 'N/A' 
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard 
          title="Total Properties" 
          value={stats.totalProperties || 0} 
          icon={Building2} 
          colorClass="bg-emerald-100 text-emerald-600"
          subtext="Managed Units"
        />
        <StatCard 
          title="Maintenance Pending" 
          value={stats.pendingMaintenance} 
          icon={Wrench} 
          colorClass="bg-orange-100 text-orange-600"
          subtext={stats.pendingMaintenance === 1 ? '1 Issue' : `${stats.pendingMaintenance} Issues`}
        />
        <StatCard 
          title="Verification Requests" 
          value={stats.pendingRequests} 
          icon={UserPlus} 
          colorClass="bg-blue-100 text-blue-600"
          subtext="Awaiting Approval"
        />
        <StatCard 
          title="Occupied Units" 
          value={stats.totalTenants} 
          icon={Building2} 
          colorClass="bg-purple-100 text-purple-600"
          subtext={`Out of ${stats.totalProperties || 0}`}
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
                    {recentPayments.length > 0 ? (
                      recentPayments.map((payment) => (
                        <tr key={payment.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 pl-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs shadow-inner">
                                {payment.tenantName ? payment.tenantName.substring(0, 2).toUpperCase() : 'T'}
                              </div>
                              <span className="font-semibold text-slate-900 text-sm">{payment.tenantName || 'Unknown Tenant'}</span>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-slate-500">{payment.unit || 'N/A'}</td>
                          <td className="py-4">
                            <div className="font-mono font-medium text-slate-700">₦{payment.amount?.toLocaleString() || '0'}</div>
                            <div className="text-xs text-slate-400">{payment.type || 'Payment'}</div>
                          </td>
                          <td className="py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              payment.status === 'verified' || payment.status === 'approved' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {payment.status || 'Pending'}
                            </span>
                          </td>
                          <td className="py-4 pr-2 text-right text-sm text-slate-400">
                             {payment.createdAt?.toDate ? new Date(payment.createdAt.toDate()).toLocaleDateString() : 'Just now'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-slate-500 text-sm">
                          No recent payments found.
                        </td>
                      </tr>
                    )}
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
                 {attentionItems.length > 0 && (
                   <div className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                     {attentionItems.length}
                   </div>
                 )}
              </div>
              
              <div className="space-y-3">
                 {attentionItems.length > 0 ? (
                    attentionItems.map((item) => (
                      <div key={item.id} className="bg-white/10 p-3 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-white/20 transition-colors">
                          <div className={`w-2 h-2 rounded-full ${item.color}`} />
                          <div className="flex-1">
                            <div className="text-sm font-bold">{item.title}</div>
                            <div className="text-xs text-slate-400">{item.subtitle}</div>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))
                 ) : (
                    <div className="p-4 text-center text-slate-400 text-sm">
                      All caught up! No pending tasks.
                    </div>
                 )}
              </div>

           </div>

        </div>

      </div>
    </div>
  );
}