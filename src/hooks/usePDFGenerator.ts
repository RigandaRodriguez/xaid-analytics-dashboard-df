
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { createPDFDocument, generateFileName } from '@/utils/pdfUtils';
import { usePDFReportHeader } from '@/hooks/pdf/usePDFReportHeader';
import { usePDFMetricsSection } from '@/hooks/pdf/usePDFMetricsSection';
import { usePDFStudiesTable } from '@/hooks/pdf/usePDFStudiesTable';

interface UsePDFGeneratorProps {
  selectedMetrics: string[];
  reportStudies: any[];
  metrics: any[];
  analyticsData: any;
}

export const usePDFGenerator = ({ selectedMetrics, reportStudies, metrics, analyticsData }: UsePDFGeneratorProps) => {
  const { t } = useLanguage();

  const { addReportHeader } = usePDFReportHeader({ reportStudiesLength: reportStudies.length });
  const { addMetricsSection } = usePDFMetricsSection({ selectedMetrics, metrics, analyticsData });
  const { addStudiesTable } = usePDFStudiesTable({ reportStudies });

  const generatePDFReport = useCallback(() => {
    if (selectedMetrics.length === 0) {
      toast.error(t('reports.messages.selectMetrics'));
      return;
    }

    try {
      console.log('Starting PDF generation with transliteration...');
      const doc = createPDFDocument();
      const pageWidth = doc.internal.pageSize.width;

      console.log('Adding report header...');
      // Add sections to PDF
      let yPosition = addReportHeader(doc, pageWidth);
      
      console.log('Adding metrics section...');
      yPosition = addMetricsSection(doc, yPosition);
      
      console.log('Adding studies table...');
      addStudiesTable(doc, yPosition);

      console.log('Saving PDF...');
      // Save PDF
      const fileName = generateFileName('medical_report');
      doc.save(fileName);
      
      console.log('PDF generation completed successfully with transliteration');
      toast.success(t('reports.messages.pdfGenerated'));
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error(t('reports.messages.pdfError'));
    }
  }, [selectedMetrics, t, addReportHeader, addMetricsSection, addStudiesTable]);

  return {
    generatePDFReport,
    canGenerate: selectedMetrics.length > 0
  };
};
