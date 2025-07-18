
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const MedicalImagesCard: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('studyReport.medicalImages')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            {t('studyReport.ctImages')}
          </h3>
          <p className="text-gray-500">{t('studyReport.dicomViewer')}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalImagesCard;
