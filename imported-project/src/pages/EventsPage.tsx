import React, { useEffect, useState, useMemo } from 'react';
import type { Event, EventCategory } from '../types';
import { fetchEvents } from '../api/events';
import EventCard from '../components/EventCard';
import StatusBadge from '../components/StatusBadge';

const ALL_CATEGORIES: EventCategory[] = [
  'Concert',
  'Conference',
  'Sports',
  'Theatre',
  'Festival',
];

const SORT_OPTIONS = [
  { value: 'date-asc', label: 'Date: Soonest First' },
  { value: 'date-desc', label: 'Date: Latest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'seats-desc', label: 'Most Seats Available' },
] as const;

type SortKey = typeof SORT_OPTIONS[number]['value'];

function sortEvents(events: Event[], key: SortKey): Event[] {
  const copy = [...events];
  switch (key) {
    case 'date-asc': return copy.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    case 'date-desc': return copy.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    case 'price-asc': return copy.sort((a, b) => a.priceStartingFrom - b.priceStartingFrom);
    case 'price-desc': return copy.sort((a, b) => b.priceStartingFrom - a.priceStartingFrom);
    case 'seats-desc': return copy.sort((a, b) => b.availableSeats - a.availableSeats);
    default: return copy;
  }
}

interface EventsPageProps {
  onSelectEvent?: (event: Event) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ onSelectEvent }) => {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingDemoData, setUsingDemoData] = useState(false);

  // Filter & sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<EventCategory | ''>('');
  const [sortKey, setSortKey] = useState<SortKey>('date-asc');

  // Load events on mount — async via a nested function to satisfy the linter
  useEffect(() => {
    let cancelled = false;

    fetchEvents().then(({ events, usingDemoData: demo }) => {
      if (!cancelled) {
        setAllEvents(events);
        setUsingDemoData(demo);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, []);

  // Derive displayed events during render via useMemo — no setState in effect
  const displayedEvents = useMemo(() => {
    let filtered = allEvents;

    if (activeCategory) {
      filtered = filtered.filter((e) => e.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(term) ||
          e.venue.toLowerCase().includes(term) ||
          e.description.toLowerCase().includes(term) ||
          e.category.toLowerCase().includes(term),
      );
    }

    return sortEvents(filtered, sortKey);
  }, [allEvents, searchQuery, activeCategory, sortKey]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setActiveCategory('');
    setSortKey('date-asc');
  };

  const hasActiveFilters = searchQuery !== '' || activeCategory !== '' || sortKey !== 'date-asc';

  return (
    <div className="space-y-8">

      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Events &amp; Shows
            </h1>
            <p className="text-slate-400 mt-1 text-sm sm:text-base">
              Browse upcoming events, check live seat availability, and secure your tickets.
            </p>
          </div>
          {!loading && usingDemoData && (
            <StatusBadge variant="amber" withDot={false}>
              Demonstration Data – Backend Offline
            </StatusBadge>
          )}
          {!loading && !usingDemoData && (
            <StatusBadge variant="emerald" withDot>
              Live Data from Backend
            </StatusBadge>
          )}
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="space-y-3">
        {/* Search input */}
        <div className="relative">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="event-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, venues, or categories…"
            className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-900/70 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Category pills + Sort */}
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory('')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${activeCategory === ''
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
                }`}
            >
              All
            </button>
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat === activeCategory ? '' : cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${activeCategory === cat
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs text-slate-400 hover:text-slate-200 underline underline-offset-2 transition-colors"
              >
                Clear filters
              </button>
            )}
            <select
              id="event-sort"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="bg-slate-900/70 border border-slate-700/80 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-xs text-slate-500 font-mono">
          Showing {displayedEvents.length} of {allEvents.length} events
          {activeCategory ? ` in ${activeCategory}` : ''}
          {searchQuery ? ` matching "${searchQuery}"` : ''}
        </p>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-72 rounded-2xl bg-slate-900/60 border border-slate-800/60 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && displayedEvents.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-semibold">No events found</p>
            <p className="text-slate-400 text-sm mt-1">
              Try adjusting your search or removing the category filter.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClearFilters}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 hover:text-white text-sm border border-slate-700 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Event cards grid */}
      {!loading && displayedEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedEvents.map((event) => (
            <EventCard key={event.id} event={event} onViewSeats={onSelectEvent} />
          ))}
        </div>
      )}

      {/* Demo data footer note */}
      {!loading && usingDemoData && (
        <p className="text-center text-xs text-slate-600 font-mono pt-4 border-t border-slate-800/60">
          Showing demonstration data · Connect the Node.js / Express.js backend to load live events
        </p>
      )}

    </div>
  );
};

export default EventsPage;
