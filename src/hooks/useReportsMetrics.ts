
import { useMemo } from 'react';
import { BarChart3, TrendingUp, Activity, Users, Clock, Target, AlertCircle, CheckCircle, DollarSign } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatCurrency } from '@/utils/studyHelpers';

export const useReportsMetrics = (analyticsData: any) => {
  const { t, language } = useLanguage();

  return useMemo(() => [
    { 
      id: 'total', 
      name: t('reports.metrics.totalStudies'), 
      value: analyticsData.totalStudies,
      icon: BarChart3,
      color: 'from-blue-500 to-blue-600'
    },
    { 
      id: 'pathologies', 
      name: t('reports.metrics.pathologyStats'), 
      type: 'chart',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600'
    },
    { 
      id: 'status', 
      name: t('reports.metrics.statusRatio'), 
      type: 'chart',
      icon: Activity,
      color: 'from-indigo-500 to-indigo-600'
    }
  ], [analyticsData, t, language]);
};
