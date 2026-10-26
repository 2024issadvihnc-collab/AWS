import React from 'react';
import StatusBadge from '../components/StatusBadge';

interface HomePageProps {
  userEmail?: string;
  onNavigate?: (view: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ userEmail, onNavigate }) => {



  const featureCards = [
    {
      title: 'Interactive Seat Selection',
      description: 'Dynamic venue seat matrix with tiered pricing (VIP, Premium, Standard) and real-time visual status updates.',
      status: 'Foundation Ready',
      statusVariant: 'indigo' as const,
      icon: (
        <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: 'Real-Time Seat Holds',
      description: 'Distributed hold mechanism with countdown expiration timer preventing double-booking race conditions.',
      status: 'Data Models Ready',
      statusVariant: 'purple' as const,
      icon: (
        <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Simulated Payments & Checkout',
      description: 'Multi-outcome payment simulation (success/failure) with transactional booking confirmation and rollback.',
      status: 'Types Configured',
      statusVariant: 'emerald' as const,
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
    {
      title: 'Digital Tickets & QR Verification',
      description: 'Tamper-evident digital ticket generation with unique QR payloads and scanner prevention of duplicate check-ins.',
      status: 'Schema Defined',
      statusVariant: 'amber' as const,
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      ),
    },
    {
      title: 'Multi-Role Dashboards',
      description: 'Dedicated portals for Customers (browsing/tickets), Organizers (event creation/metrics), and Admins (audit logs).',
      status: 'Routing Foundation',
      statusVariant: 'indigo' as const,
      icon: (
        <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: 'Cloud-Ready REST API Client',
      description: 'Pre-configured HTTP client targeting the upcoming Node.js and Express.js backend with full TypeScript safety.',
      status: 'Active & Configured',
      statusVariant: 'emerald' as const,
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16">

      {/* Hero Section */}
      <section className="text-center space-y-6 pt-4 pb-2">
        <div className="inline-flex flex-wrap items-center justify-center gap-2">
          <StatusBadge variant="indigo">
            Frontend Foundation Ready
          </StatusBadge>
          <StatusBadge variant="emerald" withDot={false}>
            Vite 8 • React 19 • Tailwind CSS v4
          </StatusBadge>
          {userEmail && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Signed In: <strong className="text-white font-mono">{userEmail}</strong>
            </span>
          )}
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Real-Time Ticket Booking System
        </h1>

        {onNavigate && (
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('events')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition-all duration-200 active:scale-95 flex items-center gap-2"
            >
              Browse Live Events & Shows
              <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </section>

      {/* Architecture Highlights Grid */}
      <section className="space-y-6">
        <div className="text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              System Architecture & Core Modules
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Engineered for seamless integration with upcoming Node.js and Express.js microservices.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            TypeScript 6.0 Strict
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((card) => (
            <div
              key={card.title}
              className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/70 transition-all duration-200 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 group-hover:scale-105 transition-transform duration-200">
                    {card.icon}
                  </div>
                  <StatusBadge variant={card.statusVariant} withDot={false}>
                    {card.status}
                  </StatusBadge>
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">Ready for Implementation</span>
                <span className="text-indigo-400 group-hover:translate-x-1 transition-transform duration-200">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Future Backend Integration Spec */}
      <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Backend Integration Readiness
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Frontend API client (<code className="text-indigo-400 font-mono">src/api/client.ts</code>) is wired to communicate with the planned Node.js & Express.js backend.
            </p>
          </div>
          <StatusBadge variant="purple">
            Node.js / Express Compatible
          </StatusBadge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-400 block mb-1">API Base URL:</span>
            <span className="text-indigo-300 break-all">http://localhost:5000/api</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-400 block mb-1">Auth Scheme:</span>
            <span className="text-emerald-300">Bearer JWT (Ready in Header)</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-400 block mb-1">Payload Format:</span>
            <span className="text-purple-300">Typed JSON (ApiResponse&lt;T&gt;)</span>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
