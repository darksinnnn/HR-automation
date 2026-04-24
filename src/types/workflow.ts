import type { Node, Edge } from '@xyflow/react';

// ── Node Data Types ──────────────────────────────────────────────

export interface StartNodeData {
  label: string;
  title: string;
  metadata: Record<string, string>;
  [key: string]: unknown;
}

export interface TaskNodeData {
  label: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: Record<string, string>;
  [key: string]: unknown;
}

export interface ApprovalNodeData {
  label: string;
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
  [key: string]: unknown;
}

export interface AutomatedNodeData {
  label: string;
  title: string;
  actionId: string;
  actionParams: Record<string, string>;
  [key: string]: unknown;
}

export interface EndNodeData {
  label: string;
  endMessage: string;
  summaryFlag: boolean;
  [key: string]: unknown;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

export type WorkflowNode = Node<WorkflowNodeData>;
export type WorkflowEdge = Edge;

// ── Node Type Enum ───────────────────────────────────────────────

export enum NodeType {
  Start = 'startNode',
  Task = 'taskNode',
  Approval = 'approvalNode',
  Automated = 'automatedNode',
  End = 'endNode',
}

// ── Simulation ───────────────────────────────────────────────────

export interface SimulationStep {
  nodeId: string;
  nodeType: string;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  message: string;
  timestamp: number;
}

export interface SimulationResult {
  steps: SimulationStep[];
  valid: boolean;
  errors: string[];
}

// ── Mock API Types ───────────────────────────────────────────────

export interface AutomatedAction {
  id: string;
  label: string;
  params: string[];
}
