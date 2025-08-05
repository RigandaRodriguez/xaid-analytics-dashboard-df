
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Study } from '@/types/study';
import { getStatusBadge, calculateAdditionalRevenue, formatCurrency } from '@/utils/studyHelpers';
import { getPhysicianBadgeClassByDisplayName } from '@/config/physicianConfig';
import { useLanguage } from '@/contexts/LanguageContext';
import { getStudyPathologyDisplay } from '@/utils/pathologyHelpers';

interface StudyTableRowProps {
  study: Study;
  isSelected: boolean;
  onSelectStudy: (uid: string, checked: boolean) => void;
  onViewReport: (study: Study) => void;
  compactColumns: string[];
}

const StudyTableRow = ({
  study,
  isSelected,
  onSelectStudy,
  onViewReport,
  compactColumns
}: StudyTableRowProps) => {
  const { t, language } = useLanguage();

  const getTranslatedPathology = (study: Study) => {
    // Show dash when status is processing
    if (study.status === 'processing') {
      return (
        <span className="text-gray-500">—</span>
      );
    }
    
    // Check if all pathologies are rejected
    const allPathologiesRejected = study.pathologyStates && 
      Object.values(study.pathologyStates).every((state: any) => state.status === 'rejected');
    
    if (allPathologiesRejected) {
      return (
        <span className="inline-block bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs">
          {t('studyReport.pathologyStatuses.rejected')}
        </span>
      );
    }
    
    const pathologyDisplay = getStudyPathologyDisplay(study.pathology, study.pathologyKey);
    
    if (Array.isArray(study.pathology)) {
      return study.pathology.map((pathology, index) => {
        const display = getStudyPathologyDisplay(pathology, study.pathologyKey);
        return (
          <span key={`${pathology}-${index}`} className={`${display.badgeClasses} mr-1 mb-1`}>
            {display.displayText}
          </span>
        );
      });
    }
    
    return (
      <span className={pathologyDisplay.badgeClasses}>
        {pathologyDisplay.displayText}
      </span>
    );
  };

  const getTranslatedStatus = (study: Study) => {
    if (study.statusKey) {
      return getStatusBadge(study.statusKey, t);
    }
    return getStatusBadge(study.status, t);
  };

  const getDescriptionStatusBadge = (study: Study) => {
    // Show dash when status is processing
    if (study.status === 'processing') {
      return (
        <span className="text-gray-500">—</span>
      );
    }
    
    // Check if all pathologies are rejected - show as completed
    const allPathologiesRejected = study.pathologyStates && 
      Object.values(study.pathologyStates).every((state: any) => state.status === 'rejected');
    
    // Check if study has processing errors or empty pathology
    const errorStatuses = ['processing_error', 'data_error', 'precondition_error', 'configuration_error', 'generation_error', 'upload_error'];
    const isError = errorStatuses.includes(study.status) || !study.pathology || study.pathology === '';
    
    // If error, no pathology, or all pathologies rejected, show as completed
    const effectiveStatus = (isError || allPathologiesRejected) ? 'completed' : study.descriptionStatus;
    
    const statusMap = {
      'in_progress': { text: t('study.descriptionInProgress'), className: 'bg-yellow-100 text-yellow-800' },
      'completed': { text: t('study.descriptionCompleted'), className: 'bg-green-100 text-green-800' }
    };
    
    const statusInfo = statusMap[effectiveStatus as keyof typeof statusMap];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusInfo.className}`}>
        {statusInfo.text}
      </span>
    );
  };

  const getDoctorRecommendationsBadges = (recommendations?: string[], study?: Study) => {
    // Show dash when status is processing
    if (study?.status === 'processing') {
      return (
        <span className="text-gray-500">—</span>
      );
    }
    
    // Check if all pathologies are rejected
    const allPathologiesRejected = study?.pathologyStates && 
      Object.values(study.pathologyStates).every((state: any) => state.status === 'rejected');
    
    if (allPathologiesRejected) {
      return (
        <span className="text-gray-500">—</span>
      );
    }
    
    if (!recommendations || recommendations.length === 0) {
      return null;
    }

    return recommendations.map((doctor, index) => (
      <span 
        key={`${doctor}-${index}`} 
        className={`inline-block px-2 py-1 rounded-full text-xs mr-1 mb-1 ${getPhysicianBadgeClassByDisplayName(doctor)}`}
      >
        {doctor}
      </span>
    ));
  };

  return (
    <tr className={cn(
      "border-b hover:bg-gray-50 transition-colors",
      isSelected && "bg-blue-50"
    )}>
      <td className="p-4">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelectStudy(study.uid, checked as boolean)}
        />
      </td>
      <td className="p-4 font-mono text-sm">
        <button
          onClick={() => onViewReport(study)}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {study.studyInstanceUid || study.uid}
        </button>
      </td>
      <td className="p-4 font-mono text-sm">{study.patientId}</td>
      <td className="p-4 text-sm">{study.patientName}</td>
      <td className="p-4 text-sm">
        {format(study.date, "dd.MM.yyyy HH:mm", { locale: ru })}
      </td>
      <td className="p-4">{getTranslatedStatus(study)}</td>
      <td className="p-4">
        <div className="flex flex-wrap gap-1">
          {getTranslatedPathology(study)}
        </div>
      </td>
      <td className="p-4">
        <div className="flex flex-wrap gap-1">
          {getDoctorRecommendationsBadges(study.doctorRecommendations, study)}
        </div>
      </td>
      <td className="p-4">{getDescriptionStatusBadge(study)}</td>
    </tr>
  );
};

export default StudyTableRow;
