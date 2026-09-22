import React, { useState } from 'react';
import {
  Brain,
  FileCheck2,
  CalendarCheck,
  LineChart,
  Target,
  Sparkles,
  Layers,
  Award,
  ArrowRight,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Zap,
  ChevronRight,
  LogOut,
  Bell,
  Eye,
  FileText,
  HelpCircle,
  Printer,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';
import {
  CURRENT_STUDENT,
  RECENT_ANSWER_SHEET_REPORT,
  WEEKLY_MOCK_TESTS,
  STUDENT_RECOMMENDATIONS,
  STUDENT_SEMESTER_HISTORY,
  STUDENT_RISK_PROFILE,
  STUDENT_SKILL_PROFILE,
} from '../data/mockStudentDatabase';
import { UserProfile, AnswerSheetEvaluationReport } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { AdaptiveIQAssessment } from './AdaptiveIQAssessment';
import { WeeklyMockTestEngine } from './WeeklyMockTestEngine';
import { PreviousYearPerformanceView } from './PreviousYearPerformanceView';
import { SkillAnalyticsView } from './SkillAnalyticsView';
import { PersonalizedRecommendationsView } from './PersonalizedRecommendationsView';
import { HandwrittenSheetEvaluator } from './HandwrittenSheetEvaluator';

export type StudentDashboardTab =
  | 'overview'
  | 'iq_assessment'
  | 'mock_tests'
  | 'ocr_evaluation'
  | 'previous_performance'
  | 'skill_analytics'
  | 'recommendations'
  | 'gap_simulator';

interface StudentPortalDashboardProps {
  user: UserProfile;
  onLogout: () => void;
  onNavigateToSimulatorFlow?: () => void;
}

export function StudentPortalDashboard({
  user,
  onLogout,
  onNavigateToSimulatorFlow,
}: StudentPortalDashboardProps) {
  const [activeTab, setActiveTab] = useState<StudentDashboardTab>('overview');
  const [selectedReportForModal, setSelectedReportForModal] =
    useState<AnswerSheetEvaluationReport | null>(null);

  // Subject-wise current semester marks for chart
  const currentSemester = STUDENT_SEMESTER_HISTORY[STUDENT_SEMESTER_HISTORY.length - 1];
  const subjectMarksData = currentSemester.subjects.map((sub) => ({
    name: sub.code,
    subjectName: sub.name,
    internal: sub.internalMarks,
    external: sub.externalMarks,
    total: sub.totalMarks,
    attendance: sub.attendancePercentage,
  }));

  // Skill radar mini-data
  const skillMiniData = [
    { name: 'Critical Thinking', val: STUDENT_SKILL_PROFILE.dimensions.criticalThinking },
    { name: 'Logic', val: STUDENT_SKILL_PROFILE.dimensions.logicalReasoning },
    { name: 'Speed', val: STUDENT_SKILL_PROFILE.dimensions.problemSolvingSpeed },
    { name: 'Accuracy', val: STUDENT_SKILL_PROFILE.dimensions.accuracy },
    { name: 'Consistency', val: STUDENT_SKILL_PROFILE.dimensions.consistency },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070913] text-slate-900 dark:text-white transition-colors pb-16 ai-mesh-bg">
      {/* Top Floating Glass Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center space-x-3 text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-md shadow-indigo-500/20">
                <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-400 bg-clip-text text-transparent">
                  EduBridge AI
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Student Portal
                </span>
              </div>
            </button>
          </div>

          {/* Quick User Actions & Profile */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <ThemeToggle />

            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">{user.usn}</span>
              <span className="text-slate-400">&bull;</span>
              <span className="text-slate-500 dark:text-slate-400">Sem {user.semester}</span>
            </div>

            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Print / Export PDF for Offline Review"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none text-xs font-bold border-t border-slate-100 dark:border-slate-800/60">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('iq_assessment')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'iq_assessment'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Adaptive AI IQ</span>
          </button>

          <button
            onClick={() => setActiveTab('mock_tests')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'mock_tests'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Weekly Mock Tests</span>
          </button>

          <button
            onClick={() => setActiveTab('ocr_evaluation')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'ocr_evaluation'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Answer Sheet OCR</span>
          </button>

          <button
            onClick={() => setActiveTab('previous_performance')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'previous_performance'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>Multi-Sem Marks &amp; Risk</span>
          </button>

          <button
            onClick={() => setActiveTab('skill_analytics')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'skill_analytics'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Skill Radar</span>
          </button>

          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'recommendations'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalized AI Plan</span>
          </button>

          {onNavigateToSimulatorFlow && (
            <button
              onClick={onNavigateToSimulatorFlow}
              className="px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer flex items-center space-x-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Concept Simulators</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Official Print Header (Visible only when printed or exported as PDF) */}
        <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-700 text-white flex items-center justify-center font-black text-lg">
                EB
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                  EduBridge AI &bull; Academic Intelligence System
                </h1>
                <p className="text-xs text-slate-600">
                  Official Student Portal Comprehensive Academic &amp; Skill Report
                </p>
              </div>
            </div>
            <div className="text-right text-xs">
              <p className="font-bold text-slate-900">Student Copy &bull; Offline Review</p>
              <p className="text-slate-500">Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-300">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Student Name</span>
              <span className="font-bold text-slate-900">{user.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Student USN</span>
              <span className="font-mono font-bold text-slate-900">{user.usn}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Department</span>
              <span className="font-bold text-slate-900">{user.department}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Academic Record</span>
              <span className="font-bold text-slate-900">Semester {user.semester} &bull; CGPA {user.cgpa}</span>
            </div>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* 1. Welcome Banner Card */}
            <div className="p-6 sm:p-8 rounded-3xl glass-card border border-indigo-500/20 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/60 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>AI Academic Co-Pilot Active</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Welcome back, {user.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {user.department} &bull; Semester {user.semester} (Section {user.section}). Your cumulative academic standing is currently in the <strong>top 6%</strong> of your institution cohort.
                </p>
              </div>

              {/* Quick Standings Badges */}
              <div className="flex items-center gap-3">
                <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center min-w-[100px]">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">Overall CGPA</span>
                  <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    {user.cgpa}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center min-w-[100px]">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">Attendance</span>
                  <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {user.attendanceRate}%
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center min-w-[100px]">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">Risk State</span>
                  <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 uppercase">
                    {STUDENT_RISK_PROFILE.riskLevel}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Quick Action Feature Launchpad Bento */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              <button
                type="button"
                onClick={() => setActiveTab('iq_assessment')}
                className="p-4 rounded-2xl glass-card glass-card-hover border border-indigo-500/20 text-left space-y-2 transition cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Adaptive IQ</h4>
                  <p className="text-[11px] text-slate-400">5-Domain Test</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('mock_tests')}
                className="p-4 rounded-2xl glass-card glass-card-hover border border-purple-500/20 text-left space-y-2 transition cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Mock Tests</h4>
                  <p className="text-[11px] text-slate-400">Week 4 Active</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ocr_evaluation')}
                className="p-4 rounded-2xl glass-card glass-card-hover border border-pink-500/20 text-left space-y-2 transition cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Answer OCR</h4>
                  <p className="text-[11px] text-slate-400">Handwritten Grading</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('previous_performance')}
                className="p-4 rounded-2xl glass-card glass-card-hover border border-amber-500/20 text-left space-y-2 transition cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <LineChart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Multi-Sem Marks</h4>
                  <p className="text-[11px] text-slate-400">Risk Forecasting</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('skill_analytics')}
                className="p-4 rounded-2xl glass-card glass-card-hover border border-cyan-500/20 text-left space-y-2 transition cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Skill Radar</h4>
                  <p className="text-[11px] text-slate-400">Speed &amp; Accuracy</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('recommendations')}
                className="p-4 rounded-2xl glass-card glass-card-hover border border-emerald-500/20 text-left space-y-2 transition cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">AI Plan</h4>
                  <p className="text-[11px] text-slate-400">Daily Study Goals</p>
                </div>
              </button>
            </div>

            {/* 3. Subject-Wise Performance Charts & Skill Radar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Subject-Wise Marks Bar Chart (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>Semester 5 Subject Marks &amp; Assessment Breakdown</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">Internal (50) vs External (50)</p>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    Average: 88.5/100
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subjectMarksData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                      <YAxis domain={[0, 50]} stroke="#94a3b8" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderRadius: '12px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          fontSize: '12px',
                          color: '#fff',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="internal" name="Internal (50)" fill="#6366f1" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="external" name="External (50)" fill="#a855f7" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Cognitive Radar (5 cols) */}
              <div className="lg:col-span-5 p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                    <Target className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <span>Cognitive Dexterity Radar</span>
                  </h4>
                  <button
                    onClick={() => setActiveTab('skill_analytics')}
                    className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
                  >
                    Deep Dive &rarr;
                  </button>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillMiniData}>
                      <PolarGrid stroke="#94a3b8" opacity={0.2} />
                      <PolarAngleAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" fontSize={9} opacity={0.4} />
                      <Radar
                        name="Aptitude"
                        dataKey="val"
                        stroke="#06b6d4"
                        fill="#06b6d4"
                        fillOpacity={0.45}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 4. Upcoming Weekly Mock Tests & Recent Answer Sheet Reports */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upcoming Mock Test Card */}
              <div className="p-6 rounded-3xl glass-card border border-purple-500/30 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                      Weekly Examination Live
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Closes in 3 days
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {WEEKLY_MOCK_TESTS[0].title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Test your mastery on Directional Derivatives, Gradient Vectors, and the Multivariable Chain Rule. Instant step-by-step diagnostic breakdown upon completion.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    <span>{WEEKLY_MOCK_TESTS[0].durationMinutes} mins</span>
                    <span className="mx-1.5">&bull;</span>
                    <span>{WEEKLY_MOCK_TESTS[0].totalMarks} Marks</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('mock_tests')}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition shadow-md flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Start Mock Exam</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Recent Answer Sheet Evaluation Report */}
              <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Recent OCR Grading Report
                    </span>
                    <span className="text-xs text-slate-400">
                      {RECENT_ANSWER_SHEET_REPORT.student.date}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">
                      {RECENT_ANSWER_SHEET_REPORT.student.subject}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Exam Code: {RECENT_ANSWER_SHEET_REPORT.student.examCode} &bull; OCR Confidence: {RECENT_ANSWER_SHEET_REPORT.ocrConfidence}%
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {RECENT_ANSWER_SHEET_REPORT.executiveSummary}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                      {RECENT_ANSWER_SHEET_REPORT.totalScore}/{RECENT_ANSWER_SHEET_REPORT.maxScore}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      Grade {RECENT_ANSWER_SHEET_REPORT.grade}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelectedReportForModal(RECENT_ANSWER_SHEET_REPORT)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition"
                    >
                      Quick View
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('ocr_evaluation')}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-md"
                    >
                      New Upload
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. AI Generated Improvement Recommendations Summary Card */}
            <div className="p-6 sm:p-8 rounded-3xl glass-card border border-indigo-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    AI-Generated Priority Recommendations for Rahul
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('recommendations')}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
                >
                  <span>Full Strategic Plan</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {STUDENT_RECOMMENDATIONS.revisionTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {topic.subject}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          topic.urgency === 'high'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {topic.urgency}
                      </span>
                    </div>

                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                      {topic.topicName}
                    </h5>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      {topic.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Adaptive IQ Assessment */}
        {activeTab === 'iq_assessment' && (
          <AdaptiveIQAssessment
            onBackToDashboard={() => setActiveTab('overview')}
            onNavigateToSimulator={onNavigateToSimulatorFlow}
          />
        )}

        {/* Tab 3: Weekly Mock Tests */}
        {activeTab === 'mock_tests' && (
          <WeeklyMockTestEngine
            onBackToDashboard={() => setActiveTab('overview')}
            onNavigateToSimulator={onNavigateToSimulatorFlow}
          />
        )}

        {/* Tab 4: Handwritten Answer Sheet Evaluation */}
        {activeTab === 'ocr_evaluation' && (
          <HandwrittenSheetEvaluator
            onBack={() => setActiveTab('overview')}
            onNavigateToSimulator={onNavigateToSimulatorFlow}
          />
        )}

        {/* Tab 5: Previous Year Marks & Academic Risk */}
        {activeTab === 'previous_performance' && (
          <PreviousYearPerformanceView
            onBackToDashboard={() => setActiveTab('overview')}
            onNavigateToSimulator={onNavigateToSimulatorFlow}
          />
        )}

        {/* Tab 6: Problem-Solving Skill Analytics */}
        {activeTab === 'skill_analytics' && (
          <SkillAnalyticsView
            onBackToDashboard={() => setActiveTab('overview')}
            onNavigateToSimulator={onNavigateToSimulatorFlow}
          />
        )}

        {/* Tab 7: Personalized AI Recommendations */}
        {activeTab === 'recommendations' && (
          <PersonalizedRecommendationsView
            onBackToDashboard={() => setActiveTab('overview')}
            onNavigateToSimulator={onNavigateToSimulatorFlow}
            onNavigateToMockTest={() => setActiveTab('mock_tests')}
          />
        )}
      </main>

      {/* Quick View Modal for Answer Sheet Report */}
      {selectedReportForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 rounded-3xl glass-card border border-indigo-500/30 text-slate-900 dark:text-white shadow-2xl space-y-4">
            <button
              onClick={() => setSelectedReportForModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            >
              &times;
            </button>

            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                {selectedReportForModal.student.examCode} &bull; {selectedReportForModal.student.date}
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {selectedReportForModal.student.subject}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Student: {selectedReportForModal.student.name} ({selectedReportForModal.student.rollNumber})
              </p>
            </div>

            <div className="flex items-center justify-around p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Marks</span>
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  {selectedReportForModal.totalScore}/{selectedReportForModal.maxScore}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Grade</span>
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedReportForModal.grade}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">OCR Confidence</span>
                <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {selectedReportForModal.ocrConfidence}%
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Question Performance
              </h5>
              {selectedReportForModal.questions.map((q) => (
                <div
                  key={q.questionNumber}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>{q.questionNumber}: {q.questionText}</span>
                    <span className="text-indigo-600 dark:text-indigo-400">
                      {q.marksAwarded}/{q.maxMarks}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    {q.feedbackSummary}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedReportForModal(null)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
