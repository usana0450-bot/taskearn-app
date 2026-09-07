import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store for server-authoritative state
// This structure is designed to seamlessly plug into Firebase Firestore (collections: users, tasks, task_submissions, transactions, referrals)
interface ServerSubmission {
  id: string;
  taskId: string;
  telegramId: number;
  userName: string;
  taskTitle: string;
  rewardAmount: number;
  proofData: string;
  proofType: string;
  status: 'pending_review' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
}

const serverSubmissions: ServerSubmission[] = [
  {
    id: 'sub-init-001',
    taskId: 'task-join-channel',
    telegramId: 84920412,
    userName: 'Alex Vance',
    taskTitle: 'Join Official Telegram Community',
    rewardAmount: 200,
    proofData: '@alexvance_tg',
    proofType: 'telegram_username',
    status: 'pending_review',
    submittedAt: new Date(Date.now() - 3600000).toISOString(),
  }
];

// Helper: Telegram WebApp initData HMAC-SHA256 signature verification
function verifyTelegramInitData(initDataStr: string, botToken?: string): { valid: boolean; data?: any; error?: string } {
  if (!initDataStr) {
    return { valid: false, error: 'No initData provided' };
  }

  const token = botToken || process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    // In development or when bot token is not configured yet, parse without cryptographic failure
    const params = new URLSearchParams(initDataStr);
    const userStr = params.get('user');
    const user = userStr ? JSON.parse(userStr) : null;
    return {
      valid: true,
      data: {
        user,
        auth_date: params.get('auth_date'),
        query_id: params.get('query_id'),
        hash: params.get('hash'),
        note: 'Validated in dev/prototype mode (set TELEGRAM_BOT_TOKEN to enforce cryptographic HMAC check)',
      }
    };
  }

  try {
    const params = new URLSearchParams(initDataStr);
    const hash = params.get('hash');
    if (!hash) {
      return { valid: false, error: 'Missing hash parameter in initData' };
    }

    params.delete('hash');
    const keys = Array.from(params.keys()).sort();
    const dataCheckString = keys.map(k => `${k}=${params.get(k)}`).join('\n');

    // Secret key is HMAC-SHA256 of botToken with key "WebAppData"
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(token).digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    const isValid = calculatedHash === hash;
    const userStr = params.get('user');
    const user = userStr ? JSON.parse(userStr) : null;

    return {
      valid: isValid,
      data: { user, auth_date: params.get('auth_date'), query_id: params.get('query_id') },
      error: isValid ? undefined : 'HMAC signature does not match Telegram Bot Token'
    };
  } catch (err: any) {
    return { valid: false, error: err.message || 'Verification exception' };
  }
}

// ----------------- API ROUTES -----------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'TaskEarn',
    version: '1.0.0',
    mode: process.env.NODE_ENV || 'development',
    time: new Date().toISOString(),
  });
});

// Telegram initData verification endpoint
app.post('/api/telegram/validate', (req, res) => {
  const { initData } = req.body;
  const result = verifyTelegramInitData(initData);
  res.json(result);
});

// Get submissions list (for admin review or user tracking)
app.get('/api/submissions', (req, res) => {
  const telegramId = req.query.telegramId ? Number(req.query.telegramId) : null;
  if (telegramId) {
    const userSubs = serverSubmissions.filter(s => s.telegramId === telegramId);
    return res.json({ submissions: userSubs });
  }
  res.json({ submissions: serverSubmissions });
});

// Submit proof for a task
app.post('/api/tasks/:id/submit', (req, res) => {
  const { id } = req.params;
  const { telegramId, userName, taskTitle, rewardAmount, proofData, proofType } = req.body;

  if (!proofData || typeof proofData !== 'string' || proofData.trim().length === 0) {
    return res.status(400).json({ error: 'Proof submission cannot be empty' });
  }

  const newSubmission: ServerSubmission = {
    id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    taskId: id,
    telegramId: Number(telegramId) || 84920412,
    userName: userName || 'Telegram User',
    taskTitle: taskTitle || 'Task',
    rewardAmount: Number(rewardAmount) || 100,
    proofData: proofData.trim(),
    proofType: proofType || 'text',
    status: 'pending_review',
    submittedAt: new Date().toISOString(),
  };

  serverSubmissions.unshift(newSubmission);
  res.json({ success: true, submission: newSubmission });
});

// Admin review action (prepare architecture for secure admin dashboard)
app.post('/api/admin/submissions/:id/review', (req, res) => {
  const { id } = req.params;
  const { action, reason } = req.body; // action: 'approve' | 'reject'

  const sub = serverSubmissions.find(s => s.id === id);
  if (!sub) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  sub.status = action === 'approve' ? 'approved' : 'rejected';
  sub.reviewedAt = new Date().toISOString();

  res.json({ success: true, submission: sub, reason });
});

// Start the server with Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TaskEarn server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
