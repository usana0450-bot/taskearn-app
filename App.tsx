import React, { useState, useEffect } from 'react';
import { NavTab, Task, TaskSubmission, UserProfile } from './types';
import {
  initTelegramApp,
  getTelegramUser,
  triggerHaptic,
  setupBackButton
} from './lib/telegram';
import {
  loadUserProfile,
  saveUserProfile,
  loadTasks,
  loadSubmissions,
  saveSubmissions,
  loadTransactions,
  saveTransactions,
  loadReferralSummary
} from './lib/storage';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeSection } from './components/HomeSection';
import { TasksSection } from './components/TasksSection';
import { RewardsSection } from './components/RewardsSection';
import { ReferralsSection } from './components/ReferralsSection';
import { ProfileSection } from './components/ProfileSection';
import { HelpSection } from './components/HelpSection';
import { TaskModal } from './components/TaskModal';
import { AdminDrawer } from './components/AdminDrawer';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize Telegram Mini App & load state
  useEffect(() => {
    initTelegramApp();
    const tgUser = getTelegramUser();
    const initialUser = loadUserProfile(tgUser);
    setUser(initialUser);

    const initialTasks = loadTasks();
    setTasks(initialTasks);

    const initialSubs = loadSubmissions(tgUser.id);
    setSubmissions(initialSubs);

    const initialTxs = loadTransactions(tgUser.id);
    setTransactions(initialTxs);
  }, []);

  // BackButton handling when switching away from root tab (Home)
  useEffect(() => {
    if (activeTab !== 'home' && !selectedTask && !isAdminOpen) {
      const cleanup = setupBackButton(() => {
        triggerHaptic('light');
        setActiveTab('home');
      }, true);
      return cleanup;
    }
  }, [activeTab, selectedTask, isAdminOpen]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Claim Daily Check-in
  const handleClaimCheckin = () => {
    if (!user) return;
    const bonus = 50;
    const newStreak = user.streakDays + 1;
    const updatedUser: UserProfile = {
      ...user,
      balance: user.balance + bonus,
      totalEarned: user.totalEarned + bonus,
      streakDays: newStreak,
      lastCheckinDate: new Date().toISOString(),
    };
    setUser(updatedUser);
    saveUserProfile(updatedUser);

    const newTx = {
      id: `tx-checkin-${Date.now()}`,
      userId: user.id,
      telegramId: user.telegramId,
      type: 'daily_checkin',
      title: `Day ${newStreak} Daily Check-in Claimed`,
      subtitle: 'Streak bonus credited',
      amount: bonus,
      status: 'completed' as const,
      createdAt: new Date().toISOString(),
    };
    const updatedTxs = [newTx, ...transactions];
    setTransactions(updatedTxs);
    saveTransactions(user.telegramId, updatedTxs);

    triggerHaptic('success');
    showToast(`+${bonus} PTS Daily Check-in Claimed!`);
  };

  // Submit Task Proof
  const handleSubmitProof = async (taskId: string, proofData: string) => {
    if (!user) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Call server API for submission
    try {
      await fetch(`/api/tasks/${taskId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramId: user.telegramId,
          userName: `${user.firstName} ${user.lastName || ''}`.trim(),
          taskTitle: task.title,
          rewardAmount: task.rewardAmount,
          proofData,
          proofType: task.proofType,
        }),
      });
    } catch {
      // Offline/fallback gracefully
    }

    const newSubmission: TaskSubmission = {
      id: `sub-${Date.now()}`,
      taskId,
      userId: user.id,
      telegramId: user.telegramId,
      taskTitle: task.title,
      rewardAmount: task.rewardAmount,
      proofData,
      proofType: task.proofType,
      status: 'pending_review',
      submittedAt: new Date().toISOString(),
    };

    const updatedSubs = [
      newSubmission,
      ...submissions.filter((s) => s.taskId !== taskId),
    ];
    setSubmissions(updatedSubs);
    saveSubmissions(user.telegramId, updatedSubs);

    // Update pending rewards in user profile
    const updatedUser: UserProfile = {
      ...user,
      pendingRewards: user.pendingRewards + task.rewardAmount,
    };
    setUser(updatedUser);
    saveUserProfile(updatedUser);

    setSelectedTask(null);
    showToast(`Proof submitted! +${task.rewardAmount} PTS under review.`);
  };

  // Admin approval action
  const handleApproveSubmission = (submissionId: string) => {
    if (!user) return;
    const sub = submissions.find((s) => s.id === submissionId);
    if (!sub) return;

    // Update submission
    const updatedSubs = submissions.map((s) =>
      s.id === submissionId
        ? { ...s, status: 'approved' as const, reviewedAt: new Date().toISOString() }
        : s
    );
    setSubmissions(updatedSubs);
    saveSubmissions(user.telegramId, updatedSubs);

    // Release pending rewards into balance
    const updatedUser: UserProfile = {
      ...user,
      balance: user.balance + sub.rewardAmount,
      pendingRewards: Math.max(0, user.pendingRewards - sub.rewardAmount),
      totalEarned: user.totalEarned + sub.rewardAmount,
      completedTaskIds: Array.from(new Set([...user.completedTaskIds, sub.taskId])),
    };
    setUser(updatedUser);
    saveUserProfile(updatedUser);

    // Add transaction
    const newTx = {
      id: `tx-approved-${Date.now()}`,
      userId: user.id,
      telegramId: user.telegramId,
      type: 'task_reward',
      title: `Reward Approved: ${sub.taskTitle}`,
      subtitle: 'Verified by TaskEarn Admin',
      amount: sub.rewardAmount,
      status: 'completed' as const,
      createdAt: new Date().toISOString(),
    };
    const updatedTxs = [newTx, ...transactions];
    setTransactions(updatedTxs);
    saveTransactions(user.telegramId, updatedTxs);

    showToast(`Approved! +${sub.rewardAmount} PTS added to balance.`);
  };

  // Admin rejection action
  const handleRejectSubmission = (submissionId: string, reason?: string) => {
    if (!user) return;
    const sub = submissions.find((s) => s.id === submissionId);
    if (!sub) return;

    const updatedSubs = submissions.map((s) =>
      s.id === submissionId
        ? {
            ...s,
            status: 'rejected' as const,
            reviewedAt: new Date().toISOString(),
            rejectionReason: reason || 'Invalid proof',
          }
        : s
    );
    setSubmissions(updatedSubs);
    saveSubmissions(user.telegramId, updatedSubs);

    const updatedUser: UserProfile = {
      ...user,
      pendingRewards: Math.max(0, user.pendingRewards - sub.rewardAmount),
    };
    setUser(updatedUser);
    saveUserProfile(updatedUser);

    showToast('Submission rejected and returned.');
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080c14] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
          <span className="text-xs font-semibold text-slate-400">
            Initializing TaskEarn Telegram Mini App...
          </span>
        </div>
      </div>
    );
  }

  const referralSummary = loadReferralSummary(user.telegramId, user.referralCode);
  const pendingCount = submissions.filter((s) => s.status === 'pending_review').length;
  const availableTasksCount = tasks.length - user.completedTaskIds.length;

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 antialiased font-sans pb-24 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-black text-slate-950 shadow-xl shadow-amber-500/30 transition-all">
          {toastMessage}
        </div>
      )}

      {/* Main Container - Constrained for Telegram Mini App Mobile Experience */}
      <div className="mx-auto max-w-md min-h-screen flex flex-col bg-[#080c14]">
        {/* Sticky Mobile Header */}
        <Header
          user={user}
          onOpenProfile={() => setActiveTab('profile')}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenRewards={() => setActiveTab('rewards')}
        />

        {/* Tab Content Area */}
        <main className="flex-1 px-4 pt-3">
          {activeTab === 'home' && (
            <HomeSection
              user={user}
              tasks={tasks}
              submissions={submissions}
              transactions={transactions}
              onOpenTask={(task) => setSelectedTask(task)}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onClaimCheckin={handleClaimCheckin}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksSection
              tasks={tasks}
              submissions={submissions}
              onOpenTask={(task) => setSelectedTask(task)}
            />
          )}

          {activeTab === 'rewards' && (
            <RewardsSection
              user={user}
              transactions={transactions}
              onSimulateWithdrawalNotice={() => {
                showToast(
                  user.balance >= 1000
                    ? 'Withdrawal queued! Threshold met for next batch payout.'
                    : 'Minimum 1,000 PTS ($1.00 USD) required to withdraw.'
                );
              }}
            />
          )}

          {activeTab === 'referrals' && (
            <ReferralsSection summary={referralSummary} />
          )}

          {activeTab === 'profile' && (
            <ProfileSection
              user={user}
              onUpdateUser={(updated) => {
                setUser(updated);
                saveUserProfile(updated);
              }}
            />
          )}

          {activeTab === 'help' && <HelpSection />}
        </main>

        {/* Bottom Navigation */}
        <Navigation
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          availableTasksCount={availableTasksCount}
          pendingRewardsCount={pendingCount}
        />

        {/* Task Details & Proof Modal */}
        {selectedTask && (
          <TaskModal
            task={selectedTask}
            user={user}
            existingSubmission={submissions.find((s) => s.taskId === selectedTask.id)}
            onClose={() => setSelectedTask(null)}
            onSubmitProof={handleSubmitProof}
          />
        )}

        {/* Admin Review & Architecture Console Drawer */}
        <AdminDrawer
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          submissions={submissions}
          onApproveSubmission={handleApproveSubmission}
          onRejectSubmission={handleRejectSubmission}
        />
      </div>
    </div>
  );
}
