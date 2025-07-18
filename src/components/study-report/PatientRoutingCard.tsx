
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PatientRoutingCardProps {
  consultationStatus: string;
  consultationSpecialty: string;
  selectedDoctor: string;
  availableDoctors: string[];
  onSpecialtyChange: (value: string) => void;
  onDoctorChange: (value: string) => void;
  onConsultationSubmit: () => void;
}

const PatientRoutingCard: React.FC<PatientRoutingCardProps> = ({
  consultationStatus,
  consultationSpecialty,
  selectedDoctor,
  availableDoctors,
  onSpecialtyChange,
  onDoctorChange,
  onConsultationSubmit
}) => {
  const { t } = useLanguage();

  const specialties = [
    { key: 'therapist', label: t('specialties.therapist') },
    { key: 'pulmonologist', label: t('specialties.pulmonologist') },
    { key: 'thoracicSurgeon', label: t('specialties.thoracicSurgeon') },
    { key: 'traumatologist', label: t('specialties.traumatologist') },
    { key: 'emergencyCare', label: t('specialties.emergencyCare') },
    { key: 'cardiologist', label: t('specialties.cardiologist') },
    { key: 'neurologist', label: t('specialties.neurologist') },
    { key: 'radiologist', label: t('specialties.radiologist') },
    { key: 'doNotRefer', label: t('specialties.doNotRefer') }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('studyReport.patientRouting')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-500">{t('studyReport.consultationReferral')}</label>
            <p className="mt-1">
              <span className={`font-medium ${consultationStatus === 'sent' ? 'text-green-600' : 'text-gray-600'}`}>
                {consultationStatus === 'sent' ? t('studyReport.referred') : t('studyReport.notReferred')}
              </span>
            </p>
          </div>
          
          <div className="flex gap-3">
            <Select value={consultationSpecialty} onValueChange={onSpecialtyChange}>
              <SelectTrigger className="w-60">
                <SelectValue placeholder={t('studyReport.selectSpecialty')} />
              </SelectTrigger>
              <SelectContent>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty.key} value={specialty.key}>
                    {specialty.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {availableDoctors.length > 0 && (
              <Select value={selectedDoctor} onValueChange={onDoctorChange}>
                <SelectTrigger className="w-60">
                  <SelectValue placeholder={t('studyReport.selectDoctor')} />
                </SelectTrigger>
                <SelectContent>
                  {availableDoctors.map((doctor) => (
                    <SelectItem key={doctor} value={doctor}>
                      {doctor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            <Button 
              onClick={onConsultationSubmit}
              disabled={!consultationSpecialty || (consultationSpecialty !== 'doNotRefer' && !selectedDoctor)}
            >
              {consultationStatus === 'sent' ? t('studyReport.changeRouting') : t('studyReport.refer')}
            </Button>
          </div>
          
          {/* MIS and CRM Links */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="space-y-3">
              <div>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={() => window.open('#', '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {t('studyReport.goToMIS')}
                </Button>
              </div>
              <div>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-purple-600 border-purple-200 hover:bg-purple-50"
                  onClick={() => window.open('#', '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {t('studyReport.goToCRM')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientRoutingCard;
