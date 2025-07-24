import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Study } from '@/types/study';
import { usePathologyManagementApi } from '@/hooks/usePathologyManagementApi';
import PathologyItemApi from './PathologyItemApi';

interface PathologiesCardApiProps {
  study: Study;
  canConfirmDiagnosis: boolean;
  descriptionStatus: 'in_progress' | 'completed';
  onDescriptionStatusToggle: () => void;
}

const PathologiesCardApi: React.FC<PathologiesCardApiProps> = ({
  study,
  canConfirmDiagnosis,
  descriptionStatus,
  onDescriptionStatusToggle
}) => {
  const { t } = useLanguage();
  
  const {
    pathologyStates,
    pathologyData,
    isLoading,
    error,
    handlePathologyAction,
    submitPathologyDecisions,
    allPathologiesDecided,
    getPhysicianName,
    isSubmitting
  } = usePathologyManagementApi(study.uid);

  const isError = study.status === 'processing_error' || study.status === 'data_error';
  const isProcessing = study.status === 'processing';
  const isDescriptionCompleted = descriptionStatus === 'completed';

  // Show alert if user cannot confirm diagnosis
  if (!canConfirmDiagnosis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('studyReport.pathologies')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t('studyReport.accessDeniedDescription')}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Show alert if study is processing or has errors
  if (isProcessing || isError) {
    const statusKey = isProcessing ? 'processingStatus' : 'errorStatus';
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('studyReport.pathologies')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t('studyReport.pathologiesUnavailable', { status: t(`studyReport.${statusKey}`) })}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('studyReport.pathologies')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('studyReport.pathologies')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Ошибка загрузки патологий: {error.message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const pathologies = pathologyData?.pathologies || [];

  const handleCompleteDescription = async () => {
    if (!allPathologiesDecided) {
      return;
    }
    
    await submitPathologyDecisions();
    onDescriptionStatusToggle();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('studyReport.pathologies')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pathologies.map((pathology) => {
            const state = pathologyStates[pathology.pathology_key];
            if (!state) return null;

            return (
              <PathologyItemApi
                key={pathology.pathology_key}
                pathology={pathology}
                state={state}
                canConfirmDiagnosis={canConfirmDiagnosis}
                isDescriptionCompleted={isDescriptionCompleted}
                getPhysicianName={getPhysicianName}
                onAction={handlePathologyAction}
              />
            );
          })}
          
          {pathologies.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              {t('studyReport.noPathologiesSelected')}
            </p>
          )}
          
          {!allPathologiesDecided && pathologies.length > 0 && canConfirmDiagnosis && !isDescriptionCompleted && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t('studyReport.pathologyValidation.allDecisionsRequired')}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PathologiesCardApi;