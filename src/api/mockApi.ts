import type { AutomatedAction, SimulationResult, SimulationStep } from '../types/workflow';
import type { Node, Edge } from '@xyflow/react';

// ── GET /automations ─────────────────────────────────────────────

const MOCK_ACTIONS: AutomatedAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'send_slack', label: 'Send Slack Message', params: ['channel', 'message'] },
  { id: 'update_hris', label: 'Update HRIS Record', params: ['employeeId', 'field'] },
  { id: 'generate_pdf', label: 'Generate PDF Report', params: ['reportType', 'format'] },
  { id: 'schedule_meeting', label: 'Schedule Meeting', params: ['attendees', 'duration'] },
];

export async function fetchAutomations(): Promise<AutomatedAction[]> {
  await delay(300);
  return MOCK_ACTIONS;
}

// ── POST /simulate ───────────────────────────────────────────────

export async function simulateWorkflow(
  nodes: Node[],
  edges: Edge[]
): Promise<SimulationResult> {
  await delay(200);

  const errors: string[] = [];

  // Validate: must have a start node
  const startNodes = nodes.filter((n) => n.type === 'startNode');
  if (startNodes.length === 0) {
    errors.push('Workflow must have at least one Start node.');
  }
  if (startNodes.length > 1) {
    errors.push('Workflow should have only one Start node.');
  }

  // Validate: must have an end node
  const endNodes = nodes.filter((n) => n.type === 'endNode');
  if (endNodes.length === 0) {
    errors.push('Workflow must have at least one End node.');
  }

  // Validate: all non-start nodes should have incoming edges
  for (const node of nodes) {
    if (node.type === 'startNode') continue;
    const hasIncoming = edges.some((e) => e.target === node.id);
    if (!hasIncoming) {
      errors.push(`Node "${(node.data as any).label || node.id}" has no incoming connection.`);
    }
  }

  // Validate: all non-end nodes should have outgoing edges
  for (const node of nodes) {
    if (node.type === 'endNode') continue;
    const hasOutgoing = edges.some((e) => e.source === node.id);
    if (!hasOutgoing) {
      errors.push(`Node "${(node.data as any).label || node.id}" has no outgoing connection.`);
    }
  }

  // Check for cycles using DFS
  const adj = new Map<string, string[]>();
  for (const edge of edges) {
    if (!adj.has(edge.source)) adj.set(edge.source, []);
    adj.get(edge.source)!.push(edge.target);
  }

  const visited = new Set<string>();
  const recStack = new Set<string>();

  function hasCycle(nodeId: string): boolean {
    visited.add(nodeId);
    recStack.add(nodeId);
    for (const neighbor of adj.get(nodeId) || []) {
      if (!visited.has(neighbor)) {
        if (hasCycle(neighbor)) return true;
      } else if (recStack.has(neighbor)) {
        return true;
      }
    }
    recStack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (hasCycle(node.id)) {
        errors.push('Workflow contains a cycle. Cycles are not allowed.');
        break;
      }
    }
  }

  if (errors.length > 0) {
    return { steps: [], valid: false, errors };
  }

  // Simulate step-by-step execution from start node
  const steps: SimulationStep[] = [];
  const start = startNodes[0];
  const visitedSim = new Set<string>();

  const queue: string[] = [start.id];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (visitedSim.has(currentId)) continue;
    visitedSim.add(currentId);

    const node = nodes.find((n) => n.id === currentId);
    if (!node) continue;

    const step: SimulationStep = {
      nodeId: node.id,
      nodeType: node.type || 'unknown',
      label: (node.data as any).label || (node.data as any).title || node.id,
      status: 'completed',
      message: getStepMessage(node),
      timestamp: Date.now() + steps.length * 1000,
    };
    steps.push(step);

    const outgoing = edges.filter((e) => e.source === currentId);
    for (const edge of outgoing) {
      if (!visitedSim.has(edge.target)) {
        queue.push(edge.target);
      }
    }
  }

  return { steps, valid: true, errors: [] };
}

function getStepMessage(node: Node): string {
  const data = node.data as any;
  switch (node.type) {
    case 'startNode':
      return `Workflow started: "${data.title || 'Untitled'}"`;
    case 'taskNode':
      return `Task "${data.title || 'Untitled'}" assigned to ${data.assignee || 'Unassigned'}`;
    case 'approvalNode':
      return `Awaiting approval from ${data.approverRole || 'Manager'}`;
    case 'automatedNode':
      return `Executing automated action: ${data.title || data.actionId || 'Unknown'}`;
    case 'endNode':
      return `Workflow completed: ${data.endMessage || 'Done'}`;
    default:
      return `Processing node ${node.id}`;
  }
}

// ── Utility ──────────────────────────────────────────────────────

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
