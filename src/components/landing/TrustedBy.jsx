export default function TrustedBy() {
  return (
    <div className="bg-white border-b border-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-medium text-gray-500 mb-6 uppercase tracking-widest">Securing Premier Estates</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <span className="text-xl font-bold text-gray-400 flex items-center gap-1"><span className="material-icons-round">apartment</span> SUNSET HILLS</span>
          <span className="text-xl font-bold text-gray-400 flex items-center gap-1"><span className="material-icons-round">gavel</span> GREEN FIELD</span>
          <span className="text-xl font-bold text-gray-400 flex items-center gap-1"><span className="material-icons-round">foundation</span> ROYAL PALMS</span>
          <span className="text-xl font-bold text-gray-400 flex items-center gap-1"><span className="material-icons-round">domain</span> BLUE RIDGE</span>
          <span className="text-xl font-bold text-gray-400 flex items-center gap-1"><span className="material-icons-round">cottage</span> OAKWOOD</span>
        </div>
      </div>
    </div>
  );
}
