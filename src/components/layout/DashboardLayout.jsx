import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  CreditCard, 
  Wrench, 
  Megaphone, 
  Settings, 
  Building, 
  Users, 
  LogOut, 
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";

const NAV_ITEMS = {
  tenant: [
    { name: "Overview", path: "/tenant", icon: LayoutDashboard },
    { name: "My Payments", path: "/tenant/payments", icon: CreditCard },
    { name: "Maintenance", path: "/tenant/maintenance", icon: Wrench },
    { name: "Community", path: "/tenant/announcements", icon: Megaphone },
    { name: "Settings", path: "/tenant/settings", icon: Settings },
  ],
  manager: [
    { name: "Dashboard", path: "/manager", icon: LayoutDashboard },
    { name: "Properties", path: "/manager/properties", icon: Building },
    { name: "Tenants", path: "/manager/tenants", icon: Users },
    { name: "Finances", path: "/manager/payments", icon: CreditCard },
    { name: "Maintenance", path: "/manager/maintenance", icon: Wrench },
    { name: "Community", path: "/manager/community", icon: Megaphone },
    { name: "Settings", path: "/manager/settings", icon: Settings },
  ]
};

const SidebarItem = ({ item, isCollapsed, onHover }) => {
  return (
    <NavLink
      to={item.path}
      end={item.path.split('/').length === 2}
      onMouseEnter={(e) => {
        if (isCollapsed && onHover) {
          onHover({ item, element: e.currentTarget });
        }
      }}
      onMouseLeave={() => {
        if (onHover) onHover(null);
      }}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all duration-300 group relative mb-2 font-medium",
          isActive 
            ? "bg-primary/10 text-primary shadow-sm" 
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        )
      }
    >
      {({ isActive }) => (
        <>
          <item.icon className={cn("h-6 w-6 flex-shrink-0 transition-colors", isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600")} strokeWidth={2} />
          
          <AnimatePresence mode="popLayout">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap overflow-hidden font-display tracking-tight"
              >
                {item.name}
              </motion.span>
            )}
          </AnimatePresence>
        </>
      )}
    </NavLink>
  );
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const navigate = useNavigate();

  const role = user?.role || "tenant"; 
  const items = NAV_ITEMS[role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleItemHover = (data) => {
    if (!data) {
      setHoveredItem(null);
      return;
    }
    const rect = data.element.getBoundingClientRect();
    setTooltipPos({ 
      top: rect.top + (rect.height / 2), // Center vertically
      left: rect.right + 12 
    });
    setHoveredItem(data.item);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans selection:bg-primary selection:text-white">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 90 : 280 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden md:flex flex-col bg-white border-r border-slate-100 shadow-xl shadow-slate-200/50 z-30 h-full relative"
      >
        {/* Sidebar Header */}
        <div className="flex h-28 items-center px-6 mb-2">
           <div className="flex items-center gap-4 w-full">
              <img src="/icon.png" alt="SmartEstate" className="h-10 w-10 object-contain flex-shrink-0" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col"
                  >
                    <span className="text-xl font-display font-bold text-slate-900 tracking-tight">SmartEstate</span>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-32 bg-white border border-slate-200 p-1.5 rounded-full shadow-md text-slate-400 hover:text-primary hover:border-primary transition-colors z-40 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-2 no-scrollbar">
          {items.map((item) => (
              <SidebarItem 
                key={item.path} 
                item={item} 
                isCollapsed={isCollapsed} 
                onHover={handleItemHover}
            />
          ))}
        </div>

        {/* User Profile Summary */}
        <div className="p-4 mt-auto">
          <div className={cn("flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 transition-all", isCollapsed ? "justify-center bg-transparent border-transparent" : "")}>
             <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold font-display">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
             </div>
             {!isCollapsed && (
               <div className="flex-1 overflow-hidden">
                 <p className="text-sm font-bold text-slate-900 truncate font-display">{user?.name}</p>
                 <p className="text-xs text-slate-500 truncate capitalize">{role}</p>
               </div>
             )}
              {!isCollapsed && (
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              )}
          </div>
          
           {isCollapsed && (
                <button
                  onClick={handleLogout}
                  className="mt-4 mx-auto flex items-center justify-center p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full"
                  title="Sign Out"
                >
                  <LogOut size={20} />
                </button>
              )}
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden bg-slate-50/50">
        {/* Mobile Header */}
        <div className="md:hidden bg-white/80 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-200/50 z-40 sticky top-0">
           <div className="flex items-center gap-3">
             <img src="/icon.png" alt="Logo" className="h-8 w-8 object-contain" />
             <span className="font-display font-bold text-lg text-slate-900 tracking-tight">SmartEstate</span>
           </div>
           <div className="flex items-center gap-3 bg-slate-50 pl-1 pr-3 py-1 rounded-full border border-slate-100">
             <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                {user?.name?.[0]?.toUpperCase()}
             </div>
             <span className="text-sm font-bold text-slate-700 max-w-[80px] truncate font-display">{user?.name?.split(' ')[0]}</span>
           </div>
        </div>

        <main className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
           <div className="max-w-7xl mx-auto p-4 md:p-10 pb-32">
            <Outlet />
           </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation - Floating Pill */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full px-4 flex justify-center pointer-events-none">
        <div className="pointer-events-auto bg-white/80 backdrop-blur-md border border-white/40 shadow-2xl shadow-slate-900/20 rounded-2xl px-2 py-2 flex items-center justify-between gap-1 w-auto min-w-[280px] max-w-[95vw] ring-1 ring-white/50 overflow-x-auto no-scrollbar">
          {items.map((item) => (
            <NavLink    
              key={item.path}
              to={item.path}
              end={item.path.split('/').length === 2}
              className={({ isActive }) => cn(
                "relative flex items-center justify-center min-w-[40px] w-10 h-10 rounded-xl transition-all duration-300 isolate shrink-0", 
                isActive ? "text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div 
                      layoutId="mobile-nav-pill"
                      className="absolute inset-0 bg-white shadow-sm border border-slate-100 rounded-xl z-[-1]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <item.icon className={cn("w-5 h-5 transition-transform duration-300", isActive && "scale-105")} strokeWidth={isActive ? 2.5 : 2} />
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Floating Tooltip */}
      <AnimatePresence>
        {isCollapsed && hoveredItem && (
          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{ 
              top: tooltipPos.top, 
              left: tooltipPos.left,
            }}
            className="fixed z-[100] -translate-y-1/2 bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-xl border border-slate-700 pointer-events-none whitespace-nowrap flex items-center"
          >
            {/* Tooltip Arrow */}
            <div className="absolute left-0 top-1/2 -translate-x-[4px] -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45 border-l border-b border-slate-700"></div>
            {hoveredItem.name}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
