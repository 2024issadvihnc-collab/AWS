import React from 'react';
import StatusBadge from './StatusBadge';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/70 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                RT
              </div>
              <span className="text-white font-semibold tracking-tight text-base">
                Real-Time Ticket Booking System
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              A high-concurrency cloud computing system featuring live seat holding,
              real-time availability streams, simulated payment gateways, and tamper-proof digital QR tickets.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <StatusBadge variant="slate" withDot={false}>React 19</StatusBadge>
              <StatusBadge variant="slate" withDot={false}>TypeScript</StatusBadge>
              <StatusBadge variant="slate" withDot={false}>Vite</StatusBadge>
              <StatusBadge variant="slate" withDot={false}>Tailwind CSS</StatusBadge>
              <StatusBadge variant="slate" withDot={false}>Node/Express Ready</StatusBadge>
            </div>
          </div>

          {/* Planned Features */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Core Modules
            </h4>
            <ul className="text-sm space-y-1.5 text-slate-400">
              <li className="hover:text-slate-200 transition-colors">Interactive Seat Map</li>
              <li className="hover:text-slate-200 transition-colors">Real-Time Hold Expirations</li>
              <li className="hover:text-slate-200 transition-colors">Digital QR Check-in</li>
              <li className="hover:text-slate-200 transition-colors">Live Organizer Metrics</li>
            </ul>
          </div>

          {/* Cloud Architecture */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Architecture
            </h4>
            <ul className="text-sm space-y-1.5 text-slate-400">
              <li>Frontend: Client-side SPA</li>
              <li>Backend Target: REST + SSE/WS</li>
              <li>State: Optimistic Real-Time</li>
              <li>Security: Role-Based Access</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {CURRENT_YEAR} Real-Time Ticket Booking System. College Cloud Computing Project.</p>
          <p className="font-mono text-slate-400">Frontend Foundation Layer v1.0.0</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
