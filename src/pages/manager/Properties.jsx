import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MockService } from '../../services/mockService';
import { 
  Building2, 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  Home, 
  Users, 
  Wrench, 
  MoreVertical,
  Trash2,
  Edit2,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link, useNavigate } from 'react-router-dom';

export default function Properties() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [estate, setEstate] = useState(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, occupied, vacant, maintenance

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = () => {
    setLoading(true);
    try {
      const data = MockService.getAll();
      const myEstate = data.estates.find(e => e.managerId === user.id);
      
      if (myEstate) {
        setEstate(myEstate);
        // Filter houses for this estate. Note: MockService might need better filtering if houses array grows
        const estateUnits = (data.houses || []).filter(h => h.estateId === myEstate.id);
        setUnits(estateUnits);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUnits = units.filter(unit => {
    if (filter === 'all') return true;
    return unit.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'occupied': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'maintenance': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading properties...</div>;

  if (!estate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
         <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-slate-400" />
         </div>
         <h2 className="text-xl font-bold text-slate-900 mb-2">No Estate Found</h2>
         <p className="text-slate-500 mb-6">You need to create an estate profile first.</p>
         <Link to="/manager/onboarding" className="btn btn-primary">Go to Onboarding</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
         <Link to="/manager" className="hover:text-slate-900 transition-colors">Dashboard</Link>
         <ChevronRight className="w-4 h-4" />
         <span className="font-semibold text-slate-900">Properties</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 font-display">Property Assets</h1>
           <p className="text-slate-500">Manage units, houses, and occupancy for <span className="font-semibold text-slate-900">{estate.name}</span></p>
        </div>
        <Link 
          to="/manager/properties/new"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 w-auto"
        >
           <Plus className="w-5 h-5" /> Add Unit
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Home className="w-4 h-4" /></div>
               <span className="text-xs font-bold text-slate-500 uppercase">Total Units</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{units.length}</div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-green-100 rounded-lg text-green-600"><Building2 className="w-4 h-4" /></div>
               <span className="text-xs font-bold text-slate-500 uppercase">Vacant</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{units.filter(u => u.status === 'vacant').length}</div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Users className="w-4 h-4" /></div>
               <span className="text-xs font-bold text-slate-500 uppercase">Occupied</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{units.filter(u => u.status === 'occupied').length}</div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Wrench className="w-4 h-4" /></div>
               <span className="text-xs font-bold text-slate-500 uppercase">Maintenance</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{units.filter(u => u.status === 'maintenance').length}</div>
         </div>
      </div>

      {/* Filters & Grid */}
      <div className="space-y-4">
         
         {/* Filter Bar */}
         <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-sm inline-flex">
            {['all', 'vacant', 'occupied', 'maintenance'].map((f) => (
               <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                     "px-4 py-2 rounded-lg text-sm font-bold capitalize transition-colors",
                     filter === f ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"
                  )}
               >
                  {f}
               </button>
            ))}
         </div>

         {/* Empty State */}
         {filteredUnits.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                  <Home className="w-8 h-8 text-slate-300" />
               </div>
               <h3 className="text-lg font-bold text-slate-900">No properties found</h3>
               <p className="text-slate-500 max-w-xs mx-auto">
                  {filter === 'all' 
                     ? "Start by adding your first unit to the inventory." 
                     : `There are no units marked as '${filter}' at the moment.`}
               </p>
            </div>
         )}

         {/* Grid View */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredUnits.map((unit) => (
               <Link to={`/manager/properties/${unit.id}`} key={unit.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all group relative block">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900" onClick={(e) => { e.preventDefault(); /* Add Edit dropdown logic later */ }}>
                        <MoreVertical className="w-4 h-4" />
                     </button>
                  </div>
                  
                  <div className="flex items-start justify-between mb-4">
                     <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg", unit.status === 'occupied' ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-600")}>
                        {unit.name.substring(0, 1)}
                     </div>
                     <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border", getStatusColor(unit.status))}>
                        {unit.status}
                     </span>
                  </div>
                  
                  <h3 className="font-bold text-slate-900 mb-1">{unit.name}</h3>
                  <p className="text-xs text-slate-500 mb-4">{unit.bedrooms} Bedroom {unit.type}</p>
                  
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                     {unit.tenantName ? (
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-700">
                              {unit.tenantName.substring(0, 2)}
                           </div>
                           <span className="text-xs font-semibold text-slate-700">{unit.tenantName}</span>
                        </div>
                     ) : (
                        <span className="text-xs text-slate-400 italic">No tenant assigned</span>
                     )}
                  </div>
               </Link>
            ))}
         </div>

      </div>

    </div>
  );
}