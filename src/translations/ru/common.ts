
export default {
  accessLevels: {
    registrar: 'Регистратор',
    doctor: 'Врач',
    admin: 'Администратор'
  },
  statuses: {
    all: 'Все статусы',
    completed: 'Завершено',
    processing: 'Обработка',
    processing_error: 'Ошибка обработки',
    data_error: 'Ошибка исходных данных',
    pending: 'Ожидает'
  },
  pathologies: {
    all: 'Все патологии',
    normal: 'Норма',
    coronaryCalcium: 'Коронарный кальций',
    aorticDilation: 'Расширение аорты',
    osteoporosis: 'Остеопороз',
    lungNodules: 'Узлы в легких',
    ribFractures: 'Переломы ребер',
    pneumonia: 'Пневмония',
    coronaryCalcifications: 'Коронарные кальцинаты',
    pleuralEffusion: 'Плевральный выпот',
    pneumothorax: 'Пневмоторакс',
    tuberculosis: 'Туберкулез',
    tumor: 'Опухоль'
    // Удален раздел names - теперь используется централизованный pathologyRegistry
  },
  consultation: {
    all: 'Все направления',
    sent: 'Направлен',
    pending: 'Ожидает',
    none: 'Нет'
  },
  criticality: {
    all: 'Все критичности',
    high: 'Высокая',
    medium: 'Средняя',
    low: 'Низкая'
  },
  appointmentStatuses: {
    all: 'Все статусы назначений',
    notAssigned: 'Не назначен',
    scheduled: 'Запланирован',
    completed: 'Завершен',
    notCompleted: 'Не завершен'
  },
  specialties: {
    therapist: 'Терапевт',
    pulmonologist: 'Пульмонолог',
    thoracicSurgeon: 'Торакальный хирург',
    traumatologist: 'Травматолог',
    emergencyCare: 'Экстренная помощь',
    cardiologist: 'Кардиолог',
    neurologist: 'Невролог',
    radiologist: 'Рентгенолог',
    doNotRefer: 'Не направлять'
  },
  doctors: {
    all: 'Все врачи',
    ivanov: 'Д-р Иванов А.И.',
    petrova: 'Д-р Петрова М.В.',
    sidorov: 'Д-р Сидоров В.П.',
    kozlova: 'Д-р Козлова Е.А.',
    romanov: 'Д-р Романов С.Д.',
    mikhailova: 'Д-р Михайлова Т.П.',
    fedorov: 'Д-р Федоров И.В.',
    nikolaeva: 'Д-р Николаева О.С.'
  },
  radiologists: {
    all: 'Все рентгенологи',
    smirnov: 'Д-р Смирнов К.В.',
    novikov: 'Д-р Новиков А.П.',
    volkov: 'Д-р Волков И.С.',
    orlov: 'Д-р Орлов Е.М.',
    kozlov: 'Д-р Козлов Р.А.',
    lebedev: 'Д-р Лебедев В.И.',
    morozov: 'Д-р Морозов П.Т.',
    belov: 'Д-р Белов А.К.',
    popov: 'Д-р Попов М.И.',
    vasilev: 'Д-р Васильев Н.Р.'
  },
  currency: {
    rubles: '₽',
    symbol: '₽'
  },
  statistics: {
    title: 'Статистика исследований',
    period: 'Период',
    allStudies: 'Все исследования',
    byFilter: 'По фильтру',
    blueLineDescription: 'Синяя линия - все исследования, оранжевая линия - по фильтру',
    appliedFilters: 'Применённые фильтры',
    studiesCount: 'исследований'
  },
  navigation: {
    dashboard: 'Дашборд исследований',
    reports: 'Отчеты',
    logging: 'Логгирование',
    profile: 'Профиль',
    logout: 'Выйти',
    back: 'Назад'
  },
  header: {
    brand: 'xAID'
  }
};
