import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ToastContext = {
    add: () => {},
    remove: () => {}
};

export const ToastContainer = ({ toasts, remove }) => {
    return createPortal(
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
            {toasts.map(toast => (
                <div 
                    key={toast.id} 
                    className={`
                        min-w-[300px] p-4 rounded-xl shadow-xl border flex items-start gap-3 animate-in fade-in slide-in-from-right-5 duration-300
                        ${toast.type === 'success' ? 'bg-white border-green-100' : ''}
                        ${toast.type === 'error' ? 'bg-white border-red-100' : ''}
                        ${toast.type === 'info' ? 'bg-white border-blue-100' : ''}
                    `}
                >
                    <div className={`mt-0.5 ${
                        toast.type === 'success' ? 'text-green-500' :
                        toast.type === 'error' ? 'text-red-500' : 'text-blue-500'
                    }`}>
                        {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
                        {toast.type === 'error' && <XCircle className="w-5 h-5" />}
                        {toast.type === 'info' && <Info className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-sm">{toast.title}</h4>
                        <p className="text-slate-500 text-xs mt-0.5">{toast.message}</p>
                    </div>
                    <button onClick={() => remove(toast.id)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>,
        document.body
    );
};

export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = (arg1, arg2) => {
        let type = 'info';
        let title = '';
        let message = '';
        let duration = 3000;

        if (typeof arg1 === 'string') {
             message = arg1;
             if (arg2) type = arg2;
             
             if (type === 'success') title = 'Success';
             else if (type === 'error') title = 'Error';
             else if (type === 'warning') title = 'Warning';
             else title = 'Notification';
        } else if (typeof arg1 === 'object') {
             const opts = arg1;
             type = opts.type || 'info';
             title = opts.title || '';
             message = opts.message || '';
             if (opts.duration) duration = opts.duration;
        }

        const id = Math.random().toString(36).substring(2, 9);
        setToasts(prev => [...prev, { id, type, title, message }]);
        
        if (duration) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return { toasts, addToast, removeToast, ToastContainer };
};