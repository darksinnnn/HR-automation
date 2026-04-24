import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Square, MessageSquare } from 'lucide-react';
import type { EndNodeData } from '../../types/workflow';
import useWorkflowStore from '../../store/workflowStore';
import './nodes.css';

const EndNode: React.FC<NodeProps> = ({ data, id, selected }) => {
  const activeSimNodeId = useWorkflowStore((s) => s.activeSimNodeId);
  const nodeData = data as unknown as EndNodeData;
  const isSimulating = activeSimNodeId === id;

  return (
    <div className={`workflow-node end-node ${selected ? 'selected' : ''} ${isSimulating ? 'simulating' : ''}`}>
      {isSimulating && <div className="node-status-dot active" />}
      <div className="node-header">
        <div className="node-icon">
          <Square />
        </div>
        <span className="node-title">{nodeData.endMessage || 'End'}</span>
        <span className="node-type-label">End</span>
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
      <Handle type="target" position={Position.Top} />
    </div>
  );
};

export default memo(EndNode);
