
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Study } from '@/types/study';

interface ReportsContextType {
  reportStudies: Study[];
  addToReport: (studies: Study[]) => void;
  removeFromReport: (studyUids: string[]) => void;
  clearReport: () => void;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};

interface ReportsProviderProps {
  children: ReactNode;
}

export const ReportsProvider = ({ children }: ReportsProviderProps) => {
  const [reportStudies, setReportStudies] = useState<Study[]>([]);

  const addToReport = (studies: Study[]) => {
    setReportStudies(prev => {
      const existingUids = new Set(prev.map(s => s.uid));
      const newStudies = studies.filter(s => !existingUids.has(s.uid));
      return [...prev, ...newStudies];
    });
  };

  const removeFromReport = (studyUids: string[]) => {
    setReportStudies(prev => prev.filter(study => !studyUids.includes(study.uid)));
  };

  const clearReport = () => {
    setReportStudies([]);
  };

  return (
    <ReportsContext.Provider value={{
      reportStudies,
      addToReport,
      removeFromReport,
      clearReport
    }}>
      {children}
    </ReportsContext.Provider>
  );
};
