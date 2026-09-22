import React from 'react';
import { X, CheckCircle2, ArrowRight, Sparkles, Brain, Cpu, BarChart3, HelpCircle, Eye } from 'lucide-react';

interface FlowchartModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeStep: number;
  onJumpToStep?: (step: number) => void;
}

export const FlowchartModal: React.FC<FlowchartModalProps> = ({
  isOpen,
  onClose,
  activeStep,
  onJumpToStep,
}) => {
  if (!isOpen) return null;

  const steps = [
    { num: 1, title: 'Student Login', desc: 'Create / Login account, Role: Student / Faculty', color: 'border-blue-300 bg-blue-50/50' },
    { num: 2, title: 'Select Subject & Topic', desc: 'Choose subject & choose topic', color: 'border-emerald-300 bg-emerald-50/50' },
    { num: 3, title: 'Diagnostic Assessment', desc: 'MCQs + Short answers, Topic-wise quiz with reasoning', color: 'border-indigo-300 bg-indigo-50/50' },
    { num: 4, title: 'AI Answer Analyzer', desc: 'Checks correctness, analyses reasoning, detects misconceptions', isAi: true, color: 'border-amber-300 bg-amber-50/50' },
    { num: 5, title: 'Construct Concept Map', desc: 'Current topic, required concepts, prerequisite graph', color: 'border-rose-300 bg-rose-50/50' },
    { num: 6, title: 'AI Root Gap Detector', desc: 'Traces learning dependency, identifies underlying prerequisite weakness', isAi: true, color: 'border-cyan-300 bg-cyan-50/50' },
    { num: 7, title: 'Gap Found? (Decision)', desc: 'Yes → Generate Bridge Path / No → Provide Reinforcement', color: 'border-purple-300 bg-purple-50/50' },
    { num: 8, title: 'Generate Bridge Path', desc: 'Simple explanation, worked example, 3 practice + challenge question', color: 'border-red-300 bg-red-50/50' },
    {
      num: 9,
      title: 'Student Completes Recovery Activity',
      desc: 'Learns from bridge path + Live AI Concept Visualization (real-time animated simulations)',
      highlight: true,
      color: 'border-blue-400 bg-blue-50',
    },
    { num: 10, title: 'Post-Bridge Assessment', desc: 'Re-attempts questions, calculates new score', color: 'border-purple-300 bg-purple-50/50' },
    { num: 11, title: 'Compare Performance', desc: 'Before vs After, improvement score delta', color: 'border-teal-300 bg-teal-50/50' },
    { num: 12, title: 'Gap Resolved? & Faculty Insights', desc: 'If Yes → Update Learning Map & Faculty Insights. If No → Next targeted bridge', color: 'border-emerald-400 bg-emerald-50' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              AI
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">EduBridge AI Architecture Flowchart</h2>
              <p className="text-xs text-slate-500">
                12-Step Academic Gap Detection &amp; Recovery Loop &bull; Current active step: <span className="font-semibold text-indigo-600">Step {activeStep}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top banner highlighting Live AI Visualization */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-indigo-100 flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-indigo-600 text-white shrink-0 mt-0.5">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-indigo-950 flex items-center space-x-1.5">
                <span>Featured Component: Live AI Concept Visualization (Step 9)</span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-indigo-100 text-indigo-800">
                  Interactive
                </span>
              </h4>
              <p className="text-xs text-indigo-900/80 mt-1 leading-relaxed">
                The AI generates real-time animated concept explanations, helping students understand difficult topics through interactive visual learning instead of only reading text. Dynamic visual feedback ensures students remain fully engaged with complex, abstract subjects.
              </p>
            </div>
          </div>

          {/* Grid of 12 steps matching the flowchart */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {steps.map((step) => {
              const isActive = activeStep === step.num;
              const isPassed = activeStep > step.num;

              return (
                <div
                  key={step.num}
                  onClick={() => onJumpToStep && onJumpToStep(step.num)}
                  className={`relative p-3.5 rounded-xl border transition cursor-pointer ${step.color} ${
                    isActive
                      ? 'ring-2 ring-indigo-500 shadow-md scale-[1.01]'
                      : 'hover:border-slate-400 opacity-90 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isActive
                            ? 'bg-indigo-600 text-white'
                            : isPassed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.num}
                      </span>
                      <span className="text-xs font-bold text-slate-900 line-clamp-1">{step.title}</span>
                    </div>
                    {step.isAi && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center space-x-0.5">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>AI</span>
                      </span>
                    )}
                    {step.highlight && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-200 text-blue-900 flex items-center space-x-0.5">
                        <Eye className="w-2.5 h-2.5" />
                        <span>Visual</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">{step.desc}</p>
                </div>
              );
            })}
          </div>

          {/* AI Modules Overview Bar from the image */}
          <div className="p-4 rounded-xl bg-slate-900 text-white">
            <h4 className="text-xs font-bold tracking-wider uppercase text-indigo-400 mb-3 flex items-center space-x-1.5">
              <Cpu className="w-4 h-4" />
              <span>4 Core AI Modules in EduBridge</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="text-amber-400 font-bold block mb-1">1. Answer Analyzer</span>
                <p className="text-slate-300 text-[11px]">Understands errors, reasoning and misconceptions.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="text-cyan-400 font-bold block mb-1">2. Root Gap Detector</span>
                <p className="text-slate-300 text-[11px]">Maps topic &rarr; prerequisites &rarr; pinpoints actual gap.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="text-blue-400 font-bold block mb-1">3. Bridge Path Generator</span>
                <p className="text-slate-300 text-[11px]">Creates focused learning path with live visualization.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="text-emerald-400 font-bold block mb-1">4. Progress Analyzer</span>
                <p className="text-slate-300 text-[11px]">Compares before &amp; after scores and updates learning map.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
          >
            Continue Workflow
          </button>
        </div>
      </div>
    </div>
  );
};
