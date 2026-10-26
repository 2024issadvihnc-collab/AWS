import React, { useState } from 'react';
import type { Event, Seat, Booking, TicketPackageTier } from './types';
import { CURATED_EVENTS } from './api/events';
import Layout from './components/Layout';
import LogoSplashScreen from './components/LogoSplashScreen';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import CheckoutPage from './pages/CheckoutPage';
import DigitalTicketPage from './pages/DigitalTicketPage';
import BookingsPage from './pages/BookingsPage';
import SignInPage from './pages/SignInPage';

export const App: React.FC = () => {
  // 1. Initial Logo Flash Splash Screen State
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // 2. User Authentication State (Persisted in localStorage)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('motivec_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  const [userEmail, setUserEmail] = useState<string>(() => {
    try {
      return localStorage.getItem('motivec_user_email') || 'aarav.sharma@spectaclemusic.in';
    } catch {
      return 'aarav.sharma@spectaclemusic.in';
    }
  });

  const [userName, setUserName] = useState<string>(() => {
    try {
      return localStorage.getItem('motivec_user_name') || 'Aarav Sharma';
    } catch {
      return 'Aarav Sharma';
    }
  });

  const [userCity, setUserCity] = useState<string>(() => {
    try {
      return localStorage.getItem('motivec_user_city') || 'Anchorage';
    } catch {
      return 'Anchorage';
    }
  });

  // 3. User Portal Views: 'events' | 'event-detail' | 'seat-selection' | 'checkout' | 'ticket' | 'bookings' | 'signin'
  const [currentView, setCurrentView] = useState<string>('events');

  // Selected event
  const [selectedEvent, setSelectedEvent] = useState<Event>(CURATED_EVENTS[0]);
  const [preselectedPackage, setPreselectedPackage] = useState<TicketPackageTier | undefined>(
    CURATED_EVENTS[0].ticketPackages?.[0]
  );
  const [stagedSeats, setStagedSeats] = useState<Seat[]>([]);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('tixvent_bookings') || '[]');
      if (stored.length > 0) return stored[0];
    } catch {
      // ignore
    }
    return null;
  });

  const [bookingCount, setBookingCount] = useState<number>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('tixvent_bookings') || '[]');
      return stored.length > 0 ? stored.length : 1;
    } catch {
      return 1;
    }
  });

  // Handle Splash Screen Completion
  const handleSplashComplete = () => {
    setShowSplash(false);
    // If not authenticated, prompt sign in / registration
    if (!isAuthenticated) {
      setCurrentView('signin');
    } else {
      setCurrentView('events');
    }
  };

  const handleSignInSuccess = (user?: { email: string; name?: string; city?: string }) => {
    setIsAuthenticated(true);
    const email = user?.email || 'aarav.sharma@spectaclemusic.in';
    const name = user?.name || email.split('@')[0];
    const city = user?.city || userCity;

    setUserEmail(email);
    setUserName(name);
    setUserCity(city);

    try {
      localStorage.setItem('motivec_authenticated', 'true');
      localStorage.setItem('motivec_user_email', email);
      localStorage.setItem('motivec_user_name', name);
      localStorage.setItem('motivec_user_city', city);
    } catch {
      // ignore
    }

    setCurrentView('events');
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('motivec_authenticated');
    } catch {
      // ignore
    }
    setCurrentView('signin');
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setCurrentView('seat-selection');
  };

  const handleViewEventDetails = (event: Event) => {
    setSelectedEvent(event);
    setCurrentView('event-detail');
  };

  const handleSelectSeatsFromDetail = (event: Event, pkg?: TicketPackageTier) => {
    setSelectedEvent(event);
    setPreselectedPackage(pkg);
    setCurrentView('seat-selection');
  };

  const handleContinueToCheckout = (seats: Seat[]) => {
    setStagedSeats(seats);
    setCurrentView('checkout');
  };

  const handleBookingConfirmed = (booking: Booking) => {
    setConfirmedBooking(booking);
    setBookingCount((c) => c + 1);
    setCurrentView('ticket');
  };

  const handleViewTicketFromBookings = (booking: Booking) => {
    setConfirmedBooking(booking);
    setCurrentView('ticket');
  };

  // Pure User Portal Views Only
  const renderContent = () => {
    switch (currentView) {
      case 'events':
        return (
          <EventsPage
            onSelectEvent={handleSelectEvent}
            onViewEventDetails={handleViewEventDetails}
            userPreferredCity={userCity}
            onLocationDetected={(city) => {
              setUserCity(city);
              try {
                localStorage.setItem('motivec_user_city', city);
              } catch {
                // ignore
              }
            }}
          />
        );

      case 'event-detail':
        return (
          <EventDetailPage
            event={selectedEvent}
            onSelectSeats={handleSelectSeatsFromDetail}
            onBackToEvents={() => setCurrentView('events')}
          />
        );

      case 'seat-selection':
        return (
          <SeatSelectionPage
            event={selectedEvent}
            initialSelectedSeatIds={stagedSeats.map((s) => s.id)}
            preselectedPackage={preselectedPackage}
            onBack={() => setCurrentView('event-detail')}
            onContinue={handleContinueToCheckout}
          />
        );

      case 'checkout':
        return (
          <CheckoutPage
            event={selectedEvent}
            seats={
              stagedSeats.length > 0
                ? stagedSeats
                : [
                    { id: 'seat-a3', eventId: selectedEvent.id, section: 'VIP Executive', row: 'A', number: 3, tier: 'VIP', price: selectedEvent.priceStartingFrom * 2, status: 'booked' },
                    { id: 'seat-a4', eventId: selectedEvent.id, section: 'VIP Executive', row: 'A', number: 4, tier: 'VIP', price: selectedEvent.priceStartingFrom * 2, status: 'booked' },
                  ]
            }
            userEmail={userEmail}
            onBackToSeats={() => setCurrentView('seat-selection')}
            onContinueToTickets={handleBookingConfirmed}
            onReturnToEvents={() => setCurrentView('events')}
          />
        );

      case 'ticket':
        if (!confirmedBooking) {
          return (
            <EventsPage
              onSelectEvent={handleSelectEvent}
              onViewEventDetails={handleViewEventDetails}
              userPreferredCity={userCity}
            />
          );
        }
        return (
          <DigitalTicketPage
            booking={confirmedBooking}
            onNavigate={setCurrentView}
          />
        );

      case 'bookings':
        return (
          <BookingsPage
            onViewTicket={handleViewTicketFromBookings}
            onNavigate={setCurrentView}
          />
        );

      case 'signin':
        return (
          <SignInPage
            onSignInSuccess={handleSignInSuccess}
            onNavigate={setCurrentView}
            initialMode="signin"
          />
        );

      default:
        return (
          <EventsPage
            onSelectEvent={handleSelectEvent}
            onViewEventDetails={handleViewEventDetails}
            userPreferredCity={userCity}
          />
        );
    }
  };

  return (
    <>
      {/* 1. Initial Logo Flash Splash Screen */}
      {showSplash && <LogoSplashScreen onComplete={handleSplashComplete} />}

      {/* 2. Main Attendee User Portal */}
      <Layout
        currentView={
          currentView === 'event-detail' ||
          currentView === 'seat-selection' ||
          currentView === 'checkout' ||
          currentView === 'ticket'
            ? 'events'
            : currentView
        }
        onNavigate={setCurrentView}
        isAuthenticated={isAuthenticated}
        userEmail={userEmail}
        userName={userName}
        userCity={userCity}
        onSignOut={handleSignOut}
        activeBookingCount={bookingCount}
      >
        {renderContent()}
      </Layout>
    </>
  );
};

export default App;
