import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore, initAuth, initDataListeners } from './store/useAppStore';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Resources } from './pages/Resources';
import { Login } from './pages/Login';
import { Years } from './pages/Years';
import { Subjects } from './pages/Subjects';
import { SubjectDetail } from './pages/SubjectDetail';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminYears } from './pages/AdminYears';
import { AdminSubjects } from './pages/AdminSubjects';
import { AdminSubjectResources } from './pages/AdminSubjectResources';
import { AdminResources } from './pages/AdminResources';
import { AdminUsers } from './pages/AdminUsers';
import { AdminNews } from './pages/AdminNews';
import { AdminJobs } from './pages/AdminJobs';
import { AdminExtraResources } from './pages/AdminExtraResources';
import { Jobs } from './pages/Jobs';
import { Profile } from './pages/Profile';
import { Messages } from './pages/Messages';

// Protected Route Component
const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: 'admin' | 'user' }) => {
  const { user, profile, isAuthReady } = useAppStore();

  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'admin' && profile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  React.useEffect(() => {
    initAuth();
    initDataListeners();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="resources" element={<Resources />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="login" element={<Login />} />
        <Route path="profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        {/* Student Routes */}
        <Route path="years" element={<Years />} />
        <Route path="years/:yearName/subjects" element={<Subjects />} />
        <Route path="subjects/:yearName/:subjectName" element={<SubjectDetail />} />
        
        {/* Dashboard Routes */}
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="admin" element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="admin/years" element={
          <ProtectedRoute role="admin">
            <AdminYears />
          </ProtectedRoute>
        } />
        <Route path="admin/subjects" element={
          <ProtectedRoute role="admin">
            <AdminSubjects />
          </ProtectedRoute>
        } />
        <Route path="admin/subjects/:subjectId/resources" element={
          <ProtectedRoute role="admin">
            <AdminSubjectResources />
          </ProtectedRoute>
        } />
        <Route path="admin/resources" element={
          <ProtectedRoute role="admin">
            <AdminResources />
          </ProtectedRoute>
        } />
        <Route path="admin/users" element={
          <ProtectedRoute role="admin">
            <AdminUsers />
          </ProtectedRoute>
        } />
        <Route path="admin/news" element={
          <ProtectedRoute role="admin">
            <AdminNews />
          </ProtectedRoute>
        } />
        <Route path="admin/jobs" element={
          <ProtectedRoute role="admin">
            <AdminJobs />
          </ProtectedRoute>
        } />
        <Route path="admin/extra-resources" element={
          <ProtectedRoute role="admin">
            <AdminExtraResources />
          </ProtectedRoute>
        } />
        <Route path="admin/chat" element={
          <ProtectedRoute role="admin">
            <Messages />
          </ProtectedRoute>
        } />
        <Route path="messages" element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
