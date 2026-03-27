import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Megaphone, AlertCircle, CheckCircle2, ChevronDown, Calendar, Tag, Edit2, X } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

export const AdminNews = () => {
  const { news, loading, updateNews } = useAppStore();
  const [newNews, setNewNews] = React.useState({ title: '', content: '', type: 'announcement' });
  const [editingNews, setEditingNews] = React.useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState({ text: '', type: '' });
  const [deleteModal, setDeleteModal] = React.useState<{ isOpen: boolean; id: string }>({
    isOpen: false,
    id: ''
  });

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNews.title.trim() || !newNews.content.trim()) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'news'), {
        ...newNews,
        createdAt: serverTimestamp()
      });
      setNewNews({ title: '', content: '', type: 'announcement' });
      setMessage({ text: 'News added successfully!', type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const handleUpdateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews || !editingNews.title.trim() || !editingNews.content.trim()) return;
    setIsSubmitting(true);
    try {
      const { id, ...updates } = editingNews;
      await updateNews(id, updates);
      setEditingNews(null);
      setMessage({ text: 'News updated successfully!', type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const handleDeleteNews = async () => {
    if (!deleteModal.id) return;
    try {
      await deleteDoc(doc(db, 'news', deleteModal.id));
      setMessage({ text: 'News deleted successfully!', type: 'success' });
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
        onConfirm={handleDeleteNews}
        title="Delete News?"
        message="Are you sure you want to delete this news item? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Manage <span className="text-emerald-600">News & Announcements</span>
        </h1>
        <p className="text-gray-500">Post updates, events, and important announcements for students.</p>
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
          {editingNews ? (
            <form onSubmit={handleUpdateNews} className="bg-white p-8 rounded-[2.5rem] border border-emerald-500/20 shadow-xl shadow-emerald-500/5 space-y-6 sticky top-24">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Edit Update</h3>
                <button 
                  type="button"
                  onClick={() => setEditingNews(null)}
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
                    value={editingNews.title}
                    onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    placeholder="e.g., Exam Schedule Released"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Type</label>
                  <div className="relative">
                    <select
                      required
                      value={editingNews.type}
                      onChange={(e) => setEditingNews({ ...editingNews, type: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none appearance-none"
                    >
                      <option value="announcement">Announcement</option>
                      <option value="update">Update</option>
                      <option value="event">Event</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Content</label>
                  <textarea
                    required
                    rows={4}
                    value={editingNews.content}
                    onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none resize-none"
                    placeholder="Write your announcement here..."
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                <CheckCircle2 size={20} />
                {isSubmitting ? 'Updating...' : 'Update News'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleAddNews} className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/5 space-y-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900">Post New Update</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newNews.title}
                    onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    placeholder="e.g., Exam Schedule Released"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Type</label>
                  <div className="relative">
                    <select
                      required
                      value={newNews.type}
                      onChange={(e) => setNewNews({ ...newNews, type: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none appearance-none"
                    >
                      <option value="announcement">Announcement</option>
                      <option value="update">Update</option>
                      <option value="event">Event</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Content</label>
                  <textarea
                    required
                    rows={4}
                    value={newNews.content}
                    onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none resize-none"
                    placeholder="Write your announcement here..."
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                <Plus size={20} />
                {isSubmitting ? 'Posting...' : 'Post News'}
              </button>
            </form>
          )}
        </div>

        {/* News List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-gray-900 ml-2">Recent News</h3>
          {loading.news ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-3xl"></div>)}
            </div>
          ) : news.length > 0 ? (
            news.map((item) => (
              <motion.div
                key={item.id}
                layout
                className="p-6 bg-white rounded-3xl border border-black/5 hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group relative"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm shrink-0 ${
                      item.type === 'announcement' ? 'bg-orange-50 text-orange-600' :
                      item.type === 'update' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                    }`}>
                      <Megaphone size={24} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-xl font-bold text-gray-900">{item.title}</h4>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-widest border ${
                          item.type === 'announcement' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                          item.type === 'update' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'
                        }`}>
                          {item.type}
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{item.content}</p>
                      <div className="flex items-center gap-4 pt-2">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar size={14} /> {new Date(item.createdAt?.seconds * 1000).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingNews(item)}
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
              <p className="text-gray-500">No news posted yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
