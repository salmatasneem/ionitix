import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import {
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  BookOpen,
  Award,
  Zap,
  ArrowRight,
  Filter,
} from 'lucide-react';
import {
  STUDENT_SEMESTER_HISTORY,
  STUDENT_RISK_PROFILE,
  CURRENT_STUDENT,
} from '../data/mockStudentDatabase';
import { SemesterRecord } from '../types';

interface PreviousYearPerformanceViewProps {
  onBackToDashboard: () => void;
  onNavigateToSimulator?: (simulatorId: string) => void;
}

export function PreviousYearPerformanceView({
  onBackToDashboard,
  onNavigateToSimulator,
}: PreviousYearPerformanceViewProps) {
  const [selectedSemester, setSelectedSemester] = useState<number>(5);

  const activeSemesterRecord =
    STUDENT_SEMESTER_HISTORY.find((s) => s.semesterNumber === selectedSemester) ||
    STUDENT_SEMESTER_HISTORY[STUDENT_SEMESTER_HISTORY.length - 1];

  const sgpaTrendData = STUDENT_SEMESTER_HISTORY.map((s) => ({
    name: `Sem ${s.semesterNumber}`,
    sgpa: s.sgpa,
    attendance: s.overallAttendance,
  }));

  const subjectChartData = activeSemesterRecord.subjects.map((sub) => ({
    name: sub.code,
    fullName: sub.name,
    internal: sub.internalMarks,
    external: sub.externalMarks,
    total: sub.totalMarks,
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center space-x-1.5"
        >
          <span>&larr; Back to Student Dashboard</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center space-x-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Academic History &amp; Risk Intelligence</span>
          </span>
        </div>
      </div>

      {/* AI Academic Risk & Early Warning Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-indigo-500/30 relative overflow-hidden space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                STUDENT_RISK_PROFILE.riskLevel === 'safe'
                  ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400'
                  : 'bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400'
              }`}
            >
              {STUDENT_RISK_PROFILE.riskLevel === 'safe' ? (
                <ShieldCheck className="w-6 h-6" />
              ) : (
                <AlertTriangle className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Academic Trajectory Status:
                </h3>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                    STUDENT_RISK_PROFILE.riskLevel === 'safe'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {STUDENT_RISK_PROFILE.riskLevel.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                AI Institutional Risk Index: {STUDENT_RISK_PROFILE.riskScore}/100 &bull; Predicted Semester 5 GPA: <strong>{STUDENT_RISK_PROFILE.predictedSemesterGPA}</strong> ({STUDENT_RISK_PROFILE.confidenceInterval})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block font-medium">Cumulative CGPA</span>
              <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                {CURRENT_STUDENT.cgpa}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block font-medium">Avg Attendance</span>
              <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                {CURRENT_STUDENT.attendanceRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Risk Indicators & Early Warning Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2">
            <div className="flex items-center space-x-1.5 font-bold text-amber-900 dark:text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Identified Risk Factors &amp; Early Alerts</span>
            </div>
            <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 list-disc pl-4">
              {STUDENT_RISK_PROFILE.keyRiskFactors.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
              {STUDENT_RISK_PROFILE.earlyWarningAlerts.map((a, i) => (
                <li key={`a-${i}`} className="text-amber-800 dark:text-amber-300 font-medium">{a}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 space-y-2">
            <div className="flex items-center space-x-1.5 font-bold text-indigo-900 dark:text-indigo-200">
              <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>AI Automated Mitigation Roadmap</span>
            </div>
            <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 list-disc pl-4">
              {STUDENT_RISK_PROFILE.mitigationRecommendations.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Multi-Semester SGPA Progression Trend (Line Chart) */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 font-bold text-sm text-slate-900 dark:text-white">
            <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Multi-Semester SGPA &amp; Attendance Progression</span>
          </div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            Overall Upward Velocity: +0.36 SGPA
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sgpaTrendData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis yAxisId="left" domain={[7.5, 10]} stroke="#6366f1" fontSize={11} />
              <YAxis yAxisId="right" orientation="right" domain={[70, 100]} stroke="#10b981" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: '12px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="sgpa"
                name="Semester SGPA"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="attendance"
                name="Attendance (%)"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Semester Selector & Detailed Database Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Subject-Wise Examination Marks &amp; Credits Database
            </h4>
          </div>

          {/* Semester Selector Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            {STUDENT_SEMESTER_HISTORY.map((sem) => (
              <button
                key={sem.semesterNumber}
                type="button"
                onClick={() => setSelectedSemester(sem.semesterNumber)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedSemester === sem.semesterNumber
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {sem.semesterName}
              </button>
            ))}
          </div>
        </div>

        {/* Current Selected Semester Overview Card */}
        <div className="p-5 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
            <div>
              <span className="text-xs text-slate-400">Academic Year: {activeSemesterRecord.academicYear}</span>
              <h5 className="text-base font-bold text-slate-900 dark:text-white">
                {activeSemesterRecord.semesterName} Detailed Scorecard
              </h5>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                SGPA: {activeSemesterRecord.sgpa}
              </span>
              <span className="text-slate-400">&bull;</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Total Credits: {activeSemesterRecord.totalCredits}
              </span>
              <span className="text-slate-400">&bull;</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                Attendance: {activeSemesterRecord.overallAttendance}%
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="py-2.5 px-3 font-semibold">Course Code</th>
                  <th className="py-2.5 px-3 font-semibold">Subject Title</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Credits</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Internal (50)</th>
                  <th className="py-2.5 px-3 font-semibold text-center">External (50)</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Total (100)</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Grade</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Attendance</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {activeSemesterRecord.subjects.map((sub) => (
                  <tr
                    key={sub.code}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {sub.code}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-900 dark:text-white">
                      {sub.name}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-400">
                      {sub.credits}
                    </td>
                    <td className="py-3 px-3 text-center font-medium text-slate-700 dark:text-slate-300">
                      {sub.internalMarks}
                    </td>
                    <td className="py-3 px-3 text-center font-medium text-slate-700 dark:text-slate-300">
                      {sub.externalMarks}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900 dark:text-white">
                      {sub.totalMarks}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-md font-extrabold text-[11px] bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {sub.grade}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`font-semibold ${
                          sub.attendancePercentage < 85
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {sub.attendancePercentage}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          sub.status === 'cleared'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                        }`}
                      >
                        {sub.status === 'cleared' ? 'Cleared' : 'In Progress'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
