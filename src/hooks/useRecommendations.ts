
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const useRecommendations = (pathology?: string | string[]) => {
  const { t } = useLanguage();
  
  const [recommendations, setRecommendations] = useState<Record<string, string>>({});

  // Initialize recommendations with clinical recommendations when pathology is provided
  useEffect(() => {
    if (pathology) {
      const pathologies = Array.isArray(pathology) ? pathology : [pathology];
      const newRecommendations: Record<string, string> = {};
      
      pathologies.forEach((path, index) => {
        const pathologyId = `pathology${index + 1}`;
        const clinicalRecommendation = t(`clinicalRecommendations.${path}`) || '';
        // Проверяем, что получили реальный перевод, а не ключ
        if (clinicalRecommendation && clinicalRecommendation !== `clinicalRecommendations.${path}`) {
          newRecommendations[pathologyId] = clinicalRecommendation;
        }
      });
      
      setRecommendations(newRecommendations);
    }
  }, [pathology, t]);

  const handleRecommendationChange = (pathologyId: string, value: string) => {
    setRecommendations(prev => ({
      ...prev,
      [pathologyId]: value
    }));
  };

  return {
    recommendations,
    handleRecommendationChange
  };
};
