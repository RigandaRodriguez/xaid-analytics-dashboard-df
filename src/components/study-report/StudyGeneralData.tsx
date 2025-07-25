
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, User, Calendar, Heart, Users, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Study } from '@/types/study';
import { getStatusBadge, getAdditionalRevenueText } from '@/utils/studyHelpers';
import { useLanguage } from '@/contexts/LanguageContext';
import { getPhysicianDisplayName, getPhysicianBadgeClassByDisplayName } from '@/config/physicianConfig';
import { getPathologyDisplayName } from '@/config/pathologyRegistry';

interface StudyGeneralDataProps {
  study: Study;
  allPathologiesDecided: boolean;
  descriptionStatus?: 'in_progress' | 'completed';
  pathologyStates?: Record<string, any>; // Add pathology states to determine rejection status
  pathologyData?: any; // Raw pathology data with recommendation_physician_key
}

const StudyGeneralData: React.FC<StudyGeneralDataProps> = ({ 
  study, 
  allPathologiesDecided, 
  descriptionStatus, 
  pathologyStates,
  pathologyData
}) => {
  const { t, language } = useLanguage();
  const isProcessing = study.status === 'processing';
  const isError = study.status === 'processing_error' || study.status === 'data_error';
  
  // Determine the diagnosis status based on pathology states
  const getDiagnosisStatus = () => {
    console.log('StudyGeneralData - getDiagnosisStatus called with:', {
      allPathologiesDecided,
      pathologyStates,
      pathologyStatesKeys: pathologyStates ? Object.keys(pathologyStates) : null
    });
    
    if (!allPathologiesDecided) {
      return t('studyReport.notReviewed');
    }
    
    if (pathologyStates) {
      const pathologyValues = Object.values(pathologyStates);
      console.log('StudyGeneralData - pathologyValues:', pathologyValues);
      
      const allRejected = pathologyValues.every((state: any) => state.status === 'rejected');
      const someAccepted = pathologyValues.some((state: any) => state.status === 'accepted');
      
      console.log('StudyGeneralData - status check:', { allRejected, someAccepted });
      
      if (allRejected) {
        return t('studyReport.pathologyStatuses.rejected');
      } else if (someAccepted) {
        return t('studyReport.diagnosisConfirmed');
      }
    }
    
    return t('studyReport.diagnosisConfirmed');
  };
  
  // Get doctor recommendations from study data
  const doctorRecommendations = study.doctorRecommendations || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('studyReport.generalData')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">{t('study.uid')}</label>
            <p className="font-mono">{study.uid}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('study.patientId')}</label>
            <p className="font-mono">{study.patientId}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('study.patientName')}</label>
            <p>{study.patientName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('study.dateTime')}</label>
            <p>{format(study.date, "dd.MM.yyyy HH:mm", { locale: ru })}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('study.status')}</label>
            <p>{getStatusBadge(study.status, t)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('study.descriptionStatus')}</label>
            <p>
              {isError ? (
                <span className="text-green-600 font-medium">{t('study.descriptionCompleted')}</span>
              ) : (descriptionStatus || study.descriptionStatus) === 'completed' ? (
                <span className="text-green-600 font-medium">{t('study.descriptionCompleted')}</span>
              ) : (
                <span className="text-yellow-600 font-medium">{t('study.descriptionInProgress')}</span>
              )}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('studyReport.finding')}</label>
            <div>
              {(() => {
                if (!pathologyStates) {
                  // Fallback to original pathology if no states available
                  return Array.isArray(study.pathology) ? 
                    study.pathology.join(', ') : 
                    study.pathology;
                }
                
                // Get only accepted pathologies with proper translations
                const acceptedPathologies = Object.entries(pathologyStates)
                  .filter(([key, state]: [string, any]) => state.status === 'accepted')
                  .map(([key, state]: [string, any]) => {
                    // Use centralized pathology registry
                    const displayName = getPathologyDisplayName(key);
                    console.log(`Translating ${key}: ${displayName}`);
                    return displayName;
                  });
                
                const allPathologiesRejected = Object.values(pathologyStates).every((state: any) => state.status === 'rejected');
                
                console.log('StudyGeneralData - finding section:', {
                  pathologyStates,
                  acceptedPathologies,
                  allPathologiesRejected,
                  studyPathology: study.pathology
                });
                
                if (allPathologiesRejected) {
                  return t('studyReport.pathologyStatuses.rejected');
                }
                
                if (acceptedPathologies.length > 0) {
                  return acceptedPathologies.join(', ');
                }
                
                return t('studyReport.pathologyStatuses.rejected');
              })()}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('studyReport.diagnosisConfirmed')}</label>
            <p>{getDiagnosisStatus()}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t('study.recommendations')}</label>
            <div className="flex flex-wrap gap-1 mt-1">
              {(() => {
                if (!pathologyStates) {
                  // Fallback to original recommendations if no states available
                  return doctorRecommendations.length > 0 ? (
                    doctorRecommendations.map((recommendation, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPhysicianBadgeClassByDisplayName(recommendation)}`}
                      >
                        {recommendation}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">{t('common.no')}</span>
                  );
                }
                
                // Check if all pathologies are rejected
                const allPathologiesRejected = Object.values(pathologyStates).every((state: any) => state.status === 'rejected');
                
                if (allPathologiesRejected) {
                  return <span className="text-gray-500">—</span>;
                }
                
                // Get recommendations only for accepted pathologies
                const acceptedRecommendations: string[] = [];
                
                if (pathologyData?.pathologies) {
                  pathologyData.pathologies.forEach((pathology: any) => {
                    const pathologyState = pathologyStates[pathology.pathology_key];
                    if (pathologyState?.status === 'accepted' && pathology.recommendation_physician_key) {
                      // Use the physician config to get proper display name from API key
                      const physicianName = getPhysicianDisplayName(pathology.recommendation_physician_key);
                      
                      console.log(`API key: ${pathology.recommendation_physician_key} → Display name: ${physicianName}`);
                      
                      if (!acceptedRecommendations.includes(physicianName)) {
                        acceptedRecommendations.push(physicianName);
                      }
                    }
                  });
                } else {
                  // Fallback to study.doctorRecommendations if pathologyData is not available
                  study.doctorRecommendations?.forEach(recommendation => {
                    if (Object.values(pathologyStates).some((state: any) => state.status === 'accepted')) {
                      acceptedRecommendations.push(recommendation);
                    }
                  });
                }
                
                console.log('StudyGeneralData - recommendations section:', {
                  pathologyStates,
                  allPathologiesRejected,
                  hasAcceptedPathologies: Object.values(pathologyStates).some((state: any) => state.status === 'accepted'),
                  acceptedRecommendations,
                  originalDoctorRecommendations: study.doctorRecommendations
                });
                
                if (acceptedRecommendations.length > 0) {
                  return acceptedRecommendations.map((recommendation, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPhysicianBadgeClassByDisplayName(recommendation)}`}
                    >
                      {recommendation}
                    </span>
                  ));
                }
                
                return <span className="text-gray-500 text-sm">{t('common.no')}</span>;
              })()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyGeneralData;
