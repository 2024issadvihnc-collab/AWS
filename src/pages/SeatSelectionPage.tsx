import React, { useEffect, useState, useMemo } from 'react';
import type { Event, Seat, SeatTier, TicketPackageTier } from '../types';
import { fetchSeatsForEvent } from '../api/seats';
import {
  ArrowLeft,
  Clock,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ShieldCheck,
  Check,
  Ticket,
  ArrowRight
} from 'lucide-react';

interface SeatSelectionPageProps {
  event: Event;
  onBack: () => void;
  onContinue?: (selectedSeats: Seat[]) => void;
  initialSelectedSeatIds?: string[];
  preselectedPackage?: TicketPackageTier;
}

export const SeatSelectionPage: React.FC<SeatSelectionPageProps> = ({
  event,
  onBack,
  onContinue,
  initialSelectedSeatIds,
  preselectedPackage,
}) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<Set<string>>(
    () => new Set(initialSelectedSeatIds || [])
  );
  const [loading, setLoading] = useState(true);
  const [filterTier, setFilterTier] = useState<string>(
    preselectedPackage?.color === 'purple' || preselectedPackage?.color === 'gold'
      ? 'VIP'
      : preselectedPackage?.color === 'primary'
      ? 'Premium'
      : 'All'
  );
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(600); // 10:00 countdown
  const [liveEventNotice, setLiveEventNotice] = useState<string | null>(null);

  // Fetch initial seats
  useEffect(() => {
    let cancelled = false;

    fetchSeatsForEvent(event).then(({ seats: loadedSeats }) => {
      if (!cancelled) {
        setSeats(loadedSeats);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [event]);

  // Countdown timer for seat hold window (10 minutes)
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulated peer hold contention updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (seats.length === 0) return;

      const randomIdx = Math.floor(Math.random() * seats.length);
      const targetSeat = seats[randomIdx];

      if (targetSeat && targetSeat.status === 'available' && !selectedSeatIds.has(targetSeat.id)) {
        setSeats((prev) =>
          prev.map((s) => (s.id === targetSeat.id ? { ...s, status: 'held' as const } : s))
        );

        setLiveEventNotice(`Attendee in Sydney held Row ${targetSeat.row}-${targetSeat.number}`);
        setTimeout(() => setLiveEventNotice(null), 4000);
      }
    }, 14000);

    return () => clearInterval(interval);
  }, [seats, selectedSeatIds]);

  const timerFormatted = useMemo(() => {
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [secondsRemaining]);

  // Group seats by row
  const rowsMap = useMemo(() => {
    const map = new Map<string, { tier: SeatTier; section: string; seats: Seat[] }>();
    seats.forEach((seat) => {
      if (!map.has(seat.row)) {
        map.set(seat.row, { tier: seat.tier, section: seat.section, seats: [] });
      }
      map.get(seat.row)!.seats.push(seat);
    });

    map.forEach((val) => {
      val.seats.sort((a, b) => a.number - b.number);
    });

    return map;
  }, [seats]);

  // Filtered rows based on tier chip
  const filteredRows = useMemo(() => {
    const entries = Array.from(rowsMap.entries());
    if (filterTier === 'All') return entries;
    return entries.filter(([, val]) => val.tier.toLowerCase() === filterTier.toLowerCase());
  }, [rowsMap, filterTier]);

  const selectedSeats = useMemo(() => {
    return seats.filter((s) => selectedSeatIds.has(s.id));
  }, [seats, selectedSeatIds]);

  const subtotal = useMemo(() => {
    return selectedSeats.reduce((sum, s) => sum + s.price, 0);
  }, [selectedSeats]);

  const gstAmount = Math.round(subtotal * 0.18);
  const totalAmount = subtotal + gstAmount;

  const handleToggleSeat = (seat: Seat) => {
    if (seat.status !== 'available') return;

    setSelectedSeatIds((prev) => {
      const next = new Set(prev);
      if (next.has(seat.id)) {
        next.delete(seat.id);
      } else {
        if (next.size >= 8) {
          alert('Maximum 8 seats allowed per checkout session.');
          return prev;
        }
        next.add(seat.id);
      }
      return next;
    });
  };

  const handleRemoveSeat = (seatId: string) => {
    setSelectedSeatIds((prev) => {
      const next = new Set(prev);
      next.delete(seatId);
      return next;
    });
  };

  const handleClearSelection = () => {
    setSelectedSeatIds(new Set());
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) return;
    if (onContinue) {
      onContinue(selectedSeats);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      
      {/* Top Bar: Back Action, Breadcrumbs & Hold Window */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4 text-fuchsia-600" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-slate-500 uppercase">
              <span className="text-fuchsia-600">MOTIVEC</span>
              <span>&gt;</span>
              <span>SEAT RESERVATION</span>
            </div>
            <h1 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900">
              {event.title}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 font-body">
              {event.venue} · Interactive Auditorium Seating
            </p>
          </div>
        </div>

        {/* Live Reservation Hold Bar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-fuchsia-50 border border-fuchsia-200 text-xs">
            <Clock className="w-3.5 h-3.5 text-fuchsia-600 animate-pulse" />
            <span className="text-slate-600 font-medium">Hold Window:</span>
            <span className="font-mono font-bold text-fuchsia-700 tracking-wider">
              {timerFormatted}
            </span>
          </div>
        </div>
      </div>

      {/* Main 12-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 8-Columns: Expansive Pan & Zoom Seating Auditorium */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Controls Bar: Tier Filters + Zoom controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
            
            {/* Filter Chips with vibrant colors */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              {[
                { id: 'All', label: 'All Sections' },
                { id: 'VIP', label: 'VIP Executive', color: 'from-fuchsia-600 to-pink-600' },
                { id: 'Premium', label: 'Premium Stalls', color: 'from-indigo-600 to-purple-600' },
                { id: 'Standard', label: 'Standard Arena', color: 'from-cyan-600 to-blue-600' },
                { id: 'Balcony', label: 'Balcony Grandstand', color: 'from-emerald-600 to-teal-600' },
              ].map((tier) => {
                const isActive = filterTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setFilterTier(tier.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? tier.color
                          ? `bg-gradient-to-r ${tier.color} text-white shadow-md`
                          : 'bg-slate-900 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tier.label}
                  </button>
                );
              })}
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.1))}
                className="p-1.5 text-slate-600 hover:text-slate-900 rounded-full transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono px-1.5 font-bold text-slate-700">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                className="p-1.5 text-slate-600 hover:text-slate-900 rounded-full transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="p-1.5 text-slate-600 hover:text-slate-900 rounded-full transition-colors cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Live Contention Toast */}
          {liveEventNotice && (
            <div className="p-3 rounded-2xl bg-fuchsia-50 border border-fuchsia-200 text-xs text-fuchsia-900 flex items-center justify-between shadow-xs transition-all animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-fuchsia-600 animate-ping" />
                <span className="font-mono text-xs font-semibold">{liveEventNotice}</span>
              </div>
              <span className="text-[10px] font-mono text-fuchsia-700 font-bold uppercase">Real-Time Sync</span>
            </div>
          )}

          {/* Auditorium Seating Viewport */}
          <div className="relative rounded-3xl overflow-hidden bg-[#070919] border border-slate-800 shadow-xl p-6 sm:p-10 auditorium-stage-glow min-h-[520px] flex flex-col justify-between">
            
            {/* Stage Curve Banner with Ambient Stage Glare */}
            <div className="space-y-3 text-center mb-8">
              <div className="relative max-w-xl mx-auto">
                {/* Stage curved rim with multi-hue gradient */}
                <div className="h-3 w-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-indigo-500 rounded-full shadow-[0_4px_28px_rgba(217,70,239,0.5)]" />
                <div className="absolute inset-x-0 -top-2 flex items-center justify-center">
                  <span className="text-[10px] font-display font-extrabold uppercase tracking-[0.25em] text-white px-4 py-0.5 rounded-full bg-[#0a0d24] border border-fuchsia-400/60 shadow-sm">
                    MAIN KEYNOTE STAGE
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 font-body">
                Audience line of sight faces north toward stage
              </p>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="py-24 text-center space-y-3">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-fuchsia-500 border-t-transparent" />
                <p className="text-xs text-slate-300 font-mono">Calibrating interactive seating grid…</p>
              </div>
            )}

            {/* Seating Grid with Zoom Transform */}
            {!loading && (
              <div
                className="overflow-x-auto pb-6 transition-transform duration-150 origin-top"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <div className="space-y-4 min-w-[620px] mx-auto flex flex-col items-center">
                  {filteredRows.map(([rowLetter, rowData]) => {
                    const half = Math.floor(rowData.seats.length / 2);

                    return (
                      <div key={rowLetter} className="flex items-center gap-3">
                        
                        {/* Row Identifier Left */}
                        <div className="w-8 text-right font-display font-bold text-xs text-slate-400">
                          {rowLetter}
                        </div>

                        {/* Seat Nodes */}
                        <div className="flex items-center gap-2">
                          {rowData.seats.map((seat, idx) => {
                            const isSelected = selectedSeatIds.has(seat.id);
                            const isAvailable = seat.status === 'available';
                            const isHeld = seat.status === 'held';
                            const isBooked = seat.status === 'booked';
                            const isVip = seat.tier === 'VIP';
                            const isPremium = seat.tier === 'Premium';
                            const isBalcony = seat.tier === 'Balcony';
                            const isAisle = idx === half;

                            return (
                              <React.Fragment key={seat.id}>
                                {/* Visual Center Aisle Gap */}
                                {isAisle && <div className="w-5 sm:w-8" aria-hidden="true" />}

                                <button
                                  type="button"
                                  disabled={!isAvailable}
                                  onClick={() => handleToggleSeat(seat)}
                                  aria-label={`Row ${seat.row}, Seat ${seat.number}, ${seat.tier}, ₹${seat.price}`}
                                  title={`${seat.section} · Row ${seat.row}, Seat ${seat.number} · ₹${seat.price.toLocaleString()} (${isSelected ? 'Selected' : seat.status})`}
                                  className={`
                                    relative w-7 h-8 sm:w-8 sm:h-9 seat-horseshoe text-[10px] font-mono font-bold
                                    flex items-center justify-center transition-all duration-150 select-none cursor-pointer
                                    ${
                                      isSelected
                                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-2 border-white shadow-[0_0_18px_rgba(244,63,94,0.7)] scale-110 z-10'
                                        : isAvailable
                                        ? isVip
                                          ? 'bg-fuchsia-950/70 text-fuchsia-300 border border-fuchsia-500 hover:scale-120 hover:bg-fuchsia-600 hover:text-white'
                                          : isPremium
                                          ? 'bg-indigo-950/70 text-indigo-300 border border-indigo-500 hover:scale-120 hover:bg-indigo-600 hover:text-white'
                                          : isBalcony
                                          ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500 hover:scale-120 hover:bg-emerald-600 hover:text-white'
                                          : 'bg-cyan-950/70 text-cyan-300 border border-cyan-500 hover:scale-120 hover:bg-cyan-600 hover:text-white'
                                        : isHeld
                                        ? 'bg-amber-950/80 text-amber-400 border border-amber-600/50 cursor-not-allowed opacity-60'
                                        : 'bg-slate-800 text-slate-500 border-0 cursor-not-allowed opacity-40'
                                    }
                                  `}
                                >
                                  {isSelected ? (
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  ) : isBooked ? (
                                    <span className="text-[8px] opacity-40">✕</span>
                                  ) : isHeld ? (
                                    <span className="text-[8px] text-amber-400">⏱</span>
                                  ) : (
                                    seat.number
                                  )}
                                </button>
                              </React.Fragment>
                            );
                          })}
                        </div>

                        {/* Row Identifier Right */}
                        <div className="w-8 text-left font-display font-bold text-xs text-slate-400">
                          {rowLetter}
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tactile Seat Legend Matrix */}
            <div className="pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              
              {/* Available VIP */}
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="w-6 h-7 seat-horseshoe bg-fuchsia-950 border border-fuchsia-500 text-fuchsia-300 flex items-center justify-center text-[10px] font-mono font-bold">
                  ★
                </div>
                <div>
                  <span className="text-fuchsia-300 font-bold block">VIP Executive</span>
                  <span className="text-[10px] text-slate-400">Rows A - B</span>
                </div>
              </div>

              {/* Premium */}
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="w-6 h-7 seat-horseshoe bg-indigo-950 border border-indigo-500 text-indigo-300 flex items-center justify-center text-[10px] font-mono font-bold">
                  P
                </div>
                <div>
                  <span className="text-indigo-300 font-bold block">Premium Stalls</span>
                  <span className="text-[10px] text-slate-400">Rows C - E</span>
                </div>
              </div>

              {/* Standard */}
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="w-6 h-7 seat-horseshoe bg-cyan-950 border border-cyan-500 text-cyan-300 flex items-center justify-center text-[10px] font-mono font-bold">
                  S
                </div>
                <div>
                  <span className="text-cyan-300 font-bold block">Standard Arena</span>
                  <span className="text-[10px] text-slate-400">Rows F - G</span>
                </div>
              </div>

              {/* Selected */}
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="w-6 h-7 seat-horseshoe bg-gradient-to-r from-pink-500 to-rose-500 text-white flex items-center justify-center text-[10px] font-mono font-bold">
                  ✓
                </div>
                <div>
                  <span className="text-pink-300 font-bold block">Selected</span>
                  <span className="text-[10px] text-slate-400">In Your Cart</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Right 4-Columns: Real-Time Order Ledger & Sticky Cart */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-fuchsia-600" />
                <h3 className="font-display font-bold text-base text-slate-900">
                  Cart Reservation
                </h3>
              </div>
              {selectedSeats.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Selected Seats List */}
            {selectedSeats.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                <Ticket className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500 font-body">
                  Select seat coordinates from the auditorium grid to hold your passes.
                </p>
                <span className="inline-block text-[10px] font-mono text-fuchsia-600 bg-fuchsia-50 px-2.5 py-1 rounded-full font-bold">
                  Up to 8 seats per order
                </span>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                {selectedSeats.map((seat) => (
                  <div
                    key={seat.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-slate-900">
                          Row {seat.row} - Seat {seat.number}
                        </span>
                        <span className={`text-[9px] font-mono uppercase px-2 py-0.2 rounded-full font-bold ${
                          seat.tier === 'VIP'
                            ? 'bg-fuchsia-100 text-fuchsia-700'
                            : seat.tier === 'Premium'
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-cyan-100 text-cyan-700'
                        }`}>
                          {seat.tier}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block truncate max-w-[170px]">
                        {seat.section}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-display font-bold text-slate-900 font-mono-num">
                        ₹{seat.price.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSeat(seat.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition-colors cursor-pointer"
                        title="Remove seat"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Financial Ledger Calculation */}
            {selectedSeats.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Pass Subtotal ({selectedSeats.length} seats)</span>
                  <span className="font-mono font-medium text-slate-800">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Standard GST &amp; Venue Levy (18%)</span>
                  <span className="font-mono font-medium text-slate-800">₹{gstAmount.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-900 font-display">Total Amount</span>
                  <span className="font-display font-extrabold text-xl text-fuchsia-600 font-mono-num">
                    ₹{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Primary Proceed Button */}
            <button
              id="proceed-to-checkout-btn"
              type="button"
              disabled={selectedSeats.length === 0}
              onClick={handleProceed}
              className={`w-full py-3.5 px-6 rounded-full font-display font-bold uppercase tracking-wider text-xs sm:text-sm text-white transition-all flex items-center justify-center gap-2 ${
                selectedSeats.length > 0
                  ? 'bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-500 hover:from-fuchsia-500 hover:to-pink-500 shadow-md shadow-pink-500/25 active:scale-95 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Reassurance */}
            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant Seat Lock &amp; PCI-DSS Verified</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default SeatSelectionPage;
