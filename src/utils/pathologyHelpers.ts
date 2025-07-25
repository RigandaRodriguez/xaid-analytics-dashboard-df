// Централизованные утилиты для работы с патологиями
import { getPathologyDisplayName, getPathologyColors, PATHOLOGY_REGISTRY } from '@/config/pathologyRegistry';

/**
 * Получает переведенное название патологии
 * Заменяет старую функцию getTranslatedPathology
 */
export function getTranslatedPathology(pathologyKey: string): string {
  return getPathologyDisplayName(pathologyKey);
}

/**
 * Получает CSS классы для отображения патологии с цветами
 */
export function getPathologyBadgeClasses(pathologyKey: string): string {
  const colors = getPathologyColors(pathologyKey);
  return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.color} ${colors.bgColor} ${colors.borderColor} border`;
}

/**
 * Проверяет, является ли патология нормой
 */
export function isNormalPathology(pathologyKey: string): boolean {
  return pathologyKey === 'normal';
}

/**
 * Получает отображение патологии для таблицы исследований
 */
export function getStudyPathologyDisplay(pathology: string | string[], pathologyKey?: string): {
  displayText: string;
  badgeClasses: string;
  isNormal: boolean;
} {
  // Если есть pathologyKey, используем его
  if (pathologyKey && pathologyKey in PATHOLOGY_REGISTRY) {
    const displayText = getPathologyDisplayName(pathologyKey);
    const badgeClasses = getPathologyBadgeClasses(pathologyKey);
    const isNormal = isNormalPathology(pathologyKey);
    
    return { displayText, badgeClasses, isNormal };
  }
  
  // Иначе пытаемся определить по тексту патологии
  const pathologyText = Array.isArray(pathology) ? pathology.join(', ') : pathology;
  
  // Пытаемся найти соответствующий ключ
  const foundKey = Object.entries(PATHOLOGY_REGISTRY).find(([key, definition]) => 
    definition.displayName === pathologyText
  )?.[0];
  
  if (foundKey) {
    const displayText = getPathologyDisplayName(foundKey);
    const badgeClasses = getPathologyBadgeClasses(foundKey);
    const isNormal = isNormalPathology(foundKey);
    
    return { displayText, badgeClasses, isNormal };
  }
  
  // Если не нашли, возвращаем базовые значения
  return {
    displayText: pathologyText,
    badgeClasses: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-700 bg-gray-50 border-gray-200 border',
    isNormal: false
  };
}

/**
 * Получает список всех доступных патологий для фильтров
 */
export function getAllPathologyOptions(): Array<{ key: string; displayName: string }> {
  return Object.entries(PATHOLOGY_REGISTRY).map(([key, definition]) => ({
    key,
    displayName: definition.displayName
  }));
}