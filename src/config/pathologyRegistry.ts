// Централизованный реестр патологий с локализацией, конфигурацией и цветами
export interface PathologyDefinition {
  key: string;
  displayName: string;
  color: string;
  bgColor: string;
  borderColor: string;
  recommendedPhysicians: string[];
  category: 'normal' | 'cardiac' | 'bone' | 'lung' | 'other';
  urgency: 'routine' | 'urgent' | 'immediate';
}

export const PATHOLOGY_REGISTRY: Record<string, PathologyDefinition> = {
  'normal': {
    key: 'normal',
    displayName: 'Норма',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    recommendedPhysicians: [],
    category: 'normal',
    urgency: 'routine'
  },
  'coronaryCalcium': {
    key: 'coronaryCalcium',
    displayName: 'Коронарный кальций',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    recommendedPhysicians: ['cardiologist'],
    category: 'cardiac',
    urgency: 'urgent'
  },
  // Поддержка API ключа с опечаткой
  'coronary_сalcium': {
    key: 'coronary_сalcium',
    displayName: 'Коронарный кальций',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    recommendedPhysicians: ['cardiologist'],
    category: 'cardiac',
    urgency: 'urgent'
  },
  'aorticDilation': {
    key: 'aorticDilation',
    displayName: 'Расширение аорты',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    recommendedPhysicians: ['cardiologist', 'cardiac_surgeon'],
    category: 'cardiac',
    urgency: 'immediate'
  },
  // Поддержка API ключа
  'aorta_dilation': {
    key: 'aorta_dilation',
    displayName: 'Расширение аорты',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    recommendedPhysicians: ['cardiologist', 'cardiac_surgeon'],
    category: 'cardiac',
    urgency: 'immediate'
  },
  'osteoporosis': {
    key: 'osteoporosis',
    displayName: 'Остеопороз',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    recommendedPhysicians: ['endocrinologist'],
    category: 'bone',
    urgency: 'routine'
  },
  'lungNodules': {
    key: 'lungNodules',
    displayName: 'Узлы в легких',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    recommendedPhysicians: ['general_practitioner', 'oncologist'],
    category: 'lung',
    urgency: 'urgent'
  }
};

// Утилиты для работы с реестром патологий
export function getPathologyDefinition(pathologyKey: string): PathologyDefinition | null {
  return PATHOLOGY_REGISTRY[pathologyKey] || null;
}

export function getPathologyDisplayName(pathologyKey: string): string {
  const definition = getPathologyDefinition(pathologyKey);
  return definition?.displayName || pathologyKey;
}

export function getPathologyRecommendedPhysicians(pathologyKey: string): string[] {
  const definition = getPathologyDefinition(pathologyKey);
  return definition?.recommendedPhysicians || [];
}

export function getPathologyColors(pathologyKey: string): {
  color: string;
  bgColor: string;
  borderColor: string;
} {
  const definition = getPathologyDefinition(pathologyKey);
  return {
    color: definition?.color || 'text-gray-700',
    bgColor: definition?.bgColor || 'bg-gray-50',
    borderColor: definition?.borderColor || 'border-gray-200'
  };
}

export function getPathologyCategory(pathologyKey: string): string {
  const definition = getPathologyDefinition(pathologyKey);
  return definition?.category || 'other';
}

export function getPathologyUrgency(pathologyKey: string): string {
  const definition = getPathologyDefinition(pathologyKey);
  return definition?.urgency || 'routine';
}

// Получить все патологии по категории
export function getPathologiesByCategory(category: string): PathologyDefinition[] {
  return Object.values(PATHOLOGY_REGISTRY).filter(p => p.category === category);
}

// Получить все патологии по уровню срочности
export function getPathologiesByUrgency(urgency: string): PathologyDefinition[] {
  return Object.values(PATHOLOGY_REGISTRY).filter(p => p.urgency === urgency);
}

// Проверить, существует ли патология
export function isValidPathologyKey(pathologyKey: string): boolean {
  return pathologyKey in PATHOLOGY_REGISTRY;
}

// Получить список всех ключей патологий
export function getAllPathologyKeys(): string[] {
  return Object.keys(PATHOLOGY_REGISTRY);
}

// Получить список всех отображаемых имен
export function getAllPathologyDisplayNames(): string[] {
  return Object.values(PATHOLOGY_REGISTRY).map(p => p.displayName);
}