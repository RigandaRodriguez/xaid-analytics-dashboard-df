
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LogDisplaySettingsProps {
  recordsPerPage: number;
  onRecordsPerPageChange: (value: number) => void;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  onSortChange: (field: string, direction: 'asc' | 'desc') => void;
  viewMode: 'compact' | 'full';
  onViewModeChange: (mode: 'compact' | 'full') => void;
  startRecord: number;
  endRecord: number;
  totalRecords: number;
}

const LogDisplaySettings = ({
  recordsPerPage,
  onRecordsPerPageChange,
  sortBy,
  sortDirection,
  onSortChange,
  viewMode,
  onViewModeChange,
  startRecord,
  endRecord,
  totalRecords
}: LogDisplaySettingsProps) => {
  const { t } = useLanguage();

  const recordsOptions = [10, 25, 50, 100];
  
  const sortOptions = [
    { value: 'timestamp', label: t('logging.timestamp') },
    { value: 'user', label: t('logging.user') },
    { value: 'action', label: t('logging.action') },
    { value: 'studyUid', label: t('logging.studyUid') },
    { value: 'patientId', label: t('logging.patientId') },
    { value: 'accessLevel', label: t('logging.accessLevel') }
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{t('displaySettings.recordsPerPage')}:</span>
              <Select 
                value={recordsPerPage.toString()} 
                onValueChange={(value) => onRecordsPerPageChange(Number(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {recordsOptions.map(option => (
                    <SelectItem key={option} value={option.toString()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{t('displaySettings.sorting')}:</span>
              <Select 
                value={sortBy} 
                onValueChange={(value) => onSortChange(value, sortDirection)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
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
                {sortDirection === 'asc' ? '↑' : '↓'}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{t('displaySettings.mode')}:</span>
              <div className="flex rounded-md border">
                <Button
                  variant={viewMode === 'full' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewModeChange('full')}
                  className="rounded-r-none"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'compact' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewModeChange('compact')}
                  className="rounded-l-none"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            {t('displaySettings.showing')} {startRecord}-{endRecord} {t('displaySettings.of')} {totalRecords}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogDisplaySettings;
