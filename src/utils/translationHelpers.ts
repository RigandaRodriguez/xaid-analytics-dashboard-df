import { Study } from '@/types/study';

// DEPRECATED: Use getTranslatedPathology from @/utils/pathologyHelpers instead
export const getTranslatedPathology = (pathology: string, t: (key: string) => string): string => {
  // Import the new helper to avoid duplication
  const { getPathologyDisplayName } = require('@/config/pathologyRegistry');
  
  // Map old display names to keys for backward compatibility
  const displayToKeyMap: { [key: string]: string } = {
    'Норма': 'normal',
    'Коронарный кальций': 'coronaryCalcium',
    'Расширение аорты': 'aorticDilation',
    'Остеопороз': 'osteoporosis',
    'Узлы в легких': 'lungNodules'
  };
  
  const pathologyKey = displayToKeyMap[pathology];
  if (pathologyKey) {
    return getPathologyDisplayName(pathologyKey);
  }
  
  // Fallback for unknown pathologies
  return pathology;
};

export const getTranslatedStatus = (status: string, t: (key: string) => string): string => {
  const statusMap: { [key: string]: string } = {
    'completed': t('study.statuses.completed'),
    'processing': t('study.statuses.processing'),
    'processing_error': t('study.statuses.processing_error'),
    'data_error': t('study.statuses.data_error'),
    'precondition_error': t('study.statuses.precondition_error'),
    'configuration_error': t('study.statuses.configuration_error'),
    'generation_error': t('study.statuses.generation_error'),
    'upload_error': t('study.statuses.upload_error'),
    'success': t('study.statuses.completed')
  };

  return statusMap[status] || status;
};

export const getTranslatedCriticality = (criticality: string, t: (key: string) => string): string => {
  const criticalityMap: { [key: string]: string } = {
    'high': t('criticality.high'),
    'medium': t('criticality.medium'),
    'low': t('criticality.low')
  };

  return criticalityMap[criticality] || criticality;
};

export const getTranslatedConsultation = (consultation: string, t: (key: string) => string): string => {
  const consultationMap: { [key: string]: string } = {
    'sent': t('consultation.sent'),
    'pending': t('consultation.pending'),
    'none': t('consultation.none')
  };

  return consultationMap[consultation] || consultation;
};

export const getTranslatedAppointmentStatus = (status: string, t: (key: string) => string): string => {
  const statusMap: { [key: string]: string } = {
    'not_assigned': t('appointmentStatuses.notAssigned'),
    'scheduled': t('appointmentStatuses.scheduled'),
    'completed': t('appointmentStatuses.completed'),
    'not_completed': t('appointmentStatuses.notCompleted')
  };

  return statusMap[status] || status;
};

export const getTranslatedDoctor = (doctor: string | null, t: (key: string) => string): string => {
  if (!doctor) return t('study.notAssigned');

  const doctorMap: { [key: string]: string } = {
    'Д-р Иванов А.И.': t('doctors.ivanov'),
    'Д-р Петрова М.В.': t('doctors.petrova'),
    'Д-р Сидоров В.П.': t('doctors.sidorov'),
    'Д-р Козлова Е.А.': t('doctors.kozlova'),
    'Д-р Романов С.Д.': t('doctors.romanov'),
    'Д-р Михайлова Т.П.': t('doctors.mikhailova'),
    'Д-р Федоров И.В.': t('doctors.fedorov'),
    'Д-р Николаева О.С.': t('doctors.nikolaeva')
  };

  return doctorMap[doctor] || doctor;
};

export const getTranslatedRadiologist = (radiologist: string | null, t: (key: string) => string): string => {
  if (!radiologist) return t('study.notAssigned');

  const radiologistMap: { [key: string]: string } = {
    'Д-р Смирнов К.В.': t('radiologists.smirnov'),
    'Д-р Новиков А.П.': t('radiologists.novikov'),
    'Д-р Волков И.С.': t('radiologists.volkov'),
    'Д-р Орлов Е.М.': t('radiologists.orlov'),
    'Д-р Козлов Р.А.': t('radiologists.kozlov'),
    'Д-р Лебедев В.И.': t('radiologists.lebedev'),
    'Д-р Морозов П.Т.': t('radiologists.morozov'),
    'Д-р Белов А.К.': t('radiologists.belov'),
    'Д-р Попов М.И.': t('radiologists.popov'),
    'Д-р Васильев Н.Р.': t('radiologists.vasilev')
  };

  return radiologistMap[radiologist] || radiologist;
};

export const translateStudyData = (study: any, t: (key: string) => string): any => {
  console.log('Translation debug - original study:', {
    status: study.status,
    criticality: study.criticality,
    consultation: study.consultation,
    appointmentStatus: study.appointmentStatus
  });

  // Store original values for calculations
  const originalStatus = study.status;
  const originalCriticality = study.criticality;
  const originalConsultation = study.consultation;
  const originalAppointmentStatus = study.appointmentStatus;
  const originalAssignedDoctor = study.assignedDoctor;
  const originalRadiologist = study.radiologist;
  const originalPathology = study.pathology;

  // Get translated values using the helper functions
  const translatedStatus = getTranslatedStatus(originalStatus, t);
  const translatedCriticality = getTranslatedCriticality(originalCriticality, t);
  const translatedConsultation = getTranslatedConsultation(originalConsultation, t);
  const translatedAppointmentStatus = getTranslatedAppointmentStatus(originalAppointmentStatus, t);
  const translatedDoctor = getTranslatedDoctor(originalAssignedDoctor, t);
  const translatedRadiologist = getTranslatedRadiologist(originalRadiologist, t);
  // Use new centralized pathology helper
  const { getTranslatedPathology: getPathology } = require('@/utils/pathologyHelpers');
  const translatedPathology = getPathology(originalPathology);

  console.log('Translation debug - translated values:', {
    translatedStatus,
    translatedCriticality,
    translatedConsultation,
    translatedAppointmentStatus
  });

  return {
    ...study,
    // Keep original values for calculations
    originalPathology,
    originalStatus,
    originalCriticality,
    originalConsultation,
    originalAppointmentStatus,
    originalAssignedDoctor,
    originalRadiologist,
    // Replace display values with translations
    pathology: translatedPathology,
    status: translatedStatus,
    criticality: translatedCriticality,
    consultation: translatedConsultation,
    appointmentStatus: translatedAppointmentStatus,
    assignedDoctor: translatedDoctor,
    radiologist: translatedRadiologist
  };
};
