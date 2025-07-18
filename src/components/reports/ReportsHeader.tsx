
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const ReportsHeader = () => {
  const { t } = useLanguage();

  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-3">
        {t('reports.title')}
      </h1>
      <p className="text-gray-600 text-lg">{t('reports.subtitle')}</p>
    </div>
  );
};

export default ReportsHeader;
