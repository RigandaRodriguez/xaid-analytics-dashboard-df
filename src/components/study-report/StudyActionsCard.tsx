
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, Plus, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface StudyActionsCardProps {
  study?: any;
  isAddedToReport: boolean;
  onAddToReport: () => void;
  canConfirmDiagnosis?: boolean;
  allPathologiesDecided?: boolean;
  descriptionStatus?: 'in_progress' | 'completed';
  onDescriptionStatusToggle?: () => void;
  onGoToReports?: () => void;
}

const StudyActionsCard: React.FC<StudyActionsCardProps> = ({ 
  study, 
  isAddedToReport, 
  onAddToReport, 
  canConfirmDiagnosis, 
  allPathologiesDecided,
  descriptionStatus = 'in_progress',
  onDescriptionStatusToggle,
  onGoToReports
}) => {
  const { t } = useLanguage();

  const isDescriptionCompleted = descriptionStatus === 'completed';
  // Only allow description toggle if study is completed successfully
  const isStudyProcessed = study?.status === 'completed';
  const canToggleDescription = canConfirmDiagnosis && isStudyProcessed && (isDescriptionCompleted || allPathologiesDecided);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('studyReport.actions')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={onAddToReport}
            disabled={isAddedToReport}
            variant={isAddedToReport ? "outline" : "default"}
          >
            <Plus className="w-4 h-4 mr-2" />
            {isAddedToReport ? t('studyReport.studyInReport') : t('studyReport.addToReport')}
          </Button>
          
          {onGoToReports && (
            <Button
              onClick={onGoToReports}
              variant="outline"
            >
              <FileText className="w-4 h-4 mr-2" />
              {t('studyReport.goToReports')}
            </Button>
          )}
          
          {canConfirmDiagnosis && (
            <Button 
              onClick={onDescriptionStatusToggle}
              disabled={!canToggleDescription}
              variant={canToggleDescription ? "default" : "outline"}
              className={canToggleDescription ? 
                (isDescriptionCompleted ? 
                  "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300" :
                  "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                ) : 
                "border-2 border-gray-300 text-gray-500"
              }
            >
              {isDescriptionCompleted ? t('studyReport.makeChanges') : t('studyReport.completeDescription')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyActionsCard;
