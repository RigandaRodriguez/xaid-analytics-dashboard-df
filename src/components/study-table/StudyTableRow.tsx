
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Study } from '@/types/study';
import { getStatusBadge, calculateAdditionalRevenue, formatCurrency } from '@/utils/studyHelpers';
import { getPhysicianBadgeClassByDisplayName } from '@/config/physicianConfig';
import { useLanguage } from '@/contexts/LanguageContext';

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
    
    if (Array.isArray(study.pathology)) {
      return study.pathology.map((pathology, index) => (
        <span key={`${pathology}-${index}`} className="inline-block bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs mr-1 mb-1">
          {pathology}
        </span>
      ));
    }
    if (study.pathologyKey) {
      return (
        <span className="inline-block bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs">
          {t(`pathologies.names.${study.pathologyKey}`)}
        </span>
      );
    }
    return (
      <span className="inline-block bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs">
        {study.pathology}
      </span>
    );
  };

  const getTranslatedStatus = (study: Study) => {
    if (study.statusKey) {
      return getStatusBadge(study.statusKey, t);
    }
    return getStatusBadge(study.status, t);
  };

  const getDescriptionStatusBadge = (status: 'in_progress' | 'completed') => {
    const statusMap = {
      'in_progress': { text: t('study.descriptionInProgress'), className: 'bg-yellow-100 text-yellow-800' },
      'completed': { text: t('study.descriptionCompleted'), className: 'bg-green-100 text-green-800' }
    };
    
    const statusInfo = statusMap[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.text}
      </span>
    );
  };

  const getDoctorRecommendationsBadges = (recommendations?: string[], study?: Study) => {
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
          {study.uid}
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
      <td className="p-4">{getDescriptionStatusBadge(study.descriptionStatus)}</td>
    </tr>
  );
};

export default StudyTableRow;
