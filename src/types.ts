/**
 * TaskEarn - Types & Database Models Architecture
 * Designed for modularity, server-side validation, and ready for Firebase Firestore persistence.
 */

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: TelegramUser;
    auth_date?: string;
    hash?: string;
    start_param?: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  BackButton: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
  openTelegramLink: (url: string) => void;
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

// 1. Users Model (compatible with Firestore `users` collection)
export interface UserProfile {
  id: string; // Internal ID or Telegram ID as string
  telegramId: number;
  firstName: string;
  lastName?: string;
  username?: string;
  avatarUrl?: string;
  isPremium: boolean;
  balance: number; // Current approved, spendable points (1,000 PTS = $1.00 USD)
  pendingRewards: number; // Rewards from submissions under review
  totalEarned: number; // Lifetime earnings
  accountStatus: 'active' | 'suspended' | 'verified_vip';
  joinedDate: string; // ISO string
  referralCode: string;
  referredBy?: string; // Referral code of referrer
  completedTaskIds: string[];
  streakDays: number;
  lastCheckinDate?: string;
}

// 2. Tasks Model (compatible with Firestore `tasks` collection)
export type TaskCategory = 'social' | 'community' | 'testing' | 'partner' | 'engagement' | 'daily';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  rewardAmount: number; // in Points (PTS)
  estimatedMinutes: number;
  actionUrl?: string; // Link to Telegram channel, bot, or target page
  actionLabel: string;
  instructions: string[];
  proofType: 'text' | 'screenshot_url' | 'telegram_username' | 'automatic';
  proofPrompt: string;
  proofPlaceholder: string;
  isFeatured?: boolean;
  dailyReset?: boolean;
  isActive: boolean;
  createdAt: string;
}

// 3. Task Submissions Model (compatible with Firestore `task_submissions` collection)
export type SubmissionStatus = 'in_progress' | 'pending_review' | 'approved' | 'rejected';

export interface TaskSubmission {
  id: string;
  taskId: string;
  userId: string;
  telegramId: number;
  taskTitle: string;
  rewardAmount: number;
  proofData: string;
  proofType: string;
  status: SubmissionStatus;
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

// 4. Rewards Model & Summary
export interface RewardsSummary {
  currentBalance: number;
  pendingBalance: number;
  approvedBalance: number;
  withdrawnBalance: number;
  currencySymbol: string;
  pointToUsdRate: number; // e.g. 0.001 (1000 PTS = $1.00)
}

// 5. Transactions Model (compatible with Firestore `transactions` collection)
export type TransactionType = 'task_reward' | 'daily_checkin' | 'referral_bonus' | 'withdrawal_pending' | 'withdrawal_payout';

export interface Transaction {
  id: string;
  userId: string;
  telegramId: number;
  type: TransactionType;
  title: string;
  subtitle?: string;
  amount: number; // Positive for earnings, negative for withdrawals
  status: 'completed' | 'pending' | 'rejected';
  createdAt: string;
  metadata?: Record<string, any>;
}

// 6. Referrals Model & Summary (compatible with Firestore `referrals` collection)
export interface ReferralRecord {
  id: string;
  referrerUserId: string;
  referredUserId: string;
  referredTelegramName: string;
  joinedAt: string;
  bonusEarned: number;
  isActive: boolean;
}

export interface ReferralSummary {
  referralCode: string;
  referralLink: string;
  totalInvited: number;
  activeReferrals: number;
  totalCommissionPts: number;
  rewardPerReferralPts: number;
  commissionPercentage: number;
  records: ReferralRecord[];
}

// 7. Withdrawals Model (compatible with Firestore `withdrawals` collection)
export type WithdrawalMethod = 'TON' | 'USDT_TRC20' | 'TELEGRAM_STARS';

export interface WithdrawalRequest {
  id: string;
  userId: string;
  telegramId: number;
  amount: number; // in PTS
  usdEquivalent: number;
  method: WithdrawalMethod;
  destinationAddress: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  requestedAt: string;
  processedAt?: string;
  txHash?: string;
}

// Navigation Tabs
export type NavTab = 'home' | 'tasks' | 'rewards' | 'referrals' | 'profile' | 'help';

// Ad Placement Configuration (for future Monetag insertion without redesign)
export interface AdPlacementProps {
  slot: 'banner' | 'native_card' | 'rewarded_task' | 'footer';
  label?: string;
  className?: string;
}
