import { TopicReminder, NotificationPreferences } from '../types';

const REMINDERS_STORAGE_KEY = 'edubridge_topic_reminders';
const PREFERENCES_STORAGE_KEY = 'edubridge_notification_prefs';

export const DEFAULT_PREFERENCES: NotificationPreferences = {
  inAppAlerts: true,
  soundEnabled: true,
  browserNotifications: false,
  defaultIntervalHours: 24,
  autoScheduleOnGap: true,
};

// Initial realistic seed reminders so the student sees immediate value
const SEED_REMINDERS: TopicReminder[] = [
  {
    id: 'seed-reminder-chain-rule',
    topicId: 'math_chain_rule',
    topicTitle: 'Calculus: Chain Rule & Composite Functions',
    subject: 'Mathematics',
    weakConcepts: ['Composite Function Decomposition', 'Inner Derivative Scaling'],
    reasonSummary: 'Diagnostic & Handwritten Script revealed omitted inner derivative layer (d/dx 2x = 2).',
    identifiedAt: new Date(Date.now() - 25 * 3600 * 1000).toISOString(), // 25 hours ago
    scheduledFor: new Date(Date.now() - 1 * 3600 * 1000).toISOString(), // due 1 hour ago!
    intervalHours: 24,
    status: 'due',
    repetitionCycle: 1,
    targetSimulatorId: 'math_chain_rule',
  },
  {
    id: 'seed-reminder-physics-standing',
    topicId: 'physics_snells_law',
    topicTitle: 'Physics: Standing Waves & Resonance',
    subject: 'Physics',
    weakConcepts: ['Boundary Reflection Phase Inversion', 'Node Spacing'],
    reasonSummary: 'Answer sheet review flagged missing open boundary comparison.',
    identifiedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    scheduledFor: new Date(Date.now() + 18 * 3600 * 1000).toISOString(), // due in 18h (24h total)
    intervalHours: 24,
    status: 'pending',
    repetitionCycle: 1,
    targetSimulatorId: 'physics_snells_law',
  },
  {
    id: 'seed-reminder-cs-dp',
    topicId: 'cs_recursion_tree',
    topicTitle: 'Data Structures: Dynamic Programming & Recursion',
    subject: 'Computer Science',
    weakConcepts: ['Memoization Reference Forwarding', 'Call Stack Tree'],
    reasonSummary: 'Omitted passing memo object into recursive child calls.',
    identifiedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    scheduledFor: new Date(Date.now() + 38 * 3600 * 1000).toISOString(), // due in 38h (48h interval)
    intervalHours: 48,
    status: 'pending',
    repetitionCycle: 1,
    targetSimulatorId: 'cs_recursion_tree',
  },
];

export function getStoredReminders(): TopicReminder[] {
  try {
    const raw = localStorage.getItem(REMINDERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(SEED_REMINDERS));
      return SEED_REMINDERS;
    }
    const parsed: TopicReminder[] = JSON.parse(raw);
    return parsed;
  } catch (e) {
    console.error('Failed to load reminders from localStorage', e);
    return SEED_REMINDERS;
  }
}

export function saveStoredReminders(reminders: TopicReminder[]): void {
  try {
    localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
  } catch (e) {
    console.error('Failed to save reminders to localStorage', e);
  }
}

export function getStoredPreferences(): NotificationPreferences {
  try {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_PREFERENCES;
    }
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_PREFERENCES;
  }
}

export function saveStoredPreferences(prefs: NotificationPreferences): void {
  try {
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save preferences to localStorage', e);
  }
}

/**
 * Checks all stored reminders and transitions 'pending' to 'due' if current time has passed scheduledFor.
 */
export function checkDueReminders(): { reminders: TopicReminder[]; newlyDue: TopicReminder[] } {
  const current = getStoredReminders();
  const now = Date.now();
  const newlyDue: TopicReminder[] = [];

  const updated = current.map((r) => {
    if (r.status === 'pending') {
      const scheduledTime = new Date(r.scheduledFor).getTime();
      if (now >= scheduledTime) {
        newlyDue.push(r);
        return {
          ...r,
          status: 'due' as const,
          lastNotifiedAt: new Date().toISOString(),
        };
      }
    }
    return r;
  });

  if (newlyDue.length > 0) {
    saveStoredReminders(updated);
  }

  return { reminders: updated, newlyDue };
}

/**
 * Schedule a new reminder or update existing reminder for a weak topic
 */
export function scheduleTopicReminder(params: {
  topicId: string;
  topicTitle: string;
  subject: string;
  weakConcepts: string[];
  reasonSummary: string;
  intervalHours?: number; // 24 or 48
  targetSimulatorId?: string;
}): TopicReminder {
  const all = getStoredReminders();
  const interval = params.intervalHours || 24;
  const now = Date.now();
  const scheduledTime = new Date(now + interval * 3600 * 1000).toISOString();

  // Check if active reminder already exists for this topic
  const existingIdx = all.findIndex(
    (r) => r.topicId === params.topicId && (r.status === 'pending' || r.status === 'due')
  );

  if (existingIdx >= 0) {
    const existing = all[existingIdx];
    const updatedItem: TopicReminder = {
      ...existing,
      weakConcepts: Array.from(new Set([...existing.weakConcepts, ...params.weakConcepts])),
      reasonSummary: params.reasonSummary || existing.reasonSummary,
      scheduledFor: scheduledTime,
      intervalHours: interval,
      status: 'pending',
      repetitionCycle: existing.repetitionCycle + 1,
    };
    all[existingIdx] = updatedItem;
    saveStoredReminders(all);
    return updatedItem;
  }

  const newReminder: TopicReminder = {
    id: `reminder-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    topicId: params.topicId,
    topicTitle: params.topicTitle,
    subject: params.subject,
    weakConcepts: params.weakConcepts,
    reasonSummary: params.reasonSummary,
    identifiedAt: new Date().toISOString(),
    scheduledFor: scheduledTime,
    intervalHours: interval,
    status: 'pending',
    repetitionCycle: 1,
    targetSimulatorId: params.targetSimulatorId || params.topicId,
  };

  all.unshift(newReminder);
  saveStoredReminders(all);
  return newReminder;
}

/**
 * Snooze a reminder by +24h or +48h
 */
export function snoozeReminder(reminderId: string, hours: number = 24): TopicReminder | null {
  const all = getStoredReminders();
  const idx = all.findIndex((r) => r.id === reminderId);
  if (idx === -1) return null;

  const now = Date.now();
  const newScheduled = new Date(now + hours * 3600 * 1000).toISOString();

  all[idx] = {
    ...all[idx],
    status: 'pending',
    scheduledFor: newScheduled,
    intervalHours: hours,
  };

  saveStoredReminders(all);
  return all[idx];
}

/**
 * Mark a reminder as completed and graduate to the next spaced-repetition tier (e.g., 24h -> 48h)
 */
export function completeReminder(reminderId: string, scheduleNextTier: boolean = true): TopicReminder | null {
  const all = getStoredReminders();
  const idx = all.findIndex((r) => r.id === reminderId);
  if (idx === -1) return null;

  const item = all[idx];
  const nextInterval = item.intervalHours === 24 ? 48 : 72;
  const now = Date.now();

  if (scheduleNextTier && item.repetitionCycle < 3) {
    // Schedule next spaced repetition cycle
    all[idx] = {
      ...item,
      status: 'pending',
      scheduledFor: new Date(now + nextInterval * 3600 * 1000).toISOString(),
      intervalHours: nextInterval,
      repetitionCycle: item.repetitionCycle + 1,
      completedAt: new Date().toISOString(),
    };
  } else {
    // Fully mastered
    all[idx] = {
      ...item,
      status: 'completed',
      completedAt: new Date().toISOString(),
    };
  }

  saveStoredReminders(all);
  return all[idx];
}

/**
 * Dismiss a reminder
 */
export function dismissReminder(reminderId: string): void {
  const all = getStoredReminders();
  const idx = all.findIndex((r) => r.id === reminderId);
  if (idx >= 0) {
    all[idx] = {
      ...all[idx],
      status: 'dismissed',
    };
    saveStoredReminders(all);
  }
}

/**
 * Fast-forward simulation: sets scheduledFor to now - 1 second to immediately trigger due state
 */
export function fastForwardSimulateDue(reminderId: string): TopicReminder | null {
  const all = getStoredReminders();
  const idx = all.findIndex((r) => r.id === reminderId);
  if (idx === -1) return null;

  all[idx] = {
    ...all[idx],
    status: 'due',
    scheduledFor: new Date(Date.now() - 5000).toISOString(),
    lastNotifiedAt: new Date().toISOString(),
  };

  saveStoredReminders(all);
  return all[idx];
}

/**
 * Synthesize a soft, pleasant chime using Web Audio API
 */
export function playNotificationChime(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad
    const startTime = ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + i * 0.08);

      gain.gain.setValueAtTime(0, startTime + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.15, startTime + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + i * 0.08 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + i * 0.08);
      osc.stop(startTime + i * 0.08 + 0.5);
    });
  } catch (err) {
    // AudioContext blocked or not supported
  }
}

/**
 * Trigger HTML5 browser notification if permission is granted
 */
export function triggerSystemNotification(reminder: TopicReminder): void {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    try {
      new Notification(`EduBridge AI: Revisit ${reminder.topicTitle}`, {
        body: `It's time to review your identified gaps in: ${reminder.weakConcepts.join(', ')}. Keep your memory fresh!`,
        icon: '/favicon.ico',
        tag: `reminder-${reminder.id}`,
      });
    } catch (e) {
      // Ignored if in sandboxed iframe
    }
  }
}
