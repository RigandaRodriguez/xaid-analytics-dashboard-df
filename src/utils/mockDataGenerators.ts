
import { Study } from '@/types/study';
import { getClinicalRecommendation } from './clinicalRecommendations';
import { getDoctorRecommendations } from './doctorRecommendations';
import { PATHOLOGY_KEYS, STATUS_KEYS } from './translationKeys';

const mockPatientNames = [
  'Иванов Иван Иванович',
  'Петрова Анна Сергеевна',
  'Сидоров Михаил Петрович',
  'Козлова Елена Владимировна',
  'Новиков Алексей Дмитриевич',
  'Морозова Ольга Николаевна',
  'Волков Дмитрий Александрович',
  'Лебедева Татьяна Игоревна',
  'Соколов Сергей Викторович',
  'Зайцева Наталья Андреевна',
  'Федоров Андрей Олегович',
  'Васильева Мария Юрьевна',
  'Григорьев Николай Иванович',
  'Тихонова Светлана Павловна',
  'Орлов Роман Сергеевич'
];

export const generateMockStudies = (): Study[] => {
  const studies: Study[] = [];
  const statsByDate = {
    '2023-05-20': 12, '2023-05-21': 18, '2023-05-22': 8, '2023-05-23': 25, '2023-05-24': 32,
    '2023-05-25': 28, '2023-05-26': 35, '2023-05-27': 22, '2023-05-28': 40, '2023-05-29': 38,
    '2023-05-30': 45, '2023-05-31': 42, '2023-06-01': 38, '2023-06-02': 50, '2023-06-03': 48,
    '2023-06-04': 52
  };

  const pathologies = [
    { name: 'Норма', weight: 40 },
    { name: 'Коронарный кальций', weight: 20 },
    { name: 'Остеопороз', weight: 15 },
    { name: 'Узлы в легких', weight: 15 },
    { name: 'Расширение аорты', weight: 10 }
  ];


  const statuses = [
    { name: 'completed', weight: 70 },
    { name: 'processing', weight: 20 },
    { name: 'processing_error', weight: 5 },
    { name: 'data_error', weight: 5 }
  ];


  const getWeightedRandom = (items: { name: string; weight: number }[]) => {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    const random = Math.random() * totalWeight;
    let currentWeight = 0;
    
    for (const item of items) {
      currentWeight += item.weight;
      if (random <= currentWeight) {
        return item;
      }
    }
    return items[0];
  };

  let uidCounter = 1234;
  let patientCounter = 456789;

  Object.entries(statsByDate).forEach(([dateStr, count]) => {
    for (let i = 0; i < count; i++) {
      const date = new Date(dateStr);
      const hours = 8 + Math.floor(Math.random() * 10);
      const minutes = Math.floor(Math.random() * 60);
      date.setHours(hours, minutes);

      const statusObj = getWeightedRandom(statuses);

      const errorMessages = ['неполная серия', 'низкое качество изображения', 'артефакты движения', 'технический сбой'];
      const errorMessage = (statusObj.name === 'processing_error' || statusObj.name === 'data_error') ? errorMessages[Math.floor(Math.random() * errorMessages.length)] : undefined;

      // Логика выбора патологий
      let selectedPathologies: string[] = [];
      
      // Сначала выбираем случайную патологию
      const firstPathology = getWeightedRandom(pathologies);
      
      if (firstPathology.name === 'Норма') {
        // Если норма - только она одна
        selectedPathologies = ['Норма'];
      } else {
        // Если не норма, то исключаем норму из дальнейшего выбора
        const nonNormalPathologies = pathologies.filter(p => p.name !== 'Норма');
        selectedPathologies.push(firstPathology.name);
        
        // Случайно добавляем еще 0-1 патологию (всего 1-2)
        const additionalCount = Math.floor(Math.random() * 2); // 0 or 1
        for (let j = 0; j < additionalCount; j++) {
          // Убираем уже выбранные патологии из доступных
          const availablePathologies = nonNormalPathologies.filter(p => !selectedPathologies.includes(p.name));
          if (availablePathologies.length > 0) {
            // Используем простой случайный выбор вместо взвешенного для избежания дублирования
            const randomIndex = Math.floor(Math.random() * availablePathologies.length);
            selectedPathologies.push(availablePathologies[randomIndex].name);
          }
        }
      }

      const clinicalRecommendation = statusObj.name === 'completed' ? getClinicalRecommendation(selectedPathologies[0]) : null;
      const doctorRecommendations = getDoctorRecommendations(selectedPathologies);

      studies.push({
        uid: `UID-2023-${String(uidCounter).padStart(6, '0')}`,
        patientId: `PAT-${patientCounter}`,
        patientName: mockPatientNames[Math.floor(Math.random() * mockPatientNames.length)],
        date,
        status: statusObj.name,
        pathology: selectedPathologies.length === 1 ? selectedPathologies[0] : selectedPathologies,
        descriptionStatus: Math.random() > 0.3 ? 'completed' : 'in_progress',
        errorMessage,
        clinicalRecommendations: clinicalRecommendation?.recommendation,
        doctorRecommendations,
        pathologyDecisions: [],
        // Add translation keys with consistent mapping
        pathologyKey: PATHOLOGY_KEYS[selectedPathologies[0] as keyof typeof PATHOLOGY_KEYS],
        statusKey: STATUS_KEYS[statusObj.name as keyof typeof STATUS_KEYS],
      } as Study);

      uidCounter++;
      patientCounter++;
    }
  });

  return studies;
};
