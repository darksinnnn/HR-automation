import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Zap, Settings } from 'lucide-react';
import type { AutomatedNodeData } from '../../types/workflow';
import useWorkflowStore from '../../store/workflowStore';
import './nodes.css';

const AutomatedNode: React.FC<NodeProps> = ({ data, id, selected }) => {
  const activeSimNodeId = useWorkflowStore((s) => s.activeSimNodeId);
  const nodeData = data as unknown as AutomatedNodeData;
  const isSimulating = activeSimNodeId === id;

  const paramCount = Object.keys(nodeData.actionParams || {}).length;

  return (
    <div className={`workflow-node automated-node ${selected ? 'selected' : ''} ${isSimulating ? 'simulating' : ''}`}>
      {isSimulating && <div className="node-status-dot active" />}
      <div className="node-header">
        <div className="node-icon">
          <Zap />
        </div>
        <span className="node-title">{nodeData.title || 'Automated Step'}</span>
        <span className="node-type-label">Auto</span>
      </div>
      <div className="node-body">
        {nodeData.actionId && (
          <div className="node-detail">
            <Settings />
            <span className="node-detail-value">{nodeData.actionId}</span>
          </div>
        )}
        {paramCount > 0 && (
          <div className="node-detail">
            <span className="node-detail-value">{paramCount} parameter{paramCount !== 1 ? 's' : ''} configured</span>
          </div>
        )}
        {!nodeData.actionId && (
          <div className="node-detail">
            <span className="node-detail-value" style={{ opacity: 0.5 }}>System automated action</span>
          </div>
        )}
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(AutomatedNode);
