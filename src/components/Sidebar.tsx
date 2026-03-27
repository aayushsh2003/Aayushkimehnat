import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  FileText, 
  Settings,
  ChevronRight,
  User,
  Users,
  Megaphone,
  MessageSquare,
  LogOut,
  Briefcase,
  Sparkles
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { ConfirmModal } from './ConfirmModal';

import { useAppStore } from '../store/useAppStore';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  isAdmin?: boolean;
}

export const Sidebar = ({ isAdmin = false }: SidebarProps) => {
  const { profile, unreadMessages } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const links = isAdmin ? [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage Years', path: '/admin/years', icon: Calendar },
    { name: 'Manage Subjects', path: '/admin/subjects', icon: BookOpen },
    { name: 'Manage Resources', path: '/admin/resources', icon: FileText },
    { name: 'Extra Resources', path: '/admin/extra-resources', icon: Sparkles },
    { name: 'Manage Users', path: '/admin/users', icon: Users },
    { name: 'Manage News', path: '/admin/news', icon: Megaphone },
    { name: 'Manage Jobs', path: '/admin/jobs', icon: Briefcase },
    { name: 'Chat Support', path: '/admin/chat', icon: MessageSquare },
  ] : [
    { name: 'My Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'All Years', path: '/years', icon: Calendar },
    { name: 'Global Resources', path: '/resources', icon: Sparkles },
    { name: 'Job Portal', path: '/jobs', icon: Briefcase },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'My Messages', path: '/messages', icon: MessageSquare },
  ];

  return (
    <aside className="w-64 bg-white border-r border-black/5 h-[calc(100vh-64px)] fixed top-16 left-0 hidden lg:block overflow-y-auto">
      <div className="p-6 flex flex-col gap-2">
        <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-4">
          {isAdmin ? 'Admin Console' : 'Student Portal'}
        </p>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center justify-between p-3 rounded-xl transition-all group",
                isActive 
                  ? "bg-emerald-50 text-emerald-600" 
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={cn(isActive ? "text-emerald-600" : "text-gray-400 group-hover:text-emerald-600")} />
                <span className="text-sm font-medium">{link.name}</span>
              </div>
              {link.name === (isAdmin ? 'Chat Support' : 'My Messages') && unreadMessages > 0 ? (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {unreadMessages > 99 ? '99+' : unreadMessages}
                </span>
              ) : (
                isActive && <ChevronRight size={14} />
              )}
            </Link>
          );
        })}

        <div className="mt-auto pt-4 border-t border-black/5">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition-all group"
          >
            <LogOut size={18} className="text-red-400 group-hover:text-red-600" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
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
    </aside>
  );
};
