import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  currentView?: string;
  onNavigate?: (view: string) => void;
  isAuthenticated?: boolean;
  userEmail?: string;
  onSignOut?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentView = 'home',
  onNavigate,
  isAuthenticated = false,
  userEmail = '',
  onSignOut,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 relative overflow-x-hidden">
      {/* Background ambient gradient glow circles */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[480px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-transparent blur-3xl rounded-full -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[40%] -right-40 w-[500px] h-[500px] bg-gradient-to-bl from-blue-600/10 to-transparent blur-3xl rounded-full -z-10"
      />

      {/* Main reusable Navigation Header */}
      <Navbar
        currentView={currentView}
        onNavigate={onNavigate}
        isAuthenticated={isAuthenticated}
        userEmail={userEmail}
        onSignOut={onSignOut}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {children}
      </main>

      {/* Main reusable Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
