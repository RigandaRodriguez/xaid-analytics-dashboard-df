
import { useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { setFontForLanguage, encodeTextForPDF } from '@/utils/pdfUtils';

interface UsePDFMetricsSectionProps {
  selectedMetrics: string[];
  metrics: any[];
  analyticsData: any;
}

export const usePDFMetricsSection = ({ selectedMetrics, metrics, analyticsData }: UsePDFMetricsSectionProps) => {
  const { t, language } = useLanguage();

  const addMetricsSection = useCallback((doc: any, yPosition: number) => {
    const selectedMetricsData = metrics.filter(metric => selectedMetrics.includes(metric.id));
    
    // Set font for current language
    setFontForLanguage(doc, language);
    
    doc.setFontSize(16);
    const metricsTitle = encodeTextForPDF(t('reports.pdf.metricsTitle'), language);
    doc.text(metricsTitle, 20, yPosition);
    yPosition += 15;

    selectedMetricsData.forEach(metric => {
      doc.setFontSize(12);
      const metricName = `• ${encodeTextForPDF(metric.name, language)}`;
      doc.text(metricName, 25, yPosition);
      yPosition += 8;

      if (metric.value) {
        doc.setFontSize(10);
        const valueText = `  ${encodeTextForPDF(t('reports.pdf.value'), language)}: ${metric.value}`;
        doc.text(valueText, 30, yPosition);
        yPosition += 6;
      }

      // Add chart data for chart-type metrics
      if (metric.type === 'chart') {
        const chartData = analyticsData[`${metric.id}Stats` as keyof typeof analyticsData] as any[];
        if (chartData && Array.isArray(chartData)) {
          chartData.forEach((item: any) => {
            doc.setFontSize(9);
            const itemText = `    - ${encodeTextForPDF(item.name, language)}: ${item.count || item.value}`;
            doc.text(itemText, 35, yPosition);
            yPosition += 5;
          });
        }
      }

      yPosition += 3;
    });

    return yPosition + 10;
  }, [selectedMetrics, metrics, analyticsData, t, language]);

  return { addMetricsSection };
};
