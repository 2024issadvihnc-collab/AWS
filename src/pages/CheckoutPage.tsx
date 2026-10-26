import React, { useState } from 'react';
import type { Event, Seat, Booking } from '../types';
import {
  CreditCard,
  Smartphone,
  Building,
  QrCode,
  AlertCircle,
  Ticket,
  Lock,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface CheckoutPageProps {
  event: Event;
  seats: Seat[];
  userEmail?: string;
  onBackToSeats: () => void;
  onContinueToTickets: (booking: Booking) => void;
  onReturnToEvents?: () => void;
}

type PaymentMethodType = 'upi' | 'card' | 'netbanking';
type DeliveryPref = 'mobile-pass' | 'pdf-pass';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {
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

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  event,
  seats,
  userEmail = 'aarav.sharma@spectaclemusic.in',
  onBackToSeats,
  onContinueToTickets,
}) => {
  const [customerName, setCustomerName] = useState('Aarav V. Sharma');
  const [customerPhone, setCustomerPhone] = useState('+91 98110-23030');
  const [emailAddress, setEmailAddress] = useState(userEmail || 'aarav.sharma@spectaclemusic.in');
  const [deliveryPref, setDeliveryPref] = useState<DeliveryPref>('mobile-pass');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('upi');
  const [upiId, setUpiId] = useState('aarav@okhdfcbank');
  const [selectedApp, setSelectedApp] = useState('Google Pay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Financial calculations
  const seatSubtotal = seats.reduce((sum, s) => sum + s.price, 0);
  const gstAmount = Math.round(seatSubtotal * 0.18);
  const platformFee = 99;
  const totalAmount = seatSubtotal + gstAmount + platformFee;

  const handleSimulatePayment = (success: boolean) => {
    setIsProcessing(true);
    setPaymentError(null);

    setTimeout(() => {
      setIsProcessing(false);
      if (success) {
        const bookingId = `TXV-${Math.floor(100000 + Math.random() * 900000)}`;
        const seatNames = seats.map((s) => `${s.row}${s.number}`).join(',');

        const newBooking: Booking = {
          id: `bk_${Date.now()}`,
          bookingRef: bookingId,
          eventId: event.id,
          eventTitle: event.title,
          eventVenue: event.venue,
          eventDate: event.date,
          userId: emailAddress,
          customerName,
          customerEmail: emailAddress,
          customerPhone,
          seats,
          totalAmount,
          status: 'confirmed',
          paymentStatus: 'success',
          paymentMethod:
            paymentMethod === 'upi'
              ? `UPI Instant QR (${selectedApp})`
              : paymentMethod === 'card'
              ? 'Visa Credit Card (•• 4242)'
              : 'HDFC Net Banking',
          deliveryPreference: deliveryPref,
          qrCodeValue: `MOTIVEC::${bookingId}::${event.id}::${seatNames}::${emailAddress}`,
          gateEntry:
            seats.some((s) => s.tier === 'VIP')
              ? 'VIP Gate 01 Entry (Executive Lounge)'
              : 'Concourse Fast-Track Turnstile 02',
          isCheckedIn: false,
          createdAt: new Date().toISOString(),
        };

        try {
          const stored = JSON.parse(localStorage.getItem('tixvent_bookings') || '[]');
          localStorage.setItem('tixvent_bookings', JSON.stringify([newBooking, ...stored]));
        } catch {
          // localStorage fallback
        }

        onContinueToTickets(newBooking);
      } else {
        setPaymentError('Simulated bank gateway timeout. Please retry with UPI or an alternate card.');
      }
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      
      {/* Top Bar: Back Action & Step Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <button
          type="button"
          onClick={onBackToSeats}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-fuchsia-600 transition-colors cursor-pointer px-4 py-2 rounded-full bg-white border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-fuchsia-600" />
          <span>Change Seat Selection</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500 uppercase">
          <span className="text-fuchsia-600">MOTIVEC</span>
          <span>&gt;</span>
          <span>SECURE CHECKOUT</span>
        </div>
      </div>

      {/* Progress Stepper with colourful accents */}
      <div className="flex items-center justify-between max-w-3xl mx-auto px-6 py-3 rounded-full bg-white border border-slate-200 shadow-xs text-xs">
        <div className="flex items-center gap-2 text-emerald-600 font-bold">
          <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-mono">
            ✓
          </span>
          <span className="hidden sm:inline">1. Event</span>
        </div>
        <div className="h-[2px] w-6 sm:w-12 bg-slate-200" />

        <div className="flex items-center gap-2 text-emerald-600 font-bold">
          <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-mono">
            ✓
          </span>
          <span className="hidden sm:inline">2. Seats</span>
        </div>
        <div className="h-[2px] w-6 sm:w-12 bg-slate-200" />

        <div className="flex items-center gap-2 text-fuchsia-700 font-extrabold">
          <span className="w-5 h-5 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white flex items-center justify-center text-[10px] font-mono shadow-sm">
            3
          </span>
          <span>3. Payment</span>
        </div>
        <div className="h-[2px] w-6 sm:w-12 bg-slate-200" />

        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-[10px] font-mono">
            4
          </span>
          <span className="hidden sm:inline">4. Digital Passes</span>
        </div>
      </div>

      {/* Main Grid: Left 7-Cols Form, Right 5-Cols Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7-Columns: Checkout Fields */}
        <div className="lg:col-span-7 space-y-6">

          {/* Section 1: Customer Information */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-display font-bold text-base text-slate-900">
                Customer &amp; Attendee Information
              </h2>
              <span className="text-[11px] text-fuchsia-600 font-medium">Instant QR Delivery</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter attendee full legal name"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100 transition-colors font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
                  Email Address
                </label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="yourname@domain.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono placeholder:text-slate-400 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100 transition-colors font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
                  Mobile Contact
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98000 00000"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono placeholder:text-slate-400 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100 transition-colors font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Ticket Delivery Preference */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
            <h2 className="font-display font-bold text-base text-slate-900 pb-3 border-b border-slate-100">
              Ticket Delivery Preference
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setDeliveryPref('mobile-pass')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  deliveryPref === 'mobile-pass'
                    ? 'bg-fuchsia-50/70 border-fuchsia-500 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-fuchsia-600" />
                    <span className="font-display font-bold text-sm text-slate-900">
                      Mobile Wallet Pass
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    Fast-Track
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Instant Apple Wallet &amp; Google Wallet scannable NFC / QR badge.
                </p>
              </div>

              <div
                onClick={() => setDeliveryPref('pdf-pass')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  deliveryPref === 'pdf-pass'
                    ? 'bg-fuchsia-50/70 border-fuchsia-500 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-indigo-600" />
                    <span className="font-display font-bold text-sm text-slate-900">
                      PDF Print-At-Home
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  High-resolution PDF document sent to your email with receipts.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method with Colorful Brands */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-md space-y-5">
            <h2 className="font-display font-bold text-base text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Select Payment Method</span>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700">
                <Lock className="w-3.5 h-3.5" />
                <span>256-Bit Encrypted</span>
              </div>
            </h2>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'upi', label: 'UPI Instant QR', icon: QrCode, badge: 'Zero Surcharge' },
                { id: 'card', label: 'Credit / Debit', icon: CreditCard },
                { id: 'netbanking', label: 'Net Banking', icon: Building },
              ].map((m) => {
                const isSelected = paymentMethod === m.id;
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as PaymentMethodType)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      isSelected
                        ? 'bg-fuchsia-50 border-fuchsia-500 text-fuchsia-700 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-fuchsia-600" />
                    <span className="text-xs font-bold font-display">{m.label}</span>
                    {m.badge && (
                      <span className="text-[9px] font-mono text-emerald-700 font-bold">
                        {m.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* UPI Payment Flow */}
            {paymentMethod === 'upi' && (
              <div className="space-y-4 pt-2">
                <span className="text-xs font-semibold text-slate-700 block">
                  Select your Preferred UPI App:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { name: 'Google Pay', color: 'border-blue-300 bg-blue-50/50 text-blue-700' },
                    { name: 'PhonePe', color: 'border-purple-300 bg-purple-50/50 text-purple-700' },
                    { name: 'Paytm', color: 'border-sky-300 bg-sky-50/50 text-sky-700' },
                    { name: 'BHIM UPI', color: 'border-emerald-300 bg-emerald-50/50 text-emerald-700' },
                  ].map((app) => (
                    <button
                      key={app.name}
                      type="button"
                      onClick={() => setSelectedApp(app.name)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                        selectedApp === app.name
                          ? `${app.color} ring-2 ring-fuchsia-500 font-extrabold shadow-xs`
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {app.name}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="block font-semibold text-slate-700 text-xs">
                    Or Enter Virtual Payment Address (VPA / UPI ID)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. mobile@upi"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100"
                  />
                </div>
              </div>
            )}

            {/* Card Payment Flow */}
            {paymentMethod === 'card' && (
              <div className="space-y-3 pt-2 text-xs">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Card Number</label>
                  <input
                    type="text"
                    defaultValue="4242 •••• •••• 4242"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-semibold text-slate-700">Valid Thru</label>
                    <input
                      type="text"
                      defaultValue="12/28"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-semibold text-slate-700">CVV / CVC</label>
                    <input
                      type="password"
                      defaultValue="888"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {paymentError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{paymentError}</span>
              </div>
            )}

            {/* Action Simulator Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleSimulatePayment(true)}
                className="w-full py-4 px-6 rounded-full font-display font-bold uppercase tracking-wider text-sm text-white bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-500 hover:from-fuchsia-500 hover:to-pink-500 shadow-md shadow-pink-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authorizing ₹{totalAmount.toLocaleString()}…</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{totalAmount.toLocaleString()} &amp; Issue Tickets</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

        {/* Right 5-Columns: Order Summary Ledger */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-5">
            
            <h3 className="font-display font-bold text-lg text-slate-900 pb-3 border-b border-slate-100">
              Booking Ledger
            </h3>

            {/* Event Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-fuchsia-100 text-fuchsia-700">
                  {event.badgeLabel || event.category}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {formatDate(event.date)}
                </span>
              </div>

              <h4 className="font-display font-bold text-base text-slate-900 leading-snug">
                {event.title}
              </h4>

              <p className="text-xs text-slate-500">
                {event.venue} · Doors Open {event.doorsOpenTime || '09:00'} ({formatTime(event.date)})
              </p>
            </div>

            {/* Reserved Seats List */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700 block">
                Reserved Coordinates ({seats.length} Passes)
              </span>
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                {seats.map((seat) => (
                  <div
                    key={seat.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-display font-bold text-slate-900">
                        Row {seat.row} - Seat {seat.number}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {seat.section} ({seat.tier})
                      </span>
                    </div>
                    <span className="font-display font-bold text-slate-900 font-mono-num">
                      ₹{seat.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span>Passes Subtotal</span>
                <span className="font-mono font-medium text-slate-800">₹{seatSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>GST (18%)</span>
                <span className="font-mono font-medium text-slate-800">₹{gstAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Fast-Track Turnstile Fee</span>
                <span className="font-mono font-medium text-slate-800">₹{platformFee}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-base">
                <span className="font-bold text-slate-900 font-display">Total Payable</span>
                <span className="font-display font-extrabold text-2xl text-fuchsia-600 font-mono-num">
                  ₹{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Guarantee Box */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1 text-xs text-emerald-800">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Guaranteed Admission</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                Turnstile barcode valid for primary pass holder &amp; accompanying guests.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>PCI-DSS Level 1 Encrypted Terminal</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default CheckoutPage;
