import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, ArrowUpRight, LogOut, MapPin } from 'lucide-react';

interface NavbarProps {
  currentView?: string;
  onNavigate?: (view: string) => void;
  isAuthenticated?: boolean;
  userEmail?: string;
  userName?: string;
  userCity?: string;
  onSignOut?: () => void;
  activeBookingCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView = 'events',
  onNavigate,
  isAuthenticated = false,
  userEmail = '',
  userName = '',
  userCity = '',
  onSignOut,
  activeBookingCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Pure attendee / user portal navigation
  const navigationItems = [
    { id: 'events', label: 'Events' },
    { id: 'seat-selection', label: 'Seat Booking' },
    { id: 'bookings', label: 'My Passes', badge: activeBookingCount > 0 ? `${activeBookingCount}` : undefined },
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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Zone 1: Motivec Brand Identity */}
          <button
            type="button"
            onClick={() => handleNavClick('events')}
            className="flex items-center gap-3 group focus:outline-none cursor-pointer"
          >
            {/* Colorful Geometric Brand Mark */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-fuchsia-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-fuchsia-500/25 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display font-extrabold text-2xl tracking-tight text-slate-900 leading-none">
                Motivec
              </span>
              <span className="text-[9px] font-mono font-bold text-fuchsia-600 uppercase tracking-widest mt-0.5">
                ATTENDEE PORTAL
              </span>
            </div>
          </button>

          {/* Zone 2: Pure Attendee Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider">
            {navigationItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-1 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'text-fuchsia-600 font-extrabold'
                      : 'text-slate-700 hover:text-fuchsia-600'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-fuchsia-600 text-white">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute -bottom-2.5 left-0 right-0 h-0.5 bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Location Chip, Cart & Account Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Live Location Chip if detected */}
            {userCity && (
              <div
                onClick={() => handleNavClick('events')}
                title={`Events sorted nearest to ${userCity}`}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-fuchsia-50 border border-fuchsia-200 text-xs text-fuchsia-900 cursor-pointer hover:bg-fuchsia-100 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span className="font-semibold">{userCity}</span>
              </div>
            )}

            {/* Search Icon */}
            <button
              type="button"
              onClick={() => handleNavClick('events')}
              aria-label="Search Events"
              className="p-2 text-slate-600 hover:text-fuchsia-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Passes & Cart Icon with Badge */}
            <button
              type="button"
              onClick={() => handleNavClick('bookings')}
              aria-label="View My Passes"
              className="relative p-2 text-slate-600 hover:text-fuchsia-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-fuchsia-600 text-white text-[10px] font-bold flex items-center justify-center font-mono">
                {activeBookingCount}
              </span>
            </button>

            {/* User Session Profile or Sign In */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div
                  onClick={() => handleNavClick('bookings')}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer text-xs"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                    {(userName || userEmail)[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="font-semibold text-slate-800 max-w-[120px] truncate">
                    {userName || userEmail.split('@')[0]}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSignOutClick}
                  title="Sign out of attendee portal"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleNavClick('signin')}
                className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-display font-bold uppercase tracking-wider bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-500 hover:from-fuchsia-500 hover:to-pink-500 text-white shadow-md shadow-pink-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <span>Sign In / Join</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-2 bg-white">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-2.5 text-sm font-semibold rounded-xl flex items-center justify-between ${
                  currentView === item.id
                    ? 'bg-fuchsia-50 text-fuchsia-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-fuchsia-600 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}

            <div className="pt-2 px-2">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleSignOutClick}
                  className="w-full py-2.5 rounded-full text-center text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleNavClick('signin')}
                  className="w-full py-2.5 rounded-full text-center text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>Sign In / Create Account ↗</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </header>
  );
};

export default Navbar;
