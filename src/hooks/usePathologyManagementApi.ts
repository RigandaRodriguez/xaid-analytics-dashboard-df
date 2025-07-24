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

  // Initialize states from API data
  useEffect(() => {
    if (pathologyData?.pathologyStates) {
      setPathologyStates(pathologyData.pathologyStates);
    }
  }, [pathologyData]);

  const handlePathologyAction = (pathologyId: string, action: 'accept' | 'reject') => {
    setPathologyStates(prev => {
      const current = prev[pathologyId];
      
      if (!current) return prev;
      
      const newStatus: PathologyStatus = action === 'accept' ? 'accepted' : 'rejected';
      
      toast({
        title: t(`studyReport.pathologyActions.${action}`),
        description: action === 'accept' ? 'Диагноз принят' : 'Диагноз отклонен'
      });
      
      return {
        ...prev,
        [pathologyId]: {
          ...current,
          status: newStatus,
          timestamp: new Date()
        }
      };
    });
  };

  const submitPathologyDecisions = async () => {
    if (!pathologyData?.pathologies) return;

    const pathologyUpdates: PathologyUpdate[] = pathologyData.pathologies.map(pathology => ({
      pathology_key: pathology.pathology_key,
      recommendation_status: pathologyStates[pathology.pathology_key]?.status === 'accepted' ? 'accepted' : 'rejected'
    }));

    const requestData: UpdateProcessingPathologiesRequest = {
      pathologies: pathologyUpdates
    };

    await updatePathologiesMutation.mutateAsync({ uid, data: requestData });
  };

  const allPathologiesDecided = Object.values(pathologyStates).every(
    state => state.status !== 'pending'
  );

  const getPhysicianName = (physicianKey: string): string => {
    const translationKey = `physicians.${physicianKey}`;
    const translated = t(translationKey);
    return translated !== translationKey ? translated : physicianKey;
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