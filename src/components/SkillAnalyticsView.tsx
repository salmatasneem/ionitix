import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  Target,
  Zap,
  Award,
  TrendingUp,
  Clock,
  CheckCircle2,
  Brain,
  Gauge,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { STUDENT_SKILL_PROFILE } from '../data/mockStudentDatabase';

interface SkillAnalyticsViewProps {
  onBackToDashboard: () => void;
  onNavigateToSimulator?: (simulatorId: string) => void;
}

export function SkillAnalyticsView({
  onBackToDashboard,
  onNavigateToSimulator,
}: SkillAnalyticsViewProps) {
  const profile = STUDENT_SKILL_PROFILE;

  const radarData = [
    {
      subject: 'Critical Thinking',
      student: profile.dimensions.criticalThinking,
      cohort: profile.cohortAverages.criticalThinking,
      fullMark: 100,
    },
    {
      subject: 'Logical Reasoning',
      student: profile.dimensions.logicalReasoning,
      cohort: profile.cohortAverages.logicalReasoning,
      fullMark: 100,
    },
    {
      subject: 'Speed',
      student: profile.dimensions.problemSolvingSpeed,
      cohort: profile.cohortAverages.problemSolvingSpeed,
      fullMark: 100,
    },
    {
      subject: 'Accuracy',
      student: profile.dimensions.accuracy,
      cohort: profile.cohortAverages.accuracy,
      fullMark: 100,
    },
    {
      subject: 'Consistency',
      student: profile.dimensions.consistency,
      cohort: profile.cohortAverages.consistency,
      fullMark: 100,
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center space-x-1.5"
        >
          <span>&larr; Back to Student Dashboard</span>
        </button>

        <div className="px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/60 text-xs font-bold text-cyan-700 dark:text-cyan-300 flex items-center space-x-1.5">
          <Target className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>Cognitive Skill Analytics</span>
        </div>
      </div>

      {/* Hero Overview Card */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-cyan-500/30 text-center relative overflow-hidden space-y-4">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/60 text-xs font-bold text-cyan-700 dark:text-cyan-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>AI Problem-Solving Aptitude Index</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 my-2">
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
              Problem-Solving Score
            </div>
            <div className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              {profile.overallIndex}/100
            </div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center justify-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>+{profile.growthDeltaLastMonth}% Growth this Month</span>
            </div>
          </div>

          <div className="h-16 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
              Cohort Percentile
            </div>
            <div className="text-5xl sm:text-6xl font-extrabold text-slate-900 dark:text-white">
              {profile.percentileRank}%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Top Tier Engineering Problem Solver
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
          Evaluated across 5 foundational vectors using continuous diagnostic interactions, mock test timing telemetry, and OCR proof structures.
        </p>
      </div>

      {/* Main Grid: Radar Chart + 5 Vector Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
              <Target className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>5-Dimensional Radar Comparison</span>
            </h4>
            <span className="text-[11px] text-slate-400">Against Institutional Cohort</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#94a3b8" opacity={0.2} />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" fontSize={10} opacity={0.5} />
                <Radar
                  name="Rahul Sharma"
                  dataKey="student"
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.45}
                />
                <Radar
                  name="Cohort Average"
                  dataKey="cohort"
                  stroke="#94a3b8"
                  fill="#94a3b8"
                  fillOpacity={0.2}
                />
                <Legend />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5 Vectors Detailed Progress (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            Skill Dimension Metrics
          </h4>

          <div className="space-y-3.5">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">Critical Thinking</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{profile.dimensions.criticalThinking}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${profile.dimensions.criticalThinking}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">Logical Reasoning</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{profile.dimensions.logicalReasoning}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${profile.dimensions.logicalReasoning}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">Problem-Solving Speed</span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400">{profile.dimensions.problemSolvingSpeed}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${profile.dimensions.problemSolvingSpeed}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">Accuracy Rate</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{profile.dimensions.accuracy}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${profile.dimensions.accuracy}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">Consistency Index</span>
                <span className="font-bold text-pink-600 dark:text-pink-400">{profile.dimensions.consistency}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-pink-500 rounded-full" style={{ width: `${profile.dimensions.consistency}%` }} />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            Cohort benchmark average across all 5 dimensions is <strong>71.8%</strong>.
          </div>
        </div>
      </div>

      {/* Speed vs Accuracy Analysis & Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Speed & Calibration Card */}
        <div className="p-5 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-3">
          <div className="flex items-center space-x-2 font-bold text-sm text-slate-900 dark:text-white">
            <Gauge className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Speed vs Accuracy Calibration</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Average Pace per Question</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">
                {profile.speedAnalysis.averageSecondsPerProblem}s
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Optimal Cognitive Window</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">
                {profile.speedAnalysis.idealWindowSeconds}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="text-emerald-900 dark:text-emerald-300 font-medium">Tradeoff State</span>
              <span className="font-extrabold text-emerald-700 dark:text-emerald-300 uppercase text-[10px] tracking-wider">
                {profile.speedAnalysis.speedVsAccuracyTradeoff}
              </span>
            </div>
          </div>
        </div>

        {/* Cognitive Badges */}
        <div className="p-5 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-3">
          <div className="flex items-center space-x-2 font-bold text-sm text-slate-900 dark:text-white">
            <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Earned Problem-Solving Badges</span>
          </div>

          <div className="space-y-2 text-xs">
            {profile.keyBadges.map((b, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center space-x-3"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{b.title}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{b.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
