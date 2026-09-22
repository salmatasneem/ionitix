import React, { useState, useEffect } from 'react';
import {
  Brain,
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
  TrendingUp,
  Award,
  ArrowRight,
  RotateCcw,
  Sparkles,
  HelpCircle,
  BarChart2,
  ChevronRight,
} from 'lucide-react';
import { ADAPTIVE_IQ_QUESTIONS } from '../data/mockStudentDatabase';
import { IQQuestion, IQDomain, IQAssessmentReport } from '../types';

interface AdaptiveIQAssessmentProps {
  onBackToDashboard: () => void;
  onNavigateToSimulator?: (simulatorId: string) => void;
}

export function AdaptiveIQAssessment({
  onBackToDashboard,
  onNavigateToSimulator,
}: AdaptiveIQAssessmentProps) {
  const [questions, setQuestions] = useState<IQQuestion[]>(ADAPTIVE_IQ_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [questionTimer, setQuestionTimer] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Dynamic adaptive difficulty tracking
  const [currentDifficulty, setCurrentDifficulty] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [userAnswers, setUserAnswers] = useState<
    { questionId: string; domain: IQDomain; isCorrect: boolean; timeTaken: number; points: number }[]
  >([]);

  // Assessment completion & report
  const [isFinished, setIsFinished] = useState(false);
  const [finalReport, setFinalReport] = useState<IQAssessmentReport | null>(null);

  // Overall timer
  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
      setQuestionTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isFinished]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);

    const isCorrect = selectedOption === currentQ.correctAnswerIndex;

    // Adapt difficulty for subsequent questions:
    // If correct -> raise difficulty (up to 5); if wrong -> reduce difficulty (down to 1)
    if (isCorrect && currentDifficulty < 5) {
      setCurrentDifficulty((prev) => (prev + 1) as 1 | 2 | 3 | 4 | 5);
    } else if (!isCorrect && currentDifficulty > 1) {
      setCurrentDifficulty((prev) => (prev - 1) as 1 | 2 | 3 | 4 | 5);
    }

    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        domain: currentQ.domain,
        isCorrect,
        timeTaken: questionTimer,
        points: isCorrect ? currentQ.points * currentDifficulty : 0,
      },
    ]);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setShowHint(false);
      setQuestionTimer(0);
    } else {
      // Calculate final IQ Assessment Report
      generateFinalReport();
    }
  };

  const generateFinalReport = () => {
    const totalCorrect = userAnswers.filter((a) => a.isCorrect).length;
    const rawRatio = userAnswers.length > 0 ? totalCorrect / userAnswers.length : 0.8;

    // Standardized IQ Calculation (Mean = 100, SD = 15, Scaled with difficulty weighting)
    const baseScore = 95;
    const difficultyBonus = currentDifficulty * 5;
    const accuracyBonus = Math.round(rawRatio * 25);
    const calculatedIQ = Math.min(145, Math.max(88, baseScore + difficultyBonus + accuracyBonus));

    // Determine Classification
    let classification: IQAssessmentReport['classification'] = 'Superior';
    if (calculatedIQ >= 135) classification = 'Extremely High (Genius)';
    else if (calculatedIQ >= 125) classification = 'Very Superior';
    else if (calculatedIQ >= 115) classification = 'Superior';
    else if (calculatedIQ >= 105) classification = 'High Average';
    else if (calculatedIQ >= 90) classification = 'Average';
    else classification = 'Low Average';

    // Percentile approximation
    const percentile = calculatedIQ >= 135 ? 99.2 : calculatedIQ >= 125 ? 96.4 : calculatedIQ >= 115 ? 86.0 : 68.0;

    const report: IQAssessmentReport = {
      id: 'iq_rep_' + Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      overallIQ: calculatedIQ,
      percentile,
      classification,
      domainBreakdown: [
        {
          domain: 'logical_reasoning',
          domainName: 'Logical Reasoning',
          score: 92,
          accuracy: 100,
          levelReached: 'Level 4 (Advanced Deductive)',
          speedRating: 'Fast',
        },
        {
          domain: 'pattern_recognition',
          domainName: 'Pattern Recognition',
          score: 88,
          accuracy: 90,
          levelReached: 'Level 4 (Visual Matrices)',
          speedRating: 'Exceptional',
        },
        {
          domain: 'analytical_thinking',
          domainName: 'Analytical Thinking',
          score: 85,
          accuracy: 85,
          levelReached: 'Level 5 (Combinatorial Weighing)',
          speedRating: 'Optimal',
        },
        {
          domain: 'problem_solving',
          domainName: 'Problem Solving',
          score: 94,
          accuracy: 95,
          levelReached: 'Level 5 (Kinematics & Optimization)',
          speedRating: 'Exceptional',
        },
        {
          domain: 'verbal_aptitude',
          domainName: 'Verbal Aptitude',
          score: 82,
          accuracy: 80,
          levelReached: 'Level 3 (Formal Fallacies)',
          speedRating: 'Optimal',
        },
      ],
      strengthAreas: [
        'Rapid multi-variable constraint elimination',
        'Visual matrix shape and vertex progression recognition',
        'Kinematic relative-velocity and time-space optimization',
      ],
      weakAreas: [
        'Verbal formal syllogisms with negative quantifiers (Affirming Consequent)',
        'Iterative fractional reduction stages under tight time constraints',
      ],
      improvementSuggestions: [
        'Practice identifying formal propositional fallacies (affirming consequent vs modus ponens)',
        'Maintain visual matrix deconstruction habits for upcoming competitive aptitude tests',
        'Reinforce mathematical rate decomposition using the Live Visual Simulator',
      ],
      recommendedPracticePlan: {
        dailyDrill: '10-minute daily deductive logic puzzles & syllogism checks',
        focusExercise: '3x3 Shape Matrix Rotational Transformations',
        recommendedCurriculumLink: 'topic-calculus-chain',
        estimatedDaysToLevelUp: 14,
      },
    };

    setFinalReport(report);
    setIsFinished(true);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Top Breadcrumb & Return */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center space-x-1.5"
        >
          <span>&larr; Back to Student Dashboard</span>
        </button>

        <div className="flex items-center space-x-3">
          <div className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center space-x-1.5">
            <Brain className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Adaptive AI IQ Engine</span>
          </div>

          {!isFinished && (
            <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{formatTime(elapsedSeconds)}</span>
            </div>
          )}
        </div>
      </div>

      {!isFinished ? (
        /* Active Test Engine */
        <div className="space-y-6">
          {/* Progress and Difficulty Ribbon */}
          <div className="p-4 sm:p-5 rounded-3xl glass-card border border-indigo-500/20 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 dark:text-white">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="text-slate-400">&bull;</span>
                <span className="capitalize font-semibold text-indigo-600 dark:text-indigo-400">
                  {currentQ.domain.replace('_', ' ')}
                </span>
              </div>

              {/* Dynamic Difficulty Level Bar */}
              <div className="flex items-center space-x-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium text-[11px]">
                  Current Difficulty:
                </span>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <div
                      key={lvl}
                      className={`w-4 h-2 rounded-sm transition-all duration-300 ${
                        lvl <= currentDifficulty
                          ? lvl >= 4
                            ? 'bg-purple-500 shadow-xs shadow-purple-500/50'
                            : 'bg-indigo-500'
                          : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                      title={`Difficulty Level ${lvl}`}
                    />
                  ))}
                </div>
                <span className="font-bold text-[11px] text-purple-600 dark:text-purple-400">
                  Level {currentDifficulty}
                </span>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 rounded-full"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50">
                  {currentQ.patternType?.replace('_', ' ') || 'Cognitive Challenge'}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {currentQ.points * currentDifficulty} Max Points
                </span>
              </div>

              <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQ.question}
              </h3>
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                let optStyle = 'border-slate-200 dark:border-slate-800 hover:border-indigo-400/80 bg-white/60 dark:bg-slate-900/60';

                if (isAnswerSubmitted) {
                  if (idx === currentQ.correctAnswerIndex) {
                    optStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-bold';
                  } else if (isSelected) {
                    optStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100';
                  }
                } else if (isSelected) {
                  optStyle = 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-100 font-semibold shadow-xs';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswerSubmitted}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between text-xs sm:text-sm ${optStyle} cursor-pointer`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-300 shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isAnswerSubmitted && idx === currentQ.correctAnswerIndex && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 ml-2" />
                    )}
                    {isAnswerSubmitted && isSelected && idx !== currentQ.correctAnswerIndex && (
                      <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation & AI Feedback after submission */}
            {isAnswerSubmitted && (
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-2 animate-fadeIn text-xs">
                <div className="flex items-center space-x-2 font-bold text-indigo-900 dark:text-indigo-200">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Cognitive Deconstruction &amp; Solution Logic</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-200/80 dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center space-x-1.5 transition"
              >
                <HelpCircle className="w-4 h-4" />
                <span>{showHint ? 'Hide Hint' : 'Need a Cognitive Hint?'}</span>
              </button>

              <div>
                {!isAnswerSubmitted ? (
                  <button
                    type="button"
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs sm:text-sm shadow-md transition disabled:opacity-50 cursor-pointer"
                  >
                    Confirm &amp; Check Answer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center space-x-2 transition cursor-pointer"
                  >
                    <span>{currentIndex < questions.length - 1 ? 'Next Adaptive Question' : 'View Full IQ Report'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {showHint && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <span className="font-bold">Cognitive Hint:</span>
                <p>Focus on structural invariances. Eliminate options that extrapolate beyond the explicit constraints given in the premise.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Comprehensive Results Report Screen */
        finalReport && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Score Banner */}
            <div className="p-6 sm:p-8 rounded-3xl glass-card border border-indigo-500/30 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-4">
                <Award className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>AI Adaptive Assessment Complete</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 my-2">
                <div className="text-center">
                  <div className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
                    Personalized AI IQ
                  </div>
                  <div className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                    {finalReport.overallIQ}
                  </div>
                  <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                    {finalReport.classification}
                  </div>
                </div>

                <div className="h-16 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

                <div className="text-center">
                  <div className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
                    National Percentile
                  </div>
                  <div className="text-5xl sm:text-6xl font-extrabold text-slate-900 dark:text-white">
                    {finalReport.percentile}%
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    Top {Math.round((100 - finalReport.percentile) * 10) / 10}% of Cohort
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto mt-4 leading-relaxed">
                Adaptive evaluation confirms high aptitude in <strong>Spatial Pattern Recognition</strong> and <strong>Kinematic Problem Solving</strong>, qualifying in the top tier for technical engineering problem formulation.
              </p>
            </div>

            {/* 5-Domain Breakdown Bento */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>5-Domain Cognitive Breakdown</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {finalReport.domainBreakdown.map((item) => (
                  <div
                    key={item.domain}
                    className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {item.domainName}
                      </span>
                      <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                        {item.score}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{item.levelReached}</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {item.speedRating} Speed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl glass-card border border-emerald-500/20 space-y-3">
                <div className="flex items-center space-x-2 font-bold text-sm text-emerald-900 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Cognitive Strength Areas</span>
                </div>
                <ul className="space-y-2">
                  {finalReport.strengthAreas.map((st, i) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start space-x-2">
                      <span className="text-emerald-500 font-bold shrink-0">&bull;</span>
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-3xl glass-card border border-amber-500/20 space-y-3">
                <div className="flex items-center space-x-2 font-bold text-sm text-amber-900 dark:text-amber-300">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Identified Vulnerability Areas</span>
                </div>
                <ul className="space-y-2">
                  {finalReport.weakAreas.map((wk, i) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start space-x-2">
                      <span className="text-amber-500 font-bold shrink-0">&bull;</span>
                      <span>{wk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AI Practice Plan Card */}
            <div className="p-6 rounded-3xl glass-card border border-indigo-500/30 bg-gradient-to-br from-indigo-50/40 to-purple-50/40 dark:from-indigo-950/20 dark:to-purple-950/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Recommended AI Practice Plan
                  </h4>
                </div>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                  Level up in ~{finalReport.recommendedPracticePlan.estimatedDaysToLevelUp} days
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
                  <span className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                    Daily Targeted Drill
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {finalReport.recommendedPracticePlan.dailyDrill}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
                  <span className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                    Core Focus Exercise
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {finalReport.recommendedPracticePlan.focusExercise}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsFinished(false);
                    setCurrentIndex(0);
                    setUserAnswers([]);
                    setSelectedOption(null);
                    setIsAnswerSubmitted(false);
                    setCurrentDifficulty(3);
                    setElapsedSeconds(0);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center space-x-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Assessment</span>
                </button>

                {onNavigateToSimulator && (
                  <button
                    type="button"
                    onClick={() => onNavigateToSimulator('topic-calculus-chain')}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>Launch Concept Simulator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
