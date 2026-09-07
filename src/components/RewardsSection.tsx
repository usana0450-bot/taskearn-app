import React, { useState } from 'react';
import {
  Wallet,
  Coins,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowDownRight,
  TrendingUp,
  History,
  SendHorizontal
} from 'lucide-react';
import { UserProfile, Transaction, WithdrawalMethod } from '../types';
import { triggerHaptic } from '../lib/telegram';

interface RewardsSectionProps {
  user: UserProfile;
  transactions: Transaction[];
  onSimulateWithdrawalNotice: () => void;
}

export const RewardsSection: React.FC<RewardsSectionProps> = ({
  user,
  transactions,
  onSimulateWithdrawalNotice,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<WithdrawalMethod>('TON');
  const [walletAddress, setWalletAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('1000');
  const [filterType, setFilterType] = useState<string>('all');

  const minWithdrawalPts = 1000; // $1.00 USD
  const canWithdraw = user.balance >= minWithdrawalPts;

  const handleWithdrawClick = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('warning');
    onSimulateWithdrawalNotice();
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filterType === 'all') return true;
    if (filterType === 'rewards') return tx.type === 'task_reward';
    if (filterType === 'checkin') return tx.type === 'daily_checkin';
    if (filterType === 'referrals') return tx.type === 'referral_bonus';
    return true;
  });

  return (
    <div id="section-rewards" className="space-y-4 pb-4">
      {/* Rewards Header Balance Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0e172e] via-[#09101f] to-[#080c14] p-5 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="flex items-center gap-1 font-semibold">
            <Wallet className="h-3.5 w-3.5 text-amber-400" />
            Reward Wallet Overview
          </span>
          <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-400/20">
            1,000 PTS = $1.00 USD
          </span>
        </div>

        {/* Big Balance */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-4xl font-black text-white font-mono tracking-tight">
            {user.balance.toLocaleString()}
          </span>
          <span className="text-sm font-bold text-amber-400">PTS</span>
        </div>
        <p className="text-xs text-slate-400">
          Estimated spendable value: <strong className="text-white">${(user.balance * 0.001).toFixed(2)} USD</strong>
        </p>

        {/* Mini stats breakdown */}
        <div className="mt-4 grid grid-cols-2 gap-2 pt-3 border-t border-slate-800">
          <div className="rounded-xl bg-slate-900/60 p-2.5 border border-slate-800">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
              <span>Pending Review</span>
              <Clock className="h-3 w-3 text-amber-400 animate-pulse" />
            </div>
            <span className="text-sm font-bold font-mono text-amber-300">
              +{user.pendingRewards.toLocaleString()} PTS
            </span>
            <span className="text-[9px] text-slate-500 block">
              ${(user.pendingRewards * 0.001).toFixed(2)} USD
            </span>
          </div>

          <div className="rounded-xl bg-slate-900/60 p-2.5 border border-slate-800">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
              <span>Lifetime Earned</span>
              <TrendingUp className="h-3 w-3 text-emerald-400" />
            </div>
            <span className="text-sm font-bold font-mono text-emerald-300">
              {user.totalEarned.toLocaleString()} PTS
            </span>
            <span className="text-[9px] text-slate-500 block">
              ${(user.totalEarned * 0.001).toFixed(2)} USD
            </span>
          </div>
        </div>
      </div>

      {/* Withdrawal Section Placeholder (Fintech VIP standard) */}
      <div className="rounded-3xl bg-slate-900/70 p-4.5 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <SendHorizontal className="h-4 w-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Withdrawal Section
            </h3>
          </div>
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-300 border border-slate-700">
            Rollout Architecture
          </span>
        </div>

        <p className="text-xs text-slate-300 mb-4">
          Direct non-custodial payouts to your Telegram Wallet, TON non-custodial address, or USDT.
        </p>

        {/* Payout method selectors */}
        <div className="grid grid-cols-3 gap-1.5 mb-3.5 select-none">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('selection');
              setSelectedMethod('TON');
            }}
            className={`rounded-xl p-2.5 text-center border transition-all ${
              selectedMethod === 'TON'
                ? 'bg-blue-500/15 border-blue-400 text-blue-300 font-bold'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span className="block text-xs">TON</span>
            <span className="text-[9px] text-slate-500">The Open Net</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('selection');
              setSelectedMethod('USDT_TRC20');
            }}
            className={`rounded-xl p-2.5 text-center border transition-all ${
              selectedMethod === 'USDT_TRC20'
                ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300 font-bold'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span className="block text-xs">USDT</span>
            <span className="text-[9px] text-slate-500">TRC-20 Network</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('selection');
              setSelectedMethod('TELEGRAM_STARS');
            }}
            className={`rounded-xl p-2.5 text-center border transition-all ${
              selectedMethod === 'TELEGRAM_STARS'
                ? 'bg-amber-500/15 border-amber-400 text-amber-300 font-bold'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span className="block text-xs">Stars</span>
            <span className="text-[9px] text-slate-500">TG In-App</span>
          </button>
        </div>

        {/* Withdrawal Form inputs */}
        <form onSubmit={handleWithdrawClick} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              {selectedMethod === 'TON'
                ? 'TON Wallet Address (UQ... or EQ...)'
                : selectedMethod === 'USDT_TRC20'
                ? 'USDT TRC-20 Address (T...)'
                : 'Telegram Username or User ID'}
            </label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder={
                selectedMethod === 'TON'
                  ? 'UQ...'
                  : selectedMethod === 'USDT_TRC20'
                  ? 'T...'
                  : '@username'
              }
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-1">
              <span>Points to Withdraw (Min: {minWithdrawalPts} PTS)</span>
              <span className="text-amber-400 font-mono">
                ≈ ${(Number(withdrawAmount || 0) * 0.001).toFixed(2)} USD
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="100"
                step="100"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-amber-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setWithdrawAmount(user.balance.toString())}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-amber-300 hover:bg-slate-700"
              >
                Max
              </button>
            </div>
          </div>

          {/* Minimum threshold disclaimer */}
          <div className="flex items-start gap-2 rounded-xl bg-amber-950/20 p-2.5 border border-amber-500/20 text-[11px] text-amber-300/90">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <span>
                Minimum withdrawal threshold is <strong>1,000 PTS ($1.00 USD)</strong>. Current spendable balance: <strong>{user.balance} PTS</strong>.
              </span>
            </div>
          </div>

          <button
            id="btn-request-withdrawal"
            type="submit"
            className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-amber-500 transition-all shadow-md shadow-amber-500/20 active:scale-[0.98]"
          >
            <span>
              {canWithdraw
                ? 'Submit Withdrawal Request (Audit)'
                : 'Need More Points to Withdraw'}
            </span>
          </button>
        </form>
      </div>

      {/* Transaction History Section */}
      <div className="rounded-3xl bg-slate-900/70 p-4.5 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-slate-300" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Transaction History
            </h3>
          </div>
          <span className="text-[10px] text-slate-400">
            {filteredTransactions.length} records
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'All' },
            { id: 'rewards', label: 'Task Rewards' },
            { id: 'checkin', label: 'Check-in' },
            { id: 'referrals', label: 'Referrals' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                triggerHaptic('selection');
                setFilterType(item.id);
              }}
              className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
                filterType === item.id
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Transactions list */}
        <div className="space-y-2">
          {filteredTransactions.length === 0 ? (
            <p className="text-center text-xs text-slate-500 py-4">
              No transactions found in this category.
            </p>
          ) : (
            filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between gap-2 rounded-xl bg-slate-950/70 p-2.5 border border-slate-800/80"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ArrowDownRight className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-white">
                      {tx.title}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {tx.subtitle || new Date(tx.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black font-mono text-emerald-400">
                    +{tx.amount} PTS
                  </span>
                  <span className="block text-[9px] text-slate-400">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
