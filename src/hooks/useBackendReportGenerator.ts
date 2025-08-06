import { useCallback } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { processingsService } from '@/services/processingsService';

interface UseBackendReportGeneratorProps {
  reportStudies: any[];
}

export const useBackendReportGenerator = ({ reportStudies }: UseBackendReportGeneratorProps) => {
  const { t } = useLanguage();

  const generateReport = useCallback(async () => {
    if (reportStudies.length === 0) {
      toast.error(t('reports.messages.noStudiesToExport'));
      return;
    }

    try {
      console.log('Starting backend report generation...');
      
      // Extract processing UIDs from report studies
      const processingUids = reportStudies.map(study => study.uid);
      
      // Call backend API to generate CSV report
      await processingsService.generateReport({
        processing_uids: processingUids
      });
      
      console.log('Backend report generation completed successfully');
      toast.success(t('reports.messages.reportGenerated'));
    } catch (error) {
      console.error('Backend report generation error:', error);
      toast.error(t('reports.messages.reportError'));
    }
  }, [reportStudies, t]);

  return {
    generateReport,
    canGenerate: reportStudies.length > 0
  };
};