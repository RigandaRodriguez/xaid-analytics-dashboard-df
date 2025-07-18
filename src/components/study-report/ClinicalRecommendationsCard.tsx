
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Clock, Info } from 'lucide-react';
import { ClinicalRecommendation } from '@/types/study';
import { useLanguage } from '@/contexts/LanguageContext';

interface ClinicalRecommendationsCardProps {
  clinicalRecommendation: ClinicalRecommendation;
}

const ClinicalRecommendationsCard: React.FC<ClinicalRecommendationsCardProps> = ({ clinicalRecommendation }) => {
  const { t } = useLanguage();

  const getUrgencyStyle = (urgency: string) => {
    switch (urgency) {
      case 'immediate':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'within_24h':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'routine':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'immediate':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'within_24h':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'routine':
        return <Info className="w-4 h-4 text-blue-600" />;
      default:
        return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTranslatedRecommendation = (pathology: string) => {
    // Показываем переведенный текст рекомендации вместо технической записи
    const translationKey = `clinicalRecommendations.${pathology.toLowerCase().replace(/\s+/g, '')}`;
    const translatedText = t(translationKey);
    
    // Если перевод не найден, показываем оригинальную рекомендацию
    return translatedText !== translationKey ? translatedText : clinicalRecommendation.recommendation;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getUrgencyIcon(clinicalRecommendation.urgency)}
          {t('study.clinicalRecommendations')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`p-4 rounded-lg border-2 ${getUrgencyStyle(clinicalRecommendation.urgency)}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">
                {t(`study.urgency${clinicalRecommendation.urgency.charAt(0).toUpperCase() + clinicalRecommendation.urgency.slice(1).replace('_', '')}`)}
              </span>
            </div>
          </div>
          <p className="text-sm leading-relaxed">
            {getTranslatedRecommendation(clinicalRecommendation.pathology)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClinicalRecommendationsCard;
