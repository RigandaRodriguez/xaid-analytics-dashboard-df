
import apiClient from './api';
import {
  Processing,
  ProcessingPathology,
  ListProcessingsResponse,
  CreateProcessingRequest,
  UpdateProcessingRequest,
  UpdateProcessingPathologyRequest,
  UpdateProcessingPathologiesRequest,
  GenerateProcessingsReportRequest,
  ProcessingsListParams,
} from '@/types/api';

export class ProcessingsService {
  /**
   * Create a new processing transaction
   */
  async createProcessing(data: CreateProcessingRequest): Promise<Processing> {
    return apiClient.post<Processing>('/processings/', data);
  }

  /**
   * List processing transactions with filters and pagination
   */
  async listProcessings(params: ProcessingsListParams = {}): Promise<ListProcessingsResponse> {
    const queryParams: Record<string, any> = {};
    
    // Add pagination params
    if (params.page !== undefined) queryParams.page = params.page;
    if (params.per_page !== undefined) queryParams.per_page = params.per_page;
    
    // Add filter params
    if (params.search_query) queryParams.search_query = params.search_query;
    if (params.patient_name) queryParams.patient_name = params.patient_name;
    if (params.study_created_at__gte) queryParams.study_created_at__gte = params.study_created_at__gte;
    if (params.study_created_at__lte) queryParams.study_created_at__lte = params.study_created_at__lte;
    if (params.status) queryParams.status = params.status;
    
    // Add pathology_keys as query parameter
    if (params.pathology_keys && params.pathology_keys.length > 0) {
      queryParams.pathology_keys = params.pathology_keys;
    }

    return apiClient.get<ListProcessingsResponse>('/processings/', queryParams);
  }

  /**
   * Update a processing transaction
   */
  async updateProcessing(uid: string, data: UpdateProcessingRequest): Promise<Processing> {
    return apiClient.put<Processing>(`/processings/${uid}`, data);
  }

  /**
   * Get processing transaction pathologies
   */
  async getProcessingPathologies(uid: string): Promise<ProcessingPathology[]> {
    return apiClient.get<ProcessingPathology[]>(`/processings/${uid}/pathologies`);
  }

  /**
   * Update a specific pathology for a processing transaction
   */
  async updateProcessingPathology(
    uid: string,
    pathologyKey: string,
    data: UpdateProcessingPathologyRequest
  ): Promise<ProcessingPathology> {
    return apiClient.put<ProcessingPathology>(
      `/processings/${uid}/pathologies/${pathologyKey}`,
      data
    );
  }

  /**
   * Batch update processing transaction pathologies
   */
  async updateProcessingPathologies(
    uid: string,
    data: UpdateProcessingPathologiesRequest
  ): Promise<ProcessingPathology[]> {
    return apiClient.put<ProcessingPathology[]>(
      `/processings/${uid}/pathologies`,
      data
    );
  }

  /**
   * Generate processing transactions report
   */
  async generateReport(data: GenerateProcessingsReportRequest): Promise<any> {
    return apiClient.post<any>('/processings/report', data);
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<any> {
    return apiClient.get<any>('/health');
  }
}

export const processingsService = new ProcessingsService();
export default processingsService;
