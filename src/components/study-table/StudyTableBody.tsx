
import React from 'react';
import { Study } from '@/types/study';
import StudyTableRow from './StudyTableRow';

interface StudyTableBodyProps {
  studies: Study[];
  selectedStudies: string[];
  onSelectStudy: (uid: string, checked: boolean) => void;
  onViewReport: (study: Study) => void;
  viewMode: 'compact' | 'full';
  compactColumns: string[];
}

const StudyTableBody = ({
  studies,
  selectedStudies,
  onSelectStudy,
  onViewReport,
  viewMode,
  compactColumns
}: StudyTableBodyProps) => {
  return (
    <tbody>
      {studies.map((study) => (
        <StudyTableRow
          key={study.uid}
          study={study}
          isSelected={selectedStudies.includes(study.uid)}
          onSelectStudy={onSelectStudy}
          onViewReport={onViewReport}
          viewMode={viewMode}
          compactColumns={compactColumns}
        />
      ))}
    </tbody>
  );
};

export default StudyTableBody;
