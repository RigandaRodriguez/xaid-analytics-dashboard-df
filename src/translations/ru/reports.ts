
export default {
  title: 'Отчеты',
  subtitle: 'Аналитика и экспорт данных исследований',
  dashboard: {
    title: 'Аналитический дашборд',
    subtitle: 'Ключевые показатели и визуализации',
    selectAllMetrics: 'Выбрать все метрики',
    noData: 'Нет данных для отображения',
    addStudies: 'Добавьте исследования в отчет'
  },
  metrics: {
    totalStudies: 'Количество добавленных исследований',
    pathologyStats: 'Статистика по патологиям',
    criticalityRatio: 'Соотношение критичности патологий',
    avgProcessingTime: 'Среднее время обработки исследования',
    statusRatio: 'Соотношение статусов обработки',
    consultationStats: 'Статистика консультаций',
    appointmentStats: 'Статистика приемов',
    additionalRevenue: 'Общая дополнительная выручка',
    successRate: 'Успешно обработано',
    studies: 'исследований',
    ofTotal: 'от общего количества'
  },
  statisticalReport: {
    title: 'Статистический отчет',
    subtitle: 'Сводка по статусам и находкам',
    generateReport: 'Сформировать отчет',
    specifyMetrics: 'Указать метрику в отчете',
    removeSelected: 'Убрать выбранное из отчета'
  },
  studiesTable: {
    title: 'Исследования в отчете',
    subtitle: 'Добавлено исследований',
    selected: 'Выбрано',
    headers: {
      uid: 'UID',
      patientId: 'ID пациента',
      patientName: 'ФИО пациента',
      dateTime: 'Дата / Время',
      status: 'Статус',
      pathologies: 'Патологии',
      actions: 'Действия'
    },
    removeFromReport: 'Убрать из отчета'
  },
  emptyState: {
    title: 'Отчет пуст',
    subtitle: 'Добавьте исследования из дашборда для создания отчета',
    goToDashboard: 'Перейти к дашборду'
  },
  pdf: {
    title: 'Медицинский отчет',
    createdAt: 'Дата создания',
    studiesCount: 'Количество исследований',
    metricsTitle: 'Показатели отчета',
    value: 'Значение',
    studiesTitle: 'Исследования',
    headers: {
      uid: 'UID',
      patientId: 'ID пациента',
      date: 'Дата',
      status: 'Статус',
      pathology: 'Патология',
      criticality: 'Критичность',
      additionalRevenue: 'Дополнительная выручка'
    }
  },
  messages: {
    selectMetrics: 'Выберите хотя бы одну метрику для отчета',
    excelGenerated: 'Excel отчет успешно создан и загружен',
    excelError: 'Ошибка при создании Excel отчета',
    noStudiesToExport: 'Нет исследований для экспорта',
    studyRemoved: 'Исследование удалено из отчета',
    studiesRemoved: 'Удалено {count} исследований из отчета'
  }
};
