
// API types based on OpenAPI schema
export interface CreateProcessingRequest {
  uid: string;
  study_instance_uid: string;
  study_created_at: string;
  patient_id: string;
  patient_name: string;
  status: ProcessingStatus;
}

export interface UpdateProcessingRequest {
  status: ProcessingStatus;
  pathology_keys: string[] | null;
}

export interface UpdateProcessingPathologyRequest {
  recommendation_status: RecommendationStatus;
}

export interface PathologyUpdate {
  pathology_key: string;
  recommendation_status: RecommendationStatus;
}

export interface UpdateProcessingPathologiesRequest {
  pathologies: PathologyUpdate[];
}

export interface GenerateProcessingsReportRequest {
  processing_uids: string[];
}

export interface Processing {
  uid: string;
  study_instance_uid: string;
  study_created_at: string;
  patient_id: string;
  patient_name: string;
  status: ProcessingStatus;
  created_at: string;
  updated_at: string;
}

export interface ProcessingPathology {
  pathology_key: string;
  recommendation_status: RecommendationStatus;
  recommendation_physician_key: string;
  created_at: string;
  updated_at: string;
}

export interface ListProcessingsResponse {
  page: number;
  per_page: number;
  total: number;
  items: Processing[];
}

export type ProcessingStatus = 
  | 'success'
  | 'processing' 
  | 'precondition_error'
  | 'configuration_error'
  | 'processing_error'
  | 'generation_error'
  | 'upload_error';

export type RecommendationStatus = 'pending' | 'accepted' | 'rejected';

export interface HTTPValidationError {
  detail: ValidationError[];
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface ProcessingsListParams {
  page?: number;
  per_page?: number;
  search_query?: string | null;
  patient_name?: string | null;
  study_created_at__gte?: string | null;
  study_created_at__lte?: string | null;
  status?: ProcessingStatus | null;
  pathology_keys?: string[] | null;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

export interface ApiLoadingState {
  isLoading: boolean;
  error: ApiError | null;
}
