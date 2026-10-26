import React, { useState } from 'react';
import type { Booking } from '../types';
import {
  Ticket,
  Calendar,
  MapPin,
  QrCode,
  ArrowRight
} from 'lucide-react';

interface BookingsPageProps {
  onViewTicket: (booking: Booking) => void;
  onNavigate: (view: string) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export const BookingsPage: React.FC<BookingsPageProps> = ({
  onViewTicket,
  onNavigate,
}) => {
  const [bookings] = useState<Booking[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('tixvent_bookings') || '[]');
      if (stored.length > 0) {
        return stored;
      }
    } catch {
      // ignore
    }

    const sample: Booking = {
      id: 'bk_sample_01',
      bookingRef: 'TXV-984218',
      eventId: 'evt-chatbots-ai',
      eventTitle: 'Chatbots And Virtual Assistants',
      eventVenue: '4821 Ridge Top Cir, Anchorage',
      eventDate: '2026-11-15T10:00:00-08:00',
      userId: 'aarav.sharma@spectaclemusic.in',
      customerName: 'Aarav V. Sharma',
      customerEmail: 'aarav.sharma@spectaclemusic.in',
      customerPhone: '+91 98110-23030',
      seats: [
        { id: 'seat-a3', eventId: 'evt-chatbots-ai', section: 'VIP Executive', row: 'A', number: 3, tier: 'VIP', price: 3499, status: 'booked' },
        { id: 'seat-a4', eventId: 'evt-chatbots-ai', section: 'VIP Executive', row: 'A', number: 4, tier: 'VIP', price: 3499, status: 'booked' },
      ],
      totalAmount: 8356,
      status: 'confirmed',
      paymentStatus: 'success',
      paymentMethod: 'UPI Instant QR (Google Pay)',
      deliveryPreference: 'mobile-pass',
      qrCodeValue: 'MOTIVEC::TXV-984218::evt-chatbots-ai::A3,A4::AUTHENTICATED',
      gateEntry: 'VIP Gate 01 Entry (Executive Lounge)',
      isCheckedIn: false,
      createdAt: '2026-10-25T14:32:00.000Z',
    };
    return [sample];
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      
      {/* Top Header */}
      <div className="space-y-2 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500 uppercase">
          <span className="text-fuchsia-600">MOTIVEC</span>
          <span>&gt;</span>
          <span>MY PASSES</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
              My Bookings &amp; Digital Passes
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-body">
              Manage your confirmed event credentials, QR turnstile passes, and digital receipts.
            </p>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
          <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900">No active bookings</h3>
            <p className="text-xs text-slate-500 mt-1">
              You haven’t secured any event tickets yet. Explore upcoming summits and workshops.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('events')}
            className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-fuchsia-600 to-pink-600 shadow-md shadow-pink-500/25 cursor-pointer"
          >
            Browse All Events
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 hover:border-fuchsia-300 shadow-md hover:shadow-xl space-y-5 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-fuchsia-700 px-3 py-1 rounded-full bg-fuchsia-50 border border-fuchsia-200">
                      {booking.bookingRef}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Confirmed
                    </span>
                    {booking.isCheckedIn && (
                      <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                        Admitted at Gate
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-xl text-slate-900">
                    {booking.eventTitle}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{booking.eventVenue}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{formatDate(booking.eventDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[11px] text-slate-500 block">Total Paid</span>
                  <span className="font-display font-extrabold text-2xl text-slate-900 font-mono-num">
                    ₹{booking.totalAmount.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                    {booking.seats.length} Passes ({booking.seats.map((s) => `${s.row}${s.number}`).join(', ')})
                  </span>
                </div>
              </div>

              {/* Lower Section: Action Controls */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  <span>Gate: <strong className="text-slate-800">{booking.gateEntry}</strong></span>
                </div>

                <button
                  type="button"
                  onClick={() => onViewTicket(booking)}
                  className="px-5 py-2.5 rounded-full text-xs font-display font-bold uppercase tracking-wider bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white shadow-md shadow-pink-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>View Scannable QR Pass</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default BookingsPage;
