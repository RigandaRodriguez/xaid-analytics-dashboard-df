
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { StudyFilters } from '@/types/study';
import { useLanguage } from '@/contexts/LanguageContext';

interface BasicFiltersSectionProps {
  filters: StudyFilters;
  onFilterChange: (field: keyof StudyFilters, value: any) => void;
  getLocale: () => any;
}

const BasicFiltersSection = ({ filters, onFilterChange, getLocale }: BasicFiltersSectionProps) => {
  const { t } = useLanguage();

  return (
    <>
      <Input
        placeholder={t('study.uidOrPatientId')}
        value={filters.uidOrPatientId}
        onChange={(e) => onFilterChange('uidOrPatientId', e.target.value)}
      />
      <Input
        placeholder={t('study.searchByName')}
        value={filters.patientName}
        onChange={(e) => onFilterChange('patientName', e.target.value)}
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("justify-start text-left font-normal", !filters.date && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {filters.date ? format(filters.date, "dd.MM.yyyy", { locale: getLocale() }) : t('study.date')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={filters.date}
            onSelect={(date) => onFilterChange('date', date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Select value={filters.status} onValueChange={(value) => onFilterChange('status', value)}>
        <SelectTrigger>
          <SelectValue placeholder={t('study.status')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('statuses.all')}</SelectItem>
          <SelectItem value="completed">{t('statuses.completed')}</SelectItem>
          <SelectItem value="processing">{t('statuses.processing')}</SelectItem>
          <SelectItem value="error">{t('statuses.error')}</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};

export default BasicFiltersSection;
