import { Building2 } from 'lucide-react';

export default function Loader({ fullScreen = true, size = 'default' }) {
  // size: 'sm' | 'default' | 'lg'
  
  const containerClass = fullScreen 
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
    : "w-full py-12 flex flex-col items-center justify-center";

  const iconSize = size === 'sm' ? "w-6 h-6" : size === 'lg' ? "w-16 h-16" : "w-12 h-12";
  const textSize = size === 'sm' ? "text-xs" : size === 'lg' ? "text-xl" : "text-sm";

  return (
    <div className={containerClass}>
      <div className="relative">
        <Building2 className={`${iconSize} text-slate-900 animate-pulse`} />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-bounce delay-100" />
      </div>
      <div className={`mt-4 font-display font-bold text-slate-900 ${textSize} tracking-widest animate-pulse`}>
        SMARTESTATE
      </div>
    </div>
  );
}