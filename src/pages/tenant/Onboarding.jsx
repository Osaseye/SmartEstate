import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MockService } from '../../services/mockService';

export default function TenantOnboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [estates, setEstates] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedEstate, setSelectedEstate] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    dob: '',
    stateOfOrigin: '',
    nationality: '',
    phone: user?.phone || '', // Pre-fill if available
    gender: 'Select'
  });

  useEffect(() => {
    // Load estates
    const data = MockService.getEstates();
    setEstates(data);

    // Auto-select estate logic (now happens at step 2, but we can pre-select)
    if (user?.estateCode) {
      const foundEstate = data.find(e => e.code === user.estateCode);
      if (foundEstate) {
        setSelectedEstate(foundEstate);
        // If code provided, we might still want them to fill personal info first
        // So we keep step 1, but maybe auto-advance if they already filled it? 
        // For now, let's make them fill info, then step 2 will be auto-skipped or pre-filled.
      }
    }
  }, [user]);

  const filteredEstates = estates.filter(e =>  
    e.name.toLowerCase().includes(search.toLowerCase()) || 
    e.code?.toLowerCase().includes(search.toLowerCase())
  );
  
  const handlePersonalInfoSubmit = (e) => {
    e.preventDefault();
    if(selectedEstate && user?.estateCode) {
        setStep(3); // Skip search if already has code
    } else {
        setStep(2);
    }
  };

  const handleJoin = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Longer delay for effect
    
    MockService.requestAccess(selectedEstate.id);
    setLoading(false);
    setStep(4); // Move to Success State
  };
  
  const handleFinish = () => {
    navigate('/tenant/dashboard');
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
           <div className="flex items-center gap-3">
             <img src="/icon.png" alt="SmartEstate" className="h-8 w-auto" />
             <span className="font-display font-bold text-xl text-gray-900">SmartEstate</span>
           </div>
           <div className="text-right">
             <p className="text-sm font-medium text-gray-900">Join Community</p>
             <p className="text-xs text-gray-500">Step {step} of 4</p>
           </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-8">
        {/* STEP 1: Personal Information */}
        {step === 1 && (
          <div className="animate-fade-in max-w-2xl mx-auto">
             <div className="text-center mb-10">
               <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">Tell Us About Yourself</h1>
               <p className="text-gray-500 text-lg">We need a few more details to complete your profile.</p>
             </div>

             <form onSubmit={handlePersonalInfoSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        value={user?.name || ''} 
                        disabled 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500"
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                       <input 
                        type="tel" 
                        required
                        value={personalInfo.phone}
                        onChange={e => setPersonalInfo({...personalInfo, phone: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
                        placeholder="+234..."
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <input 
                        type="date" 
                        required
                        value={personalInfo.dob}
                        onChange={e => setPersonalInfo({...personalInfo, dob: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <select 
                        value={personalInfo.gender}
                        onChange={e => setPersonalInfo({...personalInfo, gender: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
                      >
                         <option>Select</option>
                         <option value="Male">Male</option>
                         <option value="Female">Female</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State of Origin</label>
                      <input 
                        type="text" 
                        required
                        value={personalInfo.stateOfOrigin}
                        onChange={e => setPersonalInfo({...personalInfo, stateOfOrigin: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
                        placeholder="e.g. Lagos"
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                      <input 
                        type="text" 
                        required
                        value={personalInfo.nationality}
                        onChange={e => setPersonalInfo({...personalInfo, nationality: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
                        placeholder="e.g. Nigerian"
                      />
                   </div>
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full bg-secondary hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-secondary/20">
                     Continue
                  </button>
                </div>
             </form>
          </div>
        )}

        {/* STEP 2: Find Estate */}
        {step === 2 && (
          <div className="animate-fade-in max-w-3xl mx-auto">
             <div className="text-center mb-10">
               <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">Find Your Estate</h1>
               <p className="text-gray-500 text-lg">Search for your residential community to request access.</p>
             </div>

             <div className="relative mb-8">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 material-icons-round text-2xl">search</span>
                <input 
                  type="text" 
                  placeholder="Search by estate name, code, or address..." 
                  className="w-full pl-16 pr-6 py-5 rounded-2xl border border-gray-200 shadow-sm text-lg focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="space-y-4">
                {filteredEstates.length === 0 ? (
                  <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <span className="material-icons-round text-5xl text-gray-300 mb-4">location_off</span>
                    <p className="text-gray-500 font-medium">No estates found matching "{search}"</p>
                  </div>
                ) : (
                  filteredEstates.map(estate => (
                    <div 
                      key={estate.id}
                      onClick={() => { setSelectedEstate(estate); setStep(3); }}
                      className="group bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-secondary/30 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-gray-100 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                           {estate.image ? (
                             <img src={estate.image} alt={estate.name} className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 text-secondary">
                                <span className="material-icons-round text-3xl">apartment</span>
                             </div>
                           )}
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 group-hover:text-secondary transition-colors">{estate.name}</h3>
                          <div className="flex items-center gap-2 mt-1 text-gray-500">
                            <span className="material-icons-round text-sm">place</span>
                            <span>{estate.address}</span>
                          </div>
                        </div>
                      </div>
                      <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 text-gray-600 text-sm font-medium group-hover:bg-secondary group-hover:text-white transition-colors">
                        Select
                        <span className="material-icons-round text-sm">arrow_forward</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
          </div>
        )}

        {/* STEP 3: Verification Request */}
        {step === 3 && selectedEstate && (
          <div className="animate-fade-in max-w-xl mx-auto pt-8">
             <button onClick={() => setStep(2)} className="flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors">
                <span className="material-icons-round mr-2">arrow_back</span>
                Back to search
             </button>

             <h2 className="text-2xl font-bold font-display text-gray-900 mb-6">Verification Request</h2>

             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8 flex items-center gap-4">
                <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    {selectedEstate.image ? (
                        <img src={selectedEstate.image} alt={selectedEstate.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-green-50 text-secondary">
                             <span className="material-icons-round">apartment</span>
                        </div>
                    )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Selected Estate</p>
                  <p className="font-bold text-gray-900 text-lg">{selectedEstate.name}</p>
                </div>
             </div>

             <div className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">


               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Upload Valid ID (Govt Issued)</label>
                 <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center hover:bg-gray-50 hover:border-secondary/30 transition-colors cursor-pointer group">
                    <span className="material-icons-round text-4xl text-gray-300 mb-3 group-hover:text-secondary group-hover:scale-110 transition-all">cloud_upload</span>
                    <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-2">JPG, PNG or PDF (Max 5MB)</p>
                 </div>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Proof of Residency (Optional)</label>
                  <input type="file" className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-3 file:px-6
                    file:rounded-xl file:border-0
                    file:text-sm file:font-semibold
                    file:bg-secondary/10 file:text-secondary
                    hover:file:bg-secondary/20
                    transition-all
                    cursor-pointer
                  "/>
               </div>

               <div className="pt-6">
                 <button 
                   onClick={handleJoin}
                   disabled={loading}
                   className="w-full bg-secondary hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-secondary/20 disabled:opacity-70 flex items-center justify-center gap-2"
                 >
                   {loading ? (
                     <>
                        <span className="material-icons-round animate-spin text-lg">sync</span>
                        Processing...
                     </>
                   ) : 'Submit Request'}
                 </button>
               </div>
            </div>
          </div>
        )}

        {/* STEP 4: Success / Pending Review */}
        {step === 4 && (
          <div className="animate-fade-in max-w-xl mx-auto pt-12 text-center">
             <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <span className="material-icons-round text-5xl text-secondary">check_circle</span>
             </div>
             
             <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Request Submitted!</h2>
             <p className="text-gray-500 text-lg mb-8">
               Your verification request has been sent to the estate manager. 
               You will be notified once they review and approve your access.
             </p>

             <div className="bg-blue-50 p-6 rounded-2xl mb-8 flex items-start gap-4 text-left">
                <span className="material-icons-round text-blue-500 mt-1">info</span>
                <div>
                   <h4 className="font-bold text-blue-900 mb-1">What happens next?</h4>
                   <p className="text-sm text-blue-700">
                     The estate manager will verify your documents. This usually takes 24-48 hours. 
                     You can check your status on your dashboard.
                   </p>
                </div>
             </div>

             <button 
                onClick={handleFinish}
                className="w-full bg-secondary hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-secondary/20"
             >
                Go to Dashboard
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
