// Конфигурация патологий с локализацией и рекомендациями врачей
export interface PathologyConfig {
  key: string;
  displayName: string;
  recommendedPhysicians: string[];
}

export const PATHOLOGY_CONFIG: Record<string, PathologyConfig> = {
  'normal': {
    key: 'normal',
    displayName: 'Норма',
    recommendedPhysicians: []
  },
  'coronaryCalcium': {
    key: 'coronaryCalcium', 
    displayName: 'Коронарный кальций',
    recommendedPhysicians: ['cardiologist']
  },
  'aorticDilation': {
    key: 'aorticDilation',
    displayName: 'Расширение аорты', 
    recommendedPhysicians: ['cardiologist', 'cardiac_surgeon']
  },
  'osteoporosis': {
    key: 'osteoporosis',
    displayName: 'Остеопороз',
    recommendedPhysicians: ['endocrinologist']
  },
  'lungNodules': {
    key: 'lungNodules',
    displayName: 'Узлы в легких',
    recommendedPhysicians: ['general_practitioner', 'oncologist']
  }
};

export function getPathologyConfig(pathologyKey: string): PathologyConfig | null {
  return PATHOLOGY_CONFIG[pathologyKey] || null;
}

export function getPathologyDisplayName(pathologyKey: string): string {
  const config = getPathologyConfig(pathologyKey);
  return config?.displayName || pathologyKey;
}

export function getPathologyRecommendedPhysicians(pathologyKey: string): string[] {
  const config = getPathologyConfig(pathologyKey);
  return config?.recommendedPhysicians || [];
}