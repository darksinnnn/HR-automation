import React, { memo, useState } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ClipboardList, User, Calendar, MoreHorizontal, Copy, Trash2 } from 'lucide-react';
import type { TaskNodeData } from '../../types/workflow';
import useWorkflowStore from '../../store/workflowStore';
import NodeMetrics from './NodeMetrics';
import './nodes.css';

const TaskNode: React.FC<NodeProps> = ({ data, id, selected }) => {
  const [showMenu, setShowMenu] = useState(false);
  const activeSimNodeId = useWorkflowStore((s) => s.activeSimNodeId);
  const deleteNode = useWorkflowStore((s) => s.deleteNode);
  const nodes = useWorkflowStore((s) => s.nodes);
  const addNode = useWorkflowStore((s) => s.addNode);
  const nodeData = data as unknown as TaskNodeData;
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
    <div className={`workflow-node task-node ${selected ? 'selected' : ''} ${isSimulating ? 'simulating' : ''}`}>
      {isSimulating && <div className="node-status-dot active" />}
      <div className="node-header">
        <div className="node-icon">
          <ClipboardList />
        </div>
        <span className="node-title">{nodeData.title || 'Task'}</span>
        <span className="node-type-label">Task</span>
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
      <NodeMetrics 
        executions={nodeData.metrics?.executions}
        errors={nodeData.metrics?.errors}
        successes={nodeData.metrics?.successes}
        durationAvg={nodeData.metrics?.durationAvg}
      />
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(TaskNode);
