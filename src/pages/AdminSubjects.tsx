import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, BookOpen, AlertCircle, CheckCircle2, ChevronDown, Edit2, X, Eye, ListPlus, Minus, Search } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import { useNavigate } from 'react-router-dom';

export const AdminSubjects = () => {
  const navigate = useNavigate();
  const { years, subjects, loading, updateSubject } = useAppStore();
  const [newSubject, setNewSubject] = React.useState({ name: '', code: '', yearId: '', syllabus: [] as any[] });
  const [editingSubject, setEditingSubject] = React.useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState({ text: '', type: '' });
  const [searchTerm, setSearchTerm] = React.useState('');
  const [deleteModal, setDeleteModal] = React.useState<{ isOpen: boolean; id: string }>({
    isOpen: false,
    id: ''
  });

  const handleAddUnit = (isEditing: boolean) => {
    const newUnit = { unit: `Unit ${((isEditing ? editingSubject.syllabus : newSubject.syllabus) || []).length + 1}`, title: '', topics: [''] };
    if (isEditing) {
      setEditingSubject({
        ...editingSubject,
        syllabus: [...(editingSubject.syllabus || []), newUnit]
      });
    } else {
      setNewSubject({
        ...newSubject,
        syllabus: [...(newSubject.syllabus || []), newUnit]
      });
    }
  };

  const handleRemoveUnit = (index: number, isEditing: boolean) => {
    if (isEditing) {
      const updatedSyllabus = [...(editingSubject.syllabus || [])];
      updatedSyllabus.splice(index, 1);
      setEditingSubject({ ...editingSubject, syllabus: updatedSyllabus });
    } else {
      const updatedSyllabus = [...(newSubject.syllabus || [])];
      updatedSyllabus.splice(index, 1);
      setNewSubject({ ...newSubject, syllabus: updatedSyllabus });
    }
  };

  const handleUpdateUnit = (index: number, field: string, value: string, isEditing: boolean) => {
    if (isEditing) {
      const updatedSyllabus = [...(editingSubject.syllabus || [])];
      updatedSyllabus[index] = { ...updatedSyllabus[index], [field]: value };
      setEditingSubject({ ...editingSubject, syllabus: updatedSyllabus });
    } else {
      const updatedSyllabus = [...(newSubject.syllabus || [])];
      updatedSyllabus[index] = { ...updatedSyllabus[index], [field]: value };
      setNewSubject({ ...newSubject, syllabus: updatedSyllabus });
    }
  };

  const handleAddTopic = (unitIndex: number, isEditing: boolean) => {
    if (isEditing) {
      const updatedSyllabus = [...(editingSubject.syllabus || [])];
      updatedSyllabus[unitIndex].topics = [...updatedSyllabus[unitIndex].topics, ''];
      setEditingSubject({ ...editingSubject, syllabus: updatedSyllabus });
    } else {
      const updatedSyllabus = [...(newSubject.syllabus || [])];
      updatedSyllabus[unitIndex].topics = [...updatedSyllabus[unitIndex].topics, ''];
      setNewSubject({ ...newSubject, syllabus: updatedSyllabus });
    }
  };

  const handleRemoveTopic = (unitIndex: number, topicIndex: number, isEditing: boolean) => {
    if (isEditing) {
      const updatedSyllabus = [...(editingSubject.syllabus || [])];
      updatedSyllabus[unitIndex].topics.splice(topicIndex, 1);
      setEditingSubject({ ...editingSubject, syllabus: updatedSyllabus });
    } else {
      const updatedSyllabus = [...(newSubject.syllabus || [])];
      updatedSyllabus[unitIndex].topics.splice(topicIndex, 1);
      setNewSubject({ ...newSubject, syllabus: updatedSyllabus });
    }
  };

  const handleUpdateTopic = (unitIndex: number, topicIndex: number, value: string, isEditing: boolean) => {
    if (isEditing) {
      const updatedSyllabus = [...(editingSubject.syllabus || [])];
      updatedSyllabus[unitIndex].topics[topicIndex] = value;
      setEditingSubject({ ...editingSubject, syllabus: updatedSyllabus });
    } else {
      const updatedSyllabus = [...(newSubject.syllabus || [])];
      updatedSyllabus[unitIndex].topics[topicIndex] = value;
      setNewSubject({ ...newSubject, syllabus: updatedSyllabus });
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.name.trim() || !newSubject.yearId) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'subjects'), {
        ...newSubject,
        createdAt: serverTimestamp()
      });
      setNewSubject({ name: '', code: '', yearId: '', syllabus: [] });
      setMessage({ text: 'Subject added successfully!', type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const handleUpdateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject || !editingSubject.name.trim() || !editingSubject.yearId) return;
    setIsSubmitting(true);
    try {
      const { id, ...updates } = editingSubject;
      await updateSubject(id, updates);
      setEditingSubject(null);
      setMessage({ text: 'Subject updated successfully!', type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const handleDeleteSubject = async () => {
    if (!deleteModal.id) return;
    try {
      await deleteDoc(doc(db, 'subjects', deleteModal.id));
      setMessage({ text: 'Subject deleted successfully!', type: 'success' });
      setDeleteModal({ isOpen: false, id: '' });
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const filteredSubjects = subjects.filter(subject => 
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (subject.code && subject.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-12 py-8">
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: '' })}
        onConfirm={handleDeleteSubject}
        title="Delete Subject?"
        message="Are you sure you want to delete this subject? All associated resources will remain but lose their parent reference."
        confirmText="Delete"
        type="danger"
      />
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Manage <span className="text-emerald-600">Subjects</span>
        </h1>
        <p className="text-gray-500">Add, update or remove subjects and link them to academic years.</p>
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
          {editingSubject ? (
            <form onSubmit={handleUpdateSubject} className="bg-white p-8 rounded-[2.5rem] border border-emerald-500/20 shadow-xl shadow-emerald-500/5 space-y-6 sticky top-24">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Edit Subject</h3>
                <button 
                  type="button"
                  onClick={() => setEditingSubject(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Subject Name</label>
                  <input
                    type="text"
                    required
                    value={editingSubject.name}
                    onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    placeholder="e.g., Data Structures"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Subject Code (Optional)</label>
                  <input
                    type="text"
                    value={editingSubject.code}
                    onChange={(e) => setEditingSubject({ ...editingSubject, code: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    placeholder="e.g., CS-301"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Select Year</label>
                  <div className="relative">
                    <select
                      required
                      value={editingSubject.yearId}
                      onChange={(e) => setEditingSubject({ ...editingSubject, yearId: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none appearance-none"
                    >
                      <option value="">Choose Year</option>
                      {years.map(year => (
                        <option key={year.id} value={year.id}>{year.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>

                {/* Syllabus Editor */}
                <div className="space-y-4 pt-4 border-t border-black/5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-gray-900 ml-1">Syllabus Units</label>
                    <button
                      type="button"
                      onClick={() => handleAddUnit(true)}
                      className="text-emerald-600 hover:text-emerald-700 font-bold text-xs flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Unit
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {(editingSubject.syllabus || []).map((unit: any, uIdx: number) => (
                      <div key={uIdx} className="p-4 bg-gray-50 rounded-2xl space-y-4 relative">
                        <button
                          type="button"
                          onClick={() => handleRemoveUnit(uIdx, true)}
                          className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Unit (e.g. Unit 1)"
                            value={unit.unit}
                            onChange={(e) => handleUpdateUnit(uIdx, 'unit', e.target.value, true)}
                            className="px-4 py-2 bg-white border border-black/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                          <input
                            type="text"
                            placeholder="Title"
                            value={unit.title}
                            onChange={(e) => handleUpdateUnit(uIdx, 'title', e.target.value, true)}
                            className="px-4 py-2 bg-white border border-black/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Topics</label>
                            <button
                              type="button"
                              onClick={() => handleAddTopic(uIdx, true)}
                              className="text-emerald-600 hover:text-emerald-700 font-bold text-[10px] flex items-center gap-1"
                            >
                              <Plus size={12} /> Add Topic
                            </button>
                          </div>
                          {unit.topics.map((topic: string, tIdx: number) => (
                            <div key={tIdx} className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Topic name"
                                value={topic}
                                onChange={(e) => handleUpdateTopic(uIdx, tIdx, e.target.value, true)}
                                className="flex-1 px-4 py-2 bg-white border border-black/5 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveTopic(uIdx, tIdx, true)}
                                className="p-1 text-gray-400 hover:text-red-500"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                <CheckCircle2 size={20} />
                {isSubmitting ? 'Updating...' : 'Update Subject'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleAddSubject} className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/5 space-y-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900">Add New Subject</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Subject Name</label>
                  <input
                    type="text"
                    required
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    placeholder="e.g., Data Structures"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Subject Code (Optional)</label>
                  <input
                    type="text"
                    value={newSubject.code}
                    onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    placeholder="e.g., CS-301"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Select Year</label>
                  <div className="relative">
                    <select
                      required
                      value={newSubject.yearId}
                      onChange={(e) => setNewSubject({ ...newSubject, yearId: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none appearance-none"
                    >
                      <option value="">Choose Year</option>
                      {years.map(year => (
                        <option key={year.id} value={year.id}>{year.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>

                {/* Syllabus Editor */}
                <div className="space-y-4 pt-4 border-t border-black/5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-gray-900 ml-1">Syllabus Units</label>
                    <button
                      type="button"
                      onClick={() => handleAddUnit(false)}
                      className="text-emerald-600 hover:text-emerald-700 font-bold text-xs flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Unit
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {(newSubject.syllabus || []).map((unit: any, uIdx: number) => (
                      <div key={uIdx} className="p-4 bg-gray-50 rounded-2xl space-y-4 relative">
                        <button
                          type="button"
                          onClick={() => handleRemoveUnit(uIdx, false)}
                          className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Unit (e.g. Unit 1)"
                            value={unit.unit}
                            onChange={(e) => handleUpdateUnit(uIdx, 'unit', e.target.value, false)}
                            className="px-4 py-2 bg-white border border-black/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                          <input
                            type="text"
                            placeholder="Title"
                            value={unit.title}
                            onChange={(e) => handleUpdateUnit(uIdx, 'title', e.target.value, false)}
                            className="px-4 py-2 bg-white border border-black/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Topics</label>
                            <button
                              type="button"
                              onClick={() => handleAddTopic(uIdx, false)}
                              className="text-emerald-600 hover:text-emerald-700 font-bold text-[10px] flex items-center gap-1"
                            >
                              <Plus size={12} /> Add Topic
                            </button>
                          </div>
                          {unit.topics.map((topic: string, tIdx: number) => (
                            <div key={tIdx} className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Topic name"
                                value={topic}
                                onChange={(e) => handleUpdateTopic(uIdx, tIdx, e.target.value, false)}
                                className="flex-1 px-4 py-2 bg-white border border-black/5 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveTopic(uIdx, tIdx, false)}
                                className="p-1 text-gray-400 hover:text-red-500"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                <Plus size={20} />
                {isSubmitting ? 'Adding...' : 'Add Subject'}
              </button>
            </form>
          )}
        </div>

        {/* Subjects List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 ml-2 mb-6">
            <h3 className="text-xl font-bold text-gray-900">Existing Subjects</h3>
            <div className="relative group max-w-xs w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-black/5 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none shadow-sm"
              />
            </div>
          </div>
          {loading.subjects ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-3xl"></div>)}
            </div>
          ) : filteredSubjects.length > 0 ? (
            filteredSubjects.map((subject) => (
              <motion.div
                key={subject.id}
                layout
                className="flex items-center justify-between p-6 bg-white rounded-3xl border border-black/5 hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <BookOpen size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-xl font-bold text-gray-900">{subject.name}</h4>
                      {subject.code && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md text-[10px] font-mono uppercase tracking-widest border border-black/5">
                          {subject.code}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100">
                        {years.find(y => y.id === subject.yearId)?.name || 'Unknown Year'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/admin/subjects/${subject.id}/resources`)}
                    className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    title="View Resources"
                  >
                    <Eye size={20} />
                  </button>
                  <button
                    onClick={() => setEditingSubject(subject)}
                    className="p-3 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                    title="Edit Subject"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, id: subject.id })}
                    className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    title="Delete Subject"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-24 bg-white rounded-[2.5rem] border border-black/5">
              <p className="text-gray-500">
                {searchTerm ? `No subjects found matching "${searchTerm}"` : 'No subjects added yet.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
