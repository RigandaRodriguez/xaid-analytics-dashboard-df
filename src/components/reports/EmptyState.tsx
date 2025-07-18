
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const EmptyState = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
      <CardContent className="p-12 text-center">
        <div className="text-gray-400 mb-4">
          <BarChart3 className="w-24 h-24 mx-auto mb-6 opacity-50" />
          <h3 className="text-2xl font-semibold text-gray-600 mb-2">{t('reports.emptyState.title')}</h3>
          <p className="text-gray-500 mb-6">{t('reports.emptyState.subtitle')}</p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            {t('reports.emptyState.goToDashboard')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
