import React from 'react';
import { ShieldCheck, Sparkles, Coins, Sliders } from 'lucide-react';
import { UserProfile } from '../types';
import { isRunningInTelegram, triggerHaptic } from '../lib/telegram';

interface HeaderProps {
  user: UserProfile;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
  onOpenRewards: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenProfile,
  onOpenAdmin,
  onOpenRewards,
}) => {
  const inTelegram = isRunningInTelegram();

  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 w-full max-w-md mx-auto bg-[#080c14]/90 px-4 pt-[max(env(safe-area-inset-top),0.75rem)] pb-3 backdrop-blur-xl border-b border-slate-800/60"
    >
      <div className="flex items-center justify-between gap-2">
        {/* Left: User Profile Pill */}
        <button
          id="btn-header-profile"
          type="button"
          onClick={() => {
            triggerHaptic('light');
            onOpenProfile();
          }}
          className="flex items-center gap-2.5 rounded-full bg-slate-900/80 pl-1 pr-3 py-1 border border-slate-800 hover:border-slate-700 transition-all text-left group"
        >
          <div className="relative">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.firstName}
                referrerPolicy="no-referrer"
                className="h-8 w-8 rounded-full object-cover border border-amber-500/40"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 to-indigo-600 text-xs font-bold text-white border border-amber-500/40">
                {user.firstName.charAt(0)}
              </div>
            )}
            {user.isPremium && (
              <div className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-400 text-[8px] text-slate-950 ring-1 ring-[#080c14]">
                ★
              </div>
            )}
          </div>

          <div className="min-w-0 max-w-[110px]">
            <div className="flex items-center gap-1">
              <span className="truncate text-xs font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                {user.firstName}
              </span>
              {user.accountStatus === 'verified_vip' && (
                <ShieldCheck className="h-3 w-3 text-amber-400 shrink-0" />
              )}
            </div>
            <p className="truncate text-[10px] text-slate-400">
              {user.username ? `@${user.username}` : `ID: ${user.telegramId}`}
            </p>
          </div>
        </button>

        {/* Right: Balance Chip & Quick Admin Action */}
        <div className="flex items-center gap-1.5">
          <button
            id="btn-header-balance"
            type="button"
            onClick={() => {
              triggerHaptic('selection');
              onOpenRewards();
            }}
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-amber-500/10 px-3 py-1.5 border border-amber-500/30 hover:border-amber-400/50 transition-all shadow-sm"
          >
            <Coins className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            <span className="text-xs font-extrabold text-amber-300 font-mono">
              {user.balance.toLocaleString()}
            </span>
            <span className="text-[10px] font-semibold text-amber-400/70">PTS</span>
          </button>

          {/* Admin / Architecture Preview Drawer Toggle */}
          <button
            id="btn-header-admin-toggle"
            type="button"
            onClick={() => {
              triggerHaptic('medium');
              onOpenAdmin();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-300 hover:border-slate-700 transition-colors"
            title="Admin & Architecture Panel"
          >
            <Sliders className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Mini telegram environment ribbon if running in web preview */}
      {!inTelegram && (
        <div className="mt-2 flex items-center justify-between rounded-lg bg-indigo-950/40 px-2.5 py-1 border border-indigo-500/20 text-[10px]">
          <div className="flex items-center gap-1.5 text-indigo-300">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>Telegram WebApp SDK Loaded • Web Preview Mode</span>
          </div>
          <span className="text-[9px] font-mono text-indigo-400/80 bg-indigo-900/60 px-1.5 py-0.5 rounded">
            v8.0 Ready
          </span>
        </div>
      )}
    </header>
  );
};
