import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  currentView?: string;
  onNavigate?: (view: string) => void;
  isAuthenticated?: boolean;
  userEmail?: string;
  userName?: string;
  userCity?: string;
  onSignOut?: () => void;
  activeBookingCount?: number;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentView = 'events',
  onNavigate,
  isAuthenticated = false,
  userEmail = '',
  userName = '',
  userCity = '',
  onSignOut,
  activeBookingCount = 0,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 relative overflow-x-hidden">
      
      <Navbar
        currentView={currentView}
        onNavigate={onNavigate}
        isAuthenticated={isAuthenticated}
        userEmail={userEmail}
        userName={userName}
        userCity={userCity}
        onSignOut={onSignOut}
        activeBookingCount={activeBookingCount}
      />

      <main className="flex-1 w-full">
        {children}
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default Layout;
