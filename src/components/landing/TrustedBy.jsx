import { motion } from 'framer-motion';

export default function TrustedBy() {
  const brands = [
    { icon: 'apartment', name: 'LEKKI GARDENS' },
    { icon: 'gavel', name: 'VGC ESTATES' },
    { icon: 'foundation', name: 'BANANA ISLAND' },
    { icon: 'domain', name: 'MAGODO GRA' },
    { icon: 'cottage', name: 'VICTORIA ISLAND' },
    { icon: 'apartment', name: 'AMEN ESTATE' },
    { icon: 'gavel', name: 'NICHEMIAH COURT' },
  ];

  return (
    <div className="bg-white border-b border-gray-100 py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Securing Nigeria's Premier Estates</p>
      </div>
      
      <div className="relative flex overflow-hidden mask-gradient-x">
        <motion.div 
          className="flex gap-16 whitespace-nowrap px-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            repeat: Infinity, 
            ease: "linear", 
            duration: 20 
          }}
        >
          {[...brands, ...brands].map((brand, index) => (
             <span key={index} className="text-xl font-bold text-gray-400 flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                <span className="material-icons-round">{brand.icon}</span> {brand.name}
             </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
