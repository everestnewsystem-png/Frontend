// Maintainence.jsx
import React from "react";

const Maintenance = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="relative mx-auto mb-6 h-20 w-20">
          <div className="absolute inset-0 rounded-full border border-slate-700" />
          <div className="absolute inset-2 rounded-full border border-slate-600 animate-ping opacity-40" />
          <div className="relative h-full w-full flex items-center justify-center rounded-full bg-slate-900 shadow-lg shadow-black/40">
            <span className="text-3xl animate-spin-slow">⚙️</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
          We’ll be right back
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-300 mb-4">
          Our system is currently under maintenance to improve performance and
          stability.  
        </p>

        <p className="text-xs sm:text-sm text-slate-400 mb-6">
          Please check back in a while. You can try refreshing the page or
          come back later.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/20 transition"
          >
            Try Again
          </button>

          <div className="text-[11px] sm:text-xs text-slate-500">
            Status:{" "}
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              Under maintenance
            </span>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-8 text-[11px] sm:text-xs text-slate-500">
          If this persists, please contact support.
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
