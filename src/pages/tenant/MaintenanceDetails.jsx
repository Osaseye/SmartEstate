import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FaChevronRight, FaCalendar, FaMapMarkerAlt, FaToolbox, FaCheckCircle, FaClock, FaExclamationCircle } from 'react-icons/fa';
import { cn } from '../../lib/utils';
import { Wrench, User, Briefcase, CheckCircle2, CircleDashed } from 'lucide-react';

const STATUS_CONFIG = {
  pending: { label: 'Request Received', color: 'bg-yellow-500', icon: FaClock },
  'in-progress': { label: 'Technician Assigned', color: 'bg-blue-500', icon: FaToolbox },
  resolved: { label: 'Work Completed', color: 'bg-green-500', icon: FaCheckCircle },
};

const MaintenanceDetails = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);   
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
       try {
         const docRef = doc(db, "maintenance", id);
         const docSnap = await getDoc(docRef);
         if (docSnap.exists()) {
            setTicket({ id: docSnap.id, ...docSnap.data() });
         } else {
            console.log("No such document!");
         }
       } catch (err) {
         console.error("Error fetching ticket:", err);
       } finally {
         setLoading(false);
       }
    };
    fetchTicket();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center">
           <div className="w-12 h-12 bg-slate-200 rounded-full mb-4"></div>
           <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900">Ticket Not Found</h2>
        <Link to="/tenant/maintenance" className="text-primary hover:underline mt-2 inline-block">Return to Maintenance</Link>
      </div>
    );
  }

  // Generate a mock timeline based on status
  // In a real app, 'updates' array would come from backend
  const timeline = [
    { title: 'Request Submitted', date: ticket.date, status: 'completed' },
    { title: 'Manager Review', date: 'Pending', status: ticket.status === 'pending' ? 'current' : 'completed' },
    { title: 'Technician Dispatched', date: 'Pending', status: ticket.status === 'in-progress' ? 'current' : (ticket.status === 'resolved' ? 'completed' : 'upcoming') },
    { title: 'Issue Resolved', date: 'Pending', status: ticket.status === 'resolved' ? 'completed' : 'upcoming' },
  ];

  const StatusIcon = STATUS_CONFIG[ticket.status]?.icon || FaExclamationCircle;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-20">
       {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/tenant/maintenance" className="hover:text-primary transition-colors">Maintenance</Link>
        <FaChevronRight className="w-3 h-3" />
        <span className="font-semibold text-slate-900">Ticket #{ticket.id}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <span className={cn(
               "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white",
               STATUS_CONFIG[ticket.status]?.color || 'bg-slate-500'
             )}>
               {ticket.status}
             </span>
             <span className="text-sm text-slate-500 font-medium">Create on {ticket.date}</span>
           </div>
           <h1 className="text-3xl font-bold font-display text-slate-900">{ticket.title}</h1>
           <p className="text-slate-500 mt-2 text-lg max-w-2xl">{ticket.description}</p>
        </div>
        
        {/* Priority Badge */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm self-start">
           <div className={cn(
             "w-3 h-3 rounded-full",
             {
               'bg-green-500': ticket.priority === 'low',
               'bg-yellow-500': ticket.priority === 'medium',
               'bg-red-500': ticket.priority === 'high'
             }
           )} />
           <span className="font-bold text-slate-700 capitalize">{ticket.priority} Priority</span>
        </div>
      </div>

       {/* Images Grid (Mock) */}
       {ticket.images && ticket.images.length > 0 && (
        <div className="space-y-3">
            <h3 className="font-bold text-slate-900">Attached Photos</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {ticket.images.map((img, idx) => (
                 <div key={idx} className="aspect-square bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400">
                    {/* In a real app, this would be an <img src={url} /> */}
                    <span className="text-xs text-center px-2">{img}</span>
                 </div>
               ))}
            </div>
        </div>
      )}

      {/* Timeline Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm relative overflow-hidden">
         <h2 className="text-xl font-bold text-slate-900 mb-8">Request Timeline</h2>
         
         <div className="relative">
             {/* Vertical Line */}
             <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-slate-100" />

             <div className="space-y-8">
               {timeline.map((step, idx) => (
                 <div key={idx} className="relative flex items-start group">
                    {/* Node */}
                    <div className={cn(
                       "relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 transition-colors",
                       step.status === 'completed' ? "bg-green-50 border-green-100 text-green-600" : 
                       step.status === 'current' ? "bg-primary/5 border-primary/20 text-primary" : 
                       "bg-white border-slate-100 text-slate-300"
                    )}>
                       {step.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : 
                        step.status === 'current' ? <CircleDashed className="w-6 h-6 animate-spin-slow" /> : 
                        <div className="w-3 h-3 rounded-full bg-slate-200" />}
                    </div>
                    
                    {/* Content */}
                    <div className="ml-6 pt-3">
                       <h3 className={cn(
                         "text-lg font-bold transition-colors",
                         step.status === 'upcoming' ? "text-slate-400" : "text-slate-900"
                       )}>{step.title}</h3>
                       <p className="text-slate-400 text-sm">{step.date}</p>
                    </div>
                 </div>
               ))}
             </div>
         </div>
      </div>

    </div>
  );
};

export default MaintenanceDetails;
