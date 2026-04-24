import React from 'react';
import useWorkflowStore from '../../store/workflowStore';

interface Props {
  edgeId: string;
}

const EdgeForm: React.FC<Props> = ({ edgeId }) => {
  const edges = useWorkflowStore((s) => s.edges);
  const updateEdgeData = useWorkflowStore((s) => s.updateEdgeData);

  const edge = edges.find((e) => e.id === edgeId);
  if (!edge) return null;

  return (
    <div className="panel-body">
      <div className="form-group">
        <label className="form-label">Edge Label</label>
        <input
          className="form-input"
          type="text"
          value={(edge.label as string) || ''}
          onChange={(e) => updateEdgeData(edgeId, e.target.value)}
          placeholder="e.g., Conditions Met"
          id="edge-label-input"
        />
        <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
          This text will appear on the connection arrow.
        </span>
      </div>
    </div>
  );
};

export default EdgeForm;
