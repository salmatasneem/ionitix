export type UserRole = 'student' | 'faculty';

export interface UserProfile {
  id: string;
  usn: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  semester: number;
  section: string;
  cgpa: number;
  attendanceRate: number;
  avatarUrl?: string;
  phone?: string;
}

export interface ConceptNode {
  id: string;
  title: string;
  description: string;
  status: 'mastered' | 'target' | 'at_risk' | 'root_gap' | 'resolved';
  level: number; // 0 = foundational prerequisite, 1 = intermediate, 2 = target topic
  prerequisites: string[]; // ids
  misconceptions?: string[];
  masteryScore?: number;
}

export interface ConceptDependency {
  from: string;
  to: string;
  relationship: 'required_for' | 'builds_on' | 'corequisite';
}

export interface DiagnosticQuestion {
  id: string;
  topicId: string;
  conceptTarget: string; // concept ID it tests
  type: 'mcq' | 'short_answer';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  prerequisiteTested: string;
  studentAnswer?: string;
  studentReasoning?: string;
}

export interface AnswerAnalysisResult {
  questionId: string;
  isCorrect: boolean;
  score: number; // 0 to 100
  detectedMisconceptions: string[];
  reasoningCritique: string;
  underlyingGapConceptId: string;
  confidence: number;
}

export interface RootGapResult {
  gapFound: boolean;
  rootConceptId: string;
  rootConceptTitle: string;
  explanationOfGap: string;
  learningDependencyPath: string[]; // e.g. ['Algebra: Slopes', 'Limits', 'Difference Quotients', 'Derivatives']
  severity: 'low' | 'moderate' | 'critical';
  conceptNodes: ConceptNode[];
  conceptDependencies: ConceptDependency[];
}

export interface VisualizationStep {
  stepNumber: number;
  timeOffset: number;
  label: string;
  description: string;
  highlightElements: string[];
  parameterValues: Record<string, number>;
}

export interface LiveVisualizationConfig {
  id: string;
  title: string;
  type: 'canvas_function' | 'canvas_physics' | 'tree_graph' | 'state_machine' | 'flow_simulation';
  concept: string;
  summary: string;
  initialParams: Record<string, { label: string; min: number; max: number; step: number; value: number; unit?: string }>;
  steps: VisualizationStep[];
  interactivePrompt: string;
}

export interface PracticeQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  hint: string;
  solutionExplanation: string;
  isChallenge?: boolean;
}

export interface BridgePath {
  id: string;
  targetTopic: string;
  rootGapConcept: string;
  simpleExplanation: string;
  coreIntuition: string;
  workedExample: {
    problemStatement: string;
    steps: { step: number; title: string; explanation: string; mathSnippet?: string }[];
    keyTakeaway: string;
  };
  visualization: LiveVisualizationConfig;
  practiceQuestions: PracticeQuestion[];
  challengeQuestion: PracticeQuestion;
}

export interface PostBridgeAttempt {
  questionId: string;
  studentAnswer: string;
  isCorrect: boolean;
  score: number;
}

export interface PerformanceComparison {
  initialDiagnosticScore: number;
  postBridgeScore: number;
  improvementDelta: number;
  gapResolved: boolean;
  strengthsObserved: string[];
  remainingWeaknesses: string[];
  nextRecommendation: string;
}

export interface FacultyTopicInsight {
  topicId: string;
  topicTitle: string;
  subject: string;
  studentsAssessed: number;
  averageDiagnosticScore: number;
  averagePostBridgeScore: number;
  commonRootGaps: { conceptName: string; count: number; percentage: number }[];
  bottleneckSeverity: 'high' | 'medium' | 'low';
  actionableIntervention: string;
}

export interface StudentLearningRecord {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  topic: string;
  diagnosticScore: number;
  postBridgeScore?: number;
  rootGapFound: boolean;
  rootGapConcept?: string;
  gapResolved: boolean;
  attemptDate: string;
  activeStep: number;
}

// Handwritten Answer Sheet OCR & NLP Evaluation Types
export interface StudentSheetMetadata {
  name: string;
  rollNumber: string; // USN or Roll number
  subject: string;
  examCode?: string;
  date?: string;
  questionNumbersDetected: string[];
}

export interface EvaluatedQuestion {
  questionNumber: string;
  questionText: string;
  extractedHandwrittenText: string;
  expectedAnswer: string;
  keyPointsExpected: string[];
  keyPointsFound: string[];
  missingPoints: string[];
  incorrectConcepts: string[];
  marksAwarded: number;
  maxMarks: number;
  status: 'good' | 'improve' | 'needs_work';
  nlpMetrics: {
    relevance: number; // 0 - 100
    keywordCoverage: number; // 0 - 100
    conceptAccuracy: number; // 0 - 100
    completeness: number; // 0 - 100
    clarityAndGrammar: number; // 0 - 100
  };
  feedbackSummary: string;
  improvementTip: string;
  conceptToReview?: string;
  visualConceptKey?: string;
}

export interface RecoveryPlanItem {
  topic: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  actionAdvice: string;
  targetConceptId?: string;
}

export interface AnswerSheetEvaluationReport {
  id: string;
  timestamp: string;
  student: StudentSheetMetadata;
  ocrConfidence: number; // 0 - 100
  evaluationConfidence: number; // 0 - 100
  totalScore: number;
  maxScore: number;
  percentage: number;
  grade: string;
  predictedFinalScoreRange: string;
  predictedPercentile: number;
  overallStrengths: string[];
  overallWeaknesses: string[];
  executiveSummary: string;
  questions: EvaluatedQuestion[];
  recoveryPlan: {
    immediateAction: string;
    items: RecoveryPlanItem[];
    suggestedSimulators: string[];
  };
  language: string;
  scannedImagePreviewUrl?: string;
  isCustomUpload?: boolean;
}

export interface TopicReminder {
  id: string;
  topicId: string;
  topicTitle: string;
  subject: string;
  weakConcepts: string[];
  reasonSummary: string;
  identifiedAt: string;
  scheduledFor: string;
  intervalHours: number;
  status: 'pending' | 'due' | 'dismissed' | 'completed';
  lastNotifiedAt?: string;
  completedAt?: string;
  repetitionCycle: number;
  targetSimulatorId?: string;
}

export interface NotificationPreferences {
  inAppAlerts: boolean;
  soundEnabled: boolean;
  browserNotifications: boolean;
  defaultIntervalHours: 24 | 48;
  autoScheduleOnGap: boolean;
}

// -------------------------------------------------------------
// ADAPTIVE AI IQ ASSESSMENT TYPES
// -------------------------------------------------------------
export type IQDomain =
  | 'logical_reasoning'
  | 'pattern_recognition'
  | 'verbal_aptitude'
  | 'analytical_thinking'
  | 'problem_solving';

export interface IQQuestion {
  id: string;
  domain: IQDomain;
  difficulty: 1 | 2 | 3 | 4 | 5; // 1 = Easy, 5 = Genius
  question: string;
  patternType?: 'number_series' | 'visual_matrix' | 'syllogism' | 'analogies' | 'spatial_rotation' | 'deductive';
  patternSvg?: string; // Optional embedded SVG illustration
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  points: number;
  averageTimeSeconds: number;
}

export interface IQAssessmentState {
  currentQuestionIndex: number;
  currentDifficulty: 1 | 2 | 3 | 4 | 5;
  answers: { questionId: string; selectedIndex: number; timeTaken: number; isCorrect: boolean }[];
  domainScores: Record<IQDomain, { correct: number; total: number; points: number }>;
  isCompleted: boolean;
  elapsedSeconds: number;
}

export interface IQAssessmentReport {
  id: string;
  date: string;
  overallIQ: number; // e.g., 128
  percentile: number; // e.g., 96.8%
  classification: 'Extremely High (Genius)' | 'Very Superior' | 'Superior' | 'High Average' | 'Average' | 'Low Average';
  domainBreakdown: {
    domain: IQDomain;
    domainName: string;
    score: number; // 0 - 100
    accuracy: number; // 0 - 100
    levelReached: string;
    speedRating: 'Exceptional' | 'Fast' | 'Optimal' | 'Deliberate';
  }[];
  strengthAreas: string[];
  weakAreas: string[];
  improvementSuggestions: string[];
  recommendedPracticePlan: {
    dailyDrill: string;
    focusExercise: string;
    recommendedCurriculumLink: string;
    estimatedDaysToLevelUp: number;
  };
}

// -------------------------------------------------------------
// WEEKLY AI MOCK TESTS TYPES
// -------------------------------------------------------------
export interface MockTestQuestion {
  id: string;
  subject: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  marks: number;
  conceptTag: string;
}

export interface WeeklyMockTest {
  id: string;
  weekNumber: number;
  title: string;
  subject: string;
  durationMinutes: number;
  totalMarks: number;
  totalQuestions: number;
  status: 'upcoming' | 'active' | 'completed';
  scheduledDate: string;
  deadlineDate: string;
  questions: MockTestQuestion[];
  instructions: string[];
}

export interface MockTestResult {
  id: string;
  testId: string;
  testTitle: string;
  subject: string;
  score: number;
  maxScore: number;
  percentage: number;
  accuracy: number;
  timeSpentMinutes: number;
  submittedAt: string;
  questionResults: {
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
    timeSpentSeconds: number;
    explanation: string;
  }[];
  aiFeedback: {
    summary: string;
    criticalGapsDetected: string[];
    suggestedTopics: string[];
    speedVsAccuracyInsight: string;
  };
  weeklyTrend: {
    week: string;
    score: number;
    cohortAvg: number;
  }[];
}

// -------------------------------------------------------------
// PREVIOUS YEAR MARKS & ACADEMIC RISK PREDICTION TYPES
// -------------------------------------------------------------
export interface SubjectGradeRecord {
  code: string;
  name: string;
  credits: number;
  internalMarks: number; // Out of 50
  externalMarks: number; // Out of 50
  totalMarks: number; // Out of 100
  grade: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'P' | 'F';
  gradePoints: number;
  attendancePercentage: number;
  status: 'cleared' | 'backlog' | 'in_progress';
}

export interface SemesterRecord {
  semesterNumber: number;
  semesterName: string;
  academicYear: string;
  sgpa: number;
  totalCredits: number;
  subjects: SubjectGradeRecord[];
  overallAttendance: number;
}

export interface AcademicRiskProfile {
  riskLevel: 'safe' | 'moderate' | 'high_risk';
  riskScore: number; // 0 - 100 (higher = riskier)
  predictedSemesterGPA: number;
  confidenceInterval: string; // e.g. "8.2 - 8.6"
  keyRiskFactors: string[];
  weakSubjects: string[];
  attendanceWarning: boolean;
  earlyWarningAlerts: string[];
  mitigationRecommendations: string[];
  historicalTrend: { semester: string; sgpa: number; attendance: number }[];
}

// -------------------------------------------------------------
// PROBLEM-SOLVING SKILL ANALYTICS TYPES
// -------------------------------------------------------------
export interface ProblemSolvingSkillProfile {
  studentId: string;
  overallIndex: number; // 0 - 100
  dimensions: {
    criticalThinking: number; // 0 - 100
    logicalReasoning: number;
    problemSolvingSpeed: number;
    accuracy: number;
    consistency: number;
  };
  cohortAverages: {
    criticalThinking: number;
    logicalReasoning: number;
    problemSolvingSpeed: number;
    accuracy: number;
    consistency: number;
  };
  percentileRank: number;
  growthDeltaLastMonth: number;
  speedAnalysis: {
    averageSecondsPerProblem: number;
    idealWindowSeconds: string;
    speedVsAccuracyTradeoff: 'optimal' | 'rushing' | 'hesitant';
  };
  keyBadges: { title: string; icon: string; description: string }[];
}

// -------------------------------------------------------------
// PERSONALIZED AI RECOMMENDATIONS TYPES
// -------------------------------------------------------------
export interface RevisionTopicRecommendation {
  id: string;
  topicName: string;
  subject: string;
  urgency: 'high' | 'medium' | 'low';
  reason: string;
  estimatedMinutes: number;
  targetSimulatorId?: string;
  relatedMockTestId?: string;
}

export interface DailyStudyGoal {
  id: string;
  title: string;
  subject: string;
  targetMinutes: number;
  isCompleted: boolean;
  xpReward: number;
}

export interface WeeklyStudyScheduleSlot {
  id: string;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  time: string;
  subject: string;
  module: string;
  type: 'concept_drill' | 'mock_test' | 'problem_solving' | 'recovery_bridge';
}

export interface LearningResource {
  id: string;
  title: string;
  type: 'interactive_simulator' | 'video_lecture' | 'cheatsheet' | 'practice_set';
  subject: string;
  duration: string;
  provider: string;
  badgeText: string;
  url?: string;
}

export interface PersonalizedRecommendations {
  studentId: string;
  generatedAt: string;
  executiveAdvice: string;
  revisionTopics: RevisionTopicRecommendation[];
  dailyGoals: DailyStudyGoal[];
  weeklySchedule: WeeklyStudyScheduleSlot[];
  recommendedMockTests: { id: string; title: string; subject: string; difficulty: string; reason: string }[];
  learningResources: LearningResource[];
}

// -------------------------------------------------------------
// FACULTY PORTAL TYPES
// -------------------------------------------------------------
export interface FacultyProfile {
  id: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  avatarUrl?: string;
}

export interface FacultyClassStudentItem {
  id: string;
  usn: string;
  name: string;
  department: string;
  semester: number;
  section: string;
  cgpa: number;
  currentAttendance: number;
  riskLevel: 'safe' | 'moderate' | 'high_risk';
  recentEvaluationScore?: number;
  lastActive: string;
  weakestSubject: string;
  iqScore?: number;
}
