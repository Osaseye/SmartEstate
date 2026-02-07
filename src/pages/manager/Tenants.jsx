import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MockService } from '../../services/mockService';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  MoreVertical,
  Building2,
  Mail,
  Shield,
  Clock,
  ArrowRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';
import Loader from '../../components/ui/Loader';

export default function Tenants() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('directory'); // directory | requests
  const [tenants, setTenants] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = () => {
    setLoading(true);
    try {
      const data = MockService.getAll();
      const myEstate = data.estates.find(e => e.managerId === user.id);
      
      if (myEstate) {
        // 1. Get all users linked to this estate
        const estateUsers = data.users.filter(u => u.estateId === myEstate.id && u.role === 'tenant');
        
        // 2. Separate by status
        setTenants(estateUsers.filter(u => u.verificationStatus === 'verified'));
        
        // 3. Get Pending Requests
        setPendingRequests(estateUsers.filter(u => u.verificationStatus === 'pending'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 font-display">Tenant Management</h1>
           <p className="text-slate-500">Verify new joiners and manage existing community members.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
           <button 
              onClick={() => setActiveTab('directory')}
              className={cn("flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all", activeTab === 'directory' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
           >
              Directory ({tenants.length})
           </button>
           <button 
              onClick={() => setActiveTab('requests')}
              className={cn("flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2", activeTab === 'requests' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
           >
              Requests 
              {pendingRequests.length > 0 && (
                 <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingRequests.length}</span>
              )}
           </button>
        </div>
      </div>

      {/* REQUESTS TAB */}
      {activeTab === 'requests' && (
         <div className="space-y-4">
            {pendingRequests.length === 0 ? (
               <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">All caught up!</h3>
                  <p className="text-slate-500">There are no pending verification requests.</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {pendingRequests.map(req => (
                     <div key={req.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
                        <div className="p-6">
                           <div className="flex justify-between items-start mb-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-500 text-xl shadow-inner">
                                    {req.name.substring(0,2)}
                                 </div>
                                 <div>
                                    <h3 className="font-bold text-slate-900 text-lg leading-tight">{req.name}</h3>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                                       <Clock className="w-3 h-3" /> 
                                       <span>New Applicant</span>
                                    </div>
                                 </div>
                              </div>
                              <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-orange-100">
                                 Review
                              </span>
                           </div>

                           <div className="space-y-3 mb-6 bg-slate-50 rounded-xl p-4 border border-slate-100/50">
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                 <Mail className="w-4 h-4 text-slate-400" /> 
                                 <span className="truncate">{req.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                 <Building2 className="w-4 h-4 text-slate-400" /> 
                                 <span>Unit Requested: Not Assigned</span>
                              </div>
                           </div>
                           
                           <Link 
                              to={`/manager/tenants/request/${req.id}`}
                              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors group-hover:shadow-lg group-hover:shadow-slate-200"
                           >
                              Review Application <ArrowRight className="w-4 h-4" />
                           </Link>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
      )}

      {/* DIRECTORY TAB */}
      {activeTab === 'directory' && (
         <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
               <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                     type="text" 
                     placeholder="Search tenants by name, unit, or email..." 
                     className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 outline-none transition-all"
                  />
               </div>
               <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                  <Filter className="w-5 h-5" /> Filter
               </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                     <thead className="bg-slate-50/50">
                        <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                           <th className="py-4 pl-6">Tenant</th>
                           <th className="py-4">Unit Assigned</th>
                           <th className="py-4">Contact</th>
                           <th className="py-4">Status</th>
                           <th className="py-4 pr-6 text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {tenants.map(tenant => {
                           const assignedUnit = MockService.getAll().houses.find(h => h.id === tenant.houseId);
                           
                           return (
                              <tr key={tenant.id} className="group hover:bg-slate-50/50 transition-colors">
                                 <td className="py-4 pl-6">
                                    <div className="flex items-center gap-3">
                                       <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 shadow-inner">
                                          {tenant.name.substring(0,2)}
                                       </div>
                                       <div>
                                          <div className="font-bold text-slate-900">{tenant.name}</div>
                                          <div className="text-xs text-slate-400">ID: {tenant.id}</div>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="py-4">
                                    {assignedUnit ? (
                                       <div className="flex items-center gap-2">
                                          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                                             <Building2 className="w-4 h-4" />
                                          </div>
                                          <span className="font-semibold text-slate-700">{assignedUnit.name}</span>
                                       </div>
                                    ) : (
                                       <span className="text-slate-400 text-sm italic">Unassigned</span>
                                    )}
                                 </td>
                                 <td className="py-4">
                                    <div className="flex flex-col text-sm">
                                       <span className="text-slate-600">{tenant.email}</span>
                                       <span className="text-slate-400 text-xs">+234 812 345 6789</span>
                                    </div>
                                 </td>
                                 <td className="py-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                       <Shield className="w-3 h-3" /> Verified
                                    </span>
                                 </td>
                                 <td className="py-4 pr-6 text-right">
                                    <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
                                       <MoreVertical className="w-5 h-5" />
                                    </button>
                                 </td>
                              </tr>
                           );
                        })}
                     </tbody>
                  </table>
               </div>
               
               {tenants.length === 0 && (
                  <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                          <Search className="w-8 h-8" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg">No active tenants found</h3>
                      <p className="text-slate-500">Check the 'Requests' tab to approve new status joiners.</p>
                  </div>
               )}
            </div>
         </div>
      )}
    </div>
  );
}