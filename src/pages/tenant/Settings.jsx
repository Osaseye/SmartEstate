import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore'; 
import { db } from '../../lib/firebase';
import { 
  LucideUser, 
  LucideLock, 
  LucideBell, 
  LucideSave, 
  LucideShield, 
  LucideMail,
  LucidePhone
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { FaSpinner } from 'react-icons/fa';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form States
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [notifications, setNotifications] = useState({
    email_alerts: true,
    sms_alerts: false,
    maintenance_updates: true,
    payment_reminders: true
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    try {
      const userRef = doc(db, "users", user.id || user.uid);
      await updateDoc(userRef, {
        name: profileData.name,
        phone: profileData.phone
      });
      setSuccessMsg('Profile updated successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch(err) {
      console.error(err);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      alert("New passwords do not match");
      return;
    }
    
    setLoading(true);
    // Real password update requires re-authentication with current password
    setTimeout(() => {
        setSuccessMsg('Password changed successfully (Simulation)');
        setPasswordData({ current: '', new: '', confirm: '' });
        setTimeout(() => setSuccessMsg(''), 3000);
        setLoading(false);
    }, 1000);
  };

  const TABS = [
    { id: 'profile', label: 'My Profile', icon: LucideUser },
    { id: 'security', label: 'Security', icon: LucideShield },
    { id: 'notifications', label: 'Notifications', icon: LucideBell },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-20">
      
      <div className="space-y-2">
         <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold font-display text-slate-900">Account Settings</h1>
            <button 
                onClick={() => window.location.href = '/login'}
                className="md:hidden px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold flex items-center gap-2 border border-red-100"
            >
                <LucideUser className="w-3 h-3" /> Log Out
            </button>
         </div>
         <p className="text-slate-500">Manage your profile, security preferences and notifications.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
           {TABS.map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={cn(
                 "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap",
                 activeTab === tab.id 
                   ? "bg-white text-primary shadow-sm border border-slate-100 ring-1 ring-primary/5" 
                   : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
               )}
             >
               <tab.icon className="w-5 h-5" />
               {tab.label}
             </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
             
             {successMsg && (
               <div className="bg-green-50 text-green-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 text-sm font-bold border border-green-100">
                 <LucideCheckCircle className="w-4 h-4" /> {successMsg}
               </div>
             )}

             {/* Profile Tab */}
             {activeTab === 'profile' && (
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                   <div className="flex items-center gap-4 mb-8">
                      <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 text-3xl font-bold border-2 border-white shadow-lg">
                        {profileData.name.charAt(0)}
                      </div>
                      <div>
                        <button type="button" className="text-sm font-bold text-primary bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors">
                          Change Avatar
                        </button>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Full Name</label>
                        <div className="relative">
                          <LucideUser className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            value={profileData.name}
                            onChange={e => setProfileData({...profileData, name: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Phone Number</label>
                        <div className="relative">
                          <LucidePhone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="tel" 
                            value={profileData.phone}
                            onChange={e => setProfileData({...profileData, phone: e.target.value})}
                            placeholder="+234..."
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-bold text-slate-700">Email Address</label>
                        <div className="relative">
                          <LucideMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="email" 
                            value={profileData.email}
                            disabled
                            className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                          />
                        </div>
                        <p className="text-xs text-slate-400 ml-1">Email address cannot be changed directly.</p>
                      </div>
                   </div>

                   <div className="pt-4 flex justify-end">
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
                      >
                        {loading && <FaSpinner className="animate-spin" />}
                        Save Changes
                      </button>
                   </div>
                </form>
             )}

             {/* Security Tab */}
             {activeTab === 'security' && (
                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                   <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Current Password</label>
                        <div className="relative">
                          <LucideLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="password" 
                            value={passwordData.current}
                            onChange={e => setPasswordData({...passwordData, current: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="Enter current password"
                          />
                        </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">New Password</label>
                        <input 
                            type="password" 
                            value={passwordData.new}
                            onChange={e => setPasswordData({...passwordData, new: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="Min. 8 characters"
                          />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Confirm New Password</label>
                        <input 
                            type="password" 
                            value={passwordData.confirm}
                            onChange={e => setPasswordData({...passwordData, confirm: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="Repeat new password"
                          />
                      </div>
                   </div>

                   <div className="pt-4 flex justify-end">
                      <button 
                        type="submit" 
                        disabled={loading || !passwordData.current || !passwordData.new}
                        className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                         {loading && <FaSpinner className="animate-spin" />}
                        Update Password
                      </button>
                   </div>
                </form>
             )}

             {/* Notifications Tab */}
             {activeTab === 'notifications' && (
                <div className="space-y-6">
                   {[
                     { id: 'email_alerts', label: 'Email Notifications', desc: 'Receive daily summaries and critical alerts via email.' },
                     { id: 'sms_alerts', label: 'SMS Alerts', desc: 'Get text messages for urgent maintenance updates.' },
                     { id: 'maintenance_updates', label: 'Maintenance Updates', desc: 'Notifications when your ticket status changes.' },
                     { id: 'payment_reminders', label: 'Payment Reminders', desc: 'Get reminded 3 days before rent is due.' },
                   ].map((item) => (
                     <div key={item.id} className="flex items-start justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                        <div>
                           <div className="font-bold text-slate-900">{item.label}</div>
                           <div className="text-sm text-slate-500 mt-1 max-w-sm">{item.desc}</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={notifications[item.id]} 
                            onChange={() => setNotifications({...notifications, [item.id]: !notifications[item.id]})}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                     </div>
                   ))}

                   <div className="pt-4 flex justify-end">
                      <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all">
                        Save Preferences
                      </button>
                   </div>
                </div>
             )}

          </div>
        </div>
      </div>
    </div>
  );
};

// Simple check circle icon for success message
const LucideCheckCircle = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

export default Settings;
