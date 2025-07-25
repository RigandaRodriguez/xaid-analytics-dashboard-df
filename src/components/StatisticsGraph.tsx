
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { StudyFilters } from '@/types/study';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProcessings } from '@/hooks/api/useProcessings';
import { format, eachDayOfInterval, startOfDay, endOfDay } from 'date-fns';

interface StatisticsGraphProps {}

const StatisticsGraph = () => {
  const { t } = useLanguage();
  
  // Get all studies from API for the last 30 days
  const { data: apiData, isLoading } = useProcessings({
    per_page: 1000, // Get many records to build statistics
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

  // Generate dynamic period display
  const periodDisplay = React.useMemo(() => {
    if (!chartData.length) return '';
    const firstDate = format(new Date(Date.now() - 29 * 24 * 60 * 60 * 1000), 'dd.MM.yyyy');
    const lastDate = format(new Date(), 'dd.MM.yyyy');
    return `${firstDate} – ${lastDate}`;
  }, [chartData]);

  if (isLoading) {
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
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
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
              formatter={(value) => [value, t('statistics.allStudies')]}
            />
            <Line 
              type="monotone" 
              dataKey="studies" 
              stroke="#6B7BB3" 
              strokeWidth={3}
              dot={{ fill: '#3B4B96', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#3B4B96' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatisticsGraph;
