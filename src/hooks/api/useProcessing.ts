
import { useQuery } from '@tanstack/react-query';
import { processingsService } from '@/services/processingsService';
import { mapProcessingToStudy } from '@/utils/apiMappings';

export function useProcessing(uid: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['processing', uid],
    queryFn: async () => {
      // Note: There's no single processing endpoint in the API spec
      // We'll need to fetch from the list with search
      const response = await processingsService.listProcessings({
        search_query: uid,
        per_page: 1,
      });
      
      const processing = response.items.find(item => item.uid === uid);
      if (!processing) {
        throw new Error(`Processing with UID ${uid} not found`);
      }
      
      return mapProcessingToStudy(processing);
    },
    enabled: enabled && !!uid,
    staleTime: 60000, // 1 minute
  });
}
