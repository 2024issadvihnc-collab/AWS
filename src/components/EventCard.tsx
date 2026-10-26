import React from 'react';
import type { Event } from '../types';
import { MapPin, ArrowRight } from 'lucide-react';

interface EventCardProps {
  event: Event;
  distanceFormatted?: string;
  onViewSeats?: (event: Event) => void;
  onViewDetails?: (event: Event) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const BADGE_COLOR_MAP: Record<string, string> = {
  indigo: 'bg-indigo-700 text-white shadow-sm shadow-indigo-700/30',
  blue: 'bg-blue-600 text-white shadow-sm shadow-blue-600/30',
  purple: 'bg-purple-700 text-white shadow-sm shadow-purple-700/30',
  violet: 'bg-violet-600 text-white shadow-sm shadow-violet-600/30',
  fuchsia: 'bg-fuchsia-600 text-white shadow-sm shadow-fuchsia-600/30',
  emerald: 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30',
  cyan: 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/30',
  amber: 'bg-amber-600 text-white shadow-sm shadow-amber-600/30',
};

export const EventCard: React.FC<EventCardProps> = ({
  event,
  distanceFormatted,
  onViewSeats,
  onViewDetails,
}) => {
  const badgeClass =
    BADGE_COLOR_MAP[event.badgeColor || 'indigo'] ||
    'bg-indigo-700 text-white shadow-sm shadow-indigo-700/30';

  const badgeText = event.badgeLabel || event.category.toUpperCase();

  return (
    <article className="flex flex-col rounded-3xl bg-white border border-slate-200/90 hover:border-indigo-300 shadow-[0_4px_20px_rgba(15,23,42,0.06)] hover:shadow-[0_16px_36px_rgba(99,102,241,0.14)] hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
      
      {/* Visual Header / Poster Banner */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 p-2 pb-0">
        <div className="relative w-full h-full rounded-2xl overflow-hidden">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center" />
          )}

          {/* Quick Price Overlay on Image */}
          <div className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white border border-white/20 text-xs font-mono font-bold">
            From ₹{event.priceStartingFrom.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Body Content matching the screenshot layout */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 gap-3">
        
        {/* Row 1: Colorful Pill Badge + Date + Distance */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] sm:text-[11px] font-display font-bold uppercase tracking-wider px-3.5 py-1 rounded-full ${badgeClass}`}>
              {badgeText}
            </span>
            <span className="text-xs text-slate-400 font-mono font-medium">
              {formatDate(event.date)}
            </span>
          </div>

          {distanceFormatted && (
            <span className="text-[10px] font-mono font-bold text-fuchsia-700 bg-fuchsia-50 border border-fuchsia-200/80 px-2 py-0.5 rounded-full">
              📍 {distanceFormatted}
            </span>
          )}
        </div>

        {/* Row 2: Event Title */}
        <h3
          onClick={() => onViewDetails && onViewDetails(event)}
          className="font-display font-bold text-base sm:text-lg text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug cursor-pointer pt-0.5"
        >
          {event.title}
        </h3>

        {/* Row 3: Venue Location */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-0.5">
          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 truncate">
            {event.venue}
          </span>
        </div>

        {/* Row 4: Action Controls */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onViewDetails && onViewDetails(event)}
            className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            Overview
          </button>

          <button
            type="button"
            onClick={() => onViewSeats && onViewSeats(event)}
            className="px-4 py-2 rounded-full text-xs font-display font-bold bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-500 hover:from-fuchsia-500 hover:to-pink-500 text-white shadow-md shadow-pink-500/25 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Select Seats</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </article>
  );
};

export default EventCard;
