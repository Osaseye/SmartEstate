import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast, ToastContainer } from '../../components/ui/Toast';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'; 
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
  const { addToast, toasts, removeToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | pending | in-progress | resolved

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Find the estate managed by this user
      const estateQuery = query(collection(db, "estates"), where("managerId", "==", user.uid));
      const estateSnapshot = await getDocs(estateQuery);
      
      if (!estateSnapshot.empty) {
        const myEstate = { id: estateSnapshot.docs[0].id, ...estateSnapshot.docs[0].data() };
        
        // 2. Fetch all Properties in this estate to map Tenant ID -> Unit Name
        const propQuery = query(collection(db, "properties"), where("estateId", "==", myEstate.id));
        const propSnap = await getDocs(propQuery);
        const tenantToUnitMap = {};
        propSnap.docs.forEach(d => {
            const data = d.data();
            if (data.tenantId) {
                tenantToUnitMap[data.tenantId] = data.name; // e.g. "Flat 4B"
            }
        });

        // 3. Fetch all Users (Tenants) in this estate (Optional: for names)
        // Alternatively, we can rely on data on the ticket if we had it, but we need to fetch users to get names if they aren't on ticket
        // For efficiency, let's fetch users who are in this estate
        const usersQuery = query(collection(db, "users"), where("estateId", "==", myEstate.id));
        const usersSnap = await getDocs(usersQuery);
        const userMap = {};
        usersSnap.docs.forEach(d => {
            userMap[d.id] = d.data();
        });

        // 4. Fetch Maintenance Requests
        const maintQuery = query(collection(db, "maintenance"), where("estateId", "==", myEstate.id));
        const maintSnap = await getDocs(maintQuery);
        
        const enrichedRequests = maintSnap.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                tenant: userMap[data.tenantId] || { name: 'Unknown' },
                unit: { name: tenantToUnitMap[data.tenantId] || 'N/A' }
            };
        });

        // Sort by date descending
        enrichedRequests.sort((a,b) => {
             const dateA = a.createdAt?.seconds || 0;
             const dateB = b.createdAt?.seconds || 0;
             return dateB - dateA;
        });

        setRequests(enrichedRequests);
      }
    } catch (err) {
      console.error("Error fetching maintenance requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (ticketId, newStatus) => {
      try {
          const ticketRef = doc(db, "maintenance", ticketId);
          await updateDoc(ticketRef, { status: newStatus });
          // Optimistic local update
          setRequests(prev => prev.map(r => r.id === ticketId ? {...r, status: newStatus} : r));
          addToast({ type: 'success', title: 'Status Updated', message: `Request marked as ${newStatus}` });
      } catch(err) {
          console.error("Error updating status:", err);
          addToast({ type: 'error', title: 'Update Failed', message: 'Failed to update status' });
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

               <button 
                  onClick={() => {
                      if (req.status === 'resolved') {
                          navigate(`/manager/maintenance/${req.id}`);
                      } else {
                          handleStatusUpdate(req.id, req.status === 'pending' ? 'in-progress' : 'resolved');
                      }
                  }}
                  className="w-full py-2 bg-slate-50 text-slate-600 font-bold rounded-lg text-sm hover:bg-slate-100 transition-colors"
               >
                  {req.status === 'pending' ? 'Mark In Progress' : req.status === 'in-progress' ? 'Mark Resolved' : 'View Details'}
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
      <ToastContainer toasts={toasts} remove={removeToast} />
    </div>
  );
}