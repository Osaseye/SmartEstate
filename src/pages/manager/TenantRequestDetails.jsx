import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast, ToastContainer } from '../../components/ui/Toast';
import { db } from '../../lib/firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore'; 
import { 
  Building2, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  UserCheck, 
  Clock, 
  Shield, 
  CheckCircle,
  XCircle,
  ChevronRight,
  ArrowLeft,
  FileText
} from 'lucide-react';
import Loader from '../../components/ui/Loader';
import { cn } from '../../lib/utils';

export default function TenantRequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast, toasts, removeToast } = useToast();
  
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vacantUnits, setVacantUnits] = useState([]);
  const [assignmentUnit, setAssignmentUnit] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id, user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!user.estateId) {
         setLoading(false);
         return;
      }

      // 1. Find the user
      const userDoc = await getDoc(doc(db, "users", id));
      if (userDoc.exists()) {
          setRequest({ id: userDoc.id, ...userDoc.data() });
      } else {
          console.error("User not found");
      }

      // 2. Get vacant units
      const q = query(collection(db, "properties"), where("estateId", "==", user.estateId), where("status", "==", "vacant"));
      const snapshot = await getDocs(q);
      const estateUnits = snapshot.docs.map(d => ({id: d.id, ...d.data()}));
      setVacantUnits(estateUnits);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!request || !assignmentUnit) return;
    setIsProcessing(true);

    try {
      // 1. Update User Profile
      const userRef = doc(db, "users", request.id);
      await updateDoc(userRef, {
          verificationStatus: 'verified',
          houseId: assignmentUnit
      });

      // 2. Update Property Status
      const unitRef = doc(db, "properties", assignmentUnit);
      await updateDoc(unitRef, {
          status: 'occupied',
          tenantId: request.id,
          tenantName: request.name
      });
      addToast({
        type: 'success',
        title: 'Tenant Approved',
        message: `${request.name} has been assigned to unit successfully.`
      });
      
      // Delay nav slightly
      setTimeout(() => navigate('/manager/tenants'), 1000);
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', title: 'Action Failed', message: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async () => {
      // Logic for decline would go here
      addToast({ type: 'info', title: 'Declined', message: 'Application was declined.' });
      navigate('/manager/tenants');
  };

  if (loading) return <Loader />;
  if (!request) return <div className="p-10 text-center">Request not found. <Link to="/manager/tenants" className="text-blue-600 underline">Go Back</Link></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/manager/tenants" className="hover:text-slate-900 transition-colors">Tenants</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="font-bold text-slate-900">Application Review</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-slate-600" />
                </button>
                <div>
                   <h1 className="text-2xl font-bold text-slate-900 font-display">Tenant Application</h1>
                   <p className="text-slate-500">Review applicant details and assign a property.</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                 <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-orange-200 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Pending Review
                 </span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Applicant Info */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Profile Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-8 -mt-8 z-0"></div>
                    <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                         <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-400 shadow-inner">
                            {request.name.substring(0,2)}
                         </div>
                         <div className="flex-1">
                             <h2 className="text-xl font-bold text-slate-900 mb-1">{request.name}</h2>
                             <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                                <Mail className="w-4 h-4" /> {request.email}
                             </div>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                     <div className="text-xs text-slate-400 font-bold uppercase mb-1 flex items-center gap-1"><Briefcase className="w-3 h-3" /> Employer</div>
                                     <div className="font-semibold text-slate-700">{request.employer || 'Self-Employed'}</div>
                                 </div>
                                 <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                     <div className="text-xs text-slate-400 font-bold uppercase mb-1 flex items-center gap-1"><UserCheck className="w-3 h-3" /> Next of Kin</div>
                                     <div className="font-semibold text-slate-700">{request.nextOfKin || 'Not Specified'}</div>
                                 </div>
                             </div>
                         </div>
                    </div>
                </div>

                {/* ID Proof Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-slate-400" /> Identity Verification
                    </h3>
                    <div className="bg-slate-50 rounded-2xl p-2 border-2 border-dashed border-slate-200 overflow-hidden">
                        {(request.idDocumentUrl || request.proofOfIdentity) ? (
                             (() => {
                                 const url = request.idDocumentUrl || request.proofOfIdentity;
                                 const isPdf = url.toLowerCase().includes('.pdf');
                                 
                                 return (
                                    <div className="relative group">
                                        {isPdf ? (
                                            <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3 bg-slate-100/50 rounded-xl">
                                                <FileText className="w-16 h-16" />
                                                <span className="font-medium">PDF Document</span>
                                            </div>
                                        ) : (
                                            <img src={url} alt="ID Proof" className="w-full h-64 object-contain rounded-xl bg-white" />
                                        )}
                                        
                                        <a 
                                            href={url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="absolute inset-0 bg-slate-900/0 hover:bg-slate-900/60 transition-all flex items-center justify-center opacity-0 hover:opacity-100 rounded-xl"
                                        >
                                            <span className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-sm shadow-xl flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                                {isPdf ? 'Open PDF' : 'View Full Image'}
                                            </span>
                                        </a>
                                    </div>
                                 );
                             })()
                        ) : (
                             <div className="h-40 flex items-center justify-center text-slate-400 font-medium">No ID Document Uploaded</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column: Actions */}
            <div className="space-y-6">
                
                {/* Assignment Box */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-6">
                    <h3 className="font-bold text-slate-900 mb-2">Action Required</h3>
                    <p className="text-sm text-slate-500 mb-6">Select a unit to finalize the lease agreement and approve access.</p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Assign Unit</label>
                            {vacantUnits.length > 0 ? (
                                <select 
                                   className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
                                   value={assignmentUnit}
                                   onChange={(e) => setAssignmentUnit(e.target.value)}
                                >
                                   <option value="">-- Select Vacant Unit --</option>
                                   {vacantUnits.map(unit => (
                                      <option key={unit.id} value={unit.id}>
                                         {unit.name} • {unit.type}
                                      </option>
                                   ))}
                                </select>
                            ) : (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                                    No vacant units available. 
                                    <Link to="/manager/properties/new" className="underline ml-1 font-bold">Create one</Link>
                                </div>
                            )}
                        </div>

                        <button 
                            disabled={!assignmentUnit || isProcessing}
                            onClick={handleApprove}
                            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            {isProcessing ? 'Processing...' : <><CheckCircle className="w-4 h-4" /> Approve & Assign</>}
                        </button>

                         <button 
                            disabled={isProcessing}
                            onClick={handleDecline}
                            className="w-full py-3 bg-white text-slate-500 border border-slate-200 rounded-xl font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all flex items-center justify-center gap-2"
                        >
                            <XCircle className="w-4 h-4" /> Decline Application
                        </button>
                    </div>
                </div>

            </div>
        </div>
        <ToastContainer toasts={toasts} remove={removeToast} />
    </div>
  );
}