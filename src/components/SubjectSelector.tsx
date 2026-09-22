import React from 'react';
import { CURRICULUM_TOPICS, TopicDef } from '../data/curriculum';
import { BookOpen, Sigma, Compass, GitBranch, ArrowRight, Clock, CheckCircle } from 'lucide-react';

interface SubjectSelectorProps {
  selectedTopicId: string;
  onSelectTopic: (topic: TopicDef) => void;
  onStartDiagnostic: () => void;
}

export const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  selectedTopicId,
  onSelectTopic,
  onStartDiagnostic,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sigma':
        return <Sigma className="w-5 h-5 text-indigo-600" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-amber-600" />;
      case 'GitBranch':
        return <GitBranch className="w-5 h-5 text-emerald-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-indigo-600" />;
    }
  };

  const selectedTopic = CURRICULUM_TOPICS.find((t) => t.id === selectedTopicId) || CURRICULUM_TOPICS[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Step 2 of 12 &bull; Curriculum Selection
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Select Subject &amp; Focus Topic
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Choose a STEM discipline to begin the AI-powered diagnostic assessment.
          </p>
        </div>

        <button
          onClick={onStartDiagnostic}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-200 transition"
        >
          <span>Start Diagnostic Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of Subject Topics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CURRICULUM_TOPICS.map((topic) => {
          const isSelected = topic.id === selectedTopicId;

          return (
            <div
              key={topic.id}
              onClick={() => onSelectTopic(topic)}
              className={`relative rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                  : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200">
                    {getIcon(topic.iconName)}
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {topic.subject}
                  </span>
                </div>

                <div className="text-xs font-medium text-slate-500 mb-1">{topic.category}</div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{topic.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{topic.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="text-[11px] text-slate-500 font-medium">
                  <span className="font-semibold text-slate-700">Prerequisite Chain: </span>
                  <span className="line-clamp-1">{topic.prerequisiteSummary}</span>
                </div>

                <div className="flex items-center justify-between mt-3 text-xs">
                  <span className="flex items-center space-x-1 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{topic.estimatedMinutes} mins</span>
                  </span>
                  {isSelected && (
                    <span className="flex items-center space-x-1 text-indigo-600 font-semibold">
                      <CheckCircle className="w-4 h-4" />
                      <span>Selected</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
