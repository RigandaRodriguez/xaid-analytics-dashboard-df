
import { useState, useMemo } from 'react';
import { Study, SortConfig } from '@/types/study';

export const useStudySort = (studies: Study[]) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    sortBy: 'date',
    sortDirection: 'desc'
  });

  const sortedStudies = useMemo(() => {
    const result = [...studies];
    
    result.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortConfig.sortBy) {
        case 'date':
          aValue = a.date.getTime();
          bValue = b.date.getTime();
          break;
        case 'uid':
          aValue = a.uid;
          bValue = b.uid;
          break;
        case 'patientId':
          aValue = a.patientId;
          bValue = b.patientId;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'descriptionStatus':
          const descriptionStatusOrder = { completed: 2, in_progress: 1 };
          aValue = descriptionStatusOrder[a.descriptionStatus as keyof typeof descriptionStatusOrder] || 0;
          bValue = descriptionStatusOrder[b.descriptionStatus as keyof typeof descriptionStatusOrder] || 0;
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortConfig.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [studies, sortConfig]);

  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    setSortConfig({ sortBy: field, sortDirection: direction });
  };

  return {
    sortConfig,
    sortedStudies,
    handleSortChange
  };
};
