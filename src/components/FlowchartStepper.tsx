import React from 'react';
import { Check, Eye, Sparkles, Layers } from 'lucide-react';

interface FlowchartStepperProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  onOpenFlowchartModal: () => void;
}

export const FlowchartStepper: React.FC<FlowchartStepperProps> = ({
  currentStep,
  onStepClick,
  onOpenFlowchartModal,
}) => {
  const steps = [
    { num: 1, label: 'Login' },
    { num: 2, label: 'Subject' },
    { num: 3, label: 'Diagnostic' },
    { num: 4, label: 'AI Analyzer', isAi: true },
    { num: 5, label: 'Concept Map' },
    { num: 6, label: 'Root Gap', isAi: true },
    { num: 7, label: 'Decision' },
    { num: 8, label: 'Bridge' },
    { num: 9, label: 'Live Visual', highlight: true },
    { num: 10, label: 'Post-Bridge' },
    { num: 11, label: 'Performance' },
    { num: 12, label: 'Insights' },
  ];

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm overflow-x-auto">
      <div className="flex items-center justify-between min-w-[760px] space-x-1 sm:space-x-2">
        {steps.map((st) => {
          const isActive = currentStep === st.num;
          const isCompleted = currentStep > st.num;

          return (
            <button
              key={st.num}
              onClick={() => onStepClick(st.num)}
              className={`flex flex-col items-center flex-1 min-w-[56px] py-1 px-1 rounded-xl transition text-center group ${
                isActive
                  ? 'bg-indigo-50/80 ring-1 ring-indigo-500'
                  : 'hover:bg-slate-50 opacity-85 hover:opacity-100'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition mb-1 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-200'
                    : isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {isCompleted ? <Check className="w-3 h-3" /> : st.num}
              </div>

              <span
                className={`text-[10px] font-bold truncate max-w-[64px] block leading-tight ${
                  isActive ? 'text-indigo-900' : 'text-slate-600'
                }`}
              >
                {st.label}
              </span>

              {st.highlight && (
                <span className="mt-0.5 text-[8px] font-extrabold uppercase px-1 rounded bg-blue-100 text-blue-800">
                  Visual
                </span>
              )}
              {st.isAi && !st.highlight && (
                <span className="mt-0.5 text-[8px] font-extrabold uppercase px-1 rounded bg-amber-100 text-amber-800">
                  AI
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
