import React, { memo, useState } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Play, FileText, MoreHorizontal, Copy, Trash2 } from 'lucide-react';
import type { StartNodeData } from '../../types/workflow';
import useWorkflowStore from '../../store/workflowStore';
import NodeMetrics from './NodeMetrics';
import './nodes.css';

const StartNode: React.FC<NodeProps> = ({ data, id, selected }) => {
  const [showMenu, setShowMenu] = useState(false);
  const activeSimNodeId = useWorkflowStore((s) => s.activeSimNodeId);
  const deleteNode = useWorkflowStore((s) => s.deleteNode);
  const nodes = useWorkflowStore((s) => s.nodes);
  const addNode = useWorkflowStore((s) => s.addNode);
  const nodeData = data as unknown as StartNodeData;
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

  const metaCount = Object.keys(nodeData.metadata || {}).length;

  return (
    <div className={`workflow-node start-node ${selected ? 'selected' : ''} ${isSimulating ? 'simulating' : ''} pill-style`}>
      {isSimulating && <div className="node-status-dot active" />}
      <div className="node-header">
        <div className="node-icon">
          <Play />
        </div>
        <span className="node-title">{nodeData.title || 'Start'}</span>
        <span className="node-type-label">Start</span>
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
        {metaCount > 0 && (
          <div className="node-detail">
            <FileText />
            <span className="node-detail-value">{metaCount} metadata field{metaCount !== 1 ? 's' : ''}</span>
          </div>
        )}
        {metaCount === 0 && (
          <div className="node-detail">
            <span className="node-detail-value" style={{ opacity: 0.5 }}>Workflow entry point</span>
          </div>
        )}
      </div>
      <NodeMetrics 
        executions={nodeData.metrics?.executions}
        errors={nodeData.metrics?.errors}
        successes={nodeData.metrics?.successes}
        durationAvg={nodeData.metrics?.durationAvg}
      />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(StartNode);
