import React, { useState } from 'react';
import type { Event, TicketPackageTier } from '../types';
import {
  MapPin,
  Calendar,
  Clock,
  Ticket,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Volume2,
  Navigation,
  Car,
  Train,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Users
} from 'lucide-react';

interface EventDetailPageProps {
  event: Event;
  onSelectSeats: (event: Event, preselectedPackage?: TicketPackageTier) => void;
  onBackToEvents: () => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({
  event,
  onSelectSeats,
  onBackToEvents,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [selectedPackage, setSelectedPackage] = useState<TicketPackageTier | undefined>(
    event.ticketPackages?.[0]
  );

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      
      {/* Top Nav & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToEvents}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-fuchsia-600 transition-colors cursor-pointer px-4 py-2 rounded-full bg-white border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-fuchsia-600" />
          <span>Back to All Events</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500 uppercase">
          <span className="text-fuchsia-600">MOTIVEC</span>
          <span>&gt;</span>
          <span>EVENTS</span>
          <span>&gt;</span>
          <span className="text-slate-900 truncate max-w-[200px] sm:max-w-xs">{event.title}</span>
        </div>
      </div>

      {/* Hero Showcase Banner matching Keynote Speaker Theme */}
      <section className="relative rounded-3xl overflow-hidden hero-stage-backdrop shadow-xl p-8 sm:p-12 lg:p-14 border border-slate-800 text-white">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050714] via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3.5 py-1 rounded-full font-display font-bold uppercase tracking-wider text-white bg-fuchsia-600 shadow-sm shadow-fuchsia-600/30">
              {event.badgeLabel || event.category}
            </span>
            <span className="px-3 py-1 rounded-full font-mono font-semibold text-cyan-300 bg-cyan-950/70 border border-cyan-500/30">
              Keynote Symposium
            </span>
            <span className="px-3 py-1 rounded-full font-mono font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-500/30">
              Verified Venue
            </span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
            {event.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed font-body">
            {event.subtitle || event.description}
          </p>

          {/* Quick Info Bar */}
          <div className="flex flex-wrap items-center gap-6 pt-5 border-t border-white/15 text-xs sm:text-sm text-slate-200">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="font-medium">{event.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-fuchsia-400 shrink-0" />
              <span>{event.timeRange || formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:ml-auto">
              <span className="text-xs text-slate-400">Passes from</span>
              <span className="font-display font-extrabold text-xl text-white font-mono-num">
                ₹{event.priceStartingFrom.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2-Column Split: Left 8-col detail content, Right 4-col sticky packages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">

          {/* About The Event */}
          <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-[0_4px_20px_rgba(15,23,42,0.04)] space-y-5">
            <h2 className="font-display font-bold text-xl text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-6 rounded-full bg-gradient-to-b from-fuchsia-600 to-indigo-600 inline-block" />
              <span>About The Conference &amp; Event</span>
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed font-body">
              {event.description}
            </p>

            {/* Audio & Venue specs */}
            {event.audioSpecs && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                {event.audioSpecs.map((spec, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center shrink-0">
                      {i === 0 ? <Volume2 className="w-4 h-4" /> : i === 1 ? <Users className="w-4 h-4 text-indigo-600" /> : <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 font-display">
                      {spec}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Speaker Lineup & Agenda */}
          {event.lineup && event.lineup.length > 0 && (
            <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-[0_4px_20px_rgba(15,23,42,0.04)] space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-xl text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-6 rounded-full bg-gradient-to-b from-indigo-600 to-cyan-500 inline-block" />
                  <span>Keynote Speakers &amp; Agenda</span>
                </h2>
                <span className="text-xs font-mono font-bold text-indigo-600 px-3 py-1 rounded-full bg-indigo-50">
                  {event.lineup.length} Featured Sessions
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {event.lineup.map((act) => (
                  <div
                    key={act.id}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-sm text-slate-900">
                        {act.name}
                      </span>
                      <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold ${
                        act.role === 'Keynote Speaker'
                          ? 'bg-fuchsia-100 text-fuchsia-700'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {act.role}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{act.genre}</span>
                      {act.setTime && <span className="font-mono font-semibold text-slate-700">{act.setTime}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Venue & Logistics Information */}
          <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-[0_4px_20px_rgba(15,23,42,0.04)] space-y-5">
            <h2 className="font-display font-bold text-xl text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-500" />
              <span>Venue &amp; Accessibility Information</span>
            </h2>

            {/* Schematic Venue Vector Card */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 text-center space-y-3">
              <div className="max-w-md mx-auto py-2 space-y-2">
                <div className="h-1.5 w-3/4 mx-auto rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-400 shadow-[0_0_16px_rgba(217,70,239,0.5)]" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-fuchsia-300 font-bold block pt-1">
                  MAIN AUDITORIUM KEYNOTE STAGE
                </span>
                <div className="grid grid-cols-3 gap-2 text-xs pt-4">
                  <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
                    <span className="text-[10px] text-slate-400 block">West Wing</span>
                    <span className="text-white font-mono font-semibold">Tier A - C</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-fuchsia-600/30 border border-fuchsia-400/50">
                    <span className="text-[10px] text-fuchsia-300 block font-bold">Executive Zone</span>
                    <span className="text-white font-mono font-bold">VIP Center</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
                    <span className="text-[10px] text-slate-400 block">East Wing</span>
                    <span className="text-white font-mono font-semibold">Tier A - C</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Venue Logistic Details */}
            {event.venueInfo && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                <div className="space-y-1 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-fuchsia-600 font-semibold font-display">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Gates &amp; Entry</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {event.venueInfo.gatesEntry}
                  </p>
                </div>

                <div className="space-y-1 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-amber-600 font-semibold font-display">
                    <Car className="w-3.5 h-3.5" />
                    <span>Parking Reserves</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {event.venueInfo.parking}
                  </p>
                </div>

                <div className="space-y-1 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold font-display">
                    <Train className="w-3.5 h-3.5" />
                    <span>Public Transit</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {event.venueInfo.publicTransit}
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Event Policies & FAQ */}
          {event.faqs && event.faqs.length > 0 && (
            <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-[0_4px_20px_rgba(15,23,42,0.04)] space-y-4">
              <h2 className="font-display font-bold text-xl text-slate-900">
                Frequently Asked Questions
              </h2>

              <div className="space-y-2">
                {event.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-slate-50 border border-slate-200/80 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-slate-800 hover:text-fuchsia-600 transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {openFaqIndex === idx ? (
                        <ChevronUp className="w-4 h-4 text-fuchsia-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    {openFaqIndex === idx && (
                      <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* Right Sticky Sidebar: Ticket Packages (4 cols) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Select Package
                </h3>
                <span className="text-[11px] text-slate-500">Live Inventory Reservation</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                Guaranteed Seats
              </span>
            </div>

            {/* Packages list */}
            <div className="space-y-3">
              {event.ticketPackages?.map((pkg) => {
                const isSelected = selectedPackage?.id === pkg.id;

                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? 'bg-fuchsia-50/70 border-fuchsia-500 shadow-md shadow-fuchsia-500/10'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-display font-bold text-sm text-slate-900">
                            {pkg.name}
                          </h4>
                          {pkg.isPopular && (
                            <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1 font-body">
                          {pkg.description}
                        </p>
                      </div>

                      <div className="text-right shrink-0 ml-3">
                        <span className="font-display font-extrabold text-base text-slate-900 font-mono-num">
                          ₹{pkg.price.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Perks */}
                    <div className="pt-2 border-t border-slate-200/80 flex flex-wrap gap-1.5">
                      {pkg.perks.map((perk, i) => (
                        <span key={i} className="text-[10px] text-slate-600 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5 text-fuchsia-600" />
                          <span>{perk}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Primary Action Button */}
            <button
              id="select-seats-on-map-btn"
              type="button"
              onClick={() => onSelectSeats(event, selectedPackage)}
              className="w-full py-3.5 px-6 rounded-full font-display font-bold uppercase tracking-wider text-xs sm:text-sm text-white bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-500 hover:from-fuchsia-500 hover:to-pink-500 shadow-md shadow-pink-500/25 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>Select Seats on Map</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-slate-500 text-center font-mono">
              10-Minute Hold Window Guaranteed Upon Selection
            </p>

            {/* Trust and Protection Notes */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-600">
              <span className="text-xs font-bold text-slate-800 block">
                Official Motivec Guarantee
              </span>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center gap-2 text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>Verified 100% Genuine QR Pass</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-fuchsia-600 shrink-0" />
                  <span>Instant Mobile Pass Delivery</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default EventDetailPage;
