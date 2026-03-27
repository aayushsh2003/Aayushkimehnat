import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2, Minimize2, Download, ExternalLink, FileText } from 'lucide-react';

interface PDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ isOpen, onClose, url, title }) => {
  const [isFullScreen, setIsFullScreen] = React.useState(false);

  // Prevent scrolling when viewer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleDownload = () => {
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative bg-white shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
              isFullScreen 
                ? 'w-full h-full rounded-0' 
                : 'w-full max-w-6xl h-[90vh] rounded-[2.5rem]'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                  <FileText size={20} />
                </div>
                <h3 className="font-bold text-gray-900 truncate">{title}</h3>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                  title="Download / Open in New Tab"
                >
                  <Download size={20} />
                </button>
                <button
                  onClick={toggleFullScreen}
                  className="hidden md:flex p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                  title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </button>
                <div className="w-px h-6 bg-black/5 mx-2 hidden md:block" />
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  title="Close"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Viewer Content */}
            <div className="flex-1 bg-gray-100 relative">
              <iframe
                src={`${url}#toolbar=0`}
                className="w-full h-full border-none"
                title={title}
              />
              
              {/* Fallback info for mobile or if iframe fails */}
              <div className="absolute inset-0 flex flex-col items-center justify-center -z-10 text-center p-8 space-y-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-300 shadow-sm">
                  <FileText size={32} />
                </div>
                <p className="text-gray-500 max-w-xs">
                  If the document doesn't load, you can open it directly.
                </p>
                <button
                  onClick={handleDownload}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  Open Directly <ExternalLink size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
