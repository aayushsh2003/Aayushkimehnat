import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Briefcase, AlertCircle, CheckCircle2, ChevronDown, Calendar, MapPin, Building2, Edit2, X, ExternalLink } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

export const AdminJobs = () => {
  const { jobs, loading, updateJob } = useAppStore();
  const [newJob, setNewJob] = React.useState({ 
    title: '', 
    company: '', 
    type: 'private', 
    location: '', 
    link: '', 
    description: '' 
  });
  const [editingJob, setEditingJob] = React.useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState({ text: '', type: '' });
  const [deleteModal, setDeleteModal] = React.useState<{ isOpen: boolean; id: string }>({
    isOpen: false,
    id: ''
  });

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title.trim() || !newJob.company.trim() || !newJob.link.trim()) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'jobs'), {
        ...newJob,
        createdAt: serverTimestamp()
      });
      setNewJob({ title: '', company: '', type: 'private', location: '', link: '', description: '' });
      setMessage({ text: 'Job added successfully!', type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const handleUpdateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob || !editingJob.title.trim() || !editingJob.company.trim()) return;
    setIsSubmitting(true);
    try {
      const { id, ...updates } = editingJob;
      await updateJob(id, updates);
      setEditingJob(null);
      setMessage({ text: 'Job updated successfully!', type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const handleDeleteJob = async () => {
    if (!deleteModal.id) return;
    try {
      await deleteDoc(doc(db, 'jobs', deleteModal.id));
      setMessage({ text: 'Job deleted successfully!', type: 'success' });
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
        onConfirm={handleDeleteJob}
        title="Delete Job?"
        message="Are you sure you want to delete this job posting? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Manage <span className="text-emerald-600">Job Portal</span>
        </h1>
        <p className="text-gray-500">Add, edit, and manage IT job openings for students.</p>
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
          {editingJob ? (
            <form onSubmit={handleUpdateJob} className="bg-white p-8 rounded-[2.5rem] border border-emerald-500/20 shadow-xl shadow-emerald-500/5 space-y-6 sticky top-24">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Edit Job</h3>
                <button 
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Job Title</label>
                  <input
                    type="text"
                    required
                    value={editingJob.title}
                    onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    placeholder="e.g., Software Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Company</label>
                  <input
                    type="text"
                    required
                    value={editingJob.company}
                    onChange={(e) => setEditingJob({ ...editingJob, company: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    placeholder="e.g., Google"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Type</label>
                  <div className="relative">
                    <select
                      required
                      value={editingJob.type}
                      onChange={(e) => setEditingJob({ ...editingJob, type: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none appearance-none"
                    >
                      <option value="government">Government</option>
                      <option value="private">Private</option>
                      <option value="internship">Internship</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Location</label>
                  <input
                    type="text"
                    required
                    value={editingJob.location}
                    onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    placeholder="e.g., Remote / New Delhi"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Apply Link</label>
                  <input
                    type="url"
                    required
                    value={editingJob.link}
                    onChange={(e) => setEditingJob({ ...editingJob, link: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={editingJob.description}
                    onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none resize-none"
                    placeholder="Brief job description..."
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                <CheckCircle2 size={20} />
                {isSubmitting ? 'Updating...' : 'Update Job'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleAddJob} className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/5 space-y-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900">Add New Job</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Job Title</label>
                  <input
                    type="text"
                    required
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    placeholder="e.g., Software Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Company</label>
                  <input
                    type="text"
                    required
                    value={newJob.company}
                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    placeholder="e.g., Google"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Type</label>
                  <div className="relative">
                    <select
                      required
                      value={newJob.type}
                      onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none appearance-none"
                    >
                      <option value="government">Government</option>
                      <option value="private">Private</option>
                      <option value="internship">Internship</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Location</label>
                  <input
                    type="text"
                    required
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    placeholder="e.g., Remote / New Delhi"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Apply Link</label>
                  <input
                    type="url"
                    required
                    value={newJob.link}
                    onChange={(e) => setNewJob({ ...newJob, link: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none resize-none"
                    placeholder="Brief job description..."
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                <Plus size={20} />
                {isSubmitting ? 'Adding...' : 'Add Job'}
              </button>
            </form>
          )}
        </div>

        {/* Jobs List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-gray-900 ml-2">All Jobs</h3>
          {loading.jobs ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-100 rounded-3xl"></div>)}
            </div>
          ) : jobs.length > 0 ? (
            jobs.map((job) => (
              <motion.div
                key={job.id}
                layout
                className="p-6 bg-white rounded-3xl border border-black/5 hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group relative"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm shrink-0 ${
                      job.type === 'government' ? 'bg-red-50 text-red-600' :
                      job.type === 'private' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                    }`}>
                      <Briefcase size={24} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-xl font-bold text-gray-900">{job.title}</h4>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-widest border ${
                          job.type === 'government' ? 'bg-red-50 text-red-600 border-red-100' :
                          job.type === 'private' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-green-50 text-green-600 border-green-100'
                        }`}>
                          {job.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Building2 size={14} /> {job.company}</span>
                        <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                        <span className="flex items-center gap-1"><Calendar size={14} /> {job.createdAt?.seconds ? new Date(job.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}</span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>
                      <a href={job.link} target="_blank" rel="noopener noreferrer" className="text-emerald-600 text-sm font-bold flex items-center gap-1 hover:underline">
                        View Link <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingJob(job)}
                      className="p-3 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, id: job.id })}
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
              <p className="text-gray-500">No jobs posted yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
