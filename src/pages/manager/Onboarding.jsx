import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Updated path
import { MockService } from '../../services/mockService'; // Updated path

export default function ManagerOnboarding() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Assume user is updated via context/service
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: 'gated', // gated, estate, complex
    structure: 'streets', // streets, blocks
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      MockService.createEstate({
        ...formData,
        code: `EST-${Math.floor(1000 + Math.random() * 9000)}` // Simple code generation
      });
      // Force reload or redirect to dashboard (Auth logic should handle "has estate now")
      // In a real app we'd update the context. Here, we'll navigate.
      navigate('/manager/dashboard');
      window.location.reload(); // Quick fix to refresh AuthContext from local storage
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl p-8 md:p-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-primary mb-6">
            <span className="material-icons-round text-3xl">domain_add</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-3">Setup Your Estate</h1>
          <p className="text-gray-500">Welcome, {user?.name}. Let's get your property set up for tenants.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Estate Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="e.g. Victorian Gardens"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
             <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="Street address, City, State"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="gated">Gated Community</option>
                <option value="complex">Apartment Complex</option>
                <option value="open">Open Street</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit Structure</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                value={formData.structure}
                onChange={(e) => setFormData({...formData, structure: e.target.value})}
              >
                <option value="streets">Streets & House Numbers</option>
                <option value="blocks">Blocks & Flat Numbers</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-sky-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              {loading ? 'Setting up...' : 'Create Dashboard'}
              {!loading && <span className="material-icons-round">arrow_forward</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
