
import { useState } from 'react';
import { useReports } from '@/contexts/ReportsContext';
import { Study } from '@/types/study';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export const useStudyActions = () => {
  const [addedStudies, setAddedStudies] = useState<Set<string>>(new Set());
  const { addToReport } = useReports();
  const { t } = useLanguage();

  const handleAddToReport = (study: Study) => {
    if (!addedStudies.has(study.uid)) {
      addToReport([study]);
      setAddedStudies(prev => new Set([...prev, study.uid]));
      toast.success(t('messages.addedToReport', { count: 1 }));
    }
  };

  const isAddedToReport = (studyUid: string) => {
    return addedStudies.has(studyUid);
  };

  return {
    isAddedToReport,
    handleAddToReport
  };
};
