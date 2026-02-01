import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MockService } from '../../services/mockService';
import { ChevronRight, Home, Building2 } from 'lucide-react';

export default function AddUnit() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [estate, setEstate] = useState(null);
  
  const [newUnit, setNewUnit] = useState({
    block: '',
    number: '',
    type: 'Apartment', 
    bedrooms: '2',
    status: 'vacant'
  });

  useEffect(() => {
    try {
      const data = MockService.getAll();
      const myEstate = data.estates.find(e => e.managerId === user.id);
      if (myEstate) {
        setEstate(myEstate);
      }
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!estate) return;

    const unitName = newUnit.block 
      ? `Block ${newUnit.block}, Unit ${newUnit.number}` 
      : `Unit ${newUnit.number}`;

    const payload = {
      ...newUnit,
      name: unitName,
      estateId: estate.id,
      tenantId: null 
    };

    // Simulate API call
    await new Promise(r => setTimeout(r, 500));
    MockService.addHouse(payload);
    
    navigate('/manager/properties');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       
       {/* Breadcrumbs */}
       <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link to="/manager" className="hover:text-slate-900 transition-colors">Dashboard</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/manager/properties" className="hover:text-slate-900 transition-colors">Properties</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-semibold text-slate-900">Add Unit</span>
       </div>

       <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm text-slate-400">
                <Building2 className="w-8 h-8" />
             </div>
             <h1 className="text-2xl font-bold font-display text-slate-900">Add New Unit</h1>
             <p className="text-slate-500">Define the details for a new property unit.</p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Block / Street</label>
                      <input 
                         type="text" 
                         placeholder="e.g. Block A"
                         className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                         value={newUnit.block}
                         onChange={(e) => setNewUnit({...newUnit, block: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Unit Number</label>
                      <input 
                         type="text" 
                         required
                         placeholder="e.g. 101"
                         className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                         value={newUnit.number}
                         onChange={(e) => setNewUnit({...newUnit, number: e.target.value})}
                      />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Property Type</label>
                      <div className="relative">
                         <select 
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-sm appearance-none outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            value={newUnit.type}
                            onChange={(e) => setNewUnit({...newUnit, type: e.target.value})}
                         >
                            <option>Apartment</option>
                            <option>Duplex</option>
                            <option>Villa</option>
                            <option>Bungalow</option>
                            <option>Penthouse</option>
                         </select>
                         <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <ChevronRight className="w-4 h-4 rotate-90" />
                         </div>
                      </div>
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Bedrooms</label>
                      <div className="relative">
                         <select 
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-sm appearance-none outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            value={newUnit.bedrooms}
                            onChange={(e) => setNewUnit({...newUnit, bedrooms: e.target.value})}
                         >
                            <option>Studio</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4+</option>
                         </select>
                         <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <ChevronRight className="w-4 h-4 rotate-90" />
                         </div>
                      </div>
                   </div>
                </div>

                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Initial Status</label>
                   <div className="grid grid-cols-3 gap-4">
                      {['vacant', 'occupied', 'maintenance'].map((status) => (
                         <div 
                            key={status}
                            onClick={() => setNewUnit({...newUnit, status})}
                            className={`
                               p-4 rounded-xl border-2 text-center cursor-pointer capitalize font-bold text-sm transition-all
                               ${newUnit.status === status 
                                  ? 'border-primary bg-primary/5 text-primary' 
                                  : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}
                            `}
                         >
                            {status}
                         </div>
                      ))}
                   </div>
                </div>

                <div className="pt-4 flex items-center gap-4">
                   <Link 
                      to="/manager/properties"
                      className="px-8 py-4 bg-slate-50 text-slate-500 font-bold rounded-xl hover:bg-slate-100 hover:text-slate-700 transition-colors"
                   >
                      Cancel
                   </Link>
                   <button 
                      type="submit" 
                      className="flex-1 py-4 bg-primary text-white font-bold rounded-xl hover:bg-sky-600 hover:shadow-lg hover:shadow-primary/20 transition-all transform active:scale-95"
                   >
                      Create Unit
                   </button>
                </div>
             </form>
          </div>
       </div>
    </div>
  );
}