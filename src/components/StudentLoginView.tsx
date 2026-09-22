import React from 'react';
import { UserProfile, UserRole } from '../types';
import { GraduationCap, ArrowRight, UserCheck, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

interface StudentLoginViewProps {
  initialRole: UserRole;
  onContinue: (role: UserRole) => void;
}

export const StudentLoginView: React.FC<StudentLoginViewProps> = ({
  initialRole,
  onContinue,
}) => {
  const [selectedRole, setSelectedRole] = React.useState<UserRole>(initialRole);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Step 1 of 12 &bull; Identity &amp; Role Setup
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome to EduBridge AI
        </h2>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Choose your account profile to initiate personalized gap detection or access institutional cohort analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Student Profile Card */}
        <div
          onClick={() => setSelectedRole('student')}
          className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedRole === 'student'
              ? 'bg-white border-indigo-600 shadow-lg ring-2 ring-indigo-500/20'
              : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:shadow-sm'
          }`}
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                Role: Student Learner
              </span>
              <h3 className="text-lg font-bold text-slate-900">Alex Rivera</h3>
              <p className="text-xs text-slate-500">Sophomore &bull; Undergraduate STEM Honors</p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Take diagnostic checks, uncover hidden prerequisite gaps, and heal them with real-time interactive concept visualizers.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
            <span>{selectedRole === 'student' ? '✓ Profile Selected' : 'Select Student'}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Faculty Profile Card */}
        <div
          onClick={() => setSelectedRole('faculty')}
          className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedRole === 'faculty'
              ? 'bg-white border-indigo-600 shadow-lg ring-2 ring-indigo-500/20'
              : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:shadow-sm'
          }`}
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">
                Role: Faculty / Instructor
              </span>
              <h3 className="text-lg font-bold text-slate-900">Dr. Eleanor Vance</h3>
              <p className="text-xs text-slate-500">Department Chair &bull; Physical Sciences &amp; Math</p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Monitor cohort-wide bottleneck heatmaps, identify recurring prerequisite gaps, and deploy targeted classroom interventions.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-600">
            <span>{selectedRole === 'faculty' ? '✓ Profile Selected' : 'Select Faculty'}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-center pt-2">
        <button
          onClick={() => onContinue(selectedRole)}
          className="inline-flex items-center space-x-2 px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-200 transition"
        >
          <span>
            {selectedRole === 'student'
              ? 'Proceed to Step 2: Select Subject & Topic'
              : 'Access Faculty Insight Dashboard'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
