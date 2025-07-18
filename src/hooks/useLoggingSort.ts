
import { useState, useMemo } from 'react';
import { LogEntry, LogSortConfig } from '@/types/logging';

export const useLoggingSort = (logs: LogEntry[]) => {
  const [sortConfig, setSortConfig] = useState<LogSortConfig>({
    sortBy: 'timestamp',
    sortDirection: 'desc'
  });

  const sortedLogs = useMemo(() => {
    const result = [...logs];
    
    result.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortConfig.sortBy) {
        case 'timestamp':
          aValue = a.timestamp.getTime();
          bValue = b.timestamp.getTime();
          break;
        case 'user':
          aValue = 'system';
          bValue = 'system';
          break;
        case 'action':
          aValue = a.action;
          bValue = b.action;
          break;
        case 'studyUid':
          aValue = a.studyUid || '';
          bValue = b.studyUid || '';
          break;
        case 'patientId':
          aValue = a.patientId || '';
          bValue = b.patientId || '';
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortConfig.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [logs, sortConfig]);

  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    setSortConfig({ sortBy: field, sortDirection: direction });
  };

  return {
    sortConfig,
    sortedLogs,
    handleSortChange
  };
};
