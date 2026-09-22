import React, { useState } from 'react';
import { X, Copy, Check, GitBranch, Terminal, FileCode2, ExternalLink } from 'lucide-react';

interface GitHubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubExportModal: React.FC<GitHubExportModalProps> = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const gitCommands = `# 1. Initialize git in your project root
git init

# 2. Add all source files, models, and visualizations
git add .

# 3. Commit the EduBridge AI prototype
git commit -m "feat: complete EduBridge AI gap detection & live visualization prototype"

# 4. Link your GitHub repository (replace with your repo URL)
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/edubridge-ai.git

# 5. Push to GitHub!
git push -u origin main`;

  const readmeSnippet = `# EduBridge AI: AI-Powered Academic Gap Detection & Recovery System

> **"Find the gap • Build the bridge • Grow with confidence"**

EduBridge AI is a full-stack educational AI system that diagnoses learning breakdowns, pinpoints underlying prerequisite weaknesses, builds targeted bridges, and delivers **Live AI Concept Visualizations** with interactive canvas simulations.

## 🚀 Key Features
- **AI Answer Analyzer**: Checks correctness, analyzes student reasoning, and extracts misconceptions.
- **AI Root Gap Detector**: Traces learning dependencies to find the root conceptual failure point.
- **Dynamic Concept Map**: Visualizes prerequisite relationships and real-time mastery states.
- **Live AI Concept Visualization**: Real-time animated canvas simulations (Calculus Rate Machine, Snell's Law Wavefronts, BST Call Stack) with interactive parameters and step scrubbers.
- **Targeted Bridge Paths**: Simple analogies, worked examples, and practice/challenge problems.
- **Performance Comparison**: Pre-diagnostic vs Post-bridge mastery delta analytics.
- **Faculty Insight Dashboard**: Class-level learning gap distribution and instructional interventions.

## 🛠️ Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas API, Motion
- **Backend**: Node.js, Express, tsx
- **AI Integration**: Google Gemini API (@google/genai, gemini-3.8-flash)
`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Push Prototype to GitHub</h2>
              <p className="text-xs text-slate-500">
                Ready-to-push repository instructions &amp; setup commands
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Terminal Commands */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                <Terminal className="w-4 h-4 text-indigo-600" />
                <span>Git Push Terminal Commands</span>
              </span>
              <button
                onClick={() => copyToClipboard(gitCommands, 'git')}
                className="flex items-center space-x-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition"
              >
                {copiedSection === 'git' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Commands</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-slate-900 text-slate-100 font-mono text-xs p-4 rounded-xl overflow-x-auto leading-relaxed border border-slate-800">
              <pre>{gitCommands}</pre>
            </div>
          </div>

          {/* Project Structure */}
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5 mb-2">
              <FileCode2 className="w-4 h-4 text-indigo-600" />
              <span>Project Structure Ready for GitHub</span>
            </span>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 font-mono space-y-1">
              <div>📁 server.ts (Express server with Gemini API backend)</div>
              <div>📁 src/components/ (Interactive simulations, Concept Map, Bridge, Quizzes)</div>
              <div>📁 src/components/LiveConceptVisualizer.tsx (Canvas animation engine)</div>
              <div>📁 src/data/curriculum.ts (Domain models, questions, prerequisite graphs)</div>
              <div>📁 src/types.ts (Strongly typed EduBridge data contracts)</div>
              <div>📁 package.json (Vite + tsx + React 19 + @google/genai)</div>
            </div>
          </div>

          {/* README generation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                README.md Documentation
              </span>
              <button
                onClick={() => copyToClipboard(readmeSnippet, 'readme')}
                className="flex items-center space-x-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition"
              >
                {copiedSection === 'readme' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy README</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-slate-900 text-slate-100 font-mono text-xs p-3.5 rounded-xl overflow-x-auto max-h-48 border border-slate-800">
              <pre>{readmeSnippet}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
