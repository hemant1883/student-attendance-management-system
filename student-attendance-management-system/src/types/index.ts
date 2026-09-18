export type Role = 'ADMIN' | 'FACULTY';
export type UserRole = Role;

export type AttendanceStatus = 'P' | 'A' | 'L' | 'M';

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  designation?: string;
  employeeId?: string;
  phone?: string;
  cabin?: string;
  qualification?: string;
  specialization?: string;
  joiningDate?: string;
  assignedCoursesCount?: number;
  token?: string;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface FacultyTimetableEntry {
  id: string;
  facultyId: string;
  facultyName: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // e.g. "09:00 AM"
  endTime: string;   // e.g. "10:00 AM"
  courseCode: string;
  courseName: string;
  programName: string;
  semesterNumber: number;
  sectionName: string;
  roomNo: string;
}

export interface Program {
  id: string;
  name: string;
  code?: string;
  durationYears?: number;
}

export interface Semester {
  id: string;
  semesterNumber: number;
  programId: string;
}

export interface Section {
  id: string;
  sectionName: string;
  semesterId: string;
}

export interface Course {
  id: string;
  courseCode: string;
  courseName: string;
  semesterId: string;
  sectionId: string;
  credits?: number;
  facultyName?: string;
}

export interface Student {
  id: string;
  rollNo: string;
  enrollmentNo: string;
  name: string;
  email: string;
  programId: string;
  semesterId: string;
  sectionId: string;
  phone?: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  courseId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  markedBy?: string;
  updatedAt?: string;
}

export interface Activity {
  id: string;
  name: string;
  date: string;
  description: string;
  category?: 'Hackathon' | 'Sports' | 'NSS' | 'Cultural' | 'Workshop' | 'Seminar' | 'Other';
}

export interface ActivityParticipation {
  id: string;
  studentId: string;
  activityId: string;
  roleOrAward?: string;
}

export interface StudentAttendanceCalculation {
  student: Student;
  programName: string;
  semesterNumber: number;
  sectionName: string;
  courseName?: string;
  totalClasses: number;
  attendedClasses: number; // P
  absentClasses: number;   // A
  leaveClasses: number;    // L
  medicalClasses: number;  // M
  activityCount: number;
  activities: Activity[];
  attendancePercentage: number;
  currentDateStatus?: AttendanceStatus;
}

export interface ExcelImportResult {
  totalRows: number;
  studentsImported: number;
  studentsUpdated: number;
  attendanceRecordsImported: number;
  errors: Array<{ row: number; error: string; details?: string }>;
  success: boolean;
}
