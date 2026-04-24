import type { Node, Edge } from '@xyflow/react';

// ── Node Data Types ──────────────────────────────────────────────

export interface NodeMetricsData {
  executions: number;
  errors: number;
  successes: number;
  durationAvg: number;
}

export interface StartNodeData {
  label: string;
  title: string;
  metadata: Record<string, string>;
  metrics?: NodeMetricsData;
  [key: string]: unknown;
}

export interface TaskNodeData {
  label: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: Record<string, string>;
  metrics?: NodeMetricsData;
  [key: string]: unknown;
}

export interface ApprovalNodeData {
  label: string;
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
  metrics?: NodeMetricsData;
  [key: string]: unknown;
}

export interface AutomatedNodeData {
  label: string;
  title: string;
  actionId: string;
  actionParams: Record<string, string>;
  metrics?: NodeMetricsData;
  [key: string]: unknown;
}

export interface EmailNodeData {
  label: string;
  title: string;
  to: string;
  subject: string;
  body: string;
  metrics?: NodeMetricsData;
  [key: string]: unknown;
}

export interface ConditionNodeData {
  label: string;
  title: string;
  conditionField: string;
  conditionOperator: string;
  conditionValue: string;
  metrics?: NodeMetricsData;
  [key: string]: unknown;
}

export interface EndNodeData {
  label: string;
  endMessage: string;
  summaryFlag: boolean;
  metrics?: NodeMetricsData;
  [key: string]: unknown;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EmailNodeData
  | ConditionNodeData
  | EndNodeData;

export type WorkflowNode = Node<WorkflowNodeData>;
export type WorkflowEdge = Edge;

// ── Node Type Enum ───────────────────────────────────────────────

export enum NodeType {
  Start = 'startNode',
  Task = 'taskNode',
  Approval = 'approvalNode',
  Automated = 'automatedNode',
  Email = 'emailNode',
  Condition = 'conditionNode',
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
