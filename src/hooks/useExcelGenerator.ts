import { useCallback } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { exportToExcel, generateFileName, prepareExcelData } from '@/utils/excelUtils';

interface UseExcelGeneratorProps {
  reportStudies: any[];
}

export const useExcelGenerator = ({ reportStudies }: UseExcelGeneratorProps) => {
  const { t, language } = useLanguage();

  const generateExcelReport = useCallback(() => {
    if (reportStudies.length === 0) {
      toast.error(t('reports.messages.noStudiesToExport'));
      return;
    }

    try {
      console.log('Starting Excel generation...');
      
      // Prepare data for Excel export
      const excelData = prepareExcelData(reportStudies, t, language);
      
      // Generate filename
      const fileName = generateFileName('medical_report');
      
      // Export to Excel
      exportToExcel(excelData, fileName);
      
      console.log('Excel generation completed successfully');
      toast.success(t('reports.messages.excelGenerated'));
    } catch (error) {
      console.error('Excel generation error:', error);
      toast.error(t('reports.messages.excelError'));
    }
  }, [reportStudies, t, language]);

  return {
    generateExcelReport,
    canGenerate: reportStudies.length > 0
  };
};