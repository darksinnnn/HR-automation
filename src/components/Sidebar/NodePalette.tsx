import React from 'react';
import { Play, ClipboardList, ShieldCheck, Zap, Mail, GitFork, Square } from 'lucide-react';
import { NodeType } from '../../types/workflow';
import './NodePalette.css';

const NODE_ITEMS = [
  {
    type: NodeType.Start,
    label: 'Start Node',
    description: 'Workflow entry point',
    icon: Play,
    className: 'start',
  },
  {
    type: NodeType.Task,
    label: 'Task Node',
    description: 'Human task step',
    icon: ClipboardList,
    className: 'task',
  },
  {
    type: NodeType.Approval,
    label: 'Approval Node',
    description: 'Manager/HR approval',
    icon: ShieldCheck,
    className: 'approval',
  },
  {
    type: NodeType.Automated,
    label: 'Automated Step',
    description: 'System-triggered action',
    icon: Zap,
    className: 'automated',
  },
  {
    type: NodeType.Email,
    label: 'Email Node',
    description: 'Send automated email',
    icon: Mail,
    className: 'email',
  },
  {
    type: NodeType.Condition,
    label: 'Condition Node',
    description: 'Branching logic',
    icon: GitFork,
    className: 'condition',
  },
  {
    type: NodeType.End,
    label: 'End Node',
    description: 'Workflow completion',
    icon: Square,
    className: 'end',
  },
];

const NodePalette: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="node-palette" id="node-palette">
      <div className="palette-header">Node Types</div>
      <div className="palette-section">
        {NODE_ITEMS.map((item) => (
          <div
            key={item.type}
            className={`palette-node ${item.className}`}
            draggable
            onDragStart={(e) => onDragStart(e, item.type)}
            id={`palette-${item.className}`}
          >
            <div className="palette-node-icon">
              <item.icon />
            </div>
            <div className="palette-node-info">
              <span className="palette-node-name">{item.label}</span>
              <span className="palette-node-desc">{item.description}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="palette-hint">
        Drag nodes onto the canvas to build your workflow.
        Press <kbd>Delete</kbd> to remove selected elements.
      </div>
    </aside>
  );
};

export default NodePalette;
