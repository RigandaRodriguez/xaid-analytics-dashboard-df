
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';

interface StudyTableHeaderProps {
  selectedStudies: string[];
  totalStudies: number;
  onSelectAll: (checked: boolean) => void;
  onSort: (field: string) => void;
  compactColumns: string[];
}

const StudyTableHeader = ({
  selectedStudies,
  totalStudies,
  onSelectAll,
  onSort,
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
        <th className="text-left p-4 font-medium bg-white">{t('study.uid')}</th>
        <th className="text-left p-4 font-medium bg-white">{t('study.patientId')}</th>
        <th className="text-left p-4 font-medium bg-white">{t('study.patientName')}</th>
        <th className="text-left p-4 font-medium bg-white">{t('study.dateTime')}</th>
        <th className="text-left p-4 font-medium bg-white">{t('study.status')}</th>
        <th className="text-left p-4 font-medium bg-white">{t('study.pathologies')}</th>
        <th className="text-left p-4 font-medium bg-white">{t('study.recommendations')}</th>
        <th className="text-left p-4 font-medium bg-white">{t('study.descriptionStatus')}</th>
      </tr>
    </thead>
  );
};

export default StudyTableHeader;
