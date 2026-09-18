import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
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
  initialFacultyTimetables,
} from './src/data/initialData';
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
  AttendanceStatus,
  StudentAttendanceCalculation,
  FacultyTimetableEntry,
} from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-Memory Database State for the Backend REST API
class BackendDatabase {
  public users: User[] = [...initialUsers];
  public programs: Program[] = [...initialPrograms];
  public semesters: Semester[] = [...initialSemesters];
  public sections: Section[] = [...initialSections];
  public courses: Course[] = [...initialCourses];
  public students: Student[] = [...initialStudents];
  public activities: Activity[] = [...initialActivities];
  public participations: ActivityParticipation[] = [...initialActivityParticipations];
  public attendances: Attendance[] = [...initialAttendances];
  public timetables: FacultyTimetableEntry[] = [...initialFacultyTimetables];

  public resetToDefaults() {
    this.users = [...initialUsers];
    this.programs = [...initialPrograms];
    this.semesters = [...initialSemesters];
    this.sections = [...initialSections];
    this.courses = [...initialCourses];
    this.students = [...initialStudents];
    this.activities = [...initialActivities];
    this.participations = [...initialActivityParticipations];
    this.attendances = [...initialAttendances];
    this.timetables = [...initialFacultyTimetables];
  }
}

const db = new BackendDatabase();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // --- API ROUTE: Health check & system status ---
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'UP',
      system: 'SAMS ERP REST Backend',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      counts: {
        students: db.students.length,
        programs: db.programs.length,
        courses: db.courses.length,
        attendances: db.attendances.length,
        activities: db.activities.length,
      },
    });
  });

  // --- API ROUTE: Auth & Users ---
  app.get('/api/users', (req: Request, res: Response) => {
    res.json(db.users);
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { username, password, role } = req.body;
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // Check by username
    let user = db.users.find(u => u.username.toLowerCase() === cleanUser);
    if (!user && role) {
      user = db.users.find(u => u.role === role);
    }

    if (user) {
      if (user.password && cleanPass && user.password !== cleanPass) {
        return res.status(401).json({ error: 'Invalid password. Try admin123 or faculty123' });
      }
      return res.json({ success: true, user, token: user.token });
    }

    // Direct fallback for demo logins
    if (cleanUser === 'admin') {
      if (cleanPass && cleanPass !== 'admin123') {
        return res.status(401).json({ error: 'Invalid password for admin. Use: admin123' });
      }
      const adminUser = db.users.find(u => u.role === 'ADMIN') || {
        id: 'user-admin',
        username: 'admin',
        password: 'admin123',
        name: 'Dr. Rajesh Sharma',
        email: 'admin.academics@college.edu',
        role: 'ADMIN' as const,
        department: 'Academic Affairs & ERP Administration',
        token: `jwt-token-admin-${Date.now()}`,
      };
      return res.json({ success: true, user: adminUser, token: adminUser.token });
    }

    if (cleanUser === 'faculty') {
      if (cleanPass && cleanPass !== 'faculty123') {
        return res.status(401).json({ error: 'Invalid password for faculty. Use: faculty123' });
      }
      const facultyUser = db.users.find(u => u.role === 'FACULTY') || {
        id: 'user-faculty',
        username: 'faculty',
        password: 'faculty123',
        name: 'Prof. Ananya Verma',
        email: 'ananya.verma@college.edu',
        role: 'FACULTY' as const,
        department: 'Computer Science & Engineering',
        token: `jwt-token-faculty-${Date.now()}`,
      };
      return res.json({ success: true, user: facultyUser, token: facultyUser.token });
    }

    return res.status(401).json({ error: 'Invalid credentials. Use admin/admin123 or faculty/faculty123' });
  });

  // --- API ROUTES: Academic Hierarchy (Programs, Semesters, Sections, Courses) ---
  app.get('/api/programs', (req: Request, res: Response) => {
    res.json(db.programs);
  });

  app.post('/api/programs', (req: Request, res: Response) => {
    const { name, code, durationYears } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Program name is required' });
    }
    const newProg: Program = {
      id: `prog-${Date.now()}`,
      name: name.trim(),
      code: code ? code.trim() : name.replace(/[^A-Z]/gi, '').toUpperCase(),
      durationYears: durationYears ? Number(durationYears) : 4,
    };
    db.programs.push(newProg);
    res.status(201).json(newProg);
  });

  app.delete('/api/programs/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    db.programs = db.programs.filter(p => p.id !== id);
    res.json({ success: true, deletedId: id });
  });

  app.get('/api/semesters', (req: Request, res: Response) => {
    const { programId } = req.query;
    let list = db.semesters;
    if (programId && typeof programId === 'string') {
      list = list.filter(s => s.programId === programId);
    }
    res.json(list.sort((a, b) => a.semesterNumber - b.semesterNumber));
  });

  app.post('/api/semesters', (req: Request, res: Response) => {
    const { programId, semesterNumber } = req.body;
    if (!programId || !semesterNumber) {
      return res.status(400).json({ error: 'programId and semesterNumber are required' });
    }
    const newSem: Semester = {
      id: `sem-${Date.now()}`,
      programId,
      semesterNumber: Number(semesterNumber),
    };
    db.semesters.push(newSem);
    res.status(201).json(newSem);
  });

  app.get('/api/sections', (req: Request, res: Response) => {
    const { semesterId } = req.query;
    let list = db.sections;
    if (semesterId && typeof semesterId === 'string') {
      list = list.filter(s => s.semesterId === semesterId);
    }
    res.json(list);
  });

  app.post('/api/sections', (req: Request, res: Response) => {
    const { semesterId, sectionName } = req.body;
    if (!semesterId || !sectionName) {
      return res.status(400).json({ error: 'semesterId and sectionName are required' });
    }
    const newSec: Section = {
      id: `sec-${Date.now()}`,
      sectionName: sectionName.trim().toUpperCase(),
      semesterId,
    };
    db.sections.push(newSec);
    res.status(201).json(newSec);
  });

  app.get('/api/courses', (req: Request, res: Response) => {
    const { semesterId, sectionId } = req.query;
    let list = db.courses;
    if (semesterId && typeof semesterId === 'string') {
      list = list.filter(c => c.semesterId === semesterId);
    }
    if (sectionId && typeof sectionId === 'string') {
      list = list.filter(c => c.sectionId === sectionId);
    }
    res.json(list);
  });

  app.post('/api/courses', (req: Request, res: Response) => {
    const { courseCode, courseName, semesterId, sectionId, credits, facultyName } = req.body;
    if (!courseCode || !courseName || !semesterId || !sectionId) {
      return res.status(400).json({ error: 'courseCode, courseName, semesterId, and sectionId are required' });
    }
    const newCourse: Course = {
      id: `crs-${Date.now()}`,
      courseCode: courseCode.trim().toUpperCase(),
      courseName: courseName.trim(),
      semesterId,
      sectionId,
      credits: credits ? Number(credits) : 3,
      facultyName: facultyName || 'Faculty',
    };
    db.courses.push(newCourse);
    res.status(201).json(newCourse);
  });

  app.delete('/api/courses/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    db.courses = db.courses.filter(c => c.id !== id);
    res.json({ success: true, deletedId: id });
  });

  // --- API ROUTES: Faculty Management & Accounts ---
  app.get('/api/faculty', (req: Request, res: Response) => {
    const { department, search } = req.query;
    let list = db.users.filter(u => u.role === 'FACULTY');
    if (department && typeof department === 'string') {
      list = list.filter(u => u.department === department);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      list = list.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.employeeId && u.employeeId.toLowerCase().includes(q)) ||
        (u.specialization && u.specialization.toLowerCase().includes(q))
      );
    }
    res.json(list);
  });

  app.post('/api/faculty', (req: Request, res: Response) => {
    const { name, email, username, password, department, designation, employeeId, phone, cabin, qualification, specialization } = req.body;
    if (!name || !email || !username) {
      return res.status(400).json({ error: 'Name, email, and username are required' });
    }
    const newFaculty: User = {
      id: `user-faculty-${Date.now()}`,
      username: username.trim().toLowerCase(),
      password: password ? password.trim() : 'faculty123',
      name: name.trim(),
      email: email.trim(),
      role: 'FACULTY',
      department: department || 'Computer Science & Engineering',
      designation: designation || 'Assistant Professor',
      employeeId: employeeId || `EMP-${Date.now().toString().slice(-4)}`,
      phone: phone || '+91 98765 00000',
      cabin: cabin || 'Faculty Block',
      qualification: qualification || 'M.Tech',
      specialization: specialization || 'General Computer Science',
      joiningDate: new Date().toISOString().split('T')[0],
      token: `jwt-token-faculty-${Date.now()}`,
    };
    db.users.push(newFaculty);
    res.status(201).json(newFaculty);
  });

  app.put('/api/faculty/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const idx = db.users.findIndex(u => u.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Faculty member not found' });
    }
    db.users[idx] = { ...db.users[idx], ...req.body };
    res.json(db.users[idx]);
  });

  app.delete('/api/faculty/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    db.users = db.users.filter(u => u.id !== id);
    db.timetables = db.timetables.filter(t => t.facultyId !== id);
    res.json({ success: true, deletedId: id });
  });

  // --- API ROUTES: Faculty Timetable ---
  app.get('/api/faculty/timetables', (req: Request, res: Response) => {
    const { facultyId, dayOfWeek } = req.query;
    let list = [...db.timetables];
    if (facultyId && typeof facultyId === 'string') {
      list = list.filter(t => t.facultyId === facultyId);
    }
    if (dayOfWeek && typeof dayOfWeek === 'string') {
      list = list.filter(t => t.dayOfWeek === dayOfWeek);
    }
    res.json(list);
  });

  app.post('/api/faculty/timetables', (req: Request, res: Response) => {
    const { facultyId, facultyName, dayOfWeek, startTime, endTime, courseCode, courseName, programName, semesterNumber, sectionName, roomNo } = req.body;
    if (!facultyId || !dayOfWeek || !startTime || !endTime || !courseName) {
      return res.status(400).json({ error: 'Missing required timetable fields' });
    }
    const newEntry: FacultyTimetableEntry = {
      id: `tt-${Date.now()}`,
      facultyId,
      facultyName: facultyName || 'Faculty',
      dayOfWeek,
      startTime,
      endTime,
      courseCode: courseCode || 'GEN001',
      courseName,
      programName: programName || 'General',
      semesterNumber: semesterNumber ? Number(semesterNumber) : 1,
      sectionName: sectionName || 'A',
      roomNo: roomNo || 'Room 101'
    };
    db.timetables.push(newEntry);
    res.status(201).json(newEntry);
  });

  app.delete('/api/faculty/timetables/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    db.timetables = db.timetables.filter(t => t.id !== id);
    res.json({ success: true, deletedId: id });
  });

  // --- API ROUTES: Students CRUD ---
  app.get('/api/students', (req: Request, res: Response) => {
    const { programId, semesterId, sectionId, search } = req.query;
    let list = [...db.students];

    if (programId && typeof programId === 'string') {
      list = list.filter(s => s.programId === programId);
    }
    if (semesterId && typeof semesterId === 'string') {
      list = list.filter(s => s.semesterId === semesterId);
    }
    if (sectionId && typeof sectionId === 'string') {
      list = list.filter(s => s.sectionId === sectionId);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.enrollmentNo.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    }
    res.json(list.sort((a, b) => a.rollNo.localeCompare(b.rollNo)));
  });

  app.post('/api/students', (req: Request, res: Response) => {
    const { rollNo, enrollmentNo, name, email, programId, semesterId, sectionId, phone } = req.body;
    if (!rollNo || !enrollmentNo || !name || !email || !programId || !semesterId || !sectionId) {
      return res.status(400).json({ error: 'Missing required student fields' });
    }
    const newStudent: Student = {
      id: `std-${Date.now()}`,
      rollNo: rollNo.trim().toUpperCase(),
      enrollmentNo: enrollmentNo.trim().toUpperCase(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      programId,
      semesterId,
      sectionId,
      phone: phone?.trim(),
    };
    db.students.push(newStudent);
    res.status(201).json(newStudent);
  });

  app.put('/api/students/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const idx = db.students.findIndex(s => s.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Student not found' });
    }
    db.students[idx] = { ...db.students[idx], ...req.body, id };
    res.json(db.students[idx]);
  });

  app.delete('/api/students/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    db.students = db.students.filter(s => s.id !== id);
    db.attendances = db.attendances.filter(a => a.studentId !== id);
    db.participations = db.participations.filter(p => p.studentId !== id);
    res.json({ success: true, deletedId: id });
  });

  // Bulk upsert for Excel integration
  app.post('/api/students/bulk-upsert', (req: Request, res: Response) => {
    const { students } = req.body;
    if (!Array.isArray(students)) {
      return res.status(400).json({ error: 'students array is required' });
    }
    let added = 0;
    let updated = 0;
    students.forEach((inc: any) => {
      const idx = db.students.findIndex(
        s => (inc.rollNo && s.rollNo.toLowerCase() === inc.rollNo.toLowerCase()) ||
             (inc.enrollmentNo && s.enrollmentNo.toLowerCase() === inc.enrollmentNo.toLowerCase())
      );
      if (idx !== -1) {
        db.students[idx] = { ...db.students[idx], ...inc, id: db.students[idx].id };
        updated++;
      } else {
        db.students.push({
          ...inc,
          id: inc.id || `std-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        });
        added++;
      }
    });
    res.json({ success: true, added, updated });
  });

  // --- API ROUTES: Attendance Records & Calculations ---
  app.get('/api/attendance', (req: Request, res: Response) => {
    const { courseId, date, studentId } = req.query;
    let list = db.attendances;
    if (courseId && typeof courseId === 'string') {
      list = list.filter(a => a.courseId === courseId);
    }
    if (date && typeof date === 'string') {
      list = list.filter(a => a.date === date);
    }
    if (studentId && typeof studentId === 'string') {
      list = list.filter(a => a.studentId === studentId);
    }
    res.json(list);
  });

  app.post('/api/attendance/bulk', (req: Request, res: Response) => {
    const { courseId, date, records, markedBy } = req.body;
    if (!courseId || !date || !Array.isArray(records)) {
      return res.status(400).json({ error: 'courseId, date, and records array required' });
    }
    let savedCount = 0;
    let updatedCount = 0;

    records.forEach((rec: { studentId: string; status: AttendanceStatus }) => {
      const idx = db.attendances.findIndex(
        a => a.courseId === courseId && a.studentId === rec.studentId && a.date === date
      );
      if (idx !== -1) {
        db.attendances[idx].status = rec.status;
        db.attendances[idx].updatedAt = new Date().toISOString();
        db.attendances[idx].markedBy = markedBy || 'Faculty';
        updatedCount++;
      } else {
        db.attendances.push({
          id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          studentId: rec.studentId,
          courseId,
          date,
          status: rec.status,
          markedBy: markedBy || 'Faculty',
          updatedAt: new Date().toISOString(),
        });
        savedCount++;
      }
    });

    res.json({ success: true, savedCount, updatedCount });
  });

  // Comprehensive analytics calculation endpoint
  app.get('/api/attendance/calculations', (req: Request, res: Response) => {
    const { programId, semesterId, sectionId, courseId, startDate, endDate } = req.query;

    let targetStudents = [...db.students];
    if (programId && typeof programId === 'string') {
      targetStudents = targetStudents.filter(s => s.programId === programId);
    }
    if (semesterId && typeof semesterId === 'string') {
      targetStudents = targetStudents.filter(s => s.semesterId === semesterId);
    }
    if (sectionId && typeof sectionId === 'string') {
      targetStudents = targetStudents.filter(s => s.sectionId === sectionId);
    }

    const calculations: StudentAttendanceCalculation[] = targetStudents.map(student => {
      let recs = db.attendances.filter(a => a.studentId === student.id);
      if (courseId && typeof courseId === 'string') {
        recs = recs.filter(a => a.courseId === courseId);
      }
      if (startDate && typeof startDate === 'string') {
        recs = recs.filter(a => a.date >= startDate);
      }
      if (endDate && typeof endDate === 'string') {
        recs = recs.filter(a => a.date <= endDate);
      }

      const totalClasses = recs.length;
      const attendedClasses = recs.filter(a => a.status === 'P').length;
      const absentClasses = recs.filter(a => a.status === 'A').length;
      const leaveClasses = recs.filter(a => a.status === 'L').length;
      const medicalClasses = recs.filter(a => a.status === 'M').length;

      const studentParts = db.participations.filter(p => p.studentId === student.id);
      const actIds = new Set(studentParts.map(p => p.activityId));
      const studentActs = db.activities.filter(a => actIds.has(a.id));

      const program = db.programs.find(p => p.id === student.programId);
      const semester = db.semesters.find(s => s.id === student.semesterId);
      const section = db.sections.find(sec => sec.id === student.sectionId);
      const course = courseId ? db.courses.find(c => c.id === courseId) : undefined;

      const attendancePercentage = totalClasses === 0 ? 100 : Number(((attendedClasses / totalClasses) * 100).toFixed(1));

      return {
        student,
        programName: program?.name || 'N/A',
        semesterNumber: semester?.semesterNumber || 1,
        sectionName: section?.sectionName || 'N/A',
        courseName: course?.courseName,
        totalClasses,
        attendedClasses,
        absentClasses,
        leaveClasses,
        medicalClasses,
        activityCount: studentActs.length,
        activities: studentActs,
        attendancePercentage,
      };
    });

    res.json(calculations);
  });

  // --- API ROUTES: Extracurricular Activities & Participation ---
  app.get('/api/activities', (req: Request, res: Response) => {
    res.json(db.activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  });

  app.post('/api/activities', (req: Request, res: Response) => {
    const { name, date, description, category } = req.body;
    if (!name || !date) {
      return res.status(400).json({ error: 'name and date are required' });
    }
    const newAct: Activity = {
      id: `act-${Date.now()}`,
      name: name.trim(),
      date,
      description: description || '',
      category: category || 'Other',
    };
    db.activities.push(newAct);
    res.status(201).json(newAct);
  });

  app.delete('/api/activities/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    db.activities = db.activities.filter(a => a.id !== id);
    db.participations = db.participations.filter(p => p.activityId !== id);
    res.json({ success: true, deletedId: id });
  });

  app.get('/api/participations', (req: Request, res: Response) => {
    const { studentId } = req.query;
    let list = db.participations;
    if (studentId && typeof studentId === 'string') {
      list = list.filter(p => p.studentId === studentId);
    }
    res.json(list);
  });

  app.post('/api/participations', (req: Request, res: Response) => {
    const { studentId, activityId, roleOrAward } = req.body;
    if (!studentId || !activityId) {
      return res.status(400).json({ error: 'studentId and activityId required' });
    }
    const existing = db.participations.find(p => p.studentId === studentId && p.activityId === activityId);
    if (existing) {
      existing.roleOrAward = roleOrAward;
      return res.json(existing);
    }
    const newPart: ActivityParticipation = {
      id: `part-${Date.now()}`,
      studentId,
      activityId,
      roleOrAward,
    };
    db.participations.push(newPart);
    res.status(201).json(newPart);
  });

  // Reset database to initial sample data
  app.post('/api/admin/reset-data', (req: Request, res: Response) => {
    db.resetToDefaults();
    res.json({ success: true, message: 'Database reset to default ERP sample state' });
  });

  // --- Serve Vite Frontend in Dev / Static in Production ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SAMS Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
