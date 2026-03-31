// import React from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { useAppStore } from '../store/useAppStore';
// import { motion, AnimatePresence } from 'motion/react';
// import { SEO } from '../components/SEO';
// import { 
//   FileText, 
//   Book, 
//   ClipboardList, 
//   FileQuestion, 
//   FlaskConical, 
//   ExternalLink,
//   ChevronLeft,
//   Search,
//   Filter,
//   Heart,
//   Eye,
//   Share2,
//   Check,
//   MoreHorizontal
// } from 'lucide-react';
// import { PDFViewer } from '../components/PDFViewer';
// import { ResourceCard } from '../components/ResourceCard';
// import { clsx, type ClassValue } from 'clsx';
// import { twMerge } from 'tailwind-merge';

// function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

// export const SubjectDetail = () => {
//   const { yearName, subjectName } = useParams();
//   const navigate = useNavigate();
//   const { subjects, years, resources, loading, profile, toggleFavorite } = useAppStore();
//   const [activeTab, setActiveTab] = React.useState<'all' | 'notes' | 'books' | 'assignment' | 'paper' | 'lab'>('all');
//   const [searchTerm, setSearchTerm] = React.useState('');
//   const [selectedResource, setSelectedResource] = React.useState<any>(null);
//   const [copiedId, setCopiedId] = React.useState<string | null>(null);
//   const [subjectCopied, setSubjectCopied] = React.useState(false);

//   const handleSubjectShare = async () => {
//     const shareData = {
//       title: subject?.name || 'Subject Resources',
//       text: `Check out these ${subject?.name} resources on Aayush Ki Mehnat`,
//       url: window.location.href,
//     };

//     if (navigator.share) {
//       try {
//         await navigator.share(shareData);
//       } catch (err) {
//         console.error('Error sharing:', err);
//       }
//     } else {
//       try {
//         await navigator.clipboard.writeText(shareData.url);
//         setSubjectCopied(true);
//         setTimeout(() => setSubjectCopied(false), 2000);
//       } catch (err) {
//         console.error('Error copying to clipboard:', err);
//       }
//     }
//   };

//   const handleShare = async (resource: any) => {
//     const shareData = {
//       title: resource.title,
//       text: `Check out this resource: ${resource.title} on Aayush Ki Mehnat`,
//       url: resource.link || resource.url || window.location.href,
//     };

//     if (navigator.share) {
//       try {
//         await navigator.share(shareData);
//       } catch (err) {
//         console.error('Error sharing:', err);
//       }
//     } else {
//       try {
//         await navigator.clipboard.writeText(shareData.url);
//         setCopiedId(resource.id);
//         setTimeout(() => setCopiedId(null), 2000);
//       } catch (err) {
//         console.error('Error copying to clipboard:', err);
//       }
//     }
//   };

//   const decodedYearName = decodeURIComponent(yearName || '');
//   const decodedSubjectName = decodeURIComponent(subjectName || '');
  
//   const year = years.find(y => y.name === decodedYearName);
//   const subject = subjects.find(s => s.name === decodedSubjectName && s.yearId === year?.id);
//   const subjectResources = resources.filter(r => r.subjectId === subject?.id);

//   if (!subject && !loading.subjects) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center space-y-4">
//           <p className="text-gray-500">Subject not found.</p>
//           <button 
//             onClick={() => navigate('/years')}
//             className="text-emerald-600 font-bold hover:underline"
//           >
//             Go back to Years
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const seoTitle = subject ? `RTU ${subject.name} (${subject.code}) Notes, Books & Papers - Aayush Ki Mehnat` : 'Subject Detail - Aayush Ki Mehnat';
//   const seoDescription = subject ? `Get free RTU ${subject.name} (${subject.code}) handwritten notes, textbooks, and previous year question papers. The most reliable study material for ${subject.name} at Rajasthan Technical University.` : 'Download RTU subject notes and resources.';
//   const seoKeywords = subject ? `RTU ${subject.name} notes, ${subject.code} RTU notes, RTU ${subject.name} previous year papers, RTU ${subject.name} textbooks, Aayush Ki Mehnat RTU notes, ${subject.name} B.Tech notes, ${subject.name} engineering resources, ${subject.name} RTU syllabus` : 'RTU notes, RTU resources, Aayush Ki Mehnat';

//   const typeOrder: Record<string, number> = {
//     'notes': 1,
//     'books': 2,
//     'assignment': 3,
//     'paper': 4,
//     'lab': 5,
//     'other': 6
//   };

//   const filteredResources = subjectResources.filter(r => {
//     const matchesTab = activeTab === 'all' || r.type === activeTab;
//     const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesTab && matchesSearch;
//   }).sort((a, b) => {
//     if (activeTab === 'all') {
//       return (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99);
//     }
//     return 0;
//   });

//   const handleOpenResource = (resource: any) => {
//     const url = resource.link || resource.url || '';
//     if (url.includes('drive.google.com') && url.endsWith('/preview')) {
//       setSelectedResource(resource);
//     } else {
//       window.open(url, '_blank');
//     }
//   };

//   const isFavorite = (resourceId: string) => {
//     return profile?.favorites?.includes(resourceId);
//   };

//   const tabs = [
//     { id: 'all', name: 'All', icon: Filter },
//     { id: 'notes', name: 'Notes', icon: FileText },
//     { id: 'books', name: 'Books', icon: Book },
//     { id: 'assignment', name: 'Assignments', icon: ClipboardList },
//     { id: 'paper', name: 'Papers', icon: FileQuestion },
//     { id: 'lab', name: 'Lab', icon: FlaskConical },
//     { id: 'other', name: 'Other', icon: MoreHorizontal },
//   ] as const;

//   if (loading.resources || loading.subjects) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-12 py-8">
//       <SEO 
//         title={seoTitle} 
//         description={seoDescription} 
//         keywords={seoKeywords}
//       />
//       <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
//         <div className="space-y-4">
//           <Link 
//             to={`/years/${encodeURIComponent(year?.name || '')}/subjects`} 
//             className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm hover:gap-3 transition-all"
//           >
//             <ChevronLeft size={16} /> Back to Subjects
//           </Link>
//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight flex flex-wrap items-center gap-3 md:gap-4"
//           >
//             {subject?.name || 'Subject'}
//             {subject?.code && (
//               <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs md:text-sm font-mono uppercase tracking-widest border border-black/5">
//                 {subject.code}
//               </span>
//             )}
//             <span className="text-emerald-600">Resources</span>
//           </motion.h1>
//         </div>

//         <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full lg:w-auto">
//           <button
//             onClick={handleSubjectShare}
//             className={cn(
//               "w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm transition-all border",
//               subjectCopied 
//                 ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
//                 : "bg-white text-gray-600 hover:bg-gray-50 border-black/5"
//             )}
//           >
//             {subjectCopied ? <Check size={18} /> : <Share2 size={18} />}
//             {subjectCopied ? 'Link Copied' : 'Share Subject'}
//           </button>
//           <div className="relative w-full lg:w-80">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//             <input
//               type="text"
//               placeholder="Search resources..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-12 pr-6 py-4 bg-white border border-black/5 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none shadow-sm"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="hidden md:flex overflow-x-auto gap-2 pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
//         {tabs.map((tab) => {
//           const Icon = tab.icon;
//           const isActive = activeTab === tab.id;
//           return (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={cn(
//                 "flex items-center gap-2 px-5 md:px-6 py-3 rounded-xl font-bold text-xs md:text-sm transition-all whitespace-nowrap",
//                 isActive 
//                   ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
//                   : "bg-white text-gray-600 hover:bg-gray-50 border border-black/5"
//               )}
//             >
//               <Icon size={16} className="md:w-[18px] md:h-[18px]" />
//               {tab.name}
//             </button>
//           );
//         })}
//       </div>

//       {/* Resources List */}
//       <div className="space-y-12">
//         {activeTab === 'all' ? (
//           Object.entries(typeOrder)
//             .sort(([, a], [, b]) => a - b)
//             .map(([type, _]) => {
//               const typeResources = filteredResources.filter(r => r.type === type);
//               if (typeResources.length === 0) return null;
              
//               const tabInfo = tabs.find(t => t.id === type);
//               const Icon = tabInfo?.icon || FileText;

//               return (
//                 <div key={type} className="space-y-6">
//                   <div className="flex items-center gap-3 border-b border-black/5 pb-4">
//                     <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
//                       <Icon size={20} />
//                     </div>
//                     <h2 className="text-xl font-bold text-gray-900 capitalize">
//                       {tabInfo?.name || type}
//                     </h2>
//                     <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md text-[10px] font-mono">
//                       {typeResources.length}
//                     </span>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
//                     <AnimatePresence mode="popLayout">
//                       {typeResources.map((resource, idx) => (
//                         <motion.div
//                           key={resource.id}
//                           layout
//                           initial={{ opacity: 0, y: 20 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           exit={{ opacity: 0, scale: 0.95 }}
//                           transition={{ delay: idx * 0.05 }}
//                         >
//                           <ResourceCard
//                             resource={resource}
//                             isFavorite={isFavorite(resource.id)}
//                             onToggleFavorite={() => toggleFavorite(resource.id)}
//                             onOpen={() => handleOpenResource(resource)}
//                             onShare={() => handleShare(resource)}
//                             isCopied={copiedId === resource.id}
//                           />
//                         </motion.div>
//                       ))}
//                     </AnimatePresence>
//                   </div>
//                 </div>
//               );
//             })
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
//             <AnimatePresence mode="popLayout">
//               {filteredResources.length > 0 ? (
//                 filteredResources.map((resource, idx) => (
//                   <motion.div
//                     key={resource.id}
//                     layout
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, scale: 0.95 }}
//                     transition={{ delay: idx * 0.05 }}
//                   >
//                     <ResourceCard
//                       resource={resource}
//                       isFavorite={isFavorite(resource.id)}
//                       onToggleFavorite={() => toggleFavorite(resource.id)}
//                       onOpen={() => handleOpenResource(resource)}
//                       onShare={() => handleShare(resource)}
//                       isCopied={copiedId === resource.id}
//                     />
//                   </motion.div>
//                 ))
//               ) : (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="col-span-full text-center py-24 bg-white rounded-[2.5rem] border border-black/5"
//                 >
//                   <div className="max-w-md mx-auto space-y-4">
//                     <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
//                       <Search size={32} className="text-gray-300" />
//                     </div>
//                     <h3 className="text-xl font-bold text-gray-900">No resources found</h3>
//                     <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         )}

//         {activeTab === 'all' && filteredResources.length === 0 && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="col-span-full text-center py-24 bg-white rounded-[2.5rem] border border-black/5"
//           >
//             <div className="max-w-md mx-auto space-y-4">
//               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
//                 <Search size={32} className="text-gray-300" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-900">No resources found</h3>
//               <p className="text-gray-500">Try adjusting your search to find what you're looking for.</p>
//             </div>
//           </motion.div>
//         )}
//       </div>

//       <PDFViewer
//         isOpen={!!selectedResource}
//         onClose={() => setSelectedResource(null)}
//         url={selectedResource?.link || selectedResource?.url || ''}
//         title={selectedResource?.title || ''}
//       />
//     </div>
//   );
// };
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'motion/react';
import { SEO } from '../components/SEO';
import { 
  FileText, 
  Book, 
  ClipboardList, 
  FileQuestion, 
  FlaskConical, 
  ExternalLink,
  ChevronLeft,
  Search,
  Filter,
  Heart,
  Eye,
  Share2,
  Check,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  BookOpen
} from 'lucide-react';
import { PDFViewer } from '../components/PDFViewer';
import { ResourceCard } from '../components/ResourceCard';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SyllabusSection = ({ syllabus }: { syllabus: any[] }) => {
  const [expandedUnits, setExpandedUnits] = React.useState<number[]>([]);

  const toggleUnit = (index: number) => {
    setExpandedUnits(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  if (!syllabus || syllabus.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-black/5 pb-4">
        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
          <BookOpen size={20} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Subject Syllabus</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {syllabus.map((unit, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm"
          >
            <button
              onClick={() => toggleUnit(idx)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                  {unit.unit}
                </span>
                <h3 className="font-bold text-gray-900">{unit.title}</h3>
              </div>
              {expandedUnits.includes(idx) ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
            </button>
            
            <AnimatePresence>
              {expandedUnits.includes(idx) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="px-5 pb-5 pt-0 border-t border-black/5">
                    <ul className="mt-4 space-y-2">
                      {unit.topics.map((topic: string, tIdx: number) => (
                        <li key={tIdx} className="flex items-start gap-3 text-gray-600 text-sm">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const SubjectDetail = () => {
  const { yearName, subjectName } = useParams();
  const navigate = useNavigate();
  const { subjects, years, resources, loading, profile, toggleFavorite } = useAppStore();
  const [activeTab, setActiveTab] = React.useState<'all' | 'notes' | 'books' | 'assignment' | 'paper' | 'lab'>('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedResource, setSelectedResource] = React.useState<any>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [subjectCopied, setSubjectCopied] = React.useState(false);

  const handleSubjectShare = async () => {
    const shareData = {
      title: subject?.name || 'Subject Resources',
      text: `Check out these ${subject?.name} resources on Aayush Ki Mehnat`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        setSubjectCopied(true);
        setTimeout(() => setSubjectCopied(false), 2000);
      } catch (err) {
        console.error('Error copying to clipboard:', err);
      }
    }
  };

  const handleShare = async (resource: any) => {
    const shareData = {
      title: resource.title,
      text: `Check out this resource: ${resource.title} on Aayush Ki Mehnat`,
      url: resource.link || resource.url || window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        setCopiedId(resource.id);
        setTimeout(() => setCopiedId(null), 2000);
      } catch (err) {
        console.error('Error copying to clipboard:', err);
      }
    }
  };

  const decodedYearName = decodeURIComponent(yearName || '');
  const decodedSubjectName = decodeURIComponent(subjectName || '');
  
  const year = years.find(y => y.name === decodedYearName);
  const subject = subjects.find(s => s.name === decodedSubjectName && s.yearId === year?.id);
  const subjectResources = resources.filter(r => r.subjectId === subject?.id);

  if (!subject && !loading.subjects) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-500">Subject not found.</p>
          <button 
            onClick={() => navigate('/years')}
            className="text-emerald-600 font-bold hover:underline"
          >
            Go back to Years
          </button>
        </div>
      </div>
    );
  }

  const seoTitle = subject ? `RTU ${subject.name} (${subject.code}) Notes, Books & Papers - Aayush Ki Mehnat` : 'Subject Detail - Aayush Ki Mehnat';
  const seoDescription = subject ? `Get free RTU ${subject.name} (${subject.code}) handwritten notes, textbooks, and previous year question papers. The most reliable study material for ${subject.name} at Rajasthan Technical University.` : 'Download RTU subject notes and resources.';
  const seoKeywords = subject ? `RTU ${subject.name} notes, ${subject.code} RTU notes, RTU ${subject.name} previous year papers, RTU ${subject.name} textbooks, Aayush Ki Mehnat RTU notes, ${subject.name} B.Tech notes, ${subject.name} engineering resources, ${subject.name} RTU syllabus` : 'RTU notes, RTU resources, Aayush Ki Mehnat';

  const typeOrder: Record<string, number> = {
    'notes': 1,
    'books': 2,
    'assignment': 3,
    'paper': 4,
    'lab': 5,
    'other': 6
  };

  const filteredResources = subjectResources.filter(r => {
    const matchesTab = activeTab === 'all' || r.type === activeTab;
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  }).sort((a, b) => {
    if (activeTab === 'all') {
      return (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99);
    }
    return 0;
  });

  const handleOpenResource = (resource: any) => {
    const url = resource.link || resource.url || '';
    if (url.includes('drive.google.com') && url.endsWith('/preview')) {
      setSelectedResource(resource);
    } else {
      window.open(url, '_blank');
    }
  };

  const isFavorite = (resourceId: string) => {
    return profile?.favorites?.includes(resourceId);
  };

  const tabs = [
    { id: 'all', name: 'All', icon: Filter },
    { id: 'notes', name: 'Notes', icon: FileText },
    { id: 'books', name: 'Books', icon: Book },
    { id: 'assignment', name: 'Assignments', icon: ClipboardList },
    { id: 'paper', name: 'Papers', icon: FileQuestion },
    { id: 'lab', name: 'Lab', icon: FlaskConical },
    { id: 'other', name: 'Other', icon: MoreHorizontal },
  ] as const;

  if (loading.resources || loading.subjects) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-8">
      <SEO 
        title={seoTitle} 
        description={seoDescription} 
        keywords={seoKeywords}
      />
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-4">
          <Link 
            to={`/years/${encodeURIComponent(year?.name || '')}/subjects`} 
            className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm hover:gap-3 transition-all"
          >
            <ChevronLeft size={16} /> Back to Subjects
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight flex flex-wrap items-center gap-3 md:gap-4"
          >
            {subject?.name || 'Subject'}
            {subject?.code && (
              <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs md:text-sm font-mono uppercase tracking-widest border border-black/5">
                {subject.code}
              </span>
            )}
            <span className="text-emerald-600">Resources</span>
          </motion.h1>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full lg:w-auto">
          <button
            onClick={handleSubjectShare}
            className={cn(
              "w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm transition-all border",
              subjectCopied 
                ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                : "bg-white text-gray-600 hover:bg-gray-50 border-black/5"
            )}
          >
            {subjectCopied ? <Check size={18} /> : <Share2 size={18} />}
            {subjectCopied ? 'Link Copied' : 'Share Subject'}
          </button>
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white border border-black/5 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Syllabus Section */}
      <SyllabusSection syllabus={subject?.syllabus} />

      {/* Tabs */}
      <div className="hidden md:flex overflow-x-auto gap-2 pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-5 md:px-6 py-3 rounded-xl font-bold text-xs md:text-sm transition-all whitespace-nowrap",
                isActive 
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-black/5"
              )}
            >
              <Icon size={16} className="md:w-[18px] md:h-[18px]" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Resources List */}
      <div className="space-y-12">
        {activeTab === 'all' ? (
          Object.entries(typeOrder)
            .sort(([, a], [, b]) => a - b)
            .map(([type, _]) => {
              const typeResources = filteredResources.filter(r => r.type === type);
              if (typeResources.length === 0) return null;
              
              const tabInfo = tabs.find(t => t.id === type);
              const Icon = tabInfo?.icon || FileText;

              return (
                <div key={type} className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-black/5 pb-4">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                      <Icon size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 capitalize">
                      {tabInfo?.name || type}
                    </h2>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md text-[10px] font-mono">
                      {typeResources.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    <AnimatePresence mode="popLayout">
                      {typeResources.map((resource, idx) => (
                        <motion.div
                          key={resource.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <ResourceCard
                            resource={resource}
                            isFavorite={isFavorite(resource.id)}
                            onToggleFavorite={() => toggleFavorite(resource.id)}
                            onOpen={() => handleOpenResource(resource)}
                            onShare={() => handleShare(resource)}
                            isCopied={copiedId === resource.id}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredResources.length > 0 ? (
                filteredResources.map((resource, idx) => (
                  <motion.div
                    key={resource.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <ResourceCard
                      resource={resource}
                      isFavorite={isFavorite(resource.id)}
                      onToggleFavorite={() => toggleFavorite(resource.id)}
                      onOpen={() => handleOpenResource(resource)}
                      onShare={() => handleShare(resource)}
                      isCopied={copiedId === resource.id}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-24 bg-white rounded-[2.5rem] border border-black/5"
                >
                  <div className="max-w-md mx-auto space-y-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                      <Search size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">No resources found</h3>
                    <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {activeTab === 'all' && filteredResources.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-24 bg-white rounded-[2.5rem] border border-black/5"
          >
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                <Search size={32} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">No resources found</h3>
              <p className="text-gray-500">Try adjusting your search to find what you're looking for.</p>
            </div>
          </motion.div>
        )}
      </div>

      <PDFViewer
        isOpen={!!selectedResource}
        onClose={() => setSelectedResource(null)}
        url={selectedResource?.link || selectedResource?.url || ''}
        title={selectedResource?.title || ''}
      />
    </div>
  );
};
