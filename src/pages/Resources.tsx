import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Globe, 
  Youtube, 
  ExternalLink, 
  BookOpen, 
  Wrench, 
  ArrowUpRight, 
  Filter,
  LayoutGrid,
  List as ListIcon,
  ChevronRight
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SEO } from '../components/SEO';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CATEGORIES = ['All', 'Website', 'YouTube', 'Documentation', 'Tools', 'Other'];

export const Resources = () => {
  const { extraResources, loading } = useAppStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  const filteredResources = extraResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'YouTube': return <Youtube size={20} />;
      case 'Website': return <Globe size={20} />;
      case 'Documentation': return <BookOpen size={20} />;
      case 'Tools': return <Wrench size={20} />;
      default: return <ExternalLink size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Global Resources - Aayush Ki Mehnat" 
        description="Explore curated external tools, YouTube channels, and documentation for RTU B.Tech students. Enhance your learning with these handpicked resources."
      />
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100"
          >
            <Globe size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Global Learning Hub</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight"
          >
            Curated <span className="text-emerald-600">Resources</span> for Success
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600"
          >
            Discover a handpicked collection of external tools, platforms, and documentation to accelerate your learning journey.
          </motion.p>
        </div>

        {/* Filters & Search Section */}
        <div className="bg-white p-4 sm:p-6 rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/5 space-y-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search resources by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none text-gray-900 font-medium"
              />
            </div>

            {/* View Toggle (Desktop Only) */}
            <div className="hidden sm:flex items-center gap-2 p-1 bg-gray-100 rounded-xl shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === 'grid' ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === 'list' ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <ListIcon size={20} />
              </button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 text-gray-400 mr-2">
              <Filter size={16} />
              <span className="text-sm font-bold uppercase tracking-wider">Categories:</span>
            </div>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-5 py-2 rounded-xl text-sm font-bold transition-all border",
                  selectedCategory === category
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                    : "bg-white border-black/5 text-gray-600 hover:border-emerald-500/20 hover:bg-emerald-50/30"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Content */}
        {loading.extraResources ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-white rounded-[2.5rem] border border-black/5 animate-pulse" />
            ))}
          </div>
        ) : filteredResources.length > 0 ? (
          <motion.div 
            layout
            className={cn(
              "grid gap-6",
              viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}
          >
            <AnimatePresence mode="popLayout">
              {filteredResources.map((resource) => (
                <motion.div
                  key={resource.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={cn(
                    "group bg-white rounded-[2.5rem] border border-black/5 hover:border-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all overflow-hidden relative",
                    viewMode === 'list' && "flex flex-col sm:flex-row items-center p-2"
                  )}
                >
                  {/* Card Content */}
                  <div className={cn(
                    "p-8 space-y-6 flex-1",
                    viewMode === 'list' && "p-6"
                  )}>
                    <div className="flex items-start justify-between">
                      <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                        {getCategoryIcon(resource.category)}
                      </div>
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-gray-50 text-gray-500 border-black/5">
                        {resource.category}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {resource.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed line-clamp-3">
                        {resource.description || 'Access this valuable resource to enhance your technical skills and knowledge base.'}
                      </p>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <a
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:gap-3 transition-all group/link"
                      >
                        Visit Resource
                        <ArrowUpRight size={18} className="group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform" />
                      </a>
                      
                      {viewMode === 'list' && (
                        <div className="hidden sm:block">
                           <ChevronRight className="text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" size={24} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Decorative Background Element */}
                  <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-white rounded-[3rem] border border-black/5 space-y-4"
          >
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-400">
              <Search size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">No resources found</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                We couldn't find any resources matching your current search or filter criteria.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-emerald-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </motion.div>
        )}

        {/* Footer CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gray-900 rounded-[3rem] p-8 sm:p-12 text-center space-y-6 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-0 left-1/4 w-64 h-64 bg-emerald-500 rounded-full blur-[100px]" />
             <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-emerald-500 rounded-full blur-[100px]" />
          </div>
          
          <h2 className="text-3xl font-bold text-white relative z-10">Have a resource to share?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto relative z-10">
            If you've found a platform or tool that helped you and isn't listed here, let us know! We're always looking to expand our library.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <a
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20"
            >
              Suggest a Resource
            </a>
            <a
              href="/about"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all backdrop-blur-sm"
            >
              Learn More
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
