import React, { useRef } from 'react';
import {
  Workflow,
  Sun,
  Moon,
  Play,
  Trash2,
  Download,
  Upload,
  GitBranch,
  Box,
  Undo2,
  Redo2,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import useWorkflowStore from '../../store/workflowStore';
import { simulateWorkflow } from '../../api/mockApi';
import './Header.css';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const clearCanvas = useWorkflowStore((s) => s.clearCanvas);
  const setSimulationResult = useWorkflowStore((s) => s.setSimulationResult);
  const setSimulationRunning = useWorkflowStore((s) => s.setSimulationRunning);
  const setActiveSimNodeId = useWorkflowStore((s) => s.setActiveSimNodeId);
  const simulationRunning = useWorkflowStore((s) => s.simulationRunning);
  const exportWorkflow = useWorkflowStore((s) => s.exportWorkflow);
  const importWorkflow = useWorkflowStore((s) => s.importWorkflow);
  const undo = useWorkflowStore((s) => s.undo);
  const redo = useWorkflowStore((s) => s.redo);
  const past = useWorkflowStore((s) => s.past);
  const future = useWorkflowStore((s) => s.future);
  const updateNodeMetrics = useWorkflowStore((s) => s.updateNodeMetrics);

  const handleSimulate = async () => {
    if (simulationRunning || nodes.length === 0) return;

    setSimulationRunning(true);
    setSimulationResult(null);
    setActiveSimNodeId(null);

    const result = await simulateWorkflow(nodes, edges);
    setSimulationResult(result);

    if (result.valid && result.steps.length > 0) {
      for (let i = 0; i < result.steps.length; i++) {
        const step = result.steps[i];
        setActiveSimNodeId(step.nodeId);
        
        // Update executions immediately
        updateNodeMetrics(step.nodeId, { executions: 1 });

        const startTime = Date.now();
        await new Promise((r) => setTimeout(r, 1200)); // Simulate async work
        const duration = Date.now() - startTime;

        // Apply error or success based on the simulated step status
        if (step.status === 'error') {
          updateNodeMetrics(step.nodeId, { errors: 1, durationAvg: duration });
        } else if (step.status === 'completed') {
          updateNodeMetrics(step.nodeId, { successes: 1, durationAvg: duration });
        }
      }
      setActiveSimNodeId(null);
    }

    setSimulationRunning(false);
  };

  const handleExport = () => {
    const json = exportWorkflow();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      importWorkflow(text);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo">
          <div className="header-logo-icon">
            <Workflow />
          </div>
          <span className="header-logo-text">WorkflowPro</span>
          <span className="header-logo-sub">HR Designer</span>
        </div>

        <div className="header-divider" />

        <div className="header-stats">
          <div className="header-stat">
            <Box size={12} />
            Nodes <span className="header-stat-value">{nodes.length}</span>
          </div>
          <div className="header-stat">
            <GitBranch size={12} />
            Edges <span className="header-stat-value">{edges.length}</span>
          </div>
        </div>
      </div>

      <div className="header-center">
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="header-btn"
            onClick={undo}
            disabled={past.length === 0}
            title="Undo"
          >
            <Undo2 size={14} />
          </button>
          <button
            className="header-btn"
            onClick={redo}
            disabled={future.length === 0}
            title="Redo"
          >
            <Redo2 size={14} />
          </button>
        </div>

        <div className="header-divider" />

        <button
          className="header-btn primary"
          onClick={handleSimulate}
          disabled={simulationRunning || nodes.length === 0}
          id="simulate-btn"
        >
          <Play />
          {simulationRunning ? 'Simulating…' : 'Simulate'}
        </button>
      </div>

      <div className="header-right">
        <button className="header-btn" onClick={handleExport} id="export-btn">
          <Download />
          Export
        </button>
        <button className="header-btn" onClick={handleImport} id="import-btn">
          <Upload />
          Import
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".json"
          onChange={handleFileChange}
        />
        <div className="header-divider" />
        <button className="header-btn danger" onClick={clearCanvas} id="clear-btn">
          <Trash2 />
          Clear
        </button>
        <div className="header-divider" />
        <button className="theme-toggle" onClick={toggleTheme} id="theme-toggle-btn">
          {theme === 'dark' ? <Sun /> : <Moon />}
        </button>
      </div>
    </header>
  );
};

export default Header;
