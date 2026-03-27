import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, FileText, AlertCircle, CheckCircle2, ChevronDown, ExternalLink, Search, Edit2, X, Book, ClipboardList, FileQuestion, FlaskConical, MoreHorizontal } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import { cn } from '../lib/utils';

export const AdminResources = () => {
  const { subjects, resources, loading, updateResource } = useAppStore();
  const [newResource, setNewResource] = React.useState({ 
    title: '', 
    subjectId: '', 
    type: 'notes', 
    link: '' 
  });
  const [editingResource, setEditingResource] = React.useState<any | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState({ text: '', type: '' });
  const [deleteModal, setDeleteModal] = React.useState<{ isOpen: boolean; id: string }>({
    isOpen: false,
    id: ''
  });

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResource.title.trim() || !newResource.subjectId || !newResource.link.trim()) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'resources'), {
        ...newResource
      });
      setNewResource({ title: '', subjectId: '', type: 'notes', link: '' });
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
    if (!editingResource || !editingResource.title.trim() || !editingResource.subjectId || !editingResource.link.trim()) return;
    setIsSubmitting(true);
    try {
      const { id, ...updates } = editingResource;
      await updateResource(id, updates);
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
      await deleteDoc(doc(db, 'resources', deleteModal.id));
      setMessage({ text: 'Resource deleted successfully!', type: 'success' });
      setDeleteModal({ isOpen: false, id: '' });
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const filteredResources = resources.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subjects.find(s => s.id === r.subjectId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 py-8">
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: '' })}
        onConfirm={handleDeleteResource}
        title="Delete Resource?"
        message="Are you sure you want to delete this resource? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Manage <span className="text-emerald-600">Resources</span>
          </h1>
          <p className="text-gray-500">Add, update or remove academic resources (notes, books, papers, etc.).</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-black/5 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none shadow-sm"
          />
        </div>
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
                    placeholder="e.g., Unit 1 Notes"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Select Subject</label>
                  <div className="relative">
                    <select
                      required
                      value={editingResource.subjectId}
                      onChange={(e) => setEditingResource({ ...editingResource, subjectId: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none appearance-none"
                    >
                      <option value="">Choose Subject</option>
                      {subjects.map(subject => (
                        <option key={subject.id} value={subject.id}>
                          {subject.code ? `[${subject.code}] ` : ''}{subject.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Resource Type</label>
                  <div className="relative">
                    <select
                      required
                      value={editingResource.type}
                      onChange={(e) => setEditingResource({ ...editingResource, type: e.target.value as any })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none appearance-none"
                    >
                      <option value="notes">Notes</option>
                      <option value="books">Books</option>
                      <option value="assignment">Assignment</option>
                      <option value="paper">Paper</option>
                      <option value="lab">Lab</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Resource Link (URL)</label>
                  <input
                    type="url"
                    required
                    value={editingResource.link}
                    onChange={(e) => setEditingResource({ ...editingResource, link: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    placeholder="https://drive.google.com/..."
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
                    placeholder="e.g., Unit 1 Notes"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Select Subject</label>
                  <div className="relative">
                    <select
                      required
                      value={newResource.subjectId}
                      onChange={(e) => setNewResource({ ...newResource, subjectId: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none appearance-none"
                    >
                      <option value="">Choose Subject</option>
                      {subjects.map(subject => (
                        <option key={subject.id} value={subject.id}>
                          {subject.code ? `[${subject.code}] ` : ''}{subject.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Resource Type</label>
                  <div className="relative">
                    <select
                      required
                      value={newResource.type}
                      onChange={(e) => setNewResource({ ...newResource, type: e.target.value as any })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none appearance-none"
                    >
                      <option value="notes">Notes</option>
                      <option value="books">Books</option>
                      <option value="assignment">Assignment</option>
                      <option value="paper">Paper</option>
                      <option value="lab">Lab</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Resource Link (URL)</label>
                  <input
                    type="url"
                    required
                    value={newResource.link}
                    onChange={(e) => setNewResource({ ...newResource, link: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    placeholder="https://drive.google.com/..."
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
          <h3 className="text-xl font-bold text-gray-900 ml-2">Existing Resources</h3>
          {loading.resources ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-24 bg-gray-100 rounded-3xl"></div>)}
            </div>
          ) : filteredResources.length > 0 ? (
            filteredResources.map((resource) => {
              const typeStyles = {
                notes: { bg: 'bg-indigo-50/50', text: 'text-indigo-600', icon: FileText },
                books: { bg: 'bg-teal-50/50', text: 'text-teal-600', icon: Book },
                assignment: { bg: 'bg-amber-50/50', text: 'text-amber-600', icon: ClipboardList },
                paper: { bg: 'bg-violet-50/50', text: 'text-violet-600', icon: FileQuestion },
                lab: { bg: 'bg-rose-50/50', text: 'text-rose-600', icon: FlaskConical },
                other: { bg: 'bg-slate-50/50', text: 'text-slate-600', icon: MoreHorizontal }
              }[resource.type as keyof typeof typeStyles] || { bg: 'bg-slate-50/50', text: 'text-slate-600', icon: FileText };

              const TypeIcon = typeStyles.icon;

              return (
                <motion.div
                  key={resource.id}
                  layout
                  className="flex items-center justify-between p-6 bg-white rounded-3xl border border-black/5 hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm",
                      typeStyles.bg,
                      typeStyles.text
                    )}>
                      <TypeIcon size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{resource.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-medium">
                          {(() => {
                            const s = subjects.find(s => s.id === resource.subjectId);
                            return s ? `${s.code ? `[${s.code}] ` : ''}${s.name}` : 'Unknown Subject';
                          })()}
                        </span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className={cn(
                          "text-[10px] font-bold uppercase tracking-widest",
                          typeStyles.text
                        )}>
                          {resource.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                    >
                      <ExternalLink size={20} />
                    </a>
                    <button
                      onClick={() => setEditingResource(resource)}
                      className="p-3 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, id: resource.id })}
                      className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-24 bg-white rounded-[2.5rem] border border-black/5">
              <p className="text-gray-500">No resources found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
