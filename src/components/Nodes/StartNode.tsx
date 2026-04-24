import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Play, FileText } from 'lucide-react';
import type { StartNodeData } from '../../types/workflow';
import useWorkflowStore from '../../store/workflowStore';
import './nodes.css';

const StartNode: React.FC<NodeProps> = ({ data, id, selected }) => {
  const activeSimNodeId = useWorkflowStore((s) => s.activeSimNodeId);
  const nodeData = data as unknown as StartNodeData;
  const isSimulating = activeSimNodeId === id;

  const metaCount = Object.keys(nodeData.metadata || {}).length;

  return (
    <div className={`workflow-node start-node ${selected ? 'selected' : ''} ${isSimulating ? 'simulating' : ''}`}>
      {isSimulating && <div className="node-status-dot active" />}
      <div className="node-header">
        <div className="node-icon">
          <Play />
        </div>
        <span className="node-title">{nodeData.title || 'Start'}</span>
        <span className="node-type-label">Start</span>
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
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(StartNode);
