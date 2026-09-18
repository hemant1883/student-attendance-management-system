import React from 'react';
import { Role } from '../../types';
import {
  LayoutDashboard,
  ClipboardCheck,
  FileSpreadsheet,
  GraduationCap,
  Users,
  UserCheck,
  Trophy,
  UploadCloud,
  Code2,
  Lock,
  ChevronRight,
  Database
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'attendance'
  | 'reports'
  | 'academics'
  | 'students'
  | 'faculty'
  | 'activities'
  | 'excel'
  | 'backend';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  userRole?: Role;
  currentRole?: Role;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab, userRole, currentRole }) => {
  const role: Role = userRole || currentRole || 'ADMIN';
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Admin Dashboard',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'FACULTY'] as Role[],
      badge: 'Live',
    },
    {
      id: 'attendance' as NavTab,
      label: 'Attendance Entry',
      icon: ClipboardCheck,
      roles: ['ADMIN', 'FACULTY'] as Role[],
      description: 'Mark P / A / L / M & Activities',
    },
    {
      id: 'reports' as NavTab,
      label: 'Attendance Reports',
      icon: FileSpreadsheet,
      roles: ['ADMIN', 'FACULTY'] as Role[],
      description: 'Analytics & Defaulters List',
    },
    {
      id: 'academics' as NavTab,
      label: 'Academic Setup',
      icon: GraduationCap,
      roles: ['ADMIN'] as Role[],
      description: 'Programs, Semesters, Courses',
    },
    {
      id: 'students' as NavTab,
      label: 'Students Master',
      icon: Users,
      roles: ['ADMIN'] as Role[],
      description: 'Enrolled student roster',
    },
    {
      id: 'faculty' as NavTab,
      label: 'Faculty Administration',
      icon: UserCheck,
      roles: ['ADMIN'] as Role[],
      description: 'Faculty directory, records & timetables',
      badge: 'Admin',
    },
    {
      id: 'activities' as NavTab,
      label: 'Events & Activities',
      icon: Trophy,
      roles: ['ADMIN', 'FACULTY'] as Role[],
      description: 'Hackathons, NSS, Sports',
    },
    {
      id: 'excel' as NavTab,
      label: 'Excel Data Hub',
      icon: UploadCloud,
      roles: ['ADMIN'] as Role[],
      description: 'Apache POI Import & Export',
    },
    {
      id: 'backend' as NavTab,
      label: 'Spring Boot 3 & DB',
      icon: Database,
      roles: ['ADMIN', 'FACULTY'] as Role[],
      badge: 'Full Source',
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            <span>ERP Navigation</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {role}
            </span>
          </div>
          <nav className="space-y-1">
            {navItems
              .filter((item) => item.roles.includes(role))
              .map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    id={`sidebar-nav-${item.id}`}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {item.badge && (
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
          </nav>
        </div>

        {/* System Architecture summary pill */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-100 to-white dark:from-slate-800/80 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700/60">
          <div className="flex items-center gap-2 mb-1.5">
            <Code2 className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">Architecture Stack</span>
          </div>
          <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
            Spring Boot 3 + Spring Data JPA + MySQL 8 + Apache POI + Spring Security JWT + Vite React.
          </p>
        </div>
      </div>

      {/* Role permission info card */}
      <div id="sidebar-role-card" className="mt-4 p-3 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-700 dark:text-slate-300">Active Permissions:</span>
          <span className="font-semibold text-slate-900 dark:text-white">{role}</span>
        </div>
        <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-1">
          {role === 'ADMIN'
            ? 'Full CRUD on programs, courses, students, attendance, & Excel sync.'
            : 'Access to mark course attendance, view reports, & record events.'}
        </p>
      </div>
    </aside>
  );
};
