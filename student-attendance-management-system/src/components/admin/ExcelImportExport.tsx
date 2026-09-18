import React, { useState, useRef } from 'react';
import { ExcelService } from '../../services/excelService';
import { storageService } from '../../services/storageService';
import { ExcelImportResult } from '../../types';
import { useToast } from '../common/Toast';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const ExcelImportExport: React.FC = () => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [importResult, setImportResult] = useState<ExcelImportResult | null>(null);

  // Drag handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (!file.name.endsWith('.xlsx')) {
      showToast('Invalid file format. Please upload a valid .xlsx Excel workbook.', 'error');
      return;
    }
    setSelectedFile(file);
    setImportResult(null);
    setProgress(0);
    showToast(`Selected file: ${file.name}`, 'info');
  };

  // Perform upload, parsing, and data validation
  const handleUploadAndProcess = async () => {
    if (!selectedFile) {
      showToast('Please select an Excel file to upload', 'warning');
      return;
    }

    setIsProcessing(true);
    setProgress(15);

    try {
      // Simulate progress stages for smooth UX
      const progressTimer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 85) {
            clearInterval(progressTimer);
            return prev;
          }
          return prev + 20;
        });
      }, 150);

      const result = await ExcelService.parseAndImportExcel(selectedFile);
      clearInterval(progressTimer);
      setProgress(100);

      setImportResult(result);
      setIsProcessing(false);

      if (result.success) {
        showToast(
          `Import complete! ${result.studentsImported} new students, ${result.studentsUpdated} updated, ${result.attendanceRecordsImported} attendance records.`,
          'success'
        );
      } else {
        showToast('Import encountered errors. Check the error report below.', 'error');
      }
    } catch (err: any) {
      setIsProcessing(false);
      setProgress(0);
      showToast(err?.message || 'Error processing Excel file', 'error');
    }
  };

  // Download Sample Template
  const handleDownloadTemplate = () => {
    ExcelService.downloadImportTemplate();
    showToast('Downloaded sample Excel import template', 'success');
  };

  // Export full attendance report
  const handleExportFullReport = () => {
    const calcs = storageService.getCalculations({});
    ExcelService.exportAttendanceReport(calcs, 'Complete_Institutional_Attendance_Report.xlsx');
    showToast('Exported complete institutional attendance report', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <UploadCloud className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Excel Data Hub (Apache POI Sync)
          </h1>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
            Import student rosters and historical attendance logs from .xlsx files. Validate schema and preserve existing records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Download .xlsx Template</span>
          </button>
          <button
            onClick={handleExportFullReport}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-500/20 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Master Report</span>
          </button>
        </div>
      </div>

      {/* Requirement 9: Drag & Drop Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
          dragActive
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
            : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 bg-white dark:bg-slate-900'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div>
            <p className="text-base font-semibold text-slate-900 dark:text-white">
              {selectedFile ? selectedFile.name : 'Click to upload or drag & drop attendance workbook'}
            </p>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
              Supports Microsoft Excel (.xlsx) formats. Maximum file size: 25MB.
            </p>
          </div>

          {selectedFile && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200">
              <FileCheck className="w-4 h-4 text-emerald-500" />
              <span>{(selectedFile.size / 1024).toFixed(1)} KB ready for ingestion</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar & Actions */}
      {selectedFile && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedFile.name}
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  Ready to validate columns: Roll No, Enrollment, Name, Program, Semester, Section, Status
                </p>
              </div>
            </div>

            <button
              onClick={handleUploadAndProcess}
              disabled={isProcessing}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white shadow-sm shadow-blue-500/25 transition-all"
            >
              {isProcessing ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Parsing POI Rows...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Start Import & Validation</span>
                </>
              )}
            </button>
          </div>

          {/* Progress Bar */}
          {progress > 0 && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>{progress === 100 ? 'Verification Complete' : 'Processing workbook...'}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Import Result Summary & Error Report */}
      {importResult && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Import Execution Report</span>
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              {importResult.totalRows} Rows Evaluated
            </span>
          </div>

          {/* KPI Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-xs text-slate-700 dark:text-slate-300">Total Rows</span>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{importResult.totalRows}</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30">
              <span className="text-xs text-emerald-800 dark:text-emerald-400">New Students Inserted</span>
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">+{importResult.studentsImported}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/30">
              <span className="text-xs text-blue-800 dark:text-blue-400">Students Updated</span>
              <p className="text-lg font-bold text-blue-700 dark:text-blue-400">{importResult.studentsUpdated}</p>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30">
              <span className="text-xs text-indigo-800 dark:text-indigo-400">Attendance Records</span>
              <p className="text-lg font-bold text-indigo-700 dark:text-indigo-400">{importResult.attendanceRecordsImported}</p>
            </div>
          </div>

          {/* Error Report List if any errors encountered */}
          {importResult.errors.length > 0 ? (
            <div className="mt-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-2">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Row-Level Validation Issues ({importResult.errors.length})</span>
              </div>
              <ul className="space-y-1 text-xs text-rose-800 dark:text-rose-300 divide-y divide-rose-100 dark:divide-rose-900/40">
                {importResult.errors.map((err, idx) => (
                  <li key={idx} className="pt-1.5 flex items-center justify-between">
                    <span>
                      <strong>Row {err.row}:</strong> {err.error}
                    </span>
                    {err.details && <span className="text-rose-700 dark:text-rose-300 italic">{err.details}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>All records were validated and synchronized without structural discrepancies.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
