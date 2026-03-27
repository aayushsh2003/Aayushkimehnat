import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'motion/react';
import { Megaphone, ChevronRight, X, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NewsTicker = () => {
  const { news, loading } = useAppStore();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (news.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [news.length]);

  if (loading.news || news.length === 0 || !isVisible) return null;

  const currentNews = news[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-emerald-600 text-white py-3 px-4 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="bg-white/20 p-1.5 rounded-lg shrink-0">
            <Megaphone size={16} />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentNews.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3 truncate"
            >
              <span className="px-2 py-0.5 bg-white/20 rounded text-[10px] font-bold uppercase tracking-wider shrink-0">
                {currentNews.type}
              </span>
              <p className="text-sm font-medium truncate">
                {currentNews.title}: {currentNews.content}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden md:flex items-center gap-1 text-[10px] font-mono opacity-80">
            <Calendar size={12} />
            {new Date(currentNews.createdAt?.seconds * 1000).toLocaleDateString()}
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      {/* Progress bar */}
      <motion.div
        key={currentIndex}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 5, ease: "linear" }}
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/30 origin-left"
      />
    </motion.div>
  );
};
