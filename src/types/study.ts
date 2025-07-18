
export interface Study {
  uid: string;
  patientId: string;
  patientName: string; // ФИО пациента
  date: Date;
  status: 'completed' | 'processing' | 'processing_error' | 'data_error';
  pathology: string | string[]; // Может быть массив патологий
  descriptionStatus: 'in_progress' | 'completed';
  errorMessage?: string;
  clinicalRecommendations?: string;
  doctorRecommendations?: string[]; // Рекомендации по врачам
  pathologyDecisions?: PathologyDecision[];
  // Store language-independent keys
  pathologyKey?: string;
  statusKey?: string;
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
  patientName: string; // Поиск по ФИО
  date: Date | null;
  status: string;
  pathology: string;
  descriptionStatus: string;
  timeFrom?: string;
  timeTo?: string;
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
