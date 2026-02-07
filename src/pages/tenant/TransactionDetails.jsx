import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FaChevronRight, FaCheckCircle, FaClock, FaFileAlt, FaDownload, FaArrowLeft } from 'react-icons/fa';

const TransactionDetails = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const docRef = doc(db, "payments", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
           setTransaction({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Error fetching transaction:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading details...</div>;
  }

  if (!transaction) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-slate-900">Transaction Not Found</h2>
        <Link to="/tenant/payments" className="text-primary hover:underline mt-2 inline-block">Return to Payments</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/tenant/payments" className="hover:text-primary transition-colors flex items-center gap-1">
             <FaArrowLeft className="w-3 h-3" /> Back to Payments
        </Link>
        <span className="text-slate-300">|</span>
        <span className="font-semibold text-slate-900">Transaction Details</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
         
         {/* Main Details Card */}
         <div className="flex-1 w-full space-y-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">Total Amount</p>
                        <h1 className="text-4xl font-bold font-display text-slate-900">{formatCurrency(transaction.amount)}</h1>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${
                        transaction.status === 'approved' 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                        {transaction.status === 'approved' ? (
                            <><FaCheckCircle /> Approved</>
                        ) : (
                            <><FaClock /> Pending Review</>
                        )}
                    </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-100">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Date</p>
                            <p className="text-slate-700 font-medium">{transaction.date}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Time</p>
                            <p className="text-slate-700 font-medium">14:30 PM</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Transaction ID</p>
                            <p className="text-slate-700 font-mono text-sm bg-slate-50 px-2 py-1 rounded w-fit">{transaction.id}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Category</p>
                            <p className="text-slate-700 font-medium">{transaction.description}</p>
                        </div>
                    </div>
                </div>
            </div>
         </div>

         {/* Receipt / Proof Section */}
         <div className="w-full md:w-80">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm h-full">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <FaFileAlt className="text-slate-400"/> Proof of Payment
                </h3>
                
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col items-center justify-center text-center h-48 mb-4">
                     {/* Mock Preview */}
                     <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-red-500 mb-2">
                        <FaFileAlt className="text-2xl" />
                     </div>
                     <p className="text-slate-700 font-medium text-sm truncate w-full px-4">{transaction.proofFile || "receipt.pdf"}</p>
                     <p className="text-slate-400 text-xs mt-1">Uploaded on {transaction.date}</p>
                </div>

                <button className="w-full py-2.5 border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center justify-center gap-2">
                    <FaDownload /> Download Receipt
                </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
