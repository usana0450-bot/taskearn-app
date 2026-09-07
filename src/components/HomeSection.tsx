import React from 'react';
import {
  Coins,
  Sparkles,
  Flame,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { UserProfile, Task, TaskSubmission, Transaction } from '../types';
import { AdPlacement } from './AdPlacement';
import { triggerHaptic } from '../lib/telegram';

interface HomeSectionProps {
  user: UserProfile;
  tasks: Task[];
  submissions: TaskSubmission[];
  transactions: Transaction[];
  onOpenTask: (task: Task) => void;
  onNavigateTab: (tab: 'tasks' | 'rewards' | 'referrals' | 'profile' | 'help') => void;
  onClaimCheckin: () => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  user,
  tasks,
  submissions,
  transactions,
  onOpenTask,
  onNavigateTab,
  onClaimCheckin,
}) => {
  // Check if today's checkin is available
  const canCheckIn = () => {
    if (!user.lastCheckinDate) return true;
    const last = new Date(user.lastCheckinDate).toDateString();
    const today = new Date().toDateString();
    return last !== today;
  };

  const isCheckinReady = canCheckIn();

  // Featured and top available tasks
  const getSubmissionForTask = (taskId: string) => {
    return submissions.find((s) => s.taskId === taskId);
  };

  const availableTasks = tasks.slice(0, 3);

  return (
    <div id="section-home" className="space-y-4 pb-4">
      {/* Welcome Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0d1527] to-[#0a0f1d] p-4.5 border border-slate-800/90 shadow-xl">
        {/* Subtle decorative glow */}
        <div className="absolute -top-16 -right-16 h-36 w-36 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          {/* User Welcome Row */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.firstName}
                    referrerPolicy="no-referrer"
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-amber-500/40"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-indigo-600 text-sm font-extrabold text-white ring-2 ring-amber-500/40">
                    {user.firstName.charAt(0)}
                  </div>
                )}
                {user.isPremium && (
                  <span
                    title="Telegram Premium"
                    className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[9px] font-bold text-slate-950 ring-1 ring-slate-900"
                  >
                    ★
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-extrabold text-white">
                    Welcome, {user.firstName}
                  </h2>
                  <span className="rounded-full bg-amber-400/10 border border-amber-400/25 px-1.5 py-0.5 text-[9px] font-bold text-amber-300">
                    VIP
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {user.username ? `@${user.username}` : `Telegram ID: ${user.telegramId}`}
                </p>
              </div>
            </div>

            {/* Streak Counter Chip */}
            <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500/15 to-amber-500/15 px-2.5 py-1 border border-orange-500/30">
              <Flame className="h-3.5 w-3.5 text-orange-400 fill-orange-400 animate-pulse" />
              <span className="text-xs font-bold text-orange-300 font-mono">
                {user.streakDays}d Streak
              </span>
            </div>
          </div>

          {/* Balance Display */}
          <div className="rounded-2xl bg-black/40 p-4 border border-slate-800/80 mb-3 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <Coins className="h-3.5 w-3.5 text-amber-400" />
                Current Spendable Balance
              </span>
              <button
                id="btn-home-view-rewards"
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  onNavigateTab('rewards');
                }}
                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-0.5 transition-colors"
              >
                <span>Wallet</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white tracking-tight font-mono">
                  {user.balance.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-amber-400">PTS</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-slate-200">
                  ≈ ${(user.balance * 0.001).toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 block">USD Equiv.</span>
              </div>
            </div>

            {user.pendingRewards > 0 && (
              <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <Clock className="h-3 w-3 text-amber-400" />
                  Pending Review:
                </span>
                <span className="font-bold text-amber-300 font-mono text-[11px]">
                  +{user.pendingRewards.toLocaleString()} PTS (${(user.pendingRewards * 0.001).toFixed(2)})
                </span>
              </div>
            )}
          </div>

          {/* Quick Actions Bar */}
          <div className="grid grid-cols-2 gap-2">
            <button
              id="btn-home-claim-checkin"
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                onClaimCheckin();
              }}
              disabled={!isCheckinReady}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-3 text-xs font-bold transition-all ${
                isCheckinReady
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-[0.98]'
                  : 'bg-slate-800/80 text-slate-400 border border-slate-700/50 cursor-default'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isCheckinReady ? 'Claim Daily +50 PTS' : 'Daily Check-in Claimed'}</span>
            </button>

            <button
              id="btn-home-invite-friends"
              type="button"
              onClick={() => {
                triggerHaptic('light');
                onNavigateTab('referrals');
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 py-2.5 px-3 text-xs font-bold text-slate-200 hover:bg-slate-750 transition-all active:scale-[0.98]"
            >
              <span>Invite Friends (+150 PTS)</span>
              <ArrowRight className="h-3 w-3 text-amber-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Statistics Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-2xl bg-slate-900/70 p-3 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>Total Earned</span>
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-extrabold text-white font-mono">
              {user.totalEarned.toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-slate-400">PTS</span>
          </div>
          <span className="text-[10px] text-emerald-400/90 font-medium">
            ≈ ${(user.totalEarned * 0.001).toFixed(2)} USD
          </span>
        </div>

        <div className="rounded-2xl bg-slate-900/70 p-3 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>Tasks Completed</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-extrabold text-white font-mono">
              {user.completedTaskIds.length}
            </span>
            <span className="text-[10px] font-bold text-slate-400">Finished</span>
          </div>
          <span className="text-[10px] text-blue-400/90 font-medium">
            {tasks.length - user.completedTaskIds.length} tasks ready
          </span>
        </div>
      </div>

      {/* Monetag Ad Slot Ready (Clean placeholder) */}
      <AdPlacement slot="banner" label="Sponsored Partner Placement" />

      {/* Today's Available Tasks Section */}
      <div className="rounded-3xl bg-slate-900/60 p-4 border border-slate-800/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Today's Available Tasks
            </h3>
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
              {tasks.length}
            </span>
          </div>
          <button
            id="btn-home-see-all-tasks"
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onNavigateTab('tasks');
            }}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-0.5"
          >
            <span>View All</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {availableTasks.map((task) => {
            const sub = getSubmissionForTask(task.id);
            const isDone = sub?.status === 'approved';
            const isPending = sub?.status === 'pending_review';

            return (
              <div
                key={task.id}
                id={`home-task-card-${task.id}`}
                className="group flex items-center justify-between gap-3 rounded-2xl bg-[#0e1628] p-3 border border-slate-800/80 hover:border-slate-700 transition-all"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-slate-300">
                      {task.category}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ~{task.estimatedMinutes} min
                    </span>
                  </div>
                  <h4 className="truncate text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                    {task.title}
                  </h4>
                  <div className="mt-1 flex items-center gap-1 text-[11px] font-mono font-bold text-amber-400">
                    <span>+{task.rewardAmount} PTS</span>
                    <span className="text-[9px] text-slate-400 font-sans">
                      (≈ ${(task.rewardAmount * 0.001).toFixed(2)})
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  {isDone ? (
                    <span className="flex items-center gap-1 rounded-xl bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Done
                    </span>
                  ) : isPending ? (
                    <button
                      type="button"
                      onClick={() => onOpenTask(task)}
                      className="flex items-center gap-1 rounded-xl bg-amber-500/15 px-3 py-1.5 text-xs font-bold text-amber-300 border border-amber-500/30"
                    >
                      <Clock className="h-3.5 w-3.5 animate-pulse" />
                      In Review
                    </button>
                  ) : (
                    <button
                      id={`btn-home-start-task-${task.id}`}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        onOpenTask(task);
                      }}
                      className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-amber-500 transition-all active:scale-[0.98] shadow-sm"
                    >
                      Start
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Verified Activity */}
      <div className="rounded-3xl bg-slate-900/60 p-4 border border-slate-800/80">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Recent Activity
          </h3>
          <button
            id="btn-home-view-history"
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onNavigateTab('rewards');
            }}
            className="text-xs font-semibold text-slate-400 hover:text-slate-200"
          >
            History
          </button>
        </div>

        <div className="space-y-2">
          {transactions.slice(0, 3).map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between gap-2 rounded-xl bg-slate-900/80 p-2.5 border border-slate-800/60"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-white">
                    {tx.title}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-bold font-mono text-amber-400">
                  +{tx.amount} PTS
                </span>
                <span className="block text-[9px] text-emerald-400 font-semibold uppercase">
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
