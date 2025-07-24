import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';

import { useLanguage } from '@/contexts/LanguageContext';
import { getClinicalRecommendation } from '@/utils/studyMockData';
import { usePathologyManagementApi } from '@/hooks/usePathologyManagementApi';

import { useStudyActions } from '@/hooks/useStudyActions';
import StudyGeneralData from './study-report/StudyGeneralData';
import ClinicalRecommendationsCard from './study-report/ClinicalRecommendationsCard';
import PathologiesCardApi from './study-report/PathologiesCardApi';


import StudyActionsCard from './study-report/StudyActionsCard';

const StudyReport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  console.log('StudyReport: About to use language context');
  const { t } = useLanguage();
  console.log('StudyReport: Successfully got language context');
  const study = location.state?.study;
  
  // State for description status
  const [descriptionStatus, setDescriptionStatus] = React.useState(study?.descriptionStatus || 'in_progress');

  // API-based pathology management
  const pathologyManagement = usePathologyManagementApi(study?.uid || '');


  const {
    isAddedToReport,
    handleAddToReport
  } = useStudyActions();

  // Handler for completing/unlocking description
  const handleDescriptionStatusToggle = async () => {
    if (descriptionStatus === 'in_progress' && pathologyManagement.allPathologiesDecided) {
      // Save pathology decisions before completing description
      await pathologyManagement.submitPathologyDecisions();
    }
    
    const newStatus = descriptionStatus === 'in_progress' ? 'completed' : 'in_progress';
    setDescriptionStatus(newStatus);
    
    // Invalidate queries to refresh pathology data and ensure UI consistency
    queryClient.invalidateQueries({ queryKey: ['processing-pathologies', study.uid] });
    queryClient.invalidateQueries({ queryKey: ['processing', study.uid] });
    
    console.log(`Description status changed to: ${newStatus} for study ${study.uid}`);
  };

  if (!study) {
    return <div>{t('studyReport.title')} не найдено</div>;
  }

  const isError = study.status === 'processing_error' || study.status === 'data_error';
  const isProcessing = study.status === 'processing';
  const clinicalRecommendation = study?.pathology ? getClinicalRecommendation(study.pathology) : null;
  const canConfirmDiagnosis = true; // All users can now confirm diagnosis

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => {
              // Invalidate queries to refresh dashboard data
              queryClient.invalidateQueries({ queryKey: ['processings'] });
              queryClient.invalidateQueries({ queryKey: ['processing-pathologies'] });
              navigate('/');
            }}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('studyReport.backToDashboard')}
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">{t('studyReport.title')}</h1>
        </div>

        <div className="space-y-6">
          {/* Error Banner */}
          {isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-red-800 font-medium">
                  {t('studyReport.errorOccurred', { message: study.errorMessage || t('studyReport.unknownError') })}
                </h3>
                <p className="text-red-700 text-sm mt-1">{t('studyReport.tryRetry')}</p>
              </div>
            </div>
          )}

          <StudyGeneralData 
            study={study} 
            allPathologiesDecided={pathologyManagement.allPathologiesDecided} 
            descriptionStatus={descriptionStatus}
            pathologyStates={pathologyManagement.pathologyStates}
          />

          {clinicalRecommendation && !isProcessing && !isError && (
            <ClinicalRecommendationsCard clinicalRecommendation={clinicalRecommendation} />
          )}

          <PathologiesCardApi
            study={study}
            canConfirmDiagnosis={canConfirmDiagnosis}
            descriptionStatus={descriptionStatus}
            onDescriptionStatusToggle={handleDescriptionStatusToggle}
            pathologyManagement={pathologyManagement}
          />

          <StudyActionsCard
            study={study}
            isAddedToReport={isAddedToReport}
            onAddToReport={handleAddToReport}
            canConfirmDiagnosis={canConfirmDiagnosis}
            allPathologiesDecided={pathologyManagement.allPathologiesDecided}
            descriptionStatus={descriptionStatus}
            onDescriptionStatusToggle={handleDescriptionStatusToggle}
            isSubmitting={pathologyManagement.isSubmitting}
            onGoToReports={() => navigate('/reports')}
          />
        </div>
      </div>
    </div>
  );
};

export default StudyReport;
