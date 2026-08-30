import React, { useState } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  Sparkles, 
  Calculator, 
  Percent, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Target
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SubjectRow {
  id: string;
  name: string;
  credits: number;
  gradePoint: number;
}

export const AcademicGradeToolkit: React.FC = () => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'cgpa' | 'attendance' | 'target'>('cgpa');

  // CGPA / SGPA State
  const [gradingScale, setGradingScale] = useState<'10' | '4'>('10');
  const [subjects, setSubjects] = useState<SubjectRow[]>([
    { id: '1', name: 'Data Structures & Algorithms', credits: 4, gradePoint: 9 },
    { id: '2', name: 'Computer Networks', credits: 3, gradePoint: 8 },
    { id: '3', name: 'Database Management', credits: 4, gradePoint: 10 },
    { id: '4', name: 'Operating Systems', credits: 3, gradePoint: 8 },
    { id: '5', name: 'Engineering Mathematics', credits: 4, gradePoint: 7 },
  ]);

  // Attendance State
  const [attendedClasses, setAttendedClasses] = useState<number>(38);
  const [totalClasses, setTotalClasses] = useState<number>(45);
  const [targetPercentage, setTargetPercentage] = useState<number>(75);

  // Target Marks State
  const [currentInternalMarks, setCurrentInternalMarks] = useState<number>(32);
  const [internalMaxMarks, setInternalMaxMarks] = useState<number>(40);
  const [desiredTotalGrade, setDesiredTotalGrade] = useState<number>(85); // 85%
  const [finalExamWeight, setFinalExamWeight] = useState<number>(60); // 60 marks final exam

  // SGPA Calculation
  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
  const weightedPoints = subjects.reduce((sum, s) => sum + s.credits * s.gradePoint, 0);
  const calculatedSGPA = totalCredits > 0 ? (weightedPoints / totalCredits).toFixed(2) : '0.00';
  const calculatedPercentage = totalCredits > 0 ? ((Number(calculatedSGPA) * 9.5).toFixed(1)) : '0.0';

  const addSubject = () => {
    const newId = String(Date.now());
    setSubjects(prev => [
      ...prev,
      { id: newId, name: `Subject ${prev.length + 1}`, credits: 3, gradePoint: 8 }
    ]);
  };

  const removeSubject = (id: string) => {
    if (subjects.length <= 1) {
      showToast('You must keep at least 1 subject row.', 'info');
      return;
    }
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  const updateSubject = (id: string, field: keyof SubjectRow, val: any) => {
    setSubjects(prev =>
      prev.map(s => (s.id === id ? { ...s, [field]: val } : s))
    );
  };

  // Attendance Calculation
  const currentAttendancePct = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
  
  // Calculate safe bunks or required classes
  let bunkStatusMessage = '';
  let canBunkCount = 0;
  let mustAttendCount = 0;

  if (totalClasses > 0) {
    if (currentAttendancePct >= targetPercentage) {
      // Attended / (Total + X) >= Target / 100 => Attended * 100 / Target - Total = X
      canBunkCount = Math.floor((attendedClasses * 100) / targetPercentage - totalClasses);
      bunkStatusMessage = `You are on track! You can safely miss (bunk) ${canBunkCount} more upcoming class${canBunkCount === 1 ? '' : 'es'} while maintaining ${targetPercentage}% attendance.`;
    } else {
      // (Attended + Y) / (Total + Y) >= Target / 100
      // 100 * Attended + 100 Y >= Target * Total + Target * Y
      // Y * (100 - Target) >= Target * Total - 100 * Attended
      const denom = 100 - targetPercentage;
      if (denom > 0) {
        mustAttendCount = Math.ceil((targetPercentage * totalClasses - 100 * attendedClasses) / denom);
        bunkStatusMessage = `Warning: Attendance is currently below ${targetPercentage}%. You must attend the next ${mustAttendCount} consecutive class${mustAttendCount === 1 ? '' : 'es'} without missing any to recover!`;
      }
    }
  }

  // Target Marks Calculation
  // Total = Internal + (Final_Score / Final_Max) * Final_Weight
  // Final_Score needed = Desired - Internal
  const maxInternalPercent = (currentInternalMarks / internalMaxMarks) * 100;
  const marksNeededInFinal = Math.max(0, desiredTotalGrade - currentInternalMarks);

  return (
    <div className="space-y-8">
      {/* Tab Switcher */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('cgpa')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'cgpa'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          CGPA & SGPA Multi-Subject Calculator
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'attendance'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Attendance & Bunk Planner
        </button>

        <button
          onClick={() => setActiveTab('target')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'target'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Target className="w-4 h-4" />
          Target Exam Marks Required
        </button>
      </div>

      {/* TAB 1: CGPA / SGPA */}
      {activeTab === 'cgpa' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Subjects Grid (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Semester Course List ({subjects.length} Subjects)
                </h3>

                <button
                  onClick={addSubject}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 text-xs font-bold hover:bg-blue-100 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Course
                </button>
              </div>

              <div className="space-y-3">
                {subjects.map((sub, idx) => (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-wrap sm:flex-nowrap items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {idx + 1}
                    </div>

                    <input
                      type="text"
                      value={sub.name}
                      onChange={e => updateSubject(sub.id, 'name', e.target.value)}
                      placeholder="Course Name"
                      className="flex-1 min-w-[140px] px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />

                    <div className="flex items-center gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Credits</span>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={sub.credits}
                          onChange={e => updateSubject(sub.id, 'credits', Math.max(1, Number(e.target.value)))}
                          className="w-14 px-2 py-1 text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-center text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Grade Point</span>
                        <input
                          type="number"
                          min={0}
                          max={10}
                          step={0.5}
                          value={sub.gradePoint}
                          onChange={e => updateSubject(sub.id, 'gradePoint', Math.max(0, Number(e.target.value)))}
                          className="w-16 px-2 py-1 text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-center text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <button
                        onClick={() => removeSubject(sub.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors mt-3"
                        title="Remove subject"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Calculated SGPA Results (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-7 rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white border border-blue-800/40 shadow-xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                Calculated Semester SGPA
              </span>

              <div className="flex items-baseline gap-3">
                <div className="text-5xl sm:text-6xl font-mono font-black text-white">
                  {calculatedSGPA}
                </div>
                <span className="text-lg font-bold text-blue-300">/ 10.0</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
                <div>
                  <span className="text-blue-200 block text-[11px]">Total Credits:</span>
                  <span className="font-mono font-bold text-white text-base">{totalCredits}</span>
                </div>
                <div>
                  <span className="text-blue-200 block text-[11px]">Equivalent %:</span>
                  <span className="font-mono font-bold text-emerald-300 text-base">{calculatedPercentage}%</span>
                </div>
              </div>
            </div>

            {/* University Formulas Card */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider text-[11px]">
                Standard University Conversions
              </span>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
                <li>• <strong>CBSE / AICTE Formula:</strong> Percentage = CGPA × 9.5 = <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{(Number(calculatedSGPA) * 9.5).toFixed(2)}%</span></li>
                <li>• <strong>Mumbai University:</strong> Percentage = 7.1 × CGPA + 12 = <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{(7.1 * Number(calculatedSGPA) + 12).toFixed(2)}%</span></li>
                <li>• <strong>VTU Formula:</strong> Percentage = (CGPA - 0.75) × 10 = <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{((Number(calculatedSGPA) - 0.75) * 10).toFixed(2)}%</span></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Attendance */}
      {activeTab === 'attendance' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                Attendance Parameters
              </h3>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Total Classes Attended
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={attendedClasses}
                    onChange={e => setAttendedClasses(Math.max(0, Number(e.target.value)))}
                    className="w-full font-mono text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Total Classes Conducted
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={totalClasses}
                    onChange={e => setTotalClasses(Math.max(1, Number(e.target.value)))}
                    className="w-full font-mono text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Required Minimum Threshold (%)
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={targetPercentage}
                    onChange={e => setTargetPercentage(Math.max(1, Number(e.target.value)))}
                    className="w-full font-mono text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className={`p-7 rounded-3xl text-white shadow-xl space-y-4 border ${
              currentAttendancePct >= targetPercentage 
                ? 'bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 border-emerald-800/40' 
                : 'bg-gradient-to-br from-rose-900 via-red-900 to-slate-900 border-rose-800/40'
            }`}>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                Current Attendance Percentage
              </span>

              <div className="text-5xl sm:text-6xl font-mono font-black text-white">
                {currentAttendancePct.toFixed(1)}%
              </div>

              <div className="pt-3 border-t border-white/10 text-xs sm:text-sm font-medium leading-relaxed">
                {bunkStatusMessage}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Target Exam Marks */}
      {activeTab === 'target' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" />
                Target Exam Score Estimator
              </h3>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Current Internal Marks Scored
                  </label>
                  <input
                    type="number"
                    value={currentInternalMarks}
                    onChange={e => setCurrentInternalMarks(Number(e.target.value))}
                    className="w-full font-mono text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Maximum Internal Marks Possible
                  </label>
                  <input
                    type="number"
                    value={internalMaxMarks}
                    onChange={e => setInternalMaxMarks(Number(e.target.value))}
                    className="w-full font-mono text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Desired Overall Target Total Marks (out of 100)
                  </label>
                  <input
                    type="number"
                    value={desiredTotalGrade}
                    onChange={e => setDesiredTotalGrade(Number(e.target.value))}
                    className="w-full font-mono text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="p-7 rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white border border-blue-800/40 shadow-xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                Minimum Score Required in Final Exam
              </span>

              <div className="text-5xl sm:text-6xl font-mono font-black text-white">
                {marksNeededInFinal.toFixed(1)}
              </div>

              <p className="text-xs text-blue-100 leading-relaxed font-medium">
                To achieve your target of {desiredTotalGrade} marks overall, you must score at least {marksNeededInFinal.toFixed(1)} marks in the final examination.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
