export default function Workflow() {
  return (
    <section className="py-24 bg-background-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-16">Streamlined Workflow</h2>
        <div className="relative">
          <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gray-200 z-0"></div>
          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-primary flex items-center justify-center mb-6 shadow-lg">
                <span className="material-icons-round text-4xl text-primary">domain_add</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">1. Manager Onboards</h3>
              <p className="text-gray-500 text-sm px-4">Estate manager creates the digital estate and uploads unit details.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-gray-200 flex items-center justify-center mb-6 shadow-lg">
                <span className="material-icons-round text-4xl text-gray-400">person_add_alt</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">2. Tenant Request</h3>
              <p className="text-gray-500 text-sm px-4">Residents download the app and request access to their assigned unit.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-gray-200 flex items-center justify-center mb-6 shadow-lg">
                <span className="material-icons-round text-4xl text-gray-400">verified_user</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">3. Verify & Approve</h3>
              <p className="text-gray-500 text-sm px-4">Manager verifies resident identity and approves secure access.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-secondary flex items-center justify-center mb-6 shadow-lg">
                <span className="material-icons-round text-4xl text-secondary">payments</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">4. Digital Living</h3>
              <p className="text-gray-500 text-sm px-4">Residents upload receipts, view notices, and request maintenance.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
