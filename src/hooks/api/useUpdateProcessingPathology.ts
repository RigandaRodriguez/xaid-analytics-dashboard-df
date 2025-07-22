
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { processingsService } from '@/services/processingsService';
import { UpdateProcessingPathologyRequest } from '@/types/api';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export function useUpdateProcessingPathology() {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: async ({
      uid,
      pathologyKey,
      data,
    }: {
      uid: string;
      pathologyKey: string;
      data: UpdateProcessingPathologyRequest;
    }) => {
      return processingsService.updateProcessingPathology(uid, pathologyKey, data);
    },
    onSuccess: (_, { uid }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['processing-pathologies', uid] });
      queryClient.invalidateQueries({ queryKey: ['processing', uid] });
      queryClient.invalidateQueries({ queryKey: ['processings'] });
      
      toast.success(t('messages.pathologyUpdated'));
    },
    onError: (error: any) => {
      toast.error(error.message || t('messages.updateError'));
    },
  });
}
