
import { Study } from '@/types/study';
import { useLanguage } from '@/contexts/LanguageContext';
import { useReports } from '@/contexts/ReportsContext';
import { toast } from 'sonner';
import { 
  PATHOLOGY_KEYS,
  STATUS_KEYS,
  APPOINTMENT_STATUS_KEYS
} from '@/utils/translationKeys';

export const useStudyBulkActions = (
  studies: Study[],
  setStudies: (studies: Study[]) => void,
  selectedStudies: string[],
  setSelectedStudies: (studies: string[]) => void,
  showUndoPanel: (message: string, undoAction: () => void) => void
) => {
  const { t } = useLanguage();
  const { addToReport } = useReports();


  const handleBulkArchive = () => {
    const previousState = [...studies];
    
    setStudies(studies.filter(study => !selectedStudies.includes(study.uid)));
    
    showUndoPanel(
      t('messages.archived', { count: selectedStudies.length }),
      () => setStudies(previousState)
    );
    
    setSelectedStudies([]);
  };

  const handleBulkReanalyze = () => {
    const previousState = [...studies];
    
    setStudies(studies.map(study => 
      selectedStudies.includes(study.uid) 
        ? { ...study, status: 'processing' as const }
        : study
    ));
    
    showUndoPanel(
      t('messages.reanalyzed', { count: selectedStudies.length }),
      () => setStudies(previousState)
    );
    
    setSelectedStudies([]);
  };

  const handleAddToReport = () => {
    const studiesToAdd = studies.filter(study => selectedStudies.includes(study.uid)).map(study => ({
      ...study,
      // Ensure translation keys are preserved
      pathologyKey: study.pathologyKey || PATHOLOGY_KEYS[study.pathology as keyof typeof PATHOLOGY_KEYS],
      statusKey: study.statusKey || STATUS_KEYS[study.status as keyof typeof STATUS_KEYS]
    }));
    
    addToReport(studiesToAdd);
    // Don't clear selection immediately - let the parent handle the "added" state
    return studiesToAdd.length;
  };

  return {
    handleBulkArchive,
    handleBulkReanalyze,
    handleAddToReport
  };
};
