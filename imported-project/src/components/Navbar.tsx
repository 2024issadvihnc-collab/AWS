import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import { API_BASE_URL } from '../api/client';

interface NavbarProps {
  currentView?: string;
  onNavigate?: (view: string) => void;
  isAuthenticated?: boolean;
  userEmail?: string;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView = 'home',
  onNavigate,
  isAuthenticated = false,
  userEmail = '',
  onSignOut,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'events', label: 'Events & Shows' },
    { id: 'bookings', label: 'My Bookings' },
    { id: 'organizer', label: 'Organizer Portal' },
    { id: 'admin', label: 'Admin Hub' },
  ];

  const handleNavClick = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
    }
    setMobileMenuOpen(false);
  };

  const handleSignOutClick = () => {
    if (onSignOut) {
      onSignOut();
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleNavClick(isAuthenticated ? 'home' : 'signin')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                {/* Ticket Icon SVG */}
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                  <path d="M13 5v2" />
                  <path d="M13 17v2" />
                  <path d="M13 11v2" />
                </svg>
              </div>
              <div>
                <span className="font-bold text-base sm:text-lg tracking-tight text-white block">
                  TicketPulse
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-indigo-400 block -mt-1">
                  Real-Time Booking
                </span>
              </div>
            </button>

            {/* Cloud Architecture status */}
            <div className="hidden lg:block ml-3">
              <StatusBadge variant="indigo" withDot>
                Cloud Ready
              </StatusBadge>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action / Backend Status */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right hidden xl:block">
              <span className="text-[11px] text-slate-400 block font-mono">Backend Target</span>
              <span className="text-xs text-slate-300 font-mono font-medium block truncate max-w-[150px]">
                {API_BASE_URL.replace(/^https?:\/\//, '')}
              </span>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-xs font-semibold text-indigo-300 uppercase">
                    {userEmail ? userEmail.charAt(0) : 'U'}
                  </div>
                  <span className="text-xs text-slate-300 max-w-[130px] truncate font-mono">
                    {userEmail || 'demo-user'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSignOutClick}
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleNavClick('signin')}
                className={`px-4 py-2 text-sm font-medium rounded-lg shadow-md transition-all duration-200 active:scale-95 ${currentView === 'signin'
                    ? 'bg-indigo-500 text-white shadow-indigo-600/40 ring-2 ring-indigo-400/40'
                    : 'text-white bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/25'
                  }`}
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-3 pb-5 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800/80 hover:text-white"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
            <div className="text-xs text-slate-400 font-mono">
              Backend: {API_BASE_URL}
            </div>
            {isAuthenticated ? (
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-300 font-mono truncate">
                  {userEmail || 'demo-user'}
                </span>
                <button
                  type="button"
                  onClick={handleSignOutClick}
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg border border-slate-700"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleNavClick('signin')}
                className="w-full py-2.5 text-center text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
