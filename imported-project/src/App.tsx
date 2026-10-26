import React, { useState } from 'react';
import type { Event, Seat } from './types';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import SignInPage from './pages/SignInPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import CheckoutPage from './pages/CheckoutPage';
import StatusBadge from './components/StatusBadge';

export const App: React.FC = () => {
  // Start on the sign-in page first when the user enters
  const [currentView, setCurrentView] = useState<string>('signin');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [stagedSeats, setStagedSeats] = useState<Seat[]>([]);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    bookingId: string;
    event: Event;
    seats: Seat[];
    totalAmount: number;
    customerEmail: string;
    createdAt: string;
  } | null>(null);

  const handleSignInSuccess = (user?: { email: string; name?: string }) => {
    setIsAuthenticated(true);
    setUserEmail(user?.email || 'demo@ticketpulse.com');
    // Navigate to dashboard immediately after successful sign in
    setCurrentView('home');
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUserEmail('');
    setCurrentView('signin');
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setCurrentView('seat-selection');
  };

  const handleContinueToCheckout = (seats: Seat[]) => {
    setStagedSeats(seats);
    setCurrentView('checkout');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <HomePage userEmail={userEmail} onNavigate={setCurrentView} />;

      case 'events':
        return <EventsPage onSelectEvent={handleSelectEvent} />;

      case 'seat-selection':
        if (!selectedEvent) {
          return <EventsPage onSelectEvent={handleSelectEvent} />;
        }
        return (
          <SeatSelectionPage
            event={selectedEvent}
            initialSelectedSeatIds={stagedSeats.map((s) => s.id)}
            onBack={() => setCurrentView('events')}
            onContinue={handleContinueToCheckout}
          />
        );

      case 'checkout':
        if (!selectedEvent || stagedSeats.length === 0) {
          return <EventsPage onSelectEvent={handleSelectEvent} />;
        }
        return (
          <CheckoutPage
            event={selectedEvent}
            seats={stagedSeats}
            userEmail={userEmail}
            onBackToSeats={() => setCurrentView('seat-selection')}
            onContinueToTickets={(booking) => {
              setConfirmedBooking(booking);
              setCurrentView('digital-tickets-preview');
            }}
            onReturnToEvents={() => {
              setStagedSeats([]);
              setSelectedEvent(null);
              setCurrentView('events');
            }}
          />
        );

      case 'digital-tickets-preview':
        return (
          <div className="p-8 sm:p-10 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-6 max-w-2xl mx-auto shadow-2xl">
            <StatusBadge variant="indigo">Milestone Scheduled for Next Task</StatusBadge>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Digital Tickets &amp; QR Verification
              </h2>
              <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
                Your booking <strong className="text-white font-mono">{confirmedBooking?.bookingId || 'BK-DEMO-2026'}</strong> for{' '}
                <strong className="text-white">{confirmedBooking?.event.title || selectedEvent?.title}</strong> ({stagedSeats.length} seats) was confirmed via the simulated payment interface.
              </p>
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="text-emerald-400 font-semibold block">Checkout Verification Complete</span>
                <span className="text-slate-400">
                  Digital ticket QR payload generation, scanner validation, and anti-duplicate check-in prevention will be implemented in the next scheduled task.
                </span>
              </div>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentView('events')}
                className="px-5 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Browse More Events
              </button>
              <button
                type="button"
                onClick={() => setCurrentView('home')}
                className="px-4 py-2.5 text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        );

      case 'signin':
        return (
          <SignInPage
            onSignInSuccess={handleSignInSuccess}
            onNavigate={setCurrentView}
          />
        );

      case 'bookings':
        return (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-4">
            <StatusBadge variant="emerald">Module Scheduled</StatusBadge>
            <h2 className="text-2xl font-bold text-white">Customer Bookings &amp; Digital Tickets</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              This module will display confirmed bookings, simulated payment outcomes, and digital tickets with unique QR codes.
            </p>
            <button
              type="button"
              onClick={() => setCurrentView('home')}
              className="px-4 py-2 text-sm bg-slate-800 text-slate-200 hover:text-white rounded-lg border border-slate-700"
            >
              Back to Foundation Overview
            </button>
          </div>
        );

      case 'organizer':
        return (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-4">
            <StatusBadge variant="purple">Module Scheduled</StatusBadge>
            <h2 className="text-2xl font-bold text-white">Organizer Dashboard &amp; Live Analytics</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              This module will enable event creation, capacity management, real-time ticket sales metrics, and QR ticket scanning.
            </p>
            <button
              type="button"
              onClick={() => setCurrentView('home')}
              className="px-4 py-2 text-sm bg-slate-800 text-slate-200 hover:text-white rounded-lg border border-slate-700"
            >
              Back to Foundation Overview
            </button>
          </div>
        );

      case 'admin':
        return (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-4">
            <StatusBadge variant="amber">Module Scheduled</StatusBadge>
            <h2 className="text-2xl font-bold text-white">Admin Hub &amp; System Audit Logs</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              This module will provide platform-wide monitoring, user management, and transactional audit trails for cloud operations.
            </p>
            <button
              type="button"
              onClick={() => setCurrentView('home')}
              className="px-4 py-2 text-sm bg-slate-800 text-slate-200 hover:text-white rounded-lg border border-slate-700"
            >
              Back to Foundation Overview
            </button>
          </div>
        );

      default:
        return <HomePage />;
    }
  };

  return (
    <Layout
      currentView={
        currentView === 'seat-selection' || currentView === 'checkout' || currentView === 'digital-tickets-preview'
          ? 'events'
          : currentView
      }
      onNavigate={setCurrentView}
      isAuthenticated={isAuthenticated}
      userEmail={userEmail}
      onSignOut={handleSignOut}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
