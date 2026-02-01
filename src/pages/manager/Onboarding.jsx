import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MockService } from '../../services/mockService';

export default function ManagerOnboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [estateCode, setEstateCode] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    type: 'gated',
    image: null,
    structure: 'streets', // streets | blocks
    sharedHousing: false,
  });

  const handleCreateEstate = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const code = `EST-${Math.floor(1000 + Math.random() * 9000)}`;
    setEstateCode(code);

    MockService.createEstate({
      ...formData,
      code: code
    });

    setLoading(false);
    setStep(3); // Success step
  };

  const handleFinish = () => {
    navigate('/manager/dashboard');
    window.location.reload(); 
  };

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
             <p className="text-sm font-medium text-gray-900">Estate Setup</p>
             <p className="text-xs text-gray-500">Step {step} of 3</p>
           </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8">
        
        {/* STEP 1: Estate Information */}
        {step === 1 && (
          <div className="animate-fade-in">
             <div className="text-center mb-10">
               <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">Create Your Estate Profile</h1>
               <p className="text-gray-500 text-lg">Let's set up the digital twin of your community.</p>
             </div>

             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
                {/* Image Upload */}
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-3">Estate Image / Logo</label>
                   <div className="border-2 border-dashed border-gray-200 rounded-2xl h-48 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-primary/30 transition-colors cursor-pointer group relative overflow-hidden">
                      {formData.image ? (
                        <img src={URL.createObjectURL(formData.image)} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                      ) : (
                        <>
                          <span className="material-icons-round text-4xl text-gray-300 mb-3 group-hover:text-primary group-hover:scale-110 transition-all">add_photo_alternate</span>
                          <p className="text-sm text-gray-600 font-medium">Upload Estate Image</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG (Max 5MB)</p>
                        </>
                      )}
                      <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                        accept="image/*"
                      />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estate Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="e.g. Royal Gardens Estate"
                      />
                   </div>
                   <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input 
                        type="text" 
                        required
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="Street Address"
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input 
                        type="text" 
                        required
                        value={formData.city}
                        onChange={e => setFormData({...formData, city: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input 
                        type="text" 
                        required
                        value={formData.state}
                        onChange={e => setFormData({...formData, state: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                   </div>
                   <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Community Type</label>
                      <div className="grid grid-cols-3 gap-4">
                        {['gated', 'complex', 'open'].map((type) => (
                           <button
                             key={type}
                             type="button"
                             onClick={() => setFormData({...formData, type})}
                             className={`p-4 rounded-xl border text-left transition-all ${
                               formData.type === type 
                               ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                               : 'border-gray-200 hover:border-gray-300'
                             }`}
                           >
                              <span className="block capitalize font-bold text-gray-900 mb-1">{type}</span>
                              <span className="text-xs text-gray-500">
                                {type === 'gated' && 'Enclosed area with controlled access'}
                                {type === 'complex' && 'Multi-unit building or towers'}
                                {type === 'open' && 'Standard street layout'}
                              </span>
                           </button>
                        ))}
                      </div>
                   </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={() => setStep(2)}
                    disabled={!formData.name || !formData.address}
                    className="bg-primary hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     Next Step
                     <span className="material-icons-round">arrow_forward</span>
                  </button>
                </div>
             </div>
          </div>
        )}

        {/* STEP 2: Housing Configuration */}
        {step === 2 && (
          <div className="animate-fade-in max-w-3xl mx-auto">
             <button onClick={() => setStep(1)} className="flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors">
                <span className="material-icons-round mr-2">arrow_back</span>
                Back to Details
             </button>

             <div className="text-center mb-10">
               <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">Housing Structure</h1>
               <p className="text-gray-500 text-lg">How are homes organized in {formData.name}?</p>
             </div>

             <div className="space-y-6">
                <label className="block text-sm font-medium text-gray-700">Select Structure Format</label>
                <div className="grid md:grid-cols-2 gap-6">
                   <div 
                      onClick={() => setFormData({...formData, structure: 'streets'})}
                      className={`cursor-pointer p-6 rounded-2xl border-2 transition-all ${formData.structure === 'streets' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                   >
                      <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                         <span className="material-icons-round">signpost</span>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">Streets & Numbers</h3>
                      <p className="text-sm text-gray-500">
                         Residents identify by Street Name and House Number (e.g. 5, Adeola Odeku St).
                      </p>
                   </div>

                   <div 
                      onClick={() => setFormData({...formData, structure: 'blocks'})}
                      className={`cursor-pointer p-6 rounded-2xl border-2 transition-all ${formData.structure === 'blocks' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                   >
                      <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                         <span className="material-icons-round">domain</span>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">Blocks & Flats</h3>
                      <p className="text-sm text-gray-500">
                         Residents identify by Block Name/Letter and Flat Number (e.g. Block A, Flat 5).
                      </p>
                   </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between">
                   <div>
                      <h4 className="font-bold text-gray-900">Shared Housing / BQ</h4>
                      <p className="text-sm text-gray-500">Allow multiple tenants per address unit?</p>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.sharedHousing}
                        onChange={(e) => setFormData({...formData, sharedHousing: e.target.checked})}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                   </label>
                </div>

                <div className="pt-8 flex gap-4">
                   <button 
                      onClick={handleCreateEstate}
                      className="flex-1 py-4 text-gray-500 font-medium hover:text-gray-900 transition-colors"
                   >
                      Skip Housing Setup
                   </button>
                   <button 
                      onClick={handleCreateEstate}
                      disabled={loading}
                      className="flex-[2] bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                   >
                      {loading ? (
                         <>
                            <span className="material-icons-round animate-spin">sync</span>
                            Creating Estate...
                         </>
                      ) : 'Complete Setup'}
                   </button>
                </div>
             </div>
          </div>
        )}

        {/* STEP 3: Success */}
        {step === 3 && (
          <div className="animate-fade-in max-w-xl mx-auto pt-12 text-center">
             <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <span className="material-icons-round text-5xl text-green-600">check_circle</span>
             </div>
             
             <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Estate Created Successfully!</h2>
             <p className="text-gray-500 text-lg mb-8">
               Your manager dashboard is ready. Share your estate code with tenants so they can join.
             </p>

             <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-8 rounded-2xl mb-8 relative group cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => navigator.clipboard.writeText(estateCode)}>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Estate Code</p>
                <div className="text-4xl font-mono font-bold text-gray-900 tracking-wider font-display">{estateCode}</div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="material-icons-round text-gray-400">content_copy</span>
                </div>
                <p className="text-xs text-gray-400 mt-2 group-hover:text-primary transition-colors">Click to copy</p>
             </div>

             <button 
                onClick={handleFinish}
                className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20"
             >
                Go to Dashboard
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
