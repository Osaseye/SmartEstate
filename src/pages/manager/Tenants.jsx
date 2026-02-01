import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MockService } from '../../services/mockService';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  MoreVertical,
  Building2,
  Mail,
  Phone,
  Shield,
  Clock,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

export default function Tenants() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('directory'); // directory | requests
  const [tenants, setTenants] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [vacantUnits, setVacantUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State for Approval
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [assignmentUnit, setAssignmentUnit] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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
        setPendingRequests(estateUsers.filter(u => u.verificationStatus === 'pending'));

        // 3. Get vacant units for assignment dropdown
        const estateUnits = (data.houses || []).filter(h => h.estateId === myEstate.id && h.status === 'vacant');
        setVacantUnits(estateUnits);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedRequest || !assignmentUnit) return;
    setIsProcessing(true);

    try {
      // Simulate API
      await new Promise(r => setTimeout(r, 1000));
      
      const data = MockService.getAll();
      
      // 1. Update User Status
      const userIndex = data.users.findIndex(u => u.id === selectedRequest.id);
      if (userIndex > -1) {
         data.users[userIndex].verificationStatus = 'verified';
         data.users[userIndex].houseId = assignmentUnit;
      }

      // 2. Update Unit Status
      const unitIndex = data.houses.findIndex(h => h.id === assignmentUnit);
      if (unitIndex > -1) {
         data.houses[unitIndex].status = 'occupied';
         data.houses[unitIndex].tenantId = selectedRequest.id;
         data.houses[unitIndex].tenantName = selectedRequest.name;
      }

      MockService.update(data);
      
      // Reset & Refresh
      setSelectedRequest(null);
      setAssignmentUnit('');
      fetchData();

    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading tenants...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 font-display">Tenant Management</h1>
           <p className="text-slate-500">Verify new joiners and manage existing community members.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
           <button 
              onClick={() => setActiveTab('directory')}
              className={cn("px-6 py-2 rounded-lg text-sm font-bold transition-all", activeTab === 'directory' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
           >
              Directory ({tenants.length})
           </button>
           <button 
              onClick={() => setActiveTab('requests')}
              className={cn("px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2", activeTab === 'requests' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
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
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingRequests.map(req => (
                     <div key={req.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm group">
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 text-lg">
                                 {req.name.substring(0,2)}
                              </div>
                              <div>
                                 <h3 className="font-bold text-slate-900">{req.name}</h3>
                                 <div className="flex items-center gap-1 text-xs text-slate-400">
                                    <Clock className="w-3 h-3" /> Requested 2h ago
                                 </div>
                              </div>
                           </div>
                           <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-[10px] font-bold uppercase">Pending</span>
                        </div>

                        <div className="space-y-2 mb-6">
                           <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Mail className="w-4 h-4 text-slate-400" /> {req.email}
                           </div>
                           <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Phone className="w-4 h-4 text-slate-400" /> +234 800 000 0000
                           </div>
                        </div>

                        <div className="flex gap-3">
                           <button className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                              Decline
                           </button>
                           <button 
                              onClick={() => setSelectedRequest(req)}
                              className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                           >
                              Approve
                           </button>
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
            <div className="flex gap-4">
               <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                     type="text" 
                     placeholder="Search tenants by name, unit, or email..." 
                     className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
               </div>
               <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50">
                  <Filter className="w-5 h-5" /> Filter
               </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
               <table className="w-full text-left border-collapse">
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
               
               {tenants.length === 0 && (
                  <div className="p-8 text-center text-slate-500">No active tenants found. Check the 'Requests' tab to approve new joiners.</div>
               )}
            </div>
         </div>
      )}

      {/* APPROVAL MODAL */}
      {selectedRequest && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl">
               <div className="mb-6">
                  <h3 className="text-xl font-bold font-display text-slate-900 mb-1">Approve Tenant</h3>
                  <p className="text-slate-500">Assign a unit to <span className="font-bold text-slate-900">{selectedRequest.name}</span> to complete verification.</p>
               </div>

               <div className="space-y-4 mb-8">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Select Vacant Unit</label>
                     {vacantUnits.length > 0 ? (
                        <select 
                           className="w-full p-3 bg-white border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                           value={assignmentUnit}
                           onChange={(e) => setAssignmentUnit(e.target.value)}
                        >
                           <option value="">-- Choose Unit --</option>
                           {vacantUnits.map(unit => (
                              <option key={unit.id} value={unit.id}>
                                 {unit.name} ({unit.type})
                              </option>
                           ))}
                        </select>
                     ) : (
                        <div className="text-center py-4">
                           <p className="text-sm text-red-500 font-bold mb-2">No vacant units available!</p>
                           <Link to="/manager/properties/new" className="text-xs px-3 py-1 bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors">
                              + Create New Unit
                           </Link>
                        </div>
                     )}
                  </div>

                  <div className="text-xs text-slate-400 flex gap-2">
                     <Shield className="w-4 h-4" /> This will grant the user access to the tenant portal for this estate.
                  </div>
               </div>

               <div className="flex gap-4">
                  <button 
                     onClick={() => setSelectedRequest(null)}
                     className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                  >
                     Cancel
                  </button>
                  <button 
                     disabled={!assignmentUnit || isProcessing}
                     onClick={handleApprove}
                     className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {isProcessing ? 'Processing...' : 'Confirm Approval'}
                  </button>
               </div>
            </div>
         </div>
      )}

    </div>
  );
}