import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { FaPlus, FaTools, FaFilter, FaCircle, FaChevronRight } from 'react-icons/fa';
import { cn } from '../../lib/utils';

const Maintenance = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('active'); // active | history

  useEffect(() => {
    const fetchTickets = async () => {
       if (user) {
         try {
           const idToQuery = user.uid || user.id;
           const q = query(collection(db, "maintenance"), where("tenantId", "==", idToQuery));
           const snapshot = await getDocs(q);
           const userTickets = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
           setTickets(userTickets.sort((a, b) => {
               // Handle both timestamp objects and string dates if mixed
               const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(a.date);
               const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(b.date);
               return dateB - dateA;
           }));
         } catch (err) {
           console.error("Error fetching tickets:", err);
         }
       }
    };
    fetchTickets();
  }, [user]);

  const activeTickets = tickets.filter(t => t.status !== 'resolved');
  const resolvedTickets = tickets.filter(t => t.status === 'resolved');

  const displayedTickets = filter === 'active' ? activeTickets : resolvedTickets;

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-500 bg-red-50 border-red-100';
      case 'medium': return 'text-orange-500 bg-orange-50 border-orange-100';
      case 'low': return 'text-blue-500 bg-blue-50 border-blue-100';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Header & Hero */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900">Maintenance</h1>
          <p className="text-slate-500">Report issues and track repair status</p>
        </div>
        <Link 
          to="/tenant/maintenance/new"
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
        >
          <FaPlus /> Report Issue
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
             <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Active Issues</div>
             <div className="text-3xl font-bold text-slate-900">{activeTickets.length}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
             <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Resolved</div>
             <div className="text-3xl font-bold text-slate-900">{resolvedTickets.length}</div>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm min-h-[400px]">
        {/* Tabs */}
        <div className="flex items-center gap-1 p-2 border-b border-slate-100">
           <button 
             onClick={() => setFilter('active')}
             className={cn("px-6 py-2.5 rounded-xl text-sm font-bold transition-colors", filter === 'active' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-700')}
           >
             Active Requests
           </button>
           <button 
             onClick={() => setFilter('history')}
             className={cn("px-6 py-2.5 rounded-xl text-sm font-bold transition-colors", filter === 'history' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-700')}
           >
             History
           </button>
        </div>

        {/* List */}
        <div className="p-4 space-y-3">
           {displayedTickets.length === 0 ? (
             <div className="text-center py-20">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                   <FaTools className="text-3xl" />
                </div>
                <h3 className="text-slate-900 font-bold text-lg">No requests found</h3>
                <p className="text-slate-500 max-w-xs mx-auto mt-1">You don't have any {filter} maintenance tickets at the moment.</p>
             </div>
           ) : (
             displayedTickets.map(ticket => (
               <Link 
                 key={ticket.id} 
                 to={`/tenant/maintenance/${ticket.id}`}
                 className="block p-5 rounded-2xl border border-slate-100 hover:border-primary/30 hover:shadow-md hover:bg-slate-50/50 transition-all group"
               >
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-lg flex-shrink-0 border", getPriorityColor(ticket.priority))}>
                           <FaTools />
                        </div>
                        <div>
                           <div className="flex items-center gap-3 mb-1">
                             <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{ticket.title}</h3>
                             <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border", getPriorityColor(ticket.priority))}>
                               {ticket.priority}
                             </span>
                           </div>
                           <p className="text-slate-500 text-sm line-clamp-1">{ticket.description}</p>
                           <p className="text-slate-400 text-xs mt-2 font-medium">Logged on {ticket.date} • <span className="text-slate-600">{ticket.category}</span></p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 mt-4 md:mt-0 pl-16 md:pl-0">
                       <span className={cn("px-3 py-1.5 rounded-lg text-xs font-bold capitalize whitespace-nowrap", getStatusColor(ticket.status))}>
                          {ticket.status.replace('-', ' ')}
                       </span>
                       <FaChevronRight className="text-slate-300 group-hover:text-primary" />
                    </div>
                 </div>
               </Link>
             ))
           )}
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
