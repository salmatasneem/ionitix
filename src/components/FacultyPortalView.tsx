import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Users,
  AlertTriangle,
  Download,
  BarChart2,
  GraduationCap,
  TrendingUp,
  Building,
  CheckCircle2,
  X,
  FileSpreadsheet,
  Printer,
  ChevronRight,
  Eye,
  LogOut,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  FACULTY_CLASS_STUDENTS,
  CURRENT_FACULTY,
  STUDENT_SEMESTER_HISTORY,
  STUDENT_RISK_PROFILE,
  RECENT_ANSWER_SHEET_REPORT,
} from '../data/mockStudentDatabase';
import { FacultyClassStudentItem } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface FacultyPortalViewProps {
  onLogout: () => void;
  onSelectStudentDetail?: (studentId: string) => void;
}

export function FacultyPortalView({
  onLogout,
  onSelectStudentDetail,
}: FacultyPortalViewProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All Departments');
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<FacultyClassStudentItem | null>(null);

  // Filter students
  const filteredStudents = FACULTY_CLASS_STUDENTS.filter((st) => {
    const matchesDept =
      selectedDepartment === 'All Departments' || st.department === selectedDepartment;
    const matchesSem = selectedSemester === 'all' || st.semester === selectedSemester;
    const matchesRisk = selectedRiskFilter === 'all' || st.riskLevel === selectedRiskFilter;
    const matchesSearch =
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.usn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.weakestSubject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSem && matchesRisk && matchesSearch;
  });

  // Analytics Metrics
  const totalCount = FACULTY_CLASS_STUDENTS.length;
  const highRiskCount = FACULTY_CLASS_STUDENTS.filter((s) => s.riskLevel === 'high_risk').length;
  const moderateRiskCount = FACULTY_CLASS_STUDENTS.filter((s) => s.riskLevel === 'moderate').length;
  const safeCount = FACULTY_CLASS_STUDENTS.filter((s) => s.riskLevel === 'safe').length;

  const averageCGPA = (
    FACULTY_CLASS_STUDENTS.reduce((acc, s) => acc + s.cgpa, 0) / totalCount
  ).toFixed(2);

  const averageAttendance = (
    FACULTY_CLASS_STUDENTS.reduce((acc, s) => acc + s.currentAttendance, 0) / totalCount
  ).toFixed(1);

  // Chart Data: Grade / GPA Distribution
  const gpaDistributionData = [
    { range: '9.0 - 10.0', count: 3, fill: '#10b981' },
    { range: '8.0 - 8.9', count: 4, fill: '#6366f1' },
    { range: '7.0 - 7.9', count: 3, fill: '#8b5cf6' },
    { range: '< 7.0 (At Risk)', count: 2, fill: '#f43f5e' },
  ];

  const riskPieData = [
    { name: 'Safe', value: safeCount, color: '#10b981' },
    { name: 'Moderate Risk', value: moderateRiskCount, color: '#f59e0b' },
    { name: 'High Academic Risk', value: highRiskCount, color: '#f43f5e' },
  ];

  const handleExportCSV = () => {
    const headers = ['USN', 'Name', 'Department', 'Semester', 'CGPA', 'Attendance', 'Risk Level', 'Weakest Subject'];
    const rows = filteredStudents.map((s) => [
      s.usn,
      `"${s.name}"`,
      `"${s.department}"`,
      s.semester,
      s.cgpa,
      `${s.currentAttendance}%`,
      s.riskLevel,
      `"${s.weakestSubject}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Faculty_Analytics_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070913] text-slate-900 dark:text-white transition-colors pb-16 ai-mesh-bg">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/75 dark:bg-slate-950/75 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-700 p-0.5 shadow-md">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                  EduBridge Faculty Intelligence
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  Dean / Faculty Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {CURRENT_FACULTY.name} &bull; {CURRENT_FACULTY.department}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle />

            <button
              onClick={handleExportCSV}
              className="px-3 py-2 text-xs font-bold rounded-xl border border-purple-200 dark:border-purple-800/80 hover:bg-purple-50 dark:hover:bg-purple-950/50 text-purple-700 dark:text-purple-300 transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
              title="Download Departmental CSV Summary"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition flex items-center space-x-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* KPI Metric Bento */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>Cohort Size</span>
              <Users className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalCount}
            </div>
            <div className="text-[11px] text-slate-400">Enrolled Students across 3 depts</div>
          </div>

          <div className="p-5 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>Average CGPA</span>
              <GraduationCap className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {averageCGPA}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              +0.28 vs Previous Year
            </div>
          </div>

          <div className="p-5 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>Avg Attendance</span>
              <BarChart2 className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {averageAttendance}%
            </div>
            <div className="text-[11px] text-slate-400">Above 85% VTU threshold</div>
          </div>

          <div className="p-5 rounded-3xl glass-card border border-rose-500/30 space-y-1">
            <div className="flex items-center justify-between text-xs text-rose-500 font-medium">
              <span>Academic Risk Alert</span>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
              {highRiskCount}
            </div>
            <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
              Require immediate intervention
            </div>
          </div>
        </div>

        {/* Analytics Visualizers (Class Distribution & Risk Breakdown) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* GPA Distribution (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Class CGPA Distribution</span>
              </h4>
              <span className="text-xs text-slate-400">Cohort Benchmark</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gpaDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="range" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      fontSize: '12px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="count" name="Students" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Pie Breakdown (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>AI Dropout &amp; Backlog Risk Categorization</span>
            </h4>

            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      fontSize: '12px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-around text-xs pt-1 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Safe ({safeCount})</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Moderate ({moderateRiskCount})</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>High Risk ({highRiskCount})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Student Roster Section with Filters */}
        <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Student Performance &amp; Risk Roster
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any student to inspect previous year marks, handwritten evaluation reports, and personalized risk profiles.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search USN or Name..."
                  className="pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Department Filter */}
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden"
              >
                <option value="All Departments">All Departments</option>
                <option value="Computer Science & Engineering">Computer Science</option>
                <option value="Electronics & Communication">Electronics &amp; Comm</option>
              </select>

              {/* Semester Filter */}
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden"
              >
                <option value="all">All Semesters</option>
                <option value="3">Semester 3</option>
                <option value="5">Semester 5</option>
                <option value="7">Semester 7</option>
              </select>

              {/* Risk Filter */}
              <select
                value={selectedRiskFilter}
                onChange={(e) => setSelectedRiskFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden"
              >
                <option value="all">All Risk Levels</option>
                <option value="safe">Safe Only</option>
                <option value="moderate">Moderate Risk</option>
                <option value="high_risk">High Academic Risk</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="py-2.5 px-3 font-semibold">USN</th>
                  <th className="py-2.5 px-3 font-semibold">Student Name</th>
                  <th className="py-2.5 px-3 font-semibold">Department &amp; Sem</th>
                  <th className="py-2.5 px-3 font-semibold text-center">CGPA</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Attendance</th>
                  <th className="py-2.5 px-3 font-semibold text-center">AI IQ</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Weak Subject Area</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Risk Prediction</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredStudents.map((st) => (
                  <tr
                    key={st.id}
                    onClick={() => setSelectedStudentForModal(st)}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition cursor-pointer"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-purple-600 dark:text-purple-400">
                      {st.usn}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                      {st.name}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                      {st.department.replace('Engineering', 'Engg')} &bull; Sem {st.semester}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900 dark:text-white">
                      {st.cgpa}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`font-semibold ${
                          st.currentAttendance < 85
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {st.currentAttendance}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-indigo-600 dark:text-indigo-400">
                      {st.iqScore || 120}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-300">
                      {st.weakestSubject}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          st.riskLevel === 'safe'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : st.riskLevel === 'moderate'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                        }`}
                      >
                        {st.riskLevel.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStudentForModal(st);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 font-bold text-xs transition flex items-center space-x-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Individual Student Deep-Dive Modal */}
      {selectedStudentForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl glass-card border border-purple-500/30 text-slate-900 dark:text-white shadow-2xl space-y-5">
            <button
              onClick={() => setSelectedStudentForModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Student Header */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="text-[11px] font-mono font-bold text-purple-600 dark:text-purple-400 uppercase">
                {selectedStudentForModal.usn} &bull; Semester {selectedStudentForModal.semester}
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                {selectedStudentForModal.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {selectedStudentForModal.department} &bull; Section {selectedStudentForModal.section}
              </p>
            </div>

            {/* Key Scores Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block">Current CGPA</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedStudentForModal.cgpa}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block">Attendance</span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedStudentForModal.currentAttendance}%
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block">Adaptive IQ</span>
                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  {selectedStudentForModal.iqScore || 128}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block">Risk Status</span>
                <span
                  className={`text-xs font-bold uppercase ${
                    selectedStudentForModal.riskLevel === 'safe'
                      ? 'text-emerald-600'
                      : 'text-rose-600'
                  }`}
                >
                  {selectedStudentForModal.riskLevel.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Academic Risk Assessment Card */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 space-y-2 text-xs">
              <div className="flex items-center space-x-2 font-bold text-indigo-900 dark:text-indigo-200">
                <AlertTriangle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>AI Predictive Risk Diagnosis</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300">
                Weakness detected in <strong>{selectedStudentForModal.weakestSubject}</strong>. Prerequisite gap identified in algebraic decomposition and chain rule applications. Recommended action: Assign 48h spaced repetition refresher before mid-term 2.
              </p>
            </div>

            {/* Previous Year Subject Records Preview */}
            <div className="space-y-2 text-xs">
              <h5 className="font-bold text-slate-900 dark:text-white">
                Historical Academic Progression (Recent Semesters)
              </h5>
              <div className="space-y-1.5">
                {STUDENT_SEMESTER_HISTORY.slice(-3).map((sem) => (
                  <div
                    key={sem.semesterNumber}
                    className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {sem.semesterName} ({sem.academicYear})
                    </span>
                    <div className="flex items-center space-x-3 font-semibold">
                      <span className="text-indigo-600 dark:text-indigo-400">SGPA: {sem.sgpa}</span>
                      <span className="text-emerald-600 dark:text-emerald-400">{sem.overallAttendance}% Attendance</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Close */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedStudentForModal(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition shadow-md cursor-pointer"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
