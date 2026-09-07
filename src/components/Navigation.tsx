import React from 'react';
import { Home, CheckSquare, Wallet, Users, User, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { NavTab } from '../types';
import { triggerHaptic } from '../lib/telegram';

interface NavigationProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  availableTasksCount?: number;
  pendingRewardsCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  availableTasksCount = 0,
  pendingRewardsCount = 0,
}) => {
  const tabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: availableTasksCount },
    { id: 'rewards', label: 'Rewards', icon: Wallet, badge: pendingRewardsCount },
    { id: 'referrals', label: 'Referrals', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];

  const handleTabClick = (tabId: NavTab) => {
    if (tabId !== activeTab) {
      triggerHaptic('selection');
      onSelectTab(tabId);
    }
  };

  return (
    <nav
      id="bottom-navigation"
      className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-md border-t border-slate-800/80 bg-[#0a0f1d]/95 px-2 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2 backdrop-blur-xl"
    >
      <div className="grid grid-cols-6 items-center gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className="relative flex flex-col items-center justify-center py-1.5 px-1 min-h-[46px] rounded-xl transition-all duration-200 select-none group"
            >
              {/* Background active glow pill */}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 rounded-xl bg-gradient-to-b from-amber-500/15 to-indigo-500/10 border border-amber-500/20"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}

              <div className="relative z-10 flex items-center justify-center">
                <Icon
                  className={`h-5 w-5 transition-transform duration-150 ${
                    isActive
                      ? 'text-amber-400 scale-110'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />

                {/* Badge indicator */}
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-slate-950 ring-2 ring-[#0a0f1d]">
                    {tab.badge}
                  </span>
                ) : null}
              </div>

              <span
                className={`relative z-10 mt-1 text-[10px] font-medium tracking-tight truncate max-w-full ${
                  isActive ? 'text-amber-300 font-semibold' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
