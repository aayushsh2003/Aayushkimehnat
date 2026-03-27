import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  BookOpen, 
  FileText, 
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  Database,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Megaphone,
  MessageSquare,
  RefreshCw,
  User,
  Globe,
  Plus
} from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { seedDatabase } from '../utils/seedData';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { years, subjects, resources, user, refreshData } = useAppStore();
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [isSeeding, setIsSeeding] = React.useState(false);
  const [seedStatus, setSeedStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  const [conversations, setConversations] = React.useState<any[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = React.useState(true);
  const [lastUnreadCount, setLastUnreadCount] = React.useState(0);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('Notifications Enabled', {
          body: 'You will now receive notifications for new messages.',
          icon: 'Aayush_Photo.jpg'
        });
      }
    }
  };

  React.useEffect(() => {
    const fetchUsers = async () => {
      const path = 'users';
      try {
        const snapshot = await getDocs(collection(db, path));
        setTotalUsers(snapshot.size);
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, path);
      }
    };
    fetchUsers();

    // Real-time conversations for notifications
    const conversationsPath = 'conversations';
    const qConv = query(collection(db, conversationsPath), orderBy('lastUpdatedAt', 'desc'), limit(50));
    const unsubscribeConv = onSnapshot(qConv, (snapshot) => {
      const convs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      
      const totalUnread = convs.reduce((acc, c) => acc + (c.unreadCountAdmin || 0), 0);
      setConversations(convs);
      
      // Notify on new unread message in any conversation
      if (totalUnread > lastUnreadCount && !isLoadingMessages) {
        const latestConv = convs.find(c => (c.unreadCountAdmin || 0) > 0);
        if (latestConv) {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('New Chat Message', {
              body: `${latestConv.userName || latestConv.userEmail?.split('@')[0] || 'User'}: ${latestConv.lastMessage}`,
              icon: 'Aayush_Photo.jpg'
            });
          }
        }
      }
      
      setLastUnreadCount(totalUnread);
      setIsLoadingMessages(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, conversationsPath);
    });

    return () => {
      unsubscribeConv();
    };
  }, [lastUnreadCount, isLoadingMessages]);

  const handleSeed = async () => {
    if (!window.confirm('This will populate your database with initial years, subjects, and resources. Continue?')) return;
    
    setIsSeeding(true);
    setSeedStatus('idle');
    
    try {
      const result = await seedDatabase();
      if (result.success) {
        setSeedStatus('success');
        if (user) {
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            role: 'admin',
            displayName: user.displayName || 'Admin'
          }, { merge: true });
        }
      } else {
        setSeedStatus('error');
      }
    } catch (error) {
      console.error('Seed error:', error);
      setSeedStatus('error');
    } finally {
      setIsSeeding(false);
      setTimeout(() => setSeedStatus('idle'), 5000);
    }
  };

  const stats = [
    { name: 'Total Users', value: totalUsers, icon: Users, color: 'bg-blue-500', trend: '+12%' },
    { name: 'Total Years', value: years.length, icon: Calendar, color: 'bg-emerald-500', trend: '+0%' },
    { name: 'Total Subjects', value: subjects.length, icon: BookOpen, color: 'bg-purple-500', trend: '+5%' },
    { name: 'Total Resources', value: resources.length, icon: FileText, color: 'bg-orange-500', trend: '+18%' },
  ];

  return (
    <div className="space-y-12 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 tracking-tight"
          >
            Admin <span className="text-emerald-600">Dashboard</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500"
          >
            Overview of your platform's performance and data.
          </motion.p>
        </div>

        <div className="flex flex-wrap gap-4">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => refreshData()}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold bg-white border border-black/5 text-gray-700 shadow-lg hover:bg-gray-50 transition-all"
          >
            <RefreshCw size={20} />
            Refresh Data
          </motion.button>

          {years.length === 0 && subjects.length === 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSeed}
              disabled={isSeeding}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white shadow-lg transition-all ${
                seedStatus === 'success' ? 'bg-emerald-600' : 
                seedStatus === 'error' ? 'bg-red-600' : 
                'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isSeeding ? (
                <Loader2 className="animate-spin" size={20} />
              ) : seedStatus === 'success' ? (
                <CheckCircle2 size={20} />
              ) : seedStatus === 'error' ? (
                <AlertCircle size={20} />
              ) : (
                <Database size={20} />
              )}
              {isSeeding ? 'Seeding...' : seedStatus === 'success' ? 'Database Seeded!' : seedStatus === 'error' ? 'Error Seeding' : 'Seed Initial Data'}
            </motion.button>
          )}
        </div>
      </div>

      {/* Debug Info */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 p-8 bg-gray-50 rounded-[2.5rem] border border-black/5"
      >
        <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-widest">
          <Settings className="w-4 h-4 text-emerald-600" />
          System Debug Info
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-mono">
          <div className="p-4 bg-white rounded-2xl border border-black/5">
            <div className="text-gray-400 mb-1 uppercase">Project ID</div>
            <div className="text-emerald-600 font-bold break-all">{db.app.options.projectId}</div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-black/5">
            <div className="text-gray-400 mb-1 uppercase">Database ID</div>
            <div className="text-emerald-600 font-bold">{(db as any)._databaseId?.database || '(default)'}</div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-black/5">
            <div className="text-gray-400 mb-1 uppercase">Years in Store</div>
            <div className="text-emerald-600 font-bold">{years.length}</div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-black/5">
            <div className="text-gray-400 mb-1 uppercase">Subjects in Store</div>
            <div className="text-emerald-600 font-bold">{subjects.length}</div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="p-8 bg-white rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon size={28} />
                </div>
                <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded-lg">
                  {stat.trend} <ArrowUpRight size={14} />
                </div>
              </div>
              <p className="text-sm font-mono uppercase tracking-widest text-gray-400 mb-1">{stat.name}</p>
              <h3 className="text-4xl font-bold text-gray-900">{stat.value}</h3>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Activity */}
          <div className="p-8 bg-white rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp size={24} className="text-emerald-600" /> Recent Activity
              </h3>
              <button className="text-sm font-bold text-emerald-600 hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {resources.length > 0 ? (
                resources.slice(0, 4).map((resource, idx) => (
                  <div key={idx} className="flex items-center justify-between p-5 bg-gray-50 rounded-3xl border border-black/5 hover:border-emerald-500/20 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                        <FileText size={22} />
                      </div>
                      <div>
                        <p className="text-base font-bold text-gray-900">{resource.title}</p>
                        <p className="text-xs text-gray-500">
                          Added to <span className="font-bold text-gray-700">{subjects.find(s => s.id === resource.subjectId)?.name || 'Unknown'}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                        {resource.type}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center text-gray-400">
                  <FileText size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No recent activity found.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Conversations Section */}
          <div className="p-8 bg-white rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare size={24} className="text-emerald-600" /> Recent Conversations
                {lastUnreadCount > 0 && (
                  <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">{lastUnreadCount} new</span>
                )}
              </h3>
              <button 
                onClick={() => navigate('/admin/chat')}
                className="text-emerald-600 font-bold hover:underline flex items-center gap-2"
              >
                View All <ArrowUpRight size={18} />
              </button>
            </div>
            
            <div className="space-y-4">
              {isLoadingMessages ? (
                <div className="py-20 flex justify-center">
                  <Loader2 className="animate-spin text-emerald-600" size={32} />
                </div>
              ) : conversations.length > 0 ? (
                conversations.slice(0, 5).map((conv) => (
                  <div 
                    key={conv.id} 
                    className={`flex items-center justify-between p-5 rounded-3xl border transition-all group cursor-pointer ${
                      (conv.unreadCountAdmin || 0) === 0 ? 'bg-gray-50 border-black/5' : 'bg-emerald-50/30 border-emerald-100'
                    }`}
                    onClick={() => navigate('/admin/chat')}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${
                        (conv.unreadCountAdmin || 0) === 0 ? 'bg-white text-gray-400' : 'bg-white text-emerald-600'
                      }`}>
                        <User size={22} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className={`text-base font-bold ${(conv.unreadCountAdmin || 0) === 0 ? 'text-gray-600' : 'text-gray-900'}`}>
                            {conv.userName || conv.userEmail?.split('@')[0] || 'User'}
                          </p>
                          {(conv.unreadCountAdmin || 0) > 0 && <span className="w-2 h-2 bg-emerald-600 rounded-full" />}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-1">{conv.lastMessage}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <span className="text-[10px] font-mono text-gray-400 block">
                          {conv.lastUpdatedAt?.seconds ? new Date(conv.lastUpdatedAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                        </span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/admin/chat');
                        }}
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ArrowUpRight size={18} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center text-gray-400">
                  <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No conversations yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 bg-gray-900 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl shadow-emerald-900/20">
            <div className="relative z-10 space-y-8">
              <div>
                <h3 className="text-3xl font-bold mb-2">Quick Actions</h3>
                <p className="text-gray-400 text-sm">Direct shortcuts to manage your content.</p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => navigate('/admin/years')}
                  className="group p-6 bg-white/5 rounded-3xl hover:bg-emerald-600 transition-all flex items-center gap-4 border border-white/5 hover:border-emerald-400/50"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Calendar size={24} />
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold">Manage Years</p>
                    <p className="text-xs text-gray-400 group-hover:text-emerald-100">Add or remove academic years</p>
                  </div>
                </button>

                <button 
                  onClick={() => navigate('/admin/subjects')}
                  className="group p-6 bg-white/5 rounded-3xl hover:bg-blue-600 transition-all flex items-center gap-4 border border-white/5 hover:border-blue-400/50"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <BookOpen size={24} />
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold">Manage Subjects</p>
                    <p className="text-xs text-gray-400 group-hover:text-blue-100">Link subjects to specific years</p>
                  </div>
                </button>

                <button 
                  onClick={() => navigate('/admin/resources')}
                  className="group p-6 bg-white/5 rounded-3xl hover:bg-orange-600 transition-all flex items-center gap-4 border border-white/5 hover:border-orange-400/50"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <FileText size={24} />
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold">Manage Resources</p>
                    <p className="text-xs text-gray-400 group-hover:text-orange-100">Upload notes, books, and papers</p>
                  </div>
                </button>

                <button 
                  onClick={() => navigate('/admin/users')}
                  className="group p-6 bg-white/5 rounded-3xl hover:bg-purple-600 transition-all flex items-center gap-4 border border-white/5 hover:border-purple-400/50"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Users size={24} />
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold">Manage Users</p>
                    <p className="text-xs text-gray-400 group-hover:text-purple-100">Control roles and permissions</p>
                  </div>
                </button>

                <button 
                  onClick={() => navigate('/admin/news')}
                  className="group p-6 bg-white/5 rounded-3xl hover:bg-emerald-600 transition-all flex items-center gap-4 border border-white/5 hover:border-emerald-400/50"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Megaphone size={24} />
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold">Manage News</p>
                    <p className="text-xs text-gray-400 group-hover:text-emerald-100">Post updates and announcements</p>
                  </div>
                </button>

                <button 
                  onClick={() => navigate('/admin/extra-resources')}
                  className="group p-6 bg-white/5 rounded-3xl hover:bg-emerald-600 transition-all flex items-center gap-4 border border-white/5 hover:border-emerald-400/50"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Globe size={24} />
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold">Global Resources</p>
                    <p className="text-xs text-gray-400 group-hover:text-emerald-100">Manage external links and tools</p>
                  </div>
                </button>

                <button 
                  onClick={() => navigate('/admin/chat')}
                  className="group p-6 bg-white/5 rounded-3xl hover:bg-emerald-600 transition-all flex items-center gap-4 border border-white/5 hover:border-emerald-400/50"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <MessageSquare size={24} />
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold">Manage Chat</p>
                    <p className="text-xs text-gray-400 group-hover:text-emerald-100">Reply to user queries in real-time</p>
                  </div>
                </button>
              </div>
            </div>
            <div className="absolute -bottom-12 -right-12 p-8 opacity-5">
              <Settings size={240} />
            </div>
          </div>

          <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100">
            <h4 className="text-lg font-bold text-emerald-900 mb-2">Platform Tip</h4>
            <p className="text-emerald-700 text-sm leading-relaxed">
              Keep your resources organized by ensuring every subject is linked to the correct academic year. This helps students find what they need faster.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
