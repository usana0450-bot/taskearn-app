import { Task, UserProfile, Transaction, ReferralRecord } from '../types';

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-daily-checkin',
    title: 'Daily Streak Check-in',
    description: 'Log in each day to claim your daily activity bonus and increase your multiplier.',
    category: 'daily',
    rewardAmount: 50,
    estimatedMinutes: 1,
    actionUrl: '#checkin',
    actionLabel: 'Claim Check-in',
    instructions: [
      'Tap the Claim button to confirm your presence for today.',
      'Check-in resets every 24 hours at 00:00 UTC.',
      'Maintain an unbroken streak for milestone multipliers.'
    ],
    proofType: 'automatic',
    proofPrompt: 'Automatic one-tap streak verification.',
    proofPlaceholder: 'Instant verification upon claim',
    isFeatured: true,
    dailyReset: true,
    isActive: true,
    createdAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'task-join-channel',
    title: 'Join Official Telegram Community',
    description: 'Subscribe to our official Telegram channel for app updates, giveaways, and new campaigns.',
    category: 'community',
    rewardAmount: 200,
    estimatedMinutes: 1,
    actionUrl: 'https://t.me/telegram',
    actionLabel: 'Open Telegram Channel',
    instructions: [
      'Click the button above to open our official community channel.',
      'Tap "Join" at the bottom of the channel.',
      'Return to TaskEarn and submit your Telegram @username for automated verification.'
    ],
    proofType: 'telegram_username',
    proofPrompt: 'Enter your Telegram username to verify subscription:',
    proofPlaceholder: '@yourusername',
    isFeatured: true,
    isActive: true,
    createdAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'task-follow-x',
    title: 'Follow TaskEarn on X (Twitter)',
    description: 'Follow our official X handle to stay tuned for partner task announcements.',
    category: 'social',
    rewardAmount: 180,
    estimatedMinutes: 2,
    actionUrl: 'https://x.com',
    actionLabel: 'Follow on X',
    instructions: [
      'Open the official X page and click "Follow".',
      'Like and repost the pinned announcement.',
      'Provide your X profile handle or profile link below.'
    ],
    proofType: 'text',
    proofPrompt: 'Enter your X handle or link to your repost:',
    proofPlaceholder: '@YourXHandle or post URL',
    isActive: true,
    createdAt: '2026-03-02T00:00:00Z',
  },
  {
    id: 'task-ton-wallet',
    title: 'Link TON Wallet for Payouts',
    description: 'Set your TON non-custodial wallet address (Tonkeeper, Telegram Wallet) ready for future rewards.',
    category: 'community',
    rewardAmount: 250,
    estimatedMinutes: 2,
    actionUrl: 'https://ton.org/wallets',
    actionLabel: 'Get TON Wallet',
    instructions: [
      'Copy your valid TON (The Open Network) address (starting with UQ... or EQ...).',
      'Paste your TON address below to link it to your TaskEarn profile.',
      'A one-time bonus of 250 PTS will be credited to your account.'
    ],
    proofType: 'text',
    proofPrompt: 'Enter your TON wallet address (UQ... / EQ...):',
    proofPlaceholder: 'UQ... or EQ...',
    isFeatured: true,
    isActive: true,
    createdAt: '2026-03-02T00:00:00Z',
  },
  {
    id: 'task-feedback-survey',
    title: 'Test Beta Mini App & Submit Feedback',
    description: 'Explore the Mini App navigation and submit 2-3 sentences about your user experience.',
    category: 'testing',
    rewardAmount: 350,
    estimatedMinutes: 3,
    actionLabel: 'Review Guidelines',
    instructions: [
      'Navigate through Home, Tasks, Rewards, and Referrals.',
      'Tell our development team what features or task types you would like to see next.',
      'Submit constructive feedback with at least 20 characters.'
    ],
    proofType: 'text',
    proofPrompt: 'Your feedback or bug report (minimum 20 characters):',
    proofPlaceholder: 'I tested the navigation and liked the haptic feedback, but...',
    isActive: true,
    createdAt: '2026-03-03T00:00:00Z',
  },
  {
    id: 'task-partner-youtube',
    title: 'Watch TaskEarn Tutorial Video',
    description: 'Watch our 60-second tutorial on how micro-tasks, proof audits, and referrals work.',
    category: 'partner',
    rewardAmount: 150,
    estimatedMinutes: 2,
    actionUrl: 'https://youtube.com',
    actionLabel: 'Watch Video on YouTube',
    instructions: [
      'Click the button to open the 60-second introductory tutorial.',
      'Watch until the end code is displayed.',
      'Enter the secret completion keyword shown at the end of the video.'
    ],
    proofType: 'text',
    proofPrompt: 'Enter the secret video keyword:',
    proofPlaceholder: 'Secret keyword from video (e.g. TASKEARN2026)',
    isActive: true,
    createdAt: '2026-03-03T00:00:00Z',
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-welcome-001',
    userId: 'usr_84920412',
    telegramId: 84920412,
    type: 'task_reward',
    title: 'Telegram Registration Bonus',
    subtitle: 'Welcome to TaskEarn VIP',
    amount: 100,
    status: 'completed',
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'tx-checkin-002',
    userId: 'usr_84920412',
    telegramId: 84920412,
    type: 'daily_checkin',
    title: 'Day 1 Daily Check-in',
    subtitle: 'Streak bonus claimed',
    amount: 50,
    status: 'completed',
    createdAt: '2026-03-04T08:30:00Z',
  }
];

export const INITIAL_REFERRALS: ReferralRecord[] = [
  {
    id: 'ref-01',
    referrerUserId: 'usr_84920412',
    referredUserId: 'usr_9918231',
    referredTelegramName: 'Elena Rostova',
    joinedAt: '2026-03-02T14:15:00Z',
    bonusEarned: 150,
    isActive: true,
  },
  {
    id: 'ref-02',
    referrerUserId: 'usr_84920412',
    referredUserId: 'usr_7721834',
    referredTelegramName: 'Mark Davies',
    joinedAt: '2026-03-03T09:40:00Z',
    bonusEarned: 150,
    isActive: true,
  }
];

export const FAQS = [
  {
    q: 'What is TaskEarn?',
    a: 'TaskEarn is a Telegram Mini App that rewards users for completing verified micro-tasks such as joining community channels, participating in beta testing, testing partner integrations, and inviting friends.'
  },
  {
    q: 'How are task submissions verified?',
    a: 'Automated tasks (like check-ins) are credited immediately. Tasks requiring proof (e.g. social handles, verification codes, or links) are submitted to our review queue and audited within 2 to 24 hours.'
  },
  {
    q: 'How does the Reward Balance work?',
    a: 'Points (PTS) represent your verified task earnings. The baseline conversion rate is 1,000 PTS = $1.00 USD. Once approved, points move from Pending Rewards to your Approved Spendable Balance.'
  },
  {
    q: 'When will withdrawals be processed?',
    a: 'The withdrawal architecture supports TON Blockchain, USDT (TRC-20), and Telegram Stars. Payout requests are scheduled for rollout once threshold criteria (minimum 1,000 PTS / $1.00) are met and network auditing is complete.'
  },
  {
    q: 'How does the Referral Program work?',
    a: 'Share your unique Telegram link or code. You earn 150 PTS when an invited user joins and completes their first verified task, plus a 10% commission on their ongoing task rewards.'
  },
  {
    q: 'Is my Telegram account secure?',
    a: 'Yes. TaskEarn operates inside the official Telegram Mini App environment using the Telegram WebApp SDK. We never ask for passwords or private keys.'
  }
];
