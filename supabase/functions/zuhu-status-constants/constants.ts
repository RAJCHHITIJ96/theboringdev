// ZUHU Pipeline Status Constants - Bulletproof Status Management
// Centralized status definitions to prevent inconsistencies across agents

export const PIPELINE_STATUS = {
  // Initial states
  RECEIVED: 'received',
  PROCESSING: 'processing',
  
  // Agent completion states (sequential flow)
  CLASSIFIED: 'classified',
  DESIGN_APPROVED: 'design_approved', 
  ASSETS_PROCESSED: 'assets_processed',
  PAGE_CREATED: 'page_created',
  SEO_OPTIMIZED: 'seo_optimized',
  QUALITY_APPROVED: 'quality_approved',
  
  // Final states
  APPROVED_FOR_PUBLISHING: 'approved_for_publishing',
  LIVE: 'live',
  
  // Review states
  REQUIRES_MANUAL_REVIEW: 'requires_manual_review',
  REJECTED: 'rejected',
  
  // Error states
  FAILED: 'failed'
} as const;

export const PIPELINE_STAGES = {
  CONTENT_CLASSIFICATION: 'content_classification',
  DESIGN_DIRECTION: 'design_direction',
  ASSET_MANAGEMENT: 'asset_management', 
  PAGE_COMPOSITION: 'page_composition',
  SEO_SYNTHESIS: 'seo_synthesis',
  QUALITY_FORTRESS: 'quality_fortress',
  PIPELINE_START: 'pipeline_start',
  PIPELINE_ERROR: 'pipeline_error'
} as const;

// Valid status transitions map for validation
export const VALID_TRANSITIONS: Record<string, string[]> = {
  [PIPELINE_STATUS.RECEIVED]: [PIPELINE_STATUS.PROCESSING, PIPELINE_STATUS.FAILED],
  [PIPELINE_STATUS.PROCESSING]: [PIPELINE_STATUS.CLASSIFIED, PIPELINE_STATUS.FAILED],
  [PIPELINE_STATUS.CLASSIFIED]: [PIPELINE_STATUS.DESIGN_APPROVED, PIPELINE_STATUS.FAILED],
  [PIPELINE_STATUS.DESIGN_APPROVED]: [PIPELINE_STATUS.ASSETS_PROCESSED, PIPELINE_STATUS.FAILED],
  [PIPELINE_STATUS.ASSETS_PROCESSED]: [PIPELINE_STATUS.PAGE_CREATED, PIPELINE_STATUS.FAILED],
  [PIPELINE_STATUS.PAGE_CREATED]: [PIPELINE_STATUS.SEO_OPTIMIZED, PIPELINE_STATUS.FAILED],
  [PIPELINE_STATUS.SEO_OPTIMIZED]: [PIPELINE_STATUS.QUALITY_APPROVED, PIPELINE_STATUS.FAILED],
  [PIPELINE_STATUS.QUALITY_APPROVED]: [
    PIPELINE_STATUS.APPROVED_FOR_PUBLISHING, 
    PIPELINE_STATUS.REQUIRES_MANUAL_REVIEW, 
    PIPELINE_STATUS.FAILED
  ],
  [PIPELINE_STATUS.APPROVED_FOR_PUBLISHING]: [PIPELINE_STATUS.LIVE, PIPELINE_STATUS.FAILED],
  [PIPELINE_STATUS.REQUIRES_MANUAL_REVIEW]: [
    PIPELINE_STATUS.APPROVED_FOR_PUBLISHING, 
    PIPELINE_STATUS.REJECTED, 
    PIPELINE_STATUS.FAILED
  ],
  [PIPELINE_STATUS.FAILED]: [PIPELINE_STATUS.PROCESSING, PIPELINE_STATUS.REJECTED]
};

// Agent stage mapping
export const AGENT_STAGE_MAP = {
  'zuhu-content-classifier': {
    stage: PIPELINE_STAGES.CONTENT_CLASSIFICATION,
    completionStatus: PIPELINE_STATUS.CLASSIFIED,
    processingStatus: PIPELINE_STATUS.PROCESSING
  },
  'zuhu-design-director': {
    stage: PIPELINE_STAGES.DESIGN_DIRECTION,
    completionStatus: PIPELINE_STATUS.DESIGN_APPROVED,
    processingStatus: PIPELINE_STATUS.PROCESSING
  },
  'zuhu-asset-manager': {
    stage: PIPELINE_STAGES.ASSET_MANAGEMENT,
    completionStatus: PIPELINE_STATUS.ASSETS_PROCESSED,
    processingStatus: PIPELINE_STATUS.PROCESSING
  },
  'zuhu-page-composer': {
    stage: PIPELINE_STAGES.PAGE_COMPOSITION,
    completionStatus: PIPELINE_STATUS.PAGE_CREATED,
    processingStatus: PIPELINE_STATUS.PROCESSING
  },
  'zuhu-seo-synthesizer': {
    stage: PIPELINE_STAGES.SEO_SYNTHESIS,
    completionStatus: PIPELINE_STATUS.SEO_OPTIMIZED,
    processingStatus: PIPELINE_STATUS.PROCESSING
  },
  'quality-fortress': {
    stage: PIPELINE_STAGES.QUALITY_FORTRESS,
    completionStatus: PIPELINE_STATUS.QUALITY_APPROVED,
    processingStatus: PIPELINE_STATUS.PROCESSING
  }
};

// Error recovery configuration
export const ERROR_RECOVERY = {
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,
  TIMEOUT_MS: 30000,
  CIRCUIT_BREAKER_THRESHOLD: 5
};

// Validation functions
export function validateStatusTransition(fromStatus: string, toStatus: string): boolean {
  if (!fromStatus) return toStatus === PIPELINE_STATUS.RECEIVED || toStatus === PIPELINE_STATUS.PROCESSING;
  return VALID_TRANSITIONS[fromStatus]?.includes(toStatus) ?? false;
}

export function isValidStatus(status: string): boolean {
  return Object.values(PIPELINE_STATUS).includes(status as any);
}

export function isTerminalStatus(status: string): boolean {
  return [
    PIPELINE_STATUS.LIVE,
    PIPELINE_STATUS.REJECTED,
    PIPELINE_STATUS.FAILED
  ].includes(status as any);
}