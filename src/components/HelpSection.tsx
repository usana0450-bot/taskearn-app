import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  MessageCircle,
  Mail,
  Shield,
  Clock,
  ExternalLink,
  LifeBuoy
} from 'lucide-react';
import { FAQS } from '../data/mockData';
import { triggerHaptic, openExternalLink } from '../lib/telegram';

export const HelpSection: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    triggerHaptic('light');
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const handleOpenTelegramSupport = () => {
    triggerHaptic('medium');
    openExternalLink('https://t.me/telegram');
  };

  return (
    <div id="section-help" className="space-y-4 pb-4">
      {/* Header Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#10192e] via-[#0b1220] to-[#080c14] p-5 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5">
          <LifeBuoy className="h-4 w-4" />
          <span>Support & Help Center</span>
        </div>
        <h2 className="text-xl font-black text-white leading-tight">
          How can we help you?
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Find instant answers regarding task audits, rewards, wallet payouts, and anti-fraud rules.
        </p>
      </div>

      {/* Support & Contact Channels */}
      <div className="rounded-3xl bg-slate-900/60 p-4 border border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1.5">
          <MessageCircle className="h-4 w-4 text-blue-400" />
          Direct Support Channels
        </h3>

        <div className="space-y-2.5">
          <button
            id="btn-help-contact-bot"
            type="button"
            onClick={handleOpenTelegramSupport}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-slate-700 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/20">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                  Official Telegram Support Bot
                </p>
                <p className="text-[10px] text-slate-400">
                  Direct chat with human moderators & task auditors
                </p>
              </div>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-white" />
          </button>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0f172a] border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  Email Support Desk
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  support@taskearn.app
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Clock className="h-3 w-3 text-amber-400" />
              <span>&lt; 24h reply</span>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="rounded-3xl bg-slate-900/60 p-4 border border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1.5">
          <HelpCircle className="h-4 w-4 text-amber-400" />
          Frequently Asked Questions
        </h3>

        <div className="space-y-2">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;

            return (
              <div
                key={idx}
                id={`faq-item-${idx}`}
                className="rounded-2xl bg-slate-950/70 border border-slate-800/90 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-3.5 text-left text-xs font-bold text-slate-100 hover:text-amber-300"
                >
                  <span className="pr-2">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-900">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Security & Integrity Note */}
      <div className="rounded-2xl bg-slate-900/40 p-3.5 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
        <Shield className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-300 block mb-0.5">
            Transparent Micro-Task Platform
          </span>
          <span>
            TaskEarn rewards genuine engagement and micro-testing. Automated bot accounts, spoofed Telegram identities, and fake screenshots are rejected by our review pipeline.
          </span>
        </div>
      </div>
    </div>
  );
};
