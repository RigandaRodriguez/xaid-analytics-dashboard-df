
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';

interface StudyTableHeaderProps {
  selectedStudies: string[];
  totalStudies: number;
  onSelectAll: (checked: boolean) => void;
  onSort: (field: string) => void;
  viewMode: 'compact' | 'full';
  compactColumns: string[];
}

const StudyTableHeader = ({
  selectedStudies,
  totalStudies,
  onSelectAll,
  onSort,
  viewMode,
  compactColumns
}: StudyTableHeaderProps) => {
  const { t } = useLanguage();

  return (
    <thead className="sticky top-0 z-20 bg-white border-b shadow-sm">
      <tr>
        <th className="text-left p-4 font-medium w-12 bg-white">
          <Checkbox
            checked={selectedStudies.length === totalStudies && totalStudies > 0}
            onCheckedChange={onSelectAll}
          />
        </th>
        {(viewMode === 'full' || compactColumns.includes('uid')) && (
          <th className="text-left p-4 font-medium bg-white">{t('study.uid')}</th>
        )}
        {(viewMode === 'full' || compactColumns.includes('patientId')) && (
          <th className="text-left p-4 font-medium bg-white">{t('study.patientId')}</th>
        )}
        {(viewMode === 'full' || compactColumns.includes('patientName')) && (
          <th className="text-left p-4 font-medium bg-white">{t('study.patientName')}</th>
        )}
        {(viewMode === 'full' || compactColumns.includes('date')) && (
          <th className="text-left p-4 font-medium bg-white">{t('study.dateTime')}</th>
        )}
        {(viewMode === 'full' || compactColumns.includes('status')) && (
          <th className="text-left p-4 font-medium bg-white">{t('study.status')}</th>
        )}
        {(viewMode === 'full' || compactColumns.includes('pathology')) && (
          <th className="text-left p-4 font-medium bg-white">{t('study.pathologies')}</th>
        )}
        {(viewMode === 'full' || compactColumns.includes('recommendations')) && (
          <th className="text-left p-4 font-medium bg-white">{t('study.recommendations')}</th>
        )}
        {(viewMode === 'full' || compactColumns.includes('descriptionStatus')) && (
          <th className="text-left p-4 font-medium bg-white">{t('study.descriptionStatus')}</th>
        )}
      </tr>
    </thead>
  );
};

export default StudyTableHeader;
