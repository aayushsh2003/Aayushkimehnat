import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Clock, 
  Star, 
  ArrowRight, 
  ExternalLink,
  GraduationCap,
  Heart,
  Eye,
  User,
  Megaphone,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { PDFViewer } from '../components/PDFViewer';
import { ResourceCard } from '../components/ResourceCard';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, limit } from 'firebase/firestore';

export const Dashboard = () => {
  const { user, profile, resources, subjects, news, toggleFavorite } = useAppStore();
  const navigate = useNavigate();
  const [selectedResource, setSelectedResource] = React.useState<any>(null);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

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

  // Listen for user's conversation unread count
  React.useEffect(() => {
    if (!user) return;

    const conversationsPath = 'conversations';
    const q = query(
      collection(db, conversationsPath),
      where('userEmail', '==', user.email),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const convData = snapshot.docs[0].data();
        setUnreadCount(convData.unreadCountUser || 0);
      }
    }, (error) => {
      console.error("Error listening to user conversation:", error);
    });

    return () => unsubscribe();
  }, [user]);

  // Recently viewed simulation (could be stored in Firestore later)
  const recentResources = resources.slice(0, 4);
  const favoriteResources = resources.filter(r => profile?.favorites?.includes(r.id)).slice(0, 3);

  const handleOpenResource = (resource: any) => {
    const url = resource.link || resource.url || '';
    if (url.includes('drive.google.com') && url.endsWith('/preview')) {
      setSelectedResource(resource);
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-12 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight"
          >
            Welcome back, <span className="text-emerald-600">{profile?.displayName || user?.email?.split('@')[0]}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm md:text-base text-gray-500"
          >
            Continue your learning journey where you left off.
          </motion.p>
        </div>
        <button 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white rounded-2xl md:rounded-3xl border border-black/5 shadow-sm hover:shadow-md transition-all group w-full md:w-auto"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 text-emerald-600 rounded-xl md:rounded-2xl flex items-center justify-center font-bold overflow-hidden group-hover:scale-110 transition-transform shrink-0">
            {profile?.photoURL ? (
              <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" />
            ) : (
              <User size={20} className="md:w-6 md:h-6" />
            )}
          </div>
          <div className="text-left min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{profile?.displayName || user?.email}</p>
            <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">{profile?.role}</p>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Clock size={20} className="text-emerald-600" /> Recently Added
              </h3>
              <Link to="/years" className="text-sm font-bold text-emerald-600 hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentResources.map((resource, idx) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <ResourceCard
                    resource={resource}
                    isFavorite={profile?.favorites?.includes(resource.id)}
                    onToggleFavorite={() => toggleFavorite(resource.id)}
                    onOpen={() => handleOpenResource(resource)}
                    onShare={() => handleShare(resource)}
                    isCopied={copiedId === resource.id}
                  />
                </motion.div>
              ))}
            </div>
          </section>

          {favoriteResources.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Heart size={20} className="text-red-500 fill-red-500" /> My Favorites
                </h3>
                <Link to="/profile" className="text-sm font-bold text-emerald-600 hover:underline">Manage</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {favoriteResources.map((resource, idx) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <ResourceCard
                      resource={resource}
                      isFavorite={true}
                      onToggleFavorite={() => toggleFavorite(resource.id)}
                      onOpen={() => handleOpenResource(resource)}
                      onShare={() => handleShare(resource)}
                      isCopied={copiedId === resource.id}
                    />
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="p-8 bg-gray-900 rounded-[2.5rem] text-white space-y-6 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <GraduationCap size={24} />
              </div>
              <h4 className="text-xl font-bold">Explore More</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Check out other academic years to find more resources for your studies.
              </p>
              <Link
                to="/years"
                className="inline-flex items-center gap-2 text-emerald-400 font-bold text-sm hover:gap-3 transition-all"
              >
                Go to Years <ArrowRight size={16} />
              </Link>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <BookOpen size={120} />
            </div>
          </div>

          <div className="p-8 bg-white rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/5 space-y-6">
            <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare size={20} className="text-emerald-600" /> Support Chat
              {unreadCount > 0 && (
                <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                  {unreadCount} new
                </span>
              )}
            </h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Have a question or need help? Chat with our support team in real-time.
            </p>
            <Link
              to="/messages"
              className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm hover:gap-3 transition-all"
            >
              Open Messages <ArrowRight size={16} />
            </Link>
          </div>

          <div className="p-8 bg-white rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/5 space-y-6">
            <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Megaphone size={20} className="text-emerald-600" /> Announcements
            </h4>
            <div className="space-y-4">
              {news.length > 0 ? (
                news.slice(0, 3).map((item) => (
                  <div key={item.id} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        item.type === 'announcement' ? 'bg-orange-500' :
                        item.type === 'update' ? 'bg-blue-500' : 'bg-purple-500'
                      }`}></span>
                      <h5 className="text-sm font-bold text-gray-900 truncate">{item.title}</h5>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 pl-3.5 leading-relaxed">
                      {item.content}
                    </p>
                    <p className="text-[10px] text-gray-400 pl-3.5 flex items-center gap-1">
                      <Calendar size={10} /> {new Date(item.createdAt?.seconds * 1000).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No recent announcements.</p>
              )}
            </div>
          </div>

          <div className="p-8 bg-white rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/5 space-y-6">
            <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Star size={20} className="text-yellow-500" /> Quick Tips
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0"></div>
                Use the search bar in Subjects page to find topics quickly.
              </li>
              <li className="flex gap-3 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0"></div>
                Check the "Papers" tab for previous year questions.
              </li>
              <li className="flex gap-3 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0"></div>
                Lab manuals are available in the "Lab" tab of each subject.
              </li>
            </ul>
          </div>
        </div>
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
