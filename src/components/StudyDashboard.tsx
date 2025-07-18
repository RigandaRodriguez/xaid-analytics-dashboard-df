
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BulkActionsPanel from '@/components/BulkActionsPanel';
import UndoPanel from '@/components/UndoPanel';
import DisplaySettings from '@/components/DisplaySettings';
import StudyPagination from '@/components/StudyPagination';
import StatisticsGraph from '@/components/StatisticsGraph';
import StudyFiltersCard from '@/components/StudyFiltersCard';
import StudyTableCard from '@/components/StudyTableCard';
import { Study } from '@/types/study';
import { useStudyDashboardState } from '@/hooks/useStudyDashboardState';
import { useUndoActions } from '@/hooks/useUndoActions';
import { useStudyBulkActions } from '@/hooks/useStudyBulkActions';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface StudyDashboardProps {
  onAddToReport?: (studies: Study[]) => void;
}

const StudyDashboard = ({ onAddToReport }: StudyDashboardProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [addedStudiesCount, setAddedStudiesCount] = React.useState(0);

  const {
    selectedStudies,
    setSelectedStudies,
    studies,
    setStudies,
    appliedFilters,
    appliedFilteredStudies,
    filters,
    setFilters,
    hasFiltersChanged,
    sortConfig,
    paginationConfig,
    paginationData,
    handleApplyFilters,
    handleResetFiltersWithApplied,
    handleSelectStudy,
    handleSelectAll,
    handleViewReport,
    handleSortChange,
    handlePageChange,
    handleRecordsPerPageChange,
    handleViewModeChange
  } = useStudyDashboardState();

  const { undoAction, showUndoPanel, handleUndo, handleDismiss } = useUndoActions();

  const {
    handleBulkArchive,
    handleBulkReanalyze,
    handleAddToReport: originalHandleAddToReport
  } = useStudyBulkActions(
    studies,
    setStudies,
    selectedStudies,
    setSelectedStudies,
    showUndoPanel
  );

  const handleAddToReport = () => {
    const count = originalHandleAddToReport();
    toast.success(t('messages.addedToReport', { count }));
    setAddedStudiesCount(count);
    setSelectedStudies([]);
  };

  const handleClearAddedState = () => {
    setAddedStudiesCount(0);
  };

  const handleGoToReports = () => {
    navigate('/reports');
  };

  return (
    <div className="space-y-6 pb-20">
      <StatisticsGraph 
        filteredStudies={appliedFilteredStudies} 
        appliedFilters={appliedFilters}
      />

      <div className="sticky top-0 z-30 bg-gray-50 pb-4">
        <StudyFiltersCard
          filters={filters}
          setFilters={setFilters}
          hasFiltersChanged={hasFiltersChanged}
          onResetFilters={handleResetFiltersWithApplied}
          onApplyFilters={handleApplyFilters}
          selectedCount={selectedStudies.length}
          onAddToReport={handleAddToReport}
        />
      </div>

      <DisplaySettings
        recordsPerPage={paginationConfig.recordsPerPage}
        onRecordsPerPageChange={handleRecordsPerPageChange}
        viewMode={paginationConfig.viewMode}
        onViewModeChange={handleViewModeChange}
        sortBy={sortConfig.sortBy}
        sortDirection={sortConfig.sortDirection}
        onSortChange={handleSortChange}
        totalRecords={paginationData.currentPageStudies.length}
        currentPage={paginationConfig.currentPage}
        startRecord={paginationData.startRecord}
        endRecord={paginationData.endRecord}
      />

      <StudyTableCard
        studies={paginationData.currentPageStudies}
        selectedStudies={selectedStudies}
        onSelectStudy={handleSelectStudy}
        onSelectAll={handleSelectAll}
        onViewReport={handleViewReport}
        viewMode={paginationConfig.viewMode}
        currentPage={paginationConfig.currentPage}
        totalPages={paginationData.totalPages}
      />

      {paginationData.totalPages > 1 && (
        <StudyPagination
          currentPage={paginationConfig.currentPage}
          totalPages={paginationData.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <BulkActionsPanel
        selectedCount={selectedStudies.length}
        addedCount={addedStudiesCount}
        onAddToReport={handleAddToReport}
        onClear={addedStudiesCount > 0 ? handleClearAddedState : () => setSelectedStudies([])}
        onGoToReports={handleGoToReports}
      />

      <UndoPanel
        isVisible={undoAction.isVisible}
        message={undoAction.message}
        onUndo={handleUndo}
        onDismiss={handleDismiss}
      />
    </div>
  );
};

export default StudyDashboard;
