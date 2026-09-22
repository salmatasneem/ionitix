import React, { useState } from 'react';
import { INITIAL_FACULTY_INSIGHTS } from '../data/curriculum';
import { FacultyTopicInsight } from '../types';
import { Users, AlertOctagon, TrendingUp, Sparkles, BookOpen, Filter, CheckCircle2, ChevronRight } from 'lucide-react';

interface FacultyDashboardProps {
  onBackToStudentMode: () => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ onBackToStudentMode }) => {
  const [insights, setInsights] = useState<FacultyTopicInsight[]>(INITIAL_FACULTY_INSIGHTS);
  const [selectedTopicId, setSelectedTopicId] = useState<string>(insights[0].topicId);

  const activeInsight = insights.find((i) => i.topicId === selectedTopicId) || insights[0];

  const totalAssessed = insights.reduce((acc, curr) => acc + curr.studentsAssessed, 0);
  const averagePreScore = Math.round(
    insights.reduce((acc, curr) => acc + curr.averageDiagnosticScore, 0) / insights.length
  );
  const averagePostScore = Math.round(
    insights.reduce((acc, curr) => acc + curr.averagePostBridgeScore, 0) / insights.length
  );
  const netGain = averagePostScore - averagePreScore;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Faculty &amp; Department Analytics
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              Cohort: Fall 2026 STEM Foundations
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
            Faculty Insight Dashboard &bull; Cohort Bottlenecks
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Real-time telemetry on class-level prerequisite breakdowns, diagnostic failure origins, and actionable lecture intervention recommendations.
          </p>
        </div>

        <button
          onClick={onBackToStudentMode}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition shrink-0"
        >
          <span>Return to Student Workflow</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* High-level Aggregate Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Students Diagnosed</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{totalAssessed}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Across 3 Core STEM Departments</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Initial Diagnostic Avg</span>
            <AlertOctagon className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{averagePreScore}%</div>
          <div className="text-[11px] text-amber-700 font-medium mt-0.5">Prerequisite gaps detected</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Post-Bridge Recovery Avg</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-indigo-600 mt-2">{averagePostScore}%</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">After Live AI Visualization</div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-md">
          <div className="flex items-center justify-between text-indigo-300 text-xs font-semibold">
            <span>Net Recovery Delta</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-2">+{netGain}%</div>
          <div className="text-[11px] text-indigo-200 mt-0.5">Instituion-wide mastery shift</div>
        </div>
      </div>

      {/* Main Topic Breakdown & Actionable Intervention Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Topic Selector List */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Class Curriculum Topics (Select to inspect)
          </h3>

          <div className="space-y-2.5">
            {insights.map((item) => {
              const isSelected = selectedTopicId === item.topicId;

              return (
                <div
                  key={item.topicId}
                  onClick={() => setSelectedTopicId(item.topicId)}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-500 ring-1 ring-indigo-500 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-500">{item.subject}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        item.bottleneckSeverity === 'high'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.bottleneckSeverity} Bottleneck
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {item.topicTitle}
                  </h4>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-600">
                    <span>{item.studentsAssessed} Students</span>
                    <span className="font-semibold text-indigo-600">
                      {item.averageDiagnosticScore}% &rarr; {item.averagePostBridgeScore}% (+
                      {item.averagePostBridgeScore - item.averageDiagnosticScore}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Deep Dive & Actionable Suggestions */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                  Topic Deep Dive
                </span>
                <span className="text-xs text-slate-400">&bull;</span>
                <span className="text-xs text-slate-500">{activeInsight.subject}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{activeInsight.topicTitle}</h3>
            </div>

            {/* Common Root Gaps Bar Distribution */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Detected Prerequisite Gaps (Cohort Distribution)
              </h4>
              <div className="space-y-3">
                {activeInsight.commonRootGaps.map((gap) => (
                  <div key={gap.conceptName} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800">{gap.conceptName}</span>
                      <span className="font-mono font-bold text-rose-600">
                        {gap.count} students ({gap.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-rose-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${gap.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actionable Instructional Recommendation from AI */}
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-2">
              <div className="flex items-center space-x-2 text-indigo-900 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>AI Actionable Instructional Recommendation:</span>
              </div>
              <p className="text-xs text-indigo-950 leading-relaxed">
                {activeInsight.actionableIntervention}
              </p>
            </div>

            {/* Domain statement card from image */}
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 text-xs">
              <span className="font-bold text-indigo-400 uppercase tracking-wider block">
                Why EduBridge in Education?
              </span>
              <p className="text-slate-300 leading-relaxed">
                &ldquo;Because learning isn't just about what students get wrong, it's about why they get it wrong. EduBridge AI finds the real cause, builds the bridge, and helps students move forward.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
