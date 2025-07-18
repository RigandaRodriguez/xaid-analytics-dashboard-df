
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const useConsultationRouting = (initialConsultationStatus: string) => {
  const { t } = useLanguage();
  
  const [consultationSpecialty, setConsultationSpecialty] = useState('');
  const [consultationStatus, setConsultationStatus] = useState(
    initialConsultationStatus === 'sent' ? 'sent' : 'not_sent'
  );
  const [selectedDoctor, setSelectedDoctor] = useState('');

  // Dynamic doctor list based on specialty
  const doctorsBySpecialty = {
    'therapist': [t('doctors.ivanov'), t('doctors.petrova'), t('doctors.sidorov')],
    'pulmonologist': [t('radiologists.volkov'), t('radiologists.morozov'), t('radiologists.kozlov')],
    'thoracicSurgeon': [t('radiologists.belov'), t('radiologists.orlov')],
    'traumatologist': [t('radiologists.kozlov'), t('radiologists.lebedev'), t('radiologists.popov')],
    'emergencyCare': [t('radiologists.popov'), t('radiologists.vasilev')],
    'cardiologist': [t('doctors.fedorov'), t('doctors.nikolaeva')],
    'neurologist': [t('radiologists.romanov'), t('doctors.mikhailova')],
    'radiologist': [t('radiologists.smirnov'), t('radiologists.novikov'), t('radiologists.volkov')]
  };

  const handleConsultationSubmit = () => {
    if (consultationSpecialty === 'doNotRefer') {
      setConsultationStatus('not_sent');
    } else {
      setConsultationStatus('sent');
    }
  };

  const handleSpecialtyChange = (value: string) => {
    setConsultationSpecialty(value);
    setSelectedDoctor(''); // Reset doctor selection when specialty changes
  };

  const availableDoctors = consultationSpecialty && consultationSpecialty !== 'doNotRefer' 
    ? doctorsBySpecialty[consultationSpecialty as keyof typeof doctorsBySpecialty] || []
    : [];

  return {
    consultationSpecialty,
    consultationStatus,
    selectedDoctor,
    availableDoctors,
    handleConsultationSubmit,
    handleSpecialtyChange,
    setSelectedDoctor
  };
};
