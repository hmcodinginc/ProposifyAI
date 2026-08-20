import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-['Inter',sans-serif]">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/p/:token" element={<PublicProposalPage />} />

      {/* Protected App Routes */}
      <Route
        path="/"
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
