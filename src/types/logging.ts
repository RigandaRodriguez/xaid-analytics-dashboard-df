
export interface LogEntry {
  id: string;
  timestamp: Date;
  action: string;
  studyUid?: string;
  patientId?: string;
  oldValue?: string;
  newValue?: string;
  details: string;
}

export interface LogFilters {
  dateFrom?: Date;
  dateTo?: Date;
  action: string;
}

export interface LogSortConfig {
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}

export interface LogPaginationConfig {
  currentPage: number;
  recordsPerPage: number;
  viewMode: 'compact' | 'full';
}
