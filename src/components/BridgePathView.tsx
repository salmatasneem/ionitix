import React, { useState } from 'react';
import { BridgePath, PracticeQuestion } from '../types';
import { LiveConceptVisualizer } from './LiveConceptVisualizer';
import { BookOpen, Check, X, HelpCircle, ChevronRight, ArrowRight, Lightbulb, Sparkles, CheckCircle2 } from 'lucide-react';

interface BridgePathViewProps {
  bridge: BridgePath;
  topicId: string;
  onProceedToPostBridge: () => void;
}

export const BridgePathView: React.FC<BridgePathViewProps> = ({
  bridge,
  topicId,
  onProceedToPostBridge,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});

  const handleSelectPracticeOption = (qId: string, opt: string) => {
    if (submittedQuestions[qId]) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: opt }));
  };

  const handleCheckAnswer = (qId: string) => {
    setSubmittedQuestions((prev) => ({ ...prev, [qId]: true }));
  };

  const toggleHint = (qId: string) => {
    setShowHints((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const allPractice = [...bridge.practiceQuestions, bridge.challengeQuestion];
  const totalCompleted = Object.keys(submittedQuestions).length;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Steps 8 &amp; 9 of 12 &bull; Bridge Path &amp; Recovery Activity
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              Bridge Target: {bridge.rootGapConcept}
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
            Personalized Learning Bridge &amp; Concept Recovery
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Review the simplified intuition, interact with the real-time Live AI Visualization simulation, study the step-by-step worked example, and test your understanding with practice drills.
          </p>
        </div>

        <button
          onClick={onProceedToPostBridge}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-200 transition shrink-0"
        >
          <span>Take Post-Bridge Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 1. Simple Explanation & Mental Model Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              1. Simplified Intuition &amp; Mental Model
            </h3>
            <p className="text-xs text-slate-500">Connecting prerequisite foundation to target application</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm leading-relaxed space-y-2">
          <p>{bridge.simpleExplanation}</p>
          <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-900 text-xs font-semibold">
            ✨ <span className="font-bold">Core Takeaway:</span> {bridge.coreIntuition}
          </div>
        </div>
      </div>

      {/* 2. THE HIGHLIGHT FEATURE: Live AI Concept Visualization */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
              2
            </span>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Live AI Concept Visualization (Interactive)
            </h3>
          </div>
          <span className="text-xs text-indigo-600 font-semibold flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive HTML5 Simulation Engine</span>
          </span>
        </div>

        {/* Live Visualizer Component */}
        <LiveConceptVisualizer config={bridge.visualization} topicId={topicId} />
      </div>

      {/* 3. Step-by-Step Worked Example */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              3. Step-by-Step Worked Example
            </h3>
            <p className="text-xs text-slate-500">Clear methodical breakdown without skipped algebraic steps</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs">
          <span className="text-emerald-400 font-bold block mb-1">Problem:</span>
          {bridge.workedExample.problemStatement}
        </div>

        <div className="space-y-3 pt-2">
          {bridge.workedExample.steps.map((st) => (
            <div key={st.step} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                  {st.step}
                </span>
                <h4 className="text-xs font-bold text-slate-900">{st.title}</h4>
              </div>
              <p className="text-xs text-slate-600 pl-7 leading-relaxed">{st.explanation}</p>
              {st.mathSnippet && (
                <div className="ml-7 p-2 rounded-lg bg-white border border-slate-200 font-mono text-xs text-indigo-900 font-semibold">
                  {st.mathSnippet}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-medium">
          <span className="font-bold">Key Principle: </span>
          {bridge.workedExample.keyTakeaway}
        </div>
      </div>

      {/* 4. Practice Questions & Challenge Drill */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                4. Practice Drills &amp; Challenge Problem
              </h3>
              <p className="text-xs text-slate-500">
                Reinforce healed prerequisite concept before taking post-bridge assessment
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {totalCompleted} of {allPractice.length} Answered
          </span>
        </div>

        <div className="space-y-4">
          {allPractice.map((pq, idx) => {
            const picked = selectedAnswers[pq.id];
            const isSubmitted = submittedQuestions[pq.id];
            const isCorrect = isSubmitted && picked === pq.correctAnswer;
            const showingHint = showHints[pq.id];

            return (
              <div
                key={pq.id}
                className={`p-5 rounded-2xl border transition ${
                  pq.isChallenge
                    ? 'bg-gradient-to-r from-purple-50/50 to-indigo-50/50 border-purple-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">
                    {pq.isChallenge ? '🔥 Challenge Problem' : `Practice Question ${idx + 1}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleHint(pq.id)}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center space-x-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{showingHint ? 'Hide Hint' : 'Show Hint'}</span>
                  </button>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug mb-3">
                  {pq.question}
                </h4>

                {showingHint && (
                  <div className="mb-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                    💡 <span className="font-semibold">Hint:</span> {pq.hint}
                  </div>
                )}

                {/* Options */}
                {pq.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {pq.options.map((opt) => {
                      const isOptionPicked = picked === opt;
                      let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';

                      if (isSubmitted) {
                        if (opt === pq.correctAnswer) {
                          btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                        } else if (isOptionPicked && !isCorrect) {
                          btnStyle = 'bg-rose-50 border-rose-500 text-rose-950 font-medium';
                        }
                      } else if (isOptionPicked) {
                        btnStyle = 'bg-indigo-50 border-indigo-600 text-indigo-950 font-semibold';
                      }

                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={isSubmitted}
                          onClick={() => handleSelectPracticeOption(pq.id, opt)}
                          className={`p-2.5 rounded-xl border text-xs text-left transition flex items-center space-x-2 ${btnStyle}`}
                        >
                          <span className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center text-[9px] shrink-0">
                            {isSubmitted && opt === pq.correctAnswer ? '✓' : ''}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Check Answer Button / Feedback */}
                {!isSubmitted ? (
                  <button
                    type="button"
                    disabled={!picked}
                    onClick={() => handleCheckAnswer(pq.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-semibold transition"
                  >
                    Check Answer
                  </button>
                ) : (
                  <div
                    className={`p-3 rounded-xl border text-xs leading-relaxed ${
                      isCorrect
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}
                  >
                    <div className="font-bold mb-0.5">
                      {isCorrect ? '✅ Correct!' : '❌ Solution Walkthrough:'}
                    </div>
                    {pq.solutionExplanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Ready for Post-Bridge Assessment */}
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onProceedToPostBridge}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-200 transition"
          >
            <span>Ready for Step 10: Post-Bridge Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
