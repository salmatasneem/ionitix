import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  BookOpen,
  Sparkles,
  Layers,
  ChevronRight,
  Calendar,
  BarChart3,
  Target,
  Sigma,
  Compass,
  GitBranch,
  RefreshCw,
  Zap,
  Printer,
  FileText,
  Brain,
  Gauge,
  Check,
  Search,
  Filter,
  ExternalLink,
  ShieldAlert,
  CheckCircle,
  Users,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { ConceptNode } from '../types';
import { CURRICULUM_TOPICS, TopicDef } from '../data/curriculum';
import { STUDENT_SKILL_PROFILE, CURRENT_STUDENT } from '../data/mockStudentDatabase';

interface StudentMasteryDashboardProps {
  currentTopic: TopicDef;
  conceptNodes: ConceptNode[];
  allTopicConceptNodes: Record<string, ConceptNode[]>;
  onSelectTopic: (topic: TopicDef, step?: number) => void;
  onBackToFlow: () => void;
  activeStep: number;
  onUpdateConceptStatus?: (topicId: string, conceptId: string, newStatus: ConceptNode['status']) => void;
}

interface SubjectMastery {
  subject: string;
  category: string;
  topicId: string;
  topicTitle: string;
  iconName: string;
  totalConcepts: number;
  masteredCount: number;
  resolvedCount: number;
  rootGapCount: number;
  atRiskCount: number;
  targetCount: number;
  masteryPercentage: number;
  concepts: ConceptNode[];
  lastActivity: string;
  estimatedGain: number;
}

export interface IdentifiedKnowledgeGap {
  id: string;
  conceptId: string;
  conceptTitle: string;
  topicId: string;
  topicTitle: string;
  subject: string;
  level: number;
  status: 'Resolved' | 'Pending';
  rawStatus: ConceptNode['status'];
  misconceptions: string[];
  lastReviewedDate: string;
  lastReviewedTime: string;
  importance: string;
  topic: TopicDef;
}

export const StudentMasteryDashboard: React.FC<StudentMasteryDashboardProps> = ({
  currentTopic,
  conceptNodes,
  allTopicConceptNodes,
  onSelectTopic,
  onBackToFlow,
  activeStep,
  onUpdateConceptStatus,
}) => {
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(currentTopic.id);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'semester'>('7d');
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [gapStatusFilter, setGapStatusFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  const [gapSubjectFilter, setGapSubjectFilter] = useState<string>('all');
  const [gapSearchQuery, setGapSearchQuery] = useState<string>('');

  const handlePrintReport = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 150);
  };

  const skillProfile = STUDENT_SKILL_PROFILE;

  const radarData = useMemo(() => [
    {
      subject: 'Critical Thinking',
      student: skillProfile.dimensions.criticalThinking,
      cohort: skillProfile.cohortAverages.criticalThinking,
      fullMark: 100,
    },
    {
      subject: 'Logical Reasoning',
      student: skillProfile.dimensions.logicalReasoning,
      cohort: skillProfile.cohortAverages.logicalReasoning,
      fullMark: 100,
    },
    {
      subject: 'Speed',
      student: skillProfile.dimensions.problemSolvingSpeed,
      cohort: skillProfile.cohortAverages.problemSolvingSpeed,
      fullMark: 100,
    },
    {
      subject: 'Accuracy',
      student: skillProfile.dimensions.accuracy,
      cohort: skillProfile.cohortAverages.accuracy,
      fullMark: 100,
    },
    {
      subject: 'Consistency',
      student: skillProfile.dimensions.consistency,
      cohort: skillProfile.cohortAverages.consistency,
      fullMark: 100,
    },
  ], [skillProfile]);

  // Compute subject metrics across all topics in the curriculum
  const subjectMasteries: SubjectMastery[] = useMemo(() => {
    return CURRICULUM_TOPICS.map((topic) => {
      // Use active conceptNodes for currentTopic, otherwise allTopicConceptNodes
      const nodes =
        topic.id === currentTopic.id
          ? conceptNodes
          : allTopicConceptNodes[topic.id] || topic.conceptNodes;

      const totalConcepts = nodes.length;
      const masteredCount = nodes.filter((n) => n.status === 'mastered').length;
      const resolvedCount = nodes.filter((n) => n.status === 'resolved').length;
      const rootGapCount = nodes.filter((n) => n.status === 'root_gap').length;
      const atRiskCount = nodes.filter((n) => n.status === 'at_risk').length;
      const targetCount = nodes.filter((n) => n.status === 'target').length;

      // Completed concepts include both previously mastered and newly resolved prerequisite gaps
      const completedCount = masteredCount + resolvedCount;
      const masteryPercentage =
        totalConcepts > 0 ? Math.round((completedCount / totalConcepts) * 100) : 0;

      // Simulated gain from diagnostic baseline
      const estimatedGain = resolvedCount > 0 ? resolvedCount * 33 : 0;

      return {
        subject: topic.subject,
        category: topic.category,
        topicId: topic.id,
        topicTitle: topic.title,
        iconName: topic.iconName,
        totalConcepts,
        masteredCount,
        resolvedCount,
        rootGapCount,
        atRiskCount,
        targetCount,
        masteryPercentage,
        concepts: nodes,
        lastActivity:
          topic.id === currentTopic.id
            ? 'Active today'
            : topic.id === 'physics_snells_law'
            ? '2 days ago'
            : '4 days ago',
        estimatedGain,
      };
    });
  }, [currentTopic.id, conceptNodes, allTopicConceptNodes]);

  // Aggregate totals
  const overallMetrics = useMemo(() => {
    const totalConcepts = subjectMasteries.reduce((acc, s) => acc + s.totalConcepts, 0);
    const totalMastered = subjectMasteries.reduce((acc, s) => acc + s.masteredCount, 0);
    const totalResolved = subjectMasteries.reduce((acc, s) => acc + s.resolvedCount, 0);
    const totalGaps = subjectMasteries.reduce((acc, s) => acc + s.rootGapCount, 0);
    const totalCompleted = totalMastered + totalResolved;
    const overallPercentage =
      totalConcepts > 0 ? Math.round((totalCompleted / totalConcepts) * 100) : 0;

    return {
      totalConcepts,
      totalMastered,
      totalResolved,
      totalGaps,
      totalCompleted,
      overallPercentage,
    };
  }, [subjectMasteries]);

  // Filtered list
  const filteredSubjects = useMemo(() => {
    if (selectedSubjectFilter === 'all') return subjectMasteries;
    return subjectMasteries.filter((s) => s.subject === selectedSubjectFilter);
  }, [subjectMasteries, selectedSubjectFilter]);

  // Comparative cohort ranking for currentTopic against class average in anonymized percentile format
  const topicCohortStats = useMemo(() => {
    // Current student mastery percentage for the currentTopic
    const currentSubjectMastery = subjectMasteries.find((s) => s.topicId === currentTopic.id);
    const studentScore = currentSubjectMastery ? currentSubjectMastery.masteryPercentage : 0;
    const resolvedGaps = currentSubjectMastery ? currentSubjectMastery.resolvedCount : 0;
    const rootGaps = currentSubjectMastery ? currentSubjectMastery.rootGapCount : 0;
    const masteredCount = currentSubjectMastery ? currentSubjectMastery.masteredCount : 0;
    const totalConcepts = currentSubjectMastery ? currentSubjectMastery.totalConcepts : 1;

    // Cohort benchmark values per topic
    const topicBenchmarks: Record<string, { classAvg: number; median: number; cohortSize: number; topQuartile: number }> = {
      math_chain_rule: { classAvg: 62, median: 60, cohortSize: 68, topQuartile: 78 },
      physics_snells_law: { classAvg: 58, median: 55, cohortSize: 64, topQuartile: 74 },
      cs_bst_traversal: { classAvg: 65, median: 63, cohortSize: 72, topQuartile: 82 },
    };

    const benchmark = topicBenchmarks[currentTopic.id] || {
      classAvg: 60,
      median: 58,
      cohortSize: 65,
      topQuartile: 75,
    };

    // Calculate dynamic percentile rank using normal distribution CDF approximation (stdDev = 16)
    const stdDev = 16;
    const zScore = (studentScore - benchmark.classAvg) / stdDev;
    // Logistic approximation for standard normal CDF: 1 / (1 + exp(-1.702 * z))
    const rawPercentile = 1 / (1 + Math.exp(-1.702 * zScore));
    const percentile = Math.min(99, Math.max(5, Math.round(rawPercentile * 100)));

    const delta = studentScore - benchmark.classAvg;
    const isAboveAverage = delta >= 0;

    // Top percentile tier (e.g. "Top 12%" or "Top 35%")
    const topTierPercent = Math.max(1, 100 - percentile);

    // Approximate anonymized cohort rank (e.g. #8 out of 68)
    const rankEstimate = Math.max(1, Math.round(benchmark.cohortSize * (topTierPercent / 100)));

    // Determine performance tier
    let performanceTier: 'Advanced' | 'Proficient' | 'Developing' | 'Needs Review' = 'Developing';
    if (percentile >= 75) {
      performanceTier = 'Advanced';
    } else if (percentile >= 50) {
      performanceTier = 'Proficient';
    } else if (percentile >= 25) {
      performanceTier = 'Developing';
    } else {
      performanceTier = 'Needs Review';
    }

    return {
      studentScore,
      classAvg: benchmark.classAvg,
      median: benchmark.median,
      cohortSize: benchmark.cohortSize,
      topQuartile: benchmark.topQuartile,
      percentile,
      topTierPercent,
      delta,
      isAboveAverage,
      rankEstimate,
      performanceTier,
      resolvedGaps,
      rootGaps,
      masteredCount,
      totalConcepts,
    };
  }, [subjectMasteries, currentTopic.id]);

  // Aggregate and compute all identified knowledge gaps across subjects
  const allKnowledgeGaps: IdentifiedKnowledgeGap[] = useMemo(() => {
    const list: IdentifiedKnowledgeGap[] = [];

    CURRICULUM_TOPICS.forEach((topic) => {
      const nodes =
        topic.id === currentTopic.id
          ? conceptNodes
          : allTopicConceptNodes[topic.id] || topic.conceptNodes;

      nodes.forEach((node) => {
        // A knowledge gap is any node identified as root_gap, at_risk, resolved, or having explicit misconceptions
        const isGap =
          node.status === 'root_gap' ||
          node.status === 'resolved' ||
          node.status === 'at_risk' ||
          (node.misconceptions && node.misconceptions.length > 0);

        if (isGap) {
          const isResolved = node.status === 'resolved';

          // Assign realistic last reviewed dates based on topic/node activity
          let lastReviewedDate = 'Sep 18, 2026';
          let lastReviewedTime = '3 days ago';

          if (topic.id === currentTopic.id || node.id === 'c_composite_decomp') {
            lastReviewedDate = 'Sep 22, 2026';
            lastReviewedTime = isResolved ? 'Today, 10:45 AM (Passed Quiz)' : 'Today, 09:15 AM (Diagnostic Flagged)';
          } else if (node.id === 'c_index_speed' || topic.id === 'physics_snells_law') {
            lastReviewedDate = 'Sep 20, 2026';
            lastReviewedTime = isResolved ? '2 days ago (Remediated)' : '2 days ago (Diagnostic Flagged)';
          } else if (node.id === 'c_recursion_stack') {
            lastReviewedDate = 'Sep 19, 2026';
            lastReviewedTime = isResolved ? '3 days ago (Passed Bridge)' : '3 days ago (Prerequisite Bottleneck)';
          } else if (node.id === 'c_bst_invariant') {
            lastReviewedDate = 'Sep 16, 2026';
            lastReviewedTime = isResolved ? '6 days ago (Resolved)' : '6 days ago (At Risk Invariant)';
          }

          let importance = 'Critical Prerequisite';
          if (node.level === 0) importance = 'Foundational Prerequisite';
          if (topic.subject === 'Computer Science') importance = 'Algorithmic Invariant';

          const primaryMisconception =
            node.misconceptions && node.misconceptions.length > 0
              ? node.misconceptions[0]
              : node.description;

          list.push({
            id: `${topic.id}_${node.id}`,
            conceptId: node.id,
            conceptTitle: node.title,
            topicId: topic.id,
            topicTitle: topic.title,
            subject: topic.subject,
            level: node.level,
            status: isResolved ? 'Resolved' : 'Pending',
            rawStatus: node.status,
            misconceptions: node.misconceptions || [primaryMisconception],
            lastReviewedDate,
            lastReviewedTime,
            importance,
            topic,
          });
        }
      });
    });

    return list;
  }, [currentTopic.id, conceptNodes, allTopicConceptNodes]);

  // Filtered knowledge gaps based on status, subject, and search query
  const filteredKnowledgeGaps = useMemo(() => {
    return allKnowledgeGaps.filter((gap) => {
      if (gapStatusFilter === 'pending' && gap.status !== 'Pending') return false;
      if (gapStatusFilter === 'resolved' && gap.status !== 'Resolved') return false;

      if (gapSubjectFilter !== 'all' && gap.subject !== gapSubjectFilter) return false;

      if (gapSearchQuery.trim()) {
        const query = gapSearchQuery.toLowerCase();
        const matchesTitle = gap.conceptTitle.toLowerCase().includes(query);
        const matchesTopic = gap.topicTitle.toLowerCase().includes(query);
        const matchesSubject = gap.subject.toLowerCase().includes(query);
        const matchesMisconception = gap.misconceptions.some((m) => m.toLowerCase().includes(query));
        if (!matchesTitle && !matchesTopic && !matchesSubject && !matchesMisconception) {
          return false;
        }
      }

      return true;
    });
  }, [allKnowledgeGaps, gapStatusFilter, gapSubjectFilter, gapSearchQuery]);

  // Overall gap metrics summary
  const gapMetrics = useMemo(() => {
    const total = allKnowledgeGaps.length;
    const resolved = allKnowledgeGaps.filter((g) => g.status === 'Resolved').length;
    const pending = allKnowledgeGaps.filter((g) => g.status === 'Pending').length;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    return { total, resolved, pending, resolutionRate };
  }, [allKnowledgeGaps]);

  const handleToggleGapStatus = (gap: IdentifiedKnowledgeGap) => {
    if (onUpdateConceptStatus) {
      const nextStatus: ConceptNode['status'] =
        gap.status === 'Resolved' ? 'root_gap' : 'resolved';
      onUpdateConceptStatus(gap.topicId, gap.conceptId, nextStatus);
    }
  };

  // Growth timeline mock events
  const growthTimelineEvents = useMemo(() => {
    const events = [
      {
        date: 'Day 1 (Initial Diagnostic)',
        title: 'Diagnostic Baseline Established',
        description:
          'Evaluated foundational knowledge in Algebraic Composition and Instantaneous Limits. 1 prerequisite root gap identified in Composite Function Decomposition.',
        score: '33% Mastery',
        gain: 'Baseline',
        icon: AlertCircle,
        iconBg: 'bg-amber-100 text-amber-700',
      },
      {
        date: 'Day 2 (Live AI Visualization)',
        title: 'Interactive Tandem Rate Machine Completed',
        description:
          'Engaged with live dynamic gears simulator demonstrating how inner and outer rates multiply through composite function chain rule.',
        score: '75% Comprehension',
        gain: '+42% Gain',
        icon: Sparkles,
        iconBg: 'bg-indigo-100 text-indigo-700',
      },
      {
        date: 'Day 3 (Bridge & Post-Quiz)',
        title: 'Prerequisite Gap Resolved & Mastered',
        description:
          'Achieved 100% on targeted post-bridge quiz. Prerequisite node status transitioned from "Root Gap" to "Resolved" in live knowledge graph.',
        score: '100% Post-Bridge',
        gain: '+67% Net Growth',
        icon: CheckCircle2,
        iconBg: 'bg-emerald-100 text-emerald-700',
      },
      {
        date: 'Projected (Day 7)',
        title: 'Long-Term Retention Milestone',
        description:
          'Scheduled spaced retrieval check for Chain Rule and Wave Optics to cement permanent neural pathway encoding.',
        score: 'Target 95%+',
        gain: 'Retention Check',
        icon: Target,
        iconBg: 'bg-purple-100 text-purple-700',
      },
    ];

    // If active topic has resolved concepts, highlight it
    if (overallMetrics.totalResolved > 0) {
      return events;
    }
    return events.slice(0, 2);
  }, [overallMetrics.totalResolved]);

  // Helper for topic icons
  const renderSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sigma':
        return <Sigma className="w-5 h-5" />;
      case 'Compass':
        return <Compass className="w-5 h-5" />;
      case 'GitBranch':
        return <GitBranch className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  // Helper for status badges
  const getStatusBadge = (status: ConceptNode['status']) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3" />
            <span>Resolved</span>
          </span>
        );
      case 'mastered':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <Award className="w-3 h-3" />
            <span>Mastered</span>
          </span>
        );
      case 'root_gap':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertCircle className="w-3 h-3" />
            <span>Root Gap</span>
          </span>
        );
      case 'at_risk':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3" />
            <span>At Risk</span>
          </span>
        );
      case 'target':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
            <Target className="w-3 h-3" />
            <span>Target Goal</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6" id="student-mastery-dashboard">
      {/* Official Print Header (Visible only on PDF export / Paper Print) */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-700 text-white flex items-center justify-center font-black text-lg">
              EB
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                EduBridge AI &bull; Academic Intelligence System
              </h1>
              <p className="text-xs text-slate-600">
                Official Student Progress Report &amp; Cognitive Problem-Solving Skill Radar Evaluation
              </p>
            </div>
          </div>
          <div className="text-right text-xs">
            <p className="font-bold text-slate-900">Document Type: Confidential Student Assessment</p>
            <p className="text-slate-500">Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {/* Student Credential Grid for PDF print */}
        <div className="mt-3 grid grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-300">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Student Name</span>
            <span className="font-bold text-slate-900">{CURRENT_STUDENT.name}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Student USN</span>
            <span className="font-mono font-bold text-slate-900">{CURRENT_STUDENT.usn}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Department</span>
            <span className="font-bold text-slate-900">{CURRENT_STUDENT.department}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Academic Standing</span>
            <span className="font-bold text-slate-900">Semester {CURRENT_STUDENT.semester} &bull; CGPA {CURRENT_STUDENT.cgpa}</span>
          </div>
        </div>
      </div>

      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Academic Progression Analytics</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live State Synchronized
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Student Mastery Dashboard
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Track concept mastery progress bars for each academic subject. As root gaps are identified
            via diagnostics and resolved through live AI visualizers, your subject growth bars update in real time.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            id="print-mastery-report-btn"
            onClick={handlePrintReport}
            className="inline-flex items-center space-x-2 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 bg-white hover:bg-indigo-50/50 text-slate-700 hover:text-indigo-600 text-xs font-bold transition shadow-xs cursor-pointer group"
            title="Export complete progress report and skill radar as PDF for offline review"
          >
            <Printer className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
            <span>{isPrinting ? 'Preparing PDF...' : 'Print / Export PDF'}</span>
          </button>

          <button
            id="back-to-learning-flow-btn"
            onClick={onBackToFlow}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-200 transition cursor-pointer"
          >
            <span>Resume Learning Flow</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Aggregate Overview Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Mastery */}
        <div
          id="metric-overall-mastery"
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Mastery
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {overallMetrics.overallPercentage}%
              </span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                +{overallMetrics.totalResolved * 25}% gain
              </span>
            </div>
            {/* Aggregate Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${overallMetrics.overallPercentage}%` }}
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {overallMetrics.totalCompleted} of {overallMetrics.totalConcepts} concepts mastered or resolved
          </p>
        </div>

        {/* Resolved Prerequisite Gaps */}
        <div
          id="metric-resolved-gaps"
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Gaps Resolved
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-emerald-600">
                {overallMetrics.totalResolved}
              </span>
              <span className="text-xs text-slate-500 font-medium">bottlenecks healed</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    overallMetrics.totalConcepts > 0
                      ? (overallMetrics.totalResolved / overallMetrics.totalConcepts) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {overallMetrics.totalResolved > 0
              ? 'Bridge pathways successfully reinforced'
              : 'Complete a bridge quiz to heal root gaps'}
          </p>
        </div>

        {/* Active Unresolved Gaps */}
        <div
          id="metric-active-gaps"
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Root Gaps
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-rose-600">
                {overallMetrics.totalGaps}
              </span>
              <span className="text-xs text-slate-500 font-medium">requiring bridges</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-rose-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    overallMetrics.totalConcepts > 0
                      ? (overallMetrics.totalGaps / overallMetrics.totalConcepts) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {overallMetrics.totalGaps > 0
              ? 'Detected via diagnostic assessments'
              : 'Zero active gaps! All prerequisites sound'}
          </p>
        </div>

        {/* Growth Velocity */}
        <div
          id="metric-growth-velocity"
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Growth Velocity
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-purple-600">
                +{overallMetrics.totalResolved > 0 ? '67%' : '15%'}
              </span>
              <span className="text-xs text-slate-500 font-medium">net delta</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: overallMetrics.totalResolved > 0 ? '67%' : '15%' }}
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Average comprehension acceleration post-bridge
          </p>
        </div>
      </div>

      {/* Comparative Topic Mastery & Class Cohort Benchmark Card */}
      <div
        id="comparative-topic-mastery-card"
        className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5 print-break-inside-avoid"
      >
        {/* Header & Anonymity Verification Tag */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full flex items-center space-x-1.5 w-fit">
                <Users className="w-3 h-3 text-indigo-600" />
                <span>Class Cohort Benchmark</span>
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {currentTopic.subject}
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <span>Current Topic: {currentTopic.title}</span>
            </h2>
            <p className="text-xs text-slate-500">
              Comparative ranking of your concept mastery against the enrolled class average in an anonymized percentile format.
            </p>
          </div>

          <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs self-start md:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-800 block text-[11px] leading-tight">
                k-Anonymity Protected
              </span>
              <span className="text-[10px] text-slate-500">
                N = {topicCohortStats.cohortSize} enrolled peers &bull; Identifiers masked
              </span>
            </div>
          </div>
        </div>

        {/* 3-Column Comparative Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Column 1: Anonymized Percentile Ranking */}
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                Anonymized Percentile
              </span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-indigo-200/80 text-indigo-800 uppercase tracking-wide">
                {topicCohortStats.performanceTier}
              </span>
            </div>

            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-indigo-700 tracking-tight">
                  {topicCohortStats.percentile}th
                </span>
                <span className="text-sm font-bold text-indigo-900">
                  Percentile
                </span>
              </div>
              <p className="text-xs font-semibold text-indigo-800 mt-1">
                Top {topicCohortStats.topTierPercent}% of class cohort
              </p>
            </div>

            <div className="pt-2 border-t border-indigo-200/60 text-[11px] text-indigo-700 space-y-0.5">
              <div className="flex justify-between">
                <span>Surpasses peer submissions:</span>
                <span className="font-bold">{topicCohortStats.percentile}%</span>
              </div>
              <div className="flex justify-between">
                <span>Approximate cohort position:</span>
                <span className="font-bold">~#{topicCohortStats.rankEstimate} of {topicCohortStats.cohortSize}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Score Comparison vs. Class Average */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Mastery vs. Class Average
              </span>
              <span
                className={`inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                  topicCohortStats.isAboveAverage
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {topicCohortStats.isAboveAverage ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                <span>
                  {topicCohortStats.isAboveAverage
                    ? `+${topicCohortStats.delta}% above avg`
                    : `${topicCohortStats.delta}% below avg`}
                </span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center py-1">
              <div className="p-2 rounded-lg bg-white border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Your Score</span>
                <span className="text-xl font-extrabold text-indigo-600">
                  {topicCohortStats.studentScore}%
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Class Average</span>
                <span className="text-xl font-extrabold text-slate-700">
                  {topicCohortStats.classAvg}%
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 space-y-0.5">
              <div className="flex justify-between">
                <span>Class Median:</span>
                <span className="font-bold">{topicCohortStats.median}%</span>
              </div>
              <div className="flex justify-between">
                <span>Top Quartile (75th %ile) Cutoff:</span>
                <span className="font-bold">{topicCohortStats.topQuartile}%</span>
              </div>
            </div>
          </div>

          {/* Column 3: Visual Anonymized Distribution Spectrum */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Cohort Distribution Scale
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                Quartile Bands
              </span>
            </div>

            {/* Quantile Spectrum Bar */}
            <div className="space-y-1.5">
              <div className="relative pt-6 pb-2">
                {/* Pin for student percentile */}
                <div
                  className="absolute top-0 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-500"
                  style={{ left: `${topicCohortStats.percentile}%` }}
                >
                  <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[9px] font-bold shadow-xs whitespace-nowrap">
                    You ({topicCohortStats.percentile}th)
                  </span>
                  <div className="w-1.5 h-1.5 bg-indigo-600 rotate-45 -mt-0.5" />
                </div>

                {/* 4-Quartile Visual Segmented Bar */}
                <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-200">
                  <div className="w-1/4 h-full bg-slate-300 border-r border-white/60" title="Q1: 0-25% (Foundational)" />
                  <div className="w-1/4 h-full bg-indigo-200 border-r border-white/60" title="Q2: 25-50% (Developing)" />
                  <div className="w-1/4 h-full bg-indigo-400 border-r border-white/60" title="Q3: 50-75% (Proficient)" />
                  <div className="w-1/4 h-full bg-indigo-600" title="Q4: 75-100% (Advanced Mastery)" />
                </div>

                {/* Class Average Marker */}
                <div
                  className="absolute bottom-0 -translate-x-1/2 flex flex-col items-center pointer-events-none"
                  style={{ left: `${topicCohortStats.classAvg}%` }}
                >
                  <div className="w-0.5 h-2 bg-slate-600" />
                  <span className="text-[8px] font-bold text-slate-600 mt-0.5 whitespace-nowrap">
                    Avg ({topicCohortStats.classAvg}%)
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-[9px] text-slate-400 pt-1 font-medium">
                <span>0th (Min)</span>
                <span>25th</span>
                <span>50th (Median)</span>
                <span>75th</span>
                <span>100th (Max)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 leading-tight">
              Anonymized distribution curve computed across {topicCohortStats.cohortSize} class submissions without exposing individual identity.
            </div>
          </div>
        </div>

        {/* Dynamic Contextual Guidance Banner */}
        <div
          className={`p-3 rounded-xl border flex items-start space-x-2.5 text-xs ${
            topicCohortStats.percentile >= 75
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : topicCohortStats.percentile >= 50
              ? 'bg-indigo-50/70 border-indigo-200 text-indigo-900'
              : 'bg-amber-50/70 border-amber-200 text-amber-900'
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            {topicCohortStats.percentile >= 75 ? (
              <span>
                <strong>Mastery Leader:</strong> Your score places you in the <strong>{topicCohortStats.percentile}th percentile</strong> (top {topicCohortStats.topTierPercent}%), ahead of the class average ({topicCohortStats.classAvg}%). All foundational prerequisites for <em>{currentTopic.title}</em> are solidified.
              </span>
            ) : topicCohortStats.percentile >= 50 ? (
              <span>
                <strong>Solid Performance:</strong> You rank in the <strong>{topicCohortStats.percentile}th percentile</strong>, exceeding the class median ({topicCohortStats.median}%). Resolving your remaining root gaps will push your mastery into the top quartile (≥{topicCohortStats.topQuartile}%).
              </span>
            ) : (
              <span>
                <strong>Focus Area:</strong> You are currently at the <strong>{topicCohortStats.percentile}th percentile</strong> ({topicCohortStats.studentScore}% vs {topicCohortStats.classAvg}% class avg). Completing the AI visualizer bridge for <em>{currentTopic.title}</em> will directly resolve prerequisite bottlenecks and accelerate your rank.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Layout: Subject Progress Bars & Growth Over Time */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): Subject Progress Bars & Concept Detail */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  <span>Subject Mastery Progress Bars</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time ratio of resolved and mastered concepts in each academic domain
                </p>
              </div>

              {/* Subject Filter Chips */}
              <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  id="filter-all-btn"
                  onClick={() => setSelectedSubjectFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    selectedSubjectFilter === 'all'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All
                </button>
                <button
                  id="filter-math-btn"
                  onClick={() => setSelectedSubjectFilter('Mathematics')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    selectedSubjectFilter === 'Mathematics'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Math
                </button>
                <button
                  id="filter-physics-btn"
                  onClick={() => setSelectedSubjectFilter('Physics')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    selectedSubjectFilter === 'Physics'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Physics
                </button>
                <button
                  id="filter-cs-btn"
                  onClick={() => setSelectedSubjectFilter('Computer Science')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    selectedSubjectFilter === 'Computer Science'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  CS
                </button>
              </div>
            </div>

            {/* Subject List Cards with Progress Bars */}
            <div className="space-y-4">
              {filteredSubjects.map((item) => {
                const isCurrent = item.topicId === currentTopic.id;
                const isExpanded = expandedTopicId === item.topicId;

                // Color accent based on percentage
                const progressColor =
                  item.masteryPercentage >= 75
                    ? 'bg-emerald-500'
                    : item.masteryPercentage >= 50
                    ? 'bg-indigo-600'
                    : 'bg-amber-500';

                return (
                  <div
                    key={item.topicId}
                    id={`subject-card-${item.topicId}`}
                    className={`rounded-xl border transition-all ${
                      isCurrent
                        ? 'border-indigo-300 bg-indigo-50/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              isCurrent
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {renderSubjectIcon(item.iconName)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-bold text-slate-900">{item.subject}</span>
                              <span className="text-[10px] font-semibold text-slate-500 px-2 py-0.5 rounded-full bg-slate-100">
                                {item.category}
                              </span>
                              {isCurrent && (
                                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                                  Current Topic
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 font-medium mt-0.5">{item.topicTitle}</p>
                          </div>
                        </div>

                        {/* Percentage Pill */}
                        <div className="text-right shrink-0">
                          <span className="text-xl font-extrabold text-slate-900">
                            {item.masteryPercentage}%
                          </span>
                          <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                            Mastery
                          </span>
                        </div>
                      </div>

                      {/* The Main Progress Bar for this Subject */}
                      <div className="mt-3.5 space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="font-medium">
                            {item.masteredCount + item.resolvedCount} of {item.totalConcepts} Concepts
                            Mastered / Resolved
                          </span>
                          <span className="text-[11px] font-semibold">
                            {item.resolvedCount > 0 ? (
                              <span className="text-emerald-600 flex items-center">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                {item.resolvedCount} gap resolved
                              </span>
                            ) : item.rootGapCount > 0 ? (
                              <span className="text-rose-500 flex items-center">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                {item.rootGapCount} root gap active
                              </span>
                            ) : (
                              <span className="text-slate-400">Stable</span>
                            )}
                          </span>
                        </div>

                        {/* Multi-segment Progress Bar */}
                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                          {/* Mastered Segment */}
                          <div
                            style={{
                              width: `${(item.masteredCount / item.totalConcepts) * 100}%`,
                            }}
                            className="bg-indigo-600 h-full transition-all duration-500"
                            title={`Mastered: ${item.masteredCount}`}
                          />
                          {/* Resolved Segment */}
                          <div
                            style={{
                              width: `${(item.resolvedCount / item.totalConcepts) * 100}%`,
                            }}
                            className="bg-emerald-500 h-full transition-all duration-500"
                            title={`Resolved: ${item.resolvedCount}`}
                          />
                          {/* Root Gap Segment */}
                          <div
                            style={{
                              width: `${(item.rootGapCount / item.totalConcepts) * 100}%`,
                            }}
                            className="bg-rose-400 h-full transition-all duration-500"
                            title={`Root Gap: ${item.rootGapCount}`}
                          />
                          {/* At Risk Segment */}
                          <div
                            style={{
                              width: `${(item.atRiskCount / item.totalConcepts) * 100}%`,
                            }}
                            className="bg-amber-400 h-full transition-all duration-500"
                            title={`At Risk: ${item.atRiskCount}`}
                          />
                        </div>

                        {/* Segment Legend */}
                        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500">
                          <span className="inline-flex items-center space-x-1">
                            <span className="w-2 h-2 rounded-full bg-indigo-600" />
                            <span>Mastered ({item.masteredCount})</span>
                          </span>
                          <span className="inline-flex items-center space-x-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>Resolved Gaps ({item.resolvedCount})</span>
                          </span>
                          {item.rootGapCount > 0 && (
                            <span className="inline-flex items-center space-x-1">
                              <span className="w-2 h-2 rounded-full bg-rose-400" />
                              <span>Root Gaps ({item.rootGapCount})</span>
                            </span>
                          )}
                          {item.atRiskCount > 0 && (
                            <span className="inline-flex items-center space-x-1">
                              <span className="w-2 h-2 rounded-full bg-amber-400" />
                              <span>At Risk ({item.atRiskCount})</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Action Row */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          id={`toggle-concepts-${item.topicId}`}
                          onClick={() =>
                            setExpandedTopicId(isExpanded ? null : item.topicId)
                          }
                          className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center space-x-1 transition"
                        >
                          <span>{isExpanded ? 'Hide Concepts' : 'Inspect Concepts'}</span>
                          <ChevronRight
                            className={`w-3.5 h-3.5 transition-transform ${
                              isExpanded ? 'rotate-90' : ''
                            }`}
                          />
                        </button>

                        <div className="flex items-center space-x-2">
                          <button
                            id={`study-topic-${item.topicId}`}
                            onClick={() => {
                              const foundTopic = CURRICULUM_TOPICS.find((t) => t.id === item.topicId);
                              if (foundTopic) {
                                onSelectTopic(foundTopic, 3); // Start or resume diagnostic
                              }
                            }}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 transition"
                          >
                            <span>Study / Diagnostic</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Concept Nodes List */}
                    {isExpanded && (
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 bg-slate-50/60 border-t border-slate-100 rounded-b-xl space-y-2">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Concept Nodes in this Topic ({item.concepts.length})
                        </div>
                        {item.concepts.map((concept) => (
                          <div
                            key={concept.id}
                            id={`concept-row-${concept.id}`}
                            className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs"
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold text-slate-800">
                                  {concept.title}
                                </span>
                                <span className="text-[10px] font-medium text-slate-400 px-1.5 py-0.5 bg-slate-100 rounded">
                                  Level {concept.level}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 leading-snug">
                                {concept.description}
                              </p>
                              {concept.misconceptions && concept.misconceptions.length > 0 && (
                                <p className="text-[10px] text-rose-600 font-medium">
                                  Misconception: {concept.misconceptions[0]}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center space-x-2 shrink-0 self-start sm:self-center">
                              {getStatusBadge(concept.status)}

                              {/* Simulation Helper: Allow student to test or mark resolved */}
                              {onUpdateConceptStatus && concept.status === 'root_gap' && (
                                <button
                                  id={`heal-concept-${concept.id}`}
                                  onClick={() =>
                                    onUpdateConceptStatus(item.topicId, concept.id, 'resolved')
                                  }
                                  title="Simulate bridge completion to heal gap"
                                  className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-1 rounded transition"
                                >
                                  Heal Gap
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Guidance Box */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100 flex items-start space-x-4">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-xs">
              <h3 className="font-bold text-indigo-950 text-sm">How Growth is Calculated</h3>
              <p className="text-indigo-900/80 leading-relaxed">
                When you take a Diagnostic Quiz (Step 3), our AI isolates any prerequisite root gaps.
                Completing the Live AI Visualization and passing the Post-Bridge Assessment (Step 10)
                flips the concept status to <strong>&ldquo;Resolved&rdquo;</strong>, immediately elevating your subject progress bar and cumulative mastery index.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): Skill Radar & Growth Over Time Visualizer */}
        <div className="lg:col-span-5 space-y-6">
          {/* Cognitive Problem-Solving Skill Radar Card */}
          <div
            id="student-skill-radar-card"
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5 print-break-inside-avoid"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-indigo-600" />
                  <span>Problem-Solving Skill Radar</span>
                </h2>
                <p className="text-xs text-slate-500">
                  5-dimensional cognitive competence benchmarked with cohort
                </p>
              </div>

              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Top 5% Cohort
                </span>
              </div>
            </div>

            {/* Radar Chart Display */}
            <div className="h-64 sm:h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 8 }} />
                  <Radar
                    name="Student Ability"
                    dataKey="student"
                    stroke="#4f46e5"
                    fill="#6366f1"
                    fillOpacity={0.45}
                  />
                  <Radar
                    name="Cohort Average"
                    dataKey="cohort"
                    stroke="#94a3b8"
                    fill="#94a3b8"
                    fillOpacity={0.15}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 11, paddingTop: 4 }}
                    iconType="circle"
                  />
                  <RechartsTooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Dimension Breakdown Metrics */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Logical Reasoning</span>
                  <span className="font-bold text-indigo-600">
                    {skillProfile.dimensions.logicalReasoning}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full"
                    style={{ width: `${skillProfile.dimensions.logicalReasoning}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Critical Thinking</span>
                  <span className="font-bold text-purple-600">
                    {skillProfile.dimensions.criticalThinking}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full"
                    style={{ width: `${skillProfile.dimensions.criticalThinking}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Accuracy Index</span>
                  <span className="font-bold text-emerald-600">
                    {skillProfile.dimensions.accuracy}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${skillProfile.dimensions.accuracy}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Speed Index</span>
                  <span className="font-bold text-amber-600">
                    {skillProfile.dimensions.problemSolvingSpeed}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${skillProfile.dimensions.problemSolvingSpeed}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Calibration Summary */}
            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/80 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Gauge className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="text-indigo-950 font-medium">
                  Speed-Accuracy: <strong>High Accuracy &bull; Measured Velocity</strong>
                </span>
              </div>
              <span className="font-bold text-indigo-700 shrink-0">
                Score: {skillProfile.overallIndex}/100
              </span>
            </div>
          </div>

          {/* Growth Over Time Timeline & Curve */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Growth Over Time</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Comprehension trajectory across learning checkpoints
                </p>
              </div>

              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-[10px] font-bold text-slate-600">
                <button
                  onClick={() => setTimeRange('7d')}
                  className={`px-2 py-0.5 rounded ${
                    timeRange === '7d' ? 'bg-white text-indigo-600 shadow-xs' : ''
                  }`}
                >
                  7D
                </button>
                <button
                  onClick={() => setTimeRange('30d')}
                  className={`px-2 py-0.5 rounded ${
                    timeRange === '30d' ? 'bg-white text-indigo-600 shadow-xs' : ''
                  }`}
                >
                  30D
                </button>
              </div>
            </div>

            {/* Custom Interactive SVG Growth Curve Visualizer */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-700">Mastery Trajectory (%)</span>
                <span className="text-emerald-600 font-bold text-[11px] flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Steep Positive Slope (+67%)
                </span>
              </div>

              {/* Responsive SVG Curve */}
              <div className="relative h-44 w-full">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 360 140">
                  <defs>
                    <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="20" y1="20" x2="340" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <text x="5" y="24" fontSize="9" fill="#94a3b8">100%</text>

                  <line x1="20" y1="65" x2="340" y2="65" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <text x="5" y="69" fontSize="9" fill="#94a3b8">50%</text>

                  <line x1="20" y1="110" x2="340" y2="110" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <text x="5" y="114" fontSize="9" fill="#94a3b8">0%</text>

                  {/* Area fill */}
                  <polygon
                    points="30,95 110,95 190,45 280,20 340,24 340,110 30,110"
                    fill="url(#growthGradient)"
                  />

                  {/* Connecting Line */}
                  <polyline
                    points="30,95 110,95 190,45 280,20 340,24"
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data Points */}
                  {/* Point 1: Diagnostic baseline */}
                  <circle cx="30" cy="95" r="4" fill="#f43f5e" stroke="#fff" strokeWidth="2" />
                  <text x="22" y="85" fontSize="9" fontWeight="bold" fill="#f43f5e">33%</text>

                  {/* Point 2: Gap Isolated */}
                  <circle cx="110" cy="95" r="4" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
                  <text x="102" y="85" fontSize="9" fontWeight="bold" fill="#d97706">33%</text>

                  {/* Point 3: Live Visualizer */}
                  <circle cx="190" cy="45" r="4" fill="#6366f1" stroke="#fff" strokeWidth="2" />
                  <text x="182" y="38" fontSize="9" fontWeight="bold" fill="#4f46e5">75%</text>

                  {/* Point 4: Post-Bridge Quiz */}
                  <circle cx="280" cy="20" r="5" fill="#10b981" stroke="#fff" strokeWidth="2" />
                  <text x="268" y="14" fontSize="9" fontWeight="bold" fill="#059669">100%</text>

                  {/* Point 5: Spaced retention */}
                  <circle cx="340" cy="24" r="4" fill="#8b5cf6" stroke="#fff" strokeWidth="2" />
                  <text x="325" y="16" fontSize="8" fill="#7c3aed">95%</text>
                </svg>
              </div>

              {/* X-axis labels */}
              <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1 mt-2">
                <span>Diagnostic</span>
                <span>Gap Isolated</span>
                <span>Live AI Viz</span>
                <span>Post-Bridge</span>
                <span>Retention</span>
              </div>
            </div>

            {/* Growth Events Timeline */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Milestone Growth History
              </span>

              <div className="space-y-3">
                {growthTimelineEvents.map((evt, idx) => {
                  const IconComp = evt.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70"
                    >
                      <div className={`p-2 rounded-lg shrink-0 ${evt.iconBg}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{evt.title}</span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                            {evt.gain}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {evt.description}
                        </p>
                        <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{evt.date}</span>
                          </span>
                          <span className="font-semibold text-slate-700">{evt.score}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Academic Strengths & Badges */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Demonstrated Mastery Badges</span>
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-1">
                <span className="text-xs font-bold text-indigo-900 block">Root Gap Healer</span>
                <p className="text-[11px] text-indigo-700/80">
                  Resolved prerequisite bottleneck in composite functions.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                <span className="text-xs font-bold text-emerald-900 block">Tandem Visualizer</span>
                <p className="text-[11px] text-emerald-700/80">
                  Mastered live gear simulation with multi-speed rates.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 space-y-1">
                <span className="text-xs font-bold text-purple-900 block">Perfect Post-Bridge</span>
                <p className="text-[11px] text-purple-700/80">
                  100% accuracy on post-recovery conceptual check.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                <span className="text-xs font-bold text-amber-900 block">Stem Interdisciplinary</span>
                <p className="text-[11px] text-amber-700/80">
                  Enrolled across Math, Physics, and Computer Science.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Full-Width Summary Table: Identified Knowledge Gaps Ledger */}
      <div
        id="knowledge-gaps-summary-table-section"
        className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6 print-break-inside-avoid"
      >
        {/* Section Header & KPI Badges */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center space-x-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Foundational Prerequisite Audit</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Diagnostic Verified
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <span>Identified Knowledge Gaps Summary</span>
            </h2>
            <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
              Real-time audit ledger of all foundational prerequisite gaps detected by AI diagnostic evaluations.
              Track each gap&apos;s current status (<strong>Resolved</strong> vs. <strong>Pending</strong>), underlying misconception, and the date it was last reviewed.
            </p>
          </div>

          {/* Quick KPI Count Badges */}
          <div className="flex items-center flex-wrap gap-2.5">
            <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[85px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Gaps</span>
              <span className="text-base font-extrabold text-slate-900">{gapMetrics.total}</span>
            </div>

            <div className="px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-center min-w-[85px]">
              <span className="text-[10px] uppercase font-bold text-amber-600 block">Pending</span>
              <span className="text-base font-extrabold text-amber-700">{gapMetrics.pending}</span>
            </div>

            <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-center min-w-[85px]">
              <span className="text-[10px] uppercase font-bold text-emerald-600 block">Resolved</span>
              <span className="text-base font-extrabold text-emerald-700">{gapMetrics.resolved}</span>
            </div>

            <div className="px-3 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-center min-w-[85px]">
              <span className="text-[10px] uppercase font-bold text-indigo-600 block">Remediated</span>
              <span className="text-base font-extrabold text-indigo-700">{gapMetrics.resolutionRate}%</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
          {/* Status Tabs */}
          <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl text-xs font-bold w-fit">
            <button
              onClick={() => setGapStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                gapStatusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Gaps ({gapMetrics.total})
            </button>
            <button
              onClick={() => setGapStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center space-x-1.5 ${
                gapStatusFilter === 'pending'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Pending ({gapMetrics.pending})</span>
            </button>
            <button
              onClick={() => setGapStatusFilter('resolved')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center space-x-1.5 ${
                gapStatusFilter === 'resolved'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
              <span>Resolved ({gapMetrics.resolved})</span>
            </button>
          </div>

          {/* Subject Filter & Search Bar */}
          <div className="flex items-center space-x-2 flex-1 md:justify-end">
            <select
              value={gapSubjectFilter}
              onChange={(e) => setGapSubjectFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Computer Science">Computer Science</option>
            </select>

            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={gapSearchQuery}
                onChange={(e) => setGapSearchQuery(e.target.value)}
                placeholder="Search gap or misconception..."
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Identified Knowledge Gap</th>
                <th className="py-3 px-4">Subject &amp; Topic</th>
                <th className="py-3 px-4">Root Misconception / AI Diagnosis</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Last Reviewed Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredKnowledgeGaps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No knowledge gaps matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredKnowledgeGaps.map((gap) => {
                  const isResolved = gap.status === 'Resolved';
                  return (
                    <tr
                      key={gap.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Concept Title & Level */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-slate-900 font-bold text-xs">{gap.conceptTitle}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-[10px]">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                              Level {gap.level} &bull; {gap.importance}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Subject & Topic */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                gap.subject === 'Mathematics'
                                  ? 'bg-indigo-600'
                                  : gap.subject === 'Physics'
                                  ? 'bg-sky-600'
                                  : 'bg-emerald-600'
                              }`}
                            />
                            <span>{gap.subject}</span>
                          </span>
                          <p className="text-[11px] text-slate-500 line-clamp-1 max-w-[200px]" title={gap.topicTitle}>
                            {gap.topicTitle}
                          </p>
                        </div>
                      </td>

                      {/* Misconception */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="flex items-start space-x-2 text-[11px] text-slate-600 leading-snug">
                          {isResolved ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          )}
                          <span>{gap.misconceptions[0]}</span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 text-center">
                        {isResolved ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Resolved</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            <Clock className="w-3 h-3" />
                            <span>Pending</span>
                          </span>
                        )}
                      </td>

                      {/* Last Reviewed Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-1 text-xs font-bold text-slate-800">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{gap.lastReviewedDate}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 block">
                            {gap.lastReviewedTime}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onSelectTopic(gap.topic, 8)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition cursor-pointer"
                            title="Open Interactive Visualizer / Bridge"
                          >
                            <span>Study</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>

                          <button
                            onClick={() => handleToggleGapStatus(gap)}
                            className={`px-2 py-1.5 rounded-lg border text-[11px] font-bold transition cursor-pointer ${
                              isResolved
                                ? 'border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700'
                                : 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                            }`}
                            title={isResolved ? 'Mark as Pending for further practice' : 'Mark as Resolved'}
                          >
                            {isResolved ? 'Mark Pending' : 'Mark Resolved'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
