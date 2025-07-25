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
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasUserChanges, setHasUserChanges] = useState(false);

  // Initialize states from API data only once - prevent overwrites
  useEffect(() => {
    if (pathologyData?.pathologies && !isInitialized && !hasUserChanges) {
      console.log('INITIALIZING pathology states from API');
      console.log('Raw pathology data:', pathologyData.pathologies);
      
      // Create mapped states directly from API pathologies  
      const mappedStates: Record<string, PathologyState> = {};
      pathologyData.pathologies.forEach(pathology => {
        const apiStatus = pathology.recommendation_status;
        console.log(`Mapping ${pathology.pathology_key}: API status = ${apiStatus}`);
        
        mappedStates[pathology.pathology_key] = {
          id: pathology.pathology_key,
          status: apiStatus === 'accepted' ? 'accepted' : 
                  apiStatus === 'rejected' ? 'rejected' : 'pending',
          originalText: pathologyData.pathologyNames?.find(name => name.includes(pathology.pathology_key)) || pathology.pathology_key,
          editedText: pathologyData.pathologyNames?.find(name => name.includes(pathology.pathology_key)) || pathology.pathology_key,
          isEditing: false,
          timestamp: new Date(pathology.updated_at)
        };
        
        console.log(`Mapped state for ${pathology.pathology_key}:`, mappedStates[pathology.pathology_key]);
      });
      
      setPathologyStates(mappedStates);
      setIsInitialized(true);
      console.log('Final initialized states:', mappedStates);
    }
  }, [pathologyData?.pathologies, isInitialized, hasUserChanges]);

  const handlePathologyAction = (pathologyId: string, action: 'accept' | 'reject') => {
    console.log(`=== PATHOLOGY ACTION START ===`);
    console.log(`Action: ${action} for ${pathologyId}`);
    console.log(`Current pathologyStates before action:`, pathologyStates);
    
    // Mark that user has made changes
    setHasUserChanges(true);
    
    setPathologyStates(prev => {
      const current = prev[pathologyId];
      
      if (!current) {
        console.log(`ERROR: No current state found for ${pathologyId}`);
        return prev;
      }
      
      const newStatus: PathologyStatus = action === 'accept' ? 'accepted' : 'rejected';
      
      const newState = {
        ...prev,
        [pathologyId]: {
          ...current,
          status: newStatus,
          timestamp: new Date()
        }
      };
      
      console.log('NEW pathology states after action:', newState);
      console.log(`=== PATHOLOGY ACTION END ===`);
      
      // Show toast notification
      const actionText = action === 'accept' ? 'Диагноз принят' : 'Диагноз отклонен';
      toast({
        title: t(`studyReport.pathologyActions.${action}`),
        description: actionText
      });
      
      return newState;
    });
  };

  const submitPathologyDecisions = async () => {
    console.log(`=== SUBMIT PATHOLOGY DECISIONS START ===`);
    console.log('pathologyData?.pathologies:', pathologyData?.pathologies);
    console.log('Current pathologyStates in submit:', pathologyStates);
    
    if (!pathologyData?.pathologies) {
      console.log('ERROR: No pathologyData.pathologies found');
      return;
    }

    const pathologyUpdates: PathologyUpdate[] = pathologyData.pathologies.map(pathology => {
      const localState = pathologyStates[pathology.pathology_key];
      console.log(`Processing ${pathology.pathology_key}:`);
      console.log(`  - localState:`, localState);
      console.log(`  - localState.status:`, localState?.status);
      console.log(`  - API status:`, pathology.recommendation_status);
      
      const recommendationStatus = localState?.status === 'accepted' ? 'accepted' : 
                                   localState?.status === 'rejected' ? 'rejected' : 
                                   pathology.recommendation_status; // fallback to current API status
      
      console.log(`  - Final status to send:`, recommendationStatus);
      
      return {
        pathology_key: pathology.pathology_key,
        recommendation_status: recommendationStatus
      };
    });

    const requestData: UpdateProcessingPathologiesRequest = {
      pathologies: pathologyUpdates
    };

    console.log('FINAL REQUEST DATA:', requestData);
    console.log(`=== SUBMIT PATHOLOGY DECISIONS END ===`);
    
    await updatePathologiesMutation.mutateAsync({ uid, data: requestData });
    
    // Reset user changes flag after successful submission
    setHasUserChanges(false);
    
    // Don't force re-initialization - let React Query handle updates naturally
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