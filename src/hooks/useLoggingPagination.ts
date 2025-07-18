
import { useState, useEffect, useMemo } from 'react';
import { LogEntry, LogPaginationConfig } from '@/types/logging';

export const useLoggingPagination = (logs: LogEntry[]) => {
  const [paginationConfig, setPaginationConfig] = useState<LogPaginationConfig>({
    currentPage: 1,
    recordsPerPage: 25,
    viewMode: 'full'
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedRecordsPerPage = localStorage.getItem('loggingDashboard.recordsPerPage');
    const savedViewMode = localStorage.getItem('loggingDashboard.viewMode');

    if (savedRecordsPerPage) setPaginationConfig(prev => ({ ...prev, recordsPerPage: Number(savedRecordsPerPage) }));
    if (savedViewMode) setPaginationConfig(prev => ({ ...prev, viewMode: savedViewMode as 'compact' | 'full' }));
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('loggingDashboard.recordsPerPage', paginationConfig.recordsPerPage.toString());
    localStorage.setItem('loggingDashboard.viewMode', paginationConfig.viewMode);
  }, [paginationConfig.recordsPerPage, paginationConfig.viewMode]);

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(logs.length / paginationConfig.recordsPerPage);
    const startIndex = (paginationConfig.currentPage - 1) * paginationConfig.recordsPerPage;
    const endIndex = Math.min(startIndex + paginationConfig.recordsPerPage, logs.length);
    const currentPageLogs = logs.slice(startIndex, endIndex);
    const startRecord = startIndex + 1;
    const endRecord = endIndex;

    return {
      totalPages,
      currentPageLogs,
      startRecord,
      endRecord
    };
  }, [logs, paginationConfig]);

  const handlePageChange = (page: number) => {
    setPaginationConfig(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRecordsPerPageChange = (value: number) => {
    setPaginationConfig(prev => ({ ...prev, recordsPerPage: value, currentPage: 1 }));
  };

  const handleViewModeChange = (mode: 'compact' | 'full') => {
    setPaginationConfig(prev => ({ ...prev, viewMode: mode }));
  };

  // Reset to first page when logs change
  useEffect(() => {
    setPaginationConfig(prev => ({ ...prev, currentPage: 1 }));
  }, [logs.length]);

  return {
    paginationConfig,
    paginationData,
    handlePageChange,
    handleRecordsPerPageChange,
    handleViewModeChange
  };
};
