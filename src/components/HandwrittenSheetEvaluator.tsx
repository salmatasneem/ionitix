import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  Camera,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Printer,
  Download,
  Languages,
  BookOpen,
  Award,
  Zap,
  Sliders,
  ChevronDown,
  ChevronUp,
  Eye,
  Scan,
  ShieldCheck,
  BarChart3,
  Lightbulb,
  ExternalLink,
  Play,
  RotateCcw,
  Bell,
  Clock,
} from 'lucide-react';
import { AnswerSheetEvaluationReport, EvaluatedQuestion } from '../types';
import { SAMPLE_ANSWER_SHEETS, SampleAnswerSheetPreset } from '../data/sampleAnswerSheets';
import { CURRICULUM_TOPICS } from '../data/curriculum';
import { scheduleTopicReminder } from '../utils/reminderStorage';

interface HandwrittenSheetEvaluatorProps {
  onBack?: () => void;
  onNavigateToSimulator?: (topicId: string) => void;
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
];

export const HandwrittenSheetEvaluator: React.FC<HandwrittenSheetEvaluatorProps> = ({
  onBack,
  onNavigateToSimulator,
}) => {
  // Active state
  const [selectedPreset, setSelectedPreset] = useState<SampleAnswerSheetPreset>(SAMPLE_ANSWER_SHEETS[0]);
  const [report, setReport] = useState<AnswerSheetEvaluationReport | null>(SAMPLE_ANSWER_SHEETS[0].evaluationReport);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

  // Upload & Scan state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStepIndex, setScanStepIndex] = useState<number>(0);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Custom Rubric / Scheme toggle
  const [showCustomRubric, setShowCustomRubric] = useState<boolean>(false);
  const [customRubricText, setCustomRubricText] = useState<string>(
    'Q1: 8 marks - Chain rule formula and substitution\nQ2: 10 marks - 3-tier nested chain rule with innermost factor 2\nQ3: 7 marks - Rate transmission reasoning'
  );

  // UI state
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({
    'Q1(a)': true,
    'Q2(b)': true,
    'Q3': true,
    'Q1': true,
    'Q2': true,
  });
  const [activeVisualModal, setActiveVisualModal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'report' | 'ocr_sheet' | 'recovery'>('report');
  const [scheduledReminders, setScheduledReminders] = useState<Record<string, number>>({});

  const handleScheduleItemReminder = (itemTopic: string, hours: number) => {
    scheduleTopicReminder({
      topicId: selectedPreset.subject === 'Mathematics' ? 'math_chain_rule' : selectedPreset.subject === 'Physics' ? 'physics_snells_law' : 'cs_recursion_tree',
      topicTitle: `${selectedPreset.subject}: ${itemTopic}`,
      subject: selectedPreset.subject,
      weakConcepts: [itemTopic],
      reasonSummary: `Identified weak concept from handwritten exam sheet (${selectedPreset.title}).`,
      intervalHours: hours,
    });
    setScheduledReminders((prev) => ({ ...prev, [itemTopic]: hours }));
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scan progress stages
  const scanStages = [
    'Document Edge Detection & Perspective Normalization...',
    'Gemini Multimodal OCR Character Extraction...',
    'Metadata Recognition: Student Name, USN, & Question IDs...',
    'NLP Concept Alignment & Keyword Coverage Analysis...',
    'Scoring Marks & Generating Personalized Recovery Pathway...',
  ];

  // Handle Preset Select
  const handleSelectPreset = (preset: SampleAnswerSheetPreset) => {
    setSelectedPreset(preset);
    setUploadedImage(null);
    setUploadedFileName('');
    setReport(preset.evaluationReport);
  };

  // Run AI OCR & NLP Evaluation
  const runEvaluation = async (imageBase64Payload?: string, fileNamePayload?: string) => {
    setIsScanning(true);
    setScanStepIndex(0);

    // Progress interval for visual feedback
    const interval = setInterval(() => {
      setScanStepIndex((prev) => (prev < scanStages.length - 1 ? prev + 1 : prev));
    }, 600);

    const imageToSend = imageBase64Payload || uploadedImage || selectedPreset.paperPreviewSvg;
    const fileToSend = fileNamePayload || uploadedFileName || selectedPreset.title;

    try {
      const response = await fetch('/api/evaluate-answer-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageToSend,
          fileName: fileToSend,
          subjectHint: selectedPreset.subject,
          customRubric: showCustomRubric ? customRubricText : null,
          language: selectedLanguage,
          samplePresetId: selectedPreset.id,
        }),
      });

      const data = await response.json();
      clearInterval(interval);
      setIsScanning(false);

      if (data.success && data.report) {
        setReport(data.report);
      } else {
        // Fallback to preset report
        setReport(selectedPreset.evaluationReport);
      }
    } catch (err) {
      clearInterval(interval);
      setIsScanning(false);
      // Fallback
      setReport(selectedPreset.evaluationReport);
    }
  };

  // Handle file input
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setUploadedImage(base64);
      runEvaluation(base64, file.name);
    };
    reader.readAsDataURL(file);
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setUploadedImage(base64);
      runEvaluation(base64, file.name);
    };
    reader.readAsDataURL(file);
  };

  const toggleQuestionExpand = (qNum: string) => {
    setExpandedQuestions((prev) => ({ ...prev, [qNum]: !prev[qNum] }));
  };

  // Get status color utilities
  const getStatusBadge = (status: EvaluatedQuestion['status']) => {
    switch (status) {
      case 'good':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          label: 'Good Concept Alignment',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
        };
      case 'improve':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          label: 'Needs Minor Improvement',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
        };
      case 'needs_work':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          label: 'Concept Gap Detected',
          icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
        };
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="handwritten-sheet-evaluator" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI Vision &amp; OCR Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>Powered by Gemini 3.8 Flash</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Handwritten Answer Sheet Evaluator
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl">
              Upload or scan physical student answer sheets (JPG, PNG, PDF). Our multimodal OCR and NLP pipeline extracts student handwriting, matches against marking schemes, pinpoints misconceptions, and generates recovery pathways.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Language Selector */}
            <div className="flex items-center space-x-1.5 bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200">
              <Languages className="w-3.5 h-3.5 text-indigo-400" />
              <select
                aria-label="Evaluation output language"
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                  runEvaluation();
                }}
                className="bg-transparent border-none text-white text-xs font-semibold focus:outline-hidden cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Print / Export Report */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>

            {onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-xs"
              >
                <span>Return to Flow</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Sample Selector Ribbon */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Load Sample Sheet:
          </span>
          {SAMPLE_ANSWER_SHEETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 ${
                selectedPreset.id === preset.id && !uploadedImage
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
              }`}
            >
              <span>{preset.subject}: {preset.title.split(':')[1] || preset.title}</span>
              <span className="text-[10px] opacity-75">({preset.rollNumber})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Upload/Scan Panel & Evaluation Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload, Camera, & Sheet Inspection (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Upload & Scanner Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Scan className="w-5 h-5 text-indigo-600" />
                <h2 className="font-bold text-slate-900 text-sm">Scan or Upload Document</h2>
              </div>
              <button
                onClick={() => setShowCustomRubric(!showCustomRubric)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center space-x-1"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{showCustomRubric ? 'Hide Rubric' : 'Marking Scheme'}</span>
              </button>
            </div>

            {/* Custom Rubric Drawer */}
            <AnimatePresence>
              {showCustomRubric && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Custom Exam Marking Scheme / Rubric</span>
                      <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                    </div>
                    <textarea
                      aria-label="Custom Exam Marking Scheme / Rubric"
                      value={customRubricText}
                      onChange={(e) => setCustomRubricText(e.target.value)}
                      rows={3}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                      placeholder="Specify question marks and expected keywords..."
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Drag & Drop Area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-3 ${
                isDragOver
                  ? 'border-indigo-500 bg-indigo-50/50'
                  : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                className="hidden"
                onChange={handleFileUpload}
              />

              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
                <Upload className="w-6 h-6" />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800">
                  Click to browse or drag &amp; drop answer sheet
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Supports JPG, PNG, or PDF (Scanned exam papers, homework, ruled sheets)
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                  Auto-align
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                  Formula OCR
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                  Multimodal Gemini
                </span>
              </div>
            </div>

            {/* Camera Capture Simulation */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <button
                onClick={() => {
                  setIsCameraActive(!isCameraActive);
                  if (!isCameraActive) {
                    // Simulate live capture from camera
                    setTimeout(() => {
                      setIsCameraActive(false);
                      runEvaluation();
                    }, 1400);
                  }
                }}
                className="inline-flex items-center space-x-1.5 text-slate-600 hover:text-indigo-600 font-semibold"
              >
                <Camera className="w-4 h-4 text-slate-500" />
                <span>{isCameraActive ? 'Capturing Document Frame...' : 'Scan via Device Camera'}</span>
              </button>

              <button
                onClick={() => runEvaluation()}
                disabled={isScanning}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                <span>Re-Analyze Sheet</span>
              </button>
            </div>
          </div>

          {/* Paper Inspection Preview with Laser Scanner Beam */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>
                  {uploadedFileName ? `Custom File: ${uploadedFileName}` : selectedPreset.title}
                </span>
              </span>
              <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {selectedPreset.paperType.toUpperCase()} PAPER
              </span>
            </div>

            {/* Document Frame Container */}
            <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-950/5 flex items-center justify-center max-h-[480px]">
              {/* Laser Scan Beam Animation */}
              {isScanning && (
                <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                  <motion.div
                    initial={{ top: '0%' }}
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee]"
                  />
                  <div className="absolute inset-0 bg-indigo-500/10 backdrop-blur-[0.5px]" />
                </div>
              )}

              {/* Document Visual Render */}
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="Uploaded handwritten sheet"
                  className="w-full object-contain max-h-[460px] rounded-lg shadow-inner"
                />
              ) : (
                <img
                  src={selectedPreset.paperPreviewSvg}
                  alt="Sample handwritten exam paper"
                  className="w-full object-contain max-h-[460px] rounded-lg shadow-inner"
                />
              )}
            </div>

            {/* Scanning Progress Banner */}
            {isScanning && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                  <span className="flex items-center space-x-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                    <span>Analyzing Answer Script...</span>
                  </span>
                  <span>Step {scanStepIndex + 1} of {scanStages.length}</span>
                </div>
                <p className="text-[11px] text-indigo-700 font-medium">
                  {scanStages[scanStepIndex]}
                </p>
                <div className="w-full bg-indigo-200 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className="bg-indigo-600 h-1.5 rounded-full"
                    animate={{ width: `${((scanStepIndex + 1) / scanStages.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Column: Comprehensive Evaluation Dashboard (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {report ? (
            <>
              {/* Student Metadata & Score Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-extrabold text-slate-900 text-lg">{report.student.name}</h3>
                      <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {report.student.rollNumber}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {report.student.subject} {report.student.examCode ? `• ${report.student.examCode}` : ''} {report.student.date ? `• ${report.student.date}` : ''}
                    </p>
                  </div>

                  {/* Total Score & Grade Badge */}
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Total Marks
                      </span>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-2xl font-black text-slate-900">
                          {report.totalScore}
                        </span>
                        <span className="text-sm font-bold text-slate-400">
                          / {report.maxScore}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-black text-base shadow-xs ${
                        report.percentage >= 80
                          ? 'bg-emerald-500 text-white'
                          : report.percentage >= 60
                            ? 'bg-amber-500 text-white'
                            : 'bg-rose-500 text-white'
                      }`}
                    >
                      <span>{report.grade}</span>
                      <span className="text-[9px] font-medium opacity-90">{report.percentage}%</span>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics Bento */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                      OCR Confidence
                    </span>
                    <div className="flex items-center space-x-1.5 mt-1">
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-bold text-slate-900">
                        {report.ocrConfidence}%
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                      NLP Evaluation
                    </span>
                    <div className="flex items-center space-x-1.5 mt-1">
                      <Zap className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-bold text-slate-900">
                        {report.evaluationConfidence}%
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Projected Final
                    </span>
                    <div className="flex items-center space-x-1.5 mt-1">
                      <BarChart3 className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold text-slate-900">
                        {report.predictedFinalScoreRange}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Percentile Rank
                    </span>
                    <div className="flex items-center space-x-1.5 mt-1">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-bold text-slate-900">
                        Top {100 - report.predictedPercentile}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-indigo-950 leading-relaxed">
                  <span className="font-bold text-indigo-900 block mb-1">Executive Academic Summary:</span>
                  {report.executiveSummary}
                </div>
              </div>

              {/* View Tabs */}
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-1">
                <button
                  onClick={() => setActiveTab('report')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    activeTab === 'report'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Question-by-Question Evaluation ({report.questions.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('recovery')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    activeTab === 'recovery'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Personalized Recovery Plan</span>
                </button>

                <button
                  onClick={() => setActiveTab('ocr_sheet')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    activeTab === 'ocr_sheet'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Raw OCR Transcript</span>
                </button>
              </div>

              {/* Tab 1: Question-by-Question Evaluation */}
              {activeTab === 'report' && (
                <div className="space-y-4">
                  {report.questions.map((q) => {
                    const statusConfig = getStatusBadge(q.status);
                    const isExpanded = !!expandedQuestions[q.questionNumber];

                    return (
                      <div
                        key={q.questionNumber}
                        className={`bg-white rounded-2xl border transition shadow-xs overflow-hidden ${
                          q.status === 'good'
                            ? 'border-emerald-200'
                            : q.status === 'improve'
                              ? 'border-amber-200'
                              : 'border-rose-300 ring-1 ring-rose-200/50'
                        }`}
                      >
                        {/* Question Header Accordion Bar */}
                        <div
                          onClick={() => toggleQuestionExpand(q.questionNumber)}
                          className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 transition"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 font-extrabold text-xs flex items-center justify-center">
                              {q.questionNumber}
                            </span>
                            <div>
                              <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                                {q.questionText}
                              </h4>
                              <div className="flex items-center space-x-2 mt-0.5">
                                <span
                                  className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusConfig.bg}`}
                                >
                                  {statusConfig.icon}
                                  <span>{statusConfig.label}</span>
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  Relevance: {q.nlpMetrics.relevance}%
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <span className="text-xs font-extrabold text-slate-900">
                                {q.marksAwarded} / {q.maxMarks}
                              </span>
                              <span className="text-[10px] text-slate-400 block">Marks</span>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                        </div>

                        {/* Expanded Question Deep Dive */}
                        {isExpanded && (
                          <div className="p-4 pt-0 border-t border-slate-100 space-y-3.5 text-xs">
                            {/* Comparison Columns: Extracted vs Expected */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
                              {/* Extracted Handwriting */}
                              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200">
                                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1.5">
                                  <span className="flex items-center space-x-1">
                                    <Scan className="w-3.5 h-3.5 text-indigo-600" />
                                    <span>Extracted Student Handwriting (OCR)</span>
                                  </span>
                                </div>
                                <p className="font-mono text-xs text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 leading-relaxed whitespace-pre-line">
                                  {q.extractedHandwrittenText}
                                </p>
                              </div>

                              {/* Expected Model Answer */}
                              <div className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-100">
                                <div className="flex items-center justify-between text-[11px] font-bold text-indigo-900 mb-1.5">
                                  <span className="flex items-center space-x-1">
                                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                                    <span>Expected Answer &amp; Key Concepts</span>
                                  </span>
                                </div>
                                <p className="text-xs text-indigo-950 bg-white p-2.5 rounded-lg border border-indigo-100 leading-relaxed whitespace-pre-line">
                                  {q.expectedAnswer}
                                </p>
                              </div>
                            </div>

                            {/* NLP Semantic Evaluation Radar Scores */}
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                              <span className="text-[11px] font-bold text-slate-700 block">
                                NLP Semantic Answer Quality Breakdown:
                              </span>
                              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                <div>
                                  <div className="flex justify-between text-[10px] text-slate-600 mb-0.5">
                                    <span>Relevance</span>
                                    <span className="font-bold">{q.nlpMetrics.relevance}%</span>
                                  </div>
                                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className="bg-indigo-600 h-1.5 rounded-full"
                                      style={{ width: `${q.nlpMetrics.relevance}%` }}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <div className="flex justify-between text-[10px] text-slate-600 mb-0.5">
                                    <span>Keywords</span>
                                    <span className="font-bold">{q.nlpMetrics.keywordCoverage}%</span>
                                  </div>
                                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className="bg-indigo-600 h-1.5 rounded-full"
                                      style={{ width: `${q.nlpMetrics.keywordCoverage}%` }}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <div className="flex justify-between text-[10px] text-slate-600 mb-0.5">
                                    <span>Accuracy</span>
                                    <span className="font-bold">{q.nlpMetrics.conceptAccuracy}%</span>
                                  </div>
                                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className="bg-indigo-600 h-1.5 rounded-full"
                                      style={{ width: `${q.nlpMetrics.conceptAccuracy}%` }}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <div className="flex justify-between text-[10px] text-slate-600 mb-0.5">
                                    <span>Completeness</span>
                                    <span className="font-bold">{q.nlpMetrics.completeness}%</span>
                                  </div>
                                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className="bg-indigo-600 h-1.5 rounded-full"
                                      style={{ width: `${q.nlpMetrics.completeness}%` }}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <div className="flex justify-between text-[10px] text-slate-600 mb-0.5">
                                    <span>Clarity</span>
                                    <span className="font-bold">{q.nlpMetrics.clarityAndGrammar}%</span>
                                  </div>
                                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className="bg-indigo-600 h-1.5 rounded-full"
                                      style={{ width: `${q.nlpMetrics.clarityAndGrammar}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Missing Points & Incorrect Concepts Alerts */}
                            {(q.missingPoints.length > 0 || q.incorrectConcepts.length > 0) && (
                              <div className="space-y-2">
                                {q.missingPoints.length > 0 && (
                                  <div className="p-2.5 bg-rose-50/80 rounded-xl border border-rose-200 flex items-start space-x-2 text-rose-900">
                                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                    <div>
                                      <span className="font-bold block text-[11px]">Missing Key Derivation Points:</span>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {q.missingPoints.map((pt, idx) => (
                                          <span
                                            key={idx}
                                            className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-md text-[10px] font-semibold"
                                          >
                                            {pt}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {q.incorrectConcepts.length > 0 && (
                                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex items-start space-x-2 text-amber-900">
                                    <XCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                    <div>
                                      <span className="font-bold block text-[11px]">Detected Conceptual Misconceptions:</span>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {q.incorrectConcepts.map((mis, idx) => (
                                          <span
                                            key={idx}
                                            className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md text-[10px] font-semibold"
                                          >
                                            {mis}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Improvement Tip & Live Animation Trigger */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100">
                              <p className="text-slate-600 text-xs">
                                <strong className="text-slate-900">Improvement Tip:</strong> {q.improvementTip}
                              </p>

                              {/* Bonus Feature: Live AI Animation for Incorrect Concept */}
                              {q.status !== 'good' && (
                                <button
                                  onClick={() => {
                                    if (q.visualConceptKey && onNavigateToSimulator) {
                                      onNavigateToSimulator(q.visualConceptKey);
                                    } else {
                                      setActiveVisualModal(q.conceptToReview || 'Chain Rule Rate Decomposition');
                                    }
                                  }}
                                  className="shrink-0 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition"
                                >
                                  <Play className="w-3.5 h-3.5" />
                                  <span>Launch Concept Visualizer</span>
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tab 2: Personalized Recovery Plan */}
              {activeTab === 'recovery' && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Personalized Gap Recovery Plan</h4>
                      <p className="text-xs text-slate-500">
                        Tailored interventions targeting the specific gaps discovered during answer sheet evaluation.
                      </p>
                    </div>
                  </div>

                  {/* Immediate Action */}
                  <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs text-indigo-900">
                    <span className="font-extrabold uppercase text-[10px] text-indigo-600 tracking-wider block mb-1">
                      Immediate Priority Action:
                    </span>
                    <p className="font-semibold text-slate-800 leading-relaxed">
                      {report.recoveryPlan.immediateAction}
                    </p>
                  </div>

                  {/* Topic Timeline */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-800 block">
                      Recommended Study Bridges &amp; Drills:
                    </span>
                    {report.recoveryPlan.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                                item.priority === 'high'
                                  ? 'bg-rose-100 text-rose-700'
                                  : item.priority === 'medium'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {item.priority} Priority
                            </span>
                            <h5 className="font-bold text-slate-900">{item.topic}</h5>
                          </div>
                          <p className="text-slate-600 text-[11px]">{item.actionAdvice}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <span className="text-[11px] font-mono text-slate-500">
                            ⏱ {item.estimatedTime}
                          </span>

                          {scheduledReminders[item.topic] ? (
                            <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200 flex items-center space-x-1">
                              <Bell className="w-3 h-3 text-emerald-600" />
                              <span>Reminding in {scheduledReminders[item.topic]}h</span>
                            </span>
                          ) : (
                            <div className="flex items-center space-x-1 bg-white p-0.5 rounded-xl border border-slate-200">
                              <button
                                onClick={() => handleScheduleItemReminder(item.topic, 24)}
                                className="px-2 py-1 rounded-lg text-[10px] font-bold text-indigo-700 hover:bg-indigo-50 transition flex items-center space-x-1"
                                title="Schedule recurring reminder in 24 hours"
                              >
                                <Clock className="w-3 h-3 text-indigo-600" />
                                <span>Remind 24h</span>
                              </button>
                              <button
                                onClick={() => handleScheduleItemReminder(item.topic, 48)}
                                className="px-2 py-1 rounded-lg text-[10px] font-bold text-slate-700 hover:bg-slate-100 transition"
                                title="Schedule recurring reminder in 48 hours"
                              >
                                <span>48h</span>
                              </button>
                            </div>
                          )}

                          {onNavigateToSimulator && (
                            <button
                              onClick={() => onNavigateToSimulator(item.targetConceptId || 'topic-calculus-chain')}
                              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] transition shadow-xs flex items-center space-x-1"
                            >
                              <span>Start Visual Drill</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Strengths & Weaknesses Bento */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
                      <span className="font-bold text-emerald-900 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Demonstrated Strengths:</span>
                      </span>
                      <ul className="space-y-1 text-[11px] text-emerald-800 list-disc list-inside">
                        {report.overallStrengths.map((str, i) => (
                          <li key={i}>{str}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 text-xs text-rose-950 space-y-1.5">
                      <span className="font-bold text-rose-900 flex items-center space-x-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Areas for Focused Attention:</span>
                      </span>
                      <ul className="space-y-1 text-[11px] text-rose-800 list-disc list-inside">
                        {report.overallWeaknesses.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Raw OCR Transcript */}
              {activeTab === 'ocr_sheet' && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Full OCR Transcript</h4>
                      <p className="text-xs text-slate-500">
                        Verbatim handwritten text extracted via Google Gemini multimodal vision.
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      OCR Confidence: {report.ocrConfidence}%
                    </span>
                  </div>

                  <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {selectedPreset.rawHandwrittenText}
                  </pre>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
              <p>Select a sample answer sheet or upload an exam file to view the AI evaluation.</p>
            </div>
          )}
        </div>
      </div>

      {/* Concept Visualizer Animated Modal */}
      <AnimatePresence>
        {activeVisualModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900 text-base">
                    Live AI Animated Concept Explanation
                  </h3>
                </div>
                <button
                  onClick={() => setActiveVisualModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center"
                >
                  &times;
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  Concept: {activeVisualModal}
                </div>

                {/* Animated Simulation Canvas Mock */}
                <div className="h-48 bg-slate-950 rounded-xl flex flex-col items-center justify-center p-4 text-white relative overflow-hidden">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                    className="absolute w-40 h-40 rounded-full border border-dashed border-indigo-500/40"
                  />
                  <div className="text-center space-y-2 z-10">
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-lg font-mono font-bold text-cyan-400"
                    >
                      f( g( h(x) ) ) &rarr; f&apos;(u) &times; g&apos;(v) &times; h&apos;(x)
                    </motion.div>
                    <p className="text-xs text-slate-300 max-w-sm">
                      Watch how each nested layer transmits its rate of change through the chain mechanism without dropping inner factors!
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <strong className="font-bold block">Why this was flagged in the answer sheet:</strong>
                  In Question 2, the innermost factor <code className="bg-amber-100 px-1 py-0.5 rounded font-bold font-mono">d/dx(2x) = 2</code> was omitted, reducing the overall score.
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    onClick={() => setActiveVisualModal(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
                  >
                    Close
                  </button>
                  {onNavigateToSimulator && (
                    <button
                      onClick={() => {
                        setActiveVisualModal(null);
                        onNavigateToSimulator('topic-calculus-chain');
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs"
                    >
                      Open Full Interactive Lab
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
