
import { useLanguage } from '@/contexts/LanguageContext';

export const useFilterOptions = () => {
  const { t } = useLanguage();

  const pathologyOptions = [
    t('pathologies.all'),
    t('pathologies.normal'),
    t('pathologies.coronaryCalcium'),
    t('pathologies.aorticDilation'),
    t('pathologies.osteoporosis'),
    t('pathologies.lungNodules'),
    t('pathologies.ribFractures')
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
