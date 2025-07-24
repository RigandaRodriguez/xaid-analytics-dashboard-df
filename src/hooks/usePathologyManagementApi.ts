import { useState, useEffect } from 'react';
import { PathologyState, PathologyStatus } from '@/types/pathology';
import { useProcessingPathologies } from '@/hooks/api/useProcessingPathologies';
import { useUpdateProcessingPathologies } from '@/hooks/api/useUpdateProcessingPathologies';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { UpdateProcessingPathologiesRequest, PathologyUpdate } from '@/types/api';

export const usePathologyManagementApi = (uid: string) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const { data: pathologyData, isLoading, error } = useProcessingPathologies(uid);
  const updatePathologiesMutation = useUpdateProcessingPathologies();
  
  const [pathologyStates, setPathologyStates] = useState<Record<string, PathologyState>>({});

  // Initialize states from API data only once
  useEffect(() => {
    if (pathologyData?.pathologyStates && Object.keys(pathologyStates).length === 0) {
      console.log('Initializing pathology states from API:', pathologyData.pathologyStates);
      setPathologyStates(pathologyData.pathologyStates);
    }
  }, [pathologyData, pathologyStates]);

  const handlePathologyAction = (pathologyId: string, action: 'accept' | 'reject') => {
    console.log(`Pathology action: ${action} for ${pathologyId}`);
    
    setPathologyStates(prev => {
      const current = prev[pathologyId];
      
      if (!current) return prev;
      
      const newStatus: PathologyStatus = action === 'accept' ? 'accepted' : 'rejected';
      
      const newState = {
        ...prev,
        [pathologyId]: {
          ...current,
          status: newStatus,
          timestamp: new Date()
        }
      };
      
      console.log('Updated pathology states:', newState);
      
      toast({
        title: t(`studyReport.pathologyActions.${action}`),
        description: action === 'accept' ? 'Диагноз принят' : 'Диагноз отклонен'
      });
      
      return newState;
    });
  };

  const submitPathologyDecisions = async () => {
    if (!pathologyData?.pathologies) return;

    console.log('Current pathologyStates before submit:', pathologyStates);

    const pathologyUpdates: PathologyUpdate[] = pathologyData.pathologies.map(pathology => {
      const localState = pathologyStates[pathology.pathology_key];
      const recommendationStatus = localState?.status === 'accepted' ? 'accepted' : 
                                   localState?.status === 'rejected' ? 'rejected' : 
                                   pathology.recommendation_status; // fallback to current API status
      
      console.log(`Pathology ${pathology.pathology_key}: localState=${localState?.status}, sending=${recommendationStatus}`);
      
      return {
        pathology_key: pathology.pathology_key,
        recommendation_status: recommendationStatus
      };
    });

    const requestData: UpdateProcessingPathologiesRequest = {
      pathologies: pathologyUpdates
    };

    console.log('Submitting pathology decisions:', requestData);
    await updatePathologiesMutation.mutateAsync({ uid, data: requestData });
  };

  const allPathologiesDecided = Object.values(pathologyStates).every(
    state => state.status !== 'pending'
  );

  const getPhysicianName = (physicianKey: string): string => {
    return physicianKey; // Будет заменено в компоненте через getPhysicianDisplayName
  };

  return {
    pathologyStates,
    pathologyData,
    isLoading,
    error,
    handlePathologyAction,
    submitPathologyDecisions,
    allPathologiesDecided,
    getPhysicianName,
    isSubmitting: updatePathologiesMutation.isPending
  };
};