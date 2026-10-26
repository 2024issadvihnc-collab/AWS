import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface LogoSplashScreenProps {
  onComplete: () => void;
  appName?: string;
}

export const LogoSplashScreen: React.FC<LogoSplashScreenProps> = ({
  onComplete,
  appName = 'Motivec',
}) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Progress increment over ~1.8 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 6;
      });
    }, 90);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        setIsFadingOut(true);
        const exitTimeout = setTimeout(() => {
          onComplete();
        }, 500); // match transition duration
        return () => clearTimeout(exitTimeout);
      }, 400);

      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(onComplete, 200);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#050714] text-white transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Stage Crowd Atmosphere */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transform animate-pulse duration-3000 pointer-events-none"
        style={{ backgroundImage: `url('/assets/events/hero-stage-crowd.jpg')` }}
      />

      {/* Radial Gradient Ambient Flares */}
      <div className="absolute inset-0 bg-radial from-fuchsia-600/25 via-purple-900/20 to-[#050714] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-tr from-fuchsia-600/30 via-pink-500/20 to-cyan-500/20 blur-3xl pointer-events-none animate-pulse" />

      {/* Center Logo Flash Branding */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-md space-y-6">
        
        {/* Animated Brand Icon with Glowing Flash Ring */}
        <div className="relative group">
          {/* Pulsing Flash Halo */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-fuchsia-600 via-pink-600 to-indigo-600 opacity-75 blur-xl group-hover:opacity-100 transition duration-1000 animate-pulse" />

          {/* Geometric Mark matching Motivec */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-fuchsia-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-2xl border border-white/30 transform transition-transform duration-500 hover:scale-105">
            <svg
              className="w-12 h-12 text-white drop-shadow-md animate-spin-slow"
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
        </div>

        {/* Title & Tagline */}
        <div className="space-y-1.5">
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight text-white drop-shadow-lg">
            {appName}
          </h1>
          <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.3em] text-fuchsia-400 font-bold">
            CONFERENCE &amp; LIVE SPECTACLE GATEWAY
          </p>
        </div>

        {/* Status text */}
        <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>
            {progress < 40
              ? 'Initializing secure gateway…'
              : progress < 80
              ? 'Calibrating venue seat topologies…'
              : 'Synchronizing nearest live conferences…'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1.5 rounded-full bg-slate-800 overflow-hidden relative border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-400 rounded-full transition-all duration-150 ease-out shadow-[0_0_12px_rgba(217,70,239,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Quick Skip Button */}
        <button
          type="button"
          onClick={handleSkip}
          className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer py-1.5 px-4 rounded-full border border-white/10 hover:border-white/30 bg-white/5 backdrop-blur-xs"
        >
          <span>Enter Portal</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

      </div>

      {/* Footer Branding Note */}
      <div className="absolute bottom-6 text-center text-[10px] text-slate-400 font-mono">
        OFFICIAL MOTIVEC ATTENDEE PORTAL · REAL-TIME VENUE SYNC
      </div>
    </div>
  );
};

export default LogoSplashScreen;
