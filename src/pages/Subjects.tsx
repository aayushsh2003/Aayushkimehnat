import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'motion/react';
import { BookOpen, ArrowRight, ChevronLeft, Search } from 'lucide-react';
import { SEO } from '../components/SEO';

export const Subjects = () => {
  const { yearName } = useParams();
  const { subjects, years, loading } = useAppStore();
  const [searchTerm, setSearchTerm] = React.useState('');

  const decodedYearName = decodeURIComponent(yearName || '');
  const year = years.find(y => y.name === decodedYearName);
  const filteredSubjects = subjects.filter(s => s.yearId === year?.id && s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading.subjects || loading.years) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-8">
      <SEO 
        title={`${decodedYearName} Subjects - Aayush Ki Mehnat`} 
        description={`Access all subjects and study materials for ${decodedYearName} RTU B.Tech. Free handwritten notes, books, and papers.`}
      />
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 md:space-y-4">
          <Link to="/years" className="inline-flex items-center gap-2 text-emerald-600 font-bold text-xs md:text-sm hover:gap-3 transition-all uppercase tracking-wider">
            <ChevronLeft size={14} className="md:w-4 md:h-4" /> Back to Years
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight"
          >
            Subjects for <span className="text-emerald-600">{year?.name || 'Year'}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm md:text-base text-gray-500"
          >
            Select a subject to view its notes, books, and other resources.
          </motion.p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 md:w-5 md:h-5" size={16} />
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-6 py-3.5 md:py-4 bg-white border border-black/5 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none shadow-sm text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {filteredSubjects.length > 0 ? (
          filteredSubjects.map((subject, idx) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
            >
              <Link
                to={`/subjects/${encodeURIComponent(year?.name || '')}/${encodeURIComponent(subject.name)}`}
                className="group block p-6 md:p-8 bg-white rounded-3xl md:rounded-[2.5rem] border border-black/5 hover:border-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-50 text-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform shadow-sm">
                  <BookOpen size={24} className="md:w-7 md:h-7" />
                </div>
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors break-words">{subject.name}</h3>
                  {subject.code && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md text-[9px] md:text-[10px] font-mono uppercase tracking-widest border border-black/5">
                      {subject.code}
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-xs md:text-sm mb-4 md:mb-6">Access all resources for this subject</p>
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs md:text-sm group-hover:gap-3 transition-all">
                  View Resources <ArrowRight size={14} className="md:w-4 md:h-4" />
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 md:py-24 bg-white rounded-3xl md:rounded-[2.5rem] border border-black/5 px-4">
            <p className="text-gray-500 text-base md:text-lg">No subjects found for this year.</p>
          </div>
        )}
      </div>
    </div>
  );
};
