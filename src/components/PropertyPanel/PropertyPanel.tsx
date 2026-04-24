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
  GitBranch,
  BarChart2,
  Search,
  Mail,
  GitFork,
} from 'lucide-react';
import useWorkflowStore from '../../store/workflowStore';
import { NodeType } from '../../types/workflow';
import StartForm from './StartForm';
import TaskForm from './TaskForm';
import ApprovalForm from './ApprovalForm';
import AutomatedForm from './AutomatedForm';
import EmailForm from './EmailForm';
import ConditionForm from './ConditionForm';
import EndForm from './EndForm';
import EdgeForm from './EdgeForm';
import './PropertyPanel.css';

const nodeConfig: Record<string, { icon: React.FC<any>; color: string; label: string }> = {
  [NodeType.Start]: { icon: Play, color: 'var(--node-start-accent)', label: 'Start Node' },
  [NodeType.Task]: { icon: ClipboardList, color: 'var(--node-task-accent)', label: 'Task Node' },
  [NodeType.Approval]: { icon: ShieldCheck, color: 'var(--node-approval-accent)', label: 'Approval Node' },
  [NodeType.Automated]: { icon: Zap, color: 'var(--node-automated-accent)', label: 'Automated Step' },
  [NodeType.Email]: { icon: Mail, color: 'var(--node-email-accent)', label: 'Email Node' },
  [NodeType.Condition]: { icon: GitFork, color: 'var(--node-condition-accent)', label: 'Condition Node' },
  [NodeType.End]: { icon: Square, color: 'var(--node-end-accent)', label: 'End Node' },
};

const PropertyPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'properties' | 'performance' | 'sandbox'>('properties');

  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const selectedEdgeId = useWorkflowStore((s) => s.selectedEdgeId);
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const deleteNode = useWorkflowStore((s) => s.deleteNode);
  const deleteEdge = useWorkflowStore((s) => s.deleteEdge);
  const simulationResult = useWorkflowStore((s) => s.simulationResult);
  const simulationRunning = useWorkflowStore((s) => s.simulationRunning);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const config = selectedNode ? nodeConfig[selectedNode.type || ''] : null;

  const renderForm = () => {
    if (selectedEdgeId) {
      return <EdgeForm edgeId={selectedEdgeId} />;
    }

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
      case NodeType.Email:
        return <EmailForm nodeId={selectedNode.id} data={selectedNode.data as any} />;
      case NodeType.Condition:
        return <ConditionForm nodeId={selectedNode.id} data={selectedNode.data as any} />;
      case NodeType.End:
        return <EndForm nodeId={selectedNode.id} data={selectedNode.data as any} />;
      default:
        return null;
    }
  };

  const renderPerformance = () => {
    if (!selectedNode) {
      return (
        <div className="panel-body">
          <div className="panel-empty">
            <div className="panel-empty-icon">
              <BarChart2 />
            </div>
            <div className="panel-empty-title">No Node Selected</div>
            <div className="panel-empty-desc">
              Select a node to view its performance metrics.
            </div>
          </div>
        </div>
      );
    }

    const metrics = (selectedNode.data as any)?.metrics || { executions: 0, errors: 0, successes: 0, durationAvg: 0 };
    const successRate = metrics.executions > 0 ? Math.round((metrics.successes / metrics.executions) * 100) : 0;

    return (
      <div className="panel-body" style={{ gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>Executions</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>{metrics.executions}</div>
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>Success Rate</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--status-success)' }}>{successRate}%</div>
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>Errors</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--status-error)' }}>{metrics.errors}</div>
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>Avg Duration</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--status-info)' }}>{metrics.durationAvg}ms</div>
          </div>
        </div>

        {metrics.executions > 0 && (
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px' }}>Status Distribution</div>
            <div style={{ height: '6px', background: 'var(--border-default)', borderRadius: '3px', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: `${successRate}%`, background: 'var(--status-success)' }}></div>
              <div style={{ width: `${metrics.errors > 0 ? (metrics.errors / metrics.executions) * 100 : 0}%`, background: 'var(--status-error)' }}></div>
              <div style={{ flex: 1, background: 'var(--border-default)' }}></div>
            </div>
          </div>
        )}
      </div>
    );
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
          Props
        </button>
        <button
          className={`panel-tab ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
          id="tab-performance"
        >
          <BarChart2 size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
          Perform
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
        selectedEdgeId ? (
          <>
            <div className="panel-header">
              <div className="panel-header-left">
                <div className="panel-header-icon" style={{ background: 'var(--status-info)' }}>
                  <GitBranch />
                </div>
                <div>
                  <div className="panel-header-title">Connection Arc</div>
                  <div className="panel-header-type">Edge properties</div>
                </div>
              </div>
              <button
                className="panel-delete-btn"
                onClick={() => deleteEdge(selectedEdgeId)}
                title="Delete arc"
              >
                <Trash2 />
              </button>
            </div>
            {renderForm()}
          </>
        ) : selectedNode && config ? (
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
              Click on a node or arc in the canvas to view and edit its properties.
            </div>
          </div>
        )
      ) : activeTab === 'performance' ? (
        renderPerformance()
      ) : (
        renderSimulation()
      )}
    </aside>
  );
};

export default PropertyPanel;
