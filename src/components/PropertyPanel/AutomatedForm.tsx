import React, { useEffect, useState } from 'react';
import useWorkflowStore from '../../store/workflowStore';
import type { AutomatedNodeData, AutomatedAction } from '../../types/workflow';
import { fetchAutomations } from '../../api/mockApi';

interface Props {
  nodeId: string;
  data: AutomatedNodeData;
}

const AutomatedForm: React.FC<Props> = ({ nodeId, data }) => {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const [actions, setActions] = useState<AutomatedAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAutomations().then((result) => {
      setActions(result);
      setLoading(false);
    });
  }, []);

  const handleChange = (field: string, value: any) => {
    updateNodeData(nodeId, { [field]: value });
  };

  const handleActionChange = (actionId: string) => {
    handleChange('actionId', actionId);
    // Reset params when action changes
    const action = actions.find((a) => a.id === actionId);
    if (action) {
      const params: Record<string, string> = {};
      action.params.forEach((p) => {
        params[p] = data.actionParams?.[p] || '';
      });
      handleChange('actionParams', params);
    } else {
      handleChange('actionParams', {});
    }
  };

  const handleParamChange = (paramKey: string, value: string) => {
    const params = { ...(data.actionParams || {}) };
    params[paramKey] = value;
    handleChange('actionParams', params);
  };

  const selectedAction = actions.find((a) => a.id === data.actionId);

  return (
    <div className="panel-body">
      <div className="form-group">
        <label className="form-label">Title</label>
        <input
          className="form-input"
          type="text"
          value={data.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g., Send Welcome Email"
          id="auto-title-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Automated Action</label>
        {loading ? (
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', padding: '8px 0' }}>
            Loading actions...
          </div>
        ) : (
          <select
            className="form-select"
            value={data.actionId || ''}
            onChange={(e) => handleActionChange(e.target.value)}
            id="auto-action-select"
          >
            <option value="">Select an action...</option>
            {actions.map((action) => (
              <option key={action.id} value={action.id}>
                {action.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedAction && selectedAction.params.length > 0 && (
        <div className="form-group">
          <label className="form-label">Action Parameters</label>
          {selectedAction.params.map((param) => (
            <div key={param} style={{ marginBottom: '8px' }}>
              <label
                className="form-label"
                style={{ fontSize: '10px', marginBottom: '3px', textTransform: 'capitalize' }}
              >
                {param}
              </label>
              <input
                className="form-input"
                type="text"
                value={data.actionParams?.[param] || ''}
                onChange={(e) => handleParamChange(param, e.target.value)}
                placeholder={`Enter ${param}...`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutomatedForm;
