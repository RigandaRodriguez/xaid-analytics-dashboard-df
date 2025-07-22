
export interface Study {
  uid: string;
  patientId: string;
  patientName: string;
  date: Date;
  status: 'completed' | 'processing' | 'processing_error' | 'data_error';
  pathology: string | string[];
  descriptionStatus: 'in_progress' | 'completed';
  errorMessage?: string;
  clinicalRecommendations?: string;
  doctorRecommendations?: string[];
  pathologyDecisions?: PathologyDecision[];
  // Store API-compatible keys
  pathologyKey?: string;
  statusKey?: string;
  // API integration fields
  studyInstanceUid?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PathologyDecision {
  pathologyId: string;
  decision: 'accepted' | 'rejected' | 'corrected';
  originalText: string;
  finalText: string;
  timestamp: Date;
  doctorId: string;
}

export interface StudyFilters {
  uidOrPatientId: string;
  patientName: string;
  date: Date | null;
  status: string;
  pathology: string;
  descriptionStatus: string;
  timeFrom?: string;
  timeTo?: string;
  // API compatible filters
  searchQuery?: string;
  dateFrom?: Date | null;
  dateTo?: Date | null;
  pathologyKeys?: string[];
}

export interface SortConfig {
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}

export interface PaginationConfig {
  currentPage: number;
  recordsPerPage: number;
  viewMode: 'compact' | 'full';
}

export interface ClinicalRecommendation {
  pathology: string;
  recommendation: string;
  urgency: 'immediate' | 'within_24h' | 'routine';
}

// API integration interfaces
export interface ApiStudyFilters {
  page?: number;
  per_page?: number;
  search_query?: string;
  patient_name?: string;
  study_created_at__gte?: string;
  study_created_at__lte?: string;
  status?: import('@/types/api').ProcessingStatus;
  pathology_keys?: string[];
}

export interface StudyListResponse {
  studies: Study[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}
