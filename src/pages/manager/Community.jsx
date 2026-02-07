import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy } from 'firebase/firestore'; 
import { 
  Megaphone,
  Plus,
  Calendar,
  Bell,
  Trash2
} from 'lucide-react';
import { cn } from '../../lib/utils';

import Loader from '../../components/ui/Loader';

export default function ManagerCommunity() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [tenants, setTenants] = useState([]); // For dropdown
  
  // Form State
  const [newPost, setNewPost] = useState({ 
    title: '', 
    content: '', 
    type: 'news', 
    priority: 'normal',
    target: 'all', // all | specific
    targetTenantId: '' 
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!user.estateId) return;

      // 1. Fetch Tenants for Dropdown
      const usersQ = query(collection(db, "users"), where("estateId", "==", user.estateId), where("role", "==", "tenant"), where("verificationStatus", "==", "verified"));
      const usersSnap = await getDocs(usersQ);
      setTenants(usersSnap.docs.map(d => ({id: d.id, ...d.data()})));

      // 2. Fetch Announcements
      const annQ = query(collection(db, "announcements"), where("estateId", "==", user.estateId));
      // Note: OrderBy requires index, so we sort client side if needed or use simple query
      const annSnap = await getDocs(annQ);
      const annList = annSnap.docs.map(d => {
         const data = d.data();
         // Handle timestamps
         const date = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.date);
         return { id: d.id, ...data, date: date.toISOString() };
      });
      
      annList.sort((a,b) => new Date(b.date) - new Date(a.date));
      setAnnouncements(annList); 
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!user.estateId) return;

    try {
        const payload = {
            ...newPost,
            estateId: user.estateId,
            author: user.name || 'Manager',
            authorId: user.uid || user.id,
            createdAt: serverTimestamp(),
            readBy: []
        };
        
        // Add to Firestore
        const docRef = await addDoc(collection(db, "announcements"), payload);
        
        // Add to local state (optimistic)
        const localPost = {
            ...payload,
            id: docRef.id,
            date: new Date().toISOString()
        };
        
        setAnnouncements(prev => [localPost, ...prev]);
        setIsCreating(false);
        setNewPost({ title: '', content: '', type: 'news', priority: 'normal', target: 'all', targetTenantId: '' });

    } catch (err) {
        console.error("Error creating announcement", err);
        alert("Failed to post announcement");
    }
  };


  const getTypeColor = (type) => {
     switch(type) {
        case 'urgent': return 'bg-red-100 text-red-600 border-red-200';
        case 'event': return 'bg-purple-100 text-purple-600 border-purple-200';
        default: return 'bg-blue-100 text-blue-600 border-blue-200';
     }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 font-display">Community Board</h1>
           <p className="text-slate-500">Post announcements and updates for your estate residents.</p>
        </div>
        <button 
           onClick={() => setIsCreating(!isCreating)}
           className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-lg shadow-slate-200"
        >
           {isCreating ? 'Cancel' : <><Plus className="w-4 h-4" /> New Announcement</>}
        </button>
      </div>

      {isCreating && (
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm animate-in slide-in-from-top-4 duration-300">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Create New Announcement</h3>
            <form onSubmit={handlePost} className="space-y-4">
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
                  <input 
                     required
                     type="text" 
                     className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/20"
                     value={newPost.title}
                     onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                     placeholder="e.g. Elevator Maintenance"
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">Target Audience</label>
                     <select 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/20"
                        value={newPost.target}
                        onChange={(e) => setNewPost({...newPost, target: e.target.value})}
                     >
                        <option value="all">Every Resident</option>
                        <option value="specific">Specific Tenant</option>
                     </select>
                  </div>
                  {newPost.target === 'specific' && (
                     <div>
                         <label className="block text-sm font-bold text-slate-700 mb-1">Select Tenant</label>
                         <select 
                            required
                            className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/20"
                            value={newPost.targetTenantId}
                            onChange={(e) => setNewPost({...newPost, targetTenantId: e.target.value})}
                         >
                            <option value="">-- Choose Tenant --</option>
                            {tenants.map(t => (
                               <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                         </select>
                     </div>
                  )}
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">Type</label>
                     <select 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/20"
                        value={newPost.type}
                        onChange={(e) => setNewPost({...newPost, type: e.target.value})}
                     >
                        <option value="news">News / Update</option>
                        <option value="urgent">Urgent / Alert</option>
                        <option value="event">Event</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">Priority</label>
                     <select 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/20"
                        value={newPost.priority}
                        onChange={(e) => setNewPost({...newPost, priority: e.target.value})}
                     >
                        <option value="normal">Normal</option>
                        <option value="high">High Priority</option>
                     </select>
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Content</label>
                  <textarea 
                     required
                     rows="4"
                     className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/20 resize-none"
                     value={newPost.content}
                     onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                     placeholder="Write your announcement here..."
                  />
               </div>
               <div className="flex justify-end">
                  <button type="submit" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800">
                     Post Announcement
                  </button>
               </div>
            </form>
         </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
         {announcements.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex gap-4">
               <div className="hidden md:flex flex-col items-center justify-center w-16 h-16 bg-slate-50 rounded-2xl shrink-0">
                  <span className="text-xl font-bold text-slate-900">{new Date(post.date).getDate()}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase">{new Date(post.date).toLocaleString('default', { month: 'short' })}</span>
               </div>
               
               <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                     <div className="flex items-center gap-2">
                        <span className={cn("px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border", getTypeColor(post.type))}>
                           {post.type}
                        </span>
                        <h3 className="font-bold text-slate-900 text-lg">{post.title}</h3>
                     </div>
                     <button className="text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
                  
                  <p className="text-slate-600 mb-3">{post.content}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                     <span className="flex items-center gap-1">
                        <Bell className="w-3 h-3" /> Posted by {post.author}
                     </span>
                     <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(post.date).toLocaleTimeString()}
                     </span>
                  </div>
               </div>
            </div>
         ))}

         {announcements.length === 0 && (
            <div className="text-center py-20 text-slate-400">
               No announcements yet. Create one to notify your residents!
            </div>
         )}
      </div>

    </div>
  );
}