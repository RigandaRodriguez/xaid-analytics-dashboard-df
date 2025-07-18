
import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { calculateAdditionalRevenue } from '@/utils/studyHelpers';
import { Study } from '@/types/study';

export const useReportsAnalytics = (translatedReportStudies: any[]) => {
  const { t, language } = useLanguage();

  return useMemo(() => {
    if (translatedReportStudies.length === 0) {
      return {
        totalStudies: 0,
        pathologyStats: [],
        statusStats: [],
        totalAdditionalRevenue: 0,
        avgProcessingTime: t('reports.dashboard.noData'),
        successfullyProcessed: 0
      };
    }

    // Calculate total additional revenue using original values
    const totalAdditionalRevenue = translatedReportStudies.reduce((total: number, study) => {
      // Create a study object with original values for calculation
      const studyForCalculation: Study = {
        uid: study.uid,
        patientId: study.patientId,
        patientName: study.patientName || 'Unknown Patient',
        date: study.date,
        status: study.originalStatus || study.status,
        pathology: study.originalPathology || study.pathology,
        descriptionStatus: study.originalDescriptionStatus || study.descriptionStatus || 'in_progress',
        pathologyKey: study.pathologyKey,
        statusKey: study.statusKey,
        pathologyDecisions: study.pathologyDecisions || []
      };
      
      const revenue = calculateAdditionalRevenue(studyForCalculation);
      console.log('Study revenue calculation:', {
        uid: study.uid,
        pathology: studyForCalculation.pathology,
        revenue
      });
      
      if (typeof revenue === 'number') {
        return total + revenue;
      }
      return total;
    }, 0);

    console.log('Total additional revenue calculated:', totalAdditionalRevenue);

    // Calculate pathology statistics
    const pathologyCount = translatedReportStudies.reduce((acc: Record<string, number>, study) => {
      const pathology = String(study.pathology || '');
      acc[pathology] = (acc[pathology] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const pathologyStats = Object.entries(pathologyCount)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 8)
      .map(([name, count], index) => ({
        name: name.length > 15 ? name.substring(0, 15) + '...' : name,
        count: count as number,
        color: [
          '#3B82F6', '#8B5CF6', '#EF4444', '#10B981', 
          '#F59E0B', '#EC4899', '#6366F1', '#14B8A6'
        ][index] || '#94A3B8'
      }));


    // Calculate status statistics using original values
    const statusCount = translatedReportStudies.reduce((acc: Record<string, number>, study) => {
      const statusKey = study.statusKey || study.originalStatus || study.status;
      acc[statusKey] = (acc[statusKey] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusStats = [
      { 
        name: t('statuses.completed'), 
        value: Math.round(((statusCount.completed as number) || 0) / translatedReportStudies.length * 100),
        count: (statusCount.completed as number) || 0,
        color: '#10B981'
      },
      { 
        name: t('statuses.processing'), 
        value: Math.round(((statusCount.processing as number) || 0) / translatedReportStudies.length * 100),
        count: (statusCount.processing as number) || 0,
        color: '#3B82F6'
      },
      { 
        name: t('statuses.error'), 
        value: Math.round(((statusCount.error as number) || 0) / translatedReportStudies.length * 100),
        count: (statusCount.error as number) || 0,
        color: '#EF4444'
      }
    ].filter(item => item.count > 0);


    return {
      totalStudies: translatedReportStudies.length,
      pathologyStats,
      statusStats,
      totalAdditionalRevenue,
      avgProcessingTime: language === 'ru' ? '3 мин 24 сек' : language === 'de' ? '3 Min 24 Sek' : language === 'es' ? '3 min 24 seg' : '3 min 24 sec',
      successfullyProcessed: Math.round(((statusCount.completed as number) || 0) / translatedReportStudies.length * 100)
    };
  }, [translatedReportStudies, t, language]);
};
