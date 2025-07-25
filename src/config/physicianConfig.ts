// Конфигурация врачей с локализацией
export interface PhysicianConfig {
  key: string;
  displayName: string;
  badgeClass: string;
}

export const PHYSICIAN_CONFIG: Record<string, PhysicianConfig> = {
  'radiologist': {
    key: 'radiologist',
    displayName: 'Врач-рентгенолог',
    badgeClass: 'bg-blue-50 text-blue-700'
  },
  'cardiologist': {
    key: 'cardiologist', 
    displayName: 'Кардиолог',
    badgeClass: 'bg-red-50 text-red-700'
  },
  'cardiac_surgeon': {
    key: 'cardiac_surgeon',
    displayName: 'Кардиохирург', 
    badgeClass: 'bg-red-100 text-red-800'
  },
  'pulmonologist': {
    key: 'pulmonologist',
    displayName: 'Пульмонолог',
    badgeClass: 'bg-cyan-50 text-cyan-700'
  },
  'orthopedist': {
    key: 'orthopedist',
    displayName: 'Ортопед',
    badgeClass: 'bg-amber-50 text-amber-700'
  },
  'neurologist': {
    key: 'neurologist',
    displayName: 'Невролог',
    badgeClass: 'bg-purple-50 text-purple-700'
  },
  'oncologist': {
    key: 'oncologist',
    displayName: 'Онколог',
    badgeClass: 'bg-orange-50 text-orange-700'
  },
  'endocrinologist': {
    key: 'endocrinologist',
    displayName: 'Эндокринолог',
    badgeClass: 'bg-blue-50 text-blue-700'
  },
  'general_practitioner': {
    key: 'general_practitioner',
    displayName: 'Терапевт',
    badgeClass: 'bg-green-50 text-green-700'
  },
  'surgeon': {
    key: 'surgeon',
    displayName: 'Хирург',
    badgeClass: 'bg-red-50 text-red-700'
  },
  'emergency_physician': {
    key: 'emergency_physician',
    displayName: 'Врач скорой помощи',
    badgeClass: 'bg-red-100 text-red-800'
  }
};

export function getPhysicianConfig(physicianKey: string): PhysicianConfig | null {
  return PHYSICIAN_CONFIG[physicianKey] || null;
}

export function getPhysicianDisplayName(physicianKey: string): string {
  const config = getPhysicianConfig(physicianKey);
  return config?.displayName || physicianKey;
}

export function getPhysicianBadgeClass(physicianKey: string): string {
  const config = getPhysicianConfig(physicianKey);
  return config?.badgeClass || 'bg-gray-50 text-gray-700';
}

// Новая функция для получения класса по отображаемому имени
export function getPhysicianBadgeClassByDisplayName(displayName: string): string {
  // Найти конфигурацию по отображаемому имени
  const config = Object.values(PHYSICIAN_CONFIG).find(c => c.displayName === displayName);
  return config?.badgeClass || 'bg-gray-50 text-gray-700';
}