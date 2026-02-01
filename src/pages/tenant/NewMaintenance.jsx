import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MockService } from '../../services/mockService';
import { useAuth } from '../../context/AuthContext';
import { FaChevronRight, FaCamera, FaTimes, FaHome, FaBolt, FaTint, FaHammer, FaBroom, FaLayerGroup } from 'react-icons/fa';
import { cn } from '../../lib/utils';

const CATEGORIES = [
  { id: 'Plumbing', icon: FaTint, label: 'Plumbing' },
  { id: 'Electrical', icon: FaBolt, label: 'Electrical' },
  { id: 'Carpentry', icon: FaHammer, label: 'Carpentry' },
  { id: 'Appliance', icon: FaHome, label: 'Appliance' },
  { id: 'Cleaning', icon: FaBroom, label: 'Cleaning' },
  { id: 'Other', icon: FaLayerGroup, label: 'Other' }
];

const NewMaintenance = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: 'medium',
    description: '',
    images: [] // Mock images
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (catId) => {
    setFormData(prev => ({ ...prev, category: catId }));
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // Mock: just storing the name
      const newImages = Array.from(e.target.files).map(f => f.name);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.description) return;

    setLoading(true);
    
    setTimeout(() => {
      const data = MockService.getAll();
      const newTicket = {
        id: `m${Date.now()}`,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        priority: formData.priority,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        updates: [],
        tenantId: user.id,
        images: formData.images
      };

      if (!data.maintenance) data.maintenance = [];
      data.maintenance.push(newTicket);
      MockService.update(data);
      
      setLoading(false);
      navigate('/tenant/maintenance');
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl mx-auto pb-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/tenant/maintenance" className="hover:text-primary transition-colors">Maintenance</Link>
        <FaChevronRight className="w-3 h-3" />
        <span className="font-semibold text-slate-900">New Request</span>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-display text-slate-900">Report an Issue</h1>
        <p className="text-slate-500">Provide details about the defect so we can fix it quickly.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 mt-8">
        
        {/* Category Selection */}
        <div className="space-y-3">
           <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Issue Category</label>
           <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
             {CATEGORIES.map(cat => (
               <button
                 key={cat.id}
                 type="button"
                 onClick={() => handleCategorySelect(cat.id)}
                 className={cn(
                   "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200",
                   formData.category === cat.id 
                     ? "border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary/50" 
                     : "border-slate-100 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                 )}
               >
                 <cat.icon className="text-2xl mb-2" />
                 <span className="font-bold text-sm">{cat.label}</span>
               </button>
             ))}
           </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
             <label htmlFor="title" className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Issue Title</label>
             <input
               type="text"
               name="title"
               id="title"
               value={formData.title}
               onChange={handleInputChange}
               placeholder="e.g. Leaking Faucet in Kitchen"
               className="w-full px-5 py-4 text-base bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-300"
               required
             />
        </div>

        {/* Description */}
        <div className="space-y-3">
             <label htmlFor="description" className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Description</label>
             <textarea
               name="description"
               id="description"
               value={formData.description}
               onChange={handleInputChange}
               rows={4}
               placeholder="Describe the issue in detail..."
               className="w-full px-5 py-4 text-base bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-300 resize-none"
               required
             />
        </div>

        {/* Priority & Uploads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
           <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Priority Level</label>
              <div className="relative">
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 text-base bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none cursor-pointer"
                >
                  <option value="low">Low - It can wait</option>
                  <option value="medium">Medium - Needs attention</option>
                  <option value="high">High - Urgent Fix Needed</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <FaChevronRight className="rotate-90" />
                </div>
              </div>
           </div>

           <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Add Photos</label>
              <div className="relative group">
                 <input 
                   type="file" 
                   multiple 
                   accept="image/*"
                   onChange={handleImageUpload}
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                 />
                 <div className="w-full h-[58px] bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 group-hover:border-primary/50 group-hover:text-primary transition-colors">
                    <span className="flex items-center gap-2 font-bold text-sm">
                       <FaCamera /> {formData.images.length > 0 ? `${formData.images.length} added` : 'Tap to upload'}
                    </span>
                 </div>
              </div>
           </div>

        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white text-lg py-4 rounded-xl font-bold shadow-xl shadow-slate-900/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-8"
        >
          {loading ? 'Submitting Request...' : 'Submit Request'}
        </button>

      </form>
    </div>
  );
};

export default NewMaintenance;
