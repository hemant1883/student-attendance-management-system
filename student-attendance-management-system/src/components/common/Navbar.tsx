import React from 'react';
import { User, Role } from '../../types';
import {
  GraduationCap,
  Shield,
  BookOpen,
  Sun,
  Moon,
  RotateCcw,
  LogOut,
  UserCheck,
  Calendar,
  Server
} from 'lucide-react';
import { useToast } from './Toast';

interface NavbarProps {
  currentUser?: User | null;
  currentRole?: Role;
  onSwitchRole?: (role: Role) => void;
  onRoleChange?: (role: Role) => void;
  onLogout?: () => void;
  onResetData?: () => void;
  isDark?: boolean;
  isDarkMode?: boolean;
  onToggleDark?: () => void;
  onToggleDarkMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentRole,
  onSwitchRole,
  onRoleChange,
  onLogout,
  onResetData,
  isDark,
  isDarkMode,
  onToggleDark,
  onToggleDarkMode,
}) => {
  const { showToast } = useToast();

  const activeRole: Role = currentUser?.role || currentRole || 'ADMIN';
  const isDarkActive: boolean = isDark ?? isDarkMode ?? false;

  const displayUser: User = currentUser || {
    id: `user-${activeRole.toLowerCase()}`,
    username: activeRole.toLowerCase(),
    name: activeRole === 'ADMIN' ? 'Dr. Rajesh Sharma' : 'Prof. Ananya Verma',
    email: `${activeRole.toLowerCase()}@college.edu`,
    role: activeRole,
    department: activeRole === 'ADMIN' ? 'Dean Office / Academic Head' : 'Computer Science & Engineering',
  };

  const handleRoleToggle = (newRole: Role) => {
    if (typeof onSwitchRole === 'function') {
      onSwitchRole(newRole);
    } else if (typeof onRoleChange === 'function') {
      onRoleChange(newRole);
    }
    showToast(`Switched active role to ${newRole} mode`, 'info');
  };

  const handleThemeToggle = () => {
    if (typeof onToggleDark === 'function') {
      onToggleDark();
    } else if (typeof onToggleDarkMode === 'function') {
      onToggleDarkMode();
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all academic, student, and attendance data back to default sample state?')) {
      if (typeof onResetData === 'function') {
        onResetData();
      }
      showToast('Database reset to default ERP state', 'success');
    }
  };

  const handleLogoutClick = () => {
    if (typeof onLogout === 'function') {
      onLogout();
    }
    showToast('Logged out from current session', 'info');
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 transition-colors">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Academic Info */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                SAMS ERP
              </span>
              <span className="hidden sm:inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                Spring Boot 3 + MySQL Ready
              </span>
              <span id="backend-live-badge" className="hidden xl:inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60" title="Full-stack Express/Node.js REST API backend is active on /api">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <Server className="w-3 h-3" />
                REST API Live
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 hidden sm:block">
              Student Attendance & Academic Management System
            </p>
          </div>
        </div>

        {/* Academic Session Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700">
          <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Academic Year 2026–2027</span>
          <span className="text-slate-500 dark:text-slate-400">•</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Odd Semester (Active)</span>
        </div>

        {/* Right Section: Role Switcher, Controls & User */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Role Toggle Bar */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              id="navbar-role-admin-btn"
              onClick={() => handleRoleToggle('ADMIN')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                activeRole === 'ADMIN'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
              title="Switch to Admin privileges (Full Access)"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
            <button
              id="navbar-role-faculty-btn"
              onClick={() => handleRoleToggle('FACULTY')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                activeRole === 'FACULTY'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
              title="Switch to Faculty mode (Marking & Reports)"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Faculty</span>
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            id="navbar-theme-toggle-btn"
            onClick={handleThemeToggle}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
            title={isDarkActive ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkActive ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Reset Demo Data Button */}
          <button
            id="navbar-reset-data-btn"
            onClick={handleReset}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            title="Reset database to initial ERP demo state"
            aria-label="Reset demo data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* User Profile Mini Badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-inner">
              {displayUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="hidden md:block text-left leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  {displayUser.name}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  activeRole === 'ADMIN'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                }`}>
                  {activeRole}
                </span>
              </div>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 truncate max-w-[150px] block">
                {displayUser.department || displayUser.email}
              </span>
            </div>
            <button
              id="navbar-logout-btn"
              onClick={handleLogoutClick}
              className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/40 transition-colors"
              title="Log out"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
