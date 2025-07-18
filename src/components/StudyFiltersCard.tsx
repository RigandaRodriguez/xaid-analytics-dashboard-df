
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StudyFilters } from '@/types/study';
import { useLanguage } from '@/contexts/LanguageContext';
import { validateRevenueRange } from '@/utils/studyHelpers';
import { ru } from 'date-fns/locale';
import BasicFiltersSection from '@/components/filters/BasicFiltersSection';
import PathologyPersonnelSection from '@/components/filters/PathologyPersonnelSection';
import StatusTimeSection from '@/components/filters/StatusTimeSection';

import FilterActionsSection from '@/components/filters/FilterActionsSection';

interface StudyFiltersCardProps {
  filters: StudyFilters;
  setFilters: (filters: StudyFilters) => void;
  hasFiltersChanged: boolean;
  onResetFilters: () => void;
  onApplyFilters: () => void;
  selectedCount: number;
  onAddToReport: () => void;
}

const StudyFiltersCard = ({
  filters,
  setFilters,
  hasFiltersChanged,
  onResetFilters,
  onApplyFilters,
  selectedCount,
  onAddToReport
}: StudyFiltersCardProps) => {
  const { t, language } = useLanguage();

  // Get locale for date formatting
  const getLocale = () => {
    return ru; // Only Russian is supported
  };

  const onFilterChange = (field: keyof StudyFilters, value: any) => {
    setFilters({ ...filters, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('study.filters')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
          <BasicFiltersSection 
            filters={filters}
            onFilterChange={onFilterChange}
            getLocale={getLocale}
          />
          <PathologyPersonnelSection 
            filters={filters}
            onFilterChange={onFilterChange}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
          <StatusTimeSection 
            filters={filters}
            onFilterChange={onFilterChange}
          />
        </div>
        <FilterActionsSection
          hasFiltersChanged={hasFiltersChanged}
          selectedCount={selectedCount}
          onApplyFilters={onApplyFilters}
          onResetFilters={onResetFilters}
          onAddToReport={onAddToReport}
        />
      </CardContent>
    </Card>
  );
};

export default StudyFiltersCard;
