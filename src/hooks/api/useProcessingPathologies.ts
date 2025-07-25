
import { useQuery } from '@tanstack/react-query';
import { processingsService } from '@/services/processingsService';
import { mapProcessingPathologyToPathologyState } from '@/utils/apiMappings';
import { PathologyState } from '@/types/pathology';
import { useLanguage } from '@/contexts/LanguageContext';
import { getPathologyDisplayName } from '@/config/pathologyRegistry';

export function useProcessingPathologies(uid: string, enabled: boolean = true) {
  const { t } = useLanguage();

  return useQuery({
    queryKey: ['processing-pathologies', uid],
    queryFn: async () => {
      const pathologies = await processingsService.getProcessingPathologies(uid);
      
      // Map to PathologyState format
      const pathologyStates: Record<string, PathologyState> = {};
      const pathologyNames: string[] = [];
      
      pathologies.forEach(pathology => {
        // Get pathology display name from centralized registry
        const pathologyText = getPathologyDisplayName(pathology.pathology_key);
        pathologyNames.push(pathologyText);
        
        pathologyStates[pathology.pathology_key] = mapProcessingPathologyToPathologyState(
          pathology,
          pathologyText
        );
      });
      
      return {
        pathologies,
        pathologyStates,
        pathologyNames,
      };
    },
    enabled: enabled && !!uid,
    staleTime: 30000, // 30 seconds
  });
}
