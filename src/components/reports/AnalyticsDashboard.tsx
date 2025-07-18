
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import MetricsDisplay from './MetricsDisplay';

interface AnalyticsDashboardProps {
  analyticsData: any;
  metrics: any[];
  selectedMetrics: string[];
  onMetricSelect: (metricId: string, checked: boolean) => void;
  onSelectAllMetrics: (checked: boolean) => void;
}

const AnalyticsDashboard = ({
  analyticsData,
  metrics,
  selectedMetrics,
  onMetricSelect,
  onSelectAllMetrics
}: AnalyticsDashboardProps) => {
  const { t } = useLanguage();

  return (
    <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-t-lg border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-gray-800 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              {t('reports.dashboard.title')}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {t('reports.dashboard.subtitle')} • {analyticsData.totalStudies} {t('reports.metrics.studies')}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <MetricsDisplay
          metrics={metrics}
          analyticsData={analyticsData}
        />
      </CardContent>
    </Card>
  );
};

export default AnalyticsDashboard;
