
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Study } from '@/types/study';
import { useLanguage } from '@/contexts/LanguageContext';
import StudyTableHeader from './study-table/StudyTableHeader';
import StudyTableBody from './study-table/StudyTableBody';

interface StudyTableCardProps {
  studies: Study[];
  selectedStudies: string[];
  onSelectStudy: (uid: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onViewReport: (study: Study) => void;
  viewMode: 'compact' | 'full';
  currentPage: number;
  totalPages: number;
}

const StudyTableCard = ({
  studies,
  selectedStudies,
  onSelectStudy,
  onSelectAll,
  onViewReport,
  viewMode,
  currentPage,
  totalPages
}: StudyTableCardProps) => {
  const { t } = useLanguage();
  const compactColumns = ['uid', 'patientId', 'patientName', 'date', 'status', 'pathology', 'recommendations', 'descriptionStatus'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('study.dashboard')}</CardTitle>
        <CardDescription>
          {t('study.page')} {currentPage} {t('study.of')} {totalPages}
          {selectedStudies.length > 0 && ` • ${t('study.selected')}: ${selectedStudies.length}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <StudyTableHeader
              selectedStudies={selectedStudies}
              totalStudies={studies.length}
              onSelectAll={onSelectAll}
              onSort={() => {}}
              viewMode={viewMode}
              compactColumns={compactColumns}
            />
            <StudyTableBody
              studies={studies}
              selectedStudies={selectedStudies}
              onSelectStudy={onSelectStudy}
              onViewReport={onViewReport}
              viewMode={viewMode}
              compactColumns={compactColumns}
            />
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyTableCard;
