import * as XLSX from 'xlsx';
import { StudentAttendanceCalculation, ExcelImportResult, Student, AttendanceStatus } from '../types';
import { storageService } from './storageService';

export class ExcelService {
  /**
   * Requirement 10: Excel Export
   * Generates Attendance_Report.xlsx with exact required columns:
   * Roll No, Enrollment No, Student Name, Program, Semester, Section, Course, Total Classes, Present, Absent, Activity Count, Attendance %
   */
  public static exportAttendanceReport(
    calculations: StudentAttendanceCalculation[],
    fileName: string = 'Attendance_Report.xlsx'
  ): void {
    const data = calculations.map(item => ({
      'Roll No': item.student.rollNo,
      'Enrollment No': item.student.enrollmentNo,
      'Student Name': item.student.name,
      'Program': item.programName,
      'Semester': item.semesterNumber ? `Semester ${item.semesterNumber}` : 'N/A',
      'Section': item.sectionName,
      'Course': item.courseName || 'N/A',
      'Total Classes': item.totalClasses,
      'Present': item.attendedClasses,
      'Absent': item.absentClasses,
      'Activity Count': item.activityCount,
      'Attendance %': `${item.attendancePercentage}%`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    // Set column widths for polished presentation
    const columnWidths = [
      { wch: 14 }, // Roll No
      { wch: 16 }, // Enrollment No
      { wch: 22 }, // Student Name
      { wch: 15 }, // Program
      { wch: 14 }, // Semester
      { wch: 10 }, // Section
      { wch: 28 }, // Course
      { wch: 14 }, // Total Classes
      { wch: 10 }, // Present
      { wch: 10 }, // Absent
      { wch: 14 }, // Activity Count
      { wch: 15 }, // Attendance %
    ];
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Report');

    XLSX.writeFile(workbook, fileName);
  }

  /**
   * Download a blank/sample Excel template for Student & Attendance Import
   */
  public static downloadImportTemplate(): void {
    const sampleData = [
      {
        'Roll No': '21BCSE21',
        'Enrollment No': 'EN202100121',
        'Student Name': 'Devansh Singhal',
        'Email': 'devansh.s@student.college.edu',
        'Program': 'B.Tech CSE',
        'Semester': 5,
        'Section': 'A',
        'Date (YYYY-MM-DD)': '2026-09-15',
        'Course Code': 'CS501',
        'Attendance Status (P/A/L/M)': 'P'
      },
      {
        'Roll No': '21BCSE22',
        'Enrollment No': 'EN202100122',
        'Student Name': 'Ritika Malhotra',
        'Email': 'ritika.m@student.college.edu',
        'Program': 'B.Tech CSE',
        'Semester': 5,
        'Section': 'A',
        'Date (YYYY-MM-DD)': '2026-09-15',
        'Course Code': 'CS501',
        'Attendance Status (P/A/L/M)': 'P'
      },
      {
        'Roll No': '21BCSE03',
        'Enrollment No': 'EN202100103',
        'Student Name': 'Rohan Deshmukh',
        'Email': 'rohan.deshmukh@student.college.edu',
        'Program': 'B.Tech CSE',
        'Semester': 5,
        'Section': 'A',
        'Date (YYYY-MM-DD)': '2026-09-15',
        'Course Code': 'CS501',
        'Attendance Status (P/A/L/M)': 'A'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    worksheet['!cols'] = [
      { wch: 14 },
      { wch: 16 },
      { wch: 20 },
      { wch: 28 },
      { wch: 15 },
      { wch: 10 },
      { wch: 10 },
      { wch: 18 },
      { wch: 14 },
      { wch: 26 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students_Import_Template');
    XLSX.writeFile(workbook, 'Student_Attendance_Import_Template.xlsx');
  }

  /**
   * Requirement 9: Read Excel file using XLSX parser, validate row-by-row,
   * preserve existing data, update records if student already exists, and record attendance.
   */
  public static async parseAndImportExcel(file: File): Promise<ExcelImportResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const buffer = e.target?.result;
          const workbook = XLSX.read(buffer, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];

          if (!firstSheetName) {
            resolve({
              totalRows: 0,
              studentsImported: 0,
              studentsUpdated: 0,
              attendanceRecordsImported: 0,
              errors: [{ row: 1, error: 'Empty Excel file or no valid worksheet found.' }],
              success: false
            });
            return;
          }

          const worksheet = workbook.Sheets[firstSheetName];
          const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

          if (rawRows.length === 0) {
            resolve({
              totalRows: 0,
              studentsImported: 0,
              studentsUpdated: 0,
              attendanceRecordsImported: 0,
              errors: [{ row: 1, error: 'Worksheet contains no data rows.' }],
              success: false
            });
            return;
          }

          const errors: Array<{ row: number; error: string; details?: string }> = [];
          const studentsToUpsert: Array<Omit<Student, 'id'> & { id?: string }> = [];
          const attendanceToSave: Array<{ courseId: string; date: string; studentId?: string; rollNo?: string; status: AttendanceStatus }> = [];

          const programs = storageService.getPrograms();
          const semesters = storageService.getSemesters();
          const sections = storageService.getSections();
          const courses = storageService.getCourses();

          rawRows.forEach((row, index) => {
            const rowNum = index + 2; // +1 for 0-index, +1 for header row

            // Extract values with flexible column naming
            const rollNo = (row['Roll No'] || row['RollNo'] || row['roll_no'] || row['Roll Number'] || '').toString().trim();
            const enrollmentNo = (row['Enrollment No'] || row['EnrollmentNo'] || row['enrollment_no'] || row['Enrollment'] || '').toString().trim();
            const name = (row['Student Name'] || row['Name'] || row['name'] || '').toString().trim();
            const email = (row['Email'] || row['email'] || `${rollNo.toLowerCase()}@student.college.edu`).toString().trim();
            const programName = (row['Program'] || row['Department'] || 'B.Tech CSE').toString().trim();
            const semesterVal = parseInt(row['Semester'] || row['Sem'] || '5', 10);
            const sectionVal = (row['Section'] || row['Sec'] || 'A').toString().trim().toUpperCase();

            // Attendance columns (optional per row)
            const attendanceStatusRaw = (row['Attendance Status (P/A/L/M)'] || row['Attendance'] || row['Status'] || '').toString().trim().toUpperCase();
            const dateStr = (row['Date (YYYY-MM-DD)'] || row['Date'] || new Date().toISOString().split('T')[0]).toString().trim();
            const courseCode = (row['Course Code'] || row['Course'] || '').toString().trim();

            if (!rollNo) {
              errors.push({ row: rowNum, error: 'Missing Roll Number', details: 'Roll No is a mandatory field' });
              return;
            }
            if (!name) {
              errors.push({ row: rowNum, error: 'Missing Student Name', details: `Student with Roll No ${rollNo} has empty name` });
              return;
            }

            // Resolve program
            let prog = programs.find(p => p.name.toLowerCase() === programName.toLowerCase() || p.code?.toLowerCase() === programName.toLowerCase());
            if (!prog) {
              prog = programs[0] || storageService.addProgram(programName);
            }

            // Resolve semester
            let sem = semesters.find(s => s.programId === prog!.id && s.semesterNumber === semesterVal);
            if (!sem) {
              sem = storageService.addSemester(prog.id, isNaN(semesterVal) ? 1 : semesterVal);
            }

            // Resolve section
            let sec = sections.find(s => s.semesterId === sem!.id && s.sectionName.toUpperCase() === sectionVal);
            if (!sec) {
              sec = storageService.addSection(sem.id, sectionVal || 'A');
            }

            studentsToUpsert.push({
              rollNo,
              enrollmentNo: enrollmentNo || `EN-${rollNo}`,
              name,
              email,
              programId: prog.id,
              semesterId: sem.id,
              sectionId: sec.id
            });

            // If attendance was specified
            if (attendanceStatusRaw && ['P', 'A', 'L', 'M'].includes(attendanceStatusRaw)) {
              let course = courses.find(c => c.courseCode.toLowerCase() === courseCode.toLowerCase() || c.courseName.toLowerCase() === courseCode.toLowerCase());
              if (!course && courses.length > 0) {
                course = courses[0];
              }
              if (course) {
                attendanceToSave.push({
                  courseId: course.id,
                  date: dateStr,
                  rollNo,
                  status: attendanceStatusRaw as AttendanceStatus
                });
              }
            }
          });

          // Save students using upsert
          const upsertResult = storageService.upsertStudents(studentsToUpsert);

          // Now save attendances
          let attendanceCount = 0;
          if (attendanceToSave.length > 0) {
            const allStudents = storageService.getStudents();
            const byCourseDate = new Map<string, Array<{ studentId: string; status: AttendanceStatus }>>();

            attendanceToSave.forEach(att => {
              const matchedStudent = allStudents.find(s => s.rollNo.toLowerCase() === att.rollNo?.toLowerCase());
              if (matchedStudent) {
                const key = `${att.courseId}___${att.date}`;
                if (!byCourseDate.has(key)) {
                  byCourseDate.set(key, []);
                }
                byCourseDate.get(key)!.push({
                  studentId: matchedStudent.id,
                  status: att.status
                });
              }
            });

            byCourseDate.forEach((records, key) => {
              const [courseId, date] = key.split('___');
              const res = storageService.saveAttendanceBulk(courseId, date, records);
              attendanceCount += res.savedCount + res.updatedCount;
            });
          }

          resolve({
            totalRows: rawRows.length,
            studentsImported: upsertResult.added,
            studentsUpdated: upsertResult.updated,
            attendanceRecordsImported: attendanceCount,
            errors,
            success: true
          });
        } catch (err: any) {
          reject(new Error(err?.message || 'Failed to parse Excel file'));
        }
      };

      reader.onerror = () => {
        reject(new Error('File reading failed. Please ensure the file is a valid .xlsx file.'));
      };

      reader.readAsArrayBuffer(file);
    });
  }
}
