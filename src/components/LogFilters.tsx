
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ru, enUS, es, de } from 'date-fns/locale';
import { LogFilters } from '@/types/logging';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLoggingFilterOptions } from '@/hooks/useLoggingFilterOptions';

interface LogFiltersProps {
  filters: LogFilters;
  setFilters: (filters: LogFilters) => void;
  hasFiltersChanged: boolean;
  onResetFilters: () => void;
  onApplyFilters: () => void;
  selectedCount: number;
  onGenerateReport: () => void;
}

const LogFiltersComponent = ({
  filters,
  setFilters,
  hasFiltersChanged,
  onResetFilters,
  onApplyFilters,
  selectedCount,
  onGenerateReport
}: LogFiltersProps) => {
  const { t, language } = useLanguage();
  const { actionOptions } = useLoggingFilterOptions();

  const getLocale = () => {
    return ru; // Only Russian is supported
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('logging.filtersTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("justify-start text-left font-normal", !filters.dateFrom && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateFrom ? format(filters.dateFrom, "dd.MM.yyyy", { locale: getLocale() }) : t('logging.dateFrom')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dateFrom}
                onSelect={(date) => setFilters({...filters, dateFrom: date})}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("justify-start text-left font-normal", !filters.dateTo && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateTo ? format(filters.dateTo, "dd.MM.yyyy", { locale: getLocale() }) : t('logging.dateTo')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dateTo}
                onSelect={(date) => setFilters({...filters, dateTo: date})}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Select value={filters.action} onValueChange={(value) => setFilters({...filters, action: value})}>
            <SelectTrigger>
              <SelectValue placeholder={t('logging.action')} />
            </SelectTrigger>
            <SelectContent>
              {actionOptions.map((action) => (
                <SelectItem key={action} value={action}>{action}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button 
            variant={hasFiltersChanged ? "default" : "outline"}
            disabled={!hasFiltersChanged}
            onClick={onApplyFilters}
          >
            {t('logging.show')}
          </Button>
          <Button 
            variant="outline"
            onClick={onResetFilters}
            disabled={!hasFiltersChanged}
          >
            {t('logging.resetFilters')}
          </Button>
          <Button 
            variant={selectedCount > 0 ? "default" : "outline"}
            disabled={selectedCount === 0}
            onClick={onGenerateReport}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          >
            {t('logging.generateReport')} ({selectedCount})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogFiltersComponent;
