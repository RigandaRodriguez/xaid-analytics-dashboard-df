import { ProcessingPathology, RecommendationStatus } from '@/types/api';
import { getPathologyDisplayName, getPathologyRecommendedPhysicians } from '@/config/pathologyRegistry';
import { getPhysicianDisplayName } from '@/config/physicianConfig';

/**
 * Фильтрует патологии по статусу рекомендаций
 * Показывает только pending и accepted, скрывает rejected
 */
export function filterVisiblePathologies(pathologies: ProcessingPathology[]): ProcessingPathology[] {
  return pathologies.filter(pathology => 
    pathology.recommendation_status === 'pending' || 
    pathology.recommendation_status === 'accepted'
  );
}

/**
 * Получает отображаемые имена патологий в правильном порядке
 */
export function getDisplayPathologyNames(pathologies: ProcessingPathology[]): string[] {
  const visiblePathologies = filterVisiblePathologies(pathologies);
  
  return visiblePathologies.map(pathology => 
    getPathologyDisplayName(pathology.pathology_key)
  );
}

/**
 * Получает рекомендуемых врачей для патологий в том же порядке
 */
export function getRecommendedPhysiciansForPathologies(pathologies: ProcessingPathology[]): string[] {
  const visiblePathologies = filterVisiblePathologies(pathologies);
  const physicianKeys = new Set<string>();
  
  // Собираем врачей в том же порядке, что и патологии
  visiblePathologies.forEach(pathology => {
    const recommendedPhysicians = getPathologyRecommendedPhysicians(pathology.pathology_key);
    recommendedPhysicians.forEach(physicianKey => {
      physicianKeys.add(physicianKey);
    });
  });
  
  return Array.from(physicianKeys).map(physicianKey => 
    getPhysicianDisplayName(physicianKey)
  );
}

/**
 * Получает рекомендуемых врачей на основе recommendation_physician_key из API
 */
export function getApiRecommendedPhysicians(pathologies: ProcessingPathology[]): string[] {
  const visiblePathologies = filterVisiblePathologies(pathologies);
  const physicianKeys = new Set<string>();
  
  visiblePathologies.forEach(pathology => {
    if (pathology.recommendation_physician_key) {
      physicianKeys.add(pathology.recommendation_physician_key);
    }
  });
  
  return Array.from(physicianKeys).map(physicianKey => 
    getPhysicianDisplayName(physicianKey)
  );
}

/**
 * Проверяет, есть ли видимые патологии
 */
export function hasVisiblePathologies(pathologies: ProcessingPathology[]): boolean {
  return filterVisiblePathologies(pathologies).length > 0;
}