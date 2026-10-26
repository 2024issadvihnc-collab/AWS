import React, { useState, useMemo } from 'react';
import type { Booking } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import {
  CheckCircle2,
  Download,
  Wallet,
  MapPin,
  Code2,
  ChevronDown,
  ChevronUp,
  Smartphone
} from 'lucide-react';

interface DigitalTicketPageProps {
  booking: Booking;
  onNavigate: (view: string) => void;
}

export interface BookingQRCodeProps {
  bookingId: string;
  customerEmail: string;
  seatList: string;
  size?: number;
}

/**
 * BookingQRCode Component
 * Encodes the booking ID, customer email, and seat list into a standard JSON string
 * and renders a high-contrast SVG QR code via qrcode.react.
 */
export const BookingQRCode: React.FC<BookingQRCodeProps> = ({
  bookingId,
  customerEmail,
  seatList,
  size = 192,
}) => {
  const qrCodeJsonString = useMemo(() => {
    return JSON.stringify({
      bookingId,
      customerEmail,
      seats: seatList,
    });
  }, [bookingId, customerEmail, seatList]);

  return (
    <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 inline-block">
      <QRCodeSVG
        value={qrCodeJsonString}
        size={size}
        level="M"
        bgColor="#ffffff"
        fgColor="#05070a"
        includeMargin={false}
        className="w-48 h-48 block select-none"
      />
    </div>
  );
};

export const DigitalTicketPage: React.FC<DigitalTicketPageProps> = ({
  booking,
  onNavigate,
}) => {
  const [isCheckedIn, setIsCheckedIn] = useState(booking.isCheckedIn || false);
  const [checkedInTime, setCheckedInTime] = useState<string | null>(booking.checkedInAt || null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [showPayloadDetails, setShowPayloadDetails] = useState(false);

  // Derive the seat list string
  const seatList = useMemo(() => {
    return booking.seats.map((s) => `Row ${s.row}-${s.number}`).join(', ');
  }, [booking.seats]);

  // Construct the structured JSON QR payload
  const qrCodeJsonString = useMemo(() => {
    return JSON.stringify({
      bookingId: booking.bookingRef,
      customerEmail: booking.customerEmail,
      seats: seatList,
    }, null, 2);
  }, [booking.bookingRef, booking.customerEmail, seatList]);

  // Turnstile scanner simulation
  const handleSimulateScan = () => {
    if (isCheckedIn) {
      setScanMessage(`[Turnstile Alert] Duplicate entry detected for ${booking.bookingRef}. Already verified at ${checkedInTime}.`);
      return;
    }

    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setIsCheckedIn(true);
    setCheckedInTime(now);
    setScanMessage(`[Gate 02 Verified] Access granted! Scanned: ${booking.bookingRef} | Seats: ${seatList}`);

    try {
      const stored: Booking[] = JSON.parse(localStorage.getItem('tixvent_bookings') || '[]');
      const updated = stored.map((b) =>
        b.bookingRef === booking.bookingRef
          ? { ...b, isCheckedIn: true, checkedInAt: now }
          : b
      );
      localStorage.setItem('tixvent_bookings', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      
      {/* Top Bar: Breadcrumbs & Confirmation Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500 uppercase">
            <span className="text-fuchsia-600">MOTIVEC</span>
            <span>&gt;</span>
            <span>DIGITAL PASS</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 mt-1">
            Confirmed Event Pass
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Reference ID: <span className="font-mono font-bold text-slate-900">{booking.bookingRef}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Payment Verified</span>
        </div>
      </div>

      {/* Main Digital Ticket Pass Card with Vibrant Gradient Top */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Luminous Multi-Color Card Header */}
        <div className="bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 p-6 sm:p-8 text-white relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-fuchsia-200 font-bold block">
                OFFICIAL ADMISSION CREDENTIAL
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                {booking.eventTitle}
              </h2>
              <div className="flex items-center gap-2 text-xs text-fuchsia-100 mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{booking.eventVenue}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-center min-w-[110px]">
                <span className="text-[10px] text-fuchsia-200 uppercase font-mono block">Seats</span>
                <span className="font-display font-bold text-base text-white font-mono-num">
                  {booking.seats.map((s) => `${s.row}${s.number}`).join(', ')}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-center min-w-[120px]">
                <span className="text-[10px] text-fuchsia-200 uppercase font-mono block">Gate Entry</span>
                <span className="font-display font-bold text-xs text-white line-clamp-1">
                  {booking.gateEntry}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mid Section: QR Code Component + Laser Animation + Gate Protocols */}
        <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-12 gap-8 items-start">
          
          {/* QR Code Presentation Container (5 cols) */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-3 shadow-inner relative group">
            {/* Animated Laser Scanning Line */}
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-fuchsia-600 shadow-[0_0_12px_#d946ef] animate-bounce pointer-events-none opacity-80" />

            {/* Dedicated BookingQRCode Component rendering QRCodeSVG */}
            <BookingQRCode
              bookingId={booking.bookingRef}
              customerEmail={booking.customerEmail}
              seatList={seatList}
              size={192}
            />

            <div className="space-y-0.5 pt-1">
              <span className="text-xs font-mono font-bold text-slate-900 tracking-wider block">
                {booking.bookingRef}
              </span>
              <span className="text-[10px] font-mono font-bold text-fuchsia-700 block">
                {seatList}
              </span>
            </div>

            <p className="text-[10px] text-slate-500 max-w-[210px] leading-tight">
              Scanned directly at Turnstile 02 reader. Brightness will auto-adjust upon tap.
            </p>

            {/* Quick payload toggle */}
            <button
              type="button"
              onClick={() => setShowPayloadDetails(!showPayloadDetails)}
              className="text-[10px] text-indigo-700 hover:text-indigo-900 font-mono flex items-center gap-1 cursor-pointer pt-1"
            >
              <Code2 className="w-3 h-3" />
              <span>{showPayloadDetails ? 'Hide Encoded Data' : 'View Encoded Payload'}</span>
              {showPayloadDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Protocols & Attendee Metadata (7 cols) */}
          <div className="sm:col-span-7 space-y-5">
            
            {/* Live Check-In Status */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Turnstile Status</span>
                <span className={`font-display font-bold text-sm ${isCheckedIn ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {isCheckedIn ? 'Checked In & Admitted' : 'Awaiting Gate Scan'}
                </span>
                {checkedInTime && (
                  <span className="text-[10px] text-slate-500 block font-mono">
                    Verified at {checkedInTime}
                  </span>
                )}
              </div>

              {/* Gate Simulator Button */}
              <button
                type="button"
                onClick={handleSimulateScan}
                className="px-4 py-2 rounded-full text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors cursor-pointer"
              >
                Simulate Gate Scan
              </button>
            </div>

            {/* Scan Toast */}
            {scanMessage && (
              <div className={`p-3.5 rounded-2xl border text-xs font-mono leading-relaxed ${
                scanMessage.includes('Duplicate')
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}>
                {scanMessage}
              </div>
            )}

            {/* Explicit QR Encoded Attributes Box */}
            <div className="p-4 rounded-2xl bg-fuchsia-50/50 border border-fuchsia-200 space-y-2 text-xs">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-fuchsia-800 block">
                QR Credential Encoded JSON Fields
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Booking ID:</span>
                  <span className="font-mono text-slate-900 font-bold">{booking.bookingRef}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Customer Email:</span>
                  <span className="font-mono text-slate-900 truncate block">{booking.customerEmail}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 block">Seat Allocation List:</span>
                  <span className="font-mono text-fuchsia-700 font-bold">{seatList}</span>
                </div>
              </div>
            </div>

            {/* Mandatory Venue Protocols */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-display">
                Mandatory Venue Protocols
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-fuchsia-600 font-bold">·</span>
                  <span>Valid physical or digital pass photo identification required for all ticket holders.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-fuchsia-600 font-bold">·</span>
                  <span>Fast-track entry gates close strictly 30 minutes prior to keynote presentation.</span>
                </li>
              </ul>
            </div>

            {/* Attendee Info */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Ticket Holder: <strong className="text-slate-900">{booking.customerName}</strong></span>
              <span>Paid: <strong className="text-emerald-700 font-mono">₹{booking.totalAmount.toLocaleString()}</strong></span>
            </div>

          </div>

        </div>

        {/* Collapsible Decoded QR Payload Inspector */}
        {showPayloadDetails && (
          <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600 font-mono">
              <span className="font-bold text-slate-900">Raw QR Code Payload (Scannable Standard JSON):</span>
              <span>UTF-8 Encoded</span>
            </div>
            <pre className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-800 font-mono text-[11px] overflow-x-auto whitespace-pre leading-relaxed shadow-xs">
              {qrCodeJsonString}
            </pre>
          </div>
        )}

      </div>

      {/* Action Buttons: Apple Wallet, Print PDF, Return */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={() => onNavigate('events')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-fuchsia-600 transition-colors cursor-pointer px-4 py-2.5 rounded-full bg-white border border-slate-200 shadow-xs"
        >
          <span>Return to All Events</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowWalletModal(true)}
            className="px-5 py-2.5 rounded-full text-xs font-display font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white shadow-xs flex items-center gap-2 cursor-pointer transition-all"
          >
            <Wallet className="w-4 h-4 text-fuchsia-400" />
            <span>Add to Apple Wallet</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            className="px-5 py-2.5 rounded-full text-xs font-display font-bold uppercase tracking-wider bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-500 hover:from-fuchsia-500 hover:to-pink-500 text-white shadow-md shadow-pink-500/25 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Pass</span>
          </button>
        </div>
      </div>

      {/* Apple Wallet Simulation Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xl text-slate-900 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-fuchsia-600" />
                <h3 className="font-display font-bold text-base text-slate-900">
                  Apple Wallet Pass
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowWalletModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Your contact-free pass for <strong>{booking.eventTitle}</strong> has been generated and queued for addition to Apple Wallet &amp; Google Wallet.
            </p>

            <div className="p-3.5 rounded-2xl bg-fuchsia-50 border border-fuchsia-200 text-[11px] font-mono space-y-1 text-fuchsia-900">
              <div>Ref: {booking.bookingRef}</div>
              <div>Seats: {seatList}</div>
              <div>Gate: {booking.gateEntry}</div>
            </div>

            <button
              type="button"
              onClick={() => setShowWalletModal(false)}
              className="w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white cursor-pointer shadow-md"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default DigitalTicketPage;
