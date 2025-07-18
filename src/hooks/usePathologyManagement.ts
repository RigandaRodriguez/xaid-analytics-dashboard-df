
import { useState } from 'react';
import { PathologyState, PathologyStatus } from '@/types/pathology';

import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

export const usePathologyManagement = (initialPathology: string | string[]) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  // Создаем состояния для каждой патологии
  const createInitialStates = () => {
    const states: Record<string, PathologyState> = {};
    
    if (Array.isArray(initialPathology)) {
      initialPathology.forEach((pathology, index) => {
        states[`pathology${index + 1}`] = {
          id: `pathology${index + 1}`,
          status: 'pending' as PathologyStatus,
          originalText: pathology,
          editedText: pathology,
          isEditing: false
        };
      });
    } else {
      states['pathology1'] = {
        id: 'pathology1',
        status: 'pending' as PathologyStatus,
        originalText: initialPathology,
        editedText: initialPathology,
        isEditing: false
      };
    }
    
    return states;
  };

  const [pathologyStates, setPathologyStates] = useState<Record<string, PathologyState>>(createInitialStates());

  const handlePathologyAction = (pathologyId: string, action: 'accept' | 'reject' | 'edit' | 'save' | 'cancel') => {
    setPathologyStates(prev => {
      const current = prev[pathologyId];
      
      switch (action) {
        case 'accept':
          console.log('Pathology accepted:', {
            pathologyId,
            action,
            text: current.editedText,
            timestamp: new Date(),
            userId: 'system'
          });
          
          toast({
            title: t('studyReport.pathologyActions.accept'),
            description: `Диагноз принят: ${current.editedText}`
          });
          
          return {
            ...prev,
            [pathologyId]: {
              ...current,
              status: 'accepted' as PathologyStatus,
              timestamp: new Date()
            }
          };
          
        case 'reject':
          console.log('Pathology rejected:', {
            pathologyId,
            action,
            text: current.originalText,
            timestamp: new Date(),
            userId: 'system'
          });
          
          toast({
            title: t('studyReport.pathologyActions.reject'),
            description: `Диагноз отклонен`
          });
          
          return {
            ...prev,
            [pathologyId]: {
              ...current,
              status: 'rejected' as PathologyStatus,
              timestamp: new Date()
            }
          };
          
        case 'edit':
          return {
            ...prev,
            [pathologyId]: {
              ...current,
              isEditing: true
            }
          };
          
        case 'save':
          if (!current.editedText.trim()) {
            toast({
              title: 'Ошибка',
              description: t('studyReport.pathologyValidation.diagnosisRequired'),
              variant: 'destructive'
            });
            return prev;
          }
          
          console.log('Pathology corrected:', {
            pathologyId,
            action,
            originalText: current.originalText,
            newText: current.editedText,
            timestamp: new Date(),
            userId: 'system'
          });
          
          toast({
            title: t('studyReport.pathologyActions.save'),
            description: `Диагноз исправлен и принят`
          });
          
          return {
            ...prev,
            [pathologyId]: {
              ...current,
              status: 'corrected' as PathologyStatus,
              isEditing: false,
              timestamp: new Date()
            }
          };
          
        case 'cancel':
          return {
            ...prev,
            [pathologyId]: {
              ...current,
              editedText: current.status === 'corrected' ? current.editedText : current.originalText,
              isEditing: false
            }
          };
          
        default:
          return prev;
      }
    });
  };

  const handlePathologyTextChange = (pathologyId: string, newText: string) => {
    setPathologyStates(prev => ({
      ...prev,
      [pathologyId]: {
        ...prev[pathologyId],
        editedText: newText
      }
    }));
  };

  const allPathologiesDecided = Object.values(pathologyStates).every(
    state => state.status !== 'pending'
  );

  return {
    pathologyStates,
    handlePathologyAction,
    handlePathologyTextChange,
    allPathologiesDecided
  };
};
