
import { useCallback } from 'react';
import { format } from 'date-fns';
import { ru, enUS, es, de } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';
import { setFontForLanguage, encodeTextForPDF } from '@/utils/pdfUtils';

interface UsePDFReportHeaderProps {
  reportStudiesLength: number;
}

export const usePDFReportHeader = ({ reportStudiesLength }: UsePDFReportHeaderProps) => {
  const { t, language } = useLanguage();

  const getDateLocale = useCallback(() => {
    return ru; // Only Russian is supported
  }, [language]);

  const addReportHeader = useCallback((doc: any, pageWidth: number) => {
    let yPosition = 20;
    const dateLocale = getDateLocale();

    // Set font for current language
    setFontForLanguage(doc, language);

    // Report title
    doc.setFontSize(20);
    const title = encodeTextForPDF(t('reports.pdf.title'), language);
    doc.text(title, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    doc.setFontSize(12);
    const createdText = `${encodeTextForPDF(t('reports.pdf.createdAt'), language)}: ${format(new Date(), 'dd.MM.yyyy HH:mm', { locale: dateLocale })}`;
    doc.text(createdText, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    const studiesText = `${encodeTextForPDF(t('reports.pdf.studiesCount'), language)}: ${reportStudiesLength}`;
    doc.text(studiesText, pageWidth / 2, yPosition, { align: 'center' });

    return yPosition + 20;
  }, [t, reportStudiesLength, getDateLocale, language]);

  return { addReportHeader };
};
