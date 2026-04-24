import React from 'react';
import { Plus, X } from 'lucide-react';
import useWorkflowStore from '../../store/workflowStore';
import type { StartNodeData } from '../../types/workflow';

interface Props {
  nodeId: string;
  data: StartNodeData;
}

const StartForm: React.FC<Props> = ({ nodeId, data }) => {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const handleChange = (field: string, value: any) => {
    updateNodeData(nodeId, { [field]: value });
  };

  const handleMetaAdd = () => {
    const meta = { ...(data.metadata || {}) };
    const key = `key_${Object.keys(meta).length + 1}`;
    meta[key] = '';
    handleChange('metadata', meta);
  };

  const handleMetaChange = (oldKey: string, newKey: string, value: string) => {
    const meta = { ...(data.metadata || {}) };
    if (oldKey !== newKey) {
      delete meta[oldKey];
    }
    meta[newKey] = value;
    handleChange('metadata', meta);
  };

  const handleMetaRemove = (key: string) => {
    const meta = { ...(data.metadata || {}) };
    delete meta[key];
    handleChange('metadata', meta);
  };

  return (
    <div className="panel-body">
      <div className="form-group">
        <label className="form-label">Start Title</label>
        <input
          className="form-input"
          type="text"
          value={data.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g., Onboarding Process"
          id="start-title-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Metadata (Key-Value)</label>
        <div className="kv-editor">
          {Object.entries(data.metadata || {}).map(([key, value]) => (
            <div className="kv-row" key={key}>
              <input
                className="form-input"
                placeholder="Key"
                value={key}
                onChange={(e) => handleMetaChange(key, e.target.value, value)}
              />
              <input
                className="form-input"
                placeholder="Value"
                value={value}
                onChange={(e) => handleMetaChange(key, key, e.target.value)}
              />
              <button className="kv-remove-btn" onClick={() => handleMetaRemove(key)}>
                <X />
              </button>
            </div>
          ))}
          <button className="kv-add-btn" onClick={handleMetaAdd}>
            <Plus /> Add Metadata
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartForm;
