import { useMutation, useQueryClient } from '@tanstack/react-query';
import { processingsService } from '@/services/processingsService';
import { UpdateProcessingPathologiesRequest, ProcessingPathology } from '@/types/api';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export function useUpdateProcessingPathologies() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: async ({ uid, data }: { uid: string; data: UpdateProcessingPathologiesRequest }) => {
      return processingsService.updateProcessingPathologies(uid, data);
    },
    onSuccess: (data: ProcessingPathology[], variables) => {
      // Invalidate and refetch processing pathologies and main dashboard
      queryClient.invalidateQueries({ queryKey: ['processing-pathologies', variables.uid] });
      queryClient.invalidateQueries({ queryKey: ['processing', variables.uid] });
      queryClient.invalidateQueries({ queryKey: ['processings'] }); // Refresh main dashboard
      
      toast({
        title: t('studyReport.completeDescription'),
        description: 'Решения по патологиям успешно сохранены',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Ошибка',
        description: `Не удалось сохранить решения: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
}