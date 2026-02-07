import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { uploadFile } from '../../lib/storage';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { 
  Save,
  Building,
  User,
  Lock,
  LogOut,
  Upload
} from 'lucide-react';
import { useToast, ToastContainer } from '../../components/ui/Toast';

export default function ManagerSettings() {
  const { user, logout } = useAuth(); 
  const { toasts, addToast, removeToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('profile'); 
  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [estateData, setEstateData] = useState({ name: '', address: '', code: '', image: '' });
  const [estateId, setEstateId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newImageFile, setNewImageFile] = useState(null); 

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name || '', email: user.email || '' });
      
      const fetchEstateKey = async () => {
         const q = query(collection(db, "estates"), where("managerId", "==", user.uid || user.id));
         const snapshot = await getDocs(q);
         if (!snapshot.empty) {
            const data = snapshot.docs[0].data();
            setEstateId(snapshot.docs[0].id);
            setEstateData({
               name: data.name || '',
               address: data.address || '',
               code: data.code || '',
               image: data.image || ''
            });
         }
      };
      
      fetchEstateKey();
    }
  }, [user]);

  const handleSave = async (e) => {
     e.preventDefault();
     setIsSaving(true);
     
     try {
       // Update User Profile
       if (user.uid) {
         const userRef = doc(db, "users", user.uid);
         await updateDoc(userRef, {
            name: profileData.name
         });
       }

       // Update Estate
       if (activeTab === 'estate' && estateId) {
          let imageUrl = estateData.image;
          
          if (newImageFile) {
              imageUrl = await uploadFile(newImageFile, 'estates');
          }

          const estateRef = doc(db, "estates", estateId);
          await updateDoc(estateRef, {
             name: estateData.name,
             address: estateData.address,
             image: imageUrl
          });

          setNewImageFile(null); // Clear pending file
       }

       addToast({
         type: 'success',
         title: 'Changes Saved',
         message: 'Your settings have been updated successfully.'
       });
     } catch (error) {
       console.error("Error saving settings:", error);
       addToast({
         type: 'error',
         title: 'Save Failed',
         message: 'Could not save changes. Please try again.'
       });
     } finally {
       setIsSaving(false);
     }
  };

  return (
    <>
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
                             type="button"
                             onClick={() => {
                                 if (logout) logout();
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
                
                {activeTab === 'estate' && (
                   <form onSubmit={handleSave} className="space-y-6">
                      
                      {/* Image Upload Section */}
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Estate Banner Image</label>
                         <div className="flex items-start gap-6">
                            <div className="w-32 h-20 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                               {(newImageFile || estateData.image) ? (
                                   <img 
                                     src={newImageFile ? URL.createObjectURL(newImageFile) : estateData.image} 
                                     alt="Estate Banner" 
                                     className="w-full h-full object-cover"
                                   />
                               ) : (
                                   <div className="w-full h-full flex items-center justify-center text-slate-400">
                                      <Building className="w-8 h-8" />
                                   </div>
                               )}
                            </div>
                            <div className="flex-1">
                                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase rounded-lg transition-colors mb-2">
                                    <Upload className="w-4 h-4" /> Upload New Image
                                    <input 
                                       type="file" 
                                       accept="image/*" 
                                       className="hidden" 
                                       onChange={(e) => {
                                           if(e.target.files[0]) setNewImageFile(e.target.files[0]);
                                       }}
                                    />
                                </label>
                                <p className="text-xs text-slate-500">Recommended size: 1200x400px. Max 5MB.</p>
                            </div>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6">
                         <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Estate Name</label>
                            <input 
                               type="text" 
                               className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/10"
                               value={estateData.name}
                               onChange={e => setEstateData({...estateData, name: e.target.value})}
                            />
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Estate Address</label>
                            <input 
                               type="text" 
                               className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/10"
                               value={estateData.address}
                               onChange={e => setEstateData({...estateData, address: e.target.value})}
                            />
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Estate Code (Read Only)</label>
                            <input 
                               type="text" 
                               disabled
                               className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-mono"
                               value={estateData.code}
                            />
                         </div>
                      </div>
                      <div className="pt-4 flex justify-end">
                          <button 
                            type="submit" 
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                          >
                             <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
                          </button>
                      </div>
                   </form>
                )}
                
                {activeTab === 'security' && (
                    <div className="text-center py-10 text-slate-400">
                        <p>Password change functionality coming soon.</p>
                    </div>
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
    <ToastContainer toasts={toasts} remove={removeToast} />
    </>
  );
}