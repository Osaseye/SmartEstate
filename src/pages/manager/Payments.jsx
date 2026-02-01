import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MockService } from '../../services/mockService';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  ArrowUpRight,
  Download,
  AlertCircle,
  FileText
} from 'lucide-react';
import { cn } from '../../lib/utils'; // Assuming you have this utility

export default function ManagerFinance() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Stats
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);

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
        
        // Filter payments and invoices
        const estatePayments = (data.payments || []).filter(p => tenantIds.includes(p.tenantId));
        const estateInvoices = (data.invoices || []).filter(i => tenantIds.includes(i.tenantId));

        // Enrich
        const enrichedPayments = estatePayments.map(p => ({
           ...p,
           tenant: data.users.find(u => u.id === p.tenantId)
        }));

        setPayments(enrichedPayments);
        setInvoices(estateInvoices);

        // Calc stats
        const rev = estatePayments
         .filter(p => p.status === 'approved')
         .reduce((acc, curr) => acc + curr.amount, 0);
        
        const pending = estateInvoices
         .filter(i => i.status === 'pending')
         .reduce((acc, curr) => acc + curr.amount, 0);

        setTotalRevenue(rev);
        setPendingAmount(pending);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading financial data...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       {/* Header */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 font-display">Financial Overview</h1>
           <p className="text-slate-500">Monitor revenue, track payments, and manage invoices.</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 shadow-sm">
              <Download className="w-4 h-4" /> Download CSV
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-lg shadow-slate-200">
              <DollarSign className="w-4 h-4" /> Create Invoice
           </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl shadow-slate-200">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/10 rounded-2xl">
                    <Wallet className="w-6 h-6 text-white" />
                </div>
                <span className="flex items-center gap-1 text-green-400 text-xs font-bold bg-green-400/10 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3" /> +12.5%
                </span>
            </div>
            <div className="text-slate-400 text-sm font-medium mb-1">Total Revenue</div>
            <div className="text-3xl font-bold font-display">{formatCurrency(totalRevenue)}</div>
         </div>

         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-orange-50 rounded-2xl">
                    <AlertCircle className="w-6 h-6 text-orange-500" />
                </div>
            </div>
            <div className="text-slate-500 text-sm font-medium mb-1">Pending Invoices</div>
            <div className="text-3xl font-bold text-slate-900 font-display">{formatCurrency(pendingAmount)}</div>
         </div>

         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-2xl">
                    <FileText className="w-6 h-6 text-blue-500" />
                </div>
            </div>
            <div className="text-slate-500 text-sm font-medium mb-1">Open Invoices Count</div>
            <div className="text-3xl font-bold text-slate-900 font-display">
                {invoices.filter(i => i.status === 'pending').length}
            </div>
         </div>
      </div>

      {/* Transactions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Recent Payments List */}
         <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6 font-display">Recent Transactions</h3>
            <div className="space-y-4">
               {payments.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">No transactions recorded yet.</div>
               ) : (
                  payments.map(pay => (
                     <div key={pay.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                              <ArrowUpRight className="w-5 h-5" />
                           </div>
                           <div>
                              <div className="font-bold text-slate-900">{pay.description}</div>
                              <div className="text-xs text-slate-500 flex items-center gap-2">
                                 <span>{new Date(pay.date).toLocaleDateString()}</span>
                                 <span>•</span>
                                 <span>{pay.tenant?.name}</span>
                              </div>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="font-bold text-slate-900">{formatCurrency(pay.amount)}</div>
                           <div className="text-xs font-bold text-green-600 uppercase tracking-wide">Paid</div>
                        </div>
                     </div>
                  ))
               )}
            </div>
         </div>

         {/* Outstanding Details */}
         <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6 font-display">Outstanding Dues</h3>
             <div className="space-y-4">
               {invoices.filter(i => i.status === 'pending').map(inv => (
                  <div key={inv.id} className="p-4 border border-orange-100 bg-orange-50/50 rounded-2xl">
                     <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-800 text-sm">{inv.title}</h4>
                        <span className="text-xs font-bold text-orange-500 bg-white px-2 py-1 rounded shadow-sm">Due {new Date(inv.dueDate).toLocaleDateString()}</span>
                     </div>
                     <div className="text-2xl font-bold text-slate-900 mb-2">{formatCurrency(inv.amount)}</div>
                     <button className="w-full py-2 bg-white text-slate-600 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50">
                        Send Reminder
                     </button>
                  </div>
               ))}
               {invoices.filter(i => i.status === 'pending').length === 0 && (
                  <div className="text-center py-10 text-slate-400 text-sm">No outstanding invoices. Good job!</div>
               )}
            </div>
         </div>
      </div>

    </div>
  );
}