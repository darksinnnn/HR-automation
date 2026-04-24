import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ShieldCheck, UserCheck, Hash } from 'lucide-react';
import type { ApprovalNodeData } from '../../types/workflow';
import useWorkflowStore from '../../store/workflowStore';
import './nodes.css';

const ApprovalNode: React.FC<NodeProps> = ({ data, id, selected }) => {
  const activeSimNodeId = useWorkflowStore((s) => s.activeSimNodeId);
  const nodeData = data as unknown as ApprovalNodeData;
  const isSimulating = activeSimNodeId === id;

  return (
    <div className={`workflow-node approval-node ${selected ? 'selected' : ''} ${isSimulating ? 'simulating' : ''}`}>
      {isSimulating && <div className="node-status-dot active" />}
      <div className="node-header">
        <div className="node-icon">
          <ShieldCheck />
        </div>
        <span className="node-title">{nodeData.title || 'Approval'}</span>
        <span className="node-type-label">Approval</span>
      </div>
      <div className="node-body">
        {nodeData.approverRole && (
          <div className="node-detail">
            <UserCheck />
            <span className="node-detail-value">{nodeData.approverRole}</span>
          </div>
        )}
        {nodeData.autoApproveThreshold > 0 && (
          <div className="node-detail">
            <Hash />
            <span className="node-detail-value">Auto-approve ≤ {nodeData.autoApproveThreshold}</span>
          </div>
        )}
        {!nodeData.approverRole && (
          <div className="node-detail">
            <span className="node-detail-value" style={{ opacity: 0.5 }}>Manager/HR approval step</span>
          </div>
        )}
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(ApprovalNode);
