import React, { useState } from 'react';
import { TopicDef } from '../data/curriculum';
import { HelpCircle, Sparkles, Send, ArrowRight, UserCheck, AlertCircle, Scan } from 'lucide-react';

interface DiagnosticQuizProps {
  topic: TopicDef;
  onSubmitAnswers: (answers: Record<string, { answer: string; reasoning: string }>) => void;
  isAnalyzing: boolean;
  onOpenAnswerSheetScanner?: () => void;
}

export const DiagnosticQuiz: React.FC<DiagnosticQuizProps> = ({
  topic,
  onSubmitAnswers,
  isAnalyzing,
  onOpenAnswerSheetScanner,
}) => {
  const [answers, setAnswers] = useState<Record<string, { answer: string; reasoning: string }>>({});

  const handleSelectOption = (qId: string, opt: string) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: {
        answer: opt,
        reasoning: prev[qId]?.reasoning || '',
      },
    }));
  };

  const handleReasoningChange = (qId: string, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: {
        answer: prev[qId]?.answer || '',
        reasoning: text,
      },
    }));
  };

  // Quick preset: Loads a student who exhibits the classic prerequisite misconception
  const loadPrerequisiteGapStudentSample = () => {
    if (topic.id === 'math_chain_rule') {
      setAnswers({
        diag_cr_1: {
          answer: 'Inner: u = 4, Outer: f(u) = 3x² - 5',
          reasoning: 'I thought the power 4 was the inside exponent and the polynomial was outside.',
        },
        diag_cr_2: {
          answer: 'The derivative is cos(3x²) because derivative of sin is cos and derivative of x³ is 3x².',
          reasoning: 'I just took the derivative of the sine part and the derivative of the x-cube part directly inside each other.',
        },
        diag_cr_3: {
          answer: 'e^(10x)',
          reasoning: 'I multiplied 2 by 5 to get 10x in the exponent.',
        },
      });
    } else if (topic.id === 'physics_snells_law') {
      setAnswers({
        diag_sn_1: {
          answer: 'Speed v increases, and wavelength λ increases',
          reasoning: 'Glass is denser so the light particles bounce faster forward.',
        },
        diag_sn_2: {
          answer: 'The glass surface pushes against the ray like a wall.',
          reasoning: 'I thought it bent because of collision force against the boundary surface.',
        },
        diag_sn_3: {
          answer: '3/4 (0.75)',
          reasoning: 'I multiplied 1.5 times 0.5.',
        },
      });
    } else {
      setAnswers({
        diag_bst_1: {
          answer: 'Keep calling search(root.left, target)',
          reasoning: 'I thought if it is null we should keep searching until we find something.',
        },
        diag_bst_2: {
          answer: 'Yes, because 8 is smaller than 15, so 8 can be the left child of 15.',
          reasoning: 'I only compared node 8 to its immediate parent 15, ignoring root 10.',
        },
        diag_bst_3: {
          answer: '512 comparisons',
          reasoning: 'Half of 1024 is 512.',
        },
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitAnswers(answers);
  };

  const totalQuestions = topic.diagnosticQuestions.length;
  const answeredCount = Object.values(answers).filter((a) => a.answer.trim().length > 0).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Step 3 of 12 &bull; Diagnostic Assessment
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {topic.title} &mdash; Knowledge &amp; Reasoning Check
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            This diagnostic tests not just your answers, but your reasoning. The AI Answer Analyzer evaluates your conceptual model to discover whether mistakes stem from this topic or an underlying prerequisite gap.
          </p>
        </div>

        {/* Actions for Testing or Scanning */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {onOpenAnswerSheetScanner && (
            <button
              type="button"
              onClick={onOpenAnswerSheetScanner}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition"
              title="Upload photo or scan of your handwritten answer sheet"
            >
              <Scan className="w-3.5 h-3.5 text-indigo-600" />
              <span>Scan Handwritten Sheet (OCR)</span>
            </button>
          )}

          <button
            type="button"
            onClick={loadPrerequisiteGapStudentSample}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Auto-Fill Student Gap Sample</span>
          </button>
        </div>
      </div>

      {/* Question Cards */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {topic.diagnosticQuestions.map((q, idx) => {
          const current = answers[q.id] || { answer: '', reasoning: '' };

          return (
            <div
              key={q.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {q.type === 'mcq' ? 'Multiple Choice Question' : 'Conceptual Reasoning'}
                  </span>
                </div>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  Target: {q.prerequisiteTested}
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                {q.question}
              </h4>

              {/* MCQ Options */}
              {q.type === 'mcq' && q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {q.options.map((opt) => {
                    const isPicked = current.answer === opt;
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => handleSelectOption(q.id, opt)}
                        className={`text-left p-3 rounded-xl border text-xs sm:text-sm transition flex items-start space-x-2.5 ${
                          isPicked
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-950 font-semibold ring-1 ring-indigo-500'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center text-[10px] ${
                            isPicked ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-400 bg-white'
                          }`}
                        >
                          {isPicked && '✓'}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Short Answer Field */}
              {q.type === 'short_answer' && (
                <div className="pt-1">
                  <textarea
                    rows={3}
                    value={current.answer}
                    onChange={(e) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [q.id]: { answer: e.target.value, reasoning: prev[q.id]?.reasoning || '' },
                      }))
                    }
                    placeholder="Type your explanation here..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              )}

              {/* Student Reasoning Input Field */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Your Reasoning (How did you arrive at this?):</span>
                </label>
                <input
                  type="text"
                  value={current.reasoning}
                  onChange={(e) => handleReasoningChange(q.id, e.target.value)}
                  placeholder="e.g., I thought the outer function was... or I recalled that velocity..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          );
        })}

        {/* Submit Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500">
            Progress: <span className="font-bold text-slate-900">{answeredCount}</span> of{' '}
            <span className="font-bold text-slate-900">{totalQuestions}</span> questions addressed
          </div>

          <button
            type="submit"
            disabled={isAnalyzing || answeredCount === 0}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-bold shadow-md shadow-indigo-200 transition"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>AI Module 1: Analyzing Answers &amp; Detecting Root Gap...</span>
              </>
            ) : (
              <>
                <span>Submit &amp; Run AI Gap Detection</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
