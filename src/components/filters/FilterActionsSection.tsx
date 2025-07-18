
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface FilterActionsSectionProps {
  hasFiltersChanged: boolean;
  selectedCount: number;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onAddToReport: () => void;
}

const FilterActionsSection = ({
  hasFiltersChanged,
  selectedCount,
  onApplyFilters,
  onResetFilters,
  onAddToReport
}: FilterActionsSectionProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex gap-2">
      <Button 
        variant={hasFiltersChanged ? "default" : "outline"}
        disabled={!hasFiltersChanged}
        onClick={onApplyFilters}
      >
        {t('study.show')}
      </Button>
      <Button 
        variant="outline"
        onClick={onResetFilters}
        disabled={!hasFiltersChanged}
      >
        {t('study.resetFilters')}
      </Button>
      <Button 
        variant={selectedCount > 0 ? "default" : "outline"}
        disabled={selectedCount === 0}
        onClick={onAddToReport}
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
      >
        {t('study.addToReport')} ({selectedCount})
      </Button>
    </div>
  );
};

export default FilterActionsSection;
