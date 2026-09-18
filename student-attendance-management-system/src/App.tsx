import React, { useState, useEffect } from 'react';
import { UserRole, User } from './types';
import { ToastProvider, useToast } from './components/common/Toast';
import { Navbar } from './components/common/Navbar';
import { Sidebar, NavTab } from './components/common/Sidebar';
import { LoginPage } from './components/auth/LoginPage';
import { AttendanceMarking } from './components/attendance/AttendanceMarking';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { ReportsModule } from './components/reports/ReportsModule';
import { ExcelImportExport } from './components/admin/ExcelImportExport';
import { AcademicManager } from './components/admin/AcademicManager';
import { StudentManager } from './components/admin/StudentManager';
import { FacultyManager } from './components/admin/FacultyManager';
import { ActivityManager } from './components/admin/ActivityManager';
import { SpringBootDocs } from './components/backend-docs/SpringBootDocs';
import { storageService } from './services/storageService';

const AppContent: React.FC = () => {
  const { showToast } = useToast();

  // Active authenticated user
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return storageService.getCurrentUser();
  });

  const currentRole: UserRole = currentUser?.role || 'ADMIN';

  // Key to force reload components on demo data reset
  const [resetKey, setResetKey] = useState<number>(0);

  // Active navigation view
  const [activeView, setActiveView] = useState<NavTab>('attendance');

  // Dark mode toggle
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('sams_theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sams_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sams_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    // Set appropriate landing page
    if (user.role === 'ADMIN') {
      setActiveView('dashboard');
    } else {
      setActiveView('attendance');
    }
    showToast(`Welcome back, ${user.name} (${user.role})`, 'success');
  };

  const handleRoleChange = (newRole: UserRole) => {
    const updatedUser = storageService.switchRole(newRole);
    setCurrentUser(updatedUser);
    showToast(`Switched active persona to ${newRole}`, 'info');

    // If switching to Faculty while on Admin-only tab, revert to attendance view
    if (newRole === 'FACULTY' && ['dashboard', 'excel', 'academics', 'students'].includes(activeView)) {
      setActiveView('attendance');
    }
  };

  const handleResetData = () => {
    storageService.resetToDefaults();
    const updatedUser = storageService.switchRole(currentRole);
    setCurrentUser(updatedUser);
    setResetKey(prev => prev + 1);
  };

  const handleLogout = () => {
    storageService.logout();
    setCurrentUser(null);
    showToast('Logged out successfully', 'info');
  };

  // If not logged in, render the dedicated ERP Login Page
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} isDarkMode={isDarkMode} />;
  }

  const renderCurrentView = () => {
    switch (activeView) {
      case 'attendance':
        return <AttendanceMarking currentRole={currentRole} />;
      case 'dashboard':
        return currentRole === 'ADMIN' ? (
          <AdminDashboard onNavigateTab={setActiveView} />
        ) : (
          <AttendanceMarking currentRole={currentRole} />
        );
      case 'reports':
        return <ReportsModule />;
      case 'excel':
        return currentRole === 'ADMIN' ? (
          <ExcelImportExport />
        ) : (
          <ReportsModule />
        );
      case 'academics':
        return currentRole === 'ADMIN' ? (
          <AcademicManager />
        ) : (
          <AttendanceMarking currentRole={currentRole} />
        );
      case 'students':
        return currentRole === 'ADMIN' ? (
          <StudentManager />
        ) : (
          <AttendanceMarking currentRole={currentRole} />
        );
      case 'faculty':
        return currentRole === 'ADMIN' ? (
          <FacultyManager />
        ) : (
          <AttendanceMarking currentRole={currentRole} />
        );
      case 'activities':
        return <ActivityManager />;
      case 'backend':
        return <SpringBootDocs />;
      default:
        return <AttendanceMarking currentRole={currentRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        currentRole={currentRole}
        onSwitchRole={handleRoleChange}
        onRoleChange={handleRoleChange}
        isDark={isDarkMode}
        isDarkMode={isDarkMode}
        onToggleDark={toggleDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onResetData={handleResetData}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Fixed Collapsible Sidebar - filters navigation items to current role only */}
        <Sidebar
          userRole={currentRole}
          currentRole={currentRole}
          activeTab={activeView}
          onSelectTab={(tab) => setActiveView(tab)}
        />

        {/* Main Content Viewport */}
        <main key={resetKey} className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
