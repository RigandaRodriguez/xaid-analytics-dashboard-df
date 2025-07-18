
import { ClinicalRecommendation } from '@/types/study';

// Clinical recommendations database
const CLINICAL_RECOMMENDATIONS: ClinicalRecommendation[] = [
  {
    pathology: 'Норма',
    recommendation: 'clinicalRecommendations.Норма',
    urgency: 'routine'
  },
  {
    pathology: 'Коронарный кальций',
    recommendation: 'clinicalRecommendations.Коронарный кальций',
    urgency: 'routine'
  },
  {
    pathology: 'Расширение аорты',
    recommendation: 'clinicalRecommendations.Расширение аорты',
    urgency: 'immediate'
  },
  {
    pathology: 'Остеопороз',
    recommendation: 'clinicalRecommendations.Остеопороз',
    urgency: 'routine'
  },
  {
    pathology: 'Узлы в легких',
    recommendation: 'clinicalRecommendations.Узлы в легких',
    urgency: 'immediate'
  },
];

export const getClinicalRecommendation = (pathology: string): ClinicalRecommendation | null => {
  return CLINICAL_RECOMMENDATIONS.find(rec => rec.pathology === pathology) || null;
};
