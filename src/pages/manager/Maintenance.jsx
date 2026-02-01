import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MockService } from '../../services/mockService';
import { 
  Wrench, 
  Filter, 
  Search, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  MoreVertical,
  ArrowUpRight,
  MessageSquare
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function ManagerMaintenance() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | pending | in-progress | resolved

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = () => {
    setLoading(true);
    try {
      const data = MockService.getAll();
      const myEstate = data.estates.find(e => e.managerId === user.id);
      
      if (myEstate) {
        // Find tenants in my estate
        const tenantIds = data.users
            .filter(u => u.estateId === myEstate.id)
            .map(u => u.id);
        
        // Filter maintenance requests from these tenants
        const estateRequests = (data.maintenance || []).filter(m => tenantIds.includes(m.tenantId));
        
        // Enrich with tenant details
        const enrichedRequests = estateRequests.map(req => {
            const tenant = data.users.find(u => u.id === req.tenantId);
            const unit = data.houses.find(h => h.tenantId === req.tenantId); // Simplified finding unit via tenant
            return { ...req, tenant, unit };
        });

        setRequests(enrichedRequests);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'in-progress': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-600 border-green-200';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(r => r.status === filter);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading maintenance requests...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 font-display">Maintenance Board</h1>
           <p className="text-slate-500">Track and manage repair requests from your tenants.</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 shadow-sm">
              <Filter className="w-4 h-4" /> Filter
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-lg shadow-slate-200">
              <ArrowUpRight className="w-4 h-4" /> Export Report
           </button>
        </div>
      </div>

      {/* Kanban / List Filters */}
      <div className="flex gap-2 pb-2 overflow-x-auto">
        {['all', 'pending', 'in-progress', 'resolved'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-bold capitalize whitespace-nowrap border transition-all",
              filter === f 
                ? "bg-slate-900 text-white border-slate-900" 
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
            )}
          >
            {f.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Grid of Requests */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRequests.map(req => (
          <div key={req.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
            
            <div className="flex justify-between items-start mb-4">
               <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border", getStatusColor(req.status))}>
                 {req.status}
               </span>
               {req.priority === 'high' && (
                 <span className="flex items-center gap-1 text-red-500 text-xs font-bold">
                   <AlertCircle className="w-3 h-3" /> High Priority
                 </span>
               )}
            </div>

            <h3 className="font-bold text-slate-900 text-lg mb-2">{req.title}</h3>
            <p className="text-slate-500 text-sm mb-6 flex-1 line-clamp-3">{req.description}</p>

            <div className="space-y-4 pt-4 border-t border-slate-50">
               <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                        {req.tenant?.name?.substring(0,2) || 'UK'}
                     </div>
                     <div>
                        <div className="font-bold text-slate-700">{req.tenant?.name || 'Unknown Tenant'}</div>
                        <div className="text-xs text-slate-400">{req.unit?.name || 'Unit TBA'}</div>
                     </div>
                  </div>
               </div>
               
               <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                     <Clock className="w-3 h-3" /> {new Date(req.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1 hover:text-slate-600 cursor-pointer transition-colors">
                     <MessageSquare className="w-3 h-3" /> {req.updates?.length || 0} Updates
                  </span>
               </div>

               <button className="w-full py-2 bg-slate-50 text-slate-600 font-bold rounded-lg text-sm hover:bg-slate-100 transition-colors">
                  View Details
               </button>
            </div>
          </div>
        ))}
        
        {/* Empty State */}
        {filteredRequests.length === 0 && (
           <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900">No requests found</h3>
              <p className="text-slate-500">There are no maintenance requests matching this filter.</p>
           </div>
        )}
      </div>

    </div>
  );
}