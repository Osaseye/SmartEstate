import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MockService } from '../../services/mockService';
import { 
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  ExternalLink,
  Eye,
  Filter
} from 'lucide-react';
import Loader from '../../components/ui/Loader';
import { cn } from '../../lib/utils';

export default function ManagerFinance() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // pending | approved | rejected
  const [processingId, setProcessingId] = useState(null);
  
  // Modal for Viewing Proof
  const [selectedProof, setSelectedProof] = useState(null);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = () => {
    setLoading(true);
    try {
      const data = MockService.getAll();
      const myEstate = data.estates.find(e => e.managerId === user.id);
      
      if (myEstate) {
        const tenantIds = data.users
            .filter(u => u.estateId === myEstate.id)
            .map(u => u.id);
        
        // Filter payments
        const estatePayments = (data.payments || []).filter(p => tenantIds.includes(p.tenantId));

        // Enrich
        const enrichedPayments = estatePayments.map(p => ({
           ...p,
           tenant: data.users.find(u => u.id === p.tenantId)
        }));
        
        // Sort by date desc
        enrichedPayments.sort((a,b) => new Date(b.date) - new Date(a.date));

        setPayments(enrichedPayments);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setLoading(false), 800); // Simulate network
    }
  };

  const handleUpdateStatus = (id, newStatus) => {
     setProcessingId(id);
     setTimeout(() => {
        const data = MockService.getAll();
        const payIndex = data.payments.findIndex(p => p.id === id);
        
        if (payIndex > -1) {
           data.payments[payIndex].status = newStatus;
           MockService.update(data);
           fetchData();
        }
        setProcessingId(null);
        setSelectedProof(null);
     }, 1000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };

  if (loading) return <Loader />;

  const filteredPayments = payments.filter(p => p.status === activeTab);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       {/* Header */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 font-display">Payment Approvals</h1>
           <p className="text-slate-500">Review and approve proof of payments uploaded by tenants.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
         {['pending', 'approved', 'rejected'].map(tab => (
            <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={cn(
                  "px-6 py-3 text-sm font-bold capitalize border-b-2 transition-all",
                  activeTab === tab 
                     ? "border-slate-900 text-slate-900" 
                     : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
               )}
            >
               {tab} ({payments.filter(p => p.status === tab).length})
            </button>
         ))}
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredPayments.map(pay => (
            <div key={pay.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
               
               {/* Image Preview Area */}
               <div className="h-40 bg-slate-100 relative overflow-hidden group-hover:bg-slate-200 transition-colors cursor-pointer" onClick={() => setSelectedProof(pay)}>
                  {pay.proofUrl ? (
                     <img src={pay.proofUrl} alt="Proof" className="w-full h-full object-cover" />
                  ) : (
                     <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <FileText className="w-8 h-8 mb-2" />
                        <span className="text-xs font-bold">No Image</span>
                     </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                     <span className="bg-white/90 px-3 py-1.5 rounded-full text-xs font-bold text-slate-900 flex items-center gap-2 shadow-lg scale-95 group-hover:scale-100 transition-transform">
                        <Eye className="w-3 h-3" /> View Proof
                     </span>
                  </div>
               </div>

               <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <h3 className="font-bold text-slate-900">{pay.description}</h3>
                        <p className="text-sm text-slate-500">{new Date(pay.date).toLocaleDateString()}</p>
                     </div>
                     <span className="bg-slate-50 px-2 py-1 rounded text-xs font-bold text-slate-600">
                        {formatCurrency(pay.amount)}
                     </span>
                  </div>

                  <div className="flex items-center gap-2 mb-6">
                     <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                        {pay.tenant?.name?.substring(0,2)}
                     </div>
                     <span className="text-sm font-medium text-slate-700">{pay.tenant?.name}</span>
                  </div>

                  {activeTab === 'pending' && (
                     <div className="mt-auto grid grid-cols-2 gap-3">
                        <button 
                           disabled={!!processingId}
                           onClick={() => handleUpdateStatus(pay.id, 'rejected')}
                           className="py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-50"
                        >
                           Decline
                        </button>
                        <button 
                           disabled={!!processingId}
                           onClick={() => handleUpdateStatus(pay.id, 'approved')}
                           className="py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 shadow-lg shadow-slate-200 transition-colors disabled:opacity-50"
                        >
                           {processingId === pay.id ? 'Saving...' : 'Approve'}
                        </button>
                     </div>
                  )}

                  {activeTab !== 'pending' && (
                     <div className="mt-auto pt-4 border-t border-slate-50 text-center">
                        <span className={cn(
                           "inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider",
                           pay.status === 'approved' ? 'text-green-600' : 'text-red-500'
                        )}>
                           {pay.status === 'approved' ? (
                              <><CheckCircle className="w-4 h-4" /> Approved</> 
                           ) : (
                              <><XCircle className="w-4 h-4" /> Rejected</>
                           )}
                        </span>
                     </div>
                  )}
               </div>
            </div>
         ))}
      </div>

      {filteredPayments.length === 0 && (
         <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
               <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-slate-900 font-bold mb-1">No {activeTab} payments</h3>
            <p className="text-slate-500 text-sm">There are no payment records in this category.</p>
         </div>
      )}

      {/* Proof Modal */}
      {selectedProof && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
                 <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                     <h3 className="font-bold text-slate-900">Proof of Payment: {selectedProof.description}</h3>
                     <button onClick={() => setSelectedProof(null)} className="text-slate-400 hover:text-slate-900">
                        <XCircle className="w-6 h-6" />
                     </button>
                 </div>
                 <div className="aspect-video bg-black flex items-center justify-center relative">
                     {selectedProof.proofUrl ? (
                         <img src={selectedProof.proofUrl} className="max-h-[60vh] object-contain" />
                     ) : (
                        <span className="text-white">No Image Available</span>
                     )}
                 </div>
                 {selectedProof.status === 'pending' && (
                     <div className="p-4 flex gap-4 bg-white">
                        <button 
                           disabled={!!processingId}
                           onClick={() => handleUpdateStatus(selectedProof.id, 'rejected')}
                           className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                        >
                           Decline
                        </button>
                        <button 
                           disabled={!!processingId}
                           onClick={() => handleUpdateStatus(selectedProof.id, 'approved')}
                           className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-lg"
                        >
                           {processingId === selectedProof.id ? 'Processing...' : 'Approve Payment'}
                        </button>
                     </div>
                 )}
             </div>
         </div>
      )}

    </div>
  );
}