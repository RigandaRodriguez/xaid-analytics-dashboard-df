
import { useState, useEffect, useMemo } from 'react';
import { Study, PaginationConfig } from '@/types/study';

export const useStudyPagination = (studies: Study[]) => {
  const [paginationConfig, setPaginationConfig] = useState<PaginationConfig>({
    currentPage: 1,
    recordsPerPage: 25,
    viewMode: 'full'
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedRecordsPerPage = localStorage.getItem('studyDashboard.recordsPerPage');
    const savedViewMode = localStorage.getItem('studyDashboard.viewMode');

    if (savedRecordsPerPage) setPaginationConfig(prev => ({ ...prev, recordsPerPage: Number(savedRecordsPerPage) }));
    if (savedViewMode) setPaginationConfig(prev => ({ ...prev, viewMode: savedViewMode as 'compact' | 'full' }));
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('studyDashboard.recordsPerPage', paginationConfig.recordsPerPage.toString());
    localStorage.setItem('studyDashboard.viewMode', paginationConfig.viewMode);
  }, [paginationConfig.recordsPerPage, paginationConfig.viewMode]);

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(studies.length / paginationConfig.recordsPerPage);
    const startIndex = (paginationConfig.currentPage - 1) * paginationConfig.recordsPerPage;
    const endIndex = Math.min(startIndex + paginationConfig.recordsPerPage, studies.length);
    const currentPageStudies = studies.slice(startIndex, endIndex);
    const startRecord = startIndex + 1;
    const endRecord = endIndex;

    return {
      totalPages,
      currentPageStudies,
      startRecord,
      endRecord
    };
  }, [studies, paginationConfig]);

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

  // Reset to first page when studies change
  useEffect(() => {
    setPaginationConfig(prev => ({ ...prev, currentPage: 1 }));
  }, [studies.length]);

  return {
    paginationConfig,
    paginationData,
    handlePageChange,
    handleRecordsPerPageChange,
    handleViewModeChange
  };
};
