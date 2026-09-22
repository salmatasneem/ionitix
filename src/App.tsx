import React, { useState, useEffect } from 'react';
import { CURRICULUM_TOPICS, TopicDef } from './data/curriculum';
import {
  UserRole,
  PerformanceComparison,
  ConceptNode,
  BridgePath,
  TopicReminder,
  NotificationPreferences,
  UserProfile,
  FacultyProfile,
} from './types';
import { CURRENT_STUDENT, CURRENT_FACULTY } from './data/mockStudentDatabase';
import { ThemeProvider } from './context/ThemeContext';
import { LandingPage } from './components/LandingPage';
import { StudentAuthModal } from './components/StudentAuthModal';
import { FacultyAuthModal } from './components/FacultyAuthModal';
import { StudentPortalDashboard } from './components/StudentPortalDashboard';
import { FacultyPortalView } from './components/FacultyPortalView';
import { Navbar } from './components/Navbar';
import { FlowchartModal } from './components/FlowchartModal';
import { GitHubExportModal } from './components/GitHubExportModal';
import { StudentLoginView } from './components/StudentLoginView';
import { SubjectSelector } from './components/SubjectSelector';
import { DiagnosticQuiz } from './components/DiagnosticQuiz';
import { ConceptMapVisualizer } from './components/ConceptMapVisualizer';
import { BridgePathView } from './components/BridgePathView';
import { PostBridgeQuiz } from './components/PostBridgeQuiz';
import { PerformanceComparisonView } from './components/PerformanceComparisonView';
import { StudentMasteryDashboard } from './components/StudentMasteryDashboard';
import { HandwrittenSheetEvaluator } from './components/HandwrittenSheetEvaluator';
import { ReminderNotificationCenter } from './components/ReminderNotificationCenter';
import { DueReminderToast } from './components/DueReminderToast';
import { ArrowLeft, Brain, Layers } from 'lucide-react';
import {
  getStoredReminders,
  getStoredPreferences,
  saveStoredPreferences,
  checkDueReminders,
  scheduleTopicReminder,
  snoozeReminder,
  dismissReminder,
  triggerSystemNotification,
} from './utils/reminderStorage';

type AppViewMode = 'landing' | 'student_portal' | 'faculty_portal' | 'simulator_flow';

function AppContent() {
  // Navigation & Authentication state
  const [viewMode, setViewMode] = useState<AppViewMode>('landing');
  const [showStudentAuth, setShowStudentAuth] = useState<boolean>(false);
  const [showFacultyAuth, setShowFacultyAuth] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_STUDENT);
  const [currentFaculty, setCurrentFaculty] = useState<FacultyProfile>(CURRENT_FACULTY);

  // 12-Step Simulator state
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [activeStep, setActiveStep] = useState<number>(8);
  const [selectedTopic, setSelectedTopic] = useState<TopicDef>(CURRICULUM_TOPICS[0]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isMasteryView, setIsMasteryView] = useState<boolean>(false);
  const [isAnswerSheetView, setIsAnswerSheetView] = useState<boolean>(false);

  // Spaced Repetition 24h-48h Reminder System State (synced with localStorage)
  const [reminders, setReminders] = useState<TopicReminder[]>(() => getStoredReminders());
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>(() =>
    getStoredPreferences()
  );
  const [showRemindersCenter, setShowRemindersCenter] = useState<boolean>(false);
  const [dismissedToastIds, setDismissedToastIds] = useState<string[]>([]);

  // Modals
  const [showFlowchartModal, setShowFlowchartModal] = useState<boolean>(false);
  const [showGitHubModal, setShowGitHubModal] = useState<boolean>(false);

  // Store concept nodes across all topics
  const [allTopicConceptNodes, setAllTopicConceptNodes] = useState<
    Record<string, ConceptNode[]>
  >(() => {
    const initial: Record<string, ConceptNode[]> = {};
    CURRICULUM_TOPICS.forEach((topic) => {
      initial[topic.id] = topic.conceptNodes.map((n) => ({ ...n }));
    });
    return initial;
  });

  // Step 4, 5, 6, 7 state: Concept nodes & Gap detection results
  const [conceptNodes, setConceptNodes] = useState<ConceptNode[]>(selectedTopic.conceptNodes);
  const [rootGapId, setRootGapId] = useState<string>('c_composite_decomp');
  const [gapExplanation, setGapExplanation] = useState<string>(
    'Student responses reveal procedural accuracy in derivative rules, but a failure to deconstruct the inner sub-expression from the outer operator. This points to a prerequisite gap in composite functions.'
  );
  const [misconceptions, setMisconceptions] = useState<string[]>([
    'Confusing composite function evaluation with scalar product',
    'Differentiating inner and outer expressions simultaneously',
  ]);
  const [dependencyPath, setDependencyPath] = useState<string[]>([
    'Algebra: Functions',
    'Composite Function Decomposition',
    'Instantaneous Slope Limits',
    selectedTopic.title,
  ]);

  // Step 8 & 9 state: Bridge path
  const [currentBridge, setCurrentBridge] = useState<BridgePath>(selectedTopic.defaultBridge);

  // Step 11 & 12 state: Performance Comparison
  const [diagnosticScore, setDiagnosticScore] = useState<number>(33);
  const [performanceComparison, setPerformanceComparison] = useState<PerformanceComparison>({
    initialDiagnosticScore: 33,
    postBridgeScore: 100,
    improvementDelta: 67,
    gapResolved: true,
    strengthsObserved: [
      'Isolated the inner sub-expression before differentiating',
      'Correctly multiplied outer derivative by inner rate',
      'Accurate evaluation of nested rates with zero arithmetic errors',
    ],
    remainingWeaknesses: [],
    nextRecommendation:
      'The prerequisite gap has been fully resolved. Mastery demonstrated across diagnostic, live visual interactive drills, and post-bridge assessment.',
  });

  // Handle topic switch
  const handleSelectTopic = (topic: TopicDef) => {
    setAllTopicConceptNodes((prev) => ({
      ...prev,
      [selectedTopic.id]: conceptNodes,
    }));

    setSelectedTopic(topic);
    const existingNodes = allTopicConceptNodes[topic.id] || topic.conceptNodes;
    setConceptNodes(existingNodes);
    setCurrentBridge(topic.defaultBridge);
    const rootNode = existingNodes.find((n) => n.status === 'root_gap');
    if (rootNode) {
      setRootGapId(rootNode.id);
      setMisconceptions(rootNode.misconceptions || []);
    } else {
      setRootGapId('');
      setMisconceptions([]);
    }
  };

  const handleUpdateConceptStatus = (
    topicId: string,
    conceptId: string,
    newStatus: ConceptNode['status']
  ) => {
    setAllTopicConceptNodes((prev) => {
      const currentList = prev[topicId] || [];
      const updated = currentList.map((n) =>
        n.id === conceptId ? { ...n, status: newStatus } : n
      );
      return { ...prev, [topicId]: updated };
    });

    if (topicId === selectedTopic.id) {
      setConceptNodes((prev) =>
        prev.map((n) => (n.id === conceptId ? { ...n, status: newStatus } : n))
      );
    }
  };

  // Check due reminders on interval and browser notifications
  useEffect(() => {
    const { reminders: updated, newlyDue } = checkDueReminders();
    setReminders(updated);
    if (newlyDue.length > 0 && notificationPrefs.browserNotifications) {
      newlyDue.forEach(triggerSystemNotification);
    }

    const intervalId = setInterval(() => {
      const res = checkDueReminders();
      setReminders(res.reminders);
      if (res.newlyDue.length > 0 && notificationPrefs.browserNotifications) {
        res.newlyDue.forEach(triggerSystemNotification);
      }
    }, 15000);

    return () => clearInterval(intervalId);
  }, [notificationPrefs.browserNotifications]);

  const handleRevisitTopicFromReminder = (topicId: string) => {
    const target = CURRICULUM_TOPICS.find((t) => t.id === topicId);
    if (target) {
      handleSelectTopic(target);
    }
    setShowRemindersCenter(false);
    setIsMasteryView(false);
    setIsAnswerSheetView(false);
    setActiveStep(8);
    setViewMode('simulator_flow');
  };

  const handleRefreshReminders = () => {
    const res = checkDueReminders();
    setReminders([...res.reminders]);
  };

  const handleUpdateNotificationPreferences = (newPrefs: NotificationPreferences) => {
    saveStoredPreferences(newPrefs);
    setNotificationPrefs(newPrefs);
  };

  // Step 3 -> 4, 5, 6, 7: Submit Diagnostic answers
  const handleSubmitDiagnostic = async (
    answers: Record<string, { answer: string; reasoning: string }>
  ) => {
    setIsAnalyzing(true);
    setActiveStep(4);

    try {
      const response = await fetch('/api/analyze-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicTitle: selectedTopic.title,
          topicSubject: selectedTopic.subject,
          questionsAndAnswers: answers,
        }),
      });

      const data = await response.json();

      if (data.gapFound) {
        setGapExplanation(data.explanationOfGap || gapExplanation);
        setMisconceptions(data.misconceptionsDetected || misconceptions);
        if (data.learningDependencyPath) {
          setDependencyPath(data.learningDependencyPath);
        }

        if (notificationPrefs.autoScheduleOnGap) {
          scheduleTopicReminder({
            topicId: selectedTopic.id,
            topicTitle: selectedTopic.title,
            subject: selectedTopic.subject,
            weakConcepts:
              data.misconceptionsDetected?.length > 0
                ? data.misconceptionsDetected
                : [rootGapId],
            reasonSummary:
              data.explanationOfGap ||
              'Prerequisite learning gap identified during diagnostic assessment.',
            intervalHours: notificationPrefs.defaultIntervalHours,
          });
          const refreshed = checkDueReminders();
          setReminders(refreshed.reminders);
        }
      }

      setDiagnosticScore(33);
      setActiveStep(5);
    } catch (err) {
      setActiveStep(5);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Step 7 -> 8: Generate Bridge Path & launch Recovery Activity
  const handleProceedToBridge = async () => {
    setActiveStep(8);

    try {
      const res = await fetch('/api/generate-bridge-explanation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rootGapConcept: selectedTopic.defaultBridge.rootGapConcept,
          targetTopic: selectedTopic.title,
          studentMisconceptions: misconceptions,
        }),
      });
      const data = await res.json();
      if (data.simpleExplanation) {
        setCurrentBridge((prev) => ({
          ...prev,
          simpleExplanation: data.simpleExplanation,
          coreIntuition: data.coreIntuition || prev.coreIntuition,
        }));
      }
    } catch (e) {
      // Keep default bridge
    }

    setActiveStep(9);
  };

  const handleProceedToPostBridge = () => {
    setActiveStep(10);
  };

  const handleSubmitPostBridge = (score: number) => {
    const delta = Math.max(0, score - diagnosticScore);
    const resolved = score >= 75;

    setPerformanceComparison({
      initialDiagnosticScore: diagnosticScore,
      postBridgeScore: score,
      improvementDelta: delta,
      gapResolved: resolved,
      strengthsObserved: [
        'Isolated the inner sub-expression before differentiating',
        'Demonstrated strong intuitive understanding of rates and physical wave propagation',
        'Successfully applied composite chain rules on new unseen problems',
      ],
      remainingWeaknesses: resolved ? [] : ['Minor hesitation on secondary edge-case boundaries'],
      nextRecommendation: resolved
        ? 'Prerequisite learning gap is fully healed. Concept map updated to Mastered.'
        : 'Recommended: Re-examine the live animated simulation with alternative parameter values.',
    });

    if (resolved) {
      setConceptNodes((prev) =>
        prev.map((n) => (n.status === 'root_gap' ? { ...n, status: 'resolved' } : n))
      );
      setAllTopicConceptNodes((prev) => ({
        ...prev,
        [selectedTopic.id]: (prev[selectedTopic.id] || selectedTopic.conceptNodes).map((n) =>
          n.status === 'root_gap' ? { ...n, status: 'resolved' } : n
        ),
      }));
    }

    setActiveStep(11);
  };

  const handleResetDemo = () => {
    setActiveStep(1);
    setCurrentRole('student');
    setIsMasteryView(false);
    setConceptNodes(selectedTopic.conceptNodes);
    setCurrentBridge(selectedTopic.defaultBridge);
  };

  // VIEW 1: LANDING PAGE
  if (viewMode === 'landing') {
    return (
      <>
        <LandingPage
          onOpenStudentLogin={() => setShowStudentAuth(true)}
          onOpenFacultyLogin={() => setShowFacultyAuth(true)}
          onQuickExploreDemo={() => {
            setCurrentUser(CURRENT_STUDENT);
            setViewMode('student_portal');
          }}
        />

        <StudentAuthModal
          isOpen={showStudentAuth}
          onClose={() => setShowStudentAuth(false)}
          onLoginSuccess={(student: UserProfile) => {
            setCurrentUser(student);
            setShowStudentAuth(false);
            setViewMode('student_portal');
          }}
          onSwitchToFaculty={() => {
            setShowStudentAuth(false);
            setShowFacultyAuth(true);
          }}
        />

        <FacultyAuthModal
          isOpen={showFacultyAuth}
          onClose={() => setShowFacultyAuth(false)}
          onLoginSuccess={() => {
            setCurrentFaculty(CURRENT_FACULTY);
            setShowFacultyAuth(false);
            setViewMode('faculty_portal');
          }}
          onSwitchToStudent={() => {
            setShowFacultyAuth(false);
            setShowStudentAuth(true);
          }}
        />
      </>
    );
  }

  // VIEW 2: STUDENT PORTAL (Full Features: Overview, IQ, Mock Tests, OCR, Risk, Skill Radar, AI Plan)
  if (viewMode === 'student_portal') {
    return (
      <StudentPortalDashboard
        user={currentUser}
        onLogout={() => setViewMode('landing')}
        onNavigateToSimulatorFlow={() => setViewMode('simulator_flow')}
      />
    );
  }

  // VIEW 3: FACULTY PORTAL (Class Performance, Risk Prediction, Filters, Roster, CSV Export)
  if (viewMode === 'faculty_portal') {
    return (
      <FacultyPortalView
        onLogout={() => setViewMode('landing')}
        onSelectStudentDetail={(id) => {
          // Can inspect student
        }}
      />
    );
  }

  // VIEW 4: CONCEPT GAP SIMULATOR (12-step visual bridge)
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-indigo-500 selection:text-white transition-colors">
      {/* Top Banner with Return to Student Portal */}
      <div className="bg-indigo-600 text-white px-4 py-2 text-xs flex items-center justify-between font-bold">
        <button
          onClick={() => setViewMode('student_portal')}
          className="flex items-center space-x-1.5 hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Student Dashboard</span>
        </button>
        <span className="opacity-90 hidden sm:inline">
          12-Step Adaptive Learning Gap &amp; Visual Simulator Engine
        </span>
      </div>

      {/* Top App Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={(role) => {
          setCurrentRole(role);
          setIsMasteryView(false);
          if (role === 'faculty') {
            setActiveStep(12);
          } else if (activeStep === 12) {
            setActiveStep(2);
          }
        }}
        activeStep={activeStep}
        onOpenFlowchart={() => setShowFlowchartModal(true)}
        onOpenGitHubModal={() => setShowGitHubModal(true)}
        onResetDemo={handleResetDemo}
        onOpenMasteryDashboard={() => {
          setIsMasteryView((prev) => !prev);
          setIsAnswerSheetView(false);
        }}
        isMasteryView={isMasteryView}
        onOpenAnswerSheetEvaluator={() => {
          setIsAnswerSheetView((prev) => !prev);
          setIsMasteryView(false);
        }}
        isAnswerSheetView={isAnswerSheetView}
        onOpenRemindersCenter={() => setShowRemindersCenter(true)}
        dueRemindersCount={reminders.filter((r) => r.status === 'due').length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Content Views based on Step */}
        {isAnswerSheetView ? (
          <HandwrittenSheetEvaluator
            onBack={() => setIsAnswerSheetView(false)}
            onNavigateToSimulator={(targetConceptOrTopic) => {
              const matchedTopic = CURRICULUM_TOPICS.find(
                (t) =>
                  t.id === targetConceptOrTopic ||
                  t.title.toLowerCase().includes(targetConceptOrTopic.toLowerCase()) ||
                  t.conceptNodes.some((c) => c.id === targetConceptOrTopic)
              );
              if (matchedTopic) {
                handleSelectTopic(matchedTopic);
              }
              setIsAnswerSheetView(false);
              setIsMasteryView(false);
              setActiveStep(8);
            }}
          />
        ) : isMasteryView ? (
          <StudentMasteryDashboard
            currentTopic={selectedTopic}
            conceptNodes={conceptNodes}
            allTopicConceptNodes={allTopicConceptNodes}
            onSelectTopic={(topic, step) => {
              handleSelectTopic(topic);
              if (step) {
                setActiveStep(step);
              }
              setIsMasteryView(false);
            }}
            onBackToFlow={() => setIsMasteryView(false)}
            activeStep={activeStep}
            onUpdateConceptStatus={handleUpdateConceptStatus}
          />
        ) : (
          <>
            {/* Step 1: Student Login / Role */}
            {activeStep === 1 && (
              <StudentLoginView
                initialRole={currentRole}
                onContinue={(role) => {
                  setCurrentRole(role);
                  if (role === 'faculty') {
                    setActiveStep(12);
                  } else {
                    setActiveStep(2);
                  }
                }}
              />
            )}

            {/* Step 2: Select Subject & Topic */}
            {activeStep === 2 && (
              <SubjectSelector
                selectedTopicId={selectedTopic.id}
                onSelectTopic={handleSelectTopic}
                onStartDiagnostic={() => setActiveStep(3)}
              />
            )}

            {/* Step 3 & 4: Diagnostic Assessment */}
            {(activeStep === 3 || activeStep === 4) && (
              <DiagnosticQuiz
                topic={selectedTopic}
                onSubmitAnswers={handleSubmitDiagnostic}
                isAnalyzing={isAnalyzing || activeStep === 4}
                onOpenAnswerSheetScanner={() => {
                  setIsAnswerSheetView(true);
                  setIsMasteryView(false);
                }}
              />
            )}

            {/* Steps 5, 6, 7: Concept Map & Root Gap Detector */}
            {(activeStep === 5 || activeStep === 6 || activeStep === 7) && (
              <ConceptMapVisualizer
                nodes={conceptNodes}
                dependencies={selectedTopic.conceptDependencies}
                rootConceptId={rootGapId}
                gapExplanation={gapExplanation}
                misconceptions={misconceptions}
                dependencyPath={dependencyPath}
                onProceedToBridge={handleProceedToBridge}
              />
            )}

            {/* Steps 8 & 9: Bridge Path & Live AI Visualization Activity */}
            {(activeStep === 8 || activeStep === 9) && (
              <BridgePathView
                bridge={currentBridge}
                topicId={selectedTopic.id}
                onProceedToPostBridge={handleProceedToPostBridge}
              />
            )}

            {/* Step 10: Post-Bridge Assessment */}
            {activeStep === 10 && (
              <PostBridgeQuiz
                topic={selectedTopic}
                onSubmitPostBridge={handleSubmitPostBridge}
              />
            )}

            {/* Steps 11 & 12: Compare Performance & Gap Resolved */}
            {(activeStep === 11 || activeStep === 12) && (
              <PerformanceComparisonView
                comparison={performanceComparison}
                topicTitle={selectedTopic.title}
                rootGapConcept={currentBridge.rootGapConcept}
                onGoToFacultyDashboard={() => setViewMode('faculty_portal')}
                onGenerateNextBridge={() => {
                  setActiveStep(9);
                }}
                onSelectAnotherTopic={() => {
                  setActiveStep(2);
                }}
                onViewMasteryDashboard={() => {
                  setIsMasteryView(true);
                }}
              />
            )}
          </>
        )}
      </main>

      {/* 12-Step Architecture Flowchart Modal */}
      <FlowchartModal
        isOpen={showFlowchartModal}
        onClose={() => setShowFlowchartModal(false)}
        activeStep={activeStep}
        onJumpToStep={(st) => {
          setActiveStep(st);
          setShowFlowchartModal(false);
        }}
      />

      {/* GitHub Repository Push Guide Modal */}
      <GitHubExportModal
        isOpen={showGitHubModal}
        onClose={() => setShowGitHubModal(false)}
      />

      {/* Spaced Repetition 24-48h Reminder Notification Center Modal */}
      <ReminderNotificationCenter
        isOpen={showRemindersCenter}
        onClose={() => setShowRemindersCenter(false)}
        reminders={reminders}
        preferences={notificationPrefs}
        onRefreshReminders={handleRefreshReminders}
        onNavigateToTopic={handleRevisitTopicFromReminder}
        onUpdatePreferences={handleUpdateNotificationPreferences}
      />

      {/* Floating In-App Toast for Due Topics */}
      {notificationPrefs.inAppAlerts && (
        <DueReminderToast
          dueReminders={reminders.filter(
            (r) => r.status === 'due' && !dismissedToastIds.includes(r.id)
          )}
          preferences={notificationPrefs}
          onRevisitTopic={handleRevisitTopicFromReminder}
          onSnooze={(id, hours) => {
            snoozeReminder(id, hours);
            handleRefreshReminders();
          }}
          onDismiss={(id) => {
            dismissReminder(id);
            setDismissedToastIds((prev) => [...prev, id]);
            handleRefreshReminders();
          }}
          onOpenCenter={() => setShowRemindersCenter(true)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
