
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Study, StudyFilters, ApiStudyFilters } from '@/types/study';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProcessings } from '@/hooks/api/useProcessings';
import { ProcessingStatus } from '@/types/api';
import { useStudySort } from '@/hooks/useStudySort';
import { useStudyPagination } from '@/hooks/useStudyPagination';

export const useStudyDashboardStateApi = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [selectedStudies, setSelectedStudies] = useState<string[]>([]);
  
  // Local filter state
  const [filters, setFilters] = useState<StudyFilters>({
    uidOrPatientId: '',
    patientName: '',
    date: null,
    status: '',
    pathology: '',
    descriptionStatus: '',
    timeFrom: '',
    timeTo: '',
  });

  const [appliedFilters, setAppliedFilters] = useState<StudyFilters | null>(null);
  const [paginationConfig, setPaginationConfig] = useState({
    currentPage: 1,
    recordsPerPage: 25,
    viewMode: 'compact' as 'compact' | 'full',
  });

  // Convert UI filters to API format
  const apiFilters = useMemo((): ApiStudyFilters => {
    const currentFilters = appliedFilters || filters;
    
    const apiParams: ApiStudyFilters = {
      page: paginationConfig.currentPage,
      per_page: paginationConfig.recordsPerPage,
    };

    if (currentFilters.uidOrPatientId) {
      apiParams.search_query = currentFilters.uidOrPatientId;
    }
    
    if (currentFilters.patientName) {
      apiParams.patient_name = currentFilters.patientName;
    }

    if (currentFilters.date) {
      const date = currentFilters.date;
      let dateFrom = new Date(date);
      let dateTo = new Date(date);
      
      // Add time constraints if specified
      if (currentFilters.timeFrom) {
        const [hours, minutes] = currentFilters.timeFrom.split(':');
        dateFrom.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      } else {
        dateFrom.setHours(0, 0, 0, 0);
      }
      
      if (currentFilters.timeTo) {
        const [hours, minutes] = currentFilters.timeTo.split(':');
        dateTo.setHours(parseInt(hours), parseInt(minutes), 59, 999);
      } else {
        dateTo.setHours(23, 59, 59, 999);
      }
      
      apiParams.study_created_at__gte = dateFrom.toISOString();
      apiParams.study_created_at__lte = dateTo.toISOString();
    }

    if (currentFilters.status && currentFilters.status !== '') {
      // Map UI status values to API ProcessingStatus
      const statusMapping: Record<string, ProcessingStatus> = {
        'completed': 'success',
        'processing': 'processing',
        'processing_error': 'processing_error',
        'data_error': 'processing_error'
      };
      apiParams.status = statusMapping[currentFilters.status] || currentFilters.status as ProcessingStatus;
    }

    if (currentFilters.pathologyKeys && currentFilters.pathologyKeys.length > 0) {
      apiParams.pathology_keys = currentFilters.pathologyKeys;
    }

    return apiParams;
  }, [appliedFilters, filters, paginationConfig]);

  // Fetch data using API
  const {
    data: apiResponse,
    isLoading,
    error,
    refetch,
  } = useProcessings(apiFilters);

  const studies = apiResponse?.studies || [];
  const totalPages = apiResponse?.pagination?.totalPages || 1;

  // Sort and pagination (API handles pagination, but we might want client-side sorting for UX)
  const { sortConfig, sortedStudies, handleSortChange } = useStudySort(studies);
  const { 
    paginationData: localPaginationData, 
    handlePageChange: handleLocalPageChange,
    handleRecordsPerPageChange,
    handleViewModeChange 
  } = useStudyPagination(sortedStudies);

  // API pagination handler
  const handlePageChange = (page: number) => {
    setPaginationConfig(prev => ({ ...prev, currentPage: page }));
    setSelectedStudies([]); // Clear selections when changing pages
  };

  // Records per page handler
  const handleRecordsPerPageChangeApi = (recordsPerPage: number) => {
    setPaginationConfig(prev => ({ 
      ...prev, 
      recordsPerPage, 
      currentPage: 1 
    }));
    setSelectedStudies([]);
  };

  // View mode handler
  const handleViewModeChangeApi = (viewMode: 'compact' | 'full') => {
    setPaginationConfig(prev => ({ ...prev, viewMode }));
  };

  const hasFiltersChanged = useMemo(() => {
    if (!appliedFilters) return false;
    return JSON.stringify(filters) !== JSON.stringify(appliedFilters);
  }, [filters, appliedFilters]);

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    setPaginationConfig(prev => ({ ...prev, currentPage: 1 }));
    setSelectedStudies([]);
  };

  const handleResetFilters = () => {
    const resetFilters: StudyFilters = {
      uidOrPatientId: '',
      patientName: '',
      date: null,
      status: '',
      pathology: '',
      descriptionStatus: '',
      timeFrom: '',
      timeTo: '',
    };
    setFilters(resetFilters);
    setAppliedFilters(null);
    setPaginationConfig(prev => ({ ...prev, currentPage: 1 }));
    setSelectedStudies([]);
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
      setSelectedStudies(studies.map(study => study.uid));
    } else {
      setSelectedStudies([]);
    }
  };

  const handleViewReport = (study: Study) => {
    navigate(`/study/${study.uid}`, { state: { study } });
  };

  // Use API pagination data instead of local
  const paginationData = {
    currentPageStudies: studies,
    totalPages,
    startRecord: (paginationConfig.currentPage - 1) * paginationConfig.recordsPerPage + 1,
    endRecord: Math.min(
      paginationConfig.currentPage * paginationConfig.recordsPerPage,
      apiResponse?.pagination?.total || 0
    ),
  };

  return {
    navigate,
    selectedStudies,
    setSelectedStudies,
    studies,
    appliedFilters,
    appliedFilteredStudies: studies, // Same as studies since API handles filtering
    filters,
    setFilters,
    filteredStudies: studies,
    hasFiltersChanged,
    sortConfig,
    sortedStudies,
    paginationConfig,
    paginationData,
    isLoading,
    error,
    refetch,
    handleApplyFilters,
    handleResetFiltersWithApplied: handleResetFilters,
    handleSelectStudy,
    handleSelectAll,
    handleViewReport,
    handleSortChange,
    handlePageChange,
    handleRecordsPerPageChange: handleRecordsPerPageChangeApi,
    handleViewModeChange: handleViewModeChangeApi,
  };
};
