import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Calendar,
  Sparkles,
  Smartphone,
  Copy,
  Check,
  Vibrate,
  ExternalLink,
  Code2,
  RefreshCw
} from 'lucide-react';
import { UserProfile, TelegramUser } from '../types';
import {
  getTelegramWebApp,
  isRunningInTelegram,
  triggerHaptic,
  setSimulatedUser
} from '../lib/telegram';

interface ProfileSectionProps {
  user: UserProfile;
  onUpdateUser: (newUser: UserProfile) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ user, onUpdateUser }) => {
  const [copiedId, setCopiedId] = useState(false);
  const [isEditingSimUser, setIsEditingSimUser] = useState(false);
  const [simName, setSimName] = useState(user.firstName);
  const [simUsername, setSimUsername] = useState(user.username || '');
  const [simPremium, setSimPremium] = useState(user.isPremium);

  const tgWebApp = getTelegramWebApp();
  const inTelegram = isRunningInTelegram();

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(user.telegramId.toString());
      setCopiedId(true);
      triggerHaptic('success');
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      triggerHaptic('error');
    }
  };

  const handleSaveSimulatedUser = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: TelegramUser = {
      id: user.telegramId,
      first_name: simName.trim() || 'Alex',
      username: simUsername.trim().replace(/^@/, '') || 'alexvance_tg',
      is_premium: simPremium,
      photo_url: user.avatarUrl,
    };
    setSimulatedUser(updated);

    onUpdateUser({
      ...user,
      firstName: updated.first_name,
      username: updated.username,
      isPremium: Boolean(updated.is_premium),
      accountStatus: updated.is_premium ? 'verified_vip' : 'active',
    });

    setIsEditingSimUser(false);
    triggerHaptic('success');
  };

  return (
    <div id="section-profile" className="space-y-4 pb-4">
      {/* Profile Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0e172e] via-[#091122] to-[#080c14] p-5 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col items-center text-center">
          {/* Avatar with VIP ring */}
          <div className="relative mb-3">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.firstName}
                referrerPolicy="no-referrer"
                className="h-20 w-20 rounded-full object-cover ring-4 ring-amber-500/40 shadow-lg shadow-amber-500/10"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-indigo-600 to-purple-600 text-2xl font-black text-white ring-4 ring-amber-500/40">
                {user.firstName.charAt(0)}
              </div>
            )}
            {user.isPremium && (
              <div
                title="Telegram Premium Verified"
                className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-xs font-black text-slate-950 ring-2 ring-[#080c14]"
              >
                ★
              </div>
            )}
          </div>

          {/* Name & Badges */}
          <div className="flex items-center gap-1.5 mb-1">
            <h2 className="text-lg font-extrabold text-white">
              {user.firstName} {user.lastName || ''}
            </h2>
            {user.accountStatus === 'verified_vip' && (
              <ShieldCheck className="h-4 w-4 text-amber-400" />
            )}
          </div>

          <p className="text-xs text-slate-400 mb-2">
            {user.username ? `@${user.username}` : 'No username set'}
          </p>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-0.5 text-xs font-bold text-amber-300">
              {user.accountStatus === 'verified_vip' ? 'VIP Verified Member' : 'Active Member'}
            </span>
            {user.isPremium && (
              <span className="rounded-full bg-blue-500/15 border border-blue-500/30 px-2.5 py-0.5 text-xs font-bold text-blue-300">
                Telegram Premium
              </span>
            )}
          </div>
        </div>

        {/* Details Table */}
        <div className="mt-5 space-y-2 pt-4 border-t border-slate-800 text-xs">
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-400">Telegram User ID</span>
            <button
              type="button"
              onClick={handleCopyId}
              className="flex items-center gap-1 font-mono font-bold text-slate-200 hover:text-amber-300"
            >
              <span>{user.telegramId}</span>
              {copiedId ? (
                <Check className="h-3 w-3 text-emerald-400" />
              ) : (
                <Copy className="h-3 w-3 text-slate-500" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Calendar className="h-3 w-3 text-slate-500" />
              Member Since
            </span>
            <span className="text-slate-200 font-medium">
              {new Date(user.joinedDate).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-slate-400">Referral Code</span>
            <span className="font-mono font-bold text-amber-400">
              {user.referralCode}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Telegram Haptic Feedback Tester */}
      <div className="rounded-3xl bg-slate-900/60 p-4 border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <Vibrate className="h-4 w-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Telegram Haptic Feedback Test
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          Test the native haptic vibrations provided by the Telegram Mini App SDK:
        </p>

        <div className="grid grid-cols-5 gap-1.5">
          <button
            type="button"
            onClick={() => triggerHaptic('light')}
            className="rounded-xl bg-slate-800 p-2 text-center text-[10px] font-bold text-slate-300 hover:bg-slate-700 active:scale-95"
          >
            Light
          </button>
          <button
            type="button"
            onClick={() => triggerHaptic('medium')}
            className="rounded-xl bg-slate-800 p-2 text-center text-[10px] font-bold text-slate-300 hover:bg-slate-700 active:scale-95"
          >
            Medium
          </button>
          <button
            type="button"
            onClick={() => triggerHaptic('heavy')}
            className="rounded-xl bg-slate-800 p-2 text-center text-[10px] font-bold text-slate-300 hover:bg-slate-700 active:scale-95"
          >
            Heavy
          </button>
          <button
            type="button"
            onClick={() => triggerHaptic('success')}
            className="rounded-xl bg-emerald-950/60 border border-emerald-500/30 p-2 text-center text-[10px] font-bold text-emerald-400 hover:bg-emerald-900/60 active:scale-95"
          >
            Success
          </button>
          <button
            type="button"
            onClick={() => triggerHaptic('error')}
            className="rounded-xl bg-rose-950/60 border border-rose-500/30 p-2 text-center text-[10px] font-bold text-rose-400 hover:bg-rose-900/60 active:scale-95"
          >
            Error
          </button>
        </div>
      </div>

      {/* Telegram Mini App Diagnostics Card */}
      <div className="rounded-3xl bg-slate-900/60 p-4 border border-slate-800 text-xs">
        <div className="flex items-center gap-2 mb-2">
          <Smartphone className="h-4 w-4 text-blue-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Telegram WebApp Diagnostics
          </h3>
        </div>

        <div className="space-y-1.5 text-slate-300">
          <div className="flex justify-between py-1 border-b border-slate-800/80">
            <span className="text-slate-400">Environment</span>
            <span className="font-semibold text-white">
              {inTelegram ? 'Inside Telegram App' : 'Browser / Simulator Mode'}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-800/80">
            <span className="text-slate-400">SDK Version</span>
            <span className="font-mono text-amber-400">
              {tgWebApp?.version || '8.0 (Ready)'}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-800/80">
            <span className="text-slate-400">Platform</span>
            <span className="font-mono text-slate-200">
              {tgWebApp?.platform || 'web / preview'}
            </span>
          </div>

          <div className="flex justify-between py-1">
            <span className="text-slate-400">Color Scheme</span>
            <span className="font-mono text-slate-200">
              {tgWebApp?.colorScheme || 'dark'}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Simulator for Testing outside Telegram */}
      {!inTelegram && (
        <div className="rounded-3xl bg-slate-900/60 p-4 border border-slate-800 text-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Simulator Profile Switcher
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsEditingSimUser(!isEditingSimUser)}
              className="text-amber-400 hover:text-amber-300 font-semibold"
            >
              {isEditingSimUser ? 'Cancel' : 'Edit Test Profile'}
            </button>
          </div>

          {isEditingSimUser ? (
            <form onSubmit={handleSaveSimulatedUser} className="mt-3 space-y-2.5">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Telegram First Name
                </label>
                <input
                  type="text"
                  value={simName}
                  onChange={(e) => setSimName(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Telegram Username
                </label>
                <input
                  type="text"
                  value={simUsername}
                  onChange={(e) => setSimUsername(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="sim-premium-checkbox"
                  checked={simPremium}
                  onChange={(e) => setSimPremium(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-amber-500 focus:ring-0"
                />
                <label htmlFor="sim-premium-checkbox" className="text-slate-300">
                  Simulate Telegram Premium Status
                </label>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-amber-500 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
              >
                Apply Test Profile
              </button>
            </form>
          ) : (
            <p className="text-[11px] text-slate-400">
              You can test how TaskEarn renders with custom names, @usernames, or Telegram Premium status while previewing in browser.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
