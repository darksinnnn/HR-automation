import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ClipboardList, User, Calendar } from 'lucide-react';
import type { TaskNodeData } from '../../types/workflow';
import useWorkflowStore from '../../store/workflowStore';
import './nodes.css';

const TaskNode: React.FC<NodeProps> = ({ data, id, selected }) => {
  const activeSimNodeId = useWorkflowStore((s) => s.activeSimNodeId);
  const nodeData = data as unknown as TaskNodeData;
  const isSimulating = activeSimNodeId === id;

  return (
    <div className={`workflow-node task-node ${selected ? 'selected' : ''} ${isSimulating ? 'simulating' : ''}`}>
      {isSimulating && <div className="node-status-dot active" />}
      <div className="node-header">
        <div className="node-icon">
          <ClipboardList />
        </div>
        <span className="node-title">{nodeData.title || 'Task'}</span>
        <span className="node-type-label">Task</span>
      </div>
      <div className="node-body">
        {nodeData.description && (
          <div className="node-detail">
            <span className="node-detail-value" style={{ fontStyle: 'italic' }}>
              {nodeData.description.length > 40 ? nodeData.description.substring(0, 40) + '…' : nodeData.description}
            </span>
          </div>
        )}
        {nodeData.assignee && (
          <div className="node-detail">
            <User />
            <span className="node-detail-value">{nodeData.assignee}</span>
          </div>
        )}
        {nodeData.dueDate && (
          <div className="node-detail">
            <Calendar />
            <span className="node-detail-value">{nodeData.dueDate}</span>
          </div>
        )}
        {!nodeData.description && !nodeData.assignee && (
          <div className="node-detail">
            <span className="node-detail-value" style={{ opacity: 0.5 }}>Human task step</span>
          </div>
        )}
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(TaskNode);
