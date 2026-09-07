import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Send, CheckCircle2, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { Task, TaskSubmission, UserProfile } from '../types';
import { triggerHaptic, openExternalLink, setupBackButton } from '../lib/telegram';

interface TaskModalProps {
  task: Task | null;
  user: UserProfile;
  existingSubmission?: TaskSubmission;
  onClose: () => void;
  onSubmitProof: (taskId: string, proofData: string) => Promise<void>;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  task,
  user,
  existingSubmission,
  onClose,
  onSubmitProof,
}) => {
  const [proofInput, setProofInput] = useState(
    existingSubmission?.proofData || (task?.proofType === 'telegram_username' && user.username ? `@${user.username}` : '')
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStarted, setHasStarted] = useState(Boolean(existingSubmission));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Hook up Telegram WebApp BackButton
  useEffect(() => {
    if (!task) return;
    const cleanup = setupBackButton(() => {
      triggerHaptic('light');
      onClose();
    }, true);
    return cleanup;
  }, [task, onClose]);

  if (!task) return null;

  const isCompleted = existingSubmission?.status === 'approved';
  const isPending = existingSubmission?.status === 'pending_review';
  const isRejected = existingSubmission?.status === 'rejected';

  const handleStartTask = () => {
    triggerHaptic('medium');
    setHasStarted(true);
    if (task.actionUrl && task.actionUrl !== '#checkin') {
      openExternalLink(task.actionUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmed = proofInput.trim();
    if (!trimmed) {
      setErrorMsg('Please provide proof data before submitting.');
      triggerHaptic('error');
      return;
    }

    if (task.proofType === 'telegram_username' && !trimmed.startsWith('@')) {
      setErrorMsg('Telegram username must start with @ (e.g. @myhandle)');
      triggerHaptic('warning');
      return;
    }

    if (task.id === 'task-feedback-survey' && trimmed.length < 20) {
      setErrorMsg('Please provide at least 20 characters of feedback.');
      triggerHaptic('warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitProof(task.id, trimmed);
      triggerHaptic('success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit proof. Please try again.');
      triggerHaptic('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'daily':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'community':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'social':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'testing':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      default:
        return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div
      id="task-modal-backdrop"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div
        id="task-modal-container"
        className="w-full max-w-md rounded-t-3xl bg-[#0c1220] border-t border-slate-700/80 p-5 shadow-2xl sm:rounded-3xl sm:border max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getCategoryBadgeClass(
                  task.category
                )}`}
              >
                {task.category}
              </span>
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <Clock className="h-3 w-3" />
                <span>~{task.estimatedMinutes} min</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-white leading-tight">
              {task.title}
            </h3>
          </div>

          <button
            id="btn-close-task-modal"
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Reward Highlight */}
        <div className="my-4 flex items-center justify-between rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 p-3.5 border border-amber-500/25">
          <div>
            <span className="text-[11px] font-medium text-amber-400/90 uppercase tracking-wider">
              Task Reward
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-extrabold text-amber-300 font-mono">
                +{task.rewardAmount.toLocaleString()} PTS
              </span>
              <span className="text-xs text-slate-400">
                (≈ ${(task.rewardAmount * 0.001).toFixed(2)} USD)
              </span>
            </div>
          </div>
          <div className="rounded-xl bg-amber-500/10 px-3 py-1.5 text-center border border-amber-500/20">
            <span className="text-[10px] font-bold text-amber-300 block">
              100% Guaranteed
            </span>
            <span className="text-[9px] text-slate-400">Upon Review</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          {task.description}
        </p>

        {/* Instructions */}
        <div className="mb-5 rounded-2xl bg-slate-900/60 p-3.5 border border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
            Instructions
          </h4>
          <ol className="space-y-2 text-xs text-slate-300">
            {task.instructions.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-amber-400">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Action Button: Start / Open Link */}
        {task.actionUrl && task.actionUrl !== '#checkin' && !isCompleted && !isPending && (
          <div className="mb-5">
            <button
              id="btn-modal-start-task"
              type="button"
              onClick={handleStartTask}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 px-4 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-[0.99]"
            >
              <span>{task.actionLabel || 'Start Task & Open Link'}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
            <p className="text-[10px] text-slate-400 text-center mt-1.5">
              Complete the action in Telegram or browser, then return to submit proof below.
            </p>
          </div>
        )}

        {/* Status Display if Already Handled */}
        {isCompleted && (
          <div className="rounded-2xl bg-emerald-950/40 p-4 border border-emerald-500/30 text-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-emerald-300">Task Completed & Approved</p>
            <p className="text-xs text-slate-300 mt-1">
              +{task.rewardAmount} PTS has been credited to your spendable balance.
            </p>
          </div>
        )}

        {isPending && (
          <div className="rounded-2xl bg-amber-950/30 p-4 border border-amber-500/30 text-center">
            <Clock className="h-8 w-8 text-amber-400 mx-auto mb-2 animate-pulse" />
            <p className="text-sm font-bold text-amber-300">Proof Submitted & Under Review</p>
            <p className="text-xs text-slate-300 mt-1">
              Your submission ({existingSubmission?.proofData}) is in our verification queue. Points will be released upon admin audit.
            </p>
          </div>
        )}

        {isRejected && (
          <div className="mb-4 rounded-2xl bg-rose-950/30 p-3.5 border border-rose-500/30 text-center">
            <AlertCircle className="h-6 w-6 text-rose-400 mx-auto mb-1" />
            <p className="text-xs font-bold text-rose-300">Previous Submission Rejected</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {existingSubmission?.rejectionReason || 'Please verify you followed the instructions and resubmit valid proof.'}
            </p>
          </div>
        )}

        {/* Proof Submission Form */}
        {!isCompleted && !isPending && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label
                htmlFor="input-task-proof"
                className="block text-xs font-semibold text-slate-200 mb-1"
              >
                {task.proofPrompt}
              </label>
              <input
                id="input-task-proof"
                type="text"
                value={proofInput}
                onChange={(e) => setProofInput(e.target.value)}
                placeholder={task.proofPlaceholder}
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            {errorMsg && (
              <div className="flex items-center gap-1.5 text-rose-400 text-xs">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              id="btn-submit-task-proof"
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 px-4 text-xs font-extrabold text-slate-950 shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50 active:scale-[0.99]"
            >
              {isSubmitting ? (
                <span>Submitting to Verification Queue...</span>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit Proof for Review (+{task.rewardAmount} PTS)</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
