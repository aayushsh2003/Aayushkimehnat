import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { BookOpen, User, LogOut, Menu, X, LayoutDashboard, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ConfirmModal } from './ConfirmModal';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Navbar = () => {
  const { user, profile } = useAppStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Years', path: '/years' },
    { name: 'Resources', path: '/resources' },
    { name: 'Jobs', path: '/jobs' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <BookOpen size={24} />
            </div>
            <span className="font-sans font-bold text-xl tracking-tight text-gray-900">
              Aayush Ki <span className="text-emerald-600">Mehnat</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-emerald-600",
                  location.pathname === link.path ? "text-emerald-600" : "text-gray-600"
                )}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-black/5">
                {profile?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={cn(
                      "p-2 transition-colors",
                      location.pathname.startsWith('/admin') ? "text-emerald-600" : "text-gray-600 hover:text-emerald-600"
                    )}
                    title="Admin Panel"
                  >
                    <Settings size={20} />
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className={cn(
                    "p-2 transition-colors",
                    location.pathname === '/dashboard' ? "text-emerald-600" : "text-gray-600 hover:text-emerald-600"
                  )}
                  title="Dashboard"
                >
                  <LayoutDashboard size={20} />
                </Link>
                <Link
                  to="/profile"
                  className={cn(
                    "flex items-center gap-2 p-1 pr-3 rounded-full transition-all border",
                    location.pathname === '/profile' 
                      ? "bg-emerald-50 border-emerald-200 text-emerald-600" 
                      : "bg-white border-black/5 text-gray-600 hover:bg-gray-50"
                  )}
                  title="Profile"
                >
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 overflow-hidden">
                    {profile?.photoURL ? (
                      <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" />
                    ) : (
                      <User size={16} />
                    )}
                  </div>
                  <span className="text-sm font-bold truncate max-w-[100px]">
                    {profile?.displayName || 'Profile'}
                  </span>
                </Link>
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Logout"
                >
                  <LogOut size={18} />
                  <span className="text-sm font-medium hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gray-900 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-white border-b border-black/5 px-4 py-6 flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-lg font-medium",
                  location.pathname === link.path ? "text-emerald-600" : "text-gray-600"
                )}
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-black/5" />
            {user ? (
              <>
                {profile?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <Settings size={20} /> Admin Panel
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-gray-600"
                >
                  <LayoutDashboard size={20} /> Dashboard
                </Link>
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="flex items-center gap-2 text-red-600"
                >
                  <LogOut size={20} /> Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="bg-gray-900 text-white px-5 py-3 rounded-xl text-center font-medium"
              >
                Login
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Sign Out?"
        message="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
        type="danger"
      />
    </nav>
  );
};
