import React, { useState } from 'react';
import { ConceptNode, ConceptDependency } from '../types';
import { GitCommit, AlertTriangle, CheckCircle2, Target, ArrowRight, Sparkles, Layers, Info } from 'lucide-react';

interface ConceptMapVisualizerProps {
  nodes: ConceptNode[];
  dependencies: ConceptDependency[];
  rootConceptId?: string;
  onProceedToBridge: () => void;
  gapExplanation?: string;
  misconceptions?: string[];
  dependencyPath?: string[];
}

export const ConceptMapVisualizer: React.FC<ConceptMapVisualizerProps> = ({
  nodes,
  dependencies,
  rootConceptId,
  onProceedToBridge,
  gapExplanation,
  misconceptions = [],
  dependencyPath = [],
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(
    rootConceptId || nodes.find((n) => n.status === 'root_gap')?.id || nodes[0]?.id || ''
  );

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const getStatusColor = (status: ConceptNode['status']) => {
    switch (status) {
      case 'root_gap':
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-500',
          badge: 'bg-rose-100 text-rose-800 border-rose-300',
          dot: 'bg-rose-500',
          icon: <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />,
          label: 'Root Gap Detected',
        };
      case 'at_risk':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-400',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          dot: 'bg-amber-500',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
          label: 'At Risk',
        };
      case 'target':
        return {
          bg: 'bg-indigo-50',
          border: 'border-indigo-400',
          badge: 'bg-indigo-100 text-indigo-800 border-indigo-300',
          dot: 'bg-indigo-600',
          icon: <Target className="w-4 h-4 text-indigo-600" />,
          label: 'Target Topic',
        };
      case 'resolved':
      case 'mastered':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-400',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
          label: status === 'resolved' ? 'Gap Healed & Resolved' : 'Mastered Prerequisite',
        };
      default:
        return {
          bg: 'bg-slate-50',
          border: 'border-slate-300',
          badge: 'bg-slate-100 text-slate-700',
          dot: 'bg-slate-400',
          icon: <GitCommit className="w-4 h-4 text-slate-500" />,
          label: 'Concept',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Steps 5 &amp; 6 of 12 &bull; Concept Map &amp; Root Gap
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
              Prerequisite Gap Identified
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
            Learning Dependency Graph &amp; Root Cause
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            The AI Root Gap Detector traces backward through prerequisite dependencies. Your answers reveal that the difficulty is not in the target formula, but an unresolved prerequisite concept.
          </p>
        </div>

        <button
          onClick={onProceedToBridge}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-200 transition shrink-0"
        >
          <span>Generate Bridge Path &amp; Live Visualizer</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Dependency Path Horizontal Ribbon */}
      {dependencyPath.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="uppercase tracking-wider text-indigo-400">Traced Dependency Path:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
            {dependencyPath.map((item, idx) => {
              const isRoot = idx === 1; // Prerequisite bottleneck
              return (
                <React.Fragment key={idx}>
                  <span
                    className={`px-2.5 py-1 rounded-lg border ${
                      isRoot
                        ? 'bg-rose-500/20 border-rose-500 text-rose-200 font-bold'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    {isRoot && '🚨 '}
                    {item}
                  </span>
                  {idx < dependencyPath.length - 1 && (
                    <span className="text-slate-600 font-bold">&rarr;</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Concept Graph View + Node Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Graph Canvas Visualizer */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Interactive Concept Map (Click node to inspect)
            </h3>
            <div className="flex items-center space-x-2 text-[11px]">
              <span className="flex items-center space-x-1 text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Mastered</span>
              </span>
              <span className="flex items-center space-x-1 text-rose-700">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Root Gap</span>
              </span>
              <span className="flex items-center space-x-1 text-indigo-700">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                <span>Target Topic</span>
              </span>
            </div>
          </div>

          {/* Render Nodes in Hierarchy */}
          <div className="py-6 space-y-8">
            {/* Level 0: Foundation / Prerequisite Tier */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Level 0 &bull; Foundational Prerequisites
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {nodes
                  .filter((n) => n.level === 0)
                  .map((node) => {
                    const st = getStatusColor(node.status);
                    const isSelected = selectedNodeId === node.id;

                    return (
                      <div
                        key={node.id}
                        onClick={() => setSelectedNodeId(node.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${st.bg} ${st.border} ${
                          isSelected ? 'ring-2 ring-indigo-500 shadow-md scale-[1.02]' : 'hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.badge}`}>
                            {st.label}
                          </span>
                          {st.icon}
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {node.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                          {node.description}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Connecting Dependency Arrows */}
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-[11px] font-semibold">
                <span>Learning Flow Dependency (feeds forward)</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
              </div>
            </div>

            {/* Level 1 & 2: Intermediate and Target Topic Tier */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Level 1 &amp; 2 &bull; Intermediate &amp; Target Topic
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {nodes
                  .filter((n) => n.level > 0)
                  .map((node) => {
                    const st = getStatusColor(node.status);
                    const isSelected = selectedNodeId === node.id;

                    return (
                      <div
                        key={node.id}
                        onClick={() => setSelectedNodeId(node.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${st.bg} ${st.border} ${
                          isSelected ? 'ring-2 ring-indigo-500 shadow-md scale-[1.02]' : 'hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.badge}`}>
                            {st.label}
                          </span>
                          {st.icon}
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {node.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                          {node.description}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Node Details & Root Cause Explanation Panel */}
        <div className="lg:col-span-4 space-y-4">
          {/* Node detail inspector */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Selected Concept Details
              </span>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">{selectedNode.title}</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{selectedNode.description}</p>
            </div>

            {/* Status pill */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">Status:</span>
              <span
                className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${
                  getStatusColor(selectedNode.status).badge
                }`}
              >
                <span>{getStatusColor(selectedNode.status).label}</span>
              </span>
            </div>

            {/* Common Misconceptions detected if root gap */}
            {selectedNode.status === 'root_gap' && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-2">
                <span className="font-bold text-rose-900 flex items-center space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Detected Student Misconceptions:</span>
                </span>
                <ul className="space-y-1.5 text-rose-950/90 pl-3 list-disc">
                  {(misconceptions.length > 0 ? misconceptions : selectedNode.misconceptions || []).map(
                    (m, i) => (
                      <li key={i} className="leading-snug">
                        {m}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {gapExplanation && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900 block mb-1">AI Root Gap Explanation:</span>
                {gapExplanation}
              </div>
            )}
          </div>

          {/* Action Card */}
          <div className="p-5 rounded-2xl bg-indigo-600 text-white shadow-md space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-200">
              Next Step in Flowchart
            </span>
            <h4 className="text-sm font-bold leading-snug">
              Build the Bridge: Personalized Explanation &amp; Live AI Visualizer
            </h4>
            <p className="text-xs text-indigo-100 leading-relaxed">
              EduBridge AI will now generate a simplified mental model, worked example, practice drills, and an interactive real-time animated simulation to heal this prerequisite gap.
            </p>
            <button
              onClick={onProceedToBridge}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-indigo-950 font-bold text-xs shadow transition flex items-center justify-center space-x-1.5"
            >
              <span>Launch Step 8 &amp; 9: Bridge Path</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
