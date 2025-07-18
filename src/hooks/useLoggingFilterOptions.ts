
import { useLanguage } from '@/contexts/LanguageContext';

export const useLoggingFilterOptions = () => {
  const { t } = useLanguage();

  const actionOptions = [
    t('logging.actions.all'),
    t('logging.actions.statusChange'),
    t('logging.actions.addComment'),
    t('logging.actions.sendConsultation'),
    t('logging.actions.cancelConsultation'),
    t('logging.actions.createReport'),
    t('logging.actions.deleteStudy'),
    t('logging.actions.updatePatient')
  ];

  return {
    actionOptions
  };
};
