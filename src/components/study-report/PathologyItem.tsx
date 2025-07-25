
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Edit3, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { PathologyState, PathologyStatus } from '@/types/pathology';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslatedPathology } from '@/utils/pathologyHelpers';

interface PathologyItemProps {
  pathology: { id: string; name: string; reference: string };
  state: PathologyState;
  recommendations: Record<string, string>;
  canConfirmDiagnosis: boolean;
  isDescriptionCompleted?: boolean;
  onAction: (pathologyId: string, action: 'accept' | 'reject' | 'edit' | 'save' | 'cancel') => void;
  onTextChange: (pathologyId: string, newText: string) => void;
  onRecommendationChange: (pathologyId: string, value: string) => void;
}

const PathologyItem: React.FC<PathologyItemProps> = ({
  pathology,
  state,
  recommendations,
  canConfirmDiagnosis,
  isDescriptionCompleted = false,
  onAction,
  onTextChange,
  onRecommendationChange
}) => {
  const { t } = useLanguage();

  const getStatusIcon = (status: PathologyStatus) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'corrected':
        return <Edit3 className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusText = (status: PathologyStatus) => {
    return t(`studyReport.pathologyStatuses.${status}`);
  };

  // Get translated pathology name using the correct translation helper
  const translatedPathology = getTranslatedPathology(pathology.name);
  const translatedReference = t(`referenceValues.${pathology.name}`) || pathology.reference;
  
  // Get clinical recommendation with proper fallback handling
  const currentRecommendation = recommendations[pathology.id] || '';
  const placeholderText = currentRecommendation || t('studyReport.enterRecommendations');

  return (
    <div className="border rounded-lg p-4">
      {/* Status Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {getStatusIcon(isDescriptionCompleted ? 'accepted' : state.status)}
          <span className="font-medium">
            {getStatusText(isDescriptionCompleted ? 'accepted' : state.status)}
          </span>
          {state.timestamp && (
            <span className="text-sm text-gray-500">
              {format(state.timestamp, "dd.MM.yyyy HH:mm", { locale: ru })}
            </span>
          )}
        </div>
      </div>

      {/* Diagnosis Text */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-500 block mb-2">
          {t('studyReport.finding')}
        </label>
        {state.isEditing ? (
          <Textarea
            value={state.editedText}
            onChange={(e) => onTextChange(pathology.id, e.target.value)}
            className="mb-2"
            disabled={!canConfirmDiagnosis}
          />
        ) : (
          <div className="bg-gray-50 p-3 rounded border">
            <p className="text-sm">{translatedPathology}</p>
          </div>
        )}
      </div>

      {/* Reference Values */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-500">{t('studyReport.referenceValues')}</label>
        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded mt-1">
          {translatedReference}
        </p>
      </div>

      {/* Recommendations */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-500">{t('studyReport.recommendedActions')}</label>
        <Textarea
          value={currentRecommendation}
          onChange={(e) => onRecommendationChange(pathology.id, e.target.value)}
          placeholder={placeholderText}
          className="mt-1"
          disabled={!canConfirmDiagnosis}
        />
      </div>

      {/* Action Buttons */}
      {canConfirmDiagnosis && !isDescriptionCompleted && (
        <div className="flex gap-2 mt-4">
          {state.isEditing ? (
            <>
              <Button 
                onClick={() => onAction(pathology.id, 'save')}
                size="sm"
              >
                {t('studyReport.pathologyActions.save')}
              </Button>
              <Button 
                variant="outline"
                onClick={() => onAction(pathology.id, 'cancel')}
                size="sm"
              >
                {t('studyReport.pathologyActions.cancel')}
              </Button>
            </>
          ) : state.status === 'pending' ? (
            <>
              <Button 
                onClick={() => onAction(pathology.id, 'accept')}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                {t('studyReport.pathologyActions.accept')}
              </Button>
              <Button 
                onClick={() => onAction(pathology.id, 'reject')}
                size="sm"
                variant="destructive"
              >
                {t('studyReport.pathologyActions.reject')}
              </Button>
              <Button 
                onClick={() => onAction(pathology.id, 'edit')}
                size="sm"
                variant="outline"
              >
                <Edit3 className="w-4 h-4 mr-1" />
                {t('studyReport.pathologyActions.edit')}
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => onAction(pathology.id, 'edit')}
              size="sm"
              variant="outline"
            >
              <Edit3 className="w-4 h-4 mr-1" />
              {t('studyReport.pathologyActions.edit')}
            </Button>
          )}
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
          {t('studyReport.contactDoctor')}
        </p>
      )}
    </div>
  );
};

export default PathologyItem;
