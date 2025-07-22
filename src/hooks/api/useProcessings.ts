
import { useQuery } from '@tanstack/react-query';
import { processingsService } from '@/services/processingsService';
import { ProcessingsListParams } from '@/types/api';
import { mapProcessingToStudy } from '@/utils/apiMappings';
import { Study } from '@/types/study';

export interface UseProcessingsOptions extends ProcessingsListParams {
  enabled?: boolean;
}

export function useProcessings(options: UseProcessingsOptions = {}) {
  const { enabled = true, ...params } = options;

  return useQuery({
    queryKey: ['processings', params],
    queryFn: async () => {
      const response = await processingsService.listProcessings(params);
      
      // Map API data to UI format
      const studies: Study[] = response.items.map(mapProcessingToStudy);
      
      return {
        studies,
        pagination: {
          page: response.page,
          perPage: response.per_page,
          total: response.total,
          totalPages: Math.ceil(response.total / response.per_page),
        },
      };
    },
    enabled,
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
  });
}
