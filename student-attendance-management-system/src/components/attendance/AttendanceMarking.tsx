import React, { useState, useEffect } from 'react';
import {
  Program,
  Semester,
  Section,
  Course,
  AttendanceStatus,
  StudentAttendanceCalculation,
  Activity,
  UserRole
} from '../../types';
import { storageService } from '../../services/storageService';
import { ExcelService } from '../../services/excelService';
import { useToast } from '../common/Toast';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  HeartPulse,
  Save,
  Download,
  Users,
  Trophy,
  Filter,
  CheckCheck,
  AlertTriangle,
  Sparkles,
  PlusCircle,
  BookOpen
} from 'lucide-react';

export interface AttendanceMarkingProps {
  currentRole?: UserRole;
}

export const AttendanceMarking: React.FC<AttendanceMarkingProps> = ({ currentRole }) => {
  const { showToast } = useToast();

  // Filter selections
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<string>('');

  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>('');

  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  const [attendanceDate, setAttendanceDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Student calculations & attendance states
  const [studentRecords, setStudentRecords] = useState<StudentAttendanceCalculation[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({});
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  // Activity modal state
  const [activityModalStudent, setActivityModalStudent] = useState<{ id: string; name: string } | null>(null);
  const [availableActivities, setAvailableActivities] = useState<Activity[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<string>('');
  const [activityRole, setActivityRole] = useState<string>('');

  // 1. Load initial programs
  useEffect(() => {
    const progs = storageService.getPrograms();
    setPrograms(progs);
    setAvailableActivities(storageService.getActivities());

    // Auto-select B.Tech CSE if available
    const cse = progs.find(p => p.name.includes('CSE')) || progs[0];
    if (cse) {
      setSelectedProgramId(cse.id);
    }
  }, []);

  // 2. When Program changes -> update available Semesters
  useEffect(() => {
    if (!selectedProgramId) {
      setSemesters([]);
      setSelectedSemesterId('');
      return;
    }
    const sems = storageService.getSemesters(selectedProgramId);
    setSemesters(sems);

    if (sems.length > 0) {
      // Default to Semester 5 or the first available
      const sem5 = sems.find(s => s.semesterNumber === 5) || sems[0];
      setSelectedSemesterId(sem5.id);
    } else {
      setSelectedSemesterId('');
    }
  }, [selectedProgramId]);

  // 3. When Semester changes -> update available Sections
  useEffect(() => {
    if (!selectedSemesterId) {
      setSections([]);
      setSelectedSectionId('');
      return;
    }
    const secs = storageService.getSections(selectedSemesterId);
    setSections(secs);

    if (secs.length > 0) {
      setSelectedSectionId(secs[0].id);
    } else {
      setSelectedSectionId('NA');
    }
  }, [selectedSemesterId]);

  // 4. When Section & Semester change -> update available Courses
  useEffect(() => {
    if (!selectedSemesterId) {
      setCourses([]);
      setSelectedCourseId('');
      return;
    }
    const secId = selectedSectionId === 'NA' ? undefined : selectedSectionId;
    const crs = storageService.getCourses(selectedSemesterId, secId);
    setCourses(crs);

    if (crs.length > 0) {
      setSelectedCourseId(crs[0].id);
    } else {
      setSelectedCourseId('');
    }
  }, [selectedSemesterId, selectedSectionId]);

  // 5. Load Students automatically when Course & Date are chosen
  const loadStudents = (courseIdOverride?: string, dateOverride?: string) => {
    const courseId = courseIdOverride || selectedCourseId;
    const date = dateOverride || attendanceDate;

    if (!selectedProgramId) {
      showToast('Please select an academic Program first', 'warning');
      return;
    }
    if (!selectedSemesterId) {
      showToast('Please select a Semester', 'warning');
      return;
    }

    const secId = selectedSectionId === 'NA' ? undefined : selectedSectionId;

    const calcs = storageService.getCalculations({
      programId: selectedProgramId,
      semesterId: selectedSemesterId,
      sectionId: secId,
      courseId: courseId || undefined,
      selectedDate: date
    });

    setStudentRecords(calcs);

    // Populate current date attendance map from existing records
    const map: Record<string, AttendanceStatus> = {};
    calcs.forEach(c => {
      // If student already has a recorded status for this date & course, use it; otherwise default to 'P'
      map[c.student.id] = c.currentDateStatus || 'P';
    });

    setAttendanceMap(map);
    setIsSaved(true);
    setHasLoaded(true);
    showToast(`Loaded ${calcs.length} student records for attendance`, 'success');
  };

  // Auto-load on initial filter resolution
  useEffect(() => {
    if (selectedCourseId && selectedSectionId) {
      loadStudents(selectedCourseId, attendanceDate);
    }
  }, [selectedCourseId, selectedSectionId, attendanceDate]);

  // Handle single student attendance status change
  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: status
    }));
    setIsSaved(false);
  };

  // Requirement 6: Mark All Present shortcut
  const handleMarkAllPresent = () => {
    const map: Record<string, AttendanceStatus> = {};
    studentRecords.forEach(c => {
      map[c.student.id] = 'P';
    });
    setAttendanceMap(map);
    setIsSaved(false);
    showToast('All students marked as Present (P)', 'info');
  };

  // Bulk set status (e.g. All Absent, All Leave)
  const handleBulkStatus = (status: AttendanceStatus) => {
    const map: Record<string, AttendanceStatus> = {};
    studentRecords.forEach(c => {
      map[c.student.id] = status;
    });
    setAttendanceMap(map);
    setIsSaved(false);
    showToast(`Bulk updated all students to '${status}'`, 'info');
  };

  // Requirement 6: Save Attendance to database
  const handleSaveAttendance = () => {
    if (!selectedCourseId) {
      showToast('Please select a course to save attendance', 'error');
      return;
    }

    const records = Object.entries(attendanceMap).map(([studentId, status]) => ({
      studentId,
      status: status as AttendanceStatus
    }));

    const result = storageService.saveAttendanceBulk(selectedCourseId, attendanceDate, records);
    setIsSaved(true);

    // Refresh calculations so percentages and class totals update automatically
    const updatedCalcs = storageService.getCalculations({
      programId: selectedProgramId,
      semesterId: selectedSemesterId,
      sectionId: selectedSectionId === 'NA' ? undefined : selectedSectionId,
      courseId: selectedCourseId,
      selectedDate: attendanceDate
    });
    setStudentRecords(updatedCalcs);

    showToast(`Attendance saved! (${result.savedCount} new, ${result.updatedCount} updated)`, 'success');
  };

  // Requirement 10: Excel Export from Attendance Screen
  const handleExportExcel = () => {
    if (studentRecords.length === 0) {
      showToast('No student records to export. Please load students first.', 'warning');
      return;
    }

    const selectedCourse = courses.find(c => c.id === selectedCourseId);
    const courseCode = selectedCourse ? selectedCourse.courseCode : 'COURSE';
    const filename = `Attendance_${courseCode}_${attendanceDate}.xlsx`;

    ExcelService.exportAttendanceReport(studentRecords, filename);
    showToast(`Exported attendance sheet as ${filename}`, 'success');
  };

  // Requirement 7: Record Event / Activity Participation for student
  const handleSaveActivityParticipation = () => {
    if (!activityModalStudent || !selectedActivityId) {
      showToast('Please choose an activity', 'warning');
      return;
    }

    storageService.addActivityParticipation(
      activityModalStudent.id,
      selectedActivityId,
      activityRole || 'Participant'
    );

    showToast(`Recorded event participation for ${activityModalStudent.name}`, 'success');
    setActivityModalStudent(null);
    setSelectedActivityId('');
    setActivityRole('');

    // Reload student records to refresh Activity Engagement column
    loadStudents();
  };

  // Quick summary counts for the current session
  const totalCount = studentRecords.length;
  const presentCount = Object.values(attendanceMap).filter(s => s === 'P').length;
  const absentCount = Object.values(attendanceMap).filter(s => s === 'A').length;
  const leaveCount = Object.values(attendanceMap).filter(s => s === 'L').length;
  const medicalCount = Object.values(attendanceMap).filter(s => s === 'M').length;

  return (
    <div className="space-y-6">
      {/* Top Header & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Attendance Recording & Entry
          </h1>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
            Hierarchical Program → Semester → Section → Course cascade with automated roster generation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isSaved && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              Unsaved Changes
            </span>
          )}
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={handleSaveAttendance}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm shadow-blue-500/20"
          >
            <Save className="w-4 h-4" />
            <span>Save Attendance</span>
          </button>
        </div>
      </div>

      {/* Requirement 1 to 5: ERP Cascading Top Filters */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          <Filter className="w-3.5 h-3.5" />
          <span>Academic Hierarchy Selector</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* 1. Program Dropdown */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              1. Program
            </label>
            <select
              value={selectedProgramId}
              onChange={e => setSelectedProgramId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              <option value="" disabled>Select Program</option>
              {programs.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* 2. Semester Dropdown */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              2. Semester
            </label>
            <select
              value={selectedSemesterId}
              onChange={e => setSelectedSemesterId(e.target.value)}
              disabled={semesters.length === 0}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden disabled:opacity-50"
            >
              {semesters.length === 0 ? (
                <option value="">No Semesters</option>
              ) : (
                semesters.map(s => (
                  <option key={s.id} value={s.id}>Semester {s.semesterNumber}</option>
                ))
              )}
            </select>
          </div>

          {/* 3. Section Dropdown */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              3. Section
            </label>
            <select
              value={selectedSectionId}
              onChange={e => setSelectedSectionId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              {sections.length === 0 ? (
                <option value="NA">N/A (Unavailable)</option>
              ) : (
                sections.map(sec => (
                  <option key={sec.id} value={sec.id}>Section {sec.sectionName}</option>
                ))
              )}
            </select>
          </div>

          {/* 4. Course Dropdown */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              4. Course
            </label>
            <select
              value={selectedCourseId}
              onChange={e => setSelectedCourseId(e.target.value)}
              disabled={courses.length === 0}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden disabled:opacity-50"
            >
              {courses.length === 0 ? (
                <option value="">No Courses in Section</option>
              ) : (
                courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.courseCode} - {c.courseName}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>Attendance Date</span>
            </label>
            <input
              type="date"
              value={attendanceDate}
              onChange={e => setAttendanceDate(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => loadStudents()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Reload Students</span>
            </button>
            <button
              onClick={handleMarkAllPresent}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All Present</span>
            </button>
            <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">Bulk set:</span>
              <button
                onClick={() => handleBulkStatus('A')}
                className="px-2 py-1 text-xs font-semibold rounded-md bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 transition-colors"
              >
                All Absent
              </button>
              <button
                onClick={() => handleBulkStatus('L')}
                className="px-2 py-1 text-xs font-semibold rounded-md bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 transition-colors"
              >
                All Leave
              </button>
              <button
                onClick={() => handleBulkStatus('M')}
                className="px-2 py-1 text-xs font-semibold rounded-md bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 transition-colors"
              >
                All Medical
              </button>
            </div>
          </div>

          {/* Quick Counter Badges */}
          <div className="flex items-center gap-3 text-xs font-medium">
            <span className="text-slate-700 dark:text-slate-300">
              Total: <strong className="text-slate-900 dark:text-white font-bold">{totalCount}</strong>
            </span>
            <span className="flex items-center gap-1 text-emerald-800 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Present: <strong>{presentCount}</strong>
            </span>
            <span className="flex items-center gap-1 text-rose-800 dark:text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              Absent: <strong>{absentCount}</strong>
            </span>
            <span className="flex items-center gap-1 text-amber-800 dark:text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Leave: <strong>{leaveCount}</strong>
            </span>
            <span className="flex items-center gap-1 text-sky-800 dark:text-sky-400">
              <span className="w-2 h-2 rounded-full bg-sky-500"></span>
              Medical: <strong>{medicalCount}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Requirement 5 & 6 & 7 & 8: Attendance Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/80 text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Enrollment</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4 text-center">Attendance (P/A/L/M)</th>
                <th className="py-3 px-4">Activity Engagement</th>
                <th className="py-3 px-4 text-right">Classes Attended</th>
                <th className="py-3 px-4 text-right">Attendance %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
              {studentRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-600 dark:text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-semibold">No students found for this academic section.</p>
                    <p className="text-xs mt-1">Please select another program, semester, or section above.</p>
                  </td>
                </tr>
              ) : (
                studentRecords.map((item) => {
                  const student = item.student;
                  const currentStatus = attendanceMap[student.id] || 'P';
                  const isDefaulter = item.totalClasses > 0 && item.attendancePercentage < 75;

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Roll No */}
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900 dark:text-white">
                        {student.rollNo}
                      </td>

                      {/* Enrollment No */}
                      <td className="py-3 px-4 font-mono text-xs text-slate-700 dark:text-slate-300">
                        {student.enrollmentNo}
                      </td>

                      {/* Student Name */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {student.name}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          {student.email}
                        </div>
                      </td>

                      {/* Requirement 6: Interactive Attendance Buttons (P / A / L / M) */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          {/* Present (P) */}
                          <button
                            onClick={() => handleStatusChange(student.id, 'P')}
                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                              currentStatus === 'P'
                                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/40'
                                : 'bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-emerald-950 dark:hover:text-emerald-300'
                            }`}
                            title="Present (P)"
                          >
                            P
                          </button>

                          {/* Absent (A) */}
                          <button
                            onClick={() => handleStatusChange(student.id, 'A')}
                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                              currentStatus === 'A'
                                ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-500/40'
                                : 'bg-slate-100 text-slate-700 hover:bg-rose-100 hover:text-rose-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-rose-950 dark:hover:text-rose-300'
                            }`}
                            title="Absent (A)"
                          >
                            A
                          </button>

                          {/* Leave (L) */}
                          <button
                            onClick={() => handleStatusChange(student.id, 'L')}
                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                              currentStatus === 'L'
                                ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-500/40'
                                : 'bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-amber-950 dark:hover:text-amber-300'
                            }`}
                            title="Leave (L)"
                          >
                            L
                          </button>

                          {/* Medical (M) */}
                          <button
                            onClick={() => handleStatusChange(student.id, 'M')}
                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                              currentStatus === 'M'
                                ? 'bg-sky-600 text-white shadow-sm ring-2 ring-sky-500/40'
                                : 'bg-slate-100 text-slate-700 hover:bg-sky-100 hover:text-sky-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-sky-950 dark:hover:text-sky-300'
                            }`}
                            title="Medical (M)"
                          >
                            M
                          </button>
                        </div>
                      </td>

                      {/* Requirement 7: Activity Engagement Column (Automatically linked) */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {item.activities && item.activities.length > 0 ? (
                            item.activities.map(act => (
                              <span
                                key={act.id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                                title={`${act.name} (${act.category || 'Event'})`}
                              >
                                <Trophy className="w-3 h-3 text-indigo-500" />
                                <span className="truncate max-w-[120px]">{act.name}</span>
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-500 dark:text-slate-400 italic">None</span>
                          )}

                          {/* Quick assign participation button */}
                          <button
                            onClick={() => setActivityModalStudent({ id: student.id, name: student.name })}
                            className="p-1 rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:text-slate-400 dark:hover:text-blue-300 dark:hover:bg-blue-950/50 transition-colors"
                            title="Record Event Participation"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Requirement 8: Classes Attended / Total */}
                      <td className="py-3 px-4 text-right">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {item.attendedClasses}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 text-xs">
                          {' '}/ {item.totalClasses}
                        </span>
                      </td>

                      {/* Requirement 8: Automatic Attendance Percentage */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                              item.totalClasses === 0
                                ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                : item.attendancePercentage >= 75
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                                : item.attendancePercentage >= 65
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300'
                            }`}
                          >
                            {item.attendancePercentage}%
                          </span>
                        </div>
                        {isDefaulter && (
                          <div className="text-[10px] text-rose-700 dark:text-rose-400 font-semibold tracking-tight">
                            Defaulter (&lt;75%)
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>Attendance changes are verified and computed dynamically across all records.</span>
          </div>
          <div className="mt-2 sm:mt-0 font-medium">
            Standard University Mandate: <strong className="text-slate-900 dark:text-white">75% Minimum Attendance</strong>
          </div>
        </div>
      </div>

      {/* Modal: Record Event / Activity Participation */}
      {activityModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Record Event Participation
                </h3>
              </div>
              <button
                onClick={() => setActivityModalStudent(null)}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300">
              Student: <strong className="text-slate-900 dark:text-white">{activityModalStudent.name}</strong>
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Approved Activity / Event
                </label>
                <select
                  value={selectedActivityId}
                  onChange={e => setSelectedActivityId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Choose Activity --</option>
                  {availableActivities.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.category || 'Event'}) - {a.date}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Role / Recognition (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Winner 1st Prize, Team Lead, Volunteer"
                  value={activityRole}
                  onChange={e => setActivityRole(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setActivityModalStudent(null)}
                className="px-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveActivityParticipation}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
              >
                Confirm Participation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
