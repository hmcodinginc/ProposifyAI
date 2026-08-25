import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ClientsPage } from './pages/clients/ClientsPage';
import { ProposalsListPage } from './pages/proposals/ProposalsListPage';
import { ProposalCreateWizard } from './pages/proposals/ProposalCreateWizard';
import { ProposalEditorPage } from './pages/proposals/ProposalEditorPage';
import { PublicProposalPage } from './pages/public/PublicProposalPage';

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-[#4a382a] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#2c221e] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#4a382a] selection:text-white">
      <Navbar />
      <div className="flex flex-1 w-full relative">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Landing & Auth Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/p/:token" element={<PublicProposalPage />} />

      {/* Protected App Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedLayout>
            <DashboardPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/clients"
        element={
          <ProtectedLayout>
            <ClientsPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/proposals"
        element={
          <ProtectedLayout>
            <ProposalsListPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/proposals/new"
        element={
          <ProtectedLayout>
            <ProposalCreateWizard />
          </ProtectedLayout>
        }
      />
      <Route
        path="/proposals/:id"
        element={
          <ProtectedLayout>
            <ProposalEditorPage />
          </ProtectedLayout>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
