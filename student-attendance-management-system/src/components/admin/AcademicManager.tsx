import React, { useState, useEffect } from 'react';
import { Program, Semester, Section, Course } from '../../types';
import { storageService } from '../../services/storageService';
import { useToast } from '../common/Toast';
import {
  GraduationCap,
  Calendar,
  Layers,
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export const AcademicManager: React.FC = () => {
  const { showToast } = useToast();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  // Active sub-tab
  const [activeSubTab, setActiveSubTab] = useState<'programs' | 'semesters' | 'sections' | 'courses'>('programs');

  // Modal forms
  const [newProgramName, setNewProgramName] = useState('');
  const [newProgramCode, setNewProgramCode] = useState('');

  const [newSemesterProgramId, setNewSemesterProgramId] = useState('');
  const [newSemesterNumber, setNewSemesterNumber] = useState(1);

  const [newSectionSemesterId, setNewSectionSemesterId] = useState('');
  const [newSectionName, setNewSectionName] = useState('');

  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseSemId, setNewCourseSemId] = useState('');
  const [newCourseSecId, setNewCourseSecId] = useState('');
  const [newCourseFaculty, setNewCourseFaculty] = useState('');

  const refreshAll = () => {
    setPrograms(storageService.getPrograms());
    setSemesters(storageService.getSemesters());
    setSections(storageService.getSections());
    setCourses(storageService.getCourses());
  };

  useEffect(() => {
    refreshAll();
  }, []);

  // Handlers
  const handleAddProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgramName.trim()) {
      showToast('Please enter program name', 'warning');
      return;
    }
    storageService.addProgram(newProgramName, newProgramCode);
    showToast(`Added Program: ${newProgramName}`, 'success');
    setNewProgramName('');
    setNewProgramCode('');
    refreshAll();
  };

  const handleDeleteProgram = (id: string, name: string) => {
    if (window.confirm(`Delete Program "${name}" and all associated data?`)) {
      storageService.deleteProgram(id);
      showToast(`Deleted Program ${name}`, 'info');
      refreshAll();
    }
  };

  const handleAddSemester = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSemesterProgramId) {
      showToast('Select a program for this semester', 'warning');
      return;
    }
    storageService.addSemester(newSemesterProgramId, Number(newSemesterNumber));
    showToast(`Added Semester ${newSemesterNumber}`, 'success');
    refreshAll();
  };

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionSemesterId || !newSectionName.trim()) {
      showToast('Please fill all section details', 'warning');
      return;
    }
    storageService.addSection(newSectionSemesterId, newSectionName);
    showToast(`Added Section ${newSectionName.toUpperCase()}`, 'success');
    setNewSectionName('');
    refreshAll();
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseCode || !newCourseName || !newCourseSemId || !newCourseSecId) {
      showToast('Please fill all mandatory course details', 'warning');
      return;
    }
    storageService.addCourse({
      courseCode: newCourseCode.trim().toUpperCase(),
      courseName: newCourseName.trim(),
      semesterId: newCourseSemId,
      sectionId: newCourseSecId,
      facultyName: newCourseFaculty.trim() || 'Assigned Faculty',
      credits: 4
    });
    showToast(`Added Course ${newCourseCode}: ${newCourseName}`, 'success');
    setNewCourseCode('');
    setNewCourseName('');
    setNewCourseFaculty('');
    refreshAll();
  };

  const handleDeleteCourse = (id: string, name: string) => {
    if (window.confirm(`Delete Course "${name}"?`)) {
      storageService.deleteCourse(id);
      showToast(`Deleted Course ${name}`, 'info');
      refreshAll();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          Academic Hierarchy Setup
        </h1>
        <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
          Configure Programs, Semesters (1-8), Sections (A/B/C), and Courses. Defines curriculum scope for attendance tracking.
        </p>
      </div>

      {/* Sub tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-2">
        <button
          onClick={() => setActiveSubTab('programs')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'programs'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-700 hover:text-slate-900 dark:text-slate-300'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Programs ({programs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('semesters')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'semesters'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-700 hover:text-slate-900 dark:text-slate-300'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Semesters ({semesters.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sections')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'sections'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-700 hover:text-slate-900 dark:text-slate-300'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Sections ({sections.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('courses')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'courses'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-700 hover:text-slate-900 dark:text-slate-300'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Courses ({courses.length})</span>
        </button>
      </div>

      {/* Tab 1: Programs */}
      {activeSubTab === 'programs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs h-fit space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Create Academic Program</span>
            </h3>
            <form onSubmit={handleAddProgram} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Program Name (e.g. B.Tech Data Science)
                </label>
                <input
                  type="text"
                  placeholder="e.g. B.Tech Cybersecurity"
                  value={newProgramName}
                  onChange={e => setNewProgramName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Program Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. BT-CS"
                  value={newProgramCode}
                  onChange={e => setNewProgramCode(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                Add Program
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                  <th className="py-3 px-4">Program Name</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {programs.map(prog => (
                  <tr key={prog.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {prog.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-700 dark:text-slate-300">
                      {prog.code || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      {prog.durationYears || 4} Years
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteProgram(prog.id, prog.name)}
                        className="text-slate-500 hover:text-rose-600 p-1 rounded transition-colors"
                        title="Delete Program"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Semesters */}
      {activeSubTab === 'semesters' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs h-fit space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Add Semester</span>
            </h3>
            <form onSubmit={handleAddSemester} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Program
                </label>
                <select
                  value={newSemesterProgramId}
                  onChange={e => setNewSemesterProgramId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">-- Choose Program --</option>
                  {programs.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Semester Number (1 to 8)
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={newSemesterNumber}
                  onChange={e => setNewSemesterNumber(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                Create Semester
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                  <th className="py-3 px-4">Program</th>
                  <th className="py-3 px-4">Semester</th>
                  <th className="py-3 px-4">Configured Sections</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {semesters.map(sem => {
                  const prog = programs.find(p => p.id === sem.programId);
                  const secCount = sections.filter(s => s.semesterId === sem.id).length;
                  return (
                    <tr key={sem.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {prog?.name || 'Unknown Program'}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                        Semester {sem.semesterNumber}
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        {secCount} Sections
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Sections */}
      {activeSubTab === 'sections' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs h-fit space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Add Section</span>
            </h3>
            <form onSubmit={handleAddSection} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Semester
                </label>
                <select
                  value={newSectionSemesterId}
                  onChange={e => setNewSectionSemesterId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">-- Choose Semester --</option>
                  {semesters.map(s => {
                    const prog = programs.find(p => p.id === s.programId);
                    return (
                      <option key={s.id} value={s.id}>
                        {prog?.name} - Sem {s.semesterNumber}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Section Name (e.g. A, B, C, ABC)
                </label>
                <input
                  type="text"
                  placeholder="e.g. A"
                  value={newSectionName}
                  onChange={e => setNewSectionName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                Create Section
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                  <th className="py-3 px-4">Program</th>
                  <th className="py-3 px-4">Semester</th>
                  <th className="py-3 px-4">Section Name</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sections.map(sec => {
                  const sem = semesters.find(s => s.id === sec.semesterId);
                  const prog = sem ? programs.find(p => p.id === sem.programId) : null;
                  return (
                    <tr key={sec.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {prog?.name || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        Semester {sem?.semesterNumber || 0}
                      </td>
                      <td className="py-3 px-4 font-bold text-indigo-600 dark:text-indigo-400">
                        Section {sec.sectionName}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Courses */}
      {activeSubTab === 'courses' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs h-fit space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Create Course</span>
            </h3>
            <form onSubmit={handleAddCourse} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. CS501"
                  value={newCourseCode}
                  onChange={e => setNewCourseCode(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Operating Systems"
                  value={newCourseName}
                  onChange={e => setNewCourseName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Semester
                </label>
                <select
                  value={newCourseSemId}
                  onChange={e => {
                    setNewCourseSemId(e.target.value);
                    const matchedSecs = sections.filter(s => s.semesterId === e.target.value);
                    if (matchedSecs.length > 0) {
                      setNewCourseSecId(matchedSecs[0].id);
                    }
                  }}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">-- Choose Semester --</option>
                  {semesters.map(s => {
                    const prog = programs.find(p => p.id === s.programId);
                    return (
                      <option key={s.id} value={s.id}>
                        {prog?.name} - Sem {s.semesterNumber}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Section
                </label>
                <select
                  value={newCourseSecId}
                  onChange={e => setNewCourseSecId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">-- Choose Section --</option>
                  {sections
                    .filter(s => !newCourseSemId || s.semesterId === newCourseSemId)
                    .map(sec => (
                      <option key={sec.id} value={sec.id}>
                        Section {sec.sectionName}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Faculty Instructor
                </label>
                <input
                  type="text"
                  placeholder="e.g. Prof. Ananya Verma"
                  value={newCourseFaculty}
                  onChange={e => setNewCourseFaculty(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                Register Course
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Course Name</th>
                  <th className="py-3 px-4">Sem & Section</th>
                  <th className="py-3 px-4">Faculty</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {courses.map(c => {
                  const sem = semesters.find(s => s.id === c.semesterId);
                  const sec = sections.find(s => s.id === c.sectionId);
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {c.courseCode}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {c.courseName}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-700 dark:text-slate-300">
                        Sem {sem?.semesterNumber || 0} ({sec?.sectionName || 'N/A'})
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-700 dark:text-slate-300">
                        {c.facultyName || 'Unassigned'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteCourse(c.id, c.courseName)}
                          className="text-slate-500 hover:text-rose-600 p-1 rounded transition-colors"
                          title="Delete Course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
