
import React, { useState, useMemo } from 'react';
import { ru, enUS, es, de } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import NavigationTabs from '@/components/NavigationTabs';
import { useReports } from '@/contexts/ReportsContext';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { translateStudyData } from '@/utils/translationHelpers';
import ExcelGenerator from '@/components/reports/ExcelGenerator';
import StudiesTable from '@/components/reports/StudiesTable';
import EmptyState from '@/components/reports/EmptyState';
import ReportsHeader from '@/components/reports/ReportsHeader';

const Reports = () => {
  const navigate = useNavigate();
  const { reportStudies, removeFromReport } = useReports();
  const { t, language } = useLanguage();
  const [selectedStudies, setSelectedStudies] = useState<string[]>([]);

  // Get the appropriate date-fns locale
  const dateLocale = useMemo(() => {
    return ru; // Only Russian is supported
  }, [language]);

  // Translate report studies for current language
  const translatedReportStudies = useMemo(() => {
    return reportStudies.map(study => translateStudyData(study, t));
  }, [reportStudies, t]);


  const removeFromReportHandler = (studyUid: string) => {
    removeFromReport([studyUid]);
    toast.success(t('reports.messages.studyRemoved'));
  };

  const handleSelectStudy = (uid: string, checked: boolean) => {
    if (checked) {
      setSelectedStudies([...selectedStudies, uid]);
    } else {
      setSelectedStudies(selectedStudies.filter(id => id !== uid));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudies(reportStudies.map(study => study.uid));
    } else {
      setSelectedStudies([]);
    }
  };

  const handleBulkRemove = () => {
    removeFromReport(selectedStudies);
    toast.success(t('reports.messages.studiesRemoved', { count: selectedStudies.length }));
    setSelectedStudies([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <NavigationTabs activeTab="reports" onTabChange={() => {}} />
      
      <div className="max-w-7xl mx-auto p-8">
        <ReportsHeader />

        <div className="space-y-8">
          <ExcelGenerator
            selectedStudies={selectedStudies}
            reportStudies={translatedReportStudies}
            onBulkRemove={handleBulkRemove}
          />

          {translatedReportStudies.length > 0 ? (
            <StudiesTable
              reportStudies={translatedReportStudies}
              selectedStudies={selectedStudies}
              onSelectStudy={handleSelectStudy}
              onSelectAll={handleSelectAll}
              onRemoveFromReport={removeFromReportHandler}
            />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
