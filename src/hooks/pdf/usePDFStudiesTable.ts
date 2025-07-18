
import { useCallback } from 'react';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { ru, enUS, es, de } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';
import { calculateAdditionalRevenue, formatCurrency } from '@/utils/studyHelpers';
import { getPDFTableStyles, setFontForLanguage, encodeTextForPDF } from '@/utils/pdfUtils';
import { Study } from '@/types/study';

interface UsePDFStudiesTableProps {
  reportStudies: any[];
}

export const usePDFStudiesTable = ({ reportStudies }: UsePDFStudiesTableProps) => {
  const { t, language } = useLanguage();

  const getDateLocale = useCallback(() => {
    return ru; // Only Russian is supported
  }, [language]);

  const addStudiesTable = useCallback((doc: any, yPosition: number) => {
    if (reportStudies.length === 0) return;

    const dateLocale = getDateLocale();
    
    // Set font for current language
    setFontForLanguage(doc, language);
    
    doc.setFontSize(16);
    const studiesTitle = encodeTextForPDF(t('reports.pdf.studiesTitle'), language);
    doc.text(studiesTitle, 20, yPosition);
    yPosition += 10;

    const tableData = reportStudies.map(study => [
      study.uid.substring(0, 8) + '...',
      study.patientId,
      format(study.date, 'dd.MM.yyyy', { locale: dateLocale }),
      encodeTextForPDF(t(`statuses.${study.status}`), language),
      study.pathology.length > 15 ? study.pathology.substring(0, 15) + '...' : encodeTextForPDF(study.pathology, language),
      encodeTextForPDF(t(`criticality.${study.criticality}`), language),
      formatCurrency(calculateAdditionalRevenue(study as Study), t('currency.symbol'), language)
    ]);

    const tableStyles = getPDFTableStyles();

    const headers = [
      encodeTextForPDF(t('reports.pdf.headers.uid'), language),
      encodeTextForPDF(t('reports.pdf.headers.patientId'), language),
      encodeTextForPDF(t('reports.pdf.headers.date'), language),
      encodeTextForPDF(t('reports.pdf.headers.status'), language),
      encodeTextForPDF(t('reports.pdf.headers.pathology'), language),
      encodeTextForPDF(t('reports.pdf.headers.criticality'), language),
      encodeTextForPDF(t('reports.pdf.headers.additionalRevenue'), language)
    ];

    autoTable(doc, {
      startY: yPosition,
      head: [headers],
      body: tableData,
      ...tableStyles
    });
  }, [reportStudies, getDateLocale, t, language]);

  return { addStudiesTable };
};
