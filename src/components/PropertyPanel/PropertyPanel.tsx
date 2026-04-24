import React, { useState } from 'react';
import {
  Settings,
  Trash2,
  Play,
  ClipboardList,
  ShieldCheck,
  Zap,
  Square,
  MousePointerClick,
  Check,
  Loader,
  AlertTriangle,
  FlaskConical,
} from 'lucide-react';
import useWorkflowStore from '../../store/workflowStore';
import { NodeType } from '../../types/workflow';
import StartForm from './StartForm';
import TaskForm from './TaskForm';
import ApprovalForm from './ApprovalForm';
import AutomatedForm from './AutomatedForm';
import EndForm from './EndForm';
import './PropertyPanel.css';

const nodeConfig: Record<string, { icon: React.FC<any>; color: string; label: string }> = {
  [NodeType.Start]: { icon: Play, color: 'var(--node-start-accent)', label: 'Start Node' },
  [NodeType.Task]: { icon: ClipboardList, color: 'var(--node-task-accent)', label: 'Task Node' },
  [NodeType.Approval]: { icon: ShieldCheck, color: 'var(--node-approval-accent)', label: 'Approval Node' },
  [NodeType.Automated]: { icon: Zap, color: 'var(--node-automated-accent)', label: 'Automated Step' },
  [NodeType.End]: { icon: Square, color: 'var(--node-end-accent)', label: 'End Node' },
};

const PropertyPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'properties' | 'sandbox'>('properties');

  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const nodes = useWorkflowStore((s) => s.nodes);
  const deleteNode = useWorkflowStore((s) => s.deleteNode);
  const simulationResult = useWorkflowStore((s) => s.simulationResult);
  const simulationRunning = useWorkflowStore((s) => s.simulationRunning);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const config = selectedNode ? nodeConfig[selectedNode.type || ''] : null;

  const renderForm = () => {
    if (!selectedNode) return null;

    switch (selectedNode.type) {
      case NodeType.Start:
        return <StartForm nodeId={selectedNode.id} data={selectedNode.data as any} />;
      case NodeType.Task:
        return <TaskForm nodeId={selectedNode.id} data={selectedNode.data as any} />;
      case NodeType.Approval:
        return <ApprovalForm nodeId={selectedNode.id} data={selectedNode.data as any} />;
      case NodeType.Automated:
        return <AutomatedForm nodeId={selectedNode.id} data={selectedNode.data as any} />;
      case NodeType.End:
        return <EndForm nodeId={selectedNode.id} data={selectedNode.data as any} />;
      default:
        return null;
    }
  };

  const renderSimulation = () => {
    if (simulationRunning) {
      return (
        <div className="panel-body">
          <div className="panel-empty">
            <div className="panel-empty-icon" style={{ animation: 'spin 1.5s linear infinite' }}>
              <Loader />
            </div>
            <div className="panel-empty-title">Simulating...</div>
            <div className="panel-empty-desc">
              Watch the canvas as nodes light up during step-by-step execution.
            </div>
          </div>
        </div>
      );
    }

    if (!simulationResult) {
      return (
        <div className="panel-body">
          <div className="panel-empty">
            <div className="panel-empty-icon">
              <FlaskConical />
            </div>
            <div className="panel-empty-title">Sandbox</div>
            <div className="panel-empty-desc">
              Click "Simulate" in the header to test your workflow. Results will appear here.
            </div>
          </div>
        </div>
      );
    }

    if (!simulationResult.valid) {
      return (
        <div className="panel-body">
          <div className="sim-section" style={{ borderTop: 'none', marginTop: 0, paddingTop: 0 }}>
            <div className="sim-title">Validation Errors</div>
            <div className="sim-errors">
              {simulationResult.errors.map((err, i) => (
                <div className="sim-error" key={i}>
                  <AlertTriangle />
                  <span className="sim-error-text">{err}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="panel-body">
        <div className="sim-section" style={{ borderTop: 'none', marginTop: 0, paddingTop: 0 }}>
          <div className="sim-title">Execution Timeline</div>
          {simulationResult.steps.map((step, i) => (
            <div className="sim-step" key={i}>
              <div className={`sim-step-dot ${step.status}`}>
                {step.status === 'completed' && <Check />}
                {step.status === 'running' && <Loader />}
                {step.status === 'error' && <AlertTriangle />}
              </div>
              <div className="sim-step-content">
                <span className="sim-step-label">
                  {i + 1}. {step.label}
                </span>
                <span className="sim-step-msg">{step.message}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <aside className="property-panel" id="property-panel">
      <div className="panel-tabs">
        <button
          className={`panel-tab ${activeTab === 'properties' ? 'active' : ''}`}
          onClick={() => setActiveTab('properties')}
          id="tab-properties"
        >
          <Settings size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
          Properties
        </button>
        <button
          className={`panel-tab ${activeTab === 'sandbox' ? 'active' : ''}`}
          onClick={() => setActiveTab('sandbox')}
          id="tab-sandbox"
        >
          <FlaskConical size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
          Sandbox
        </button>
      </div>

      {activeTab === 'properties' ? (
        selectedNode && config ? (
          <>
            <div className="panel-header">
              <div className="panel-header-left">
                <div className="panel-header-icon" style={{ background: config.color }}>
                  <config.icon />
                </div>
                <div>
                  <div className="panel-header-title">{(selectedNode.data as any).title || config.label}</div>
                  <div className="panel-header-type">{config.label}</div>
                </div>
              </div>
              <button
                className="panel-delete-btn"
                onClick={() => deleteNode(selectedNode.id)}
                title="Delete node"
                id="delete-node-btn"
              >
                <Trash2 />
              </button>
            </div>
            {renderForm()}
          </>
        ) : (
          <div className="panel-empty">
            <div className="panel-empty-icon">
              <MousePointerClick />
            </div>
            <div className="panel-empty-title">No Selection</div>
            <div className="panel-empty-desc">
              Click on a node in the canvas to view and edit its properties.
            </div>
          </div>
        )
      ) : (
        renderSimulation()
      )}
    </aside>
  );
};

export default PropertyPanel;
