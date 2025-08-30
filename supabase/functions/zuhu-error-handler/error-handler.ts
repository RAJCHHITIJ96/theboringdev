// ZUHU Bulletproof Error Handler
// Centralized error handling and recovery mechanisms for all agents

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

export interface ErrorContext {
  contentId: string;
  agentName: string;
  stage: string;
  error: Error | any;
  attemptNumber?: number;
  metadata?: Record<string, any>;
}

export interface RetryConfig {
  maxRetries: number;
  delayMs: number;
  backoffMultiplier: number;
  timeoutMs: number;
}

export class ZuhuErrorHandler {
  private supabase: any;
  private defaultRetryConfig: RetryConfig = {
    maxRetries: 3,
    delayMs: 1000,
    backoffMultiplier: 2,
    timeoutMs: 30000
  };

  constructor(supabaseUrl: string, supabaseServiceKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  // Comprehensive error logging
  async logError(context: ErrorContext): Promise<void> {
    try {
      const errorLog = {
        content_id: context.contentId,
        agent_name: context.agentName,
        stage: context.stage,
        error_message: context.error.message || String(context.error),
        error_stack: context.error.stack || null,
        attempt_number: context.attemptNumber || 1,
        metadata: context.metadata || {},
        timestamp: new Date().toISOString(),
        error_type: context.error.constructor.name || 'Unknown'
      };

      // Log to processing stages
      await this.supabase
        .from('zuhu_processing_stages')
        .insert({
          content_id: context.contentId,
          stage: context.stage,
          status: 'failed',
          error_message: errorLog.error_message,
          started_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          stage_data: { errorLog }
        });

      // Update main processing status
      await this.supabase
        .from('zuhu_content_processing')
        .update({
          status: 'failed',
          error_logs: errorLog,
          processing_end: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('content_id', context.contentId);

      console.error(`[${context.contentId}] Error logged:`, errorLog);

    } catch (loggingError) {
      console.error('Failed to log error:', loggingError);
    }
  }

  // Retry mechanism with exponential backoff
  async withRetry<T>(
    operation: () => Promise<T>,
    context: ErrorContext,
    config?: Partial<RetryConfig>
  ): Promise<T> {
    const retryConfig = { ...this.defaultRetryConfig, ...config };
    let lastError: any;

    for (let attempt = 1; attempt <= retryConfig.maxRetries; attempt++) {
      try {
        console.log(`[${context.contentId}] Attempt ${attempt}/${retryConfig.maxRetries} for ${context.stage}`);
        
        // Wrap operation with timeout
        const result = await Promise.race([
          operation(),
          this.createTimeout(retryConfig.timeoutMs)
        ]);
        
        console.log(`[${context.contentId}] ${context.stage} succeeded on attempt ${attempt}`);
        return result;

      } catch (error) {
        lastError = error;
        console.error(`[${context.contentId}] Attempt ${attempt} failed:`, error.message);

        // Log each attempt
        await this.logError({
          ...context,
          error,
          attemptNumber: attempt
        });

        // Don't retry on final attempt or certain error types
        if (attempt === retryConfig.maxRetries || this.isNonRetryableError(error)) {
          break;
        }

        // Exponential backoff delay
        const delay = retryConfig.delayMs * Math.pow(retryConfig.backoffMultiplier, attempt - 1);
        console.log(`[${context.contentId}] Waiting ${delay}ms before retry...`);
        await this.sleep(delay);
      }
    }

    // All retries exhausted
    throw new Error(`${context.stage} failed after ${retryConfig.maxRetries} attempts. Last error: ${lastError.message}`);
  }

  // Circuit breaker pattern
  private circuitStates: Map<string, { failures: number; lastFailure: Date }> = new Map();

  async withCircuitBreaker<T>(
    operation: () => Promise<T>,
    context: ErrorContext,
    threshold: number = 5
  ): Promise<T> {
    const key = `${context.agentName}-${context.stage}`;
    const state = this.circuitStates.get(key) || { failures: 0, lastFailure: new Date(0) };

    // Check if circuit is open (too many recent failures)
    const timeSinceLastFailure = Date.now() - state.lastFailure.getTime();
    if (state.failures >= threshold && timeSinceLastFailure < 60000) { // 1 minute cooldown
      throw new Error(`Circuit breaker open for ${key}. Too many failures: ${state.failures}`);
    }

    try {
      const result = await operation();
      
      // Reset on success
      this.circuitStates.set(key, { failures: 0, lastFailure: new Date(0) });
      return result;

    } catch (error) {
      // Increment failure count
      state.failures++;
      state.lastFailure = new Date();
      this.circuitStates.set(key, state);
      
      throw error;
    }
  }

  // Timeout wrapper
  private createTimeout(ms: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms);
    });
  }

  // Sleep utility
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Check if error is retryable
  private isNonRetryableError(error: any): boolean {
    const nonRetryablePatterns = [
      /validation/i,
      /invalid.*format/i,
      /unauthorized/i,
      /forbidden/i,
      /not found/i,
      /bad request/i
    ];

    const errorMessage = error.message || String(error);
    return nonRetryablePatterns.some(pattern => pattern.test(errorMessage));
  }

  // Health check for agent
  async healthCheck(agentName: string): Promise<{ healthy: boolean; metrics: any }> {
    try {
      // Get recent processing metrics
      const { data: recentProcessing } = await this.supabase
        .from('zuhu_processing_stages')
        .select('status, created_at')
        .eq('stage', agentName.replace('zuhu-', '').replace('-', '_'))
        .gte('created_at', new Date(Date.now() - 3600000).toISOString()) // Last hour
        .order('created_at', { ascending: false });

      const total = recentProcessing?.length || 0;
      const successful = recentProcessing?.filter(p => p.status === 'completed').length || 0;
      const failed = recentProcessing?.filter(p => p.status === 'failed').length || 0;
      
      const successRate = total > 0 ? successful / total : 1;
      const healthy = successRate >= 0.8; // 80% success rate threshold

      return {
        healthy,
        metrics: {
          total,
          successful,
          failed,
          successRate,
          lastHour: true
        }
      };

    } catch (error) {
      console.error(`Health check failed for ${agentName}:`, error);
      return {
        healthy: false,
        metrics: { error: error.message }
      };
    }
  }
}

// Status transition helper
export async function safeStatusTransition(
  supabase: any,
  contentId: string,
  fromStatus: string,
  toStatus: string,
  data?: any
): Promise<void> {
  try {
    const updateData: any = {
      status: toStatus,
      updated_at: new Date().toISOString(),
      ...data
    };

    const { error } = await supabase
      .from('zuhu_content_processing')
      .update(updateData)
      .eq('content_id', contentId)
      .eq('status', fromStatus); // Ensure we're updating from expected status

    if (error) {
      throw new Error(`Status transition failed: ${error.message}`);
    }

    console.log(`[${contentId}] Status transition: ${fromStatus} → ${toStatus}`);

  } catch (error) {
    console.error(`[${contentId}] Status transition failed:`, error);
    throw error;
  }
}