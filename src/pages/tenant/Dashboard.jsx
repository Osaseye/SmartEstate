import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MockService } from '../../services/mockService';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  CreditCard, 
  Wrench, 
  Bell, 
  AlertCircle,
  Clock,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  Wallet,
  Home,
  Users,
  UserPlus
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, iconBg, iconColor, trend }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all duration-300">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-900 font-display">{value}</h3>
      {trend && (
         <p className="text-xs font-semibold text-green-600 mt-2 flex items-center gap-1">
           <ArrowUpRight className="w-3 h-3" /> {trend}
         </p>
      )}
    </div>
    <div className={cn("p-4 rounded-xl transition-colors", iconBg)}>
      <Icon className={cn("w-6 h-6", iconColor)} />
    </div>
  </div>
);

const ActivityItem = ({ title, description, time, icon: Icon, colorClass }) => (
  <div className="flex gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors group">
    <div className={cn("mt-1 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm", colorClass)}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-slate-900 text-sm group-hover:text-primary transition-colors font-display">{title}</h4>
        <span className="text-xs text-slate-400 font-medium whitespace-nowrap ml-2">{time}</span>
      </div>
      <p className="text-sm text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{description}</p>
    </div>
  </div>
);

const VisitorCard = ({ visitor }) => (
    <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
       <div>
         <div className="font-bold text-slate-900 text-sm">{visitor.name}</div>
         <div className="text-xs text-slate-500 font-mono mt-1">Code: <span className="text-slate-900 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">{visitor.code}</span></div>
       </div>
       <div className={cn(
           "px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider",
           visitor.status === 'active' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
       )}>
           {visitor.status}
       </div>
    </div>
);

const VisitorTimer = ({ expiresAt, status }) => {
  const [timeLeft, setTimeLeft] = useState(Math.max(0, expiresAt - Date.now()));

  useEffect(() => {
    if (status !== 'active') return;
    const timer = setInterval(() => {
      setTimeLeft(Math.max(0, expiresAt - Date.now()));
    }, 60000);
    return () => clearInterval(timer);
  }, [expiresAt, status]);

  if (status !== 'active') return <span className="text-slate-500 text-[10px] uppercase font-bold">{status}</span>;
  if (timeLeft <= 0) return <span className="text-red-400 text-[10px] font-bold">EXPIRED</span>;
  
  const hours = Math.floor(timeLeft / (3600000));
  const minutes = Math.floor((timeLeft % 3600000) / 60000);
  
  return <span className="text-emerald-400 text-[10px] uppercase font-bold">{hours}h {minutes}m left</span>;
};

const TenantDashboard = () => {
  const { user } = useAuth();
  const [estate, setEstate] = useState(null);
  const [visitors, setVisitors] = useState([]);
  
  // Mock stats for dashboard display
  const [stats, setStats] = useState({
    outstandingRent: '₦0.00',
    activeMaintenance: 0
  });

  // Mock activity feed
  const [activities, setActivities] = useState([]); // Empty state as requested from mock data

  useEffect(() => {
    if (user && user.estateId) {
      const allData = MockService.getAll();
      const foundEstate = allData.estates.find(e => e.id === user.estateId);
      setEstate(foundEstate);
      
      // Load visitors
      setVisitors(allData.visitors || []);
    }
  }, [user]);

  const generateVisitorCode = () => {
     // Mock generation
     const code = Math.floor(1000 + Math.random() * 9000).toString();
     const newVisitor = {
         id: `v${Date.now()}`,
         name: 'New Guest',
         code: code,
         status: 'active',
         expiresAt: Date.now() + 24 * 60 * 60 * 1000,
         type: 'Guest'
     };
     setVisitors(prev => [newVisitor, ...prev]);
     // In real app, would call service
  };

  // If user is pending, show ONLY the pending screen or a very limited view?
  // The user asked to remove the "Verification Pending" if they ARE verifying.
  // My previous code showed it conditionally. 
  // If user.verificationStatus is 'verified', it will hide automatically.

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-2xl shadow-slate-200/50 min-h-[220px] flex items-center">
         <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/40 z-10"></div>
             {estate?.image && (
               <img src={estate.image} className="w-full h-full object-cover opacity-50" alt="Estate" />
             )}
         </div>
         
         <div className="relative z-20 p-8 md:p-12 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-wider mb-4 text-emerald-300">
                 <CheckCircle2 className="w-3 h-3" /> Verified Resident
               </div>
               <h1 className="text-3xl md:text-5xl font-bold font-display leading-tight mb-2">
                 Welcome Home, <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-emerald-200">{user?.name?.split(' ')[0]}</span>
               </h1>
               <p className="text-slate-300 text-lg font-light flex items-center gap-2">
                 <MapPin className="w-4 h-4 text-emerald-400" />
                 {estate?.name || "No Residence Assigned"}
               </p>
            </div>

            <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
               <button className="flex-1 md:flex-none justify-center px-4 md:px-6 py-3 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition-colors shadow-lg flex items-center gap-2 text-sm md:text-base whitespace-nowrap">
                 <CreditCard className="w-4 h-4" /> Pay Rent
               </button>
               <button className="flex-1 md:flex-none justify-center px-4 md:px-6 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 backdrop-blur-md border border-white/10 transition-colors flex items-center gap-2 text-sm md:text-base whitespace-nowrap">
                 <Wrench className="w-4 h-4" /> Report Issue
               </button>
            </div>
         </div>
      </div>

      {/* Residence Details Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
             <Home className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">My Residence</h3>
            <p className="text-slate-500 text-sm">Unit 402, Block C • 3 Bedroom Apartment</p>
          </div>
        </div>
        
        <div className="flex gap-8 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8 justify-around md:justify-start">
             <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Estate Code</span>
                <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded text-sm">{estate?.code || "---"}</span>
             </div>
             <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Lease Status</span>
                <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Active
                </span>
             </div>
        </div>
      </div>

      {/* Verification Status Warning (Only if pending) */}
      {user?.verificationStatus === 'pending' && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-full text-amber-600 shadow-inner">
               <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-amber-900 font-display">Verification Pending</h3>
              <p className="text-amber-800/80 mt-1 max-w-xl">
                Your access request to <span className="font-bold">{estate?.name}</span> is under review. Full access is restricted.
              </p>
            </div>
          </div>
          <button className="px-6 py-2.5 bg-amber-100 text-amber-900 font-bold rounded-xl hover:bg-amber-200 transition-colors text-sm">
            Check Status
          </button>
        </motion.div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Actions */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <StatCard 
               title="Next Rent Due" 
               value="Mar 01, 2026" 
               icon={Clock} 
               iconBg="bg-emerald-50"
               iconColor="text-emerald-600"
               trend="28 days left"
             />
             <StatCard 
               title="Active Requests" 
               value={stats.activeMaintenance?.toString() || "0"} 
               icon={Wrench} 
               iconBg="bg-orange-50"
               iconColor="text-orange-600"
               trend={null}
             />
          </div>

          {/* Quick Actions Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-xl font-bold text-slate-900 font-display">Quick Access</h3>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'Pay Rent', icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50', link: '/tenant/payments', desc: 'Settle bills' },
                { label: 'Fix It', icon: Wrench, color: 'text-orange-600', bg: 'bg-orange-50', link: '/tenant/maintenance', desc: 'Request help' },
                { label: 'Updates', icon: Bell, color: 'text-blue-600', bg: 'bg-blue-50', link: '/tenant/announcements', desc: 'Estate news' },
              ].map((action, i) => (
                <Link key={i} to={action.link} className="flex flex-col items-start justify-between p-5 h-32 bg-white border border-slate-100 rounded-3xl hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                   <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center transition-colors mb-2 shadow-sm", action.bg, action.color)}>
                     <action.icon className="w-5 h-5" strokeWidth={2.5} />
                   </div>
                   <div className="relative z-10">
                     <span className="block font-bold text-slate-900 text-sm font-display">{action.label}</span>
                     <span className="text-xs text-slate-400 font-medium">{action.desc}</span>
                   </div>
                   
                   {/* Decorative circle */}
                   <div className={cn("absolute -bottom-4 -right-4 w-16 h-16 rounded-full opacity-0 group-hover:opacity-20 transition-opacity", action.bg)} />
                </Link>
              ))}
            </div>
          </div>

          {/* Visitor Widget (Moved below Quick Access) */}
          <div className="bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-900/10 relative overflow-hidden">
             
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

             <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                   <div className="p-2.5 bg-white/10 rounded-xl text-emerald-300">
                      <UserPlus className="w-5 h-5" />
                   </div>
                   <h3 className="font-bold text-lg text-white font-display">Visitors</h3>
                </div>
                <button 
                  onClick={generateVisitorCode}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-lg shadow-emerald-500/20"
                >
                   <UserPlus className="w-3 h-3" /> New Code
                </button>
             </div>

             <div className="space-y-3 relative z-10">
               {visitors.slice(0, 3).map(visitor => (
                 <div key={visitor.id} className="bg-white/5 border border-white/5 p-3 rounded-xl flex items-center justify-between backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <div>
                       <div className="text-white text-sm font-bold">{visitor.name}</div>
                       <div className="text-slate-400 text-xs mt-0.5">{visitor.type}</div>
                    </div>
                    <div className="text-right">
                       <span className="font-mono text-lg font-bold text-emerald-300 block">{visitor.code}</span>
                       <span className={cn("text-[10px] uppercase font-bold", visitor.status === 'active' ? "text-emerald-400" : "text-slate-500")}>{visitor.status}</span>
                    </div>
                 </div>
               ))}
               {visitors.length === 0 && (
                   <div className="text-center py-6 text-slate-400 text-sm">No active visitor codes</div>
               )}
             </div>
          </div>

        </div>

        {/* Right Column: Activity Feed */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 h-full relative">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-xl text-slate-900 font-display">Activity</h3>
              <Link to="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-primary transition-colors">
                <ArrowUpRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.map(activity => (
                  <ActivityItem 
                    key={activity.id}
                    title={activity.title}
                    description={activity.description}
                    time={activity.time}
                    icon={activity.icon}
                    colorClass={activity.colorClass}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                    <Bell className="w-8 h-8" />
                  </div>
                  <p className="text-slate-500 font-medium">No recent activity</p>
                </div>
              )}
            </div>
            
            <button className="w-full mt-8 py-3.5 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all font-display">
              View All History
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TenantDashboard;