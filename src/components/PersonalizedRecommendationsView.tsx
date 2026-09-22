import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Zap,
  PlayCircle,
  FileText,
  Layers,
  ArrowRight,
  ListTodo,
} from 'lucide-react';
import { STUDENT_RECOMMENDATIONS } from '../data/mockStudentDatabase';

interface PersonalizedRecommendationsViewProps {
  onBackToDashboard: () => void;
  onNavigateToSimulator?: (simulatorId: string) => void;
  onNavigateToMockTest?: (testId: string) => void;
}

export function PersonalizedRecommendationsView({
  onBackToDashboard,
  onNavigateToSimulator,
  onNavigateToMockTest,
}: PersonalizedRecommendationsViewProps) {
  const [goals, setGoals] = useState(STUDENT_RECOMMENDATIONS.dailyGoals);

  const toggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, isCompleted: !g.isCompleted } : g))
    );
  };

  const totalXP = goals.reduce((acc, g) => (g.isCompleted ? acc + g.xpReward : acc), 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center space-x-1.5"
        >
          <span>&larr; Back to Student Dashboard</span>
        </button>

        <div className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>AI Adaptive Academic Plan</span>
        </div>
      </div>

      {/* AI Executive Guidance Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-indigo-500/30 relative overflow-hidden space-y-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Daily AI Synthesis &amp; Strategic Study Plan
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {STUDENT_RECOMMENDATIONS.executiveAdvice}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Active Learning Streak: <strong>5 Days</strong></span>
          <span>&bull;</span>
          <span>Target Study Window: <strong>65 mins today</strong></span>
          <span>&bull;</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">Earned Today: {totalXP} XP</span>
        </div>
      </div>

      {/* Section 1: Topics Requiring Immediate Revision */}
      <div className="space-y-3">
        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Prioritized Revision Topics (Weak Areas Detected)</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {STUDENT_RECOMMENDATIONS.revisionTopics.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {item.subject}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      item.urgency === 'high'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : item.urgency === 'medium'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                    }`}
                  >
                    {item.urgency} Priority
                  </span>
                </div>

                <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                  {item.topicName}
                </h5>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.reason}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>~{item.estimatedMinutes} mins</span>
                </span>

                {item.targetSimulatorId && onNavigateToSimulator && (
                  <button
                    type="button"
                    onClick={() => onNavigateToSimulator(item.targetSimulatorId!)}
                    className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Launch Drill</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Daily Study Goals (Interactive Checklist) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
            <ListTodo className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Daily Study Goals (Interactive XP Tracker)</span>
          </h4>
          <span className="text-xs text-slate-400">
            {goals.filter((g) => g.isCompleted).length} of {goals.length} Completed
          </span>
        </div>

        <div className="space-y-2.5">
          {goals.map((g) => (
            <div
              key={g.id}
              onClick={() => toggleGoal(g.id)}
              className={`p-4 rounded-2xl glass-card border transition flex items-center justify-between cursor-pointer ${
                g.isCompleted
                  ? 'border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/20'
                  : 'border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-400/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition ${
                    g.isCompleted
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800'
                  }`}
                >
                  {g.isCompleted && <CheckCircle2 className="w-4 h-4" />}
                </div>

                <div>
                  <span
                    className={`font-bold text-xs sm:text-sm block ${
                      g.isCompleted
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {g.title}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {g.subject} &bull; {g.targetMinutes} minutes
                  </span>
                </div>
              </div>

              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                  g.isCompleted
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                }`}
              >
                +{g.xpReward} XP
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Weekly Study Schedule */}
      <div className="space-y-3">
        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-pink-600 dark:text-pink-400" />
          <span>Automated Weekly Study Timetable</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {STUDENT_RECOMMENDATIONS.weeklySchedule.map((slot) => (
            <div
              key={slot.id}
              className="p-3.5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-indigo-600 dark:text-indigo-400">
                  {slot.day}
                </span>
                <span className="text-[10px] text-slate-400">{slot.time}</span>
              </div>
              <h6 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                {slot.subject}
              </h6>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                {slot.module}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Curated Learning Resources & Concept Videos */}
      <div className="space-y-3">
        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
          <PlayCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Curated Learning Resources &amp; Concept Labs</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {STUDENT_RECOMMENDATIONS.learningResources.map((res) => (
            <div
              key={res.id}
              className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{res.provider}</span>
                  <span className="px-2 py-0.5 rounded-md font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                    {res.badgeText}
                  </span>
                </div>
                <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  {res.title}
                </h5>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  {res.subject} &bull; {res.duration}
                </span>
              </div>

              {onNavigateToSimulator && (
                <button
                  type="button"
                  onClick={() => onNavigateToSimulator('topic-calculus-chain')}
                  className="w-full py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-xs transition flex items-center justify-center space-x-1"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
