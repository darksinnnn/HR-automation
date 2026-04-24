import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type Connection,
  type NodeChange,
  type EdgeChange,
} from '@xyflow/react';
import type { SimulationResult } from '../types/workflow';

interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  simulationResult: SimulationResult | null;
  simulationRunning: boolean;
  activeSimNodeId: string | null;

  // History
  past: HistoryState[];
  future: HistoryState[];

  // Actions
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node) => void;
  updateNodeData: (nodeId: string, data: Partial<any>) => void;
  updateNodeMetrics: (nodeId: string, metricsDiff: Partial<any>) => void;
  updateEdgeData: (edgeId: string, label: string) => void;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedEdgeId: (id: string | null) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
  clearCanvas: () => void;
  setSimulationResult: (result: SimulationResult | null) => void;
  setSimulationRunning: (running: boolean) => void;
  setActiveSimNodeId: (nodeId: string | null) => void;
  exportWorkflow: () => string;
  importWorkflow: (json: string) => void;
  undo: () => void;
  redo: () => void;
  takeSnapshot: () => void;
}

let idCounter = 0;
export const getNewId = () => `node_${Date.now()}_${idCounter++}`;

const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  simulationResult: null,
  simulationRunning: false,
  activeSimNodeId: null,
  past: [],
  future: [],

  takeSnapshot: () => {
    const { nodes, edges, past } = get();
    // Keep last 20 states
    const newPast = [...past, { nodes, edges }].slice(-20);
    set({ past: newPast, future: [] });
  },

  undo: () => {
    const { past, future, nodes, edges } = get();
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    set({
      past: newPast,
      future: [{ nodes, edges }, ...future],
      nodes: previous.nodes,
      edges: previous.edges,
      selectedNodeId: null,
      selectedEdgeId: null,
    });
  },

  redo: () => {
    const { past, future, nodes, edges } = get();
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    set({
      past: [...past, { nodes, edges }],
      future: newFuture,
      nodes: next.nodes,
      edges: next.edges,
      selectedNodeId: null,
      selectedEdgeId: null,
    });
  },

  onNodesChange: (changes: NodeChange[]) => {
    const isRemoveOrAdd = changes.some((c) => c.type === 'remove' || c.type === 'add');
    if (isRemoveOrAdd) get().takeSnapshot();

    set({ nodes: applyNodeChanges(changes, get().nodes) });

    for (const change of changes) {
      if (change.type === 'remove' && change.id === get().selectedNodeId) {
        set({ selectedNodeId: null });
      }
    }
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    const isRemoveOrAdd = changes.some((c) => c.type === 'remove' || c.type === 'add');
    if (isRemoveOrAdd) get().takeSnapshot();

    set({ edges: applyEdgeChanges(changes, get().edges) });
    
    for (const change of changes) {
      if (change.type === 'remove' && change.id === get().selectedEdgeId) {
        set({ selectedEdgeId: null });
      }
    }
  },

  onConnect: (connection: Connection) => {
    get().takeSnapshot();
    const newEdge: Edge = {
      ...connection,
      id: `edge_${connection.source}_${connection.target}`,
      animated: true,
      style: { strokeWidth: 2 },
      labelStyle: { fill: 'var(--text-secondary)', fontWeight: 600, fontSize: 12 },
      labelBgStyle: { fill: 'var(--bg-elevated)' },
      labelBgPadding: [4, 4],
      labelBgBorderRadius: 4,
    };
    set({ edges: addEdge(newEdge, get().edges) });
  },

  addNode: (node: Node) => {
    get().takeSnapshot();
    set({ nodes: [...get().nodes, node] });
  },

  updateNodeData: (nodeId: string, data: Partial<any>) => {
    get().takeSnapshot();
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
      ),
    });
  },

  updateNodeMetrics: (nodeId: string, metricsDiff: Partial<any>) => {
    set({
      nodes: get().nodes.map((n) => {
        if (n.id !== nodeId) return n;
        const currentMetrics = (n.data as any).metrics || { executions: 0, errors: 0, successes: 0, durationAvg: 0 };
        const newMetrics = { ...currentMetrics };
        
        // Accumulate metrics properly
        if (metricsDiff.executions) newMetrics.executions = (newMetrics.executions || 0) + metricsDiff.executions;
        if (metricsDiff.errors) newMetrics.errors = (newMetrics.errors || 0) + metricsDiff.errors;
        if (metricsDiff.successes) newMetrics.successes = (newMetrics.successes || 0) + metricsDiff.successes;
        if (metricsDiff.durationAvg) newMetrics.durationAvg = metricsDiff.durationAvg; // Use latest duration
        
        return {
          ...n,
          data: {
            ...n.data,
            metrics: newMetrics
          }
        };
      }),
    });
  },

  updateEdgeData: (edgeId: string, label: string) => {
    get().takeSnapshot();
    set({
      edges: get().edges.map((e) =>
        e.id === edgeId ? { ...e, label } : e
      ),
    });
  },

  setSelectedNodeId: (id: string | null) => {
    set({ selectedNodeId: id, selectedEdgeId: null });
  },

  setSelectedEdgeId: (id: string | null) => {
    set({ selectedEdgeId: id, selectedNodeId: null });
  },

  deleteNode: (nodeId: string) => {
    get().takeSnapshot();
    set({
      nodes: get().nodes.filter((n) => n.id !== nodeId),
      edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
    });
  },

  deleteEdge: (edgeId: string) => {
    get().takeSnapshot();
    set({ edges: get().edges.filter((e) => e.id !== edgeId) });
  },

  clearCanvas: () => {
    get().takeSnapshot();
    set({ nodes: [], edges: [], selectedNodeId: null, selectedEdgeId: null, simulationResult: null, activeSimNodeId: null });
  },

  setSimulationResult: (result: SimulationResult | null) => {
    set({ simulationResult: result });
  },

  setSimulationRunning: (running: boolean) => {
    set({ simulationRunning: running });
  },

  setActiveSimNodeId: (nodeId: string | null) => {
    set({ activeSimNodeId: nodeId });
  },

  exportWorkflow: () => {
    const { nodes, edges } = get();
    return JSON.stringify({ nodes, edges }, null, 2);
  },

  importWorkflow: (json: string) => {
    try {
      const { nodes, edges } = JSON.parse(json);
      get().takeSnapshot();
      set({ nodes, edges, selectedNodeId: null, selectedEdgeId: null, simulationResult: null });
    } catch {
      console.error('Failed to import workflow JSON');
    }
  },
}));

export default useWorkflowStore;
