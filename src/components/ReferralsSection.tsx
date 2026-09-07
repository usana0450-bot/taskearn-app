import React, { useState } from 'react';
import {
  Users,
  Copy,
  Check,
  Share2,
  Gift,
  Coins,
  Sparkles,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { ReferralSummary } from '../types';
import { triggerHaptic, openExternalLink } from '../lib/telegram';

interface ReferralsSectionProps {
  summary: ReferralSummary;
}

export const ReferralsSection: React.FC<ReferralsSectionProps> = ({ summary }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(summary.referralCode);
      setCopiedCode(true);
      triggerHaptic('success');
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      triggerHaptic('error');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(summary.referralLink);
      setCopiedLink(true);
      triggerHaptic('success');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      triggerHaptic('error');
    }
  };

  const handleShareTelegram = () => {
    triggerHaptic('medium');
    const shareText = encodeURIComponent(
      `🚀 Join TaskEarn on Telegram to complete verified micro-tasks and earn rewards!\nUse my referral link to get started:`
    );
    const tgShareUrl = `https://t.me/share/url?url=${encodeURIComponent(
      summary.referralLink
    )}&text=${shareText}`;
    openExternalLink(tgShareUrl);
  };

  return (
    <div id="section-referrals" className="space-y-4 pb-4">
      {/* Header Promo Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#121c33] via-[#0d1424] to-[#080c14] p-5 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5">
          <Gift className="h-4 w-4" />
          <span>Referral Program</span>
        </div>
        <h2 className="text-xl font-black text-white leading-tight">
          Invite Friends & Earn Together
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Receive <strong>+{summary.rewardPerReferralPts} PTS</strong> for each invited friend who completes their first task, plus a <strong>{summary.commissionPercentage}% lifetime commission</strong> on all their task earnings.
        </p>

        {/* Unique Referral Code Box */}
        <div className="mt-4 rounded-2xl bg-black/40 p-3.5 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
            <span>Your Unique Referral Code</span>
            <span className="text-amber-400 font-semibold">Tier 1 Partner</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-lg font-black tracking-widest text-amber-300 select-all">
              {summary.referralCode}
            </span>
            <button
              id="btn-copy-ref-code"
              type="button"
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-700 transition-all active:scale-[0.98]"
            >
              {copiedCode ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-400" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            id="btn-share-telegram"
            type="button"
            onClick={handleShareTelegram}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 py-2.5 px-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:from-blue-400 hover:to-indigo-500 transition-all active:scale-[0.98]"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share in Telegram</span>
          </button>

          <button
            id="btn-copy-ref-link"
            type="button"
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-2.5 px-3 text-xs font-extrabold text-slate-950 shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all active:scale-[0.98]"
          >
            {copiedLink ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Invite Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Referral Statistics Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-slate-900/70 p-3 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
            Total Invited
          </span>
          <span className="text-xl font-black text-white font-mono">
            {summary.totalInvited}
          </span>
          <span className="text-[9px] text-slate-500 block mt-0.5">Friends</span>
        </div>

        <div className="rounded-2xl bg-slate-900/70 p-3 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
            Active Earners
          </span>
          <span className="text-xl font-black text-blue-400 font-mono">
            {summary.activeReferrals}
          </span>
          <span className="text-[9px] text-slate-500 block mt-0.5">Completed tasks</span>
        </div>

        <div className="rounded-2xl bg-slate-900/70 p-3 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
            Commission
          </span>
          <span className="text-xl font-black text-amber-400 font-mono">
            +{summary.totalCommissionPts}
          </span>
          <span className="text-[9px] text-slate-500 block mt-0.5">PTS Earned</span>
        </div>
      </div>

      {/* How it Works Guide */}
      <div className="rounded-3xl bg-slate-900/60 p-4 border border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          How Referrals Work
        </h3>
        <div className="space-y-2.5 text-xs text-slate-300">
          <div className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-amber-400">
              1
            </span>
            <p>
              Send your personal invitation link to friends or post it on Telegram groups.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-amber-400">
              2
            </span>
            <p>
              When your friend launches TaskEarn and completes their first verified task, you instantly receive +150 PTS.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-amber-400">
              3
            </span>
            <p>
              Earn an ongoing 10% commission on all subsequent tasks they complete.
            </p>
          </div>
        </div>
      </div>

      {/* Invited Friends Records */}
      <div className="rounded-3xl bg-slate-900/60 p-4 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-slate-400" />
            Invited Friends ({summary.records.length})
          </h3>
          <span className="text-[10px] text-slate-400">Live Status</span>
        </div>

        <div className="space-y-2">
          {summary.records.map((rec) => (
            <div
              key={rec.id}
              className="flex items-center justify-between gap-2 rounded-xl bg-slate-950/70 p-2.5 border border-slate-800"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white">
                  {rec.referredTelegramName.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    {rec.referredTelegramName}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Joined {new Date(rec.joinedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold font-mono text-amber-400">
                  +{rec.bonusEarned} PTS
                </span>
                <span className="block text-[9px] text-emerald-400 font-semibold">
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
