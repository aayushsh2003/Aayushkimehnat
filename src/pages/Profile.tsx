import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Shield, 
  Heart, 
  FileText, 
  ExternalLink, 
  LogOut,
  ChevronRight,
  Eye,
  Edit2,
  Camera,
  Check,
  X as CloseIcon
} from 'lucide-react';
import { PDFViewer } from '../components/PDFViewer';
import { ResourceCard } from '../components/ResourceCard';
import { SEO } from '../components/SEO';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { ConfirmModal } from '../components/ConfirmModal';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Profile = () => {
  const { profile, user, resources, toggleFavorite, updateProfile } = useAppStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = React.useState(false);
  const [editData, setEditData] = React.useState({ displayName: '', photoURL: '' });
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [selectedResource, setSelectedResource] = React.useState<any>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (profile) {
      setEditData({
        displayName: profile.displayName || '',
        photoURL: profile.photoURL || ''
      });
    }
  }, [profile]);

  const favoriteResources = resources.filter(r => profile?.favorites?.includes(r.id));

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData(prev => ({ ...prev, photoURL: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenResource = (resource: any) => {
    const url = resource.link || resource.url || '';
    if (url.includes('drive.google.com') && url.endsWith('/preview')) {
      setSelectedResource(resource);
    } else {
      window.open(url, '_blank');
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

  if (!user || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-gray-500">Please login to view your profile.</p>
        <button 
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-12">
      <SEO 
        title="My Profile - Aayush Ki Mehnat" 
        description="Manage your Aayush Ki Mehnat profile, view your saved notes, and track your learning progress."
      />
      {/* Profile Header */}
      <div className="relative p-8 md:p-12 bg-white rounded-[3rem] border border-black/5 shadow-2xl shadow-black/5 overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <User size={200} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="w-32 h-32 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center text-emerald-600 shadow-inner overflow-hidden">
              {isEditing ? (
                editData.photoURL ? (
                  <img src={editData.photoURL} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User size={64} />
                )
              ) : profile.photoURL ? (
                <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" />
              ) : (
                <User size={64} />
              )}
            </div>
            {isEditing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 flex items-center justify-center text-white rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera size={24} />
              </button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>
          
          <div className="text-center md:text-left space-y-4 flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.displayName}
                    onChange={(e) => setEditData({ ...editData, displayName: e.target.value })}
                    className="text-3xl font-bold text-gray-900 bg-gray-50 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none w-full max-w-md"
                    placeholder="Your Display Name"
                  />
                ) : (
                  <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                    {profile.displayName || 'Student'}
                  </h1>
                )}
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-xs font-medium border border-black/5">
                    <Mail size={14} /> {profile.email}
                  </span>
                  <span className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                    profile.role === 'admin' ? "bg-purple-50 text-purple-600 border border-purple-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                  )}>
                    <Shield size={14} /> {profile.role}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center md:justify-end gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="p-3 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition-all"
                      title="Cancel"
                    >
                      <CloseIcon size={20} />
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : <><Check size={20} /> Save Changes</>}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg"
                  >
                    <Edit2 size={20} /> Edit Profile
                  </button>
                )}
              </div>
            </div>
            
            {!isEditing && (
              <button 
                onClick={() => setIsLogoutModalOpen(true)}
                className="flex items-center gap-2 text-red-600 font-bold text-sm hover:gap-3 transition-all"
              >
                Sign Out <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Favorites Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Heart size={32} className="text-red-500 fill-red-500" /> My Favorites
          </h2>
          <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm">
            {favoriteResources.length} Saved
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {favoriteResources.length > 0 ? (
              favoriteResources.map((resource, idx) => (
                <motion.div
                  key={resource.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
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
              ))
            ) : (
              <div className="col-span-full text-center py-24 bg-white rounded-[3rem] border border-black/5 space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto">
                  <Heart size={40} />
                </div>
                <p className="text-gray-500 text-lg">You haven't saved any resources yet.</p>
                <button 
                  onClick={() => navigate('/years')}
                  className="text-emerald-600 font-bold hover:underline flex items-center gap-2 mx-auto"
                >
                  Explore Resources <ChevronRight size={16} />
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Sign Out?"
        message="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
        type="danger"
      />

      <PDFViewer
        isOpen={!!selectedResource}
        onClose={() => setSelectedResource(null)}
        url={selectedResource?.link || selectedResource?.url || ''}
        title={selectedResource?.title || ''}
      />
    </div>
  );
};
