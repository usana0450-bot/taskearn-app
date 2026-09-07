import React from 'react';
import { Megaphone, Sparkles } from 'lucide-react';
import { AdPlacementProps } from '../types';

/**
 * AdPlacement component prepared for Monetag or ad network integration.
 * Enables zero-refactor insertion of banner, native, or rewarded ad units.
 */
export const AdPlacement: React.FC<AdPlacementProps> = ({
  slot,
  label = 'Sponsored Ad Placement',
  className = '',
}) => {
  if (slot === 'banner') {
    return (
      <div
        id={`ad-slot-${slot}`}
        className={`w-full rounded-2xl border border-dashed border-slate-700/60 bg-gradient-to-r from-slate-900/60 via-slate-800/40 to-slate-900/60 p-3.5 backdrop-blur-md transition-all ${className}`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Megaphone className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400/90">
                  {label}
                </span>
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-medium text-slate-400">
                  Ready
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Partner campaign or Monetag banner slot placeholder
              </p>
            </div>
          </div>
          <span className="shrink-0 text-[10px] text-slate-400 border border-slate-700/80 rounded px-2 py-1">
            Slot: {slot}
          </span>
        </div>
      </div>
    );
  }

  if (slot === 'rewarded_task') {
    return (
      <div
        id={`ad-slot-${slot}`}
        className={`w-full rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-950/20 via-slate-900/80 to-slate-900/90 p-4 backdrop-blur-md ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                  Rewarded Ad Placement
                </span>
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                  +50 PTS
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Watch short video ad to claim bonus points (Monetag ready)
              </p>
            </div>
          </div>
          <button
            id="btn-ad-placeholder-reward"
            type="button"
            className="rounded-xl bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
            title="Monetag integration ready"
          >
            Reserved
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`ad-slot-${slot}`}
      className={`w-full rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-center ${className}`}
    >
      <span className="text-[10px] tracking-wider text-slate-400 uppercase">
        {label} ({slot})
      </span>
    </div>
  );
};
