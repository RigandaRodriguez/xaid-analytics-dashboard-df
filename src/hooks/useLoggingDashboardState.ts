
import { useState, useMemo } from 'react';
import { LogFilters, LogEntry } from '@/types/logging';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLogging } from '@/contexts/LoggingContext';
import { useLoggingFilterOptions } from '@/hooks/useLoggingFilterOptions';
import { useLoggingSort } from '@/hooks/useLoggingSort';
import { useLoggingPagination } from '@/hooks/useLoggingPagination';

export const useLoggingDashboardState = () => {
  const { t } = useLanguage();
  const { logs: allLogs } = useLogging();
  const { actionOptions } = useLoggingFilterOptions();
  
  const defaultFilters: LogFilters = {
    action: actionOptions[0],
  };

  const [filters, setFilters] = useState<LogFilters>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<LogFilters | null>(null);
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);

  const filteredLogs = useMemo(() => {
    if (!appliedFilters) return allLogs;

    return allLogs.filter(log => {
      // Date from filter
      if (appliedFilters.dateFrom && log.timestamp < appliedFilters.dateFrom) {
        return false;
      }
      
      // Date to filter
      if (appliedFilters.dateTo) {
        const dateTo = new Date(appliedFilters.dateTo);
        dateTo.setHours(23, 59, 59, 999);
        if (log.timestamp > dateTo) {
          return false;
        }
      }


      // Action filter
      if (appliedFilters.action !== actionOptions[0] && 
          log.action !== appliedFilters.action) {
        return false;
      }

      return true;
    });
  }, [allLogs, appliedFilters, actionOptions]);

  const { sortConfig, sortedLogs, handleSortChange } = useLoggingSort(filteredLogs);
  const { paginationConfig, paginationData, handlePageChange, handleRecordsPerPageChange, handleViewModeChange } = useLoggingPagination(sortedLogs);

  const hasFiltersChanged = useMemo(() => {
    return JSON.stringify(filters) !== JSON.stringify(appliedFilters || defaultFilters);
  }, [filters, appliedFilters, defaultFilters]);

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    console.log('Applied filters:', filters);
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    setAppliedFilters(null);
    setSelectedLogs([]);
  };

  const handleSelectLog = (logId: string) => {
    setSelectedLogs(prev => 
      prev.includes(logId) 
        ? prev.filter(id => id !== logId)
        : [...prev, logId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedLogs(checked ? paginationData.currentPageLogs.map(log => log.id) : []);
  };

  return {
    filters,
    setFilters,
    appliedFilters,
    selectedLogs,
    allLogs,
    filteredLogs,
    sortConfig,
    sortedLogs,
    paginationConfig,
    paginationData,
    hasFiltersChanged,
    handleApplyFilters,
    handleResetFilters,
    handleSelectLog,
    handleSelectAll,
    handleSortChange,
    handlePageChange,
    handleRecordsPerPageChange,
    handleViewModeChange
  };
};
