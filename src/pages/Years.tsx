import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'motion/react';
import { Calendar, ArrowRight, GraduationCap, Globe, Youtube, ExternalLink, MoreHorizontal, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { SEO } from '../components/SEO';

export const Years = () => {
  const { years, extraResources, loading } = useAppStore();

  if (loading.years || loading.extraResources) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-8">
      <SEO 
        title="Academic Years - Aayush Ki Mehnat" 
        description="Browse RTU B.Tech study materials by academic year. Access notes, books, and papers for 1st, 2nd, 3rd, and 4th year students."
      />
      <div className="text-center space-y-3 md:space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight"
        >
          Select Your <span className="text-emerald-600">Academic Year</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm md:text-base text-gray-500 max-w-xl mx-auto px-4"
        >
          Choose your current year of study to explore subjects and resources tailored for you.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {years.length > 0 ? (
          years.map((year, idx) => (
            <motion.div
              key={year.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
            >
              <Link
                to={`/years/${encodeURIComponent(year.name)}/subjects`}
                className="group block p-6 md:p-8 bg-white rounded-3xl md:rounded-[2.5rem] border border-black/5 hover:border-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 md:opacity-10 group-hover:opacity-20 transition-opacity">
                  <GraduationCap size={60} className="md:w-20 md:h-20" />
                </div>
                <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-50 text-emerald-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform shadow-sm">
                  <Calendar size={24} className="md:w-7 md:h-7" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">{year.name}</h3>
                <p className="text-gray-500 text-xs md:text-sm mb-4 md:mb-6">Explore all subjects for {year.name}</p>
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs md:text-sm group-hover:gap-3 transition-all">
                  View Subjects <ArrowRight size={14} className="md:w-4 md:h-4" />
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 md:py-24 bg-white rounded-3xl md:rounded-[2.5rem] border border-black/5 px-4">
            <p className="text-gray-500 text-base md:text-lg">No years added yet. Please check back later.</p>
          </div>
        )}
      </div>

      {/* Global Resources Section */}
      <div className="space-y-8 pt-12 border-t border-black/5">
        <div className="text-center space-y-3">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight"
          >
            Global <span className="text-emerald-600">Resources</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm md:text-base text-gray-500 max-w-xl mx-auto px-4"
          >
            Curated external links and tools to help you in your academic journey.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {extraResources.length > 0 ? (
            extraResources.map((resource, idx) => (
              <motion.a
                key={resource.id}
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="group p-6 bg-white rounded-3xl border border-black/5 hover:border-emerald-500/20 hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      {resource.category === 'YouTube' ? <Youtube size={20} /> : resource.category === 'Website' ? <Globe size={20} /> : <ExternalLink size={20} />}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                      {resource.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">{resource.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">{resource.description}</p>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs group-hover:gap-3 transition-all">
                  Visit Resource <ArrowRight size={14} />
                </div>
              </motion.a>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-black/5">
              <p className="text-gray-500">No global resources added yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
