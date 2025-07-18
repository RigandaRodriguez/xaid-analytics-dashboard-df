
import { useState } from 'react';

export const useStudyActions = () => {
  const [isAddedToReport, setIsAddedToReport] = useState(false);

  const handleAddToReport = () => {
    setIsAddedToReport(true);
  };

  return {
    isAddedToReport,
    handleAddToReport
  };
};
