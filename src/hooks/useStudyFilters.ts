
import { useState, useMemo } from 'react';
import { Study, StudyFilters } from '@/types/study';
import { calculateAdditionalRevenue } from '@/utils/studyHelpers';
import { useLanguage } from '@/contexts/LanguageContext';

export const useStudyFilters = (studies: Study[]) => {
  const { t } = useLanguage();
  
  const [filters, setFilters] = useState<StudyFilters>({
    uidOrPatientId: '',
    patientName: '',
    date: null,
    status: 'all',
    pathology: t('pathologies.all'),
    descriptionStatus: 'all',
    timeFrom: undefined,
    timeTo: undefined
  });

  const filteredStudies = useMemo(() => {
    return studies.filter(study => {
      const matchesUidOrPatientId = !filters.uidOrPatientId || 
        study.uid.toLowerCase().includes(filters.uidOrPatientId.toLowerCase()) ||
        study.patientId.toLowerCase().includes(filters.uidOrPatientId.toLowerCase());
      
      const matchesPatientName = !filters.patientName || 
        study.patientName.toLowerCase().includes(filters.patientName.toLowerCase());
      
      const matchesDate = !filters.date || study.date.toDateString() === filters.date.toDateString();
      const matchesStatus = filters.status === 'all' || study.status === filters.status;
      
      const matchesPathology = filters.pathology === t('pathologies.all') || 
        (Array.isArray(study.pathology) ? 
          study.pathology.some(p => p === filters.pathology || p.includes(filters.pathology)) : 
          study.pathology === filters.pathology || study.pathology.includes(filters.pathology));
      
      const matchesDescriptionStatus = filters.descriptionStatus === 'all' || study.descriptionStatus === filters.descriptionStatus;
      
      // Time filtering logic
      let matchesTime = true;
      if (filters.timeFrom || filters.timeTo) {
        const studyTime = study.date.getHours() * 60 + study.date.getMinutes();
        if (filters.timeFrom) {
          const [fromHours, fromMinutes] = filters.timeFrom.split(':').map(Number);
          const fromTime = fromHours * 60 + fromMinutes;
          if (studyTime < fromTime) matchesTime = false;
        }
        if (filters.timeTo) {
          const [toHours, toMinutes] = filters.timeTo.split(':').map(Number);
          const toTime = toHours * 60 + toMinutes;
          if (studyTime > toTime) matchesTime = false;
        }
      }
      
      
      return matchesUidOrPatientId && matchesPatientName && matchesDate && matchesStatus && matchesPathology && matchesDescriptionStatus && matchesTime;
    });
  }, [studies, filters, t]);

  const hasFiltersChanged = useMemo(() => {
    return filters.uidOrPatientId !== '' || 
           filters.patientName !== '' ||
           filters.date !== null || 
           filters.status !== 'all' || 
           filters.pathology !== t('pathologies.all') ||
           filters.descriptionStatus !== 'all' ||
           filters.timeFrom !== undefined ||
           filters.timeTo !== undefined;
  }, [filters, t]);

  const handleResetFilters = () => {
    setFilters({
      uidOrPatientId: '',
      patientName: '',
      date: null,
      status: 'all',
      pathology: t('pathologies.all'),
      descriptionStatus: 'all',
      timeFrom: undefined,
      timeTo: undefined
    });
  };

  return {
    filters,
    setFilters,
    filteredStudies,
    hasFiltersChanged,
    handleResetFilters
  };
};
