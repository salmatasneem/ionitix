import { AnswerSheetEvaluationReport } from '../types';

export interface SampleAnswerSheetPreset {
  id: string;
  title: string;
  subject: string;
  topicTitle: string;
  studentName: string;
  rollNumber: string;
  examCode: string;
  date: string;
  description: string;
  paperType: 'ruled' | 'grid' | 'plain';
  paperPreviewSvg: string;
  rawHandwrittenText: string;
  expectedMarkingScheme: {
    questionNumber: string;
    questionText: string;
    maxMarks: number;
    expectedAnswer: string;
    requiredKeywords: string[];
    conceptTested: string;
  }[];
  evaluationReport: AnswerSheetEvaluationReport;
}

export const SAMPLE_ANSWER_SHEETS: SampleAnswerSheetPreset[] = [
  {
    id: 'sample-calculus-chain-rule',
    title: 'Calculus: Chain Rule & Function Decomposition',
    subject: 'Mathematics',
    topicTitle: 'Calculus: Chain Rule & Composite Functions',
    studentName: 'Aarav Sharma',
    rollNumber: '1MS22CS042',
    examCode: 'MATH-2024-MID2',
    date: '14-Oct-2024',
    description: 'Midterm test response with composite differentiation steps and partial inner derivative omission.',
    paperType: 'ruled',
    paperPreviewSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1050" width="800" height="1050" style="background:%23faf9f5; font-family:'Caveat', 'Comic Sans MS', cursive, sans-serif;">
      <!-- Ruled lines -->
      <defs>
        <pattern id="ruledLines" width="100" height="32" patternUnits="userSpaceOnUse">
          <line x1="0" y1="31" x2="100" y2="31" stroke="%23cbe1f7" stroke-width="1.2"/>
        </pattern>
      </defs>
      <rect width="800" height="1050" fill="%23fdfcf7"/>
      <rect x="0" y="110" width="800" height="940" fill="url(%23ruledLines)"/>
      <!-- Margin lines -->
      <line x1="110" y1="0" x2="110" y2="1050" stroke="%23fca5a5" stroke-width="1.8"/>
      <line x1="114" y1="0" x2="114" y2="1050" stroke="%23fca5a5" stroke-width="1"/>

      <!-- Header Information -->
      <rect x="130" y="25" width="630" height="70" rx="8" fill="%23f1f5f9" stroke="%23cbd5e1" stroke-width="1"/>
      <text x="145" y="48" font-size="14" font-weight="bold" fill="%231e293b" font-family="sans-serif">M.S. INSTITUTE OF TECHNOLOGY - INTERNAL ASSESSMENT II</text>
      <text x="145" y="70" font-size="12" fill="%23475569" font-family="sans-serif">Name: Aarav Sharma | USN: 1MS22CS042 | Sub: Engineering Mathematics II (MATH-2024)</text>

      <!-- Handwritten Q1 -->
      <text x="50" y="138" font-size="17" font-weight="bold" fill="%230f172a">Q 1 (a)</text>
      <text x="130" y="138" font-size="16" fill="%231e3a8a" font-style="italic">Find dy/dx for y = sin(3x^2 + 5x). State the rule applied.</text>
      <text x="130" y="170" font-size="16" fill="%231e3a8a" font-style="italic">Ans: Let u = 3x^2 + 5x, so y = sin(u).</text>
      <text x="130" y="202" font-size="16" fill="%231e3a8a" font-style="italic">By Chain Rule: dy/dx = (dy/du) * (du/dx)</text>
      <text x="130" y="234" font-size="16" fill="%231e3a8a" font-style="italic">dy/du = cos(u) = cos(3x^2 + 5x)</text>
      <text x="130" y="266" font-size="16" fill="%231e3a8a" font-style="italic">du/dx = d/dx(3x^2 + 5x) = 6x + 5</text>
      <text x="130" y="298" font-size="17" font-weight="bold" fill="%231e3a8a" font-style="italic">Therefore, dy/dx = (6x + 5) * cos(3x^2 + 5x)  [Correct]</text>

      <!-- Handwritten Q2 with conceptual mistake -->
      <text x="50" y="362" font-size="17" font-weight="bold" fill="%230f172a">Q 2 (b)</text>
      <text x="130" y="362" font-size="16" fill="%231e3a8a" font-style="italic">Differentiate f(x) = e^(cos(2x)) with respect to x.</text>
      <text x="130" y="394" font-size="16" fill="%231e3a8a" font-style="italic">Ans: f'(x) = d/dx [ e^(cos 2x) ]</text>
      <text x="130" y="426" font-size="16" fill="%231e3a8a" font-style="italic">Outer derivative of e^z is e^z.</text>
      <text x="130" y="458" font-size="16" fill="%231e3a8a" font-style="italic">Derivative of cos(2x) is -sin(2x).</text>
      <text x="130" y="490" font-size="16" fill="%23b91c1c" font-style="italic">So f'(x) = -sin(2x) * e^(cos 2x)</text>
      <path d="M 130 500 Q 300 505 450 500" stroke="%23ef4444" stroke-width="2" fill="none" stroke-dasharray="4,4"/>
      <text x="470" y="490" font-size="13" fill="%23ef4444" font-family="sans-serif">Missing inner factor 2!</text>

      <!-- Handwritten Q3 -->
      <text x="50" y="554" font-size="17" font-weight="bold" fill="%230f172a">Q 3</text>
      <text x="130" y="554" font-size="16" fill="%231e3a8a" font-style="italic">Explain why (d/dx)[f(g(x))] != f'(x) * g'(x) with physical rate reasoning.</text>
      <text x="130" y="586" font-size="16" fill="%231e3a8a" font-style="italic">Ans: Because f is evaluated at g(x), not at x itself!</text>
      <text x="130" y="618" font-size="16" fill="%231e3a8a" font-style="italic">The outer function responds to rate of changes of the inner variable.</text>
      <text x="130" y="650" font-size="16" fill="%231e3a8a" font-style="italic">Multiplying f'(x) * g'(x) would evaluate slopes at different coordinate points.</text>
      
      <!-- Teacher Red Pen Annotation Badge -->
      <circle cx="710" cy="180" r="32" fill="none" stroke="%23dc2626" stroke-width="2.5"/>
      <text x="696" y="186" font-size="18" font-weight="bold" fill="%23dc2626" font-family="sans-serif">18/25</text>
      <text x="684" y="222" font-size="11" fill="%23dc2626" font-family="sans-serif">Check Q2!</text>
    </svg>`,
    rawHandwrittenText: `Q1(a) Find dy/dx for y = sin(3x^2 + 5x). State the rule applied.
Ans: Let u = 3x^2 + 5x, so y = sin(u).
By Chain Rule: dy/dx = (dy/du) * (du/dx)
dy/du = cos(u) = cos(3x^2 + 5x)
du/dx = d/dx(3x^2 + 5x) = 6x + 5
Therefore, dy/dx = (6x + 5) * cos(3x^2 + 5x)

Q2(b) Differentiate f(x) = e^(cos(2x)) with respect to x.
Ans: f'(x) = d/dx [ e^(cos 2x) ]
Outer derivative of e^z is e^z.
Derivative of cos(2x) is -sin(2x).
So f'(x) = -sin(2x) * e^(cos 2x)

Q3 Explain why (d/dx)[f(g(x))] != f'(x) * g'(x) with physical rate reasoning.
Ans: Because f is evaluated at g(x), not at x itself!
The outer function responds to rate of changes of the inner variable.
Multiplying f'(x) * g'(x) would evaluate slopes at different coordinate points.`,
    expectedMarkingScheme: [
      {
        questionNumber: 'Q1(a)',
        questionText: 'Differentiate y = sin(3x^2 + 5x) using Chain Rule.',
        maxMarks: 8,
        expectedAnswer: 'dy/dx = cos(3x^2 + 5x) * (6x + 5)',
        requiredKeywords: ['Chain Rule', 'substitution u', 'dy/du', 'du/dx', '6x + 5', 'cos(3x^2 + 5x)'],
        conceptTested: 'Basic Composite Derivative & Chain Rule',
      },
      {
        questionNumber: 'Q2(b)',
        questionText: 'Differentiate f(x) = e^(cos(2x)).',
        maxMarks: 10,
        expectedAnswer: "f'(x) = -2 * sin(2x) * e^(cos(2x)) (3-tier composite requiring outer exp, middle cos, inner 2x)",
        requiredKeywords: ['nested chain rule', 'inner derivative 2', '-sin(2x)', 'e^(cos 2x)'],
        conceptTested: 'Multi-layer Nested Function Decomposition',
      },
      {
        questionNumber: 'Q3',
        questionText: "Physical and geometric reasoning for why (d/dx)[f(g(x))] != f'(x) * g'(x).",
        maxMarks: 7,
        expectedAnswer: "Outer rate must be evaluated at input g(x), represents transmission of rates (dy/du * du/dx)",
        requiredKeywords: ['evaluated at g(x)', 'rate of change', 'transmission ratio', 'intermediate variable'],
        conceptTested: 'Conceptual & Rate Interpretation of Composite Functions',
      },
    ],
    evaluationReport: {
      id: 'eval-calc-042',
      timestamp: '2026-09-22T10:15:00.000Z',
      student: {
        name: 'Aarav Sharma',
        rollNumber: '1MS22CS042',
        subject: 'Engineering Mathematics II',
        examCode: 'MATH-2024-MID2',
        date: '14-Oct-2024',
        questionNumbersDetected: ['Q1(a)', 'Q2(b)', 'Q3'],
      },
      ocrConfidence: 97.4,
      evaluationConfidence: 96.8,
      totalScore: 18,
      maxScore: 25,
      percentage: 72,
      grade: 'B+',
      predictedFinalScoreRange: '74% - 82%',
      predictedPercentile: 78,
      overallStrengths: [
        'Precise mathematical notation and clear step-by-step substitution of variables in Q1.',
        'Solid qualitative understanding that outer derivatives evaluate at g(x) rather than x in Q3.',
        'Excellent procedural clarity without algebraic arithmetic mistakes.',
      ],
      overallWeaknesses: [
        'Incomplete 3-stage chain decomposition in Q2: forgot the innermost derivative of (2x) which equals 2.',
        'Tended to treat composite depth as binary (single inner layer) rather than recursive nested layers.',
      ],
      executiveSummary:
        'The student demonstrates good grasp of standard two-layer chain rule mechanics. However, when expressions feature 3 nested layers (outer exp -> middle cosine -> inner 2x), the innermost scalar factor was dropped, leading to a 5-mark deduction in Q2.',
      questions: [
        {
          questionNumber: 'Q1(a)',
          questionText: 'Differentiate y = sin(3x^2 + 5x) using Chain Rule.',
          extractedHandwrittenText:
            'Let u = 3x^2 + 5x, so y = sin(u). By Chain Rule: dy/dx = (dy/du) * (du/dx). dy/du = cos(u) = cos(3x^2 + 5x). du/dx = d/dx(3x^2 + 5x) = 6x + 5. Therefore, dy/dx = (6x + 5) * cos(3x^2 + 5x)',
          expectedAnswer: 'dy/dx = (6x + 5) * cos(3x^2 + 5x)',
          keyPointsExpected: ['Chain Rule formula', 'Substitution u = 3x^2 + 5x', 'Inner derivative 6x+5', 'Final product'],
          keyPointsFound: ['Chain Rule formula', 'Substitution u', 'Inner derivative 6x+5', 'Product combined'],
          missingPoints: [],
          incorrectConcepts: [],
          marksAwarded: 8,
          maxMarks: 8,
          status: 'good',
          nlpMetrics: {
            relevance: 100,
            keywordCoverage: 98,
            conceptAccuracy: 100,
            completeness: 100,
            clarityAndGrammar: 96,
          },
          feedbackSummary: 'Flawless step-by-step execution with explicit intermediate substitutions.',
          improvementTip: 'Maintain this level of structured substitution when tackling higher-order problems.',
          conceptToReview: 'Single-tier Chain Rule',
        },
        {
          questionNumber: 'Q2(b)',
          questionText: 'Differentiate f(x) = e^(cos(2x)).',
          extractedHandwrittenText:
            "f'(x) = d/dx [ e^(cos 2x) ]. Outer derivative of e^z is e^z. Derivative of cos(2x) is -sin(2x). So f'(x) = -sin(2x) * e^(cos 2x).",
          expectedAnswer: "f'(x) = -2 * sin(2x) * e^(cos 2x)",
          keyPointsExpected: [
            'Outer derivative d/dz(e^z) = e^z',
            'Middle derivative d/du(cos u) = -sin u',
            'Inner derivative d/dx(2x) = 2',
            'Final factor product: -2 sin(2x) e^(cos 2x)',
          ],
          keyPointsFound: ['Outer derivative e^z', 'Middle derivative -sin u'],
          missingPoints: ['Innermost derivative of (2x) which equals 2', 'Factor of 2 in final expression'],
          incorrectConcepts: ['Truncating multi-stage chain rule after two layers'],
          marksAwarded: 5,
          maxMarks: 10,
          status: 'needs_work',
          nlpMetrics: {
            relevance: 85,
            keywordCoverage: 60,
            conceptAccuracy: 55,
            completeness: 50,
            clarityAndGrammar: 90,
          },
          feedbackSummary: 'Dropped the innermost layer derivative! (2x) must also be differentiated, yielding an extra factor of 2.',
          improvementTip: 'Always count layers from outside in: Outer e^(...) -> Middle cos(...) -> Inner 2x.',
          conceptToReview: 'Nested Composite Function Decomposition',
          visualConceptKey: 'topic-calculus-chain',
        },
        {
          questionNumber: 'Q3',
          questionText: "Physical and geometric reasoning for why (d/dx)[f(g(x))] != f'(x) * g'(x).",
          extractedHandwrittenText:
            "Because f is evaluated at g(x), not at x itself! The outer function responds to rate of changes of the inner variable. Multiplying f'(x) * g'(x) would evaluate slopes at different coordinate points.",
          expectedAnswer:
            "Outer rate f' must be evaluated at the intermediate point u = g(x) rather than x. The chain rule behaves like gear teeth transmission: (dy/du) * (du/dx).",
          keyPointsExpected: ['Evaluation at g(x)', 'Transmission of rates', 'Intermediate variable state'],
          keyPointsFound: ['Evaluated at g(x)', 'Responds to rate of inner variable', 'Different coordinate points'],
          missingPoints: ['Gear ratio / physical chain transmission analogy'],
          incorrectConcepts: [],
          marksAwarded: 5,
          maxMarks: 7,
          status: 'improve',
          nlpMetrics: {
            relevance: 92,
            keywordCoverage: 80,
            conceptAccuracy: 88,
            completeness: 75,
            clarityAndGrammar: 88,
          },
          feedbackSummary: 'Good qualitative intuition regarding coordinate points.',
          improvementTip: 'Elaborate on the rate amplification ratio (dy/du * du/dx) to gain full marks.',
          conceptToReview: 'Rate of Change Composition',
        },
      ],
      recoveryPlan: {
        immediateAction: 'Practice multi-tier 3-layer composite differentiation with brackets around each nested sub-expression.',
        items: [
          {
            topic: 'Nested Function Decomposition (3+ layers)',
            priority: 'high',
            estimatedTime: '25 mins',
            actionAdvice: 'Color-code nested parentheses: f( g( h(x) ) ) before differentiating.',
            targetConceptId: 'c_composite_decomp',
          },
          {
            topic: 'Chain Rule Rate Visualizer Drill',
            priority: 'medium',
            estimatedTime: '15 mins',
            actionAdvice: 'Launch the interactive Chain Rule animation to observe how inner and outer rates multiply live.',
            targetConceptId: 'c_chain_rule_formula',
          },
        ],
        suggestedSimulators: ['Calculus: Chain Rule & Composite Functions'],
      },
      language: 'en',
    },
  },
  {
    id: 'sample-physics-standing-waves',
    title: 'Physics: Standing Waves & Boundary Nodes',
    subject: 'Physics',
    topicTitle: 'Physics: Standing Waves & Resonance',
    studentName: 'Priya Nair',
    rollNumber: '1MS22CS089',
    examCode: 'PHY-2024-SEM1',
    date: '18-Oct-2024',
    description: 'Answer sheet on wave superposition, node-antinode spacing, and boundary reflection phase inversions.',
    paperType: 'ruled',
    paperPreviewSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1050" width="800" height="1050" style="background:%23fcfcf8; font-family:'Caveat', 'Comic Sans MS', cursive, sans-serif;">
      <defs>
        <pattern id="ruledLinesPhy" width="100" height="32" patternUnits="userSpaceOnUse">
          <line x1="0" y1="31" x2="100" y2="31" stroke="%23cbd5e1" stroke-width="1.2"/>
        </pattern>
      </defs>
      <rect width="800" height="1050" fill="%23faf8f2"/>
      <rect x="0" y="110" width="800" height="940" fill="url(%23ruledLinesPhy)"/>
      <line x1="110" y1="0" x2="110" y2="1050" stroke="%23f87171" stroke-width="1.5"/>

      <rect x="130" y="25" width="630" height="70" rx="8" fill="%23f8fafc" stroke="%2394a3b8" stroke-width="1"/>
      <text x="145" y="48" font-size="14" font-weight="bold" fill="%230f172a" font-family="sans-serif">DEPT OF PHYSICS - MIDTERM EXAMINATION</text>
      <text x="145" y="70" font-size="12" fill="%23475569" font-family="sans-serif">Name: Priya Nair | USN: 1MS22CS089 | Course: Engineering Physics (PHY-101)</text>

      <text x="50" y="138" font-size="17" font-weight="bold" fill="%230f172a">Q 1</text>
      <text x="130" y="138" font-size="16" fill="%231e3a8a" font-style="italic">Define a Node and an Antinode in standing waves. State their spacing.</text>
      <text x="130" y="170" font-size="16" fill="%231e3a8a" font-style="italic">Ans: A Node is a point of permanent zero displacement (destructive interference).</text>
      <text x="130" y="202" font-size="16" fill="%231e3a8a" font-style="italic">An Antinode is a point of maximum oscillation amplitude.</text>
      <text x="130" y="234" font-size="16" fill="%231e3a8a" font-style="italic">Spacing: Distance between adjacent nodes = lambda / 2.</text>
      <text x="130" y="266" font-size="16" fill="%231e3a8a" font-style="italic">Distance between consecutive node and antinode = lambda / 4.</text>

      <text x="50" y="330" font-size="17" font-weight="bold" fill="%230f172a">Q 2</text>
      <text x="130" y="330" font-size="16" fill="%231e3a8a" font-style="italic">Explain what happens to wave phase when reflecting off a fixed rigid boundary.</text>
      <text x="130" y="362" font-size="16" fill="%231e3a8a" font-style="italic">Ans: At a fixed boundary, the wave undergoes a 180 deg (pi radians) phase inversion.</text>
      <text x="130" y="394" font-size="16" fill="%231e3a8a" font-style="italic">Because the boundary cannot move, the reflected wave must cancel the incoming wave.</text>

      <text x="50" y="458" font-size="17" font-weight="bold" fill="%230f172a">Q 3</text>
      <text x="130" y="458" font-size="16" fill="%231e3a8a" font-style="italic">Write the mathematical superposition formula for two counter-propagating waves.</text>
      <text x="130" y="490" font-size="16" fill="%231e3a8a" font-style="italic">y1 = A sin(kx - wt), y2 = A sin(kx + wt)</text>
      <text x="130" y="522" font-size="16" fill="%231e3a8a" font-style="italic">y_total = y1 + y2 = 2A sin(kx) cos(wt)</text>
      
      <circle cx="710" cy="180" r="32" fill="none" stroke="%2316a34a" stroke-width="2.5"/>
      <text x="696" y="186" font-size="18" font-weight="bold" fill="%2316a34a" font-family="sans-serif">24/25</text>
      <text x="684" y="222" font-size="11" fill="%2316a34a" font-family="sans-serif">Excellent!</text>
    </svg>`,
    rawHandwrittenText: `Q1 Define a Node and an Antinode in standing waves. State their spacing.
Ans: A Node is a point of permanent zero displacement (destructive interference).
An Antinode is a point of maximum oscillation amplitude.
Spacing: Distance between adjacent nodes = lambda / 2.
Distance between consecutive node and antinode = lambda / 4.

Q2 Explain what happens to wave phase when reflecting off a fixed rigid boundary.
Ans: At a fixed boundary, the wave undergoes a 180 deg (pi radians) phase inversion.
Because the boundary cannot move, the reflected wave must cancel the incoming wave.

Q3 Write the mathematical superposition formula for two counter-propagating waves.
y1 = A sin(kx - wt), y2 = A sin(kx + wt)
y_total = y1 + y2 = 2A sin(kx) cos(wt)`,
    expectedMarkingScheme: [
      {
        questionNumber: 'Q1',
        questionText: 'Definition and spatial spacing of nodes and antinodes.',
        maxMarks: 8,
        expectedAnswer: 'Node: zero displacement point. Antinode: max amplitude point. Node-node: lambda/2. Node-antinode: lambda/4.',
        requiredKeywords: ['Node', 'zero displacement', 'Antinode', 'max amplitude', 'lambda/2', 'lambda/4'],
        conceptTested: 'Standing Wave Geometry & Spatial Harmonics',
      },
      {
        questionNumber: 'Q2',
        questionText: 'Boundary reflection condition and phase shift at a rigid barrier.',
        maxMarks: 8,
        expectedAnswer: 'Phase inversion of 180 degrees (pi radians), Newton third law reaction force cancelling displacement.',
        requiredKeywords: ['180 degree phase shift', 'pi radians', 'fixed boundary', 'cancels displacement'],
        conceptTested: 'Boundary Conditions & Phase Reflection',
      },
      {
        questionNumber: 'Q3',
        questionText: 'Superposition derivation of standing wave equation.',
        maxMarks: 9,
        expectedAnswer: 'y_total = 2A sin(kx) cos(wt) showing separation of spatial modulation sin(kx) and temporal oscillation cos(wt).',
        requiredKeywords: ['2A sin(kx) cos(wt)', 'spatial modulation', 'standing envelope'],
        conceptTested: 'Wave Superposition Principle',
      },
    ],
    evaluationReport: {
      id: 'eval-phy-089',
      timestamp: '2026-09-22T10:30:00.000Z',
      student: {
        name: 'Priya Nair',
        rollNumber: '1MS22CS089',
        subject: 'Engineering Physics',
        examCode: 'PHY-2024-SEM1',
        date: '18-Oct-2024',
        questionNumbersDetected: ['Q1', 'Q2', 'Q3'],
      },
      ocrConfidence: 98.9,
      evaluationConfidence: 97.5,
      totalScore: 24,
      maxScore: 25,
      percentage: 96,
      grade: 'A+',
      predictedFinalScoreRange: '92% - 98%',
      predictedPercentile: 98,
      overallStrengths: [
        'Comprehensive physical definitions and exact harmonic spacing fractions.',
        'Clear mathematical derivation of standing wave envelope without sign confusion.',
        'Spotless handwriting with crisp scientific terminology.',
      ],
      overallWeaknesses: [
        'Could explicitly mention how open boundaries differ (0 deg phase shift) for complete bonus marks in Q2.',
      ],
      executiveSummary:
        'Outstanding answer script demonstrating comprehensive theoretical mastery of harmonic waves, boundary phase reflection, and trigonometric superposition.',
      questions: [
        {
          questionNumber: 'Q1',
          questionText: 'Definition and spatial spacing of nodes and antinodes.',
          extractedHandwrittenText:
            'A Node is a point of permanent zero displacement (destructive interference). An Antinode is a point of maximum oscillation amplitude. Spacing: Distance between adjacent nodes = lambda / 2. Distance between consecutive node and antinode = lambda / 4.',
          expectedAnswer:
            'Nodes are points of zero amplitude due to destructive interference; antinodes are points of peak amplitude. Node-to-node spacing is lambda/2, node-to-antinode is lambda/4.',
          keyPointsExpected: ['Node zero displacement', 'Antinode maximum amplitude', 'Spacing lambda/2', 'Spacing lambda/4'],
          keyPointsFound: ['Node zero displacement', 'Antinode max amplitude', 'Adjacent nodes lambda/2', 'Node-antinode lambda/4'],
          missingPoints: [],
          incorrectConcepts: [],
          marksAwarded: 8,
          maxMarks: 8,
          status: 'good',
          nlpMetrics: {
            relevance: 100,
            keywordCoverage: 100,
            conceptAccuracy: 100,
            completeness: 100,
            clarityAndGrammar: 98,
          },
          feedbackSummary: 'Perfect definitions and exact harmonic spacing stated with complete clarity.',
          improvementTip: 'Ready for higher harmonic overtone calculations.',
          conceptToReview: 'Standing Wave Spatial Profile',
        },
        {
          questionNumber: 'Q2',
          questionText: 'Boundary reflection condition and phase shift at a rigid barrier.',
          extractedHandwrittenText:
            'At a fixed boundary, the wave undergoes a 180 deg (pi radians) phase inversion. Because the boundary cannot move, the reflected wave must cancel the incoming wave.',
          expectedAnswer:
            'Fixed end imposes a node condition (y=0). Inversion of 180° (pi radians) occurs to satisfy boundary constraint.',
          keyPointsExpected: ['180 degree phase shift', 'Fixed boundary node condition', 'Cancellation at boundary'],
          keyPointsFound: ['180 deg phase inversion', 'Cannot move', 'Reflected wave cancels incoming wave'],
          missingPoints: [],
          incorrectConcepts: [],
          marksAwarded: 8,
          maxMarks: 8,
          status: 'good',
          nlpMetrics: {
            relevance: 98,
            keywordCoverage: 95,
            conceptAccuracy: 98,
            completeness: 95,
            clarityAndGrammar: 96,
          },
          feedbackSummary: 'Excellent boundary constraint reasoning.',
          improvementTip: 'Keep in mind the contrasting case of a free boundary (0° shift).',
          conceptToReview: 'Reflection & Boundary Constraints',
        },
        {
          questionNumber: 'Q3',
          questionText: 'Write the mathematical superposition formula for two counter-propagating waves.',
          extractedHandwrittenText:
            'y1 = A sin(kx - wt), y2 = A sin(kx + wt). y_total = y1 + y2 = 2A sin(kx) cos(wt).',
          expectedAnswer:
            'y_total = 2A sin(kx) cos(wt). The term sin(kx) is the spatial envelope and cos(wt) is the time-harmonic vibration.',
          keyPointsExpected: ['Counter-propagating wave equations', 'Sum of waves', 'Resulting formula 2A sin(kx) cos(wt)'],
          keyPointsFound: ['Counter-propagating waves', 'Formula 2A sin(kx) cos(wt)'],
          missingPoints: ['Explicit mention that sin(kx) acts as the stationary spatial envelope'],
          incorrectConcepts: [],
          marksAwarded: 8,
          maxMarks: 9,
          status: 'good',
          nlpMetrics: {
            relevance: 95,
            keywordCoverage: 90,
            conceptAccuracy: 96,
            completeness: 88,
            clarityAndGrammar: 95,
          },
          feedbackSummary: 'Correct algebraic trigonometric superposition formula.',
          improvementTip: 'Highlight the physical significance of the separated spatial and temporal factors.',
          conceptToReview: 'Wave Superposition Principle',
        },
      ],
      recoveryPlan: {
        immediateAction: 'Explore standing wave overtones and resonant tube boundary frequencies.',
        items: [
          {
            topic: 'Harmonic Series in Open vs Closed Resonant Columns',
            priority: 'low',
            estimatedTime: '15 mins',
            actionAdvice: 'Practice odd vs all-integer harmonics in acoustic air columns.',
            targetConceptId: 'c_wave_resonance',
          },
        ],
        suggestedSimulators: ['Physics: Standing Waves & Resonance'],
      },
      language: 'en',
    },
  },
  {
    id: 'sample-cs-dp-memoization',
    title: 'Computer Science: Dynamic Programming & Overlapping Subproblems',
    subject: 'Computer Science',
    topicTitle: 'Data Structures: Dynamic Programming & Recursion',
    studentName: 'Rohan Kulkarni',
    rollNumber: '1MS22CS105',
    examCode: 'CS-2024-ALGO',
    date: '20-Oct-2024',
    description: 'Answer sheet covering recurrence relations, recursion trees, and memoization hash tables with an omitted base case.',
    paperType: 'plain',
    paperPreviewSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1050" width="800" height="1050" style="background:%23f9fafb; font-family:'Caveat', 'Comic Sans MS', cursive, sans-serif;">
      <rect width="800" height="1050" fill="%23fcfcfd"/>
      <rect x="130" y="25" width="630" height="70" rx="8" fill="%23f1f5f9" stroke="%23cbd5e1" stroke-width="1"/>
      <text x="145" y="48" font-size="14" font-weight="bold" fill="%231e293b" font-family="sans-serif">DEPT OF COMPUTER SCIENCE - ALGORITHMS ASSIGNMENT</text>
      <text x="145" y="70" font-size="12" fill="%23475569" font-family="sans-serif">Name: Rohan Kulkarni | USN: 1MS22CS105 | Course: Design &amp; Analysis of Algorithms</text>

      <text x="50" y="140" font-size="17" font-weight="bold" fill="%230f172a">Q 1</text>
      <text x="130" y="140" font-size="16" fill="%231e3a8a" font-style="italic">What are the two core prerequisites for a problem to be solved using Dynamic Programming?</text>
      <text x="130" y="172" font-size="16" fill="%231e3a8a" font-style="italic">Ans: 1. Overlapping Subproblems - Same subproblems are calculated repeatedly.</text>
      <text x="130" y="204" font-size="16" fill="%231e3a8a" font-style="italic">2. Optimal Substructure - Optimal solution to problem contains optimal solutions to subproblems.</text>

      <text x="50" y="270" font-size="17" font-weight="bold" fill="%230f172a">Q 2</text>
      <text x="130" y="270" font-size="16" fill="%231e3a8a" font-style="italic">Compare Memoization (Top-Down) vs Tabulation (Bottom-Up).</text>
      <text x="130" y="302" font-size="16" fill="%231e3a8a" font-style="italic">Ans: Memoization uses recursion with a cache / hash table. Only solves required subproblems.</text>
      <text x="130" y="334" font-size="16" fill="%231e3a8a" font-style="italic">Tabulation uses iteration, filling a table from base cases up. Avoids recursion call stack overhead.</text>

      <text x="50" y="400" font-size="17" font-weight="bold" fill="%230f172a">Q 3</text>
      <text x="130" y="400" font-size="16" fill="%231e3a8a" font-style="italic">Write pseudo-code for Fibonacci using Memoization.</text>
      <text x="130" y="432" font-size="16" fill="%231e3a8a" font-style="italic">def fib(n, memo={}):</text>
      <text x="130" y="464" font-size="16" fill="%231e3a8a" font-style="italic">    if n in memo: return memo[n]</text>
      <text x="130" y="496" font-size="16" fill="%231e3a8a" font-style="italic">    if n <= 1: return n  # (Wait, what about n==0?)</text>
      <text x="130" y="528" font-size="16" fill="%231e3a8a" font-style="italic">    memo[n] = fib(n-1) + fib(n-2)  # Missing memo argument in recursive calls!</text>
      <text x="130" y="560" font-size="16" fill="%231e3a8a" font-style="italic">    return memo[n]</text>

      <circle cx="710" cy="180" r="32" fill="none" stroke="%23ca8a04" stroke-width="2.5"/>
      <text x="696" y="186" font-size="18" font-weight="bold" fill="%23ca8a04" font-family="sans-serif">16/25</text>
      <text x="680" y="222" font-size="11" fill="%23ca8a04" font-family="sans-serif">Fix memo arg!</text>
    </svg>`,
    rawHandwrittenText: `Q1 What are the two core prerequisites for a problem to be solved using Dynamic Programming?
Ans: 1. Overlapping Subproblems - Same subproblems are calculated repeatedly.
2. Optimal Substructure - Optimal solution to problem contains optimal solutions to subproblems.

Q2 Compare Memoization (Top-Down) vs Tabulation (Bottom-Up).
Ans: Memoization uses recursion with a cache / hash table. Only solves required subproblems.
Tabulation uses iteration, filling a table from base cases up. Avoids recursion call stack overhead.

Q3 Write pseudo-code for Fibonacci using Memoization.
def fib(n, memo={}):
    if n in memo: return memo[n]
    if n <= 1: return n
    memo[n] = fib(n-1) + fib(n-2)
    return memo[n]`,
    expectedMarkingScheme: [
      {
        questionNumber: 'Q1',
        questionText: 'State the two hallmarks of Dynamic Programming.',
        maxMarks: 6,
        expectedAnswer: 'Overlapping Subproblems and Optimal Substructure.',
        requiredKeywords: ['Overlapping Subproblems', 'Optimal Substructure'],
        conceptTested: 'Core DP Principles',
      },
      {
        questionNumber: 'Q2',
        questionText: 'Contrast Top-Down Memoization with Bottom-Up Tabulation.',
        maxMarks: 8,
        expectedAnswer:
          'Top-down uses recursion + cache, on-demand subproblem evaluation; Bottom-up uses iteration, fills DP table sequentially from base cases, O(1) stack space.',
        requiredKeywords: ['Top-down', 'Bottom-up', 'recursion', 'iteration', 'cache', 'table', 'call stack'],
        conceptTested: 'Memoization vs Tabulation Tradeoffs',
      },
      {
        questionNumber: 'Q3',
        questionText: 'Implement Memoized Fibonacci in pseudocode.',
        maxMarks: 11,
        expectedAnswer: 'Function must pass memo dictionary/array recursively in calls fib(n-1, memo) + fib(n-2, memo).',
        requiredKeywords: ['cache lookup', 'base cases n<=1', 'passing memo into recursive step', 'storing result'],
        conceptTested: 'Memoization Implementation Details',
      },
    ],
    evaluationReport: {
      id: 'eval-cs-105',
      timestamp: '2026-09-22T10:45:00.000Z',
      student: {
        name: 'Rohan Kulkarni',
        rollNumber: '1MS22CS105',
        subject: 'Algorithms & Data Structures',
        examCode: 'CS-2024-ALGO',
        date: '20-Oct-2024',
        questionNumbersDetected: ['Q1', 'Q2', 'Q3'],
      },
      ocrConfidence: 96.5,
      evaluationConfidence: 95.2,
      totalScore: 16,
      maxScore: 25,
      percentage: 64,
      grade: 'B',
      predictedFinalScoreRange: '68% - 76%',
      predictedPercentile: 65,
      overallStrengths: [
        'Clear memorization of the two foundational properties: Overlapping Subproblems and Optimal Substructure.',
        'Accurate distinction between top-down recursion cache vs bottom-up table filling in Q2.',
      ],
      overallWeaknesses: [
        'Critical bug in Q3 pseudocode: omitted `memo` argument in recursive calls `fib(n-1) + fib(n-2)`, causing sub-calls to instantiate fresh memo dicts.',
        'Did not discuss space complexity implications of mutable default arguments in Python.',
      ],
      executiveSummary:
        'The candidate understands high-level algorithmic definitions, but exhibits an implementation gap when passing stateful cache structures through recursive activation frames.',
      questions: [
        {
          questionNumber: 'Q1',
          questionText: 'What are the two core prerequisites for a problem to be solved using Dynamic Programming?',
          extractedHandwrittenText:
            '1. Overlapping Subproblems - Same subproblems are calculated repeatedly. 2. Optimal Substructure - Optimal solution to problem contains optimal solutions to subproblems.',
          expectedAnswer: 'Overlapping Subproblems and Optimal Substructure.',
          keyPointsExpected: ['Overlapping Subproblems definition', 'Optimal Substructure definition'],
          keyPointsFound: ['Overlapping Subproblems', 'Optimal Substructure'],
          missingPoints: [],
          incorrectConcepts: [],
          marksAwarded: 6,
          maxMarks: 6,
          status: 'good',
          nlpMetrics: {
            relevance: 100,
            keywordCoverage: 100,
            conceptAccuracy: 100,
            completeness: 100,
            clarityAndGrammar: 96,
          },
          feedbackSummary: 'Exact definitions provided.',
          improvementTip: 'Excellent concise answer.',
          conceptToReview: 'DP Fundamentals',
        },
        {
          questionNumber: 'Q2',
          questionText: 'Compare Memoization (Top-Down) vs Tabulation (Bottom-Up).',
          extractedHandwrittenText:
            'Memoization uses recursion with a cache / hash table. Only solves required subproblems. Tabulation uses iteration, filling a table from base cases up. Avoids recursion call stack overhead.',
          expectedAnswer: 'Top-down: recursive, evaluates needed states; Bottom-up: iterative, fills table, no stack limit.',
          keyPointsExpected: ['Top-down recursive caching', 'Bottom-up iterative table', 'Call stack overhead vs space'],
          keyPointsFound: ['Recursion with cache', 'Only solves required subproblems', 'Iteration', 'Avoids recursion call stack'],
          missingPoints: [],
          incorrectConcepts: [],
          marksAwarded: 7,
          maxMarks: 8,
          status: 'good',
          nlpMetrics: {
            relevance: 95,
            keywordCoverage: 90,
            conceptAccuracy: 95,
            completeness: 88,
            clarityAndGrammar: 92,
          },
          feedbackSummary: 'Clear comparison of both paradigms.',
          improvementTip: 'Mention time complexity O(N) is identical for both in Fibonacci.',
          conceptToReview: 'DP Top-down vs Bottom-up',
        },
        {
          questionNumber: 'Q3',
          questionText: 'Write pseudo-code for Fibonacci using Memoization.',
          extractedHandwrittenText:
            'def fib(n, memo={}): if n in memo: return memo[n]; if n <= 1: return n; memo[n] = fib(n-1) + fib(n-2); return memo[n]',
          expectedAnswer:
            'def fib(n, memo): if n in memo: return memo[n]; if n <= 1: return n; memo[n] = fib(n-1, memo) + fib(n-2, memo); return memo[n]',
          keyPointsExpected: ['Base case handling', 'Lookup in memo', 'Passing memo in recursive call', 'Store before return'],
          keyPointsFound: ['Lookup in memo', 'Base case n<=1', 'Store before return'],
          missingPoints: ['Passing memo in recursive call: fib(n-1, memo) + fib(n-2, memo)'],
          incorrectConcepts: ['Invoking recursive branches without the memo dictionary'],
          marksAwarded: 3,
          maxMarks: 11,
          status: 'needs_work',
          nlpMetrics: {
            relevance: 75,
            keywordCoverage: 60,
            conceptAccuracy: 40,
            completeness: 55,
            clarityAndGrammar: 80,
          },
          feedbackSummary:
            'Critical recursion error: lines `fib(n-1) + fib(n-2)` omit the `memo` argument, breaking top-down memoization and causing exponential 2^N re-evaluation!',
          improvementTip: 'Always pass the state/cache reference into every child recursive call: `fib(n-1, memo)`.',
          conceptToReview: 'Recursion Call Stack & Memo Passing',
          visualConceptKey: 'topic-cs-dp',
        },
      ],
      recoveryPlan: {
        immediateAction: 'Walk through recursion tree frames with an explicit memo trace chart.',
        items: [
          {
            topic: 'Passing Cache References in Recursive Invocations',
            priority: 'high',
            estimatedTime: '20 mins',
            actionAdvice: 'Trace stack frames on paper and verify that child frames share the identical dictionary pointer.',
            targetConceptId: 'c_memo_tree',
          },
        ],
        suggestedSimulators: ['Data Structures: Dynamic Programming & Recursion'],
      },
      language: 'en',
    },
  },
];
