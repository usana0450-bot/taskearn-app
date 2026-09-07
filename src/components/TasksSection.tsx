import React, { useState } from 'react';
import {
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Filter,
  CheckSquare
} from 'lucide-react';
import { Task, TaskSubmission, TaskCategory } from '../types';
import { AdPlacement } from './AdPlacement';
import { triggerHaptic } from '../lib/telegram';

interface TasksSectionProps {
  tasks: Task[];
  submissions: TaskSubmission[];
  onOpenTask: (task: Task) => void;
}

export const TasksSection: React.FC<TasksSectionProps> = ({
  tasks,
  submissions,
  onOpenTask,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Tasks' },
    { id: 'daily', label: 'Daily' },
    { id: 'community', label: 'Community' },
    { id: 'social', label: 'Social' },
    { id: 'testing', label: 'Testing' },
    { id: 'partner', label: 'Partner' },
  ];

  const getSubmissionForTask = (taskId: string) => {
    return submissions.find((s) => s.taskId === taskId);
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryClass = (cat: TaskCategory) => {
    switch (cat) {
      case 'daily':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'community':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'social':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'testing':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'partner':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div id="section-daily-tasks" className="space-y-4 pb-4">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-[#0e1628] to-slate-900 p-4 border border-slate-800">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <CheckSquare className="h-4 w-4 text-amber-400" />
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
                Daily Verified Tasks
              </h2>
            </div>
            <p className="text-xs text-slate-300">
              Complete verified micro-tasks to earn real Points credited to your account.
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-lg font-black font-mono text-amber-400">
              {tasks.length}
            </span>
            <span className="text-[10px] text-slate-400 block font-medium">Available</span>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <input
          id="input-search-tasks"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search micro-tasks by title or keyword..."
          className="w-full rounded-2xl bg-slate-900/90 border border-slate-800 pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Pills (Horizontal Scroll) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar select-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`filter-cat-${cat.id}`}
            type="button"
            onClick={() => {
              triggerHaptic('selection');
              setActiveCategory(cat.id);
            }}
            className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold transition-all shrink-0 ${
              activeCategory === cat.id
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="rounded-2xl bg-slate-900/40 p-8 text-center border border-slate-800">
            <Filter className="h-8 w-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-300">No tasks found</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Try switching category or clearing the search query.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const sub = getSubmissionForTask(task.id);
            const isApproved = sub?.status === 'approved';
            const isPending = sub?.status === 'pending_review';
            const isRejected = sub?.status === 'rejected';

            return (
              <div
                key={task.id}
                id={`task-item-${task.id}`}
                className="group rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#0a0f1d] p-4 border border-slate-800 hover:border-slate-700 transition-all shadow-md"
              >
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getCategoryClass(
                        task.category
                      )}`}
                    >
                      {task.category}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Clock className="h-3 w-3" />
                      <span>~{task.estimatedMinutes} min</span>
                    </div>
                  </div>

                  {/* Reward badge */}
                  <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 border border-amber-500/25">
                    <span className="text-xs font-black font-mono text-amber-400">
                      +{task.rewardAmount} PTS
                    </span>
                    <span className="text-[9px] text-slate-400 font-sans">
                      (≈${(task.rewardAmount * 0.001).toFixed(2)})
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  {task.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                  {task.description}
                </p>

                {/* Footer Action & Status */}
                <div className="mt-3.5 flex items-center justify-between pt-3 border-t border-slate-800/80">
                  {/* Status label */}
                  <div>
                    {isApproved && (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Approved & Credited
                      </span>
                    )}
                    {isPending && (
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
                        <Clock className="h-3.5 w-3.5 animate-pulse" />
                        Proof Under Review
                      </span>
                    )}
                    {isRejected && (
                      <span className="flex items-center gap-1 text-xs font-bold text-rose-400">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Needs Resubmission
                      </span>
                    )}
                    {!sub && (
                      <span className="text-[10px] text-slate-400">
                        Proof required: {task.proofType.replace('_', ' ')}
                      </span>
                    )}
                  </div>

                  {/* Button */}
                  <button
                    id={`btn-open-task-${task.id}`}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      onOpenTask(task);
                    }}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all active:scale-[0.98] ${
                      isApproved
                        ? 'bg-slate-800 text-slate-400 hover:text-white'
                        : isPending
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500'
                    }`}
                  >
                    <span>
                      {isApproved
                        ? 'View Details'
                        : isPending
                        ? 'View Status'
                        : 'Start Task'}
                    </span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Rewarded Ad Placement Placeholder (Monetag slot) */}
      <AdPlacement slot="rewarded_task" />
    </div>
  );
};
