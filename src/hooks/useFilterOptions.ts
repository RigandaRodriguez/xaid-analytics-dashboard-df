
import { useLanguage } from '@/contexts/LanguageContext';
import { getAllPathologyOptions } from '@/utils/pathologyHelpers';

export const useFilterOptions = () => {
  const { t } = useLanguage();

  // Получаем опции патологий из централизованного реестра
  const allPathologyOptions = getAllPathologyOptions();
  const pathologyOptions = [
    t('pathologies.all'),
    ...allPathologyOptions.map(p => p.displayName)
  ];


  const appointmentStatusOptions = [
    t('appointmentStatuses.all'),
    t('appointmentStatuses.notAssigned'),
    t('appointmentStatuses.scheduled'),
    t('appointmentStatuses.completed'),
    t('appointmentStatuses.notCompleted')
  ];

  return {
    pathologyOptions,
    appointmentStatusOptions
  };
};
