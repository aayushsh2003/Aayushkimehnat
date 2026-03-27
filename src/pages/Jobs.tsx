import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Search, Filter, MapPin, Building2, ExternalLink, Briefcase, GraduationCap, Gavel } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { SEO } from '../components/SEO';

const JOB_TYPES = [
  { id: 'all', label: 'All Jobs', icon: Briefcase },
  { id: 'government', label: 'Government', icon: Gavel, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
  { id: 'private', label: 'Private', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  { id: 'internship', label: 'Internship', icon: GraduationCap, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
];

export const Jobs = () => {
  const { jobs, loading } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || job.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [jobs, searchQuery, selectedType]);

  if (loading.jobs) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO 
        title="Job Opportunities - Aayush Ki Mehnat" 
        description="Find the latest government jobs, private sector openings, and internships for B.Tech students. Stay updated with career opportunities at Aayush Ki Mehnat."
      />
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
          IT Job Portal
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Explore the latest opportunities in Government and Private sectors. Find your next career move or internship.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by job title or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {JOB_TYPES.map((type) => {
            const Icon = type.icon;
            const isActive = selectedType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={clsx(
                  "flex items-center gap-2 px-6 py-4 rounded-2xl border transition-all whitespace-nowrap font-medium",
                  isActive 
                    ? "bg-gray-900 text-white border-gray-900 shadow-lg scale-105" 
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                <Icon className={clsx("w-5 h-5", isActive ? "text-white" : type.color)} />
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={job.id}
                className="group bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={clsx(
                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                    job.type === 'government' ? "bg-red-50 text-red-600" :
                    job.type === 'private' ? "bg-blue-50 text-blue-600" :
                    "bg-green-50 text-green-600"
                  )}>
                    {job.type}
                  </div>
                  <span className="text-xs text-gray-400 font-medium">
                    {job.createdAt?.seconds ? new Date(job.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  {job.title}
                </h3>
                
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Building2 className="w-4 h-4" />
                  <span className="font-medium">{job.company}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>

                <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-grow">
                  {job.description}
                </p>

                <a
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-50 text-gray-900 font-bold rounded-2xl hover:bg-emerald-600 hover:text-white transition-all group/btn"
                >
                  Apply Now
                  <ExternalLink className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                </a>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
