import { Program, Semester, Section, Course, Student, Attendance, Activity, ActivityParticipation, User, FacultyTimetableEntry } from '../types';

export const initialUsers: User[] = [
  {
    id: 'user-admin',
    username: 'admin',
    password: 'admin123',
    name: 'Dr. Rajesh Sharma',
    email: 'admin.academics@college.edu',
    role: 'ADMIN',
    department: 'Academic Affairs & Dean Office',
    designation: 'Dean of Academic Affairs & Professor',
    employeeId: 'EMP-ADM-001',
    phone: '+91 98765 00001',
    cabin: 'Admin Block, Room 101',
    qualification: 'Ph.D in Computer Science (IIT Delhi)',
    specialization: 'Distributed DBMS, Academic Administration',
    joiningDate: '2014-07-15',
    token: 'jwt-mock-token-admin-erp-2026'
  },
  {
    id: 'user-faculty-1',
    username: 'ananya',
    password: 'faculty123',
    name: 'Prof. Ananya Verma',
    email: 'ananya.verma@college.edu',
    role: 'FACULTY',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor',
    employeeId: 'EMP-CSE-102',
    phone: '+91 98765 00102',
    cabin: 'CS Block, Room 304',
    qualification: 'M.Tech, Ph.D (Pursuing) in CSE',
    specialization: 'Data Structures, Algorithms, Enterprise Java',
    joiningDate: '2018-08-01',
    token: 'jwt-mock-token-faculty-erp-2026'
  },
  {
    id: 'user-faculty-2',
    username: 'vikram',
    password: 'faculty123',
    name: 'Prof. Vikram Sen',
    email: 'vikram.sen@college.edu',
    role: 'FACULTY',
    department: 'Computer Science & Engineering',
    designation: 'Assistant Professor',
    employeeId: 'EMP-CSE-103',
    phone: '+91 98765 00103',
    cabin: 'CS Block, Room 308',
    qualification: 'M.Tech in Systems Engineering',
    specialization: 'Operating Systems, Python, Linux Kernel, DevOps',
    joiningDate: '2020-01-10',
    token: 'jwt-mock-token-faculty-sen-2026'
  },
  {
    id: 'user-faculty-3',
    username: 'swami',
    password: 'faculty123',
    name: 'Dr. K. Swaminathan',
    email: 'swaminathan.k@college.edu',
    role: 'FACULTY',
    department: 'Artificial Intelligence & Data Science',
    designation: 'Head of Department & Professor',
    employeeId: 'EMP-AI-201',
    phone: '+91 98765 00201',
    cabin: 'AI & Research Wing, Room 401',
    qualification: 'Ph.D in Machine Learning (IISc Bangalore)',
    specialization: 'Deep Learning, Computer Vision, Reinforcement Learning',
    joiningDate: '2016-06-20',
    token: 'jwt-mock-token-faculty-swami-2026'
  },
  {
    id: 'user-faculty-4',
    username: 'priya',
    password: 'faculty123',
    name: 'Dr. Priya Mehta',
    email: 'priya.mehta@college.edu',
    role: 'FACULTY',
    department: 'Artificial Intelligence & Data Science',
    designation: 'Associate Professor',
    employeeId: 'EMP-AI-202',
    phone: '+91 98765 00202',
    cabin: 'AI & Research Wing, Room 405',
    qualification: 'Ph.D in Computational Linguistics',
    specialization: 'Natural Language Processing, Transformers, LLMs',
    joiningDate: '2019-07-15',
    token: 'jwt-mock-token-faculty-priya-2026'
  },
  {
    id: 'user-faculty-5',
    username: 'alok',
    password: 'faculty123',
    name: 'Dr. Alok Srivastava',
    email: 'alok.srivastava@college.edu',
    role: 'FACULTY',
    department: 'Electronics & Communication',
    designation: 'Professor & Lab Director',
    employeeId: 'EMP-ECE-301',
    phone: '+91 98765 00301',
    cabin: 'ECE Block, Room 202',
    qualification: 'Ph.D in Signal Processing (IIT Bombay)',
    specialization: 'Signals & Systems, Digital Communication, Radar',
    joiningDate: '2015-09-01',
    token: 'jwt-mock-token-faculty-alok-2026'
  },
  {
    id: 'user-faculty-6',
    username: 'rohit',
    password: 'faculty123',
    name: 'Prof. Rohit Nanda',
    email: 'rohit.nanda@college.edu',
    role: 'FACULTY',
    department: 'Computer Applications & BCA/MCA',
    designation: 'Senior Assistant Professor',
    employeeId: 'EMP-CA-401',
    phone: '+91 98765 00401',
    cabin: 'IT Block, Room 106',
    qualification: 'MCA, M.Phil in Computer Applications',
    specialization: 'Full Stack Web (React/Node), Embedded Systems, Mobile Dev',
    joiningDate: '2021-02-15',
    token: 'jwt-mock-token-faculty-rohit-2026'
  },
  {
    id: 'user-faculty-7',
    username: 'sunita',
    password: 'faculty123',
    name: 'Prof. Sunita Pillai',
    email: 'sunita.pillai@college.edu',
    role: 'FACULTY',
    department: 'Electronics & Communication',
    designation: 'Associate Professor',
    employeeId: 'EMP-ECE-302',
    phone: '+91 98765 00302',
    cabin: 'ECE Block, Room 208',
    qualification: 'M.Tech in Microelectronics & VLSI',
    specialization: 'VLSI Circuit Design, Digital ICs, Semiconductor Physics',
    joiningDate: '2017-11-01',
    token: 'jwt-mock-token-faculty-sunita-2026'
  },
  {
    id: 'user-faculty-default',
    username: 'faculty',
    password: 'faculty123',
    name: 'Prof. Ananya Verma',
    email: 'ananya.verma@college.edu',
    role: 'FACULTY',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor',
    employeeId: 'EMP-CSE-102',
    phone: '+91 98765 00102',
    cabin: 'CS Block, Room 304',
    qualification: 'M.Tech in CSE',
    specialization: 'Data Structures, Spring Boot',
    joiningDate: '2018-08-01',
    token: 'jwt-mock-token-faculty-erp-2026'
  }
];

export const initialPrograms: Program[] = [
  { id: 'prog-btech-cse', name: 'B.Tech CSE', code: 'BT-CSE', durationYears: 4 },
  { id: 'prog-btech-ai', name: 'B.Tech AI', code: 'BT-AI', durationYears: 4 },
  { id: 'prog-btech-ece', name: 'B.Tech ECE', code: 'BT-ECE', durationYears: 4 },
  { id: 'prog-bca', name: 'BCA', code: 'BCA', durationYears: 3 },
  { id: 'prog-mca', name: 'MCA', code: 'MCA', durationYears: 2 },
];

export const initialSemesters: Semester[] = [
  // B.Tech CSE (8 semesters)
  { id: 'sem-cse-1', semesterNumber: 1, programId: 'prog-btech-cse' },
  { id: 'sem-cse-2', semesterNumber: 2, programId: 'prog-btech-cse' },
  { id: 'sem-cse-3', semesterNumber: 3, programId: 'prog-btech-cse' },
  { id: 'sem-cse-4', semesterNumber: 4, programId: 'prog-btech-cse' },
  { id: 'sem-cse-5', semesterNumber: 5, programId: 'prog-btech-cse' },
  { id: 'sem-cse-6', semesterNumber: 6, programId: 'prog-btech-cse' },
  { id: 'sem-cse-7', semesterNumber: 7, programId: 'prog-btech-cse' },
  { id: 'sem-cse-8', semesterNumber: 8, programId: 'prog-btech-cse' },

  // B.Tech AI (8 semesters)
  { id: 'sem-ai-1', semesterNumber: 1, programId: 'prog-btech-ai' },
  { id: 'sem-ai-2', semesterNumber: 2, programId: 'prog-btech-ai' },
  { id: 'sem-ai-3', semesterNumber: 3, programId: 'prog-btech-ai' },
  { id: 'sem-ai-4', semesterNumber: 4, programId: 'prog-btech-ai' },
  { id: 'sem-ai-5', semesterNumber: 5, programId: 'prog-btech-ai' },
  { id: 'sem-ai-6', semesterNumber: 6, programId: 'prog-btech-ai' },
  { id: 'sem-ai-7', semesterNumber: 7, programId: 'prog-btech-ai' },
  { id: 'sem-ai-8', semesterNumber: 8, programId: 'prog-btech-ai' },

  // B.Tech ECE (8 semesters)
  { id: 'sem-ece-1', semesterNumber: 1, programId: 'prog-btech-ece' },
  { id: 'sem-ece-2', semesterNumber: 2, programId: 'prog-btech-ece' },
  { id: 'sem-ece-3', semesterNumber: 3, programId: 'prog-btech-ece' },
  { id: 'sem-ece-4', semesterNumber: 4, programId: 'prog-btech-ece' },
  { id: 'sem-ece-5', semesterNumber: 5, programId: 'prog-btech-ece' },
  { id: 'sem-ece-6', semesterNumber: 6, programId: 'prog-btech-ece' },
  { id: 'sem-ece-7', semesterNumber: 7, programId: 'prog-btech-ece' },
  { id: 'sem-ece-8', semesterNumber: 8, programId: 'prog-btech-ece' },

  // BCA (6 semesters)
  { id: 'sem-bca-1', semesterNumber: 1, programId: 'prog-bca' },
  { id: 'sem-bca-2', semesterNumber: 2, programId: 'prog-bca' },
  { id: 'sem-bca-3', semesterNumber: 3, programId: 'prog-bca' },
  { id: 'sem-bca-4', semesterNumber: 4, programId: 'prog-bca' },
  { id: 'sem-bca-5', semesterNumber: 5, programId: 'prog-bca' },
  { id: 'sem-bca-6', semesterNumber: 6, programId: 'prog-bca' },

  // MCA (4 semesters)
  { id: 'sem-mca-1', semesterNumber: 1, programId: 'prog-mca' },
  { id: 'sem-mca-2', semesterNumber: 2, programId: 'prog-mca' },
  { id: 'sem-mca-3', semesterNumber: 3, programId: 'prog-mca' },
  { id: 'sem-mca-4', semesterNumber: 4, programId: 'prog-mca' },
];

export const initialSections: Section[] = [
  // B.Tech CSE Sem 5
  { id: 'sec-cse-5-a', sectionName: 'A', semesterId: 'sem-cse-5' },
  { id: 'sec-cse-5-b', sectionName: 'B', semesterId: 'sem-cse-5' },
  { id: 'sec-cse-5-c', sectionName: 'C', semesterId: 'sem-cse-5' },

  // B.Tech CSE Sem 4
  { id: 'sec-cse-4-a', sectionName: 'A', semesterId: 'sem-cse-4' },
  { id: 'sec-cse-4-b', sectionName: 'B', semesterId: 'sem-cse-4' },

  // B.Tech AI Sem 5
  { id: 'sec-ai-5-a', sectionName: 'A', semesterId: 'sem-ai-5' },
  { id: 'sec-ai-5-b', sectionName: 'B', semesterId: 'sem-ai-5' },

  // B.Tech ECE Sem 4
  { id: 'sec-ece-4-a', sectionName: 'A', semesterId: 'sem-ece-4' },
  { id: 'sec-ece-4-b', sectionName: 'B', semesterId: 'sem-ece-4' },

  // BCA Sem 3
  { id: 'sec-bca-3-a', sectionName: 'A', semesterId: 'sem-bca-3' },
  { id: 'sec-bca-3-b', sectionName: 'B', semesterId: 'sem-bca-3' },

  // MCA Sem 2
  { id: 'sec-mca-2-a', sectionName: 'A', semesterId: 'sem-mca-2' },
  { id: 'sec-mca-2-b', sectionName: 'B', semesterId: 'sem-mca-2' },
];

export const initialCourses: Course[] = [
  // B.Tech CSE Sem 5 Section A
  { id: 'crs-ds', courseCode: 'CS501', courseName: 'Data Structures & Algorithms', semesterId: 'sem-cse-5', sectionId: 'sec-cse-5-a', credits: 4, facultyName: 'Prof. Ananya Verma' },
  { id: 'crs-dbms', courseCode: 'CS502', courseName: 'Database Management Systems', semesterId: 'sem-cse-5', sectionId: 'sec-cse-5-a', credits: 4, facultyName: 'Dr. Rajesh Sharma' },
  { id: 'crs-os', courseCode: 'CS503', courseName: 'Operating Systems', semesterId: 'sem-cse-5', sectionId: 'sec-cse-5-a', credits: 3, facultyName: 'Prof. Vikram Sen' },
  { id: 'crs-java', courseCode: 'CS504', courseName: 'Java Programming & Spring Boot', semesterId: 'sem-cse-5', sectionId: 'sec-cse-5-a', credits: 3, facultyName: 'Prof. Ananya Verma' },
  { id: 'crs-cn', courseCode: 'CS505', courseName: 'Computer Networks', semesterId: 'sem-cse-5', sectionId: 'sec-cse-5-a', credits: 3, facultyName: 'Prof. Sanjay Rathore' },
  { id: 'crs-se', courseCode: 'CS506', courseName: 'Software Engineering & Agile', semesterId: 'sem-cse-5', sectionId: 'sec-cse-5-a', credits: 3, facultyName: 'Dr. Meenakshi Sundaram' },

  // B.Tech AI Sem 5 Section A
  { id: 'crs-ai-ml', courseCode: 'AI501', courseName: 'Deep Learning & Neural Networks', semesterId: 'sem-ai-5', sectionId: 'sec-ai-5-a', credits: 4, facultyName: 'Dr. K. Swaminathan' },
  { id: 'crs-ai-cv', courseCode: 'AI502', courseName: 'Computer Vision & Image Processing', semesterId: 'sem-ai-5', sectionId: 'sec-ai-5-a', credits: 3, facultyName: 'Dr. K. Swaminathan' },
  { id: 'crs-ai-nlp', courseCode: 'AI503', courseName: 'Natural Language Processing & LLMs', semesterId: 'sem-ai-5', sectionId: 'sec-ai-5-a', credits: 4, facultyName: 'Dr. Priya Mehta' },
  { id: 'crs-ai-ethics', courseCode: 'AI504', courseName: 'AI Ethics, Governance & Safety', semesterId: 'sem-ai-5', sectionId: 'sec-ai-5-a', credits: 2, facultyName: 'Prof. Ananya Verma' },
  { id: 'crs-ai-rl', courseCode: 'AI505', courseName: 'Reinforcement Learning', semesterId: 'sem-ai-5', sectionId: 'sec-ai-5-a', credits: 3, facultyName: 'Dr. K. Swaminathan' },

  // B.Tech ECE Sem 4 Section A
  { id: 'crs-ece-signals', courseCode: 'EC401', courseName: 'Signals & Linear Systems', semesterId: 'sem-ece-4', sectionId: 'sec-ece-4-a', credits: 4, facultyName: 'Dr. Alok Srivastava' },
  { id: 'crs-ece-vlsi', courseCode: 'EC402', courseName: 'VLSI Design & Digital ICs', semesterId: 'sem-ece-4', sectionId: 'sec-ece-4-a', credits: 4, facultyName: 'Prof. Sunita Pillai' },
  { id: 'crs-ece-comm', courseCode: 'EC403', courseName: 'Analog & Digital Communication', semesterId: 'sem-ece-4', sectionId: 'sec-ece-4-a', credits: 4, facultyName: 'Dr. Alok Srivastava' },
  { id: 'crs-ece-embedded', courseCode: 'EC404', courseName: 'Microcontrollers & Embedded Systems', semesterId: 'sem-ece-4', sectionId: 'sec-ece-4-a', credits: 3, facultyName: 'Prof. Rohit Nanda' },
  { id: 'crs-ece-emft', courseCode: 'EC405', courseName: 'Electromagnetic Field Theory', semesterId: 'sem-ece-4', sectionId: 'sec-ece-4-a', credits: 3, facultyName: 'Prof. Sunita Pillai' },

  // BCA Sem 3 Section A
  { id: 'crs-bca-web', courseCode: 'BCA301', courseName: 'Full Stack Web Development & React', semesterId: 'sem-bca-3', sectionId: 'sec-bca-3-a', credits: 4, facultyName: 'Prof. Rohit Nanda' },
  { id: 'crs-bca-py', courseCode: 'BCA302', courseName: 'Python Programming & Analytics', semesterId: 'sem-bca-3', sectionId: 'sec-bca-3-a', credits: 3, facultyName: 'Prof. Vikram Sen' },
  { id: 'crs-bca-dbms', courseCode: 'BCA303', courseName: 'Relational Database Concepts', semesterId: 'sem-bca-3', sectionId: 'sec-bca-3-a', credits: 4, facultyName: 'Dr. Rajesh Sharma' },
  { id: 'crs-bca-se', courseCode: 'BCA304', courseName: 'Software System Architecture', semesterId: 'sem-bca-3', sectionId: 'sec-bca-3-a', credits: 3, facultyName: 'Prof. Rohit Nanda' },
  { id: 'crs-bca-cloud', courseCode: 'BCA305', courseName: 'Cloud Computing Essentials', semesterId: 'sem-bca-3', sectionId: 'sec-bca-3-a', credits: 3, facultyName: 'Prof. Sanjay Rathore' },

  // MCA Sem 2 Section A
  { id: 'crs-mca-adv-db', courseCode: 'MCA201', courseName: 'Advanced Distributed DBMS', semesterId: 'sem-mca-2', sectionId: 'sec-mca-2-a', credits: 4, facultyName: 'Dr. Rajesh Sharma' },
  { id: 'crs-mca-enterprise', courseCode: 'MCA202', courseName: 'Enterprise Java & Spring Cloud', semesterId: 'sem-mca-2', sectionId: 'sec-mca-2-a', credits: 4, facultyName: 'Prof. Ananya Verma' },
  { id: 'crs-mca-sec', courseCode: 'MCA203', courseName: 'Information Security & Cryptography', semesterId: 'sem-mca-2', sectionId: 'sec-mca-2-a', credits: 3, facultyName: 'Dr. Meenakshi Sundaram' },
  { id: 'crs-mca-devops', courseCode: 'MCA204', courseName: 'DevOps & CI/CD Pipelines', semesterId: 'sem-mca-2', sectionId: 'sec-mca-2-a', credits: 3, facultyName: 'Prof. Vikram Sen' },
  { id: 'crs-mca-mobile', courseCode: 'MCA205', courseName: 'Mobile Application Development', semesterId: 'sem-mca-2', sectionId: 'sec-mca-2-a', credits: 3, facultyName: 'Prof. Rohit Nanda' },
];

export const initialStudents: Student[] = [
  // ==================== 1. B.TECH CSE (Sem 5, Section A) ====================
  { id: 'std-cse-01', rollNo: '21BCSE01', enrollmentNo: 'EN202100101', name: 'Aarav Patel', email: 'aarav.patel@student.college.edu', programId: 'prog-btech-cse', semesterId: 'sem-cse-5', sectionId: 'sec-cse-5-a', phone: '+91 98765 43210' },
  { id: 'std-cse-02', rollNo: '21BCSE02', enrollmentNo: 'EN202100102', name: 'Diya Sengupta', email: 'diya.sengupta@student.college.edu', programId: 'prog-btech-cse', semesterId: 'sem-cse-5', sectionId: 'sec-cse-5-a', phone: '+91 98765 43211' },
  { id: 'std-cse-03', rollNo: '21BCSE03', enrollmentNo: 'EN202100103', name: 'Rohan Deshmukh', email: 'rohan.deshmukh@student.college.edu', programId: 'prog-btech-cse', semesterId: 'sem-cse-5', sectionId: 'sec-cse-5-a', phone: '+91 98765 43212' },
  { id: 'std-cse-04', rollNo: '21BCSE04', enrollmentNo: 'EN202100104', name: 'Ishita Sharma', email: 'ishita.sharma@student.college.edu', programId: 'prog-btech-cse', semesterId: 'sem-cse-5', sectionId: 'sec-cse-5-a', phone: '+91 98765 43213' },
  { id: 'std-cse-05', rollNo: '21BCSE05', enrollmentNo: 'EN202100105', name: 'Kabir Chawla', email: 'kabir.chawla@student.college.edu', programId: 'prog-btech-cse', semesterId: 'sem-cse-5', sectionId: 'sec-cse-5-a', phone: '+91 98765 43214' },
  { id: 'std-cse-06', rollNo: '21BCSE06', enrollmentNo: 'EN202100106', name: 'Sneha Kulkarni', email: 'sneha.kulkarni@student.college.edu', programId: 'prog-btech-cse', semesterId: 'sem-cse-5', sectionId: 'sec-cse-5-a', phone: '+91 98765 43215' },

  // ==================== 2. B.TECH AI (Sem 5, Section A) ====================
  { id: 'std-ai-01', rollNo: '21BAI01', enrollmentNo: 'EN202100201', name: 'Kunal Kapoor', email: 'kunal.ai@student.college.edu', programId: 'prog-btech-ai', semesterId: 'sem-ai-5', sectionId: 'sec-ai-5-a', phone: '+91 98234 11221' },
  { id: 'std-ai-02', rollNo: '21BAI02', enrollmentNo: 'EN202100202', name: 'Ananya Roy', email: 'ananya.roy@student.college.edu', programId: 'prog-btech-ai', semesterId: 'sem-ai-5', sectionId: 'sec-ai-5-a', phone: '+91 98234 11222' },
  { id: 'std-ai-03', rollNo: '21BAI03', enrollmentNo: 'EN202100203', name: 'Devansh Singhal', email: 'devansh.s@student.college.edu', programId: 'prog-btech-ai', semesterId: 'sem-ai-5', sectionId: 'sec-ai-5-a', phone: '+91 98234 11223' },
  { id: 'std-ai-04', rollNo: '21BAI04', enrollmentNo: 'EN202100204', name: 'Zoya Akhtar', email: 'zoya.a@student.college.edu', programId: 'prog-btech-ai', semesterId: 'sem-ai-5', sectionId: 'sec-ai-5-a', phone: '+91 98234 11224' },
  { id: 'std-ai-05', rollNo: '21BAI05', enrollmentNo: 'EN202100205', name: 'Pranav Bhatia', email: 'pranav.b@student.college.edu', programId: 'prog-btech-ai', semesterId: 'sem-ai-5', sectionId: 'sec-ai-5-a', phone: '+91 98234 11225' },
  { id: 'std-ai-06', rollNo: '21BAI06', enrollmentNo: 'EN202100206', name: 'Tara Subramanian', email: 'tara.sub@student.college.edu', programId: 'prog-btech-ai', semesterId: 'sem-ai-5', sectionId: 'sec-ai-5-a', phone: '+91 98234 11226' },

  // ==================== 3. B.TECH ECE (Sem 4, Section A) ====================
  { id: 'std-ece-01', rollNo: '22BECE01', enrollmentNo: 'EN202200301', name: 'Naveen Choudhury', email: 'naveen.ece@student.college.edu', programId: 'prog-btech-ece', semesterId: 'sem-ece-4', sectionId: 'sec-ece-4-a', phone: '+91 98345 33441' },
  { id: 'std-ece-02', rollNo: '22BECE02', enrollmentNo: 'EN202200302', name: 'Kavya Madhavan', email: 'kavya.ece@student.college.edu', programId: 'prog-btech-ece', semesterId: 'sem-ece-4', sectionId: 'sec-ece-4-a', phone: '+91 98345 33442' },
  { id: 'std-ece-03', rollNo: '22BECE03', enrollmentNo: 'EN202200303', name: 'Manish Tiwari', email: 'manish.t@student.college.edu', programId: 'prog-btech-ece', semesterId: 'sem-ece-4', sectionId: 'sec-ece-4-a', phone: '+91 98345 33443' },
  { id: 'std-ece-04', rollNo: '22BECE04', enrollmentNo: 'EN202200304', name: 'Pooja Hegde', email: 'pooja.h@student.college.edu', programId: 'prog-btech-ece', semesterId: 'sem-ece-4', sectionId: 'sec-ece-4-a', phone: '+91 98345 33444' },
  { id: 'std-ece-05', rollNo: '22BECE05', enrollmentNo: 'EN202200305', name: 'Rishabh Pandey', email: 'rishabh.p@student.college.edu', programId: 'prog-btech-ece', semesterId: 'sem-ece-4', sectionId: 'sec-ece-4-a', phone: '+91 98345 33445' },
  { id: 'std-ece-06', rollNo: '22BECE06', enrollmentNo: 'EN202200306', name: 'Swati Bisht', email: 'swati.b@student.college.edu', programId: 'prog-btech-ece', semesterId: 'sem-ece-4', sectionId: 'sec-ece-4-a', phone: '+91 98345 33446' },

  // ==================== 4. BCA (Sem 3, Section A) ====================
  { id: 'std-bca-01', rollNo: '23BCA01', enrollmentNo: 'EN202300401', name: 'Nikhil Saxena', email: 'nikhil.bca@student.college.edu', programId: 'prog-bca', semesterId: 'sem-bca-3', sectionId: 'sec-bca-3-a', phone: '+91 98456 55661' },
  { id: 'std-bca-02', rollNo: '23BCA02', enrollmentNo: 'EN202300402', name: 'Rhea Pillai', email: 'rhea.bca@student.college.edu', programId: 'prog-bca', semesterId: 'sem-bca-3', sectionId: 'sec-bca-3-a', phone: '+91 98456 55662' },
  { id: 'std-bca-03', rollNo: '23BCA03', enrollmentNo: 'EN202300403', name: 'Amitabh Sen', email: 'amitabh.s@student.college.edu', programId: 'prog-bca', semesterId: 'sem-bca-3', sectionId: 'sec-bca-3-a', phone: '+91 98456 55663' },
  { id: 'std-bca-04', rollNo: '23BCA04', enrollmentNo: 'EN202300404', name: 'Deepika Rao', email: 'deepika.r@student.college.edu', programId: 'prog-bca', semesterId: 'sem-bca-3', sectionId: 'sec-bca-3-a', phone: '+91 98456 55664' },
  { id: 'std-bca-05', rollNo: '23BCA05', enrollmentNo: 'EN202300405', name: 'Tarun Mathur', email: 'tarun.m@student.college.edu', programId: 'prog-bca', semesterId: 'sem-bca-3', sectionId: 'sec-bca-3-a', phone: '+91 98456 55665' },
  { id: 'std-bca-06', rollNo: '23BCA06', enrollmentNo: 'EN202300406', name: 'Ankita Ghosh', email: 'ankita.g@student.college.edu', programId: 'prog-bca', semesterId: 'sem-bca-3', sectionId: 'sec-bca-3-a', phone: '+91 98456 55666' },

  // ==================== 5. MCA (Sem 2, Section A) ====================
  { id: 'std-mca-01', rollNo: '24MCA01', enrollmentNo: 'EN202400501', name: 'Siddharth Rao', email: 'sid.mca@student.college.edu', programId: 'prog-mca', semesterId: 'sem-mca-2', sectionId: 'sec-mca-2-a', phone: '+91 98567 77881' },
  { id: 'std-mca-02', rollNo: '24MCA02', enrollmentNo: 'EN202400502', name: 'Kavita Menon', email: 'kavita.mca@student.college.edu', programId: 'prog-mca', semesterId: 'sem-mca-2', sectionId: 'sec-mca-2-a', phone: '+91 98567 77882' },
  { id: 'std-mca-03', rollNo: '24MCA03', enrollmentNo: 'EN202400503', name: 'Gaurav Narang', email: 'gaurav.n@student.college.edu', programId: 'prog-mca', semesterId: 'sem-mca-2', sectionId: 'sec-mca-2-a', phone: '+91 98567 77883' },
  { id: 'std-mca-04', rollNo: '24MCA04', enrollmentNo: 'EN202400504', name: 'Bhavna Juneja', email: 'bhavna.j@student.college.edu', programId: 'prog-mca', semesterId: 'sem-mca-2', sectionId: 'sec-mca-2-a', phone: '+91 98567 77884' },
  { id: 'std-mca-05', rollNo: '24MCA05', enrollmentNo: 'EN202400505', name: 'Yashwardhan Dixit', email: 'yash.d@student.college.edu', programId: 'prog-mca', semesterId: 'sem-mca-2', sectionId: 'sec-mca-2-a', phone: '+91 98567 77885' },
  { id: 'std-mca-06', rollNo: '24MCA06', enrollmentNo: 'EN202400506', name: 'Pallavi Acharya', email: 'pallavi.a@student.college.edu', programId: 'prog-mca', semesterId: 'sem-mca-2', sectionId: 'sec-mca-2-a', phone: '+91 98567 77886' },
];

export const initialActivities: Activity[] = [
  {
    id: 'act-01',
    name: 'Smart India Hackathon 2026',
    date: '2026-09-02',
    category: 'Hackathon',
    description: 'National level 36-hour continuous software edition solving central governance challenges.'
  },
  {
    id: 'act-02',
    name: 'Annual Inter-College Sports Championship',
    date: '2026-09-05',
    category: 'Sports',
    description: 'University athletic championship - Badminton, Football, Cricket, and 400m Track.'
  },
  {
    id: 'act-03',
    name: 'NSS Blood Donation & Health Drive',
    date: '2026-09-08',
    category: 'NSS',
    description: 'Community social responsibility drive organized in collaboration with Red Cross Society.'
  },
  {
    id: 'act-04',
    name: 'TechPulse 2026 - AI & Robotics Workshop',
    date: '2026-09-10',
    category: 'Workshop',
    description: 'Hands-on session on Autonomous Agents, Computer Vision, and Micro-ROS embedded hardware.'
  },
  {
    id: 'act-05',
    name: 'National Cultural Fest - Tarang',
    date: '2026-09-12',
    category: 'Cultural',
    description: 'Inter-collegiate theatricals, classical music, western dance, and fine arts festival.'
  },
  {
    id: 'act-06',
    name: 'Cloud Native Architecture Seminar',
    date: '2026-09-14',
    category: 'Seminar',
    description: 'Invited technical talk by Google Cloud industry architects on Kubernetes & Microservices.'
  }
];

export const initialActivityParticipations: ActivityParticipation[] = [
  // CSE Students
  { id: 'part-01', studentId: 'std-cse-01', activityId: 'act-01', roleOrAward: 'Team Lead - 1st Runner Up' },
  { id: 'part-02', studentId: 'std-cse-02', activityId: 'act-01', roleOrAward: 'Full Stack Dev' },
  { id: 'part-03', studentId: 'std-cse-04', activityId: 'act-03', roleOrAward: 'Student Coordinator' },
  { id: 'part-04', studentId: 'std-cse-05', activityId: 'act-02', roleOrAward: 'Football Captain' },
  { id: 'part-05', studentId: 'std-cse-03', activityId: 'act-02', roleOrAward: 'Table Tennis Runner Up' },
  { id: 'part-06', studentId: 'std-cse-06', activityId: 'act-05', roleOrAward: 'Classical Solo Winner' },

  // AI Students
  { id: 'part-07', studentId: 'std-ai-01', activityId: 'act-01', roleOrAward: 'Winner - Best AI Model' },
  { id: 'part-08', studentId: 'std-ai-02', activityId: 'act-04', roleOrAward: 'Workshop Lead' },
  { id: 'part-09', studentId: 'std-ai-03', activityId: 'act-06', roleOrAward: 'Paper Presenter' },

  // ECE Students
  { id: 'part-10', studentId: 'std-ece-01', activityId: 'act-04', roleOrAward: 'Robotics Project 2nd Prize' },
  { id: 'part-11', studentId: 'std-ece-02', activityId: 'act-03', roleOrAward: 'Camp Volunteer' },

  // BCA Students
  { id: 'part-12', studentId: 'std-bca-01', activityId: 'act-01', roleOrAward: 'Web UI Specialist' },
  { id: 'part-13', studentId: 'std-bca-02', activityId: 'act-05', roleOrAward: 'Western Vocals 1st Prize' },

  // MCA Students
  { id: 'part-14', studentId: 'std-mca-01', activityId: 'act-06', roleOrAward: 'Graduate Speaker' },
  { id: 'part-15', studentId: 'std-mca-02', activityId: 'act-01', roleOrAward: 'Mentor & Evaluator' },
];

// Consistent Attendance Records across courses and dates
export const initialAttendances: Attendance[] = [
  // =================== 1. B.Tech CSE: Course 'crs-ds' (Data Structures) ===================
  // Day 1: 2026-09-08
  { id: 'att-cse-1-1', studentId: 'std-cse-01', courseId: 'crs-ds', date: '2026-09-08', status: 'P', markedBy: 'Prof. Ananya Verma' },
  { id: 'att-cse-1-2', studentId: 'std-cse-02', courseId: 'crs-ds', date: '2026-09-08', status: 'P', markedBy: 'Prof. Ananya Verma' },
  { id: 'att-cse-1-3', studentId: 'std-cse-03', courseId: 'crs-ds', date: '2026-09-08', status: 'A', markedBy: 'Prof. Ananya Verma' },
  { id: 'att-cse-1-4', studentId: 'std-cse-04', courseId: 'crs-ds', date: '2026-09-08', status: 'P', markedBy: 'Prof. Ananya Verma' },
  { id: 'att-cse-1-5', studentId: 'std-cse-05', courseId: 'crs-ds', date: '2026-09-08', status: 'P', markedBy: 'Prof. Ananya Verma' },
  { id: 'att-cse-1-6', studentId: 'std-cse-06', courseId: 'crs-ds', date: '2026-09-08', status: 'P', markedBy: 'Prof. Ananya Verma' },

  // Day 2: 2026-09-09
  { id: 'att-cse-2-1', studentId: 'std-cse-01', courseId: 'crs-ds', date: '2026-09-09', status: 'P', markedBy: 'Prof. Ananya Verma' },
  { id: 'att-cse-2-2', studentId: 'std-cse-02', courseId: 'crs-ds', date: '2026-09-09', status: 'P', markedBy: 'Prof. Ananya Verma' },
  { id: 'att-cse-2-3', studentId: 'std-cse-03', courseId: 'crs-ds', date: '2026-09-09', status: 'P', markedBy: 'Prof. Ananya Verma' },
  { id: 'att-cse-2-4', studentId: 'std-cse-04', courseId: 'crs-ds', date: '2026-09-09', status: 'L', markedBy: 'Prof. Ananya Verma' },
  { id: 'att-cse-2-5', studentId: 'std-cse-05', courseId: 'crs-ds', date: '2026-09-09', status: 'A', markedBy: 'Prof. Ananya Verma' },
  { id: 'att-cse-2-6', studentId: 'std-cse-06', courseId: 'crs-ds', date: '2026-09-09', status: 'M', markedBy: 'Prof. Ananya Verma' },

  // Day 3: 2026-09-11
  { id: 'att-cse-3-1', studentId: 'std-cse-01', courseId: 'crs-ds', date: '2026-09-11', status: 'P', markedBy: 'Prof. Ananya Verma' },
  { id: 'att-cse-3-2', studentId: 'std-cse-02', courseId: 'crs-ds', date: '2026-09-11', status: 'P', markedBy: 'Prof. Ananya Verma' },
  { id: 'att-cse-3-3', studentId: 'std-cse-03', courseId: 'crs-ds', date: '2026-09-11', status: 'P', markedBy: 'Prof. Ananya Verma' },
  { id: 'att-cse-3-4', studentId: 'std-cse-04', courseId: 'crs-ds', date: '2026-09-11', status: 'P', markedBy: 'Prof. Ananya Verma' },
  { id: 'att-cse-3-5', studentId: 'std-cse-05', courseId: 'crs-ds', date: '2026-09-11', status: 'P', markedBy: 'Prof. Ananya Verma' },
  { id: 'att-cse-3-6', studentId: 'std-cse-06', courseId: 'crs-ds', date: '2026-09-11', status: 'P', markedBy: 'Prof. Ananya Verma' },

  // Day 4: 2026-09-14
  { id: 'att-cse-4-1', studentId: 'std-cse-01', courseId: 'crs-ds', date: '2026-09-14', status: 'P', markedBy: 'Prof. Ananya Verma' },
  { id: 'att-cse-4-2', studentId: 'std-cse-02', courseId: 'crs-ds', date: '2026-09-14', status: 'P', markedBy: 'Prof. Ananya Verma' },
  { id: 'att-cse-4-3', studentId: 'std-cse-03', courseId: 'crs-ds', date: '2026-09-14', status: 'A', markedBy: 'Prof. Ananya Verma' },
  { id: 'att-cse-4-4', studentId: 'std-cse-04', courseId: 'crs-ds', date: '2026-09-14', status: 'P', markedBy: 'Prof. Ananya Verma' },
  { id: 'att-cse-4-5', studentId: 'std-cse-05', courseId: 'crs-ds', date: '2026-09-14', status: 'P', markedBy: 'Prof. Ananya Verma' },
  { id: 'att-cse-4-6', studentId: 'std-cse-06', courseId: 'crs-ds', date: '2026-09-14', status: 'A', markedBy: 'Prof. Ananya Verma' },

  // =================== 2. B.Tech AI: Course 'crs-ai-ml' (Deep Learning) ===================
  // Day 1: 2026-09-10
  { id: 'att-ai-1-1', studentId: 'std-ai-01', courseId: 'crs-ai-ml', date: '2026-09-10', status: 'P', markedBy: 'Dr. K. Swaminathan' },
  { id: 'att-ai-1-2', studentId: 'std-ai-02', courseId: 'crs-ai-ml', date: '2026-09-10', status: 'P', markedBy: 'Dr. K. Swaminathan' },
  { id: 'att-ai-1-3', studentId: 'std-ai-03', courseId: 'crs-ai-ml', date: '2026-09-10', status: 'P', markedBy: 'Dr. K. Swaminathan' },
  { id: 'att-ai-1-4', studentId: 'std-ai-04', courseId: 'crs-ai-ml', date: '2026-09-10', status: 'A', markedBy: 'Dr. K. Swaminathan' },
  { id: 'att-ai-1-5', studentId: 'std-ai-05', courseId: 'crs-ai-ml', date: '2026-09-10', status: 'P', markedBy: 'Dr. K. Swaminathan' },
  { id: 'att-ai-1-6', studentId: 'std-ai-06', courseId: 'crs-ai-ml', date: '2026-09-10', status: 'P', markedBy: 'Dr. K. Swaminathan' },

  // Day 2: 2026-09-12
  { id: 'att-ai-2-1', studentId: 'std-ai-01', courseId: 'crs-ai-ml', date: '2026-09-12', status: 'P', markedBy: 'Dr. K. Swaminathan' },
  { id: 'att-ai-2-2', studentId: 'std-ai-02', courseId: 'crs-ai-ml', date: '2026-09-12', status: 'P', markedBy: 'Dr. K. Swaminathan' },
  { id: 'att-ai-2-3', studentId: 'std-ai-03', courseId: 'crs-ai-ml', date: '2026-09-12', status: 'A', markedBy: 'Dr. K. Swaminathan' },
  { id: 'att-ai-2-4', studentId: 'std-ai-04', courseId: 'crs-ai-ml', date: '2026-09-12', status: 'L', markedBy: 'Dr. K. Swaminathan' },
  { id: 'att-ai-2-5', studentId: 'std-ai-05', courseId: 'crs-ai-ml', date: '2026-09-12', status: 'P', markedBy: 'Dr. K. Swaminathan' },
  { id: 'att-ai-2-6', studentId: 'std-ai-06', courseId: 'crs-ai-ml', date: '2026-09-12', status: 'P', markedBy: 'Dr. K. Swaminathan' },

  // Day 3: 2026-09-14
  { id: 'att-ai-3-1', studentId: 'std-ai-01', courseId: 'crs-ai-ml', date: '2026-09-14', status: 'P', markedBy: 'Dr. K. Swaminathan' },
  { id: 'att-ai-3-2', studentId: 'std-ai-02', courseId: 'crs-ai-ml', date: '2026-09-14', status: 'P', markedBy: 'Dr. K. Swaminathan' },
  { id: 'att-ai-3-3', studentId: 'std-ai-03', courseId: 'crs-ai-ml', date: '2026-09-14', status: 'P', markedBy: 'Dr. K. Swaminathan' },
  { id: 'att-ai-3-4', studentId: 'std-ai-04', courseId: 'crs-ai-ml', date: '2026-09-14', status: 'P', markedBy: 'Dr. K. Swaminathan' },
  { id: 'att-ai-3-5', studentId: 'std-ai-05', courseId: 'crs-ai-ml', date: '2026-09-14', status: 'P', markedBy: 'Dr. K. Swaminathan' },
  { id: 'att-ai-3-6', studentId: 'std-ai-06', courseId: 'crs-ai-ml', date: '2026-09-14', status: 'M', markedBy: 'Dr. K. Swaminathan' },

  // =================== 3. B.Tech ECE: Course 'crs-ece-signals' ===================
  // Day 1: 2026-09-10
  { id: 'att-ece-1-1', studentId: 'std-ece-01', courseId: 'crs-ece-signals', date: '2026-09-10', status: 'P', markedBy: 'Dr. Alok Srivastava' },
  { id: 'att-ece-1-2', studentId: 'std-ece-02', courseId: 'crs-ece-signals', date: '2026-09-10', status: 'P', markedBy: 'Dr. Alok Srivastava' },
  { id: 'att-ece-1-3', studentId: 'std-ece-03', courseId: 'crs-ece-signals', date: '2026-09-10', status: 'A', markedBy: 'Dr. Alok Srivastava' },
  { id: 'att-ece-1-4', studentId: 'std-ece-04', courseId: 'crs-ece-signals', date: '2026-09-10', status: 'P', markedBy: 'Dr. Alok Srivastava' },
  { id: 'att-ece-1-5', studentId: 'std-ece-05', courseId: 'crs-ece-signals', date: '2026-09-10', status: 'P', markedBy: 'Dr. Alok Srivastava' },
  { id: 'att-ece-1-6', studentId: 'std-ece-06', courseId: 'crs-ece-signals', date: '2026-09-10', status: 'P', markedBy: 'Dr. Alok Srivastava' },

  // Day 2: 2026-09-13
  { id: 'att-ece-2-1', studentId: 'std-ece-01', courseId: 'crs-ece-signals', date: '2026-09-13', status: 'P', markedBy: 'Dr. Alok Srivastava' },
  { id: 'att-ece-2-2', studentId: 'std-ece-02', courseId: 'crs-ece-signals', date: '2026-09-13', status: 'P', markedBy: 'Dr. Alok Srivastava' },
  { id: 'att-ece-2-3', studentId: 'std-ece-03', courseId: 'crs-ece-signals', date: '2026-09-13', status: 'P', markedBy: 'Dr. Alok Srivastava' },
  { id: 'att-ece-2-4', studentId: 'std-ece-04', courseId: 'crs-ece-signals', date: '2026-09-13', status: 'A', markedBy: 'Dr. Alok Srivastava' },
  { id: 'att-ece-2-5', studentId: 'std-ece-05', courseId: 'crs-ece-signals', date: '2026-09-13', status: 'L', markedBy: 'Dr. Alok Srivastava' },
  { id: 'att-ece-2-6', studentId: 'std-ece-06', courseId: 'crs-ece-signals', date: '2026-09-13', status: 'P', markedBy: 'Dr. Alok Srivastava' },

  // =================== 4. BCA: Course 'crs-bca-web' (Web Dev & React) ===================
  // Day 1: 2026-09-09
  { id: 'att-bca-1-1', studentId: 'std-bca-01', courseId: 'crs-bca-web', date: '2026-09-09', status: 'P', markedBy: 'Prof. Rohit Nanda' },
  { id: 'att-bca-1-2', studentId: 'std-bca-02', courseId: 'crs-bca-web', date: '2026-09-09', status: 'P', markedBy: 'Prof. Rohit Nanda' },
  { id: 'att-bca-1-3', studentId: 'std-bca-03', courseId: 'crs-bca-web', date: '2026-09-09', status: 'P', markedBy: 'Prof. Rohit Nanda' },
  { id: 'att-bca-1-4', studentId: 'std-bca-04', courseId: 'crs-bca-web', date: '2026-09-09', status: 'P', markedBy: 'Prof. Rohit Nanda' },
  { id: 'att-bca-1-5', studentId: 'std-bca-05', courseId: 'crs-bca-web', date: '2026-09-09', status: 'A', markedBy: 'Prof. Rohit Nanda' },
  { id: 'att-bca-1-6', studentId: 'std-bca-06', courseId: 'crs-bca-web', date: '2026-09-09', status: 'P', markedBy: 'Prof. Rohit Nanda' },

  // Day 2: 2026-09-12
  { id: 'att-bca-2-1', studentId: 'std-bca-01', courseId: 'crs-bca-web', date: '2026-09-12', status: 'P', markedBy: 'Prof. Rohit Nanda' },
  { id: 'att-bca-2-2', studentId: 'std-bca-02', courseId: 'crs-bca-web', date: '2026-09-12', status: 'A', markedBy: 'Prof. Rohit Nanda' },
  { id: 'att-bca-2-3', studentId: 'std-bca-03', courseId: 'crs-bca-web', date: '2026-09-12', status: 'P', markedBy: 'Prof. Rohit Nanda' },
  { id: 'att-bca-2-4', studentId: 'std-bca-04', courseId: 'crs-bca-web', date: '2026-09-12', status: 'P', markedBy: 'Prof. Rohit Nanda' },
  { id: 'att-bca-2-5', studentId: 'std-bca-05', courseId: 'crs-bca-web', date: '2026-09-12', status: 'P', markedBy: 'Prof. Rohit Nanda' },
  { id: 'att-bca-2-6', studentId: 'std-bca-06', courseId: 'crs-bca-web', date: '2026-09-12', status: 'L', markedBy: 'Prof. Rohit Nanda' },

  // =================== 5. MCA: Course 'crs-mca-adv-db' (Advanced Distributed DBMS) ===================
  // Day 1: 2026-09-11
  { id: 'att-mca-1-1', studentId: 'std-mca-01', courseId: 'crs-mca-adv-db', date: '2026-09-11', status: 'P', markedBy: 'Dr. Rajesh Sharma' },
  { id: 'att-mca-1-2', studentId: 'std-mca-02', courseId: 'crs-mca-adv-db', date: '2026-09-11', status: 'P', markedBy: 'Dr. Rajesh Sharma' },
  { id: 'att-mca-1-3', studentId: 'std-mca-03', courseId: 'crs-mca-adv-db', date: '2026-09-11', status: 'P', markedBy: 'Dr. Rajesh Sharma' },
  { id: 'att-mca-1-4', studentId: 'std-mca-04', courseId: 'crs-mca-adv-db', date: '2026-09-11', status: 'P', markedBy: 'Dr. Rajesh Sharma' },
  { id: 'att-mca-1-5', studentId: 'std-mca-05', courseId: 'crs-mca-adv-db', date: '2026-09-11', status: 'A', markedBy: 'Dr. Rajesh Sharma' },
  { id: 'att-mca-1-6', studentId: 'std-mca-06', courseId: 'crs-mca-adv-db', date: '2026-09-11', status: 'P', markedBy: 'Dr. Rajesh Sharma' },

  // Day 2: 2026-09-14
  { id: 'att-mca-2-1', studentId: 'std-mca-01', courseId: 'crs-mca-adv-db', date: '2026-09-14', status: 'P', markedBy: 'Dr. Rajesh Sharma' },
  { id: 'att-mca-2-2', studentId: 'std-mca-02', courseId: 'crs-mca-adv-db', date: '2026-09-14', status: 'P', markedBy: 'Dr. Rajesh Sharma' },
  { id: 'att-mca-2-3', studentId: 'std-mca-03', courseId: 'crs-mca-adv-db', date: '2026-09-14', status: 'P', markedBy: 'Dr. Rajesh Sharma' },
  { id: 'att-mca-2-4', studentId: 'std-mca-04', courseId: 'crs-mca-adv-db', date: '2026-09-14', status: 'L', markedBy: 'Dr. Rajesh Sharma' },
  { id: 'att-mca-2-5', studentId: 'std-mca-05', courseId: 'crs-mca-adv-db', date: '2026-09-14', status: 'P', markedBy: 'Dr. Rajesh Sharma' },
  { id: 'att-mca-2-6', studentId: 'std-mca-06', courseId: 'crs-mca-adv-db', date: '2026-09-14', status: 'M', markedBy: 'Dr. Rajesh Sharma' },
];

export const initialFacultyTimetables: FacultyTimetableEntry[] = [
  // Prof. Ananya Verma (user-faculty-1 & default)
  {
    id: 'tt-ananya-1',
    facultyId: 'user-faculty-1',
    facultyName: 'Prof. Ananya Verma',
    dayOfWeek: 'Monday',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    courseCode: 'CS501',
    courseName: 'Data Structures & Algorithms',
    programName: 'B.Tech CSE',
    semesterNumber: 5,
    sectionName: 'A',
    roomNo: 'LH-301'
  },
  {
    id: 'tt-ananya-2',
    facultyId: 'user-faculty-1',
    facultyName: 'Prof. Ananya Verma',
    dayOfWeek: 'Monday',
    startTime: '11:15 AM',
    endTime: '12:15 PM',
    courseCode: 'CS504',
    courseName: 'Java Programming & Spring Boot',
    programName: 'B.Tech CSE',
    semesterNumber: 5,
    sectionName: 'A',
    roomNo: 'Lab CS-2'
  },
  {
    id: 'tt-ananya-3',
    facultyId: 'user-faculty-1',
    facultyName: 'Prof. Ananya Verma',
    dayOfWeek: 'Tuesday',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    courseCode: 'CS501',
    courseName: 'Data Structures & Algorithms',
    programName: 'B.Tech CSE',
    semesterNumber: 5,
    sectionName: 'A',
    roomNo: 'LH-301'
  },
  {
    id: 'tt-ananya-4',
    facultyId: 'user-faculty-1',
    facultyName: 'Prof. Ananya Verma',
    dayOfWeek: 'Wednesday',
    startTime: '02:00 PM',
    endTime: '03:00 PM',
    courseCode: 'MCA202',
    courseName: 'Enterprise Java & Spring Cloud',
    programName: 'MCA',
    semesterNumber: 2,
    sectionName: 'A',
    roomNo: 'PG-Lab 1'
  },
  {
    id: 'tt-ananya-5',
    facultyId: 'user-faculty-1',
    facultyName: 'Prof. Ananya Verma',
    dayOfWeek: 'Thursday',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    courseCode: 'AI504',
    courseName: 'AI Ethics, Governance & Safety',
    programName: 'B.Tech AI',
    semesterNumber: 5,
    sectionName: 'A',
    roomNo: 'Seminar Hall B'
  },
  {
    id: 'tt-ananya-6',
    facultyId: 'user-faculty-1',
    facultyName: 'Prof. Ananya Verma',
    dayOfWeek: 'Friday',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    courseCode: 'CS504',
    courseName: 'Spring Boot Architecture Lab',
    programName: 'B.Tech CSE',
    semesterNumber: 5,
    sectionName: 'A',
    roomNo: 'Software Eng Lab'
  },

  // Prof. Vikram Sen (user-faculty-2)
  {
    id: 'tt-vikram-1',
    facultyId: 'user-faculty-2',
    facultyName: 'Prof. Vikram Sen',
    dayOfWeek: 'Monday',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    courseCode: 'CS503',
    courseName: 'Operating Systems',
    programName: 'B.Tech CSE',
    semesterNumber: 5,
    sectionName: 'A',
    roomNo: 'LH-204'
  },
  {
    id: 'tt-vikram-2',
    facultyId: 'user-faculty-2',
    facultyName: 'Prof. Vikram Sen',
    dayOfWeek: 'Tuesday',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    courseCode: 'BCA302',
    courseName: 'Python Programming & Analytics',
    programName: 'BCA',
    semesterNumber: 3,
    sectionName: 'A',
    roomNo: 'Lab BCA-1'
  },
  {
    id: 'tt-vikram-3',
    facultyId: 'user-faculty-2',
    facultyName: 'Prof. Vikram Sen',
    dayOfWeek: 'Wednesday',
    startTime: '11:15 AM',
    endTime: '12:15 PM',
    courseCode: 'MCA204',
    courseName: 'DevOps & CI/CD Pipelines',
    programName: 'MCA',
    semesterNumber: 2,
    sectionName: 'A',
    roomNo: 'Cloud Lab'
  },
  {
    id: 'tt-vikram-4',
    facultyId: 'user-faculty-2',
    facultyName: 'Prof. Vikram Sen',
    dayOfWeek: 'Thursday',
    startTime: '02:00 PM',
    endTime: '04:00 PM',
    courseCode: 'CS503',
    courseName: 'Linux Kernel & Shell Lab',
    programName: 'B.Tech CSE',
    semesterNumber: 5,
    sectionName: 'A',
    roomNo: 'Systems Lab 3'
  },

  // Dr. K. Swaminathan (user-faculty-3)
  {
    id: 'tt-swami-1',
    facultyId: 'user-faculty-3',
    facultyName: 'Dr. K. Swaminathan',
    dayOfWeek: 'Monday',
    startTime: '11:15 AM',
    endTime: '12:15 PM',
    courseCode: 'AI501',
    courseName: 'Deep Learning & Neural Networks',
    programName: 'B.Tech AI',
    semesterNumber: 5,
    sectionName: 'A',
    roomNo: 'AI Wing 101'
  },
  {
    id: 'tt-swami-2',
    facultyId: 'user-faculty-3',
    facultyName: 'Dr. K. Swaminathan',
    dayOfWeek: 'Tuesday',
    startTime: '02:00 PM',
    endTime: '04:00 PM',
    courseCode: 'AI502',
    courseName: 'Computer Vision & PyTorch Lab',
    programName: 'B.Tech AI',
    semesterNumber: 5,
    sectionName: 'A',
    roomNo: 'GPU Compute Cluster'
  },
  {
    id: 'tt-swami-3',
    facultyId: 'user-faculty-3',
    facultyName: 'Dr. K. Swaminathan',
    dayOfWeek: 'Thursday',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    courseCode: 'AI505',
    courseName: 'Reinforcement Learning',
    programName: 'B.Tech AI',
    semesterNumber: 5,
    sectionName: 'A',
    roomNo: 'AI Wing 102'
  },

  // Dr. Priya Mehta (user-faculty-4)
  {
    id: 'tt-priya-1',
    facultyId: 'user-faculty-4',
    facultyName: 'Dr. Priya Mehta',
    dayOfWeek: 'Monday',
    startTime: '02:00 PM',
    endTime: '03:00 PM',
    courseCode: 'AI503',
    courseName: 'Natural Language Processing & LLMs',
    programName: 'B.Tech AI',
    semesterNumber: 5,
    sectionName: 'A',
    roomNo: 'AI Wing 102'
  },
  {
    id: 'tt-priya-2',
    facultyId: 'user-faculty-4',
    facultyName: 'Dr. Priya Mehta',
    dayOfWeek: 'Wednesday',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    courseCode: 'AI503',
    courseName: 'Transformers & Fine-tuning',
    programName: 'B.Tech AI',
    semesterNumber: 5,
    sectionName: 'A',
    roomNo: 'NLP Research Lab'
  },
  {
    id: 'tt-priya-3',
    facultyId: 'user-faculty-4',
    facultyName: 'Dr. Priya Mehta',
    dayOfWeek: 'Friday',
    startTime: '11:15 AM',
    endTime: '01:15 PM',
    courseCode: 'AI503',
    courseName: 'NLP & LLM Prompting Lab',
    programName: 'B.Tech AI',
    semesterNumber: 5,
    sectionName: 'A',
    roomNo: 'AI Computing Lab 2'
  },

  // Dr. Alok Srivastava (user-faculty-5)
  {
    id: 'tt-alok-1',
    facultyId: 'user-faculty-5',
    facultyName: 'Dr. Alok Srivastava',
    dayOfWeek: 'Monday',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    courseCode: 'EC401',
    courseName: 'Signals & Linear Systems',
    programName: 'B.Tech ECE',
    semesterNumber: 4,
    sectionName: 'A',
    roomNo: 'ECE Hall 101'
  },
  {
    id: 'tt-alok-2',
    facultyId: 'user-faculty-5',
    facultyName: 'Dr. Alok Srivastava',
    dayOfWeek: 'Wednesday',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    courseCode: 'EC403',
    courseName: 'Analog & Digital Communication',
    programName: 'B.Tech ECE',
    semesterNumber: 4,
    sectionName: 'A',
    roomNo: 'ECE Hall 101'
  },

  // Prof. Rohit Nanda (user-faculty-6)
  {
    id: 'tt-rohit-1',
    facultyId: 'user-faculty-6',
    facultyName: 'Prof. Rohit Nanda',
    dayOfWeek: 'Tuesday',
    startTime: '11:15 AM',
    endTime: '12:15 PM',
    courseCode: 'BCA301',
    courseName: 'Full Stack Web Development & React',
    programName: 'BCA',
    semesterNumber: 3,
    sectionName: 'A',
    roomNo: 'Lab BCA-2'
  },
  {
    id: 'tt-rohit-2',
    facultyId: 'user-faculty-6',
    facultyName: 'Prof. Rohit Nanda',
    dayOfWeek: 'Wednesday',
    startTime: '02:00 PM',
    endTime: '04:00 PM',
    courseCode: 'BCA301',
    courseName: 'React & Tailwind Hands-on Lab',
    programName: 'BCA',
    semesterNumber: 3,
    sectionName: 'A',
    roomNo: 'Web Dev Lab'
  },
  {
    id: 'tt-rohit-3',
    facultyId: 'user-faculty-6',
    facultyName: 'Prof. Rohit Nanda',
    dayOfWeek: 'Friday',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    courseCode: 'MCA205',
    courseName: 'Mobile Application Development',
    programName: 'MCA',
    semesterNumber: 2,
    sectionName: 'A',
    roomNo: 'PG Mobile Lab'
  },

  // Prof. Sunita Pillai (user-faculty-7)
  {
    id: 'tt-sunita-1',
    facultyId: 'user-faculty-7',
    facultyName: 'Prof. Sunita Pillai',
    dayOfWeek: 'Monday',
    startTime: '02:00 PM',
    endTime: '03:00 PM',
    courseCode: 'EC402',
    courseName: 'VLSI Design & Digital ICs',
    programName: 'B.Tech ECE',
    semesterNumber: 4,
    sectionName: 'A',
    roomNo: 'VLSI CAD Lab'
  },
  {
    id: 'tt-sunita-2',
    facultyId: 'user-faculty-7',
    facultyName: 'Prof. Sunita Pillai',
    dayOfWeek: 'Thursday',
    startTime: '11:15 AM',
    endTime: '12:15 PM',
    courseCode: 'EC405',
    courseName: 'Electromagnetic Field Theory',
    programName: 'B.Tech ECE',
    semesterNumber: 4,
    sectionName: 'A',
    roomNo: 'ECE Hall 102'
  }
];

