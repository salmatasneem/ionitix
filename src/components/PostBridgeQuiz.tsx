import React, { useState } from 'react';
import { TopicDef } from '../data/curriculum';
import { CheckCircle2, ArrowRight, Sparkles, RefreshCcw } from 'lucide-react';

interface PostBridgeQuizProps {
  topic: TopicDef;
  onSubmitPostBridge: (score: number, answers: Record<string, string>) => void;
}

export const PostBridgeQuiz: React.FC<PostBridgeQuizProps> = ({ topic, onSubmitPostBridge }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  // Questions specifically testing the healed bridge and target topic
  const postQuestions = [
    {
      id: 'post_q1',
      question:
        topic.id === 'math_chain_rule'
          ? 'Decompose y = (7x³ - 2)⁶. What is the inner function u and outer derivative dy/du?'
          : topic.id === 'physics_snells_law'
          ? 'Light moves from water (n = 1.33) into dense flint glass (n = 1.66). Does its phase velocity increase or decrease, and does the ray bend toward or away from the normal?'
          : 'In a BST search for key 42, you are currently at node 30. Which recursive branch must you take?',
      options:
        topic.id === 'math_chain_rule'
          ? [
              'Inner: u = 7x³ - 2, dy/du = 6u⁵',
              'Inner: u = 6, dy/du = 7x³ - 2',
              'Inner: u = 7x³, dy/du = (u - 2)⁶',
              'Inner: u = x⁶, dy/du = 21x²',
            ]
          : topic.id === 'physics_snells_law'
          ? [
              'Speed decreases, ray bends TOWARDS normal',
              'Speed increases, ray bends TOWARDS normal',
              'Speed decreases, ray bends AWAY from normal',
              'Speed stays constant, ray bends AWAY from normal',
            ]
          : [
              'Branch RIGHT (search(node.right, 42)) because 42 > 30',
              'Branch LEFT (search(node.left, 42)) because 42 > 30',
              'Stay at node 30 and return false',
              'Reset search to root',
            ],
      correctAnswer:
        topic.id === 'math_chain_rule'
          ? 'Inner: u = 7x³ - 2, dy/du = 6u⁵'
          : topic.id === 'physics_snells_law'
          ? 'Speed decreases, ray bends TOWARDS normal'
          : 'Branch RIGHT (search(node.right, 42)) because 42 > 30',
    },
    {
      id: 'post_q2',
      question:
        topic.id === 'math_chain_rule'
          ? 'Compute dy/dx for y = sin(4x²).'
          : topic.id === 'physics_snells_law'
          ? 'A light wave in medium A has speed 2.0 × 10⁸ m/s. In medium B it has speed 1.5 × 10⁸ m/s. What is the ratio of refractive indices n_B / n_A?'
          : 'Which property guarantees that an inorder traversal of a BST visits keys in strictly ascending order?',
      options:
        topic.id === 'math_chain_rule'
          ? [
              '8x · cos(4x²)',
              'cos(8x)',
              '-8x · sin(4x²)',
              '4x² · cos(4x²)',
            ]
          : topic.id === 'physics_snells_law'
          ? ['4/3 (1.33)', '3/4 (0.75)', '2.0', '1.0']
          : [
              'Left Subtree Keys < Node Key < Right Subtree Keys',
              'Parent Key < Left Child Key',
              'All leaf nodes are at identical depth',
              'Nodes are sorted chronologically by insertion time',
            ],
      correctAnswer:
        topic.id === 'math_chain_rule'
          ? '8x · cos(4x²)'
          : topic.id === 'physics_snells_law'
          ? '4/3 (1.33)'
          : 'Left Subtree Keys < Node Key < Right Subtree Keys',
    },
    {
      id: 'post_q3',
      question:
        topic.id === 'math_chain_rule'
          ? 'If f(u) = u³ and u = g(x) = 2x + 5, what is dy/dx evaluated at x = 0?'
          : topic.id === 'physics_snells_law'
          ? "If the incident angle θ₁ is 0° (normal incidence straight onto the glass), what is the angle of refraction θ₂?"
          : 'If a recursive search reaches null, what should the base case return?',
      options:
        topic.id === 'math_chain_rule'
          ? ['150', '75', '25', '6']
          : topic.id === 'physics_snells_law'
          ? ['0° (continues straight without angular deviation)', '90°', '45°', '180°']
          : [
              'false (target element is not present in this subtree)',
              'true',
              'throw null error',
              '0',
            ],
      correctAnswer:
        topic.id === 'math_chain_rule'
          ? '150'
          : topic.id === 'physics_snells_law'
          ? '0° (continues straight without angular deviation)'
          : 'false (target element is not present in this subtree)',
    },
  ];

  const handleSelect = (qId: string, opt: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: opt }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let correctCount = 0;
    postQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / postQuestions.length) * 100);
    onSubmitPostBridge(score, selectedAnswers);
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
            Step 10 of 12 &bull; Post-Bridge Assessment
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Evaluate Concept Recovery &amp; Target Mastery
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Re-test your understanding after completing the interactive recovery activity. The system will compare your score against your initial diagnostic to measure prerequisite gap resolution.
          </p>
        </div>

        {/* Quick Fill 100% for testing button */}
        <button
          type="button"
          onClick={() => {
            const perfect: Record<string, string> = {};
            postQuestions.forEach((q) => {
              perfect[q.id] = q.correctAnswer;
            });
            setSelectedAnswers(perfect);
          }}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 transition shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Auto-Fill Mastery Answers</span>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {postQuestions.map((q, idx) => {
          const picked = selectedAnswers[q.id];

          return (
            <div
              key={q.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition"
            >
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Post-Bridge Check {idx + 1}
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                {q.question}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {q.options.map((opt) => {
                  const isPicked = picked === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelect(q.id, opt)}
                      className={`text-left p-3 rounded-xl border text-xs sm:text-sm transition flex items-start space-x-2.5 ${
                        isPicked
                          ? 'bg-purple-50 border-purple-600 text-purple-950 font-semibold ring-1 ring-purple-500'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center text-[10px] ${
                          isPicked
                            ? 'border-purple-600 bg-purple-600 text-white'
                            : 'border-slate-400 bg-white'
                        }`}
                      >
                        {isPicked && '✓'}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Submit */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500">
            Completed: <span className="font-bold text-slate-900">{answeredCount}</span> of{' '}
            <span className="font-bold text-slate-900">{postQuestions.length}</span>
          </div>

          <button
            type="submit"
            disabled={answeredCount < postQuestions.length}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-bold shadow-md shadow-purple-200 transition"
          >
            <span>Submit &amp; Compare Performance</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
