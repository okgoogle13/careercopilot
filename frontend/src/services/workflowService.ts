import { apiGet, apiPost, apiPatch } from './apiClient';
import { ApiResponse } from '@/types/api';

// Types
export type WorkflowStatus = 'draft' | 'active' | 'paused' | 'completed' | 'failed';
export type StepStatus = 'pending' | 'in-progress' | 'completed' | 'failed';

export interface WorkflowStep {
  id: string;
  name: string;
  type: string;
  status: StepStatus;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  metadata?: Record<string, unknown>;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  duration?: number; // in milliseconds
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: WorkflowStatus;
  steps: WorkflowStep[];
  inputSchema?: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  error?: string;
  duration?: number; // in milliseconds
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: WorkflowStatus;
  startedAt: string;
  completedAt?: string;
  createdBy: string;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  duration?: number; // in milliseconds
  steps: Array<{
    id: string;
    name: string;
    status: StepStatus;
    startedAt?: string;
    completedAt?: string;
    error?: string;
    duration?: number;
  }>;
}

export interface CreateWorkflowPayload {
  name: string;
  description?: string;
  steps: Array<{
    name: string;
    type: string;
    config: Record<string, unknown>;
    inputMapping?: Record<string, string>;
  }>;
  inputSchema?: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateWorkflowPayload extends Partial<CreateWorkflowPayload> {
  status?: WorkflowStatus;
}

export interface ListWorkflowsParams {
  status?: WorkflowStatus[];
  search?: string;
  tags?: string[];
  createdBy?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface ListExecutionsParams {
  status?: WorkflowStatus[];
  limit?: number;
  offset?: number;
  sortBy?: 'startedAt' | 'completedAt' | 'duration';
  sortOrder?: 'asc' | 'desc';
}

// API endpoints
const WORKFLOW_ENDPOINTS = {
  WORKFLOWS: '/workflows',
  WORKFLOW_BY_ID: (id: string) => `/workflows/${id}`,
  WORKFLOW_STATUS: (id: string) => `/workflows/${id}/status`,
  WORKFLOW_EXECUTE: (id: string) => `/workflows/${id}/execute`,
  WORKFLOW_EXECUTIONS: (id: string) => `/workflows/${id}/executions`,
  WORKFLOW_EXECUTION: (workflowId: string, executionId: string) => 
    `/workflows/${workflowId}/executions/${executionId}`,
};

/**
 * Create a new workflow
 */
export const createWorkflow = async (
  payload: CreateWorkflowPayload
): Promise<ApiResponse<{ workflow: Workflow }>> => {
  return apiPost<{ workflow: Workflow }>(WORKFLOW_ENDPOINTS.WORKFLOWS, payload);
};

/**
 * Get a workflow by ID
 */
export const getWorkflow = async (
  workflowId: string
): Promise<ApiResponse<{ workflow: Workflow }>> => {
  return apiGet<{ workflow: Workflow }>(WORKFLOW_ENDPOINTS.WORKFLOW_BY_ID(workflowId));
};

/**
 * Update a workflow
 */
export const updateWorkflow = async (
  workflowId: string,
  payload: UpdateWorkflowPayload
): Promise<ApiResponse<{ workflow: Workflow }>> => {
  return apiPatch<{ workflow: Workflow }>(
    WORKFLOW_ENDPOINTS.WORKFLOW_BY_ID(workflowId),
    payload
  );
};

/**
 * List workflows with optional filters
 */
export const listWorkflows = async (
  params: ListWorkflowsParams = {}
): Promise<ApiResponse<{ workflows: Workflow[]; total: number }>> => {
  return apiGet<{ workflows: Workflow[]; total: number }>(
    WORKFLOW_ENDPOINTS.WORKFLOWS,
    { params }
  );
};

/**
 * Update workflow status
 */
export const updateWorkflowStatus = async (
  workflowId: string,
  status: WorkflowStatus
): Promise<ApiResponse<{ workflow: Workflow }>> => {
  return apiPatch<{ workflow: Workflow }>(
    WORKFLOW_ENDPOINTS.WORKFLOW_STATUS(workflowId),
    { status }
  );
};

/**
 * Execute a workflow
 */
export const executeWorkflow = async (
  workflowId: string,
  input?: Record<string, unknown>
): Promise<ApiResponse<{ execution: WorkflowExecution }>> => {
  return apiPost<{ execution: WorkflowExecution }>(
    WORKFLOW_ENDPOINTS.WORKFLOW_EXECUTE(workflowId),
    { input }
  );
};

/**
 * Get workflow execution history
 */
export const getWorkflowExecutionHistory = async (
  workflowId: string,
  params: ListExecutionsParams = {}
): Promise<ApiResponse<{ executions: WorkflowExecution[]; total: number }>> => {
  return apiGet<{ executions: WorkflowExecution[]; total: number }>(
    WORKFLOW_ENDPOINTS.WORKFLOW_EXECUTIONS(workflowId),
    { params }
  );
};

/**
 * Get a specific workflow execution
 */
export const getWorkflowExecution = async (
  workflowId: string,
  executionId: string
): Promise<ApiResponse<{ execution: WorkflowExecution }>> => {
  return apiGet<{ execution: WorkflowExecution }>(
    WORKFLOW_ENDPOINTS.WORKFLOW_EXECUTION(workflowId, executionId)
  );
};

/**
 * Delete a workflow
 */
export const deleteWorkflow = async (
  workflowId: string
): Promise<ApiResponse<{ success: boolean }>> => {
  return apiDelete<{ success: boolean }>(
    WORKFLOW_ENDPOINTS.WORKFLOW_BY_ID(workflowId)
  );
};
