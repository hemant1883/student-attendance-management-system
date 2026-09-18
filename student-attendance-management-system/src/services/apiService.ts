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
} from '../types';

const API_BASE = '/api';

class ApiService {
  private async fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || `HTTP error ${res.status}`);
    }
    return res.json();
  }

  // System & Health
  public async getHealth() {
    return this.fetchJson<{
      status: string;
      system: string;
      version: string;
      timestamp: string;
      counts: Record<string, number>;
    }>('/health');
  }

  // Auth
  public async login(username: string, password?: string, role?: string): Promise<{ success: boolean; user: User; token: string }> {
    return this.fetchJson('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, role }),
    });
  }

  // Programs
  public async getPrograms(): Promise<Program[]> {
    return this.fetchJson<Program[]>('/programs');
  }

  public async addProgram(data: { name: string; code?: string; durationYears?: number }): Promise<Program> {
    return this.fetchJson<Program>('/programs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async deleteProgram(id: string): Promise<{ success: boolean }> {
    return this.fetchJson(`/programs/${id}`, { method: 'DELETE' });
  }

  // Semesters
  public async getSemesters(programId?: string): Promise<Semester[]> {
    const query = programId ? `?programId=${encodeURIComponent(programId)}` : '';
    return this.fetchJson<Semester[]>(`/semesters${query}`);
  }

  public async addSemester(programId: string, semesterNumber: number): Promise<Semester> {
    return this.fetchJson<Semester>('/semesters', {
      method: 'POST',
      body: JSON.stringify({ programId, semesterNumber }),
    });
  }

  // Sections
  public async getSections(semesterId?: string): Promise<Section[]> {
    const query = semesterId ? `?semesterId=${encodeURIComponent(semesterId)}` : '';
    return this.fetchJson<Section[]>(`/sections${query}`);
  }

  public async addSection(semesterId: string, sectionName: string): Promise<Section> {
    return this.fetchJson<Section>('/sections', {
      method: 'POST',
      body: JSON.stringify({ semesterId, sectionName }),
    });
  }

  // Courses
  public async getCourses(semesterId?: string, sectionId?: string): Promise<Course[]> {
    const params = new URLSearchParams();
    if (semesterId) params.append('semesterId', semesterId);
    if (sectionId) params.append('sectionId', sectionId);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.fetchJson<Course[]>(`/courses${query}`);
  }

  public async addCourse(course: Omit<Course, 'id'>): Promise<Course> {
    return this.fetchJson<Course>('/courses', {
      method: 'POST',
      body: JSON.stringify(course),
    });
  }

  public async deleteCourse(id: string): Promise<{ success: boolean }> {
    return this.fetchJson(`/courses/${id}`, { method: 'DELETE' });
  }

  // Students
  public async getStudents(filters?: {
    programId?: string;
    semesterId?: string;
    sectionId?: string;
    search?: string;
  }): Promise<Student[]> {
    const params = new URLSearchParams();
    if (filters?.programId) params.append('programId', filters.programId);
    if (filters?.semesterId) params.append('semesterId', filters.semesterId);
    if (filters?.sectionId) params.append('sectionId', filters.sectionId);
    if (filters?.search) params.append('search', filters.search);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.fetchJson<Student[]>(`/students${query}`);
  }

  public async addStudent(student: Omit<Student, 'id'>): Promise<Student> {
    return this.fetchJson<Student>('/students', {
      method: 'POST',
      body: JSON.stringify(student),
    });
  }

  public async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    return this.fetchJson<Student>(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  public async deleteStudent(id: string): Promise<{ success: boolean }> {
    return this.fetchJson(`/students/${id}`, { method: 'DELETE' });
  }

  public async bulkUpsertStudents(students: Array<Omit<Student, 'id'> & { id?: string }>) {
    return this.fetchJson<{ success: boolean; added: number; updated: number }>('/students/bulk-upsert', {
      method: 'POST',
      body: JSON.stringify({ students }),
    });
  }

  // Attendance
  public async getAttendance(params?: { courseId?: string; date?: string; studentId?: string }): Promise<Attendance[]> {
    const q = new URLSearchParams();
    if (params?.courseId) q.append('courseId', params.courseId);
    if (params?.date) q.append('date', params.date);
    if (params?.studentId) q.append('studentId', params.studentId);
    const query = q.toString() ? `?${q.toString()}` : '';
    return this.fetchJson<Attendance[]>(`/attendance${query}`);
  }

  public async saveAttendanceBulk(payload: {
    courseId: string;
    date: string;
    records: Array<{ studentId: string; status: AttendanceStatus }>;
    markedBy?: string;
  }): Promise<{ success: boolean; savedCount: number; updatedCount: number }> {
    return this.fetchJson('/attendance/bulk', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async getCalculations(params: {
    programId?: string;
    semesterId?: string;
    sectionId?: string;
    courseId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<StudentAttendanceCalculation[]> {
    const q = new URLSearchParams();
    if (params.programId) q.append('programId', params.programId);
    if (params.semesterId) q.append('semesterId', params.semesterId);
    if (params.sectionId) q.append('sectionId', params.sectionId);
    if (params.courseId) q.append('courseId', params.courseId);
    if (params.startDate) q.append('startDate', params.startDate);
    if (params.endDate) q.append('endDate', params.endDate);
    const query = q.toString() ? `?${q.toString()}` : '';
    return this.fetchJson<StudentAttendanceCalculation[]>(`/attendance/calculations${query}`);
  }

  // Activities
  public async getActivities(): Promise<Activity[]> {
    return this.fetchJson<Activity[]>('/activities');
  }

  public async addActivity(activity: Omit<Activity, 'id'>): Promise<Activity> {
    return this.fetchJson<Activity>('/activities', {
      method: 'POST',
      body: JSON.stringify(activity),
    });
  }

  public async deleteActivity(id: string): Promise<{ success: boolean }> {
    return this.fetchJson(`/activities/${id}`, { method: 'DELETE' });
  }

  public async getParticipations(studentId?: string): Promise<ActivityParticipation[]> {
    const query = studentId ? `?studentId=${encodeURIComponent(studentId)}` : '';
    return this.fetchJson<ActivityParticipation[]>(`/participations${query}`);
  }

  public async addParticipation(payload: {
    studentId: string;
    activityId: string;
    roleOrAward?: string;
  }): Promise<ActivityParticipation> {
    return this.fetchJson<ActivityParticipation>('/participations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async resetBackendData(): Promise<{ success: boolean; message: string }> {
    return this.fetchJson('/admin/reset-data', { method: 'POST' });
  }
}

export const apiService = new ApiService();
