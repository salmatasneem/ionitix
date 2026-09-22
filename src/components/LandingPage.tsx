import React from 'react';
import {
  Sparkles,
  User,
  ShieldCheck,
  Brain,
  FileCheck2,
  CalendarCheck,
  LineChart,
  Target,
  Layers,
  ArrowRight,
  GraduationCap,
  Award,
  Zap,
  CheckCircle,
  Clock,
  Compass,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface LandingPageProps {
  onOpenStudentLogin: () => void;
  onOpenFacultyLogin: () => void;
  onQuickExploreDemo: () => void;
}

export function LandingPage({
  onOpenStudentLogin,
  onOpenFacultyLogin,
  onQuickExploreDemo,
}: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070913] text-slate-900 dark:text-white transition-colors duration-300 relative overflow-hidden flex flex-col ai-mesh-bg">
      {/* Dynamic Background Glows */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-br from-indigo-500/15 via-purple-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-60 w-[500px] h-[500px] bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-60 w-[500px] h-[500px] bg-indigo-600/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Floating Glass Navigation */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/75 dark:bg-slate-950/75 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-400 bg-clip-text text-transparent">
                EduBridge AI
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                Institutional OS
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 sm:space-x-4">
            <ThemeToggle />

            <button
              onClick={onOpenStudentLogin}
              className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl border border-indigo-200 dark:border-indigo-900/60 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 transition flex items-center space-x-1.5 cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Student Login</span>
            </button>

            <button
              onClick={onOpenFacultyLogin}
              className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md shadow-indigo-500/20 transition flex items-center space-x-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Faculty Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Next-Generation AI Intelligence for Higher Education</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Bridging Academic Gaps With{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Precision AI
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The all-in-one cognitive learning OS. Featuring adaptive AI IQ evaluations, handwritten OCR answer sheet grading, weekly timed mock examinations, multi-semester academic risk forecasting, and faculty analytics.
          </p>

          {/* Dual Action Primary CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
            <button
              onClick={onOpenStudentLogin}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-500/25 flex items-center justify-center space-x-2 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <User className="w-5 h-5" />
              <span>Enter Student Portal</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={onOpenFacultyLogin}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl glass-card border border-purple-500/30 hover:border-purple-500/60 text-slate-900 dark:text-white font-bold text-sm sm:text-base hover:bg-purple-50/50 dark:hover:bg-purple-950/30 flex items-center justify-center space-x-2 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>Enter Faculty Portal</span>
            </button>

            <button
              onClick={onQuickExploreDemo}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs sm:text-sm font-semibold transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Interactive Guest Demo</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
            <div className="p-3.5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80">
              <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">96.8%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Vision OCR Accuracy</div>
            </div>
            <div className="p-3.5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80">
              <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">5 Domains</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Adaptive AI IQ Engine</div>
            </div>
            <div className="p-3.5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80">
              <div className="text-2xl font-extrabold text-pink-600 dark:text-pink-400">24-48h</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Spaced Memory Loops</div>
            </div>
            <div className="p-3.5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80">
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">&lt; 0.05s</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Early Risk Detection</div>
            </div>
          </div>
        </div>

        {/* Feature Bento Grid */}
        <section className="mt-16 sm:mt-24 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Engineered for Comprehensive Academic Excellence
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Every tool is grounded in cognitive science, real-time Gemini AI multimodal intelligence, and predictive academic analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Feature 1: Adaptive AI IQ Assessment */}
            <div className="p-6 rounded-3xl glass-card glass-card-hover border border-indigo-500/20 dark:border-indigo-500/20 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Adaptive AI IQ Assessment
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Evaluates Logical Reasoning, Pattern Recognition, Verbal Aptitude, Analytical Thinking, and Problem-Solving. Questions adapt dynamically in real-time based on student accuracy.
              </p>
              <div className="pt-2 flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 space-x-1">
                <span>Try Adaptive Assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 2: Handwritten Answer Sheet OCR */}
            <div className="p-6 rounded-3xl glass-card glass-card-hover border border-purple-500/20 dark:border-purple-500/20 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Handwritten Answer Sheet OCR & NLP
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Upload handwritten exam papers via file or live webcam. AI extracts mathematical and verbal steps, checks marking schemes, pinpoints missing concepts, and outputs printable grade reports.
              </p>
              <div className="pt-2 flex items-center text-xs font-bold text-purple-600 dark:text-purple-400 space-x-1">
                <span>Evaluate Answer Sheet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 3: Weekly AI Mock Tests */}
            <div className="p-6 rounded-3xl glass-card glass-card-hover border border-pink-500/20 dark:border-pink-500/20 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Weekly AI Mock Tests
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Automated timed examinations generated per syllabus. Instant step-by-step evaluation, weekly performance comparison graphs, and automated gap diagnosis after every submission.
              </p>
              <div className="pt-2 flex items-center text-xs font-bold text-pink-600 dark:text-pink-400 space-x-1">
                <span>Take Weekly Mock Test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 4: Previous Year Analytics & Risk Prediction */}
            <div className="p-6 rounded-3xl glass-card glass-card-hover border border-amber-500/20 dark:border-amber-500/20 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <LineChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Multi-Semester Risk Forecasting
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Tracks historical subject marks and SGPA from Semester 1 onwards. AI early warning detectors flag backlog vulnerabilities and attendance dips before final examinations.
              </p>
              <div className="pt-2 flex items-center text-xs font-bold text-amber-600 dark:text-amber-400 space-x-1">
                <span>View Risk Intelligence</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 5: Problem-Solving Skill Radar */}
            <div className="p-6 rounded-3xl glass-card glass-card-hover border border-cyan-500/20 dark:border-cyan-500/20 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                5-Dimensional Skill Analytics
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Visualizes Critical Thinking, Logical Reasoning, Speed, Accuracy, and Consistency on institutional radar benchmarks to cultivate industrial-grade problem-solving dexterity.
              </p>
              <div className="pt-2 flex items-center text-xs font-bold text-cyan-600 dark:text-cyan-400 space-x-1">
                <span>Explore Skill Radar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 6: Interactive 12-Step Pedagogical Bridge */}
            <div className="p-6 rounded-3xl glass-card glass-card-hover border border-emerald-500/20 dark:border-emerald-500/20 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Interactive Visual Simulators
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                When students miss foundational prerequisites, EduBridge automatically generates a tailored bridge path with animated visual laboratory simulations to reconstruct lost mental models.
              </p>
              <div className="pt-2 flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 space-x-1">
                <span>Launch Live Simulators</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">EduBridge AI</span>
            <span>&bull;</span>
            <span>Institutional AI Intelligence for Higher Education</span>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <span className="hover:text-indigo-600 cursor-pointer">Security & FERPA Compliance</span>
            <span>&bull;</span>
            <span className="hover:text-indigo-600 cursor-pointer">API Documentation</span>
            <span>&bull;</span>
            <span>v3.2 Production</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
