
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StudyFilters } from '@/types/study';
import { useLanguage } from '@/contexts/LanguageContext';

interface StatusTimeSectionProps {
  filters: StudyFilters;
  onFilterChange: (field: keyof StudyFilters, value: any) => void;
}

const StatusTimeSection = ({ filters, onFilterChange }: StatusTimeSectionProps) => {
  const { t } = useLanguage();

  return (
    <>
      <Select value={filters.status} onValueChange={(value) => onFilterChange('status', value)}>
        <SelectTrigger>
          <SelectValue placeholder={t('study.status')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('study.statuses.all')}</SelectItem>
          <SelectItem value="completed">{t('study.statuses.completed')}</SelectItem>
          <SelectItem value="processing">{t('study.statuses.processing')}</SelectItem>
          <SelectItem value="processing_error">{t('study.statuses.processing_error')}</SelectItem>
          <SelectItem value="precondition_error">{t('study.statuses.precondition_error')}</SelectItem>
          <SelectItem value="configuration_error">{t('study.statuses.configuration_error')}</SelectItem>
          <SelectItem value="generation_error">{t('study.statuses.generation_error')}</SelectItem>
          <SelectItem value="upload_error">{t('study.statuses.upload_error')}</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.descriptionStatus} onValueChange={(value) => onFilterChange('descriptionStatus', value)}>
        <SelectTrigger>
          <SelectValue placeholder={t('study.descriptionStatus')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('study.allStatuses')}</SelectItem>
          <SelectItem value="in_progress">{t('study.descriptionInProgress')}</SelectItem>
          <SelectItem value="completed">{t('study.descriptionCompleted')}</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="time"
        placeholder={t('study.timeFrom')}
        value={filters.timeFrom || ''}
        onChange={(e) => onFilterChange('timeFrom', e.target.value || undefined)}
      />
      <Input
        type="time"
        placeholder={t('study.timeTo')}
        value={filters.timeTo || ''}
        onChange={(e) => onFilterChange('timeTo', e.target.value || undefined)}
      />
    </>
  );
};

export default StatusTimeSection;
