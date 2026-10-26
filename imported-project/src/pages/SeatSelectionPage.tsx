import React, { useEffect, useState, useMemo } from 'react';
import type { Event, Seat, SeatTier } from '../types';
import { fetchSeatsForEvent } from '../api/seats';
import StatusBadge from '../components/StatusBadge';

interface SeatSelectionPageProps {
  event: Event;
  onBack: () => void;
  onContinue?: (selectedSeats: Seat[]) => void;
  initialSelectedSeatIds?: string[];
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {
    weekday: 'long',
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

const TIER_COLORS: Record<SeatTier, { badge: string; text: string; bg: string }> = {
  VIP: {
    badge: 'bg-purple-950/70 text-purple-300 border-purple-700/60',
    text: 'text-purple-400',
    bg: 'bg-purple-500/20',
  },
  Premium: {
    badge: 'bg-indigo-950/70 text-indigo-300 border-indigo-700/60',
    text: 'text-indigo-400',
    bg: 'bg-indigo-500/20',
  },
  Standard: {
    badge: 'bg-blue-950/70 text-blue-300 border-blue-700/60',
    text: 'text-blue-400',
    bg: 'bg-blue-500/20',
  },
  Balcony: {
    badge: 'bg-slate-800 text-slate-300 border-slate-700',
    text: 'text-slate-400',
    bg: 'bg-slate-500/20',
  },
};

export const SeatSelectionPage: React.FC<SeatSelectionPageProps> = ({
  event,
  onBack,
  onContinue,
  initialSelectedSeatIds,
}) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<Set<string>>(
    () => new Set(initialSelectedSeatIds || [])
  );
  const [loading, setLoading] = useState(true);
  const [usingDemoData, setUsingDemoData] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchSeatsForEvent(event).then(({ seats: loadedSeats, usingDemoData: isDemo }) => {
      if (!cancelled) {
        setSeats(loadedSeats);
        setUsingDemoData(isDemo);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [event]);

  // Group seats by row for layout rendering
  const rowsMap = useMemo(() => {
    const map = new Map<string, { tier: SeatTier; section: string; seats: Seat[] }>();
    seats.forEach((seat) => {
      if (!map.has(seat.row)) {
        map.set(seat.row, { tier: seat.tier, section: seat.section, seats: [] });
      }
      map.get(seat.row)!.seats.push(seat);
    });
    // Sort seats in each row by number
    map.forEach((value) => {
      value.seats.sort((a, b) => a.number - b.number);
    });
    return map;
  }, [seats]);

  // Selected seats objects
  const selectedSeatsList = useMemo(() => {
    return seats.filter((s) => selectedSeatIds.has(s.id));
  }, [seats, selectedSeatIds]);

  // Calculated total price
  const totalPrice = useMemo(() => {
    return selectedSeatsList.reduce((sum, seat) => sum + seat.price, 0);
  }, [selectedSeatsList]);

  // Toggle seat selection
  const handleToggleSeat = (seat: Seat) => {
    // Prevent selecting unavailable/booked seats
    if (seat.status !== 'available') return;

    setSelectedSeatIds((prev) => {
      const next = new Set(prev);
      if (next.has(seat.id)) {
        next.delete(seat.id);
      } else {
        next.add(seat.id);
      }
      return next;
    });
  };

  const handleContinue = () => {
    if (selectedSeatsList.length === 0) return;
    setBookingConfirmed(true);
    if (onContinue) {
      onContinue(selectedSeatsList);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">

      {/* Navigation & Event Header */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Events &amp; Shows
        </button>

        {/* Event Details Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950 border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950/70 text-indigo-300 border border-indigo-700/50">
                  {event.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-700/50">
                  {event.status.toUpperCase()}
                </span>
                {usingDemoData && (
                  <StatusBadge variant="amber" withDot={false}>
                    Demonstration Seat Map
                  </StatusBadge>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                {event.title}
              </h1>

              <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Starting Price Box */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-right sm:min-w-[180px] shrink-0">
              <span className="text-[11px] text-slate-400 block font-mono uppercase">Ticket Price</span>
              <span className="text-2xl font-extrabold text-white">
                ₹{event.priceStartingFrom.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 block">per seat starting price</span>
            </div>
          </div>

          {/* Event Meta Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 text-xs">
            <div className="flex items-center gap-2.5 text-slate-300">
              <div className="p-2 rounded-lg bg-slate-800/60 text-indigo-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Venue</span>
                <span className="font-semibold text-white">{event.venue}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-slate-300">
              <div className="p-2 rounded-lg bg-slate-800/60 text-purple-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Date &amp; Time</span>
                <span className="font-semibold text-white">{formatDate(event.date)} · {formatTime(event.date)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-slate-300">
              <div className="p-2 rounded-lg bg-slate-800/60 text-emerald-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Doors Open</span>
                <span className="font-semibold text-white">{event.doorsOpenTime} IST</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Seating Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Visual Seating Layout Container */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 shadow-xl space-y-8">

          {/* Stage / Screen Visual */}
          <div className="space-y-2 text-center">
            <div className="relative max-w-lg mx-auto">
              <div className="h-2 w-full bg-gradient-to-r from-indigo-500/20 via-indigo-500 to-indigo-500/20 rounded-full shadow-lg shadow-indigo-500/30" />
              <div className="absolute inset-x-0 -top-1 text-[10px] font-mono uppercase tracking-widest text-indigo-300 font-bold">
                STAGE / SCREEN
              </div>
            </div>
            <p className="text-[11px] text-slate-500">Audience faces the stage</p>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="py-20 text-center space-y-3">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent" />
              <p className="text-sm text-slate-400">Loading interactive seat matrix…</p>
            </div>
          )}

          {/* Seating Grid */}
          {!loading && (
            <div className="space-y-6 overflow-x-auto pb-4">
              {Array.from(rowsMap.entries()).map(([rowLetter, rowData]) => {
                const tierStyle = TIER_COLORS[rowData.tier];

                return (
                  <div key={rowLetter} className="flex items-center justify-center gap-3 min-w-[540px]">
                    {/* Row identifier on left */}
                    <div className="w-8 text-right font-mono font-bold text-xs text-slate-400">
                      Row {rowLetter}
                    </div>

                    {/* Seats in this row with a center aisle */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {rowData.seats.map((seat, index) => {
                        const isSelected = selectedSeatIds.has(seat.id);
                        const isAvailable = seat.status === 'available';
                        const isAisle = index === Math.floor(rowData.seats.length / 2);

                        return (
                          <React.Fragment key={seat.id}>
                            {/* Visual center aisle gap */}
                            {isAisle && <div className="w-4 sm:w-6" aria-hidden="true" />}

                            <button
                              id={`seat-${seat.id}`}
                              type="button"
                              disabled={!isAvailable}
                              onClick={() => handleToggleSeat(seat)}
                              aria-label={`Seat ${seat.row}${seat.number}, ${seat.tier} tier, ₹${seat.price}, ${
                                isSelected ? 'selected' : seat.status
                              }`}
                              title={`${seat.tier} - Row ${seat.row}, Seat ${seat.number} - ₹${seat.price.toLocaleString()} (${
                                isSelected ? 'Selected' : seat.status
                              })`}
                              className={`
                                relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-[11px] font-mono font-semibold
                                flex items-center justify-center transition-all duration-150 select-none
                                ${
                                  isSelected
                                    ? 'bg-emerald-500 text-white font-bold ring-2 ring-emerald-400/60 shadow-lg shadow-emerald-500/40 scale-105 z-10'
                                    : isAvailable
                                    ? 'bg-slate-800/90 text-slate-200 border border-slate-700/80 hover:bg-indigo-600/30 hover:border-indigo-400/60 hover:text-white cursor-pointer active:scale-95'
                                    : 'bg-slate-900/60 text-slate-600 border border-slate-800/40 cursor-not-allowed opacity-50'
                                }
                              `}
                            >
                              {/* Seat number display */}
                              {seat.number}

                              {/* Tiny Tier indicator dot for available seats */}
                              {isAvailable && !isSelected && (
                                <span
                                  className={`absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full ${
                                    seat.tier === 'VIP'
                                      ? 'bg-purple-400'
                                      : seat.tier === 'Premium'
                                      ? 'bg-indigo-400'
                                      : 'bg-blue-400'
                                  }`}
                                />
                              )}

                              {/* Booked / Unavailable mark */}
                              {!isAvailable && (
                                <span className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-600" aria-hidden="true">
                                  ✕
                                </span>
                              )}
                            </button>
                          </React.Fragment>
                        );
                      })}
                    </div>

                    {/* Tier badge on right of row */}
                    <div className="w-20 pl-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${tierStyle.badge}`}>
                        {rowData.tier}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Clear Legend Explaining Seat States */}
          <div className="pt-6 border-t border-slate-800/80 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Seat State Legend
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {/* Available */}
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="w-5 h-5 rounded bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center text-[10px] font-mono">
                  1
                </div>
                <div>
                  <span className="text-white font-medium block">Available</span>
                  <span className="text-[10px] text-slate-400">Click to select</span>
                </div>
              </div>

              {/* Selected */}
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="w-5 h-5 rounded bg-emerald-500 text-white font-bold flex items-center justify-center text-[10px] font-mono shadow-sm shadow-emerald-500/50">
                  ✓
                </div>
                <div>
                  <span className="text-emerald-300 font-medium block">Selected</span>
                  <span className="text-[10px] text-slate-400">Your selection</span>
                </div>
              </div>

              {/* Unavailable / Booked */}
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="w-5 h-5 rounded bg-slate-900/60 border border-slate-800 text-slate-600 flex items-center justify-center text-[10px] opacity-60">
                  ✕
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Unavailable</span>
                  <span className="text-[10px] text-slate-500">Already booked</span>
                </div>
              </div>

              {/* Temporary Hold (Demonstration) */}
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="w-5 h-5 rounded bg-slate-900/60 border border-amber-800/40 text-amber-500 flex items-center justify-center text-[10px] opacity-75">
                  ⏱
                </div>
                <div>
                  <span className="text-amber-300 font-medium block">Held</span>
                  <span className="text-[10px] text-slate-500">Checkout in progress</span>
                </div>
              </div>
            </div>

            {/* Seat Tiers Price Summary */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
              <span className="text-slate-400 text-[11px] font-mono">Tier Pricing:</span>
              <span className="px-2.5 py-1 rounded-md bg-purple-950/60 border border-purple-800/60 text-purple-300 text-xs">
                VIP: ₹{(event.priceStartingFrom * 2).toLocaleString()}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 text-xs">
                Premium: ₹{Math.round(event.priceStartingFrom * 1.5).toLocaleString()}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-blue-950/60 border border-blue-800/60 text-blue-300 text-xs">
                Standard: ₹{event.priceStartingFrom.toLocaleString()}
              </span>
            </div>
          </div>

        </div>

        {/* Sidebar: Selection Summary & Continue to Booking */}
        <div className="lg:col-span-4 space-y-6">

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center justify-between">
              <span>Booking Summary</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
                {selectedSeatsList.length} {selectedSeatsList.length === 1 ? 'seat' : 'seats'}
              </span>
            </h3>

            {/* Selected Seats List */}
            {selectedSeatsList.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-950/40 border border-slate-800/60 text-center space-y-2">
                <svg className="w-8 h-8 text-slate-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-xs text-slate-400">
                  No seats selected yet. Click any available seat on the venue map to add it.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {selectedSeatsList.map((seat) => (
                  <div
                    key={seat.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/70 border border-slate-700/60 text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">
                        Row {seat.row} · Seat {seat.number}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {seat.section} ({seat.tier})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-400">
                        ₹{seat.price.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleSeat(seat)}
                        className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                        title="Remove seat"
                        aria-label={`Remove seat ${seat.row}${seat.number}`}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Price Breakdown */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Selected Seats:</span>
                <span className="font-mono font-medium text-slate-200">{selectedSeatsList.length}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Estimated Taxes &amp; Fees:</span>
                <span className="font-mono font-medium text-slate-200">
                  {selectedSeatsList.length > 0 ? '₹0 (Included)' : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-sm">
                <span className="font-semibold text-white">Total Amount:</span>
                <span className="font-extrabold text-xl text-emerald-400 font-mono">
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Continue to Booking Button */}
            <button
              id="continue-to-booking-btn"
              type="button"
              disabled={selectedSeatsList.length === 0}
              onClick={handleContinue}
              className={`
                w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200
                flex items-center justify-center gap-2 shadow-lg
                ${
                  selectedSeatsList.length === 0
                    ? 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed opacity-60 shadow-none'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 active:scale-95 cursor-pointer'
                }
              `}
            >
              <span>Continue to Checkout</span>
              <span>→</span>
            </button>

            {selectedSeatsList.length === 0 && (
              <p className="text-[11px] text-slate-500 text-center">
                Select at least one seat to proceed
              </p>
            )}

            {/* Booking Milestone Confirmation Banner */}
            {bookingConfirmed && (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-300 space-y-1.5 animate-fadeIn">
                <div className="flex items-center gap-2 font-bold text-white">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Seat Selection Staged Successfully!</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  {selectedSeatsList.length} {selectedSeatsList.length === 1 ? 'seat' : 'seats'} staged for{' '}
                  <strong className="text-white">{event.title}</strong> (Total: ₹{totalPrice.toLocaleString()}).
                </p>
                <p className="text-[10px] text-emerald-400/80 font-mono pt-1">
                  Ready for checkout module integration in the next task.
                </p>
              </div>
            )}
          </div>

          {/* Backend Readiness Note */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>Backend Readiness Specification</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Seat availability is currently populated from demonstration models. Real-time distributed seat locking (10-minute hold window) will automatically connect to <code className="text-indigo-300 font-mono">POST /events/{event.id}/seats/hold</code> once the Node.js / Express.js backend is active.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default SeatSelectionPage;
