
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert, AlertCircle } from 'lucide-react';
import { Study } from '@/types/study';
import { PathologyState } from '@/types/pathology';
import { useLanguage } from '@/contexts/LanguageContext';
import PathologyItem from './PathologyItem';

interface PathologiesCardProps {
  study: Study;
  pathologyStates: Record<string, PathologyState>;
  recommendations: Record<string, string>;
  canConfirmDiagnosis: boolean;
  allPathologiesDecided: boolean;
  descriptionStatus?: 'in_progress' | 'completed';
  onPathologyAction: (pathologyId: string, action: 'accept' | 'reject' | 'edit' | 'save' | 'cancel') => void;
  onPathologyTextChange: (pathologyId: string, newText: string) => void;
  onRecommendationChange: (pathologyId: string, value: string) => void;
}

const PathologiesCard: React.FC<PathologiesCardProps> = ({
  study,
  pathologyStates,
  recommendations,
  canConfirmDiagnosis,
  allPathologiesDecided,
  descriptionStatus = 'in_progress',
  onPathologyAction,
  onPathologyTextChange,
  onRecommendationChange
}) => {
  const { t } = useLanguage();
  const isError = study.status === 'processing_error' || study.status === 'data_error';
  const isProcessing = study.status === 'processing';

  const pathologies = isProcessing || isError ? [] : 
    Array.isArray(study.pathology) ?
      study.pathology.map((pathology, index) => ({
        id: `pathology${index + 1}`,
        name: pathology,
        reference: 'На основе МКБ-10: Плевральный выпот (J94.8). Нормальное количество плевральной жидкости: менее 20 мл'
      })) :
      [{
        id: 'pathology1',
        name: study.pathology,
        reference: 'На основе МКБ-10: Плевральный выпот (J94.8). Нормальное количество плевральной жидкости: менее 20 мл'
      }];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('studyReport.pathologies')}</CardTitle>
      </CardHeader>
      <CardContent>
        {!canConfirmDiagnosis && (
          <Alert className="mb-4 border-yellow-200 bg-yellow-50">
            <ShieldAlert className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">{t('studyReport.accessDenied')}</AlertTitle>
            <AlertDescription className="text-yellow-700">
              {t('studyReport.accessDeniedDescription')}
            </AlertDescription>
          </Alert>
        )}

        {isProcessing || isError ? (
          <div className="text-center py-8 text-gray-500">
            <p>
              {t('studyReport.pathologiesUnavailable', { 
                status: isProcessing ? t('studyReport.processingStatus') : t('studyReport.errorStatus') 
              })}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pathologies.map((pathology) => {
              const state = pathologyStates[pathology.id];
              if (!state) return null;

              return (
                <PathologyItem
                  key={pathology.id}
                  pathology={pathology}
                  state={state}
                  recommendations={recommendations}
                  canConfirmDiagnosis={canConfirmDiagnosis}
                  isDescriptionCompleted={descriptionStatus === 'completed'}
                  onAction={onPathologyAction}
                  onTextChange={onPathologyTextChange}
                  onRecommendationChange={onRecommendationChange}
                />
              );
            })}
            
            <p className="text-sm text-gray-500 mt-4">
              {t('studyReport.basedOnProtocols')}
            </p>

            {!allPathologiesDecided && canConfirmDiagnosis && descriptionStatus !== 'completed' && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-700">
                  {t('studyReport.pathologyValidation.allDecisionsRequired')}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PathologiesCard;
