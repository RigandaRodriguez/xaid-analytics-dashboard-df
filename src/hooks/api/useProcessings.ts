
import { useQuery } from '@tanstack/react-query';
import { processingsService } from '@/services/processingsService';
import { ProcessingsListParams, ProcessingPathology } from '@/types/api';
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
      
      // Загружаем патологии для каждого исследования
      const studiesWithPathologies = await Promise.all(
        response.items.map(async (processing) => {
          try {
            const pathologies = await processingsService.getProcessingPathologies(processing.uid);
            return mapProcessingToStudy(processing, pathologies);
          } catch (error) {
            // Если не удалось загрузить патологии, возвращаем исследование без них
            console.warn(`Failed to load pathologies for processing ${processing.uid}:`, error);
            return mapProcessingToStudy(processing);
          }
        })
      );
      
      return {
        studies: studiesWithPathologies,
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
