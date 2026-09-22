import React from 'react';
import { GraduationCap, GitFork, LayoutDashboard, UserCheck, RefreshCw, Layers, Award, TrendingUp, Scan, Bell } from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeStep: number;
  onOpenFlowchart: () => void;
  onOpenGitHubModal: () => void;
  onResetDemo: () => void;
  onOpenMasteryDashboard?: () => void;
  isMasteryView?: boolean;
  onOpenAnswerSheetEvaluator?: () => void;
  isAnswerSheetView?: boolean;
  onOpenRemindersCenter?: () => void;
  dueRemindersCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeStep,
  onOpenFlowchart,
  onOpenGitHubModal,
  onResetDemo,
  onOpenMasteryDashboard,
  isMasteryView = false,
  onOpenAnswerSheetEvaluator,
  isAnswerSheetView = false,
  onOpenRemindersCenter,
  dueRemindersCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shadow-indigo-200">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900">EduBridge AI</span>
              <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Academic Gap Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              Find the gap &bull; Build the bridge &bull; Grow with confidence
            </p>
          </div>
        </div>

        {/* Center & Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Handwritten Answer Sheet Evaluator Button */}
          {onOpenAnswerSheetEvaluator && (
            <button
              id="open-answer-sheet-evaluator-btn"
              onClick={onOpenAnswerSheetEvaluator}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                isAnswerSheetView
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-200'
              }`}
              title="Scan or upload handwritten answer sheets (OCR & NLP Evaluation)"
            >
              <Scan className={`w-4 h-4 ${isAnswerSheetView ? 'text-white' : 'text-indigo-600'}`} />
              <span className="hidden sm:inline">Answer Sheet OCR</span>
              <span className="sm:hidden">OCR</span>
            </button>
          )}

          {/* Student Mastery Dashboard Button (for students) */}
          {currentRole === 'student' && onOpenMasteryDashboard && (
            <button
              id="open-mastery-dashboard-btn"
              onClick={onOpenMasteryDashboard}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                isMasteryView
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border-indigo-200'
              }`}
              title="View Student Mastery Dashboard & Progress Bars"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Mastery Dashboard</span>
              <span className="sm:hidden">Mastery</span>
            </button>
          )}

          {/* Recurring 24-48h Reminder Notification Center */}
          {onOpenRemindersCenter && (
            <button
              id="open-reminders-center-btn"
              onClick={onOpenRemindersCenter}
              className="relative p-2 rounded-lg text-slate-700 hover:text-indigo-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
              title="Spaced Repetition & Weak Topic Reminders (24-48h)"
            >
              <Bell className="w-4 h-4" />
              {dueRemindersCount > 0 ? (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-600 text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-xs animate-pulse">
                  {dueRemindersCount}
                </span>
              ) : (
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
              )}
            </button>
          )}

          {/* Flowchart Architecture Button */}
          <button
            id="open-flowchart-btn"
            onClick={onOpenFlowchart}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition border border-slate-200"
            title="Inspect 12-Step Architecture Flowchart"
          >
            <Layers className="w-4 h-4 text-indigo-600" />
            <span className="hidden md:inline">Architecture Flowchart</span>
            <span className="md:hidden">Flowchart</span>
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] ml-0.5 font-bold">
              {activeStep}
            </span>
          </button>

          {/* GitHub Code Guide Button */}
          <button
            id="open-github-modal-btn"
            onClick={onOpenGitHubModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition border border-slate-200"
          >
            <GitFork className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">GitHub Push Guide</span>
          </button>

          {/* Role Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              id="role-student-btn"
              onClick={() => onRoleChange('student')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition ${
                currentRole === 'student'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>
            <button
              id="role-faculty-btn"
              onClick={() => onRoleChange('faculty')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition ${
                currentRole === 'faculty'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Faculty</span>
            </button>
          </div>

          {/* Reset Demo Button */}
          <button
            id="reset-demo-btn"
            onClick={onResetDemo}
            title="Reset system workflow"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
