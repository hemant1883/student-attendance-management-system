import React, { useState, useEffect, useMemo } from 'react';
import { Student, Program, Semester, Section } from '../../types';
import { storageService } from '../../services/storageService';
import { useToast } from '../common/Toast';
import {
  Users,
  Search,
  Plus,
  Trash2,
  Edit2,
  Mail,
  Phone,
  Filter,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';

export const StudentManager: React.FC = () => {
  const { showToast } = useToast();

  const [students, setStudents] = useState<Student[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [sections, setSections] = useState<Section[]>([]);

  const [search, setSearch] = useState('');
  const [filterProgramId, setFilterProgramId] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  const [formRollNo, setFormRollNo] = useState('');
  const [formEnrollmentNo, setFormEnrollmentNo] = useState('');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formProgramId, setFormProgramId] = useState('');
  const [formSemesterId, setFormSemesterId] = useState('');
  const [formSectionId, setFormSectionId] = useState('');

  const refreshStudents = () => {
    setStudents(storageService.getStudents());
    setPrograms(storageService.getPrograms());
    setSemesters(storageService.getSemesters());
    setSections(storageService.getSections());
  };

  useEffect(() => {
    refreshStudents();
  }, []);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch =
        !search.trim() ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
        s.enrollmentNo.toLowerCase().includes(search.toLowerCase());

      const matchesProgram = !filterProgramId || s.programId === filterProgramId;
      return matchesSearch && matchesProgram;
    });
  }, [students, search, filterProgramId]);

  // Paginated students
  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  const openAddModal = () => {
    setEditingStudentId(null);
    setFormRollNo('');
    setFormEnrollmentNo('');
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    const prog = programs[0]?.id || '';
    setFormProgramId(prog);
    const sem = semesters.find(s => s.programId === prog)?.id || '';
    setFormSemesterId(sem);
    const sec = sections.find(s => s.semesterId === sem)?.id || '';
    setFormSectionId(sec);
    setIsModalOpen(true);
  };

  const openEditModal = (std: Student) => {
    setEditingStudentId(std.id);
    setFormRollNo(std.rollNo);
    setFormEnrollmentNo(std.enrollmentNo);
    setFormName(std.name);
    setFormEmail(std.email);
    setFormPhone(std.phone || '');
    setFormProgramId(std.programId);
    setFormSemesterId(std.semesterId);
    setFormSectionId(std.sectionId);
    setIsModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRollNo || !formEnrollmentNo || !formName || !formProgramId || !formSemesterId || !formSectionId) {
      showToast('Please fill all required student details', 'warning');
      return;
    }

    if (editingStudentId) {
      storageService.updateStudent(editingStudentId, {
        rollNo: formRollNo.trim().toUpperCase(),
        enrollmentNo: formEnrollmentNo.trim().toUpperCase(),
        name: formName.trim(),
        email: formEmail.trim() || `${formRollNo.toLowerCase()}@student.college.edu`,
        phone: formPhone.trim(),
        programId: formProgramId,
        semesterId: formSemesterId,
        sectionId: formSectionId
      });
      showToast('Student record updated successfully', 'success');
    } else {
      storageService.addStudent({
        rollNo: formRollNo.trim().toUpperCase(),
        enrollmentNo: formEnrollmentNo.trim().toUpperCase(),
        name: formName.trim(),
        email: formEmail.trim() || `${formRollNo.toLowerCase()}@student.college.edu`,
        phone: formPhone.trim(),
        programId: formProgramId,
        semesterId: formSemesterId,
        sectionId: formSectionId
      });
      showToast('New student added successfully', 'success');
    }

    setIsModalOpen(false);
    refreshStudents();
  };

  const handleDeleteStudent = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete student "${name}"?`)) {
      storageService.deleteStudent(id);
      showToast(`Student ${name} deleted`, 'info');
      refreshStudents();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Students Directory & Enrollment Master
          </h1>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
            Maintain registered student records, enrollment IDs, program assignments, and contact records.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, roll no, enrollment..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={filterProgramId}
            onChange={e => {
              setFilterProgramId(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">All Programs</option>
            {programs.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold shrink-0">
            {filteredStudents.length} Students
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Enrollment No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Program & Sem</th>
                <th className="py-3 px-4">Section</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedStudents.map(std => {
                const prog = programs.find(p => p.id === std.programId);
                const sem = semesters.find(s => s.id === std.semesterId);
                const sec = sections.find(s => s.id === std.sectionId);

                return (
                  <tr key={std.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {std.rollNo}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-700 dark:text-slate-300">
                      {std.enrollmentNo}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {std.name}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-700 dark:text-slate-300">
                      {prog?.name || 'N/A'} (Sem {sem?.semesterNumber || 0})
                    </td>
                    <td className="py-3 px-4 font-bold text-blue-600 dark:text-blue-400 text-xs">
                      Section {sec?.sectionName || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-700 dark:text-slate-300">
                      {std.email}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(std)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded transition-colors"
                          title="Edit Student"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(std.id, std.name)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded transition-colors"
                          title="Delete Student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-3 border-t border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-slate-700 dark:text-slate-300">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>{editingStudentId ? 'Edit Student Record' : 'Register New Student'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 21BCSE15"
                    value={formRollNo}
                    onChange={e => setFormRollNo(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Enrollment No *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EN202100115"
                    value={formEnrollmentNo}
                    onChange={e => setFormEnrollmentNo(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Student Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Iyer"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="maya.iyer@student.college.edu"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 00000"
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Program -> Sem -> Sec assignment */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Program *
                  </label>
                  <select
                    value={formProgramId}
                    onChange={e => {
                      setFormProgramId(e.target.value);
                      const matchingSems = semesters.filter(s => s.programId === e.target.value);
                      if (matchingSems.length > 0) {
                        setFormSemesterId(matchingSems[0].id);
                        const matchingSecs = sections.filter(sec => sec.semesterId === matchingSems[0].id);
                        if (matchingSecs.length > 0) setFormSectionId(matchingSecs[0].id);
                      }
                    }}
                    className="w-full px-2 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {programs.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Semester *
                  </label>
                  <select
                    value={formSemesterId}
                    onChange={e => {
                      setFormSemesterId(e.target.value);
                      const matchingSecs = sections.filter(sec => sec.semesterId === e.target.value);
                      if (matchingSecs.length > 0) setFormSectionId(matchingSecs[0].id);
                    }}
                    className="w-full px-2 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {semesters
                      .filter(s => !formProgramId || s.programId === formProgramId)
                      .map(s => (
                        <option key={s.id} value={s.id}>Sem {s.semesterNumber}</option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Section *
                  </label>
                  <select
                    value={formSectionId}
                    onChange={e => setFormSectionId(e.target.value)}
                    className="w-full px-2 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {sections
                      .filter(sec => !formSemesterId || sec.semesterId === formSemesterId)
                      .map(sec => (
                        <option key={sec.id} value={sec.id}>Sec {sec.sectionName}</option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  {editingStudentId ? 'Update Record' : 'Save Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
