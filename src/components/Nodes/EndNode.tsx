import React, { memo, useState } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Square, MessageSquare, MoreHorizontal, Copy, Trash2 } from 'lucide-react';
import type { EndNodeData } from '../../types/workflow';
import useWorkflowStore from '../../store/workflowStore';
import NodeMetrics from './NodeMetrics';
import './nodes.css';

const EndNode: React.FC<NodeProps> = ({ data, id, selected }) => {
  const [showMenu, setShowMenu] = useState(false);
  const activeSimNodeId = useWorkflowStore((s) => s.activeSimNodeId);
  const deleteNode = useWorkflowStore((s) => s.deleteNode);
  const nodes = useWorkflowStore((s) => s.nodes);
  const addNode = useWorkflowStore((s) => s.addNode);
  const nodeData = data as unknown as EndNodeData;
  const isSimulating = activeSimNodeId === id;

  const handleDelete = () => {
    if (confirm('Delete this node?')) {
      deleteNode(id);
    }
    setShowMenu(false);
  };

  const handleDuplicate = () => {
    const node = nodes.find((n) => n.id === id);
    if (!node) return;
    const newNode = {
      ...node,
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      position: { x: node.position.x + 50, y: node.position.y + 50 },
      data: { ...node.data },
    };
    addNode(newNode);
    setShowMenu(false);
  };

  return (
    <div className={`workflow-node end-node ${selected ? 'selected' : ''} ${isSimulating ? 'simulating' : ''} pill-style`}>
      {isSimulating && <div className="node-status-dot active" />}
      <div className="node-header">
        <div className="node-icon">
          <Square />
        </div>
        <span className="node-title">{nodeData.endMessage || 'End'}</span>
        <span className="node-type-label">End</span>
        <div style={{ position: 'relative' }}>
          <button className="node-menu-btn" title="Options" onClick={() => setShowMenu(!showMenu)}>
            <MoreHorizontal size={14} />
          </button>
          {showMenu && (
            <div className="node-menu-dropdown">
              <button className="node-menu-item" onClick={handleDuplicate}>
                <Copy size={12} /> Duplicate
              </button>
              <button className="node-menu-item danger" onClick={handleDelete}>
                <Trash2 size={12} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="node-body">
        {nodeData.endMessage && (
          <div className="node-detail">
            <MessageSquare />
            <span className="node-detail-value">{nodeData.endMessage}</span>
          </div>
        )}
        {nodeData.summaryFlag && (
          <div className="node-detail">
            <span className="node-detail-value">📊 Summary enabled</span>
          </div>
        )}
        {!nodeData.endMessage && (
          <div className="node-detail">
            <span className="node-detail-value" style={{ opacity: 0.5 }}>Workflow completion</span>
          </div>
        )}
      </div>
      <NodeMetrics 
        executions={nodeData.metrics?.executions}
        errors={nodeData.metrics?.errors}
        successes={nodeData.metrics?.successes}
        durationAvg={nodeData.metrics?.durationAvg}
      />
      <Handle type="target" position={Position.Top} />
    </div>
  );
};

export default memo(EndNode);
