
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, X, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BulkActionsPanelProps {
  selectedCount: number;
  addedCount?: number;
  onAddToReport: () => void;
  onClear: () => void;
  onGoToReports?: () => void;
}

const BulkActionsPanel = ({ selectedCount, addedCount, onAddToReport, onClear, onGoToReports }: BulkActionsPanelProps) => {
  const { t } = useLanguage();

  if (selectedCount === 0 && !addedCount) return null;

  // Show "added studies" state
  if (addedCount && addedCount > 0) {
    return (
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 animate-slide-in-up">
        <Card className="px-6 py-4 bg-green-50 border border-green-200 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-green-800">
                {t('messages.addedToReport', { count: addedCount })}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={onClear}
                className="h-auto p-1 text-green-600 hover:text-green-800"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            
            <div className="h-6 border-l border-green-300" />
            
            {onGoToReports && (
              <Button
                size="sm"
                variant="default"
                onClick={onGoToReports}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <FileText className="w-4 h-4" />
                {t('study.goToReports')}
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 animate-slide-in-up">
      <Card className="px-6 py-4 bg-white border shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {t('bulkActions.selected')}: {selectedCount} {t('bulkActions.studies')}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClear}
              className="h-auto p-1"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="h-6 border-l border-gray-300" />
          
          <Button
            size="sm"
            variant="default"
            onClick={onAddToReport}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t('bulkActions.addToReport')}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default BulkActionsPanel;
