import React from 'react';
import { Eye, Wrench, CheckCircle2, Zap } from 'lucide-react';
import './nodes.css';

interface NodeMetricsProps {
  executions?: number;
  errors?: number;
  successes?: number;
  durationAvg?: number;
}

const NodeMetrics: React.FC<NodeMetricsProps> = ({ 
  executions = 0, 
  errors = 0, 
  successes = 0, 
  durationAvg = 0 
}) => {
  return (
    <div className="node-metrics">
      <div className="node-metric-badge metric-neutral" title="Total Executions">
        <Eye />
        <span>{executions}</span>
      </div>
      <div className="node-metric-badge metric-error" title="Errors">
        <Wrench />
        <span>{errors}</span>
      </div>
      <div className="node-metric-badge metric-success" title="Successes">
        <CheckCircle2 />
        <span>{successes}</span>
      </div>
      <div className="node-metric-badge metric-purple" title="Total Runtime (ms)">
        <Zap />
        <span>{durationAvg}ms</span>
      </div>
    </div>
  );
};

export default NodeMetrics;
