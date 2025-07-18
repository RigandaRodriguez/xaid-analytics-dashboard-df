
import { LogEntry } from '@/types/logging';

export const generateMockLogs = (t: (key: string, params?: Record<string, any>) => string): LogEntry[] => {

  const getTranslatedActions = () => [
    t('logging.actions.statusChange'),
    t('logging.actions.addComment'),
    t('logging.actions.sendConsultation'),
    t('logging.actions.cancelConsultation'),
    t('logging.actions.createReport'),
    t('logging.actions.deleteStudy'),
    t('logging.actions.updatePatient'),
  ];

  const getTranslatedStatuses = () => [
    t('statuses.completed'),
    t('statuses.processing'),
    t('statuses.error'),
    t('study.status.pending')
  ];

  const actions = getTranslatedActions();
  const statuses = getTranslatedStatuses();

  const logs: LogEntry[] = [];

  for (let i = 0; i < 150; i++) {
    const action = actions[Math.floor(Math.random() * actions.length)];
    const oldStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));

    logs.push({
      id: `log-${i + 1}`,
      timestamp: date,
      action,
      studyUid: `STU-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      patientId: `PAT-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      oldValue: action === t('logging.actions.statusChange') ? oldStatus : undefined,
      newValue: action === t('logging.actions.statusChange') ? newStatus : undefined,
      details: action === t('logging.actions.statusChange') 
        ? t('logging.statusChangeDetails', { oldStatus, newStatus })
        : t('logging.actionPerformed', { action }),
    });
  }

  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};
