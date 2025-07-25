
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Study, StudyFilters, ApiStudyFilters } from '@/types/study';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProcessings } from '@/hooks/api/useProcessings';
import { ProcessingStatus } from '@/types/api';
import { useStudySort } from '@/hooks/useStudySort';
import { useStudyPagination } from '@/hooks/useStudyPagination';
import { getAllPathologyOptions } from '@/utils/pathologyHelpers';

export const useStudyDashboardStateApi = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [selectedStudies, setSelectedStudies] = useState<string[]>([]);
  
  // Local filter state
  const [filters, setFilters] = useState<StudyFilters>({
    uidOrPatientId: '',
    patientName: '',
    date: null,
    status: 'all',
    pathology: 'all',
    descriptionStatus: 'all',
    timeFrom: '',
    timeTo: '',
  });

  const [appliedFilters, setAppliedFilters] = useState<StudyFilters | null>(null);
  const [paginationConfig, setPaginationConfig] = useState({
    currentPage: 1,
    recordsPerPage: 25,
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

    if (currentFilters.status && currentFilters.status !== '' && currentFilters.status !== 'all') {
      // Map UI status values to API ProcessingStatus  
      const statusMapping: Record<string, ProcessingStatus> = {
        'completed': 'success',
        'processing': 'processing',
        'processing_error': 'processing_error',
        'precondition_error': 'precondition_error',
        'configuration_error': 'configuration_error',
        'generation_error': 'generation_error',
        'upload_error': 'upload_error'
      };
      apiParams.status = statusMapping[currentFilters.status] || currentFilters.status as ProcessingStatus;
    }

    // Handle pathology filtering - только если выбрана конкретная патология
    if (currentFilters.pathology && currentFilters.pathology !== '' && currentFilters.pathology !== 'all') {
      // Найти ключ патологии по displayName из централизованного реестра
      const allPathologies = getAllPathologyOptions();
      const pathologyOption = allPathologies.find(p => p.displayName === currentFilters.pathology);
      
      if (pathologyOption) {
        apiParams.pathology_keys = [pathologyOption.key];
      } else {
        // Fallback для прямых ключей
        const directKeyMapping: Record<string, string> = {
          'normal': 'normal',
          'coronaryCalcium': 'coronaryCalcium',
          'aorticDilation': 'aorticDilation',
          'osteoporosis': 'osteoporosis',
          'lungNodules': 'lungNodules',
          '1': '1',
          '2': '2'
        };
        const pathologyKey = directKeyMapping[currentFilters.pathology] || currentFilters.pathology;
        apiParams.pathology_keys = [pathologyKey];
      }
    }
    
    if (currentFilters.pathologyKeys && currentFilters.pathologyKeys.length > 0) {
      apiParams.pathology_keys = currentFilters.pathologyKeys;
    }

    return apiParams;
  }, [appliedFilters, filters, paginationConfig]);

  // Fetch data using API only when filters are applied
  const {
    data: apiResponse,
    isLoading,
    error,
    refetch,
  } = useProcessings({ ...apiFilters, enabled: !!appliedFilters });

  // Apply client-side description status filtering since API doesn't support it
  const allStudies = apiResponse?.studies || [];
  const studies = useMemo(() => {
    const currentFilters = appliedFilters || filters;
    if (!currentFilters.descriptionStatus || currentFilters.descriptionStatus === '' || currentFilters.descriptionStatus === 'all') {
      return allStudies;
    }
    return allStudies.filter(study => study.descriptionStatus === currentFilters.descriptionStatus);
  }, [allStudies, appliedFilters, filters]);
  
  const totalPages = apiResponse?.pagination?.totalPages || 1;

  // Sort and pagination (API handles pagination, but we might want client-side sorting for UX)
  const { sortConfig, sortedStudies, handleSortChange } = useStudySort(studies);

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


  const hasFiltersChanged = useMemo(() => {
    const defaultFilters = {
      uidOrPatientId: '',
      patientName: '',
      date: null,
      status: 'all',
      pathology: 'all',
      descriptionStatus: 'all',
      timeFrom: '',
      timeTo: '',
    };
    
    // If no filters applied yet, check if current filters are not default
    if (!appliedFilters) {
      return JSON.stringify(filters) !== JSON.stringify(defaultFilters);
    }
    
    // Check if current filters differ from applied filters
    return JSON.stringify(filters) !== JSON.stringify(appliedFilters);
  }, [filters, appliedFilters]);

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    setPaginationConfig(prev => ({ ...prev, currentPage: 1 }));
    setSelectedStudies([]);
  };

  // Initial load effect
  useEffect(() => {
    if (!appliedFilters) {
      // Load initial data without filters
      setAppliedFilters({
        uidOrPatientId: '',
        patientName: '',
        date: null,
        status: 'all',
        pathology: 'all',
        descriptionStatus: 'all',
        timeFrom: '',
        timeTo: '',
      });
    }
  }, [appliedFilters]);

  const handleResetFilters = () => {
    const resetFilters: StudyFilters = {
      uidOrPatientId: '',
      patientName: '',
      date: null,
      status: 'all',
      pathology: 'all',
      descriptionStatus: 'all',
      timeFrom: '',
      timeTo: '',
    };
    setFilters(resetFilters);
    setAppliedFilters(resetFilters); // Apply reset filters immediately
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
  };
};
