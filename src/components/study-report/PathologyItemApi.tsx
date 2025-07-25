import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { PathologyState, PathologyStatus } from '@/types/pathology';
import { ProcessingPathology } from '@/types/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { getPathologyDisplayName } from '@/config/pathologyRegistry';
import { getPhysicianDisplayName } from '@/config/physicianConfig';

interface PathologyItemApiProps {
  pathology: ProcessingPathology;
  state: PathologyState;
  canConfirmDiagnosis: boolean;
  isDescriptionCompleted?: boolean;
  getPhysicianName: (key: string) => string;
  onAction: (pathologyId: string, action: 'accept' | 'reject') => void;
}

const PathologyItemApi: React.FC<PathologyItemApiProps> = ({
  pathology,
  state,
  canConfirmDiagnosis,
  isDescriptionCompleted = false,
  getPhysicianName,
  onAction
}) => {
  const { t } = useLanguage();

  const getStatusIcon = (status: PathologyStatus) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusText = (status: PathologyStatus) => {
    return t(`studyReport.pathologyStatuses.${status}`);
  };

  // Get translated pathology name
  const translatedPathology = getPathologyDisplayName(pathology.pathology_key);
  
  // Get physician recommendation - use direct name from API if it doesn't match config
  const physicianRecommendation = getPhysicianDisplayName(pathology.recommendation_physician_key) === pathology.recommendation_physician_key 
    ? pathology.recommendation_physician_key // Use API name directly if no config found
    : getPhysicianDisplayName(pathology.recommendation_physician_key);

  return (
    <div className="border rounded-lg p-4">
      {/* Status Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {getStatusIcon(state.status)}
          <span className="font-medium">
            {getStatusText(state.status)}
          </span>
          {state.timestamp && (
            <span className="text-sm text-gray-500">
              {format(state.timestamp, "dd.MM.yyyy HH:mm", { locale: ru })}
            </span>
          )}
        </div>
      </div>

      {/* Pathology Finding */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-500 block mb-2">
          {t('studyReport.finding')}
        </label>
        <div className="bg-gray-50 p-3 rounded border">
          <p className="text-sm">{translatedPathology}</p>
        </div>
      </div>

      {/* Doctor Recommendations */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-500">
          {t('studyReport.doctorRecommendations')}
        </label>
        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded mt-1">
          {physicianRecommendation}
        </p>
      </div>

      {/* Action Buttons */}
      {canConfirmDiagnosis && !isDescriptionCompleted && (
        <div className="flex gap-2 mt-4">
          <Button 
            onClick={() => onAction(pathology.pathology_key, 'accept')}
            size="sm"
            variant={state.status === 'accepted' ? 'default' : 'outline'}
            className={state.status === 'accepted' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
          >
            {t('studyReport.pathologyActions.accept')}
          </Button>
          <Button 
            onClick={() => onAction(pathology.pathology_key, 'reject')}
            size="sm"
            variant={state.status === 'rejected' ? 'destructive' : 'outline'}
          >
            {t('studyReport.pathologyActions.reject')}
          </Button>
        </div>
      )}

      {canConfirmDiagnosis && isDescriptionCompleted && (
        <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-4">
          <p className="text-sm text-blue-700">
            {t('studyReport.descriptionCompleted')}
          </p>
        </div>
      )}

      {!canConfirmDiagnosis && (
        <p className="text-sm text-amber-600 mt-2 font-medium">
          {t('studyReport.contactRadiologist')}
        </p>
      )}
    </div>
  );
};

export default PathologyItemApi;