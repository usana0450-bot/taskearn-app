import { UserProfile, Task, TaskSubmission, Transaction, ReferralSummary } from '../types';
import { INITIAL_TASKS, INITIAL_TRANSACTIONS, INITIAL_REFERRALS } from '../data/mockData';
import { TelegramUser } from '../types';

const STORAGE_KEY_USER = 'taskearn_user_profile';
const STORAGE_KEY_TASKS = 'taskearn_tasks';
const STORAGE_KEY_SUBMISSIONS = 'taskearn_submissions';
const STORAGE_KEY_TRANSACTIONS = 'taskearn_transactions';
const STORAGE_KEY_REFERRALS = 'taskearn_referrals';

export function getInitialUserProfile(tgUser: TelegramUser): UserProfile {
  const referralCode = `TE${tgUser.id.toString().slice(-4)}${Math.random().toString(36).substring(2, 4).toUpperCase()}`;

  return {
    id: `usr_${tgUser.id}`,
    telegramId: tgUser.id,
    firstName: tgUser.first_name,
    lastName: tgUser.last_name,
    username: tgUser.username,
    avatarUrl: tgUser.photo_url,
    isPremium: Boolean(tgUser.is_premium),
    balance: 150, // Welcome + Day 1 checkin (150 PTS = $0.15)
    pendingRewards: 200, // From 1 pending task submission
    totalEarned: 350,
    accountStatus: tgUser.is_premium ? 'verified_vip' : 'active',
    joinedDate: '2026-03-01T10:00:00Z',
    referralCode,
    completedTaskIds: [],
    streakDays: 1,
    lastCheckinDate: new Date(Date.now() - 86400000).toISOString(),
  };
}

export function loadUserProfile(tgUser: TelegramUser): UserProfile {
  if (typeof window === 'undefined') return getInitialUserProfile(tgUser);

  const stored = localStorage.getItem(`${STORAGE_KEY_USER}_${tgUser.id}`);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Update with current telegram user details in case changed
      parsed.firstName = tgUser.first_name;
      parsed.lastName = tgUser.last_name;
      parsed.username = tgUser.username;
      if (tgUser.photo_url) parsed.avatarUrl = tgUser.photo_url;
      parsed.isPremium = Boolean(tgUser.is_premium);
      return parsed;
    } catch {
      // fallback
    }
  }

  const initial = getInitialUserProfile(tgUser);
  saveUserProfile(initial);
  return initial;
}

export function saveUserProfile(profile: UserProfile) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${STORAGE_KEY_USER}_${profile.telegramId}`, JSON.stringify(profile));
}

export function loadTasks(): Task[] {
  if (typeof window === 'undefined') return INITIAL_TASKS;
  const stored = localStorage.getItem(STORAGE_KEY_TASKS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(INITIAL_TASKS));
  return INITIAL_TASKS;
}

export function loadSubmissions(telegramId: number): TaskSubmission[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(`${STORAGE_KEY_SUBMISSIONS}_${telegramId}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  // Initial submission example so the user sees a pending task
  const initialSub: TaskSubmission[] = [
    {
      id: 'sub-sample-01',
      taskId: 'task-join-channel',
      userId: `usr_${telegramId}`,
      telegramId,
      taskTitle: 'Join Official Telegram Community',
      rewardAmount: 200,
      proofData: '@sample_user',
      proofType: 'telegram_username',
      status: 'pending_review',
      submittedAt: new Date(Date.now() - 3600000).toISOString(),
    }
  ];
  saveSubmissions(telegramId, initialSub);
  return initialSub;
}

export function saveSubmissions(telegramId: number, submissions: TaskSubmission[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${STORAGE_KEY_SUBMISSIONS}_${telegramId}`, JSON.stringify(submissions));
}

export function loadTransactions(telegramId: number): Transaction[] {
  if (typeof window === 'undefined') return INITIAL_TRANSACTIONS;
  const stored = localStorage.getItem(`${STORAGE_KEY_TRANSACTIONS}_${telegramId}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  saveTransactions(telegramId, INITIAL_TRANSACTIONS);
  return INITIAL_TRANSACTIONS;
}

export function saveTransactions(telegramId: number, transactions: Transaction[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${STORAGE_KEY_TRANSACTIONS}_${telegramId}`, JSON.stringify(transactions));
}

export function loadReferralSummary(telegramId: number, referralCode: string): ReferralSummary {
  const botUsername = 'TaskEarn_bot';
  const referralLink = `https://t.me/${botUsername}/app?startapp=ref_${referralCode}`;

  return {
    referralCode,
    referralLink,
    totalInvited: INITIAL_REFERRALS.length,
    activeReferrals: INITIAL_REFERRALS.filter(r => r.isActive).length,
    totalCommissionPts: INITIAL_REFERRALS.reduce((sum, r) => sum + r.bonusEarned, 0),
    rewardPerReferralPts: 150,
    commissionPercentage: 10,
    records: INITIAL_REFERRALS,
  };
}
