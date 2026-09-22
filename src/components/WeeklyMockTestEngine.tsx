import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  ArrowRight,
  RotateCcw,
  Sparkles,
  BarChart2,
  Flag,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { WEEKLY_MOCK_TESTS } from '../data/mockStudentDatabase';
import { WeeklyMockTest, MockTestResult } from '../types';

interface WeeklyMockTestEngineProps {
  onBackToDashboard: () => void;
  onNavigateToSimulator?: (conceptId: string) => void;
}

export function WeeklyMockTestEngine({
  onBackToDashboard,
  onNavigateToSimulator,
}: WeeklyMockTestEngineProps) {
  const [selectedTest, setSelectedTest] = useState<WeeklyMockTest>(WEEKLY_MOCK_TESTS[0]);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(selectedTest.durationMinutes * 60);
  const [testResult, setTestResult] = useState<MockTestResult | null>(null);

  // Timer
  useEffect(() => {
    if (!isTestRunning || testResult) return;
    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTestRunning, testResult]);

  const handleStartTest = () => {
    setIsTestRunning(true);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setFlaggedQuestions({});
    setTimeRemainingSeconds(selectedTest.durationMinutes * 60);
    setTestResult(null);
  };

  const handleSelectOption = (optIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optIndex,
    }));
  };

  const handleToggleFlag = () => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQuestionIndex]: !prev[currentQuestionIndex],
    }));
  };

  const handleSubmitTest = () => {
    setIsTestRunning(false);

    let earnedScore = 0;
    const totalPossible = selectedTest.totalMarks;

    const questionResults = selectedTest.questions.map((q, idx) => {
      const chosen = answers[idx];
      const isCorrect = chosen === q.correctAnswerIndex;
      if (isCorrect) {
        earnedScore += q.marks;
      } else if (chosen !== undefined) {
        earnedScore = Math.max(0, earnedScore - 2.5); // Negative marking
      }
      return {
        questionId: q.id,
        selectedOption: chosen !== undefined ? chosen : -1,
        isCorrect,
        timeSpentSeconds: 45,
        explanation: q.explanation,
      };
    });

    const percentage = Math.round((earnedScore / totalPossible) * 100);
    const correctCount = questionResults.filter((q) => q.isCorrect).length;
    const accuracy = Math.round((correctCount / selectedTest.questions.length) * 100);

    const result: MockTestResult = {
      id: 'mock_res_' + Date.now(),
      testId: selectedTest.id,
      testTitle: selectedTest.title,
      subject: selectedTest.subject,
      score: Math.max(0, Math.round(earnedScore)),
      maxScore: totalPossible,
      percentage: Math.max(0, percentage),
      accuracy,
      timeSpentMinutes: Math.round((selectedTest.durationMinutes * 60 - timeRemainingSeconds) / 60),
      submittedAt: new Date().toISOString(),
      questionResults,
      aiFeedback: {
        summary: `Strong grasp of directional vectors and conservative criteria. You secured ${earnedScore}/${totalPossible} marks. One prerequisite slip-up observed in the Multivariable Chain Rule question.`,
        criticalGapsDetected: [
          'Multivariable intermediate chain rule cancellation steps',
        ],
        suggestedTopics: [
          'Multivariable Chain Rule with intermediate parameters',
          'Directional Derivatives along unit gradients',
        ],
        speedVsAccuracyInsight: 'You paced your test at ~2.8 minutes per 10-mark question, which is well inside the 6-minute target limit.',
      },
      weeklyTrend: [
        { week: 'Week 1', score: 68, cohortAvg: 62 },
        { week: 'Week 2', score: 74, cohortAvg: 65 },
        { week: 'Week 3', score: 80, cohortAvg: 70 },
        { week: 'Week 4 (Now)', score: Math.max(0, percentage), cohortAvg: 72 },
      ],
    };

    setTestResult(result);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const activeQuestion = selectedTest.questions[currentQuestionIndex];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Top Breadcrumb & Status */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center space-x-1.5"
        >
          <span>&larr; Back to Student Dashboard</span>
        </button>

        <div className="flex items-center space-x-3">
          <div className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center space-x-1.5">
            <FileCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Weekly AI Mock Test Engine</span>
          </div>

          {isTestRunning && (
            <div
              className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold flex items-center space-x-1.5 transition ${
                timeRemainingSeconds < 300
                  ? 'bg-rose-100 text-rose-700 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(timeRemainingSeconds)}</span>
            </div>
          )}
        </div>
      </div>

      {!isTestRunning && !testResult ? (
        /* Test Overview & Start Screen */
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                {selectedTest.subject} &bull; Week {selectedTest.weekNumber}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {selectedTest.title}
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800">
                Active &bull; Deadline: {selectedTest.deadlineDate}
              </span>
            </div>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block font-medium">Duration</span>
              <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {selectedTest.durationMinutes} Minutes
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block font-medium">Questions</span>
              <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {selectedTest.totalQuestions} Questions
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block font-medium">Total Marks</span>
              <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {selectedTest.totalMarks} Marks
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block font-medium">Evaluation</span>
              <span className="text-base font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                Instant AI NLP
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">
              Examination Guidelines:
            </h4>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc pl-4">
              {selectedTest.instructions.map((inst, i) => (
                <li key={i}>{inst}</li>
              ))}
              <li>You can flag questions and review them anytime before final submission.</li>
              <li>Your submission will update your institutional weekly mastery curve.</li>
            </ul>
          </div>

          {/* Launch Button */}
          <button
            type="button"
            onClick={handleStartTest}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-xl shadow-purple-500/25 flex items-center justify-center space-x-2 transition cursor-pointer"
          >
            <span>Begin Timed Mock Examination</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : isTestRunning ? (
        /* Active Test Interface */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Panel (3 cols) */}
          <div className="lg:col-span-3 space-y-5">
            <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-sm text-purple-600 dark:text-purple-400">
                    Question {currentQuestionIndex + 1}
                  </span>
                  <span className="text-xs text-slate-400">of {selectedTest.questions.length}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    +{activeQuestion.marks} Marks
                  </span>
                  <button
                    type="button"
                    onClick={handleToggleFlag}
                    className={`p-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1 transition ${
                      flaggedQuestions[currentQuestionIndex]
                        ? 'bg-amber-500 text-white border-amber-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-amber-500'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{flaggedQuestions[currentQuestionIndex] ? 'Flagged' : 'Flag'}</span>
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  {activeQuestion.conceptTag}
                </span>
                <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                  {activeQuestion.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {activeQuestion.options.map((opt, idx) => {
                  const isSelected = answers[currentQuestionIndex] === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-150 flex items-center space-x-3 text-xs sm:text-sm ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50/80 dark:bg-purple-950/40 text-purple-950 dark:text-purple-100 font-bold shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-purple-400/60 bg-white/60 dark:bg-slate-900/60'
                      } cursor-pointer`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-300 shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Footer */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-200/80 dark:border-slate-800">
                <button
                  type="button"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {currentQuestionIndex < selectedTest.questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center space-x-1 shadow-md"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitTest}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md transition"
                  >
                    Submit Examination
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Question Palette (1 col) */}
          <div className="space-y-4">
            <div className="p-5 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-4">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                Question Palette
              </h4>

              <div className="grid grid-cols-5 gap-2">
                {selectedTest.questions.map((_, idx) => {
                  const isAnswered = answers[idx] !== undefined;
                  const isFlagged = flaggedQuestions[idx];
                  const isCurrent = currentQuestionIndex === idx;

                  let btnBg = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
                  if (isAnswered) btnBg = 'bg-purple-600 text-white font-bold';
                  if (isFlagged) btnBg = 'bg-amber-500 text-white font-bold';

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-9 rounded-xl text-xs transition flex items-center justify-center relative ${btnBg} ${
                        isCurrent ? 'ring-2 ring-purple-400 ring-offset-2 dark:ring-offset-slate-900' : ''
                      }`}
                    >
                      <span>{idx + 1}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-sm bg-purple-600" />
                  <span>Answered ({Object.keys(answers).length})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-sm bg-amber-500" />
                  <span>Flagged ({Object.values(flaggedQuestions).filter(Boolean).length})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-sm bg-slate-200 dark:bg-slate-700" />
                  <span>Unanswered ({selectedTest.questions.length - Object.keys(answers).length})</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmitTest}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md transition"
              >
                Submit &amp; Finish
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Instant Test Results & Weekly Progression Screen */
        testResult && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Score Banner */}
            <div className="p-6 sm:p-8 rounded-3xl glass-card border border-purple-500/30 text-center relative overflow-hidden">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 text-xs font-bold text-purple-700 dark:text-purple-300 mb-4">
                <Award className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Mock Examination Evaluated</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 my-2">
                <div className="text-center">
                  <div className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
                    Test Score
                  </div>
                  <div className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 bg-clip-text text-transparent">
                    {testResult.score}/{testResult.maxScore}
                  </div>
                  <div className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-1">
                    {testResult.percentage}% Overall
                  </div>
                </div>

                <div className="h-16 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

                <div className="text-center">
                  <div className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
                    Accuracy Rate
                  </div>
                  <div className="text-5xl sm:text-6xl font-extrabold text-slate-900 dark:text-white">
                    {testResult.accuracy}%
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    Time Spent: {testResult.timeSpentMinutes} mins
                  </div>
                </div>
              </div>

              {/* AI Feedback Summary */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto mt-4 leading-relaxed">
                {testResult.aiFeedback.summary}
              </p>
            </div>

            {/* Weekly Progression Line Graph (Recharts) */}
            <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 font-bold text-sm text-slate-900 dark:text-white">
                  <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Weekly Performance Progression &amp; Cohort Comparison</span>
                </div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  +12% vs Cohort Average
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={testResult.weeklyTrend}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} />
                    <YAxis domain={[40, 100]} stroke="#94a3b8" fontSize={11} />
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
                    <Line
                      type="monotone"
                      dataKey="score"
                      name="Your Score (%)"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="cohortAvg"
                      name="Cohort Average (%)"
                      stroke="#94a3b8"
                      strokeDasharray="4 4"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Question Breakdown with Solutions */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Detailed Question-by-Question Diagnostic Review
              </h4>

              <div className="space-y-3">
                {selectedTest.questions.map((q, idx) => {
                  const res = testResult.questionResults[idx];
                  const isCorrect = res?.isCorrect;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 sm:p-5 rounded-2xl glass-card border space-y-2.5 ${
                        isCorrect
                          ? 'border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10'
                          : 'border-rose-500/30 bg-rose-50/20 dark:bg-rose-950/10'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 dark:text-white">
                          Question {idx + 1}: {q.conceptTag}
                        </span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                            isCorrect
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}
                        >
                          {isCorrect ? 'Correct (+10)' : 'Incorrect (-2.5)'}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                        {q.question}
                      </p>

                      <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 text-xs space-y-1">
                        <div className="text-slate-500 dark:text-slate-400">
                          <strong>Your Answer:</strong>{' '}
                          {res?.selectedOption !== -1
                            ? `${String.fromCharCode(65 + res.selectedOption)}. ${q.options[res.selectedOption]}`
                            : 'Unanswered'}
                        </div>
                        <div className="text-emerald-700 dark:text-emerald-300">
                          <strong>Correct Answer:</strong>{' '}
                          {String.fromCharCode(65 + q.correctAnswerIndex)}. {q.options[q.correctAnswerIndex]}
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-200 dark:border-slate-800">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleStartTest}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Mock Test</span>
              </button>

              {onNavigateToSimulator && (
                <button
                  type="button"
                  onClick={() => onNavigateToSimulator('topic-calculus-chain')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>Launch Recovery Simulator Drill</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}
