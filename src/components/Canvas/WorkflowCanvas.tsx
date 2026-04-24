import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import useWorkflowStore, { getNewId } from '../../store/workflowStore';
import { NodeType } from '../../types/workflow';
import StartNode from '../Nodes/StartNode';
import TaskNode from '../Nodes/TaskNode';
import ApprovalNode from '../Nodes/ApprovalNode';
import AutomatedNode from '../Nodes/AutomatedNode';
import EndNode from '../Nodes/EndNode';
import { Workflow } from 'lucide-react';
import './WorkflowCanvas.css';

const nodeTypes = {
  [NodeType.Start]: StartNode,
  [NodeType.Task]: TaskNode,
  [NodeType.Approval]: ApprovalNode,
  [NodeType.Automated]: AutomatedNode,
  [NodeType.End]: EndNode,
};

function getDefaultData(type: string) {
  switch (type) {
    case NodeType.Start:
      return { label: 'Start', title: '', metadata: {} };
    case NodeType.Task:
      return { label: 'Task', title: '', description: '', assignee: '', dueDate: '', customFields: {} };
    case NodeType.Approval:
      return { label: 'Approval', title: '', approverRole: '', autoApproveThreshold: 0 };
    case NodeType.Automated:
      return { label: 'Automated', title: '', actionId: '', actionParams: {} };
    case NodeType.End:
      return { label: 'End', endMessage: '', summaryFlag: false };
    default:
      return { label: 'Node' };
  }
}

const WorkflowCanvas: React.FC = () => {
  const reactFlowRef = useRef<ReactFlowInstance | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);
  const onConnect = useWorkflowStore((s) => s.onConnect);
  const addNode = useWorkflowStore((s) => s.addNode);
  const setSelectedNodeId = useWorkflowStore((s) => s.setSelectedNodeId);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowRef.current = instance;
  }, []);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: any) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !reactFlowRef.current || !wrapperRef.current) return;

      const bounds = wrapperRef.current.getBoundingClientRect();
      const position = reactFlowRef.current.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const newNode = {
        id: getNewId(),
        type,
        position,
        data: getDefaultData(type),
      };

      addNode(newNode);
    },
    [addNode]
  );

  return (
    <div className="canvas-wrapper" ref={wrapperRef} id="workflow-canvas">
      {nodes.length === 0 && (
        <div className="canvas-empty-state">
          <div className="canvas-empty-icon">
            <Workflow />
          </div>
          <div className="canvas-empty-title">Design Your Workflow</div>
          <div className="canvas-empty-desc">
            Drag nodes from the left panel onto this canvas to start building your HR automation workflow.
          </div>
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[16, 16]}
        deleteKeyCode="Delete"
        multiSelectionKeyCode="Shift"
        defaultEdgeOptions={{
          animated: true,
          style: { strokeWidth: 2 },
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Controls showInteractive={false} />
        <MiniMap
          nodeStrokeWidth={3}
          pannable
          zoomable
          style={{ width: 160, height: 100 }}
        />
      </ReactFlow>
    </div>
  );
};

export default WorkflowCanvas;
