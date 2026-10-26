import React, { useState } from 'react';
import { Lock, Mail, User, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import { KNOWN_CITIES } from '../utils/geolocation';

interface SignInPageProps {
  onSignInSuccess?: (user: { email: string; name?: string; city?: string }) => void;
  onNavigate?: (view: string) => void;
  initialMode?: 'signin' | 'create';
}

export const SignInPage: React.FC<SignInPageProps> = ({
  onSignInSuccess,
  onNavigate,
  initialMode = 'signin',
}) => {
  const [mode, setMode] = useState<'signin' | 'create'>(initialMode);
  
  // Form fields
  const [name, setName] = useState('Aarav V. Sharma');
  const [email, setEmail] = useState('aarav.sharma@spectaclemusic.in');
  const [password, setPassword] = useState('password123');
  const [selectedCity, setSelectedCity] = useState('Auto-Detect via GPS');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(mode === 'create' ? 'Account created successfully!' : 'Signed in successfully!');
      
      setTimeout(() => {
        if (onSignInSuccess) {
          onSignInSuccess({
            email,
            name: mode === 'create' ? name : name || email.split('@')[0],
            city: selectedCity === 'Auto-Detect via GPS' ? undefined : selectedCity,
          });
        }
      }, 500);
    }, 450);
  };

  const handleQuickDemoLogin = (demoName: string, demoEmail: string, demoCity: string) => {
    setName(demoName);
    setEmail(demoEmail);
    setSelectedCity(demoCity);
    if (onSignInSuccess) {
      onSignInSuccess({
        email: demoEmail,
        name: demoName,
        city: demoCity,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[82vh] px-4 py-12">
      <div className="w-full max-w-md space-y-6">

        {/* Brand Lockup Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-fuchsia-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-fuchsia-500/25">
            <svg
              className="w-7 h-7 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
            {mode === 'create' ? 'Create Attendee Account' : 'Welcome Back to Motivec'}
          </h1>
          <p className="text-xs text-slate-500 font-body">
            {mode === 'create'
              ? 'Join to unlock personalized nearest events, live seat holding, and instant digital passes.'
              : 'Sign in to access your confirmed seats, digital QR passes, and local venue updates.'}
          </p>
        </div>

        {/* Card Container */}
        <div className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-5">
          
          {/* Mode Switcher Tabs */}
          <div className="flex items-center p-1 rounded-full bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('create');
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                mode === 'create'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name for Create Mode */}
            {mode === 'create' && (
              <div className="space-y-1.5 animate-fadeIn">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  Full Legal Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100 font-medium"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                Account Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@domain.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100 font-medium"
                />
              </div>
            </div>

            {/* Preferred / Current City for Create Mode */}
            {mode === 'create' && (
              <div className="space-y-1.5 animate-fadeIn">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  Home City / Region
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500 pointer-events-none" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100 appearance-none cursor-pointer"
                  >
                    <option value="Auto-Detect via GPS">📍 Auto-Detect via GPS Location</option>
                    {Object.keys(KNOWN_CITIES).map((city) => (
                      <option key={city} value={city}>
                        {city} ({KNOWN_CITIES[city].country})
                      </option>
                    ))}
                  </select>
                </div>
                <span className="text-[10px] text-slate-500 block">
                  We’ll automatically prioritize events nearest to your location first.
                </span>
              </div>
            )}

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100 font-medium"
                />
              </div>
            </div>

            {/* Success feedback */}
            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full text-xs font-display font-bold uppercase tracking-wider bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-500 hover:from-fuchsia-500 hover:to-pink-500 text-white shadow-md shadow-pink-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to Portal…</span>
                </>
              ) : (
                <>
                  <span>{mode === 'create' ? 'Create Account & Discover Nearby Events' : 'Sign In & Access Passes'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick One-Click Demo Logins */}
          <div className="pt-3 border-t border-slate-100 text-center space-y-2">
            <span className="text-[11px] text-slate-400 block font-mono font-medium">
              Instant Demo Access for Review
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Aarav Sharma', 'aarav.sharma@spectaclemusic.in', 'Bengaluru')}
                className="py-2 px-3 rounded-xl text-[11px] font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer text-left"
              >
                <div className="font-bold truncate">Aarav (Bengaluru)</div>
                <div className="text-[10px] text-slate-400 font-mono">India Keynotes</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Sarah Jenkins', 'sarah.j@motivec-events.com', 'Anchorage')}
                className="py-2 px-3 rounded-xl text-[11px] font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer text-left"
              >
                <div className="font-bold truncate">Sarah (Anchorage)</div>
                <div className="text-[10px] text-slate-400 font-mono">US Summits</div>
              </button>
            </div>
          </div>

        </div>

        {onNavigate && (
          <p className="text-center text-xs text-slate-500">
            Want to explore events first?{' '}
            <button
              type="button"
              onClick={() => onNavigate('events')}
              className="text-fuchsia-600 font-bold hover:underline cursor-pointer"
            >
              Browse Public Events
            </button>
          </p>
        )}

      </div>
    </div>
  );
};

export default SignInPage;
