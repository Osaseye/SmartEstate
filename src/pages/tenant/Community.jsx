import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore'; 
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { 
  LucideMegaphone, 
  LucideCalendar, 
  LucideAlertTriangle, 
  LucideInfo, 
  LucidePhone,
  LucideFileText,
  LucideSearch
} from 'lucide-react';
import { FaFire, FaBriefcaseMedical, FaShieldAlt } from 'react-icons/fa';

const Community = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [filter, setFilter] = useState('all'); // all, news, event, urgent
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        if (user && user.estateId) {
            try {
                const q = query(
                    collection(db, "announcements"), 
                    where("estateId", "==", user.estateId)
                );
                const snapshot = await getDocs(q);
                let allAnn = snapshot.docs.map(d => ({id: d.id, ...d.data()}));
                
                // Filter content relevant to me
                allAnn = allAnn.filter(a => {
                    if (a.target === 'all') return true;
                    if (a.target === 'specific' && a.targetTenantId === (user.id || user.uid)) return true;
                    return false;
                });
                
                // Sort by date descending
                allAnn.sort((a,b) => {
                     const dateA = a.createdAt?.seconds || new Date(a.date).getTime();
                     const dateB = b.createdAt?.seconds || new Date(b.date).getTime();
                     return dateB - dateA;
                });

                setAnnouncements(allAnn);
            } catch (err) {
                console.error("Error fetching announcements:", err);
            } finally {
                setLoading(false);
            }
        }
    };
    fetchData();
  }, [user]);

  const filteredItems = filter === 'all' 
    ? announcements 
    : announcements.filter(a => a.type === filter);

  // Helper for Badge Colors
  const getTypeStyles = (type) => {
    switch(type) {
      case 'urgent': return "bg-red-100 text-red-700 border-red-200";
      case 'event': return "bg-purple-100 text-purple-700 border-purple-200";
      case 'news': return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
        case 'urgent': return LucideAlertTriangle;
        case 'event': return LucideCalendar;
        case 'news': return LucideInfo;
        default: return LucideMegaphone;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-20">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
             <h1 className="text-3xl font-bold font-display text-slate-900">Community Hub</h1>
             <p className="text-slate-500">Stay updated with estate news, events and alerts.</p>
        </div>
        <div className="relative">
             <LucideSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input type="text" placeholder="Search notices..." className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm w-full md:w-64" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Main Feed */}
         <div className="lg:col-span-2 space-y-6">
            
            {/* Featured Urgent Notice (if any) */}
            {announcements.find(a => a.type === 'urgent') && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-start gap-4 shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-50 transition-opacity" />
                 
                 <div className="bg-white p-3 rounded-full shadow-sm text-red-600">
                    <LucideAlertTriangle className="w-6 h-6 animate-pulse" />
                 </div>
                 <div className="relative z-10 flex-1">
                    <h3 className="font-bold text-red-900 text-lg">{announcements.find(a => a.type === 'urgent').title}</h3>
                    <p className="text-red-800/80 mt-1 leading-relaxed">{announcements.find(a => a.type === 'urgent').content}</p>
                    <div className="flex items-center gap-4 mt-4 text-sm text-red-700 font-medium">
                       <span>{announcements.find(a => a.type === 'urgent').date}</span>
                       <span>•</span>
                       <span>{announcements.find(a => a.type === 'urgent').author}</span>
                    </div>  
                 </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {['all', 'news', 'event'].map(tab => (
                 <button 
                   key={tab}
                   onClick={() => setFilter(tab)}
                   className={cn(
                     "px-5 py-2 rounded-full text-sm font-bold capitalize transition-all whitespace-nowrap",
                     filter === tab 
                       ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10" 
                       : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                   )}
                 >
                   {tab === 'all' ? 'All Updates' : tab + 's'}
                 </button>
              ))}
            </div>

            {/* List */}
            <div className="space-y-4">
               {loading ? (
                 <div className="text-center py-12 text-slate-400">Loading updates...</div>
               ) : (
                 filteredItems.filter(i => i.type !== 'urgent').length > 0 ? (
                   filteredItems.filter(i => i.type !== 'urgent').map(item => {
                      const Icon = getTypeIcon(item.type);
                      return (
                        <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all group">
                           <div className="flex items-start justify-between gap-4">
                              <div className="flex gap-4">
                                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-lg border", getTypeStyles(item.type).split(' ')[0], getTypeStyles(item.type).split(' ')[1])}>
                                     <Icon className="w-5 h-5" />
                                  </div>
                                  <div>
                                     <div className="flex items-center gap-2 mb-1">
                                        <span className={cn("px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border", getTypeStyles(item.type))}>
                                           {item.type}
                                        </span>
                                        <span className="text-slate-400 text-xs font-medium">{item.date}</span>
                                     </div>
                                     <h3 className="font-bold text-slate-900 text-lg group-hover:text-primary transition-colors">{item.title}</h3>
                                     <p className="text-slate-500 mt-2 leading-relaxed">{item.content}</p>
                                  </div>
                              </div>
                           </div>
                        </div>
                      );
                   })
                 ) : (
                   <div className="text-center py-20 bg-slate-50 rounded-2xl border-dashed border-2 border-slate-200">
                      <p className="text-slate-400 font-medium">No updates found in this category.</p>
                   </div>
                 )
               )}
            </div>

         </div>

         {/* Sidebar Widgets */}
         <div className="space-y-8">
            
            {/* Emergency Directory */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
               <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                 <LucidePhone className="w-5 h-5 text-slate-400" /> Emergency Contacts
               </h3>
               <div className="space-y-3">
                  {[
                    { label: 'Gate Security', number: '0800-ESTATE-SEC', icon: FaShieldAlt, color: 'text-blue-500 bg-blue-50' },
                    { label: 'Fire Service', number: '112', icon: FaFire, color: 'text-orange-500 bg-orange-50' },
                    { label: 'Ambulance', number: '112', icon: FaBriefcaseMedical, color: 'text-red-500 bg-red-50' },
                  ].map((contact, idx) => (
                    <a key={idx} href={`tel:${contact.number}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 group border border-transparent hover:border-slate-100 transition-all cursor-pointer bg-slate-50/50">
                       <div className="flex items-center gap-3">
                          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", contact.color)}>
                            <contact.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm group-hover:text-primary transition-colors">{contact.label}</div>
                            <div className="text-xs text-slate-400">{contact.number}</div>
                          </div>
                       </div>
                       <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all shadow-sm">
                          <LucidePhone className="w-4 h-4" />
                       </div>
                    </a>
                  ))}
               </div>
            </div>

            {/* Documents */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl shadow-slate-900/10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
               
               <h3 className="font-bold text-lg mb-4 relative z-10 flex items-center gap-2">
                 <LucideFileText className="w-5 h-5 text-slate-400" /> Documents
               </h3>
               
               <div className="space-y-3 relative z-10">
                 {['Estate Rules & Regulations.pdf', 'Gym Code of Conduct.pdf', 'Trash Disposal Guide.pdf'].map((doc, idx) => (
                   <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/5 hover:border-white/10">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-slate-300">
                        <LucideFileText className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-200 truncate flex-1">{doc}</span>
                   </div>
                 ))}
               </div>
            </div>

         </div>

      </div>

    </div>
  );
};

export default Community;
