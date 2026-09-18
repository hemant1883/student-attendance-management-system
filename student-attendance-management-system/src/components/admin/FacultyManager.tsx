import React, { useState, useEffect, useMemo } from 'react';
import { User, FacultyTimetableEntry, Program, Course, DayOfWeek } from '../../types';
import { storageService } from '../../services/storageService';
import { useToast } from '../common/Toast';
import {
  UserCheck,
  Search,
  Plus,
  Trash2,
  Edit2,
  Mail,
  Phone,
  Calendar,
  Clock,
  MapPin,
  Briefcase,
  BookOpen,
  Award,
  Filter,
  CheckCircle2,
  CalendarDays,
  Sparkles,
  Shield,
  KeyRound,
  FileSpreadsheet
} from 'lucide-react';

const DAYS_OF_WEEK: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const FacultyManager: React.FC = () => {
  const { showToast } = useToast();

  // Active Sub-Tab: Faculty Directory vs Faculty Timetable Scheduler
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'timetable'>('directory');

  // Faculty Directory State
  const [facultyList, setFacultyList] = useState<User[]>([]);
  const [timetables, setTimetables] = useState<FacultyTimetableEntry[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedFacultyFilter, setSelectedFacultyFilter] = useState<string>('ALL');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('ALL');

  // Faculty Modal State
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [editingFacultyId, setEditingFacultyId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('faculty123');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDepartment, setFormDepartment] = useState('Computer Science & Engineering');
  const [formDesignation, setFormDesignation] = useState('Assistant Professor');
  const [formEmployeeId, setFormEmployeeId] = useState('');
  const [formCabin, setFormCabin] = useState('');
  const [formQualification, setFormQualification] = useState('');
  const [formSpecialization, setFormSpecialization] = useState('');

  // Timetable Slot Modal State
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [slotFacultyId, setSlotFacultyId] = useState('');
  const [slotDay, setSlotDay] = useState<DayOfWeek>('Monday');
  const [slotStartTime, setSlotStartTime] = useState('09:00 AM');
  const [slotEndTime, setSlotEndTime] = useState('10:00 AM');
  const [slotCourseCode, setSlotCourseCode] = useState('');
  const [slotCourseName, setSlotCourseName] = useState('');
  const [slotProgramName, setSlotProgramName] = useState('B.Tech CSE');
  const [slotSemester, setSlotSemester] = useState(5);
  const [slotSection, setSlotSection] = useState('A');
  const [slotRoomNo, setSlotRoomNo] = useState('LH-301');

  // View Details Modal / Drawer
  const [inspectingFaculty, setInspectingFaculty] = useState<User | null>(null);

  const refreshData = () => {
    const fac = storageService.getFacultyList();
    const tt = storageService.getTimetables();
    const progs = storageService.getPrograms();
    const crs = storageService.getCourses();

    setFacultyList(fac);
    setTimetables(tt);
    setPrograms(progs);
    setCourses(crs);
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Distinct Departments
  const departments = useMemo(() => {
    const set = new Set<string>();
    facultyList.forEach(f => {
      if (f.department) set.add(f.department);
    });
    return Array.from(set);
  }, [facultyList]);

  // Filtered Faculty List
  const filteredFaculty = useMemo(() => {
    return facultyList.filter(f => {
      const matchesDept = selectedDepartment === 'ALL' || f.department === selectedDepartment;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.email.toLowerCase().includes(q) ||
        f.username.toLowerCase().includes(q) ||
        (f.employeeId && f.employeeId.toLowerCase().includes(q)) ||
        (f.specialization && f.specialization.toLowerCase().includes(q));
      return matchesDept && matchesSearch;
    });
  }, [facultyList, selectedDepartment, searchQuery]);

  // Filtered Timetables
  const filteredTimetables = useMemo(() => {
    return timetables.filter(t => {
      const matchesFaculty = selectedFacultyFilter === 'ALL' || t.facultyId === selectedFacultyFilter;
      const matchesDay = selectedDayFilter === 'ALL' || t.dayOfWeek === selectedDayFilter;
      return matchesFaculty && matchesDay;
    });
  }, [timetables, selectedFacultyFilter, selectedDayFilter]);

  // Open Faculty Create Modal
  const handleOpenCreateFaculty = () => {
    setEditingFacultyId(null);
    setFormName('');
    setFormUsername('');
    setFormPassword('faculty123');
    setFormEmail('');
    setFormPhone('');
    setFormDepartment('Computer Science & Engineering');
    setFormDesignation('Assistant Professor');
    setFormEmployeeId(`EMP-${Date.now().toString().slice(-4)}`);
    setFormCabin('CS Block, Room 301');
    setFormQualification('M.Tech, Ph.D');
    setFormSpecialization('Computer Science');
    setIsFacultyModalOpen(true);
  };

  // Open Faculty Edit Modal
  const handleOpenEditFaculty = (fac: User) => {
    setEditingFacultyId(fac.id);
    setFormName(fac.name);
    setFormUsername(fac.username);
    setFormPassword(fac.password || 'faculty123');
    setFormEmail(fac.email);
    setFormPhone(fac.phone || '');
    setFormDepartment(fac.department || 'Computer Science & Engineering');
    setFormDesignation(fac.designation || 'Assistant Professor');
    setFormEmployeeId(fac.employeeId || '');
    setFormCabin(fac.cabin || '');
    setFormQualification(fac.qualification || '');
    setFormSpecialization(fac.specialization || '');
    setIsFacultyModalOpen(true);
  };

  // Save Faculty Member
  const handleSaveFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formUsername.trim() || !formEmail.trim()) {
      showToast('Name, username, and email are required fields', 'error');
      return;
    }

    if (editingFacultyId) {
      storageService.updateFaculty(editingFacultyId, {
        name: formName.trim(),
        username: formUsername.trim().toLowerCase(),
        password: formPassword.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        department: formDepartment,
        designation: formDesignation,
        employeeId: formEmployeeId.trim(),
        cabin: formCabin.trim(),
        qualification: formQualification.trim(),
        specialization: formSpecialization.trim(),
      });
      showToast(`Faculty "${formName}" updated successfully!`, 'success');
    } else {
      storageService.addFaculty({
        name: formName.trim(),
        username: formUsername.trim().toLowerCase(),
        password: formPassword.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        department: formDepartment,
        designation: formDesignation,
        employeeId: formEmployeeId.trim(),
        cabin: formCabin.trim(),
        qualification: formQualification.trim(),
        specialization: formSpecialization.trim(),
      });
      showToast(`Faculty account created for "${formName}"! Login credentials active.`, 'success');
    }

    setIsFacultyModalOpen(false);
    refreshData();
  };

  // Delete Faculty Member
  const handleDeleteFaculty = (fac: User) => {
    if (window.confirm(`Are you sure you want to delete faculty account "${fac.name}"? This will also remove their timetable allocations.`)) {
      storageService.deleteFaculty(fac.id);
      showToast(`Faculty account "${fac.name}" deleted.`, 'info');
      refreshData();
    }
  };

  // Open Timetable Slot Create Modal
  const handleOpenCreateSlot = () => {
    setEditingSlotId(null);
    setSlotFacultyId(facultyList[0]?.id || '');
    setSlotDay('Monday');
    setSlotStartTime('09:00 AM');
    setSlotEndTime('10:00 AM');
    setSlotCourseCode('CS501');
    setSlotCourseName('Data Structures & Algorithms');
    setSlotProgramName('B.Tech CSE');
    setSlotSemester(5);
    setSlotSection('A');
    setSlotRoomNo('LH-301');
    setIsSlotModalOpen(true);
  };

  // Open Timetable Slot Edit Modal
  const handleOpenEditSlot = (slot: FacultyTimetableEntry) => {
    setEditingSlotId(slot.id);
    setSlotFacultyId(slot.facultyId);
    setSlotDay(slot.dayOfWeek);
    setSlotStartTime(slot.startTime);
    setSlotEndTime(slot.endTime);
    setSlotCourseCode(slot.courseCode);
    setSlotCourseName(slot.courseName);
    setSlotProgramName(slot.programName);
    setSlotSemester(slot.semesterNumber);
    setSlotSection(slot.sectionName);
    setSlotRoomNo(slot.roomNo);
    setIsSlotModalOpen(true);
  };

  // Save Timetable Slot
  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const fac = facultyList.find(f => f.id === slotFacultyId);
    const facultyName = fac ? fac.name : 'Faculty Member';

    if (editingSlotId) {
      storageService.updateTimetableEntry(editingSlotId, {
        facultyId: slotFacultyId,
        facultyName,
        dayOfWeek: slotDay,
        startTime: slotStartTime,
        endTime: slotEndTime,
        courseCode: slotCourseCode.trim().toUpperCase(),
        courseName: slotCourseName.trim(),
        programName: slotProgramName,
        semesterNumber: Number(slotSemester),
        sectionName: slotSection.trim().toUpperCase(),
        roomNo: slotRoomNo.trim(),
      });
      showToast(`Timetable schedule updated for ${facultyName}!`, 'success');
    } else {
      storageService.addTimetableEntry({
        facultyId: slotFacultyId,
        facultyName,
        dayOfWeek: slotDay,
        startTime: slotStartTime,
        endTime: slotEndTime,
        courseCode: slotCourseCode.trim().toUpperCase(),
        courseName: slotCourseName.trim(),
        programName: slotProgramName,
        semesterNumber: Number(slotSemester),
        sectionName: slotSection.trim().toUpperCase(),
        roomNo: slotRoomNo.trim(),
      });
      showToast(`Class slot added to ${facultyName}'s timetable!`, 'success');
    }

    setIsSlotModalOpen(false);
    refreshData();
  };

  // Delete Timetable Slot
  const handleDeleteSlot = (slot: FacultyTimetableEntry) => {
    if (window.confirm(`Remove slot "${slot.courseCode} - ${slot.courseName}" on ${slot.dayOfWeek}?`)) {
      storageService.deleteTimetableEntry(slot.id);
      showToast('Timetable schedule entry removed.', 'info');
      refreshData();
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl text-indigo-600 dark:text-indigo-400">
            <UserCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Faculty Administration
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                Admin Panel
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Manage multiple faculty accounts, departmental records, teaching assignments, and weekly class timetables.
            </p>
          </div>
        </div>

        {/* Action Buttons & Sub-Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              id="faculty-subtab-directory-btn"
              onClick={() => setActiveSubTab('directory')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeSubTab === 'directory'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Faculty Directory ({facultyList.length})</span>
            </button>
            <button
              id="faculty-subtab-timetable-btn"
              onClick={() => setActiveSubTab('timetable')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeSubTab === 'timetable'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Timetable Scheduler ({timetables.length})</span>
            </button>
          </div>

          {activeSubTab === 'directory' ? (
            <button
              id="add-new-faculty-btn"
              onClick={handleOpenCreateFaculty}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-semibold shadow-sm shadow-indigo-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Faculty Account</span>
            </button>
          ) : (
            <button
              id="add-timetable-slot-btn"
              onClick={handleOpenCreateSlot}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-semibold shadow-sm shadow-indigo-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Class Slot</span>
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: FACULTY DIRECTORY & ACCOUNTS
         ========================================================================= */}
      {activeSubTab === 'directory' && (
        <div className="space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Active Faculty</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{facultyList.length}</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> All accounts verified & credentials active
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Departments Represented</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{departments.length}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                CSE, AI, ECE, BCA & MCA
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Assigned Weekly Classes</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{timetables.length}</div>
              <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1">
                Managed via interactive timetable
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Faculty Login Security</div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">Role-Based</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Marking, Reports & Profile access
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                id="faculty-search-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by name, emp ID, email or field..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Filter className="w-3.5 h-3.5" />
                <span>Department:</span>
              </div>
              <select
                id="faculty-dept-filter-select"
                value={selectedDepartment}
                onChange={e => setSelectedDepartment(e.target.value)}
                className="text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="ALL">All Departments ({facultyList.length})</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Faculty Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFaculty.map(fac => {
              const facSlots = timetables.filter(t => t.facultyId === fac.id);
              return (
                <div
                  key={fac.id}
                  id={`faculty-card-${fac.id}`}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-5">
                    {/* Header: Avatar, Name, Employee ID */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-sm shadow-indigo-500/20">
                          {fac.name.replace('Prof. ', '').replace('Dr. ', '').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white text-base leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {fac.name}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                            <Briefcase className="w-3.5 h-3.5 shrink-0" />
                            <span>{fac.designation || 'Faculty Member'}</span>
                          </div>
                        </div>
                      </div>

                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0 font-medium">
                        {fac.employeeId || 'EMP'}
                      </span>
                    </div>

                    {/* Faculty Metadata Badges */}
                    <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 mb-4 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                          {fac.department || 'Academic Department'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{fac.email}</span>
                      </div>

                      {fac.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{fac.phone}</span>
                        </div>
                      )}

                      {fac.cabin && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{fac.cabin}</span>
                        </div>
                      )}
                    </div>

                    {/* Specialization & Teaching Load */}
                    {fac.specialization && (
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
                          Research & Specialization
                        </div>
                        <div className="text-slate-700 dark:text-slate-300 font-medium line-clamp-1">
                          {fac.specialization}
                        </div>
                      </div>
                    )}

                    {/* Credentials Preview Info */}
                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <KeyRound className="w-3 h-3 text-slate-400" />
                        Username: <strong className="font-mono text-slate-700 dark:text-slate-200">{fac.username}</strong>
                      </span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                        {facSlots.length} class {facSlots.length === 1 ? 'slot' : 'slots'}
                      </span>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="px-5 py-3 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      id={`inspect-faculty-${fac.id}`}
                      onClick={() => setInspectingFaculty(fac)}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <span>View Dossier</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        id={`edit-faculty-${fac.id}`}
                        onClick={() => handleOpenEditFaculty(fac)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700/60 transition-colors"
                        title="Edit Faculty Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        id={`delete-faculty-${fac.id}`}
                        onClick={() => handleDeleteFaculty(fac)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-slate-700/60 transition-colors"
                        title="Delete Faculty Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredFaculty.length === 0 && (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <UserCheck className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">No faculty members found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Try adjusting your search query or department filter.
              </p>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW 2: FACULTY TIMETABLE & SCHEDULER
         ========================================================================= */}
      {activeSubTab === 'timetable' && (
        <div className="space-y-6">
          {/* Timetable Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Filter by Faculty:</span>
              </div>
              <select
                id="timetable-faculty-filter"
                value={selectedFacultyFilter}
                onChange={e => setSelectedFacultyFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="ALL">All Faculty Members ({timetables.length} Slots)</option>
                {facultyList.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.department})
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 ml-0 sm:ml-2">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Day:</span>
              </div>
              <select
                id="timetable-day-filter"
                value={selectedDayFilter}
                onChange={e => setSelectedDayFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="ALL">All Days (Mon - Sat)</option>
                {DAYS_OF_WEEK.map(d => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400">
              Showing <strong className="text-slate-900 dark:text-white">{filteredTimetables.length}</strong> scheduled lectures/labs
            </div>
          </div>

          {/* Timetable Table List */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3.5">Day & Time</th>
                    <th className="px-4 py-3.5">Faculty Member</th>
                    <th className="px-4 py-3.5">Course Code & Name</th>
                    <th className="px-4 py-3.5">Program / Class</th>
                    <th className="px-4 py-3.5">Room / Venue</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredTimetables.map(slot => (
                    <tr key={slot.id} id={`tt-row-${slot.id}`} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3.5 font-medium">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold">
                            {slot.dayOfWeek}
                          </span>
                          <span className="text-slate-600 dark:text-slate-400 text-[11px] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                            {slot.facultyName.charAt(0)}
                          </div>
                          <span>{slot.facultyName}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          <span className="font-mono text-indigo-600 dark:text-indigo-400 mr-1.5">{slot.courseCode}</span>
                          {slot.courseName}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                        <span className="font-medium">{slot.programName}</span>
                        <span className="text-slate-400 ml-1">Sem {slot.semesterNumber} (Sec {slot.sectionName})</span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {slot.roomNo}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            id={`edit-slot-${slot.id}`}
                            onClick={() => handleOpenEditSlot(slot)}
                            className="p-1 rounded text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit schedule slot"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`delete-slot-${slot.id}`}
                            onClick={() => handleDeleteSlot(slot)}
                            className="p-1 rounded text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Delete slot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredTimetables.length === 0 && (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                No timetable slots match the selected faculty or day filters.
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD / EDIT FACULTY ACCOUNT
         ========================================================================= */}
      {isFacultyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {editingFacultyId ? 'Edit Faculty Profile' : 'Register New Faculty Account'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Faculty will be able to log in using these credentials.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFacultyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFaculty} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Full Name with Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="e.g. Prof. Arvind Gupta"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Employee ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formEmployeeId}
                    onChange={e => setFormEmployeeId(e.target.value)}
                    placeholder="e.g. EMP-CSE-105"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>
              </div>

              {/* Login Credentials Section */}
              <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
                <div className="flex items-center gap-1.5 font-semibold text-indigo-800 dark:text-indigo-300 mb-2">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Portal Login Credentials</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      required
                      value={formUsername}
                      onChange={e => setFormUsername(e.target.value)}
                      placeholder="e.g. agupta"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Password *
                    </label>
                    <input
                      type="text"
                      required
                      value={formPassword}
                      onChange={e => setFormPassword(e.target.value)}
                      placeholder="e.g. faculty123"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    placeholder="e.g. arvind.g@college.edu"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <select
                    value={formDepartment}
                    onChange={e => setFormDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Computer Applications & BCA/MCA">Computer Applications & BCA/MCA</option>
                    <option value="Information Technology">Information Technology</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={formDesignation}
                    onChange={e => setFormDesignation(e.target.value)}
                    placeholder="e.g. Associate Professor"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Office / Cabin Location
                  </label>
                  <input
                    type="text"
                    value={formCabin}
                    onChange={e => setFormCabin(e.target.value)}
                    placeholder="e.g. CS Block, Room 304"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Highest Qualification
                  </label>
                  <input
                    type="text"
                    value={formQualification}
                    onChange={e => setFormQualification(e.target.value)}
                    placeholder="e.g. Ph.D, M.Tech in AI"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Research Specialization & Core Subjects
                </label>
                <input
                  type="text"
                  value={formSpecialization}
                  onChange={e => setFormSpecialization(e.target.value)}
                  placeholder="e.g. Distributed Computing, Spring Boot, Big Data Analytics"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFacultyModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm shadow-indigo-500/20"
                >
                  {editingFacultyId ? 'Save Changes' : 'Create Faculty Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: SCHEDULE CLASS SLOT / TIMETABLE
         ========================================================================= */}
      {isSlotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {editingSlotId ? 'Edit Timetable Slot' : 'Assign Faculty Class Slot'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Schedule weekly teaching hour for faculty.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSlotModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSlot} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Faculty Member *
                </label>
                <select
                  value={slotFacultyId}
                  onChange={e => setSlotFacultyId(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                >
                  {facultyList.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Day of Week *
                  </label>
                  <select
                    value={slotDay}
                    onChange={e => setSlotDay(e.target.value as DayOfWeek)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  >
                    {DAYS_OF_WEEK.map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Room / Hall No. *
                  </label>
                  <input
                    type="text"
                    required
                    value={slotRoomNo}
                    onChange={e => setSlotRoomNo(e.target.value)}
                    placeholder="e.g. LH-301 / Lab CS-2"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={slotStartTime}
                    onChange={e => setSlotStartTime(e.target.value)}
                    placeholder="09:00 AM"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    End Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={slotEndTime}
                    onChange={e => setSlotEndTime(e.target.value)}
                    placeholder="10:00 AM"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Program
                  </label>
                  <select
                    value={slotProgramName}
                    onChange={e => setSlotProgramName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="B.Tech CSE">B.Tech CSE</option>
                    <option value="B.Tech AI">B.Tech AI</option>
                    <option value="B.Tech ECE">B.Tech ECE</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Semester
                  </label>
                  <select
                    value={slotSemester}
                    onChange={e => setSlotSemester(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                      <option key={n} value={n}>
                        Sem {n}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Section
                  </label>
                  <input
                    type="text"
                    required
                    value={slotSection}
                    onChange={e => setSlotSection(e.target.value)}
                    placeholder="A"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={slotCourseCode}
                    onChange={e => setSlotCourseCode(e.target.value)}
                    placeholder="CS501"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Course / Subject Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={slotCourseName}
                    onChange={e => setSlotCourseName(e.target.value)}
                    placeholder="Data Structures & Algorithms"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSlotModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm shadow-indigo-500/20"
                >
                  {editingSlotId ? 'Save Schedule' : 'Assign Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL / DRAWER: INSPECT FACULTY DOSSIER
         ========================================================================= */}
      {inspectingFaculty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white font-bold text-lg flex items-center justify-center">
                  {inspectingFaculty.name.replace('Prof. ', '').replace('Dr. ', '').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">
                    {inspectingFaculty.name}
                  </h3>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                    {inspectingFaculty.designation} • {inspectingFaculty.department}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setInspectingFaculty(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            {/* Content Details */}
            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Employee ID</div>
                  <div className="font-mono font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {inspectingFaculty.employeeId || 'N/A'}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Cabin / Office</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                    {inspectingFaculty.cabin || 'Main Faculty Block'}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Portal Login ID</div>
                  <div className="font-mono font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {inspectingFaculty.username}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Official Email</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                    {inspectingFaculty.email}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Phone Contact</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                    {inspectingFaculty.phone || 'N/A'}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Qualifications</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                    {inspectingFaculty.qualification || 'M.Tech / Ph.D'}
                  </div>
                </div>
              </div>

              {/* Research Focus */}
              {inspectingFaculty.specialization && (
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white mb-1">
                    Specialization & Subject Expertise
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/20 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    {inspectingFaculty.specialization}
                  </p>
                </div>
              )}

              {/* Individual Assigned Timetable */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Assigned Weekly Teaching Schedule
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {timetables.filter(t => t.facultyId === inspectingFaculty.id).length} classes scheduled
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {timetables
                    .filter(t => t.facultyId === inspectingFaculty.id)
                    .map(slot => (
                      <div
                        key={slot.id}
                        className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            <span className="font-mono text-indigo-600 mr-1.5">{slot.courseCode}</span>
                            {slot.courseName}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {slot.dayOfWeek} • {slot.startTime} - {slot.endTime} • {slot.programName} Sem {slot.semesterNumber} (Sec {slot.sectionName})
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {slot.roomNo}
                        </span>
                      </div>
                    ))}

                  {timetables.filter(t => t.facultyId === inspectingFaculty.id).length === 0 && (
                    <div className="p-4 text-center text-slate-400 text-xs">
                      No timetable slots allocated for this faculty member yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setInspectingFaculty(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-semibold"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
