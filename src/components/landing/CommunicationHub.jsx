import { motion } from 'framer-motion';

export default function CommunicationHub() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 1.5 // Stagger delay between messages
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-primary text-xs font-bold uppercase tracking-wide mb-4">
              Community Hub
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">Your Digital <br/><span className="text-gradient">Communication Center.</span></h2>
            <p className="text-lg text-gray-600 mb-8">Stay connected with your estate manager. View announcements, track your rent payments, and get updates on maintenance requests instantly.</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-secondary">
                  <span className="material-icons-round text-sm">check</span>
                </span>
                <span className="text-gray-700">Instant maintenance updates</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-secondary">
                  <span className="material-icons-round text-sm">check</span>
                </span>
                <span className="text-gray-700">Digital rent receipts</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-secondary">
                  <span className="material-icons-round text-sm">check</span>
                </span>
                <span className="text-gray-700">Important community announcements</span>
              </li>
            </ul>
            <button className="bg-gray-900 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2">
              Explore Dashboard
              <span className="material-icons-round">dashboard</span>
            </button>
          </div>
          <div className="lg:w-1/2 w-full relative">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative z-10 max-w-md mx-auto">
              <div className="bg-primary p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary">
                  <span className="material-icons-round">campaign</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Estate Announcements</h4>
                  <p className="text-blue-100 text-xs flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400"></span> Active</p>
                </div>
                <span className="material-icons-round text-white ml-auto">more_horiz</span>
              </div>
              <motion.div 
                className="p-6 bg-gray-50 h-80 overflow-y-auto space-y-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <style>{`
                  .overflow-y-auto::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                <motion.div variants={itemVariants} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">From: Estate Manager</p>
                    <p className="text-sm font-semibold text-gray-900">Monthly Water Maintenance</p>
                    <p className="text-xs text-gray-600 mt-2">Maintenance is scheduled for Tuesday 10 AM. Water supply may be interrupted for 2 hours.</p>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">System Update</p>
                    <p className="text-sm font-semibold text-green-600">Rent Payment Verified</p>
                    <p className="text-xs text-gray-600 mt-2">Your receipt for January 2026 has been approved. Thank you.</p>
                </motion.div>
                
                 <motion.div variants={itemVariants} className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-xs text-blue-500 mb-1">Your Request</p>
                    <p className="text-sm font-semibold text-gray-900">Leaking Kitchen Sink</p>
                    <div className="flex items-center gap-2 mt-2">
                         <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded-full">IN PROGRESS</span>
                         <span className="text-[10px] text-gray-500">Updated 2h ago</span>
                    </div>
                </motion.div>
              </motion.div>
            </div>
            <div className="absolute top-1/2 -right-10 w-24 h-24 bg-secondary rounded-full blur-2xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 -left-10 w-32 h-32 bg-primary rounded-full blur-3xl opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
