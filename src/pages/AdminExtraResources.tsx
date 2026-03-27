import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Globe, Youtube, ExternalLink, AlertCircle, CheckCircle2, ChevronDown, Edit2, X, Link as LinkIcon } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

export const AdminExtraResources = () => {
  const { extraResources, loading, updateExtraResource } = useAppStore();
  const [newResource, setNewResource] = React.useState({ title: '', link: '', category: 'Website', description: '' });
  const [editingResource, setEditingResource] = React.useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState({ text: '', type: '' });
  const [deleteModal, setDeleteModal] = React.useState<{ isOpen: boolean; id: string }>({
    isOpen: false,
    id: ''
  });

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResource.title.trim() || !newResource.link.trim()) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'extra_resources'), {
        ...newResource,
        createdAt: serverTimestamp()
      });
      setNewResource({ title: '', link: '', category: 'Website', description: '' });
      setMessage({ text: 'Resource added successfully!', type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const handleUpdateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource || !editingResource.title.trim() || !editingResource.link.trim()) return;
    setIsSubmitting(true);
    try {
      const { id, ...updates } = editingResource;
      await updateExtraResource(id, updates);
      setEditingResource(null);
      setMessage({ text: 'Resource updated successfully!', type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const handleDeleteResource = async () => {
    if (!deleteModal.id) return;
    try {
      await deleteDoc(doc(db, 'extra_resources', deleteModal.id));
      setMessage({ text: 'Resource deleted successfully!', type: 'success' });
      setDeleteModal({ isOpen: false, id: '' });
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  return (
    <div className="space-y-12 py-8">
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: '' })}
        onConfirm={handleDeleteResource}
        title="Delete Resource?"
        message="Are you sure you want to delete this global resource? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Manage <span className="text-emerald-600">Global Resources</span>
        </h1>
        <p className="text-gray-500">Add and manage external links, tools, and learning platforms for students.</p>
      </div>

      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-2xl flex items-center gap-3 border ${
              message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="font-medium">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form Section */}
        <div className="lg:col-span-1">
          {editingResource ? (
            <form onSubmit={handleUpdateResource} className="bg-white p-8 rounded-[2.5rem] border border-emerald-500/20 shadow-xl shadow-emerald-500/5 space-y-6 sticky top-24">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Edit Resource</h3>
                <button 
                  type="button"
                  onClick={() => setEditingResource(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Title</label>
                  <input
                    type="text"
                    required
                    value={editingResource.title}
                    onChange={(e) => setEditingResource({ ...editingResource, title: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    placeholder="e.g., GeeksforGeeks"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Link</label>
                  <input
                    type="url"
                    required
                    value={editingResource.link}
                    onChange={(e) => setEditingResource({ ...editingResource, link: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Category</label>
                  <div className="relative">
                    <select
                      required
                      value={editingResource.category}
                      onChange={(e) => setEditingResource({ ...editingResource, category: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none appearance-none"
                    >
                      <option value="Website">Website</option>
                      <option value="YouTube">YouTube</option>
                      <option value="Documentation">Documentation</option>
                      <option value="Tools">Tools</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingResource.description}
                    onChange={(e) => setEditingResource({ ...editingResource, description: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none resize-none"
                    placeholder="Briefly describe this resource..."
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                <CheckCircle2 size={20} />
                {isSubmitting ? 'Updating...' : 'Update Resource'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleAddResource} className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/5 space-y-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900">Add New Resource</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newResource.title}
                    onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    placeholder="e.g., GeeksforGeeks"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Link</label>
                  <input
                    type="url"
                    required
                    value={newResource.link}
                    onChange={(e) => setNewResource({ ...newResource, link: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Category</label>
                  <div className="relative">
                    <select
                      required
                      value={newResource.category}
                      onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none appearance-none"
                    >
                      <option value="Website">Website</option>
                      <option value="YouTube">YouTube</option>
                      <option value="Documentation">Documentation</option>
                      <option value="Tools">Tools</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Description</label>
                  <textarea
                    rows={3}
                    value={newResource.description}
                    onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none resize-none"
                    placeholder="Briefly describe this resource..."
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                <Plus size={20} />
                {isSubmitting ? 'Adding...' : 'Add Resource'}
              </button>
            </form>
          )}
        </div>

        {/* Resources List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-gray-900 ml-2">Global Resources List</h3>
          {loading.extraResources ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-3xl"></div>)}
            </div>
          ) : extraResources.length > 0 ? (
            extraResources.map((item) => (
              <motion.div
                key={item.id}
                layout
                className="p-6 bg-white rounded-3xl border border-black/5 hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group relative"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                      {item.category === 'YouTube' ? <Youtube size={24} /> : item.category === 'Website' ? <Globe size={24} /> : <ExternalLink size={24} />}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-xl font-bold text-gray-900">{item.title}</h4>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-widest border bg-emerald-50 text-emerald-600 border-emerald-100">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed text-sm">{item.description || 'No description provided.'}</p>
                      <div className="flex items-center gap-4 pt-2">
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-emerald-600 hover:underline flex items-center gap-1"
                        >
                          <LinkIcon size={14} /> {item.link}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingResource(item)}
                      className="p-3 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, id: item.id })}
                      className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-24 bg-white rounded-[2.5rem] border border-black/5">
              <p className="text-gray-500">No global resources added yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
