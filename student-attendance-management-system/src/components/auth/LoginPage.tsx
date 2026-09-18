import React, { useState } from 'react';
import { User, Role } from '../../types';
import { storageService } from '../../services/storageService';
import {
  GraduationCap,
  Shield,
  BookOpen,
  Lock,
  UserCheck,
  ArrowRight,
  AlertCircle,
  KeyRound,
  Sparkles,
  Server,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  isDarkMode?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, isDarkMode }) => {
  const [selectedRole, setSelectedRole] = useState<Role>('ADMIN');
  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('admin123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Quick preset selector
  const handleSelectPreset = (role: Role) => {
    setSelectedRole(role);
    setError(null);
    if (role === 'ADMIN') {
      setUsername('admin');
      setPassword('admin123');
    } else {
      setUsername('faculty');
      setPassword('faculty123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = storageService.login(username, password);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setError(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Background Decorative Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl dark:bg-blue-600/10"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl dark:bg-indigo-600/10"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 mb-4 ring-4 ring-white dark:ring-slate-900">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            SAMS Portal Login
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Student Attendance & Academic Management ERP System
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none p-6 sm:p-8">
          {/* Persona / Role Segment Switcher */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Select Role / Login Persona
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
              <button
                type="button"
                id="login-role-admin-tab"
                onClick={() => handleSelectPreset('ADMIN')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                  selectedRole === 'ADMIN'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Administrator</span>
              </button>
              <button
                type="button"
                id="login-role-faculty-tab"
                onClick={() => handleSelectPreset('FACULTY')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                  selectedRole === 'FACULTY'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Faculty / Teacher</span>
              </button>
            </div>
          </div>

          {/* Role Access Scope Preview Banner */}
          <div className="mb-6 p-3 rounded-xl border border-blue-100 dark:border-blue-900/50 bg-blue-50/60 dark:bg-blue-950/30 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-blue-800 dark:text-blue-300 mb-1">
              <KeyRound className="w-3.5 h-3.5 shrink-0" />
              <span>
                {selectedRole === 'ADMIN' ? 'Admin Permissions Scope:' : 'Faculty Permissions Scope:'}
              </span>
            </div>
            <p className="text-blue-700/90 dark:text-blue-300/80 text-[11px] leading-relaxed">
              {selectedRole === 'ADMIN'
                ? 'Full access: Academic Setup, Student Roster, Excel Data Hub, Attendance, Reports & Spring Boot Docs.'
                : 'Exclusive access: Daily Attendance Marking, Attendance Reports, Defaulter Analytics & Activities.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                id="login-error-alert"
                className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs animate-shake"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="login-username"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Username or Email
              </label>
              <div className="relative">
                <input
                  id="login-username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={selectedRole === 'ADMIN' ? 'admin' : 'faculty'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">
                  @{selectedRole.toLowerCase()}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                >
                  Password
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Demo: <code className="text-blue-600 dark:text-blue-400">{selectedRole === 'ADMIN' ? 'admin123' : 'faculty123'}</code>
                </span>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-500/30 transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Sign In as {selectedRole === 'ADMIN' ? 'Administrator' : 'Faculty'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 flex items-center justify-between">
              <span>Quick Login Credentials</span>
              <span className="text-blue-600 dark:text-blue-400">Click to autofill</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                id="quick-fill-admin"
                onClick={() => handleSelectPreset('ADMIN')}
                className="p-2.5 rounded-xl text-left border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/40 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors group"
              >
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                  <span>Admin</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  admin / <span className="font-mono text-slate-700 dark:text-slate-300">admin123</span>
                </div>
              </button>

              <button
                type="button"
                id="quick-fill-faculty"
                onClick={() => handleSelectPreset('FACULTY')}
                className="p-2.5 rounded-xl text-left border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors group"
              >
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Faculty</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  faculty / <span className="font-mono text-slate-700 dark:text-slate-300">faculty123</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Server className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Full-Stack REST Backend & Spring Boot 3 Security Active</span>
        </div>
      </div>
    </div>
  );
};
