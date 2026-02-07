import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast, ToastContainer } from '../../components/ui/Toast';
import { db } from '../../lib/firebase'; // Removed MockService
import { doc, getDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { 
  Building2, 
  MapPin, 
  User, 
  ChevronRight, 
  Edit2, 
  Trash2, 
  History, 
  Wrench, 
  CreditCard 
} from 'lucide-react';

export default function PropertyDetails() {
  const { id } = useParams();
  const { user } = useAuth(); // estate manager
  const navigate = useNavigate();
  const { addToast, toasts, removeToast } = useToast();
  
  const [unit, setUnit] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!isDeleting) {
       setIsDeleting(true);
       // Auto reset after 3 seconds if not confirmed
       setTimeout(() => setIsDeleting(false), 3000);
       return;
    }
    
    // We don't set global loading=true here because it removes the UI content. 
    // We could add a deleting state, but for now blocking interaction is enough or assuming quick delete.
    try {
        await deleteDoc(doc(db, "properties", id));
        addToast({ type: 'success', title: 'Unit Deleted', message: 'Property has been removed successfully.' });
        // Slight delay
        setTimeout(() => navigate('/manager/properties'), 1000);
    } catch (error) {
        console.error("Error deleting unit:", error);
        addToast({ type: 'error', title: 'Delete Failed', message: error.message });
        setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    addToast({ type: 'info', title: 'Coming Soon', message: 'Edit functionality is under development.' });
  };


  useEffect(() => {
    // Fetch Unit Details from Firestore
    const fetchData = async () => {
       setLoading(true);
       try {
          // 1. Find Unit
          const unitRef = doc(db, "properties", id);
          const unitSnap = await getDoc(unitRef);

          if (unitSnap.exists()) {
             const unitData = { id: unitSnap.id, ...unitSnap.data() };
             setUnit(unitData);

             // 2. Find Tenant if occupied
             if (unitData.tenantId) {
                const tenantRef = doc(db, "users", unitData.tenantId);
                const tenantSnap = await getDoc(tenantRef);
                if (tenantSnap.exists()) {
                   setTenant({ id: tenantSnap.id, ...tenantSnap.data() });
                }
             }

             // 3. Find Maintenance Requests
             // Assuming maintenance requests link to estateId or propertyId (if available) - falling back to estateId + unit name match or something similar if id not present
             // Best practice: store propertyId on maintenance request
             // For now, let's skip complex filtering or just show nothing if not implemented
          } else {
             console.log("Unit document not found");
          }
       } catch (err) {
          console.error(err);
       } finally {
          setLoading(false);
       }
    };
    
    if (user && id) fetchData();
  }, [id, user]);

  if (loading) return <div className="p-12 text-center text-slate-500">Loading details...</div>;

  if (!unit) {
     return (
        <div className="p-12 text-center">
           <h2 className="text-xl font-bold text-slate-900">Unit not found</h2>
           <Link to="/manager/properties" className="text-primary hover:underline mt-4 inline-block">Back to Properties</Link>
        </div>
     );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       
       {/* Breadcrumbs */}
       <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link to="/manager" className="hover:text-slate-900 transition-colors">Dashboard</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/manager/properties" className="hover:text-slate-900 transition-colors">Properties</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-semibold text-slate-900">{unit.name}</span>
       </div>

       {/* Header Section */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
             <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm text-slate-500">
                   <Building2 className="w-6 h-6" />
                </div>
                <div>
                   <h1 className="text-3xl font-bold font-display text-slate-900">{unit.name}</h1>
                   <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold uppercase">{unit.type}</span>
                      <span>•</span>
                      <span>{unit.bedrooms} Bedrooms</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="flex gap-3">
             <button 
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
             >
                <Edit2 className="w-4 h-4" /> Edit
             </button>
             <button 
                onClick={handleDelete}
                className={`flex items-center gap-2 px-4 py-2 font-bold rounded-xl transition-all duration-200 ${
                    isDeleting 
                    ? 'bg-red-600 text-white border border-red-600' 
                    : 'bg-red-50 border border-red-100 text-red-600 hover:bg-red-100'
                }`}
             >
                <Trash2 className="w-4 h-4" /> {isDeleting ? 'Confirm?' : 'Delete'}
             </button>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content: Info & History */}
          <div className="lg:col-span-2 space-y-8">
             
             {/* Status Card */}
             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                   <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Status</div>
                   <div className={`text-xl font-bold capitalize ${
                      unit.status === 'occupied' ? 'text-blue-600' : 
                      unit.status === 'maintenance' ? 'text-orange-600' : 'text-green-600'
                   }`}>
                      {unit.status}
                   </div>
                </div>
                {unit.status === 'vacant' && (
                   <button className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
                      Assign Tenant
                   </button>
                )}
             </div>

             {/* Maintenance History */}
             <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                   <h3 className="font-bold text-lg text-slate-900 font-display flex items-center gap-2">
                      <History className="w-5 h-5 text-slate-400" /> Maintenance History
                   </h3>
                </div>
                
                {maintenance.length > 0 ? (
                   <div className="divide-y divide-slate-50">
                      {maintenance.map(item => (
                         <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                               <span className="font-bold text-slate-900 text-sm">{item.type || 'General Repair'}</span>
                               <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                  item.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                               }`}>{item.status}</span>
                            </div>
                            <p className="text-xs text-slate-500 mb-2">{item.description}</p>
                            <div className="text-[10px] text-slate-400 text-right">{item.date}</div>
                         </div>
                      ))}
                   </div>
                ) : (
                   <div className="p-8 text-center text-slate-500 text-sm">No maintenance records found.</div>
                )}
             </div>

          </div>

          {/* Sidebar: Tenant Info */}
          <div className="lg:col-span-1 space-y-6">
             
             <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <h3 className="font-bold text-lg text-slate-900 font-display mb-4">Occupant Info</h3>
                
                {tenant ? (
                   <div className="text-center">
                      <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-2xl text-slate-400">
                         {tenant.name.substring(0, 2)}
                      </div>
                      <h4 className="font-bold text-slate-900 text-lg">{tenant.name}</h4>
                      <p className="text-sm text-slate-500 mb-6">{tenant.email}</p>
                      
                      <div className="grid grid-cols-2 gap-3 text-left bg-slate-50 p-4 rounded-xl mb-4">
                         <div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase">Lease Start</div>
                            <div className="text-sm font-semibold text-slate-700">Jan 1, 2024</div>
                         </div>
                         <div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase">Rent Status</div>
                            <div className="text-sm font-semibold text-green-600">Active</div>
                         </div>
                      </div>

                      <button className="w-full py-3 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                         View Full Profile
                      </button>
                   </div>
                ) : (
                   <div className="text-center py-8">
                      <div className="w-16 h-16 bg-slate-50 rounded-full mx-auto mb-4 flex items-center justify-center">
                         <User className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-slate-500 font-medium mb-4">This unit is currently vacant.</p>
                      <button className="text-primary font-bold text-sm hover:underline">
                         + Assign New Tenant
                      </button>
                   </div>
                )}
             </div>

             {/* Rent Info Widget */}
             <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-4 text-emerald-400">
                   <CreditCard className="w-5 h-5" />
                   <span className="font-bold text-sm uppercase tracking-wider">Financials</span>
                </div>
                
                <div className="mb-1 text-slate-400 text-xs font-bold uppercase">Current Annual Rent</div>
                <div className="text-3xl font-bold font-display mb-4">
                  {unit.rentAmount ? `₦${Number(unit.rentAmount).toLocaleString()}` : "Not Set"}
                </div>
                
                <div className="h-px bg-white/10 my-4" />
                
                <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-400">Rent Due Date</span>
                   <span className="font-bold">
                      {unit.rentDueDate ? `Day ${unit.rentDueDate} of month` : "Not Set"}
                   </span>
                </div>
             </div>

          </div>

       </div>
       <ToastContainer toasts={toasts} remove={removeToast} />
    </div>
  );
}