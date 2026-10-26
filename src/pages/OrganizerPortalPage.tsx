import React, { useState } from 'react';
import type { Event, EventCategory } from '../types';
import { CURATED_EVENTS } from '../api/events';
import {
  QrCode,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  PlusCircle
} from 'lucide-react';

interface OrganizerPortalPageProps {
  onNavigate: (view: string) => void;
  onEventCreated?: (newEvent: Event) => void;
}

export const OrganizerPortalPage: React.FC<OrganizerPortalPageProps> = ({
  onNavigate,
  onEventCreated,
}) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'create' | 'scanner'>('metrics');
  
  // Event creator form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<EventCategory>('AI & Chatbots');
  const [newVenue, setNewVenue] = useState('');
  const [newCity, setNewCity] = useState('Anchorage');
  const [newDate, setNewDate] = useState('2026-12-15T10:00');
  const [newPrice, setNewPrice] = useState('1499');
  const [newSeats, setNewSeats] = useState('320');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [createdSuccess, setCreatedSuccess] = useState(false);

  // Scanner simulator
  const [scanInput, setScanInput] = useState('TXV-984218');
  const [scanResult, setScanResult] = useState<{
    status: 'success' | 'duplicate' | 'invalid';
    message: string;
    ref?: string;
  } | null>(null);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newVenue) return;

    const eventObj: Event = {
      id: `evt-${Date.now()}`,
      title: newTitle,
      subtitle: newSubtitle || 'International keynote symposium & executive workshops.',
      description: newSubtitle || 'Join leading domain visionaries and practitioners for cutting-edge sessions.',
      category: newCategory,
      badgeLabel: 'CONFERENCE',
      badgeColor: 'fuchsia',
      venue: `${newVenue}, ${newCity}`,
      city: newCity,
      date: new Date(newDate).toISOString(),
      timeRange: `${newDate.split('T')[0]}, 10:00 AM – 5:00 PM`,
      doorsOpenTime: '09:00',
      totalSeats: parseInt(newSeats, 10) || 300,
      availableSeats: parseInt(newSeats, 10) || 300,
      priceStartingFrom: parseInt(newPrice, 10) || 1299,
      imageUrl: '/assets/events/card-speaker-podium.jpg',
      organizerId: 'org-motivec',
      status: 'live',
      audioSpecs: ['Spatial Keynote Audio', 'Q&A CatchBox Microphones'],
      ticketPackages: [
        { id: 'p1', name: 'VIP Executive Pass', description: 'Front-row VIP lounge & speaker lunch', price: parseInt(newPrice, 10) * 2, available: true, perks: ['VIP Lounge', 'Fast Entry'], color: 'purple' },
        { id: 'p2', name: 'Full Conference Pass', description: 'General seating and all breakouts', price: parseInt(newPrice, 10), available: true, perks: ['Full Access'], color: 'primary' },
      ],
    };

    CURATED_EVENTS.unshift(eventObj);
    if (onEventCreated) onEventCreated(eventObj);

    setCreatedSuccess(true);
    setTimeout(() => {
      setCreatedSuccess(false);
      setActiveTab('metrics');
    }, 2000);
  };

  const handleRunScan = () => {
    if (!scanInput.trim()) return;

    // Check localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('tixvent_bookings') || '[]');
      const target = stored.find((b: any) => b.bookingRef.toUpperCase() === scanInput.trim().toUpperCase());

      if (!target && scanInput.toUpperCase() !== 'TXV-984218') {
        setScanResult({
          status: 'invalid',
          message: `QR code credential "${scanInput}" was not found in the authentic ticket registry.`,
        });
        return;
      }

      if (target?.isCheckedIn) {
        setScanResult({
          status: 'duplicate',
          message: `DUPLICATE CHECK-IN PREVENTED! Ticket ${scanInput} was already verified at ${target.checkedInAt || '19:14 IST'}.`,
          ref: scanInput,
        });
        return;
      }

      // Mark checked in
      if (target) {
        target.isCheckedIn = true;
        target.checkedInAt = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        localStorage.setItem('tixvent_bookings', JSON.stringify(stored));
      }

      setScanResult({
        status: 'success',
        message: `VALID ADMISSION: Turnstile gate opened for ${target ? target.customerName : 'Aarav V. Sharma'} (${target ? target.seats.length : 2} passes verified).`,
        ref: scanInput,
      });
    } catch {
      setScanResult({ status: 'invalid', message: 'Registry read failure' });
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500 uppercase">
            <span className="text-fuchsia-600">MOTIVEC</span>
            <span>&gt;</span>
            <span>ORGANIZER PORTAL</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
              Organizer Portal &amp; Telemetry
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-body">
            Monitor real-time attendee admissions, gate throughput, seat hold status, and launch new conference sessions.
          </p>
        </div>

        {/* Tab buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-white border border-slate-200 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('metrics')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'metrics'
                ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-md shadow-pink-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Analytics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('scanner')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'scanner'
                ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-md shadow-pink-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Gate Scanner
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-md shadow-pink-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            + Create Event
          </button>
        </div>
      </div>

      {/* Tab 1: Live Analytics & Inventory KPI Tiles */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase text-slate-500">Gross Ticket Sales</span>
              <div className="font-display font-extrabold text-2xl text-slate-900 font-mono-num">
                ₹2,482,500
              </div>
              <span className="text-[11px] text-emerald-700 font-mono font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                +31.4% vs last summit
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase text-slate-500">Seat Occupancy</span>
              <div className="font-display font-extrabold text-2xl text-fuchsia-600 font-mono-num">
                84.2%
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                1,580 / 1,880 seats locked
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase text-slate-500">Turnstile Check-In Rate</span>
              <div className="font-display font-extrabold text-2xl text-indigo-600 font-mono-num">
                842 Attendees
              </div>
              <span className="text-[11px] text-emerald-700 font-mono">
                Turnstiles 01-04 Active
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase text-slate-500">Concurrent Hold Count</span>
              <div className="font-display font-extrabold text-2xl text-slate-900 font-mono-num">
                52 Holds
              </div>
              <span className="text-[11px] text-amber-700 font-mono">
                10-Min Session Expiration
              </span>
            </div>
          </div>

          {/* Active Events Roster Table */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
            <h2 className="font-display font-bold text-lg text-slate-900">
              Active Managed Summits &amp; Conferences
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-mono uppercase text-[10px]">
                    <th className="pb-3">Event Title</th>
                    <th className="pb-3">Venue</th>
                    <th className="pb-3">Available</th>
                    <th className="pb-3">Price From</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {CURATED_EVENTS.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 font-bold font-display text-slate-900">{evt.title}</td>
                      <td className="py-3.5 text-slate-500">{evt.venue}</td>
                      <td className="py-3.5 font-mono text-emerald-700 font-bold">{evt.availableSeats} / {evt.totalSeats}</td>
                      <td className="py-3.5 font-mono font-bold text-slate-900">₹{evt.priceStartingFrom.toLocaleString()}</td>
                      <td className="py-3.5">
                        <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {evt.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => onNavigate('seat-selection')}
                          className="px-3 py-1 rounded-full text-[11px] font-bold text-fuchsia-600 hover:bg-fuchsia-50 transition-colors cursor-pointer"
                        >
                          View Map
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Turnstile Scanner Simulator */}
      {activeTab === 'scanner' && (
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-5">
          <div className="flex items-center gap-2">
            <QrCode className="w-6 h-6 text-fuchsia-600" />
            <h2 className="font-display font-bold text-xl text-slate-900">
              Turnstile Gate Reader Terminal
            </h2>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Test the gate reader logic against booking reference codes. Prevents duplicate admissions and verifies attendee pass validity in real time.
          </p>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              Input Barcode / Booking Reference:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                placeholder="e.g. TXV-984218"
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:border-fuchsia-500"
              />
              <button
                type="button"
                onClick={handleRunScan}
                className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white shadow-md shadow-pink-500/20 cursor-pointer"
              >
                Scan Pass
              </button>
            </div>
          </div>

          {scanResult && (
            <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1 font-mono ${
              scanResult.status === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : scanResult.status === 'duplicate'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <div className="flex items-center gap-1.5 font-bold uppercase text-[11px]">
                {scanResult.status === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                )}
                <span>Gate Scan Result: {scanResult.status}</span>
              </div>
              <p>{scanResult.message}</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Create Event Form */}
      {activeTab === 'create' && (
        <form onSubmit={handleCreateEvent} className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-5">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-fuchsia-600" />
            <h2 className="font-display font-bold text-xl text-slate-900">
              Create New Conference / Summit
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-700">Event Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. NextGen Robotics Symposium"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-fuchsia-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as EventCategory)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-fuchsia-500"
                >
                  <option value="AI & Chatbots">AI &amp; Chatbots</option>
                  <option value="Modern Marketing">Modern Marketing</option>
                  <option value="Workshops">Workshops</option>
                  <option value="Creative Tech">Creative Tech</option>
                  <option value="Deep Tech & ML">Deep Tech &amp; ML</option>
                  <option value="Global Pavilion">Global Pavilion</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">City</label>
                <input
                  type="text"
                  required
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="e.g. Anchorage"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-fuchsia-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-700">Venue Location</label>
              <input
                type="text"
                required
                value={newVenue}
                onChange={(e) => setNewVenue(e.target.value)}
                placeholder="e.g. Grand Horizon Convention Center"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-fuchsia-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Date &amp; Time</label>
                <input
                  type="datetime-local"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Starting Price (₹)</label>
                <input
                  type="number"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Total Capacity</label>
                <input
                  type="number"
                  required
                  value={newSeats}
                  onChange={(e) => setNewSeats(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-700">Summary / Subtitle</label>
              <textarea
                rows={2}
                value={newSubtitle}
                onChange={(e) => setNewSubtitle(e.target.value)}
                placeholder="Brief summary of topics covered…"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white shadow-md shadow-pink-500/20 cursor-pointer"
          >
            Deploy Event To Live Catalog
          </button>

          {createdSuccess && (
            <p className="text-xs text-emerald-700 text-center font-bold">
              ✓ Event created and added to Motivec Catalog!
            </p>
          )}
        </form>
      )}

    </div>
  );
};

export default OrganizerPortalPage;
