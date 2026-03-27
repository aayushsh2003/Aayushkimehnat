import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Calendar, AlertCircle, CheckCircle2, Edit2, X } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

export const AdminYears = () => {
  const { years, loading, updateYear } = useAppStore();
  const [newYear, setNewYear] = React.useState('');
  const [editingYear, setEditingYear] = React.useState<{ id: string; name: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState({ text: '', type: '' });
  const [deleteModal, setDeleteModal] = React.useState<{ isOpen: boolean; id: string }>({
    isOpen: false,
    id: ''
  });

  const handleAddYear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYear.trim()) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'years'), {
        name: newYear,
        createdAt: serverTimestamp()
      });
      setNewYear('');
      setMessage({ text: 'Year added successfully!', type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const handleUpdateYear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingYear || !editingYear.name.trim()) return;
    setIsSubmitting(true);
    try {
      await updateYear(editingYear.id, { name: editingYear.name });
      setEditingYear(null);
      setMessage({ text: 'Year updated successfully!', type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const handleDeleteYear = async () => {
    if (!deleteModal.id) return;
    try {
      await deleteDoc(doc(db, 'years', deleteModal.id));
      setMessage({ text: 'Year deleted successfully!', type: 'success' });
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
        onConfirm={handleDeleteYear}
        title="Delete Year?"
        message="Are you sure you want to delete this year? All associated subjects and resources will remain but lose their parent reference."
        confirmText="Delete"
        type="danger"
      />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Manage <span className="text-emerald-600">Years</span>
          </h1>
          <p className="text-gray-500">Add, update or remove academic years from the platform.</p>
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
          {editingYear ? (
            <form onSubmit={handleUpdateYear} className="bg-white p-8 rounded-[2.5rem] border border-emerald-500/20 shadow-xl shadow-emerald-500/5 space-y-6 sticky top-24">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Edit Year</h3>
                <button 
                  type="button"
                  onClick={() => setEditingYear(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900 ml-1">Year Name</label>
                <input
                  type="text"
                  required
                  value={editingYear.name}
                  onChange={(e) => setEditingYear({ ...editingYear, name: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                  placeholder="e.g., 1st Year"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                <CheckCircle2 size={20} />
                {isSubmitting ? 'Updating...' : 'Update Year'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleAddYear} className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/5 space-y-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900">Add New Year</h3>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900 ml-1">Year Name</label>
                <input
                  type="text"
                  required
                  value={newYear}
                  onChange={(e) => setNewYear(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                  placeholder="e.g., 1st Year"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                <Plus size={20} />
                {isSubmitting ? 'Adding...' : 'Add Year'}
              </button>
            </form>
          )}
        </div>

        {/* Years List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-gray-900 ml-2">Existing Years</h3>
          {loading.years ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-3xl"></div>)}
            </div>
          ) : years.length > 0 ? (
            years.map((year) => (
              <motion.div
                key={year.id}
                layout
                className="flex items-center justify-between p-6 bg-white rounded-3xl border border-black/5 hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <Calendar size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">{year.name}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingYear({ id: year.id, name: year.name })}
                    className="p-3 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, id: year.id })}
                    className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-24 bg-white rounded-[2.5rem] border border-black/5">
              <p className="text-gray-500">No years added yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
