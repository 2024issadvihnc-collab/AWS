import React, { useState } from 'react';
import type { Event, Seat } from '../types';
import StatusBadge from '../components/StatusBadge';

interface ConfirmedBookingData {
  bookingId: string;
  event: Event;
  seats: Seat[];
  totalAmount: number;
  customerEmail: string;
  createdAt: string;
}

interface CheckoutPageProps {
  event: Event;
  seats: Seat[];
  userEmail?: string;
  onBackToSeats: () => void;
  onContinueToTickets?: (booking: ConfirmedBookingData) => void;
  onReturnToEvents: () => void;
}

type PaymentSimulationState = 'idle' | 'processing' | 'success' | 'failed' | 'cancelled';

type PaymentMethodType = 'card' | 'upi' | 'netbanking';

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

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  event,
  seats,
  userEmail = 'demo@ticketpulse.com',
  onBackToSeats,
  onContinueToTickets,
  onReturnToEvents,
}) => {
  const [paymentState, setPaymentState] = useState<PaymentSimulationState>('idle');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('card');
  const [processingOutcome, setProcessingOutcome] = useState<string>('');
  const [confirmedBooking, setConfirmedBooking] = useState<ConfirmedBookingData | null>(null);

  // Exact total amount calculated from selected seats (no added charges or fees)
  const totalAmount = seats.reduce((sum, seat) => sum + seat.price, 0);

  // Simulate a payment outcome with a short realistic processing delay
  const handleSimulatePayment = (outcome: 'success' | 'failed' | 'cancelled') => {
    setPaymentState('processing');
    setProcessingOutcome(outcome);

    setTimeout(() => {
      if (outcome === 'success') {
        const bookingId = `BK-${Math.random().toString(36).substring(2, 8).toUpperCase()}-2026`;
        const bookingData: ConfirmedBookingData = {
          bookingId,
          event,
          seats,
          totalAmount,
          customerEmail: userEmail || 'demo@ticketpulse.com',
          createdAt: new Date().toISOString(),
        };
        setConfirmedBooking(bookingData);
        setPaymentState('success');
      } else if (outcome === 'failed') {
        setPaymentState('failed');
      } else {
        setPaymentState('cancelled');
      }
    }, 600);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">

      {/* Stepper Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          {paymentState !== 'success' && (
            <button
              type="button"
              onClick={onBackToSeats}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Seats
            </button>
          )}

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {paymentState === 'success' ? 'Booking Confirmation' : 'Checkout & Payment'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {paymentState === 'success'
                ? 'Your simulated booking has been staged and confirmed.'
                : 'Review your selected seats and test simulated payment outcomes.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge variant="indigo" withDot={false}>
            Demonstration Mode
          </StatusBadge>
          <StatusBadge variant="purple" withDot={false}>
            Simulated Gateway
          </StatusBadge>
        </div>
      </div>

      {/* Main Grid: Left Panel (Payment Interface / Outcomes) and Right Panel (Booking Summary) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ── Left Column: Payment Simulation State Machine ───────────────────── */}
        <div className="lg:col-span-7 space-y-6">

          {/* 1. STATE: Idle / Method Selection & Simulation Triggers */}
          {paymentState === 'idle' && (
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/50 border border-slate-800/90 shadow-xl space-y-6">
              
              {/* Demonstration Notice */}
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/50 text-xs text-indigo-300 space-y-1">
                <div className="flex items-center gap-2 font-semibold text-white">
                  <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Simulated Payment Gateway (No Real Transactions)</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  This interface simulates checkout outcomes for testing. No real payment gateway is contacted, and no financial data or credit card numbers are collected.
                </p>
              </div>

              {/* Customer Account Info */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
                  Account / Ticket Recipient Email
                </label>
                <div className="px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/80 text-sm text-slate-200 font-mono">
                  {userEmail}
                </div>
                <span className="text-[11px] text-slate-500">
                  Confirmation and ticket details will be linked to this account.
                </span>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
                  Select Simulated Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('card')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedMethod === 'card'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-950/40'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-lg mb-1">💳</div>
                    <span className="text-xs font-semibold block">Card (Simulated)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('upi')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedMethod === 'upi'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-950/40'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-lg mb-1">📱</div>
                    <span className="text-xs font-semibold block">UPI / QR (Simulated)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('netbanking')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedMethod === 'netbanking'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-950/40'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-lg mb-1">🏦</div>
                    <span className="text-xs font-semibold block">Net Banking</span>
                  </button>
                </div>
              </div>

              {/* Simulated Card Form Preview */}
              {selectedMethod === 'card' && (
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-3 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-mono">Simulated Test Card</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Test Sandbox Ready</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between font-mono text-slate-300">
                    <span>•••• •••• •••• 4242</span>
                    <span>12/28 · CVV •••</span>
                  </div>
                </div>
              )}

              {/* Simulation Action Triggers */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                    Trigger Simulated Outcome:
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">Pick outcome to test</span>
                </div>

                {/* 1. Simulate Success */}
                <button
                  id="simulate-payment-success-btn"
                  type="button"
                  onClick={() => handleSimulatePayment('success')}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950/40 transition-all duration-200 active:scale-95 flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <svg className="w-5 h-5 text-emerald-200 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-left font-bold">Simulate Payment Success</span>
                  </div>
                  <span className="font-mono text-xs bg-emerald-700/80 px-2.5 py-1 rounded-lg">
                    ₹{totalAmount.toLocaleString()} · OK
                  </span>
                </button>

                {/* 2. Simulate Failure */}
                <button
                  id="simulate-payment-failure-btn"
                  type="button"
                  onClick={() => handleSimulatePayment('failed')}
                  className="w-full py-3 px-4 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/70 font-semibold text-sm transition-all duration-200 active:scale-95 flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <svg className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-left">Simulate Payment Failure</span>
                  </div>
                  <span className="text-xs text-rose-400/80 font-mono">
                    Decline / Card Error
                  </span>
                </button>

                {/* 3. Simulate Cancellation */}
                <button
                  id="simulate-payment-cancel-btn"
                  type="button"
                  onClick={() => handleSimulatePayment('cancelled')}
                  className="w-full py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 font-semibold text-sm transition-all duration-200 active:scale-95 flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <svg className="w-5 h-5 text-slate-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-left">Simulate Payment Cancellation</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    User Aborted
                  </span>
                </button>
              </div>

            </div>
          )}

          {/* 2. STATE: Processing Simulated Payment */}
          {paymentState === 'processing' && (
            <div className="p-10 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Communicating with Simulated Gateway</h3>
                <p className="text-xs text-slate-400 font-mono">
                  Simulating outcome: {processingOutcome.toUpperCase()}…
                </p>
              </div>
            </div>
          )}

          {/* 3. STATE: Payment SUCCESS (Booking Confirmation Screen) */}
          {paymentState === 'success' && confirmedBooking && (
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-emerald-800/60 shadow-2xl shadow-emerald-950/40 space-y-6">
              
              {/* Success Banner */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-950/60 border border-emerald-700/60">
                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/40">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Booking Status: Confirmed
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-900/80 text-emerald-300">
                      Payment Completed
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white">
                    Booking Successful!
                  </h2>
                  <p className="text-xs text-slate-300">
                    Your simulated payment of <strong className="text-white">₹{totalAmount.toLocaleString()}</strong> was approved.
                  </p>
                </div>
              </div>

              {/* Booking Reference Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-500 block uppercase font-mono text-[10px]">Booking Reference</span>
                  <span className="text-white font-mono font-bold text-sm tracking-wide">
                    {confirmedBooking.bookingId}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase font-mono text-[10px]">Payment Outcome</span>
                  <span className="text-emerald-400 font-semibold">Simulated Gateway Approved</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase font-mono text-[10px]">Event Name</span>
                  <span className="text-white font-medium">{event.title}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase font-mono text-[10px]">Venue</span>
                  <span className="text-white font-medium">{event.venue}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase font-mono text-[10px]">Date &amp; Time</span>
                  <span className="text-white font-medium">{formatDate(event.date)} · {formatTime(event.date)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase font-mono text-[10px]">Total Booking Amount</span>
                  <span className="text-emerald-400 font-mono font-bold text-sm">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Confirmed Seats List */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide block">
                  Confirmed Seats ({seats.length})
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {seats.map((seat) => (
                    <div
                      key={seat.id}
                      className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs flex items-center justify-between"
                    >
                      <span className="text-white font-semibold">
                        Row {seat.row} · #{seat.number}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        ₹{seat.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Demonstration Notice */}
              <p className="text-[11px] text-slate-500 italic bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
                Demonstration confirmation only · Real transactional persistence and anti-duplicate QR ticket generation will be activated once the Node.js / Express.js backend is running.
              </p>

              {/* Actions: Continue to Digital Ticket Preview */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  id="view-digital-tickets-btn"
                  type="button"
                  onClick={() => {
                    if (onContinueToTickets) {
                      onContinueToTickets(confirmedBooking);
                    }
                  }}
                  className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-900/40 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue to Digital Tickets</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={onReturnToEvents}
                  className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-sm transition-colors cursor-pointer"
                >
                  Browse Other Events
                </button>
              </div>

            </div>
          )}

          {/* 4. STATE: Payment FAILURE */}
          {paymentState === 'failed' && (
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-rose-800/70 shadow-2xl shadow-rose-950/40 space-y-6">
              
              {/* Failure Banner */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-rose-950/60 border border-rose-800/60">
                <div className="w-12 h-12 rounded-full bg-rose-600 flex items-center justify-center shrink-0 shadow-lg shadow-rose-600/40">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                      Payment Status: Failed
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-900/80 text-rose-300">
                      Error: DECLINED
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white">
                    Simulated Payment Failed
                  </h2>
                  <p className="text-xs text-rose-200">
                    The simulated payment gateway returned a decline response (insufficient funds or bank rejection). No funds were charged.
                  </p>
                </div>
              </div>

              {/* Preserved Event & Seats Notice */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300 font-medium">
                  <span>Preserved Cart Selection:</span>
                  <span className="text-emerald-400 font-mono font-bold">₹{totalAmount.toLocaleString()}</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Your selection of <strong className="text-white">{seats.length} seats</strong> for <strong className="text-white">{event.title}</strong> has been preserved. You can retry the simulated payment or choose another payment method.
                </p>
              </div>

              {/* Failure Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  id="retry-payment-btn"
                  type="button"
                  onClick={() => setPaymentState('idle')}
                  className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-950/40 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Retry Simulated Payment</span>
                </button>

                <button
                  type="button"
                  onClick={onBackToSeats}
                  className="w-full sm:w-auto py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-colors cursor-pointer"
                >
                  Change Seats
                </button>
              </div>

            </div>
          )}

          {/* 5. STATE: Payment CANCELLED */}
          {paymentState === 'cancelled' && (
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-700/80 shadow-2xl space-y-6">
              
              {/* Cancellation Banner */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                  <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Payment Status: Cancelled
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                      No Charges
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white">
                    Payment Cancelled by User
                  </h2>
                  <p className="text-xs text-slate-400">
                    The simulated payment was cancelled. No booking has been confirmed and no charges were made.
                  </p>
                </div>
              </div>

              {/* Preserved Seats Notice */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                <span className="font-semibold text-white block">Your Selected Seats Are Preserved:</span>
                <p className="text-slate-400 text-[11px]">
                  You can resume checkout whenever you are ready. Your {seats.length} selected seats for {event.title} remain staged in your session.
                </p>
              </div>

              {/* Cancellation Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  id="return-to-payment-btn"
                  type="button"
                  onClick={() => setPaymentState('idle')}
                  className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-950/40 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Return to Payment Interface</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={onReturnToEvents}
                  className="w-full sm:w-auto py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-colors cursor-pointer"
                >
                  Return to Events
                </button>
              </div>

            </div>
          )}

        </div>

        {/* ── Right Column: Booking Summary Card (Always Visible) ────────────── */}
        <div className="lg:col-span-5 space-y-6">

          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-slate-800/90 shadow-xl space-y-6 sticky top-24">
            
            {/* Summary Title */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">Booking Summary</h3>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-slate-800 text-slate-300">
                {seats.length} {seats.length === 1 ? 'Seat' : 'Seats'}
              </span>
            </div>

            {/* Event Overview */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-950/70 text-indigo-300 border border-indigo-700/50">
                  {event.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-700/50">
                  {event.status.toUpperCase()}
                </span>
              </div>

              <h4 className="text-lg font-bold text-white leading-snug">
                {event.title}
              </h4>

              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{event.venue}</span>
                </div>

                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatDate(event.date)} · {formatTime(event.date)}</span>
                </div>
              </div>
            </div>

            {/* Selected Seats Itemized List */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide block">
                Selected Seat Identifiers
              </span>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {seats.map((seat) => (
                  <div
                    key={seat.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">
                        Row {seat.row} · Seat {seat.number}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {seat.section} ({seat.tier})
                      </span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400">
                      ₹{seat.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Calculations (No added charges or fees) */}
            <div className="space-y-2 pt-4 border-t border-slate-800 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Number of Selected Seats:</span>
                <span className="font-mono font-semibold text-white">{seats.length}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Additional Charges / Fees:</span>
                <span className="font-mono text-emerald-400">₹0 (None)</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-base font-bold text-white">
                <span>Total Booking Amount:</span>
                <span className="font-mono text-2xl text-emerald-400">
                  ₹{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Change Seats link if not yet completed */}
            {paymentState !== 'success' && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={onBackToSeats}
                  className="text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Change selected seats
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default CheckoutPage;
