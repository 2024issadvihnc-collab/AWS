import React, { useEffect, useState, useMemo } from 'react';
import type { Event, EventCategory } from '../types';
import { fetchEvents } from '../api/events';
import EventCard from '../components/EventCard';
import {
  Search,
  MapPin,
  X,
  Compass,
  RotateCw
} from 'lucide-react';
import {
  calculateDistance,
  formatDistance,
  requestUserLocation,
  KNOWN_CITIES,
  type GeoCoordinates
} from '../utils/geolocation';

interface EventsPageProps {
  onSelectEvent?: (event: Event) => void;
  onViewEventDetails?: (event: Event) => void;
  userPreferredCity?: string;
  onLocationDetected?: (city: string) => void;
}

const CATEGORY_TABS: (EventCategory | 'All')[] = [
  'All',
  'AI & Chatbots',
  'Modern Marketing',
  'Workshops',
  'Creative Tech',
  'Deep Tech & ML',
  'Global Pavilion',
];

const AVAILABLE_CITIES = ['All Cities', 'Anchorage', 'Sydney', 'Ketchikan', 'Bengaluru', 'San Francisco'];

export const EventsPage: React.FC<EventsPageProps> = ({
  onSelectEvent,
  onViewEventDetails,
  userPreferredCity,
  onLocationDetected,
}) => {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'All'>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under-1500' | '1500-2500' | 'above-2500'>('all');

  // Live Location State
  const [userCoords, setUserCoords] = useState<GeoCoordinates | null>(() => {
    if (userPreferredCity && KNOWN_CITIES[userPreferredCity]) {
      return { lat: KNOWN_CITIES[userPreferredCity].lat, lng: KNOWN_CITIES[userPreferredCity].lng };
    }
    // Default to Anchorage or Bengaluru
    return { lat: 61.2181, lng: -149.9003 };
  });

  const [detectedCity, setDetectedCity] = useState<string>(() => {
    return userPreferredCity || 'Anchorage';
  });

  const [locationStatus, setLocationStatus] = useState<'idle' | 'locating' | 'detected' | 'manual'>('locating');
  const [locationError, setLocationError] = useState<string | null>(null);

  // Fetch initial events
  useEffect(() => {
    let cancelled = false;

    fetchEvents().then(({ events }) => {
      if (!cancelled) {
        setAllEvents(events);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Request browser geolocation on mount
  useEffect(() => {
    let isMounted = true;

    requestUserLocation()
      .then(({ coords, nearestCity }) => {
        if (!isMounted) return;
        setUserCoords(coords);
        setDetectedCity(nearestCity);
        setLocationStatus('detected');
        if (onLocationDetected) {
          onLocationDetected(nearestCity);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setLocationStatus('manual');
        // keep fallback or user's preference
      });

    return () => {
      isMounted = false;
    };
  }, [onLocationDetected]);

  const handleRefreshLocation = () => {
    setLocationStatus('locating');
    setLocationError(null);

    requestUserLocation()
      .then(({ coords, nearestCity }) => {
        setUserCoords(coords);
        setDetectedCity(nearestCity);
        setLocationStatus('detected');
        if (onLocationDetected) {
          onLocationDetected(nearestCity);
        }
      })
      .catch((err) => {
        setLocationStatus('manual');
        setLocationError(err instanceof Error ? err.message : 'Location permission denied.');
      });
  };

  const handleManualCitySelect = (cityName: string) => {
    if (KNOWN_CITIES[cityName]) {
      setUserCoords({ lat: KNOWN_CITIES[cityName].lat, lng: KNOWN_CITIES[cityName].lng });
      setDetectedCity(cityName);
      setLocationStatus('manual');
      if (onLocationDetected) {
        onLocationDetected(cityName);
      }
    }
  };

  // Compute distances for all events relative to userCoords
  const eventsWithDistance = useMemo(() => {
    return allEvents.map((evt) => {
      let distanceKm: number | undefined;
      let distanceFormatted: string | undefined;

      if (userCoords && evt.coordinates) {
        distanceKm = calculateDistance(
          userCoords.lat,
          userCoords.lng,
          evt.coordinates.lat,
          evt.coordinates.lng
        );
        distanceFormatted = formatDistance(distanceKm);
      }

      return {
        ...evt,
        distanceKm: distanceKm ?? 999999,
        distanceFormatted,
      };
    });
  }, [allEvents, userCoords]);

  // Nearest events (matches detected city OR within closest proximity)
  const nearestEvents = useMemo(() => {
    // Priority: events in the detected city, or sorted by distance
    const inCity = eventsWithDistance.filter(
      (e) => e.city.toLowerCase() === detectedCity.toLowerCase()
    );

    if (inCity.length > 0) {
      return inCity;
    }

    // If no direct city match, sort all by distance and take the 3 closest
    const sorted = [...eventsWithDistance].sort((a, b) => a.distanceKm - b.distanceKm);
    return sorted.slice(0, 3);
  }, [eventsWithDistance, detectedCity]);

  // Other city events / filtered events
  const otherCityEvents = useMemo(() => {
    let list = eventsWithDistance;

    // If "All Cities" is selected in the explorer, exclude the events already shown in nearest section
    if (selectedCity === 'All Cities') {
      const nearestIds = new Set(nearestEvents.map((e) => e.id));
      list = list.filter((e) => !nearestIds.has(e.id));
    } else {
      list = list.filter((e) => e.city.toLowerCase() === selectedCity.toLowerCase());
    }

    // Category filter
    if (selectedCategory !== 'All') {
      list = list.filter((e) => e.category === selectedCategory);
    }

    // Price filter
    if (priceFilter === 'under-1500') {
      list = list.filter((e) => e.priceStartingFrom < 1500);
    } else if (priceFilter === '1500-2500') {
      list = list.filter((e) => e.priceStartingFrom >= 1500 && e.priceStartingFrom <= 2500);
    } else if (priceFilter === 'above-2500') {
      list = list.filter((e) => e.priceStartingFrom > 2500);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          (e.badgeLabel && e.badgeLabel.toLowerCase().includes(q))
      );
    }

    // Sort by distance so closest are always first
    return [...list].sort((a, b) => a.distanceKm - b.distanceKm);
  }, [eventsWithDistance, nearestEvents, selectedCity, selectedCategory, priceFilter, searchQuery]);

  return (
    <div className="space-y-10 pb-24">
      
      {/* 1. Hero Showcase Section matching Keynote Speaker Theme */}
      <section className="relative w-full py-16 sm:py-20 lg:py-24 hero-stage-backdrop overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050714] via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          
          {/* Hero Typography */}
          <div className="space-y-3 max-w-xl">
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight">
              Events
            </h1>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold tracking-widest text-slate-300 uppercase font-mono">
              <span className="text-fuchsia-400">MOTIVEC</span>
              <span>&gt;</span>
              <span className="text-white">USER PORTAL</span>
            </div>
            <p className="text-sm text-slate-300/90 max-w-md pt-2 leading-relaxed">
              Find live conferences, keynote symposiums, and hands-on workshops near your location with verified seat booking.
            </p>
          </div>

          {/* Quick Highlight Stats in Hero */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-3xl">
            <div className="text-center px-4 border-r border-white/20">
              <span className="font-display font-extrabold text-2xl text-white block">24+</span>
              <span className="text-[10px] text-slate-300 uppercase tracking-wider font-mono">Keynotes</span>
            </div>
            <div className="text-center px-4 border-r border-white/20">
              <span className="font-display font-extrabold text-2xl text-fuchsia-400 block">
                {detectedCity}
              </span>
              <span className="text-[10px] text-slate-300 uppercase tracking-wider font-mono">Your City</span>
            </div>
            <div className="text-center px-4">
              <span className="font-display font-extrabold text-2xl text-emerald-400 block">100%</span>
              <span className="text-[10px] text-slate-300 uppercase tracking-wider font-mono">Live Seats</span>
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* 2. Live Location Banner & Quick Switcher */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-fuchsia-50 via-purple-50 to-indigo-50 border border-fuchsia-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-fuchsia-600 to-pink-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <Compass className={`w-5 h-5 ${locationStatus === 'locating' ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-fuchsia-800">
                  {locationStatus === 'locating' ? 'Locating Your Position…' : 'Your Live Location Detected'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h2 className="font-display font-black text-lg sm:text-xl text-slate-900 leading-tight">
                Showing nearest events in <span className="text-fuchsia-700 underline decoration-fuchsia-300 underline-offset-4">{detectedCity}</span>
              </h2>
              {locationError && (
                <span className="text-[10px] text-rose-500 font-mono block mt-0.5">
                  {locationError}
                </span>
              )}
            </div>
          </div>

          {/* Location Actions: Refresh GPS or Choose Manual City */}
          <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
            <select
              value={detectedCity}
              onChange={(e) => handleManualCitySelect(e.target.value)}
              className="px-3.5 py-2 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-xs focus:outline-none focus:border-fuchsia-500 cursor-pointer"
            >
              {Object.keys(KNOWN_CITIES).map((c) => (
                <option key={c} value={c}>
                  📍 Switch to {c}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleRefreshLocation}
              disabled={locationStatus === 'locating'}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition-colors cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 text-fuchsia-600 ${locationStatus === 'locating' ? 'animate-spin' : ''}`} />
              <span>{locationStatus === 'locating' ? 'Detecting…' : 'Re-Detect GPS'}</span>
            </button>
          </div>
        </div>

        {/* 3. PRIORITY SECTION 1: Nearest Events in Your Location */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-fuchsia-600 uppercase">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>Priority Location Match</span>
              </div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                Events Near You in {detectedCity}
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              {nearestEvents.length} {nearestEvents.length === 1 ? 'event' : 'events'} matched in close proximity
            </p>
          </div>

          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-fuchsia-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-mono text-slate-500">Scanning local venue coordinates…</p>
            </div>
          ) : nearestEvents.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-xs">
              <p className="text-sm font-semibold text-slate-700">No scheduled sessions directly in {detectedCity} this week.</p>
              <p className="text-xs text-slate-500">Check out other global cities below!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {nearestEvents.map((evt) => (
                <EventCard
                  key={evt.id}
                  event={evt}
                  distanceFormatted={evt.distanceFormatted}
                  onViewSeats={onSelectEvent}
                  onViewDetails={onViewEventDetails}
                />
              ))}
            </div>
          )}
        </section>

        {/* 4. PRIORITY SECTION 2: Explore Events in Other Cities */}
        <section className="space-y-6 pt-6 border-t border-slate-200">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2">
            <div>
              <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider block">
                GLOBAL ROSTER
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                Explore Events in Other Cities
              </h2>
            </div>

            {/* City Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {AVAILABLE_CITIES.map((c) => {
                const isActive = selectedCity === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedCity(c)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search & Category Filter Toolbar */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            
            {/* Search Input Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by keynote topic, speaker name, or venue…"
                className="w-full pl-11 pr-10 py-3.5 rounded-full bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Segmented Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {CATEGORY_TABS.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Price Filter Chips */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">Price:</span>
                {[
                  { id: 'all', label: 'All' },
                  { id: 'under-1500', label: '< ₹1.5k' },
                  { id: '1500-2500', label: '₹1.5k - ₹2.5k' },
                  { id: 'above-2500', label: '> ₹2.5k' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriceFilter(p.id as any)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium transition-colors cursor-pointer ${
                      priceFilter === p.id
                        ? 'bg-fuchsia-100 text-fuchsia-800 font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Grid of Other City Events */}
          {otherCityEvents.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
              <Search className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="font-display font-bold text-base text-slate-900">
                No events matched your current filters
              </h3>
              <p className="text-xs text-slate-500">
                Try selecting "All Cities" or clearing your search filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedCity('All Cities');
                  setPriceFilter('all');
                }}
                className="px-4 py-2 rounded-full text-xs font-bold bg-fuchsia-600 text-white hover:bg-fuchsia-500 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {otherCityEvents.map((evt) => (
                <EventCard
                  key={evt.id}
                  event={evt}
                  distanceFormatted={evt.distanceFormatted}
                  onViewSeats={onSelectEvent}
                  onViewDetails={onViewEventDetails}
                />
              ))}
            </div>
          )}

        </section>

      </div>

    </div>
  );
};

export default EventsPage;
