import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { uploadFile } from '../../lib/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { FaFileUpload, FaFileAlt, FaChevronRight } from 'react-icons/fa';

const MakePayment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [amount, setAmount] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
    
  // Bank Details (Hardcoded for now as per requirements)
  const bankDetails = {
    bankName: "GTBank",
    accountNumber: "0123456789",
    accountName: "Banana Island SmartEstate"
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !amount) return;

    setUploading(true);
    
    try {
        // Upload proof file first
        const fileUrl = await uploadFile(selectedFile, 'payments');

        const newPayment = {
            date: new Date().toISOString().split('T')[0],
            description: 'Payment Uploaded',
            amount: parseFloat(amount), 
            status: 'pending',
            tenantId: user.uid || user.id,
            estateId: user.estateId,
            proofFile: fileUrl || '', 
            createdAt: serverTimestamp()
        };

        await addDoc(collection(db, "payments"), newPayment);
        
        setUploading(false);
        alert('Payment proof uploaded successfully!');
        navigate('/tenant/payments');
    } catch (err) {
        console.error("Error creating payment:", err);
        setUploading(false);
        alert('Failed to submit payment.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/tenant/payments" className="hover:text-primary transition-colors">Payments</Link>
        <FaChevronRight className="w-3 h-3" />
        <span className="font-semibold text-slate-900">Make Payment</span>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-display text-slate-900">Upload Payment Proof</h1>
        <p className="text-slate-500">Please transfer the amount to the account below and upload your receipt.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
        
        {/* Left Side: Bank Details & Amount */}
        <div className="space-y-8">
          
          {/* Bank Card Section */}
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
             {/* Abstract background pattern */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
             <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/20 rounded-full -ml-5 -mb-5 blur-xl"></div>
             
             <div className="relative z-10 space-y-6">
               <div>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Bank Name</p>
                  <p className="text-2xl font-bold font-display">{bankDetails.bankName}</p>
               </div>
               
               <div>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Account Number</p>
                  <p className="text-3xl font-mono font-bold tracking-widest">{bankDetails.accountNumber}</p>
               </div>
               
               <div>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Account Name</p>
                  <p className="text-lg font-medium">{bankDetails.accountName}</p>
               </div>
             </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-3">
             <label htmlFor="amount" className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Amount Paid (₦)</label>
             <input
               type="number"
               id="amount"
               value={amount}
               onChange={(e) => setAmount(e.target.value)}
               placeholder="e.g. 50000"
               className="w-full px-5 py-4 text-lg bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-300"
               required
             />
          </div>

        </div>

        {/* Right Side: Upload & Submit */}
        <div className="space-y-8">
           <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Proof of Payment</label>
              <div className={`
                  relative group cursor-pointer
                  flex flex-col items-center justify-center w-full h-64
                  border-2 border-dashed rounded-3xl
                  transition-all duration-300
                  ${selectedFile ? 'border-primary bg-primary/5' : 'border-slate-300 hover:border-primary/50 hover:bg-slate-50'}
              `}>
                  <input 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                  />
                  
                  <div className="text-center p-6 transition-transform duration-300 group-hover:scale-105">
                      {selectedFile ? (
                          <>
                             <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
                                <FaFileAlt className="text-3xl" />
                             </div>
                             <p className="text-slate-900 font-bold truncate max-w-[200px] mx-auto">{selectedFile.name}</p>
                             <p className="text-primary text-sm font-medium mt-1">Tap to change file</p>
                          </>
                      ) : (
                          <>
                             <div className="w-16 h-16 mx-auto bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <FaFileUpload className="text-3xl" />
                             </div>
                             <p className="text-slate-900 font-bold">Upload Receipt</p>
                             <p className="text-slate-500 text-sm mt-1">Support JPG, PNG or PDF</p>
                          </>
                      )}
                  </div>
              </div>
           </div>

           <button 
             onClick={handleSubmit}
             disabled={!selectedFile || !amount || uploading}
             className="w-full bg-primary hover:bg-primary/90 text-white text-lg py-4 rounded-xl font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all transform hover:-translate-y-1 active:translate-y-0"
           >
             {uploading ? 'Processing...' : 'Submit Payment'}
           </button>
        </div>

      </div>
    </div>
  );
};

export default MakePayment;
