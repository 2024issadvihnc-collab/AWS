import React, { useState } from 'react';
import { ArrowUpRight, ArrowUp, Mail, Phone } from 'lucide-react';

interface FooterProps {
  onNavigate?: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-auto bg-[#070817] text-[#94A3B8] text-xs">
      
      {/* Upper Section: Signature Newsletter Banner matching screenshot */}
      <div className="border-b border-[#1A1D36] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            
            <div className="text-center lg:text-left space-y-1">
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight uppercase">
                SUBSCRIBE TO OUR NEWSLETTER!
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Get notified about keynote announcements, early bird passes, and VIP summit invitations.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full sm:w-auto flex-1 max-w-md">
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full pl-6 pr-14 py-4 rounded-full bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 shadow-xl"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white flex items-center justify-center shadow-md shadow-fuchsia-600/30 active:scale-95 transition-all cursor-pointer"
                >
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>
              {subscribed && (
                <p className="text-xs text-emerald-400 mt-2 text-center lg:text-left font-mono">
                  ✓ Successfully subscribed to Motivec event updates!
                </p>
              )}
            </form>

          </div>
        </div>
      </div>

      {/* Main Footer Links matching screenshot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-fuchsia-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83-2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>
              <span className="font-display font-bold text-xl text-white">
                Motivec
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Global conference, technology summit, and high-velocity ticketing platform connecting visionaries across the globe.
            </p>
          </div>

          {/* Col 2: Useful Links */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Useful Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('events')}
                  className="hover:text-fuchsia-400 transition-colors cursor-pointer"
                >
                  About Events
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('seat-selection')}
                  className="hover:text-fuchsia-400 transition-colors cursor-pointer"
                >
                  Tickets &amp; Passes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('bookings')}
                  className="hover:text-fuchsia-400 transition-colors cursor-pointer"
                >
                  My Passes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('organizer')}
                  className="hover:text-fuchsia-400 transition-colors cursor-pointer"
                >
                  Speakers &amp; Venue
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('admin')}
                  className="hover:text-fuchsia-400 transition-colors cursor-pointer"
                >
                  Contact &amp; Admin
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Us */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Contact Us
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-fuchsia-500" />
                <span>noreply@obminfotech.com</span>
              </p>
              <p className="flex items-center gap-2 font-mono text-white font-semibold">
                <Phone className="w-3.5 h-3.5 text-fuchsia-500" />
                <span>+(02) 574 - 328 - 301</span>
              </p>
              <p className="text-[11px] text-slate-500 pt-1">
                4821 Ridge Top Cir, Anchorage, AK 99508
              </p>
            </div>
          </div>

          {/* Col 4: Our Social */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Our Social
            </h4>
            <div className="flex items-center gap-3">
              {[
                { name: 'f', label: 'Facebook', bg: 'hover:bg-blue-600' },
                { name: '𝕏', label: 'Twitter', bg: 'hover:bg-slate-700' },
                { name: 'in', label: 'LinkedIn', bg: 'hover:bg-blue-700' },
                { name: '📷', label: 'Instagram', bg: 'hover:bg-pink-600' },
              ].map((s) => (
                <button
                  key={s.label}
                  type="button"
                  aria-label={s.label}
                  className={`w-8 h-8 rounded-full bg-[#181C38] text-white flex items-center justify-center font-bold text-xs ${s.bg} transition-colors cursor-pointer`}
                >
                  {s.name}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 pt-2">
              Follow for daily conference livestreams and backstage interviews.
            </p>
          </div>

        </div>

        {/* Bottom Bar matching screenshot */}
        <div className="mt-12 pt-6 border-t border-[#181C38] flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>Copyright © 2026 Motivec. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Terms &amp; Conditions</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="w-7 h-7 rounded-full bg-[#1A1D3B] hover:bg-fuchsia-600 text-white flex items-center justify-center transition-colors cursor-pointer ml-2"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </footer>
  );
};

export default Footer;
