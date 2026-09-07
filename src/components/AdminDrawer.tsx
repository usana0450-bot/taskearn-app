import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Database,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  FileCheck,
  Server,
  RefreshCw,
  Code
} from 'lucide-react';
import { TaskSubmission } from '../types';
import { triggerHaptic } from '../lib/telegram';

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  submissions: TaskSubmission[];
  onApproveSubmission: (submissionId: string) => void;
  onRejectSubmission: (submissionId: string, reason?: string) => void;
}

export const AdminDrawer: React.FC<AdminDrawerProps> = ({
  isOpen,
  onClose,
  submissions,
  onApproveSubmission,
  onRejectSubmission,
}) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'models' | 'security'>('audit');
  const [serverValidationStatus, setServerValidationStatus] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  if (!isOpen) return null;

  const pendingSubmissions = submissions.filter((s) => s.status === 'pending_review');

  const handleTestServerValidate = async () => {
    setIsValidating(true);
    try {
      const res = await fetch('/api/telegram/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initData:
            'query_id=AAHdF6IQAAAAAN0XohD123&user=%7B%22id%22%3A84920412%2C%22first_name%22%3A%22Alex%22%2C%22username%22%3A%22alexvance_tg%22%7D&auth_date=1741168800&hash=mockhash123',
        }),
      });
      const data = await res.json();
      setServerValidationStatus(
        data.valid
          ? '✓ Server-side initData verification endpoint passed'
          : `Validation response: ${data.error || 'Check failed'}`
      );
      triggerHaptic('success');
    } catch (err: any) {
      setServerValidationStatus(`Error: ${err.message}`);
      triggerHaptic('error');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div
      id="admin-drawer-backdrop"
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
    >
      <div
        id="admin-drawer-container"
        className="w-full max-w-md bg-[#0b111e] border-l border-slate-800 p-5 shadow-2xl overflow-y-auto flex flex-col h-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/25">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                Admin & Architecture Console
              </h3>
              <p className="text-[10px] text-slate-400">
                Audit queue & Firestore models preview
              </p>
            </div>
          </div>
          <button
            id="btn-close-admin-drawer"
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-3 gap-1 mb-4 rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`rounded-lg py-1.5 font-bold transition-colors ${
              activeTab === 'audit'
                ? 'bg-amber-400 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Proof Audit ({pendingSubmissions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('models')}
            className={`rounded-lg py-1.5 font-bold transition-colors ${
              activeTab === 'models'
                ? 'bg-amber-400 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            DB Models
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`rounded-lg py-1.5 font-bold transition-colors ${
              activeTab === 'security'
                ? 'bg-amber-400 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Security & API
          </button>
        </div>

        {/* Content Tabs */}
        <div className="flex-1 space-y-3">
          {/* TAB 1: AUDIT QUEUE */}
          {activeTab === 'audit' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Pending Task Proofs ({pendingSubmissions.length})
                </span>
                <span className="text-[10px] text-slate-400">Live Simulator</span>
              </div>

              {pendingSubmissions.length === 0 ? (
                <div className="rounded-2xl bg-slate-900/60 p-6 text-center border border-slate-800">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-white">Review Queue Clear</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Submit proof from the Tasks tab to test the approval flow.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {pendingSubmissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="rounded-2xl bg-slate-900/90 p-3.5 border border-slate-800 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-bold text-white">
                            {sub.taskTitle}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            User ID: {sub.telegramId} ({sub.userName || 'Member'})
                          </p>
                        </div>
                        <span className="text-xs font-mono font-bold text-amber-400">
                          +{sub.rewardAmount} PTS
                        </span>
                      </div>

                      {/* Submitted Proof data */}
                      <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800 text-xs">
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-0.5">
                          Submitted Proof ({sub.proofType}):
                        </span>
                        <span className="font-mono text-amber-300 break-all">
                          {sub.proofData}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            triggerHaptic('success');
                            onApproveSubmission(sub.id);
                          }}
                          className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Approve & Credit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            triggerHaptic('error');
                            onRejectSubmission(sub.id, 'Proof does not meet verification requirements');
                          }}
                          className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-rose-500/20 border border-rose-500/40 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/30"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DB SCHEMAS */}
          {activeTab === 'models' && (
            <div className="space-y-3 text-xs">
              <p className="text-slate-300 leading-relaxed">
                TaskEarn models are structured for direct mapping to Firebase Firestore collections:
              </p>

              <div className="space-y-2 font-mono text-[11px]">
                <div className="rounded-xl bg-slate-900/90 p-2.5 border border-slate-800">
                  <span className="text-amber-400 font-bold">1. users</span>
                  <p className="text-slate-400 text-[10px] mt-0.5">
                    telegramId, username, balance, pendingRewards, streakDays, status, referralCode
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900/90 p-2.5 border border-slate-800">
                  <span className="text-amber-400 font-bold">2. tasks</span>
                  <p className="text-slate-400 text-[10px] mt-0.5">
                    id, title, category, rewardAmount, instructions, proofType, isActive
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900/90 p-2.5 border border-slate-800">
                  <span className="text-amber-400 font-bold">3. task_submissions</span>
                  <p className="text-slate-400 text-[10px] mt-0.5">
                    taskId, userId, proofData, status (pending/approved/rejected), reviewedAt
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900/90 p-2.5 border border-slate-800">
                  <span className="text-amber-400 font-bold">4. rewards & transactions</span>
                  <p className="text-slate-400 text-[10px] mt-0.5">
                    type (task_reward, checkin, referral), amount, status, timestamp
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900/90 p-2.5 border border-slate-800">
                  <span className="text-amber-400 font-bold">5. referrals</span>
                  <p className="text-slate-400 text-[10px] mt-0.5">
                    referrerUserId, referredUserId, bonusEarned, joinedAt
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900/90 p-2.5 border border-slate-800">
                  <span className="text-amber-400 font-bold">6. withdrawals</span>
                  <p className="text-slate-400 text-[10px] mt-0.5">
                    method (TON/USDT), destinationAddress, amount, usdEquivalent, status
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY & API */}
          {activeTab === 'security' && (
            <div className="space-y-3 text-xs">
              <div className="rounded-2xl bg-slate-900/90 p-3.5 border border-slate-800">
                <h4 className="font-bold text-white mb-1 flex items-center gap-1.5">
                  <Server className="h-3.5 w-3.5 text-amber-400" />
                  Server initData HMAC Validation
                </h4>
                <p className="text-slate-400 text-[11px] mb-3 leading-relaxed">
                  Telegram Mini Apps require validating <code>initData</code> on the server with HMAC-SHA256 of the Telegram Bot Token to prevent spoofing.
                </p>

                <button
                  type="button"
                  onClick={handleTestServerValidate}
                  disabled={isValidating}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 active:scale-[0.98]"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isValidating ? 'animate-spin' : ''}`} />
                  <span>Test /api/telegram/validate Endpoint</span>
                </button>

                {serverValidationStatus && (
                  <div className="mt-2.5 rounded-xl bg-slate-950 p-2 border border-slate-800 text-[11px] text-emerald-400 font-mono">
                    {serverValidationStatus}
                  </div>
                )}
              </div>

              <div className="rounded-2xl bg-slate-900/90 p-3.5 border border-slate-800">
                <h4 className="font-bold text-white mb-1 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-blue-400" />
                  Monetag Integration Blueprint
                </h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Ad placeholder components (<code>AdPlacement.tsx</code>) are positioned in Home and Tasks. Monetag script tags can be added to <code>index.html</code> and triggered via zone IDs without any UI restructuring.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
