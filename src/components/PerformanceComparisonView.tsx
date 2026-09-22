import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { PerformanceComparison } from '../types';
import { TrendingUp, CheckCircle2, AlertCircle, ArrowRight, RotateCcw, Award, Sparkles, LayoutDashboard } from 'lucide-react';

interface PerformanceComparisonViewProps {
  comparison: PerformanceComparison;
  topicTitle: string;
  rootGapConcept: string;
  onGoToFacultyDashboard: () => void;
  onGenerateNextBridge: () => void;
  onSelectAnotherTopic: () => void;
  onViewMasteryDashboard?: () => void;
}

export const PerformanceComparisonView: React.FC<PerformanceComparisonViewProps> = ({
  comparison,
  topicTitle,
  rootGapConcept,
  onGoToFacultyDashboard,
  onGenerateNextBridge,
  onSelectAnotherTopic,
  onViewMasteryDashboard,
}) => {
  const isResolved = comparison.gapResolved;

  useEffect(() => {
    if (isResolved) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6'],
      });
    }
  }, [isResolved]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
              Steps 11 &amp; 12 of 12 &bull; Performance Comparison
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                isResolved
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}
            >
              {isResolved ? 'Status: Gap Resolved & Mastered' : 'Status: Reinforcement Bridge Required'}
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
            Pre-Diagnostic vs. Post-Bridge Growth Analysis
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            AI Progress Analyzer evaluates mastery gains across the learning dependency path, marking the student concept map as updated.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {isResolved ? (
            <button
              onClick={onGoToFacultyDashboard}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-200 transition"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>View Faculty Class Insights</span>
            </button>
          ) : (
            <button
              onClick={onGenerateNextBridge}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold shadow-md shadow-amber-200 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Generate Next Targeted Bridge</span>
            </button>
          )}
        </div>
      </div>

      {/* Comparison Score Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pre Diagnostic */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Step 3: Initial Diagnostic
            </span>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-2">
              {comparison.initialDiagnosticScore}%
            </h3>
            <p className="text-xs text-slate-500 mt-1">Baseline prior to gap detection</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-rose-600 font-semibold">
            <span>Root Gap Detected</span>
            <span>🚨 {rootGapConcept}</span>
          </div>
        </div>

        {/* Post Bridge */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Step 10: Post-Bridge Score
            </span>
            <h3 className="text-3xl font-extrabold text-indigo-600 mt-2">
              {comparison.postBridgeScore}%
            </h3>
            <p className="text-xs text-slate-500 mt-1">After Live Visualizer &amp; Bridge Recovery</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-600 font-semibold">
            <span>Target Concept</span>
            <span>✓ {topicTitle}</span>
          </div>
        </div>

        {/* Net Improvement Delta */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              Step 11: Mastery Gain Delta
            </span>
            <h3 className="text-3xl font-extrabold text-emerald-400 mt-2 flex items-center space-x-1">
              <span>+{comparison.improvementDelta}%</span>
              <TrendingUp className="w-6 h-6 text-emerald-400 ml-1" />
            </h3>
            <p className="text-xs text-slate-300 mt-1">Net gain in academic comprehension</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-indigo-200 font-medium">
            Prerequisite gap status: <strong className="text-white">{isResolved ? 'RESOLVED' : 'IN PROGRESS'}</strong>
          </div>
        </div>
      </div>

      {/* Resolution Card Details */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-start space-x-3.5">
          <div
            className={`p-3 rounded-xl shrink-0 ${
              isResolved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}
          >
            {isResolved ? <Award className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              {isResolved
                ? `Success! Academic Gap Healed in "${rootGapConcept}"`
                : `Reinforcement Recommended for "${rootGapConcept}"`}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {comparison.nextRecommendation}
            </p>
          </div>
        </div>

        {/* Strengths observed */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2 text-xs">
            <span className="font-bold text-emerald-900 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Demonstrated Strengths:</span>
            </span>
            <ul className="space-y-1 text-emerald-950 pl-3 list-disc">
              {comparison.strengthsObserved.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-slate-900 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Next Progression Milestone:</span>
            </span>
            <p className="text-slate-600 leading-relaxed">
              {isResolved
                ? 'Your learning map has been updated to reflect full mastery. You are now prepared for advanced applications and upcoming midterm examinations.'
                : 'Another focused mini-bridge with alternative visual perspectives is ready to solidify the remaining edge-cases.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={onSelectAnotherTopic}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
            >
              Explore Another Subject
            </button>

            {onViewMasteryDashboard && (
              <button
                id="view-mastery-from-comparison-btn"
                onClick={onViewMasteryDashboard}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition shadow-xs"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Student Mastery Dashboard</span>
              </button>
            )}
          </div>

          <button
            onClick={onGoToFacultyDashboard}
            className="inline-flex items-center space-x-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow transition"
          >
            <span>Faculty Insight Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
