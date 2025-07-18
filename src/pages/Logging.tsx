
import React from 'react';
import Header from '@/components/Header';
import NavigationTabs from '@/components/NavigationTabs';
import LogFilters from '@/components/LogFilters';
import LogTable from '@/components/LogTable';
import LogDisplaySettings from '@/components/LogDisplaySettings';
import LogPagination from '@/components/LogPagination';
import { useLoggingDashboardState } from '@/hooks/useLoggingDashboardState';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLogging } from '@/contexts/LoggingContext';

const Logging = () => {
  const { t } = useLanguage();
  const { logs } = useLogging();
  const {
    filters,
    setFilters,
    appliedFilters,
    selectedLogs,
    sortConfig,
    paginationConfig,
    paginationData,
    hasFiltersChanged,
    handleApplyFilters,
    handleResetFilters,
    handleSelectLog,
    handleSelectAll,
    handleSortChange,
    handlePageChange,
    handleRecordsPerPageChange,
    handleViewModeChange
  } = useLoggingDashboardState();

  const handleGenerateReport = () => {
    const selectedLogsData = paginationData.currentPageLogs.filter(log => selectedLogs.includes(log.id));
    console.log('Generating report for logs:', selectedLogsData);
    
    toast({
      title: t('logging.reportGenerated'),
      description: t('logging.reportDescription', { count: selectedLogs.length }),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavigationTabs activeTab="logging" onTabChange={() => {}} />
      
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('logging.title')}</h1>
          <p className="text-gray-600">
            {t('logging.description')}
          </p>
        </div>

        <LogFilters
          filters={filters}
          setFilters={setFilters}
          hasFiltersChanged={hasFiltersChanged}
          onResetFilters={handleResetFilters}
          onApplyFilters={handleApplyFilters}
          selectedCount={selectedLogs.length}
          onGenerateReport={handleGenerateReport}
        />

        <LogDisplaySettings
          recordsPerPage={paginationConfig.recordsPerPage}
          onRecordsPerPageChange={handleRecordsPerPageChange}
          sortBy={sortConfig.sortBy}
          sortDirection={sortConfig.sortDirection}
          onSortChange={handleSortChange}
          viewMode={paginationConfig.viewMode}
          onViewModeChange={handleViewModeChange}
          startRecord={paginationData.startRecord}
          endRecord={paginationData.endRecord}
          totalRecords={paginationData.currentPageLogs.length}
        />

        <LogTable
          logs={paginationData.currentPageLogs}
          selectedLogs={selectedLogs}
          onSelectLog={handleSelectLog}
          onSelectAll={handleSelectAll}
          viewMode={paginationConfig.viewMode}
        />

        <LogPagination
          currentPage={paginationConfig.currentPage}
          totalPages={paginationData.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Logging;
