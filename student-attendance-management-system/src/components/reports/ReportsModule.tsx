import React, { useState, useEffect, useMemo } from 'react';
import { storageService } from '../../services/storageService';
import { ExcelService } from '../../services/excelService';
import { Program, Semester, Section, Course, StudentAttendanceCalculation } from '../../types';
import { useToast } from '../common/Toast';
import {
  FileSpreadsheet,
  Download,
  Filter,
  Search,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Trophy,
  Users,
  RefreshCw
} from 'lucide-react';

export const ReportsModule: React.FC = () => {
  const { showToast } = useToast();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  // Filter States
  const [selectedProgramId, setSelectedProgramId] = useState<string>('');
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>('');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showDefaultersOnly, setShowDefaultersOnly] = useState<boolean>(false);

  // Load basic filters
  useEffect(() => {
    setPrograms(storageService.getPrograms());
    setSemesters(storageService.getSemesters());
    setSections(storageService.getSections());
    setCourses(storageService.getCourses());
  }, []);

  // Filter calculations based on all selected parameters
  const calculations: StudentAttendanceCalculation[] = useMemo(() => {
    const raw = storageService.getCalculations({
      programId: selectedProgramId || undefined,
      semesterId: selectedSemesterId || undefined,
      sectionId: selectedSectionId || undefined,
      courseId: selectedCourseId || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });

    let filtered = raw;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(item =>
        item.student.name.toLowerCase().includes(q) ||
        item.student.rollNo.toLowerCase().includes(q) ||
        item.student.enrollmentNo.toLowerCase().includes(q)
      );
    }

    if (showDefaultersOnly) {
      filtered = filtered.filter(item => item.totalClasses > 0 && item.attendancePercentage < 75);
    }

    return filtered;
  }, [
    selectedProgramId,
    selectedSemesterId,
    selectedSectionId,
    selectedCourseId,
    startDate,
    endDate,
    searchQuery,
    showDefaultersOnly
  ]);

  // Handle Export Excel
  const handleExport = () => {
    if (calculations.length === 0) {
      showToast('No records matching the filter criteria to export.', 'warning');
      return;
    }

    const fileName = `Attendance_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
    ExcelService.exportAttendanceReport(calculations, fileName);
    showToast(`Downloaded ${fileName} successfully`, 'success');
  };

  const handleResetFilters = () => {
    setSelectedProgramId('');
    setSelectedSemesterId('');
    setSelectedSectionId('');
    setSelectedCourseId('');
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setShowDefaultersOnly(false);
    showToast('Filters cleared', 'info');
  };

  // Metrics on filtered set
  const totalFilteredStudents = calculations.length;
  const avgFilteredAttendance = totalFilteredStudents > 0
    ? Math.round((calculations.reduce((acc, curr) => acc + curr.attendancePercentage, 0) / totalFilteredStudents) * 10) / 10
    : 0;
  const totalAttended = calculations.reduce((acc, curr) => acc + curr.attendedClasses, 0);
  const totalConducted = calculations.reduce((acc, curr) => acc + curr.totalClasses, 0);
  const defaulterCount = calculations.filter(c => c.totalClasses > 0 && c.attendancePercentage < 75).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Institutional Reports & Analytics
          </h1>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
            Filter attendance data by program, course, student, and date range. Export formatted Apache POI Excel report.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-500/20 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Filter Matrix Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Multi-Parameter Filters</span>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={showDefaultersOnly}
              onChange={e => setShowDefaultersOnly(e.target.checked)}
              className="rounded text-rose-600 focus:ring-rose-500 h-4 w-4"
            />
            <span className="text-rose-600 dark:text-rose-400 font-bold">
              Show Defaulters Only (&lt; 75%)
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Program */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Program
            </label>
            <select
              value={selectedProgramId}
              onChange={e => setSelectedProgramId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="">All Programs</option>
              {programs.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Semester
            </label>
            <select
              value={selectedSemesterId}
              onChange={e => setSelectedSemesterId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="">All Semesters</option>
              {semesters.map(s => (
                <option key={s.id} value={s.id}>Semester {s.semesterNumber}</option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Section
            </label>
            <select
              value={selectedSectionId}
              onChange={e => setSelectedSectionId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="">All Sections</option>
              {sections.map(sec => (
                <option key={sec.id} value={sec.id}>Section {sec.sectionName}</option>
              ))}
            </select>
          </div>

          {/* Course */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Course
            </label>
            <select
              value={selectedCourseId}
              onChange={e => setSelectedCourseId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="">All Courses</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.courseCode} - {c.courseName}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Range & Student Search */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>Search Student Name / Roll No</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Aarav, 21BCSE01..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Start Date</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>End Date</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-700 dark:text-slate-300">Matching Students</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{totalFilteredStudents}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-700 dark:text-slate-300">Mean Attendance Rate</span>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">{avgFilteredAttendance}%</p>
        </div>
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-700 dark:text-slate-300">Present Sessions Marked</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {totalAttended} <span className="text-xs text-slate-600 font-normal">/ {totalConducted}</span>
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-700 dark:text-slate-300">Defaulters (&lt; 75%)</span>
          <p className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">{defaulterCount}</p>
        </div>
      </div>

      {/* Requirement 10: Reports Table matching Apache POI export columns */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <th className="py-3 px-3">Roll No</th>
                <th className="py-3 px-3">Enrollment</th>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Program</th>
                <th className="py-3 px-3">Sem & Sec</th>
                <th className="py-3 px-3">Course</th>
                <th className="py-3 px-3 text-center">Total Classes</th>
                <th className="py-3 px-3 text-center text-emerald-600">Present (P)</th>
                <th className="py-3 px-3 text-center text-rose-600">Absent (A)</th>
                <th className="py-3 px-3 text-center text-indigo-600">Activities</th>
                <th className="py-3 px-3 text-right">Attendance %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {calculations.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-600 dark:text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-semibold text-sm">No records match the selected filters.</p>
                  </td>
                </tr>
              ) : (
                calculations.map(item => (
                  <tr key={item.student.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-900 dark:text-white">
                      {item.student.rollNo}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                      {item.student.enrollmentNo}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                      {item.student.name}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                      {item.programName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                      Sem {item.semesterNumber} - {item.sectionName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 max-w-[150px] truncate" title={item.courseName}>
                      {item.courseName}
                    </td>
                    <td className="py-2.5 px-3 text-center font-medium text-slate-900 dark:text-white">
                      {item.totalClasses}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-emerald-600">
                      {item.attendedClasses}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-rose-600">
                      {item.absentClasses}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400">
                        <Trophy className="w-3 h-3" />
                        {item.activityCount}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`inline-flex px-2 py-0.5 rounded-full font-bold ${
                        item.totalClasses === 0
                          ? 'bg-slate-100 text-slate-700 dark:bg-slate-800'
                          : item.attendancePercentage >= 75
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300'
                      }`}>
                        {item.attendancePercentage}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
