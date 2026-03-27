import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink, 
  ArrowLeft,
  Edit2,
  X,
  Search,
  Filter,
  Book,
  ClipboardList,
  FileQuestion,
  FlaskConical,
  MoreHorizontal
} from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import { cn } from '../lib/utils';

export const AdminSubjectResources = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { subjects, resources, loading } = useAppStore();
  
  const subject = subjects.find(s => s.id === subjectId);
  const subjectResources = resources.filter(r => r.subjectId === subjectId);

  const [newResource, setNewResource] = React.useState({ title: '', type: 'notes', url: '' });
  const [editingResource, setEditingResource] = React.useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState({ text: '', type: '' });
  const [searchQuery, setSearchQuery] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [deleteModal, setDeleteModal] = React.useState<{ isOpen: boolean; id: string }>({
    isOpen: false,
    id: ''
  });

  const filteredResources = subjectResources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || r.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResource.title.trim() || !newResource.url.trim() || !subjectId) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'resources'), {
        ...newResource,
        subjectId
      });
      setNewResource({ title: '', type: 'notes', url: '' });
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
    if (!editingResource || !editingResource.title.trim() || !editingResource.url.trim()) return;
    setIsSubmitting(true);
    try {
      const { id, ...updates } = editingResource;
      await updateDoc(doc(db, 'resources', id), {
        ...updates
      });
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

  if (!subject && !loading.subjects) {
    return (
      <div className="py-20 text-center space-y-4">
        <AlertCircle size={48} className="mx-auto text-red-500" />
        <h2 className="text-2xl font-bold text-gray-900">Subject Not Found</h2>
        <button 
          onClick={() => navigate('/admin/subjects')}
          className="text-emerald-600 font-bold hover:underline"
        >
          Back to Subjects
        </button>
      </div>
    );
  }

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

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <button 
            onClick={() => navigate('/admin/subjects')}
            className="flex items-center gap-2 text-sm font-bold text-emerald-600 hover:gap-3 transition-all mb-4"
          >
            <ArrowLeft size={16} /> Back to Subjects
          </button>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Resources for <span className="text-emerald-600">{subject?.name}</span>
          </h1>
          <p className="text-gray-500">Manage notes, books, and papers for this subject.</p>
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
                  <label className="text-sm font-bold text-gray-900 ml-1">Resource Title</label>
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
                  <label className="text-sm font-bold text-gray-900 ml-1">Resource Type</label>
                  <select
                    required
                    value={editingResource.type}
                    onChange={(e) => setEditingResource({ ...editingResource, type: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                  >
                    <option value="notes">Notes</option>
                    <option value="books">Book</option>
                    <option value="assignment">Assignment</option>
                    <option value="paper">Previous Paper</option>
                    <option value="lab">Lab</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Resource URL (PDF/Link)</label>
                  <input
                    type="url"
                    required
                    value={editingResource.url}
                    onChange={(e) => setEditingResource({ ...editingResource, url: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    placeholder="https://example.com/file.pdf"
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
                  <label className="text-sm font-bold text-gray-900 ml-1">Resource Title</label>
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
                  <label className="text-sm font-bold text-gray-900 ml-1">Resource Type</label>
                  <select
                    required
                    value={newResource.type}
                    onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                  >
                    <option value="notes">Notes</option>
                    <option value="books">Book</option>
                    <option value="assignment">Assignment</option>
                    <option value="paper">Previous Paper</option>
                    <option value="lab">Lab</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Resource URL (PDF/Link)</label>
                  <input
                    type="url"
                    required
                    value={newResource.url}
                    onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    placeholder="https://example.com/file.pdf"
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

        {/* Resources List Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-black/5 shadow-sm">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none text-sm"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="text-gray-400" size={18} />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="flex-1 sm:flex-none px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none text-sm font-bold"
              >
                <option value="all">All Types</option>
                <option value="notes">Notes</option>
                <option value="books">Books</option>
                <option value="assignment">Assignments</option>
                <option value="paper">Papers</option>
                <option value="lab">Lab</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {loading.resources ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-3xl"></div>)}
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
                    <div className="flex items-center gap-6">
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm",
                        typeStyles.bg,
                        typeStyles.text
                      )}>
                        <TypeIcon size={28} />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-1">{resource.title}</h4>
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                            typeStyles.bg,
                            typeStyles.text
                          )}>
                            {resource.type}
                          </span>
                          <a 
                            href={resource.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline"
                          >
                            View Link <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingResource(resource)}
                        className="p-3 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                        title="Edit Resource"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, id: resource.id })}
                        className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete Resource"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-24 bg-white rounded-[2.5rem] border border-black/5">
                <FileText size={48} className="mx-auto mb-4 text-gray-200" />
                <p className="text-gray-500">No resources found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
