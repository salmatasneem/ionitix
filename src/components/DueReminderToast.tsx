import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Clock, ArrowRight, X, Sparkles, RotateCcw, Play } from 'lucide-react';
import { TopicReminder, NotificationPreferences } from '../types';
import { playNotificationChime } from '../utils/reminderStorage';

interface DueReminderToastProps {
  dueReminders: TopicReminder[];
  preferences: NotificationPreferences;
  onRevisitTopic: (topicId: string) => void;
  onSnooze: (reminderId: string, hours: number) => void;
  onDismiss: (reminderId: string) => void;
  onOpenCenter: () => void;
}

export const DueReminderToast: React.FC<DueReminderToastProps> = ({
  dueReminders,
  preferences,
  onRevisitTopic,
  onSnooze,
  onDismiss,
  onOpenCenter,
}) => {
  const topReminder = dueReminders[0];

  useEffect(() => {
    if (topReminder && preferences.soundEnabled) {
      playNotificationChime();
    }
  }, [topReminder?.id, preferences.soundEnabled]);

  if (!topReminder) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={topReminder.id}
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-white rounded-2xl shadow-2xl border border-rose-200 ring-4 ring-rose-50 overflow-hidden"
      >
        {/* Top Accent Stripe */}
        <div className="bg-gradient-to-r from-rose-500 to-indigo-600 h-1.5 w-full" />

        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                    Spaced Revisit Due ({topReminder.intervalHours}h)
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    {topReminder.subject}
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm mt-0.5 line-clamp-1">
                  {topReminder.topicTitle}
                </h4>
              </div>
            </div>

            <button
              onClick={() => onDismiss(topReminder.id)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-600">
            {topReminder.reasonSummary ||
              `Time to strengthen memory retention for identified gap in ${topReminder.weakConcepts.join(', ')}.`}
          </p>

          <div className="flex flex-wrap gap-1 items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Gap:</span>
            {topReminder.weakConcepts.slice(0, 2).map((c, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-semibold rounded border border-amber-200"
              >
                {c}
              </span>
            ))}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              onClick={() => onRevisitTopic(topReminder.topicId)}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs"
            >
              <Play className="w-3 h-3" />
              <span>Revisit Now</span>
            </button>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => onSnooze(topReminder.id, 24)}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition"
              >
                Snooze 24h
              </button>
              <button
                onClick={() => onSnooze(topReminder.id, 48)}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition"
              >
                Snooze 48h
              </button>
              {dueReminders.length > 1 && (
                <button
                  onClick={onOpenCenter}
                  className="px-2 py-1.5 text-[11px] font-bold text-indigo-600 hover:underline"
                >
                  +{dueReminders.length - 1} more
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
