import React, { useState } from 'react';
import {
  Server,
  Activity,
  Lock,
  RefreshCw,
  Terminal
} from 'lucide-react';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  entity: string;
  status: 'SUCCESS' | 'HOLD' | 'BLOCKED' | 'WARN';
  details: string;
}

const SAMPLE_LOGS: AuditLogEntry[] = [
  { id: 'log-101', timestamp: '22:18:04 IST', action: 'TURNSTILE_SCAN', entity: 'Gate 02', status: 'SUCCESS', details: 'Turnstile gate opened for Order #TXV-984218 (2 passes verified)' },
  { id: 'log-102', timestamp: '22:17:42 IST', action: 'SEAT_HOLD_ACQUIRED', entity: 'Seat B12', status: 'HOLD', details: 'Client sessionId_981a locked Row B Seat 12 for 10-minute checkout window' },
  { id: 'log-103', timestamp: '22:16:11 IST', action: 'PAYMENT_AUTH', entity: 'Gateway UPI', status: 'SUCCESS', details: 'UPI reference captured ₹8,356.00 successfully' },
  { id: 'log-104', timestamp: '22:14:02 IST', action: 'DUPLICATE_ENTRY_PREVENT', entity: 'Turnstile 03', status: 'BLOCKED', details: 'Barcode payload TXV-984218 rescan rejected: Already admitted at 19:14' },
  { id: 'log-105', timestamp: '22:10:55 IST', action: 'DISTRIBUTED_LOCK_EXPIRE', entity: 'Seat F04', status: 'WARN', details: 'Hold window (600s) lapsed without payment. Reverted seat state to Available' },
  { id: 'log-106', timestamp: '22:08:21 IST', action: 'SYSTEM_PROVISION', entity: 'Convention Center', status: 'SUCCESS', details: 'Auditorium matrix calibrated with 360 seat nodes across 4 tiers' },
];

export const AdminHubPage: React.FC = () => {
  const [logs] = useState<AuditLogEntry[]>(SAMPLE_LOGS);
  const [filterAction, setFilterAction] = useState<string>('ALL');

  const filteredLogs = filterAction === 'ALL'
    ? logs
    : logs.filter((l) => l.action.includes(filterAction));

  const handleClearHeldSeats = () => {
    alert('Simulated cleanup: Expired holds flushed from memory. Active locked seats preserved.');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500 uppercase">
            <span className="text-fuchsia-600">MOTIVEC</span>
            <span>&gt;</span>
            <span>ADMIN CONSOLE</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Server className="w-6 h-6 text-fuchsia-600" />
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
              Admin Hub &amp; System Audit
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-body">
            Platform-wide transaction monitoring, distributed seat lock telemetry, and cloud gateway security.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClearHeldSeats}
            className="px-4 py-2 rounded-full text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-fuchsia-600" />
            <span>Flush Expired Holds</span>
          </button>
        </div>
      </div>

      {/* System Health Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono uppercase">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Seat Lock Engine</span>
          </div>
          <div className="font-display font-bold text-xl text-emerald-700">Healthy &amp; Responsive</div>
          <p className="text-[11px] text-slate-400 font-mono">p99 latency: 12ms</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono uppercase">
            <Lock className="w-4 h-4 text-fuchsia-600" />
            <span>Turnstile Gate Sync</span>
          </div>
          <div className="font-display font-bold text-xl text-fuchsia-700">100% Operational</div>
          <p className="text-[11px] text-slate-400 font-mono">Zero duplicate admissions recorded</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono uppercase">
            <Terminal className="w-4 h-4 text-indigo-600" />
            <span>API Gateway Node</span>
          </div>
          <div className="font-display font-bold text-xl text-indigo-700">Cluster asia-south1</div>
          <p className="text-[11px] text-slate-400 font-mono">Uptime: 99.98%</p>
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-fuchsia-600" />
            <h2 className="font-display font-bold text-lg text-slate-900">
              Audit Stream &amp; Cryptographic Event Trail
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {['ALL', 'TURNSTILE', 'HOLD', 'PAYMENT'].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setFilterAction(filter)}
                className={`px-3 py-1 rounded-full font-mono text-[11px] font-bold transition-all cursor-pointer ${
                  filterAction === filter
                    ? 'bg-fuchsia-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100 text-xs font-mono">
          {filteredLogs.map((log) => (
            <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-start sm:items-center gap-2.5">
                <span className="text-slate-400 text-[10px] w-20 shrink-0">{log.timestamp}</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                  log.status === 'SUCCESS'
                    ? 'bg-emerald-100 text-emerald-800'
                    : log.status === 'HOLD'
                    ? 'bg-indigo-100 text-indigo-800'
                    : log.status === 'BLOCKED'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {log.status}
                </span>
                <span className="font-bold text-slate-900">{log.action}</span>
                <span className="text-slate-500 hidden sm:inline">[{log.entity}]</span>
              </div>
              <p className="text-slate-600 text-[11px] max-w-md sm:text-right">{log.details}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdminHubPage;
