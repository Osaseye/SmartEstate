import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, MessageSquare } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { generateAIResponse } from '../../lib/ai';

export default function AIChatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
        id: 1, 
        role: 'assistant', 
        text: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! I'm your SmartEstate assistant. Ask me anything about your property, payments, or maintenance.` 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Drag detection
  const isDragging = useRef(false);

  // Auto-scroll to bottom of chat
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // AI Logic
    try {
        const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
        const context = {
            name: user?.name,
            role: user?.role
        };
        const responseText = await generateAIResponse(userMsg.text, apiKey, context);
        
        setMessages(prev => [...prev, { 
            id: Date.now() + 1, 
            role: 'assistant', 
            text: responseText 
        }]);
    } catch (error) {
        setMessages(prev => [...prev, { 
            id: Date.now() + 1, 
            role: 'assistant', 
            text: "I'm having a bit of trouble connecting right now. Please try again." 
        }]);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <>
      {/* Draggable Button */}
      {/* Z-Index: 60 to be above everything, including modals if needed */}
      {!isOpen && (
          <motion.div
            drag
            dragMomentum={false}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onDragStart={() => { isDragging.current = true; }}
            onDragEnd={() => { setTimeout(() => isDragging.current = false, 100); }}
            onClick={() => { if (!isDragging.current) setIsOpen(true); }}
            className="fixed bottom-6 right-6 z-[60] cursor-grab active:cursor-grabbing touch-none"
          >
             <div className="w-16 h-16 rounded-full bg-white p-1 shadow-2xl shadow-primary/30 border border-white/50 relative group">
                 <div className="w-full h-full rounded-full overflow-hidden relative bg-slate-100">
                    <img src="/icon.png" alt="AI" className="w-full h-full object-cover" />
                 </div>
                 
                 {/* Online Indicator */}
                 <span className="absolute top-0 right-0 h-4 w-4 bg-green-500 border-2 border-white rounded-full shadow-sm">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                 </span>

                 {/* Tooltip */}
                 <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                     Ask AI Assistant
                 </div>
             </div>
          </motion.div>
      )}

      {/* Side Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
             {/* Backdrop (Click to close) */}
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[60]"
             />
             
             {/* Sidebar Panel */}
             <motion.div
                initial={{ x: '100%', opacity: 0.5 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed top-2 bottom-2 right-2 w-full max-w-[400px] h-[calc(100vh-16px)] bg-white rounded-3xl shadow-2xl z-[70] flex flex-col overflow-hidden border border-slate-100"
             >
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 p-0.5 border border-slate-200">
                            <img src="/icon.png" className="w-full h-full object-cover rounded-full" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 leading-tight">Smart Assistant</h3>
                            <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold uppercase tracking-wide bg-green-50 px-1.5 py-0.5 rounded-full w-fit">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                Online
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                    {messages.map((msg) => (
                        <div 
                            key={msg.id}
                            className={cn(
                                "flex gap-2 max-w-[90%]",
                                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                            )}
                        >
                            {msg.role === 'assistant' && (
                                <div className="w-6 h-6 rounded-full bg-white border border-slate-200 overflow-hidden flex-shrink-0 mt-1">
                                   <img src="/icon.png" className="w-full h-full object-cover" />
                                </div>
                            )}
                            
                            <div className={cn(
                                "p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                                msg.role === 'user' 
                                    ? "bg-slate-900 text-white rounded-tr-none" 
                                    : "bg-white text-slate-700 border border-slate-200/50 rounded-tl-none"
                            )}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    
                    {isTyping && (
                        <div className="flex gap-2 max-w-[90%]">
                            <div className="w-6 h-6 rounded-full bg-white border border-slate-200 overflow-hidden flex-shrink-0 mt-1">
                                <img src="/icon.png" className="w-full h-full object-cover" />
                            </div>
                            <div className="bg-white border border-slate-200/50 p-3.5 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Footer Input */}
                <div className="p-3 bg-white border-t border-slate-100">
                    <form 
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="relative flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-primary/10 transition-all"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your question..."
                            className="flex-1 bg-transparent border-none outline-none pl-3 text-sm text-slate-900 placeholder:text-slate-400 min-w-0"
                        />
                        <button 
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 flex-shrink-0"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                    <div className="text-center mt-2.5">
                        <p className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
                            <Sparkles size={10} className="text-purple-400" /> 
                            AI can make mistakes. Check important info.
                        </p>
                    </div>
                </div>
             </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}