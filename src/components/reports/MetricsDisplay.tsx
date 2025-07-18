
import React from 'react';
import { BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

interface MetricsDisplayProps {
  metrics: any[];
  analyticsData: any;
}

const MetricsDisplay = ({ metrics, analyticsData }: MetricsDisplayProps) => {
  const { t } = useLanguage();

  const renderMetricContent = (metric: any) => {
    if (analyticsData.totalStudies === 0 && metric.type === 'chart') {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{t('reports.dashboard.noData')}</p>
            <p className="text-sm">{t('reports.dashboard.addStudies')}</p>
          </div>
        </div>
      );
    }

    switch (metric.id) {
      case 'pathologies':
        return (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.pathologyStats} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80} 
                  fontSize={10}
                  stroke="#666"
                />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {analyticsData.pathologyStats.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'status':
        const data = analyticsData[`${metric.id}Stats` as keyof typeof analyticsData] as any[];
        return (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={45}
                  dataKey="value"
                  stroke="white"
                  strokeWidth={3}
                >
                  {data.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px'
                  }}
                  formatter={(value, name) => [`${value}% (${data.find(d => d.name === name)?.count || 0})`, name]}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      default:
        return (
          <div className="text-center py-8">
            <div className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-2">
              {metric.value}
            </div>
            <div className="text-sm text-gray-500">
              {metric.name.includes(t('reports.metrics.totalStudies')) ? t('reports.metrics.studies') : 
               metric.name.includes(t('reports.metrics.avgProcessingTime')) ? '' : 
               metric.name.includes(t('reports.metrics.successRate')) ? t('reports.metrics.ofTotal') : ''}
            </div>
          </div>
        );
    }
  };

  const MetricIcon = ({ metric }: { metric: any }) => {
    const IconComponent = metric.icon;
    return <IconComponent className="w-6 h-6 text-white" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric) => (
        <div key={metric.id} className="group border-0 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 hover:from-white hover:to-blue-50">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <MetricIcon metric={metric} />
            </div>
            <h3 className="font-semibold text-sm text-gray-800 flex-1 group-hover:text-blue-700 transition-colors">
              {metric.name}
            </h3>
          </div>
          <div className="min-h-[200px] bg-white rounded-xl p-4 border border-gray-100">
            {renderMetricContent(metric)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsDisplay;
