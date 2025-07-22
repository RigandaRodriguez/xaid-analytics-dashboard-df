
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { processingsService } from '@/services/processingsService';
import { UpdateProcessingRequest } from '@/types/api';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export function useUpdateProcessing() {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: async ({
      uid,
      data,
    }: {
      uid: string;
      data: UpdateProcessingRequest;
    }) => {
      return processingsService.updateProcessing(uid, data);
    },
    onSuccess: (_, { uid }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['processing', uid] });
      queryClient.invalidateQueries({ queryKey: ['processings'] });
      
      toast.success(t('messages.processingUpdated'));
    },
    onError: (error: any) => {
      toast.error(error.message || t('messages.updateError'));
    },
  });
}
