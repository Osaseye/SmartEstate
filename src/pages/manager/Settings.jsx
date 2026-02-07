import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MockService } from '../../services/mockService';
import { 
  Save,
  Building,
  User,
  Lock,
  LogOut
} from 'lucide-react';

export default function ManagerSettings() {
  const { user, login } = useAuth(); // Assuming login or a setAuth exists, we might need a way to update context
  
  const [activeTab, setActiveTab] = useState('profile'); // profile | estate | security
  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [estateData, setEstateData] = useState({ name: '', address: '', code: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name, email: user.email });
      
      const data = MockService.getAll();
      const myEstate = data.estates.find(e => e.managerId === user.id);
      if (myEstate) {
         setEstateData({ 
            name: myEstate.name, 
            address: myEstate.address, 
            code: myEstate.code 
         });
      }
    }
  }, [user]);

  const handleSave = (e) => {
     e.preventDefault();
     setIsSaving(true);
     
     // Simulate API delay
     setTimeout(() => {
        const data = MockService.getAll();
        
        // Update User
        const userIndex = data.users.findIndex(u => u.id === user.id);
        if (userIndex > -1) {
           data.users[userIndex] = { ...data.users[userIndex], ...profileData };
           data.auth = data.users[userIndex]; // Update session
        }

        // Update Estate
        if (activeTab === 'estate') {
           const estateIndex = data.estates.findIndex(e => e.managerId === user.id);
           if (estateIndex > -1) {
              data.estates[estateIndex] = { ...data.estates[estateIndex], ...estateData };
           }
        }

        MockService.update(data);
        setIsSaving(false);
        // Force refresh or simple alert
        alert('Settings saved!');
     }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
       <div className="border-b border-slate-200 pb-6">
          <h1 className="text-2xl font-bold text-slate-900 font-display">Settings</h1>
          <p className="text-slate-500">Manage your profile and estate preferences.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Menu */}
          <div className="space-y-2">
             <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-3 ${activeTab === 'profile' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
             >
                <User className="w-4 h-4" /> My Profile
             </button>
             <button 
                onClick={() => setActiveTab('estate')}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-3 ${activeTab === 'estate' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
             >
                <Building className="w-4 h-4" /> Estate Details
             </button>
             <button 
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-3 ${activeTab === 'security' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
             >
                <Lock className="w-4 h-4" /> Security
             </button>
          </div>

          {/* Content Area */}
          <div className="md:col-span-3">
             <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
                
                {activeTab === 'profile' && (
                   <form onSubmit={handleSave} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                            <input 
                               type="text" 
                               className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/10"
                               value={profileData.name}
                               onChange={e => setProfileData({...profileData, name: e.target.value})}
                            />
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                            <input 
                               type="email" 
                               disabled
                               className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                               value={profileData.email}
                            />
                         </div>
                      </div>
                      <div className="pt-4 flex justify-between items-center">
                          <button 
                             // Mobile Logout
                             type="button"
                             onClick={() => {
                                 // Assuming logout logic is available via context, but we need to pass it or useAuth again 
                                 // (Note: we destructured login above, let's grab logout too - need to edit import line first if used)
                                 window.location.href = '/login'; 
                             }}
                             className="md:hidden flex items-center gap-2 text-red-600 font-bold text-sm bg-red-50 px-4 py-2 rounded-lg"
                          >
                             <LogOut className="w-4 h-4" /> Log Out
                          </button>

                          <button 
                            type="submit" 
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors ml-auto shadow-lg shadow-slate-200"
                          >
                             <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
                          </button>
                      </div>
                   </form>
                )}
                   <form onSubmit={handleSave} className="space-y-6">
                      <h3 className="text-lg font-bold text-slate-900 mb-6">Personal Information</h3>
                      <div className="grid grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                            <input 
                               value={profileData.name}
                               onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                               className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/10"
                            />
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                            <input 
                               value={profileData.email}
                               disabled
                               className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                            />
                         </div>
                      </div>
                      <div className="pt-6 border-t border-slate-50 flex justify-end">
                         <button disabled={isSaving} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50">
                            {isSaving ? 'Saving...' : 'Save Changes'}
                         </button>
                      </div>
                   </form>
                )}

                {activeTab === 'estate' && (
                   <form onSubmit={handleSave} className="space-y-6">
                      <h3 className="text-lg font-bold text-slate-900 mb-6">Estate Information</h3>
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Estate Name</label>
                         <input 
                            value={estateData.name}
                            onChange={(e) => setEstateData({...estateData, name: e.target.value})}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/10"
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Address</label>
                         <input 
                            value={estateData.address}
                            onChange={(e) => setEstateData({...estateData, address: e.target.value})}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/10"
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Estate Code (Read-only)</label>
                         <div className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-mono">
                            {estateData.code}
                         </div>
                      </div>
                      <div className="pt-6 border-t border-slate-50 flex justify-end">
                         <button disabled={isSaving} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50">
                            {isSaving ? 'Saving...' : 'Save Changes'}
                         </button>
                      </div>
                   </form>
                )}

                {activeTab === 'security' && (
                   <div className="space-y-6">
                      <h3 className="text-lg font-bold text-slate-900 mb-6">Security Settings</h3>
                      <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex gap-4">
                         <div className="shrink-0 mt-1">
                            <Lock className="w-5 h-5 text-orange-600" />
                         </div>
                         <div>
                            <h4 className="font-bold text-orange-800 text-sm">Change Password</h4>
                            <p className="text-slate-600 text-sm mt-1">To change your password, please contact support or use the 'Forgot Password' flow at login.</p>
                         </div>
                      </div>
                   </div>
                )}
             </div>
          </div>
       </div>

    </div>
  );
}