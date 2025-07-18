
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { StudyFilters } from '@/types/study';
import { useLanguage } from '@/contexts/LanguageContext';

interface StatisticsGraphProps {
  filteredStudies?: any[];
  appliedFilters?: StudyFilters | null;
}

const StatisticsGraph = ({ filteredStudies = [], appliedFilters }: StatisticsGraphProps) => {
  const { t } = useLanguage();

  const originalData = [
    { date: '20.05', studies: 12, dateKey: '2023-05-20' },
    { date: '21.05', studies: 18, dateKey: '2023-05-21' },
    { date: '22.05', studies: 8, dateKey: '2023-05-22' },
    { date: '23.05', studies: 25, dateKey: '2023-05-23' },
    { date: '24.05', studies: 32, dateKey: '2023-05-24' },
    { date: '25.05', studies: 28, dateKey: '2023-05-25' },
    { date: '26.05', studies: 35, dateKey: '2023-05-26' },
    { date: '27.05', studies: 22, dateKey: '2023-05-27' },
    { date: '28.05', studies: 40, dateKey: '2023-05-28' },
    { date: '29.05', studies: 38, dateKey: '2023-05-29' },
    { date: '30.05', studies: 45, dateKey: '2023-05-30' },
    { date: '31.05', studies: 42, dateKey: '2023-05-31' },
    { date: '01.06', studies: 38, dateKey: '2023-06-01' },
    { date: '02.06', studies: 50, dateKey: '2023-06-02' },
    { date: '03.06', studies: 48, dateKey: '2023-06-03' },
    { date: '04.06', studies: 52, dateKey: '2023-06-04' }
  ];

  // Calculate filtered data by date only if filters are applied
  const filteredDataByDate = React.useMemo(() => {
    if (!appliedFilters || filteredStudies.length === 0) {
      return originalData.map(item => ({ ...item, filteredStudies: 0 }));
    }

    const filteredCounts = filteredStudies.reduce((acc, study) => {
      const dateKey = study.date.toISOString().split('T')[0];
      acc[dateKey] = (acc[dateKey] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return originalData.map(item => ({
      ...item,
      filteredStudies: filteredCounts[item.dateKey] || 0
    }));
  }, [filteredStudies, appliedFilters]);

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
      const statusText = t(`statuses.${appliedFilters.status}`);
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

  const shouldShowFilteredLine = appliedFilters && filteredStudies.length > 0;
  const filtersDescription = getAppliedFiltersDescription();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{t('statistics.title')}</h3>
        <p className="text-sm text-gray-600">{t('statistics.period')}: 20.05.2023 – 04.06.2023</p>
        {shouldShowFilteredLine && (
          <p className="text-sm text-blue-600 mt-1">
            {t('statistics.blueLineDescription')} ({filteredStudies.length} {t('statistics.studiesCount')})
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
