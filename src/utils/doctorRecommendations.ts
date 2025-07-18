export const getDoctorRecommendations = (pathologies: string | string[]): string[] => {
  const pathologyList = Array.isArray(pathologies) ? pathologies : [pathologies];
  const recommendations = new Set<string>();

  pathologyList.forEach(pathology => {
    switch (pathology) {
      case 'Коронарный кальций':
        recommendations.add('Кардиолог');
        break;
      case 'Расширение аорты':
        // Randomly choose between cardiologist and cardiac surgeon for variety
        recommendations.add(Math.random() > 0.5 ? 'Кардиолог' : 'Кардиохирург');
        break;
      case 'Остеопороз':
        recommendations.add('Эндокринолог');
        break;
      case 'Узлы в легких':
        // Randomly choose between therapist and oncologist based on "node size"
        recommendations.add(Math.random() > 0.5 ? 'Терапевт' : 'Онколог');
        break;
      case 'Норма':
        // No recommendations for normal findings
        break;
      default:
        // No recommendations for unknown pathologies
        break;
    }
  });

  return Array.from(recommendations);
};

export const getDoctorBadgeClass = (doctorType: string): string => {
  const styleMap: Record<string, string> = {
    'Кардиолог': 'bg-red-50 text-red-700',
    'Кардиохирург': 'bg-red-100 text-red-800',
    'Эндокринолог': 'bg-blue-50 text-blue-700',
    'Терапевт': 'bg-green-50 text-green-700',
    'Онколог': 'bg-orange-50 text-orange-700',
  };
  
  return styleMap[doctorType] || 'bg-gray-50 text-gray-700';
};