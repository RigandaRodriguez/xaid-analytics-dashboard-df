
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { StudyFilters } from '@/types/study';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProcessings } from '@/hooks/api/useProcessings';
import { format, eachDayOfInterval, startOfDay, endOfDay } from 'date-fns';

interface StatisticsGraphProps {
  appliedFilters?: StudyFilters | null;
}

const StatisticsGraph = ({ appliedFilters }: StatisticsGraphProps) => {
  const { t } = useLanguage();
  
  // Get all studies from API for the last 30 days
  const { data: apiData, isLoading } = useProcessings({
    per_page: 1000, // Get many records to build statistics
  });

  // Get filtered studies using the same API call as the main dashboard
  const { data: filteredApiData, isLoading: isFilteredLoading } = useProcessings({
    per_page: 1000,
    search_query: appliedFilters?.uidOrPatientId || undefined,
    patient_name: appliedFilters?.patientName || undefined,
    status: appliedFilters?.status !== 'all' ? appliedFilters?.status as any : undefined,
    pathology_keys: appliedFilters?.pathology && appliedFilters.pathology !== 'Все патологии' && !appliedFilters.pathology.includes('все') 
      ? [appliedFilters.pathology] : undefined,
    study_created_at__gte: appliedFilters?.date ? new Date(appliedFilters.date).toISOString() : undefined,
    study_created_at__lte: appliedFilters?.date ? new Date(appliedFilters.date).toISOString() : undefined,
    enabled: !!appliedFilters
  });

  // Generate chart data from API data
  const chartData = React.useMemo(() => {
    if (!apiData?.studies) return [];
    
    // Get date range for the last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 29); // Last 30 days
    
    // Create array of all dates in range
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Group studies by date
    const studiesByDate = apiData.studies.reduce((acc, study) => {
      const dateKey = format(startOfDay(study.date), 'yyyy-MM-dd');
      acc[dateKey] = (acc[dateKey] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Create chart data for each day
    return dateRange.map(date => {
      const dateKey = format(date, 'yyyy-MM-dd');
      const formattedDate = format(date, 'dd.MM');
      
      return {
        date: formattedDate,
        studies: studiesByDate[dateKey] || 0,
        dateKey
      };
    });
  }, [apiData?.studies]);

  // Calculate filtered data by date using API response
  const filteredDataByDate = React.useMemo(() => {
    if (!chartData.length) return [];
    
    if (!appliedFilters || !filteredApiData?.studies || filteredApiData.studies.length === 0) {
      return chartData.map(item => ({ ...item, filteredStudies: 0 }));
    }

    const filteredCounts = filteredApiData.studies.reduce((acc, study) => {
      const dateKey = format(startOfDay(study.date), 'yyyy-MM-dd');
      acc[dateKey] = (acc[dateKey] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return chartData.map(item => ({
      ...item,
      filteredStudies: filteredCounts[item.dateKey] || 0
    }));
  }, [filteredApiData?.studies, appliedFilters, chartData]);

  // Generate description text for applied filters
  const getAppliedFiltersDescription = () => {
    if (!appliedFilters) return '';
    
    const descriptions = [];
    
    if (appliedFilters.uidOrPatientId) {
      descriptions.push(`${t('study.uidOrPatientId')}: "${appliedFilters.uidOrPatientId}"`);
    }
    if (appliedFilters.date) {
      descriptions.push(`${t('study.date')}: ${appliedFilters.date.toLocaleDateString('ru-RU')}`);
    }
    if (appliedFilters.status !== 'all') {
      const statusText = t(`study.statuses.${appliedFilters.status}`);
      descriptions.push(`${t('study.status')}: ${statusText}`);
    }
    if (appliedFilters.pathology !== t('pathologies.all')) {
      descriptions.push(`${t('study.pathologies')}: ${appliedFilters.pathology}`);
    }
    if (appliedFilters.descriptionStatus !== 'all') {
      const statusText = t(`study.description${appliedFilters.descriptionStatus.charAt(0).toUpperCase() + appliedFilters.descriptionStatus.slice(1)}`);
      descriptions.push(`${t('study.descriptionStatus')}: ${statusText}`);
    }
    
    return descriptions.join(', ');
  };

  const shouldShowFilteredLine = appliedFilters && filteredApiData?.studies && filteredApiData.studies.length > 0;
  const filtersDescription = getAppliedFiltersDescription();

  // Generate dynamic period display
  const periodDisplay = React.useMemo(() => {
    if (!chartData.length) return '';
    const firstDate = format(new Date(Date.now() - 29 * 24 * 60 * 60 * 1000), 'dd.MM.yyyy');
    const lastDate = format(new Date(), 'dd.MM.yyyy');
    return `${firstDate} – ${lastDate}`;
  }, [chartData]);

  if (isLoading || isFilteredLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-80 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{t('statistics.title')}</h3>
        <p className="text-sm text-gray-600">{t('statistics.period')}: {periodDisplay}</p>
        {shouldShowFilteredLine && (
          <p className="text-sm text-blue-600 mt-1">
            {t('statistics.blueLineDescription')} ({filteredApiData?.studies?.length || 0} {t('statistics.studiesCount')})
            {filtersDescription && (
              <span className="block text-xs text-gray-500 mt-1">
                {t('statistics.appliedFilters')}: {filtersDescription}
              </span>
            )}
          </p>
        )}
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredDataByDate}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#666"
              fontSize={12}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '12px'
              }}
              formatter={(value, name) => [
                value,
                name === 'studies' ? t('statistics.allStudies') : t('statistics.byFilter')
              ]}
            />
            <Legend 
              formatter={(value) => 
                value === 'studies' ? t('statistics.allStudies') : t('statistics.byFilter')
              }
            />
            <Line 
              type="monotone" 
              dataKey="studies" 
              stroke="#6B7BB3" 
              strokeWidth={3}
              dot={{ fill: '#3B4B96', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#3B4B96' }}
              name="studies"
            />
            {shouldShowFilteredLine && (
              <Line 
                type="monotone" 
                dataKey="filteredStudies" 
                stroke="#F97316" 
                strokeWidth={2}
                dot={{ fill: '#EA580C', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, fill: '#EA580C' }}
                strokeDasharray="5 5"
                name="filteredStudies"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatisticsGraph;
