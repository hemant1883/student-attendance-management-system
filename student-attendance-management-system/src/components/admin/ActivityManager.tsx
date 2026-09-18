import React, { useState, useEffect } from 'react';
import { Activity, Student, ActivityParticipation } from '../../types';
import { storageService } from '../../services/storageService';
import { useToast } from '../common/Toast';
import {
  Trophy,
  Plus,
  Trash2,
  Calendar,
  Users,
  Award,
  Tag,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const ActivityManager: React.FC = () => {
  const { showToast } = useToast();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [participations, setParticipations] = useState<ActivityParticipation[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  // Create Activity form
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<'Hackathon' | 'Sports' | 'NSS' | 'Cultural' | 'Workshop' | 'Seminar'>('Hackathon');
  const [description, setDescription] = useState('');

  // Assign participation state
  const [selectedActivityId, setSelectedActivityId] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [roleOrAward, setRoleOrAward] = useState('');

  const refresh = () => {
    setActivities(storageService.getActivities());
    setParticipations(storageService.getActivityParticipations());
    setStudents(storageService.getStudents());
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date) {
      showToast('Please enter event name and date', 'warning');
      return;
    }
    storageService.addActivity({
      name: name.trim(),
      date,
      category,
      description: description.trim() || 'Approved institutional academic event.'
    });
    showToast(`Created activity: ${name}`, 'success');
    setName('');
    setDescription('');
    refresh();
  };

  const handleDeleteActivity = (id: string, actName: string) => {
    if (window.confirm(`Delete event "${actName}" and student participations?`)) {
      storageService.deleteActivity(id);
      showToast(`Deleted ${actName}`, 'info');
      refresh();
    }
  };

  const handleAssignParticipation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivityId || !selectedStudentId) {
      showToast('Please select both an event and a student', 'warning');
      return;
    }

    const std = students.find(s => s.id === selectedStudentId);
    storageService.addActivityParticipation(
      selectedStudentId,
      selectedActivityId,
      roleOrAward.trim() || 'Participant'
    );

    showToast(`Linked participation for ${std?.name}`, 'success');
    setSelectedStudentId('');
    setRoleOrAward('');
    refresh();
  };

  const handleRemoveParticipation = (partId: string) => {
    storageService.removeActivityParticipation(partId);
    showToast('Removed student participation record', 'info');
    refresh();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Event & Co-Curricular Engagement Hub
        </h1>
        <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
          Record student participation in approved Hackathons, Sports, NSS drives, Cultural fests, and Technical Workshops.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Create Activity Form */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Create Institutional Event</span>
            </h3>

            <form onSubmit={handleCreateActivity} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Event Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Smart India Hackathon 2026"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Sports">Sports</option>
                    <option value="NSS">NSS</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Event details or eligibility criteria..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
              >
                Register Event
              </button>
            </form>
          </div>

          {/* Quick Assign Participation Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Link Student to Activity</span>
            </h3>

            <form onSubmit={handleAssignParticipation} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Choose Event
                </label>
                <select
                  value={selectedActivityId}
                  onChange={e => setSelectedActivityId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">-- Choose Activity --</option>
                  {activities.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Choose Student
                </label>
                <select
                  value={selectedStudentId}
                  onChange={e => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">-- Select Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.rollNo} - {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Role / Award / Achievement
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1st Prize Winner, Team Captain"
                  value={roleOrAward}
                  onChange={e => setRoleOrAward(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                Assign Engagement
              </button>
            </form>
          </div>
        </div>

        {/* Right 2 Columns: Activities List & Recorded Participations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Events Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-indigo-500" />
                <span>Approved Institutional Activities ({activities.length})</span>
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 font-bold uppercase text-slate-700 dark:text-slate-300">
                    <th className="py-2.5 px-3">Event Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Participants</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activities.map(act => {
                    const count = participations.filter(p => p.activityId === act.id).length;
                    return (
                      <tr key={act.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                          <div>{act.name}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
                            {act.description}
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                            {act.category || 'General'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-mono">
                          {act.date}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-blue-600 dark:text-blue-400">
                          {count} Students
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => handleDeleteActivity(act.id, act.name)}
                            className="text-slate-500 hover:text-rose-600 p-1"
                            title="Delete Activity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Student Engagement Records Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500" />
                <span>Recorded Student Engagements ({participations.length})</span>
              </h3>
              <span className="text-xs text-slate-700 dark:text-slate-300">Automatically linked to Attendance roster</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 font-bold uppercase text-slate-700 dark:text-slate-300">
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Roll No</th>
                    <th className="py-2.5 px-3">Event</th>
                    <th className="py-2.5 px-3">Role / Recognition</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {participations.map(p => {
                    const std = students.find(s => s.id === p.studentId);
                    const act = activities.find(a => a.id === p.activityId);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                          {std?.name || 'Unknown Student'}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                          {std?.rollNo || 'N/A'}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-indigo-600 dark:text-indigo-400">
                          {act?.name || 'Unknown Event'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                          <span className="inline-flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            {p.roleOrAward || 'Participant'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => handleRemoveParticipation(p.id)}
                            className="text-slate-500 hover:text-rose-600 p-1"
                            title="Remove Engagement"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
