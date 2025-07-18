
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StudyFilters } from '@/types/study';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFilterOptions } from '@/hooks/useFilterOptions';

interface PathologyPersonnelSectionProps {
  filters: StudyFilters;
  onFilterChange: (field: keyof StudyFilters, value: any) => void;
}

const PathologyPersonnelSection = ({ filters, onFilterChange }: PathologyPersonnelSectionProps) => {
  const { t } = useLanguage();
  const { pathologyOptions } = useFilterOptions();

  return (
    <>
      <Select value={filters.pathology} onValueChange={(value) => onFilterChange('pathology', value)}>
        <SelectTrigger>
          <SelectValue placeholder={t('study.pathologies')} />
        </SelectTrigger>
        <SelectContent>
          {pathologyOptions.map((pathology, index) => (
            <SelectItem key={index} value={pathology}>{pathology}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default PathologyPersonnelSection;
