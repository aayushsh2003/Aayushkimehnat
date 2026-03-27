import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { NewsTicker } from './NewsTicker';
import { BackToTop } from './BackToTop';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/utils';

export const Layout = () => {
  const { profile } = useAppStore();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isDashboardPath = location.pathname.startsWith('/dashboard');
  const isProfilePath = location.pathname.startsWith('/profile');
  const showSidebar = isAdminPath || isDashboardPath || isProfilePath;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="pt-16">
        <NewsTicker />
      </div>
      <div className="flex flex-1">
        {showSidebar && <Sidebar isAdmin={isAdminPath} />}
        <main className={cn(
          "flex-1 p-4 md:p-6 transition-all duration-300",
          showSidebar ? "lg:ml-64" : ""
        )}>
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <BackToTop />
      <Footer />
    </div>
  );
};
