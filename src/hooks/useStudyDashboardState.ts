
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Study, StudyFilters } from '@/types/study';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateMockStudies } from '@/utils/studyMockData';
import { useStudyFilters } from '@/hooks/useStudyFilters';
import { useStudySort } from '@/hooks/useStudySort';
import { useStudyPagination } from '@/hooks/useStudyPagination';

export const useStudyDashboardState = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [selectedStudies, setSelectedStudies] = useState<string[]>([]);
  const [studies, setStudies] = useState(generateMockStudies());
  const [appliedFilters, setAppliedFilters] = useState<StudyFilters | null>(null);
  const [appliedFilteredStudies, setAppliedFilteredStudies] = useState<Study[]>([]);

  const { filters, setFilters, filteredStudies, hasFiltersChanged, handleResetFilters } = useStudyFilters(studies);
  const { sortConfig, sortedStudies, handleSortChange } = useStudySort(filteredStudies);
  const { paginationConfig, paginationData, handlePageChange, handleRecordsPerPageChange, handleViewModeChange } = useStudyPagination(sortedStudies);

  // Regenerate mock studies when language changes
  useEffect(() => {
    setStudies(generateMockStudies());
  }, [language]);

  // Load sort settings from localStorage
  useEffect(() => {
    const savedSortBy = localStorage.getItem('studyDashboard.sortBy');
    const savedSortDirection = localStorage.getItem('studyDashboard.sortDirection');

    if (savedSortBy && savedSortDirection) {
      handleSortChange(savedSortBy, savedSortDirection as 'asc' | 'desc');
    }
  }, []);

  // Save sort settings to localStorage
  useEffect(() => {
    localStorage.setItem('studyDashboard.sortBy', sortConfig.sortBy);
    localStorage.setItem('studyDashboard.sortDirection', sortConfig.sortDirection);
  }, [sortConfig]);

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setAppliedFilteredStudies(filteredStudies);
  };

  const handleResetFiltersWithApplied = () => {
    handleResetFilters();
    setAppliedFilters(null);
    setAppliedFilteredStudies([]);
  };

  const handleSelectStudy = (uid: string, checked: boolean) => {
    if (checked) {
      setSelectedStudies([...selectedStudies, uid]);
    } else {
      setSelectedStudies(selectedStudies.filter(id => id !== uid));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudies(paginationData.currentPageStudies.map(study => study.uid));
    } else {
      setSelectedStudies([]);
    }
  };

  const handleViewReport = (study: Study) => {
    navigate(`/study/${study.uid}`, { state: { study } });
  };

  return {
    navigate,
    selectedStudies,
    setSelectedStudies,
    studies,
    setStudies,
    appliedFilters,
    appliedFilteredStudies,
    filters,
    setFilters,
    filteredStudies,
    hasFiltersChanged,
    sortConfig,
    sortedStudies,
    paginationConfig,
    paginationData,
    handleApplyFilters,
    handleResetFiltersWithApplied,
    handleSelectStudy,
    handleSelectAll,
    handleViewReport,
    handleSortChange,
    handlePageChange,
    handleRecordsPerPageChange,
    handleViewModeChange
  };
};
