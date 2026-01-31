import { motion } from 'framer-motion';

export default function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      {/* Stakeholder Selection Grid */}
      <section id="features" className="py-24 bg-background-light relative scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tailored for Every Stakeholder</h2>
            <p className="text-gray-600 text-lg">Whether you manage entire estates or reside in one, SmartEstate adapts to your management and living needs.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl h-96 shadow-xl cursor-pointer"
            >
              <img 
                alt="Property Managers meeting" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA24cZMjHSnKdjcqbA3DSNHRz7joNiOj99J3fQeaN6ARnATulKYefhD-kOJL-KZP-IoVahJhO9KisRItqT8Ear_Jdv34Jf7HAgaCXUJhlVJWGC3-5cdW5qfuTBUfJ1TIyzKz2bPlXPZslPes1LFZg_KSLi2K4rFJ-j-3lylg49wUz10FdU9p8YBbqKq9RMh3Tkci7uF23qoOW2OL8RISbcIVQKKXq3m2iPSNzEtc0eyTCeD_Vv_FyIg1kut4Q2ZszM68eFx870R4JY" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="inline-block p-2 bg-primary rounded-lg text-white mb-3">
                  <span className="material-icons-round text-2xl">admin_panel_settings</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">For Estate Managers</h3>
                <p className="text-gray-300 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">Onboard tenants, approve rent payments, and broadcast announcements from a central dashboard.</p>
                <span className="text-primary font-medium flex items-center gap-1 group-hover:text-white transition-colors">Explore Tools <span className="material-icons-round text-sm">arrow_forward</span></span>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl h-96 shadow-xl cursor-pointer"
            >
              <img 
                alt="Tenants enjoying living room" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoU1gW3G4eU6KPYw7cl7UGNcbwarijpWwksOFcMD8McgHxsgyFfmznaCybZsRzJEyyldOU8zBpPftS85dhq9XCA-Rs8ES5BSOVUD3EX9x_MHPHtianEmF7s6uXfThCHgKZ97U0xQolO4zhyilMtebfLbuwvWToqoLYbRHci59WWspP9BNZg6vHm3hsMJqzHGwmTCoEUm6lkrixTMtzF5AJwmfj0VP9ZSAPV79mi_0HsimP991h_5ux-BC4YiQ607CllSWst3x6ALI" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="inline-block p-2 bg-secondary rounded-lg text-white mb-3">
                  <span className="material-icons-round text-2xl">vpn_key</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">For Residents</h3>
                <p className="text-gray-300 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">Upload rent receipts, view notices, and submit maintenance requests directly to management.</p>
                <span className="text-secondary font-medium flex items-center gap-1 group-hover:text-white transition-colors">See Experience <span className="material-icons-round text-sm">arrow_forward</span></span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Powered by Intelligence Section */}
      <section id="verification" className="py-24 bg-white relative overflow-hidden scroll-mt-20">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-64 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-50"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-semibold tracking-wider uppercase text-sm">System Features</span>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold text-gray-900">Powered by Intelligence & Security</h2>
          </motion.div>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants} className="glass-panel p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/30 mx-auto">
                <span className="material-icons-round">badge</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Identity Verification</h3>
              <p className="text-gray-600">Secure tenant onboarding with ID verification to ensure community safety.</p>
            </motion.div>
            <motion.div variants={itemVariants} id="payments" className="glass-panel p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 text-center scroll-mt-32">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-teal-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-teal-500/30 mx-auto">
                <span className="material-icons-round">payments</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Payment Tracking</h3>
              <p className="text-gray-600">Upload and verify rent receipts. Maintain a clean digital ledger of all estate payments.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="glass-panel p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-purple-500/30 mx-auto">
                <span className="material-icons-round">build</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Maintenance</h3>
              <p className="text-gray-600">Track repairs from reports to resolution. Keep tenants informed at every step.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Secure Estate Management Grid */}
      <section id="management" className="py-24 bg-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-end mb-12"
          >
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">Secure Estate Management</h2>
              <p className="mt-2 text-gray-600">Complete visibility and control over your estate's operations.</p>
            </div>
          </motion.div>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-primary mb-6">
                <span className="material-icons-round text-3xl">verified</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Tenant Verification</h3>
              <p className="text-gray-600 mb-6 flex-grow">Ensure every resident is verified. Review ID documents and approve access only for verified individuals.</p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-xs font-bold text-gray-700 uppercase">Status: Verified</span>
                </div>
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-full"></div>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 mb-6">
                <span className="material-icons-round text-3xl">build_circle</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Maintenance Requests</h3>
              <p className="text-gray-600 mb-6 flex-grow">Tenants can report issues with photos. Managers track status from "In Progress" to "Resolved".</p>
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div>
                  <span className="block text-xs text-gray-500">Leaking Pipe</span>
                  <span className="block text-sm font-bold text-indigo-600 tracking-wide">IN PROGRESS</span>
                </div>
                <span className="material-icons-round text-gray-400">arrow_forward</span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-secondary mb-6">
                <span className="material-icons-round text-3xl">home_work</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">House Assignment</h3>
              <p className="text-gray-600 mb-6 flex-grow">Digital mapping of your estate. Assign verified tenants to specific houses or shared rooms.</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 p-2 rounded text-center">
                  <span className="block text-xs text-gray-500">Block A</span>
                  <span className="block font-bold text-green-600 text-sm">Full</span>
                </div>
                <div className="bg-gray-50 p-2 rounded text-center">
                  <span className="block text-xs text-gray-500">Block B</span>
                  <span className="block font-bold text-primary text-sm">2 Vacant</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
