
import React from 'react';
import { Study } from '@/types/study';
import StudyTableRow from './StudyTableRow';

interface StudyTableBodyProps {
  studies: Study[];
  selectedStudies: string[];
  onSelectStudy: (uid: string, checked: boolean) => void;
  onViewReport: (study: Study) => void;
  compactColumns: string[];
}

const StudyTableBody = ({
  studies,
  selectedStudies,
  onSelectStudy,
  onViewReport,
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
          compactColumns={compactColumns}
        />
      ))}
    </tbody>
  );
};

export default StudyTableBody;
