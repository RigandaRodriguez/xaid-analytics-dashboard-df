
import { Processing, ProcessingPathology, ProcessingStatus, RecommendationStatus } from '@/types/api';
import { Study, PathologyDecision } from '@/types/study';
import { PathologyState, PathologyStatus } from '@/types/pathology';
import { getDisplayPathologyNames, getApiRecommendedPhysicians } from '@/utils/pathologyDisplayHelpers';

/**
 * Map API Processing to UI Study
 */
export function mapProcessingToStudy(processing: Processing, pathologies?: ProcessingPathology[]): Study {
  return {
    uid: processing.uid,
    patientId: processing.patient_id,
    patientName: processing.patient_name,
    date: new Date(processing.study_created_at),
    status: mapProcessingStatusToStudyStatus(processing.status),
    pathology: pathologies ? getDisplayPathologyNames(pathologies) : [],
    descriptionStatus: processing.status === 'success' ? 'completed' : 'in_progress',
    statusKey: processing.status,
    pathologyKey: undefined, // Will be set when pathologies are loaded
    doctorRecommendations: pathologies ? getApiRecommendedPhysicians(pathologies) : [],
  };
}

/**
 * Map Processing status to Study status
 */
export function mapProcessingStatusToStudyStatus(status: ProcessingStatus): Study['status'] {
  switch (status) {
    case 'success':
      return 'completed';
    case 'processing':
      return 'processing';
    case 'precondition_error':
    case 'configuration_error':
    case 'processing_error':
    case 'generation_error':
    case 'upload_error':
      return 'processing_error';
    default:
      return 'processing_error';
  }
}

/**
 * Map Study status back to Processing status
 */
export function mapStudyStatusToProcessingStatus(status: Study['status']): ProcessingStatus {
  switch (status) {
    case 'completed':
      return 'success';
    case 'processing':
      return 'processing';
    case 'processing_error':
    case 'data_error':
      return 'processing_error';
    default:
      return 'processing_error';
  }
}

/**
 * Map RecommendationStatus to PathologyStatus
 */
export function mapRecommendationStatusToPathologyStatus(status: RecommendationStatus): PathologyStatus {
  switch (status) {
    case 'pending':
      return 'pending';
    case 'accepted':
      return 'accepted';
    case 'rejected':
      return 'rejected';
    default:
      return 'pending';
  }
}

/**
 * Map PathologyStatus to RecommendationStatus
 */
export function mapPathologyStatusToRecommendationStatus(status: PathologyStatus): RecommendationStatus {
  switch (status) {
    case 'pending':
      return 'pending';
    case 'accepted':
      return 'accepted';
    case 'rejected':
      return 'rejected';
    case 'corrected':
      return 'accepted'; // Corrected is treated as accepted in API
    default:
      return 'pending';
  }
}

/**
 * Map ProcessingPathology to PathologyState
 */
export function mapProcessingPathologyToPathologyState(
  pathology: ProcessingPathology,
  pathologyText: string
): PathologyState {
  return {
    id: pathology.pathology_key,
    status: mapRecommendationStatusToPathologyStatus(pathology.recommendation_status),
    originalText: pathologyText,
    editedText: pathologyText,
    isEditing: false,
    timestamp: new Date(pathology.updated_at),
  };
}

/**
 * Create PathologyDecision from ProcessingPathology
 */
export function mapProcessingPathologyToDecision(
  pathology: ProcessingPathology,
  pathologyText: string,
  doctorId: string = 'system'
): PathologyDecision {
  const decision = pathology.recommendation_status === 'accepted' ? 'accepted' :
                  pathology.recommendation_status === 'rejected' ? 'rejected' : 'corrected';
  
  return {
    pathologyId: pathology.pathology_key,
    decision,
    originalText: pathologyText,
    finalText: pathologyText,
    timestamp: new Date(pathology.updated_at),
    doctorId,
  };
}

/**
 * Extract pathology keys from pathology text/array
 */
export function extractPathologyKeys(pathology: string | string[]): string[] {
  if (Array.isArray(pathology)) {
    return pathology.map((p, index) => `pathology_${index + 1}`);
  }
  return ['pathology_1'];
}

/**
 * Map pathology keys to display names
 */
export function mapPathologyKeysToNames(pathologyKeys: string[], t: (key: string) => string): string[] {
  return pathologyKeys.map(key => {
    const translationKey = `pathologies.names.${key}`;
    const translated = t(translationKey);
    return translated !== translationKey ? translated : key;
  });
}
