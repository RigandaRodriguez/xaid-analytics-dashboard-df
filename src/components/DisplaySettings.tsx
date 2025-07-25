
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, LayoutGrid } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface DisplaySettingsProps {
  recordsPerPage: number;
  onRecordsPerPageChange: (value: number) => void;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  onSortChange: (field: string, direction: 'asc' | 'desc') => void;
  totalRecords: number;
  currentPage: number;
  startRecord: number;
  endRecord: number;
  viewMode?: 'compact' | 'full';
  onViewModeChange?: (mode: 'compact' | 'full') => void;
}

const DisplaySettings = ({
  recordsPerPage,
  onRecordsPerPageChange,
  sortBy,
  sortDirection,
  onSortChange,
  totalRecords,
  currentPage,
  startRecord,
  endRecord,
  viewMode,
  onViewModeChange
}: DisplaySettingsProps) => {
  const { t } = useLanguage();

  const sortOptions = [
    { value: 'date', label: t('displaySettings.sortOptions.date') },
    { value: 'uid', label: t('displaySettings.sortOptions.uid') },
    { value: 'patientId', label: t('displaySettings.sortOptions.patientId') },
    { value: 'status', label: t('displaySettings.sortOptions.status') }
  ];

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Records per page */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{t('displaySettings.recordsPerPage')}:</span>
              <Select value={recordsPerPage.toString()} onValueChange={(value) => onRecordsPerPageChange(Number(value))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{t('displaySettings.sorting')}:</span>
              <Select value={sortBy} onValueChange={(value) => onSortChange(value, sortDirection)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSortChange(sortBy, sortDirection === 'asc' ? 'desc' : 'asc')}
              >
                {sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>

          </div>

          {/* Records info */}
          <div className="text-sm text-gray-600">
            {t('displaySettings.showing')} {startRecord}-{endRecord} {t('displaySettings.of')} {totalRecords}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisplaySettings;
