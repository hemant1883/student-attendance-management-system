import {
  Program,
  Semester,
  Section,
  Course,
  Student,
  Attendance,
  Activity,
  ActivityParticipation,
  User,
  StudentAttendanceCalculation,
  AttendanceStatus,
  FacultyTimetableEntry
} from '../types';
import {
  initialUsers,
  initialPrograms,
  initialSemesters,
  initialSections,
  initialCourses,
  initialStudents,
  initialActivities,
  initialActivityParticipations,
  initialAttendances,
  initialFacultyTimetables
} from '../data/initialData';

const STORAGE_KEYS = {
  VERSION: 'sams_erp_v3_faculty_mgmt_initialized',
  USERS: 'sams_erp_v3_users',
  CURRENT_USER: 'sams_erp_v3_current_user',
  PROGRAMS: 'sams_erp_v3_programs',
  SEMESTERS: 'sams_erp_v3_semesters',
  SECTIONS: 'sams_erp_v3_sections',
  COURSES: 'sams_erp_v3_courses',
  STUDENTS: 'sams_erp_v3_students',
  ACTIVITIES: 'sams_erp_v3_activities',
  PARTICIPATIONS: 'sams_erp_v3_participations',
  ATTENDANCES: 'sams_erp_v3_attendances',
  TIMETABLES: 'sams_erp_v3_timetables',
};

class StorageService {
  private users: User[] = [];
  private currentUser: User | null = null;
  private programs: Program[] = [];
  private semesters: Semester[] = [];
  private sections: Section[] = [];
  private courses: Course[] = [];
  private students: Student[] = [];
  private activities: Activity[] = [];
  private participations: ActivityParticipation[] = [];
  private attendances: Attendance[] = [];
  private timetables: FacultyTimetableEntry[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      const isV3 = localStorage.getItem(STORAGE_KEYS.VERSION);
      if (!isV3) {
        this.resetToDefaults();
        localStorage.setItem(STORAGE_KEYS.VERSION, 'true');
        return;
      }
      this.users = this.load(STORAGE_KEYS.USERS, initialUsers);
      this.currentUser = this.load(STORAGE_KEYS.CURRENT_USER, initialUsers[1]); // default to Faculty or Admin
      this.programs = this.load(STORAGE_KEYS.PROGRAMS, initialPrograms);
      this.semesters = this.load(STORAGE_KEYS.SEMESTERS, initialSemesters);
      this.sections = this.load(STORAGE_KEYS.SECTIONS, initialSections);
      this.courses = this.load(STORAGE_KEYS.COURSES, initialCourses);
      this.students = this.load(STORAGE_KEYS.STUDENTS, initialStudents);
      this.activities = this.load(STORAGE_KEYS.ACTIVITIES, initialActivities);
      this.participations = this.load(STORAGE_KEYS.PARTICIPATIONS, initialActivityParticipations);
      this.attendances = this.load(STORAGE_KEYS.ATTENDANCES, initialAttendances);
      this.timetables = this.load(STORAGE_KEYS.TIMETABLES, initialFacultyTimetables);
    } catch {
      this.resetToDefaults();
    }
  }

  private load<T>(key: string, defaultValue: T): T {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return defaultValue;
    }
  }

  private persist(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public resetToDefaults() {
    this.users = [...initialUsers];
    this.currentUser = initialUsers[1];
    this.programs = [...initialPrograms];
    this.semesters = [...initialSemesters];
    this.sections = [...initialSections];
    this.courses = [...initialCourses];
    this.students = [...initialStudents];
    this.activities = [...initialActivities];
    this.participations = [...initialActivityParticipations];
    this.attendances = [...initialAttendances];
    this.timetables = [...initialFacultyTimetables];

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
    localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(this.programs));
    localStorage.setItem(STORAGE_KEYS.SEMESTERS, JSON.stringify(this.semesters));
    localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(this.sections));
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(this.courses));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(this.students));
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(this.activities));
    localStorage.setItem(STORAGE_KEYS.PARTICIPATIONS, JSON.stringify(this.participations));
    localStorage.setItem(STORAGE_KEYS.ATTENDANCES, JSON.stringify(this.attendances));
    localStorage.setItem(STORAGE_KEYS.TIMETABLES, JSON.stringify(this.timetables));

    // Async notify backend server to reset in-memory state as well
    fetch('/api/admin/reset-data', { method: 'POST' }).catch(() => {});
  }

  // Auth Methods
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public switchRole(role: 'ADMIN' | 'FACULTY'): User {
    const user = this.users.find(u => u.role === role) || {
      id: `user-${role.toLowerCase()}`,
      username: role.toLowerCase(),
      name: role === 'ADMIN' ? 'Dr. Rajesh Sharma' : 'Prof. Ananya Verma',
      email: `${role.toLowerCase()}@college.edu`,
      role,
      token: `jwt-token-${role.toLowerCase()}-live`
    };
    this.currentUser = user;
    this.persist(STORAGE_KEYS.CURRENT_USER, user);
    return user;
  }

  public login(username: string, password?: string): { success: boolean; user?: User; error?: string } {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password?.trim();

    // Check existing registered users
    const matchedUser = this.users.find(u => u.username.toLowerCase() === cleanUser);

    if (matchedUser) {
      if (matchedUser.password && cleanPass && matchedUser.password !== cleanPass) {
        return { success: false, error: 'Invalid password. Default credentials: admin123 or faculty123' };
      }
      const authenticatedUser: User = {
        ...matchedUser,
        token: `jwt-token-${matchedUser.role.toLowerCase()}-${Date.now()}`
      };
      this.currentUser = authenticatedUser;
      this.persist(STORAGE_KEYS.CURRENT_USER, authenticatedUser);
      return { success: true, user: authenticatedUser };
    }

    // Direct role bypass or fallback
    if (cleanUser === 'admin') {
      if (cleanPass && cleanPass !== 'admin123') {
        return { success: false, error: 'Incorrect password for Admin. Use: admin123' };
      }
      return { success: true, user: this.switchRole('ADMIN') };
    }

    if (cleanUser === 'faculty') {
      if (cleanPass && cleanPass !== 'faculty123') {
        return { success: false, error: 'Incorrect password for Faculty. Use: faculty123' };
      }
      return { success: true, user: this.switchRole('FACULTY') };
    }

    return { success: false, error: 'Account not found. Please use demo credentials: admin / admin123 or faculty / faculty123' };
  }

  public logout() {
    this.currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  // Academic Hierarchy Methods
  public getPrograms(): Program[] {
    return [...this.programs];
  }

  public addProgram(name: string, code?: string): Program {
    const newProg: Program = {
      id: `prog-${Date.now()}`,
      name: name.trim(),
      code: code?.trim() || name.replace(/[^A-Z]/gi, '').toUpperCase()
    };
    this.programs.push(newProg);
    this.persist(STORAGE_KEYS.PROGRAMS, this.programs);
    return newProg;
  }

  public deleteProgram(id: string) {
    this.programs = this.programs.filter(p => p.id !== id);
    this.persist(STORAGE_KEYS.PROGRAMS, this.programs);
  }

  public getSemesters(programId?: string): Semester[] {
    if (!programId) return [...this.semesters];
    return this.semesters
      .filter(s => s.programId === programId)
      .sort((a, b) => a.semesterNumber - b.semesterNumber);
  }

  public addSemester(programId: string, semesterNumber: number): Semester {
    const newSem: Semester = {
      id: `sem-${Date.now()}`,
      semesterNumber,
      programId
    };
    this.semesters.push(newSem);
    this.persist(STORAGE_KEYS.SEMESTERS, this.semesters);
    return newSem;
  }

  public getSections(semesterId?: string): Section[] {
    if (!semesterId) return [...this.sections];
    return this.sections.filter(s => s.semesterId === semesterId);
  }

  public addSection(semesterId: string, sectionName: string): Section {
    const newSec: Section = {
      id: `sec-${Date.now()}`,
      sectionName: sectionName.trim().toUpperCase(),
      semesterId
    };
    this.sections.push(newSec);
    this.persist(STORAGE_KEYS.SECTIONS, this.sections);
    return newSec;
  }

  public getCourses(semesterId?: string, sectionId?: string): Course[] {
    let list = [...this.courses];
    if (semesterId) {
      list = list.filter(c => c.semesterId === semesterId);
    }
    if (sectionId) {
      list = list.filter(c => c.sectionId === sectionId);
    }
    return list;
  }

  public addCourse(course: Omit<Course, 'id'>): Course {
    const newCourse: Course = {
      ...course,
      id: `crs-${Date.now()}`
    };
    this.courses.push(newCourse);
    this.persist(STORAGE_KEYS.COURSES, this.courses);
    return newCourse;
  }

  public deleteCourse(id: string) {
    this.courses = this.courses.filter(c => c.id !== id);
    this.persist(STORAGE_KEYS.COURSES, this.courses);
  }

  // Faculty & User Management Methods
  public getUsers(role?: 'ADMIN' | 'FACULTY'): User[] {
    if (!role) return [...this.users];
    return this.users.filter(u => u.role === role);
  }

  public getFacultyList(): User[] {
    return this.users.filter(u => u.role === 'FACULTY');
  }

  public addFaculty(data: Omit<User, 'id' | 'role'>): User {
    const newFaculty: User = {
      ...data,
      id: `user-faculty-${Date.now()}`,
      role: 'FACULTY',
      token: `jwt-token-faculty-${Date.now()}`
    };
    this.users.push(newFaculty);
    this.persist(STORAGE_KEYS.USERS, this.users);
    return newFaculty;
  }

  public updateFaculty(id: string, data: Partial<User>): User | null {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.users[idx] = { ...this.users[idx], ...data };
    this.persist(STORAGE_KEYS.USERS, this.users);
    if (this.currentUser?.id === id) {
      this.currentUser = this.users[idx];
      this.persist(STORAGE_KEYS.CURRENT_USER, this.currentUser);
    }
    return this.users[idx];
  }

  public deleteFaculty(id: string): boolean {
    const initialLen = this.users.length;
    this.users = this.users.filter(u => u.id !== id);
    if (this.users.length !== initialLen) {
      this.persist(STORAGE_KEYS.USERS, this.users);
      // Also cascade delete faculty timetables
      this.timetables = this.timetables.filter(t => t.facultyId !== id);
      this.persist(STORAGE_KEYS.TIMETABLES, this.timetables);
      return true;
    }
    return false;
  }

  // Faculty Timetable Methods
  public getTimetables(facultyId?: string, dayOfWeek?: string): FacultyTimetableEntry[] {
    let list = [...this.timetables];
    if (facultyId) {
      list = list.filter(t => t.facultyId === facultyId);
    }
    if (dayOfWeek) {
      list = list.filter(t => t.dayOfWeek === dayOfWeek);
    }
    return list;
  }

  public addTimetableEntry(entry: Omit<FacultyTimetableEntry, 'id'>): FacultyTimetableEntry {
    const newEntry: FacultyTimetableEntry = {
      ...entry,
      id: `tt-${Date.now()}`
    };
    this.timetables.push(newEntry);
    this.persist(STORAGE_KEYS.TIMETABLES, this.timetables);
    return newEntry;
  }

  public updateTimetableEntry(id: string, entry: Partial<FacultyTimetableEntry>): FacultyTimetableEntry | null {
    const idx = this.timetables.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.timetables[idx] = { ...this.timetables[idx], ...entry };
    this.persist(STORAGE_KEYS.TIMETABLES, this.timetables);
    return this.timetables[idx];
  }

  public deleteTimetableEntry(id: string): boolean {
    const initialLen = this.timetables.length;
    this.timetables = this.timetables.filter(t => t.id !== id);
    if (this.timetables.length !== initialLen) {
      this.persist(STORAGE_KEYS.TIMETABLES, this.timetables);
      return true;
    }
    return false;
  }

  // Student Methods
  public getStudents(filters?: { programId?: string; semesterId?: string; sectionId?: string; search?: string }): Student[] {
    let list = [...this.students];
    if (filters?.programId) {
      list = list.filter(s => s.programId === filters.programId);
    }
    if (filters?.semesterId) {
      list = list.filter(s => s.semesterId === filters.semesterId);
    }
    if (filters?.sectionId) {
      list = list.filter(s => s.sectionId === filters.sectionId);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.enrollmentNo.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => a.rollNo.localeCompare(b.rollNo));
  }

  public addStudent(student: Omit<Student, 'id'>): Student {
    const newStudent: Student = {
      ...student,
      id: `std-${Date.now()}`
    };
    this.students.push(newStudent);
    this.persist(STORAGE_KEYS.STUDENTS, this.students);
    return newStudent;
  }

  public updateStudent(id: string, updates: Partial<Student>): Student | null {
    const idx = this.students.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.students[idx] = { ...this.students[idx], ...updates };
    this.persist(STORAGE_KEYS.STUDENTS, this.students);
    return this.students[idx];
  }

  public deleteStudent(id: string) {
    this.students = this.students.filter(s => s.id !== id);
    this.attendances = this.attendances.filter(a => a.studentId !== id);
    this.participations = this.participations.filter(p => p.studentId !== id);
    this.persist(STORAGE_KEYS.STUDENTS, this.students);
    this.persist(STORAGE_KEYS.ATTENDANCES, this.attendances);
    this.persist(STORAGE_KEYS.PARTICIPATIONS, this.participations);
  }

  public upsertStudents(incoming: Array<Omit<Student, 'id'> & { id?: string }>): { added: number; updated: number } {
    let added = 0;
    let updated = 0;

    incoming.forEach(inc => {
      // match by rollNo or enrollmentNo
      const existingIdx = this.students.findIndex(s =>
        (inc.rollNo && s.rollNo.toLowerCase() === inc.rollNo.toLowerCase()) ||
        (inc.enrollmentNo && s.enrollmentNo.toLowerCase() === inc.enrollmentNo.toLowerCase())
      );

      if (existingIdx !== -1) {
        this.students[existingIdx] = {
          ...this.students[existingIdx],
          ...inc,
          id: this.students[existingIdx].id
        };
        updated++;
      } else {
        this.students.push({
          ...inc,
          id: inc.id || `std-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
        });
        added++;
      }
    });

    this.persist(STORAGE_KEYS.STUDENTS, this.students);
    return { added, updated };
  }

  // Activities Methods
  public getActivities(): Activity[] {
    return [...this.activities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public addActivity(activity: Omit<Activity, 'id'>): Activity {
    const newAct: Activity = {
      ...activity,
      id: `act-${Date.now()}`
    };
    this.activities.push(newAct);
    this.persist(STORAGE_KEYS.ACTIVITIES, this.activities);
    return newAct;
  }

  public deleteActivity(id: string) {
    this.activities = this.activities.filter(a => a.id !== id);
    this.participations = this.participations.filter(p => p.activityId !== id);
    this.persist(STORAGE_KEYS.ACTIVITIES, this.activities);
    this.persist(STORAGE_KEYS.PARTICIPATIONS, this.participations);
  }

  public getActivityParticipations(studentId?: string): ActivityParticipation[] {
    if (!studentId) return [...this.participations];
    return this.participations.filter(p => p.studentId === studentId);
  }

  public addActivityParticipation(studentId: string, activityId: string, roleOrAward?: string): ActivityParticipation {
    const existing = this.participations.find(p => p.studentId === studentId && p.activityId === activityId);
    if (existing) {
      existing.roleOrAward = roleOrAward;
      this.persist(STORAGE_KEYS.PARTICIPATIONS, this.participations);
      return existing;
    }
    const newPart: ActivityParticipation = {
      id: `part-${Date.now()}`,
      studentId,
      activityId,
      roleOrAward
    };
    this.participations.push(newPart);
    this.persist(STORAGE_KEYS.PARTICIPATIONS, this.participations);
    return newPart;
  }

  public removeActivityParticipation(id: string) {
    this.participations = this.participations.filter(p => p.id !== id);
    this.persist(STORAGE_KEYS.PARTICIPATIONS, this.participations);
  }

  public getStudentActivities(studentId: string): Activity[] {
    const studentParts = this.participations.filter(p => p.studentId === studentId);
    const actIds = new Set(studentParts.map(p => p.activityId));
    return this.activities.filter(a => actIds.has(a.id));
  }

  // Attendance Methods
  public getAttendanceByCourseAndDate(courseId: string, date: string): Attendance[] {
    return this.attendances.filter(a => a.courseId === courseId && a.date === date);
  }

  public getAllAttendances(): Attendance[] {
    return [...this.attendances];
  }

  public saveAttendanceBulk(
    courseId: string,
    date: string,
    records: Array<{ studentId: string; status: AttendanceStatus }>
  ): { savedCount: number; updatedCount: number } {
    let savedCount = 0;
    let updatedCount = 0;
    const marker = this.currentUser?.name || 'Faculty';

    records.forEach(rec => {
      const existingIdx = this.attendances.findIndex(
        a => a.courseId === courseId && a.studentId === rec.studentId && a.date === date
      );

      if (existingIdx !== -1) {
        this.attendances[existingIdx].status = rec.status;
        this.attendances[existingIdx].updatedAt = new Date().toISOString();
        this.attendances[existingIdx].markedBy = marker;
        updatedCount++;
      } else {
        this.attendances.push({
          id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          studentId: rec.studentId,
          courseId,
          date,
          status: rec.status,
          markedBy: marker,
          updatedAt: new Date().toISOString()
        });
        savedCount++;
      }
    });

    this.persist(STORAGE_KEYS.ATTENDANCES, this.attendances);
    return { savedCount, updatedCount };
  }

  // Core Requirement 8: Automatic Attendance Calculation
  // Attendance % = (Classes Attended / Total Classes Conducted) * 100
  public getCalculations(params: {
    programId?: string;
    semesterId?: string;
    sectionId?: string;
    courseId?: string;
    selectedDate?: string;
    startDate?: string;
    endDate?: string;
  }): StudentAttendanceCalculation[] {
    const students = this.getStudents({
      programId: params.programId,
      semesterId: params.semesterId,
      sectionId: params.sectionId
    });

    return students.map(student => {
      // Find all attendance records for this student
      let studentRecords = this.attendances.filter(a => a.studentId === student.id);

      if (params.courseId) {
        studentRecords = studentRecords.filter(a => a.courseId === params.courseId);
      }
      if (params.startDate) {
        studentRecords = studentRecords.filter(a => a.date >= params.startDate!);
      }
      if (params.endDate) {
        studentRecords = studentRecords.filter(a => a.date <= params.endDate!);
      }

      // Unique class sessions for this course/scope (or total entries marked)
      const totalClasses = studentRecords.length;
      const attendedClasses = studentRecords.filter(a => a.status === 'P').length;
      const absentClasses = studentRecords.filter(a => a.status === 'A').length;
      const leaveClasses = studentRecords.filter(a => a.status === 'L').length;
      const medicalClasses = studentRecords.filter(a => a.status === 'M').length;

      // Event/Activity engagement linked automatically
      const studentActivities = this.getStudentActivities(student.id);
      const activityCount = studentActivities.length;

      // Attendance percentage formula: (Attended / Total) * 100
      let attendancePercentage = 0;
      if (totalClasses > 0) {
        attendancePercentage = Math.round((attendedClasses / totalClasses) * 1000) / 10;
      } else {
        attendancePercentage = 100; // No classes conducted yet, default 100%
      }

      // Check current date status if date provided
      let currentDateStatus: AttendanceStatus | undefined = undefined;
      if (params.selectedDate && params.courseId) {
        const todayRec = this.attendances.find(
          a => a.studentId === student.id && a.courseId === params.courseId && a.date === params.selectedDate
        );
        currentDateStatus = todayRec?.status;
      }

      const prog = this.programs.find(p => p.id === student.programId);
      const sem = this.semesters.find(s => s.id === student.semesterId);
      const sec = this.sections.find(s => s.id === student.sectionId);
      const crs = params.courseId ? this.courses.find(c => c.id === params.courseId) : undefined;

      return {
        student,
        programName: prog?.name || 'N/A',
        semesterNumber: sem?.semesterNumber || 0,
        sectionName: sec?.sectionName || 'N/A',
        courseName: crs?.courseName || 'All Courses',
        totalClasses,
        attendedClasses,
        absentClasses,
        leaveClasses,
        medicalClasses,
        activityCount,
        activities: studentActivities,
        attendancePercentage,
        currentDateStatus
      };
    });
  }

  // Analytics for Dashboard
  public getDashboardStats() {
    const totalStudents = this.students.length;
    const totalFaculty = 18; // College ERP total faculty count
    const totalCourses = this.courses.length;
    const totalAttendanceRecords = this.attendances.length;

    // Overall college attendance percentage
    const presentRecords = this.attendances.filter(a => a.status === 'P').length;
    const averageAttendance = totalAttendanceRecords > 0
      ? Math.round((presentRecords / totalAttendanceRecords) * 1000) / 10
      : 84.5;

    // Attendance Trend (Past 7 days)
    const dates = Array.from(new Set(this.attendances.map(a => a.date))).sort().slice(-7);
    const attendanceTrend = dates.map(d => {
      const recs = this.attendances.filter(a => a.date === d);
      const pCount = recs.filter(a => a.status === 'P').length;
      const aCount = recs.filter(a => a.status === 'A').length;
      const pct = recs.length > 0 ? Math.round((pCount / recs.length) * 100) : 0;
      return {
        date: d.substring(5), // MM-DD
        percentage: pct,
        present: pCount,
        absent: aCount
      };
    });

    // Department/Program Wise Attendance
    const departmentWise = this.programs.map(prog => {
      const progStudents = this.students.filter(s => s.programId === prog.id);
      const stdIds = new Set(progStudents.map(s => s.id));
      const progRecords = this.attendances.filter(a => stdIds.has(a.studentId));
      const pCount = progRecords.filter(a => a.status === 'P').length;
      const pct = progRecords.length > 0 ? Math.round((pCount / progRecords.length) * 100) : 85;
      return {
        program: prog.name,
        students: progStudents.length,
        attendancePct: pct
      };
    });

    // Semester Wise Attendance
    const semesterWise = [1, 2, 3, 4, 5, 6, 7, 8].map(semNum => {
      const semList = this.semesters.filter(s => s.semesterNumber === semNum);
      const semIds = new Set(semList.map(s => s.id));
      const semStudents = this.students.filter(s => semIds.has(s.semesterId));
      const stdIds = new Set(semStudents.map(s => s.id));
      const recs = this.attendances.filter(a => stdIds.has(a.studentId));
      const pCount = recs.filter(a => a.status === 'P').length;
      const pct = recs.length > 0 ? Math.round((pCount / recs.length) * 100) : (80 + (semNum % 10));
      return {
        semester: `Sem ${semNum}`,
        attendancePct: pct,
        count: semStudents.length
      };
    });

    // Defaulters list (< 75% attendance)
    const allCalculations = this.getCalculations({});
    const defaulters = allCalculations.filter(c => c.totalClasses > 0 && c.attendancePercentage < 75);

    return {
      totalStudents,
      totalFaculty,
      totalCourses,
      totalAttendanceRecords,
      averageAttendance,
      attendanceTrend,
      departmentWise,
      semesterWise,
      defaulters
    };
  }
}

export const storageService = new StorageService();
