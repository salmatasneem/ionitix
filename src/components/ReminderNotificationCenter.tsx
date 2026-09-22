import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Volume2,
  VolumeX,
  Play,
  X,
  Sliders,
  Calendar,
  FastForward,
  ChevronRight,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { TopicReminder, NotificationPreferences } from '../types';
import {
  snoozeReminder,
  completeReminder,
  fastForwardSimulateDue,
  dismissReminder,
  saveStoredPreferences,
  playNotificationChime,
} from '../utils/reminderStorage';

interface ReminderNotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  reminders: TopicReminder[];
  preferences: NotificationPreferences;
  onRefreshReminders: () => void;
  onNavigateToTopic: (topicId: string) => void;
  onUpdatePreferences: (prefs: NotificationPreferences) => void;
}

export const ReminderNotificationCenter: React.FC<ReminderNotificationCenterProps> = ({
  isOpen,
  onClose,
  reminders,
  preferences,
  onRefreshReminders,
  onNavigateToTopic,
  onUpdatePreferences,
}) => {
  const [filter, setFilter] = useState<'all' | 'due' | 'scheduled'>('all');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  const dueCount = reminders.filter((r) => r.status === 'due').length;
  const pendingCount = reminders.filter((r) => r.status === 'pending').length;

  const filteredReminders = reminders.filter((r) => {
    if (filter === 'due') return r.status === 'due';
    if (filter === 'scheduled') return r.status === 'pending';
    return r.status === 'due' || r.status === 'pending';
  });

  const handleSnooze = (id: string, hours: number) => {
    snoozeReminder(id, hours);
    onRefreshReminders();
  };

  const handleComplete = (id: string) => {
    completeReminder(id);
    onRefreshReminders();
  };

  const handleFastForward = (id: string) => {
    fastForwardSimulateDue(id);
    if (preferences.soundEnabled) {
      playNotificationChime();
    }
    onRefreshReminders();
  };

  const handleDismiss = (id: string) => {
    dismissReminder(id);
    onRefreshReminders();
  };

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setBrowserPermission(perm);
        onUpdatePreferences({
          ...preferences,
          browserNotifications: perm === 'granted',
        });
      } catch (e) {
        // Handle error
      }
    }
  };

  const getTimeRemainingText = (scheduledForIso: string, status: string) => {
    if (status === 'due') return 'DUE NOW';
    const diffMs = new Date(scheduledForIso).getTime() - Date.now();
    if (diffMs <= 0) return 'DUE NOW';
    const diffHours = Math.round(diffMs / (3600 * 1000));
    if (diffHours < 1) return 'Due in < 1 hour';
    if (diffHours === 1) return 'Due in 1 hour';
    return `Due in ~${diffHours} hours`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center">
              <Bell className="w-5 h-5 text-indigo-400" />
              {dueCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {dueCount}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base tracking-tight">
                  Spaced Repetition &amp; Weak Topic Reminders
                </h3>
                <span className="text-[10px] font-semibold bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-400/20">
                  24h-48h Cycle
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                AI-driven spaced memory intervals to revisit identified learning gaps.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="Notification Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Optional Settings Drawer */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-slate-50 border-b border-slate-200 px-5 py-3 text-xs space-y-2.5 overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Default Revisit Interval:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      onUpdatePreferences({ ...preferences, defaultIntervalHours: 24 })
                    }
                    className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                      preferences.defaultIntervalHours === 24
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    24 Hours (Fast Revisit)
                  </button>
                  <button
                    onClick={() =>
                      onUpdatePreferences({ ...preferences, defaultIntervalHours: 48 })
                    }
                    className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                      preferences.defaultIntervalHours === 48
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    48 Hours (Standard)
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-medium text-slate-700 flex items-center space-x-1.5">
                  {preferences.soundEnabled ? (
                    <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>Auditory Chime when Due</span>
                </span>
                <button
                  onClick={() =>
                    onUpdatePreferences({
                      ...preferences,
                      soundEnabled: !preferences.soundEnabled,
                    })
                  }
                  className={`w-10 h-5 rounded-full transition relative ${
                    preferences.soundEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition transform ${
                      preferences.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-medium text-slate-700">Native Browser Notifications</span>
                {browserPermission === 'granted' ? (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Enabled</span>
                  </span>
                ) : (
                  <button
                    onClick={requestNotificationPermission}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 hover:bg-indigo-100 transition text-[11px]"
                  >
                    Request Permission
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Tabs */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between text-xs bg-slate-50/50">
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              All Active ({reminders.length})
            </button>
            <button
              onClick={() => setFilter('due')}
              className={`px-3 py-1 rounded-lg font-semibold transition flex items-center space-x-1 ${
                filter === 'due'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <span>Due Now</span>
              {dueCount > 0 && (
                <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px]">
                  {dueCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilter('scheduled')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                filter === 'scheduled'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              Pending 24-48h ({pendingCount})
            </button>
          </div>

          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
            Local Storage Synced
          </span>
        </div>

        {/* Reminders List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {filteredReminders.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Clock className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">No reminders matching this filter.</p>
              <p className="text-[11px] text-slate-400">
                When the AI identifies learning gaps or mistakes, it automatically schedules a spaced revisit!
              </p>
            </div>
          ) : (
            filteredReminders.map((reminder) => {
              const isDue = reminder.status === 'due';
              const timeLabel = getTimeRemainingText(reminder.scheduledFor, reminder.status);

              return (
                <div
                  key={reminder.id}
                  className={`p-4 rounded-2xl border transition shadow-xs space-y-3 ${
                    isDue
                      ? 'bg-rose-50/50 border-rose-200 ring-1 ring-rose-200/60'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                            isDue
                              ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          }`}
                        >
                          {timeLabel}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {reminder.subject} &bull; Cycle #{reminder.repetitionCycle} ({reminder.intervalHours}h)
                        </span>
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-sm mt-1">
                        {reminder.topicTitle}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {reminder.reasonSummary}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDismiss(reminder.id)}
                      className="text-slate-400 hover:text-slate-600 text-xs self-start"
                      title="Dismiss reminder"
                    >
                      &times;
                    </button>
                  </div>

                  {/* Weak Concepts Badges */}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">
                      Identified Gaps:
                    </span>
                    {reminder.weakConcepts.map((concept, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-[10px] font-medium"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToTopic(reminder.topicId);
                        }}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-xs"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Revisit &amp; Launch Bridge</span>
                      </button>

                      <button
                        onClick={() => handleComplete(reminder.id)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
                        title="Mark resolved; graduates to 48h cycle"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Mark Resolved</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleSnooze(reminder.id, 24)}
                        className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition border border-slate-200"
                        title="Snooze for +24 hours"
                      >
                        Snooze 24h
                      </button>
                      <button
                        onClick={() => handleSnooze(reminder.id, 48)}
                        className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition border border-slate-200"
                        title="Snooze for +48 hours"
                      >
                        Snooze 48h
                      </button>

                      {!isDue && (
                        <button
                          onClick={() => handleFastForward(reminder.id)}
                          className="px-2 py-1.5 rounded-lg text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition inline-flex items-center space-x-1"
                          title="Simulate passing 24-48 hours for immediate demonstration"
                        >
                          <FastForward className="w-3 h-3" />
                          <span>Simulate Due</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Spaced Repetition scientifically reinforces neural consolidation by up to 280%.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
