import {
  UserProfile,
  SemesterRecord,
  AcademicRiskProfile,
  ProblemSolvingSkillProfile,
  IQQuestion,
  WeeklyMockTest,
  PersonalizedRecommendations,
  FacultyClassStudentItem,
  AnswerSheetEvaluationReport,
} from '../types';

export const CURRENT_STUDENT: UserProfile = {
  id: 'std_101',
  usn: '1MS21CS042',
  name: 'Rahul Sharma',
  email: 'rahul.sharma@institution.edu',
  role: 'student',
  department: 'Computer Science & Engineering',
  semester: 5,
  section: 'A',
  cgpa: 8.74,
  attendanceRate: 89.2,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  phone: '+91 98450 12345',
};

export const CURRENT_FACULTY = {
  id: 'fac_202',
  facultyId: 'FAC-CSE-09',
  name: 'Dr. Priya Venkatesh',
  email: 'priya.venkatesh@institution.edu',
  designation: 'Professor & Dean of Academic Analytics',
  department: 'Computer Science & Engineering',
  cabin: 'Academic Block 3, Room 412',
  assignedDepartments: ['Computer Science & Engineering', 'Information Science', 'Electronics & Comm.'],
  assignedSemesters: [3, 5, 7],
};

// -------------------------------------------------------------
// PREVIOUS YEAR MULTI-SEMESTER MARKS DATABASE
// -------------------------------------------------------------
export const STUDENT_SEMESTER_HISTORY: SemesterRecord[] = [
  {
    semesterNumber: 1,
    semesterName: 'Semester 1',
    academicYear: '2021-22',
    sgpa: 8.42,
    totalCredits: 20,
    overallAttendance: 92.0,
    subjects: [
      { code: '21MAT11', name: 'Calculus & Linear Algebra', credits: 4, internalMarks: 44, externalMarks: 42, totalMarks: 86, grade: 'A+', gradePoints: 9, attendancePercentage: 94, status: 'cleared' },
      { code: '21PHY12', name: 'Engineering Physics', credits: 4, internalMarks: 40, externalMarks: 38, totalMarks: 78, grade: 'A', gradePoints: 8, attendancePercentage: 91, status: 'cleared' },
      { code: '21ELE13', name: 'Basic Electrical Engineering', credits: 3, internalMarks: 42, externalMarks: 45, totalMarks: 87, grade: 'A+', gradePoints: 9, attendancePercentage: 90, status: 'cleared' },
      { code: '21CIV14', name: 'Elements of Civil Engineering', credits: 3, internalMarks: 38, externalMarks: 36, totalMarks: 74, grade: 'B+', gradePoints: 7, attendancePercentage: 88, status: 'cleared' },
      { code: '21EGD15', name: 'Engineering Graphics & Design', credits: 3, internalMarks: 46, externalMarks: 48, totalMarks: 94, grade: 'O', gradePoints: 10, attendancePercentage: 96, status: 'cleared' },
      { code: '21PHYL16', name: 'Engineering Physics Lab', credits: 1.5, internalMarks: 48, externalMarks: 46, totalMarks: 94, grade: 'O', gradePoints: 10, attendancePercentage: 95, status: 'cleared' },
      { code: '21ELEL17', name: 'Basic Electrical Lab', credits: 1.5, internalMarks: 45, externalMarks: 44, totalMarks: 89, grade: 'A+', gradePoints: 9, attendancePercentage: 90, status: 'cleared' },
    ],
  },
  {
    semesterNumber: 2,
    semesterName: 'Semester 2',
    academicYear: '2021-22',
    sgpa: 8.65,
    totalCredits: 20,
    overallAttendance: 90.5,
    subjects: [
      { code: '21MAT21', name: 'Advanced Calculus & Numerical Methods', credits: 4, internalMarks: 45, externalMarks: 41, totalMarks: 86, grade: 'A+', gradePoints: 9, attendancePercentage: 92, status: 'cleared' },
      { code: '21CHE22', name: 'Engineering Chemistry', credits: 4, internalMarks: 42, externalMarks: 43, totalMarks: 85, grade: 'A+', gradePoints: 9, attendancePercentage: 90, status: 'cleared' },
      { code: '21PSP23', name: 'Problem Solving through C Programming', credits: 4, internalMarks: 48, externalMarks: 46, totalMarks: 94, grade: 'O', gradePoints: 10, attendancePercentage: 94, status: 'cleared' },
      { code: '21ELN24', name: 'Basic Electronics Engineering', credits: 3, internalMarks: 39, externalMarks: 37, totalMarks: 76, grade: 'A', gradePoints: 8, attendancePercentage: 88, status: 'cleared' },
      { code: '21EME25', name: 'Elements of Mechanical Engineering', credits: 3, internalMarks: 41, externalMarks: 39, totalMarks: 80, grade: 'A', gradePoints: 8, attendancePercentage: 87, status: 'cleared' },
      { code: '21CPL26', name: 'Computer Programming Lab', credits: 1, internalMarks: 49, externalMarks: 48, totalMarks: 97, grade: 'O', gradePoints: 10, attendancePercentage: 96, status: 'cleared' },
      { code: '21CHEL27', name: 'Engineering Chemistry Lab', credits: 1, internalMarks: 44, externalMarks: 45, totalMarks: 89, grade: 'A+', gradePoints: 9, attendancePercentage: 90, status: 'cleared' },
    ],
  },
  {
    semesterNumber: 3,
    semesterName: 'Semester 3',
    academicYear: '2022-23',
    sgpa: 8.88,
    totalCredits: 22,
    overallAttendance: 91.8,
    subjects: [
      { code: '21CS31', name: 'Transform Calculus & Fourier Series', credits: 4, internalMarks: 46, externalMarks: 45, totalMarks: 91, grade: 'O', gradePoints: 10, attendancePercentage: 93, status: 'cleared' },
      { code: '21CS32', name: 'Data Structures & Applications', credits: 4, internalMarks: 47, externalMarks: 48, totalMarks: 95, grade: 'O', gradePoints: 10, attendancePercentage: 95, status: 'cleared' },
      { code: '21CS33', name: 'Analog and Digital Electronics', credits: 3, internalMarks: 41, externalMarks: 40, totalMarks: 81, grade: 'A', gradePoints: 8, attendancePercentage: 89, status: 'cleared' },
      { code: '21CS34', name: 'Computer Organization & Architecture', credits: 3, internalMarks: 43, externalMarks: 42, totalMarks: 85, grade: 'A+', gradePoints: 9, attendancePercentage: 91, status: 'cleared' },
      { code: '21CS35', name: 'Software Engineering & Agile Methodologies', credits: 3, internalMarks: 45, externalMarks: 44, totalMarks: 89, grade: 'A+', gradePoints: 9, attendancePercentage: 90, status: 'cleared' },
      { code: '21CSL36', name: 'Data Structures Laboratory', credits: 2, internalMarks: 50, externalMarks: 49, totalMarks: 99, grade: 'O', gradePoints: 10, attendancePercentage: 98, status: 'cleared' },
      { code: '21CSL37', name: 'ADE Laboratory', credits: 2, internalMarks: 46, externalMarks: 45, totalMarks: 91, grade: 'O', gradePoints: 10, attendancePercentage: 92, status: 'cleared' },
      { code: '21UH48', name: 'Universal Human Values', credits: 1, internalMarks: 48, externalMarks: 47, totalMarks: 95, grade: 'O', gradePoints: 10, attendancePercentage: 94, status: 'cleared' },
    ],
  },
  {
    semesterNumber: 4,
    semesterName: 'Semester 4',
    academicYear: '2022-23',
    sgpa: 9.02,
    totalCredits: 22,
    overallAttendance: 93.4,
    subjects: [
      { code: '21CS41', name: 'Mathematical Foundations for Computing', credits: 4, internalMarks: 48, externalMarks: 47, totalMarks: 95, grade: 'O', gradePoints: 10, attendancePercentage: 96, status: 'cleared' },
      { code: '21CS42', name: 'Design and Analysis of Algorithms', credits: 4, internalMarks: 49, externalMarks: 47, totalMarks: 96, grade: 'O', gradePoints: 10, attendancePercentage: 97, status: 'cleared' },
      { code: '21CS43', name: 'Operating Systems & System Programming', credits: 3, internalMarks: 44, externalMarks: 43, totalMarks: 87, grade: 'A+', gradePoints: 9, attendancePercentage: 92, status: 'cleared' },
      { code: '21CS44', name: 'Microcontrollers and Embedded Systems', credits: 3, internalMarks: 40, externalMarks: 41, totalMarks: 81, grade: 'A', gradePoints: 8, attendancePercentage: 89, status: 'cleared' },
      { code: '21CS45', name: 'Object Oriented Programming with Java', credits: 3, internalMarks: 47, externalMarks: 46, totalMarks: 93, grade: 'O', gradePoints: 10, attendancePercentage: 94, status: 'cleared' },
      { code: '21CSL46', name: 'Design & Analysis of Algorithms Lab', credits: 2, internalMarks: 49, externalMarks: 50, totalMarks: 99, grade: 'O', gradePoints: 10, attendancePercentage: 98, status: 'cleared' },
      { code: '21CSL47', name: 'Microcontrollers Lab', credits: 2, internalMarks: 45, externalMarks: 44, totalMarks: 89, grade: 'A+', gradePoints: 9, attendancePercentage: 91, status: 'cleared' },
      { code: '21CIP48', name: 'Constitution of India & Cyber Law', credits: 1, internalMarks: 46, externalMarks: 44, totalMarks: 90, grade: 'O', gradePoints: 10, attendancePercentage: 92, status: 'cleared' },
    ],
  },
  {
    semesterNumber: 5,
    semesterName: 'Semester 5 (Current)',
    academicYear: '2023-24',
    sgpa: 8.78, // Projected / mid-term
    totalCredits: 22,
    overallAttendance: 89.2,
    subjects: [
      { code: '21CS51', name: 'Automata Theory & Computability', credits: 4, internalMarks: 41, externalMarks: 39, totalMarks: 80, grade: 'A', gradePoints: 8, attendancePercentage: 86, status: 'in_progress' },
      { code: '21CS52', name: 'Computer Networks & Protocols', credits: 4, internalMarks: 44, externalMarks: 43, totalMarks: 87, grade: 'A+', gradePoints: 9, attendancePercentage: 91, status: 'in_progress' },
      { code: '21CS53', name: 'Database Management Systems', credits: 4, internalMarks: 46, externalMarks: 47, totalMarks: 93, grade: 'O', gradePoints: 10, attendancePercentage: 94, status: 'in_progress' },
      { code: '21CS54', name: 'Artificial Intelligence & Machine Learning', credits: 3, internalMarks: 47, externalMarks: 46, totalMarks: 93, grade: 'O', gradePoints: 10, attendancePercentage: 93, status: 'in_progress' },
      { code: '21CS55', name: 'Principles of Cloud Computing', credits: 3, internalMarks: 43, externalMarks: 41, totalMarks: 84, grade: 'A+', gradePoints: 9, attendancePercentage: 88, status: 'in_progress' },
      { code: '21CSL56', name: 'DBMS with SQL/NoSQL Laboratory', credits: 2, internalMarks: 48, externalMarks: 49, totalMarks: 97, grade: 'O', gradePoints: 10, attendancePercentage: 97, status: 'in_progress' },
      { code: '21CSL57', name: 'Computer Networks Lab with Packet Tracer', credits: 2, internalMarks: 45, externalMarks: 46, totalMarks: 91, grade: 'O', gradePoints: 10, attendancePercentage: 92, status: 'in_progress' },
    ],
  },
];

// -------------------------------------------------------------
// ACADEMIC RISK PREDICTION PROFILE
// -------------------------------------------------------------
export const STUDENT_RISK_PROFILE: AcademicRiskProfile = {
  riskLevel: 'safe',
  riskScore: 14, // 0 - 100
  predictedSemesterGPA: 8.82,
  confidenceInterval: '8.65 - 8.98',
  keyRiskFactors: [
    'Automata Theory internal test 1 showed a 12% drop in Pumping Lemma proofs',
    'Attendance in 21CS51 (Automata Theory) dipped to 86%, near the 85% institutional threshold',
  ],
  weakSubjects: ['Automata Theory & Computability', 'Calculus Chain Rule Prerequisite'],
  attendanceWarning: false,
  earlyWarningAlerts: [
    'Prerequisite gap in Formal Grammars & State Transition Reductions identified',
    'Upcoming Mid-Term 2 requires 2 extra revision hours in Automata Theory',
  ],
  mitigationRecommendations: [
    'Engage with the Live State Machine Visualizer for NFA-to-DFA conversion',
    'Schedule a 48h spaced repetition refresher on Pumping Lemma',
    'Attempt Weekly Mock Test 4 for Automata Theory before Friday',
  ],
  historicalTrend: [
    { semester: 'Sem 1', sgpa: 8.42, attendance: 92.0 },
    { semester: 'Sem 2', sgpa: 8.65, attendance: 90.5 },
    { semester: 'Sem 3', sgpa: 8.88, attendance: 91.8 },
    { semester: 'Sem 4', sgpa: 9.02, attendance: 93.4 },
    { semester: 'Sem 5 (Current)', sgpa: 8.78, attendance: 89.2 },
  ],
};

// -------------------------------------------------------------
// PROBLEM-SOLVING SKILL ANALYTICS
// -------------------------------------------------------------
export const STUDENT_SKILL_PROFILE: ProblemSolvingSkillProfile = {
  studentId: '1MS21CS042',
  overallIndex: 88,
  dimensions: {
    criticalThinking: 91,
    logicalReasoning: 89,
    problemSolvingSpeed: 84,
    accuracy: 92,
    consistency: 86,
  },
  cohortAverages: {
    criticalThinking: 72,
    logicalReasoning: 74,
    problemSolvingSpeed: 68,
    accuracy: 75,
    consistency: 70,
  },
  percentileRank: 94.6,
  growthDeltaLastMonth: 5.4,
  speedAnalysis: {
    averageSecondsPerProblem: 42.5,
    idealWindowSeconds: '35 - 50 seconds',
    speedVsAccuracyTradeoff: 'optimal',
  },
  keyBadges: [
    { title: 'Algorithmic Virtuoso', icon: 'zap', description: 'Top 5% in recursive tree deconstruction' },
    { title: 'Consistent Finisher', icon: 'award', description: 'Maintained 85%+ accuracy across 4 consecutive tests' },
    { title: 'Fast Logic Thinker', icon: 'gauge', description: 'Solved 15 consecutive logic puzzles in sub-40s' },
  ],
};

// -------------------------------------------------------------
// ADAPTIVE AI IQ ASSESSMENT QUESTIONS (Across 5 Domains)
// -------------------------------------------------------------
export const ADAPTIVE_IQ_QUESTIONS: IQQuestion[] = [
  // Logical Reasoning
  {
    id: 'iq_logic_1',
    domain: 'logical_reasoning',
    difficulty: 2,
    question: 'If all Zorgs are Blicks, and some Blicks are Quarks, but no Quarks are Klats, which of the following MUST be false?',
    patternType: 'syllogism',
    options: [
      'Some Zorgs could be Quarks',
      'All Klats are definitely Zorgs',
      'No Quark is a Klat',
      'A Klat can never be a Quark',
    ],
    correctAnswerIndex: 1,
    explanation: 'Since no Quarks are Klats, a Klat can never be a Quark. Claiming all Klats are definitely Zorgs is unsupported and can be conclusively contradicted.',
    points: 10,
    averageTimeSeconds: 40,
  },
  {
    id: 'iq_logic_2',
    domain: 'logical_reasoning',
    difficulty: 4,
    question: 'Five servers (A, B, C, D, E) process requests in sequential priority. Server C executes before A. Server B executes after D. Server E is neither first nor last. Server D is immediately after C. If Server A is not last, which server must execute LAST?',
    patternType: 'deductive',
    options: ['Server B', 'Server E', 'Server A', 'Server D'],
    correctAnswerIndex: 0,
    explanation: 'C is before A. D is immediately after C (C -> D). B is after D (C -> D -> B). E is not last. Since A is before the end and C executes before A, the sequence forces B to be the final executing server.',
    points: 20,
    averageTimeSeconds: 55,
  },

  // Pattern Recognition
  {
    id: 'iq_pattern_1',
    domain: 'pattern_recognition',
    difficulty: 3,
    question: 'Analyze the mathematical progression: 3, 7, 16, 35, 74, [ ? ]. Which value completes the series?',
    patternType: 'number_series',
    options: ['149', '153', '148', '155'],
    correctAnswerIndex: 1,
    explanation: 'The pattern is: x * 2 + 1, x * 2 + 2, x * 2 + 3, x * 2 + 4, x * 2 + 5. Specifically: 74 * 2 = 148, plus 5 = 153.',
    points: 15,
    averageTimeSeconds: 35,
  },
  {
    id: 'iq_pattern_2',
    domain: 'pattern_recognition',
    difficulty: 4,
    question: 'In a 3x3 visual matrix, Row 1 has shapes with (3 sides, 4 sides, 5 sides). Row 2 has (4 sides, 5 sides, 6 sides). Row 3 has (5 sides, 6 sides, [ ? ] sides). What is the missing shape?',
    patternType: 'visual_matrix',
    options: ['Heptagon (7 sides)', 'Octagon (8 sides)', 'Hexagon (6 sides)', 'Nonagon (9 sides)'],
    correctAnswerIndex: 0,
    explanation: 'Each row increments the polygon vertex count by 1 from left to right, and each column increments vertices by 1 downwards: 5 -> 6 -> 7 (Heptagon).',
    points: 20,
    averageTimeSeconds: 30,
  },

  // Verbal Aptitude
  {
    id: 'iq_verbal_1',
    domain: 'verbal_aptitude',
    difficulty: 2,
    question: 'EPHEMERAL is to PERMANENCE as VACILLATE is to: ?',
    patternType: 'analogies',
    options: ['Resolution', 'Hesitation', 'Oscillation', 'Uncertainty'],
    correctAnswerIndex: 0,
    explanation: 'Ephemeral is an antonym of permanence. Vacillate (to waver or hesitate) is an antonym of Resolution (firm determination).',
    points: 10,
    averageTimeSeconds: 30,
  },
  {
    id: 'iq_verbal_2',
    domain: 'verbal_aptitude',
    difficulty: 4,
    question: 'Which of the following statements exhibits a subtle logical fallacy of Affirming the Consequent?',
    patternType: 'deductive',
    options: [
      'If an algorithm has O(1) space, it uses fixed memory. Algorithm A uses fixed memory, therefore Algorithm A has O(1) space.',
      'If it rains, the grass is wet. It did not rain, therefore the grass is dry.',
      'Either the code compiles or there is a syntax error. It compiled, so there are no syntax errors.',
      'All binary search trees are trees. This graph is not a tree, therefore it is not a binary search tree.',
    ],
    correctAnswerIndex: 0,
    explanation: 'P -> Q ("O(1) space -> fixed memory"). Observing Q ("fixed memory") and concluding P ("therefore O(1) space") is the classic fallacy of Affirming the Consequent.',
    points: 20,
    averageTimeSeconds: 45,
  },

  // Analytical Thinking
  {
    id: 'iq_analytical_1',
    domain: 'analytical_thinking',
    difficulty: 3,
    question: 'A network pipeline has three sequential compression stages: Stage 1 reduces data size by 20%. Stage 2 reduces the remainder by 50%. Stage 3 reduces that remainder by 25%. What is the total overall percentage reduction from initial to final size?',
    patternType: 'deductive',
    options: ['70%', '75%', '65%', '80%'],
    correctAnswerIndex: 0,
    explanation: 'Initial = 1.0. After stage 1: 0.80. After stage 2: 0.80 * 0.50 = 0.40. After stage 3: 0.40 * 0.75 = 0.30. Final size is 30% of original, meaning a 70% total reduction.',
    points: 15,
    averageTimeSeconds: 45,
  },
  {
    id: 'iq_analytical_2',
    domain: 'analytical_thinking',
    difficulty: 5,
    question: 'You have 12 identical-looking microchips, exactly one of which is defective and has a slightly different weight (could be heavier or lighter). What is the MINIMUM number of balance scale weighings required to guarantee finding the defective chip AND whether it is heavier or lighter?',
    patternType: 'deductive',
    options: ['3 weighings', '4 weighings', '5 weighings', '2 weighings'],
    correctAnswerIndex: 0,
    explanation: 'With 3 ternary outcomes per weighing (-1, 0, +1), 3 weighings yield 3^3 = 27 states. 12 chips * 2 states (heavy or light) = 24 states. Because 24 <= 27, exactly 3 weighings suffice using an optimal decision tree.',
    points: 25,
    averageTimeSeconds: 60,
  },

  // Problem Solving
  {
    id: 'iq_problem_1',
    domain: 'problem_solving',
    difficulty: 3,
    question: 'A clock gains 10 minutes every hour. It was synchronized at 12:00 PM today. What is the real time when the clock shows 6:00 PM on the same day?',
    patternType: 'deductive',
    options: ['5:08 PM', '5:10 PM', '5:00 PM', '5:15 PM'],
    correctAnswerIndex: 0,
    explanation: 'In 60 real minutes, the clock advances 70 minutes. To advance 360 clock minutes (from 12:00 PM to 6:00 PM): (360 / 70) * 60 = 308.57 minutes = 5 hours 8 minutes and 34 seconds (approx 5:08 PM).',
    points: 15,
    averageTimeSeconds: 50,
  },
  {
    id: 'iq_problem_2',
    domain: 'problem_solving',
    difficulty: 5,
    question: 'Two trains start at the same time from Station A and Station B towards each other, traveling at 60 km/h and 90 km/h respectively. The distance between the stations is 300 km. A fast drone flies back and forth between the front of the two trains at 120 km/h until the trains collide. What is the TOTAL distance the drone travels?',
    patternType: 'deductive',
    options: ['240 km', '300 km', '180 km', '360 km'],
    correctAnswerIndex: 0,
    explanation: 'Relative speed of the two trains = 60 + 90 = 150 km/h. Time until trains collide = 300 km / 150 km/h = 2 hours. The drone flies continuously for 2 hours at 120 km/h. Distance = 2 * 120 = 240 km.',
    points: 25,
    averageTimeSeconds: 40,
  },
];

// -------------------------------------------------------------
// WEEKLY MOCK TESTS CATALOG
// -------------------------------------------------------------
export const WEEKLY_MOCK_TESTS: WeeklyMockTest[] = [
  {
    id: 'mock_w4_math',
    weekNumber: 4,
    title: 'Weekly Mock Test 4: Multivariable Calculus & Partial Derivatives',
    subject: 'Engineering Mathematics',
    durationMinutes: 30,
    totalMarks: 50,
    totalQuestions: 5,
    status: 'active',
    scheduledDate: '2026-09-20',
    deadlineDate: '2026-09-25',
    instructions: [
      'Each question carries 10 marks.',
      'Negative marking: -2.5 for incorrect answers.',
      'Instant AI step-by-step diagnostic breakdown upon submission.',
    ],
    questions: [
      {
        id: 'q1',
        subject: 'Engineering Mathematics',
        question: 'Find the directional derivative of f(x, y, z) = 2x^2 + 3y^2 + z^2 at the point P(2, 1, 3) in the direction of the vector v = i - 2k.',
        options: ['8 / sqrt(5)', '4 / sqrt(5)', '-4 / sqrt(5)', '12 / sqrt(5)'],
        correctAnswerIndex: 2,
        explanation: 'grad(f) = (4x)i + (6y)j + (2z)k. At P(2,1,3): grad(f) = 8i + 6j + 6k. Unit vector u = (i - 2k)/sqrt(1+4) = (i - 2k)/sqrt(5). Directional derivative = (8*1 + 6*0 + 6*(-2)) / sqrt(5) = (8 - 12) / sqrt(5) = -4 / sqrt(5).',
        marks: 10,
        conceptTag: 'Directional Derivatives & Gradient Vectors',
      },
      {
        id: 'q2',
        subject: 'Engineering Mathematics',
        question: 'If u = f(x - y, y - z, z - x), evaluate the expression: du/dx + du/dy + du/dz.',
        options: ['0', '1', '3', 'du/dx * du/dy * du/dz'],
        correctAnswerIndex: 0,
        explanation: 'Let r = x - y, s = y - z, t = z - x. By the multi-variable chain rule, du/dx = f_r - f_t; du/dy = -f_r + f_s; du/dz = -f_s + f_t. Summing all three cancels out all partial derivatives: sum = 0.',
        marks: 10,
        conceptTag: 'Multivariable Chain Rule',
      },
      {
        id: 'q3',
        subject: 'Engineering Mathematics',
        question: 'What is the radius of convergence of the power series sum( (2^n * x^n) / (n! + 1) ) from n=0 to infinity?',
        options: ['Infinity (converges for all real x)', '1/2', '2', '1'],
        correctAnswerIndex: 0,
        explanation: 'Applying the ratio test: lim |a_{n+1}/a_n| = lim (2^(n+1)/(n+1)!) / (2^n/n!) * |x| = lim (2/(n+1)) * |x| = 0 for all finite x. Therefore R = infinity.',
        marks: 10,
        conceptTag: 'Power Series & Convergence Radii',
      },
      {
        id: 'q4',
        subject: 'Engineering Mathematics',
        question: 'Which condition guarantees that the vector field F = P i + Q j is conservative in an open simply-connected domain?',
        options: ['dP/dy = dQ/dx', 'dP/dx = dQ/dy', 'dP/dy = -dQ/dx', 'div(F) = 0'],
        correctAnswerIndex: 0,
        explanation: 'By Green\'s Theorem and curl criteria for 2D fields, curl(F) = (dQ/dx - dP/dy) k = 0, which requires dP/dy = dQ/dx.',
        marks: 10,
        conceptTag: 'Conservative Vector Fields & Line Integrals',
      },
      {
        id: 'q5',
        subject: 'Engineering Mathematics',
        question: 'Evaluate the double integral of (x + y) dA over the triangular region with vertices (0,0), (1,0), and (0,1).',
        options: ['1/3', '1/6', '1/2', '2/3'],
        correctAnswerIndex: 0,
        explanation: 'Limits: x from 0 to 1, y from 0 to 1-x. Int_0^1 [xy + y^2/2]_0^(1-x) dx = Int_0^1 (x(1-x) + (1-x)^2/2) dx = Int_0^1 (1 - x^2)/2 dx = 1/2 [x - x^3/3]_0^1 = 1/2 * (2/3) = 1/3.',
        marks: 10,
        conceptTag: 'Double Integrals in Cartesian Coordinates',
      },
    ],
  },
  {
    id: 'mock_w5_ds',
    weekNumber: 5,
    title: 'Weekly Mock Test 5: Graph Algorithms & Dynamic Programming',
    subject: 'Data Structures & Algorithms',
    durationMinutes: 45,
    totalMarks: 50,
    totalQuestions: 5,
    status: 'upcoming',
    scheduledDate: '2026-09-27',
    deadlineDate: '2026-10-02',
    instructions: [
      'Covers Dijkstra, Bellman-Ford, Floyd-Warshall, and 0/1 Knapsack.',
      '45-minute timed examination with real-time complexity analysis.',
    ],
    questions: [],
  },
];

// -------------------------------------------------------------
// PERSONALIZED AI RECOMMENDATIONS
// -------------------------------------------------------------
export const STUDENT_RECOMMENDATIONS: PersonalizedRecommendations = {
  studentId: '1MS21CS042',
  generatedAt: new Date().toISOString(),
  executiveAdvice: 'Rahul, your overall mastery is at 88% (High Superior). Your core mathematical and data structure fundamentals are exceptionally strong. Focus 35 minutes today on Automata Pumping Lemma and multi-variable chain rule to eliminate the remaining risk factor in your Semester 5 record.',
  revisionTopics: [
    {
      id: 'rev_1',
      topicName: 'Pumping Lemma for Regular Languages',
      subject: 'Automata Theory',
      urgency: 'high',
      reason: 'Mid-term 1 error in string decomposition |w| >= p where xy^i z must satisfy |xy| <= p.',
      estimatedMinutes: 25,
      targetSimulatorId: 'topic-cs-recursion',
    },
    {
      id: 'rev_2',
      topicName: '3-Tier Nested Chain Rule in Calculus',
      subject: 'Engineering Mathematics',
      urgency: 'medium',
      reason: 'Handwritten test analysis showed missed innermost multiplier d/dx(3x^2) = 6x.',
      estimatedMinutes: 20,
      targetSimulatorId: 'topic-calculus-chain',
    },
    {
      id: 'rev_3',
      topicName: 'Snell’s Law & Total Internal Reflection Boundary',
      subject: 'Engineering Physics',
      urgency: 'low',
      reason: 'Periodic 48h spaced repetition refresher due today.',
      estimatedMinutes: 15,
      targetSimulatorId: 'topic-physics-optics',
    },
  ],
  dailyGoals: [
    { id: 'g1', title: 'Complete Weekly Mock Test 4 (Multivariable Calculus)', subject: 'Mathematics', targetMinutes: 30, isCompleted: false, xpReward: 150 },
    { id: 'g2', title: 'Interactive State Machine Visualizer Drill', subject: 'Automata Theory', targetMinutes: 20, isCompleted: true, xpReward: 100 },
    { id: 'g3', title: 'Solve 5 Adaptive Pattern Recognition Questions', subject: 'Cognitive Aptitude', targetMinutes: 15, isCompleted: false, xpReward: 75 },
  ],
  weeklySchedule: [
    { id: 's1', day: 'Mon', time: '17:00 - 18:00', subject: 'Engineering Mathematics', module: 'Partial Differential Equations', type: 'concept_drill' },
    { id: 's2', day: 'Tue', time: '17:30 - 18:15', subject: 'Automata Theory', module: 'DFA Minimization & Myhill-Nerode', type: 'recovery_bridge' },
    { id: 's3', day: 'Wed', time: '18:00 - 18:45', subject: 'Data Structures', module: 'Red-Black Tree Rotations', type: 'problem_solving' },
    { id: 's4', day: 'Thu', time: '17:00 - 17:45', subject: 'Computer Networks', module: 'TCP Flow Control & Sliding Windows', type: 'concept_drill' },
    { id: 's5', day: 'Fri', time: '16:30 - 17:30', subject: 'Engineering Mathematics', module: 'Weekly Timed Mock Test', type: 'mock_test' },
    { id: 's6', day: 'Sat', time: '10:00 - 11:00', subject: 'AI & Machine Learning', module: 'Gradient Descent Simulation', type: 'problem_solving' },
  ],
  recommendedMockTests: [
    { id: 'mock_w4_math', title: 'Weekly Mock Test 4: Multivariable Calculus', subject: 'Engineering Mathematics', difficulty: 'Advanced', reason: 'High alignment with your upcoming semester assessment' },
    { id: 'mock_w5_ds', title: 'Weekly Mock Test 5: Graph Algorithms', subject: 'Data Structures', difficulty: 'Intermediate', reason: 'Consolidates Dijkstra & Minimum Spanning Trees' },
  ],
  learningResources: [
    { id: 'r1', title: 'Interactive Chain Rule Animated Geometer', type: 'interactive_simulator', subject: 'Mathematics', duration: '12 min', provider: 'EduBridge Visual Lab', badgeText: 'Live Lab' },
    { id: 'r2', title: 'Pumping Lemma Step-by-Step Proof Masterclass', type: 'video_lecture', subject: 'Automata Theory', duration: '18 min', provider: 'MIT OpenCourseWare Series', badgeText: 'High Rated' },
    { id: 'r3', title: 'Red-Black Trees Self-Balancing Cheatsheet', type: 'cheatsheet', subject: 'Data Structures', duration: '5 min read', provider: 'EduBridge QuickDocs', badgeText: 'PDF Summary' },
  ],
};

// -------------------------------------------------------------
// FACULTY CLASS ROSTER (Cohort of Students for Analytics)
// -------------------------------------------------------------
export const FACULTY_CLASS_STUDENTS: FacultyClassStudentItem[] = [
  { id: 'std_101', usn: '1MS21CS042', name: 'Rahul Sharma', department: 'Computer Science & Engineering', semester: 5, section: 'A', cgpa: 8.74, currentAttendance: 89.2, riskLevel: 'safe', recentEvaluationScore: 84.5, lastActive: '10 mins ago', weakestSubject: 'Automata Theory', iqScore: 128 },
  { id: 'std_102', usn: '1MS21CS018', name: 'Ananya Deshmukh', department: 'Computer Science & Engineering', semester: 5, section: 'A', cgpa: 9.32, currentAttendance: 96.4, riskLevel: 'safe', recentEvaluationScore: 94.0, lastActive: '1 hour ago', weakestSubject: 'Computer Networks', iqScore: 134 },
  { id: 'std_103', usn: '1MS21CS077', name: 'Karthik Raja', department: 'Computer Science & Engineering', semester: 5, section: 'B', cgpa: 6.94, currentAttendance: 76.5, riskLevel: 'high_risk', recentEvaluationScore: 52.0, lastActive: '2 days ago', weakestSubject: 'Calculus & Linear Algebra', iqScore: 104 },
  { id: 'std_104', usn: '1MS21CS053', name: 'Sneha Patel', department: 'Computer Science & Engineering', semester: 5, section: 'A', cgpa: 8.12, currentAttendance: 87.0, riskLevel: 'moderate', recentEvaluationScore: 71.5, lastActive: '3 hours ago', weakestSubject: 'Automata Theory', iqScore: 118 },
  { id: 'std_105', usn: '1MS21CS091', name: 'Vikramaditya Roy', department: 'Computer Science & Engineering', semester: 5, section: 'B', cgpa: 7.28, currentAttendance: 79.2, riskLevel: 'moderate', recentEvaluationScore: 64.0, lastActive: 'Yesterday', weakestSubject: 'Database Management Systems', iqScore: 112 },
  { id: 'std_106', usn: '1MS21CS005', name: 'Aakash Verma', department: 'Computer Science & Engineering', semester: 5, section: 'A', cgpa: 6.45, currentAttendance: 72.0, riskLevel: 'high_risk', recentEvaluationScore: 46.0, lastActive: '4 days ago', weakestSubject: 'Design & Analysis of Algorithms', iqScore: 98 },
  { id: 'std_107', usn: '1MS21CS112', name: 'Zoya Akhtar', department: 'Computer Science & Engineering', semester: 5, section: 'B', cgpa: 8.95, currentAttendance: 94.0, riskLevel: 'safe', recentEvaluationScore: 88.0, lastActive: '30 mins ago', weakestSubject: 'Microcontrollers', iqScore: 126 },
  { id: 'std_108', usn: '1MS21CS034', name: 'Devendra Joshi', department: 'Computer Science & Engineering', semester: 5, section: 'A', cgpa: 7.65, currentAttendance: 84.5, riskLevel: 'moderate', recentEvaluationScore: 68.0, lastActive: '5 hours ago', weakestSubject: 'Engineering Physics', iqScore: 115 },
  { id: 'std_109', usn: '1MS21EC021', name: 'Rohan Mehta', department: 'Electronics & Communication', semester: 5, section: 'A', cgpa: 7.15, currentAttendance: 78.4, riskLevel: 'moderate', recentEvaluationScore: 62.0, lastActive: '1 day ago', weakestSubject: 'Signals & Systems', iqScore: 110 },
  { id: 'std_110', usn: '1MS21EC045', name: 'Divya Nair', department: 'Electronics & Communication', semester: 5, section: 'B', cgpa: 9.15, currentAttendance: 95.2, riskLevel: 'safe', recentEvaluationScore: 91.0, lastActive: '2 hours ago', weakestSubject: 'Digital Signal Processing', iqScore: 130 },
  { id: 'std_111', usn: '1MS22CS014', name: 'Chirag Saxena', department: 'Computer Science & Engineering', semester: 3, section: 'A', cgpa: 7.80, currentAttendance: 85.0, riskLevel: 'moderate', recentEvaluationScore: 73.0, lastActive: '3 hours ago', weakestSubject: 'Data Structures', iqScore: 116 },
  { id: 'std_112', usn: '1MS20CS089', name: 'Pooja Hegde', department: 'Computer Science & Engineering', semester: 7, section: 'A', cgpa: 9.40, currentAttendance: 97.0, riskLevel: 'safe', recentEvaluationScore: 95.0, lastActive: 'Just now', weakestSubject: 'Distributed Computing', iqScore: 138 },
];

// Sample Answer Sheet Evaluation Report stored for instant preview
export const RECENT_ANSWER_SHEET_REPORT: AnswerSheetEvaluationReport = {
  id: 'eval_rep_2026_09',
  timestamp: '2026-09-21T14:32:00Z',
  student: {
    name: 'Rahul Sharma',
    rollNumber: '1MS21CS042',
    subject: 'Engineering Mathematics - Multivariable Calculus',
    examCode: 'MIDTERM-2-MAT',
    date: '2026-09-21',
    questionNumbersDetected: ['Q1', 'Q2', 'Q3'],
  },
  ocrConfidence: 96.8,
  evaluationConfidence: 94.2,
  totalScore: 21,
  maxScore: 25,
  percentage: 84.0,
  grade: 'A',
  predictedFinalScoreRange: '82 - 88%',
  predictedPercentile: 91.5,
  overallStrengths: [
    'Clean step-by-step mathematical notation with proper differential operator alignment',
    'Accurate outer-inner function identification on Q1',
    'Correct substitution of boundary conditions in Q3',
  ],
  overallWeaknesses: [
    'Missed innermost derivative term d/dx(3x^2) in Q2 3-tier chain rule calculation',
    'Omitted intermediate justification for absolute value signs in logarithmic integration',
  ],
  executiveSummary: 'Demonstrated high procedural fluency in algebraic manipulation. 1 fundamental prerequisite error detected in Q2 where the student differentiated nested composite layers simultaneously instead of multiplying sequentially.',
  questions: [
    {
      questionNumber: 'Q1',
      questionText: 'Differentiate y = sin(x^3 + 2x) with respect to x using the Chain Rule.',
      extractedHandwrittenText: 'y = sin(x^3 + 2x)\nLet u = x^3 + 2x, then y = sin(u)\ndy/du = cos(u)\ndu/dx = 3x^2 + 2\ndy/dx = dy/du * du/dx = cos(x^3 + 2x) * (3x^2 + 2)',
      expectedAnswer: 'dy/dx = (3x^2 + 2) cos(x^3 + 2x)',
      keyPointsExpected: ['Identification of inner function u', 'Derivative of sin(u)', 'Derivative of 3x^2+2', 'Product of rates'],
      keyPointsFound: ['Identification of inner function u', 'Derivative of sin(u)', 'Derivative of 3x^2+2', 'Product of rates'],
      missingPoints: [],
      incorrectConcepts: [],
      marksAwarded: 8,
      maxMarks: 8,
      status: 'good',
      nlpMetrics: { relevance: 98, keywordCoverage: 100, conceptAccuracy: 100, completeness: 100, clarityAndGrammar: 96 },
      feedbackSummary: 'Flawless execution. Explicitly defined intermediate variable u and correctly multiplied rates.',
      improvementTip: 'Maintain this level of rigor on the final examination.',
      visualConceptKey: 'topic-calculus-chain',
    },
    {
      questionNumber: 'Q2',
      questionText: 'Evaluate d/dx [ ln( cos(3x^2 + 1) ) ] with complete reasoning.',
      extractedHandwrittenText: 'd/dx [ ln(cos(3x^2 + 1)) ]\n= (1 / cos(3x^2 + 1)) * (-sin(3x^2 + 1)) * (3x)\n= -3x * tan(3x^2 + 1)',
      expectedAnswer: '-6x * tan(3x^2 + 1)',
      keyPointsExpected: ['1/cos term for ln', '-sin for cos', '6x for (3x^2+1)', 'Simplification to -6x tan(3x^2+1)'],
      keyPointsFound: ['1/cos term for ln', '-sin for cos', 'Simplification to tan'],
      missingPoints: ['Innermost derivative factor should be 6x, wrote 3x'],
      incorrectConcepts: ['Differentiated 3x^2 as 3x instead of 2 * 3x = 6x'],
      marksAwarded: 6,
      maxMarks: 10,
      status: 'needs_work',
      nlpMetrics: { relevance: 88, keywordCoverage: 80, conceptAccuracy: 70, completeness: 75, clarityAndGrammar: 90 },
      feedbackSummary: 'Correct structural intuition of 3-layer nesting, but committed a power-rule failure: d/dx(3x^2) = 6x, not 3x.',
      improvementTip: 'Carefully compute each derivative tier independently before multiplying.',
      conceptToReview: 'Power rule factor multiplication in nested functions',
      visualConceptKey: 'topic-calculus-chain',
    },
    {
      questionNumber: 'Q3',
      questionText: 'A spherical balloon is inflating such that dV/dt = 12 cm^3/s. Find dr/dt when radius r = 2 cm.',
      extractedHandwrittenText: 'V = (4/3) pi r^3\ndV/dt = 4 pi r^2 (dr/dt)\n12 = 4 pi (2)^2 (dr/dt) = 16 pi (dr/dt)\ndr/dt = 12 / (16 pi) = 3 / (4 pi) cm/s',
      expectedAnswer: 'dr/dt = 3 / (4 pi) cm/s approx 0.239 cm/s',
      keyPointsExpected: ['Volume formula V = 4/3 pi r^3', 'Implicit differentiation dV/dt = 4 pi r^2 dr/dt', 'Substitution r = 2', 'dr/dt = 3/(4pi) cm/s'],
      keyPointsFound: ['Volume formula V = 4/3 pi r^3', 'Implicit differentiation dV/dt = 4 pi r^2 dr/dt', 'Substitution r = 2', 'dr/dt = 3/(4pi) cm/s'],
      missingPoints: [],
      incorrectConcepts: [],
      marksAwarded: 7,
      maxMarks: 7,
      status: 'good',
      nlpMetrics: { relevance: 96, keywordCoverage: 98, conceptAccuracy: 100, completeness: 98, clarityAndGrammar: 95 },
      feedbackSummary: 'Excellent geometric rate relation and algebraic simplification with correct physical units.',
      improvementTip: 'Adding the decimal approximation (0.239 cm/s) earns bonus points in applied physics.',
    },
  ],
  recoveryPlan: {
    immediateAction: 'Complete the 3-Tier Nested Chain Rule interactive visual drill before the next tutorial.',
    items: [
      { topic: 'Power Rule Factor Multiplication in Nested Functions', priority: 'high', estimatedTime: '15 mins', actionAdvice: 'Review d/dx(a*x^n) = a*n*x^(n-1) to eliminate slip-ups.', targetConceptId: 'topic-calculus-chain' },
      { topic: 'Logarithmic Differentiation Properties', priority: 'medium', estimatedTime: '10 mins', actionAdvice: 'Review domain restrictions where ln(f(x)) is valid.', targetConceptId: 'topic-calculus-chain' },
    ],
    suggestedSimulators: ['topic-calculus-chain'],
  },
  language: 'English',
};
