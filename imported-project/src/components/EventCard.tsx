import React from 'react';
import type { Event } from '../types';

interface EventCardProps {
  event: Event;
  onViewSeats?: (event: Event) => void;
}

const CATEGORY_STYLES: Record<
  string,
  { badge: string; accent: string }
> = {
  Concert: { badge: 'bg-purple-950/60 text-purple-300 border-purple-700/50', accent: 'from-purple-600/20' },
  Conference: { badge: 'bg-indigo-950/60 text-indigo-300 border-indigo-700/50', accent: 'from-indigo-600/20' },
  Sports: { badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50', accent: 'from-emerald-600/20' },
  Theatre: { badge: 'bg-rose-950/60 text-rose-300 border-rose-700/50', accent: 'from-rose-600/20' },
  Festival: { badge: 'bg-amber-950/60 text-amber-300 border-amber-700/50', accent: 'from-amber-600/20' },
};

const STATUS_STYLES: Record<string, string> = {
  live: 'bg-emerald-500 text-white',
  published: 'bg-indigo-500/80 text-white',
  draft: 'bg-slate-600/60 text-slate-300',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function availabilityPercent(available: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((available / total) * 100);
}

export const EventCard: React.FC<EventCardProps> = ({ event, onViewSeats }) => {
  const cat = CATEGORY_STYLES[event.category] ?? CATEGORY_STYLES['Concert'];
  const statusStyle = STATUS_STYLES[event.status] ?? STATUS_STYLES['published'];
  const pct = availabilityPercent(event.availableSeats, event.totalSeats);
  const almostSoldOut = pct > 0 && pct <= 15;
  const soldOut = event.availableSeats === 0;

  return (
    <article
      className={`
        relative flex flex-col rounded-2xl overflow-hidden
        bg-gradient-to-b ${cat.accent} via-slate-900/80 to-slate-900/90
        border border-slate-800/80 hover:border-slate-700
        shadow-lg hover:shadow-indigo-900/20
        transition-all duration-250 group
      `}
    >
      {/* Category & Status header strip */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cat.badge}`}>
          {event.category}
        </span>
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle}`}>
          {event.status === 'live' && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
            </span>
          )}
          {event.status.toUpperCase()}
        </span>
      </div>

      {/* Main content */}
      <div className="flex flex-col gap-3 px-5 pb-5 flex-1">
        {/* Title */}
        <h3 className="text-lg font-bold text-white leading-snug group-hover:text-indigo-200 transition-colors line-clamp-2">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
          {event.description}
        </p>

        {/* Venue & date meta */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{event.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(event.date)}</span>
            <span className="text-slate-500">·</span>
            <span>{formatTime(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Doors open {event.doorsOpenTime}</span>
          </div>
        </div>

        {/* Availability bar */}
        <div className="pt-1">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className={soldOut ? 'text-rose-400 font-semibold' : almostSoldOut ? 'text-amber-400 font-semibold' : 'text-slate-400'}>
              {soldOut
                ? 'Sold Out'
                : almostSoldOut
                  ? `Only ${event.availableSeats} seats left!`
                  : `${event.availableSeats.toLocaleString()} seats available`}
            </span>
            <span className="text-slate-500">{pct}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${soldOut
                  ? 'bg-rose-600 w-full'
                  : almostSoldOut
                    ? 'bg-amber-500'
                    : 'bg-indigo-500'
                }`}
              style={{ width: soldOut ? '100%' : `${100 - pct}%` }}
            />
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 mt-auto border-t border-slate-800/80">
          <div>
            <span className="text-[10px] text-slate-500 block font-mono uppercase tracking-wide">From</span>
            <span className="text-xl font-extrabold text-white">
              ₹{event.priceStartingFrom.toLocaleString()}
            </span>
          </div>
          <button
            type="button"
            disabled={soldOut}
            onClick={() => onViewSeats && onViewSeats(event)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 cursor-pointer ${soldOut
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-900/40'
              }`}
            title={soldOut ? 'This event is sold out' : 'View seats and book'}
          >
            {soldOut ? 'Sold Out' : 'View Seats →'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default EventCard;
